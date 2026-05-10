import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Trash2, FileText, CheckCircle, AlertCircle, Shield, Brain } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Progress } from '@/components/common/Progress';
import { useFileStore } from '@/stores/fileStore';
import { useCheckStore } from '@/stores/checkStore';
import { toast } from '@/components/common/Toast';
import type { UploadedFile } from '@/types';
import { cn } from '@/components/common/Button';

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const ALLOWED_TYPES = [
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/pdf',
];

const API_BASE_URL = 'https://dengyue.store/api';

export function UploadPage() {
  const navigate = useNavigate();
  const { files, addFile, updateFile, removeFile } = useFileStore();
  const { startCheck, updateProgress, setResults } = useCheckStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [checkProgress, setCheckProgress] = useState(0);
  const [currentDimension, setCurrentDimension] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type) && !file.name.match(/\.(doc|docx|pdf)$/i)) {
      return '不支持的文件格式，请上传 .doc、.docx 或 .pdf 文件';
    }
    if (file.size > MAX_FILE_SIZE) {
      return '文件大小超过50MB限制';
    }
    return null;
  };

  const handleFiles = useCallback(
    async (newFiles: FileList) => {
      for (const file of Array.from(newFiles)) {
        const error = validateFile(file);
        if (error) {
          toast.error(error);
          continue;
        }

        const uploadedFile: UploadedFile = {
          id: Date.now() + Math.random().toString(36).substr(2),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadTime: new Date(),
          status: 'uploading',
          progress: 0,
        };

        addFile(uploadedFile);

        try {
          setIsChecking(true);
          startCheck();
          setCheckProgress(10);
          setCurrentDimension('解析文件');

          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch(`${API_BASE_URL}/upload-and-analyze`, {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || '文件处理失败');
          }

          setCheckProgress(30);
          setCurrentDimension('提取文本');

          const data = await response.json();
          
          if (!data.success) {
            throw new Error(data.error || 'AI分析失败');
          }

          setCheckProgress(50);
          setCurrentDimension('格式规范检查');
          updateProgress(50, '格式规范');
          
          setCheckProgress(60);
          setCurrentDimension('条款逻辑检查');
          updateProgress(60, '条款逻辑');
          
          setCheckProgress(70);
          setCurrentDimension('商务合规检查');
          updateProgress(70, '商务合规');
          
          setCheckProgress(80);
          setCurrentDimension('技术参数检查');
          updateProgress(80, '技术参数');
          
          setCheckProgress(90);
          setCurrentDimension('法规合规检查');
          updateProgress(90, '法规合规');

          toast.info('AI正在深度分析文档，请稍候...');

          setCheckProgress(100);
          setCurrentDimension('分析完成');
          updateProgress(100, '文案错误' as any);

          const { totalErrors, passRate, categories, errors } = data.result;
          
          setResults(
            errors.map((e: any, idx: number) => ({ 
              ...e, 
              id: String(idx + 1),
              category: e.category
            })),
            totalErrors,
            passRate,
            categories
          );

          updateFile(uploadedFile.id, { status: 'uploaded', progress: 100 });
          toast.success(`检查完成！共发现 ${totalErrors} 处问题`);
          
          setTimeout(() => {
            navigate('/check');
          }, 500);
        } catch (error: any) {
          console.error('处理文件失败:', error);
          updateFile(uploadedFile.id, { status: 'error' });
          toast.error(error.message || '文件处理失败');
        } finally {
          setIsChecking(false);
        }
      }
    },
    [addFile, updateFile, navigate, startCheck, updateProgress, setResults]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files);
      }
    },
    [handleFiles]
  );

  const uploadedFiles = files.filter((f) => f.status === 'uploaded');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container 2xl py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Shield className="w-4 h-4" />
              <span>文件加密存储，保障数据安全</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary">上传招投标文件</h1>
            <p className="text-gray-600 mt-2">支持 Word (.doc/.docx) 和 PDF 格式，单个文件不超过50MB</p>
          </div>

          <div className="mb-6 bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI智能分析</h3>
                <p className="text-sm text-gray-600">上传文件后，大模型将自动进行六维度深度检查</p>
              </div>
            </div>
          </div>

          <div
            className={cn(
              'relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200',
              isDragging
                ? 'border-accent bg-accent/5 scale-[1.02]'
                : 'border-gray-300 bg-white hover:border-accent/50',
              isChecking && 'pointer-events-none opacity-50'
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".doc,.docx,.pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
              className="hidden"
              onChange={handleFileSelect}
              disabled={isChecking}
            />

            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-accent/10 to-accent/5 rounded-full flex items-center justify-center">
              <Upload className="w-10 h-10 text-accent" />
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isChecking ? 'AI正在分析文档...' : '拖拽文件到此处'}
            </h3>
            <p className="text-gray-500 mb-6">
              {isChecking ? '请稍候，大模型正在深度分析您的招投标文件' : '或点击下方按钮选择文件'}
            </p>

            {!isChecking && (
              <Button
                variant="primary"
                onClick={() => fileInputRef.current?.click()}
                disabled={isChecking}
              >
                选择文件
              </Button>
            )}

            <p className="mt-4 text-sm text-gray-400">
              支持 .doc、.docx、.pdf 格式
            </p>
          </div>

          {isChecking && (
            <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <Brain className="w-5 h-5 text-green-600 animate-pulse" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">AI智能检查进行中...</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {currentDimension || '准备中'}
                  </div>
                </div>
              </div>
              <Progress value={checkProgress} showLabel size="lg" />
              <div className="mt-4 flex flex-wrap gap-2">
                {['解析文件', '提取文本', '格式规范', '条款逻辑', '商务合规', '技术参数', '法规合规', '文案分析'].map(
                  (dim, idx) => (
                    <span
                      key={dim}
                      className={cn(
                        'px-3 py-1 text-xs rounded-full transition-colors',
                        checkProgress >= (idx + 1) * 12.5
                          ? 'bg-success/10 text-success'
                          : 'bg-gray-100 text-gray-500'
                      )}
                    >
                      {dim}
                    </span>
                  )
                )}
              </div>
            </div>
          )}

          {files.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  已上传文件 ({uploadedFiles.length})
                </h2>
                {files.some((f) => f.status === 'uploading') && (
                  <div className="flex items-center gap-2 text-sm text-accent">
                    <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    处理中...
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4"
                  >
                    <div
                      className={cn(
                        'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0',
                        file.type.includes('pdf')
                          ? 'bg-red-100 text-red-600'
                          : 'bg-blue-100 text-blue-600'
                      )}
                    >
                      <FileText className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{file.name}</div>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span>{formatFileSize(file.size)}</span>
                        {file.status === 'uploading' && (
                          <div className="flex-1 max-w-[200px]">
                            <Progress value={file.progress || 0} size="sm" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {file.status === 'uploaded' ? (
                        <span className="flex items-center gap-1 text-sm text-success">
                          <CheckCircle className="w-4 h-4" />
                          已处理
                        </span>
                      ) : file.status === 'error' ? (
                        <span className="flex items-center gap-1 text-sm text-error">
                          <AlertCircle className="w-4 h-4" />
                          失败
                        </span>
                      ) : null}

                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-2 text-gray-400 hover:text-error transition-colors"
                        disabled={isChecking}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 bg-primary/5 rounded-lg p-6 border border-primary/10">
            <h3 className="font-semibold text-primary mb-3">温馨提示</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <span>为保证检查效果，建议上传完整的招投标文件</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <span>大模型会从六大维度进行全面分析：格式、逻辑、合规、技术、法规、文案</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <span>您的文件仅用于本次检查，不会保存到服务器</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
