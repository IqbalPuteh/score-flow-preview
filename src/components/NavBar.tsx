
import React from "react";

interface NavBarProps {
  currentStep: number;
}

const NavBar: React.FC<NavBarProps> = ({ currentStep }) => {
  const steps = [
    "Upload Documents",
    "Preview Data",
    "Credit Score",
    "Explanation"
  ];

  return (
    <header className="w-full bg-finance-blue p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Credit Scoring App</h1>
        <div className="hidden md:flex">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`mx-2 px-3 py-1 rounded text-sm ${
                currentStep === index
                  ? "bg-white text-finance-blue"
                  : currentStep > index
                  ? "bg-green-500"
                  : "opacity-70"
              }`}
            >
              {step}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
