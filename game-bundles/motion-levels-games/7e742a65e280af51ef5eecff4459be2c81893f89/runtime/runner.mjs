var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/react/cjs/react.production.js
var require_react_production = __commonJS({
  "node_modules/react/cjs/react.production.js"(exports) {
    "use strict";
    var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element");
    var REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal");
    var REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment");
    var REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode");
    var REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler");
    var REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer");
    var REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context");
    var REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref");
    var REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense");
    var REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo");
    var REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy");
    var REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity");
    var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
    function getIteratorFn(maybeIterable) {
      if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
      maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
      return "function" === typeof maybeIterable ? maybeIterable : null;
    }
    var ReactNoopUpdateQueue = {
      isMounted: function() {
        return false;
      },
      enqueueForceUpdate: function() {
      },
      enqueueReplaceState: function() {
      },
      enqueueSetState: function() {
      }
    };
    var assign = Object.assign;
    var emptyObject = {};
    function Component(props, context, updater) {
      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;
    }
    Component.prototype.isReactComponent = {};
    Component.prototype.setState = function(partialState, callback) {
      if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
        throw Error(
          "takes an object of state variables to update or a function which returns an object of state variables."
        );
      this.updater.enqueueSetState(this, partialState, callback, "setState");
    };
    Component.prototype.forceUpdate = function(callback) {
      this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
    };
    function ComponentDummy() {
    }
    ComponentDummy.prototype = Component.prototype;
    function PureComponent(props, context, updater) {
      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;
    }
    var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
    pureComponentPrototype.constructor = PureComponent;
    assign(pureComponentPrototype, Component.prototype);
    pureComponentPrototype.isPureReactComponent = true;
    var isArrayImpl = Array.isArray;
    function noop() {
    }
    var ReactSharedInternals = { H: null, A: null, T: null, S: null };
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    function ReactElement(type, key, props) {
      var refProp = props.ref;
      return {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        ref: void 0 !== refProp ? refProp : null,
        props
      };
    }
    function cloneAndReplaceKey(oldElement, newKey) {
      return ReactElement(oldElement.type, newKey, oldElement.props);
    }
    function isValidElement(object) {
      return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    function escape(key) {
      var escaperLookup = { "=": "=0", ":": "=2" };
      return "$" + key.replace(/[=:]/g, function(match) {
        return escaperLookup[match];
      });
    }
    var userProvidedKeyEscapeRegex = /\/+/g;
    function getElementKey(element, index) {
      return "object" === typeof element && null !== element && null != element.key ? escape("" + element.key) : index.toString(36);
    }
    function resolveThenable(thenable) {
      switch (thenable.status) {
        case "fulfilled":
          return thenable.value;
        case "rejected":
          throw thenable.reason;
        default:
          switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
            function(fulfilledValue) {
              "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
            },
            function(error) {
              "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
            }
          )), thenable.status) {
            case "fulfilled":
              return thenable.value;
            case "rejected":
              throw thenable.reason;
          }
      }
      throw thenable;
    }
    function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
      var type = typeof children;
      if ("undefined" === type || "boolean" === type) children = null;
      var invokeCallback = false;
      if (null === children) invokeCallback = true;
      else
        switch (type) {
          case "bigint":
          case "string":
          case "number":
            invokeCallback = true;
            break;
          case "object":
            switch (children.$$typeof) {
              case REACT_ELEMENT_TYPE:
              case REACT_PORTAL_TYPE:
                invokeCallback = true;
                break;
              case REACT_LAZY_TYPE:
                return invokeCallback = children._init, mapIntoArray(
                  invokeCallback(children._payload),
                  array,
                  escapedPrefix,
                  nameSoFar,
                  callback
                );
            }
        }
      if (invokeCallback)
        return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
          return c;
        })) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(
          callback,
          escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(
            userProvidedKeyEscapeRegex,
            "$&/"
          ) + "/") + invokeCallback
        )), array.push(callback)), 1;
      invokeCallback = 0;
      var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
      if (isArrayImpl(children))
        for (var i = 0; i < children.length; i++)
          nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
            nameSoFar,
            array,
            escapedPrefix,
            type,
            callback
          );
      else if (i = getIteratorFn(children), "function" === typeof i)
        for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
          nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
            nameSoFar,
            array,
            escapedPrefix,
            type,
            callback
          );
      else if ("object" === type) {
        if ("function" === typeof children.then)
          return mapIntoArray(
            resolveThenable(children),
            array,
            escapedPrefix,
            nameSoFar,
            callback
          );
        array = String(children);
        throw Error(
          "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
        );
      }
      return invokeCallback;
    }
    function mapChildren(children, func, context) {
      if (null == children) return children;
      var result = [], count = 0;
      mapIntoArray(children, result, "", "", function(child) {
        return func.call(context, child, count++);
      });
      return result;
    }
    function lazyInitializer(payload) {
      if (-1 === payload._status) {
        var ctor = payload._result;
        ctor = ctor();
        ctor.then(
          function(moduleObject) {
            if (0 === payload._status || -1 === payload._status)
              payload._status = 1, payload._result = moduleObject;
          },
          function(error) {
            if (0 === payload._status || -1 === payload._status)
              payload._status = 2, payload._result = error;
          }
        );
        -1 === payload._status && (payload._status = 0, payload._result = ctor);
      }
      if (1 === payload._status) return payload._result.default;
      throw payload._result;
    }
    var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
      if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
        var event = new window.ErrorEvent("error", {
          bubbles: true,
          cancelable: true,
          message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
          error
        });
        if (!window.dispatchEvent(event)) return;
      } else if ("object" === typeof process && "function" === typeof process.emit) {
        process.emit("uncaughtException", error);
        return;
      }
      console.error(error);
    };
    var Children = {
      map: mapChildren,
      forEach: function(children, forEachFunc, forEachContext) {
        mapChildren(
          children,
          function() {
            forEachFunc.apply(this, arguments);
          },
          forEachContext
        );
      },
      count: function(children) {
        var n = 0;
        mapChildren(children, function() {
          n++;
        });
        return n;
      },
      toArray: function(children) {
        return mapChildren(children, function(child) {
          return child;
        }) || [];
      },
      only: function(children) {
        if (!isValidElement(children))
          throw Error(
            "React.Children.only expected to receive a single React element child."
          );
        return children;
      }
    };
    exports.Activity = REACT_ACTIVITY_TYPE;
    exports.Children = Children;
    exports.Component = Component;
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.Profiler = REACT_PROFILER_TYPE;
    exports.PureComponent = PureComponent;
    exports.StrictMode = REACT_STRICT_MODE_TYPE;
    exports.Suspense = REACT_SUSPENSE_TYPE;
    exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
    exports.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function(size) {
        return ReactSharedInternals.H.useMemoCache(size);
      }
    };
    exports.cache = function(fn) {
      return function() {
        return fn.apply(null, arguments);
      };
    };
    exports.cacheSignal = function() {
      return null;
    };
    exports.cloneElement = function(element, config, children) {
      if (null === element || void 0 === element)
        throw Error(
          "The argument must be a React element, but you passed " + element + "."
        );
      var props = assign({}, element.props), key = element.key;
      if (null != config)
        for (propName in void 0 !== config.key && (key = "" + config.key), config)
          !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
      var propName = arguments.length - 2;
      if (1 === propName) props.children = children;
      else if (1 < propName) {
        for (var childArray = Array(propName), i = 0; i < propName; i++)
          childArray[i] = arguments[i + 2];
        props.children = childArray;
      }
      return ReactElement(element.type, key, props);
    };
    exports.createContext = function(defaultValue) {
      defaultValue = {
        $$typeof: REACT_CONTEXT_TYPE,
        _currentValue: defaultValue,
        _currentValue2: defaultValue,
        _threadCount: 0,
        Provider: null,
        Consumer: null
      };
      defaultValue.Provider = defaultValue;
      defaultValue.Consumer = {
        $$typeof: REACT_CONSUMER_TYPE,
        _context: defaultValue
      };
      return defaultValue;
    };
    exports.createElement = function(type, config, children) {
      var propName, props = {}, key = null;
      if (null != config)
        for (propName in void 0 !== config.key && (key = "" + config.key), config)
          hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
      var childrenLength = arguments.length - 2;
      if (1 === childrenLength) props.children = children;
      else if (1 < childrenLength) {
        for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++)
          childArray[i] = arguments[i + 2];
        props.children = childArray;
      }
      if (type && type.defaultProps)
        for (propName in childrenLength = type.defaultProps, childrenLength)
          void 0 === props[propName] && (props[propName] = childrenLength[propName]);
      return ReactElement(type, key, props);
    };
    exports.createRef = function() {
      return { current: null };
    };
    exports.forwardRef = function(render) {
      return { $$typeof: REACT_FORWARD_REF_TYPE, render };
    };
    exports.isValidElement = isValidElement;
    exports.lazy = function(ctor) {
      return {
        $$typeof: REACT_LAZY_TYPE,
        _payload: { _status: -1, _result: ctor },
        _init: lazyInitializer
      };
    };
    exports.memo = function(type, compare) {
      return {
        $$typeof: REACT_MEMO_TYPE,
        type,
        compare: void 0 === compare ? null : compare
      };
    };
    exports.startTransition = function(scope) {
      var prevTransition = ReactSharedInternals.T, currentTransition = {};
      ReactSharedInternals.T = currentTransition;
      try {
        var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
        null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
        "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop, reportGlobalError);
      } catch (error) {
        reportGlobalError(error);
      } finally {
        null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
      }
    };
    exports.unstable_useCacheRefresh = function() {
      return ReactSharedInternals.H.useCacheRefresh();
    };
    exports.use = function(usable) {
      return ReactSharedInternals.H.use(usable);
    };
    exports.useActionState = function(action, initialState, permalink) {
      return ReactSharedInternals.H.useActionState(action, initialState, permalink);
    };
    exports.useCallback = function(callback, deps) {
      return ReactSharedInternals.H.useCallback(callback, deps);
    };
    exports.useContext = function(Context) {
      return ReactSharedInternals.H.useContext(Context);
    };
    exports.useDebugValue = function() {
    };
    exports.useDeferredValue = function(value, initialValue) {
      return ReactSharedInternals.H.useDeferredValue(value, initialValue);
    };
    exports.useEffect = function(create, deps) {
      return ReactSharedInternals.H.useEffect(create, deps);
    };
    exports.useEffectEvent = function(callback) {
      return ReactSharedInternals.H.useEffectEvent(callback);
    };
    exports.useId = function() {
      return ReactSharedInternals.H.useId();
    };
    exports.useImperativeHandle = function(ref, create, deps) {
      return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
    };
    exports.useInsertionEffect = function(create, deps) {
      return ReactSharedInternals.H.useInsertionEffect(create, deps);
    };
    exports.useLayoutEffect = function(create, deps) {
      return ReactSharedInternals.H.useLayoutEffect(create, deps);
    };
    exports.useMemo = function(create, deps) {
      return ReactSharedInternals.H.useMemo(create, deps);
    };
    exports.useOptimistic = function(passthrough, reducer) {
      return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
    };
    exports.useReducer = function(reducer, initialArg, init) {
      return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
    };
    exports.useRef = function(initialValue) {
      return ReactSharedInternals.H.useRef(initialValue);
    };
    exports.useState = function(initialState) {
      return ReactSharedInternals.H.useState(initialState);
    };
    exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
      return ReactSharedInternals.H.useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
      );
    };
    exports.useTransition = function() {
      return ReactSharedInternals.H.useTransition();
    };
    exports.version = "19.2.7";
  }
});

