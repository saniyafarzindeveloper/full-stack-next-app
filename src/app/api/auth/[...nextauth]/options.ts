// In NextAuth.js, an options file is like a settings list for your app's login system. It’s where you tell NextAuth things like:

// Who can log in (e.g., using Google, GitHub, or something else).
// Where to save login info (e.g., in a database or as a token).
// What happens during login (e.g., should we redirect users to a dashboard or a welcome page?).
// How to customize login screens (e.g., light or dark theme, custom URLs).
// Why do we need this file?
// Imagine you're setting up a new phone. The options file is like filling out the settings to connect to Wi-Fi, add your fingerprint, or choose a ringtone. It makes sure your app's login system works exactly how you want it.

// How it connects:
// The options file is used by NextAuth in the backend. When someone tries to log in, NextAuth reads this file to know:

// What login methods are allowed.
// How to save user sessions.
// Any special rules or customizations you've added.
// It’s just a way to organize all the login-related settings in one place!

import { NextAuthOptions } from "next-auth";
import { CredentialsProvider } from "next-auth/providers/credentials";
// When You Use Curly Braces { }:
// You’re importing a named export from a module.
// This means the thing you’re importing was explicitly named when it was exported from the file.
import bcrypt from "bcryptjs"; //coz pw is involved
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      //an object in itself that gives you access to many objects
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect(); //cross checking from the db
        //handling db response in try catch
        try {
          const user = await UserModel.findOne({
            //user can be found out either thru email or by username hence the db needs to scan both the cases
            $or: [
              //$or mongoose operator that skims thru all sets of arrays
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          //if not user exists
          if (!user) {
            throw new Error("No user found with the email/username");
          }

          //if user is not verified
          if (!user.isVerified) {
            throw new Error(
              "User not verified. Please verify your account first"
            );
          }
          //check for pw is user is found
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          ); //compare btw the passwords
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Password is incorrect!");
          }
        } catch (err: any) {
          throw new Error(err); //either return null or return an error
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user}) {
      //extracting data from users & ejecting it to token
      if(user){
        token._id = user._id?.toString(); //extracting the object & making it a string
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      if(token){
       session.user._id = token._id; 
       session.user.isVerified = token.isVerified;
       session.user.isAcceptingMessage = token.isAcceptingMessage;
       session.user.username = token.username
      }
      return session
    },
   
  },
  pages: {
    signIn: "/sign-in",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
