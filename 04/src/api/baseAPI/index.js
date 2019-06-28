const BUILD_ENV = process.env.BUILD_ENV;
const APILIST = require(`./${BUILD_ENV}`).default;

export default APILIST;
