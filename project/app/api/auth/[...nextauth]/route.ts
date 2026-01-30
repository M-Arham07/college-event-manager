import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import connectDB from "@/lib/mongodb"
import AllowedUser from "@/lib/models/allowedUser"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/unauthorized",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) {
        return false
      }

      try {
        await connectDB()
        const allowedUser = await AllowedUser.findOne({
          email: user.email.toLowerCase(),
        })

        if (!allowedUser) {
          return "/auth/unauthorized"
        }

        return true
      } catch (error) {
        console.error("Error checking allowed users:", error)
        return false
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string
        session.user.name = token.name as string
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }
