import { readJSONSync } from 'fs-extra';
import { Book } from './common/types';
import { ddbBatchWrite } from './common/utils';

const main = async () => {
  try {
    const books: Book[] = readJSONSync('./books.json');
    const ddBooks = books.map((u) => {
      return { ...u, itemType: 'Book' };
    });
    await ddbBatchWrite('graphql-api-develop', ddBooks);
  } catch (error) {
    console.log(error);
  }
};

main();