// node_modules/react/cjs/react.development.js
var require_react_development = __commonJS({
  "node_modules/react/cjs/react.development.js"(exports, module) {
    "use strict";
    "production" !== process.env.NODE_ENV && (function() {
      function defineDeprecationWarning(methodName, info) {
        Object.defineProperty(Component.prototype, methodName, {
          get: function() {
            console.warn(
              "%s(...) is deprecated in plain JavaScript React classes. %s",
              info[0],
              info[1]
            );
          }
        });
      }
      function getIteratorFn(maybeIterable) {
        if (null === maybeIterable || "object" !== typeof maybeIterable)
          return null;
        maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
        return "function" === typeof maybeIterable ? maybeIterable : null;
      }
      function warnNoop(publicInstance, callerName) {
        publicInstance = (publicInstance = publicInstance.constructor) && (publicInstance.displayName || publicInstance.name) || "ReactClass";
        var warningKey = publicInstance + "." + callerName;
        didWarnStateUpdateForUnmountedComponent[warningKey] || (console.error(
          "Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.",
          callerName,
          publicInstance
        ), didWarnStateUpdateForUnmountedComponent[warningKey] = true);
      }
      function Component(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      function ComponentDummy() {
      }
      function PureComponent(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      function noop() {
      }
      function testStringCoercion(value) {
        return "" + value;
      }
      function checkKeyStringCoercion(value) {
        try {
          testStringCoercion(value);
          var JSCompiler_inline_result = false;
        } catch (e) {
          JSCompiler_inline_result = true;
        }
        if (JSCompiler_inline_result) {
          JSCompiler_inline_result = console;
          var JSCompiler_temp_const = JSCompiler_inline_result.error;
          var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
          JSCompiler_temp_const.call(
            JSCompiler_inline_result,
            "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
            JSCompiler_inline_result$jscomp$0
          );
          return testStringCoercion(value);
        }
      }
      function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type)
          return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return "Fragment";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
          case REACT_ACTIVITY_TYPE:
            return "Activity";
        }
        if ("object" === typeof type)
          switch ("number" === typeof type.tag && console.error(
            "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
          ), type.$$typeof) {
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_CONTEXT_TYPE:
              return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
              return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
              var innerType = type.render;
              type = type.displayName;
              type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
              return type;
            case REACT_MEMO_TYPE:
              return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
              innerType = type._payload;
              type = type._init;
              try {
                return getComponentNameFromType(type(innerType));
              } catch (x) {
              }
          }
        return null;
      }
      function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE)
          return "<...>";
        try {
          var name = getComponentNameFromType(type);
          return name ? "<" + name + ">" : "<...>";
        } catch (x) {
          return "<...>";
        }
      }
      function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
      }
      function UnknownOwner() {
        return Error("react-stack-top-frame");
      }
      function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
          var getter = Object.getOwnPropertyDescriptor(config, "key").get;
          if (getter && getter.isReactWarning) return false;
        }
        return void 0 !== config.key;
      }
      function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
          specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error(
            "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
            displayName
          ));
        }
        warnAboutAccessingKey.isReactWarning = true;
        Object.defineProperty(props, "key", {
          get: warnAboutAccessingKey,
          configurable: true
        });
      }
      function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error(
          "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
        ));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
      }
      function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          props,
          _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
          enumerable: false,
          get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: null
        });
        Object.defineProperty(type, "_debugStack", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
      }
      function cloneAndReplaceKey(oldElement, newKey) {
        newKey = ReactElement(
          oldElement.type,
          newKey,
          oldElement.props,
          oldElement._owner,
          oldElement._debugStack,
          oldElement._debugTask
        );
        oldElement._store && (newKey._store.validated = oldElement._store.validated);
        return newKey;
      }
      function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
      }
      function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      function escape(key) {
        var escaperLookup = { "=": "=0", ":": "=2" };
        return "$" + key.replace(/[=:]/g, function(match) {
          return escaperLookup[match];
        });
      }
      function getElementKey(element, index) {
        return "object" === typeof element && null !== element && null != element.key ? (checkKeyStringCoercion(element.key), escape("" + element.key)) : index.toString(36);
      }
      function resolveThenable(thenable) {
        switch (thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenable.reason;
          default:
            switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
              function(fulfilledValue) {
                "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
              },
              function(error) {
                "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
              }
            )), thenable.status) {
              case "fulfilled":
                return thenable.value;
              case "rejected":
                throw thenable.reason;
            }
        }
        throw thenable;
      }
      function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
        var type = typeof children;
        if ("undefined" === type || "boolean" === type) children = null;
        var invokeCallback = false;
        if (null === children) invokeCallback = true;
        else
          switch (type) {
            case "bigint":
            case "string":
            case "number":
              invokeCallback = true;
              break;
            case "object":
              switch (children.$$typeof) {
                case REACT_ELEMENT_TYPE:
                case REACT_PORTAL_TYPE:
                  invokeCallback = true;
                  break;
                case REACT_LAZY_TYPE:
                  return invokeCallback = children._init, mapIntoArray(
                    invokeCallback(children._payload),
                    array,
                    escapedPrefix,
                    nameSoFar,
                    callback
                  );
              }
          }
        if (invokeCallback) {
          invokeCallback = children;
          callback = callback(invokeCallback);
          var childKey = "" === nameSoFar ? "." + getElementKey(invokeCallback, 0) : nameSoFar;
          isArrayImpl(callback) ? (escapedPrefix = "", null != childKey && (escapedPrefix = childKey.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
            return c;
          })) : null != callback && (isValidElement(callback) && (null != callback.key && (invokeCallback && invokeCallback.key === callback.key || checkKeyStringCoercion(callback.key)), escapedPrefix = cloneAndReplaceKey(
            callback,
            escapedPrefix + (null == callback.key || invokeCallback && invokeCallback.key === callback.key ? "" : ("" + callback.key).replace(
              userProvidedKeyEscapeRegex,
              "$&/"
            ) + "/") + childKey
          ), "" !== nameSoFar && null != invokeCallback && isValidElement(invokeCallback) && null == invokeCallback.key && invokeCallback._store && !invokeCallback._store.validated && (escapedPrefix._store.validated = 2), callback = escapedPrefix), array.push(callback));
          return 1;
        }
        invokeCallback = 0;
        childKey = "" === nameSoFar ? "." : nameSoFar + ":";
        if (isArrayImpl(children))
          for (var i = 0; i < children.length; i++)
            nameSoFar = children[i], type = childKey + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if (i = getIteratorFn(children), "function" === typeof i)
          for (i === children.entries && (didWarnAboutMaps || console.warn(
            "Using Maps as children is not supported. Use an array of keyed ReactElements instead."
          ), didWarnAboutMaps = true), children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
            nameSoFar = nameSoFar.value, type = childKey + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if ("object" === type) {
          if ("function" === typeof children.then)
            return mapIntoArray(
              resolveThenable(children),
              array,
              escapedPrefix,
              nameSoFar,
              callback
            );
          array = String(children);
          throw Error(
            "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
          );
        }
        return invokeCallback;
      }
      function mapChildren(children, func, context) {
        if (null == children) return children;
        var result = [], count = 0;
        mapIntoArray(children, result, "", "", function(child) {
          return func.call(context, child, count++);
        });
        return result;
      }
      function lazyInitializer(payload) {
        if (-1 === payload._status) {
          var ioInfo = payload._ioInfo;
          null != ioInfo && (ioInfo.start = ioInfo.end = performance.now());
          ioInfo = payload._result;
          var thenable = ioInfo();
          thenable.then(
            function(moduleObject) {
              if (0 === payload._status || -1 === payload._status) {
                payload._status = 1;
                payload._result = moduleObject;
                var _ioInfo = payload._ioInfo;
                null != _ioInfo && (_ioInfo.end = performance.now());
                void 0 === thenable.status && (thenable.status = "fulfilled", thenable.value = moduleObject);
              }
            },
            function(error) {
              if (0 === payload._status || -1 === payload._status) {
                payload._status = 2;
                payload._result = error;
                var _ioInfo2 = payload._ioInfo;
                null != _ioInfo2 && (_ioInfo2.end = performance.now());
                void 0 === thenable.status && (thenable.status = "rejected", thenable.reason = error);
              }
            }
          );
          ioInfo = payload._ioInfo;
          if (null != ioInfo) {
            ioInfo.value = thenable;
            var displayName = thenable.displayName;
            "string" === typeof displayName && (ioInfo.name = displayName);
          }
          -1 === payload._status && (payload._status = 0, payload._result = thenable);
        }
        if (1 === payload._status)
          return ioInfo = payload._result, void 0 === ioInfo && console.error(
            "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?",
            ioInfo
          ), "default" in ioInfo || console.error(
            "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))",
            ioInfo
          ), ioInfo.default;
        throw payload._result;
      }
      function resolveDispatcher() {
        var dispatcher = ReactSharedInternals.H;
        null === dispatcher && console.error(
          "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."
        );
        return dispatcher;
      }
      function releaseAsyncTransition() {
        ReactSharedInternals.asyncTransitions--;
      }
      function enqueueTask(task) {
        if (null === enqueueTaskImpl)
          try {
            var requireString = ("require" + Math.random()).slice(0, 7);
            enqueueTaskImpl = (module && module[requireString]).call(
              module,
              "timers"
            ).setImmediate;
          } catch (_err) {
            enqueueTaskImpl = function(callback) {
              false === didWarnAboutMessageChannel && (didWarnAboutMessageChannel = true, "undefined" === typeof MessageChannel && console.error(
                "This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."
              ));
              var channel = new MessageChannel();
              channel.port1.onmessage = callback;
              channel.port2.postMessage(void 0);
            };
          }
        return enqueueTaskImpl(task);
      }
      function aggregateErrors(errors) {
        return 1 < errors.length && "function" === typeof AggregateError ? new AggregateError(errors) : errors[0];
      }
      function popActScope(prevActQueue, prevActScopeDepth) {
        prevActScopeDepth !== actScopeDepth - 1 && console.error(
          "You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "
        );
        actScopeDepth = prevActScopeDepth;
      }
      function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
        var queue = ReactSharedInternals.actQueue;
        if (null !== queue)
          if (0 !== queue.length)
            try {
              flushActQueue(queue);
              enqueueTask(function() {
                return recursivelyFlushAsyncActWork(returnValue, resolve, reject);
              });
              return;
            } catch (error) {
              ReactSharedInternals.thrownErrors.push(error);
            }
          else ReactSharedInternals.actQueue = null;
        0 < ReactSharedInternals.thrownErrors.length ? (queue = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, reject(queue)) : resolve(returnValue);
      }
      function flushActQueue(queue) {
        if (!isFlushing) {
          isFlushing = true;
          var i = 0;
          try {
            for (; i < queue.length; i++) {
              var callback = queue[i];
              do {
                ReactSharedInternals.didUsePromise = false;
                var continuation = callback(false);
                if (null !== continuation) {
                  if (ReactSharedInternals.didUsePromise) {
                    queue[i] = callback;
                    queue.splice(0, i);
                    return;
                  }
                  callback = continuation;
                } else break;
              } while (1);
            }
            queue.length = 0;
          } catch (error) {
            queue.splice(0, i + 1), ReactSharedInternals.thrownErrors.push(error);
          } finally {
            isFlushing = false;
          }
        }
      }
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
      var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator, didWarnStateUpdateForUnmountedComponent = {}, ReactNoopUpdateQueue = {
        isMounted: function() {
          return false;
        },
        enqueueForceUpdate: function(publicInstance) {
          warnNoop(publicInstance, "forceUpdate");
        },
        enqueueReplaceState: function(publicInstance) {
          warnNoop(publicInstance, "replaceState");
        },
        enqueueSetState: function(publicInstance) {
          warnNoop(publicInstance, "setState");
        }
      }, assign = Object.assign, emptyObject = {};
      Object.freeze(emptyObject);
      Component.prototype.isReactComponent = {};
      Component.prototype.setState = function(partialState, callback) {
        if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
          throw Error(
            "takes an object of state variables to update or a function which returns an object of state variables."
          );
        this.updater.enqueueSetState(this, partialState, callback, "setState");
      };
      Component.prototype.forceUpdate = function(callback) {
        this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
      };
      var deprecatedAPIs = {
        isMounted: [
          "isMounted",
          "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."
        ],
        replaceState: [
          "replaceState",
          "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."
        ]
      };
      for (fnName in deprecatedAPIs)
        deprecatedAPIs.hasOwnProperty(fnName) && defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
      ComponentDummy.prototype = Component.prototype;
      deprecatedAPIs = PureComponent.prototype = new ComponentDummy();
      deprecatedAPIs.constructor = PureComponent;
      assign(deprecatedAPIs, Component.prototype);
      deprecatedAPIs.isPureReactComponent = true;
      var isArrayImpl = Array.isArray, REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference"), ReactSharedInternals = {
        H: null,
        A: null,
        T: null,
        S: null,
        actQueue: null,
        asyncTransitions: 0,
        isBatchingLegacy: false,
        didScheduleLegacyUpdate: false,
        didUsePromise: false,
        thrownErrors: [],
        getCurrentStack: null,
        recentlyCreatedOwnerStacks: 0
      }, hasOwnProperty = Object.prototype.hasOwnProperty, createTask = console.createTask ? console.createTask : function() {
        return null;
      };
      deprecatedAPIs = {
        react_stack_bottom_frame: function(callStackForError) {
          return callStackForError();
        }
      };
      var specialPropKeyWarningShown, didWarnAboutOldJSXRuntime;
      var didWarnAboutElementRef = {};
      var unknownOwnerDebugStack = deprecatedAPIs.react_stack_bottom_frame.bind(
        deprecatedAPIs,
        UnknownOwner
      )();
      var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
      var didWarnAboutMaps = false, userProvidedKeyEscapeRegex = /\/+/g, reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
        if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
          var event = new window.ErrorEvent("error", {
            bubbles: true,
            cancelable: true,
            message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
            error
          });
          if (!window.dispatchEvent(event)) return;
        } else if ("object" === typeof process && "function" === typeof process.emit) {
          process.emit("uncaughtException", error);
          return;
        }
        console.error(error);
      }, didWarnAboutMessageChannel = false, enqueueTaskImpl = null, actScopeDepth = 0, didWarnNoAwaitAct = false, isFlushing = false, queueSeveralMicrotasks = "function" === typeof queueMicrotask ? function(callback) {
        queueMicrotask(function() {
          return queueMicrotask(callback);
        });
      } : enqueueTask;
      deprecatedAPIs = Object.freeze({
        __proto__: null,
        c: function(size) {
          return resolveDispatcher().useMemoCache(size);
        }
      });
      var fnName = {
        map: mapChildren,
        forEach: function(children, forEachFunc, forEachContext) {
          mapChildren(
            children,
            function() {
              forEachFunc.apply(this, arguments);
            },
            forEachContext
          );
        },
        count: function(children) {
          var n = 0;
          mapChildren(children, function() {
            n++;
          });
          return n;
        },
        toArray: function(children) {
          return mapChildren(children, function(child) {
            return child;
          }) || [];
        },
        only: function(children) {
          if (!isValidElement(children))
            throw Error(
              "React.Children.only expected to receive a single React element child."
            );
          return children;
        }
      };
      exports.Activity = REACT_ACTIVITY_TYPE;
      exports.Children = fnName;
      exports.Component = Component;
      exports.Fragment = REACT_FRAGMENT_TYPE;
      exports.Profiler = REACT_PROFILER_TYPE;
      exports.PureComponent = PureComponent;
      exports.StrictMode = REACT_STRICT_MODE_TYPE;
      exports.Suspense = REACT_SUSPENSE_TYPE;
      exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
      exports.__COMPILER_RUNTIME = deprecatedAPIs;
      exports.act = function(callback) {
        var prevActQueue = ReactSharedInternals.actQueue, prevActScopeDepth = actScopeDepth;
        actScopeDepth++;
        var queue = ReactSharedInternals.actQueue = null !== prevActQueue ? prevActQueue : [], didAwaitActCall = false;
        try {
          var result = callback();
        } catch (error) {
          ReactSharedInternals.thrownErrors.push(error);
        }
        if (0 < ReactSharedInternals.thrownErrors.length)
          throw popActScope(prevActQueue, prevActScopeDepth), callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
        if (null !== result && "object" === typeof result && "function" === typeof result.then) {
          var thenable = result;
          queueSeveralMicrotasks(function() {
            didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
              "You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"
            ));
          });
          return {
            then: function(resolve, reject) {
              didAwaitActCall = true;
              thenable.then(
                function(returnValue) {
                  popActScope(prevActQueue, prevActScopeDepth);
                  if (0 === prevActScopeDepth) {
                    try {
                      flushActQueue(queue), enqueueTask(function() {
                        return recursivelyFlushAsyncActWork(
                          returnValue,
                          resolve,
                          reject
                        );
                      });
                    } catch (error$0) {
                      ReactSharedInternals.thrownErrors.push(error$0);
                    }
                    if (0 < ReactSharedInternals.thrownErrors.length) {
                      var _thrownError = aggregateErrors(
                        ReactSharedInternals.thrownErrors
                      );
                      ReactSharedInternals.thrownErrors.length = 0;
                      reject(_thrownError);
                    }
                  } else resolve(returnValue);
                },
                function(error) {
                  popActScope(prevActQueue, prevActScopeDepth);
                  0 < ReactSharedInternals.thrownErrors.length ? (error = aggregateErrors(
                    ReactSharedInternals.thrownErrors
                  ), ReactSharedInternals.thrownErrors.length = 0, reject(error)) : reject(error);
                }
              );
            }
          };
        }
        var returnValue$jscomp$0 = result;
        popActScope(prevActQueue, prevActScopeDepth);
        0 === prevActScopeDepth && (flushActQueue(queue), 0 !== queue.length && queueSeveralMicrotasks(function() {
          didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
            "A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)"
          ));
        }), ReactSharedInternals.actQueue = null);
        if (0 < ReactSharedInternals.thrownErrors.length)
          throw callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
        return {
          then: function(resolve, reject) {
            didAwaitActCall = true;
            0 === prevActScopeDepth ? (ReactSharedInternals.actQueue = queue, enqueueTask(function() {
              return recursivelyFlushAsyncActWork(
                returnValue$jscomp$0,
                resolve,
                reject
              );
            })) : resolve(returnValue$jscomp$0);
          }
        };
      };
      exports.cache = function(fn) {
        return function() {
          return fn.apply(null, arguments);
        };
      };
      exports.cacheSignal = function() {
        return null;
      };
      exports.captureOwnerStack = function() {
        var getCurrentStack = ReactSharedInternals.getCurrentStack;
        return null === getCurrentStack ? null : getCurrentStack();
      };
      exports.cloneElement = function(element, config, children) {
        if (null === element || void 0 === element)
          throw Error(
            "The argument must be a React element, but you passed " + element + "."
          );
        var props = assign({}, element.props), key = element.key, owner = element._owner;
        if (null != config) {
          var JSCompiler_inline_result;
          a: {
            if (hasOwnProperty.call(config, "ref") && (JSCompiler_inline_result = Object.getOwnPropertyDescriptor(
              config,
              "ref"
            ).get) && JSCompiler_inline_result.isReactWarning) {
              JSCompiler_inline_result = false;
              break a;
            }
            JSCompiler_inline_result = void 0 !== config.ref;
          }
          JSCompiler_inline_result && (owner = getOwner());
          hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key);
          for (propName in config)
            !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
        }
        var propName = arguments.length - 2;
        if (1 === propName) props.children = children;
        else if (1 < propName) {
          JSCompiler_inline_result = Array(propName);
          for (var i = 0; i < propName; i++)
            JSCompiler_inline_result[i] = arguments[i + 2];
          props.children = JSCompiler_inline_result;
        }
        props = ReactElement(
          element.type,
          key,
          props,
          owner,
          element._debugStack,
          element._debugTask
        );
        for (key = 2; key < arguments.length; key++)
          validateChildKeys(arguments[key]);
        return props;
      };
      exports.createContext = function(defaultValue) {
        defaultValue = {
          $$typeof: REACT_CONTEXT_TYPE,
          _currentValue: defaultValue,
          _currentValue2: defaultValue,
          _threadCount: 0,
          Provider: null,
          Consumer: null
        };
        defaultValue.Provider = defaultValue;
        defaultValue.Consumer = {
          $$typeof: REACT_CONSUMER_TYPE,
          _context: defaultValue
        };
        defaultValue._currentRenderer = null;
        defaultValue._currentRenderer2 = null;
        return defaultValue;
      };
      exports.createElement = function(type, config, children) {
        for (var i = 2; i < arguments.length; i++)
          validateChildKeys(arguments[i]);
        i = {};
        var key = null;
        if (null != config)
          for (propName in didWarnAboutOldJSXRuntime || !("__self" in config) || "key" in config || (didWarnAboutOldJSXRuntime = true, console.warn(
            "Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform"
          )), hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key), config)
            hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (i[propName] = config[propName]);
        var childrenLength = arguments.length - 2;
        if (1 === childrenLength) i.children = children;
        else if (1 < childrenLength) {
          for (var childArray = Array(childrenLength), _i = 0; _i < childrenLength; _i++)
            childArray[_i] = arguments[_i + 2];
          Object.freeze && Object.freeze(childArray);
          i.children = childArray;
        }
        if (type && type.defaultProps)
          for (propName in childrenLength = type.defaultProps, childrenLength)
            void 0 === i[propName] && (i[propName] = childrenLength[propName]);
        key && defineKeyPropWarningGetter(
          i,
          "function" === typeof type ? type.displayName || type.name || "Unknown" : type
        );
        var propName = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return ReactElement(
          type,
          key,
          i,
          getOwner(),
          propName ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
          propName ? createTask(getTaskName(type)) : unknownOwnerDebugTask
        );
      };
      exports.createRef = function() {
        var refObject = { current: null };
        Object.seal(refObject);
        return refObject;
      };
      exports.forwardRef = function(render) {
        null != render && render.$$typeof === REACT_MEMO_TYPE ? console.error(
          "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...))."
        ) : "function" !== typeof render ? console.error(
          "forwardRef requires a render function but was given %s.",
          null === render ? "null" : typeof render
        ) : 0 !== render.length && 2 !== render.length && console.error(
          "forwardRef render functions accept exactly two parameters: props and ref. %s",
          1 === render.length ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."
        );
        null != render && null != render.defaultProps && console.error(
          "forwardRef render functions do not support defaultProps. Did you accidentally pass a React component?"
        );
        var elementType = { $$typeof: REACT_FORWARD_REF_TYPE, render }, ownName;
        Object.defineProperty(elementType, "displayName", {
          enumerable: false,
          configurable: true,
          get: function() {
            return ownName;
          },
          set: function(name) {
            ownName = name;
            render.name || render.displayName || (Object.defineProperty(render, "name", { value: name }), render.displayName = name);
          }
        });
        return elementType;
      };
      exports.isValidElement = isValidElement;
      exports.lazy = function(ctor) {
        ctor = { _status: -1, _result: ctor };
        var lazyType = {
          $$typeof: REACT_LAZY_TYPE,
          _payload: ctor,
          _init: lazyInitializer
        }, ioInfo = {
          name: "lazy",
          start: -1,
          end: -1,
          value: null,
          owner: null,
          debugStack: Error("react-stack-top-frame"),
          debugTask: console.createTask ? console.createTask("lazy()") : null
        };
        ctor._ioInfo = ioInfo;
        lazyType._debugInfo = [{ awaited: ioInfo }];
        return lazyType;
      };
      exports.memo = function(type, compare) {
        null == type && console.error(
          "memo: The first argument must be a component. Instead received: %s",
          null === type ? "null" : typeof type
        );
        compare = {
          $$typeof: REACT_MEMO_TYPE,
          type,
          compare: void 0 === compare ? null : compare
        };
        var ownName;
        Object.defineProperty(compare, "displayName", {
          enumerable: false,
          configurable: true,
          get: function() {
            return ownName;
          },
          set: function(name) {
            ownName = name;
            type.name || type.displayName || (Object.defineProperty(type, "name", { value: name }), type.displayName = name);
          }
        });
        return compare;
      };
      exports.startTransition = function(scope) {
        var prevTransition = ReactSharedInternals.T, currentTransition = {};
        currentTransition._updatedFibers = /* @__PURE__ */ new Set();
        ReactSharedInternals.T = currentTransition;
        try {
          var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
          null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
          "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && (ReactSharedInternals.asyncTransitions++, returnValue.then(releaseAsyncTransition, releaseAsyncTransition), returnValue.then(noop, reportGlobalError));
        } catch (error) {
          reportGlobalError(error);
        } finally {
          null === prevTransition && currentTransition._updatedFibers && (scope = currentTransition._updatedFibers.size, currentTransition._updatedFibers.clear(), 10 < scope && console.warn(
            "Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."
          )), null !== prevTransition && null !== currentTransition.types && (null !== prevTransition.types && prevTransition.types !== currentTransition.types && console.error(
            "We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."
          ), prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
        }
      };
      exports.unstable_useCacheRefresh = function() {
        return resolveDispatcher().useCacheRefresh();
      };
      exports.use = function(usable) {
        return resolveDispatcher().use(usable);
      };
      exports.useActionState = function(action, initialState, permalink) {
        return resolveDispatcher().useActionState(
          action,
          initialState,
          permalink
        );
      };
      exports.useCallback = function(callback, deps) {
        return resolveDispatcher().useCallback(callback, deps);
      };
      exports.useContext = function(Context) {
        var dispatcher = resolveDispatcher();
        Context.$$typeof === REACT_CONSUMER_TYPE && console.error(
          "Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?"
        );
        return dispatcher.useContext(Context);
      };
      exports.useDebugValue = function(value, formatterFn) {
        return resolveDispatcher().useDebugValue(value, formatterFn);
      };
      exports.useDeferredValue = function(value, initialValue) {
        return resolveDispatcher().useDeferredValue(value, initialValue);
      };
      exports.useEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useEffect(create, deps);
      };
      exports.useEffectEvent = function(callback) {
        return resolveDispatcher().useEffectEvent(callback);
      };
      exports.useId = function() {
        return resolveDispatcher().useId();
      };
      exports.useImperativeHandle = function(ref, create, deps) {
        return resolveDispatcher().useImperativeHandle(ref, create, deps);
      };
      exports.useInsertionEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useInsertionEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useInsertionEffect(create, deps);
      };
      exports.useLayoutEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useLayoutEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useLayoutEffect(create, deps);
      };
      exports.useMemo = function(create, deps) {
        return resolveDispatcher().useMemo(create, deps);
      };
      exports.useOptimistic = function(passthrough, reducer) {
        return resolveDispatcher().useOptimistic(passthrough, reducer);
      };
      exports.useReducer = function(reducer, initialArg, init) {
        return resolveDispatcher().useReducer(reducer, initialArg, init);
      };
      exports.useRef = function(initialValue) {
        return resolveDispatcher().useRef(initialValue);
      };
      exports.useState = function(initialState) {
        return resolveDispatcher().useState(initialState);
      };
      exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
        return resolveDispatcher().useSyncExternalStore(
          subscribe,
          getSnapshot,
          getServerSnapshot
        );
      };
      exports.useTransition = function() {
        return resolveDispatcher().useTransition();
      };
      exports.version = "19.2.7";
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
    })();
  }
});

// node_modules/react/index.js
var require_react = __commonJS({
  "node_modules/react/index.js"(exports, module) {
    "use strict";
    if (process.env.NODE_ENV === "production") {
      module.exports = require_react_production();
    } else {
      module.exports = require_react_development();
    }
  }
});

// node_modules/react/cjs/react-jsx-runtime.production.js
var require_react_jsx_runtime_production = __commonJS({
  "node_modules/react/cjs/react-jsx-runtime.production.js"(exports) {
    "use strict";
    var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element");
    var REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment");
    function jsxProd(type, config, maybeKey) {
      var key = null;
      void 0 !== maybeKey && (key = "" + maybeKey);
      void 0 !== config.key && (key = "" + config.key);
      if ("key" in config) {
        maybeKey = {};
        for (var propName in config)
          "key" !== propName && (maybeKey[propName] = config[propName]);
      } else maybeKey = config;
      config = maybeKey.ref;
      return {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        ref: void 0 !== config ? config : null,
        props: maybeKey
      };
    }
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsx = jsxProd;
    exports.jsxs = jsxProd;
  }
});

// node_modules/react/cjs/react-jsx-runtime.development.js
var require_react_jsx_runtime_development = __commonJS({
  "node_modules/react/cjs/react-jsx-runtime.development.js"(exports) {
    "use strict";
    "production" !== process.env.NODE_ENV && (function() {
      function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type)
          return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return "Fragment";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
          case REACT_ACTIVITY_TYPE:
            return "Activity";
        }
        if ("object" === typeof type)
          switch ("number" === typeof type.tag && console.error(
            "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
          ), type.$$typeof) {
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_CONTEXT_TYPE:
              return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
              return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
              var innerType = type.render;
              type = type.displayName;
              type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
              return type;
            case REACT_MEMO_TYPE:
              return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
              innerType = type._payload;
              type = type._init;
              try {
                return getComponentNameFromType(type(innerType));
              } catch (x) {
              }
          }
        return null;
      }
      function testStringCoercion(value) {
        return "" + value;
      }
      function checkKeyStringCoercion(value) {
        try {
          testStringCoercion(value);
          var JSCompiler_inline_result = false;
        } catch (e) {
          JSCompiler_inline_result = true;
        }
        if (JSCompiler_inline_result) {
          JSCompiler_inline_result = console;
          var JSCompiler_temp_const = JSCompiler_inline_result.error;
          var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
          JSCompiler_temp_const.call(
            JSCompiler_inline_result,
            "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
            JSCompiler_inline_result$jscomp$0
          );
          return testStringCoercion(value);
        }
      }
      function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE)
          return "<...>";
        try {
          var name = getComponentNameFromType(type);
          return name ? "<" + name + ">" : "<...>";
        } catch (x) {
          return "<...>";
        }
      }
      function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
      }
      function UnknownOwner() {
        return Error("react-stack-top-frame");
      }
      function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
          var getter = Object.getOwnPropertyDescriptor(config, "key").get;
          if (getter && getter.isReactWarning) return false;
        }
        return void 0 !== config.key;
      }
      function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
          specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error(
            "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
            displayName
          ));
        }
        warnAboutAccessingKey.isReactWarning = true;
        Object.defineProperty(props, "key", {
          get: warnAboutAccessingKey,
          configurable: true
        });
      }
      function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error(
          "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
        ));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
      }
      function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          props,
          _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
          enumerable: false,
          get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: null
        });
        Object.defineProperty(type, "_debugStack", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
      }
      function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children)
          if (isStaticChildren)
            if (isArrayImpl(children)) {
              for (isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)
                validateChildKeys(children[isStaticChildren]);
              Object.freeze && Object.freeze(children);
            } else
              console.error(
                "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
              );
          else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
          children = getComponentNameFromType(type);
          var keys = Object.keys(config).filter(function(k) {
            return "key" !== k;
          });
          isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
          didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error(
            'A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />',
            isStaticChildren,
            children,
            keys,
            children
          ), didWarnAboutKeySpread[children + isStaticChildren] = true);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
          maybeKey = {};
          for (var propName in config)
            "key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(
          maybeKey,
          "function" === typeof type ? type.displayName || type.name || "Unknown" : type
        );
        return ReactElement(
          type,
          children,
          maybeKey,
          getOwner(),
          debugStack,
          debugTask
        );
      }
      function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
      }
      function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      var React2 = require_react(), REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity"), REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference"), ReactSharedInternals = React2.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
      };
      React2 = {
        react_stack_bottom_frame: function(callStackForError) {
          return callStackForError();
        }
      };
      var specialPropKeyWarningShown;
      var didWarnAboutElementRef = {};
      var unknownOwnerDebugStack = React2.react_stack_bottom_frame.bind(
        React2,
        UnknownOwner
      )();
      var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
      var didWarnAboutKeySpread = {};
      exports.Fragment = REACT_FRAGMENT_TYPE;
      exports.jsx = function(type, config, maybeKey) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return jsxDEVImpl(
          type,
          config,
          maybeKey,
          false,
          trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
          trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask
        );
      };
      exports.jsxs = function(type, config, maybeKey) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return jsxDEVImpl(
          type,
          config,
          maybeKey,
          true,
          trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
          trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask
        );
      };
    })();
  }
});

// node_modules/react/jsx-runtime.js
var require_jsx_runtime = __commonJS({
  "node_modules/react/jsx-runtime.js"(exports, module) {
    "use strict";
    if (process.env.NODE_ENV === "production") {
      module.exports = require_react_jsx_runtime_production();
    } else {
      module.exports = require_react_jsx_runtime_development();
    }
  }
});

