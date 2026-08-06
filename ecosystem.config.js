module.exports = {
  apps: [
    {
      name: "Topify",
      script: "npm.cmd",
      args: "start",
      env: {
        NODE_ENV: "production",
      }
    }
  ]
};
