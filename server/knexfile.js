// Update with your config settings.

module.exports = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    tableName: 'knex_migrations',
  },
}