// packages/runner/src/runner.ts
import { createInterface } from "node:readline";

// packages/runner/src/protocol.ts
var runnerProtocolVersion = 1;
function packFrame(frame) {
  return {
    width: frame.width,
    height: frame.height,
    colors: frame.cells.map((cell) => cell.color)
  };
}

// packages/game-sdk/src/effects.ts
function paintDiamondRing(frame, options) {
  const centerX = options.centerX ?? (frame.width - 1) / 2;
  const centerY = options.centerY ?? (frame.height - 1) / 2;
  const radius = Math.max(0, options.radius);
  const thickness = Math.max(0, options.thickness ?? 1);
  visitFrame(frame, options.color, (x, y) => {
    const distance = manhattanDistance(x, y, centerX, centerY);
    return {
      distance,
      phase: Math.abs(distance - radius),
      selected: Math.abs(distance - radius) <= thickness
    };
  }, 0);
}
function paintDiamondWave(frame, options) {
  const centerX = options.centerX ?? (frame.width - 1) / 2;
  const centerY = options.centerY ?? (frame.height - 1) / 2;
  const period = Math.max(1, Math.floor(options.period ?? 7));
  const bandWidth = Math.min(period, Math.max(1, Math.floor(options.bandWidth ?? 2)));
  const step = Math.floor(options.step);
  visitFrame(frame, options.color, (x, y) => {
    const distance = Math.floor(manhattanDistance(x, y, centerX, centerY));
    const phase = positiveModulo(distance + step, period);
    return { distance, phase, selected: phase < bandWidth };
  }, step);
}
function visitFrame(frame, color, select, step) {
  for (let y = 0; y < frame.height; y += 1) {
    for (let x = 0; x < frame.width; x += 1) {
      const selection = select(x, y);
      if (!selection.selected) {
        continue;
      }
      const resolvedColor = typeof color === "function" ? color({ distance: selection.distance, phase: selection.phase, step, x, y }) : color;
      if (resolvedColor) {
        frame.cells[y * frame.width + x] = { x, y, color: resolvedColor };
      }
    }
  }
}
function manhattanDistance(x, y, centerX, centerY) {
  return Math.abs(x - centerX) + Math.abs(y - centerY);
}
function positiveModulo(value, divisor) {
  return (value % divisor + divisor) % divisor;
}

