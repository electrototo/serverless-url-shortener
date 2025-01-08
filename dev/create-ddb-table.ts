import { DynamoDBClient, DescribeTableCommand, CreateTableCommand, CreateTableCommandInput, DeleteTableCommand } from "@aws-sdk/client-dynamodb";
import TableDefinition from './definition.json';

const TABLE_NAME = 'links';

const client = new DynamoDBClient({
    endpoint: 'http://localhost:8000',
    region: 'us-east-1',
    credentials: {
        secretAccessKey: 'abc',
        accessKeyId: '1233'
    }
});

const main = async () => {
    // Check if the table exists
    try {
        await client.send(new DeleteTableCommand({
            TableName: 'links'
        }));
    } catch (e) {
    }

    await client.send(new CreateTableCommand(TableDefinition as CreateTableCommandInput));
};

main();