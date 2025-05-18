import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import { compare } from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials) {
        if (
          !credentials ||
          typeof credentials.email !== "string" ||
          typeof credentials.password !== "string"
        ) {
          return null;
        }
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.password) return null;
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;
        // Remove password before returning user object
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      // Attach user id and role to session
      if (token?.sub && session.user) (session.user as { id: string; role?: string }).id = token.sub;
      if (token?.role && session.user) (session.user as { id: string; role?: string }).role = token.role as string;
      return session;
    },
    async jwt({ token, user }) {
      if (user && "role" in user) {
        token.role = (user as { role?: string }).role || "USER";
      }
      return token;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/signin", // Error code passed in query string as ?error=
  },
  secret: process.env.AUTH_SECRET,
}) 