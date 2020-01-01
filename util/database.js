const Sequelize = require('sequelize');


const {
  DB_HOST,
  DB_NAME,
  DB_USER,
  DB_PASS,
} = process.env;

const db = new Sequelize(
  DB_NAME,
  DB_USER,
  DB_PASS,
  { dialect: 'mariadb', host: DB_HOST },
);

module.exports = db;
