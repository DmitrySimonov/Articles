import { Injectable, Logger } from '@nestjs/common';
import { AbstractMongoRepository } from '@/server-base/mongo/abstract-mongo.repository';
import { MongoService } from '@/server-base/mongo/mongo.service';
import { Paginated, SortOptions } from '@/shared/types/pagination';
import { Filter } from 'mongodb';
import { ArticleStatus, GetArticlesOptions } from 'shared/api';
import { Article, ArticleSchema } from 'shared/api/types/articles';
import { ArticleSearchFuzzyOptions } from 'shared/api/types/articles-search-fuzzy.options';

export const ARTICLES_COLLECTION_NAME = 'articles';

@Injectable()
export class ArticlesRepository extends AbstractMongoRepository<ArticleSchema> {
  constructor(client: MongoService) {
    super(client, 'articles', ARTICLES_COLLECTION_NAME);
  }

  async onModuleInit() {
    await this.initIndexes();
  }

  public async getFilteredItems(
    filter?: GetArticlesOptions,
    sortOptions?: SortOptions<Article>,
  ): Promise<Paginated<Article>> {
    const filters: Filter<ArticleSchema> = {};

    if (filter.status) {
      filters.status = filter.status;
    }

    if (filter.userId) {
      filters.userId = filter.userId;
    }

    if (filter.symbol) {
      filters.symbols = { $elemMatch: { symbol: filter.symbol } };
    }

    if (filter.ric) {
      filters.symbols = { $elemMatch: { ric: filter.ric } };
    }
    if (filter?.query) {
      filters.$text = {
        $search: filter?.query,
        $caseSensitive: false,
      };
    }

    return this.findWithPagination({
      paginatedOptions: {
        take: filter.take,
        next: filter.next,
      },
      sortOptions: sortOptions,
      filter: filters,
    });
  }

  public async searchArticlesFuzzy(searchRequest: ArticleSearchFuzzyOptions, sortOptions: SortOptions<Article>) {
    const pipeline: any[] = searchRequest.filter
      ? [
          {
            $search: {
              index: 'default',
              compound: {
                should: [
                  {
                    text: {
                      query: searchRequest.filter,
                      path: 'title',
                      fuzzy: {},
                    },
                  },
                  {
                    text: {
                      path: 'sector',
                      query: searchRequest.filter,
                      fuzzy: {},
                    },
                  },
                  {
                    text: {
                      path: 'userProfile.firstName',
                      query: searchRequest.filter,
                      fuzzy: {},
                    },
                  },
                  {
                    text: {
                      path: 'userProfile.lastName',
                      query: searchRequest.filter,
                      fuzzy: {},
                    },
                  },
                  {
                    text: {
                      path: 'symbols.symbol',
                      query: searchRequest.filter,
                    },
                  },
                ],
              },
            },
          },
          {
            $addFields: {
              score: { $meta: 'searchScore' },
            },
          },
        ]
      : [];

    pipeline.push({
      $match: {
        status: ArticleStatus.PUBLISHED,
      },
    });
    pipeline.push({
      $sort: { score: -1, ...sortOptions },
    });

    return this.aggregateWithPagination(pipeline, { take: searchRequest.take, next: searchRequest.next }, sortOptions);
  }

  private async initIndexes() {
    const now = Date.now();
    try {
      // TODO move to migration
      await Promise.all([
        this.collection.createIndex({
          title: 'text',
          sector: 'text',
          symbol: 'text',
        }),
      ]);
      Logger.log('Index for "articles" created');
    } catch (err) {
      Logger.error('Failed to create index for "articles" collection', err);
    } finally {
      Logger.log(`ArticlesRepository initialized in ${Date.now() - now}ms`, ArticlesRepository.name);
    }
  }
}
