// apps/frontend/pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        try {
          const res = await axios.post('http://localhost:3001/auth/login', {
            email: credentials.email,
            password: credentials.password,
          });
          // Expecting { access_token, user: { id, name, email } }
          const data = res.data;
          if (!data?.access_token || !data?.user) return null;
          // return object becomes part of token in callbacks
          return { accessToken: data.access_token, ...data.user };
        } catch (err) {
          console.error('Authorize error', err?.response?.data || err);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      // first sign in, user object present
      if (user) {
        token.accessToken = (user as any).accessToken || (user as any).accessToken;
        token.user = {
          id: (user as any).id,
          name: (user as any).name,
          email: (user as any).email,
        };
      }
      return token;
    },
    async session({ session, token }) {
      // attach token and user to session
      (session as any).accessToken = (token as any).accessToken;
      session.user = (token as any).user;
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'nextauthsecret',
});
