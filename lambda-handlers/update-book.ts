import { AppSyncResolverHandler } from 'aws-lambda';
import * as utils from '/opt/utils';

import { UpdateBookParams, Book } from '/opt/types';
import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

export const handler: AppSyncResolverHandler<UpdateBookParams, Book | string> = async (event, context) => {
  return new Promise<Book | string>(async (resolve, reject) => {
    try {
      // Print Event
      utils.logInfo(event, 'Event');

      //  Get DDB DocClient
      const ddbDocClient = await utils.getDDBDocClient();

      // Check if book is present in DDB
      const getBookOutput = await ddbDocClient.send(
        new QueryCommand({
          TableName: process.env.DDB_TABLE,
          KeyConditionExpression: `title = :title`,
          ExpressionAttributeValues: {
            ':title': event.arguments.updateBookInput.title,
          },
        })
      );

      // Delete Item
      if (getBookOutput.Items && getBookOutput.Items.length > 0) {
        const updateBook = { ...getBookOutput.Items[0] } as Book;

        // Update book attributes
        if (event.arguments.updateBookInput.title) updateBook.title = event.arguments.updateBookInput.title;
        if (event.arguments.updateBookInput.authors) updateBook.authors = event.arguments.updateBookInput.authors;
        if (event.arguments.updateBookInput.average_rating) updateBook.average_rating = event.arguments.updateBookInput.average_rating;
        if (event.arguments.updateBookInput.isbn) updateBook.isbn = event.arguments.updateBookInput.isbn;
        if (event.arguments.updateBookInput.isbn13) updateBook.isbn13 = event.arguments.updateBookInput.isbn13;
        if (event.arguments.updateBookInput.language_code) updateBook.language_code = event.arguments.updateBookInput.language_code;
        if (event.arguments.updateBookInput.num_pages) updateBook.num_pages = event.arguments.updateBookInput.num_pages;
        if (event.arguments.updateBookInput.ratings_count) updateBook.ratings_count = event.arguments.updateBookInput.ratings_count;
        if (event.arguments.updateBookInput.text_reviews_count) updateBook.text_reviews_count = event.arguments.updateBookInput.text_reviews_count;
        if (event.arguments.updateBookInput.publication_date) updateBook.publication_date = event.arguments.updateBookInput.publication_date;
        if (event.arguments.updateBookInput.publisher) updateBook.publication_date = event.arguments.updateBookInput.publisher;

        // Write updated book to dynamo db
        await ddbDocClient.send(new PutCommand({ TableName: process.env.DDB_TABLE, Item: updateBook }));
        return resolve(updateBook);
      } else {
        return resolve(`Book with title ${event.arguments.updateBookInput.title} not found`);
      }
    } catch (error: any) {
      utils.logError(error);
      reject();
    }
  });
};
