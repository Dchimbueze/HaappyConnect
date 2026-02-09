'use server';
import {
  aiPoweredExpertMatching,
  type AIPoweredExpertMatchingOutput,
} from '@/ai/flows/ai-powered-expert-matching';
import { experts } from '@/lib/data';
import { type AIMatcherState } from '@/lib/types';

export async function findExpertsAction(
  prevState: AIMatcherState,
  formData: FormData
): Promise<AIMatcherState> {
  const seekerRequirements = formData.get('requirements') as string;

  if (!seekerRequirements || seekerRequirements.trim().length < 10) {
    return { error: 'Please provide more details about your requirements (min. 10 characters).' };
  }

  try {
    const expertProfiles = experts.map((expert) => ({
      expertId: expert.id,
      expertise: expert.expertise,
      responseTime: expert.responseTime,
      userReviews: expert.userReviewsSummary,
    }));

    const result: AIPoweredExpertMatchingOutput = await aiPoweredExpertMatching({
      seekerRequirements,
      expertProfiles,
    });
    
    // Sort suggestions by match score in descending order
    const sortedSuggestions = result.suggestedExperts.sort((a, b) => b.matchScore - a.matchScore);

    return { suggestions: sortedSuggestions, timestamp: Date.now() };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred. Please try again later.' };
  }
}
