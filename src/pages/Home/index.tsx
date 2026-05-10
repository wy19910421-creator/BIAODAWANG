import { Link } from 'react-router-dom';
import { Shield, FileCheck, AlertTriangle, Settings, BookOpen, SpellCheck, ChevronRight, CheckCircle2, Users, FileText, Clock } from 'lucide-react';
import { Button } from '@/components/common/Button';

const features = [
  {
    icon: Settings,
    title: '格式规范检查',
    description: '自动检测字体字号、行距页边距、章节编号、页码等格式问题',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: AlertTriangle,
    title: '条款逻辑冲突检查',
    description: '识别前后矛盾表述、资质要求冲突、付款方式不一致',
    color: 'from-orange-500 to-orange-600',
  },
  {
    icon: FileCheck,
    title: '商务合规检查',
    description: '校验保证金金额、有效期时间逻辑、签字盖章位置完整性',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: Settings,
    title: '技术参数检查',
    description: '验证技术规格一致性、工程量清单准确性、服务范围完整性',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: BookOpen,
    title: '法规合规检查',
    description: '依据招投标法、政府采购法检测硬性条款合规性',
    color: 'from-red-500 to-red-600',
  },
  {
    icon: SpellCheck,
    title: '文案低级错误检查',
    description: '识别错别字、标点混用、金额大小写不一致等常见错误',
    color: 'from-yellow-500 to-yellow-600',
  },
];

const steps = [
  {
    number: '01',
    title: '上传文件',
    description: '拖拽或选择 Word/PDF 招投标文件',
    icon: FileText,
  },
  {
    number: '02',
    title: '智能检查',
    description: '系统自动执行全维度深度检查',
    icon: Shield,
  },
  {
    number: '03',
    title: '获取报告',
    description: '下载完整错误报告与修改建议',
    icon: CheckCircle2,
  },
];

const stats = [
  { value: '10,000+', label: '服务企业', icon: Users },
  { value: '50,000+', label: '累计检查', icon: FileText },
  { value: '80%', label: '时间节省', icon: Clock },
];

export function HomePage() {
  return (
    <div className="w-full">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-light">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-warning rounded-full blur-3xl" />
        </div>
        
        <div className="relative container 2xl py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm mb-6">
              <Shield className="w-4 h-4" />
              <span>专业级招投标文档智能错检系统</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              招投标文件
              <br />
              <span className="bg-gradient-to-r from-accent to-warning bg-clip-text text-transparent">
                智能错检系统
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              一键检查格式、条款、合规、技术全维度错误，替代人工逐字核对，大幅提升投标文件质量与中标率
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/upload">
                <Button variant="warning" size="lg" className="w-full sm:w-auto">
                  立即开始检查
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </Link>
              <Link to="/help">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto bg-transparent text-white border-white hover:bg-white hover:text-primary">
                  了解更多
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="w-8 h-8 text-accent mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container 2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              六大检查维度全覆盖
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              从格式规范到法规合规，从条款逻辑到文案细节，全方位智能检测，不放过任何一个潜在问题
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group bg-white rounded-xl p-6 shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container 2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              三步完成智能检查
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              简单易用的操作流程，让繁琐的文档检查变得轻松高效
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.title} className="relative text-center">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-accent/30 to-accent/30" />
                )}
                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-accent/10 to-accent/5 border-2 border-accent/30 mb-4">
                  <step.icon className="w-10 h-10 text-accent" />
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-white text-sm font-bold rounded-full flex items-center justify-center">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container 2xl">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-card">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                  为什么选择标大王？
                </h2>
                <div className="space-y-4">
                  {[
                    { title: '专家级检查标准', desc: '基于资深招投标专家经验，覆盖所有常见错误类型' },
                    { title: '高效节省时间', desc: '一键全维度检查，替代人工逐字核对，效率提升80%' },
                    { title: '精准错误定位', desc: '原文标红高亮，附带法规依据与修改建议' },
                    { title: '数据安全保障', desc: '文件加密存储，传输使用HTTPS加密' },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                        <p className="text-gray-600 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-primary to-primary-light rounded-xl p-8 text-white">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-4 bg-white/10 rounded-lg">
                      <div className="text-3xl font-bold mb-1">99.9%</div>
                      <div className="text-sm text-gray-300">检查准确率</div>
                    </div>
                    <div className="text-center p-4 bg-white/10 rounded-lg">
                      <div className="text-3xl font-bold mb-1">6大</div>
                      <div className="text-sm text-gray-300">检查维度</div>
                    </div>
                    <div className="text-center p-4 bg-white/10 rounded-lg">
                      <div className="text-3xl font-bold mb-1">3种</div>
                      <div className="text-sm text-gray-300">导出格式</div>
                    </div>
                    <div className="text-center p-4 bg-white/10 rounded-lg">
                      <div className="text-3xl font-bold mb-1">7×24</div>
                      <div className="text-sm text-gray-300">在线服务</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary">
        <div className="container 2xl text-center">
          <Shield className="w-16 h-16 text-accent mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            立即开始，提升投标质量
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            告别繁琐的人工检查，让标大王成为您的招投标文档智能助手
          </p>
          <Link to="/upload">
            <Button variant="warning" size="lg">
              开始免费检查
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
