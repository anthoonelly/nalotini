import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { sql, ensureDbReady } from "./db";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/logowanie",
  },
  providers: [
    CredentialsProvider({
      name: "Email i hasło",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Hasło", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await ensureDbReady();

        const email = credentials.email.toLowerCase().trim();
        const rows = await sql`
          SELECT id, email, password_hash, name, role, banned
          FROM users
          WHERE email = ${email}
        `;

        if (rows.length === 0) return null;
        const user = rows[0];
        if (user.banned) return null;

        const ok = await bcrypt.compare(credentials.password, user.password_hash);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
};
