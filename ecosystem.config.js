module.exports = {
  apps: [
    {
      name: 'api',
      cwd: '/var/www/business-arabic/api',
      script: 'build/server.js',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: 8080
      },
      error_file: '/var/www/business-arabic/logs/api-error.log',
      out_file: '/var/www/business-arabic/logs/api-out.log',
      time: true
    },
    {
      name: 'app',
      cwd: '/var/www/business-arabic/app',
      script: 'node_modules/.bin/next',
      args: 'start -p 3000',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/www/business-arabic/logs/app-error.log',
      out_file: '/var/www/business-arabic/logs/app-out.log',
      time: true
    }
  ]
};
