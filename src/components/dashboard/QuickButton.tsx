import React from 'react';
import { Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickButtonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  Component: React.ReactNode;
}

const QuickButton: React.FC<QuickButtonProps> = ({ icon, title, description, Component }) => {
  return (
    <div className="flex items-center space-x-4 rounded-md border p-4">
      {icon}
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {Component}
    </div>
  );
};

export default QuickButton;