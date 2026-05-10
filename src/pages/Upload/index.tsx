import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, File, X, Eye, Trash2, FileText, CheckCircle, AlertCircle, ChevronRight, Shield } from 'lucide-react';
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

export function UploadPage() {
  const navigate = useNavigate();
  const { files, addFile, updateFile, removeFile } = useFileStore();
  const { startCheck } = useCheckStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [checkProgress, setCheckProgress] = useState(0);
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
    (newFiles: FileList) => {
      Array.from(newFiles).forEach((file) => {
        const error = validateFile(file);
        if (error) {
          toast.error(error);
          return;
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

        setTimeout(() => {
          updateFile(uploadedFile.id, { status: 'uploaded', progress: 100 });
          toast.success(`${file.name} 上传成功`);
        }, 1000);
      });
    },
    [addFile, updateFile]
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

  const handleStartCheck = () => {
    if (files.length === 0) {
      toast.warning('请先上传文件');
      return;
    }

    setIsChecking(true);
    setCheckProgress(0);
    startCheck();

    const dimensions = ['格式规范', '条款逻辑', '商务合规', '技术参数', '法规合规', '文案错误'];
    let currentProgress = 0;

    const interval = setInterval(() => {
      currentProgress += Math.random() * 15 + 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsChecking(false);
          toast.success('检查完成！共发现 23 处问题');
          navigate('/check');
        }, 500);
      }
      setCheckProgress(Math.min(currentProgress, 100));
    }, 300);
  };

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

          <div
            className={cn(
              'relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200',
              isDragging
                ? 'border-accent bg-accent/5 scale-[1.02]'
                : 'border-gray-300 bg-white hover:border-accent/50'
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".doc,.docx,.pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />

            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-accent/10 to-accent/5 rounded-full flex items-center justify-center">
              <Upload className="w-10 h-10 text-accent" />
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              拖拽文件到此处
            </h3>
            <p className="text-gray-500 mb-6">或点击下方按钮选择文件</p>

            <Button
              variant="primary"
              onClick={() => fileInputRef.current?.click()}
              disabled={isChecking}
            >
              选择文件
            </Button>

            <p className="mt-4 text-sm text-gray-400">
              支持 .doc、.docx、.pdf 格式
            </p>
          </div>

          {files.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  已上传文件 ({uploadedFiles.length})
                </h2>
                {files.some((f) => f.status === 'uploading') && (
                  <div className="flex items-center gap-2 text-sm text-accent">
                    <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    上传中...
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
                          已上传
                        </span>
                      ) : file.status === 'error' ? (
                        <span className="flex items-center gap-1 text-sm text-error">
                          <AlertCircle className="w-4 h-4" />
                          上传失败
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

          {isChecking && (
            <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <File className="w-5 h-5 text-accent animate-pulse" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">智能检查进行中...</div>
                  <div className="text-sm text-gray-500 mt-1">
                    正在检查 {uploadedFiles[0]?.name}
                  </div>
                </div>
              </div>
              <Progress value={checkProgress} showLabel size="lg" />
              <div className="mt-4 flex flex-wrap gap-2">
                {['格式规范', '条款逻辑', '商务合规', '技术参数', '法规合规', '文案错误'].map(
                  (dim) => (
                    <span
                      key={dim}
                      className={cn(
                        'px-3 py-1 text-xs rounded-full transition-colors',
                        checkProgress >=
                          ['格式规范', '条款逻辑', '商务合规', '技术参数', '法规合规', '文案错误'].indexOf(dim) *
                            16.67
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

          <div className="mt-8 flex justify-end">
            <Button
              variant="warning"
              size="lg"
              onClick={handleStartCheck}
              disabled={uploadedFiles.length === 0 || isChecking}
              isLoading={isChecking}
              className="min-w-[200px]"
            >
              {isChecking ? '检查中...' : '开始检查'}
              {!isChecking && <ChevronRight className="w-5 h-5 ml-1" />}
            </Button>
          </div>

          <div className="mt-12 bg-primary/5 rounded-lg p-6 border border-primary/10">
            <h3 className="font-semibold text-primary mb-3">温馨提示</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <span>为保证检查效果，建议上传完整的招投标文件</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <span>系统会自动识别文件行业类型，选择对应的检查规则</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <span>您的文件采用加密存储，不会泄露给任何第三方</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