// packages/game-sdk/src/index.ts
var FLOOR_COLS = 16;
var FLOOR_ROWS = 32;
var DEFAULT_GAME_SEED = 137;
var MIN_GAME_SEED = 0;
var MAX_GAME_SEED = 4294967295;
var FRAME_SIZE = FLOOR_COLS * FLOOR_ROWS;
var DEFAULT_START_COUNTDOWN_MILLIS = 2e3;
var DEFAULT_PLAYER_RELEASE_GRACE_MILLIS = 650;
var DEFAULT_GAME_DIFFICULTIES = ["easy", "medium", "hard", "expert"];
var DEFAULT_ENGINE_FPS = 50;
var DEFAULT_ENGINE_FRAME_MILLIS = 1e3 / DEFAULT_ENGINE_FPS;
function inFloorBounds(x, y) {
  return Number.isInteger(x) && Number.isInteger(y) && x >= 0 && x < FLOOR_COLS && y >= 0 && y < FLOOR_ROWS;
}
function normalizeGameConfig(config, manifest5) {
  return {
    seed: normalizeGameSeed(config.seed),
    playerCount: normalizePlayerCount(config.playerCount, manifest5),
    players: Array.isArray(config.players) ? config.players : [],
    durationMillis: normalizeNonNegativeNumber(config.durationMillis, manifest5.defaultDurationMillis),
    nowMillis: normalizeNonNegativeNumber(config.nowMillis, 0),
    difficulty: normalizeGameDifficulty(config.difficulty, manifest5),
    options: normalizeGameConfigOptions(config.options, manifest5)
  };
}
function normalizeGameSeed(value) {
  const candidate = typeof value === "number" && Number.isFinite(value) ? Math.trunc(value) : DEFAULT_GAME_SEED;
  return clamp(candidate, MIN_GAME_SEED, MAX_GAME_SEED);
}
function normalizePlayerCount(value, manifest5) {
  const rounded = typeof value === "number" && Number.isFinite(value) ? Math.round(value) : defaultGamePlayerCount(manifest5);
  if (manifest5.players.allowAny === true && rounded === 0) {
    return 0;
  }
  return clamp(rounded, manifest5.players.min, manifest5.players.max);
}
function defaultGamePlayerCount(manifest5) {
  return manifest5.players.allowAny ? 0 : manifest5.players.min;
}
function normalizeNonNegativeNumber(value, fallback) {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : fallback;
}
function gameDifficultyOptions(manifest5) {
  const configured = manifest5.config?.difficulty?.options;
  return configured?.length ? [...configured] : [...DEFAULT_GAME_DIFFICULTIES];
}
function normalizeGameDifficulty(value, manifest5) {
  const options = gameDifficultyOptions(manifest5);
  const configuredDefault = manifest5.config?.difficulty?.default;
  const fallback = configuredDefault && options.includes(configuredDefault) ? configuredDefault : options.includes("medium") ? "medium" : options[0] ?? "medium";
  return value && options.includes(value) ? value : fallback;
}
function normalizeGameConfigOptions(options, manifest5) {
  const source = options ?? {};
  return Object.fromEntries(
    (manifest5.config?.vars ?? []).map((configVar) => [
      configVar.key,
      normalizeGameConfigValue(configVar, source[configVar.key])
    ])
  );
}
function normalizeGameConfigValue(configVar, value) {
  if (configVar.type === "bool") {
    const normalized2 = value === true || value === "true" ? true : value === false || value === "false" ? false : configVar.default;
    return normalized2;
  }
  if (configVar.type === "enum") {
    const candidate = String(value ?? configVar.default);
    const normalized2 = configVar.options.some((option) => option.value === candidate) ? candidate : configVar.default;
    return normalized2;
  }
  const numeric = typeof value === "number" && Number.isFinite(value) ? value : typeof value === "string" && value.trim() !== "" ? Number(value) : Number.NaN;
  const finite = Number.isFinite(numeric) ? numeric : configVar.default;
  const rounded = configVar.type === "int" ? Math.round(finite) : finite;
  const normalized = clamp(rounded, configVar.min ?? -Infinity, configVar.max ?? Infinity);
  return normalized;
}
function readGameConfigOption(options, configVar) {
  return normalizeGameConfigValue(configVar, options[configVar.key]);
}
function createFrame(fill = "#05070a") {
  const cells = [];
  for (let y = 0; y < FLOOR_ROWS; y += 1) {
    for (let x = 0; x < FLOOR_COLS; x += 1) {
      cells.push({ x, y, color: fill });
    }
  }
  return {
    width: FLOOR_COLS,
    height: FLOOR_ROWS,
    cells
  };
}
function paintFrameCell(frame, x, y, color) {
  if (!inFloorBounds(x, y)) {
    return;
  }
  frame.cells[y * frame.width + x] = { x, y, color };
}
function fillFrameRect(frame, x, y, width, height, color) {
  for (let yy = y; yy < y + height; yy += 1) {
    for (let xx = x; xx < x + width; xx += 1) {
      paintFrameCell(frame, xx, yy, color);
    }
  }
}
function gameEvent(cue, message, atMillis) {
  return { cue, message: message.trimEnd().replace(/\.+$/u, ""), atMillis };
}
function createSeededRng(seed) {
  let state = seed >>> 0;
  if (state === 0) {
    state = 1;
  }
  return {
    next() {
      state = Math.imul(state, 1664525) + 1013904223 >>> 0;
      return state / 4294967296;
    },
    int(maxExclusive) {
      if (!Number.isFinite(maxExclusive) || maxExclusive <= 0) {
        throw new Error("maxExclusive must be greater than zero");
      }
      return Math.floor(this.next() * maxExclusive);
    },
    range(minInclusive, maxInclusive) {
      if (maxInclusive < minInclusive) {
        throw new Error("maxInclusive must be greater than or equal to minInclusive");
      }
      return minInclusive + this.int(maxInclusive - minInclusive + 1);
    }
  };
}
function defaultPlayers(count, players = []) {
  const colors = ["#35d7ff", "#ff3bd7", "#ffe176", "#5fff9e"];
  return Array.from({ length: count }, (_, index) => ({
    index,
    label: players[index]?.label || players[index]?.name || `Player ${index + 1}`,
    color: players[index]?.color || colors[index % colors.length] || colors[0],
    score: 0,
    lives: -1
  }));
}
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
function createHorizontalPlayerReadyZones(count, bounds = {}) {
  if (!Number.isInteger(count) || count < 1) {
    throw new Error("player ready zone count must be a positive integer");
  }
  const minX = clamp(Math.round(bounds.minX ?? 0), 0, FLOOR_COLS - 1);
  const maxX = clamp(Math.round(bounds.maxX ?? FLOOR_COLS - 1), minX, FLOOR_COLS - 1);
  const minY = clamp(Math.round(bounds.minY ?? 0), 0, FLOOR_ROWS - 1);
  const maxY = clamp(Math.round(bounds.maxY ?? FLOOR_ROWS - 1), minY, FLOOR_ROWS - 1);
  const height = maxY - minY + 1;
  if (count > height) {
    throw new Error("player ready zone count cannot exceed the available floor rows");
  }
  return Array.from({ length: count }, (_, index) => ({
    minX,
    maxX,
    minY: minY + Math.floor(height * index / count),
    maxY: minY + Math.floor(height * (index + 1) / count) - 1
  }));
}
function createPlayerReadyGate(policy, zones, nowMillis = 0) {
  return new DefaultPlayerReadyGate(policy, zones, nowMillis);
}
function gameStartCountdownMillis(policy) {
  return normalizePositiveMillis(
    policy.mode === "player-ready" ? policy.countdownMillis : void 0,
    DEFAULT_START_COUNTDOWN_MILLIS
  );
}
function createGameEngine(game, options = {}) {
  return new DefaultGameEngine(game, options);
}
function normalizeEngineFps(fps) {
  if (fps === void 0 || !Number.isFinite(fps) || fps <= 0) {
    return DEFAULT_ENGINE_FPS;
  }
  return fps;
}
function normalizeMillis(value) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}
var DefaultPlayerReadyGate = class {
  constructor(policy, zones, nowMillis) {
    this.policy = policy;
    this.zones = zones;
    if (policy.mode === "player-ready" && zones.length === 0) {
      throw new Error("player-ready games require at least one presence zone");
    }
    this.countdownDuration = gameStartCountdownMillis(policy);
    this.releaseGraceMillis = normalizePositiveMillis(
      policy.mode === "player-ready" ? policy.releaseGraceMillis : void 0,
      DEFAULT_PLAYER_RELEASE_GRACE_MILLIS
    );
    this.zoneHeld = Array.from({ length: zones.length }, () => 0);
    this.zoneGraceUntil = Array.from({ length: zones.length }, () => 0);
    this.phase = policy.mode === "immediate" ? "running" : "waiting";
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      for (let x = 0; x < FLOOR_COLS; x += 1) {
        this.tileZones[y * FLOOR_COLS + x] = zones.findIndex((zone) => pointInReadyZone(x, y, zone));
      }
    }
    this.reset(nowMillis);
  }
  policy;
  zones;
  countdownDuration;
  releaseGraceMillis;
  tileZones = new Int16Array(FRAME_SIZE).fill(-1);
  tileHeld = new Uint8Array(FRAME_SIZE);
  zoneHeld;
  zoneGraceUntil;
  phase;
  startAtMillis = 0;
  reset(nowMillis = 0) {
    this.tileHeld.fill(0);
    this.zoneHeld.fill(0);
    this.zoneGraceUntil.fill(0);
    this.phase = this.policy.mode === "immediate" ? "running" : "waiting";
    this.startAtMillis = normalizeMillis(nowMillis);
    return this.state(nowMillis);
  }
  update(event) {
    if (!inFloorBounds(event.x, event.y)) {
      return this.tick(event.atMillis);
    }
    const tileIndex = event.y * FLOOR_COLS + event.x;
    const zoneIndex = this.tileZones[tileIndex] ?? -1;
    const held = this.tileHeld[tileIndex] === 1;
    if (zoneIndex >= 0 && held !== event.pressed) {
      this.tileHeld[tileIndex] = event.pressed ? 1 : 0;
      if (event.pressed) {
        this.zoneHeld[zoneIndex] = (this.zoneHeld[zoneIndex] ?? 0) + 1;
        this.zoneGraceUntil[zoneIndex] = 0;
      } else {
        this.zoneHeld[zoneIndex] = Math.max(0, (this.zoneHeld[zoneIndex] ?? 0) - 1);
        if (this.zoneHeld[zoneIndex] === 0) {
          this.zoneGraceUntil[zoneIndex] = normalizeMillis(event.atMillis) + this.releaseGraceMillis;
        }
      }
    }
    return this.tick(event.atMillis);
  }
  tick(nowMillis) {
    if (this.policy.mode === "immediate" || this.phase === "running") {
      return "none";
    }
    const now = normalizeMillis(nowMillis);
    const allReady = this.readyPlayerCount(now) === this.zones.length;
    if (this.phase === "waiting" && allReady) {
      this.phase = "starting";
      this.startAtMillis = now + this.countdownDuration;
      return "players-ready";
    }
    if (this.phase === "starting" && !allReady) {
      this.phase = "waiting";
      this.startAtMillis = 0;
      return "players-left";
    }
    if (this.phase === "starting" && now >= this.startAtMillis) {
      this.phase = "running";
      return "started";
    }
    return "none";
  }
  state(nowMillis) {
    const now = normalizeMillis(nowMillis);
    return {
      phase: this.phase,
      readyPlayers: this.readyPlayerCount(now),
      requiredPlayers: this.zones.length,
      countdownMillis: this.phase === "starting" ? Math.max(0, this.startAtMillis - now) : 0
    };
  }
  zoneReady(index, nowMillis) {
    const graceUntil = this.zoneGraceUntil[index] ?? 0;
    return (this.zoneHeld[index] ?? 0) > 0 || graceUntil > 0 && graceUntil >= normalizeMillis(nowMillis);
  }
  readyPlayerCount(nowMillis) {
    return this.zones.reduce((count, _zone, index) => count + Number(this.zoneReady(index, nowMillis)), 0);
  }
};
function normalizePositiveMillis(value, fallback) {
  return value !== void 0 && Number.isFinite(value) && value > 0 ? value : fallback;
}
function pointInReadyZone(x, y, zone) {
  return x >= zone.minX && x <= zone.maxX && y >= zone.minY && y <= zone.maxY;
}
var DefaultGameEngine = class {
  currentClockMillis;
  currentFps;
  currentFrameMillis;
  currentGame;
  currentState;
  constructor(game, options) {
    this.currentGame = game;
    this.currentClockMillis = options.nowMillis ?? 0;
    this.currentFps = normalizeEngineFps(options.fps);
    this.currentFrameMillis = 1e3 / this.currentFps;
    this.currentState = this.composeState(options.initialEvents ?? []);
  }
  get clockMillis() {
    return this.currentClockMillis;
  }
  get fps() {
    return this.currentFps;
  }
  get frameMillis() {
    return this.currentFrameMillis;
  }
  get state() {
    return this.currentState;
  }
  press(x, y, atMillis = this.currentClockMillis) {
    this.currentClockMillis = Math.max(this.currentClockMillis, normalizeMillis(atMillis));
    return this.refresh(this.currentGame.press({
      x,
      y,
      pressed: true,
      atMillis: this.currentClockMillis
    }));
  }
  refresh(events = []) {
    this.currentState = this.composeState(events);
    return this.currentState;
  }
  release(x, y, atMillis = this.currentClockMillis) {
    this.currentClockMillis = Math.max(this.currentClockMillis, normalizeMillis(atMillis));
    return this.refresh(this.currentGame.release({
      x,
      y,
      pressed: false,
      atMillis: this.currentClockMillis
    }));
  }
  replaceGame(game, options = {}) {
    this.currentGame = game;
    this.currentClockMillis = options.nowMillis ?? 0;
    this.currentFps = normalizeEngineFps(options.fps ?? this.currentFps);
    this.currentFrameMillis = 1e3 / this.currentFps;
    return this.refresh(options.initialEvents ?? []);
  }
  step(deltaMillis = this.currentFrameMillis) {
    const safeDelta = Number.isFinite(deltaMillis) ? Math.max(0, deltaMillis) : this.currentFrameMillis;
    return this.tickTo(this.currentClockMillis + safeDelta);
  }
  tickTo(atMillis) {
    this.currentClockMillis = Math.max(this.currentClockMillis, normalizeMillis(atMillis));
    return this.refresh(this.currentGame.tick({ atMillis: this.currentClockMillis }));
  }
  composeState(events) {
    const snapshot = this.currentGame.snapshot();
    return {
      clockMillis: this.currentClockMillis,
      events,
      fps: this.currentFps,
      frame: this.currentGame.render(),
      frameMillis: this.currentFrameMillis,
      snapshot
    };
  }
};
function rgbToHex(color) {
  return `#${hexByte(color.r)}${hexByte(color.g)}${hexByte(color.b)}`;
}
function scaleRgb(color, percent) {
  return {
    r: clamp(Math.round(color.r * percent / 100), 0, 255),
    g: clamp(Math.round(color.g * percent / 100), 0, 255),
    b: clamp(Math.round(color.b * percent / 100), 0, 255)
  };
}
function addRgb(left, right) {
  return {
    r: clamp(left.r + right.r, 0, 255),
    g: clamp(left.g + right.g, 0, 255),
    b: clamp(left.b + right.b, 0, 255)
  };
}
function hexByte(value) {
  return clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0");
}
function formatClock(ms) {
  const safeMs = Math.max(0, Math.ceil(ms));
  const totalSeconds = Math.ceil(safeMs / 1e3);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// games/arkanoid/src/index.ts
var src_exports = {};
__export(src_exports, {
  PlayerDisplay: () => PlayerDisplay,
  arkanoidConfigVars: () => arkanoidConfigVars,
  ballColor: () => ballColor,
  brickColors: () => brickColors,
  createGame: () => createGame,
  finishedFrame: () => finishedFrame,
  finishedSnapshot: () => finishedSnapshot,
  initEvents: () => initEvents,
  manifest: () => manifest,
  paddleColor: () => paddleColor,
  runningFrame: () => runningFrame,
  runningSnapshot: () => runningSnapshot
});

// packages/display-kit/src/index.tsx
var import_react3 = __toESM(require_react(), 1);

// packages/display-kit/src/floor-preview.tsx
var import_react = __toESM(require_react(), 1);

// packages/display-kit/src/floor-input-painter.ts
function tileKey(tile) {
  return `${tile.x}:${tile.y}`;
}
function floorTileFromClientPoint(clientX, clientY, bounds, columns, rows) {
  if (columns < 1 || rows < 1 || bounds.width <= 0 || bounds.height <= 0 || clientX < bounds.left || clientY < bounds.top || clientX >= bounds.left + bounds.width || clientY >= bounds.top + bounds.height) {
    return null;
  }
  return {
    x: Math.min(columns - 1, Math.floor((clientX - bounds.left) / bounds.width * columns)),
    y: Math.min(rows - 1, Math.floor((clientY - bounds.top) / bounds.height * rows))
  };
}
var FloorInputPainter = class {
  activeTiles = /* @__PURE__ */ new Map();
  visitedTiles = /* @__PURE__ */ new Set();
  lastTile = null;
  paintMode = null;
  begin(tile) {
    this.visitedTiles.clear();
    this.paintMode = this.activeTiles.has(tileKey(tile)) ? "release" : "press";
    this.lastTile = tile;
    return this.apply(tile);
  }
  move(tile) {
    if (!this.paintMode) {
      return [];
    }
    const actions = lineTiles(this.lastTile ?? tile, tile).flatMap((crossedTile) => this.apply(crossedTile));
    this.lastTile = tile;
    return actions;
  }
  end() {
    this.lastTile = null;
    this.paintMode = null;
    this.visitedTiles.clear();
  }
  reset() {
    this.end();
    this.activeTiles.clear();
  }
  keys() {
    return [...this.activeTiles.keys()];
  }
  apply(tile) {
    const key = tileKey(tile);
    if (!this.paintMode || this.visitedTiles.has(key)) {
      return [];
    }
    this.visitedTiles.add(key);
    const pressed = this.paintMode === "press";
    if (pressed) {
      this.activeTiles.set(key, tile);
    } else {
      this.activeTiles.delete(key);
    }
    return [{ ...tile, pressed }];
  }
};
function lineTiles(start, end) {
  const tiles = [];
  let x = start.x;
  let y = start.y;
  const deltaX = Math.abs(end.x - start.x);
  const stepX = start.x < end.x ? 1 : -1;
  const deltaY = -Math.abs(end.y - start.y);
  const stepY = start.y < end.y ? 1 : -1;
  let error = deltaX + deltaY;
  while (true) {
    tiles.push({ x, y });
    if (x === end.x && y === end.y) {
      return tiles;
    }
    const doubledError = error * 2;
    if (doubledError >= deltaY) {
      error += deltaY;
      x += stepX;
    }
    if (doubledError <= deltaX) {
      error += deltaX;
      y += stepY;
    }
  }
}

// packages/display-kit/src/floor-preview.tsx
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var import_react2 = __toESM(require_react(), 1);
function FramePreviewPanel({
  frame,
  label = "Vista del suelo",
  className = ""
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: `ml-frame-preview-panel ${className}`.trim(), children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloorPreview, { frame })
  ] });
}
function FloorPreview({
  frame,
  interactive = false,
  inputResetKey,
  onTilePress,
  onTileRelease,
  className = ""
}) {
  const rootRef = (0, import_react.useRef)(null);
  const activePointerIdRef = (0, import_react.useRef)(null);
  const inputPainterRef = (0, import_react.useRef)(new FloorInputPainter());
  const previousInputResetKeyRef = (0, import_react.useRef)(inputResetKey);
  const [occupiedTileKeys, setOccupiedTileKeys] = (0, import_react.useState)(() => /* @__PURE__ */ new Set());
  const style = {
    "--ml-floor-cols": frame.width,
    "--ml-floor-rows": frame.height
  };
  const rootClassName = `ml-floor-preview ${interactive ? "ml-floor-interactive" : ""} ${className}`.trim();
  const clearPointerFocus = (0, import_react.useCallback)(() => {
    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement && rootRef.current?.contains(activeElement)) {
      activeElement.blur();
    }
  }, []);
  const tileFromPoint = (0, import_react.useCallback)((clientX, clientY) => {
    const root = rootRef.current;
    if (!root) {
      return null;
    }
    return floorTileFromClientPoint(clientX, clientY, root.getBoundingClientRect(), frame.width, frame.height);
  }, [frame.height, frame.width]);
  const applyInputActions = (0, import_react.useCallback)((actions) => {
    if (actions.length === 0) {
      return;
    }
    for (const action of actions) {
      if (action.pressed) {
        onTilePress?.(action.x, action.y);
      } else {
        onTileRelease?.(action.x, action.y);
      }
    }
    setOccupiedTileKeys(new Set(inputPainterRef.current.keys()));
  }, [onTilePress, onTileRelease]);
  const beginInputGesture = (0, import_react.useCallback)((tile) => {
    if (!tile || Number.isNaN(tile.x) || Number.isNaN(tile.y)) {
      return;
    }
    applyInputActions(inputPainterRef.current.begin(tile));
  }, [applyInputActions]);
  const continueInputGesture = (0, import_react.useCallback)((tile) => {
    if (!tile || Number.isNaN(tile.x) || Number.isNaN(tile.y)) {
      return;
    }
    applyInputActions(inputPainterRef.current.move(tile));
  }, [applyInputActions]);
  const clearInputPainter = (0, import_react.useCallback)(() => {
    inputPainterRef.current.reset();
    setOccupiedTileKeys(/* @__PURE__ */ new Set());
  }, []);
  (0, import_react.useEffect)(() => {
    if (Object.is(previousInputResetKeyRef.current, inputResetKey)) {
      return;
    }
    previousInputResetKeyRef.current = inputResetKey;
    clearInputPainter();
  }, [clearInputPainter, inputResetKey]);
  (0, import_react.useEffect)(() => {
    if (!interactive) {
      clearInputPainter();
    }
  }, [clearInputPainter, interactive]);
  (0, import_react.useEffect)(() => {
    if (!interactive) {
      return void 0;
    }
    const endActivePointer = () => {
      activePointerIdRef.current = null;
      inputPainterRef.current.end();
    };
    const handleVisibilityChange = () => {
      if (document.hidden) {
        endActivePointer();
      }
    };
    window.addEventListener("blur", endActivePointer);
    window.addEventListener("pointercancel", endActivePointer);
    window.addEventListener("pointerup", endActivePointer);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("blur", endActivePointer);
      window.removeEventListener("pointercancel", endActivePointer);
      window.removeEventListener("pointerup", endActivePointer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [interactive]);
  const handlePointerDown = (0, import_react.useCallback)(
    (event) => {
      if (!interactive || event.button !== 0) {
        return;
      }
      event.preventDefault();
      clearPointerFocus();
      activePointerIdRef.current = event.pointerId;
      rootRef.current?.setPointerCapture(event.pointerId);
      beginInputGesture(tileFromPoint(event.clientX, event.clientY));
    },
    [beginInputGesture, clearPointerFocus, interactive, tileFromPoint]
  );
  const handlePointerMove = (0, import_react.useCallback)(
    (event) => {
      if (!interactive || activePointerIdRef.current !== event.pointerId) {
        return;
      }
      event.preventDefault();
      continueInputGesture(tileFromPoint(event.clientX, event.clientY));
    },
    [continueInputGesture, interactive, tileFromPoint]
  );
  const endPointer = (0, import_react.useCallback)(
    (event) => {
      if (!interactive || activePointerIdRef.current !== event.pointerId) {
        return;
      }
      continueInputGesture(tileFromPoint(event.clientX, event.clientY));
      activePointerIdRef.current = null;
      inputPainterRef.current.end();
      clearPointerFocus();
      if (rootRef.current?.hasPointerCapture(event.pointerId)) {
        rootRef.current.releasePointerCapture(event.pointerId);
      }
    },
    [clearPointerFocus, continueInputGesture, interactive, tileFromPoint]
  );
  const handleLostPointerCapture = (0, import_react.useCallback)(() => {
    activePointerIdRef.current = null;
    inputPainterRef.current.end();
    clearPointerFocus();
  }, [clearPointerFocus]);
  const handleKeyboardActivation = (0, import_react.useCallback)((tile) => {
    applyInputActions(inputPainterRef.current.begin(tile));
    inputPainterRef.current.end();
  }, [applyInputActions]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "div",
    {
      className: rootClassName,
      onLostPointerCapture: handleLostPointerCapture,
      onPointerCancel: endPointer,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: endPointer,
      ref: rootRef,
      style,
      role: "grid",
      "aria-label": "Vista del suelo",
      children: frame.cells.map((cell) => {
        const tileStyle = {
          backgroundColor: cell.color,
          gridColumnStart: cell.x + 1,
          gridRowStart: cell.y + 1
        };
        const key = `${cell.x}-${cell.y}`;
        const occupied = occupiedTileKeys.has(`${cell.x}:${cell.y}`);
        const sharedProps = {
          className: "ml-floor-tile",
          style: tileStyle,
          "data-tile-x": cell.x,
          "data-tile-y": cell.y,
          "data-color": cell.color
        };
        if (interactive) {
          return /* @__PURE__ */ (0, import_react2.createElement)(
            "button",
            {
              ...sharedProps,
              "aria-label": `Baldosa ${cell.x}, ${cell.y}`,
              "aria-pressed": occupied,
              key,
              onClick: (event) => {
                if (event.detail === 0) {
                  handleKeyboardActivation(cell);
                }
              },
              type: "button"
            }
          );
        }
        return /* @__PURE__ */ (0, import_react2.createElement)("span", { ...sharedProps, "aria-hidden": "true", key });
      })
    }
  );
}

// packages/display-kit/src/index.tsx
var import_jsx_runtime2 = __toESM(require_jsx_runtime(), 1);
var phaseLabels = {
  ready: "Listo",
  waiting: "En espera",
  starting: "Preparados",
  running: "En juego",
  paused: "En pausa",
  finished: "Terminado"
};
function phaseLabel(phase) {
  return phaseLabels[phase] ?? phase;
}
var PlayerDisplayRuntimeContext = (0, import_react3.createContext)({ paused: false });
function GameDisplayShell({
  title,
  phase,
  variant = "default",
  children
}) {
  const runtime = (0, import_react3.useContext)(PlayerDisplayRuntimeContext);
  const isPaused = runtime.paused;
  const displayedPhase = isPaused ? "paused" : phase;
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    "section",
    {
      className: `ml-display-shell ml-tv-display ml-tv-display-${variant}${isPaused ? " is-paused" : ""}`,
      "aria-label": `Pantalla de ${title}`,
      "data-paused": isPaused || void 0,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("header", { className: "ml-display-header ml-tv-header", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "ml-tv-brand", "aria-hidden": "true", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "ml-tv-brand-mark" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "ml-tv-brand-name", children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("b", { children: "Motion" }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("b", { children: "Levels" })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "ml-tv-title", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "ml-display-label", children: "Juego" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h1", { children: title })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: `ml-status-pill ml-status-${displayedPhase}`, children: phaseLabel(displayedPhase) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "ml-display-content", children })
      ]
    }
  );
}
function PlayerReadyOverlay({ snapshot }) {
  if (snapshot.phase !== "waiting" && snapshot.phase !== "starting") {
    return null;
  }
  const readyPlayers = snapshot.readyPlayers ?? 0;
  const requiredPlayers = Math.max(snapshot.requiredPlayers ?? snapshot.playerCount, 1);
  const starting = snapshot.phase === "starting";
  const countdown = Math.max(1, Math.ceil((snapshot.countdownMillis ?? 0) / 1e3));
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    "section",
    {
      "aria-label": starting ? "El juego est\xE1 a punto de empezar" : "Esperando jugadores",
      className: `ml-player-ready-overlay is-${snapshot.phase}`,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "ml-player-ready-pulse", "aria-hidden": "true", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("i", {}),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("i", {}),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("i", {})
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: starting ? "Todos listos" : "Esperando jugadores" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { children: starting ? countdown : `${readyPlayers}/${requiredPlayers}` }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("b", { children: starting ? "El juego est\xE1 a punto de empezar" : "Entra y permanece en la zona iluminada" })
      ]
    }
  );
}
function MetricPanel({
  label,
  value,
  tone = "cyan",
  className = ""
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("article", { className: `ml-metric ml-metric-${tone} ${className}`.trim(), children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "ml-metric-label", children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { className: "ml-metric-value", children: value })
  ] });
}
function LivesMeter({
  className = "",
  lives,
  maxLives
}) {
  const totalLives = Math.max(0, Math.trunc(maxLives));
  const remainingLives = Math.min(totalLives, Math.max(0, Math.trunc(lives)));
  const previousLivesRef = (0, import_react3.useRef)(remainingLives);
  const changeSequenceRef = (0, import_react3.useRef)(0);
  const [lifeChange, setLifeChange] = (0, import_react3.useState)(null);
  (0, import_react3.useEffect)(() => {
    const previousLives = previousLivesRef.current;
    previousLivesRef.current = remainingLives;
    if (previousLives === remainingLives) {
      return;
    }
    changeSequenceRef.current += 1;
    const nextChange = {
      from: previousLives,
      id: changeSequenceRef.current,
      to: remainingLives
    };
    setLifeChange(nextChange);
    const clearChange = window.setTimeout(() => {
      setLifeChange((currentChange) => currentChange?.id === nextChange.id ? null : currentChange);
    }, 1100);
    return () => window.clearTimeout(clearChange);
  }, [remainingLives]);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "div",
    {
      "aria-label": `${remainingLives} de ${totalLives} vidas restantes`,
      className: `ml-lives-meter ${className}`.trim(),
      role: "img",
      children: Array.from({ length: totalLives }, (_, index) => {
        const remaining = index < remainingLives;
        const changed = lifeChange && index >= Math.min(lifeChange.from, lifeChange.to) && index < Math.max(lifeChange.from, lifeChange.to);
        const changeClass = changed ? lifeChange.to > lifeChange.from ? "is-regained" : "is-losing" : "";
        return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "span",
          {
            "aria-hidden": "true",
            className: `ml-life-heart ${remaining ? "is-remaining" : "is-lost"} ${changeClass}`.trim(),
            "data-life-change": changeClass || void 0,
            "data-life-state": remaining ? "remaining" : "lost",
            style: { "--ml-heart-index": index },
            children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "ml-life-heart-glyph", children: "\u2665" })
          },
          index
        );
      })
    }
  );
}
function MetricRow({
  children,
  columns = 3,
  className = ""
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("section", { className: `ml-metric-row ${className}`.trim(), style: { "--ml-metric-columns": columns }, children });
}
function VersusScoreboard({
  left,
  right,
  target,
  centerLabel,
  centerValue,
  centerCaption = "",
  className = ""
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("section", { className: `ml-versus-scoreboard ${className}`.trim(), "aria-label": "Marcador", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PlayerScorePanel, { player: left, side: "red", target }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("article", { className: "ml-versus-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: centerLabel }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { children: centerValue }),
      centerCaption ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("b", { children: centerCaption }) : null
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PlayerScorePanel, { player: right, side: "blue", target })
  ] });
}
function PlayerScorePanel({
  player,
  side,
  target
}) {
  const progress = Math.max(0, Math.min(1, player.score / Math.max(target, 1)));
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    "article",
    {
      className: `ml-player-score-panel ml-player-score-${side}`,
      style: {
        "--ml-player": player.color,
        "--ml-player-rgb": hexToRgb(player.color),
        "--ml-score-progress": progress
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "ml-player-score-head", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: player.label }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("b", { children: [
            player.score,
            "/",
            target
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { children: player.score }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "ml-player-score-track", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("i", {}) })
      ]
    }
  );
}
function RoundStrip({
  rounds,
  totalRounds,
  activeRound,
  activeLabel = "Ronda actual",
  activeCaption = "Punto en curso",
  fallbackLabel = "Pendiente",
  className = ""
}) {
  const roundCount = Math.max(rounds.length, totalRounds ?? 0, 1);
  const roundByIndex = new Map(rounds.map((round) => [round.index, round]));
  const allRounds = Array.from({ length: roundCount }, (_, index) => {
    const roundIndex = index + 1;
    return roundByIndex.get(roundIndex) ?? { index: roundIndex, winnerLabel: fallbackLabel, hits: 0 };
  });
  const defaultActiveRound = rounds.length < roundCount ? rounds.length + 1 : null;
  const resolvedActiveRound = activeRound === void 0 ? defaultActiveRound : activeRound;
  const focusRound = resolvedActiveRound ?? Math.max(rounds.length, 1);
  const visibleLimit = 12;
  const visibleStart = Math.min(
    Math.max(0, focusRound - Math.ceil(visibleLimit / 2)),
    Math.max(0, roundCount - visibleLimit)
  );
  const visibleRounds = allRounds.slice(visibleStart, visibleStart + visibleLimit);
  const visibleRangeLabel = roundCount > visibleRounds.length ? `Rondas ${visibleRounds[0]?.index}-${visibleRounds.at(-1)?.index} de ${roundCount}` : "Historial del partido";
  const stripStyle = {
    "--ml-round-count": visibleRounds.length,
    "--ml-round-progress": `${Math.min(1, rounds.length / roundCount) * 100}%`
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("section", { className: `ml-round-strip ${className}`.trim(), "aria-label": "Rondas", style: stripStyle, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "ml-round-strip-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "ml-round-strip-title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: "Rondas" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("small", { children: visibleRangeLabel })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "ml-round-strip-count", "aria-label": `${rounds.length} de ${roundCount} rondas jugadas`, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { children: rounds.length }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { children: [
          "de ",
          roundCount
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "ml-round-progress", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("i", {}) }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "ml-round-list", children: visibleRounds.map((round) => {
      const completed = round.winnerIndex === 0 || round.winnerIndex === 1;
      const current = !completed && round.index === resolvedActiveRound;
      const stateClass = round.winnerIndex === 0 ? "is-red" : round.winnerIndex === 1 ? "is-blue" : current ? "is-current" : "is-pending";
      const hits = round.hits ?? 0;
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("article", { className: `ml-round-card ${stateClass}`, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "ml-round-card-head", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { children: [
            "R",
            round.index
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("i", { "aria-hidden": "true" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { children: completed ? round.winnerLabel || fallbackLabel : current ? activeLabel : fallbackLabel }),
        completed ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("b", { children: [
          hits,
          " ",
          hits === 1 ? "golpe" : "golpes"
        ] }) : null,
        current ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("b", { children: activeCaption }) : null
      ] }, round.index);
    }) })
  ] });
}
function hexToRgb(color) {
  const hex = color.replace("#", "").trim();
  const normalized = hex.length === 3 ? hex.split("").map((character) => character + character).join("") : hex.padEnd(6, "0").slice(0, 6);
  const value = Number.parseInt(normalized, 16);
  if (!Number.isFinite(value)) {
    return "255, 255, 255";
  }
  return `${value >> 16 & 255}, ${value >> 8 & 255}, ${value & 255}`;
}

// games/arkanoid/src/display.tsx
var import_jsx_runtime3 = __toESM(require_jsx_runtime(), 1);
function PlayerDisplay({
  snapshot,
  frame
}) {
  const message = snapshot.phase === "ready" ? "Pisa abajo para mover y lanzar" : snapshot.lastEventMessage || "Rompe todos los bloques";
  const messageTone = snapshot.success ? "green" : snapshot.phase === "finished" ? "red" : snapshot.phase === "ready" ? "yellow" : "cyan";
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(GameDisplayShell, { title: snapshot.label, phase: snapshot.phase, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "ml-solo-display arkanoid-display", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(PlayerReadyOverlay, { snapshot }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "ml-solo-summary", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(MetricRow, { columns: 3, className: "ml-solo-number-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(MetricPanel, { label: "Bloques", tone: "pink", value: `${snapshot.score}/${snapshot.totalBricks}` }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          MetricPanel,
          {
            label: "Vidas",
            tone: "neutral",
            value: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(LivesMeter, { lives: snapshot.lives, maxLives: snapshot.maxLives })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(MetricPanel, { label: "Tiempo", tone: "yellow", value: formatClock(snapshot.elapsedMillis) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(MetricPanel, { className: "ml-solo-message", label: "Estado", tone: messageTone, value: message })
    ] }),
    frame ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(FramePreviewPanel, { className: "ml-solo-floor", frame, label: "Juego en el suelo" }) : null
  ] }) });
}

// games/arkanoid/src/manifest.ts
var arkanoidConfigVars = {
  ballSpeed: {
    key: "ball_speed",
    label: "Ball speed (tiles/s)",
    playerFacing: true,
    description: "Base ball speed on Easy. Higher difficulties multiply this value.",
    type: "float",
    default: 4.25,
    min: 2,
    max: 8,
    step: 0.25
  }
};
var manifest = {
  id: "arkanoid",
  label: "Arkanoid",
  description: "Single-player floor Arkanoid with step-controlled paddle movement and deterministic brick physics.",
  availability: { development: true, production: true },
  catalog: {
    category: "individual",
    color: "#ff9f45",
    durationLabel: "Sin l\xEDmite",
    modeLabel: "Arkanoid",
    audioLabel: "Efectos",
    rules: ["Pisa la zona inferior para mover la pala", "Rompe todos los bloques sin perder la pelota"]
  },
  players: {
    allowAny: true,
    min: 1,
    max: 1
  },
  start: { mode: "player-ready" },
  config: {
    difficulty: {
      default: "medium",
      options: ["easy", "medium", "hard", "expert"]
    },
    vars: Object.values(arkanoidConfigVars)
  },
  defaultDurationMillis: 0,
  display: {
    entry: "./display"
  },
  preview: {
    seed: 137,
    playerCount: 1,
    difficulty: "medium",
    actions: [
      { atMillis: 100, type: "press", x: 7, y: 30 },
      { atMillis: 2150, type: "release", x: 7, y: 30 },
      { atMillis: 2250, type: "press", x: 9, y: 30 },
      { atMillis: 2450, type: "release", x: 9, y: 30 }
    ],
    captureStartMillis: 2200,
    frameCount: 18,
    frameIntervalMillis: 120
  },
  tags: ["arcade", "single-player", "typescript"]
};

// games/arkanoid/src/game.ts
var ballColor = "#ffffff";
var paddleColor = "#35d7ff";
var brickColors = ["#ff3151", "#ff8a2a", "#ffd45f", "#74e58d"];
var defaultBrickColor = "#ff3151";
var backgroundColor = "#03070c";
var controlZoneColor = "#06101d";
var controlMarkerColor = "#145cff";
var missLineColor = "#37101a";
var paddleMissColor = "#ff3151";
var successColor = "#74e58d";
var trailColors = ["#9ddfff", "#4b91b8", "#21445b"];
var brickRows = 4;
var brickWidth = 2;
var brickStartY = 3;
var paddleWidth = 5;
var paddleY = 29;
var controlZoneStartY = 24;
var startingLives = 3;
var maxCatchUpMoves = 12;
function createGame(config) {
  return new ArkanoidGame(config);
}
var ArkanoidGame = class {
  ball = { x: 7, y: paddleY - 1, dx: 1, dy: -1 };
  ballMoves = 0;
  ballTrail = [];
  bricks = [];
  config;
  lastControlX = 7;
  lastEvent = gameEvent("none", "Listo", 0);
  lastMoveMillis = 0;
  lives = startingLives;
  nowMillis = 0;
  paddleX = Math.floor((FLOOR_COLS - paddleWidth) / 2);
  phase = "ready";
  players = [];
  rng;
  readyGate;
  score = 0;
  startedAtMillis = 0;
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest);
    this.rng = createSeededRng(this.config.seed);
    this.readyGate = createPlayerReadyGate(manifest.start, [{
      minX: 0,
      maxX: FLOOR_COLS - 1,
      minY: controlZoneStartY,
      maxY: FLOOR_ROWS - 1
    }], this.config.nowMillis);
    this.resetState(this.config.nowMillis);
  }
  init(nowMillis) {
    this.nowMillis = nowMillis;
    this.readyGate.reset(nowMillis);
    this.phase = "waiting";
    this.attachBall();
    this.lastEvent = gameEvent("ready", "Esperando jugador abajo", nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    if (event.y < controlZoneStartY || event.y >= FLOOR_ROWS) {
      return [];
    }
    if (event.pressed) {
      this.movePaddle(event.x);
    }
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.update(event), event.atMillis);
    }
    if (this.phase === "ready" && event.pressed) {
      return this.launchBall(event.atMillis);
    }
    return [];
  }
  release(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.update({ ...event, pressed: false }), event.atMillis);
    }
    return [];
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.tick(event.atMillis), event.atMillis);
    }
    if (this.phase !== "running") {
      return [];
    }
    const events = [];
    const interval = 1e3 / ballSpeedForConfig(this.config);
    for (let moves = 0; moves < maxCatchUpMoves; moves += 1) {
      if (event.atMillis - this.lastMoveMillis < interval) {
        break;
      }
      this.lastMoveMillis += interval;
      const nextEvent = this.moveBall(this.lastMoveMillis);
      if (nextEvent) {
        events.push(nextEvent);
      }
      if (this.phase !== "running") {
        break;
      }
    }
    return this.recordEvents(events);
  }
  render() {
    const frame = createFrame(backgroundColor);
    fillFrameRect(frame, 0, controlZoneStartY, FLOOR_COLS, FLOOR_ROWS - controlZoneStartY, controlZoneColor);
    fillFrameRect(frame, 0, FLOOR_ROWS - 1, FLOOR_COLS, 1, missLineColor);
    for (const brick of this.bricks) {
      if (brick.alive) {
        fillFrameRect(frame, brick.x, brick.y, brick.width, 1, brick.color);
      }
    }
    if (this.phase === "waiting" || this.phase === "starting") {
      this.drawPlayerStart(frame);
    }
    if (this.phase === "finished" && this.score === this.bricks.length) {
      drawSuccessFrame(frame);
    }
    this.ballTrail.forEach((position, index) => {
      const color = trailColors[index];
      if (color) {
        paintFrameCell(frame, position.x, position.y, color);
      }
    });
    if (this.phase !== "finished" || this.lives > 0) {
      paintFrameCell(frame, this.ball.x, this.ball.y, ballColor);
    }
    fillFrameRect(
      frame,
      this.paddleX,
      paddleY,
      paddleWidth,
      1,
      this.phase === "finished" && this.lives === 0 ? paddleMissColor : paddleColor
    );
    paintFrameCell(frame, this.lastControlX, FLOOR_ROWS - 1, controlMarkerColor);
    return frame;
  }
  snapshot() {
    const remaining = this.bricksRemaining();
    const readyState = this.readyGate.state(this.nowMillis);
    return {
      currentGame: manifest.id,
      label: manifest.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: this.players,
      score: this.score,
      lives: this.lives,
      maxLives: startingLives,
      elapsedMillis: Math.max(0, this.nowMillis - this.startedAtMillis),
      remainingMillis: 0,
      activeTargets: remaining,
      success: remaining === 0,
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? readyState.countdownMillis : 0,
      readyPlayers: readyState.readyPlayers,
      requiredPlayers: readyState.requiredPlayers,
      matchTarget: this.bricks.length,
      ball: { ...this.ball },
      ballMoves: this.ballMoves,
      ballSpeed: ballSpeedForConfig(this.config),
      bricksRemaining: remaining,
      launched: this.phase === "running",
      paddleWidth,
      paddleX: this.paddleX,
      totalBricks: this.bricks.length
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest);
    this.rng = createSeededRng(this.config.seed);
    this.resetState(this.config.nowMillis);
  }
  applyReadyTransition(transition, nowMillis) {
    if (transition === "players-ready") {
      this.phase = "starting";
      this.lastEvent = gameEvent("ready", "Jugador listo", nowMillis);
      return [this.lastEvent];
    }
    if (transition === "players-left") {
      this.phase = "waiting";
      this.lastEvent = gameEvent("ready", "Vuelve a la zona iluminada", nowMillis);
      return [this.lastEvent];
    }
    if (transition === "started") {
      return this.launchBall(nowMillis);
    }
    return [];
  }
  launchBall(nowMillis) {
    const firstLaunch = this.phase === "waiting" || this.phase === "starting";
    this.phase = "running";
    if (firstLaunch) {
      this.startedAtMillis = nowMillis;
    }
    this.ball = {
      x: this.paddleCenter(),
      y: paddleY - 1,
      dx: this.rng.next() < 0.5 ? -1 : 1,
      dy: -1
    };
    this.ballTrail = [];
    this.lastMoveMillis = nowMillis;
    this.lastEvent = gameEvent("start", "Pelota en juego", nowMillis);
    return [this.lastEvent];
  }
  attachBall() {
    this.ball = { x: this.paddleCenter(), y: paddleY - 1, dx: this.ball.dx, dy: -1 };
    this.ballTrail = [];
  }
  brickAt(x, y) {
    return this.bricks.find((brick) => brick.alive && brick.y === y && x >= brick.x && x < brick.x + brick.width);
  }
  bricksRemaining() {
    return this.bricks.reduce((count, brick) => count + Number(brick.alive), 0);
  }
  commitBall(next) {
    this.ballTrail = [{ x: this.ball.x, y: this.ball.y }, ...this.ballTrail].slice(0, trailColors.length);
    this.ball = next;
    this.ballMoves += 1;
  }
  loseLife(nowMillis) {
    this.lives -= 1;
    this.players = this.scoredPlayers();
    this.ballTrail = [];
    if (this.lives <= 0) {
      this.phase = "finished";
      return gameEvent("fail", "Sin vidas", nowMillis);
    }
    this.phase = "ready";
    this.attachBall();
    return gameEvent("fail", "Vida perdida, pisa abajo para lanzar", nowMillis);
  }
  moveBall(nowMillis) {
    let dx = this.ball.dx;
    let dy = this.ball.dy;
    let nextX = this.ball.x + dx;
    let nextY = this.ball.y + dy;
    if (nextX < 0 || nextX >= FLOOR_COLS) {
      dx = dx === 1 ? -1 : 1;
      nextX = this.ball.x + dx;
    }
    if (nextY < 1) {
      dy = 1;
      nextY = this.ball.y + dy;
    }
    const brick = this.brickAt(nextX, nextY);
    if (brick) {
      brick.alive = false;
      this.score += 1;
      this.players = this.scoredPlayers();
      this.ball = { ...this.ball, dx, dy: dy === 1 ? -1 : 1 };
      this.ballMoves += 1;
      if (this.bricksRemaining() === 0) {
        this.phase = "finished";
        return gameEvent("win", "Muro completado", nowMillis);
      }
      return gameEvent("hit", `Bloque ${this.score} de ${this.bricks.length}`, nowMillis);
    }
    if (dy > 0 && nextY === paddleY) {
      if (nextX >= this.paddleX && nextX < this.paddleX + paddleWidth) {
        const offset = nextX - this.paddleCenter();
        if (offset < 0) {
          dx = -1;
        } else if (offset > 0) {
          dx = 1;
        } else {
          dx = this.rng.next() < 0.5 ? -1 : 1;
        }
        if (Math.abs(offset) === 1 && this.rng.next() < 0.35) {
          dx = dx === 1 ? -1 : 1;
        }
        this.commitBall({ x: nextX, y: paddleY - 1, dx, dy: -1 });
        return gameEvent("coin", "Rebote", nowMillis);
      }
    }
    if (nextY >= FLOOR_ROWS) {
      return this.loseLife(nowMillis);
    }
    this.commitBall({ x: nextX, y: nextY, dx, dy });
    return void 0;
  }
  movePaddle(x) {
    const half = Math.floor(paddleWidth / 2);
    const center = clamp(Math.round(x), half, FLOOR_COLS - 1 - half);
    this.paddleX = center - half;
    this.lastControlX = clamp(Math.round(x), 0, FLOOR_COLS - 1);
    if (this.phase === "ready" || this.phase === "waiting" || this.phase === "starting") {
      this.attachBall();
    }
  }
  drawPlayerStart(frame) {
    if (this.phase === "waiting") {
      const scanY = controlZoneStartY + Math.floor(this.nowMillis / 150) % (FLOOR_ROWS - controlZoneStartY);
      for (let y = controlZoneStartY; y < FLOOR_ROWS; y += 1) {
        for (let x = 0; x < FLOOR_COLS; x += 1) {
          if (y === scanY || x === 0 || x === FLOOR_COLS - 1) {
            paintFrameCell(frame, x, y, y === scanY ? "#35d7ff" : "#0b4260");
          }
        }
      }
      return;
    }
    const pulse = Math.floor(this.nowMillis / 125) % 4;
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      for (let x = 0; x < FLOOR_COLS; x += 1) {
        if ((Math.abs(x - this.paddleCenter()) + Math.abs(y - paddleY) + pulse) % 6 === 0) {
          paintFrameCell(frame, x, y, y >= controlZoneStartY ? "#ffe176" : "#176783");
        }
      }
    }
  }
  paddleCenter() {
    return this.paddleX + Math.floor(paddleWidth / 2);
  }
  recordEvents(events) {
    const latestEvent = events.at(-1);
    if (latestEvent) {
      this.lastEvent = latestEvent;
    }
    return events;
  }
  resetState(nowMillis) {
    this.bricks = createBricks();
    this.lives = startingLives;
    this.nowMillis = nowMillis;
    this.startedAtMillis = nowMillis;
    this.lastMoveMillis = nowMillis;
    this.paddleX = Math.floor((FLOOR_COLS - paddleWidth) / 2);
    this.lastControlX = this.paddleCenter();
    this.readyGate.reset(nowMillis);
    this.phase = "waiting";
    this.score = 0;
    this.ballMoves = 0;
    this.ball = { x: this.paddleCenter(), y: paddleY - 1, dx: 1, dy: -1 };
    this.ballTrail = [];
    this.players = this.scoredPlayers();
    this.lastEvent = gameEvent("ready", "Esperando jugador abajo", nowMillis);
  }
  scoredPlayers() {
    return defaultPlayers(this.config.playerCount, this.config.players).map((player) => ({
      ...player,
      lives: this.lives,
      score: this.score
    }));
  }
};
function createBricks() {
  const bricks = [];
  let id = 0;
  for (let row = 0; row < brickRows; row += 1) {
    for (let x = 0; x < FLOOR_COLS; x += brickWidth) {
      bricks.push({
        alive: true,
        color: brickColors[row] ?? defaultBrickColor,
        id,
        width: brickWidth,
        x,
        y: brickStartY + row
      });
      id += 1;
    }
  }
  return bricks;
}
function drawSuccessFrame(frame) {
  fillFrameRect(frame, 2, 13, FLOOR_COLS - 4, 1, successColor);
  fillFrameRect(frame, 2, 19, FLOOR_COLS - 4, 1, successColor);
  fillFrameRect(frame, 2, 13, 1, 7, successColor);
  fillFrameRect(frame, FLOOR_COLS - 3, 13, 1, 7, successColor);
  paintFrameCell(frame, 5, 16, successColor);
  paintFrameCell(frame, 6, 17, successColor);
  paintFrameCell(frame, 7, 18, successColor);
  paintFrameCell(frame, 8, 17, successColor);
  paintFrameCell(frame, 9, 16, successColor);
  paintFrameCell(frame, 10, 15, successColor);
}
function ballSpeedForConfig(config) {
  const baseSpeed = readGameConfigOption(config.options, arkanoidConfigVars.ballSpeed);
  return baseSpeed * difficultySpeedFactor(config.difficulty);
}
function difficultySpeedFactor(difficulty) {
  switch (difficulty) {
    case "medium":
      return 1.25;
    case "hard":
      return 1.6;
    case "expert":
      return 2;
    default:
      return 1;
  }
}

