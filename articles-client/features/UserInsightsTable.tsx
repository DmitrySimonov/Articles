import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { twm } from '@/client-base/utils/twm';
import { Text } from '@/client-base/ui';
import { Article } from '@/articles-shared/api';
import { useArticles } from '@/articles-client/api/hooks';
import { Routes } from '@/client-base/constants/Routes';
import { AdvanceInsightsTable } from '@/articles-client/components';
import { RoundedBox } from '@/client-base/ui';

type Props = {
  userId?: string;
  className?: string;
};

export function UserInsightsTable({ userId, className }: Props) {
  const navigate = useNavigate();

  const { articles } = useArticles(
    {
      take: 6,
      userId,
    },
    { publishedAt: -1 },
  );

  const handleInsightClick = useCallback((item: Article) => {
    navigate(Routes.InsightDetails(item._id?.toString()));
  }, []);

  if (!articles?.length) return null;

  return (
    <RoundedBox className={twm('w-full bg-general-dark', className)}>
      <Text size="xl" font="secondary" className="font-medium text-brand-primary block mb-2.5">
        Research
      </Text>
      <AdvanceInsightsTable
        stickyHeader={false}
        insights={articles}
        onRowClick={handleInsightClick}
        excludeColumns={['expert']}
      />
    </RoundedBox>
  );
}
