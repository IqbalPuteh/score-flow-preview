
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import NavBar from "../components/NavBar";
import { CreditScoreResult } from "../types";
import { toast } from "sonner";

const Explanation: React.FC = () => {
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

  const handleDownloadReport = () => {
    if (!scoreResult) return;
    
    // Create text content for the report
    const reportContent = `
CREDIT SCORE REPORT
Generated on: ${new Date().toLocaleDateString()}

CREDIT SCORE: ${scoreResult.score}
NEW DEBT CAPACITY: $${scoreResult.newDebtCapacity.toLocaleString()}

DETAILED EXPLANATION:
${scoreResult.explanation.join('\n')}

ADDITIONAL INFORMATION:
- Your credit score is in the ${getScoreRange(scoreResult.score)} range.
- This analysis is based on the documents you provided.
- For more detailed financial advice, please consult with a financial advisor.
    `;
    
    // Create a blob from the text content
    const blob = new Blob([reportContent], { type: 'text/plain' });
    
    // Create a temporary URL to the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'credit_score_report.txt';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Report downloaded successfully");
  };

  const getScoreRange = (score: number) => {
    if (score >= 800) return "Excellent (800-850)";
    if (score >= 740) return "Very Good (740-799)";
    if (score >= 670) return "Good (670-739)";
    if (score >= 580) return "Fair (580-669)";
    return "Poor (300-579)";
  };

  if (isLoading || !scoreResult) {
    return (
      <div className="min-h-screen bg-finance-light flex flex-col">
        <NavBar currentStep={3} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-finance-blue mx-auto mb-4"></div>
            <p className="text-lg text-finance-blue">Loading explanation...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-finance-light flex flex-col">
      <NavBar currentStep={3} />
      
      <main className="flex-1 flex flex-col items-center p-6">
        <Card className="credit-container animate-fade-in w-full max-w-3xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-finance-blue mb-2">Explanation</h1>
            <p className="text-finance-gray">
              Detailed breakdown of your credit score analysis
            </p>
          </div>
          
          <div className="mb-8">
            <div className="bg-gray-50 p-4 rounded-lg mb-4 flex items-center">
              <div className="bg-finance-blue text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4">
                {scoreResult.score.toString().charAt(0)}
              </div>
              <div>
                <p className="font-medium">Your credit score is {scoreResult.score}</p>
                <p className="text-sm text-gray-600">{getScoreRange(scoreResult.score)}</p>
              </div>
            </div>
            
            <h2 className="text-xl font-medium mb-3">Detailed Analysis</h2>
            <ul className="space-y-4">
              {scoreResult.explanation.map((item, index) => (
                <li key={index} className="flex">
                  <div className="mr-3">
                    <div className="w-6 h-6 rounded-full bg-finance-blue text-white flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                  </div>
                  <p className="text-gray-700">{item}</p>
                </li>
              ))}
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg mt-6">
              <h3 className="text-lg font-medium mb-2">Recommended Actions</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs mr-3 mt-0.5">✓</div>
                  <p className="text-gray-700">Continue to make payments on time to maintain your score</p>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs mr-3 mt-0.5">✓</div>
                  <p className="text-gray-700">Keep credit utilization below 30% of total available credit</p>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs mr-3 mt-0.5">✓</div>
                  <p className="text-gray-700">Regularly check your credit report for errors</p>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <Button 
              variant="outline"
              onClick={() => navigate("/score")}
            >
              Back to Score
            </Button>
            
            <Button 
              onClick={handleDownloadReport}
              className="bg-finance-blue hover:bg-blue-800"
            >
              Download Report
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Explanation;
