
export type DocumentType = "bankStatement" | "financialReport";

export interface UploadedDocument {
  id: string;
  name: string;
  type: DocumentType;
  size: number;
  uploadDate: Date;
  content?: string; // This would actually be the file contents
}

export interface CreditScoreResult {
  score: number;
  newDebtCapacity: number;
  explanation: string[];
  reportDate: Date;
}
