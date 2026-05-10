import { useState } from 'react';
import { Search, FileText, Download, Eye, Upload, Filter, Star } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { toast } from '@/components/common/Toast';
import type { Template, Industry } from '@/types';
import { cn } from '@/components/common/Button';

const mockTemplates: Template[] = [
  { id: '1', name: '政府采购货物类招标文件', industry: 'government', downloads: 12580, description: '适用于政府采购货物采购项目，含完整格式规范' },
  { id: '2', name: '工程建设施工招标文件', industry: 'engineering', downloads: 8920, description: '建筑、市政、水利等工程施工项目标准模板' },
  { id: '3', name: '服务类采购招标文件', industry: 'service', downloads: 5680, description: '物业管理、保洁服务、法律顾问等服务类项目' },
  { id: '4', name: '货物设备采购招标文件', industry: 'goods', downloads: 7340, description: '办公设备、医疗器械、教学设备等货物采购' },
  { id: '5', name: '政府采购服务项目', industry: 'government', downloads: 4320, description: '政府向社会力量购买服务项目标准模板' },
  { id: '6', name: 'EPC工程总承包招标文件', industry: 'engineering', downloads: 3150, description: '设计、采购、施工一体化总承包项目模板' },
  { id: '7', name: ' IT系统集成招标文件', industry: 'goods', downloads: 2890, description: '信息化系统建设、软件开发项目标准模板' },
  { id: '8', name: '物业服务采购招标文件', industry: 'service', downloads: 4560, description: '写字楼、住宅小区、工业园区物业服务采购' },
];

const industryLabels: Record<Industry, { label: string; color: string }> = {
  engineering: { label: '工程类', color: 'bg-purple-100 text-purple-700' },
  goods: { label: '货物类', color: 'bg-blue-100 text-blue-700' },
  service: { label: '服务类', color: 'bg-green-100 text-green-700' },
  government: { label: '政府采购', color: 'bg-orange-100 text-orange-700' },
};

export function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | 'all'>('all');

  const filteredTemplates = mockTemplates.filter((template) => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container 2xl py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">模板库</h1>
          <p className="text-gray-600">内置各行业标准招标模板，支持自定义模板上传</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} hover className="group">
              <div className="w-12 h-12 bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-accent" />
              </div>
              <span className={cn('inline-block px-2 py-1 text-xs font-medium rounded mb-3', industryLabels[template.industry].color)}>
                {industryLabels[template.industry].label}
              </span>
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

        <div className="mt-12 bg-gradient-to-r from-primary to-primary-light rounded-xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">上传自定义模板</h3>
              <p className="text-gray-300">支持上传企业内部标准模板，建立专属校验规则</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="secondary" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <Upload className="w-4 h-4 mr-2" />
                上传模板
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
