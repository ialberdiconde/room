import { AppSyncResolverHandler } from 'aws-lambda';
import * as utils from '/opt/utils';

import { GetBooksParams, Book } from '/opt/types';
import { QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb';

type Result = {
  data: Book[];
  nextToken: string;
};

export const handler: AppSyncResolverHandler<GetBooksParams, Result> = async (event, context) => {
  return new Promise<Result>(async (resolve, reject) => {
    try {
      // Print Event
      utils.logInfo(event, 'Event');

      //  Get DDB DocClient
      const ddbDocClient = await utils.getDDBDocClient();

      // Query command input with attributes to get
      const queryCommandInput: QueryCommandInput = {
        TableName: process.env.DDB_TABLE,
        ExclusiveStartKey: event.arguments.getBooksInput.nextToken
          ? JSON.parse(Buffer.from(event.arguments.getBooksInput.nextToken, 'base64').toString('ascii'))
          : undefined,
        ExpressionAttributeValues: {},
      };

      // Add Query Expression
      if (event.arguments.getBooksInput.title) {
        queryCommandInput.KeyConditionExpression = 'title = :title';
        queryCommandInput.ExpressionAttributeValues = {
          ...queryCommandInput.ExpressionAttributeValues,
          ':title': event.arguments.getBooksInput.title,
        };
      } else {
        queryCommandInput.IndexName = 'itemType-index';
        queryCommandInput.KeyConditionExpression = 'itemType = :itemType';
        queryCommandInput.ExpressionAttributeValues = {
          ...queryCommandInput.ExpressionAttributeValues,
          ':itemType': 'Book',
        };
      }

      // Execute Query
      const queryCommandOutput = await ddbDocClient.send(new QueryCommand(queryCommandInput));
      const result: Result = {
        data: queryCommandOutput.Items ? (queryCommandOutput.Items as Book[]) : [],
        nextToken: queryCommandOutput.LastEvaluatedKey
          ? Buffer.from(JSON.stringify(queryCommandOutput.LastEvaluatedKey)).toString('base64')
          : '',
      };

      // Return result
      resolve(result);
    } catch (error: any) {
      utils.logError(error);
      reject();
    }
  });
};
