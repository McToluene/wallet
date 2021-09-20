import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { AccountResponse } from 'App/Dtos/Response/AccountResponse';
import BaseResponse from 'App/Dtos/Response/BaseRespons';
import AccountService from 'App/Services/AccountService';

export default class AccountsController {
  private accountService: AccountService;
  constructor() {
    this.accountService = new AccountService();
  }

  public async store({ request, response }: HttpContextContract) {
    const newAccountSchema = schema.create({
      firstName: schema.string({ trim: true }),
      lastName: schema.string({ trim: true }),
      email: schema.string({ trim: true }, [rules.email]),
      password: schema.string({ trim: true }, [rules.confirmed()]),
      bvn: schema.string({ trim: true }),
    });

    const validatedPayload = await request.validate({ schema: newAccountSchema });
    const result = await this.accountService.createVirtualAccount(validatedPayload);

    let message: string = '';
    let status: number = 0;

    if (result !== null) {
      status = 200;
      response.status(status);
      message = 'Account created successfully';
    } else {
      status = 500;
      message = 'Failed to create account';
      response.status(status);
    }

    const responseBody = new BaseResponse<AccountResponse | null>(200, message, result);
    return responseBody;
  }
}
