const RouterMapper = require('./RouterMapper');
const routerMapper = new RouterMapper();

/**
 * [Router description]
 */

class Router {
  constructor(skeleton) {
    this.app = skeleton.express;
    routerMapper.init();
  }

  /**
   * [init description]
   * @method init
   */
  init() {
    compileRouter(this.app)
  }
}

/**
 * [compileRouter description]
 * @method compileRouter
 * @return {[type]}      [description]
 */

const compileRouter = (app) => {
  const Mapper = routerMapper.router;
  Object.keys(Mapper).forEach(__key_map__ => {
    app.use(`/${__key_map__}`, Mapper[__key_map__].router)
  })
}

module.exports = Router