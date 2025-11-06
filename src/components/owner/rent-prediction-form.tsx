"use client";

import { useFormState, useFormStatus } from "react-dom";
import { LoaderCircle, Sparkles } from "lucide-react";

import { getRentPrediction, type State } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={pending}>
      {pending ? (
        <>
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          Predicting...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Predict Rent
        </>
      )}
    </Button>
  );
}

export function RentPredictionForm() {
  const initialState: State = { message: null, errors: {} };
  const [state, dispatch] = useFormState(getRentPrediction, initialState);

  return (
    <form action={dispatch} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="propertyType">Property Type</Label>
          <Input id="propertyType" name="propertyType" placeholder="e.g., Apartment, House" />
          <p className="text-sm text-destructive">{state.errors?.propertyType}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" placeholder="e.g., Koramangala, Bangalore" />
          <p className="text-sm text-destructive">{state.errors?.location}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="numBedrooms">Bedrooms</Label>
          <Input id="numBedrooms" name="numBedrooms" type="number" placeholder="e.g., 2" />
          <p className="text-sm text-destructive">{state.errors?.numBedrooms}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="numBathrooms">Bathrooms</Label>
          <Input id="numBathrooms" name="numBathrooms" type="number" placeholder="e.g., 2" />
          <p className="text-sm text-destructive">{state.errors?.numBathrooms}</p>
        </div>
      </div>
       <div className="space-y-2">
          <Label htmlFor="squareFootage">Square Footage</Label>
          <Input id="squareFootage" name="squareFootage" type="number" placeholder="e.g., 1200" />
          <p className="text-sm text-destructive">{state.errors?.squareFootage}</p>
        </div>
      <div className="space-y-2">
        <Label htmlFor="amenities">Amenities</Label>
        <Textarea id="amenities" name="amenities" placeholder="e.g., Parking, Gym, Pool" />
        <p className="text-sm text-destructive">{state.errors?.amenities}</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="nearbyAmenities">Nearby Amenities</Label>
        <Textarea id="nearbyAmenities" name="nearbyAmenities" placeholder="e.g., Metro station, School, Park" />
        <p className="text-sm text-destructive">{state.errors?.nearbyAmenities}</p>
      </div>
      
      <SubmitButton />

      {state.prediction && (
        <Card className="bg-primary/5 border-primary/20 mt-6 animate-in fade-in-50">
          <CardHeader>
            <CardTitle className="text-xl text-primary font-headline">
              Predicted Monthly Rent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-foreground">
              {formatCurrency(state.prediction.predictedRent)}
            </p>
            <CardDescription className="mt-4">
              <strong className="text-foreground">Rationale:</strong> {state.prediction.rationale}
            </CardDescription>
          </CardContent>
        </Card>
      )}
      {state.message && !state.prediction && (
        <p className="text-sm text-destructive mt-4">{state.message}</p>
      )}
    </form>
  );
}
