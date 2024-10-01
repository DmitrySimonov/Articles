import {
  API_ARTICLES_URL,
  BASE_URL_ARTICLES,
  createArticle,
  getArticleById,
  getArticles,
  getMyArticles,
  publishArticle,
  updateArticle,
  searchArticles,
} from './actions';
import useSWRInfinite from 'swr/infinite';
import { Paginated, SortOptions } from '@/shared/types/pagination';
import { useCallback, useMemo } from 'react';
import { Article, GetArticlesOptions } from '@/articles-shared/api';
import useSWRMutation from 'swr/mutation';
import useSWR from 'swr';
import { useAuthGuard } from '@/client-base/auth';
import { ID } from '@/shared/types/id';
import { CreateArticleOptions, UpdateArticleOptions } from '@/articles-shared/api/types/articles';
import { ArticleSearchFuzzyOptions } from '@/articles-shared/api/types/articles-search-fuzzy.options';

export function useArticles(args?: Omit<GetArticlesOptions, 'next'>, sortOption?: SortOptions<Article>) {
  const getKey = (_: number, previousPageData: any) => {
    if (previousPageData && !previousPageData?.next) return null;

    return {
      ...args,
      next: previousPageData?.next || null,
      sort: sortOption,
    };
  };

  const { data, isLoading, setSize } = useSWRInfinite<Paginated<Article>>(getKey, async (args) => {
    const res = await getArticles(args);
    return res || { data: [], next: null };
  });

  const articles = useMemo(() => (data ? data.map((page) => page.data).flat() : []), [data]);

  return {
    isLoading,
    setSize,
    articles,
  };
}

export function useArticlesSearch(args?: Omit<ArticleSearchFuzzyOptions, 'next'>, sortOption?: SortOptions<Article>) {
  const getKey = (_: number, previousPageData: any) => {
    if (previousPageData && !previousPageData?.next) return null;

    return {
      ...args,
      next: previousPageData?.next || null,
      sort: sortOption,
    };
  };

  const { data, isLoading, setSize } = useSWRInfinite<Paginated<Article>>(getKey, async (args) => {
    const res = await searchArticles(args);
    return res || { data: [], next: null };
  });

  const articles = useMemo(() => (data ? data.map((page) => page.data).flat() : []), [data]);

  return {
    isLoading,
    setSize,
    articles,
  };
}

export function useMyArticles(args?: Omit<GetArticlesOptions, 'next'>, sortOption?: SortOptions<Article>) {
  const getKey = (_: number, previousPageData: any) => {
    if (previousPageData && !previousPageData?.next) return null;

    return {
      ...args,
      next: previousPageData?.next || null,
      sort: sortOption,
    };
  };

  const { data, isLoading, setSize } = useSWRInfinite<Paginated<Article>>(getKey, async (args) => {
    const res = await getMyArticles(args);
    return res || { data: [], next: null };
  });

  const articles = useMemo(() => (data ? data.map((page) => page.data).flat() : []), [data]);
  const loadMore = useCallback(() => setSize((size) => size + 1), [setSize]);

  return {
    isLoading,
    loadMore,
    articles,
  };
}

export function useCreateInsight() {
  const enabled = useAuthGuard(null, 'useCreateInsight');
  return useSWRMutation(
    enabled ? API_ARTICLES_URL.CREATE_ARTICLE : null,
    (key: string, { arg }: { arg: CreateArticleOptions }) => {
      return createArticle(key, arg);
    },
  );
}
export function useUpdateInsight(id: ID | undefined) {
  const enabled = useAuthGuard(null, 'useUpdateInsight');
  return useSWRMutation(
    enabled && id ? `${BASE_URL_ARTICLES}/${id}` : null,
    (key: string, { arg }: { arg: UpdateArticleOptions }) => {
      updateArticle(key, arg);
    },
  );
}

export function usePublishInsight(id: ID | undefined) {
  const enabled = useAuthGuard(null, 'useUpdateInsight');
  return useSWRMutation(enabled ? `${BASE_URL_ARTICLES}/${id}/published` : null, (key) => {
    return publishArticle(key);
  });
}

export function useGetInsight(id: string | undefined) {
  const enabled = useAuthGuard(null, 'useGetInsight');
  return useSWR(enabled && id ? [API_ARTICLES_URL.GET_ARTICLE, id] : null, ([, id]) => getArticleById(id as string));
}
