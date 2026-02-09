'use server';

/**
 * @fileOverview AI-powered expert matching flow.
 *
 * This flow suggests suitable experts based on the advice-seeker's requirements,
 * considering expertise, response time, and user reviews.
 *
 * - aiPoweredExpertMatching - A function that handles the expert matching process.
 * - AIPoweredExpertMatchingInput - The input type for the aiPoweredExpertMatching function.
 * - AIPoweredExpertMatchingOutput - The return type for the aiPoweredExpertMatching function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIPoweredExpertMatchingInputSchema = z.object({
  seekerRequirements: z
    .string()
    .describe(
      'The specific requirements of the advice-seeker, including the topic, desired expertise level, and any other relevant details.'
    ),
  expertProfiles: z.array(z.object({
    expertId: z.string(),
    expertise: z.string(),
    responseTime: z.string(),
    userReviews: z.string(),
  })).describe('A list of available expert profiles to evaluate.'),
});

export type AIPoweredExpertMatchingInput = z.infer<typeof AIPoweredExpertMatchingInputSchema>;

const AIPoweredExpertMatchingOutputSchema = z.object({
  suggestedExperts: z.array(z.object({
    expertId: z.string(),
    matchScore: z.number().describe('A score indicating how well the expert matches the seeker requirements.'),
    reason: z.string().describe('The reason why the expert is a good match.'),
  })).describe('A list of suggested experts, ranked by match score.'),
});

export type AIPoweredExpertMatchingOutput = z.infer<typeof AIPoweredExpertMatchingOutputSchema>;

export async function aiPoweredExpertMatching(input: AIPoweredExpertMatchingInput): Promise<AIPoweredExpertMatchingOutput> {
  return aiPoweredExpertMatchingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPoweredExpertMatchingPrompt',
  input: {schema: AIPoweredExpertMatchingInputSchema},
  output: {schema: AIPoweredExpertMatchingOutputSchema},
  prompt: `You are an AI assistant designed to match advice-seekers with the most suitable experts.  Consider these factors when matching experts:

  - Expertise:  The expert's knowledge and skills should align with the advice-seeker's needs.
  - Response Time:  Experts with faster response times are generally preferred.
  - User Reviews:  Positive user reviews indicate a higher quality of service.

Given the following advice-seeker requirements:

  Requirements: {{{seekerRequirements}}}

And the following expert profiles:

  {{#each expertProfiles}}
  Expert ID: {{{expertId}}}
  Expertise: {{{expertise}}}
  Response Time: {{{responseTime}}}
  User Reviews: {{{userReviews}}}
  {{/each}}

Suggest the best experts based on the requirements. Provide a match score (0-1) and a reason for each suggestion.

Output in JSON format:

  { "suggestedExperts": [ { "expertId": "expert123", "matchScore": 0.85, "reason": "Expert123 has expertise in the required topic, a fast response time, and positive user reviews." } ] }`,
});

const aiPoweredExpertMatchingFlow = ai.defineFlow(
  {
    name: 'aiPoweredExpertMatchingFlow',
    inputSchema: AIPoweredExpertMatchingInputSchema,
    outputSchema: AIPoweredExpertMatchingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
