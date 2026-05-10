import { Link } from 'react-router-dom';
import { Shield, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = [
  {
    title: '产品服务',
    links: [
      { label: '智能错检', path: '/upload' },
      { label: '模板库', path: '/templates' },
      { label: '报告导出', path: '/report' },
    ],
  },
  {
    title: '帮助支持',
    links: [
      { label: '使用教程', path: '/help' },
      { label: '常见问题', path: '/help' },
      { label: '联系客服', path: '/help' },
    ],
  },
  {
    title: '关于我们',
    links: [
      { label: '公司介绍', path: '/' },
      { label: '隐私政策', path: '/' },
      { label: '服务条款', path: '/' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="container 2xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">标大王</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              标大王是专业的招投标文件智能错检系统，帮助企业快速识别招标文件中的各类错误，提升投标质量与中标率。
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@biaodawang.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>400-888-8888</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>北京市海淀区中关村科技园</span>
              </div>
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © 2024 标大王 版权所有 | 文件加密存储，保障数据安全
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Shield className="w-4 h-4" />
            <span>采用HTTPS加密传输，保护您的文件安全</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
