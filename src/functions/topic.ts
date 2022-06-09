import {
  Client,
  TopicCreateTransaction,
  TopicId,
  TopicMessageQuery,
  TopicMessageSubmitTransaction,
} from '@hashgraph/sdk';

import { sleep } from './utils';

export const createNewTopic = async (client: Client) => {
  //Create a new topic
  const txResponse = await new TopicCreateTransaction().execute(client);

  //Get the receipt of the transaction
  const receipt = await txResponse.getReceipt(client);

  //Grab the new topic ID from the receipt
  const topicId = receipt.topicId;

  //Log the topic ID
  console.log(`Your topic ID is: ${topicId}`);

  // Wait 5 seconds between consensus topic creation and subscription
  await sleep(5000);
  return topicId;
};

export const subscribeToTopic = (client: Client, topicId: string | TopicId) => {
  new TopicMessageQuery()
    .setTopicId(topicId)
    .subscribe(client, null, (message) => {
      /* tslint:disable-next-line */
      const messageAsString = Buffer.from(message.contents).toString();
      console.log(
        `${message.consensusTimestamp.toDate()} Received: ${messageAsString}`
      );
    });
};

export const submitMessage = async (
  client,
  params: ConstructorParameters<typeof TopicMessageSubmitTransaction>[0]
) => {
  const sendResponse = await new TopicMessageSubmitTransaction(params).execute(
    client
  );
  const getReceipt = await sendResponse.getReceipt(client);
  //Get the status of the transaction
  const transactionStatus = getReceipt.status;
  console.log('The message transaction status' + transactionStatus);
  return transactionStatus;
};
