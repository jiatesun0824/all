module.exports = {
    NODE_ENV: '"production"',
    BUILD_ENV: JSON.stringify(process.env.BUILD_ENV || 'ci'),
    BUILD_TYPE: JSON.stringify(process.env.BUILD_TYPE || 'web'),
    BUILD_SOCKET: '"https://imwebsocket.ci.sanduspace.com"',
    // BUILD_SOCKET: '"http://10.10.30.134:15001"',
    VERSION: '"1.0.6"'
}