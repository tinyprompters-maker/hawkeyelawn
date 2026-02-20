import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const ALLOWED_EMAILS = [
  "chuckgptx@gmail.com",
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user.email && ALLOWED_EMAILS.includes(user.email)) {
        return true;
      }
      return false;
    },
  },
  pages: {
    error: "/auth/error",
  },
});
