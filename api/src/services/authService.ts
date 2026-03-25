import { SignUpDto, SignInDto, AuthResponseDto } from "../dtos/authDto";
import User, { IUser } from "../models/User";
import AppError from "../utils/appError";
import { generateToken } from "../utils/jwt";
import { sendContactEmail, sendResetPasswordEmail } from "../utils/nodemailer";
import * as crypto from "crypto";
import bcrypt from "bcryptjs";
export class AuthService {
  async signUp(signUpDto: SignUpDto): Promise<AuthResponseDto> {
    const { email, password, fullName, role } = signUpDto;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError("User already exists",400);
    }

    const newUser = new User({
      email,
      password,
      fullName,
      role: role || "user",
    });

    await newUser.save();

    const token = generateToken(newUser._id.toString());
    return this.createAuthResponse(newUser, token);
  }

  async signIn(signInDto: SignInDto): Promise<AuthResponseDto> {
    const { email, password } = signInDto;

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError("Invalid password", 400);
    }

    const token = generateToken(user._id.toString());
    return this.createAuthResponse(user, token);
  }

  private createAuthResponse(user: IUser, token: string): AuthResponseDto {
    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      token,
    };
  }

    async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    // generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // hash token (security)
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendResetPasswordEmail(
      user.fullName,
      user.email,
      `Click here to reset your password: ${resetLink}`
    );

    return { message: "Reset link sent to email" };
  }



    async resetPassword(token: string, newPassword: string) {

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) throw new Error("reset link invalid or expired");


    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return { message: "Password reset successfully" };
  }

}


export default new AuthService();
