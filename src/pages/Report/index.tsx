import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText, CheckCircle, AlertTriangle, PieChart, BarChart3, Printer, Share2, Brain } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { ErrorBadge, SeverityBadge } from '@/components/common/Badge';
import { useCheckStore } from '@/stores/checkStore';
import { useFileStore } from '@/stores/fileStore';
import { toast } from '@/components/common/Toast';
import type { CheckResult } from '@/types';
import { cn } from '@/components/common/Button';

export function ReportPage() {
  const navigate = useNavigate();
  const { results, totalErrors, passRate, categories } = useCheckStore();
  const { files } = useFileStore();

  const handleExport = (format: string) => {
    toast.success(`报告已导出为 ${format.toUpperCase()} 格式`);
  };

  const highErrors = results.filter(r => r.severity === 'high').length;
  const mediumErrors = results.filter(r => r.severity === 'medium').length;
  const lowErrors = results.filter(r => r.severity === 'low').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="container 2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/check')} className="flex items-center gap-2 text-gray-600 hover:text-primary">
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">返回检查</span>
              </button>
              <div className="h-6 w-px bg-gray-200" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">AI检查报告</h1>
                <p className="text-sm text-gray-500">{files[0]?.name || '招投标文件检查报告'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                <Brain className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">豆包AI分析</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => toast.info('分享链接已复制')}>
                <Share2 className="w-4 h-4 mr-1" />
                分享
              </Button>
              <Button variant="ghost" size="sm" onClick={() => toast.info('正在准备打印...')}>
                <Printer className="w-4 h-4 mr-1" />
                打印
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container 2xl py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary to-primary-light text-white">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <div className="text-3xl font-bold">{totalErrors}</div>
                <div className="text-sm text-gray-300">AI发现问题</div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-success to-emerald-600 text-white">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-7 h-7" />
              </div>
              <div>
                <div className="text-3xl font-bold">{passRate}%</div>
                <div className="text-sm text-gray-200">文档通过率</div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center">
                <FileText className="w-7 h-7 text-accent" />
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">{files[0]?.name || '招投标文件'}</div>
                <div className="text-sm text-gray-500">豆包AI深度分析</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">豆包大模型</span>
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">6维度检查</span>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-gray-900">错误分类统计</h3>
            </div>
            <div className="space-y-4">
              {categories.map((stat) => {
                const percentage = stat.percentage;
                return (
                  <div key={stat.category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">{stat.category}</span>
                      <span className="text-sm font-medium text-accent">
                        {stat.count} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 bg-accent"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-gray-900">严重程度分布</h3>
            </div>
            <div className="flex items-center justify-around h-48">
              <div className="text-center">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="#FEE2E2" strokeWidth="8" fill="none" />
                    <circle cx="48" cy="48" r="40" stroke="#EF4444" strokeWidth="8" fill="none"
                      strokeDasharray={`${(highErrors / totalErrors || 0.01) * 251.2} 251.2`} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-error">{highErrors}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-2">严重</div>
              </div>
              <div className="text-center">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="#FEF3C7" strokeWidth="8" fill="none" />
                    <circle cx="48" cy="48" r="40" stroke="#F59E0B" strokeWidth="8" fill="none"
                      strokeDasharray={`${(mediumErrors / totalErrors || 0.01) * 251.2} 251.2`} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-warningYellow">{mediumErrors}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-2">中等</div>
              </div>
              <div className="text-center">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                    <circle cx="48" cy="48" r="40" stroke="#9CA3AF" strokeWidth="8" fill="none"
                      strokeDasharray={`${(lowErrors / totalErrors || 0.01) * 251.2} 251.2`} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-500">{lowErrors}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-2">轻微</div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">AI发现的详细问题</h3>
            <span className="text-sm text-gray-500">共 {totalErrors} 项</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">序号</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">类型</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">位置</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">问题描述</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">修改建议</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">严重程度</th>
                </tr>
              </thead>
              <tbody>
                {results.map((error, idx) => (
                  <tr key={error.id} className={cn('border-b border-gray-100 hover:bg-gray-50', idx % 2 === 0 && 'bg-gray-50/50')}>
                    <td className="py-3 px-4 text-sm text-gray-600">{idx + 1}</td>
                    <td className="py-3 px-4"><ErrorBadge type={error.type} /></td>
                    <td className="py-3 px-4 text-sm text-gray-600">第{error.position?.line || '?'}行</td>
                    <td className="py-3 px-4 text-sm text-gray-900 max-w-md">{error.description}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 max-w-md">{error.suggestion}</td>
                    <td className="py-3 px-4"><SeverityBadge severity={error.severity} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">导出AI检查报告</h3>
              <p className="text-sm text-gray-600">将豆包AI的分析结果导出为正式报告</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" onClick={() => handleExport('pdf')}>
                <Download className="w-4 h-4 mr-2" />
                导出 PDF
              </Button>
              <Button variant="secondary" onClick={() => handleExport('word')}>
                <FileText className="w-4 h-4 mr-2" />
                导出 Word
              </Button>
              <Button variant="ghost" onClick={() => handleExport('excel')}>
                <BarChart3 className="w-4 h-4 mr-2" />
                导出 Excel
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
