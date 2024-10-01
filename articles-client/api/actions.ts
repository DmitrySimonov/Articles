import { Article, GetArticlesOptions } from '@/articles-shared/api';
import { CreateArticleOptions, UpdateArticleOptions } from '@/articles-shared/api/types/articles';
import { createPrivateAPI } from '@/client-base/transport/api';
import { ID } from '@/shared/types/id';
import { Paginated } from '@/shared/types/pagination';
import { PresignedUrl } from '@/shared/types/presigned-url';
import { ArticleSearchFuzzyOptions } from '@/articles-shared/api/types/articles-search-fuzzy.options';

const API = createPrivateAPI({
  baseURL: import.meta.env.VITE_ARTICLES_API_URL,
});

export const BASE_URL_ARTICLES = 'api/articles';

export const API_ARTICLES_URL = {
  GET_ARTICLE: BASE_URL_ARTICLES,
  GET_ARTICLES: BASE_URL_ARTICLES,
  GET_MY_ARTICLES: `${BASE_URL_ARTICLES}/my`,
  CREATE_ARTICLE: BASE_URL_ARTICLES,
  PRESIGNED_URL: `${BASE_URL_ARTICLES}/presigned-url`,
  SIGNED_URL: `${BASE_URL_ARTICLES}/signed-file-url`,
  ARTICLES_SEARCH: `${BASE_URL_ARTICLES}/search`,
};

export async function getArticles(args?: GetArticlesOptions): Promise<Paginated<Article>> {
  const res = await API.get<Paginated<Article>>(API_ARTICLES_URL.GET_ARTICLES, {
    params: args,
  });

  return res?.data || null;
}

export async function searchArticles(args?: ArticleSearchFuzzyOptions): Promise<Paginated<Article>> {
  const res = await API.get<Paginated<Article>>(API_ARTICLES_URL.ARTICLES_SEARCH, {
    params: args,
  });

  return res?.data || null;
}

export async function getMyArticles(args?: GetArticlesOptions): Promise<Paginated<Article>> {
  const res = await API.get<Paginated<Article>>(API_ARTICLES_URL.GET_MY_ARTICLES, {
    params: args,
  });

  return res?.data || null;
}

export async function getArticleById(id: string): Promise<Article> {
  const res = await API.get<Article>(`${API_ARTICLES_URL.GET_ARTICLE}/${id}`);

  return res?.data || null;
}

export async function createArticle(key: string, arg: CreateArticleOptions): Promise<Pick<Article, '_id'>> {
  const res = await API.post<Article>(key, arg);
  return res.data;
}

export async function publishArticle(key: string): Promise<Pick<Article, '_id'>> {
  const res = await API.patch<Article>(key);
  return res.data;
}

export async function updateArticle(key: string, arg: UpdateArticleOptions): Promise<Article> {
  const res = await API.put<Article>(key, arg);
  return res.data;
}

export async function getPreSignedUrl(articleId: ID | undefined): Promise<PresignedUrl> {
  const res = await API.get(`${API_ARTICLES_URL.PRESIGNED_URL}/${articleId}`);
  return res.data;
}

export async function getPreSignedFileUrl(articleId: ID): Promise<{ url: string }> {
  const res = await API.get(`${API_ARTICLES_URL.SIGNED_URL}/${articleId}`);
  return res.data;
}

export async function uploadFile(file: Blob, type: string, articleId: ID | undefined) {
  const { presignedUrl, originUrl, name } = await getPreSignedUrl(articleId);

  await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': type,
    },
  });

  return { fileUrl: originUrl, fileName: name };
}
