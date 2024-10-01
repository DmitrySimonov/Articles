import { useMyArticles } from '@/articles-client/api/hooks';
import { Article } from '@/articles-shared/api';
import { useIntersectionObserver } from '@/client-base/hooks/useIntersectionObserver';
import { Skeleton } from '@/client-base/ui/Skeleton';
import DataTable, { TableColumn } from '@/client-base/ui/tables/DataTable';
import { getColorsMarketDirection } from '@/client-base/ui/utils/getColorsMarketDirection';
import { format } from 'date-fns';
import { useRef } from 'react';
import { formatPrice } from '@/client-base/utils/formatPrice';
import { useNavigate } from 'react-router-dom';
import { Routes } from '@/client-base/constants/Routes';

const transformData = (date: string | Date) => {
  return format(date, 'dd/MM/yyyy');
};

const columns: TableColumn<Article>[] = [
  {
    header: 'PUBLISHED',
    render: (data) => (data.publishedAt ? transformData(data.publishedAt) : null),
    cellClass: '',
  },
  {
    header: 'TICKER',
    cellClass: 'text-general-label font-semibold',
    render: (data) => data.symbols?.map((s) => s.symbol)?.join(', '),
  },
  {
    header: 'NAME',
    render: (data) => data.title,
    cellClass: 'truncate max-w-80 block',
  },
  {
    header: 'SECTOR / INDUSTRY',
    cellClass: 'text-xs uppercase',
    render: (data) => data.sector,
  },
  {
    header: 'PRICE ($)',
    render: (data) => formatPrice(data.price),
    cellClass: '',
  },
  {
    header: 'STATUS',
    render: (data) => (
      <span className={`capitalize ${getColorsMarketDirection(data.marketDirection)}`}>{data.marketDirection}</span>
    ),
    cellClass: '',
  },
  {
    header: 'STATUS',
    render: (data) => <span className={`capitalize`}>{data.status}</span>,
    cellClass: '',
  },
];

export function MyInsightsLayout() {
  const navigate = useNavigate();
  const { articles, loadMore, isLoading } = useMyArticles(
    {
      take: 12,
    },
    { publishedAt: -1 },
  );

  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

  useIntersectionObserver({
    target: loadMoreTriggerRef.current,
    onIntersect: loadMore,
    disabled: false,
  });

  const getRowClassName = () => {
    return 'hover:bg-form-input-secondary/50 cursor-pointer';
  };

  return (
    <div className="bg-general-dark rounded-xl py-3 px-2.5 rounded-tl-none h-[calc(100vh-210px)]">
      <div className="overflow-y-auto h-full custom-scrollbar">
        <DataTable
          stickyHeader
          columns={columns}
          data={articles}
          getRowClassName={getRowClassName}
          rowClick={(data) => {
            navigate(
              `/${Routes.research}/${Routes.researchMyInsights}/${data._id}`, // TODO: generate url from Routes
            );
          }}
        />
        {isLoading ? <Skeleton className="w-full h-[40px] col" /> : null}
        <div ref={loadMoreTriggerRef} />
      </div>
    </div>
  );
}
