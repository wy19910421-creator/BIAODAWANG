import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, CheckCircle, AlertTriangle, Info, ChevronDown, ChevronUp, FileText, Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Tabs } from '@/components/common/Tabs';
import { Progress } from '@/components/common/Progress';
import { ErrorBadge, SeverityBadge } from '@/components/common/Badge';
import { toast } from '@/components/common/Toast';
import type { CheckResult, ErrorCategory } from '@/types';
import { cn } from '@/components/common/Button';

const mockResults: CheckResult[] = [
  {
    id: '1',
    type: 'format',
    category: '格式规范',
    position: { line: 15, column: 1 },
    description: '章节编号不连续：第二章后直接跳到第四章',
    suggestion: '检查是否遗漏第三章，或修正编号',
    severity: 'high',
    legalBasis: '招标文件范本要求章节编号连续',
  },
  {
    id: '2',
    type: 'logic',
    category: '条款逻辑',
    position: { line: 42, column: 5 },
    description: '工期描述矛盾：前文约定30天，后文提到45天工作日',
    suggestion: '统一工期描述，建议以天为单位',
    severity: 'high',
    legalBasis: '《招投标法》第二十三条',
  },
  {
    id: '3',
    type: 'compliance',
    category: '商务合规',
    position: { line: 68, column: 12 },
    description: '投标保证金金额不符合要求：应为项目估算价的2%',
    suggestion: '修改保证金金额为 ¥58,000',
    severity: 'high',
    legalBasis: '《政府采购法实施条例》第三十三条',
  },
  {
    id: '4',
    type: 'technical',
    category: '技术参数',
    position: { line: 95, column: 8 },
    description: '技术规格参数前后不一致：设备型号规格描述存在差异',
    suggestion: '统一所有技术参数，确保全文一致',
    severity: 'medium',
  },
  {
    id: '5',
    type: 'typo',
    category: '文案错误',
    position: { line: 128, column: 3 },
    description: '错别字：将"工程"误写为"工徎"',
    suggestion: '修正为"工程"',
    severity: 'low',
  },
  {
    id: '6',
    type: 'format',
    category: '格式规范',
    position: { line: 156, column: 20 },
    description: '标点符号混用：中文文章中使用半角标点',
    suggestion: '统一使用全角标点符号',
    severity: 'low',
  },
  {
    id: '7',
    type: 'compliance',
    category: '法规合规',
    position: { line: 189, column: 1 },
    description: '引用法规已过期：GB/T 19001-2016 已于2023年更新',
    suggestion: '更新为 GB/T 19001-2016(R2024)',
    severity: 'medium',
    legalBasis: '国家标准化管理委员会公告',
  },
  {
    id: '8',
    type: 'logic',
    category: '条款逻辑',
    position: { line: 234, column: 15 },
    description: '付款方式冲突：预付款与进度款支付条件矛盾',
    suggestion: '明确各付款阶段的触发条件',
    severity: 'medium',
  },
  {
    id: '9',
    type: 'typo',
    category: '文案错误',
    position: { line: 267, column: 8 },
    description: '金额大小写不一致：¥580,000 vs 伍抬扒万元整',
    suggestion: '修正大写金额为"伍拾捌万元整"',
    severity: 'high',
  },
];

const errorCategories: ErrorCategory[] = ['格式规范', '条款逻辑', '商务合规', '技术参数', '法规合规', '文案错误'];