// games/arkanoid/src/fixtures.ts
var runningGame = createGame({ playerCount: 1, difficulty: "medium" });
var initEvents = runningGame.init(0);
runningGame.press({ x: 7, y: 30, pressed: true, atMillis: 100 });
runningGame.tick({ atMillis: 2100 });
runningGame.tick({ atMillis: 3300 });
var runningFrame = runningGame.render();
var runningSnapshot = runningGame.snapshot();
var finishedGame = createGame({ playerCount: 1, difficulty: "easy" });
finishedGame.init(0);
autoplay(finishedGame);
var finishedFrame = finishedGame.render();
var finishedSnapshot = finishedGame.snapshot();
function autoplay(game) {
  game.press({ x: 7, y: 30, pressed: true, atMillis: 50 });
  game.tick({ atMillis: 2050 });
  let nowMillis = 2100;
  for (let step = 0; step < 24e3 && game.snapshot().phase !== "finished"; step += 1) {
    const snapshot = game.snapshot();
    game.press({ x: snapshot.ball.x, y: 30, pressed: true, atMillis: nowMillis });
    game.tick({ atMillis: nowMillis });
    nowMillis += 50;
  }
}

// games/hello-world/src/index.ts
var src_exports2 = {};
__export(src_exports2, {
  PlayerDisplay: () => PlayerDisplay2,
  createGame: () => createGame2,
  damagedFrame: () => damagedFrame,
  damagedSnapshot: () => damagedSnapshot,
  hazardColor: () => hazardColor,
  helloWorldCelebrationMillis: () => helloWorldCelebrationMillis,
  helloWorldHazards: () => helloWorldHazards,
  helloWorldStartingLives: () => helloWorldStartingLives,
  helloWorldTargetScore: () => helloWorldTargetScore,
  helloWorldTargets: () => helloWorldTargets,
  idleColor: () => idleColor,
  initEvents: () => initEvents2,
  losingFrame: () => losingFrame,
  losingSnapshot: () => losingSnapshot,
  manifest: () => manifest2,
  runningFrame: () => runningFrame2,
  runningSnapshot: () => runningSnapshot2,
  startingFrame: () => startingFrame,
  startingSnapshot: () => startingSnapshot,
  targetColor: () => targetColor,
  trailColor: () => trailColor,
  waitingFrame: () => waitingFrame,
  waitingSnapshot: () => waitingSnapshot,
  winningFrame: () => winningFrame,
  winningSnapshot: () => winningSnapshot
});

// games/hello-world/src/display.tsx
var import_jsx_runtime4 = __toESM(require_jsx_runtime(), 1);
function PlayerDisplay2({
  snapshot,
  frame
}) {
  const target = snapshot.matchTarget ?? 5;
  const finished = snapshot.phase === "finished";
  const resultClass = finished ? snapshot.success ? "is-result-win" : "is-result-lose" : "";
  const statusTone = snapshot.success ? "green" : snapshot.lastEventCue === "fail" ? "red" : "cyan";
  const restartSeconds = Math.max(1, Math.ceil(snapshot.celebrationMillis / 1e3));
  const statusValue = finished ? /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "hello-world-result-copy", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { children: snapshot.success ? "\xA1Ganaste!" : snapshot.lastEventMessage }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("small", { children: [
      "Reinicio en ",
      restartSeconds
    ] })
  ] }) : snapshot.lastEventMessage || "Verde suma, rojo resta una vida";
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(GameDisplayShell, { title: snapshot.label, phase: snapshot.phase, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: `ml-solo-display hello-world-display ${resultClass}`.trim(), children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PlayerReadyOverlay, { snapshot }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "ml-solo-summary", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(MetricRow, { columns: 3, className: "ml-solo-number-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(MetricPanel, { label: "Meta", tone: "green", value: `${snapshot.score}/${target}` }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(MetricPanel, { label: "Vidas", tone: "red", value: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(LivesMeter, { lives: snapshot.lives, maxLives: snapshot.maxLives }) }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(MetricPanel, { label: "Tiempo", tone: "yellow", value: formatClock(snapshot.remainingMillis) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        MetricPanel,
        {
          className: "ml-solo-message",
          label: finished ? snapshot.success ? "Victoria" : "Fin de la partida" : "Estado",
          tone: statusTone,
          value: statusValue
        }
      )
    ] }),
    frame ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(FramePreviewPanel, { className: "ml-solo-floor", frame, label: "Recorrido en el suelo" }) : null
  ] }) });
}

// games/hello-world/src/manifest.ts
var manifest2 = {
  id: "hello-world",
  label: "Hola Mundo",
  description: "Sigue los objetivos verdes y evita las baldosas rojas.",
  availability: { development: true, production: false },
  catalog: {
    category: "individual",
    color: "#35d7ff",
    durationLabel: "30s",
    modeLabel: "Demostraci\xF3n",
    audioLabel: "Efectos",
    rules: ["Sigue los objetivos verdes", "Evita las baldosas rojas"]
  },
  players: {
    allowAny: true,
    min: 1,
    max: 1
  },
  start: { mode: "player-ready" },
  defaultDurationMillis: 3e4,
  display: {
    entry: "./display"
  },
  preview: {
    seed: 2024,
    playerCount: 1,
    actions: [
      { atMillis: 100, type: "press", x: 8, y: 16 },
      { atMillis: 2150, type: "release", x: 8, y: 16 },
      { atMillis: 2300, type: "press", x: 4, y: 4 },
      { atMillis: 2320, type: "release", x: 4, y: 4 }
    ],
    captureStartMillis: 2200,
    frameCount: 18,
    frameIntervalMillis: 120
  },
  tags: ["example", "ci", "typescript"]
};

// games/hello-world/src/game.ts
var targetColor = "#7ee787";
var hazardColor = "#ff2036";
var trailColor = "#1f6feb";
var idleColor = "#05070a";
var helloWorldTargetScore = 5;
var helloWorldStartingLives = 3;
var helloWorldCelebrationMillis = 5e3;
var targetPath = [
  { x: 3, y: 5 },
  { x: 12, y: 5 },
  { x: 8, y: 16 },
  { x: 3, y: 26 },
  { x: 12, y: 26 }
];
var hazardPath = [
  { x: 12, y: 15 },
  { x: 4, y: 15 },
  { x: 8, y: 28 }
];
function createGame2(config) {
  return new HelloWorldGame(config);
}
var HelloWorldGame = class {
  config;
  finishedAtMillis;
  hazardsHit = 0;
  lastEvent = gameEvent("none", "Listo", 0);
  lives = helloWorldStartingLives;
  nowMillis = 0;
  phase = "ready";
  players;
  readyGate;
  score = 0;
  startedAtMillis = 0;
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest2);
    this.readyGate = createPlayerReadyGate(manifest2.start, createHorizontalPlayerReadyZones(1), this.config.nowMillis);
    this.players = this.scoredPlayers();
  }
  init(nowMillis) {
    this.resetState(nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.update(event), event.atMillis);
    }
    if (this.phase !== "running" || !event.pressed) {
      return [];
    }
    const hazard = this.currentHazard();
    if (hazard && event.x === hazard.x && event.y === hazard.y) {
      return this.loseLife(event.atMillis);
    }
    const target = this.currentTarget();
    if (!target || event.x !== target.x || event.y !== target.y) {
      return [];
    }
    this.score += 1;
    this.players = this.scoredPlayers();
    if (this.score >= helloWorldTargetScore) {
      return this.finishGame(true, "\xA1Hola Mundo!", event.atMillis);
    }
    this.lastEvent = gameEvent("hit", `Hola ${this.score}`, event.atMillis);
    return [this.lastEvent];
  }
  release(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.update({ ...event, pressed: false }), event.atMillis);
    }
    return [];
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.tick(event.atMillis), event.atMillis);
    }
    if (this.phase === "finished") {
      const finishedAtMillis = this.finishedAtMillis ?? event.atMillis;
      if (event.atMillis - finishedAtMillis < helloWorldCelebrationMillis) {
        return [];
      }
      this.resetState(event.atMillis);
      return [this.lastEvent];
    }
    if (this.phase !== "running" || this.remainingMillis() > 0) {
      return [];
    }
    return this.finishGame(false, "Tiempo agotado", event.atMillis);
  }
  render() {
    const frame = createFrame(idleColor);
    if (this.phase === "waiting" || this.phase === "starting") {
      this.drawPlayerStart(frame);
      return frame;
    }
    for (const target2 of targetPath.slice(0, this.score)) {
      paintFrameCell(frame, target2.x, target2.y, trailColor);
    }
    if (this.phase === "finished") {
      this.drawResultAnimation(frame);
      return frame;
    }
    const target = this.currentTarget();
    if (target) {
      fillFrameRect(frame, target.x - 1, target.y - 1, 3, 3, targetColor);
      paintFrameCell(frame, target.x, target.y, "#ffffff");
    }
    const hazard = this.currentHazard();
    if (hazard) {
      paintFrameCell(frame, hazard.x, hazard.y, hazardColor);
    }
    return frame;
  }
  snapshot() {
    const readyState = this.readyGate.state(this.nowMillis);
    return {
      currentGame: manifest2.id,
      label: manifest2.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: this.players,
      score: this.score,
      lives: this.lives,
      maxLives: helloWorldStartingLives,
      elapsedMillis: this.elapsedMillis(),
      remainingMillis: this.remainingMillis(),
      activeTargets: this.phase === "running" ? Number(Boolean(this.currentTarget())) + Number(Boolean(this.currentHazard())) : 0,
      success: this.phase === "finished" && this.score >= helloWorldTargetScore,
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? readyState.countdownMillis : 0,
      readyPlayers: readyState.readyPlayers,
      requiredPlayers: readyState.requiredPlayers,
      matchTarget: helloWorldTargetScore,
      celebrationDurationMillis: helloWorldCelebrationMillis,
      celebrationMillis: this.celebrationMillis(),
      hazard: this.phase === "running" ? this.currentHazard() : void 0
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({
      ...this.config,
      ...config
    }, manifest2);
    this.resetState(this.config.nowMillis);
  }
  applyReadyTransition(transition, nowMillis) {
    if (transition === "players-ready") {
      this.phase = "starting";
      this.lastEvent = gameEvent("ready", "Jugador listo", nowMillis);
      return [this.lastEvent];
    }
    if (transition === "players-left") {
      this.phase = "waiting";
      this.lastEvent = gameEvent("ready", "Vuelve a la zona iluminada", nowMillis);
      return [this.lastEvent];
    }
    if (transition === "started") {
      this.phase = "running";
      this.startedAtMillis = nowMillis;
      this.lastEvent = gameEvent("start", "Verde suma, rojo resta una vida", nowMillis);
      return [this.lastEvent];
    }
    return [];
  }
  celebrationMillis() {
    if (this.phase !== "finished" || this.finishedAtMillis === void 0) {
      return 0;
    }
    return Math.max(0, helloWorldCelebrationMillis - (this.nowMillis - this.finishedAtMillis));
  }
  currentHazard() {
    return hazardPath[this.hazardsHit];
  }
  currentTarget() {
    return targetPath[this.score];
  }
  drawPlayerStart(frame) {
    const centerX = Math.floor(FLOOR_COLS / 2);
    const centerY = Math.floor(FLOOR_ROWS / 2);
    const pulse = Math.floor(this.nowMillis / (this.phase === "starting" ? 110 : 180));
    const color = this.phase === "starting" ? "#ffe176" : targetColor;
    const radius = this.phase === "starting" ? 2 + pulse % 10 : 3 + pulse % 4;
    paintDiamondRing(frame, { centerX, centerY, color, radius });
  }
  drawResultAnimation(frame) {
    const animationStep = Math.floor((this.nowMillis - (this.finishedAtMillis ?? this.nowMillis)) / 140);
    const won = this.score >= helloWorldTargetScore;
    if (won) {
      paintDiamondWave(frame, {
        color: ({ x, y }) => (x + y + animationStep) % 3 === 0 ? "#ffffff" : targetColor,
        step: animationStep
      });
      return;
    }
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      for (let x = 0; x < FLOOR_COLS; x += 1) {
        if ((x + y + animationStep) % 8 <= 1 || (x - y - animationStep + 64) % 11 === 0) {
          paintFrameCell(frame, x, y, (x + animationStep) % 4 === 0 ? "#ff8090" : hazardColor);
        }
      }
    }
  }
  elapsedMillis() {
    if (this.phase === "waiting" || this.phase === "starting") {
      return 0;
    }
    const elapsedAtMillis = this.phase === "finished" && this.finishedAtMillis !== void 0 ? this.finishedAtMillis : this.nowMillis;
    return Math.max(0, elapsedAtMillis - this.startedAtMillis);
  }
  finishGame(success, message, atMillis) {
    this.phase = "finished";
    this.finishedAtMillis = atMillis;
    this.lastEvent = gameEvent(success ? "win" : "fail", message, atMillis);
    return [this.lastEvent];
  }
  loseLife(atMillis) {
    this.lives -= 1;
    this.hazardsHit += 1;
    if (this.lives <= 0) {
      return this.finishGame(false, "Sin vidas", atMillis);
    }
    this.lastEvent = gameEvent("fail", `Vida perdida, quedan ${this.lives}`, atMillis);
    return [this.lastEvent];
  }
  remainingMillis() {
    return Math.max(0, this.config.durationMillis - this.elapsedMillis());
  }
  resetState(nowMillis) {
    this.readyGate.reset(nowMillis);
    this.finishedAtMillis = void 0;
    this.hazardsHit = 0;
    this.lastEvent = gameEvent("ready", "Esperando jugador", nowMillis);
    this.lives = helloWorldStartingLives;
    this.nowMillis = nowMillis;
    this.phase = "waiting";
    this.score = 0;
    this.startedAtMillis = nowMillis;
    this.players = this.scoredPlayers();
  }
  scoredPlayers() {
    return defaultPlayers(this.config.playerCount, this.config.players).map((player) => ({
      ...player,
      score: this.score
    }));
  }
};
function helloWorldHazards() {
  return hazardPath.map((hazard) => ({ ...hazard }));
}
function helloWorldTargets() {
  return targetPath.map((target) => ({ ...target }));
}

