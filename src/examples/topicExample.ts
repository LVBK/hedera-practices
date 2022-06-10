import 'dotenv/config';
import { Client } from '@hashgraph/sdk';

import {
  createNewTopic,
  submitMessage,
  subscribeToTopic,
} from '../functions/topic';

export default async function topicExample(client: Client) {
  const topicId = await createNewTopic(client);
  subscribeToTopic(client, topicId);
  await submitMessage(client, {
    topicId,
    message: 'Hello, LVBK',
  });
}
