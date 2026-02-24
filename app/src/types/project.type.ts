interface ILaunchedProject {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category?: string;
  createdAt: string;
}

interface IIdeaClub {
  id: string;
  name: string;
  description: string;
  content: Map<string, any>;
}

interface Project {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  sales: number;
  category: string;
  features: string[];
  image: string;
  createdAt: Date;
}

export interface MarketStats {
  growthRate: number;
  marketPotential: number;
  competitionLevel: number;
  implementationEase: number;
}

export interface ProjectIdea {
  title: string;
  description: string;
  category: string;
  potential: string;
  marketSize: string;
  roi?: string;
  breakEven?: string;
  risks?: string[];
  team?: string[];
  competitionLevel?: string;
  timeToMarket?: string;
  initialCost?: string;
  features?: string[];
  challenges?: string[];
  opportunities?: string[];
  marketStats?: MarketStats;
  id?: string;
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

interface ProjectsResponse {
  projects: Project[];
  page: number;
  limit: number;
  total: number;
  message?: string;
}

type ProjectsComponentProps = {
  projects: Project[];
  onDelete: (id: string) => Promise<void>;
  selectedId: string;
  isDeleting: boolean;
  isDeleted: boolean;
};

export type { ProjectsComponentProps, ProjectsResponse, IIdeaClub, ILaunchedProject, Project };
