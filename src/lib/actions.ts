"use server";

import { z } from "zod";
import { predictRent } from "@/ai/flows/rent-prediction";

const RentPredictionSchema = z.object({
  propertyType: z.string().min(1, { message: "Property type is required." }),
  location: z.string().min(1, { message: "Location is required." }),
  numBedrooms: z.coerce.number().min(1, { message: "Must have at least 1 bedroom." }),
  numBathrooms: z.coerce.number().min(1, { message: "Must have at least 1 bathroom." }),
  squareFootage: z.coerce.number().min(100, { message: "Must be at least 100 sq. ft." }),
  amenities: z.string().min(1, { message: "Amenities are required." }),
  nearbyAmenities: z.string().min(1, { message: "Nearby amenities are required." }),
});

export type State = {
  errors?: {
    propertyType?: string[];
    location?: string[];
    numBedrooms?: string[];
    numBathrooms?: string[];
    squareFootage?: string[];
    amenities?: string[];
    nearbyAmenities?: string[];
  };
  message?: string | null;
  prediction?: {
    predictedRent: number;
    rationale: string;
  } | null;
};

export async function getRentPrediction(prevState: State, formData: FormData) {
  const validatedFields = RentPredictionSchema.safeParse({
    propertyType: formData.get("propertyType"),
    location: formData.get("location"),
    numBedrooms: formData.get("numBedrooms"),
    numBathrooms: formData.get("numBathrooms"),
    squareFootage: formData.get("squareFootage"),
    amenities: formData.get("amenities"),
    nearbyAmenities: formData.get("nearbyAmenities"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Get Prediction.",
      prediction: null,
    };
  }

  try {
    const result = await predictRent(validatedFields.data);
    return {
      message: "Prediction Successful.",
      prediction: result,
      errors: {},
    };
  } catch (error) {
    console.error(error);
    return {
      message: "An error occurred while getting the prediction.",
      prediction: null,
      errors: {},
    };
  }
}
