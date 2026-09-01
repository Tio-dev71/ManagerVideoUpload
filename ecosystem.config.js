module.exports = {
  apps: [
    {
      name: "Topify",
      script: "npm.cmd",
      args: "run start",
      env: {
        NODE_ENV: "production",
      }
    }
  ]
};
