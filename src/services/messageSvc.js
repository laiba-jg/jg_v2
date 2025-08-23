import { SendMessageCommand } from "@aws-sdk/client-sqs";
import sqsClient from '../util/sqs.js';
import logger from "../util/logger.js";

const sendMessage = async (message) => {
    try {
        const params = {
            QueueUrl: process.env.QUEUE_URL,
            MessageBody: JSON.stringify(message),
            MessageGroupId: message.type,
        };

        const command = new SendMessageCommand(params);
        const res = await sqsClient.send(command);
        return res;
    } catch (err) {
        logger.error(err);
        throw err;
    }
};

export default {
    sendMessage,
}

