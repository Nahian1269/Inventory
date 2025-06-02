'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting products to add to a user's favorites or trending list.
 *
 * - suggestFavoriteProducts - A function that suggests products for the favorites list.
 * - SuggestFavoriteProductsInput - The input type for the suggestFavoriteProducts function.
 * - SuggestFavoriteProductsOutput - The return type for the suggestFavoriteProducts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFavoriteProductsInputSchema = z.object({
  productDescriptions: z
    .array(z.string())
    .describe('Array of descriptions for each product in the inventory.'),
  customerData: z
    .string()
    .describe(
      'A summary of customer data, including demographics, purchase history, and browsing behavior.'
    ),
  numberOfSuggestions: z
    .number()
    .int()
    .positive()
    .default(3)
    .describe('The number of product suggestions to return.'),
});
export type SuggestFavoriteProductsInput = z.infer<
  typeof SuggestFavoriteProductsInputSchema
>;

const SuggestFavoriteProductsOutputSchema = z.object({
  suggestedProductIndices: z
    .array(z.number().int().nonnegative())
    .describe(
      'Array of indices corresponding to the products suggested for the favorites list, based on the input product descriptions.'
    ),
  reasoning: z
    .string()
    .describe('The AI agents reasoning for suggesting these products.'),
});
export type SuggestFavoriteProductsOutput = z.infer<
  typeof SuggestFavoriteProductsOutputSchema
>;

export async function suggestFavoriteProducts(
  input: SuggestFavoriteProductsInput
): Promise<SuggestFavoriteProductsOutput> {
  return suggestFavoriteProductsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFavoriteProductsPrompt',
  input: {schema: SuggestFavoriteProductsInputSchema},
  output: {schema: SuggestFavoriteProductsOutputSchema},
  prompt: `You are an expert marketing assistant helping a store owner identify products that should be added to the "favorites" or "trending" list to promote them to customers.

  Based on the following product descriptions:
  {{#each productDescriptions}}
  - Product {{@index}}: {{{this}}}
  {{/each}}

  And the following customer data:
  {{{customerData}}}

  Suggest the top {{numberOfSuggestions}} products (by index) that should be added to the favorites list to increase visibility and sales.
  Explain your reasoning for suggesting these products. 

  Format your response as a JSON object:
  {
    "suggestedProductIndices": [index1, index2, index3], // Array of product indices (integers) that should be added to the favorites list.
    "reasoning": "Explanation of why these products were selected."
  }
  `,
});

const suggestFavoriteProductsFlow = ai.defineFlow(
  {
    name: 'suggestFavoriteProductsFlow',
    inputSchema: SuggestFavoriteProductsInputSchema,
    outputSchema: SuggestFavoriteProductsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
