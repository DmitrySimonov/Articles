import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { User } from '@/server-base/auth';
import { ID } from '@/shared/types/id';
import { Paginated, SortOptions } from '@/shared/types/pagination';
import { PresignedUrl } from '@/shared/types/presigned-url';
import { ObjectId } from 'mongodb';
import { Article, GetArticlesOptions } from 'shared/api';
import { ArticleSchema, ArticleStatus, CreateArticleOptions, UpdateArticleOptions } from 'shared/api/types/articles';
import { v4 as uuidv4 } from 'uuid';
import { S3Service } from '~/providers/s3/s3.service';
import profileConfig from './articles.config';
import { ArticlesRepository } from './articles.repository';
import { ArticleSearchFuzzyOptions } from 'shared/api/types/articles-search-fuzzy.options';

@Injectable()
export class ArticlesService {
  constructor(
    private readonly articlesRepository: ArticlesRepository,
    private readonly s3Service: S3Service,
    @Inject(profileConfig.KEY)
    private readonly config: ConfigType<typeof profileConfig>,
  ) {}

  public async getArticle(
    filterOptions: GetArticlesOptions,
    sortOptions: SortOptions<Article> = { publishedAt: -1 },
  ): Promise<Paginated<Article>> {
    return this.articlesRepository.getFilteredItems({ status: ArticleStatus.PUBLISHED, ...filterOptions }, sortOptions);
  }

  public async searchArticlesFuzzy(
    searchRequest: ArticleSearchFuzzyOptions,
    sortOptions: SortOptions<Article> = { publishedAt: -1 },
  ) {
    return this.articlesRepository.searchArticlesFuzzy(searchRequest, sortOptions);
  }

  public async getMyArticle(
    userId: string,
    filterOptions: GetArticlesOptions,
    sortOptions: SortOptions<Article> = { publishedAt: -1 },
  ): Promise<Paginated<Article>> {
    return this.articlesRepository.getFilteredItems(
      {
        status: ArticleStatus.PUBLISHED,
        ...filterOptions,
        userId,
      },
      sortOptions,
    );
  }

  public async getSignedUrl(articleId: ID): Promise<PresignedUrl> {
    const article = await this.getArticleById(articleId);

    const fileName = article?.file?.fileName || uuidv4();

    const presignedUrl = await this.s3Service.generatePreSignedPutUrl(this.config.S3_ARTICLES_BUCKET_NAME, fileName);
    const queryIndex = presignedUrl.indexOf('?');
    const originUrl = queryIndex !== -1 ? presignedUrl.slice(0, queryIndex) : presignedUrl;
    return {
      presignedUrl,
      originUrl,
      name: fileName,
    };
  }

  public async getSignedFileUrl(articleId: ID, userId: string): Promise<{ url: string }> {
    const article = await this.getArticleById(articleId);
    // TODO: check if user has access to file
    if (article.userId !== userId) {
      throw new BadRequestException(`User has not access to file`);
    }
    const presignedUrl = await this.s3Service.getFile(this.config.S3_ARTICLES_BUCKET_NAME, article.file.fileName);

    return { url: presignedUrl };
  }

  public async createArticle(user: User, options: CreateArticleOptions): Promise<Article> {
    const payload = {
      userId: user.id,
      status: ArticleStatus.DRAFT,
      userProfile: {
        ...options.userProfile,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    } as ArticleSchema;

    return this.articlesRepository.create(payload);
  }

  public async getArticleById(articleId: ID): Promise<Article> {
    return this.articlesRepository.findOneById(articleId);
  }

  public async updateArticle(articleId: ID, options: UpdateArticleOptions): Promise<Article> {
    return this.articlesRepository.updateOne({ _id: articleId }, options);
  }

  public async updateArticlesUserProfileByUser(
    userId: string,
    options: Pick<UpdateArticleOptions, 'userProfile'>,
  ): Promise<void> {
    const query = {
      userId,
      'userProfile.updatedAt': { $lt: options.userProfile.updatedAt },
    };
    return this.articlesRepository.updateMany(query, options);
  }

  public async deleteArticle(articleId: string): Promise<Article> {
    // TODO: add conditional to reject if someone already bought article

    const article = await this.articlesRepository.findOne({
      _id: ObjectId.createFromHexString(articleId),
    });

    await this.s3Service.deleteFile(this.config.S3_ARTICLES_BUCKET_NAME, article.file.fileName);

    return this.articlesRepository.deleteOne({
      _id: ObjectId.createFromHexString(articleId),
    });
  }
  public async changeStatus(articleId: ID, status: ArticleStatus): Promise<Article> {
    let publishedAt = null;
    if (status === ArticleStatus.PUBLISHED) {
      publishedAt = new Date();
    }
    return this.articlesRepository.updateOne({ _id: articleId }, { status, publishedAt });
  }
}
