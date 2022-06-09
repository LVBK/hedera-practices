console.clear();
import {
  AccountBalanceQuery,
  AccountCreateTransaction,
  Client,
  Hbar,
  PrivateKey,
  TransferTransaction,
} from '@hashgraph/sdk';

import 'dotenv/config';
import {
  createNewTopic,
  submitMessage,
  subscribeToTopic,
} from './functions/topic';

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  const status = await submitMessage(client, {
    topicId,
    message: 'Hello, LVBK',
  });
}

function initTestnetClient(accountId, privateKey) {
  // Create our connection to the Hedera network
  // The Hedera JS SDK makes this really easy!
  const client = Client.forTestnet();

  client.setOperator(accountId, privateKey);
  return client;
}

async function generateNewAccount(client) {
  const newAccountPrivateKey = await PrivateKey.generateED25519();
  const newAccountPublicKey = newAccountPrivateKey.publicKey;
  const newAccount = await new AccountCreateTransaction()
    .setKey(newAccountPublicKey)
    .setInitialBalance(Hbar.fromTinybars(1000))
    .execute(client);
  return newAccount;
}

async function checkAccountBalance(client, accountId) {
  //Verify the account balance
  return await new AccountBalanceQuery()
    .setAccountId(accountId)
    .execute(client);
}

async function getQueryAccountBalanceCost(client, accountId) {
  //Verify the account balance
  return await new AccountBalanceQuery()
    .setAccountId(accountId)
    .getCost(client);
}

async function transfer(client, from, to, valueInTinyBar) {
  //The net value of the transfer must equal zero (total number of hbars sent by the sender must equal the total number of hbars received by the recipient).
  const sendHbar = await new TransferTransaction()
    .addHbarTransfer(from, Hbar.fromTinybars(-valueInTinyBar)) //Sending account
    .addHbarTransfer(to, Hbar.fromTinybars(valueInTinyBar)) //Receiving account
    .execute(client);
  //Verify the transaction reached consensus
  return await sendHbar.getReceipt(client);
}

const client = init();
topicExample(client);
