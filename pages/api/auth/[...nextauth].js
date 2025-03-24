import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "../../../utils/firebaseAdmin";
import bcrypt from "bcryptjs";

export default NextAuth({
  session: {
    strategy: "jwt", // Usamos JWT en lugar de sesiones en DB
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "tu@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        // Buscar usuario en Firestore
        const userQuery = await db.collection("users").where("email", "==", email).get();

        if (userQuery.empty) {
          throw new Error("Usuario no encontrado");
        }

        const userDoc = userQuery.docs[0];
        const user = userDoc.data();

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error("Contraseña incorrecta");
        }

        // Retornar los datos del usuario
        return { id: userDoc.id, email: user.email, username: user.username };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: "/archivo", // Página personalizada de inicio de sesión
  },
  secret: process.env.NEXTAUTH_SECRET, // Define un secreto en tu .env
});
