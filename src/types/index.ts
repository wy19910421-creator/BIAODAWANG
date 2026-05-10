export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadTime: Date;
  status: 'uploading' | 'uploaded' | 'error';
  progress?: number;
}

export interface CheckResult {
  id: string;
  type: ErrorType;
  category: ErrorCategory;
  position: { line: number; column: number };
  description: string;
  suggestion: string;
  severity: Severity;
  legalBasis?: string;
}

export type ErrorType = 
  | 'format'
  | 'logic'
  | 'compliance'
  | 'technical'
  | 'typo';

export type ErrorCategory = 
  | '格式规范'
  | '条款逻辑'
  | '商务合规'
  | '技术参数'
  | '法规合规'
  | '文案错误';

export type Severity = 'high' | 'medium' | 'low';

export interface Report {
  id: string;
  fileName: string;
  checkTime: Date;
  totalErrors: number;
  passRate: number;
  categories: {
    category: ErrorCategory;
    count: number;
    percentage: number;
  }[];
  results: CheckResult[];
}

export interface Template {
  id: string;
  name: string;
  industry: Industry;
  downloads: number;
  description: string;
  preview?: string;
}

export type Industry = 'engineering' | 'goods' | 'service' | 'government';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'member';
  avatar?: string;
}

export interface HistoryRecord {
  id: string;
  fileName: string;
  checkTime: Date;
  errorCount: number;
  status: 'completed' | 'failed';
}
