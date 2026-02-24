import { Request, Response } from "express";
import PlanService from "../services/planServic";

class PlanController {
  // إنشاء خطة
  async createPlan(req: Request, res: Response) {
    try {
      const plan = await PlanService.createPlan(req.body);
      res.status(201).json(plan);
    } catch (error) {
      res.status(500).json({ message: "Error creating plan", error });
    }
  }

  // جلب كل الخطط
  async getPlans(req: Request, res: Response) {
    try {
      const plans = await PlanService.getPlans();
      res.status(200).json(plans);
    } catch (error) {
      res.status(500).json({ message: "Error fetching plans", error });
    }
  }

  // جلب خطة بالـ id
  async getPlanById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const plan = await PlanService.getPlanById(id);
      if (!plan) return res.status(404).json({ message: "Plan not found" });
      res.status(200).json(plan);
    } catch (error) {
      res.status(500).json({ message: "Error fetching plan", error });
    }
  }

  // تحديث خطة
  async updatePlan(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedPlan = await PlanService.updatePlan(id, req.body);
      if (!updatedPlan) return res.status(404).json({ message: "Plan not found" });
      res.status(200).json(updatedPlan);
    } catch (error) {
      res.status(500).json({ message: "Error updating plan", error });
    }
  }

  // حذف خطة
  async deletePlan(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deletedPlan = await PlanService.deletePlan(id);
      if (!deletedPlan) return res.status(404).json({ message: "Plan not found" });
      res.status(200).json({ message: "Plan deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting plan", error });
    }
  }
}

export default new PlanController();
