
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUpload from "../components/FileUpload";
import NavBar from "../components/NavBar";
import LoadingSpinner from "../components/LoadingSpinner";
import { Card } from "@/components/ui/card";
import { UploadedDocument } from "../types";

const Index: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleUploadComplete = (files: UploadedDocument[]) => {
    // Simulate processing time
    setIsProcessing(true);
    
    // Store the files in sessionStorage for use in other pages
    sessionStorage.setItem("uploadedDocuments", JSON.stringify(files));
    
    // Navigate to preview page after a delay
    setTimeout(() => {
      setIsProcessing(false);
      navigate("/preview");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-finance-light flex flex-col">
      <NavBar currentStep={0} />
      
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <Card className="credit-container animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-finance-blue mb-2">Credit Scoring App</h1>
            <p className="text-finance-gray">
              Upload your documents to get your credit score
            </p>
          </div>
          
          {isProcessing ? (
            <LoadingSpinner />
          ) : (
            <>
              <FileUpload onUploadComplete={handleUploadComplete} />
              
              <div className="mt-8 text-center">
                <p className="text-sm text-finance-gray">
                  © 2025 Copyright Fairbanc Technologies Indonesia
                </p>
              </div>
            </>
          )}
        </Card>
      </main>
    </div>
  );
};

export default Index;
