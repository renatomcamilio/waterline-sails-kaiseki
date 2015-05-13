/**
 * Module Dependencies
 */

var _ = require('lodash');
var Kaiseki = require('kaiseki');


module.exports = (function () {

  // You'll want to maintain a reference to each connection
  // that gets registered with this adapter.
  var connections = {};

  var adapter = {

    identity: 'waterline-sails-kaiseki',

    syncable: false,

    // Default configuration for connections
    defaults: {
      appId: null,
      apiKey: null,
      masterKey: null
    },

    /**
     *
     * This method runs when a model is initially registered
     * at server-start-time.  This is the only required method.
     *
     * @param  {[type]}   connection [description]
     * @param  {[type]}   collection [description]
     * @param  {Function} cb         [description]
     * @return {[type]}              [description]
     */
    registerConnection: function(connection, collections, cb) {
      if(!connection.identity) return cb(new Error('Connection is missing an identity.'));
      if(connections[connection.identity]) return cb(new Error('Connection is already registered.'));

      // Add in logic here to initialize connection
      // e.g. connections[connection.identity] = new Database(connection, collections);
      connections[connection.identity] = connection;

      cb();
    },


    /**
     * Fired when a model is unregistered, typically when the server
     * is killed. Useful for tearing-down remaining open connections,
     * etc.
     *
     * @param  {Function} cb [description]
     * @return {[type]}      [description]
     */
    // Teardown a Connection
    teardown: function (conn, cb) {

      if (typeof conn == 'function') {
        cb = conn;
        conn = null;
      }
      if (!conn) {
        connections = {};
        return cb();
      }
      if(!connections[conn]) return cb();
      delete connections[conn];
      cb();
    },


    // Return attributes
    describe: function (connection, collection, cb) {
      // Add in logic here to describe a collection (e.g. DESCRIBE TABLE logic)
      return cb();
    },

    /**
     *
     * REQUIRED method if users expect to call Model.find(), Model.findOne(),
     * or related.
     *
     * You should implement this method to respond with an array of instances.
     * Waterline core will take care of supporting all the other different
     * find methods/usages.
     *
     */
    find: function (connection, collection, options, cb) {
      return cb();
    },

    create: function (connection, collection, values, cb) {
      return cb();
    },

    update: function (connection, collection, options, values, cb) {
      return cb();
    },

    destroy: function (connection, collection, options, values, cb) {
      return cb();
    }
  };


  // Expose adapter definition
  return adapter;

})();

