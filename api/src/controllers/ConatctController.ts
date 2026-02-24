import { Request, Response } from "express";
import { sendContactEmail } from "../utils/nodemailer";

export const contactController = async (req: Request, res: Response) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields required" });
  }

  const result = await sendContactEmail(name, email, message);

  if (result.success) {
    return res.json({ message: "Message sent successfully" });
  } else {
    return res.status(500).json({ error: "Failed to send message" });
  }
};
