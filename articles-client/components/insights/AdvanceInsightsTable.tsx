import { Fragment, useCallback } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/client-base/ui/tables/BaseTable';
import { Text } from '@/client-base/ui';
import { groupBy } from '@/client-base/utils/groupArrayOfObjByKey';
import { format } from 'date-fns';
import { Article } from '@/articles-shared/api';
import { getColorsMarketDirection } from '@/client-base/ui/utils/getColorsMarketDirection';
import { formatPrice } from '@/client-base/utils/formatPrice';

type ColumnOptions = 'expert' | 'name' | 'published' | 'ticker' | 'sector' | 'price' | 'status';

type Props = {
  insights: Article[];
  onRowClick?: (item: Article) => void;
  stickyHeader?: boolean;
  excludeColumns?: ColumnOptions[];
};

export function AdvanceInsightsTable({ insights, onRowClick, stickyHeader = true, excludeColumns = [] }: Props) {
  const transformData = (date: string | Date) => {
    return format(date, 'dd/MM/yyyy');
  };

  const sortedArticles = groupBy<Article>(insights, 'publishedAt', transformData);

  const articlesKeys = Object.keys(sortedArticles);

  function isPreviousDay(dateString: string) {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return transformData(date) === dateString;
  }

  const renderDate = (date: string) => {
    if (isPreviousDay(date)) return 'YESTERDAY';
    else if (date === transformData(new Date())) return 'TODAY';
    else return date;
  };

  const handleRowClick = useCallback(
    (item: Article) => {
      onRowClick?.(item);
    },
    [onRowClick],
  );

  const shouldExcludeColumn = (column: ColumnOptions) => excludeColumns.includes(column);

  return (
    <Table stickyHeader={stickyHeader}>
      <TableHeader className="h-[40px] sticky top-0 z-10 bg-general-dark">
        {!shouldExcludeColumn('published') && (
          <TableHead>
            <Text className="text-brand-primary text-xs font-medium">PUBLISHED</Text>
          </TableHead>
        )}
        {!shouldExcludeColumn('ticker') && (
          <TableHead>
            <Text className="text-brand-primary text-xs font-medium">TICKER</Text>
          </TableHead>
        )}
        {!shouldExcludeColumn('name') && (
          <TableHead>
            <Text className="text-brand-primary text-xs font-medium">NAME</Text>
          </TableHead>
        )}
        {!shouldExcludeColumn('sector') && (
          <TableHead>
            <Text className="text-brand-primary text-xs font-medium">SECTOR / INDUSTRY</Text>
          </TableHead>
        )}
        {!shouldExcludeColumn('expert') && (
          <TableHead>
            <Text className="text-brand-primary text-xs font-medium">EXPERT / ANALYST</Text>
          </TableHead>
        )}
        {!shouldExcludeColumn('price') && (
          <TableHead>
            <Text className="text-brand-primary text-xs font-medium">PRICE ($)</Text>
          </TableHead>
        )}
        {!shouldExcludeColumn('status') && (
          <TableHead>
            <Text className="text-brand-primary text-xs font-medium">STATUS</Text>
          </TableHead>
        )}
      </TableHeader>
      <TableBody>
        {articlesKeys.map((item) => {
          return (
            <Fragment key={item}>
              <TableRow className="border-b-0">
                <TableCell className="col-span-9">
                  <Text className="text-brand-primary font-semibold text-base">{renderDate(item)}</Text>
                </TableCell>
              </TableRow>
              {sortedArticles[item].map((articleItem) => {
                return (
                  <TableRow
                    key={articleItem._id?.toString()}
                    onClick={() => handleRowClick(articleItem)}
                    className="border-brand-primary/20 cursor-pointer hover:bg-form-input-secondary/50"
                  >
                    {!shouldExcludeColumn('published') && (
                      <TableCell>
                        <Text className="text-sm font-normal">
                          {articleItem.publishedAt ? transformData(articleItem.publishedAt) : null}
                        </Text>
                      </TableCell>
                    )}
                    {!shouldExcludeColumn('ticker') && (
                      <TableCell>
                        <Text className="text-sm font-semibold text-general-label">
                          {articleItem.symbols?.map((s) => s.symbol)?.join(', ')}
                        </Text>
                      </TableCell>
                    )}
                    {!shouldExcludeColumn('name') && (
                      <TableCell>
                        <Text className="text-sm font-normal">{articleItem?.title}</Text>
                      </TableCell>
                    )}
                    {!shouldExcludeColumn('sector') && (
                      <TableCell>
                        <Text className="text-xs font-normal uppercase">{articleItem?.sector}</Text>
                      </TableCell>
                    )}
                    {!shouldExcludeColumn('expert') && (
                      <TableCell>
                        <Text className="text-sm font-normal">
                          {`${articleItem?.userProfile?.pronounce || ''} ${articleItem?.userProfile?.firstName || ''} ${articleItem?.userProfile?.lastName || ''}`}
                        </Text>
                      </TableCell>
                    )}
                    {!shouldExcludeColumn('price') && (
                      <TableCell>
                        <Text className="text-sm font-normal">{formatPrice(articleItem?.price)}</Text>
                      </TableCell>
                    )}
                    {!shouldExcludeColumn('status') && (
                      <TableCell>
                        <Text
                          className={`text-sm font-normal capitalize ${getColorsMarketDirection(articleItem.marketDirection)}`}
                        >
                          {articleItem?.marketDirection}
                        </Text>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
}
