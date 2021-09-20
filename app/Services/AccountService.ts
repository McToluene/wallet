import { AccountRequest } from 'App/Dtos/Request/AccountRequest';
import Flutterwave from 'flutterwave-node-v3';
import Logger from '@ioc:Adonis/Core/Logger';
import { FlutterwaveResponse } from 'App/Dtos/Response/FlutterWave/FlutterWaveResponse';
import { VirtualAccount } from 'App/Dtos/Response/FlutterWave/VirtualAccount';
import Account from 'App/Models/Account';
import { AccountResponse } from 'App/Dtos/Response/AccountResponse';

export default class AccountService {
  private flutterWave: any;

  constructor() {
    this.flutterWave = new Flutterwave('', '');
  }

  public async createVirtualAccount(
    accountPayload: AccountRequest
  ): Promise<AccountResponse | null> {
    let result: AccountResponse | null = null;
    try {
      const payload = {
        email: accountPayload.email,
        firstname: accountPayload.firstName,
        lastname: accountPayload.lastName,
        bvn: accountPayload.bvn,
        is_permanent: true,
      };

      Logger.info('Creating virtual account number');
      const response: FlutterwaveResponse<VirtualAccount> =
        await this.flutterWave.VirtualAcct.create(payload);

      if (response.data !== null) {
        Logger.info('Creating account');
        result = await this.createAccount(response.data, accountPayload);
      }
    } catch (error) {
      Logger.warn(error);
    }

    return result;
  }

  private async createAccount(
    data: VirtualAccount,
    payload: AccountRequest
  ): Promise<AccountResponse | null> {
    let result: AccountResponse | null = null;

    try {
      const newAccount = await Account.create({
        accountNumber: data.account_number,
        bankName: data.bank_name,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
      });

      if (newAccount.$isPersisted)
        result = {
          accountNumber: newAccount.accountNumber,
          bankName: newAccount.bankName,
          email: newAccount.email,
          fullName: newAccount.firstName + ' ' + newAccount.lastName,
        };
    } catch (error) {
      Logger.warn(error);
    }
    return result;
  }
}
