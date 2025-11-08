import { RentPredictionForm } from "@/components/owner/rent-prediction-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export default function RentPredictionPage() {
  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Lightbulb className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <CardTitle className="text-2xl font-headline">
                AI Rent Predictor
              </CardTitle>
              <CardDescription>
                Get a competitive market rental rate for your property using AI.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <RentPredictionForm />
        </CardContent>
      </Card>
    </div>
  );
}
