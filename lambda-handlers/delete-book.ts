import { AppSyncResolverHandler } from 'aws-lambda';
import * as utils from '/opt/utils';

import { DeleteBookParams } from '/opt/types';
import { DeleteCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

export const handler: AppSyncResolverHandler<DeleteBookParams, string> = async (event, context) => {
  return new Promise<string>(async (resolve, reject) => {
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
            ':title': event.arguments.deleteBookInput.title,
          },
          ProjectionExpression: 'title',
        })
      );

      // Delete Item
      if (getBookOutput.Items && getBookOutput.Items.length > 0) {
        await ddbDocClient.send(
          new DeleteCommand({ TableName: process.env.DDB_TABLE, Key: { email: event.arguments.deleteBookInput.title } })
        );
        return resolve('Book deleted successfully');
      } else {
        return resolve(`Book with title ${event.arguments.deleteBookInput.title} not found`);
      }
    } catch (error: any) {
      utils.logError(error);
      reject();
    }
  });
};
