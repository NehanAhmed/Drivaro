// components/admin/reports-card.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Eye,
  DollarSign,
  CreditCard,
  Users,
  Car,
} from 'lucide-react';

// Map of icon names to components
const iconMap = {
  DollarSign,
  CreditCard,
  Users,
  Car,
};

interface ReportCardProps {
  title: string;
  description: string;
  iconName: keyof typeof iconMap;  // Changed from icon component to string
  iconColor: string;
  iconBg: string;
  stats: { label: string; value: string }[];
  reportType: string;
}

export function ReportCard({
  title,
  description,
  iconName,  // Now a string
  iconColor,
  iconBg,
  stats,
  reportType,
}: ReportCardProps) {
  const Icon = iconMap[iconName];  // Get the actual component here
  
  const handleDownload = () => {
    console.log(`Downloading ${reportType} report...`);
  };

  const handleView = () => {
    console.log(`Viewing ${reportType} report...`);
  };

  return (
    <Card className="border-border/50 hover:shadow-lg transition-all group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-3 rounded-xl ${iconBg} group-hover:scale-110 transition-transform`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <span className="font-semibold">{stat.value}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-2 border-t border-border/50">
          <Button variant="outline" size="sm" className="flex-1" onClick={handleView}>
            <Eye className="h-3 w-3 mr-2" />
            View
          </Button>
          <Button size="sm" className="flex-1" onClick={handleDownload}>
            <Download className="h-3 w-3 mr-2" />
            Export
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}