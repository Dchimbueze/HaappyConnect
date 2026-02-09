import { type AIPoweredExpertMatchingOutput } from "@/ai/flows/ai-powered-expert-matching";

export type EngagementTier = {
  id: string;
  title: string;
  description: string;
  price: number;
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  avatarUrl: string;
};

export type Expert = {
  id: string;
  name: string;
  title: string;
  category: string;
  rating: number;
  reviewsCount: number;
  skills: string[];
  avatarUrl: string;
  bio: string;
  tiers: EngagementTier[];
  reviews: Review[];
  // For AI matching
  expertise: string;
  responseTime: string;
  userReviewsSummary: string;
};

export type AIMatcherState = {
  suggestions?: AIPoweredExpertMatchingOutput['suggestedExperts'];
  error?: string;
  timestamp?: number;
};
