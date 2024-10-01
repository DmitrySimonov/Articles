import { Db } from 'mongodb';
import { MigrationInterface } from 'mongo-migrate-ts';

export class AddArticlesSearchIndex1723173142585 implements MigrationInterface {
  public async up(db: Db): Promise<any> {
    await db.collection('articles').createSearchIndex({
      name: 'default',
      definition: {
        mappings: {
          dynamic: true,
        },
      },
    });
  }

  public async down(db: Db): Promise<any> {
    await db.collection('articles').dropIndex('default');
  }
}
