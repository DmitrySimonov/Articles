import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyArticles } from '@/articles-client/api/hooks';
import { Article, ArticleStatus } from '@/articles-shared/api';
import { Routes } from '@/client-base/constants/Routes';
import { InsightsTable } from '@/articles-client/components';

type Props = {
  ric: string;
};

export function CompanyInsightsTable({ ric }: Props) {
  const { articles, isLoading } = useMyArticles(
    {
      take: 6,
      status: ArticleStatus.PUBLISHED,
      ric: ric,
    },
    { publishedAt: -1 },
  );
  const navigate = useNavigate();

  const handleInsightClick = useCallback((item: Article) => {
    navigate(Routes.InsightDetails(item._id?.toString()));
  }, []);

  return <InsightsTable label="Research" insights={articles} isLoading={isLoading} onRowClick={handleInsightClick} />;
}