// games/hello-world/src/fixtures.ts
var waitingGame = createGame2({ seed: 2024, playerCount: 1, durationMillis: 3e4 });
var initEvents2 = waitingGame.init(0);
var waitingFrame = waitingGame.render();
var waitingSnapshot = waitingGame.snapshot();
var startingGame = createGame2({ seed: 2024, playerCount: 1, durationMillis: 3e4 });
startingGame.init(0);
startingGame.press({ x: 8, y: 16, pressed: true, atMillis: 100 });
startingGame.tick({ atMillis: 1100 });
var startingFrame = startingGame.render();
var startingSnapshot = startingGame.snapshot();
var runningGame2 = createStartedGame();
var runningFrame2 = runningGame2.render();
var runningSnapshot2 = runningGame2.snapshot();
var damagedGame = createStartedGame();
var firstHazard = helloWorldHazards()[0];
if (!firstHazard) {
  throw new Error("Hola Mundo requires at least one hazard fixture.");
}
damagedGame.press({ ...firstHazard, pressed: true, atMillis: 2200 });
var damagedFrame = damagedGame.render();
var damagedSnapshot = damagedGame.snapshot();
var winningGame = createStartedGame();
helloWorldTargets().forEach((target, index) => {
  winningGame.press({ ...target, pressed: true, atMillis: 2200 + index * 100 });
});
winningGame.tick({ atMillis: 4100 });
var winningFrame = winningGame.render();
var winningSnapshot = winningGame.snapshot();
var losingGame = createStartedGame();
helloWorldHazards().forEach((hazard, index) => {
  losingGame.press({ ...hazard, pressed: true, atMillis: 2200 + index * 100 });
});
losingGame.tick({ atMillis: 4100 });
var losingFrame = losingGame.render();
var losingSnapshot = losingGame.snapshot();
function createStartedGame() {
  const game = createGame2({ seed: 2024, playerCount: 1, durationMillis: 3e4 });
  game.init(0);
  game.press({ x: 8, y: 16, pressed: true, atMillis: 100 });
  game.tick({ atMillis: 2100 });
  return game;
}

// games/meteor-dodge/src/index.ts
var src_exports3 = {};
__export(src_exports3, {
  PlayerDisplay: () => PlayerDisplay3,
  createGame: () => createGame3,
  damagedFrame: () => damagedFrame2,
  damagedSnapshot: () => damagedSnapshot2,
  failedFrame: () => failedFrame,
  failedSnapshot: () => failedSnapshot,
  finishedFrame: () => finishedFrame2,
  finishedSnapshot: () => finishedSnapshot2,
  gameWinAnimationMillis: () => gameWinAnimationMillis,
  initEvents: () => initEvents3,
  manifest: () => manifest3,
  meteorCoreColor: () => meteorCoreColor,
  meteorDifficultyProfile: () => meteorDifficultyProfile,
  meteorImpactColor: () => meteorImpactColor,
  meteorImpactVisibleMillis: () => meteorImpactVisibleMillis,
  meteorWarningColor: () => meteorWarningColor,
  playerFootprintColor: () => playerFootprintColor,
  runningFrame: () => runningFrame3,
  runningSnapshot: () => runningSnapshot3,
  startingLives: () => startingLives2
});

// games/meteor-dodge/src/display.tsx
var import_jsx_runtime5 = __toESM(require_jsx_runtime(), 1);
function PlayerDisplay3({
  snapshot,
  frame
}) {
  const message = snapshot.phase === "finished" ? snapshot.success ? "\xA1Tormenta superada!" : "La tormenta te alcanz\xF3" : snapshot.lastEventMessage || "Esquiva las zonas rojas";
  const messageTone = snapshot.success ? "green" : snapshot.lives === 0 ? "red" : "cyan";
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(GameDisplayShell, { title: snapshot.label, phase: snapshot.phase, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "ml-solo-display meteor-dodge-display", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(PlayerReadyOverlay, { snapshot }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "ml-solo-summary", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(MetricRow, { columns: 3, className: "ml-solo-number-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(MetricPanel, { label: "Esquivados", tone: "cyan", value: snapshot.dodgedMeteors }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          MetricPanel,
          {
            label: "Vidas",
            tone: "neutral",
            value: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(LivesMeter, { lives: snapshot.lives, maxLives: snapshot.maxLives })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(MetricPanel, { label: "Tiempo", tone: "yellow", value: formatClock(snapshot.remainingMillis) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(MetricPanel, { className: "ml-solo-message", label: "Estado", tone: messageTone, value: message })
    ] }),
    frame ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(FramePreviewPanel, { className: "ml-solo-floor", frame, label: "Tormenta en el suelo" }) : null
  ] }) });
}

// games/meteor-dodge/src/manifest.ts
var manifest3 = {
  id: "meteor-dodge",
  label: "Lluvia de meteoritos",
  description: "Cooperative survival game: dodge telegraphed meteor impacts until the storm passes.",
  availability: { development: true, production: false },
  catalog: {
    category: "team",
    color: "#b987ff",
    durationLabel: "45s",
    modeLabel: "Supervivencia",
    audioLabel: "Efectos",
    rules: ["Esquiva las zonas marcadas", "Sobrevive hasta que termine la tormenta"]
  },
  players: {
    allowAny: true,
    min: 1,
    max: 1
  },
  start: {
    mode: "player-ready",
    releaseGraceMillis: 750
  },
  config: {
    difficulty: {
      default: "medium",
      options: ["easy", "medium", "hard", "expert"]
    }
  },
  defaultDurationMillis: 45e3,
  display: {
    entry: "./display"
  },
  preview: {
    seed: 137,
    playerCount: 1,
    difficulty: "medium",
    actions: [
      { atMillis: 100, type: "press", x: 8, y: 16 },
      { atMillis: 2150, type: "release", x: 8, y: 16 }
    ],
    captureStartMillis: 2200,
    frameCount: 18,
    frameIntervalMillis: 120
  },
  tags: ["arcade", "cooperative", "survival", "typescript"]
};

// games/meteor-dodge/src/game.ts
var startingLives2 = 3;
var gameWinAnimationMillis = 3e3;
var meteorImpactVisibleMillis = 450;
var meteorWarningColor = "#ff5a36";
var meteorCoreColor = "#ffe176";
var meteorImpactColor = "#ffffff";
var playerFootprintColor = "#35d7ff";
var backgroundColor2 = "#02050b";
var backgroundStripeColor = "#050d19";
var readyZoneColor = "#145cff";
var readyPulseColor = "#35d7ff";
var startingColor = "#ffe176";
var successColors = ["#35d7ff", "#5fff9e", "#ffe176", "#ff3bd7", "#ffffff"];
var failColors = ["#ff3151", "#7b1428", "#2a0710"];
var damageCooldownMillis = 1e3;
var firstMeteorDelayMillis = 350;
var maxSpawnCatchUp = 64;
var readyZone = { minX: 4, maxX: 11, minY: 12, maxY: 19 };
var mediumDifficultyProfile = {
  intervalMillis: 1550,
  largeMeteorEvery: 5,
  radius: 1,
  warningMillis: 1350
};
var difficultyProfiles = {
  easy: { intervalMillis: 1900, largeMeteorEvery: 0, radius: 1, warningMillis: 1650 },
  medium: mediumDifficultyProfile,
  hard: { intervalMillis: 1200, largeMeteorEvery: 3, radius: 1, warningMillis: 1050 },
  expert: { intervalMillis: 900, largeMeteorEvery: 1, radius: 2, warningMillis: 800 }
};
function createGame3(config) {
  return new MeteorDodgeGame(config);
}
var MeteorDodgeGame = class {
  config;
  dodgedMeteors = 0;
  finishedAtMillis = 0;
  lastDamageMillis = Number.NEGATIVE_INFINITY;
  lastEvent = gameEvent("none", "Listos para la tormenta", 0);
  lives = startingLives2;
  meteors = [];
  nextMeteorId = 1;
  nextMeteorMillis = 0;
  nowMillis = 0;
  occupiedTiles = /* @__PURE__ */ new Set();
  phase = "ready";
  players = [];
  readyGate;
  rng;
  startedAtMillis = 0;
  success = false;
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest3);
    this.rng = createSeededRng(this.config.seed);
    this.readyGate = createPlayerReadyGate(manifest3.start, [readyZone], this.config.nowMillis);
    this.resetState(this.config.nowMillis);
  }
  init(nowMillis) {
    this.resetState(nowMillis);
    this.phase = "waiting";
    this.lastEvent = gameEvent("ready", "Entra en la zona azul", nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    this.updateOccupiedTile(event.x, event.y, event.pressed);
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.update(event), event.atMillis);
    }
    return [];
  }
  release(event) {
    this.nowMillis = event.atMillis;
    this.updateOccupiedTile(event.x, event.y, false);
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.update({ ...event, pressed: false }), event.atMillis);
    }
    return [];
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.tick(event.atMillis), event.atMillis);
    }
    if (this.phase !== "running") {
      return [];
    }
    const events = [];
    this.spawnDueMeteors(event.atMillis);
    for (const meteor of this.meteors) {
      if (meteor.result !== "pending" || event.atMillis < meteor.impactAtMillis) {
        continue;
      }
      const occupied = this.meteorContainsOccupiedTile(meteor);
      if (!occupied) {
        meteor.result = "dodged";
        this.dodgedMeteors += 1;
        continue;
      }
      if (meteor.impactAtMillis - this.lastDamageMillis < damageCooldownMillis) {
        meteor.result = "protected";
        continue;
      }
      meteor.result = "hit";
      this.lastDamageMillis = meteor.impactAtMillis;
      this.lives = Math.max(0, this.lives - 1);
      if (this.lives === 0) {
        events.push(this.finish(false, meteor.impactAtMillis));
        break;
      }
      events.push(gameEvent("miss", "\xA1Impacto! Mu\xE9vete", meteor.impactAtMillis));
    }
    this.meteors = this.meteors.filter((meteor) => meteor.clearAtMillis > event.atMillis);
    if (this.phase === "running" && this.remainingMillis() === 0) {
      events.push(this.finish(true, event.atMillis));
    }
    return this.recordEvents(events);
  }
  render() {
    const frame = createFrame(backgroundColor2);
    this.drawBackground(frame);
    if (this.phase === "waiting" || this.phase === "starting") {
      this.drawPlayerStart(frame);
      return frame;
    }
    if (this.phase === "finished") {
      if (this.success) {
        this.drawWinAnimation(frame);
      } else {
        this.drawFailAnimation(frame);
      }
      return frame;
    }
    for (const tile of this.occupiedTiles) {
      const [x, y] = occupiedTileCoordinates(tile);
      paintFrameCell(frame, x, y, playerFootprintColor);
    }
    for (const meteor of this.meteors) {
      this.drawMeteor(frame, meteor);
    }
    return frame;
  }
  snapshot() {
    const readyState = this.readyGate.state(this.nowMillis);
    const celebrationMillis = this.success && this.phase === "finished" ? Math.max(0, Math.min(gameWinAnimationMillis, this.nowMillis - this.finishedAtMillis)) : 0;
    return {
      currentGame: manifest3.id,
      label: manifest3.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: this.players.map((player) => ({ ...player, lives: this.lives, score: this.dodgedMeteors })),
      score: this.dodgedMeteors,
      lives: this.lives,
      maxLives: startingLives2,
      elapsedMillis: this.elapsedMillis(),
      remainingMillis: this.remainingMillis(),
      activeTargets: this.meteors.filter((meteor) => meteor.result === "pending").length,
      success: this.success,
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? readyState.countdownMillis : 0,
      readyPlayers: readyState.readyPlayers,
      requiredPlayers: readyState.requiredPlayers,
      celebrating: this.success && this.phase === "finished" && celebrationMillis < gameWinAnimationMillis,
      celebrationMillis,
      dodgedMeteors: this.dodgedMeteors,
      meteors: this.meteors.map((meteor) => ({ ...meteor })),
      stormDurationMillis: this.config.durationMillis
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest3);
    this.rng = createSeededRng(this.config.seed);
    this.resetState(this.config.nowMillis);
    this.phase = "waiting";
  }
  applyReadyTransition(transition, nowMillis) {
    if (transition === "players-ready") {
      this.phase = "starting";
      this.lastEvent = gameEvent("ready", "Zona lista", nowMillis);
      return [this.lastEvent];
    }
    if (transition === "players-left") {
      this.phase = "waiting";
      this.lastEvent = gameEvent("ready", "Vuelve a la zona azul", nowMillis);
      return [this.lastEvent];
    }
    if (transition === "started") {
      this.phase = "running";
      this.startedAtMillis = nowMillis;
      this.nextMeteorMillis = nowMillis + firstMeteorDelayMillis;
      this.lastEvent = gameEvent("start", "Esquiva las zonas rojas", nowMillis);
      return [this.lastEvent];
    }
    return [];
  }
  difficultyProfile() {
    return difficultyProfiles[this.config.difficulty] ?? mediumDifficultyProfile;
  }
  drawBackground(frame) {
    for (let y = 3; y < FLOOR_ROWS; y += 4) {
      fillFrameRect(frame, 0, y, FLOOR_COLS, 1, backgroundStripeColor);
    }
  }
  drawFailAnimation(frame) {
    const pulse = Math.floor((this.nowMillis - this.finishedAtMillis) / 180) % failColors.length;
    const color = failColors[pulse] ?? failColors[0];
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      const x = Math.floor(y * FLOOR_COLS / FLOOR_ROWS);
      fillFrameRect(frame, x - 1, y, 3, 1, color);
      fillFrameRect(frame, FLOOR_COLS - x - 2, y, 3, 1, color);
    }
  }
  drawMeteor(frame, meteor) {
    if (meteor.result === "pending") {
      const pulseOn = Math.floor((this.nowMillis - meteor.spawnedAtMillis) / 160) % 2 === 0;
      const size = meteor.radius * 2 + 1;
      const warningColor = pulseOn ? meteorWarningColor : "#6c1b19";
      fillFrameRect(frame, meteor.x - meteor.radius, meteor.y - meteor.radius, size, size, warningColor);
      if (meteor.radius > 0) {
        fillFrameRect(frame, meteor.x - meteor.radius + 1, meteor.y - meteor.radius + 1, size - 2, size - 2, backgroundColor2);
      }
      paintFrameCell(frame, meteor.x, meteor.y, meteorCoreColor);
      return;
    }
    const impactAge = Math.max(0, this.nowMillis - meteor.impactAtMillis);
    const extraRadius = Math.min(2, Math.floor(impactAge / 130));
    const radius = meteor.radius + extraRadius;
    const color = impactAge < 140 ? meteorImpactColor : meteor.result === "hit" ? "#ff3151" : "#ff8a2a";
    fillFrameRect(frame, meteor.x - radius, meteor.y - radius, radius * 2 + 1, radius * 2 + 1, color);
    paintFrameCell(frame, meteor.x, meteor.y, meteorImpactColor);
  }
  drawPlayerStart(frame) {
    const pulse = Math.floor(this.nowMillis / (this.phase === "starting" ? 100 : 190));
    const color = this.phase === "starting" ? startingColor : pulse % 2 === 0 ? readyPulseColor : readyZoneColor;
    const inset = this.phase === "starting" ? pulse % 3 : pulse % 2;
    const x = readyZone.minX + inset;
    const y = readyZone.minY + inset;
    const width = readyZone.maxX - readyZone.minX + 1 - inset * 2;
    const height = readyZone.maxY - readyZone.minY + 1 - inset * 2;
    fillFrameRect(frame, x, y, width, height, color);
    if (width > 2 && height > 2) {
      fillFrameRect(frame, x + 1, y + 1, width - 2, height - 2, backgroundColor2);
    }
    paintFrameCell(frame, 7, 15, "#ffffff");
    paintFrameCell(frame, 8, 16, "#ffffff");
  }
  drawWinAnimation(frame) {
    const step = Math.floor(Math.max(0, this.nowMillis - this.finishedAtMillis) / 120);
    paintDiamondWave(frame, {
      color: ({ distance }) => successColors[(distance + step) % successColors.length] ?? successColors[0],
      step
    });
  }
  elapsedMillis() {
    if (this.phase === "waiting" || this.phase === "starting" || this.phase === "ready") {
      return 0;
    }
    const endMillis = this.phase === "finished" ? this.finishedAtMillis : this.nowMillis;
    return Math.max(0, endMillis - this.startedAtMillis);
  }
  finish(success, atMillis) {
    this.phase = "finished";
    this.success = success;
    this.finishedAtMillis = atMillis;
    const event = gameEvent(success ? "win" : "fail", success ? "Tormenta superada" : "Sin vidas", atMillis);
    this.lastEvent = event;
    return event;
  }
  meteorContainsOccupiedTile(meteor) {
    for (const tile of this.occupiedTiles) {
      const [x, y] = occupiedTileCoordinates(tile);
      if (Math.abs(x - meteor.x) <= meteor.radius && Math.abs(y - meteor.y) <= meteor.radius) {
        return true;
      }
    }
    return false;
  }
  recordEvents(events) {
    const latestEvent = events.at(-1);
    if (latestEvent) {
      this.lastEvent = latestEvent;
    }
    return events;
  }
  remainingMillis() {
    return Math.max(0, this.config.durationMillis - this.elapsedMillis());
  }
  resetState(nowMillis) {
    this.readyGate.reset(nowMillis);
    this.rng = createSeededRng(this.config.seed);
    this.dodgedMeteors = 0;
    this.finishedAtMillis = 0;
    this.lastDamageMillis = Number.NEGATIVE_INFINITY;
    this.lives = startingLives2;
    this.meteors = [];
    this.nextMeteorId = 1;
    this.nextMeteorMillis = 0;
    this.nowMillis = nowMillis;
    this.occupiedTiles.clear();
    this.players = defaultPlayers(this.config.playerCount, this.config.players);
    this.startedAtMillis = nowMillis;
    this.success = false;
  }
  spawnDueMeteors(nowMillis) {
    const profile = this.difficultyProfile();
    let spawned = 0;
    while (this.nextMeteorMillis > 0 && this.nextMeteorMillis <= nowMillis && spawned < maxSpawnCatchUp) {
      const id = this.nextMeteorId;
      const large = profile.largeMeteorEvery > 0 && id % profile.largeMeteorEvery === 0;
      const radius = large ? Math.min(2, profile.radius + 1) : profile.radius;
      const impactAtMillis = this.nextMeteorMillis + profile.warningMillis;
      this.meteors.push({
        clearAtMillis: impactAtMillis + meteorImpactVisibleMillis,
        id,
        impactAtMillis,
        radius,
        result: "pending",
        spawnedAtMillis: this.nextMeteorMillis,
        x: this.rng.range(radius, FLOOR_COLS - radius - 1),
        y: this.rng.range(radius, FLOOR_ROWS - radius - 1)
      });
      this.nextMeteorId += 1;
      this.nextMeteorMillis += profile.intervalMillis;
      spawned += 1;
    }
  }
  updateOccupiedTile(x, y, pressed) {
    if (x < 0 || x >= FLOOR_COLS || y < 0 || y >= FLOOR_ROWS) {
      return;
    }
    const key = `${x},${y}`;
    if (pressed) {
      this.occupiedTiles.add(key);
    } else {
      this.occupiedTiles.delete(key);
    }
  }
};
function meteorDifficultyProfile(difficulty) {
  return { ...difficultyProfiles[difficulty] ?? mediumDifficultyProfile };
}
function occupiedTileCoordinates(tile) {
  const [x = "0", y = "0"] = tile.split(",");
  return [Number(x), Number(y)];
}

