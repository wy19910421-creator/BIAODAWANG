const API_BASE_URL = 'http://localhost:3001/api';

export interface UploadResponse {
  success: boolean;
  fileName: string;
  fileSize: number;
  textLength: number;
  text: string;
}

export interface AnalysisError {
  id: string;
  type: 'format' | 'logic' | 'compliance' | 'technical' | 'typo';
  category: string;
  position: { line: number; column: number };
  description: string;
  suggestion: string;
  severity: 'high' | 'medium' | 'low';
  legalBasis?: string;
}

export interface AnalysisResult {
  success: boolean;
  result: {
    totalErrors: number;
    passRate: number;
    categories: Array<{ category: string; count: number; percentage: number }>;
    errors: AnalysisError[];
  };
}

export async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '文件上传失败');
  }

  return response.json();
}

export async function analyzeDocument(text: string, apiKey: string): Promise<AnalysisResult> {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, apiKey }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '文档分析失败');
  }

  return response.json();
}
