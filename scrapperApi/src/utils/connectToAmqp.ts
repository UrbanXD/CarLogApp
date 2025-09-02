import CONFIG from "../config/index";
import amqp, { Channel, ChannelModel } from "amqplib";

type AmpqConnection = {
    connection: ChannelModel
    channel: Channel
}

export const connectToAmqp = async (url: string, queueName: string): Promise<AmpqConnection> => {
    const connection = await amqp.connect(CONFIG.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });

    return { connection, channel };
};