import type { CamelToSnakeCaseObject } from './cases';

export type Document = {
  id?: string;
  uri?: string;
  title?: string;
  content?: string;
  parentDocumentId?: string;
  documentStructure?: any;
  version?: number;
  createdUserId?: string;
  updatedUserId?: string;
  
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type DocumentApi = CamelToSnakeCaseObject<Document>;