export function CheckPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [expandedError, setExpandedError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [checkProgress, setCheckProgress] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isChecking) {
      const interval = setInterval(() => {
        setCheckProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsChecking(false);
            toast.success('检查完成！');
            return 100;
          }
          return prev + 5;
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [isChecking]);

  const filteredResults =
    activeTab === 'all'
      ? mockResults
      : mockResults.filter((r) => r.category === activeTab);

  const getCountByCategory = (category: string) =>
    category === 'all'
      ? mockResults.length
      : mockResults.filter((r) => r.category === category).length;

  const tabs = [
    { id: 'all', label: '全部', count: getCountByCategory('all') },
    ...errorCategories.map((cat) => ({ id: cat, label: cat, count: getCountByCategory(cat) })),
  ];

  const handleErrorClick = (errorId: string, line: number) => {
    setExpandedError(expandedError === errorId ? null : errorId);
    const lineHeight = 24;
    if (previewRef.current) {
      previewRef.current.scrollTo({
        top: (line - 1) * lineHeight,
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
                onClick={() => navigate('/upload')}
                className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">返回上传</span>
              </button>
              <div className="h-6 w-px bg-gray-200" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">招标文件智能检查</h1>
                <p className="text-sm text-gray-500">某市政府采购项目招标文件_v2.docx</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => toast.info('功能开发中')}>
                <Sparkles className="w-4 h-4 mr-1" />
                一键修复
              </Button>
              <Button variant="warning" size="sm" onClick={() => navigate('/report')}>
                生成报告
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isChecking && (
        <div className="bg-accent/5 border-b border-accent/20 px-4 py-4">
          <div className="container 2xl">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <span className="font-medium text-accent">智能检查中...</span>
              <span className="text-sm text-gray-600 ml-auto">{checkProgress}%</span>
            </div>
            <Progress value={checkProgress} size="sm" />
            <div className="flex flex-wrap gap-2 mt-3">
              {errorCategories.map((cat, idx) => (
                <span
                  key={cat}
                  className={cn(
                    'px-2 py-1 text-xs rounded-full',
                    checkProgress > (idx + 1) * 16
                      ? 'bg-success/10 text-success'
                      : 'bg-gray-100 text-gray-500'
                  )}
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {!isChecking && (
        <div className="flex-1 flex">
          <div className="flex-1 bg-white border-r border-gray-200 overflow-hidden">
            <div
              ref={previewRef}
              className="h-full overflow-auto p-8 font-mono text-sm leading-6"
            >
              <div className="max-w-3xl mx-auto bg-white">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold mb-4">某市政府办公设备采购项目招标文件</h1>
                  <div className="text-gray-600 space-y-1">
                    <p>项目编号：ZFCG-2024-001</p>
                    <p>预算金额：290万元</p>
                    <p>发布时间：2024年1月15日</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4 pb-2 border-b">第一章 总则</h2>
                  <p className="text-gray-700 leading-relaxed">
                    为规范政府采购行为，加强财政支出管理，提高政府采购效率，特制定本招标文件。
                    本项目采购内容为办公设备，包括台式计算机、打印机、投影仪等。
                  </p>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4 pb-2 border-b">第二章 投标须知</h2>
                  <p className="text-gray-700 leading-relaxed">
                    2.1 投标有效期：投标截止日后60日历日内有效。
                    <br />
                    2.2 工期要求：自合同签订之日起30天内完成供货及安装调试。
                    <br />
                    2.3 投标保证金：人民币5.8万元整。
                    <br />
                    2.4 履约保证金：合同金额的10%。
                  </p>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4 pb-2 border-b">第四章 采购需求</h2>
                  <p className="text-gray-700 leading-relaxed">
                    4.1 采购内容及技术要求
                    <br />
                    4.1.1 台式计算机：品牌机型，推荐配置Intel Core i5或AMD Ryzen 5处理器，8GB内存，256GB SSD...
                    <br />
                    4.1.2 打印机：黑白激光打印机，打印速度≥30页/分钟...
                    <br />
                    4.1.3 投影仪：亮度≥4000流明，分辨率1920×1080...
                  </p>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4 pb-2 border-b">第五章 合同条款</h2>
                  <p className="text-gray-700 leading-relaxed">
                    5.1 付款方式：合同签订后预付30%，验收合格后支付65%，质保期满后支付5%。
                    <br />
                    5.2 质保期：自验收合格之日起不少于12个月。
                    <br />
                    5.3 违约责任：一方违约应承担合同总价10%的违约金。
                  </p>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4 pb-2 border-b">错误标注区域</h2>
                  {filteredResults.map((error) => (
                    <div
                      key={error.id}
                      className={cn(
                        'relative p-4 mb-2 rounded-lg border transition-all cursor-pointer',
                        expandedError === error.id
                          ? 'bg-warning/5 border-warning/30'
                          : 'bg-gray-50 border-gray-200 hover:border-accent/30'
                      )}
                      onClick={() => handleErrorClick(error.id, error.position.line)}
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
                          第{error.position.line}行
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="w-96 bg-gray-50 border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-white">
              <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
            </div>

            <div className="p-4 bg-white border-b border-gray-200">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-error">{mockResults.filter(r => r.severity === 'high').length}</div>
                  <div className="text-xs text-gray-600">严重错误</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-warningYellow">{mockResults.filter(r => r.severity === 'medium').length}</div>
                  <div className="text-xs text-gray-600">中等风险</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">{mockResults.filter(r => r.severity === 'low').length}</div>
                  <div className="text-xs text-gray-600">轻微问题</div>
                </div>
              </div>
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
                    onClick={() => handleErrorClick(error.id, error.position.line)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getSeverityIcon(error.severity)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <ErrorBadge type={error.type} />
                          <span className="text-xs text-gray-400">
                            第{error.position.line}行
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
                <Button variant="ghost" size="sm" onClick={() => toast.info('功能开发中')}>
                  <Sparkles className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
