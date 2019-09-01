const express = require('express');
const RouterMapper = require('./RouterMapper');
const routerMapper = new RouterMapper();
const cors = require('cors');
const passport = require('passport');
const bodyParser = require('body-parser');

/**
 * [Router description]
 */

class Router {
  constructor(options = {}) {
    this._options = options;
    this.app = express();
    if (this._options.hasOwnProperty('sourcesManagers')) this._setSourcesManagers();

  }

  /**
   * [init description]
   * @method init
   */
  init() {
    this.preMiddlewares()
    routerMapper.init();
    compileRouter(this.app)
  }

  use(...args) {
    if (args.length)
      this.app.use(args);
  }

  preMiddlewares() {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));
    this.app.use(passport.initialize());
  }
  // setResourcesName(resourceName = '') {
  //   routerMapper.setResourcesName(resourceName);
  // }

  /**
   * Metodo encargado de disparar el servidor
   * @method listen
   * @param  {[String]}   port Puerto donde correra la aplicacion
   * @param  {Function} cb   [description]
   * @return {[type]}        [description]
   */

  listen(port, cb) {
    this.init();
    this.app.listen(port, cb)
  }

  _setSourcesManagers() {
    routerMapper.setSourcersManagers(this._options.sourcesManagers);
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