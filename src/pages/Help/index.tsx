import { useState } from 'react';
import { HelpCircle, BookOpen, MessageCircle, Phone, ChevronDown, ChevronUp, Search, ExternalLink } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { toast } from '@/components/common/Toast';
import { cn } from '@/components/common/Button';

const faqCategories = [
  {
    category: '基础使用',
    questions: [
      {
        q: '标大王支持哪些文件格式？',
        a: '标大王支持 Word 文档（.doc、.docx）和 PDF 文件。建议使用 .docx 格式以获得最佳检查效果。',
      },
      {
        q: '文件大小有限制吗？',
        a: '单个文件大小限制为 50MB。如果文件过大，建议拆分为多个文件分别检查。',
      },
      {
        q: '检查需要多长时间？',
        a: '检查时间取决于文件大小和复杂程度，一般情况下 1-3 分钟内完成。系统会在检查过程中显示实时进度。',
      },
      {
        q: '我的文件安全吗？',
        a: '您的文件采用加密存储，传输过程使用 HTTPS 加密。我们不会将您的文件泄露给任何第三方。',
      },
    ],
  },
  {
    category: '检查功能',
    questions: [
      {
        q: '检查维度包括哪些内容？',
        a: '标大王提供六大检查维度：格式规范检查、条款逻辑冲突检查、商务合规检查、技术参数检查、法规合规检查、文案低级错误检查。',
      },
      {
        q: '可以修复检查出的错误吗？',
        a: '部分错误（如章节编号错乱、标点符号混用）支持一键自动修复。其他错误需要手动修改。',
      },
      {
        q: '如何导出检查报告？',
        a: '检查完成后，点击"生成报告"按钮，可选择导出为 PDF、Word 或 Excel 格式。',
      },
      {
        q: '支持自定义检查规则吗？',
        a: '企业用户可以上传自定义模板建立专属校验规则。请联系客服开通此功能。',
      },
    ],
  },
  {
    category: '账号与付费',
    questions: [
      {
        q: '如何注册账号？',
        a: '点击导航栏的"注册"按钮，填写手机号和验证码即可完成注册。',
      },
      {
        q: '标大王是免费的吗？',
        a: '标大王提供免费试用额度。更多功能和企业版服务需要付费升级。',
      },
      {
        q: '如何升级为付费用户？',
        a: '登录后进入个人中心，点击"升级套餐"即可选择适合您的付费方案。',
      },
    ],
  },
];

const tutorials = [
  { title: '快速开始指南', duration: '5分钟', level: '入门' },
  { title: '高级检查功能详解', duration: '15分钟', level: '进阶' },
  { title: '企业模板使用教程', duration: '10分钟', level: '进阶' },
  { title: '团队协作功能介绍', duration: '8分钟', level: '高级' },
];

export function HelpPage() {
  const [expandedQ, setExpandedQ] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('全部');
  const [searchTerm, setSearchTerm] = useState('');

  const allCategories = ['全部', ...faqCategories.map((c) => c.category)];
  const filteredCategories = activeCategory === '全部'
    ? faqCategories
    : faqCategories.filter((c) => c.category === activeCategory);

  const filteredQuestions = searchTerm
    ? faqCategories.map((cat) => ({
        ...cat,
        questions: cat.questions.filter(
          (q) =>
            q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.a.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      })).filter((cat) => cat.questions.length > 0)
    : filteredCategories;

  const handleContact = () => {
    toast.info('客服热线：400-888-8888');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-primary to-primary-light text-white">
        <div className="container 2xl py-12">
          <div className="max-w-2xl mx-auto text-center">
            <HelpCircle className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h1 className="text-3xl md:text-4xl font-bold mb-4">帮助中心</h1>
            <p className="text-gray-300 mb-6">遇到问题？在这里您可以找到答案</p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索您的问题..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container 2xl py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card className="text-center">
            <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-7 h-7 text-accent" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">常见问题</h3>
            <p className="text-sm text-gray-600 mb-4">快速找到常见问题的解答</p>
            <Button variant="ghost" size="sm">
              查看全部
            </Button>
          </Card>
          <Card className="text-center">
            <div className="w-14 h-14 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-7 h-7 text-success" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">在线客服</h3>
            <p className="text-sm text-gray-600 mb-4">工作日 9:00-18:00 即时响应</p>
            <Button variant="ghost" size="sm" onClick={() => toast.info('在线客服功能开发中')}>
              开始咨询
            </Button>
          </Card>
          <Card className="text-center">
            <div className="w-14 h-14 bg-warning/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Phone className="w-7 h-7 text-warning" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">电话咨询</h3>
            <p className="text-sm text-gray-600 mb-4">7×24 小时热线服务</p>
            <Button variant="ghost" size="sm" onClick={handleContact}>
              400-888-8888
            </Button>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">视频教程</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tutorials.map((tutorial) => (
              <Card key={tutorial.title} hover className="cursor-pointer group">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center group-hover:from-accent/10 group-hover:to-accent/5 transition-colors">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-accent ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">{tutorial.title}</h4>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span>{tutorial.duration}</span>
                  <span className="px-2 py-0.5 bg-gray-100 rounded">{tutorial.level}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">常见问题</h2>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                  activeCategory === cat
                    ? 'bg-accent text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredQuestions.map((category) => (
              <div key={category.category}>
                <h3 className="text-lg font-medium text-gray-900 mb-3">{category.category}</h3>
                <div className="space-y-2">
                  {category.questions.map((item, idx) => {
                    const qId = `${category.category}-${idx}`;
                    return (
                      <Card key={qId} className="cursor-pointer" onClick={() => setExpandedQ(expandedQ === qId ? null : qId)}>
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-gray-900">{item.q}</h4>
                            </div>
                            {expandedQ === qId && (
                              <p className="mt-3 text-gray-600 leading-relaxed animate-fade-in">
                                {item.a}
                              </p>
                            )}
                          </div>
                          <div className="flex-shrink-0 mt-1">
                            {expandedQ === qId ? (
                              <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {filteredQuestions.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">没有找到相关问题</p>
              <Button variant="primary" className="mt-4" onClick={handleContact}>
                联系客服
              </Button>
            </div>
          )}
        </div>

        <div className="mt-12 bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">没有找到您需要的答案？</h3>
          <p className="text-gray-600 mb-6">我们的客服团队随时为您服务</p>
          <div className="flex justify-center gap-4">
            <Button variant="primary" onClick={() => toast.info('在线客服功能开发中')}>
              <MessageCircle className="w-4 h-4 mr-2" />
              在线咨询
            </Button>
            <Button variant="secondary" onClick={handleContact}>
              <Phone className="w-4 h-4 mr-2" />
              电话咨询
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
