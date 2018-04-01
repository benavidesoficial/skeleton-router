const express = require('express');
const router = express.Router();
const glob = require("glob");
const pkgDir = require('pkg-dir');
const RouteProyect = pkgDir.sync(process.cwd());

/**
 * [RouterMapper description]
 */

class RouterMapper {
  constructor() {
    this.router = {};
    this.resourceName = '';
  }

  /**
   * [init description]
   * @method init
   */
  init() {
    this.router = defineRouter(this.resourceName);
  }

  setResourcesName(resourceName = '') {
    this.resourceName = resourceName;
  }

}

// define the about route
// router.get('/about', function (req, res) {
//   res.send('About birds')
// })

/**
 * Defina las rutas para el Mapper
 * @method defineRouter
 * @return {Object}       Mapper
 */

const defineRouter = (resourceName) => {
  const controllers = getControllers(resourceName);
  let Mapper = {}
  controllers.forEach(__controller_route__ => {
    const Controller = require(`${__controller_route__}`);
    const NameResouce = getNameResource(__controller_route__, resourceName);
    if (Controller.method) {
      let method = Controller.method.toLowerCase();
      Mapper[NameResouce] = {
        router: router[method](`${Controller.url}`, Controller.handle)
      }
    }
  })
  return Mapper;
}

/**
 * Obtiene todos los Controllers
 * @method getControllers
 * @return {Array}       Todos los Controllers
 */

const getControllers = (resourceName) => {
  const controllers = glob.sync(`${RouteProyect}/${resourceName}/**/controllers/*.js`, {
    realpath: true,
  });

  return controllers;
}

/**
 *  Obtiene el nombre del Resource correspondiente al Controller
 * @method getNameResource
 * @param  {String}        path   Ubicacion del Controller
 * @return {String}               Nombre del Resource
 */

const getNameResource = (path, resourceName) => {
  let APIPath = path.slice(path.lastIndexOf(resourceName));
  let BasePathResource = APIPath.slice(APIPath.indexOf('/') + 1);
  let NameResource = BasePathResource.slice(0, BasePathResource.indexOf('/'))
  return NameResource.toLowerCase();
}

module.exports = RouterMapper;