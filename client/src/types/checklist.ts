export type DocumentStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface ApplicationDocument {
  id: string;
  title: string;
  description: string;
  isRequired: boolean;
  status: DocumentStatus;
  fileUrl?: string;
  updatedAt?: string;
}

export interface ProgramChecklistData {
  programId: string;
  programName: string;
  universityName: string;
  documents: ApplicationDocument[];
}
