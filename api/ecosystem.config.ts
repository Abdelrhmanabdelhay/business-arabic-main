module.exports = {
    apps: [
      {
        name: "ba-api",
        script: "npm",
        args: "run dev",
        env: {
          NODE_ENV: "development",
        },
      },
    ],
  };