import { useCallback } from 'react';
import { Article } from '@/articles-shared/api';
import { Skeleton, Text } from '@/client-base/ui';
import DataTable, { TableColumn } from '@/client-base/ui/tables/DataTable';
import { transformData } from '@/client-base/utils/transformData';
import { twm } from '@/client-base/utils/twm';

const columns: TableColumn<Article>[] = [
  {
    header: '',
    render: (data) => transformData(data?.publishedAt, 'dd MMM'),
    cellClassText: 'text-brand-primary',
  },
  {
    header: '',
    cellClassText: 'truncate max-w-80 block text-general-label',
    render: (data) => data.symbols.map((s) => s.symbol).join(', '),
  },
  {
    header: '',
    render: (data) => data.title,
    cellClassText: 'truncate max-w-80 block text-brand-primary',
  },
];

type Props = {
  insights: Article[];
  className?: string;
  isLoading?: boolean;
  onRowClick?: (insight: Article) => void;
  label?: string;
  labelClassName?: string;
};

export function InsightsTable({ insights, className, isLoading, onRowClick, label, labelClassName }: Props) {
  const handleRowClick = useCallback((item: Article) => {
    onRowClick?.(item);
  }, []);

  const getRowClassName = () => {
    return 'hover:bg-form-input-secondary/50 cursor-pointer';
  };

  return (
    <div className={twm('bg-general-dark rounded-xl py-3 px-2.5 rounded-tl-none', className)}>
      {label && (
        <Text font="secondary" size="sm" className={twm('block text-general-light mb-5', labelClassName)}>
          {label}
        </Text>
      )}
      {insights.length > 0 ? (
        <DataTable getRowClassName={getRowClassName} rowClick={handleRowClick} columns={columns} data={insights} />
      ) : (
        <p className="text-sm tracking-normal font-secondary text-general-light mb-5">No insights</p>
      )}

      {isLoading ? <Skeleton className="w-full h-[40px] col" /> : null}
    </div>
  );
}
