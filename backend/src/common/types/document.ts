export type Document = {
  id?: string;
  uri?: string;
  title?: string;
  content?: string;
  parentDocumentId?: string;
  version?: number;
  createdUserId?: string;
  updatedUserId?: string;
  
  createdAt?: Date | string;
  updatedAt?: Date | string;
};
