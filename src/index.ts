import 'dotenv/config';
import { Client } from '@hashgraph/sdk';

import {
  checkAccountBalance,
  generateNewAccount,
  getQueryAccountBalanceCost,
  initTestnetClient,
} from './functions/account';
import {
  createNewTopic,
  submitMessage,
  subscribeToTopic,
} from './functions/topic';
import { transfer } from './functions/transaction';

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

async function transferExample(client: Client) {
  const newAccount = await generateNewAccount(client);
  // Get the new account ID
  const getReceipt = await newAccount.getReceipt(client);
  const newAccountId = getReceipt.accountId;

  //Log the account ID
  console.log('The new account ID is: ' + newAccountId);
  const accountBalance = await checkAccountBalance(client, newAccountId);

  console.log(
    'The new account balance is: ' +
      accountBalance.hbars.toTinybars() +
      ' tinybar.'
  );

  const receipt = await transfer(
    client,
    process.env.MY_ACCOUNT_ID,
    newAccountId,
    1000
  );
  console.log(
    'The transfer transaction from my account to the new account was: ' +
      receipt.status.toString()
  );

  const queryCost = await getQueryAccountBalanceCost(client, newAccountId);
  console.log('The cost of query is: ' + queryCost);
  const accountBalanceAfterTransfer = await checkAccountBalance(
    client,
    newAccountId
  );
  console.log(
    'The account balance after the transfer is: ' +
      accountBalanceAfterTransfer.hbars.toTinybars() +
      ' tinybar.'
  );
}

async function topicExample(client: Client) {
  const topicId = await createNewTopic(client);
  subscribeToTopic(client, topicId);
  await submitMessage(client, {
    topicId,
    message: 'Hello, LVBK',
  });
}

console.clear();
const client = init();
topicExample(client);
