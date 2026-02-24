import { Request, Response, NextFunction } from "express";
import { CreateUserDto, UpdateUserDto } from "../dtos/userDto";
import UserService from "../services/userService";

export class UserController {
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const createUserDto: CreateUserDto = req.body;
      const result = await UserService.createUser(createUserDto);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit,fullName } = req.query;
      const result = await UserService.getUsers(Number(page) || 1, Number(limit) || 10,fullName as string || "");
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      const { id } = (req as Express.Request).user!;
      const result = await UserService.getProfile(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await UserService.getUserById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateUserDto: UpdateUserDto = req.body;
      const result = await UserService.updateUser(id, updateUserDto);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await UserService.deleteUser(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }


async getAllPaymentsOfUser(req: Request, res: Response, next: NextFunction) {

  // get query parameters limit and page
  const { page, limit ,id} = req.query;
  try {
    // @ts-ignore
    // const { id } = (req as Express.Request).user!;
    console.log("this is user id from backend:", id);
    const result = await UserService.getAllPaymentsOfUser(String(id), Number(page) || 1, Number(limit) || 10);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}}

export default new UserController();
