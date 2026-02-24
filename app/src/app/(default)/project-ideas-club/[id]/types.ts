import { IdeaClub } from "@/types/ideas.types";
import { MarketStats, ProjectIdea } from "@/types/project.type";

// Extend IdeaClub with additional properties needed for display
export interface IdeaDetails extends Omit<IdeaClub, 'name'> {
  title: string; // mapped from name
  marketSize: string;
  competitionLevel: string;
  timeToMarket: string;
  initialCost: string;
  features: string[];
  challenges: string[];
  opportunities: string[];
  marketStats: MarketStats;
  potential: string;
  roi?: string;
  breakEven?: string;
  risks?: string[];
  team?: string[];
  successRate?: number;
  revenue?: string;
  investment?: string;
  image?: string;
  likes?: number;
  views?: number;
  trend?: "up" | "down" | "stable";
  industries?: string[];
  tags?: string[];
}
