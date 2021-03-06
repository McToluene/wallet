import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Accounts extends BaseSchema {
  protected tableName = 'accounts';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('first_name');
      table.string('last_name');
      table.string('email');
      table.string('account_number');
      table.string('bank_name');
      table.string('password');

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
