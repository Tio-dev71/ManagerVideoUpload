const path = require('path');
const dotenv = require('dotenv');

// Đọc file .env
const envConfig = dotenv.config({ path: path.join(__dirname, '.env') }).parsed || {};

module.exports = {
  apps: [
    {
      name: "Topify",
      script: "npm.cmd",
      args: "run start",
      env: {
        NODE_ENV: "production",
        ...envConfig
      }
    }
  ]
};
