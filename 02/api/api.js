import houseCaseAPI from './house-case-api.js'
import goodsAPI from './goods-api.js'
import myselfAPI from './myself-api.js'
import commonAPI from './common-api.js'
import indexAPI from './index-api.js'
import cityServiceAPI from './cityService-api.js'
import interactiveAPI from './interactive-api.js'
const API = Object.assign(houseCaseAPI, goodsAPI, myselfAPI, commonAPI, indexAPI, cityServiceAPI, interactiveAPI)
export default API
