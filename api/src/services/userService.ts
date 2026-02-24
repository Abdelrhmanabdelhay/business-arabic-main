// src/services/userService.ts

import { PaymentResponseDto } from "../dtos/ideaClubDto";
import { CreateUserDto, UpdateUserDto, UserResponseDto, UserListResponseDto } from "../dtos/userDto";
import payment from "../models/payment";
import User, { IUser } from "../models/User";


export class UserService {
  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { email, password, fullName, role } = createUserDto;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const newUser = new User({
      email,
      password,
      fullName,
      role: role || "user",
    });

    await newUser.save();

    return this.createUserResponse(newUser);
  }

  async getUsers(page: number, limit: number, fullName?: string): Promise<UserListResponseDto> {
    const filter: any = {};

    // Apply case-insensitive full name search if provided
    if (fullName && fullName.trim() !== "") {
      filter.fullName = { $regex: new RegExp(fullName, "i") };
    }

    const total = await User.countDocuments(filter);

    const users = await User.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      users: users.map(this.createUserResponse),
      total,
      page,
      limit,
    };
  }

  async getProfile(id: string): Promise<UserResponseDto> {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return this.createUserResponse(user);
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    return this.createUserResponse(user);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await User.findByIdAndUpdate(id, updateUserDto, { new: true });
    if (!user) {
      throw new Error("User not found");
    }

    return this.createUserResponse(user);
  }

  async deleteUser(id: string): Promise<void> {
    const result = await User.findByIdAndDelete(id);
    if (!result) {
      throw new Error("User not found");
    }
  }

  private createUserResponse(user: IUser): UserResponseDto {
    return {
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
  async getAllPaymentsOfUser(userId: string, page: number, limit: number): Promise<PaymentResponseDto[]> {

    // user query limit and page makek it
    const payments = await payment.find({ userId})
      .skip((page - 1) * limit)
      .limit(limit);
    return payments.map((pay) => ({
      id: pay._id.toString(),
      userId: pay.userId.toString(),
      serviceId: pay.serviceId,
      payNumber: pay.payNumber,
      serviceType: pay.serviceType === "FeasibilityStudy" ? "Feasibility Study" : "Launched Project",
      amount: pay.amount,
      status: pay.status,
      createdAt: pay.createdAt.toISOString(),
      updatedAt: pay.updatedAt.toISOString(),
    }));
  }

}

export default new UserService();
