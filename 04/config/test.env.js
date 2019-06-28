module.exports = {
  NODE_ENV: '"production"',
  BUILD_ENV: JSON.stringify(process.env.BUILD_ENV || 'test'),
  BUILD_TYPE: JSON.stringify(process.env.BUILD_TYPE || 'web'),
  VERSION: '"1.0.6"'
}