// games/meteor-dodge/src/fixtures.ts
var runningGame3 = createGame3({ playerCount: 1, difficulty: "medium", seed: 137 });
var initEvents3 = runningGame3.init(0);
startGame(runningGame3);
runningGame3.release({ x: 8, y: 16, pressed: false, atMillis: 2150 });
runningGame3.tick({ atMillis: 4e3 });
var runningFrame3 = runningGame3.render();
var runningSnapshot3 = runningGame3.snapshot();
var damagedGame2 = createGame3({ playerCount: 1, difficulty: "easy", seed: 137 });
damagedGame2.init(0);
startGame(damagedGame2);
damageOnce(damagedGame2, 2450);
var damagedFrame2 = damagedGame2.render();
var damagedSnapshot2 = damagedGame2.snapshot();
var finishedGame2 = createGame3({ playerCount: 1, difficulty: "medium", durationMillis: 4e3, seed: 137 });
finishedGame2.init(0);
startGame(finishedGame2);
finishedGame2.release({ x: 8, y: 16, pressed: false, atMillis: 2150 });
finishedGame2.tick({ atMillis: 6100 });
finishedGame2.tick({ atMillis: 7e3 });
var finishedFrame2 = finishedGame2.render();
var finishedSnapshot2 = finishedGame2.snapshot();
var failedGame = createGame3({ playerCount: 1, difficulty: "easy", seed: 137 });
failedGame.init(0);
startGame(failedGame);
var failureClock = 2450;
for (let hit = 0; hit < 3; hit += 1) {
  failureClock = damageOnce(failedGame, failureClock) + 1050;
}
var failedFrame = failedGame.render();
var failedSnapshot = failedGame.snapshot();
function startGame(game) {
  game.press({ x: 8, y: 16, pressed: true, atMillis: 100 });
  game.tick({ atMillis: 2100 });
}
function damageOnce(game, nowMillis) {
  game.release({ x: 8, y: 16, pressed: false, atMillis: nowMillis });
  game.tick({ atMillis: nowMillis });
  const meteor = game.snapshot().meteors.find((candidate) => candidate.result === "pending");
  if (!meteor) {
    return nowMillis;
  }
  game.press({ x: meteor.x, y: meteor.y, pressed: true, atMillis: meteor.impactAtMillis - 1 });
  game.tick({ atMillis: meteor.impactAtMillis });
  game.release({ x: meteor.x, y: meteor.y, pressed: false, atMillis: meteor.impactAtMillis + 1 });
  return meteor.impactAtMillis + 1;
}

// games/ping-pong/src/index.ts
var src_exports4 = {};
__export(src_exports4, {
  PlayerDisplay: () => PlayerDisplay4,
  ballColor: () => ballColor2,
  blueColor: () => blueColor,
  createGame: () => createGame4,
  finishedSnapshot: () => finishedSnapshot3,
  manifest: () => manifest4,
  pingPongConfigVars: () => pingPongConfigVars,
  redColor: () => redColor,
  runningFrame: () => runningFrame4,
  runningSnapshot: () => runningSnapshot4,
  waitingSnapshot: () => waitingSnapshot2
});

// games/ping-pong/src/display.tsx
var import_jsx_runtime6 = __toESM(require_jsx_runtime(), 1);
function positionStyle(position) {
  return {
    "--ping-pong-ball-x": `${3.5 + position.y / 31 * 93}%`,
    "--ping-pong-ball-y": `${18 + position.x / 15 * 64}%`
  };
}
function PlayerDisplay4({
  snapshot
}) {
  const [red, blue] = snapshot.players;
  const redPlayer = red ?? { label: "Rojo", score: 0, color: "#ff1c28" };
  const bluePlayer = blue ?? { label: "Azul", score: 0, color: "#145cff" };
  const target = Math.max(snapshot.matchTarget, 1);
  const totalRounds = target * 2 - 1;
  const centerLabel = snapshot.phase === "starting" ? "Empieza en" : "Objetivo";
  const centerValue = snapshot.phase === "starting" ? formatClock(snapshot.countdownMillis) : target;
  const centerCaption = snapshot.phase === "starting" ? "preparados" : "puntos para ganar";
  const rallyLabel = snapshot.phase === "finished" ? "\xDAltimo peloteo" : "Peloteo";
  const rallyValue = snapshot.phase === "finished" && snapshot.lastRoundHits > 0 ? snapshot.lastRoundHits : snapshot.roundHits;
  const lastValue = snapshot.lastRoundWinner || "-";
  const lastTone = lastValue === redPlayer.label ? "red" : lastValue === bluePlayer.label ? "blue" : "neutral";
  const readyVisible = snapshot.phase === "waiting" || snapshot.phase === "starting";
  const currentRound = Math.min(
    totalRounds,
    snapshot.rounds.length + (snapshot.phase === "running" || snapshot.phase === "starting" ? 1 : 0)
  );
  const progressLabel = readyVisible ? "Listos" : "Ronda";
  const progressValue = readyVisible ? `${snapshot.activeTargets}/2` : `${currentRound}/${totalRounds}`;
  const roundInProgress = snapshot.phase === "running";
  const activeRound = snapshot.phase === "finished" ? null : Math.min(totalRounds, snapshot.rounds.length + 1);
  const scoringSide = snapshot.pointScorer === 0 ? "red" : snapshot.pointScorer === 1 ? "blue" : "none";
  const winnerSide = snapshot.winnerIndex === 0 ? "red" : snapshot.winnerIndex === 1 ? "blue" : "none";
  const displayClassName = [
    "ping-pong-display",
    "ml-versus-display",
    `is-phase-${snapshot.phase}`,
    snapshot.pointFlashMillis > 0 ? `is-scoring-${scoringSide}` : "",
    snapshot.phase === "finished" ? `is-winner-${winnerSide}` : ""
  ].filter(Boolean).join(" ");
  const scorerLabel = snapshot.pointScorer === 0 ? redPlayer.label : bluePlayer.label;
  const winnerLabel = snapshot.winnerIndex === 0 ? redPlayer.label : bluePlayer.label;
  const rallyCaption = snapshot.phase === "waiting" ? `${snapshot.activeTargets}/2 en posici\xF3n` : snapshot.phase === "starting" ? "Preparados" : snapshot.phase === "finished" ? `Victoria ${winnerLabel}` : snapshot.pointFlashMillis > 0 ? `Punto ${scorerLabel}` : snapshot.roundHits > 0 ? `${snapshot.roundHits} ${snapshot.roundHits === 1 ? "golpe" : "golpes"}` : "Saque";
  const impactStyle = snapshot.impact ? positionStyle(snapshot.impact) : void 0;
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(GameDisplayShell, { title: snapshot.label, phase: snapshot.phase, variant: "versus", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
    "div",
    {
      className: displayClassName,
      style: { "--ping-pong-rally-pace": snapshot.rallyPace },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          VersusScoreboard,
          {
            className: "ping-pong-scoreboard",
            left: redPlayer,
            right: bluePlayer,
            target,
            centerLabel,
            centerValue,
            centerCaption
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
          "section",
          {
            "aria-label": `Trayectoria de la pelota: ${rallyCaption}`,
            className: "ping-pong-rally-lane",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ping-pong-rally-team is-red", children: "Rojo" }),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ping-pong-rally-team is-blue", children: "Azul" }),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ping-pong-rally-net", "aria-hidden": "true" }),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ping-pong-rally-scan", "aria-hidden": "true" }),
              snapshot.ballTrail.map((position, index) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                "i",
                {
                  "aria-hidden": "true",
                  className: "ping-pong-ball-trail",
                  style: { ...positionStyle(position), "--ping-pong-trail-index": index }
                },
                `${index}-${position.x}-${position.y}`
              )),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                "i",
                {
                  "aria-hidden": "true",
                  className: "ping-pong-ball",
                  style: positionStyle(snapshot.ball)
                }
              ),
              snapshot.impact ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                "i",
                {
                  "aria-hidden": "true",
                  className: `ping-pong-impact is-${snapshot.impact.team === 0 ? "red" : "blue"}`,
                  style: impactStyle
                },
                snapshot.motionEventId
              ) : null,
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("strong", { className: "ping-pong-rally-caption", children: rallyCaption }, `caption-${snapshot.motionEventId}`)
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(MetricRow, { columns: 4, className: "ping-pong-metrics", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(MetricPanel, { className: "ping-pong-rally-metric", label: rallyLabel, tone: "cyan", value: rallyValue }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(MetricPanel, { className: "ping-pong-progress-metric", label: progressLabel, tone: readyVisible ? "green" : "yellow", value: progressValue }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(MetricPanel, { className: "ping-pong-last-metric", label: "\xDAltimo", tone: lastTone, value: lastValue }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(MetricPanel, { className: "ping-pong-time-metric", label: "Tiempo", tone: "amber", value: formatClock(snapshot.elapsedMillis) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          RoundStrip,
          {
            className: "ping-pong-rounds",
            activeCaption: roundInProgress ? "Punto en curso" : "Por comenzar",
            activeLabel: roundInProgress ? "En juego" : "Siguiente",
            activeRound,
            rounds: snapshot.rounds,
            totalRounds
          }
        )
      ]
    }
  ) });
}

// games/ping-pong/src/manifest.ts
var pingPongConfigVars = {
  pointsToWin: {
    key: "points_to_win",
    label: "Points to win",
    playerFacing: true,
    description: "The first team to reach this score wins. A match can last up to twice this value minus one rounds.",
    type: "int",
    default: 5,
    min: 1,
    max: 21,
    step: 1
  },
  initialBallSpeed: {
    key: "initial_ball_speed",
    label: "Initial ball speed (tiles/s)",
    playerFacing: false,
    description: "The ball's starting speed in floor tiles per second on Easy. Medium, Hard, and Expert apply the difficulty multiplier curve to this value.",
    type: "float",
    default: 5.75,
    min: 3,
    max: 10,
    step: 0.25
  },
  returnSpeedMultiplier: {
    key: "return_speed_multiplier",
    label: "Speed multiplier per return",
    playerFacing: false,
    description: "The ball accelerates after every successful paddle return. Difficulty scales the increase above 1x, with a safety cap at 2.5 times the starting speed.",
    type: "float",
    default: 1.035,
    min: 1,
    max: 1.1,
    step: 5e-3
  },
  difficultyMultiplier: {
    key: "difficulty_multiplier",
    label: "Difficulty multiplier step",
    playerFacing: false,
    description: "Easy uses 1x, Medium uses one step, Hard uses the step squared, and Expert uses the step cubed. It affects both starting speed and return acceleration.",
    type: "float",
    default: 1.2,
    min: 1,
    max: 1.35,
    step: 0.05
  }
};
var manifest4 = {
  id: "ping-pong",
  label: "Ping Pong",
  description: "Two-player arcade ping pong for red and blue halves of the Motion Levels floor.",
  availability: { development: true, production: true },
  catalog: {
    category: "versus",
    color: "#145cff",
    durationLabel: "A 5 puntos",
    modeLabel: "Rojo contra azul",
    audioLabel: "M\xFAsica + efectos",
    rules: ["Un equipo ocupa la mitad roja y otro la azul", "Devuelve la pelota pisando la zona iluminada"]
  },
  players: {
    allowAny: true,
    min: 2,
    max: 2
  },
  start: {
    mode: "player-ready",
    releaseGraceMillis: 1e3
  },
  config: {
    difficulty: {
      default: "medium",
      options: ["easy", "medium", "hard", "expert"]
    },
    vars: Object.values(pingPongConfigVars)
  },
  defaultDurationMillis: 0,
  display: {
    entry: "./display"
  },
  preview: {
    seed: 137,
    playerCount: 2,
    difficulty: "medium",
    options: { points_to_win: 5 },
    actions: [
      { atMillis: 100, type: "press", x: 7, y: 3 },
      { atMillis: 100, type: "press", x: 7, y: 28 }
    ],
    captureStartMillis: 2200,
    frameCount: 18,
    frameIntervalMillis: 120
  },
  tags: ["arcade", "two-player", "typescript"]
};

