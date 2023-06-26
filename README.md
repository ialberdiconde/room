# AppSync, CDK, DynamoDB and TypeScript to build and deploy a GraphQL API

This is a companion repo to deploy a GraphQL APIs using AppSync & CDK

## Notes

This is a nice boilerplate (CRUD) to deploy a GraphQL API relying on AppSync and CDK

Due to the time constraint I did not include any test neither the queries to search and sort as required

It is only an example about how to approach and deliver a reliable serverless solution to consume a GraphQL API using the the right AWS services. 

For the sake of simplifying the exercise I used an online tool to convert the csv to JSON in order to populate a DynamoDB table

Please run the command below to populate dynamoDB table (there is an issue with duplicated items but still works, however as I created the title column as the partition key no duplicated will be inserted

```
ts-node import-books.ts
```


## Docs

CDK Project Template - Lambda Base : https://github.com/kheriox-technologies/template-cdk-lambda-base

AWS Profile NPM Package: https://www.npmjs.com/package/awsprofile

Git Branch NPM Package: https://www.npmjs.com/package/git-branch

AWS CDK Documentation: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html

## Troubleshooting

If you face issues with Doker run this command

export DOCKER_CLI_EXPERIMENTAL=enabled

npm install -g esbuild

### CDK Deploy

```
cdk bootstrap

cdk deploy --all --require-approval never --progress events
```
