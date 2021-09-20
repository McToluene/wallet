import { DateTime } from 'luxon';
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm';
import Hash from '@ioc:Adonis/Core/Hash';

export default class Account extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public firstName: string;

  @column()
  public lastName: string;

  @column()
  public email: string;

  @column()
  public accountNumber: string;

  @column()
  public bankName: string;

  @column({ serializeAs: null })
  public password: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeSave()
  public static async hashPassword(account: Account) {
    if (account.$dirty.password) {
      account.password = await Hash.make(account.password);
    }
  }
}
