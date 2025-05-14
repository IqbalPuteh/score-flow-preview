
import React, { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UploadedDocument, DocumentType } from "../types";

interface FileUploadProps {
  onUploadComplete: (files: UploadedDocument[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
  const [files, setFiles] = useState<UploadedDocument[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const processFiles = (fileList: FileList) => {
    const newFiles: UploadedDocument[] = [...files];
    
    Array.from(fileList).forEach(file => {
      // Check if it's a PDF
      if (file.type !== "application/pdf") {
        toast.error(`${file.name} is not a PDF file`);
        return;
      }

      // Determine document type based on filename (simplified)
      const type: DocumentType = file.name.toLowerCase().includes("bank") 
        ? "bankStatement" 
        : "financialReport";

      // Create a new document object
      const newDoc: UploadedDocument = {
        id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: file.name,
        type: type,
        size: file.size,
        uploadDate: new Date(),
      };

      newFiles.push(newDoc);
    });

    setFiles(newFiles);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = () => {
    // Validate minimum requirements
    const bankStatements = files.filter(f => f.type === "bankStatement");
    
    if (bankStatements.length < 6) {
      toast.error("You need to upload at least 6 bank statements");
      return;
    }

    // Process completed - pass files to parent component
    onUploadComplete(files);
  };

  const removeFile = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
          isDragging ? "border-finance-blue bg-blue-50" : "border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf"
          multiple
        />
        <div className="flex flex-col items-center justify-center">
          <Upload 
            className="h-12 w-12 text-finance-blue mb-2" 
            aria-hidden="true" 
          />
          <p className="text-xl font-medium mb-1">Upload Documents</p>
          <p className="text-sm text-gray-500 mb-4">
            PDF files only (bank statements, financial reports)
          </p>
          <Button className="bg-finance-blue hover:bg-blue-900">
            Browse Files
          </Button>
          <p className="text-xs text-gray-400 mt-2">
            or drag & drop files here
          </p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Uploaded Documents</h3>
          <div className="space-y-2">
            {files.map((file) => (
              <div 
                key={file.id} 
                className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
              >
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${file.type === "bankStatement" ? "bg-green-500" : "bg-blue-500"} mr-2`}></div>
                  <div>
                    <p className="text-sm font-medium truncate max-w-xs">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {file.type === "bankStatement" ? "Bank Statement" : "Financial Report"} • {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); removeFile(file.id); }}
                  className="text-gray-400 hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Button 
              onClick={handleSubmit}
              className="w-full bg-finance-blue hover:bg-blue-900 py-6"
            >
              Process Documents
            </Button>
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              <span className="font-medium text-green-600">{files.filter(f => f.type === "bankStatement").length}</span> bank statements and{" "}
              <span className="font-medium text-blue-600">{files.filter(f => f.type === "financialReport").length}</span> financial reports
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Minimum requirement: 6 bank statements
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
