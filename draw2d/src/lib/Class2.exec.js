module.exports = "/* \n * Simple JavaScript Inheritance \n * By John Resig http://ejohn.org/ \n * MIT Licensed. \n * \n ****************************************************** \n * Example Usage \n ****************************************************** \n var Person = Class.extend({ \n  init: function(isDancing){ \n    this.dancing = isDancing; \n  }, \n  dance: function(){ \n    return this.dancing; \n  } \n}); \n\nvar Ninja = Person.extend({ \n  init: function(){ \n    this._super( false ); \n  }, \n  dance: function(){ \n    // Call the inherited version of dance() \n    return this._super(); \n  }, \n  swingSword: function(){ \n    return true; \n  } \n}); \n\nvar p = new Person(true); \np.dance(); // => true \n\nvar n = new Ninja(); \nn.dance(); // => false \nn.swingSword(); // => true \n\n// Should all be true \np instanceof Person && p instanceof Class && \nn instanceof Ninja && n instanceof Person && n instanceof Class \n\n ****************************************************** \n */ \n  \n// Inspired by base2 and Prototype \n(function(){ \n  var fnTest = /xyz/.test(function(){xyz;}) ? /\\b_super\\b/ : /.*/; \n\n  // The base Class implementation (does nothing) \n  this.Class = function(){}; \n  \n\n  // Create a new Class that inherits from this class \n  Class.extend = function(prop) { \n    var _super = this.prototype; \n    \n    // Instantiate a base class (but only create the instance, \n    // don't run the init constructor) \n    initializing = true; \n    var prototype = new this(); \n    initializing = false; \n    \n     \n    // Copy the properties over onto the new prototype \n    for (var name in prop) { \n      // Check if we're overwriting an existing function \n      prototype[name] = typeof prop[name] == \"function\" && \n        typeof _super[name] == \"function\" && fnTest.test(prop[name]) ? \n        (function(name, fn){ \n          return function() { \n            var tmp = this._super; \n            \n            // Add a new ._super() method that is the same method \n            // but on the super-class \n            this._super = _super[name]; \n            \n            // The method only need to be bound temporarily, so we \n            // remove it when we're done executing \n            var ret = fn.apply(this, arguments);        \n            this._super = tmp; \n            \n            return ret; \n          }; \n        })(name, prop[name]) : \n        prop[name]; \n    } \n    \n    // The dummy class constructor \n    function Class() { \n      // All construction is actually done in the init method \n      if ( !initializing && this.init ) \n        this.init.apply(this, arguments); \n    } \n    \n    // Populate our constructed prototype object \n    Class.prototype = prototype; \n    \n    // Enforce the constructor to be what we expect \n    Class.prototype.constructor = Class; \n\n    // And make this class extendable \n    Class.extend = arguments.callee; \n    \n    // EXTENSION BY Draw2D.org to inject methods into an existing class to provide plugins or \n    // bugfixes for further releases \n    // \n    Class.inject = function (prop) { \n        var proto = this.prototype; \n        var parent = {}; \n        for (var name in prop) { \n            if (typeof (prop[name]) == \"function\" && typeof (proto[name]) == \"function\" && fnTest.test(prop[name])) { \n                parent[name] = proto[name]; \n                proto[name] = (function (name, fn) { \n                    return function () { \n                        var tmp = this.parent; \n                        this.parent = parent[name]; \n                        var ret = fn.apply(this, arguments); \n                        this.parent = tmp; \n                        return ret; \n                    }; \n                })(name, prop[name]); \n            } else { \n                proto[name] = prop[name]; \n            } \n        } \n    }; \n     \n    return Class; \n  }; \n})();\n \n"