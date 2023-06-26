import { AppSyncResolverHandler } from 'aws-lambda';
import * as utils from '/opt/utils';

import { Book, AddBookParams } from '/opt/types';
import { PutCommand } from '@aws-sdk/lib-dynamodb';

export const handler: AppSyncResolverHandler<AddBookParams, Book> = async (event, context) => {
  return new Promise<Book>(async (resolve, reject) => {
    try {
      // Print Event
      utils.logInfo(event, 'Event');

      // Build Book Object
      const book: Book = {
        itemType: 'Book',
        title: event.arguments.addBookInput.title,
        authors: event.arguments.addBookInput.authors,
        average_rating: event.arguments.addBookInput.average_rating,
        isbn: event.arguments.addBookInput.isbn,
        isbn13: event.arguments.addBookInput.isbn13,
        language_code: event.arguments.addBookInput.language_code,
        num_pages: event.arguments.addBookInput.num_pages,
        ratings_count: event.arguments.addBookInput.ratings_count,
        text_reviews_count: event.arguments.addBookInput.text_reviews_count,
        publication_date: event.arguments.addBookInput.publication_date,
        publisher: event.arguments.addBookInput.publisher,
      };

      // Get DDB Doc Client
      const ddbDocClient = await utils.getDDBDocClient();

      // Write Item to DDB
      await ddbDocClient.send(new PutCommand({ TableName: process.env.DDB_TABLE, Item: book }));

      // Return new book
      resolve(book);
    } catch (error: any) {
      utils.logError(error);
      reject();
    }
  });
};
