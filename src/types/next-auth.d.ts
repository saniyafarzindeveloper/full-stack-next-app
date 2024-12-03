//The next-auth.d.ts file is like a dictionary that teaches TypeScript how to understand the extra things you've added to NextAuth, so everything works smoothly without confusion.
//https://chatgpt.com/share/674ed4a8-263c-8010-80f4-18cae221c3f2

//.d.ts extension, which stands for declaration file

import "next-auth";
import { DefaultSession } from "next-auth";
declare module "next-auth" {
  interface User {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
    username?: string;
  }
  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessage?: boolean;
      username?: string;
    } & DefaultSession['user'] //default session will always comw with a key - user
  }
}

declare module 'next-auth/jwt'{
    interface JWT{
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
        username?: string;
    }
}