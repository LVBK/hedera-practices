import 'dotenv/config';

import topicExample from './examples/topicExample';
import transferExample from './examples/transferExample';
import { initTestnetClient } from './functions/account';

function init() {
  //Grab your Hedera testnet account ID and private key from your .env file
  const myAccountId = process.env.MY_ACCOUNT_ID;
  const myPrivateKey = process.env.MY_PRIVATE_KEY;

  // If we weren't able to grab it, we should throw a new error
  if (myAccountId == null || myPrivateKey == null) {
    throw new Error(
      'Environment variables myAccountId and myPrivateKey must be present'
    );
  }

  return initTestnetClient(myAccountId, myPrivateKey);
}

console.clear();
const client = init();
transferExample(client);
