const express = require('express');
const RouterMapper = require('./RouterMapper');
const routerMapper = new RouterMapper();

/**
 * [Router description]
 */

class Router {
  constructor() {
    this.app = express();
    this.init();
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

  /**
   * Metodo encargado de disparar el servidor
   * @method listen
   * @param  {[String]}   port Puerto donde correra la aplicacion
   * @param  {Function} cb   [description]
   * @return {[type]}        [description]
   */

  listen(port, cb) {
    this.app.listen(port, cb)
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