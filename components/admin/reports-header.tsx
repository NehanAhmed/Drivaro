// components/admin/reports/reports-header.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Download, FileText, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';

export function ReportsHeader() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleExport = (type: string) => {
    console.log(`Exporting ${type} report...`);
    // Implement export logic here
  };

  return (
    <div className="space-y-6">
      {/* Title Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Financial Reports & Analytics
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive financial overview and downloadable reports
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <CalendarIcon className="h-4 w-4" />
                {date ? format(date, 'PPP') : 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>

          <Button className="gap-2" onClick={() => handleExport('all')}>
            <Download className="h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>

      {/* Quick Export Options */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleExport('revenue')}
          className="gap-2"
        >
          <FileText className="h-3 w-3" />
          Revenue CSV
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleExport('transactions')}
          className="gap-2"
        >
          <FileText className="h-3 w-3" />
          Transactions CSV
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleExport('vendors')}
          className="gap-2"
        >
          <FileText className="h-3 w-3" />
          Vendors CSV
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleExport('pdf')}
          className="gap-2"
        >
          <FileText className="h-3 w-3" />
          Full Report PDF
        </Button>
      </div>
    </div>
  );
}