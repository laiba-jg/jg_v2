import { SQSClient } from "@aws-sdk/client-sqs";

const isLocal = process.env.NODE_ENV === "local";

const sqsClient = new SQSClient({
    region: process.env.AWS_REGION,
    ...(isLocal && {
        endpoint: "http://localstack:4566",
        credentials: {
            accessKeyId: "test",
            secretAccessKey: "test"
        }
    })
});

export default sqsClient;