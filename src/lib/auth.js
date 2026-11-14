import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth/next";

export const authOptions = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.NODE_ENV === "development"
      ? [
          CredentialsProvider({
            id: "dev-login",
            name: "Lokale Test Simulatielogin (Alleen in Dev)",
            credentials: {
              email: { label: "E-mailadres", type: "email", placeholder: "alain@familie.be of heselmans@gmail.com" },
            },
            async authorize(credentials) {
              if (!credentials?.email) return null;
              const email = credentials.email.toLowerCase().trim();
              return {
                id: email,
                name: email.split("@")[0],
                email: email,
              };
            },
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) return false;
      const email = user.email.toLowerCase().trim();
      const adminEmails = (process.env.HEMS_ADMIN_EMAILS || "heselmans@gmail.com")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
      const tessenderloEmails = (process.env.HEMS_TESSENDERLO_EMAILS || "")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);

      // In production with defined lists: allow only admin or tessenderlo family
      if (adminEmails.length > 0 || tessenderloEmails.length > 0) {
        const allowed = adminEmails.includes(email) || tessenderloEmails.includes(email);
        return allowed;
      }
      return true;
    },
    async jwt({ token, user }) {
      const email = (user?.email || token?.email || "").toLowerCase().trim();
      const adminEmails = (process.env.HEMS_ADMIN_EMAILS || "heselmans@gmail.com")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
      const tessenderloEmails = (process.env.HEMS_TESSENDERLO_EMAILS || "")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);

      if (adminEmails.includes(email)) {
        token.role = "admin";
        token.allowedSites = ["kruisstraat", "bomma_tessenderlo"];
        token.roleLabel = "Beheerder (Alle Sites)";
      } else if (tessenderloEmails.length === 0 || tessenderloEmails.includes(email)) {
        // Least privilege: anyone not in admin is strictly scoped to Tessenderlo ONLY!
        token.role = "tessenderlo_family";
        token.allowedSites = ["bomma_tessenderlo"];
        token.roleLabel = "Familie Tessenderlo (Enkel Bomma)";
      } else {
        token.role = "unauthorized";
        token.allowedSites = [];
        token.roleLabel = "Geen toegang";
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role || "unauthorized";
        session.user.allowedSites = token.allowedSites || [];
        session.user.roleLabel = token.roleLabel || "Gebruiker";
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "hems-cfo-dashboard-secret-fallback-key-2026",
};

export function getServerAuthSession() {
  return getServerSession(authOptions);
}
