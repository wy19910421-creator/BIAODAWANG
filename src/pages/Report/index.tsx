import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText, CheckCircle, AlertTriangle, PieChart, BarChart3, Printer, Share2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { ErrorBadge, SeverityBadge } from '@/components/common/Badge';
import { toast } from '@/components/common/Toast';
import type { CheckResult } from '@/types';
import { cn } from '@/components/common/Button';

const mockResults: CheckResult[] = [
  { id: '1', type: 'format', category: '格式规范', position: { line: 15, column: 1 }, description: '章节编号不连续', suggestion: '检查是否遗漏章节', severity: 'high' },
  { id: '2', type: 'logic', category: '条款逻辑', position: { line: 42, column: 5 }, description: '工期描述矛盾', suggestion: '统一工期描述', severity: 'high' },
  { id: '3', type: 'compliance', category: '商务合规', position: { line: 68, column: 12 }, description: '保证金金额不符', suggestion: '修改为2%', severity: 'high' },
  { id: '4', type: 'technical', category: '技术参数', position: { line: 95, column: 8 }, description: '技术参数不一致', suggestion: '统一参数', severity: 'medium' },
  { id: '5', type: 'typo', category: '文案错误', position: { line: 128, column: 3 }, description: '错别字', suggestion: '修正文字', severity: 'low' },
];

const categoryStats = [
  { category: '格式规范', count: 12, color: '#0066FF' },
  { category: '条款逻辑', count: 5, color: '#FF6B35' },
  { category: '商务合规', count: 8, color: '#EF4444' },
  { category: '技术参数', count: 3, color: '#8B5CF6' },
  { category: '法规合规', count: 2, color: '#F59E0B' },
  { category: '文案错误', count: 4, color: '#6B7280' },
];

export function ReportPage() {
  const navigate = useNavigate();
  const totalErrors = categoryStats.reduce((sum, s) => sum + s.count, 34);
  const passRate = Math.round(((100 - totalErrors) / 100) * 100);

  const handleExport = (format: string) => {
    toast.success(`报告已导出为 ${format.toUpperCase()} 格式`);
  };

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
                <h1 className="text-lg font-semibold text-gray-900">检查报告</h1>
                <p className="text-sm text-gray-500">某市政府采购项目招标文件</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
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
                <div className="text-sm text-gray-300">错误总数</div>
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
                <div className="text-lg font-semibold text-gray-900">某市政府采购项目</div>
                <div className="text-sm text-gray-500">2024-01-15 14:30</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">.docx</span>
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">2.8MB</span>
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">45页</span>
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
              {categoryStats.map((stat) => {
                const percentage = Math.round((stat.count / totalErrors) * 100);
                return (
                  <div key={stat.category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">{stat.category}</span>
                      <span className="text-sm font-medium" style={{ color: stat.color }}>
                        {stat.count} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%`, backgroundColor: stat.color }}
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
                      strokeDasharray={`${(15/34) * 251.2} 251.2`} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-error">15</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-2">严重</div>
              </div>
              <div className="text-center">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="#FEF3C7" strokeWidth="8" fill="none" />
                    <circle cx="48" cy="48" r="40" stroke="#F59E0B" strokeWidth="8" fill="none"
                      strokeDasharray={`${(11/34) * 251.2} 251.2`} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-warningYellow">11</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-2">中等</div>
              </div>
              <div className="text-center">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                    <circle cx="48" cy="48" r="40" stroke="#9CA3AF" strokeWidth="8" fill="none"
                      strokeDasharray={`${(8/34) * 251.2} 251.2`} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-500">8</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-2">轻微</div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">错误详细清单</h3>
            <span className="text-sm text-gray-500">共 {totalErrors} 项</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">序号</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">类型</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">位置</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">错误描述</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">修改建议</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">严重程度</th>
                </tr>
              </thead>
              <tbody>
                {mockResults.map((error, idx) => (
                  <tr key={error.id} className={cn('border-b border-gray-100 hover:bg-gray-50', idx % 2 === 0 && 'bg-gray-50/50')}>
                    <td className="py-3 px-4 text-sm text-gray-600">{idx + 1}</td>
                    <td className="py-3 px-4"><ErrorBadge type={error.type} /></td>
                    <td className="py-3 px-4 text-sm text-gray-600">第{error.position.line}行</td>
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
              <h3 className="font-semibold text-gray-900 mb-1">导出检查报告</h3>
              <p className="text-sm text-gray-600">选择您需要的格式导出完整报告</p>
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
