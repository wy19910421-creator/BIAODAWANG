import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, CheckCircle, AlertTriangle, Info, ChevronDown, ChevronUp, FileText, Download, Sparkles, Brain } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Tabs } from '@/components/common/Tabs';
import { Progress } from '@/components/common/Progress';
import { ErrorBadge, SeverityBadge } from '@/components/common/Badge';
import { useCheckStore } from '@/stores/checkStore';
import { useFileStore } from '@/stores/fileStore';
import { toast } from '@/components/common/Toast';
import type { CheckResult, ErrorCategory } from '@/types';
import { cn } from '@/components/common/Button';

const errorCategories: ErrorCategory[] = ['格式规范', '条款逻辑', '商务合规', '技术参数', '法规合规', '文案错误'];

export function CheckPage() {
  const navigate = useNavigate();
  const { results, isChecking, progress, totalErrors, passRate, categories, resetCheck } = useCheckStore();
  const { files, documentText } = useFileStore();
  const [activeTab, setActiveTab] = useState('all');
  const [expandedError, setExpandedError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (results.length === 0 && !isChecking) {
      navigate('/upload');
    }
  }, [results, isChecking, navigate]);

  const filteredResults =
    activeTab === 'all'
      ? results
      : results.filter((r) => r.category === activeTab);

  const getCountByCategory = (category: string) =>
    category === 'all'
      ? results.length
      : results.filter((r) => r.category === category).length;

  const tabs = [
    { id: 'all', label: '全部', count: getCountByCategory('all') },
    ...errorCategories.map((cat) => ({ id: cat, label: cat, count: getCountByCategory(cat) })),
  ];

  const handleErrorClick = (errorId: string, line: number) => {
    setExpandedError(expandedError === errorId ? null : errorId);
    const lineHeight = 24;
    if (previewRef.current) {
      previewRef.current.scrollTo({
        top: Math.max(0, (line - 1) * lineHeight),
        behavior: 'smooth',
      });
    }
  };

  const getSeverityIcon = (severity: CheckResult['severity']) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-error" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-warningYellow" />;
      default:
        return <Info className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="container 2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  resetCheck();
                  navigate('/upload');
                }}
                className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">返回上传</span>
              </button>
              <div className="h-6 w-px bg-gray-200" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">AI智能检查结果</h1>
                <p className="text-sm text-gray-500">{files[0]?.name || '文档检查'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                <Brain className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">豆包AI驱动</span>
              </div>
              <Button variant="warning" size="sm" onClick={() => navigate('/report')}>
                生成报告
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-accent/5 border-b border-accent/20 px-4 py-4">
        <div className="container 2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-error">{totalErrors}</div>
              <div className="text-sm text-gray-600">发现问题</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-success">{passRate}%</div>
              <div className="text-sm text-gray-600">通过率</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-accent">{results.filter(r => r.severity === 'high').length}</div>
              <div className="text-sm text-gray-600">严重错误</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-gray-600">{results.filter(r => r.severity === 'medium').length}</div>
              <div className="text-sm text-gray-600">中等风险</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="flex-1 bg-white border-r border-gray-200 overflow-hidden">
          <div
            ref={previewRef}
            className="h-full overflow-auto p-8"
          >
            <div className="max-w-3xl mx-auto bg-white">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-4">{files[0]?.name || '招投标文件'}</h1>
                <div className="text-gray-600 space-y-1">
                  <p>由豆包大模型智能分析</p>
                </div>
              </div>

              {documentText ? (
                <div className="whitespace-pre-wrap text-sm leading-7 text-gray-700 font-sans">
                  {documentText.split('\n').map((line, idx) => {
                    const lineErrors = results.filter(r => r.position?.line === idx + 1);
                    return (
                      <div key={idx} className={cn(
                        'relative py-0.5 px-2 rounded',
                        lineErrors.length > 0 && 'bg-error/10 border-l-4 border-error'
                      )}>
                        <span className="text-gray-400 select-none mr-4">{idx + 1}</span>
                        {line || '\u00A0'}
                        {lineErrors.map(err => (
                          <div key={err.id} className="inline-block ml-2">
                            <ErrorBadge type={err.type} />
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredResults.map((error) => (
                    <div
                      key={error.id}
                      className={cn(
                        'relative p-4 mb-2 rounded-lg border transition-all cursor-pointer',
                        expandedError === error.id
                          ? 'bg-warning/5 border-warning/30'
                          : 'bg-gray-50 border-gray-200 hover:border-accent/30'
                      )}
                      onClick={() => handleErrorClick(error.id, error.position?.line || 1)}
                    >
                      <div className="flex items-start gap-3">
                        {getSeverityIcon(error.severity)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <ErrorBadge type={error.type} />
                            <SeverityBadge severity={error.severity} />
                          </div>
                          <p className="text-gray-900 font-medium">{error.description}</p>
                          {expandedError === error.id && (
                            <div className="mt-3 space-y-2 text-sm">
                              <div className="bg-white p-3 rounded border border-gray-200">
                                <div className="text-gray-500 mb-1">修改建议</div>
                                <div className="text-gray-700">{error.suggestion}</div>
                              </div>
                              {error.legalBasis && (
                                <div className="bg-blue-50 p-3 rounded border border-blue-100">
                                  <div className="text-blue-600 mb-1">法规依据</div>
                                  <div className="text-gray-700">{error.legalBasis}</div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-400">
                          第{error.position?.line || '?'}行
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-96 bg-gray-50 border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-white">
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-3">
            {filteredResults.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
                <div className="text-gray-600">该分类暂无错误</div>
              </div>
            ) : (
              filteredResults.map((error) => (
                <Card
                  key={error.id}
                  className={cn(
                    'cursor-pointer transition-all',
                    expandedError === error.id && 'ring-2 ring-accent'
                  )}
                  onClick={() => handleErrorClick(error.id, error.position?.line || 1)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getSeverityIcon(error.severity)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <ErrorBadge type={error.type} />
                        <span className="text-xs text-gray-400">
                          第{error.position?.line || '?'}行
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 line-clamp-2">
                        {error.description}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        <SeverityBadge severity={error.severity} />
                        {expandedError === error.id ? (
                          <span className="flex items-center gap-1 text-accent">
                            收起 <ChevronUp className="w-3 h-3" />
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            查看详情 <ChevronDown className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <Button variant="primary" size="sm" className="flex-1" onClick={() => navigate('/report')}>
                <Download className="w-4 h-4 mr-1" />
                导出报告
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
