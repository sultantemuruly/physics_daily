import NextAuth, { type DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// Extend the session type definition
declare module "next-auth" {
  interface Session {
    user: {
      id: number;
    } & DefaultSession["user"];
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      try {
        let existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email!))
          .then((res) => res[0]);

        if (!existingUser) {
          const insertResult = await db
            .insert(users)
            .values({
              name: user.name ?? "",
              email: user.email!,
            })
            .returning();

          existingUser = insertResult[0];
        }

        return true;
      } catch (error) {
        console.error("Error during signIn callback:", error);
        return false;
      }
    },

    // Add session callback to include user ID
    async session({ session }) {
      try {
        const userRecord = await db
          .select()
          .from(users)
          .where(eq(users.email, session.user.email!))
          .then((res) => res[0]);

        if (userRecord) {
          session.user.id = userRecord.id;
        }

        return session;
      } catch (error) {
        console.error("Error fetching user ID for session:", error);
        return session;
      }
    },

    // JWT callback is needed for the session callback to work
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };
