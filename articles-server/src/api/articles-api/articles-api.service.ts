import { Injectable } from '@nestjs/common';
import { User } from '@/server-base/auth';
import { ID } from '@/shared/types/id';
import { SortOptions } from '@/shared/types/pagination';
import { GetArticlesOptions } from 'shared/api';
import { Article, ArticleStatus, CreateArticleOptions, UpdateArticleOptions } from 'shared/api/types/articles';
import { ArticlesValidationService } from '~/core/articles/articles-validation.service';
import { ArticlesService } from '~/core/articles/articles.service';
import { ArticleSearchFuzzyOptions } from 'shared/api/types/articles-search-fuzzy.options';

@Injectable()
export class ArticlesApiService {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly articlesValidationService: ArticlesValidationService,
  ) {}

  public async getArticles(filterOptions: GetArticlesOptions, sortOptions: SortOptions<Article>) {
    return this.articlesService.getArticle(filterOptions, sortOptions);
  }

  public async searchArticlesFuzzy(searchRequest: ArticleSearchFuzzyOptions, sortOptions: SortOptions<Article>) {
    return this.articlesService.searchArticlesFuzzy(searchRequest, sortOptions);
  }

  public async getArticleById(articleId: ID) {
    return this.articlesService.getArticleById(articleId);
  }

  public async getMyArticles(userId: string, filterOptions: GetArticlesOptions, sortOptions: SortOptions<Article>) {
    return this.articlesService.getMyArticle(userId, filterOptions, sortOptions);
  }

  public async getSignedUrl(articleId: ID) {
    return this.articlesService.getSignedUrl(articleId);
  }

  public async getSignedFileUrl(articleId: ID, userId: string) {
    return this.articlesService.getSignedFileUrl(articleId, userId);
  }

  public async createArticle(user: User, body: CreateArticleOptions) {
    return this.articlesService.createArticle(user, body);
  }

  public async updateArticle(articleId: ID, options: UpdateArticleOptions) {
    return this.articlesService.updateArticle(articleId, options);
  }

  public async deleteArticle(articleId: string) {
    return this.articlesService.deleteArticle(articleId);
  }

  public async changeArticleStatusToPublished(articleId: ID) {
    const article = await this.getArticleById(articleId);

    await this.articlesValidationService.validateArticle({
      ...article,
      status: ArticleStatus.PUBLISHED,
      publishedAt: new Date(),
    });

    return this.articlesService.changeStatus(articleId, ArticleStatus.PUBLISHED);
  }

  public async changeArticleStatusToDraft(articleId: ID) {
    return this.articlesService.changeStatus(articleId, ArticleStatus.DRAFT);
  }
}
