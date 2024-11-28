import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

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
      if(existingUserByEmail.isVerified){
        return Response.json({
          success: false,
          message: "User already exists with this email!"
        }, {status: 400})
      }else{
        const hashedPassword = await bcrypt.hash(password, 10)
        existingUserByEmail.password = hashedPassword; //overwriting the prev pw
        existingUserByEmail.verifyCode = verifyCode
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
        await existingUserByEmail.save();
      }
    } else {
      //if user is not registered
      const hashedPassword = await bcrypt.hash(password, 10); //10 rounds of hash
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1); //expiry code will be active for 1 hr from generation

      //saving user
     const newUser = new UserModel({
        username,
        email,
        verifyCode,
        password: hashedPassword,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
         messages: [],
      });
      await newUser.save();
    }

    //send verification email
    const emailResponse = await sendVerificationEmail(email, username, verifyCode);
    if(!emailResponse.success){
      return Response.json({
        success: false,
        message: emailResponse.message
      }, {status: 500})
    }

    return Response.json({
      success: true,
      message: "User registered successfully! Please verify your email."
    }, {status: 201})
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
