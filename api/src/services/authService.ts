import { SignUpDto, SignInDto, AuthResponseDto } from "../dtos/authDto";
import User, { IUser } from "../models/User";
import AppError from "../utils/appError";
import { generateToken } from "../utils/jwt";

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
      throw new AppError("Invalid credentials", 400);
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
}

export default new AuthService();
