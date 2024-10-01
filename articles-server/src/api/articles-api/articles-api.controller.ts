import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { CurrentUser, JwtAuth, User } from '@/server-base/auth';
import { SortQuery } from '@/server-base/decorators';
import { MongoIdPipe } from '@/server-base/mongo/mongo-id.pipe';
import { PaginatedResponse, Response } from '@/server-base/response';
import { PresignedUrlResponse } from '@/server-base/response/presigned-url.response';
import { ID } from '@/shared/types/id';
import { ArticlesApiService } from './articles-api.service';
import { GetArticlesSortRequest } from './dto/get-articles-sort.request';
import { ArticleResponse } from './dto/articles.response';
import { CreateArticleRequest } from './dto/create-articles.request';
import { UpdateArticleRequest } from './dto/update-articles.request';
import { Paginated } from '@/shared/types/pagination';
import { GetArticlesRequest } from '~/api/articles-api/dto/get-articles.request';
import { ArticlesSearchFuzzyRequest } from '~/api/articles-api/dto/articles-search-fuzzy.request';
import { ArticleSearchSortRequest } from '~/api/articles-api/dto/articles-search-sort.request';

@Controller('articles')
export class ArticlesApiController {
  constructor(private readonly articlesService: ArticlesApiService) {}

  // TODO: separate for the fuzzy search
  @Get()
  @Response({ type: PaginatedResponse(ArticleResponse) })
  public async getArticles(
    @Query() filterOptions: GetArticlesRequest,
    @SortQuery() sortOptions: GetArticlesSortRequest,
  ): Promise<Paginated<ArticleResponse>> {
    return this.articlesService.getArticles(filterOptions, sortOptions);
  }

  @Get('search')
  @Response({ type: PaginatedResponse(ArticleResponse) })
  async searchArticlesFuzzy(
    @Query() searchRequest: ArticlesSearchFuzzyRequest,
    @SortQuery() sortOptions: ArticleSearchSortRequest,
  ) {
    return this.articlesService.searchArticlesFuzzy(searchRequest, sortOptions);
  }

  @JwtAuth()
  @Get('/my')
  @Response({ type: PaginatedResponse(ArticleResponse) })
  public async getMyArticles(
    @CurrentUser() user: User,
    @Query() filterOptions: GetArticlesRequest,
    @SortQuery() sortOptions: GetArticlesSortRequest,
  ) {
    return this.articlesService.getMyArticles(user.id, filterOptions, sortOptions);
  }

  @JwtAuth()
  @Get('presigned-url/:articleId')
  @Response({ type: PresignedUrlResponse })
  public async getPresignedArticleUrl(@Param('articleId', MongoIdPipe) articleId: ID): Promise<PresignedUrlResponse> {
    return this.articlesService.getSignedUrl(articleId);
  }

  @Get(':articleId')
  @Response({ type: ArticleResponse })
  public async getArticleById(@Param('articleId', MongoIdPipe) articleId: ID): Promise<ArticleResponse> {
    return this.articlesService.getArticleById(articleId);
  }

  @JwtAuth()
  @Get('signed-file-url/:articleId')
  public async getSignedArticleUrl(@Param('articleId', MongoIdPipe) articleId: ID, @CurrentUser() user: User) {
    return this.articlesService.getSignedFileUrl(articleId, user.id);
  }

  @JwtAuth()
  @Post()
  @Response({ type: ArticleResponse })
  public async createArticle(@CurrentUser() user: User, @Body() body: CreateArticleRequest): Promise<ArticleResponse> {
    return this.articlesService.createArticle(user, body);
  }

  @JwtAuth()
  @Put(':articleId')
  @Response({ type: ArticleResponse })
  public async updateArticle(
    @Param('articleId', MongoIdPipe) articleId: ID,
    @Body() body: UpdateArticleRequest,
  ): Promise<ArticleResponse> {
    return this.articlesService.updateArticle(articleId, body);
  }

  @JwtAuth()
  @Patch(':articleId/published')
  @Response({ type: ArticleResponse })
  public async changeArticleStatusToPublished(
    @Param('articleId', MongoIdPipe) articleId: ID,
  ): Promise<ArticleResponse> {
    return this.articlesService.changeArticleStatusToPublished(articleId);
  }

  @JwtAuth()
  @Patch(':articleId/draft')
  @Response({ type: ArticleResponse })
  public async changeArticleStatusToDraft(@Param('articleId', MongoIdPipe) articleId: ID): Promise<ArticleResponse> {
    return this.articlesService.changeArticleStatusToDraft(articleId);
  }

  @JwtAuth()
  @Delete('/:id')
  @Response({ type: ArticleResponse })
  public async deleteArticle(@Param('id') id: string): Promise<ArticleResponse> {
    return this.articlesService.deleteArticle(id);
  }
}
