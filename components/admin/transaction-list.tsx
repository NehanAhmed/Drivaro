// components/admin/reports/transactions-list.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Search,
  Download,
  CreditCard,
  RefreshCw,
} from 'lucide-react';
import { useState } from 'react';

interface Transaction {
  id: string;
  bookingNumber: string;
  userName: string;
  type: string;
  amount: string;
  status: string;
  paymentMethod: string | null;
  createdAt: Date;
}

interface TransactionsListProps {
  transactions: Transaction[];
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const typeConfig: Record<string, { label: string; icon: any; color: string }> = {
    payment: {
      label: 'Payment',
      icon: ArrowUpRight,
      color: 'text-green-600 dark:text-green-400',
    },
    refund: {
      label: 'Refund',
      icon: ArrowDownRight,
      color: 'text-red-600 dark:text-red-400',
    },
    payout: {
      label: 'Payout',
      icon: ArrowDownRight,
      color: 'text-blue-600 dark:text-blue-400',
    },
    deposit_hold: {
      label: 'Deposit Hold',
      icon: ArrowUpRight,
      color: 'text-yellow-600 dark:text-yellow-400',
    },
    deposit_release: {
      label: 'Deposit Release',
      icon: ArrowDownRight,
      color: 'text-purple-600 dark:text-purple-400',
    },
  };

  const statusConfig: Record<string, { label: string; className: string }> = {
    pending: {
      label: 'Pending',
      className: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    },
    completed: {
      label: 'Completed',
      className: 'bg-green-500/10 text-green-700 dark:text-green-400',
    },
    failed: {
      label: 'Failed',
      className: 'bg-red-500/10 text-red-700 dark:text-red-400',
    },
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = 
      t.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Complete transaction history</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Transactions
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 pt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by booking or user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="payment">Payment</SelectItem>
              <SelectItem value="refund">Refund</SelectItem>
              <SelectItem value="payout">Payout</SelectItem>
              <SelectItem value="deposit_hold">Deposit Hold</SelectItem>
              <SelectItem value="deposit_release">Deposit Release</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CreditCard className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="font-semibold text-muted-foreground">No transactions found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => {
              const typeConf = typeConfig[transaction.type] || typeConfig.payment;
              const statusConf = statusConfig[transaction.status] || statusConfig.pending;
              const TypeIcon = typeConf.icon;

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-all hover:shadow-sm"
                >
                  {/* Transaction Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-3 rounded-full bg-muted`}>
                      <TypeIcon className={`h-5 w-5 ${typeConf.color}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold truncate">{transaction.userName}</p>
                        <Badge variant="outline" className={statusConf.className}>
                          {statusConf.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {transaction.bookingNumber} • {typeConf.label}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        {transaction.paymentMethod && (
                          <>
                            <CreditCard className="h-3 w-3" />
                            <span className="capitalize">{transaction.paymentMethod}</span>
                            <span>•</span>
                          </>
                        )}
                        <span>{new Date(transaction.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right">
                    <p className={`font-bold text-lg ${typeConf.color}`}>
                      {transaction.type === 'payment' || transaction.type === 'deposit_hold' ? '+' : '-'}
                      ${parseFloat(transaction.amount).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Load More */}
        {filteredTransactions.length > 0 && (
          <div className="flex justify-center mt-6">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Load More
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}