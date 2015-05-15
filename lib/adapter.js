/**
 * Module Dependencies
 */

var _ = require('lodash');
var Kaiseki = require('kaiseki');

var Parse = null;

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

      Parse = new Kaiseki(connection.appId, connection.apiKey);

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
      console.log(" FIND CALL ");
      console.log(collection, options);

      if (_.has(options, 'where.objectId') && _.isArray(options.where.objectId)) {
        return cb(null, {});
      }

      Parse.getObjects(collection, options, function (error, response, body, success) {
        if (error) {
          console.log("ERROR:\n");

          return cb(error, body);
        }

        if (!success) {
          console.log("FIND API Failure:\n");
          console.log(body);

          if (body.code == 102) return cb(null, {});
        }

        // for each model instance
        _.forEach(body, function (element) {
          // for each enumarable property in the interating model instance
          _.forIn(element, function (value, key) {
            // if it's a special kind of property from Parse
            if (_.has(value, '__type')) {
              // if it has an objectId, then get its value and assign to this property,
              // because waterline will try to get the embbeded documents
              element[key] = value.objectId || undefined;
            }
          })
        });

        return cb(null, body);
      });
    },

    findOne: function (connection, collection, options, cb) {
      console.log(" FIND ONE CALL ");
      console.log(collection, options);

      if (_.has(options, 'where.objectId') && _.isArray(options.where.objectId)) {
        return cb(null, {});
      }

      Parse.getObjects(collection, options, function (error, response, body, success) {
        if (error) {
          console.log("ERROR:\n");

          return cb(error, body);
        }

        if (!success) {
          console.log("FIND API Failure:\n");
          console.log(body);

          if (body.code == 102) return cb(null, {});
        }

        // for each model instance
        _.forEach(body, function (element) {
          // for each enumarable property in the interating model instance
          _.forIn(element, function (value, key) {
            // if it's a special kind of property from Parse
            if (_.has(value, '__type')) {
              // if it has an objectId, then get its value and assign to this property,
              // because waterline will try to get the embbeded documents
              element[key] = value.objectId || undefined;
            }
          })
        });

        return cb(null, body);
      });

    },

    create: function (connection, collection, values, cb) {
      console.log(" CREATE CALL ");
      console.log(collection, values);

      if(values.objectId != undefined) delete values.objectId;
      if(values.createdAt != undefined) delete values.createdAt;
      if(values.updatedAt != undefined) delete values.updatedAt;

      Parse.createObject(collection, values, function (error, response, body, success) {
        if (error) {
          console.log("ERROR:\n");
          console.log(error);

          return cb(error, body);
        }

        if (!success) {
          console.log("CREATE API Failure:\n");
        } else {
          console.log("CREATE SUCCESS\n")
        }

        return cb(null, body);
      });
    },

    update: function (connection, collection, options, values, cb) {
      console.log(" UPDATE CALL ");
      console.log(collection, options, values);

      Parse.updateObject(collection, options.where.objectId, values, function (error, response, body, success) {
        if (error) {
          console.log("ERROR:\n");
          console.log(error);

          return cb(error, body);
        }

        if (!success) {
          console.log("UPDATE API Failure:\n");
        } else {
          console.log("UPDATE SUCCESS\n")
        }

        return cb(null, body);
      });
    },

    destroy: function (connection, collection, options, values, cb) {
      return cb();
    }

  };


  // Expose adapter definition
  return adapter;

})();

