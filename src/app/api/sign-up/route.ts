import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import { trusted } from "mongoose";

//API
export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();
    //checking if the user is present along with registered
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedByUsername) {
      return Response.json({
        success: false,
        message: "Username is already taken!",
      });
    }

    //searching user by emails
    const existingUserByEmail = await UserModel.findOne({ email });
    //verify code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    //if user by email exists
    if (existingUserByEmail) {
      return true;
    } else {
      //if user is not registered
      const hashedPassword = await bcrypt.hash(password, 10); //10 rounds of hash
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1); //expiry code will be active for 1 hr from generation

      //saving user
      new UserModel({
        username,
        email,
        verifyCode,
        password: hashedPassword,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
         messages: [],
      });
    }
  } catch (error) {
    console.error("Error registering user!", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user!",
      },
      {
        status: 500,
      }
    );
  }
}
