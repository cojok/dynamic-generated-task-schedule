export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.SC_PGDB_HOST,
    port: parseInt(process.env.SC_PGDB_PORT, 10) || 5432,
    user: process.env.SC_PGDB_USER,
    password: process.env.SC_PGDB_PASS,
    name: process.env.SC_PGDB_NAME,
    schema: process.env.SC_PGDB_SCHEMA,
  },
  redis: {
    password: process.env.SC_REDIS_PASS,
  },
  secret: process.env.SC_SECRET,
});
