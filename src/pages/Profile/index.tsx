import { useState } from 'react';
import { User, FileText, Settings, Shield, Clock, LogOut, ChevronRight, Search, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { toast } from '@/components/common/Toast';
import { cn } from '@/components/common/Button';

const menuItems = [
  { id: 'history', label: '历史文件', icon: FileText },
  { id: 'account', label: '账号设置', icon: Settings },
  { id: 'permissions', label: '权限管理', icon: Shield },
  { id: 'logs', label: '操作日志', icon: Clock },
];

const historyRecords = [
  { id: '1', fileName: '某市政府采购项目招标文件.docx', checkTime: '2024-01-15 14:30', errorCount: 23, status: 'completed' },
  { id: '2', fileName: '工程建设施工招标文件.docx', checkTime: '2024-01-14 10:20', errorCount: 15, status: 'completed' },
  { id: '3', fileName: 'IT系统集成招标文件.pdf', checkTime: '2024-01-13 16:45', errorCount: 8, status: 'completed' },
  { id: '4', fileName: '物业服务采购招标文件.docx', checkTime: '2024-01-12 09:15', errorCount: 31, status: 'completed' },
];

export function ProfilePage() {
  const [activeMenu, setActiveMenu] = useState('history');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = historyRecords.filter((record) =>
    record.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContent = () => {
    switch (activeMenu) {
      case 'history':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">历史文件</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索文件..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
            <div className="space-y-3">
              {filteredRecords.map((record) => (
                <Card key={record.id} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{record.fileName}</div>
                    <div className="text-sm text-gray-500">{record.checkTime}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={record.errorCount > 20 ? 'error' : record.errorCount > 10 ? 'warning' : 'success'}>
                      {record.errorCount} 个错误
                    </Badge>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => toast.success('文件已删除')}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'account':
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">账号设置</h2>
            <div className="max-w-xl space-y-6">
              <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
                <div className="w-20 h-20 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  张
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">张明</h3>
                  <p className="text-gray-500">zhangming@example.com</p>
                  <Badge variant="info" className="mt-2">管理员</Badge>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">姓名</label>
                  <input type="text" defaultValue="张明" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
                  <input type="email" defaultValue="zhangming@example.com" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">手机号</label>
                  <input type="tel" defaultValue="138****8888" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <div className="pt-4">
                  <Button variant="primary">保存修改</Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'permissions':
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">权限管理</h2>
            <Card className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">团队成员</h3>
                <Button variant="primary" size="sm">添加成员</Button>
              </div>
              <div className="space-y-3">
                {[
                  { name: '张明', email: 'zhangming@example.com', role: 'admin' },
                  { name: '李华', email: 'lihua@example.com', role: 'editor' },
                  { name: '王芳', email: 'wangfang@example.com', role: 'member' },
                ].map((member) => (
                  <div key={member.email} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </div>
                    <Badge variant={member.role === 'admin' ? 'error' : member.role === 'editor' ? 'warning' : 'default'}>
                      {member.role === 'admin' ? '管理员' : member.role === 'editor' ? '编辑' : '成员'}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      case 'logs':
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">操作日志</h2>
            <div className="space-y-4">
              {[
                { action: '上传文件', detail: '某市政府采购项目招标文件.docx', time: '2024-01-15 14:30', type: 'upload' },
                { action: '完成检查', detail: '发现 23 处错误', time: '2024-01-15 14:32', type: 'check' },
                { action: '导出报告', detail: 'PDF 格式', time: '2024-01-15 14:35', type: 'download' },
                { action: '修改账号', detail: '更新个人信息', time: '2024-01-14 10:00', type: 'edit' },
              ].map((log, idx) => (
                <Card key={idx}>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-accent mt-2" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{log.action}</span>
                        <span className="text-sm text-gray-500">{log.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{log.detail}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container 2xl py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">个人中心</h1>
          <p className="text-gray-600">管理您的文件、历史记录和账号设置</p>
        </div>
      </div>

      <div className="container 2xl py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-64">
            <Card className="p-2">
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveMenu(item.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                      activeMenu === item.id
                        ? 'bg-accent text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </button>
                ))}
              </nav>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button variant="ghost" className="w-full justify-start text-error hover:bg-error/5">
                  <LogOut className="w-5 h-5 mr-2" />
                  退出登录
                </Button>
              </div>
            </Card>
          </div>

          <div className="flex-1">
            <Card>{renderContent()}</Card>
          </div>
        </div>
      </div>
    </div>
  );
}
