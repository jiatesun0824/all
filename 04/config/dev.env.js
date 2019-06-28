var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    BUILD_ENV: '"dev"',
    BUILD_TYPE: JSON.stringify(process.env.BUILD_TYPE || 'web'),
    BUILD_SOCKET: '"https://imwebsocket.ci.sanduspace.com"',
    // BUILD_SOCKET: '"http://10.10.30.134:15001"',
    VERSION: '"1.0.6"'
})