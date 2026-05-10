import { useState } from 'react';
import { Search, FileText, Download, Eye, Upload, Filter, Trash2, Edit2, Plus, X, Check } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { toast } from '@/components/common/Toast';
import type { Template, Industry } from '@/types';
import { cn } from '@/components/common/Button';

const industryLabels: Record<Industry, { label: string; color: string }> = {
  engineering: { label: '工程类', color: 'bg-purple-100 text-purple-700' },
  goods: { label: '货物类', color: 'bg-blue-100 text-blue-700' },
  service: { label: '服务类', color: 'bg-green-100 text-green-700' },
  government: { label: '政府采购', color: 'bg-orange-100 text-orange-700' },
};

const defaultTemplates: Template[] = [
  { id: '1', name: '政府采购货物类招标文件', industry: 'government', downloads: 12580, description: '适用于政府采购货物采购项目，含完整格式规范' },
  { id: '2', name: '工程建设施工招标文件', industry: 'engineering', downloads: 8920, description: '建筑、市政、水利等工程施工项目标准模板' },
  { id: '3', name: '服务类采购招标文件', industry: 'service', downloads: 5680, description: '物业管理、保洁服务、法律顾问等服务类项目' },
  { id: '4', name: '货物设备采购招标文件', industry: 'goods', downloads: 7340, description: '办公设备、医疗器械、教学设备等货物采购' },
  { id: '5', name: '政府采购服务项目', industry: 'government', downloads: 4320, description: '政府向社会力量购买服务项目标准模板' },
  { id: '6', name: 'EPC工程总承包招标文件', industry: 'engineering', downloads: 3150, description: '设计、采购、施工一体化总承包项目模板' },
];

export function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>(defaultTemplates);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: 'engineering' as Industry,
  });

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === 'all' || template.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  const handleDownload = (template: Template) => {
    toast.success(`开始下载: ${template.name}`);
  };

  const handlePreview = (template: Template) => {
    toast.info(`预览: ${template.name}`);
  };

  const handleAdd = () => {
    setEditingTemplate(null);
    setFormData({ name: '', description: '', industry: 'engineering' });
    setShowModal(true);
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description,
      industry: template.industry,
    });
    setShowModal(true);
  };

  const handleDelete = (template: Template) => {
    if (confirm(`确定要删除模板"${template.name}"吗？`)) {
      setTemplates(templates.filter(t => t.id !== template.id));
      toast.success('模板已删除');
    }
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error('请输入模板名称');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('请输入模板描述');
      return;
    }

    if (editingTemplate) {
      setTemplates(templates.map(t => 
        t.id === editingTemplate.id 
          ? { ...t, ...formData }
          : t
      ));
      toast.success('模板已更新');
    } else {
      const newTemplate: Template = {
        id: String(Date.now()),
        name: formData.name,
        description: formData.description,
        industry: formData.industry,
        downloads: 0,
      };
      setTemplates([newTemplate, ...templates]);
      toast.success('模板已添加');
    }
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container 2xl py-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary">模板库</h1>
              <p className="text-gray-600 mt-1">内置各行业标准招标模板，支持自定义模板上传</p>
            </div>
            <Button variant="primary" onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              添加模板
            </Button>
          </div>
        </div>
      </div>

      <div className="container 2xl py-8">
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索模板名称或描述..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: '全部' },
              { value: 'engineering', label: '工程类' },
              { value: 'goods', label: '货物类' },
              { value: 'service', label: '服务类' },
              { value: 'government', label: '政府采购' },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedIndustry(filter.value as Industry | 'all')}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                  selectedIndustry === filter.value
                    ? 'bg-accent text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 text-sm text-gray-500">
          共 {filteredTemplates.length} 个模板
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="group">
              <div className="w-12 h-12 bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-accent" />
              </div>
              <div className="flex items-start justify-between mb-3">
                <span className={cn('inline-block px-2 py-1 text-xs font-medium rounded', industryLabels[template.industry].color)}>
                  {industryLabels[template.industry].label}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(template)}
                    className="p-1.5 text-gray-400 hover:text-accent hover:bg-accent/10 rounded"
                    title="编辑"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(template)}
                    className="p-1.5 text-gray-400 hover:text-error hover:bg-error/10 rounded"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{template.name}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{template.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Download className="w-4 h-4" />
                  <span>{template.downloads.toLocaleString()}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handlePreview(template)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => handleDownload(template)}>
                    <Download className="w-4 h-4 mr-1" />
                    下载
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">没有找到匹配的模板</p>
            <Button variant="primary" onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              添加新模板
            </Button>
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingTemplate ? '编辑模板' : '添加模板'}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">模板名称</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="请输入模板名称"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">模板描述</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="请输入模板描述"
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">行业分类</label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(industryLabels) as Industry[]).map((industry) => (
                <button
                  key={industry}
                  onClick={() => setFormData({ ...formData, industry })}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                    formData.industry === industry
                      ? 'bg-accent text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {industryLabels[industry].label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">上传模板文件</label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-accent/50 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">点击或拖拽文件到此区域上传</p>
              <p className="text-xs text-gray-400 mt-1">支持 .doc、.docx、.pdf 格式</p>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              取消
            </Button>
            <Button variant="primary" onClick={handleSave}>
              <Check className="w-4 h-4 mr-1" />
              保存
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
