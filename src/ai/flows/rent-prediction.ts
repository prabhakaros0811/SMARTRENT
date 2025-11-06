'use server';
/**
 * @fileOverview This file defines a Genkit flow for predicting rental rates based on property features and location.
 *
 * - predictRent - An async function that calls the rent prediction flow.
 * - RentPredictionInput - The input type for the predictRent function.
 * - RentPredictionOutput - The output type for the predictRent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RentPredictionInputSchema = z.object({
  propertyType: z.string().describe('Type of property (e.g., apartment, house).'),
  location: z.string().describe('Location of the property (e.g., city, neighborhood).'),
  numBedrooms: z.number().describe('Number of bedrooms in the property.'),
  numBathrooms: z.number().describe('Number of bathrooms in the property.'),
  squareFootage: z.number().describe('Square footage of the property.'),
  amenities: z.string().describe('A comma-separated list of amenities (e.g., balcony, parking, gym).'),
  nearbyAmenities: z.string().describe('A comma-separated list of nearby amenities (e.g., schools, parks, public transport).'),
});

export type RentPredictionInput = z.infer<typeof RentPredictionInputSchema>;

const RentPredictionOutputSchema = z.object({
  predictedRent: z.number().describe('The predicted monthly rental rate in Indian Rupees (₹).'),
  rationale: z.string().describe('Explanation of factors influencing the predicted rent.'),
});

export type RentPredictionOutput = z.infer<typeof RentPredictionOutputSchema>;

export async function predictRent(input: RentPredictionInput): Promise<RentPredictionOutput> {
  return rentPredictionFlow(input);
}

const rentPredictionPrompt = ai.definePrompt({
  name: 'rentPredictionPrompt',
  input: {schema: RentPredictionInputSchema},
  output: {schema: RentPredictionOutputSchema},
  prompt: `You are an expert real estate analyst specializing in Indian rental markets. Given the details of a property, you will predict the optimal monthly rental rate in Indian Rupees (₹).

  Consider the following factors:
  - Property type: {{{propertyType}}}
  - Location: {{{location}}}
  - Number of bedrooms: {{{numBedrooms}}}
  - Number of bathrooms: {{{numBathrooms}}}
  - Square footage: {{{squareFootage}}}
  - Amenities: {{{amenities}}}
  - Nearby amenities: {{{nearbyAmenities}}}

  Provide a predicted rent and a brief rationale explaining your reasoning. Ensure the predicted rent is a number.
  Follow the output schema, and provide all values in Indian Rupees (₹).
`,
});

const rentPredictionFlow = ai.defineFlow(
  {
    name: 'rentPredictionFlow',
    inputSchema: RentPredictionInputSchema,
    outputSchema: RentPredictionOutputSchema,
  },
  async input => {
    const {output} = await rentPredictionPrompt(input);
    return output!;
  }
);