// games/ping-pong/src/game.ts
var redColor = "#ff1c28";
var blueColor = "#145cff";
var ballColor2 = "#ffffff";
var idleColor2 = "#05070a";
var redRgb = { r: 255, g: 28, b: 40 };
var blueRgb = { r: 20, g: 92, b: 255 };
var whiteRgb = { r: 255, g: 255, b: 255 };
var postPointPauseMillis = 900;
var winAnimationMillis = 3e3;
var paddleYRed = 2;
var paddleYBlue = 29;
var paddleWidth2 = 5;
var serveX = Math.floor(FLOOR_COLS / 2);
var serveY = Math.floor(FLOOR_ROWS / 2);
var maximumSpeedRatio = 2.5;
function createGame4(config) {
  return new PingPongGame(config);
}
var PingPongGame = class {
  config;
  rng;
  players;
  winningScore;
  speed;
  startedAtMillis = 0;
  nowMillis = 0;
  readyGate;
  lastStepMillis = 0;
  pauseUntilMillis = 0;
  finishAtMillis = 0;
  currentIntervalMillis = 140;
  hitCount = 0;
  redPaddleX = 0;
  bluePaddleX = 0;
  ball = { x: serveX, y: serveY, dx: 1, dy: 1 };
  ballTrail = [];
  teamScore = [0, 0];
  rounds = [];
  lastRoundHits = 0;
  lastRoundWinner = "";
  phase = "waiting";
  success = false;
  scorer = -1;
  winner = -1;
  pointAtMillis = 0;
  lastImpactAtMillis = 0;
  lastImpact = null;
  motionEventId = 0;
  lastEvent = gameEvent("none", "Listo", 0);
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest4);
    this.rng = createSeededRng(this.config.seed);
    this.readyGate = createPlayerReadyGate(manifest4.start, createHorizontalPlayerReadyZones(2), this.config.nowMillis);
    this.winningScore = this.readWinningScore();
    this.players = this.createPlayers();
    this.speed = speedForConfig(this.config);
    this.resetGame(this.config.nowMillis);
  }
  init(nowMillis) {
    this.startedAtMillis = nowMillis;
    this.nowMillis = nowMillis;
    this.resetGame(nowMillis);
    this.lastEvent = gameEvent("ready", "Ping Pong espera rojo y azul", nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    const readyTransition = this.readyGate.update(event);
    if (event.pressed) {
      this.movePaddle(event.x, event.y);
    }
    return this.recordEvents(this.updatePhase(event.atMillis, readyTransition));
  }
  release(event) {
    this.nowMillis = event.atMillis;
    const readyTransition = this.readyGate.update({ ...event, pressed: false });
    return this.recordEvents(this.updatePhase(event.atMillis, readyTransition));
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    const events = this.updatePhase(event.atMillis, this.readyGate.tick(event.atMillis));
    if (this.phase !== "running" || event.atMillis < this.pauseUntilMillis) {
      return this.recordEvents(events);
    }
    for (let steps = 0; steps < 8; steps += 1) {
      if (event.atMillis - this.lastStepMillis < this.currentIntervalMillis) {
        break;
      }
      this.lastStepMillis += this.currentIntervalMillis;
      const nextEvent = this.moveBall(this.lastStepMillis);
      if (nextEvent) {
        events.push(nextEvent);
      }
      if (this.phase !== "running" || this.lastStepMillis < this.pauseUntilMillis) {
        break;
      }
    }
    return this.recordEvents(events);
  }
  render() {
    const frame = createFrame(idleColor2);
    if (this.phase === "waiting") {
      this.drawWaiting(frame);
      return frame;
    }
    if (this.phase === "starting") {
      this.drawReady(frame);
      return frame;
    }
    if (this.phase === "finished") {
      this.drawWin(frame);
      return frame;
    }
    this.drawArena(frame);
    this.drawScore(frame);
    if (this.nowMillis < this.pauseUntilMillis) {
      this.drawScoreFlash(frame);
    } else {
      this.drawBallTrail(frame);
      this.drawImpact(frame);
      this.drawPaddles(frame);
      this.drawBallGlow(frame);
      paintFrameCell(frame, this.ball.x, this.ball.y, ballColor2);
    }
    return frame;
  }
  snapshot() {
    this.recordEvents(this.updatePhase(this.nowMillis));
    const readyState = this.readyGate.state(this.nowMillis);
    const countdownMillis = this.phase === "starting" ? readyState.countdownMillis : 0;
    const remainingMillis = this.phase === "finished" && this.nowMillis < this.finishAtMillis + winAnimationMillis ? this.finishAtMillis + winAnimationMillis - this.nowMillis : 0;
    return {
      currentGame: manifest4.id,
      label: manifest4.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: [
        {
          index: 0,
          label: this.labelForTeam(0),
          color: redColor,
          score: this.teamScore[0],
          lives: -1
        },
        {
          index: 1,
          label: this.labelForTeam(1),
          color: blueColor,
          score: this.teamScore[1],
          lives: -1
        }
      ],
      score: this.teamScore[0] + this.teamScore[1],
      lives: -1,
      elapsedMillis: Math.max(0, this.nowMillis - this.startedAtMillis),
      remainingMillis,
      activeTargets: this.activeHalves(this.nowMillis),
      success: this.success,
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis,
      readyPlayers: readyState.readyPlayers,
      requiredPlayers: readyState.requiredPlayers,
      matchTarget: this.winningScore,
      roundHits: this.hitCount,
      lastRoundHits: this.lastRoundHits,
      lastRoundWinner: this.lastRoundWinner,
      rounds: this.rounds,
      ball: { ...this.ball },
      ballTrail: this.ballTrail.map((position) => ({ ...position })),
      rallyPace: this.speed.initialMillis === this.speed.minimumMillis ? 1 : clamp(
        (this.speed.initialMillis - this.currentIntervalMillis) / (this.speed.initialMillis - this.speed.minimumMillis),
        0,
        1
      ),
      pointScorer: this.scorer,
      pointFlashMillis: Math.max(0, this.pauseUntilMillis - this.nowMillis),
      winnerIndex: this.winner,
      impact: this.lastImpact && this.nowMillis - this.lastImpactAtMillis < 480 ? {
        ...this.lastImpact,
        remainingMillis: 480 - (this.nowMillis - this.lastImpactAtMillis)
      } : null,
      motionEventId: this.motionEventId,
      initialBallSpeed: this.speed.initialTilesPerSecond,
      ballSpeed: 1e3 / this.currentIntervalMillis,
      returnSpeedMultiplier: this.speed.hitMultiplier,
      difficultySpeedFactor: this.speed.difficultyFactor
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest4);
    this.rng = createSeededRng(this.config.seed);
    this.winningScore = this.readWinningScore();
    this.players = this.createPlayers();
    this.speed = speedForConfig(this.config);
    this.motionEventId = 0;
    this.resetGame(this.config.nowMillis);
    this.lastEvent = gameEvent("none", "Listo", this.config.nowMillis);
  }
  createPlayers() {
    return [
      { index: 0, label: "Rojo", color: redColor, score: 0, lives: -1 },
      { index: 1, label: "Azul", color: blueColor, score: 0, lives: -1 }
    ];
  }
  readWinningScore() {
    return readGameConfigOption(this.config.options, pingPongConfigVars.pointsToWin);
  }
  resetGame(nowMillis) {
    this.readyGate.reset(nowMillis);
    this.teamScore = [0, 0];
    this.rounds = [];
    this.lastRoundHits = 0;
    this.lastRoundWinner = "";
    this.redPaddleX = Math.floor((FLOOR_COLS - paddleWidth2) / 2);
    this.bluePaddleX = this.redPaddleX;
    this.phase = "waiting";
    this.success = false;
    this.scorer = -1;
    this.winner = -1;
    this.pointAtMillis = 0;
    this.lastImpactAtMillis = 0;
    this.lastImpact = null;
    this.motionEventId += 1;
    this.startedAtMillis = nowMillis;
    this.finishAtMillis = 0;
    this.resetBall();
    this.lastEvent = gameEvent("none", "Esperando a rojo arriba y azul abajo", nowMillis);
  }
  updatePhase(nowMillis, readyTransition = this.readyGate.tick(nowMillis)) {
    if (this.phase === "finished") {
      if (nowMillis - this.finishAtMillis >= winAnimationMillis) {
        this.resetGame(nowMillis);
        return [gameEvent("ready", "Nueva partida", nowMillis)];
      }
      return [];
    }
    if (readyTransition === "players-ready") {
      this.phase = "starting";
      this.motionEventId += 1;
      return [gameEvent("start", "Rojo y azul listos", nowMillis)];
    }
    if (readyTransition === "players-left") {
      this.phase = "waiting";
      this.motionEventId += 1;
      return [gameEvent("ready", "Vuelve a las zonas roja y azul", nowMillis)];
    }
    if (readyTransition === "started") {
      this.phase = "running";
      this.startedAtMillis = nowMillis;
      this.lastStepMillis = nowMillis;
      this.serve();
      this.motionEventId += 1;
      return [gameEvent("start", "La pelota esta en juego", nowMillis)];
    }
    return [];
  }
  movePaddle(x, y) {
    const center = clamp(Math.round(x), Math.floor(paddleWidth2 / 2), FLOOR_COLS - 1 - Math.floor(paddleWidth2 / 2));
    const left = center - Math.floor(paddleWidth2 / 2);
    if (y < FLOOR_ROWS / 2) {
      this.redPaddleX = left;
    } else {
      this.bluePaddleX = left;
    }
  }
  moveBall(nowMillis) {
    let nextX = this.ball.x + this.ball.dx;
    const nextY = this.ball.y + this.ball.dy;
    if (nextX < 0) {
      nextX = 0;
      this.ball.dx = 1;
    }
    if (nextX >= FLOOR_COLS) {
      nextX = FLOOR_COLS - 1;
      this.ball.dx = -1;
    }
    if (this.ball.dy < 0 && nextY === paddleYRed && nextX >= this.redPaddleX && nextX < this.redPaddleX + paddleWidth2) {
      this.reflectFromPaddle(nextX, this.redPaddleX);
      this.commitBall({ ...this.ball, x: nextX, y: paddleYRed + 1, dy: 1 });
      this.recordImpact(0, nextX, paddleYRed);
      this.accelerate();
      return gameEvent("coin", "Rojo devuelve", nowMillis);
    }
    if (this.ball.dy > 0 && nextY === paddleYBlue && nextX >= this.bluePaddleX && nextX < this.bluePaddleX + paddleWidth2) {
      this.reflectFromPaddle(nextX, this.bluePaddleX);
      this.commitBall({ ...this.ball, x: nextX, y: paddleYBlue - 1, dy: -1 });
      this.recordImpact(1, nextX, paddleYBlue);
      this.accelerate();
      return gameEvent("coin", "Azul devuelve", nowMillis);
    }
    if (nextY < 0) {
      this.scorePoint(1, nowMillis);
      return gameEvent("score", "Punto para azul", nowMillis);
    }
    if (nextY >= FLOOR_ROWS) {
      this.scorePoint(0, nowMillis);
      return gameEvent("score", "Punto para rojo", nowMillis);
    }
    this.commitBall({ ...this.ball, x: nextX, y: nextY });
    return void 0;
  }
  scorePoint(team, nowMillis) {
    this.teamScore[team] += 1;
    this.scorer = team;
    this.pointAtMillis = nowMillis;
    this.motionEventId += 1;
    this.recordRound(team);
    if (this.teamScore[team] >= this.winningScore) {
      this.phase = "finished";
      this.success = team === 1;
      this.winner = team;
      this.finishAtMillis = nowMillis;
      return;
    }
    this.resetBall();
    this.pauseUntilMillis = nowMillis + postPointPauseMillis;
    this.lastStepMillis = this.pauseUntilMillis;
  }
  recordRound(team) {
    this.lastRoundHits = this.hitCount;
    this.lastRoundWinner = this.labelForTeam(team);
    this.rounds = [
      ...this.rounds,
      {
        index: this.rounds.length + 1,
        winnerIndex: team,
        winnerLabel: this.lastRoundWinner,
        hits: this.lastRoundHits
      }
    ];
  }
  resetBall() {
    this.ball = { ...this.ball, x: serveX, y: serveY };
    this.ballTrail = [];
    this.currentIntervalMillis = this.speed.initialMillis;
    this.hitCount = 0;
    this.pauseUntilMillis = 0;
    this.serve();
  }
  serve() {
    this.ball = {
      x: serveX,
      y: serveY,
      dy: this.rng.int(2) === 0 ? -1 : 1,
      dx: this.rng.int(2) === 0 ? -1 : 1
    };
  }
  reflectFromPaddle(x, paddleX) {
    const center = paddleX + Math.floor(paddleWidth2 / 2);
    if (x < center) {
      this.ball.dx = -1;
    } else if (x > center) {
      this.ball.dx = 1;
    } else {
      this.ball.dx = this.rng.int(2) === 0 ? -1 : 1;
    }
  }
  accelerate() {
    this.hitCount += 1;
    this.currentIntervalMillis = Math.max(
      this.speed.minimumMillis,
      this.currentIntervalMillis / this.speed.hitMultiplier
    );
  }
  commitBall(nextBall) {
    this.ballTrail = [
      { x: this.ball.x, y: this.ball.y },
      ...this.ballTrail.filter((position) => position.x !== this.ball.x || position.y !== this.ball.y)
    ].slice(0, 5);
    this.ball = nextBall;
  }
  recordImpact(team, x, y) {
    this.lastImpact = { team, x, y };
    this.lastImpactAtMillis = this.nowMillis;
    this.motionEventId += 1;
  }
  drawWaiting(frame) {
    const redReady = this.halfReady(0, this.nowMillis);
    const blueReady = this.halfReady(1, this.nowMillis);
    this.drawWaitingHalf(frame, 0, redReady);
    this.drawWaitingHalf(frame, 1, blueReady);
    if (redReady) {
      this.drawSoftBar(frame, 3, 5, 10, redRgb);
    } else {
      this.drawBreathingOutline(frame, 0, redRgb);
    }
    if (blueReady) {
      this.drawSoftBar(frame, 3, 24, 10, blueRgb);
    } else {
      this.drawBreathingOutline(frame, 1, blueRgb);
    }
  }
  drawReady(frame) {
    const countdownDuration = gameStartCountdownMillis(manifest4.start);
    const elapsed = Math.max(0, countdownDuration - this.readyGate.state(this.nowMillis).countdownMillis);
    const progress = clamp(elapsed / countdownDuration, 0, 1);
    const radius = progress * (FLOOR_ROWS * 0.7);
    const pulse = 0.5 + Math.sin(elapsed / 86) * 0.5;
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      for (let x = 0; x < FLOOR_COLS; x += 1) {
        const dist = Math.abs(x - serveX) + Math.abs(y - serveY);
        const base = y >= FLOOR_ROWS / 2 ? blueRgb : redRgb;
        const waveDistance = Math.abs(dist - radius);
        const wake = Math.max(0, 1 - waveDistance / 3.2);
        const ambient = 7 + (Math.sin(x * 0.82 + y * 0.38 - elapsed / 120) + 1) * 4;
        if (wake > 0) {
          paintFrameCell(frame, x, y, mix(base, 28 + wake * 74, wake * 24));
        } else if (dist < radius) {
          paintFrameCell(frame, x, y, tint(base, ambient + pulse * 10));
        }
      }
    }
    this.drawCenterLine(frame, 18 + pulse * 20);
    this.drawBallGlow(frame);
    paintFrameCell(frame, serveX, serveY, ballColor2);
  }
  drawScoreFlash(frame) {
    const base = this.scorer === 1 ? blueRgb : redRgb;
    const elapsed = Math.max(0, this.nowMillis - this.pointAtMillis);
    const progress = clamp(elapsed / postPointPauseMillis, 0, 1);
    const originY = this.scorer === 0 ? FLOOR_ROWS - 1 : 0;
    const radius = progress * (FLOOR_ROWS + 8);
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      for (let x = 0; x < FLOOR_COLS; x += 1) {
        const dist = Math.hypot((x - serveX) * 1.35, y - originY);
        const ring = Math.max(0, 1 - Math.abs(dist - radius) / 3.4);
        const spark = Math.sin(x * 12.13 + y * 7.71 + elapsed / 38) > 0.9 ? 1 : 0;
        const fade = 1 - progress;
        if (ring > 0) {
          paintFrameCell(frame, x, y, mix(base, 28 + ring * 82, ring * 34));
        } else if (spark > 0 && fade > 0.18) {
          paintFrameCell(frame, x, y, mix(base, 22 + fade * 44, fade * 12));
        }
      }
    }
    this.drawCenterLine(frame, 12 + (1 - progress) * 24);
    this.drawPaddles(frame);
  }
  drawWin(frame) {
    const base = this.winner === 1 ? blueRgb : redRgb;
    const elapsed = Math.max(0, this.nowMillis - this.finishAtMillis);
    const sweep = elapsed / 92;
    const pulse = 0.5 + Math.sin(elapsed / 110) * 0.5;
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      for (let x = 0; x < FLOOR_COLS; x += 1) {
        const directionY = this.winner === 0 ? FLOOR_ROWS - 1 - y : y;
        const ribbon = (directionY + x * 0.72 - sweep + FLOOR_ROWS * 4) % 11;
        const sparkle = Math.sin(x * 17.17 + y * 11.31 + elapsed / 55);
        if (ribbon < 3.8) {
          paintFrameCell(frame, x, y, mix(base, 38 + (3.8 - ribbon) * 15 + pulse * 12, 12 + pulse * 18));
        } else if (sparkle > 0.91) {
          paintFrameCell(frame, x, y, mix(base, 48, 32));
        }
      }
    }
    const coreLevel = 64 + pulse * 26;
    fillFrameRect(frame, serveX - 1, serveY - 1, 3, 3, tint(whiteRgb, coreLevel));
    paintFrameCell(frame, serveX, serveY, ballColor2);
  }
  drawArena(frame) {
    const flow = this.nowMillis / 185;
    for (let y = 1; y < FLOOR_ROWS - 1; y += 1) {
      const base = y < FLOOR_ROWS / 2 ? redRgb : blueRgb;
      for (let x = 0; x < FLOOR_COLS; x += 1) {
        const wave = (Math.sin(x * 0.78 + y * 0.31 - flow) + 1) * 0.5;
        const lane = (x + y) % 3 === 0 ? 4 : 0;
        paintFrameCell(frame, x, y, tint(base, 4 + wave * 7 + lane));
      }
    }
    this.drawCenterLine(frame, 18 + (Math.sin(this.nowMillis / 140) + 1) * 5);
  }
  drawCenterLine(frame, level) {
    for (let x = 0; x < FLOOR_COLS; x += 1) {
      if ((x + Math.floor(this.nowMillis / 120)) % 3 !== 0) {
        continue;
      }
      paintFrameCell(frame, x, serveY - 1, mix(whiteRgb, level, 0));
      paintFrameCell(frame, x, serveY, mix(whiteRgb, level * 0.72, 0));
    }
  }
  drawBallTrail(frame) {
    this.ballTrail.forEach((position, index) => {
      const level = Math.max(10, 46 - index * 8);
      paintFrameCell(frame, position.x, position.y, tint(whiteRgb, level));
    });
  }
  drawBallGlow(frame) {
    const glow = 20 + (Math.sin(this.nowMillis / 70) + 1) * 7;
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      paintFrameCell(frame, this.ball.x + dx, this.ball.y + dy, tint(whiteRgb, glow));
    }
  }
  drawImpact(frame) {
    if (!this.lastImpact) {
      return;
    }
    const elapsed = this.nowMillis - this.lastImpactAtMillis;
    if (elapsed < 0 || elapsed >= 480) {
      return;
    }
    const progress = elapsed / 480;
    const radius = 1 + progress * 5.5;
    const base = this.lastImpact.team === 0 ? redRgb : blueRgb;
    for (let y = Math.max(0, this.lastImpact.y - 7); y <= Math.min(FLOOR_ROWS - 1, this.lastImpact.y + 7); y += 1) {
      for (let x = Math.max(0, this.lastImpact.x - 7); x <= Math.min(FLOOR_COLS - 1, this.lastImpact.x + 7); x += 1) {
        const dist = Math.hypot(x - this.lastImpact.x, y - this.lastImpact.y);
        const ring = Math.max(0, 1 - Math.abs(dist - radius) / 1.45);
        if (ring > 0) {
          paintFrameCell(frame, x, y, mix(base, 30 + ring * 52, ring * 28 * (1 - progress)));
        }
      }
    }
  }
  drawBreathingOutline(frame, team, base) {
    const phase = (this.nowMillis / 900 + team * 0.5) % 1;
    const breath = 0.5 - Math.cos(phase * Math.PI * 2) * 0.5;
    const inset = Math.round(1 + breath * 2);
    const y = team === 0 ? 3 + inset : 21 - inset;
    const level = 48 + breath * 48;
    this.drawOutline(frame, inset, y, FLOOR_COLS - inset * 2, 8, tint(base, level));
  }
  drawScore(frame) {
    for (let x = 0; x < this.teamScore[0] && x < FLOOR_COLS; x += 1) {
      paintFrameCell(frame, x, 0, redColor);
    }
    for (let x = 0; x < this.teamScore[1] && x < FLOOR_COLS; x += 1) {
      paintFrameCell(frame, x, FLOOR_ROWS - 1, blueColor);
    }
  }
  drawPaddles(frame) {
    this.drawPaddle(frame, this.redPaddleX, paddleYRed, redRgb);
    this.drawPaddle(frame, this.bluePaddleX, paddleYBlue, blueRgb);
  }
  drawWaitingHalf(frame, half, ready) {
    const startY = half === 1 ? FLOOR_ROWS / 2 : 0;
    const base = half === 1 ? blueRgb : redRgb;
    const pulse = Math.floor(this.nowMillis / 120) % 10;
    for (let y = startY; y < startY + FLOOR_ROWS / 2; y += 1) {
      for (let x = 0; x < FLOOR_COLS; x += 1) {
        let level = 0;
        if (ready) {
          level = 18 + (x + y + pulse) % 6 * 6;
        } else if ((x + y + pulse) % 7 === 0) {
          level = 22;
        }
        if (level > 0) {
          paintFrameCell(frame, x, y, tint(base, level));
        }
      }
    }
  }
  drawSoftBar(frame, x, y, width, base) {
    const pulse = Math.floor(this.nowMillis / 100) % 6;
    for (let offset = 0; offset < width; offset += 1) {
      const level = offset === pulse || offset === width - 1 - pulse ? 112 : 58 + offset * 4;
      paintFrameCell(frame, x + offset, y, tint(base, level));
      paintFrameCell(frame, x + offset, y + 1, mix(base, level - 8, 10));
      paintFrameCell(frame, x + offset, y + 2, tint(base, Math.max(18, level - 28)));
    }
  }
  drawPaddle(frame, x, y, base) {
    for (let offset = 0; offset < paddleWidth2; offset += 1) {
      const level = offset === Math.floor(paddleWidth2 / 2) ? 118 : 74;
      paintFrameCell(frame, x + offset, y, mix(base, level, 18));
    }
  }
  drawOutline(frame, x, y, width, height, color) {
    const safeWidth = Math.max(2, Math.round(width));
    const safeHeight = Math.max(2, Math.round(height));
    fillFrameRect(frame, x, y, safeWidth, 1, color);
    fillFrameRect(frame, x, y + safeHeight - 1, safeWidth, 1, color);
    fillFrameRect(frame, x, y, 1, safeHeight, color);
    fillFrameRect(frame, x + safeWidth - 1, y, 1, safeHeight, color);
  }
  halfReady(half, nowMillis) {
    return this.readyGate.zoneReady(half, nowMillis);
  }
  activeHalves(nowMillis) {
    return this.readyGate.state(nowMillis).readyPlayers;
  }
  labelForTeam(team) {
    return this.players[team]?.label || (team === 0 ? "Rojo" : "Azul");
  }
  recordEvents(events) {
    const latestEvent = events.at(-1);
    if (latestEvent) {
      this.lastEvent = latestEvent;
    }
    return events;
  }
};
function speedForConfig(config) {
  const baseInitialSpeed = readGameConfigOption(config.options, pingPongConfigVars.initialBallSpeed);
  const baseHitMultiplier = readGameConfigOption(config.options, pingPongConfigVars.returnSpeedMultiplier);
  const difficultyStep = readGameConfigOption(config.options, pingPongConfigVars.difficultyMultiplier);
  const difficultyFactor = difficultyStep ** difficultyIndex(config.difficulty);
  const initialTilesPerSecond = baseInitialSpeed * difficultyFactor;
  const hitMultiplier = 1 + (baseHitMultiplier - 1) * difficultyFactor;
  const maximumTilesPerSecond = initialTilesPerSecond * maximumSpeedRatio;
  return {
    difficultyFactor,
    hitMultiplier,
    initialTilesPerSecond,
    initialMillis: 1e3 / initialTilesPerSecond,
    minimumMillis: 1e3 / maximumTilesPerSecond
  };
}
function difficultyIndex(value) {
  switch (value) {
    case "medium":
      return 1;
    case "hard":
      return 2;
    case "expert":
      return 3;
    default:
      return 0;
  }
}
function tint(color, percent) {
  return rgbToHex(scaleRgb(color, percent));
}
function mix(color, colorPercent, whitePercent) {
  return rgbToHex(addRgb(scaleRgb(color, colorPercent), scaleRgb(whiteRgb, whitePercent)));
}

// games/ping-pong/src/fixtures.ts
var runningFrame4 = (() => {
  const frame = createFrame("#05070a");
  fillFrameRect(frame, 5, 2, 5, 1, redColor);
  fillFrameRect(frame, 6, 29, 5, 1, blueColor);
  paintFrameCell(frame, 8, 16, ballColor2);
  return frame;
})();
var waitingSnapshot2 = {
  currentGame: manifest4.id,
  label: manifest4.label,
  phase: "waiting",
  playerCount: 2,
  players: [
    { index: 0, label: "Rojo", color: redColor, score: 0, lives: -1 },
    { index: 1, label: "Azul", color: blueColor, score: 0, lives: -1 }
  ],
  score: 0,
  lives: -1,
  elapsedMillis: 0,
  remainingMillis: 0,
  activeTargets: 0,
  success: false,
  lastEventCue: "ready",
  lastEventMessage: "Ping Pong espera rojo y azul",
  countdownMillis: 0,
  readyPlayers: 0,
  requiredPlayers: 2,
  matchTarget: 5,
  roundHits: 0,
  lastRoundHits: 0,
  lastRoundWinner: "",
  rounds: [],
  ball: { x: 8, y: 16, dx: 1, dy: 1 },
  ballTrail: [],
  rallyPace: 0,
  pointScorer: -1,
  pointFlashMillis: 0,
  winnerIndex: -1,
  impact: null,
  motionEventId: 1,
  initialBallSpeed: 6.9,
  ballSpeed: 6.9,
  returnSpeedMultiplier: 1.042,
  difficultySpeedFactor: 1.2
};
var runningSnapshot4 = {
  ...waitingSnapshot2,
  phase: "running",
  readyPlayers: 2,
  elapsedMillis: 8200,
  activeTargets: 2,
  lastEventCue: "coin",
  lastEventMessage: "Azul devuelve",
  roundHits: 3,
  ball: { x: 11, y: 21, dx: 1, dy: 1 },
  ballTrail: [
    { x: 10, y: 20 },
    { x: 9, y: 19 },
    { x: 8, y: 18 }
  ],
  rallyPace: 0.1935,
  ballSpeed: 7.8064,
  impact: { team: 1, x: 10, y: 29, remainingMillis: 180 },
  motionEventId: 4
};
var finishedSnapshot3 = {
  ...runningSnapshot4,
  phase: "finished",
  score: 5,
  remainingMillis: 2400,
  success: true,
  lastEventCue: "score",
  lastEventMessage: "Punto para azul",
  players: [
    { index: 0, label: "Rojo", color: redColor, score: 2, lives: -1 },
    { index: 1, label: "Azul", color: blueColor, score: 3, lives: -1 }
  ],
  lastRoundHits: 2,
  lastRoundWinner: "Azul",
  pointScorer: 1,
  winnerIndex: 1,
  motionEventId: 8,
  rounds: [
    { index: 1, winnerIndex: 0, winnerLabel: "Rojo", hits: 1 },
    { index: 2, winnerIndex: 1, winnerLabel: "Azul", hits: 2 }
  ]
};

// packages/runner/src/registry.ts
var gameRegistry = /* @__PURE__ */ new Map([
  [manifest.id, src_exports],
  [manifest2.id, src_exports2],
  [manifest3.id, src_exports3],
  [manifest4.id, src_exports4]
]);
var gameCatalog = [...gameRegistry.values()].map((game) => game.manifest).sort((left, right) => left.id.localeCompare(right.id));

// packages/runner/src/session.ts
var RunnerSession = class {
  engine = null;
  gameId = "";
  paused = false;
  held = /* @__PURE__ */ new Set();
  handle(request) {
    switch (request.method) {
      case "init":
        return this.init(request.params);
      case "input":
        return this.input(request.params ?? {});
      case "control":
        return this.control(request.params ?? {});
      case "tick":
        return this.tick(request.params ?? {});
      case "status":
        return this.state();
    }
  }
  init(params) {
    const gameId = String(params?.gameId || "").trim();
    const module = gameRegistry.get(gameId);
    if (!module) throw new Error(`unknown game: ${gameId}`);
    if (!module.manifest.availability.production && params.development !== true) {
      throw new Error(`game is not production eligible: ${gameId}`);
    }
    const config = normalizeGameConfig(params, module.manifest);
    const game = module.createGame(config);
    const events = game.init(config.nowMillis);
    this.engine = createGameEngine(game, { initialEvents: events, nowMillis: config.nowMillis });
    this.gameId = gameId;
    this.paused = false;
    this.held.clear();
    return this.state(this.engine.state);
  }
  input(params) {
    const engine = this.requireEngine();
    if (this.paused) return this.state(engine.refresh());
    const x = boundedInteger(params.x, 0, 15, "x");
    const y = boundedInteger(params.y, 0, 31, "y");
    const pressed = params.pressed === true;
    const atMillis = finiteNumber(params.atMillis, engine.clockMillis);
    const key = `${x},${y}`;
    const state = pressed ? engine.press(x, y, atMillis) : engine.release(x, y, atMillis);
    if (pressed) this.held.add(key);
    else this.held.delete(key);
    return this.state(state);
  }
  control(params) {
    const action = String(params.action || "");
    const engine = this.requireEngine();
    if (action === "pause" && !this.paused) {
      for (const key of this.held) {
        const [x, y] = key.split(",").map(Number);
        engine.release(x ?? 0, y ?? 0);
      }
      this.held.clear();
      this.paused = true;
      return this.state(engine.refresh());
    }
    if (action === "resume") {
      this.paused = false;
      return this.state(engine.refresh());
    }
    if (action === "reset") {
      const module = gameRegistry.get(this.gameId);
      if (!module) throw new Error("runner has no active game");
      const game = module.createGame({});
      const events = game.init(0);
      this.engine = createGameEngine(game, { initialEvents: events });
      this.paused = false;
      this.held.clear();
      return this.state(this.engine.state);
    }
    if (action !== "status") throw new Error(`unknown control action: ${action}`);
    return this.state(engine.refresh());
  }
  tick(params) {
    const engine = this.requireEngine();
    if (this.paused) return this.state(engine.refresh());
    const atMillis = finiteNumber(params.atMillis, engine.clockMillis);
    return this.state(engine.tickTo(atMillis));
  }
  requireEngine() {
    if (!this.engine) throw new Error("runner must be initialized first");
    return this.engine;
  }
  state(state = this.requireEngine().state) {
    return {
      clockMillis: state.clockMillis,
      paused: this.paused,
      frame: packFrame(state.frame),
      snapshot: state.snapshot,
      events: state.events
    };
  }
};
function boundedInteger(value, min, max, label) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) throw new Error(`${label} must be an integer from ${min} to ${max}`);
  return number;
}
function finiteNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
}

// packages/runner/src/runner.ts
var sourceRevision = true ? "7e742a65e280af51ef5eecff4459be2c81893f89" : "development";
var session = new RunnerSession();
var input = createInterface({ input: process.stdin, crlfDelay: Infinity });
input.on("line", (line) => {
  let id = "";
  try {
    const request = JSON.parse(line);
    id = String(request.id || "");
    if (request.version !== runnerProtocolVersion) throw new Error(`unsupported protocol version: ${request.version}`);
    if (!id) throw new Error("request id is required");
    const response = {
      version: runnerProtocolVersion,
      id,
      ok: true,
      sourceRevision,
      state: session.handle(request)
    };
    process.stdout.write(`${JSON.stringify(response)}
`);
  } catch (error) {
    const response = {
      version: runnerProtocolVersion,
      id,
      ok: false,
      sourceRevision,
      error: error instanceof Error ? error.message : String(error)
    };
    process.stdout.write(`${JSON.stringify(response)}
`);
  }
});
