module.exports = {
    NODE_ENV: '"production"',
    BUILD_ENV: JSON.stringify(process.env.BUILD_ENV || 'prod'),
    BUILD_TYPE: JSON.stringify(process.env.BUILD_TYPE || 'web'),
    BUILD_SOCKET: '"https://imwebsocket.sanduspace.com"',
    VERSION: '"1.0.6"'
}