import { Hbar, TransferTransaction } from '@hashgraph/sdk';

export async function transfer(client, from, to, valueInTinyBar) {
  //The net value of the transfer must equal zero (total number of hbars sent by the sender must equal the total number of hbars received by the recipient).
  const sendHbar = await new TransferTransaction()
    .addHbarTransfer(from, Hbar.fromTinybars(-valueInTinyBar)) //Sending account
    .addHbarTransfer(to, Hbar.fromTinybars(valueInTinyBar)) //Receiving account
    .execute(client);
  //Verify the transaction reached consensus
  return await sendHbar.getReceipt(client);
}
