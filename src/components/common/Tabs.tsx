import { useState } from 'react';
import { cn } from './Button';
import { X } from 'lucide-react';

interface TabsProps {
  tabs: { id: string; label: string; count?: number }[];
  activeTab: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="flex border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200',
            activeTab === tab.id
              ? 'border-accent text-accent'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={cn(
                'ml-2 px-2 py-0.5 text-xs rounded-full',
                activeTab === tab.id ? 'bg-accent/10 text-accent' : 'bg-gray-100 text-gray-600'
              )}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
