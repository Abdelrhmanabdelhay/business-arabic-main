// src/controllers/authController.ts

import { Request, Response, NextFunction } from "express";
import { SignUpDto, SignInDto } from "../dtos/authDto";
import AuthService from "../services/authService";

export class AuthController {
  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const signUpDto: SignUpDto = req.body;
      const result = await AuthService.signUp(signUpDto);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const signInDto: SignInDto = req.body;
      const result = await AuthService.signIn(signInDto);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
