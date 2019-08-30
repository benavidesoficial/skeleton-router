const express = require('express');
const glob = require("glob");
const pkgDir = require('pkg-dir');
const RouteProyect = pkgDir.sync(process.cwd());
const passport = require('passport');

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
    if (this.resourceName)
      this.router = defineRouter(this.resourceName);
  }

  setSourcersManagers(managerSources = '') {
    this.resourceName = managerSources;
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
  const controllers = getManagers(resourceName);
  let Mapper = {},
    instanceRoutes = {};
  /**
   * Primera iteracion para instanciar el Ruter de express segun
   * nombre del recurso, es importante determinar que cada recurso diferente se le tiene
   * instanciar un Router.
   */
  controllers.forEach(__controller_route__ => {
    const NameResource = getNameResource(__controller_route__, resourceName);
    instanceRoutes[NameResource] = express.Router()
  })
  /**
   * Segunda iteracion para unificar en el Mapper, el controllador con su respectiva
   * Colleccion de rutas y metodos
   */
  controllers.forEach(__controller_route__ => {
    const Controller = require(`${__controller_route__}`);
    const NameResource = getNameResource(__controller_route__, resourceName);
    if (Controller.method) {
      let method = Controller.method.toLowerCase();
      let control = instanceRoutes[NameResource][method](`${Controller.url}`, Controller.manager)
      // Si el controlador indica que se debe entrar a el por Autenficiacion entonces se le colocaa
      // el Passport.autenticate
      if (Controller.auth) control = instanceRoutes[NameResource][method](`${Controller.url}`, passport.authenticate('jwt', {
        session: false
      }), Controller.manager);

      Mapper[NameResource] = {
        router: control
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

const getManagers = (resourceName) => {
  const managers = glob.sync(`${RouteProyect}/${resourceName}`, {
    realpath: true,
  });
  return managers;
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