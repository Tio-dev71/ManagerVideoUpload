module.exports = {
  apps: [
    {
      name: "Topify",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
      }
    }
  ]
};
