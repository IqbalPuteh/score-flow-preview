
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import NavBar from "../components/NavBar";
import { UploadedDocument } from "../types";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";

const PreviewData: React.FC = () => {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get documents from sessionStorage
    const storedDocs = sessionStorage.getItem("uploadedDocuments");
    
    if (storedDocs) {
      const parsedDocs: UploadedDocument[] = JSON.parse(storedDocs);
      setDocuments(parsedDocs);
    } else {
      // If no documents are found, redirect to upload page
      toast.error("No documents found. Please upload your documents first.");
      navigate("/");
    }
    
    setIsLoading(false);
  }, [navigate]);

  const handleContinue = () => {
    // Simulate processing time for credit analysis
    setIsLoading(true);

    // Generate mock credit score data
    const mockCreditScore = {
      score: 720,
      newDebtCapacity: 40000,
      explanation: [
        "Your payment history shows consistent on-time payments.",
        "Your credit utilization ratio is below 30%.",
        "You have a good mix of credit types.",
        "Your average account age is over 5 years.",
      ],
      reportDate: new Date()
    };

    // Store credit score results for next page
    sessionStorage.setItem("creditScoreResult", JSON.stringify(mockCreditScore));

    // Navigate to credit score page after delay
    setTimeout(() => {
      setIsLoading(false);
      navigate("/score");
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-finance-light flex flex-col">
        <NavBar currentStep={1} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-finance-blue mx-auto mb-4"></div>
            <p className="text-lg text-finance-blue">Analyzing your financial data...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-finance-light flex flex-col">
      <NavBar currentStep={1} />
      
      <main className="flex-1 flex flex-col items-center p-6">
        <Card className="credit-container animate-fade-in w-full max-w-3xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-finance-blue mb-2">Preview Data</h1>
            <p className="text-finance-gray">
              Review your uploaded documents before proceeding
            </p>
          </div>
          
          <div className="space-y-4 mb-8">
            {/* Bank Statements */}
            <div className="border rounded-md p-4">
              <h2 className="text-lg font-medium mb-3">
                Bank Statements ({documents.filter(d => d.type === "bankStatement").length})
              </h2>
              <div className="space-y-2">
                {documents
                  .filter(d => d.type === "bankStatement")
                  .map(doc => (
                    <div key={doc.id} className="bg-gray-50 p-3 rounded flex justify-between items-center">
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(doc.uploadDate).toLocaleDateString()} • {(doc.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  ))
                }
              </div>
            </div>
            
            {/* Financial Reports */}
            {documents.filter(d => d.type === "financialReport").length > 0 && (
              <div className="border rounded-md p-4">
                <h2 className="text-lg font-medium mb-3">
                  Financial Reports ({documents.filter(d => d.type === "financialReport").length})
                </h2>
                <div className="space-y-2">
                  {documents
                    .filter(d => d.type === "financialReport")
                    .map(doc => (
                      <div key={doc.id} className="bg-gray-50 p-3 rounded flex justify-between items-center">
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(doc.uploadDate).toLocaleDateString()} • {(doc.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      </div>
                    ))
                  }
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <Button 
              variant="outline"
              onClick={() => navigate("/")}
            >
              Back
            </Button>
            
            <Button 
              onClick={handleContinue}
              className="bg-finance-blue hover:bg-blue-800 px-8"
            >
              Continue <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default PreviewData;
