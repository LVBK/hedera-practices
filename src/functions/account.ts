import {
  AccountBalanceQuery,
  AccountCreateTransaction,
  Client,
  Hbar,
  PrivateKey,
} from '@hashgraph/sdk';

export function initTestnetClient(accountId, privateKey) {
  // Create our connection to the Hedera network
  // The Hedera JS SDK makes this really easy!
  const client = Client.forTestnet();

  client.setOperator(accountId, privateKey);
  return client;
}

export async function generateNewAccount(client) {
  const newAccountPrivateKey = await PrivateKey.generateED25519();
  const newAccountPublicKey = newAccountPrivateKey.publicKey;
  const newAccount = await new AccountCreateTransaction()
    .setKey(newAccountPublicKey)
    .setInitialBalance(Hbar.fromTinybars(1000))
    .execute(client);
  return newAccount;
}

export async function checkAccountBalance(client, accountId) {
  //Verify the account balance
  return await new AccountBalanceQuery()
    .setAccountId(accountId)
    .execute(client);
}

export async function getQueryAccountBalanceCost(client, accountId) {
  //Verify the account balance
  return await new AccountBalanceQuery()
    .setAccountId(accountId)
    .getCost(client);
}
