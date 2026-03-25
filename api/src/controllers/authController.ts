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


  async forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    const result = await AuthService.forgotPassword(email);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const result = await AuthService.resetPassword(token, password);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
}

export default new AuthController();
