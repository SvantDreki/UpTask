const Sequelize = require('sequelize');

const db = new Sequelize('uptasknode', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    define: {
        timestamps: false
    }

  });

  module.exports = db;

