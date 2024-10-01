import React, { useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Select } from '@/client-base/ui';
import { Article } from '@/articles-shared/api';
import { useArticlesSearch } from '@/articles-client/api/hooks';
import { SearchInput } from '@/client-base/ui/inputs/Search';
import { useDebounce } from '@/client-base/hooks/useDebounce';
import { useIntersectionObserver } from '@/client-base/hooks/useIntersectionObserver';
import { Option } from '@/client-base/abstractions/select';
import { Routes } from '@/client-base/constants/Routes';
import { AdvanceInsightsTable } from '@/articles-client/components';

type TOptionValues = 1 | -1;

const sortOptions: Option<TOptionValues>[] = [
  {
    label: 'Most recent',
    value: -1,
  },
  {
    label: 'Latest',
    value: 1,
  },
];

export function ResearchInsightsTable() {
  const [selectedOption, setSelectedOption] = React.useState<TOptionValues>(-1);
  const [searchTitle, setSearchTitle] = React.useState<string>('');
  const debouncedSearch = useDebounce(searchTitle, 500);
  const navigate = useNavigate();

  const { articles, setSize } = useArticlesSearch(
    {
      take: 10,
      filter: debouncedSearch || '',
    },
    { publishedAt: selectedOption },
  );

  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

  useIntersectionObserver({
    target: loadMoreTriggerRef.current,
    onIntersect: () => setSize((size) => size + 1),
    disabled: false,
  });

  const handleInsightClick = useCallback((item: Article) => {
    navigate(Routes.InsightDetails(item._id?.toString()));
  }, []);

  return (
    <div className="bg-general-dark rounded-xl py-3 px-2.5 rounded-tl-none">
      <div className="flex flex-row justify-between w-full mb-4">
        <SearchInput
          value={searchTitle}
          onChange={(value: string) => {
            setSearchTitle(value);
          }}
        />
        <Select
          options={sortOptions}
          value={selectedOption}
          onChange={(value) => setSelectedOption(value)}
          className="w-[150px]"
        />
      </div>
      <div className="overflow-y-auto h-[calc(100vh-260px)] custom-scrollbar">
        <AdvanceInsightsTable stickyHeader insights={articles} onRowClick={handleInsightClick} />
      </div>
      <div ref={loadMoreTriggerRef} />
    </div>
  );
}
