import { AccountRequest } from 'App/Dtos/Request/AccountRequest';
import Flutterwave from 'flutterwave-node-v3';
import Logger from '@ioc:Adonis/Core/Logger';
import { FlutterwaveResponse } from 'App/Dtos/Response/FlutterWave/FlutterWaveResponse';
import { VirtualAccount } from 'App/Dtos/Response/FlutterWave/VirtualAccount';
import Account from 'App/Models/Account';
import { AccountResponse } from 'App/Dtos/Response/AccountResponse';
import Env from '@ioc:Adonis/Core/Env';
import crypto from 'crypto';

export default class AccountService {
  private flutterWave: any;

  constructor() {
    this.flutterWave = new Flutterwave(Env.get('PUBLIC_KEY'), Env.get('SECRET_KEY'));
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
        is_permanent: false,
        tx_ref: crypto.randomBytes(16).toString('hex'),
      };

      Logger.info('Creating virtual account number');
      const response: FlutterwaveResponse<VirtualAccount> =
        await this.flutterWave.VirtualAcct.create(payload);

      Logger.warn('' + response.message);

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
        password: payload.password,
      });

      if (newAccount.$isPersisted)
        result = {
          accountNumber: newAccount.accountNumber,
          bankName: newAccount.bankName,
          email: newAccount.email,
          fullName: newAccount.firstName + ' ' + newAccount.lastName,
        };

      Logger.info('Account created');
    } catch (error) {
      Logger.warn(error);
    }
    return result;
  }
}
