import Plan, { IPlan } from "../models/plans"

class PlanService {

  async createPlan(data: Partial<IPlan>): Promise<IPlan> {
    const plan = new Plan(data);
    return await plan.save();
  }

    async getPlans(): Promise<IPlan[]> {
    return await Plan.find().sort({ createdAt: -1 });
  }

  
  async getPlanById(id: string): Promise<IPlan | null> {
    return await Plan.findById(id);
  }


  async updatePlan(id: string, data: Partial<IPlan>): Promise<IPlan | null> {
    return await Plan.findByIdAndUpdate(id, data, { new: true });
  }

  async deletePlan(id: string): Promise<IPlan | null> {
    return await Plan.findByIdAndDelete(id);
  }
}

export default new PlanService();
