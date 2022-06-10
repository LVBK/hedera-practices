import 'dotenv/config';
import { Client } from '@hashgraph/sdk';

import {
  checkAccountBalance,
  generateNewAccount,
  getQueryAccountBalanceCost,
} from '../functions/account';
import { transfer } from '../functions/transaction';

export default async function transferExample(client: Client) {
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
