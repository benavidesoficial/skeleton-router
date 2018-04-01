const RouterMapper = require('./RouterMapper');
const routerMapper = new RouterMapper();

/**
 * [Router description]
 */

class Router {
  constructor(skeleton) {
    this.app = skeleton.express;
  }

  /**
   * [init description]
   * @method init
   */
  init() {
    routerMapper.init();
    compileRouter(this.app)
  }

  setResourcesName(resourceName = '') {
    routerMapper.setResourcesName(resourceName);
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
    console.log(Mapper[__key_map__].router)
    app.use(`/${__key_map__}`, Mapper[__key_map__].router)
  })
}

module.exports = Router