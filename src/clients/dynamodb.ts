import { DynamoDBClient } from "@aws-sdk/client-dynamodb"

export const dynamodDBClient = new DynamoDBClient({
    endpoint: 'http://localhost:8000',
    region: 'us-east-1',
    credentials: {
        secretAccessKey: 'abc',
        accessKeyId: '1233'
    }
});