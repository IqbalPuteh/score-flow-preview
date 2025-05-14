
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import NavBar from "../components/NavBar";
import { CreditScoreResult } from "../types";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";

const CreditScore: React.FC = () => {
  const [scoreResult, setScoreResult] = useState<CreditScoreResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get credit score result from sessionStorage
    const storedResult = sessionStorage.getItem("creditScoreResult");
    
    if (storedResult) {
      const parsedResult: CreditScoreResult = JSON.parse(storedResult);
      setScoreResult(parsedResult);
    } else {
      // If no result is found, redirect to upload page
      toast.error("No credit score available. Please start from the beginning.");
      navigate("/");
    }
    
    setIsLoading(false);
  }, [navigate]);

  const handleViewExplanation = () => {
    navigate("/explanation");
  };

  if (isLoading || !scoreResult) {
    return (
      <div className="min-h-screen bg-finance-light flex flex-col">
        <NavBar currentStep={2} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-finance-blue mx-auto mb-4"></div>
            <p className="text-lg text-finance-blue">Loading your credit score...</p>
          </div>
        </main>
      </div>
    );
  }

  // Determine score class (color) based on score range
  const getScoreClass = (score: number) => {
    if (score >= 750) return "text-green-600";
    if (score >= 670) return "text-blue-600";
    if (score >= 580) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-finance-light flex flex-col">
      <NavBar currentStep={2} />
      
      <main className="flex-1 flex flex-col items-center p-6">
        <Card className="credit-container animate-fade-in">
          <div className="text-center">
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="text-8xl font-bold mb-2 transition-all duration-700 ease-out transform scale-in-center" style={{ color: "#2A4365" }}>
                {scoreResult.score}
              </div>
              <p className="text-xl text-finance-gray font-medium">Credit Score</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-medium mb-2">New debt capacity:</h2>
              <p className="text-3xl font-bold text-finance-blue">
                ${scoreResult.newDebtCapacity.toLocaleString()}
              </p>
            </div>
            
            <div className="text-left mb-8">
              <h3 className="text-lg font-medium mb-3">Explanation:</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">{scoreResult.explanation[0]}</p>
                <p className="text-gray-600 text-sm mt-2">{scoreResult.explanation[1]}</p>
                <div className="mt-3 flex justify-center">
                  <Button 
                    variant="link" 
                    onClick={handleViewExplanation}
                    className="text-finance-blue"
                  >
                    View Full Explanation
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button 
                onClick={handleViewExplanation}
                className="bg-finance-blue hover:bg-blue-800"
              >
                View Details <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default CreditScore;
