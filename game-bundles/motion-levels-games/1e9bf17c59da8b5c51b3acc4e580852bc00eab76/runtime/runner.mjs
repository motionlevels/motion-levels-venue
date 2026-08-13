var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target3, all) => {
  for (var name in all)
    __defProp(target3, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target3) => (target3 = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target3, "default", { value: mod, enumerable: true }) : target3,
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
    exports.useEffect = function(create2, deps) {
      return ReactSharedInternals.H.useEffect(create2, deps);
    };
    exports.useEffectEvent = function(callback) {
      return ReactSharedInternals.H.useEffectEvent(callback);
    };
    exports.useId = function() {
      return ReactSharedInternals.H.useId();
    };
    exports.useImperativeHandle = function(ref, create2, deps) {
      return ReactSharedInternals.H.useImperativeHandle(ref, create2, deps);
    };
    exports.useInsertionEffect = function(create2, deps) {
      return ReactSharedInternals.H.useInsertionEffect(create2, deps);
    };
    exports.useLayoutEffect = function(create2, deps) {
      return ReactSharedInternals.H.useLayoutEffect(create2, deps);
    };
    exports.useMemo = function(create2, deps) {
      return ReactSharedInternals.H.useMemo(create2, deps);
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
      exports.useEffect = function(create2, deps) {
        null == create2 && console.warn(
          "React Hook useEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useEffect(create2, deps);
      };
      exports.useEffectEvent = function(callback) {
        return resolveDispatcher().useEffectEvent(callback);
      };
      exports.useId = function() {
        return resolveDispatcher().useId();
      };
      exports.useImperativeHandle = function(ref, create2, deps) {
        return resolveDispatcher().useImperativeHandle(ref, create2, deps);
      };
      exports.useInsertionEffect = function(create2, deps) {
        null == create2 && console.warn(
          "React Hook useInsertionEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useInsertionEffect(create2, deps);
      };
      exports.useLayoutEffect = function(create2, deps) {
        null == create2 && console.warn(
          "React Hook useLayoutEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useLayoutEffect(create2, deps);
      };
      exports.useMemo = function(create2, deps) {
        return resolveDispatcher().useMemo(create2, deps);
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
function gameManifestSlug(manifest24) {
  const slug = String(manifest24.slug ?? "").trim();
  return slug || manifest24.id;
}
function gameManifestLookupKeys(manifest24) {
  const keys = [manifest24.id, gameManifestSlug(manifest24), ...manifest24.aliases ?? []].map(normalizeGameLookupKey).filter(Boolean);
  return Object.freeze([...new Set(keys)]);
}
function normalizeGameLookupKey(value) {
  return String(value ?? "").trim().toLowerCase();
}
var DEFAULT_GAME_DIFFICULTIES = ["easy", "medium", "hard", "expert"];
var DEFAULT_ENGINE_FPS = 50;
var DEFAULT_ENGINE_FRAME_MILLIS = 1e3 / DEFAULT_ENGINE_FPS;
function inFloorBounds(x, y) {
  return Number.isInteger(x) && Number.isInteger(y) && x >= 0 && x < FLOOR_COLS && y >= 0 && y < FLOOR_ROWS;
}
function normalizeGameConfig(config, manifest24) {
  const content = normalizeGameContent(config.content);
  return {
    seed: normalizeGameSeed(config.seed),
    playerCount: normalizePlayerCount(config.playerCount, manifest24),
    players: Array.isArray(config.players) ? config.players : [],
    durationMillis: normalizeNonNegativeNumber(config.durationMillis, manifest24.defaultDurationMillis),
    nowMillis: normalizeNonNegativeNumber(config.nowMillis, 0),
    difficulty: normalizeGameDifficulty(config.difficulty, manifest24),
    options: normalizeGameConfigOptions(config.options, manifest24),
    ...content ? { content } : {}
  };
}
function normalizeGameContent(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return void 0;
  const schema = String(value.schema ?? "").trim();
  if (!schema || schema.length > 120) return void 0;
  const clone = cloneGameContentValue(value, /* @__PURE__ */ new WeakSet());
  if (!clone || typeof clone !== "object" || Array.isArray(clone)) return void 0;
  return Object.freeze({ ...clone, schema });
}
function cloneGameContentValue(value, ancestors) {
  if (value === null || typeof value === "string" || typeof value === "boolean") return value;
  if (typeof value === "number") return Number.isFinite(value) ? value : void 0;
  if (typeof value !== "object") return void 0;
  if (ancestors.has(value)) return void 0;
  ancestors.add(value);
  if (Array.isArray(value)) {
    const cloned2 = [];
    for (const child of value) {
      const normalized = cloneGameContentValue(child, ancestors);
      if (normalized === void 0) {
        ancestors.delete(value);
        return void 0;
      }
      cloned2.push(normalized);
    }
    ancestors.delete(value);
    return Object.freeze(cloned2);
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) {
    ancestors.delete(value);
    return void 0;
  }
  const cloned = {};
  for (const [key, child] of Object.entries(value)) {
    if (key === "__proto__" || key === "prototype" || key === "constructor") {
      ancestors.delete(value);
      return void 0;
    }
    const normalized = cloneGameContentValue(child, ancestors);
    if (normalized === void 0) {
      ancestors.delete(value);
      return void 0;
    }
    cloned[key] = normalized;
  }
  ancestors.delete(value);
  return Object.freeze(cloned);
}
function normalizeGameSeed(value) {
  const candidate = typeof value === "number" && Number.isFinite(value) ? Math.trunc(value) : DEFAULT_GAME_SEED;
  return clamp(candidate, MIN_GAME_SEED, MAX_GAME_SEED);
}
function normalizePlayerCount(value, manifest24) {
  const rounded = typeof value === "number" && Number.isFinite(value) ? Math.round(value) : defaultGamePlayerCount(manifest24);
  if (manifest24.players.allowAny === true && rounded === 0) {
    return 0;
  }
  return clamp(rounded, manifest24.players.min, manifest24.players.max);
}
function defaultGamePlayerCount(manifest24) {
  return manifest24.players.allowAny ? 0 : manifest24.players.min;
}
function normalizeNonNegativeNumber(value, fallback) {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : fallback;
}
function gameDifficultyOptions(manifest24) {
  const configured = manifest24.config?.difficulty?.options;
  return configured?.length ? [...configured] : [...DEFAULT_GAME_DIFFICULTIES];
}
function normalizeGameDifficulty(value, manifest24) {
  const options = gameDifficultyOptions(manifest24);
  const configuredDefault = manifest24.config?.difficulty?.default;
  const fallback = configuredDefault && options.includes(configuredDefault) ? configuredDefault : options.includes("medium") ? "medium" : options[0] ?? "medium";
  return value && options.includes(value) ? value : fallback;
}
function normalizeGameConfigOptions(options, manifest24) {
  const source = options ?? {};
  return Object.fromEntries(
    (manifest24.config?.vars ?? []).map((configVar) => [
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
  const finite2 = Number.isFinite(numeric) ? numeric : configVar.default;
  const rounded = configVar.type === "int" ? Math.round(finite2) : finite2;
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
function defaultPlayers(count, players2 = []) {
  const colors = ["#35d7ff", "#ff3bd7", "#ffe176", "#5fff9e"];
  return Array.from({ length: count }, (_, index) => ({
    index,
    label: players2[index]?.label || players2[index]?.name || `Player ${index + 1}`,
    color: players2[index]?.color || colors[index % colors.length] || colors[0],
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
function createGameEngine(game8, options = {}) {
  return new DefaultGameEngine(game8, options);
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
  constructor(game8, options) {
    this.currentGame = game8;
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
  replaceGame(game8, options = {}) {
    this.currentGame = game8;
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
function lineTiles(start2, end) {
  const tiles = [];
  let x = start2.x;
  let y = start2.y;
  const deltaX = Math.abs(end.x - start2.x);
  const stepX = start2.x < end.x ? 1 : -1;
  const deltaY = -Math.abs(end.y - start2.y);
  const stepY = start2.y < end.y ? 1 : -1;
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
  const starting4 = snapshot.phase === "starting";
  const countdown = Math.max(1, Math.ceil((snapshot.countdownMillis ?? 0) / 1e3));
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    "section",
    {
      "aria-label": starting4 ? "El juego est\xE1 a punto de empezar" : "Esperando jugadores",
      className: `ml-player-ready-overlay is-${snapshot.phase}`,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "ml-player-ready-pulse", "aria-hidden": "true", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("i", {}),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("i", {}),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("i", {})
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: starting4 ? "Todos listos" : "Esperando jugadores" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { children: starting4 ? countdown : `${readyPlayers}/${requiredPlayers}` }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("b", { children: starting4 ? "El juego est\xE1 a punto de empezar" : "Entra y permanece en la zona iluminada" })
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
  target: target3,
  centerLabel,
  centerValue,
  centerCaption = "",
  className = ""
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("section", { className: `ml-versus-scoreboard ${className}`.trim(), "aria-label": "Marcador", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PlayerScorePanel, { player: left, side: "red", target: target3 }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("article", { className: "ml-versus-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: centerLabel }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { children: centerValue }),
      centerCaption ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("b", { children: centerCaption }) : null
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PlayerScorePanel, { player: right, side: "blue", target: target3 })
  ] });
}
function PlayerScorePanel({
  player,
  side,
  target: target3
}) {
  const progress = Math.max(0, Math.min(1, player.score / Math.max(target3, 1)));
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
            target3
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
  totalRounds: totalRounds2,
  activeRound,
  activeLabel = "Ronda actual",
  activeCaption = "Punto en curso",
  fallbackLabel = "Pendiente",
  className = ""
}) {
  const roundCount = Math.max(rounds.length, totalRounds2 ?? 0, 1);
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
function autoplay(game8) {
  game8.press({ x: 7, y: 30, pressed: true, atMillis: 50 });
  game8.tick({ atMillis: 2050 });
  let nowMillis = 2100;
  for (let step = 0; step < 24e3 && game8.snapshot().phase !== "finished"; step += 1) {
    const snapshot = game8.snapshot();
    game8.press({ x: snapshot.ball.x, y: 30, pressed: true, atMillis: nowMillis });
    game8.tick({ atMillis: nowMillis });
    nowMillis += 50;
  }
}

// games/animations/src/index.ts
var src_exports2 = {};
__export(src_exports2, {
  PlayerDisplay: () => PlayerDisplay2,
  animationContentSchema: () => animationContentSchema,
  animationOption: () => animationOption,
  createGame: () => createGame2,
  manifest: () => manifest2,
  modeOption: () => modeOption,
  rotationSecondsOption: () => rotationSecondsOption,
  runningFrame: () => runningFrame2,
  runningSnapshot: () => runningSnapshot2,
  speedOption: () => speedOption
});

// games/animations/src/display.tsx
var import_jsx_runtime4 = __toESM(require_jsx_runtime(), 1);
var styles = `
.animation-display{background:radial-gradient(circle at 72% 28%,color-mix(in srgb,var(--animation-accent) 25%,transparent),transparent 34%),linear-gradient(140deg,#03050a,#090d18 58%,#05050d);display:grid;grid-template-columns:minmax(0,1fr) 360px;inset:0;overflow:hidden;padding:52px;position:absolute}.animation-copy{align-content:center;display:grid;min-width:0}.animation-kicker{color:var(--animation-accent);font-size:22px;font-weight:900;letter-spacing:.17em;text-transform:uppercase}.animation-copy h2{color:#fff;font-size:clamp(92px,8vw,154px);letter-spacing:-.07em;line-height:.82;margin:22px 0 30px;max-width:1080px}.animation-copy p{color:#b9c4d8;font-size:27px;font-weight:700;line-height:1.35;margin:0;max-width:780px}.animation-palette{display:flex;gap:12px;margin-top:42px}.animation-palette i{background:var(--swatch);border:3px solid rgba(255,255,255,.2);border-radius:999px;box-shadow:0 0 24px color-mix(in srgb,var(--swatch) 60%,transparent);height:26px;width:78px}.animation-orbit{align-self:center;aspect-ratio:1;border:1px solid color-mix(in srgb,var(--animation-accent) 38%,transparent);border-radius:50%;display:grid;place-items:center;position:relative;width:100%}.animation-orbit::before,.animation-orbit::after{border:4px solid var(--animation-accent);border-left-color:transparent;border-radius:50%;content:"";inset:11%;position:absolute}.animation-orbit::after{border-color:color-mix(in srgb,var(--animation-accent) 45%,transparent);border-right-color:transparent;inset:24%}.animation-orbit strong{color:#fff;font-size:78px;letter-spacing:-.08em}.animation-display.is-live .animation-orbit::before{animation:animation-spin 5s linear infinite}.animation-display.is-live .animation-orbit::after{animation:animation-spin 3.5s linear reverse infinite}.animation-meta{align-items:center;bottom:32px;color:#8090a8;display:flex;font-size:18px;font-weight:800;gap:20px;left:52px;position:absolute;text-transform:uppercase}.animation-meta b{color:#fff}.animation-meta i{background:var(--animation-accent);border-radius:50%;box-shadow:0 0 12px var(--animation-accent);height:8px;width:8px}@keyframes animation-spin{to{transform:rotate(1turn)}}@media(prefers-reduced-motion:reduce){.animation-orbit::before,.animation-orbit::after{animation:none!important}}
`;
function PlayerDisplay2({ snapshot }) {
  const accent = snapshot.palette[1] ?? snapshot.palette[0] ?? "#42ffd2";
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(GameDisplayShell, { title: snapshot.label, phase: snapshot.phase, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "animation-display is-live", style: { "--animation-accent": accent }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("style", { children: styles }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "animation-copy", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "animation-kicker", children: "Experiencia ambiental" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { children: snapshot.animationLabel }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { children: snapshot.lastEventMessage }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "animation-palette", "aria-label": "Paleta de color", children: snapshot.palette.map((color) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { style: { "--swatch": color } }, color)) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "animation-orbit", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: String(snapshot.rotationIndex + 1).padStart(2, "0") }) }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("footer", { className: "animation-meta", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", {}),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("b", { children: "En directo" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { children: [
        snapshot.rotationSize,
        " animaciones"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { children: [
        snapshot.activeTargets,
        " interacciones"
      ] })
    ] })
  ] }) });
}

// packages/animation-runtime/src/core.ts
function defineAnimation(definition) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(definition.id)) {
    throw new Error(`Invalid animation id: ${definition.id}`);
  }
  if (!Number.isFinite(definition.durationMillis) || definition.durationMillis < 100) {
    throw new Error(`Animation ${definition.id} needs a duration of at least 100ms`);
  }
  return Object.freeze({ ...definition, palette: Object.freeze([...definition.palette]), tags: Object.freeze([...definition.tags]) });
}
function renderAnimationFrame(animation, options) {
  const frame = createFrame("#000000");
  const durationMillis = Math.max(100, animation.durationMillis);
  const wrappedMillis = positiveModulo2(options.atMillis, durationMillis);
  const timeSeconds = wrappedMillis / 1e3;
  const progress = wrappedMillis / durationMillis;
  const seed = Math.trunc(options.seed ?? 137);
  for (let y = 0; y < FLOOR_ROWS; y += 1) {
    for (let x = 0; x < FLOOR_COLS; x += 1) {
      const context = {
        x,
        y,
        xn: x / (FLOOR_COLS - 1),
        yn: y / (FLOOR_ROWS - 1),
        width: FLOOR_COLS,
        height: FLOOR_ROWS,
        timeSeconds,
        progress,
        seed
      };
      const base = clampPixel(animation.render(context));
      const pressured = applyPressure(base, context, options.atMillis, options.pressure ?? [], animation.pressure ?? "ripple");
      paintFrameCell(frame, x, y, rgbToHex2(pressured));
    }
  }
  return frame;
}
function compose(...shaders) {
  return (context) => shaders.reduce(
    (result, shader) => blend(result, shader(context), layerModes.get(shader) ?? "normal"),
    transparent
  );
}
function add(shader) {
  return withMode(shader, "add");
}
function screen(shader) {
  return withMode(shader, "screen");
}
function multiply(shader) {
  return withMode(shader, "multiply");
}
var layerModes = /* @__PURE__ */ new WeakMap();
function withMode(shader, mode) {
  const wrapped = (context) => shader(context);
  layerModes.set(wrapped, mode);
  return wrapped;
}
function solid(color, alpha = 1) {
  const value = toRgb(color);
  return () => ({ ...value, a: clamp01(alpha) });
}
function gradient(colors, options = {}) {
  const palette2 = colors.map(toRgb);
  const angle = options.angle ?? 90;
  const radians = angle * Math.PI / 180;
  return (context) => {
    const axis = context.xn * Math.cos(radians) + context.yn * Math.sin(radians);
    const position = positiveModulo2(axis + (options.offset ?? 0) + context.progress * (options.speed ?? 0), 1);
    return samplePalette(palette2, position);
  };
}
function wave(options) {
  const palette2 = options.colors.map(toRgb);
  const radians = (options.angle ?? 0) * Math.PI / 180;
  return (context) => {
    const axis = context.xn * Math.cos(radians) + context.yn * Math.sin(radians);
    const value = Math.sin((axis * (options.frequency ?? 3) - context.progress * (options.speed ?? 1)) * Math.PI * 2);
    const normalized = 0.5 + value * 0.5;
    const shaped = smoothstep(0.5 - (options.softness ?? 0.45) / 2, 0.5 + (options.softness ?? 0.45) / 2, normalized);
    return { ...samplePalette(palette2, shaped), a: options.alpha ?? shaped };
  };
}
function rings(options) {
  const palette2 = options.colors.map(toRgb);
  const [cx, cy] = options.center ?? [0.5, 0.5];
  return (context) => {
    const distance = Math.hypot(context.xn - cx, (context.yn - cy) * 2);
    const phase = positiveModulo2(distance * (options.frequency ?? 7) - context.progress * (options.speed ?? 2), 1);
    const intensity = 1 - smoothstep(options.width ?? 0.16, 0.5, Math.abs(phase - 0.5));
    return { ...samplePalette(palette2, positiveModulo2(distance + context.progress, 1)), a: clamp01(intensity) };
  };
}
function ribbons(options) {
  const palette2 = options.colors.map(toRgb);
  return (context) => {
    const count = options.count ?? 4;
    const bend = Math.sin(context.xn * Math.PI * 2 + context.progress * Math.PI * 2 * (options.speed ?? 0.4)) * (options.bend ?? 0.12);
    const lane = positiveModulo2(context.yn + bend + context.progress * (options.speed ?? 0.4), 1 / count) * count;
    const distance = Math.abs(lane - 0.5);
    const alpha = 1 - smoothstep(options.width ?? 0.12, 0.5, distance);
    return { ...samplePalette(palette2, positiveModulo2(context.xn + context.yn + context.progress, 1)), a: clamp01(alpha) };
  };
}
function sparkles(options = {}) {
  const base = toRgb(options.color ?? "#ffffff");
  return (context) => {
    const beat = Math.floor(context.timeSeconds * (options.speed ?? 6));
    const random = hash(context.x, context.y, beat, context.seed);
    const density = options.density ?? 0.09;
    const active = random > 1 - density ? 1 : 0;
    const age = positiveModulo2(context.timeSeconds * (options.speed ?? 6), 1);
    const intensity = active * Math.pow(1 - age, options.size ?? 1.5);
    const pixel = options.rainbow ? hsv(hash(context.x, context.y, context.seed), 0.8, 1) : base;
    return { ...pixel, a: intensity };
  };
}
function plasma(options) {
  const palette2 = options.colors.map(toRgb);
  return (context) => {
    const scale = options.scale ?? 3;
    const time = context.progress * Math.PI * 2 * (options.speed ?? 1);
    const a = Math.sin(context.xn * scale * Math.PI * 2 + time);
    const b = Math.sin(context.yn * scale * Math.PI * 2 - time * 0.73);
    const c = Math.sin((context.xn + context.yn) * scale * Math.PI + time * 0.41);
    return samplePalette(palette2, clamp01(0.5 + (a + b + c) / 6));
  };
}
function checker(options) {
  const first = toRgb(options.colors[0]);
  const second = toRgb(options.colors[1]);
  return (context) => {
    const offset = context.progress * (options.speed ?? 1);
    const size = options.size ?? 4;
    const cell = Math.floor(context.x / size + offset) + Math.floor(context.y / size - offset);
    return cell % 2 === 0 ? first : second;
  };
}
function kaleidoscope(options) {
  const palette2 = options.colors.map(toRgb);
  return (context) => {
    const dx = context.xn - 0.5;
    const dy = (context.yn - 0.5) * 2;
    const distance = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx) / (Math.PI * 2);
    const segment = Math.abs(positiveModulo2(angle * (options.segments ?? 8) + context.progress * (options.speed ?? 1), 2) - 1);
    return samplePalette(palette2, positiveModulo2(segment + distance * 1.7, 1));
  };
}
function mask(shader, opacity) {
  return (context) => ({ ...shader(context), a: clamp01(opacity(context)) });
}
function mapShader(shader, transform) {
  return (context) => transform(shader(context), context);
}
function hsv(hue, saturation, value) {
  const h = positiveModulo2(hue, 1) * 6;
  const c = clamp01(value) * clamp01(saturation);
  const x = c * (1 - Math.abs(h % 2 - 1));
  const m = clamp01(value) - c;
  const [r, g, b] = h < 1 ? [c, x, 0] : h < 2 ? [x, c, 0] : h < 3 ? [0, c, x] : h < 4 ? [0, x, c] : h < 5 ? [x, 0, c] : [c, 0, x];
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
}
function hash(...values) {
  let state = 2166136261;
  for (const value of values) {
    state ^= Math.trunc(value * 1000003);
    state = Math.imul(state, 16777619);
    state ^= state >>> 13;
  }
  return (state >>> 0) / 4294967295;
}
function smoothstep(edge0, edge1, value) {
  if (edge0 === edge1) return value < edge0 ? 0 : 1;
  const normalized = clamp01((value - edge0) / (edge1 - edge0));
  return normalized * normalized * (3 - 2 * normalized);
}
function mix(left, right, amount) {
  return left + (right - left) * clamp01(amount);
}
function rgbToHex2(pixel) {
  const channel = (value) => Math.round(clamp2(value, 0, 255)).toString(16).padStart(2, "0");
  return `#${channel(pixel.r)}${channel(pixel.g)}${channel(pixel.b)}`;
}
function blend(base, layer, mode) {
  const alpha = clamp01(layer.a ?? 1);
  const blendChannel = (bottom, top) => {
    if (mode === "add") return Math.min(255, bottom + top * alpha);
    if (mode === "screen") return 255 - (255 - bottom) * (255 - top * alpha) / 255;
    if (mode === "multiply") return bottom * mix(1, top / 255, alpha);
    return mix(bottom, top, alpha);
  };
  return { r: blendChannel(base.r, layer.r), g: blendChannel(base.g, layer.g), b: blendChannel(base.b, layer.b), a: Math.max(base.a ?? 0, alpha) };
}
function applyPressure(base, context, atMillis, points, preset) {
  if (preset === "none") return base;
  let result = base;
  for (const point of points) {
    const age = (atMillis - point.startedAtMillis) / 900;
    if (age < 0 || age > 1) continue;
    const distance = Math.hypot(context.x - point.x, context.y - point.y);
    const ring = 1 - smoothstep(0.4, 1.8, Math.abs(distance - age * 8));
    const core = Math.max(0, 1 - distance / 2.5) * Math.pow(1 - age, 2);
    const strength = clamp01((ring + core * 0.7) * (1 - age));
    const target3 = preset === "spark" ? { r: 255, g: 232, b: 118 } : preset === "glow" ? { r: 255, g: 111, b: 214 } : { r: 126, g: 225, b: 255 };
    result = { r: mix(result.r, target3.r, strength), g: mix(result.g, target3.g, strength), b: mix(result.b, target3.b, strength), a: 1 };
  }
  return result;
}
function samplePalette(colors, position) {
  if (colors.length === 0) return transparent;
  if (colors.length === 1) return colors[0];
  const scaled = clamp01(position) * (colors.length - 1);
  const index = Math.min(colors.length - 2, Math.floor(scaled));
  const amount = scaled - index;
  const left = colors[index];
  const right = colors[index + 1];
  return { r: mix(left.r, right.r, amount), g: mix(left.g, right.g, amount), b: mix(left.b, right.b, amount), a: 1 };
}
function toRgb(value) {
  if (typeof value !== "string") return value;
  const hex = value.slice(1);
  if (hex.length === 3) return { r: Number.parseInt(hex[0] + hex[0], 16), g: Number.parseInt(hex[1] + hex[1], 16), b: Number.parseInt(hex[2] + hex[2], 16) };
  return { r: Number.parseInt(hex.slice(0, 2), 16), g: Number.parseInt(hex.slice(2, 4), 16), b: Number.parseInt(hex.slice(4, 6), 16) };
}
function clampPixel(pixel) {
  return { r: clamp2(pixel.r, 0, 255), g: clamp2(pixel.g, 0, 255), b: clamp2(pixel.b, 0, 255), a: clamp01(pixel.a ?? 1) };
}
function clamp01(value) {
  return clamp2(value, 0, 1);
}
function clamp2(value, min, max) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}
function positiveModulo2(value, modulo) {
  return (value % modulo + modulo) % modulo;
}
var transparent = Object.freeze({ r: 0, g: 0, b: 0, a: 0 });

// packages/animation-runtime/src/content.ts
var animationContentSchema = "motion-levels-animation-content-v1";
function normalizeAnimationRuntimeContent(value) {
  if (!value || typeof value !== "object") return void 0;
  const content = value;
  if (content.schema !== animationContentSchema) return void 0;
  const selectedAnimationId = typeof content.selectedAnimationId === "string" ? normalizeId(content.selectedAnimationId) : void 0;
  const rotationIds = Array.isArray(content.rotationIds) ? [...new Set(content.rotationIds.filter((id) => typeof id === "string").map(normalizeId).filter(Boolean))].slice(0, 100) : [];
  const rotationSeconds = typeof content.rotationSeconds === "number" && Number.isFinite(content.rotationSeconds) ? Math.min(120, Math.max(5, Math.round(content.rotationSeconds))) : void 0;
  return Object.freeze({
    schema: animationContentSchema,
    contentRevision: String(content.contentRevision ?? "unversioned").slice(0, 160),
    ...selectedAnimationId ? { selectedAnimationId } : {},
    rotationIds: Object.freeze(rotationIds),
    ...rotationSeconds === void 0 ? {} : { rotationSeconds }
  });
}
function normalizeId(value) {
  return value.trim().toLowerCase();
}

// packages/animation-runtime/src/library.ts
function libraryAnimation(definition) {
  return defineAnimation({
    category: definition.category ?? "ambient",
    durationMillis: definition.durationMillis ?? 1e4,
    tags: definition.tags ?? [],
    pressure: definition.pressure ?? "ripple",
    ...definition
  });
}
var dark = (color) => gradient(["#010307", color], { angle: 100 });
var definitions = [
  libraryAnimation({
    id: "arcoiris",
    label: "Arco\xEDris",
    description: "Bandas de color que recorren toda la pista",
    palette: ["#ff416c", "#ffca3a", "#56f39a", "#35d7ff", "#b968ff"],
    tags: ["color", "suave"],
    render: compose(gradient(["#ff416c", "#ffca3a", "#56f39a", "#35d7ff", "#b968ff"], { angle: 26, speed: 1 }), multiply(wave({ colors: ["#657080", "#ffffff"], angle: -18, frequency: 3, speed: 2, softness: 0.8 })))
  }),
  libraryAnimation({
    id: "cometas",
    label: "Cometas",
    description: "Estelas luminosas cruzan el suelo en diagonal",
    palette: ["#07121f", "#35d7ff", "#e9fbff"],
    tags: ["espacio", "movimiento"],
    pressure: "spark",
    render: compose(dark("#061a2e"), add(mask(wave({ colors: ["#35d7ff", "#ffffff"], angle: 28, frequency: 8, speed: 3, softness: 0.18 }), (context) => hash(Math.floor(context.yn * 9), context.seed) > 0.42 ? 0.9 : 0.08)), screen(sparkles({ density: 0.035, speed: 4 })))
  }),
  libraryAnimation({
    id: "pulso",
    label: "Pulso",
    description: "Ondas conc\xE9ntricas con ritmo de ne\xF3n",
    palette: ["#02020a", "#ff3bd7", "#35d7ff"],
    tags: ["ritmo", "ne\xF3n"],
    pressure: "glow",
    durationMillis: 8e3,
    render: compose(solid("#02020a"), add(rings({ colors: ["#ff3bd7", "#35d7ff", "#ffffff"], frequency: 8, speed: 3, width: 0.12 })))
  }),
  libraryAnimation({
    id: "chispas",
    label: "Chispas",
    description: "Destellos c\xE1lidos que aparecen al comp\xE1s",
    palette: ["#120704", "#ff8a1f", "#fff0a8"],
    tags: ["energ\xEDa", "destellos"],
    pressure: "spark",
    durationMillis: 8e3,
    render: compose(dark("#180704"), add(sparkles({ color: "#ffd27a", density: 0.13, speed: 9, size: 2 })), screen(sparkles({ color: "#ffffff", density: 0.03, speed: 5 })))
  }),
  libraryAnimation({
    id: "aurora",
    label: "Aurora",
    description: "Cortinas boreales fluidas y profundas",
    palette: ["#020617", "#42ffd2", "#5b8cff", "#e66cff"],
    tags: ["naturaleza", "suave"],
    category: "nature",
    durationMillis: 16e3,
    render: compose(dark("#071329"), screen(ribbons({ colors: ["#42ffd2", "#5b8cff", "#e66cff"], count: 5, speed: 0.55, bend: 0.18, width: 0.08 })), screen(sparkles({ density: 0.025, speed: 2 })))
  }),
  libraryAnimation({
    id: "vortice",
    label: "V\xF3rtice",
    description: "Espiral hipn\xF3tica que gira hacia el centro",
    palette: ["#080318", "#774dff", "#ff43cf", "#35d7ff"],
    tags: ["espiral", "intenso"],
    category: "energetic",
    durationMillis: 12e3,
    render: compose(dark("#080318"), screen(kaleidoscope({ colors: ["#15104d", "#774dff", "#ff43cf", "#35d7ff", "#080318"], segments: 7, speed: 1.2 })), add(rings({ colors: ["#000000", "#c6f8ff"], frequency: 11, speed: 1, width: 0.08 })))
  }),
  libraryAnimation({
    id: "radar",
    label: "Radar",
    description: "Barrido verde con ecos circulares",
    palette: ["#010806", "#25ff79", "#d7ffe8"],
    tags: ["tecnolog\xEDa", "barrido"],
    durationMillis: 1e4,
    render: compose(
      dark("#04150e"),
      add(rings({ colors: ["#062d1a", "#3cff8d"], frequency: 7, speed: 0.8, width: 0.06 })),
      screen(mask(
        gradient(["#03110b", "#76ffae"], { angle: 25, speed: 1 }),
        (context) => Math.max(0, Math.sin(Math.atan2(context.yn - 0.5, context.xn - 0.5) - context.progress * Math.PI * 2))
      ))
    )
  }),
  libraryAnimation({
    id: "oceano",
    label: "Oc\xE9ano",
    description: "Oleaje azul con crestas de espuma",
    palette: ["#020c1e", "#087ea4", "#35d7ff", "#e8fdff"],
    tags: ["agua", "calma"],
    category: "nature",
    durationMillis: 14e3,
    render: compose(gradient(["#020c1e", "#075985", "#0ea5e9"], { angle: 90 }), screen(wave({ colors: ["#0b77a6", "#e8fdff"], angle: 12, frequency: 5, speed: 1.2, softness: 0.22, alpha: 0.66 })))
  }),
  libraryAnimation({
    id: "portal",
    label: "Portal",
    description: "Anillos de energ\xEDa convergen en otra dimensi\xF3n",
    palette: ["#070216", "#6d39ff", "#ff48d7", "#ffffff"],
    tags: ["espacio", "anillos"],
    category: "energetic",
    durationMillis: 1e4,
    render: compose(dark("#0d0428"), screen(rings({ colors: ["#6d39ff", "#ff48d7", "#ffffff"], frequency: 14, speed: 4, width: 0.1 })), multiply(kaleidoscope({ colors: ["#ffffff", "#40188d", "#090115"], segments: 10, speed: 0.4 })))
  }),
  libraryAnimation({
    id: "lava",
    label: "Lava",
    description: "Magma vivo con grietas incandescentes",
    palette: ["#100100", "#8f1300", "#ff4d00", "#ffd36b"],
    tags: ["fuego", "org\xE1nico"],
    category: "nature",
    durationMillis: 18e3,
    render: plasma({ colors: ["#100100", "#4b0900", "#c92700", "#ff7500", "#ffd36b"], scale: 3.8, speed: 0.8 })
  }),
  libraryAnimation({
    id: "matriz",
    label: "Matriz",
    description: "Lluvia digital verde sobre la oscuridad",
    palette: ["#010703", "#00c853", "#92ffb1"],
    tags: ["digital", "retro"],
    category: "energetic",
    durationMillis: 8e3,
    render: compose(dark("#011208"), add(mask(sparkles({ color: "#92ffb1", density: 0.15, speed: 10, size: 0.7 }), (context) => 0.3 + positiveSine(context.y * 0.45 - context.timeSeconds * 8) * 0.7)), multiply(checker({ colors: ["#64ff91", "#053e1c"], size: 1, speed: 2 })))
  }),
  libraryAnimation({
    id: "estrellas",
    label: "Estrellas",
    description: "Cielo profundo con estrellas centelleantes",
    palette: ["#01020a", "#3449a7", "#dce7ff"],
    tags: ["espacio", "calma"],
    durationMillis: 12e3,
    render: compose(gradient(["#01020a", "#080c2c"], { angle: 90 }), screen(sparkles({ density: 0.12, speed: 3, rainbow: true })))
  }),
  libraryAnimation({
    id: "tormenta",
    label: "Tormenta",
    description: "Nubes el\xE9ctricas atravesadas por rel\xE1mpagos",
    palette: ["#02040d", "#27346f", "#a8c7ff", "#ffffff"],
    tags: ["clima", "dram\xE1tico"],
    category: "nature",
    durationMillis: 9e3,
    render: compose(plasma({ colors: ["#01030b", "#101938", "#293b70"], scale: 2, speed: 0.7 }), screen(mask(solid("#e9f3ff"), (context) => hash(Math.floor(context.timeSeconds * 3), context.seed) > 0.86 && Math.abs(context.xn - 0.5 - Math.sin(context.y * 1.7) * 0.18) < 0.08 ? 1 : 0)))
  }),
  libraryAnimation({
    id: "luciernagas",
    label: "Luci\xE9rnagas",
    description: "Luces doradas flotan en un bosque nocturno",
    palette: ["#010904", "#16421d", "#d8ff62"],
    tags: ["naturaleza", "calma"],
    category: "nature",
    durationMillis: 14e3,
    render: compose(gradient(["#010904", "#08200d"], { angle: 90 }), screen(mapShader(sparkles({ color: "#d8ff62", density: 0.07, speed: 2.2, size: 0.8 }), (pixel, context) => ({ ...pixel, a: (pixel.a ?? 1) * (0.5 + positiveSine(context.x * 0.43 + context.timeSeconds) * 0.5) }))))
  }),
  libraryAnimation({
    id: "cristales",
    label: "Cristales",
    description: "Facetas heladas reflejan luz de colores",
    palette: ["#061020", "#64d8ff", "#b78bff", "#ffffff"],
    tags: ["hielo", "geom\xE9trico"],
    durationMillis: 12e3,
    render: compose(kaleidoscope({ colors: ["#061020", "#1e70a1", "#64d8ff", "#b78bff", "#ffffff"], segments: 12, speed: 0.35 }), screen(sparkles({ density: 0.055, speed: 5 })))
  }),
  libraryAnimation({
    id: "neon-ribbons",
    label: "Cintas de ne\xF3n",
    description: "Nuevas cintas luminosas se entrelazan sobre cristal negro",
    palette: ["#02030b", "#00f0ff", "#ff2bd6", "#8dff5a"],
    tags: ["nuevo", "ne\xF3n", "fluido"],
    category: "energetic",
    durationMillis: 15e3,
    pressure: "glow",
    render: compose(dark("#050717"), screen(ribbons({ colors: ["#00f0ff", "#ff2bd6", "#8dff5a"], count: 7, speed: 0.8, bend: 0.24, width: 0.06 })), screen(ribbons({ colors: ["#ff2bd6", "#8dff5a", "#00f0ff"], count: 5, speed: -0.45, bend: 0.15, width: 0.09 })))
  }),
  libraryAnimation({
    id: "prism-tunnel",
    label: "T\xFAnel prisma",
    description: "Un t\xFAnel caleidosc\xF3pico de profundidad infinita",
    palette: ["#020108", "#4a2fff", "#ff3dba", "#ffe85c", "#5cffda"],
    tags: ["nuevo", "prisma", "intenso"],
    category: "energetic",
    durationMillis: 11e3,
    render: compose(kaleidoscope({ colors: ["#09021c", "#4a2fff", "#ff3dba", "#ffe85c", "#5cffda", "#09021c"], segments: 14, speed: 1.4 }), multiply(rings({ colors: ["#17203d", "#ffffff"], frequency: 18, speed: 3, width: 0.07 })))
  }),
  libraryAnimation({
    id: "bioluminescence",
    label: "Bioluminiscencia",
    description: "Organismos marinos respiran luz turquesa y violeta",
    palette: ["#01070d", "#064f65", "#20f4d1", "#ae63ff"],
    tags: ["nuevo", "mar", "org\xE1nico"],
    category: "nature",
    durationMillis: 18e3,
    render: compose(plasma({ colors: ["#01070d", "#042b3b", "#087c83", "#20f4d1"], scale: 2.2, speed: 0.45 }), screen(rings({ colors: ["#061024", "#ae63ff"], center: [0.25, 0.66], frequency: 5, speed: 0.7, width: 0.2 })), screen(sparkles({ color: "#a4fff0", density: 0.045, speed: 1.8 })))
  }),
  libraryAnimation({
    id: "disco-tiles",
    label: "Pista disco",
    description: "Baldosas de club cambian de color con un pulso elegante",
    palette: ["#090013", "#ff3196", "#7a5cff", "#25e6ff", "#ffe14d"],
    tags: ["nuevo", "baile", "retro"],
    category: "energetic",
    durationMillis: 8e3,
    pressure: "spark",
    render: mapShader(checker({ colors: ["#ff3196", "#25e6ff"], size: 2, speed: 2 }), (pixel, context) => {
      const hue = hash(Math.floor(context.x / 2), Math.floor(context.y / 2), Math.floor(context.timeSeconds * 2));
      const pulse = 0.45 + positiveSine(context.timeSeconds * 5 + context.x + context.y) * 0.55;
      return { ...mixRgb(pixel, hsv(hue, 0.82, pulse), 0.76), a: 1 };
    })
  }),
  libraryAnimation({
    id: "solar-flare",
    label: "Llamarada solar",
    description: "Filamentos de plasma dorado estallan desde el n\xFAcleo",
    palette: ["#130100", "#9d1900", "#ff6b00", "#fff08a"],
    tags: ["nuevo", "sol", "energ\xEDa"],
    category: "energetic",
    durationMillis: 13e3,
    pressure: "spark",
    render: compose(plasma({ colors: ["#130100", "#6f0c00", "#ff5200", "#ffc92f"], scale: 4.5, speed: 1.1 }), add(rings({ colors: ["#ff5c00", "#fff08a"], center: [0.5, 0.5], frequency: 9, speed: 3, width: 0.09 })), screen(sparkles({ color: "#fff5ba", density: 0.06, speed: 8 })))
  }),
  libraryAnimation({
    id: "victory-pulse",
    label: "Victoria \xB7 Pulso",
    description: "Celebraci\xF3n radial con energ\xEDa azul y dorada",
    palette: ["#061235", "#35d7ff", "#ffe176", "#ffffff"],
    tags: ["victoria", "celebraci\xF3n"],
    category: "celebration",
    durationMillis: 5e3,
    pressure: "spark",
    render: compose(dark("#081b49"), add(rings({ colors: ["#35d7ff", "#ffe176", "#ffffff"], frequency: 10, speed: 5, width: 0.09 })), screen(sparkles({ color: "#ffffff", density: 0.08, speed: 8 })))
  }),
  libraryAnimation({
    id: "victory-confetti",
    label: "Victoria \xB7 Confeti",
    description: "Confeti multicolor cae sobre la pista",
    palette: ["#110329", "#ff4278", "#ffd84a", "#57f7a6", "#4bd8ff"],
    tags: ["victoria", "confeti"],
    category: "celebration",
    durationMillis: 5e3,
    pressure: "spark",
    render: compose(dark("#110329"), screen(sparkles({ density: 0.28, speed: 10, rainbow: true, size: 0.8 })), add(wave({ colors: ["#ff4278", "#ffd84a", "#57f7a6", "#4bd8ff"], angle: 90, frequency: 12, speed: 5, softness: 0.12, alpha: 0.32 })))
  }),
  libraryAnimation({
    id: "victory-wave",
    label: "Victoria \xB7 Ola",
    description: "Olas luminosas ba\xF1an el suelo al ganar",
    palette: ["#031329", "#168bff", "#35d7ff", "#ffffff"],
    tags: ["victoria", "ola"],
    category: "celebration",
    durationMillis: 5e3,
    render: compose(dark("#031329"), screen(wave({ colors: ["#168bff", "#35d7ff", "#ffffff"], angle: 32, frequency: 6, speed: 4, softness: 0.18 })), screen(wave({ colors: ["#6437ff", "#ffffff"], angle: -25, frequency: 7, speed: -3, softness: 0.14, alpha: 0.55 })))
  }),
  libraryAnimation({
    id: "victory-spark",
    label: "Victoria \xB7 Destellos",
    description: "Fogonazos dorados celebran el resultado",
    palette: ["#150800", "#ff9d1f", "#fff28c", "#ffffff"],
    tags: ["victoria", "destellos"],
    category: "celebration",
    durationMillis: 5e3,
    pressure: "spark",
    render: compose(dark("#150800"), add(sparkles({ color: "#fff28c", density: 0.24, speed: 12, size: 1.2 })), screen(rings({ colors: ["#ff8a00", "#ffffff"], frequency: 9, speed: 4, width: 0.07 })))
  })
];
var animationLibrary = Object.freeze([...definitions].sort((left, right) => left.label.localeCompare(right.label, "es")));
var animationLibraryById = new Map(animationLibrary.map((animation) => [animation.id, animation]));
function findAnimation(id) {
  return animationLibraryById.get(String(id ?? "").trim().toLowerCase()) ?? animationLibraryById.get("aurora");
}
function positiveSine(value) {
  return 0.5 + Math.sin(value) * 0.5;
}
function mixRgb(left, right, amount) {
  return { r: mix(left.r, right.r, amount), g: mix(left.g, right.g, amount), b: mix(left.b, right.b, amount) };
}

// packages/animation-runtime/src/media.ts
var animationPreviewRecipe = Object.freeze({
  seed: 137,
  captureStartMillis: 800,
  frameCount: 24,
  frameIntervalMillis: 100,
  stillFrameIndex: 4,
  pressure: Object.freeze({ x: 8, y: 16, startedAtMillis: 1200 })
});

// games/animations/src/manifest.ts
var animationOption = {
  key: "animation",
  label: "Animaci\xF3n",
  description: "Animaci\xF3n nativa que se muestra cuando el modo es individual",
  playerFacing: true,
  type: "enum",
  default: "aurora",
  options: animationLibrary.map((animation) => ({ value: animation.id, label: animation.label }))
};
var modeOption = {
  key: "mode",
  label: "Modo",
  description: "Muestra una animaci\xF3n o recorre autom\xE1ticamente toda la biblioteca",
  playerFacing: true,
  type: "enum",
  default: "single",
  options: [
    { value: "single", label: "Individual" },
    { value: "rotation", label: "Rotaci\xF3n" }
  ]
};
var speedOption = {
  key: "speed",
  label: "Velocidad",
  description: "Multiplicador de velocidad de la animaci\xF3n",
  playerFacing: false,
  type: "float",
  default: 1,
  min: 0.25,
  max: 3,
  step: 0.05
};
var rotationSecondsOption = {
  key: "rotationSeconds",
  label: "Rotaci\xF3n",
  description: "Segundos que permanece cada animaci\xF3n en el salvapantallas",
  playerFacing: false,
  type: "int",
  default: 20,
  min: 5,
  max: 120,
  step: 5
};
var manifest2 = {
  id: "a861f0dc-3e2e-4fe9-b487-33194af75b68",
  slug: "animations",
  aliases: ["animations", "salvapantallas", "ambient-animations"],
  label: "Animaciones",
  description: "Biblioteca de animaciones ambientales nativas y reactivas para la pista.",
  availability: { development: true, production: true },
  catalog: {
    category: "arcade",
    color: "#42ffd2",
    durationLabel: "Continuo",
    modeLabel: "Ambiental",
    audioLabel: "Efectos opcionales",
    rules: [
      "Elige una animaci\xF3n o activa la rotaci\xF3n autom\xE1tica",
      "Pisa la pista para crear ondas y destellos",
      "Las animaciones se repiten sin cortes"
    ]
  },
  players: { allowAny: true, min: 1, max: 8 },
  start: { mode: "immediate" },
  config: {
    difficulty: { default: "medium", options: ["medium"] },
    vars: [modeOption, animationOption, speedOption, rotationSecondsOption]
  },
  defaultDurationMillis: 0,
  display: { entry: "./display" },
  preview: {
    seed: 137,
    playerCount: 0,
    difficulty: "medium",
    options: { mode: "single", animation: "neon-ribbons", speed: 1, rotationSeconds: 20 },
    actions: [
      { atMillis: 1200, type: "press", x: 8, y: 16 },
      { atMillis: 1350, type: "release", x: 8, y: 16 }
    ],
    captureStartMillis: 800,
    frameCount: 24,
    frameIntervalMillis: 100
  },
  tags: ["ambiental", "salvapantallas", "animaciones", "typescript"]
};

// games/animations/src/game.ts
var pressureLifetimeMillis = 900;
function createGame2(config) {
  return new AnimationGame(config);
}
var AnimationGame = class {
  config;
  lastEvent;
  nowMillis;
  pressure = /* @__PURE__ */ new Map();
  startedAtMillis;
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest2);
    this.nowMillis = this.config.nowMillis;
    this.startedAtMillis = this.config.nowMillis;
    this.lastEvent = gameEvent("ambient", "Animaci\xF3n preparada", this.nowMillis);
  }
  init(nowMillis) {
    this.nowMillis = nowMillis;
    this.startedAtMillis = nowMillis;
    this.pressure.clear();
    this.lastEvent = gameEvent("ambient", `${this.currentAnimation().label} en la pista`, nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    if (!event.pressed) return [];
    this.pressure.set(`${event.x}:${event.y}`, { x: event.x, y: event.y, startedAtMillis: event.atMillis });
    this.lastEvent = gameEvent("effect", "La pista responde a tu paso", event.atMillis);
    return [this.lastEvent];
  }
  release(event) {
    this.nowMillis = event.atMillis;
    return [];
  }
  tick(event) {
    const previousId = this.currentAnimation().id;
    this.nowMillis = event.atMillis;
    for (const [key, point] of this.pressure) {
      if (event.atMillis - point.startedAtMillis > pressureLifetimeMillis) this.pressure.delete(key);
    }
    const current = this.currentAnimation();
    if (current.id !== previousId) {
      this.lastEvent = gameEvent("change", `${current.label} entra en escena`, event.atMillis);
      return [this.lastEvent];
    }
    return [];
  }
  render() {
    const speed = readGameConfigOption(this.config.options, speedOption);
    return renderAnimationFrame(this.currentAnimation(), {
      atMillis: (this.nowMillis - this.startedAtMillis) * speed,
      seed: this.config.seed,
      pressure: [...this.pressure.values()].map((point) => ({ ...point, startedAtMillis: (point.startedAtMillis - this.startedAtMillis) * speed }))
    });
  }
  snapshot() {
    const animation = this.currentAnimation();
    const rotation = this.rotation();
    const rotationIndex = Math.max(0, rotation.findIndex((entry) => entry.id === animation.id));
    return {
      currentGame: manifest2.id,
      label: manifest2.label,
      phase: "running",
      playerCount: this.config.playerCount,
      players: [],
      score: 0,
      lives: -1,
      elapsedMillis: Math.max(0, this.nowMillis - this.startedAtMillis),
      remainingMillis: 0,
      activeTargets: this.pressure.size,
      success: false,
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      animationId: animation.id,
      animationLabel: animation.label,
      category: animation.category,
      contentRevision: this.content().contentRevision,
      librarySize: animationLibrary.length,
      palette: animation.palette,
      rotationIndex,
      rotationSize: rotation.length
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest2);
    this.init(config.nowMillis ?? this.nowMillis);
  }
  currentAnimation() {
    const mode = readGameConfigOption(this.config.options, modeOption);
    const content = this.content();
    if (mode !== "rotation") return findAnimation(content.selectedAnimationId ?? readGameConfigOption(this.config.options, animationOption));
    const rotation = this.rotation();
    const seconds = content.rotationSeconds ?? readGameConfigOption(this.config.options, rotationSecondsOption);
    const index = Math.floor(Math.max(0, this.nowMillis - this.startedAtMillis) / (seconds * 1e3)) % rotation.length;
    return rotation[index] ?? findAnimation("aurora");
  }
  rotation() {
    const ids = this.content().rotationIds;
    const selected = ids.map((id) => findAnimation(id)).filter((animation, index, all) => all.findIndex((candidate) => candidate.id === animation.id) === index);
    return selected.length ? selected : [...animationLibrary];
  }
  content() {
    return normalizeAnimationRuntimeContent(this.config.content) ?? {
      schema: animationContentSchema,
      contentRevision: "builtin",
      rotationIds: []
    };
  }
};

// games/animations/src/fixtures.ts
var game = createGame2({ seed: 137, playerCount: 0, options: { animation: "neon-ribbons", mode: "single", speed: 1, rotationSeconds: 20 } });
game.init(0);
game.tick({ atMillis: 2400 });
var runningFrame2 = game.render();
var runningSnapshot2 = game.snapshot();

// games/cruce-galactico/src/index.ts
var src_exports3 = {};
__export(src_exports3, {
  PlayerDisplay: () => PlayerDisplay3,
  checkpointTarget: () => checkpointTarget,
  createGame: () => createGame3,
  damageImmunityMillis: () => damageImmunityMillis,
  gameWinAnimationMillis: () => gameWinAnimationMillis,
  manifest: () => manifest3,
  startingLives: () => startingLives2
});

// games/cruce-galactico/src/display.tsx
var import_jsx_runtime5 = __toESM(require_jsx_runtime(), 1);
function PlayerDisplay3({ snapshot, frame }) {
  const message = snapshot.phase === "finished" ? snapshot.success ? "\xA1Portal alcanzado!" : "La misi\xF3n ha terminado" : snapshot.lastEventMessage || "Avanza hacia el control verde";
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(GameDisplayShell, { title: snapshot.label, phase: snapshot.phase, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: `ml-solo-display cruce-galactico-display${snapshot.celebrating ? " is-celebrating" : ""}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(PlayerReadyOverlay, { snapshot }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "ml-solo-summary", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(MetricRow, { columns: 3, className: "ml-solo-number-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(MetricPanel, { label: "Controles", tone: "green", value: `${snapshot.checkpoint}/${snapshot.checkpointTarget}` }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(MetricPanel, { label: "Vidas", tone: "neutral", value: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(LivesMeter, { lives: snapshot.lives, maxLives: snapshot.maxLives }) }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(MetricPanel, { label: "Tiempo", tone: "cyan", value: formatClock(snapshot.remainingMillis) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(MetricPanel, { className: "ml-solo-message", label: "Misi\xF3n", tone: snapshot.success ? "green" : snapshot.lives === 0 ? "red" : "blue", value: message })
    ] }),
    frame ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(FramePreviewPanel, { className: "ml-solo-floor", frame, label: "Corredores en el suelo" }) : null
  ] }) });
}

// games/cruce-galactico/src/manifest.ts
var manifest3 = {
  id: "cruce-galactico",
  label: "Cruce Gal\xE1ctico",
  description: "Cruza cuatro corredores c\xF3smicos, esquiva el tr\xE1fico espacial y alcanza el portal de salida.",
  availability: { development: true, production: true },
  catalog: {
    category: "individual",
    color: "#7c5cff",
    durationLabel: "75 s",
    modeLabel: "Cruce espacial",
    audioLabel: "M\xFAsica + efectos",
    rules: [
      "Empieza en la plataforma azul",
      "Cruza cada corredor evitando los obst\xE1culos rojos",
      "Alcanza los cuatro controles antes de que termine el tiempo"
    ]
  },
  players: { allowAny: true, min: 1, max: 4 },
  start: { mode: "player-ready", releaseGraceMillis: 1500 },
  config: { difficulty: { default: "medium", options: ["easy", "medium", "hard", "expert"] } },
  defaultDurationMillis: 75e3,
  display: { entry: "./display" },
  preview: {
    seed: 137,
    playerCount: 0,
    difficulty: "medium",
    actions: [
      { atMillis: 100, type: "press", x: 8, y: 30 },
      { atMillis: 2150, type: "release", x: 8, y: 30 },
      { atMillis: 2500, type: "press", x: 8, y: 22 }
    ],
    captureStartMillis: 2300,
    frameCount: 24,
    frameIntervalMillis: 120
  },
  tags: ["arcade", "crossing", "survival", "typescript"]
};

// games/cruce-galactico/src/game.ts
var startingLives2 = 3;
var checkpointTarget = 4;
var gameWinAnimationMillis = 3e3;
var damageImmunityMillis = 1500;
var backgroundColor2 = "#02030b";
var laneColor = "#090d20";
var checkpointColor = "#26d9ff";
var nextCheckpointColor = "#66ff9a";
var hazardColor = "#ff365c";
var hazardCoreColor = "#fff0a6";
var playerColor = "#ffffff";
var winColors = ["#7c5cff", "#26d9ff", "#66ff9a", "#ffffff"];
var startZone = { minX: 4, maxX: 11, minY: 29, maxY: 31 };
var checkpointBands = [
  { minY: 22, maxY: 23 },
  { minY: 15, maxY: 16 },
  { minY: 8, maxY: 9 },
  { minY: 0, maxY: 2 }
];
var lanes = [
  { minY: 24, maxY: 28, direction: 1, offset: 0 },
  { minY: 17, maxY: 21, direction: -1, offset: 4 },
  { minY: 10, maxY: 14, direction: 1, offset: 8 },
  { minY: 3, maxY: 7, direction: -1, offset: 2 }
];
var difficultyStepMillis = { easy: 620, medium: 480, hard: 360, expert: 270 };
function createGame3(config) {
  return new GalacticCrossingGame(config);
}
var GalacticCrossingGame = class {
  checkpoint = 0;
  config;
  finishedAtMillis;
  lastDamageAtMillis = Number.NEGATIVE_INFINITY;
  lastEvent = gameEvent("none", "Listo para despegar", 0);
  lives = startingLives2;
  nowMillis = 0;
  occupiedTiles = /* @__PURE__ */ new Set();
  phase = "ready";
  players = [];
  readyGate;
  startedAtMillis = 0;
  success = false;
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest3);
    this.readyGate = createPlayerReadyGate(manifest3.start, [startZone], this.config.nowMillis);
    this.resetState(this.config.nowMillis);
  }
  init(nowMillis) {
    this.resetState(nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    this.updateOccupied(event.x, event.y, event.pressed);
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.update(event), event.atMillis);
    }
    if (this.phase !== "running" || !event.pressed) return [];
    const band = checkpointBands[this.checkpoint];
    if (!band || event.y < band.minY || event.y > band.maxY) return [];
    this.checkpoint += 1;
    this.players = this.scoredPlayers();
    if (this.checkpoint === checkpointTarget) {
      return [this.finish(true, "Portal alcanzado", event.atMillis)];
    }
    this.lastEvent = gameEvent("hit", `Control ${this.checkpoint} activado`, event.atMillis);
    return [this.lastEvent];
  }
  release(event) {
    this.nowMillis = event.atMillis;
    this.updateOccupied(event.x, event.y, false);
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
    if (this.phase !== "running") return [];
    if (this.remainingMillis() === 0) return [this.finish(false, "Tiempo agotado", event.atMillis)];
    if (event.atMillis - this.lastDamageAtMillis < damageImmunityMillis || !this.playerTouchesHazard()) return [];
    this.lastDamageAtMillis = event.atMillis;
    this.lives = Math.max(0, this.lives - 1);
    this.players = this.scoredPlayers();
    if (this.lives === 0) return [this.finish(false, "Nave destruida", event.atMillis)];
    this.lastEvent = gameEvent("miss", `Impacto: quedan ${this.lives} vidas`, event.atMillis);
    return [this.lastEvent];
  }
  render() {
    const frame = createFrame(backgroundColor2);
    for (const lane of lanes) fillFrameRect(frame, 0, lane.minY, FLOOR_COLS, lane.maxY - lane.minY + 1, laneColor);
    if (this.phase === "waiting" || this.phase === "starting") {
      const step = Math.floor(this.nowMillis / (this.phase === "starting" ? 100 : 180));
      paintDiamondRing(frame, {
        centerX: 8,
        centerY: 30,
        radius: 1 + step % 6,
        color: this.phase === "starting" ? "#ffe176" : checkpointColor
      });
      return frame;
    }
    if (this.phase === "finished") {
      if (this.success) {
        const step = Math.floor((this.nowMillis - (this.finishedAtMillis ?? this.nowMillis)) / 120);
        paintDiamondWave(frame, {
          color: ({ distance }) => winColors[(distance + step) % winColors.length] ?? winColors[0],
          step
        });
      } else {
        const pulse = Math.floor((this.nowMillis - (this.finishedAtMillis ?? this.nowMillis)) / 180) % 2;
        fillFrameRect(frame, 0, 0, FLOOR_COLS, FLOOR_ROWS, pulse === 0 ? "#5b0717" : "#18030a");
      }
      return frame;
    }
    checkpointBands.forEach((band, index) => {
      const color = index < this.checkpoint ? checkpointColor : index === this.checkpoint ? nextCheckpointColor : "#15233d";
      fillFrameRect(frame, 0, band.minY, FLOOR_COLS, band.maxY - band.minY + 1, color);
    });
    for (const hazard of this.currentHazards()) {
      fillFrameRect(frame, hazard.x, hazard.y, hazard.width, hazard.height, hazardColor);
      paintFrameCell(frame, hazard.x + 1, hazard.y + 1, hazardCoreColor);
    }
    for (const tile of this.occupiedTiles) {
      const [x, y] = parseTile(tile);
      paintFrameCell(frame, x, y, playerColor);
    }
    return frame;
  }
  snapshot() {
    const ready = this.readyGate.state(this.nowMillis);
    const celebrationMillis = this.phase === "finished" && this.success ? Math.min(gameWinAnimationMillis, Math.max(0, this.nowMillis - (this.finishedAtMillis ?? this.nowMillis))) : 0;
    return {
      currentGame: manifest3.id,
      label: manifest3.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: this.players,
      score: this.checkpoint,
      lives: this.lives,
      maxLives: startingLives2,
      elapsedMillis: this.elapsedMillis(),
      remainingMillis: this.remainingMillis(),
      activeTargets: this.phase === "running" ? 1 : 0,
      success: this.success,
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? ready.countdownMillis : 0,
      readyPlayers: ready.readyPlayers,
      requiredPlayers: ready.requiredPlayers,
      matchTarget: checkpointTarget,
      checkpoint: this.checkpoint,
      checkpointTarget,
      hazards: this.phase === "running" ? this.currentHazards() : [],
      celebrating: this.success && celebrationMillis < gameWinAnimationMillis,
      celebrationMillis
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest3);
    this.resetState(this.config.nowMillis);
  }
  applyReadyTransition(transition, nowMillis) {
    if (transition === "players-ready") {
      this.phase = "starting";
      this.lastEvent = gameEvent("ready", "Tripulaci\xF3n lista", nowMillis);
    } else if (transition === "players-left") {
      this.phase = "waiting";
      this.lastEvent = gameEvent("ready", "Vuelve a la plataforma azul", nowMillis);
    } else if (transition === "started") {
      this.phase = "running";
      this.startedAtMillis = nowMillis;
      this.lastEvent = gameEvent("start", "Avanza hacia el control verde", nowMillis);
    } else return [];
    return [this.lastEvent];
  }
  currentHazards() {
    const stepMillis = difficultyStepMillis[this.config.difficulty] ?? difficultyStepMillis.medium;
    const step = Math.floor(Math.max(0, this.nowMillis - this.startedAtMillis) / stepMillis);
    return lanes.flatMap((lane, laneIndex) => [0, 7, 14].map((gap) => {
      const raw = lane.offset + gap + step * lane.direction;
      const x = (raw % 20 + 20) % 20 - 3;
      return { x, y: lane.minY + laneIndex % 2, width: 3, height: 3 };
    })).filter((hazard) => hazard.x < FLOOR_COLS && hazard.x + hazard.width > 0);
  }
  elapsedMillis() {
    if (this.phase === "waiting" || this.phase === "starting" || this.phase === "ready") return 0;
    return Math.max(0, (this.finishedAtMillis ?? this.nowMillis) - this.startedAtMillis);
  }
  finish(success, message, atMillis) {
    this.phase = "finished";
    this.success = success;
    this.finishedAtMillis = atMillis;
    this.lastEvent = gameEvent(success ? "win" : "fail", message, atMillis);
    return this.lastEvent;
  }
  playerTouchesHazard() {
    const hazards = this.currentHazards();
    for (const tile of this.occupiedTiles) {
      const [x, y] = parseTile(tile);
      if (hazards.some((hazard) => x >= hazard.x && x < hazard.x + hazard.width && y >= hazard.y && y < hazard.y + hazard.height)) return true;
    }
    return false;
  }
  remainingMillis() {
    return Math.max(0, this.config.durationMillis - this.elapsedMillis());
  }
  resetState(nowMillis) {
    this.readyGate.reset(nowMillis);
    this.checkpoint = 0;
    this.finishedAtMillis = void 0;
    this.lastDamageAtMillis = Number.NEGATIVE_INFINITY;
    this.lastEvent = gameEvent("ready", "Espera en la plataforma azul", nowMillis);
    this.lives = startingLives2;
    this.nowMillis = nowMillis;
    this.occupiedTiles.clear();
    this.phase = "waiting";
    this.players = this.scoredPlayers();
    this.startedAtMillis = nowMillis;
    this.success = false;
  }
  scoredPlayers() {
    return defaultPlayers(this.config.playerCount, this.config.players).map((player) => ({
      ...player,
      score: this.checkpoint,
      lives: this.lives
    }));
  }
  updateOccupied(x, y, pressed) {
    if (x < 0 || x >= FLOOR_COLS || y < 0 || y >= FLOOR_ROWS) return;
    const key = `${x},${y}`;
    if (pressed) this.occupiedTiles.add(key);
    else this.occupiedTiles.delete(key);
  }
};
function parseTile(tile) {
  const [x = "0", y = "0"] = tile.split(",");
  return [Number(x), Number(y)];
}

// games/duelo/src/index.ts
var src_exports4 = {};
__export(src_exports4, {
  PlayerDisplay: () => PlayerDisplay4,
  createDueloSessionController: () => createDueloSessionController,
  createGame: () => createGame4,
  createSessionController: () => createSessionController,
  crowdedRunningFrame: () => crowdedRunningFrame,
  crowdedRunningSnapshot: () => crowdedRunningSnapshot,
  dueloConfigVars: () => dueloConfigVars,
  dueloPlayerPalette: () => dueloPlayerPalette,
  dueloReadyZones: () => dueloReadyZones,
  finishedFrame: () => finishedFrame2,
  finishedSnapshot: () => finishedSnapshot2,
  manifest: () => manifest4,
  runningFrame: () => runningFrame3,
  runningSnapshot: () => runningSnapshot3,
  startingFrame: () => startingFrame,
  startingSnapshot: () => startingSnapshot,
  waitingFrame: () => waitingFrame,
  waitingSnapshot: () => waitingSnapshot,
  winAnimationMillis: () => winAnimationMillis
});

// games/duelo/src/display.tsx
var import_jsx_runtime6 = __toESM(require_jsx_runtime(), 1);
function PlayerDisplay4({
  snapshot
}) {
  const columns = snapshot.playerCount <= 4 ? 2 : snapshot.playerCount <= 6 ? 3 : 4;
  const countdown = Math.max(1, Math.ceil(snapshot.countdownMillis / 1e3));
  const restartCountdown = Math.max(1, Math.ceil(snapshot.remainingMillis / 1e3));
  const readyIndices = new Set(snapshot.readyPlayerIndices);
  const hero = heroContent(snapshot, countdown, restartCountdown);
  const rootStyle = {
    "--duelo-grid-columns": columns,
    "--duelo-player-count": snapshot.playerCount,
    "--duelo-winner": snapshot.winnerIndex >= 0 ? snapshot.playerProgress[snapshot.winnerIndex]?.color ?? "#ffffff" : "#ffffff",
    "--duelo-winner-rgb": snapshot.winnerIndex >= 0 ? hexToRgb2(snapshot.playerProgress[snapshot.winnerIndex]?.color ?? "#ffffff") : "255, 255, 255"
  };
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(GameDisplayShell, { title: snapshot.label, phase: snapshot.phase, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
    "div",
    {
      className: `duelo-display is-phase-${snapshot.phase} is-player-count-${snapshot.playerCount}`,
      style: rootStyle,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("section", { className: "duelo-hero", "aria-label": hero.title, children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "duelo-hero-copy", children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: hero.eyebrow }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("strong", { children: hero.title }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("b", { children: hero.caption })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "duelo-hero-metrics", children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(DueloMetric, { label: "Tiempo", value: formatClock(snapshot.elapsedMillis) }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(DueloMetric, { label: "Restantes", value: snapshot.remainingTargets }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(DueloMetric, { label: "Densidad", value: `${snapshot.fillPercent}%` })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("section", { className: "duelo-player-grid", "aria-label": "Progreso de jugadores", children: snapshot.playerProgress.map((player) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          DueloPlayerCard,
          {
            leader: snapshot.leaderIndex === player.index,
            phase: snapshot.phase,
            player,
            ready: readyIndices.has(player.index),
            recent: snapshot.recentClaim?.playerIndex === player.index,
            winner: snapshot.winnerIndex === player.index
          },
          player.index
        )) }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("footer", { className: "duelo-event-rail", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: snapshot.phase === "waiting" ? "Preparaci\xF3n" : snapshot.phase === "finished" ? "Resultado" : "\xDAltimo evento" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("strong", { children: snapshot.lastEventMessage || "Listo" }, snapshot.motionEventId),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("b", { children: snapshot.phase === "finished" ? `Nueva partida en ${restartCountdown}` : `${snapshot.claimedTargets}/${snapshot.totalTargets} reclamadas` })
        ] })
      ]
    }
  ) });
}
function DueloPlayerCard({
  leader,
  phase,
  player,
  ready,
  recent,
  winner
}) {
  const status = phase === "waiting" ? ready ? "Listo" : "Entra en tu zona" : phase === "starting" ? "Preparado" : winner ? "Ganador" : leader ? "L\xEDder" : "En carrera";
  const style = {
    "--duelo-player": player.color,
    "--duelo-player-rgb": hexToRgb2(player.color),
    "--duelo-progress": player.progress
  };
  const nameClass = player.label.length > 28 ? " is-extra-long" : player.label.length > 18 ? " is-long" : "";
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
    "article",
    {
      className: [
        "duelo-player-card",
        ready ? "is-ready" : "",
        leader ? "is-leader" : "",
        recent ? "is-recent" : "",
        winner ? "is-winner" : ""
      ].filter(Boolean).join(" "),
      style,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("header", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("i", { "aria-hidden": "true" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: `duelo-player-name${nameClass}`, children: player.label }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("b", { children: status })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "duelo-player-score", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("strong", { children: player.remaining }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: "baldosas restantes" }),
          recent ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("em", { children: "+1" }, `${player.index}-${player.claimed}`) : null
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "duelo-player-track", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("i", {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("footer", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: "Reclamadas" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("strong", { children: [
            player.claimed,
            "/",
            player.target
          ] })
        ] })
      ]
    }
  );
}
function DueloMetric({ label, value }) {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("article", { className: "duelo-hero-metric", children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("strong", { children: value })
  ] });
}
function heroContent(snapshot, countdown, restartCountdown) {
  if (snapshot.phase === "waiting") {
    return {
      eyebrow: `Listos ${snapshot.readyPlayers}/${snapshot.requiredPlayers}`,
      title: "Busca tu color",
      caption: "Cada jugador entra y permanece en su zona iluminada"
    };
  }
  if (snapshot.phase === "starting") {
    return {
      eyebrow: "Todos listos",
      title: String(countdown),
      caption: "El duelo est\xE1 a punto de empezar"
    };
  }
  if (snapshot.phase === "finished") {
    return {
      eyebrow: "Victoria",
      title: `\xA1Gana ${snapshot.winnerLabel}!`,
      caption: `Nueva partida en ${restartCountdown}`
    };
  }
  return {
    eyebrow: snapshot.leaderIndex >= 0 ? `Lidera ${snapshot.leaderLabel}` : "Empate",
    title: "Reclama tu color",
    caption: "Pisa todas tus baldosas antes que los dem\xE1s"
  };
}
function hexToRgb2(color) {
  if (!/^#[0-9a-f]{6}$/i.test(color)) return "255, 255, 255";
  return [1, 3, 5].map((offset) => Number.parseInt(color.slice(offset, offset + 2), 16)).join(", ");
}

// packages/agent-runtime/src/contracts.ts
var AGENT_CONTRACT_VERSION = 1;
function createAgentAction(action) {
  return immutableAgentData({ version: AGENT_CONTRACT_VERSION, ...action });
}
function createAgentObservation(observation) {
  return immutableAgentData({ version: AGENT_CONTRACT_VERSION, ...observation });
}
function createAgentDefinition(definition) {
  if (definition.id.length === 0 || definition.brainId.length === 0 || definition.profileId.length === 0) {
    throw new Error("Agent definition ids must not be empty");
  }
  return immutableAgentData({ version: AGENT_CONTRACT_VERSION, ...definition });
}
function createAgentSnapshot(snapshot) {
  return immutableAgentData({ version: AGENT_CONTRACT_VERSION, ...snapshot });
}
function assertAgentContractVersion(contract) {
  if (contract.version !== AGENT_CONTRACT_VERSION) {
    throw new Error(
      `Unsupported agent contract version ${contract.version}; expected ${AGENT_CONTRACT_VERSION}`
    );
  }
}
function immutableAgentData(value) {
  return immutableCopy(value, /* @__PURE__ */ new WeakMap());
}
function immutableCopy(value, seen) {
  if (typeof value !== "object" && typeof value !== "function" || value === null) {
    return value;
  }
  if (typeof value === "function") {
    return value;
  }
  const object = value;
  const existing = seen.get(object);
  if (existing !== void 0) {
    return existing;
  }
  if (Array.isArray(value)) {
    const copy2 = [];
    seen.set(object, copy2);
    for (const entry of value) copy2.push(immutableCopy(entry, seen));
    return Object.freeze(copy2);
  }
  if (value instanceof Map) {
    const copy2 = /* @__PURE__ */ new Map();
    const readonly = readonlyCollectionProxy(copy2, ["clear", "delete", "set"]);
    seen.set(object, readonly);
    for (const [key, entry] of value) {
      copy2.set(immutableCopy(key, seen), immutableCopy(entry, seen));
    }
    Object.freeze(copy2);
    return readonly;
  }
  if (value instanceof Set) {
    const copy2 = /* @__PURE__ */ new Set();
    const readonly = readonlyCollectionProxy(copy2, ["add", "clear", "delete"]);
    seen.set(object, readonly);
    for (const entry of value) copy2.add(immutableCopy(entry, seen));
    Object.freeze(copy2);
    return readonly;
  }
  if (value instanceof Date) {
    const copy2 = new Date(value.getTime());
    seen.set(object, copy2);
    return Object.freeze(copy2);
  }
  if (value instanceof RegExp) {
    const copy2 = new RegExp(value.source, value.flags);
    copy2.lastIndex = value.lastIndex;
    seen.set(object, copy2);
    return Object.freeze(copy2);
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) {
    return value;
  }
  const copy = Object.create(prototype);
  seen.set(object, copy);
  for (const key of Reflect.ownKeys(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (descriptor === void 0) continue;
    if ("value" in descriptor) descriptor.value = immutableCopy(descriptor.value, seen);
    Object.defineProperty(copy, key, descriptor);
  }
  return Object.freeze(copy);
}
function readonlyCollectionProxy(collection, mutators) {
  const blocked = new Set(mutators);
  const proxy = new Proxy(collection, {
    get(target3, property) {
      if (blocked.has(property)) {
        return () => {
          throw new TypeError("Agent contract collections are immutable");
        };
      }
      const member = Reflect.get(target3, property, target3);
      return typeof member === "function" ? member.bind(target3) : member;
    },
    set() {
      throw new TypeError("Agent contract collections are immutable");
    },
    deleteProperty() {
      throw new TypeError("Agent contract collections are immutable");
    },
    defineProperty() {
      throw new TypeError("Agent contract collections are immutable");
    }
  });
  return proxy;
}

// packages/agent-runtime/src/grid.ts
var ORTHOGONAL_OFFSETS = Object.freeze([
  Object.freeze({ x: 0, y: -1 }),
  Object.freeze({ x: -1, y: 0 }),
  Object.freeze({ x: 1, y: 0 }),
  Object.freeze({ x: 0, y: 1 })
]);
var DIAGONAL_OFFSETS = Object.freeze([
  Object.freeze({ x: -1, y: -1 }),
  Object.freeze({ x: 1, y: -1 }),
  Object.freeze({ x: -1, y: 1 }),
  Object.freeze({ x: 1, y: 1 })
]);
function gridPointKey(point) {
  return `${point.x},${point.y}`;
}
function sameGridPoint(first, second) {
  return first.x === second.x && first.y === second.y;
}
function manhattanDistance2(first, second) {
  return Math.abs(first.x - second.x) + Math.abs(first.y - second.y);
}
function euclideanDistance(first, second) {
  return Math.hypot(first.x - second.x, first.y - second.y);
}
function createGrid(options) {
  if (!Number.isInteger(options.width) || options.width <= 0) {
    throw new Error("Grid width must be a positive integer");
  }
  if (!Number.isInteger(options.height) || options.height <= 0) {
    throw new Error("Grid height must be a positive integer");
  }
  const blocked = new Set((options.blocked ?? []).map(gridPointKey));
  const fixedCosts = /* @__PURE__ */ new Map();
  for (const entry of options.tileCosts ?? []) {
    validateNonNegativeCost(entry.cost, "fixed tile cost");
    fixedCosts.set(gridPointKey(entry.point), entry.cost);
  }
  const dynamicCosts = [...options.dynamicTileCosts ?? []];
  const preventCornerCutting = options.preventDiagonalCornerCutting ?? true;
  let grid;
  const isInside = (point) => Number.isInteger(point.x) && Number.isInteger(point.y) && point.x >= 0 && point.x < options.width && point.y >= 0 && point.y < options.height;
  const isBlocked = (point) => !isInside(point) || blocked.has(gridPointKey(point));
  grid = Object.freeze({
    width: options.width,
    height: options.height,
    isInside,
    isBlocked,
    tileCost(context) {
      if (isBlocked(context.point)) {
        return Number.POSITIVE_INFINITY;
      }
      let cost = 1 + (fixedCosts.get(gridPointKey(context.point)) ?? 0);
      for (const provider of dynamicCosts) {
        const extra = provider(context);
        validateNonNegativeCost(extra, "dynamic tile cost");
        cost += extra;
      }
      return cost;
    },
    neighbors(point, allowDiagonal = false) {
      const result = [];
      for (const offset of ORTHOGONAL_OFFSETS) {
        const candidate = Object.freeze({ x: point.x + offset.x, y: point.y + offset.y });
        if (!isBlocked(candidate)) {
          result.push(candidate);
        }
      }
      if (allowDiagonal) {
        for (const offset of DIAGONAL_OFFSETS) {
          const candidate = Object.freeze({ x: point.x + offset.x, y: point.y + offset.y });
          if (isBlocked(candidate)) {
            continue;
          }
          if (preventCornerCutting) {
            const horizontal = { x: point.x + offset.x, y: point.y };
            const vertical = { x: point.x, y: point.y + offset.y };
            if (isBlocked(horizontal) || isBlocked(vertical)) {
              continue;
            }
          }
          result.push(candidate);
        }
      }
      return result;
    }
  });
  return grid;
}
function compareSearchNodes(first, second) {
  return first.f - second.f || first.h - second.h || first.g - second.g || first.point.y - second.point.y || first.point.x - second.point.x || first.order - second.order;
}
var SearchHeap = class {
  #nodes = [];
  get size() {
    return this.#nodes.length;
  }
  push(node) {
    this.#nodes.push(node);
    let index = this.#nodes.length - 1;
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      const parentNode = this.#nodes[parent];
      if (compareSearchNodes(parentNode, node) <= 0) {
        break;
      }
      this.#nodes[index] = parentNode;
      index = parent;
    }
    this.#nodes[index] = node;
  }
  pop() {
    const root = this.#nodes[0];
    const tail = this.#nodes.pop();
    if (root === void 0 || tail === void 0 || this.#nodes.length === 0) {
      return root;
    }
    let index = 0;
    this.#nodes[0] = tail;
    while (true) {
      const left = index * 2 + 1;
      const right = left + 1;
      let smallest = index;
      const smallestNode = this.#nodes[smallest];
      const leftNode = this.#nodes[left];
      const rightNode = this.#nodes[right];
      if (leftNode !== void 0 && compareSearchNodes(leftNode, smallestNode) < 0) {
        smallest = left;
      }
      const candidateNode = this.#nodes[smallest];
      if (rightNode !== void 0 && compareSearchNodes(rightNode, candidateNode) < 0) {
        smallest = right;
      }
      if (smallest === index) {
        break;
      }
      const current = this.#nodes[index];
      this.#nodes[index] = this.#nodes[smallest];
      this.#nodes[smallest] = current;
      index = smallest;
    }
    return root;
  }
};
function defaultHeuristic(point, goal, diagonal) {
  const deltaX = Math.abs(point.x - goal.x);
  const deltaY = Math.abs(point.y - goal.y);
  return diagonal ? Math.max(deltaX, deltaY) + (Math.SQRT2 - 1) * Math.min(deltaX, deltaY) : deltaX + deltaY;
}
function reconstructPath(node) {
  const reverse = [];
  let current = node;
  while (current !== void 0) {
    reverse.push(current.point);
    current = current.parent;
  }
  return Object.freeze(reverse.reverse());
}
function failedPath(reason, visited, atMillis) {
  return Object.freeze({
    reached: false,
    path: Object.freeze([]),
    cost: Number.POSITIVE_INFINITY,
    visited,
    arrivalMillis: atMillis,
    reason
  });
}
function findPath(grid, start2, goal, options = {}) {
  const atMillis = options.atMillis ?? 0;
  const stepMillis = options.stepMillis ?? 100;
  if (!Number.isFinite(atMillis) || !Number.isFinite(stepMillis) || stepMillis < 0) {
    throw new Error("A* time values must be finite and stepMillis must be non-negative");
  }
  if (!grid.isInside(start2) || grid.isBlocked(start2)) {
    return failedPath("invalid-start", 0, atMillis);
  }
  if (!grid.isInside(goal) || grid.isBlocked(goal)) {
    return failedPath("invalid-goal", 0, atMillis);
  }
  if (sameGridPoint(start2, goal)) {
    return Object.freeze({
      reached: true,
      path: Object.freeze([Object.freeze({ ...start2 })]),
      cost: 0,
      visited: 0,
      arrivalMillis: atMillis,
      reason: "reached"
    });
  }
  const allowDiagonal = options.allowDiagonal ?? false;
  const heuristic = options.heuristic ?? ((point, destination) => defaultHeuristic(point, destination, allowDiagonal));
  const maxIterations = options.maxIterations ?? grid.width * grid.height * 8;
  const maxCost = options.maxCost ?? Number.POSITIVE_INFINITY;
  const extraCosts = [
    options.timeCost,
    options.crowdingCost,
    options.reservationCost,
    ...options.additionalCosts ?? []
  ].filter((provider) => provider !== void 0);
  const open = new SearchHeap();
  const bestCosts = /* @__PURE__ */ new Map();
  const startH = heuristic(start2, goal);
  validateHeuristic(startH);
  let order = 0;
  open.push({
    point: Object.freeze({ ...start2 }),
    key: gridPointKey(start2),
    g: 0,
    h: startH,
    f: startH,
    steps: 0,
    order,
    parent: void 0
  });
  bestCosts.set(gridPointKey(start2), 0);
  let visited = 0;
  while (open.size > 0 && visited < maxIterations) {
    const current = open.pop();
    if (current.g !== bestCosts.get(current.key)) {
      continue;
    }
    visited += 1;
    if (sameGridPoint(current.point, goal)) {
      return Object.freeze({
        reached: true,
        path: reconstructPath(current),
        cost: current.g,
        visited,
        arrivalMillis: atMillis + current.steps * stepMillis,
        reason: "reached"
      });
    }
    for (const point of grid.neighbors(current.point, allowDiagonal)) {
      const steps = current.steps + 1;
      const context = Object.freeze({
        grid,
        from: current.point,
        point,
        step: steps,
        atMillis: atMillis + steps * stepMillis
      });
      let movementCost = grid.tileCost(context);
      if (point.x !== current.point.x && point.y !== current.point.y) {
        movementCost *= Math.SQRT2;
      }
      for (const provider of extraCosts) {
        const extra = provider(context);
        validateNonNegativeCost(extra, "A* additional cost");
        movementCost += extra;
      }
      const nextCost = current.g + movementCost;
      if (!Number.isFinite(nextCost) || nextCost > maxCost) {
        continue;
      }
      const key = gridPointKey(point);
      const knownCost = bestCosts.get(key);
      if (knownCost !== void 0 && nextCost >= knownCost) {
        continue;
      }
      const h = heuristic(point, goal);
      validateHeuristic(h);
      bestCosts.set(key, nextCost);
      order += 1;
      open.push({
        point,
        key,
        g: nextCost,
        h,
        f: nextCost + h,
        steps,
        order,
        parent: current
      });
    }
  }
  return failedPath(open.size > 0 ? "iteration-limit" : "unreachable", visited, atMillis);
}
function validateNonNegativeCost(cost, label) {
  if (Number.isNaN(cost) || cost < 0) {
    throw new Error(`${label} must be non-negative`);
  }
}
function validateHeuristic(value) {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error("A* heuristic must return a finite non-negative value");
  }
}

// packages/agent-runtime/src/arcade.ts
var BALANCED_TETRIS_WEIGHTS = Object.freeze({
  lines: 0.76,
  aggregateHeight: -0.51,
  holes: -0.86,
  bumpiness: -0.18
});

// packages/agent-runtime/src/behavior.ts
function applyControlledMistake(action, profile2, random, options = {}) {
  const { mistakeRate, mistakeSeverity } = profile2.parameters;
  if (mistakeRate <= 0 || mistakeSeverity <= 0 || !random.chance(mistakeRate)) {
    return Object.freeze({ action, mistakeApplied: false, intendedAction: action });
  }
  if (action.kind === "move" && action.target !== void 0) {
    const maximum = Math.max(1, Math.trunc(options.maxOffset ?? 3));
    const radius = Math.max(1, Math.ceil(mistakeSeverity * maximum));
    const directions = [
      { x: -1, y: -1 },
      { x: 0, y: -1 },
      { x: 1, y: -1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: -1, y: 1 },
      { x: 0, y: 1 },
      { x: 1, y: 1 }
    ];
    const direction = directions[random.int(directions.length)];
    const target3 = Object.freeze({
      x: clampCoordinate(action.target.x + direction.x * radius, options.width),
      y: clampCoordinate(action.target.y + direction.y * radius, options.height)
    });
    const mistaken = Object.freeze({
      ...action,
      target: target3,
      explanation: appendExplanation(action.explanation, `Seeded movement error (${radius} tile offset)`)
    });
    return Object.freeze({ action: mistaken, mistakeApplied: true, intendedAction: action });
  }
  const idle = Object.freeze({
    version: AGENT_CONTRACT_VERSION,
    actorId: action.actorId,
    kind: "idle",
    atMillis: action.atMillis,
    explanation: appendExplanation(action.explanation, "Seeded hesitation")
  });
  return Object.freeze({ action: idle, mistakeApplied: true, intendedAction: action });
}
var StuckDetector = class {
  #windowMillis;
  #distanceThreshold;
  #samples = [];
  #wasStuck = false;
  #lastMillis = Number.NEGATIVE_INFINITY;
  constructor(windowMillis, distanceThreshold) {
    if (!Number.isFinite(windowMillis) || windowMillis <= 0) {
      throw new Error("Stuck detection window must be positive");
    }
    if (!Number.isFinite(distanceThreshold) || distanceThreshold < 0) {
      throw new Error("Stuck distance threshold must be non-negative");
    }
    this.#windowMillis = windowMillis;
    this.#distanceThreshold = distanceThreshold;
  }
  update(nowMillis, position, intendsMovement) {
    if (nowMillis < this.#lastMillis) {
      throw new Error("Stuck detector observations must be monotonic");
    }
    this.#lastMillis = nowMillis;
    if (!intendsMovement) {
      this.reset();
      this.#lastMillis = nowMillis;
      return Object.freeze({ stuck: false, newlyStuck: false, observedMillis: 0, displacement: 0 });
    }
    this.#samples.push(Object.freeze({ atMillis: nowMillis, position: Object.freeze({ ...position }) }));
    const cutoff = nowMillis - this.#windowMillis;
    while (this.#samples.length > 1 && (this.#samples[1]?.atMillis ?? nowMillis) <= cutoff) {
      this.#samples.shift();
    }
    const first = this.#samples[0];
    const observedMillis = nowMillis - first.atMillis;
    const displacement = this.#samples.reduce(
      (maximum, sample) => Math.max(maximum, euclideanDistance(first.position, sample.position)),
      0
    );
    const stuck = observedMillis >= this.#windowMillis && displacement <= this.#distanceThreshold;
    const newlyStuck = stuck && !this.#wasStuck;
    this.#wasStuck = stuck;
    return Object.freeze({ stuck, newlyStuck, observedMillis, displacement });
  }
  snapshot() {
    return Object.freeze({
      windowMillis: this.#windowMillis,
      distanceThreshold: this.#distanceThreshold,
      samples: Object.freeze(this.#samples.map((sample) => Object.freeze({
        atMillis: sample.atMillis,
        position: Object.freeze({ ...sample.position })
      }))),
      wasStuck: this.#wasStuck,
      lastMillis: Number.isFinite(this.#lastMillis) ? this.#lastMillis : null
    });
  }
  restore(snapshot) {
    if (snapshot.windowMillis !== this.#windowMillis || snapshot.distanceThreshold !== this.#distanceThreshold) {
      throw new Error("Stuck detector snapshot configuration does not match");
    }
    if (snapshot.lastMillis !== null && !Number.isFinite(snapshot.lastMillis)) {
      throw new Error("Stuck detector snapshot time must be finite or null");
    }
    let previousMillis = Number.NEGATIVE_INFINITY;
    const samples = snapshot.samples.map((sample) => {
      if (!Number.isFinite(sample.atMillis) || sample.atMillis < previousMillis) {
        throw new Error("Stuck detector snapshot samples must have monotonic finite times");
      }
      if (!Number.isInteger(sample.position.x) || !Number.isInteger(sample.position.y)) {
        throw new Error("Stuck detector snapshot positions require integer coordinates");
      }
      previousMillis = sample.atMillis;
      return Object.freeze({
        atMillis: sample.atMillis,
        position: Object.freeze({ ...sample.position })
      });
    });
    if (snapshot.lastMillis !== null && previousMillis > snapshot.lastMillis) {
      throw new Error("Stuck detector snapshot samples cannot be newer than its clock");
    }
    if (snapshot.lastMillis === null && samples.length > 0) {
      throw new Error("Stuck detector snapshot with samples requires a clock");
    }
    this.#samples.length = 0;
    this.#samples.push(...samples);
    this.#wasStuck = snapshot.wasStuck;
    this.#lastMillis = snapshot.lastMillis ?? Number.NEGATIVE_INFINITY;
  }
  reset() {
    this.#samples.length = 0;
    this.#wasStuck = false;
    this.#lastMillis = Number.NEGATIVE_INFINITY;
  }
};
function clampCoordinate(value, size) {
  const integer = Math.round(value);
  return size === void 0 ? integer : Math.max(0, Math.min(size - 1, integer));
}
function appendExplanation(current, addition) {
  return current === void 0 || current.length === 0 ? addition : `${current}; ${addition}`;
}

// packages/agent-runtime/src/utility.ts
function scoreIntentions(intentions, context, options = {}) {
  const stickiness = clamp012(options.stickiness ?? 0);
  const stickinessScale = finite(options.stickinessScale ?? 1, "stickinessScale");
  const scores = intentions.map((intention) => {
    const available = intention.available?.(context) ?? true;
    let score = finite(intention.baseUtility ?? 0, "baseUtility");
    let vetoed = !available;
    const factors = [];
    for (const consideration of intention.considerations) {
      const input2 = finite(consideration.evaluate(context), `utility input ${consideration.id}`);
      const normalizedInput = clamp012(input2);
      const normalized = applyCurve(consideration.curve ?? "linear", normalizedInput);
      const weight = finite(consideration.weight, `utility weight ${consideration.id}`);
      const factorVetoed = consideration.vetoBelow !== void 0 && normalizedInput < clamp012(consideration.vetoBelow);
      const contribution = normalized * weight;
      score += contribution;
      vetoed ||= factorVetoed;
      factors.push(Object.freeze({
        id: consideration.id,
        label: consideration.label ?? consideration.id,
        input: input2,
        normalized,
        weight,
        contribution,
        vetoed: factorVetoed
      }));
    }
    if (intention.id === options.currentIntentionId && stickiness > 0) {
      const contribution = stickiness * stickinessScale;
      score += contribution;
      factors.push(Object.freeze({
        id: "target-stickiness",
        label: "Target stickiness",
        input: stickiness,
        normalized: stickiness,
        weight: stickinessScale,
        contribution,
        vetoed: false
      }));
    }
    return Object.freeze({
      intention,
      score: vetoed ? Number.NEGATIVE_INFINITY : score,
      vetoed,
      factors: Object.freeze(factors)
    });
  });
  return Object.freeze(scores.sort(compareUtilityScores));
}
function selectIntention(intentions, context, options = {}) {
  const rankings = scoreIntentions(intentions, context, options);
  const winner = rankings.find((ranking) => !ranking.vetoed);
  if (winner === void 0) {
    return Object.freeze({
      selected: void 0,
      selectedScore: void 0,
      rankings,
      explanation: "No intention was available"
    });
  }
  const strongest = [...winner.factors].filter((factor) => factor.contribution !== 0).sort(
    (first, second) => Math.abs(second.contribution) - Math.abs(first.contribution) || first.id.localeCompare(second.id)
  )[0];
  const reason = strongest === void 0 ? `Selected ${winner.intention.label} from base utility and deterministic tie-breaking` : `Selected ${winner.intention.label}; strongest factor: ${strongest.label} (${formatSigned(strongest.contribution)})`;
  return Object.freeze({
    selected: winner.intention,
    selectedScore: winner.score,
    rankings,
    explanation: reason
  });
}
function compareUtilityScores(first, second) {
  return Number(first.vetoed) - Number(second.vetoed) || second.score - first.score || (second.intention.priority ?? 0) - (first.intention.priority ?? 0) || first.intention.id.localeCompare(second.intention.id);
}
function applyCurve(curve, value) {
  if (typeof curve === "function") {
    return clamp012(finite(curve(value), "utility curve result"));
  }
  switch (curve) {
    case "linear":
      return value;
    case "quadratic":
      return value * value;
    case "sqrt":
      return Math.sqrt(value);
    case "inverse":
      return 1 - value;
  }
}
function clamp012(value) {
  return Math.max(0, Math.min(1, value));
}
function finite(value, label) {
  if (!Number.isFinite(value)) {
    throw new Error(`${label} must be finite`);
  }
  return value;
}
function formatSigned(value) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}`;
}

// packages/agent-runtime/src/profiles.ts
var AGENT_PROFILE_LIMITS = Object.freeze({
  reactionDelayMillis: Object.freeze([0, 2e3]),
  mistakeRate: Object.freeze([0, 0.5]),
  mistakeSeverity: Object.freeze([0, 1]),
  targetStickiness: Object.freeze([0, 1]),
  caution: Object.freeze([0, 1]),
  exploration: Object.freeze([0, 1]),
  teamwork: Object.freeze([0, 1]),
  prediction: Object.freeze([0, 1]),
  memoryDecayPerSecond: Object.freeze([0, 1]),
  replanIntervalMillis: Object.freeze([50, 5e3]),
  stuckWindowMillis: Object.freeze([100, 5e3]),
  stuckDistance: Object.freeze([0, 4]),
  reservationHorizonMillis: Object.freeze([100, 15e3])
});
var BALANCED_PARAMETERS = Object.freeze({
  reactionDelayMillis: 180,
  mistakeRate: 0.06,
  mistakeSeverity: 0.25,
  targetStickiness: 0.55,
  caution: 0.5,
  exploration: 0.45,
  teamwork: 0.5,
  prediction: 0.55,
  memoryDecayPerSecond: 0.12,
  replanIntervalMillis: 350,
  stuckWindowMillis: 900,
  stuckDistance: 0.5,
  reservationHorizonMillis: 2e3
});
function clampParameter(name, value) {
  const [minimum, maximum] = AGENT_PROFILE_LIMITS[name];
  const finiteValue = Number.isFinite(value) ? value : BALANCED_PARAMETERS[name];
  return Math.max(minimum, Math.min(maximum, finiteValue));
}
function defineAgentProfile(id, label, parameters = {}) {
  if (id.length === 0 || label.length === 0) {
    throw new Error("Profile id and label must not be empty");
  }
  const bounded = {};
  for (const name of Object.keys(BALANCED_PARAMETERS)) {
    bounded[name] = clampParameter(name, parameters[name] ?? BALANCED_PARAMETERS[name]);
  }
  return Object.freeze({
    id,
    label,
    parameters: Object.freeze(bounded)
  });
}
var CAUTIOUS_AGENT_PROFILE = defineAgentProfile("cautious", "Cautious", {
  reactionDelayMillis: 260,
  mistakeRate: 0.035,
  mistakeSeverity: 0.15,
  targetStickiness: 0.72,
  caution: 0.92,
  exploration: 0.18,
  teamwork: 0.62,
  prediction: 0.64
});
var BALANCED_AGENT_PROFILE = defineAgentProfile("balanced", "Balanced");
var BOLD_AGENT_PROFILE = defineAgentProfile("bold", "Bold", {
  reactionDelayMillis: 125,
  mistakeRate: 0.08,
  mistakeSeverity: 0.32,
  targetStickiness: 0.44,
  caution: 0.18,
  exploration: 0.62,
  prediction: 0.62
});
var HELPER_AGENT_PROFILE = defineAgentProfile("helper", "Helper", {
  reactionDelayMillis: 210,
  mistakeRate: 0.04,
  targetStickiness: 0.68,
  caution: 0.67,
  exploration: 0.28,
  teamwork: 0.96,
  prediction: 0.58
});
var EXPLORER_AGENT_PROFILE = defineAgentProfile("explorer", "Explorer", {
  reactionDelayMillis: 190,
  mistakeRate: 0.075,
  mistakeSeverity: 0.3,
  targetStickiness: 0.25,
  caution: 0.36,
  exploration: 0.96,
  teamwork: 0.42,
  prediction: 0.48
});
var CHAOTIC_AGENT_PROFILE = defineAgentProfile("chaotic", "Chaotic", {
  reactionDelayMillis: 85,
  mistakeRate: 0.32,
  mistakeSeverity: 0.88,
  targetStickiness: 0.12,
  caution: 0.1,
  exploration: 1,
  teamwork: 0.16,
  prediction: 0.2,
  replanIntervalMillis: 140
});
var EXPERT_AGENT_PROFILE = defineAgentProfile("expert", "Expert", {
  reactionDelayMillis: 45,
  mistakeRate: 8e-3,
  mistakeSeverity: 0.05,
  targetStickiness: 0.78,
  caution: 0.74,
  exploration: 0.52,
  teamwork: 0.86,
  prediction: 0.98,
  memoryDecayPerSecond: 0.025,
  replanIntervalMillis: 110,
  stuckWindowMillis: 450,
  reservationHorizonMillis: 3500
});
var AGENT_PROFILES = Object.freeze({
  cautious: CAUTIOUS_AGENT_PROFILE,
  balanced: BALANCED_AGENT_PROFILE,
  bold: BOLD_AGENT_PROFILE,
  helper: HELPER_AGENT_PROFILE,
  explorer: EXPLORER_AGENT_PROFILE,
  chaotic: CHAOTIC_AGENT_PROFILE,
  expert: EXPERT_AGENT_PROFILE
});
function getAgentProfile(id) {
  const profile2 = AGENT_PROFILES[id];
  if (profile2 === void 0) {
    throw new Error(`Unknown agent profile: ${id}`);
  }
  return profile2;
}

// packages/agent-runtime/src/random.ts
var UINT32_RANGE = 4294967296;
function normalizeSeed(seed) {
  return Number.isFinite(seed) ? Math.trunc(seed) >>> 0 : 0;
}
var SeededRandom = class _SeededRandom {
  #state;
  constructor(seed) {
    this.#state = normalizeSeed(seed);
  }
  get state() {
    return this.#state;
  }
  restore(state) {
    this.#state = normalizeSeed(state);
  }
  next() {
    this.#state = this.#state + 1831565813 >>> 0;
    let value = this.#state;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / UINT32_RANGE;
  }
  int(maxExclusive) {
    if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
      throw new Error("maxExclusive must be a positive integer");
    }
    return Math.floor(this.next() * maxExclusive);
  }
  chance(probability) {
    const bounded = Math.max(0, Math.min(1, probability));
    if (bounded <= 0) {
      return false;
    }
    if (bounded >= 1) {
      return true;
    }
    return this.next() < bounded;
  }
  pick(values) {
    if (values.length === 0) {
      throw new Error("Cannot pick from an empty collection");
    }
    return values[this.int(values.length)];
  }
  fork(salt) {
    const saltText = String(salt);
    let hash2 = this.#state ^ 2166136261;
    for (let index = 0; index < saltText.length; index += 1) {
      hash2 ^= saltText.charCodeAt(index);
      hash2 = Math.imul(hash2, 16777619);
    }
    return new _SeededRandom(hash2 >>> 0);
  }
};

// packages/agent-runtime/src/runtime.ts
var AgentRuntime = class {
  #definition;
  #profile;
  #brain;
  #services;
  #random;
  #stuckDetector;
  #gridBounds;
  #state;
  #intention;
  #lastAction;
  #pending;
  #nextPlanAtMillis = Number.NEGATIVE_INFINITY;
  #lastNowMillis = Number.NEGATIVE_INFINITY;
  #lastTick = -1;
  #sequence = 0;
  #replans = 0;
  #forceReplan = false;
  #lastSnapshot;
  constructor(options) {
    assertAgentContractVersion(options.definition);
    assertAgentContractVersion(options.brain);
    if (options.definition.brainId !== options.brain.id) {
      throw new Error(`Definition brain ${options.definition.brainId} does not match ${options.brain.id}`);
    }
    if (options.definition.profileId !== options.profile.id) {
      throw new Error(`Definition profile ${options.definition.profileId} does not match ${options.profile.id}`);
    }
    this.#definition = immutableAgentData(options.definition);
    this.#profile = options.profile;
    this.#brain = options.brain;
    this.#services = options.services;
    this.#random = new SeededRandom(options.seed);
    this.#gridBounds = options.gridBounds;
    this.#stuckDetector = new StuckDetector(
      options.profile.parameters.stuckWindowMillis,
      options.profile.parameters.stuckDistance
    );
  }
  forceReplan() {
    this.#forceReplan = true;
    if (this.#lastSnapshot !== void 0) {
      this.#lastSnapshot = immutableAgentData({ ...this.#lastSnapshot, forceReplan: true });
    }
  }
  snapshot() {
    if (this.#lastSnapshot === void 0) {
      throw new Error("The runtime has no snapshot before its first observation");
    }
    return this.#lastSnapshot;
  }
  restore(snapshot) {
    assertAgentContractVersion(snapshot);
    if (snapshot.definitionId !== this.#definition.id || snapshot.brainId !== this.#brain.id) {
      throw new Error("Snapshot belongs to a different agent or brain");
    }
    if (!Number.isFinite(snapshot.nextPlanAtMillis)) {
      throw new Error("Snapshot next plan time must be finite");
    }
    const restored = immutableAgentData(snapshot);
    this.#state = restored.brainState;
    this.#intention = restored.intention;
    this.#lastAction = restored.lastAction;
    this.#pending = restored.pendingAction === void 0 || restored.pendingActionAtMillis === void 0 ? void 0 : Object.freeze({
      decision: Object.freeze({
        state: restored.brainState,
        action: restored.pendingAction,
        intention: restored.pendingIntention,
        explanation: "Restored pending decision"
      }),
      executeAtMillis: restored.pendingActionAtMillis
    });
    this.#random.restore(restored.randomState);
    this.#sequence = restored.sequence;
    this.#replans = restored.replans;
    this.#lastNowMillis = restored.atMillis;
    this.#lastTick = restored.tick;
    this.#nextPlanAtMillis = restored.nextPlanAtMillis;
    this.#forceReplan = restored.forceReplan;
    this.#stuckDetector.restore(restored.stuckDetector);
    this.#lastSnapshot = restored;
  }
  step(observation) {
    assertAgentContractVersion(observation);
    if (observation.agentId !== this.#definition.id) {
      throw new Error(`Observation for ${observation.agentId} cannot drive ${this.#definition.id}`);
    }
    if (observation.nowMillis < this.#lastNowMillis || observation.tick <= this.#lastTick) {
      throw new Error("Agent observations must have increasing ticks and monotonic time");
    }
    this.#lastNowMillis = observation.nowMillis;
    this.#lastTick = observation.tick;
    let action;
    let intendedAction;
    let mistakeApplied = false;
    let planned = false;
    let replanReason;
    const explanations = [];
    const matured = this.#executePending(observation.nowMillis);
    if (matured !== void 0) {
      ({ action, intendedAction, mistakeApplied } = matured);
      explanations.push(matured.explanation);
    }
    if (this.#state === void 0) {
      this.#state = immutableAgentData(this.#brain.initialState(this.#definition, observation));
      replanReason = "initial";
    } else {
      const stuck = this.#stuckDetector.update(
        observation.nowMillis,
        observation.position,
        this.#lastAction?.kind === "move"
      );
      if (stuck.newlyStuck) {
        replanReason = "stuck";
        this.#pending = void 0;
        this.#stuckDetector.reset();
      } else if (this.#intention?.expiresAtMillis !== void 0 && this.#intention.expiresAtMillis <= observation.nowMillis) {
        replanReason = "intention-expired";
        this.#pending = void 0;
      } else if (this.#forceReplan) {
        replanReason = "forced";
        this.#pending = void 0;
      } else if (this.#pending === void 0 && observation.nowMillis >= this.#nextPlanAtMillis) {
        replanReason = "interval";
      }
    }
    if (replanReason !== void 0) {
      const decision = this.#plan(observation, replanReason);
      planned = true;
      explanations.push(decision.explanation);
      this.#forceReplan = false;
      const immediate = this.#executePending(observation.nowMillis);
      if (immediate !== void 0) {
        ({ action, intendedAction, mistakeApplied } = immediate);
        explanations.push(immediate.explanation);
      }
    }
    this.#sequence += 1;
    const snapshot = this.#makeSnapshot(observation);
    this.#lastSnapshot = snapshot;
    return Object.freeze({
      action,
      intendedAction,
      mistakeApplied,
      planned,
      replanReason,
      pendingUntilMillis: this.#pending?.executeAtMillis,
      snapshot,
      explanation: explanations.join("; ") || "No decision was due"
    });
  }
  #plan(observation, reason) {
    const state = this.#state;
    let decision = immutableAgentData(this.#brain.decide(Object.freeze({
      definition: this.#definition,
      observation,
      profile: this.#profile,
      state,
      previousIntention: this.#intention,
      replanReason: reason,
      random: this.#random,
      services: this.#services
    })));
    const previous = this.#intention;
    const switching = previous !== void 0 && decision.intention !== void 0 && previous.id !== decision.intention.id && (previous.expiresAtMillis === void 0 || previous.expiresAtMillis > observation.nowMillis);
    if (switching && this.#lastAction !== void 0 && this.#random.chance(this.#profile.parameters.targetStickiness)) {
      decision = immutableAgentData({
        ...decision,
        action: { ...this.#lastAction, atMillis: observation.nowMillis },
        intention: previous,
        explanation: `${decision.explanation}; retained ${previous.label} through target stickiness`
      });
    }
    this.#state = decision.state;
    this.#intention = decision.intention;
    this.#replans += 1;
    const interval = this.#profile.parameters.replanIntervalMillis;
    this.#nextPlanAtMillis = Math.max(
      observation.nowMillis,
      decision.reconsiderAtMillis ?? observation.nowMillis + interval
    );
    if (decision.action !== void 0) {
      this.#pending = Object.freeze({
        decision,
        executeAtMillis: observation.nowMillis + this.#profile.parameters.reactionDelayMillis
      });
    } else {
      this.#pending = void 0;
    }
    return decision;
  }
  #executePending(nowMillis) {
    if (this.#pending === void 0 || this.#pending.executeAtMillis > nowMillis) {
      return void 0;
    }
    const pending = this.#pending;
    this.#pending = void 0;
    if (pending.decision.action === void 0) {
      return void 0;
    }
    const intendedAction = immutableAgentData({ ...pending.decision.action, atMillis: nowMillis });
    const outcome = applyControlledMistake(
      intendedAction,
      this.#profile,
      this.#random,
      this.#gridBounds
    );
    this.#lastAction = immutableAgentData(outcome.action);
    return Object.freeze({
      action: outcome.action,
      intendedAction: outcome.intendedAction,
      mistakeApplied: outcome.mistakeApplied,
      explanation: outcome.mistakeApplied ? "Executed with a controlled seeded mistake" : "Executed planned action"
    });
  }
  #makeSnapshot(observation) {
    const pendingAction = this.#pending?.decision.action;
    return createAgentSnapshot({
      definitionId: this.#definition.id,
      brainId: this.#brain.id,
      tick: observation.tick,
      sequence: this.#sequence,
      atMillis: observation.nowMillis,
      position: observation.position,
      brainState: this.#state,
      randomState: this.#random.state,
      intention: this.#intention,
      lastAction: this.#lastAction,
      pendingAction,
      pendingIntention: this.#pending?.decision.intention,
      pendingActionAtMillis: this.#pending?.executeAtMillis,
      nextPlanAtMillis: this.#nextPlanAtMillis,
      forceReplan: this.#forceReplan,
      stuckDetector: this.#stuckDetector.snapshot(),
      replans: this.#replans
    });
  }
};
function createAgentRuntime(options) {
  return new AgentRuntime(options);
}

// games/duelo/src/agents.ts
var DUELO_AGENT_BRAIN_ID = "duelo-semantic-targets";
var DUELO_RIVAL_TILE_PATH_COST = 8;
var DUELO_REFERENCE_AGENT_PROFILE = defineAgentProfile(
  "duelo-reference",
  "Duelo reference",
  {
    reactionDelayMillis: 60,
    mistakeRate: 0,
    mistakeSeverity: 0,
    targetStickiness: 0,
    caution: 0.55,
    exploration: 0.45,
    teamwork: 0.5,
    prediction: 0.6,
    memoryDecayPerSecond: 0,
    replanIntervalMillis: 80,
    stuckWindowMillis: 1e3,
    stuckDistance: 0,
    reservationHorizonMillis: 1e3
  }
);
var FLOOR_GRID = createGrid({ width: FLOOR_COLS, height: FLOOR_ROWS });
var MAX_MANHATTAN_DISTANCE = FLOOR_COLS + FLOOR_ROWS - 2;
function createDueloAgentBrain() {
  return Object.freeze({
    version: AGENT_CONTRACT_VERSION,
    id: DUELO_AGENT_BRAIN_ID,
    initialState: () => Object.freeze({
      decisions: 0,
      lastExplanation: "Awaiting the first semantic Duelo observation"
    }),
    decide(context) {
      const { observation, profile: profile2, previousIntention, random } = context;
      if (observation.world.phase !== "running") {
        return Object.freeze({
          state: Object.freeze({
            ...context.state,
            lastExplanation: `Waiting while Duelo is ${observation.world.phase}`
          }),
          explanation: `Player ${observation.world.playerIndex + 1} waits for the running phase`,
          reconsiderAtMillis: observation.nowMillis + 20
        });
      }
      const objectives = [...observation.objectives].sort(
        (first, second) => first.id.localeCompare(second.id)
      );
      if (objectives.length === 0) {
        const explanation2 = `Player ${observation.world.playerIndex + 1} has no owned targets left`;
        return Object.freeze({
          state: Object.freeze({
            decisions: context.state.decisions + 1,
            lastExplanation: explanation2,
            lastTargetId: void 0,
            lastUtility: 1
          }),
          intention: Object.freeze({
            id: `duelo-complete:${observation.world.playerIndex}`,
            label: "owned targets complete",
            selectedAtMillis: observation.nowMillis,
            utility: 1
          }),
          explanation: explanation2,
          reconsiderAtMillis: observation.nowMillis + profile2.parameters.replanIntervalMillis
        });
      }
      const intentions = objectives.map((objective) => {
        const distance = manhattanDistance2(observation.position, objective.position);
        const nearbyTargets = objectives.filter(
          (other) => other.id !== objective.id && manhattanDistance2(objective.position, other.position) <= 2
        ).length;
        const proximity = 1 - distance / MAX_MANHATTAN_DISTANCE;
        const clusterDensity = Math.min(1, nearbyTargets / 6);
        const seededExploration = random.next() * profile2.parameters.exploration;
        return Object.freeze({
          id: `claim:${objective.id}`,
          label: `claim ${objective.id}`,
          targetId: objective.id,
          target: objective.position,
          baseUtility: seededExploration * 0.08,
          considerations: Object.freeze([
            Object.freeze({
              id: "proximity",
              label: "short travel",
              weight: 1.1 + profile2.parameters.caution * 0.7,
              evaluate: () => proximity
            }),
            Object.freeze({
              id: "cluster",
              label: "nearby owned targets",
              weight: 0.25 + profile2.parameters.exploration * 0.4,
              evaluate: () => clusterDensity
            })
          ])
        });
      });
      const selection = selectIntention(intentions, observation, {
        currentIntentionId: previousIntention?.id,
        stickiness: profile2.parameters.targetStickiness,
        stickinessScale: 0.12
      });
      const selected = selection.selected;
      if (selected?.target === void 0 || selected.targetId === void 0) {
        const explanation2 = "No remaining Duelo target was available";
        return Object.freeze({
          state: Object.freeze({
            decisions: context.state.decisions + 1,
            lastExplanation: explanation2
          }),
          explanation: explanation2,
          reconsiderAtMillis: observation.nowMillis + 20
        });
      }
      const expiresAtMillis = observation.nowMillis + profile2.parameters.reactionDelayMillis + 20;
      const explanation = `Player ${observation.world.playerIndex + 1}: ${selection.explanation}`;
      return Object.freeze({
        state: Object.freeze({
          decisions: context.state.decisions + 1,
          lastExplanation: explanation,
          lastTargetId: selected.targetId,
          lastUtility: selection.selectedScore
        }),
        action: createAgentAction({
          actorId: observation.agentId,
          kind: "move",
          atMillis: observation.nowMillis,
          target: selected.target,
          targetId: selected.targetId,
          explanation
        }),
        intention: Object.freeze({
          id: selected.id,
          label: selected.label,
          selectedAtMillis: observation.nowMillis,
          targetId: selected.targetId,
          target: selected.target,
          expiresAtMillis,
          utility: selection.selectedScore
        }),
        explanation,
        reconsiderAtMillis: expiresAtMillis
      });
    }
  });
}
var DueloAgentController = class {
  id;
  playerIndex;
  profile;
  definition;
  #runtime;
  constructor(options) {
    validatePlayerIndex(options.playerIndex);
    this.playerIndex = options.playerIndex;
    this.id = options.id ?? `duelo-player-${options.playerIndex + 1}`;
    this.profile = resolveDueloProfile(options.profile ?? DUELO_REFERENCE_AGENT_PROFILE);
    this.definition = createAgentDefinition({
      id: this.id,
      brainId: DUELO_AGENT_BRAIN_ID,
      profileId: this.profile.id,
      role: "duelo-player",
      tags: Object.freeze(["duelo", "semantic", "player"]),
      config: Object.freeze({ playerIndex: options.playerIndex })
    });
    this.#runtime = createAgentRuntime({
      definition: this.definition,
      profile: this.profile,
      brain: createDueloAgentBrain(),
      seed: options.seed,
      gridBounds: Object.freeze({ width: FLOOR_COLS, height: FLOOR_ROWS })
    });
  }
  step(observation) {
    return this.#runtime.step(observation);
  }
  forceReplan() {
    this.#runtime.forceReplan();
  }
  snapshot() {
    return this.#runtime.snapshot();
  }
};
function createDueloAgentController(options) {
  return new DueloAgentController(options);
}
var DueloAgentDirector = class {
  #game;
  #playerCount = 0;
  #seed = 0;
  #profiles = [];
  #board;
  #remainingTargets = /* @__PURE__ */ new Map();
  #controllers = /* @__PURE__ */ new Map();
  #lastDecisions = /* @__PURE__ */ new Map();
  #lastClaimedTargets = 0;
  #lastTick = -1;
  #lastAtMillis = Number.NEGATIVE_INFINITY;
  constructor(options) {
    this.reset(options);
  }
  get board() {
    return this.#board;
  }
  get remainingTargets() {
    return Object.freeze([...this.#remainingTargets.values()].sort(compareTargets));
  }
  reset(options) {
    if (!Number.isInteger(options.playerCount) || options.playerCount < 2 || options.playerCount > 8) {
      throw new Error("Duelo directors require an integer player count from 2 through 8");
    }
    this.#game = options.game;
    this.#playerCount = options.playerCount;
    this.#seed = normalizeSeed2(options.seed);
    this.#profiles = resolveDirectorProfiles(options.profile, options.playerCount);
    this.#board = inspectDueloSemanticBoard(options.game, options.playerCount);
    this.#remainingTargets = new Map(this.#board.targets.map((target3) => [target3.id, target3]));
    this.#controllers.clear();
    this.#lastDecisions.clear();
    this.#lastClaimedTargets = 0;
    this.#lastTick = -1;
    this.#lastAtMillis = Number.NEGATIVE_INFINITY;
  }
  step(input2) {
    if (!Number.isInteger(input2.tick) || input2.tick <= this.#lastTick) {
      throw new Error("Duelo director ticks must be strictly increasing integers");
    }
    if (!Number.isFinite(input2.atMillis) || input2.atMillis < this.#lastAtMillis) {
      throw new Error("Duelo director time must be finite and monotonic");
    }
    validateDirectorAgents(input2.agents, this.#playerCount);
    this.#reconcileTargets(input2.snapshot);
    const semanticAgents = input2.agents.map((agent) => Object.freeze({
      id: agent.id,
      playerIndex: agent.playerIndex,
      position: agent.position
    }));
    const remainingTargets = this.remainingTargets;
    const decisions = [...input2.agents].sort((first, second) => first.playerIndex - second.playerIndex || first.id.localeCompare(second.id)).map((agent) => {
      const controller = this.#controllerFor(agent);
      const targetInvalidated = agent.targetId !== void 0 && !this.#remainingTargets.has(agent.targetId);
      if (targetInvalidated) controller.forceReplan();
      const shouldDecide = (agent.requestDecision ?? true) || targetInvalidated;
      if (!shouldDecide) {
        const previous = this.#lastDecisions.get(agent.id);
        const activeTarget = agent.targetId === void 0 ? void 0 : this.#remainingTargets.get(agent.targetId);
        return Object.freeze({
          id: agent.id,
          playerIndex: agent.playerIndex,
          action: void 0,
          intendedAction: void 0,
          intention: previous?.intention,
          path: activeTarget === void 0 ? Object.freeze([]) : planDueloAgentPath(agent.position, activeTarget.position, {
            playerIndex: agent.playerIndex,
            remainingTargets
          }),
          explanation: "External avatar is following its current Duelo route",
          planned: false,
          mistakeApplied: false,
          targetInvalidated,
          replanReason: void 0,
          pendingUntilMillis: previous?.pendingUntilMillis,
          runtime: previous?.runtime
        });
      }
      const observation = createDueloSemanticObservation({
        agentId: agent.id,
        playerIndex: agent.playerIndex,
        tick: input2.tick,
        atMillis: input2.atMillis,
        position: agent.position,
        agents: semanticAgents,
        remainingTargets,
        snapshot: input2.snapshot,
        boardSignature: this.#board.signature
      });
      const result = controller.step(observation);
      const path = result.action?.target === void 0 ? Object.freeze([]) : planDueloAgentPath(agent.position, result.action.target, {
        playerIndex: agent.playerIndex,
        remainingTargets
      });
      const explanation = result.action?.explanation ?? result.explanation;
      const directed = Object.freeze({
        id: agent.id,
        playerIndex: agent.playerIndex,
        action: result.action,
        intendedAction: result.intendedAction,
        intention: result.snapshot.intention,
        path,
        explanation,
        planned: result.planned,
        mistakeApplied: result.mistakeApplied,
        targetInvalidated,
        replanReason: result.replanReason,
        pendingUntilMillis: result.pendingUntilMillis,
        runtime: result.snapshot
      });
      this.#lastDecisions.set(agent.id, directed);
      return directed;
    });
    this.#lastTick = input2.tick;
    this.#lastAtMillis = input2.atMillis;
    return Object.freeze({
      tick: input2.tick,
      atMillis: input2.atMillis,
      boardSignature: this.#board.signature,
      remainingTargets,
      decisions: Object.freeze(decisions)
    });
  }
  #controllerFor(agent) {
    const existing = this.#controllers.get(agent.id);
    if (existing !== void 0) {
      if (existing.playerIndex !== agent.playerIndex) {
        throw new Error(`Duelo agent ${agent.id} changed playerIndex`);
      }
      return existing;
    }
    const controller = createDueloAgentController({
      id: agent.id,
      playerIndex: agent.playerIndex,
      profile: this.#profiles[agent.playerIndex],
      seed: mixDirectorSeed(this.#seed, agent.playerIndex)
    });
    this.#controllers.set(agent.id, controller);
    return controller;
  }
  #reconcileTargets(snapshot) {
    const recent = snapshot.recentClaim;
    if (recent !== null) {
      const id = dueloTargetId(recent.playerIndex, Object.freeze({ x: recent.x, y: recent.y }));
      this.#remainingTargets.delete(id);
    }
    if (snapshot.claimedTargets !== this.#lastClaimedTargets) {
      for (const target3 of this.#board.targets) {
        if (this.#game.targetClaimed(target3.position.x, target3.position.y)) {
          this.#remainingTargets.delete(target3.id);
        } else {
          this.#remainingTargets.set(target3.id, target3);
        }
      }
      this.#lastClaimedTargets = snapshot.claimedTargets;
    }
  }
};
function createDueloAgentDirector(options) {
  return new DueloAgentDirector(options);
}
function createDueloSemanticObservation(options) {
  validatePlayerIndex(options.playerIndex);
  const ownedTargets = options.remainingTargets.filter((target3) => target3.owner === options.playerIndex).sort(compareTargets);
  return createAgentObservation({
    agentId: options.agentId,
    tick: options.tick,
    nowMillis: options.atMillis,
    position: options.position,
    entities: options.agents.filter((agent) => agent.id !== options.agentId).sort((first, second) => first.playerIndex - second.playerIndex).map((agent) => Object.freeze({
      id: agent.id,
      kind: "duelo-player",
      position: agent.position,
      attributes: Object.freeze({ playerIndex: agent.playerIndex })
    })),
    objectives: ownedTargets.map((target3) => Object.freeze({
      id: target3.id,
      kind: "owned-color-tile",
      position: target3.position,
      value: 1,
      attributes: Object.freeze({ owner: target3.owner })
    })),
    hazards: Object.freeze([]),
    world: Object.freeze({
      boardSignature: options.boardSignature,
      phase: options.snapshot.phase,
      playerIndex: options.playerIndex,
      progress: Object.freeze(options.snapshot.playerProgress.map((entry) => Object.freeze({
        playerIndex: entry.index,
        claimed: entry.claimed,
        remaining: entry.remaining,
        target: entry.target
      }))),
      remainingTargetCount: options.snapshot.remainingTargets,
      totalTargetCount: options.snapshot.totalTargets
    })
  });
}
function inspectDueloSemanticBoard(game8, playerCount) {
  if (!Number.isInteger(playerCount) || playerCount < 2 || playerCount > 8) {
    throw new Error("Duelo semantic boards require an integer player count from 2 through 8");
  }
  const targets = [];
  const ownerCells = [];
  for (let y = 0; y < FLOOR_ROWS; y += 1) {
    for (let x = 0; x < FLOOR_COLS; x += 1) {
      const owner = game8.targetOwner(x, y);
      ownerCells.push(owner);
      if (owner < 0) continue;
      const position = Object.freeze({ x, y });
      targets.push(Object.freeze({
        id: dueloTargetId(owner, position),
        owner,
        position
      }));
    }
  }
  const sortedTargets = Object.freeze(targets.sort(compareTargets));
  const targetsByPlayer = Object.freeze(Array.from(
    { length: playerCount },
    (_, playerIndex) => Object.freeze(sortedTargets.filter((target3) => target3.owner === playerIndex))
  ));
  return Object.freeze({
    signature: checksumText(ownerCells.join(",")),
    targets: sortedTargets,
    targetsByPlayer
  });
}
function planDueloAgentPath(start2, target3, options = {}) {
  const rivalTileCost = options.rivalTileCost ?? DUELO_RIVAL_TILE_PATH_COST;
  if (!Number.isFinite(rivalTileCost) || rivalTileCost < 0) {
    throw new Error("Duelo rival tile path cost must be finite and non-negative");
  }
  const playerIndex = options.playerIndex;
  const remainingByPoint = new Map((options.remainingTargets ?? []).map((entry) => [
    pointKey(entry.position),
    entry
  ]));
  return findPath(FLOOR_GRID, start2, target3, {
    allowDiagonal: false,
    additionalCosts: playerIndex === void 0 || remainingByPoint.size === 0 ? void 0 : [({ point }) => {
      const remaining = remainingByPoint.get(pointKey(point));
      return remaining !== void 0 && remaining.owner !== playerIndex ? rivalTileCost : 0;
    }]
  }).path;
}
function dueloTargetId(owner, point) {
  return `duelo-target:${owner}:${point.x},${point.y}`;
}
function resolveDueloProfile(profile2) {
  if (typeof profile2 !== "string") return profile2;
  return profile2 === DUELO_REFERENCE_AGENT_PROFILE.id ? DUELO_REFERENCE_AGENT_PROFILE : getAgentProfile(profile2);
}
function compareTargets(first, second) {
  return first.owner - second.owner || first.position.y - second.position.y || first.position.x - second.position.x;
}
function pointKey(point) {
  return `${point.x},${point.y}`;
}
function resolveDirectorProfiles(selection, playerCount) {
  const selected = selection ?? DUELO_REFERENCE_AGENT_PROFILE;
  const values = Array.isArray(selected) ? selected : [selected];
  if (values.length === 0) throw new Error("Duelo director profile selection must not be empty");
  return Object.freeze(Array.from(
    { length: playerCount },
    (_, playerIndex) => resolveDueloProfile(values[playerIndex % values.length])
  ));
}
function validateDirectorAgents(agents, playerCount) {
  const ids = /* @__PURE__ */ new Set();
  const playerIndices = /* @__PURE__ */ new Set();
  for (const agent of agents) {
    if (agent.id.length === 0 || ids.has(agent.id)) throw new Error("Duelo director agent ids must be unique");
    if (!Number.isInteger(agent.playerIndex) || agent.playerIndex < 0 || agent.playerIndex >= playerCount || playerIndices.has(agent.playerIndex)) {
      throw new Error("Duelo director player indices must be unique and in the configured range");
    }
    ids.add(agent.id);
    playerIndices.add(agent.playerIndex);
  }
}
function normalizeSeed2(seed) {
  return Number.isFinite(seed) ? Math.trunc(seed) >>> 0 : 137;
}
function mixDirectorSeed(seed, playerIndex) {
  let value = (seed ^ Math.imul(playerIndex + 1, 2654435761)) >>> 0;
  value ^= value >>> 16;
  value = Math.imul(value, 2246822507) >>> 0;
  value ^= value >>> 13;
  return value >>> 0;
}
function validatePlayerIndex(playerIndex) {
  if (!Number.isInteger(playerIndex) || playerIndex < 0 || playerIndex >= 8) {
    throw new Error("Duelo playerIndex must be an integer from 0 through 7");
  }
}
function checksumText(value) {
  let hash2 = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash2 ^= value.charCodeAt(index);
    hash2 = Math.imul(hash2, 16777619);
  }
  return (hash2 >>> 0).toString(16).padStart(8, "0");
}

// games/duelo/src/session-controller.ts
var SESSION_DIRECTORS = /* @__PURE__ */ new WeakMap();
function createDueloSessionController(options) {
  if (options.manifest.id !== "duelo") {
    throw new Error(`Duelo session controller cannot drive ${options.manifest.id}`);
  }
  if (!Number.isInteger(options.playerIndex) || options.playerIndex < 0 || options.playerIndex >= 8) {
    throw new Error("Duelo session controller playerIndex must be 0 through 7");
  }
  const initialGame = assertDueloGame(options.game);
  const profile2 = normalizeSessionProfile(options.profile);
  let shared = sharedDirector(initialGame, options.seed, profile2);
  shared.references += 1;
  let disposed = false;
  return Object.freeze({
    id: options.id,
    step(observation) {
      if (disposed) return void 0;
      if (observation.gameId !== "duelo") return void 0;
      const game8 = assertDueloGame(observation.game);
      if (game8 !== shared.game) {
        releaseShared(shared);
        shared = sharedDirector(game8, options.seed, profile2);
        shared.references += 1;
      }
      const snapshot = observation.snapshot;
      if (snapshot.phase !== "running") {
        return Object.freeze({ explanation: `Duelo is ${snapshot.phase}; readiness stays with GameSession` });
      }
      const frame = stepSharedDirector(shared, observation, snapshot);
      const decision = frame.decisions.find((entry) => entry.playerIndex === options.playerIndex);
      return sessionResult(decision);
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      releaseShared(shared);
    }
  });
}
var createSessionController = createDueloSessionController;
function sharedDirector(game8, seed, sessionProfile) {
  const existing = SESSION_DIRECTORS.get(game8);
  const profileKey = sessionProfile ?? "duelo-reference";
  if (existing !== void 0) {
    if (existing.seed !== seed || existing.profileKey !== profileKey) {
      throw new Error("Duelo controllers sharing one game must use the same seed and profile");
    }
    return existing;
  }
  const playerCount = game8.snapshot().playerCount;
  if (!Number.isInteger(playerCount) || playerCount < 2 || playerCount > 8) {
    throw new Error("Duelo session controller requires the game's strict 2\u20138 player configuration");
  }
  const profile2 = directorProfile(sessionProfile);
  const shared = {
    game: game8,
    director: createDueloAgentDirector({ game: game8, playerCount, seed, profile: profile2 }),
    seed,
    profile: profile2,
    profileKey,
    playerCount,
    activeTargetIds: /* @__PURE__ */ new Map(),
    cachedTick: -1,
    cachedFrame: void 0,
    references: 0
  };
  SESSION_DIRECTORS.set(game8, shared);
  return shared;
}
function stepSharedDirector(shared, observation, snapshot) {
  if (shared.cachedTick === observation.tick && shared.cachedFrame !== void 0) {
    return shared.cachedFrame;
  }
  if (observation.tick <= shared.cachedTick) {
    shared.director.reset({
      game: shared.game,
      playerCount: shared.playerCount,
      seed: shared.seed,
      profile: shared.profile
    });
    shared.activeTargetIds.clear();
  }
  const bots = observation.avatars.filter((avatar) => avatar.isBot).sort((first, second) => first.playerIndex - second.playerIndex || first.id - second.id);
  const frame = shared.director.step({
    tick: observation.tick,
    atMillis: observation.atMillis,
    snapshot,
    agents: bots.map((avatar) => {
      const requesting = avatar.target === null;
      if (requesting) shared.activeTargetIds.delete(avatar.playerIndex);
      return Object.freeze({
        id: directorAgentId(avatar.playerIndex),
        playerIndex: avatar.playerIndex,
        position: Object.freeze({ x: avatar.tile.x, y: avatar.tile.y }),
        requestDecision: requesting,
        targetId: requesting ? void 0 : shared.activeTargetIds.get(avatar.playerIndex)
      });
    })
  });
  for (const decision of frame.decisions) {
    if (decision.targetInvalidated) shared.activeTargetIds.delete(decision.playerIndex);
    if (decision.action?.targetId !== void 0) {
      shared.activeTargetIds.set(decision.playerIndex, decision.action.targetId);
    }
  }
  shared.cachedTick = observation.tick;
  shared.cachedFrame = frame;
  return frame;
}
var MIXED_SESSION_PROFILES = Object.freeze([
  "cautious",
  "balanced",
  "bold",
  "helper",
  "explorer",
  "expert"
]);
var SESSION_PROFILE_IDS = Object.freeze([
  "mixed",
  "cautious",
  "balanced",
  "bold",
  "helper",
  "explorer",
  "chaotic",
  "expert",
  "duelo-reference"
]);
function normalizeSessionProfile(profile2) {
  if (profile2 === void 0) return void 0;
  if (!SESSION_PROFILE_IDS.includes(profile2)) {
    throw new Error(`Unknown Duelo session profile: ${profile2}`);
  }
  return profile2;
}
function directorProfile(profile2) {
  return profile2 === "mixed" ? MIXED_SESSION_PROFILES : profile2;
}
function sessionResult(decision) {
  if (decision === void 0) return void 0;
  const action = decision.action;
  return Object.freeze({
    action: action === void 0 ? void 0 : Object.freeze({
      kind: action.kind,
      target: action.target,
      path: decision.path,
      explanation: action.explanation
    }),
    explanation: decision.explanation
  });
}
function directorAgentId(playerIndex) {
  return `duelo-session-player-${playerIndex + 1}`;
}
function assertDueloGame(game8) {
  const candidate = game8;
  if (typeof candidate.targetOwner !== "function" || typeof candidate.targetClaimed !== "function" || typeof candidate.playerReadyZones !== "function") {
    throw new Error("Duelo session controller requires a semantic DueloGameInstance");
  }
  return candidate;
}
function releaseShared(shared) {
  shared.references = Math.max(0, shared.references - 1);
  if (shared.references === 0) SESSION_DIRECTORS.delete(shared.game);
}

// games/duelo/src/manifest.ts
var dueloConfigVars = {
  baseFillPercent: {
    key: "base_fill_percent",
    label: "Base floor coverage (%)",
    playerFacing: false,
    description: "The percentage of floor tiles assigned as targets on Medium difficulty.",
    type: "int",
    default: 60,
    min: 30,
    max: 75,
    step: 5
  },
  hardFillMultiplier: {
    key: "hard_fill_multiplier",
    label: "Hard coverage multiplier",
    playerFacing: false,
    description: "Hard difficulty multiplies the base floor coverage by this value, capped at the full floor.",
    type: "float",
    default: 1.5,
    min: 1,
    max: 1.8,
    step: 0.05
  }
};
var manifest4 = {
  id: "duelo",
  label: "Duelo",
  description: "A fast 2\u20138 player race to claim every tile of your color before anyone else.",
  availability: { development: true, production: true },
  catalog: {
    category: "versus",
    color: "#ff5268",
    durationLabel: "Sin l\xEDmite",
    modeLabel: "Carrera de colores",
    audioLabel: "M\xFAsica + efectos",
    rules: [
      "Cada jugador ocupa la zona de inicio de su color",
      "Pisa todas las baldosas de tu color antes que los dem\xE1s"
    ]
  },
  players: {
    allowAny: false,
    min: 2,
    max: 8
  },
  start: {
    mode: "player-ready",
    countdownMillis: 3e3,
    releaseGraceMillis: 2e3
  },
  config: {
    difficulty: {
      default: "medium",
      options: ["medium", "hard"]
    },
    vars: Object.values(dueloConfigVars)
  },
  defaultDurationMillis: 0,
  display: {
    entry: "./display"
  },
  preview: {
    seed: 137,
    playerCount: 4,
    difficulty: "medium",
    actions: [
      { atMillis: 100, type: "press", x: 1, y: 1 },
      { atMillis: 100, type: "press", x: 14, y: 30 },
      { atMillis: 100, type: "press", x: 1, y: 30 },
      { atMillis: 100, type: "press", x: 14, y: 1 }
    ],
    captureStartMillis: 3200,
    frameCount: 18,
    frameIntervalMillis: 120
  },
  tags: ["competitive", "multiplayer", "color-race", "typescript"]
};

// games/duelo/src/game.ts
var startPadSize = 4;
var boardCandidateCount = 18;
var claimFlashMillis = 420;
var recentClaimMillis = 700;
var winAnimationMillis = 5e3;
var idleColor = "#03060b";
var white = { r: 255, g: 255, b: 255 };
var dueloPlayerPalette = [
  "#ff3048",
  "#24d9ff",
  "#42e879",
  "#ff4fd8",
  "#376bff",
  "#ffd84d",
  "#a66cff",
  "#ff8a3d"
];
function createGame4(config) {
  return new DueloGame(config);
}
function dueloReadyZones(playerCount) {
  const count = clamp(Math.round(playerCount), manifest4.players.min, manifest4.players.max);
  const right = FLOOR_COLS - startPadSize;
  const bottom = FLOOR_ROWS - startPadSize;
  const centerX = Math.floor((FLOOR_COLS - startPadSize) / 2);
  const centerY = Math.floor((FLOOR_ROWS - startPadSize) / 2);
  const origins = count === 2 ? [[0, centerY], [right, centerY]] : count === 3 ? [[0, 0], [right, 0], [centerX, bottom]] : [
    [0, 0],
    [right, bottom],
    [0, bottom],
    [right, 0],
    [0, centerY],
    [right, centerY],
    [centerX, 0],
    [centerX, bottom]
  ].slice(0, count);
  return origins.map(([x = 0, y = 0]) => ({
    minX: x,
    maxX: x + startPadSize - 1,
    minY: y,
    maxY: y + startPadSize - 1
  }));
}
var DueloGame = class {
  claimed = new Uint8Array(FRAME_SIZE);
  claimedAt = new Float64Array(FRAME_SIZE);
  claims = [];
  config;
  fillPercent = 60;
  finishAtMillis = 0;
  lastEvent = gameEvent("none", "Listo", 0);
  motionEventId = 0;
  nowMillis = 0;
  owners = new Int16Array(FRAME_SIZE).fill(-1);
  phase = "waiting";
  players = [];
  readyGate;
  readyZones = [];
  recentClaim = null;
  rng;
  startedAtMillis = 0;
  targets = [];
  winnerIndex = -1;
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest4);
    this.rng = createSeededRng(this.config.seed);
    this.readyZones = dueloReadyZones(this.config.playerCount);
    this.readyGate = createPlayerReadyGate(manifest4.start, this.readyZones, this.config.nowMillis);
    this.resetGame(this.config.nowMillis);
  }
  init(nowMillis) {
    this.resetGame(nowMillis);
    this.lastEvent = gameEvent("ready", this.waitingMessage(), nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.recordEvents(this.applyReadyTransition(this.readyGate.update(event), event.atMillis));
    }
    if (this.phase !== "running" || !event.pressed || !inFloorBounds(event.x, event.y)) {
      return [];
    }
    const eventResult = this.claimTile(event.x, event.y, event.atMillis);
    return this.recordEvents(eventResult ? [eventResult] : []);
  }
  release(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.recordEvents(this.applyReadyTransition(
        this.readyGate.update({ ...event, pressed: false }),
        event.atMillis
      ));
    }
    return [];
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.recordEvents(this.applyReadyTransition(this.readyGate.tick(event.atMillis), event.atMillis));
    }
    if (this.phase === "finished" && event.atMillis - this.finishAtMillis >= winAnimationMillis) {
      this.resetGame(event.atMillis);
      return this.recordEvents([gameEvent("ready", "Nuevo duelo", event.atMillis)]);
    }
    return [];
  }
  render() {
    const frame = createFrame(idleColor);
    if (this.phase === "waiting") {
      this.drawWaiting(frame);
    } else if (this.phase === "starting") {
      this.drawStarting(frame);
    } else if (this.phase === "running") {
      this.drawBoard(frame);
    } else {
      this.drawVictory(frame);
    }
    return frame;
  }
  snapshot() {
    const readyState = this.readyGate.state(this.nowMillis);
    const progress = this.playerProgress();
    const leadingPlayer = progress.reduce((best, player) => {
      if (!best || player.progress > best.progress || player.progress === best.progress && player.index < best.index) {
        return player;
      }
      return best;
    }, void 0);
    const leader = leadingPlayer && progress.filter((player) => player.progress === leadingPlayer.progress).length === 1 ? leadingPlayer : void 0;
    const claimedTargets = this.claims.reduce((sum, value) => sum + value, 0);
    const totalTargets = this.targets.reduce((sum, value) => sum + value, 0);
    const winner = this.players[this.winnerIndex];
    const elapsedEnd = this.phase === "finished" ? this.finishAtMillis : this.nowMillis;
    const recentClaimAge = this.recentClaim ? this.nowMillis - this.recentClaim.atMillis : Number.POSITIVE_INFINITY;
    return {
      currentGame: manifest4.id,
      label: manifest4.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: this.players.map((player, index) => ({ ...player, score: this.claims[index] ?? 0 })),
      score: Math.max(0, ...this.claims),
      lives: -1,
      elapsedMillis: this.phase === "waiting" || this.phase === "starting" ? 0 : Math.max(0, elapsedEnd - this.startedAtMillis),
      remainingMillis: this.phase === "finished" ? Math.max(0, this.finishAtMillis + winAnimationMillis - this.nowMillis) : 0,
      activeTargets: totalTargets - claimedTargets,
      success: this.winnerIndex >= 0,
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? readyState.countdownMillis : 0,
      readyPlayers: readyState.readyPlayers,
      requiredPlayers: readyState.requiredPlayers,
      matchTarget: Math.max(0, ...this.targets),
      claimedTargets,
      fillPercent: this.fillPercent,
      leaderIndex: leader?.index ?? -1,
      leaderLabel: leader?.label ?? "-",
      motionEventId: this.motionEventId,
      playerProgress: progress,
      readyPlayerIndices: this.players.filter((_, index) => this.readyGate.zoneReady(index, this.nowMillis)).map((player) => player.index),
      recentClaim: this.recentClaim && recentClaimAge < recentClaimMillis ? {
        playerIndex: this.recentClaim.playerIndex,
        remainingMillis: recentClaimMillis - recentClaimAge,
        x: this.recentClaim.x,
        y: this.recentClaim.y
      } : null,
      remainingTargets: totalTargets - claimedTargets,
      totalTargets,
      winnerIndex: this.winnerIndex,
      winnerLabel: winner?.label ?? ""
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest4);
    this.readyZones = dueloReadyZones(this.config.playerCount);
    this.readyGate = createPlayerReadyGate(manifest4.start, this.readyZones, this.config.nowMillis);
    this.resetGame(this.config.nowMillis);
    this.lastEvent = gameEvent("ready", this.waitingMessage(), this.config.nowMillis);
  }
  playerReadyZones() {
    return this.readyZones.map((zone) => ({ ...zone }));
  }
  targetOwner(x, y) {
    return inFloorBounds(x, y) ? this.owners[y * FLOOR_COLS + x] ?? -1 : -1;
  }
  targetClaimed(x, y) {
    return inFloorBounds(x, y) && this.claimed[y * FLOOR_COLS + x] === 1;
  }
  resetGame(nowMillis) {
    this.nowMillis = nowMillis;
    this.startedAtMillis = nowMillis;
    this.finishAtMillis = 0;
    this.phase = "waiting";
    this.winnerIndex = -1;
    this.motionEventId = 1;
    this.recentClaim = null;
    this.claimed.fill(0);
    this.claimedAt.fill(0);
    this.readyGate.reset(nowMillis);
    this.players = this.createPlayers();
    this.fillPercent = this.readFillPercent();
    this.rng = createSeededRng(this.config.seed);
    const board = generateBalancedBoard(this.config.playerCount, this.fillPercent, this.rng);
    this.owners = board.owners;
    this.targets = board.targets;
    this.claims = Array.from({ length: this.config.playerCount }, () => 0);
    this.lastEvent = gameEvent("ready", this.waitingMessage(), nowMillis);
  }
  createPlayers() {
    return Array.from({ length: this.config.playerCount }, (_, index) => {
      const configured = this.config.players[index];
      const fallbackColor = dueloPlayerPalette[index] ?? dueloPlayerPalette[0];
      const configuredColor = configured?.color;
      const color = configuredColor && /^#[0-9a-f]{6}$/i.test(configuredColor) ? configuredColor : fallbackColor;
      const label = String(configured?.label || configured?.name || `Jugador ${index + 1}`).trim();
      return {
        index,
        label: label || `Jugador ${index + 1}`,
        color,
        score: 0,
        lives: -1
      };
    });
  }
  readFillPercent() {
    const base = readGameConfigOption(this.config.options, dueloConfigVars.baseFillPercent);
    if (this.config.difficulty !== "hard") {
      return Math.round(base);
    }
    const multiplier = readGameConfigOption(this.config.options, dueloConfigVars.hardFillMultiplier);
    return Math.round(clamp(base * multiplier, 1, 100));
  }
  applyReadyTransition(transition, nowMillis) {
    if (transition === "players-ready") {
      this.phase = "starting";
      this.motionEventId += 1;
      return [gameEvent("start", "Todos en posici\xF3n", nowMillis)];
    }
    if (transition === "players-left") {
      this.phase = "waiting";
      this.motionEventId += 1;
      return [gameEvent("ready", "Vuelve a tu zona iluminada", nowMillis)];
    }
    if (transition === "started") {
      this.phase = "running";
      this.startedAtMillis = nowMillis;
      this.motionEventId += 1;
      return [gameEvent("start", "Reclama todas las baldosas de tu color", nowMillis)];
    }
    return [];
  }
  claimTile(x, y, nowMillis) {
    const index = y * FLOOR_COLS + x;
    const owner = this.owners[index] ?? -1;
    if (owner < 0 || owner >= this.players.length || this.claimed[index] === 1) {
      return void 0;
    }
    this.claimed[index] = 1;
    this.claimedAt[index] = nowMillis;
    this.claims[owner] = (this.claims[owner] ?? 0) + 1;
    this.recentClaim = { atMillis: nowMillis, playerIndex: owner, x, y };
    this.motionEventId += 1;
    const remaining = Math.max(0, (this.targets[owner] ?? 0) - (this.claims[owner] ?? 0));
    const label = this.players[owner]?.label ?? `Jugador ${owner + 1}`;
    if (remaining === 0) {
      this.phase = "finished";
      this.finishAtMillis = nowMillis;
      this.winnerIndex = owner;
      return gameEvent("win", `${label} gana el duelo`, nowMillis);
    }
    return gameEvent("coin", `${label}: ${remaining} por reclamar`, nowMillis);
  }
  recordEvents(events) {
    const last = events.at(-1);
    if (last) this.lastEvent = last;
    return events;
  }
  waitingMessage() {
    return `Duelo espera a ${this.config.playerCount} jugadores`;
  }
  playerProgress() {
    return this.players.map((player, index) => {
      const target3 = this.targets[index] ?? 0;
      const claimed = this.claims[index] ?? 0;
      return {
        claimed,
        color: player.color,
        index,
        label: player.label,
        progress: target3 > 0 ? claimed / target3 : 0,
        remaining: Math.max(0, target3 - claimed),
        target: target3
      };
    });
  }
  drawWaiting(frame) {
    const pulse = 0.5 + 0.5 * Math.sin(this.nowMillis / 310);
    this.readyZones.forEach((zone, index) => {
      const ready = this.readyGate.zoneReady(index, this.nowMillis);
      this.drawReadyZone(frame, zone, this.players[index]?.color ?? dueloPlayerPalette[0], ready, pulse);
    });
    paintDiamondRing(frame, {
      color: "#13263a",
      radius: 2 + Math.floor(this.nowMillis / 180) % 20,
      thickness: 0.35
    });
  }
  drawStarting(frame) {
    const step = Math.floor(this.nowMillis / 110);
    paintDiamondWave(frame, {
      bandWidth: 2,
      period: 8,
      step,
      color: ({ distance }) => {
        const player = this.players[Math.floor(distance) % this.players.length];
        return dimColor(player?.color ?? dueloPlayerPalette[0], 58);
      }
    });
    this.readyZones.forEach((zone, index) => {
      this.drawReadyZone(frame, zone, this.players[index]?.color ?? dueloPlayerPalette[0], true, 1);
    });
  }
  drawReadyZone(frame, zone, color, ready, pulse) {
    for (let y = zone.minY; y <= zone.maxY; y += 1) {
      for (let x = zone.minX; x <= zone.maxX; x += 1) {
        const edge = x === zone.minX || x === zone.maxX || y === zone.minY || y === zone.maxY;
        const intensity = ready ? edge ? 100 : 78 : edge ? 26 + pulse * 24 : 12 + pulse * 12;
        paintFrameCell(frame, x, y, dimColor(color, intensity));
      }
    }
  }
  drawBoard(frame) {
    const progress = this.playerProgress();
    for (let index = 0; index < FRAME_SIZE; index += 1) {
      const owner = this.owners[index] ?? -1;
      if (owner < 0) continue;
      const x = index % FLOOR_COLS;
      const y = Math.floor(index / FLOOR_COLS);
      const color = this.players[owner]?.color ?? dueloPlayerPalette[0];
      if (this.claimed[index] === 1) {
        const age = this.nowMillis - (this.claimedAt[index] ?? 0);
        if (age < claimFlashMillis) {
          const flash = 1 - age / claimFlashMillis;
          paintFrameCell(frame, x, y, mixWithWhite(color, 35 + flash * 65));
        } else {
          paintFrameCell(frame, x, y, dimColor(color, 12));
        }
        continue;
      }
      const urgency = (progress[owner]?.progress ?? 0) >= 0.88 ? 16 : 0;
      const pulse = 0.5 + 0.5 * Math.sin(this.nowMillis / 360 + x * 0.74 + y * 0.18 + owner);
      paintFrameCell(frame, x, y, dimColor(color, 58 + urgency + pulse * 24));
    }
  }
  drawVictory(frame) {
    const winnerColor = this.players[this.winnerIndex]?.color ?? dueloPlayerPalette[0];
    const winnerRgb = parseHexColor(winnerColor);
    const elapsed = Math.max(0, this.nowMillis - this.finishAtMillis);
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      for (let x = 0; x < FLOOR_COLS; x += 1) {
        const shimmer = 0.5 + 0.5 * Math.sin(elapsed / 170 + x * 0.58 + y * 0.19);
        const glow = addRgb(scaleRgb(winnerRgb, 48 + shimmer * 42), scaleRgb(white, shimmer * 16));
        paintFrameCell(frame, x, y, rgbToHex(glow));
      }
    }
    paintDiamondWave(frame, {
      bandWidth: 2,
      period: 9,
      step: Math.floor(elapsed / 90),
      color: "#ffffff"
    });
  }
};
function generateBalancedBoard(playerCount, fillPercent, rng) {
  const requestedTargets = Math.round(FRAME_SIZE * fillPercent / 100);
  const targetsPerPlayer = Math.max(1, Math.floor(requestedTargets / playerCount));
  const targets = Array.from({ length: playerCount }, () => targetsPerPlayer);
  let bestOwners = new Int16Array(FRAME_SIZE).fill(-1);
  let bestPenalty = Number.POSITIVE_INFINITY;
  for (let attempt = 0; attempt < boardCandidateCount; attempt += 1) {
    const candidate = generateBoardCandidate(targets, rng);
    const penalty = boardOrganicPenalty(candidate);
    if (penalty < bestPenalty) {
      bestPenalty = penalty;
      bestOwners = candidate;
    }
  }
  return { owners: bestOwners, targets };
}
function generateBoardCandidate(targets, rng) {
  const owners = new Int16Array(FRAME_SIZE).fill(-1);
  const counts = Array.from({ length: targets.length }, () => 0);
  const order = Array.from({ length: FRAME_SIZE }, (_, index) => index);
  for (let index = order.length - 1; index > 0; index -= 1) {
    const swapIndex = rng.int(index + 1);
    [order[index], order[swapIndex]] = [order[swapIndex] ?? 0, order[index] ?? 0];
  }
  for (const tileIndex of order) {
    const x = tileIndex % FLOOR_COLS;
    const y = Math.floor(tileIndex / FLOOR_COLS);
    let bestPlayer = -1;
    let bestScore = Number.POSITIVE_INFINITY;
    for (let player = 0; player < targets.length; player += 1) {
      const target3 = targets[player] ?? 0;
      if ((counts[player] ?? 0) >= target3) continue;
      const sameOrthogonal = sameOrthogonalNeighbors(owners, x, y, player);
      const sameDiagonal = sameDiagonalNeighbors(owners, x, y, player);
      const score = localAdjacencyPenalty(sameOrthogonal) + sameDiagonal * 0.12 + (counts[player] ?? 0) / Math.max(target3, 1) * 0.2 + rng.next() * 1.35;
      if (score < bestScore) {
        bestScore = score;
        bestPlayer = player;
      }
    }
    if (bestPlayer >= 0) {
      owners[tileIndex] = bestPlayer;
      counts[bestPlayer] = (counts[bestPlayer] ?? 0) + 1;
    }
  }
  return owners;
}
function boardOrganicPenalty(owners) {
  let penalty = 0;
  for (let y = 0; y < FLOOR_ROWS; y += 1) {
    let runOwner = -2;
    let runLength = 0;
    for (let x = 0; x < FLOOR_COLS; x += 1) {
      const owner = owners[y * FLOOR_COLS + x] ?? -1;
      if (owner >= 0) {
        const same = sameOrthogonalNeighbors(owners, x, y, owner);
        penalty += localAdjacencyPenalty(same) + (same >= 3 ? 6 : 0);
      }
      if (owner === runOwner && owner >= 0) runLength += 1;
      else {
        runOwner = owner;
        runLength = 1;
      }
      if (runOwner >= 0 && runLength > 5) penalty += (runLength - 5) * 7;
    }
  }
  for (let x = 0; x < FLOOR_COLS; x += 1) {
    let runOwner = -2;
    let runLength = 0;
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      const owner = owners[y * FLOOR_COLS + x] ?? -1;
      if (owner === runOwner && owner >= 0) runLength += 1;
      else {
        runOwner = owner;
        runLength = 1;
      }
      if (runOwner >= 0 && runLength > 5) penalty += (runLength - 5) * 7;
    }
  }
  return penalty;
}
function sameOrthogonalNeighbors(owners, x, y, player) {
  return [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1]
  ].filter(([nextX = -1, nextY = -1]) => inFloorBounds(nextX, nextY) && owners[nextY * FLOOR_COLS + nextX] === player).length;
}
function sameDiagonalNeighbors(owners, x, y, player) {
  return [
    [x - 1, y - 1],
    [x + 1, y - 1],
    [x - 1, y + 1],
    [x + 1, y + 1]
  ].filter(([nextX = -1, nextY = -1]) => inFloorBounds(nextX, nextY) && owners[nextY * FLOOR_COLS + nextX] === player).length;
}
function localAdjacencyPenalty(sameOrthogonal) {
  if (sameOrthogonal === 0) return 0.85;
  if (sameOrthogonal === 1) return 0;
  if (sameOrthogonal === 2) return 0.45;
  return 4.5;
}
function parseHexColor(color) {
  if (!/^#[0-9a-f]{6}$/i.test(color)) return white;
  return {
    r: Number.parseInt(color.slice(1, 3), 16),
    g: Number.parseInt(color.slice(3, 5), 16),
    b: Number.parseInt(color.slice(5, 7), 16)
  };
}
function dimColor(color, percent) {
  return rgbToHex(scaleRgb(parseHexColor(color), percent));
}
function mixWithWhite(color, whitePercent) {
  const ratio = clamp(whitePercent, 0, 100);
  return rgbToHex(addRgb(
    scaleRgb(parseHexColor(color), 100 - ratio),
    scaleRgb(white, ratio)
  ));
}

// games/duelo/src/fixtures.ts
var twoPlayerRoster = [
  { name: "Rojo", color: "#ff3048" },
  { name: "Cian", color: "#24d9ff" }
];
var waitingGame = createGame4({ playerCount: 2, players: twoPlayerRoster, seed: 137, difficulty: "medium" });
waitingGame.init(0);
var waitingFrame = waitingGame.render();
var waitingSnapshot = waitingGame.snapshot();
var startingGame = createGame4({ playerCount: 2, players: twoPlayerRoster, seed: 137, difficulty: "hard" });
startingGame.init(0);
occupyReadyZones(startingGame, 100);
startingGame.tick({ atMillis: 1100 });
var startingFrame = startingGame.render();
var startingSnapshot = startingGame.snapshot();
var runningGame2 = createGame4({ playerCount: 2, players: twoPlayerRoster, seed: 137, difficulty: "hard" });
runningGame2.init(0);
startGame(runningGame2);
claimTargets(runningGame2, 0, 8, 3200);
claimTargets(runningGame2, 1, 5, 3400);
runningGame2.tick({ atMillis: 18700 });
var runningFrame3 = runningGame2.render();
var runningSnapshot3 = runningGame2.snapshot();
var crowdedRoster = [
  { name: "Alejandra del Equipo Rel\xE1mpago", color: "#ff3048" },
  { name: "Bruno", color: "#24d9ff" },
  { name: "Carolina", color: "#42e879" },
  { name: "Diego", color: "#ff4fd8" },
  { name: "Elena", color: "#376bff" },
  { name: "Fernando", color: "#ffd84d" },
  { name: "Gabriela", color: "#a66cff" },
  { name: "Hugo", color: "#ff8a3d" }
];
var crowdedGame = createGame4({ playerCount: 8, players: crowdedRoster, seed: 2026, difficulty: "medium" });
crowdedGame.init(0);
startGame(crowdedGame);
for (let player = 0; player < 8; player += 1) {
  claimTargets(crowdedGame, player, player + 1, 3200 + player * 50);
}
crowdedGame.tick({ atMillis: 48230 });
var crowdedRunningFrame = crowdedGame.render();
var crowdedRunningSnapshot = crowdedGame.snapshot();
var finishedGame2 = createGame4({
  playerCount: 2,
  players: twoPlayerRoster,
  seed: 137,
  difficulty: "medium",
  options: { base_fill_percent: 30 }
});
finishedGame2.init(0);
startGame(finishedGame2);
claimTargets(finishedGame2, 1, Number.POSITIVE_INFINITY, 3200);
finishedGame2.tick({ atMillis: 4200 });
var finishedFrame2 = finishedGame2.render();
var finishedSnapshot2 = finishedGame2.snapshot();
function occupyReadyZones(game8, atMillis) {
  game8.playerReadyZones().forEach((zone) => {
    game8.press({ x: zone.minX, y: zone.minY, pressed: true, atMillis });
  });
}
function startGame(game8) {
  occupyReadyZones(game8, 100);
  game8.tick({ atMillis: 3100 });
}
function claimTargets(game8, owner, limit, atMillis) {
  let claimed = 0;
  for (let y = 0; y < 32 && claimed < limit; y += 1) {
    for (let x = 0; x < 16 && claimed < limit; x += 1) {
      if (game8.targetOwner(x, y) !== owner) continue;
      game8.press({ x, y, pressed: true, atMillis: atMillis + claimed });
      claimed += 1;
    }
  }
}

// games/equilibrio/src/index.ts
var src_exports5 = {};
__export(src_exports5, {
  PlayerDisplay: () => PlayerDisplay5,
  createGame: () => createGame5,
  equilibrioChallenges: () => equilibrioChallenges,
  equilibrioDifficultyProfile: () => equilibrioDifficultyProfile,
  equilibrioGameFailMillis: () => equilibrioGameFailMillis,
  equilibrioGameWinMillis: () => equilibrioGameWinMillis,
  equilibrioMaxStability: () => equilibrioMaxStability,
  equilibrioRoundWinMillis: () => equilibrioRoundWinMillis,
  finishedFrame: () => finishedFrame3,
  finishedSnapshot: () => finishedSnapshot3,
  holdingFrame: () => holdingFrame,
  holdingSnapshot: () => holdingSnapshot,
  manifest: () => manifest5,
  roundWinFrame: () => roundWinFrame,
  roundWinSnapshot: () => roundWinSnapshot,
  runningFrame: () => runningFrame4,
  runningSnapshot: () => runningSnapshot4
});

// games/equilibrio/src/display.tsx
var import_jsx_runtime7 = __toESM(require_jsx_runtime(), 1);
var equilibrioStyles = `
.equilibrio-display{background:radial-gradient(circle at 50% 50%,rgba(95,255,158,.14),transparent 36%),linear-gradient(135deg,#031118,#07151a 48%,#17051a);display:grid;gap:26px;grid-template-columns:minmax(0,1fr) 430px;inset:0;overflow:hidden;padding:38px 44px;position:absolute}
.equilibrio-main{align-content:center;display:grid;gap:30px;justify-items:center;min-width:0}
.equilibrio-level{color:#c7d5dd;font-size:24px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
.equilibrio-level strong{color:#fff;font-size:34px;margin-left:12px}
.equilibrio-scale{align-items:end;display:grid;gap:20px;grid-template-columns:1fr 100px 1fr;width:min(100%,940px)}
.equilibrio-side{align-items:center;background:rgba(4,17,25,.9);border:4px solid var(--side);border-radius:28px;box-shadow:0 0 48px color-mix(in srgb,var(--side) 22%,transparent);display:flex;flex-direction:column;justify-content:center;min-height:280px;opacity:.58;padding:28px;text-align:center;transition:.18s ease}
.equilibrio-side.is-occupied{background:color-mix(in srgb,var(--side) 22%,#061019);box-shadow:0 0 80px color-mix(in srgb,var(--side) 48%,transparent);opacity:1;transform:translateY(-10px)}
.equilibrio-side span{color:#b9c8d1;font-size:22px;font-weight:900;letter-spacing:.1em;text-transform:uppercase}
.equilibrio-side strong{color:#fff;font-size:62px;line-height:1;margin-top:18px}
.equilibrio-pivot{align-items:center;display:flex;flex-direction:column;justify-content:flex-end}
.equilibrio-pivot i{background:linear-gradient(#5fff9e,#35d7ff);border-radius:999px 999px 10px 10px;height:260px;position:relative;width:34px}
.equilibrio-pivot i::after{background:#fff;border-radius:999px;bottom:0;box-shadow:0 0 35px #5fff9e;content:"";height:var(--balance-progress);left:0;position:absolute;width:100%}
.equilibrio-pivot b{border-left:55px solid transparent;border-right:55px solid transparent;border-top:80px solid #7b8d95;height:0;width:0}
.equilibrio-hold{color:#fff;font-size:30px;font-weight:900;min-height:42px;text-align:center}
.equilibrio-sidebar{align-content:center;display:grid;gap:18px}
.equilibrio-metric{background:rgba(5,17,23,.88);border:1px solid rgba(255,255,255,.12);border-radius:22px;display:grid;gap:8px;padding:22px 25px}
.equilibrio-metric span{color:#9eb1bb;font-size:19px;font-weight:900;letter-spacing:.1em;text-transform:uppercase}
.equilibrio-metric strong{color:#fff;font-size:58px;line-height:1}
.equilibrio-stability strong{color:var(--stability-color)}
.equilibrio-stability-bar{background:#16252b;border-radius:999px;height:13px;overflow:hidden}.equilibrio-stability-bar i{background:var(--stability-color);display:block;height:100%;width:var(--stability-width)}
.equilibrio-event{background:rgba(95,255,158,.09);border:1px solid rgba(95,255,158,.3);border-radius:20px;color:#fff;font-size:25px;font-weight:900;min-height:86px;padding:22px}
.equilibrio-overlay{align-content:center;background:#061116;display:grid;inset:0;justify-items:center;padding:60px;position:absolute;text-align:center;z-index:5}
.equilibrio-overlay strong{color:#fff;font-size:clamp(76px,8vw,140px);line-height:.95}.equilibrio-overlay span{color:#bcefd1;font-size:32px;font-weight:900;margin-top:24px}
.equilibrio-overlay.is-round{animation:equilibrioRound .8s ease-in-out infinite alternate;background:linear-gradient(125deg,#06304a,#0f5338,#483a0b,#3d0c39)}
.equilibrio-overlay.is-win{animation:equilibrioWin 1.2s linear infinite;background:linear-gradient(110deg,#06304a,#0f5338,#6c5810,#6b145e,#06304a);background-size:250% 100%}
.equilibrio-overlay.is-fail strong{color:#ff667e}
@keyframes equilibrioRound{from{filter:saturate(.85)}to{filter:saturate(1.3);transform:scale(1.015)}}@keyframes equilibrioWin{from{background-position:0 0}to{background-position:100% 0}}
@media(prefers-reduced-motion:reduce){.equilibrio-display *{animation:none!important;transition:none!important}}
`;
function PlayerDisplay5({ snapshot }) {
  const stabilityColor = snapshot.stability > 55 ? "#5fff9e" : snapshot.stability > 25 ? "#ffe176" : "#ff3151";
  const style = {
    "--balance-progress": `${Math.round(snapshot.holdMillis / Math.max(snapshot.holdTargetMillis, 1) * 100)}%`,
    "--stability-color": stabilityColor,
    "--stability-width": `${snapshot.stability}%`
  };
  const shellPhase = snapshot.phase === "round-win" ? "running" : snapshot.phase;
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(GameDisplayShell, { title: snapshot.label, phase: shellPhase, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "equilibrio-display", style, children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("style", { children: equilibrioStyles }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(PlayerReadyOverlay, { snapshot }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("main", { className: "equilibrio-main", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "equilibrio-level", children: [
        "Nivel ",
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("strong", { children: [
          snapshot.challengeIndex + 1,
          "/",
          snapshot.challengeCount
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("section", { className: "equilibrio-scale", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("article", { className: `equilibrio-side${snapshot.leftOccupied ? " is-occupied" : ""}`, style: { "--side": "#35d7ff" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { children: "Lado azul" }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("strong", { children: snapshot.leftOccupied ? "Listo" : "Busca" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "equilibrio-pivot", children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("i", {}),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("b", {})
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("article", { className: `equilibrio-side${snapshot.rightOccupied ? " is-occupied" : ""}`, style: { "--side": "#ff3bd7" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { children: "Lado rosa" }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("strong", { children: snapshot.rightOccupied ? "Listo" : "Busca" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "equilibrio-hold", children: snapshot.leftOccupied && snapshot.rightOccupied ? "Mant\xE9n las dos plataformas" : "Ocupa las dos plataformas iluminadas" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("aside", { className: "equilibrio-sidebar", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("article", { className: "equilibrio-metric equilibrio-stability", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { children: "Estabilidad" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("strong", { children: [
          snapshot.stability,
          "%"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "equilibrio-stability-bar", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("i", {}) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("article", { className: "equilibrio-metric", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { children: "Tiempo" }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("strong", { children: formatClock(snapshot.remainingMillis) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "equilibrio-event", children: snapshot.lastEventMessage || "La balanza est\xE1 preparada" })
    ] }),
    snapshot.phase === "round-win" ? /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "equilibrio-overlay is-round", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("strong", { children: "\xA1Nivel equilibrado!" }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { children: [
        snapshot.score,
        "/",
        snapshot.challengeCount,
        " niveles completados"
      ] })
    ] }) : null,
    snapshot.phase === "finished" ? /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: `equilibrio-overlay ${snapshot.success ? "is-win" : "is-fail"}`, children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("strong", { children: snapshot.success ? "\xA1Equilibrio perfecto!" : "Balanza inestable" }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { children: snapshot.success ? `${snapshot.challengeCount} niveles completados` : "Coordina los dos lados y vuelve a intentarlo" })
    ] }) : null
  ] }) });
}

// games/equilibrio/src/manifest.ts
var manifest5 = {
  id: "equilibrio",
  label: "Equilibrio",
  description: "Coordina dos lados del suelo, ocupa las plataformas sim\xE9tricas y mant\xE9n la balanza estable.",
  availability: { development: true, production: true },
  catalog: {
    category: "team",
    color: "#5fff9e",
    durationLabel: "70s",
    modeLabel: "Cooperativo",
    audioLabel: "Efectos",
    rules: [
      "Entra en las dos zonas centrales para iniciar",
      "Ocupa a la vez las dos plataformas iluminadas",
      "Mant\xE9n el equilibrio hasta completar cada nivel",
      "Evita las baldosas oscuras para conservar la estabilidad"
    ]
  },
  players: {
    allowAny: true,
    min: 2,
    max: 8
  },
  start: { mode: "player-ready", countdownMillis: 2e3, releaseGraceMillis: 1500 },
  config: {
    difficulty: {
      default: "medium",
      options: ["easy", "medium", "hard", "expert"]
    }
  },
  defaultDurationMillis: 7e4,
  display: {
    entry: "./display"
  },
  preview: {
    seed: 137,
    playerCount: 0,
    difficulty: "medium",
    actions: [
      { atMillis: 100, type: "press", x: 4, y: 16 },
      { atMillis: 180, type: "press", x: 11, y: 16 },
      { atMillis: 2250, type: "release", x: 4, y: 16 },
      { atMillis: 2260, type: "release", x: 11, y: 16 },
      { atMillis: 2400, type: "press", x: 3, y: 6 },
      { atMillis: 2480, type: "press", x: 12, y: 6 }
    ],
    captureStartMillis: 2650,
    frameCount: 24,
    frameIntervalMillis: 100
  },
  tags: ["equilibrio", "cooperativo", "coordinacion", "multijugador", "typescript"]
};

// games/equilibrio/src/game.ts
var equilibrioRoundWinMillis = 3e3;
var equilibrioGameWinMillis = 5e3;
var equilibrioGameFailMillis = 5e3;
var equilibrioMaxStability = 100;
var backgroundColor3 = "#03080a";
var leftColor = "#35d7ff";
var rightColor = "#ff3bd7";
var successColors = ["#35d7ff", "#5fff9e", "#ffe176", "#ff3bd7", "#ffffff"];
var readyZones = [
  { minX: 2, maxX: 6, minY: 14, maxY: 18 },
  { minX: 9, maxX: 13, minY: 14, maxY: 18 }
];
var equilibrioChallenges = [
  { left: { minX: 1, maxX: 4, minY: 4, maxY: 8 }, right: { minX: 11, maxX: 14, minY: 4, maxY: 8 } },
  { left: { minX: 3, maxX: 6, minY: 12, maxY: 16 }, right: { minX: 9, maxX: 12, minY: 12, maxY: 16 } },
  { left: { minX: 1, maxX: 4, minY: 22, maxY: 26 }, right: { minX: 11, maxX: 14, minY: 22, maxY: 26 } },
  { left: { minX: 4, maxX: 7, minY: 5, maxY: 9 }, right: { minX: 8, maxX: 11, minY: 22, maxY: 26 } },
  { left: { minX: 0, maxX: 3, minY: 27, maxY: 31 }, right: { minX: 12, maxX: 15, minY: 0, maxY: 4 } }
];
var difficultyProfiles = {
  easy: { holdMillis: 1200, stabilityPenalty: 8 },
  medium: { holdMillis: 1600, stabilityPenalty: 12 },
  hard: { holdMillis: 2e3, stabilityPenalty: 16 },
  expert: { holdMillis: 2400, stabilityPenalty: 20 }
};
function equilibrioDifficultyProfile(difficulty) {
  return { ...difficultyProfiles[difficulty] ?? difficultyProfiles.medium };
}
function createGame5(config) {
  return new EquilibrioGame(config);
}
var EquilibrioGame = class {
  challengeIndex = 0;
  config;
  finishedAtMillis = 0;
  heldTiles = /* @__PURE__ */ new Set();
  holdStartedAtMillis = null;
  lastEvent = gameEvent("none", "La balanza est\xE1 preparada", 0);
  nowMillis = 0;
  phase = "ready";
  players = [];
  readyGate;
  roundWinAtMillis = 0;
  stability = equilibrioMaxStability;
  startedAtMillis = 0;
  success = false;
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest5);
    this.readyGate = createPlayerReadyGate(manifest5.start, readyZones, this.config.nowMillis);
    this.resetState(this.config.nowMillis);
  }
  init(nowMillis) {
    this.resetState(nowMillis);
    this.phase = "waiting";
    this.lastEvent = gameEvent("ready", "Ocupa las dos zonas centrales", nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.update(event), event.atMillis);
    }
    if (this.phase !== "running" || !event.pressed) return [];
    const key = tileKey2(event.x, event.y);
    if (this.heldTiles.has(key)) return [];
    this.heldTiles.add(key);
    if (!this.currentPadSide(event.x, event.y)) {
      this.stability = Math.max(0, this.stability - this.profile().stabilityPenalty);
      this.holdStartedAtMillis = null;
      if (this.stability === 0) return this.finish(false, event.atMillis, "La balanza perdi\xF3 la estabilidad");
      this.lastEvent = gameEvent("miss", "Baldosa fuera de equilibrio", event.atMillis);
      return [this.lastEvent];
    }
    this.updateHoldStart(event.atMillis);
    this.lastEvent = gameEvent("hold", this.bothPadsOccupied() ? "Mant\xE9n el equilibrio" : "Falta el otro lado", event.atMillis);
    return [this.lastEvent];
  }
  release(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.update({ ...event, pressed: false }), event.atMillis);
    }
    this.heldTiles.delete(tileKey2(event.x, event.y));
    if (this.phase === "running" && !this.bothPadsOccupied()) this.holdStartedAtMillis = null;
    return [];
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.tick(event.atMillis), event.atMillis);
    }
    if (this.phase === "finished") {
      const resultMillis = this.success ? equilibrioGameWinMillis : equilibrioGameFailMillis;
      if (event.atMillis - this.finishedAtMillis >= resultMillis) {
        this.resetState(event.atMillis);
        this.phase = "waiting";
        this.lastEvent = gameEvent("ready", "Ocupa las dos zonas centrales", event.atMillis);
        return [this.lastEvent];
      }
      return [];
    }
    if (this.phase === "round-win") {
      if (event.atMillis - this.roundWinAtMillis >= equilibrioRoundWinMillis) {
        this.challengeIndex += 1;
        this.phase = "running";
        this.heldTiles.clear();
        this.holdStartedAtMillis = null;
        this.lastEvent = gameEvent("start", `Nivel ${this.challengeIndex + 1}`, event.atMillis);
        return [this.lastEvent];
      }
      return [];
    }
    if (this.phase !== "running") return [];
    if (this.remainingMillis() <= 0) return this.finish(false, event.atMillis, "Se acab\xF3 el tiempo");
    this.updateHoldStart(event.atMillis);
    if (this.holdStartedAtMillis !== null && event.atMillis - this.holdStartedAtMillis >= this.profile().holdMillis) {
      if (this.challengeIndex + 1 >= equilibrioChallenges.length) {
        return this.finish(true, event.atMillis, "Equilibrio perfecto");
      }
      this.phase = "round-win";
      this.roundWinAtMillis = event.atMillis;
      this.holdStartedAtMillis = null;
      this.players = this.scoredPlayers();
      this.lastEvent = gameEvent("round-win", `Nivel ${this.challengeIndex + 1} superado`, event.atMillis);
      return [this.lastEvent];
    }
    return [];
  }
  render() {
    const frame = createFrame(backgroundColor3);
    this.paintBoard(frame);
    if (this.phase === "waiting" || this.phase === "starting") {
      readyZones.forEach((zone, index) => {
        const ready = this.readyGate.zoneReady(index, this.nowMillis);
        fillFrameRect(frame, zone.minX, zone.minY, zone.maxX, zone.maxY, ready ? "#ffffff" : index === 0 ? leftColor : rightColor);
      });
      const radius = 2 + Math.floor(this.nowMillis / 150) % 9;
      paintDiamondRing(frame, { centerX: 8, centerY: 16, color: this.phase === "starting" ? "#ffe176" : "#5fff9e", radius });
      return frame;
    }
    if (this.phase === "round-win") {
      this.paintRoundWin(frame);
      return frame;
    }
    if (this.phase === "finished") {
      this.paintResult(frame);
      return frame;
    }
    const challenge = equilibrioChallenges[this.challengeIndex];
    if (challenge) {
      this.paintPad(frame, challenge.left, leftColor, this.padOccupied(challenge.left));
      this.paintPad(frame, challenge.right, rightColor, this.padOccupied(challenge.right));
    }
    const progress = this.holdProgress();
    const progressCells = Math.round(progress * FLOOR_ROWS);
    for (let offset = 0; offset < progressCells; offset += 1) {
      paintFrameCell(frame, 7, FLOOR_ROWS - 1 - offset, "#5fff9e");
      paintFrameCell(frame, 8, FLOOR_ROWS - 1 - offset, "#5fff9e");
    }
    return frame;
  }
  snapshot() {
    const readyState = this.readyGate.state(this.nowMillis);
    const completed = this.challengeIndex + Number(this.phase === "round-win" || this.success);
    return {
      currentGame: manifest5.id,
      label: manifest5.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: this.players,
      score: Math.min(completed, equilibrioChallenges.length),
      lives: -1,
      elapsedMillis: this.elapsedMillis(),
      remainingMillis: this.remainingMillis(),
      activeTargets: this.phase === "running" ? 2 : 0,
      success: this.success,
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? readyState.countdownMillis : 0,
      readyPlayers: readyState.readyPlayers,
      requiredPlayers: readyState.requiredPlayers,
      matchTarget: equilibrioChallenges.length,
      challengeCount: equilibrioChallenges.length,
      challengeIndex: Math.min(this.challengeIndex, equilibrioChallenges.length - 1),
      holdMillis: Math.round(this.holdProgress() * this.profile().holdMillis),
      holdTargetMillis: this.profile().holdMillis,
      leftOccupied: this.currentPadOccupied("left"),
      rightOccupied: this.currentPadOccupied("right"),
      stability: this.stability,
      stage: this.phase === "finished" ? this.success ? "game-win" : "game-fail" : this.phase === "round-win" ? "round-win" : this.phase === "running" ? "balancing" : "waiting"
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest5);
    this.readyGate = createPlayerReadyGate(manifest5.start, readyZones, this.config.nowMillis);
    this.resetState(this.config.nowMillis);
    this.phase = "waiting";
    this.lastEvent = gameEvent("ready", "Ocupa las dos zonas centrales", this.config.nowMillis);
  }
  applyReadyTransition(transition, nowMillis) {
    if (transition === "players-ready") {
      this.phase = "starting";
      this.lastEvent = gameEvent("ready", "Balanza preparada", nowMillis);
      return [this.lastEvent];
    }
    if (transition === "players-left") {
      this.phase = "waiting";
      this.lastEvent = gameEvent("ready", "Vuelve a las dos zonas centrales", nowMillis);
      return [this.lastEvent];
    }
    if (transition === "started") {
      this.phase = "running";
      this.startedAtMillis = nowMillis;
      this.heldTiles.clear();
      this.lastEvent = gameEvent("start", "Busca las dos plataformas", nowMillis);
      return [this.lastEvent];
    }
    return [];
  }
  finish(success, atMillis, message) {
    this.phase = "finished";
    this.success = success;
    this.finishedAtMillis = atMillis;
    this.heldTiles.clear();
    this.holdStartedAtMillis = null;
    if (success) this.challengeIndex = equilibrioChallenges.length - 1;
    this.players = this.scoredPlayers();
    this.lastEvent = gameEvent(success ? "win" : "fail", message, atMillis);
    return [this.lastEvent];
  }
  paintBoard(frame) {
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      paintFrameCell(frame, 7, y, "#10242c");
      paintFrameCell(frame, 8, y, "#281329");
    }
    for (let y = 3; y < FLOOR_ROWS; y += 6) {
      fillFrameRect(frame, 0, y, 6, y, "#07151b");
      fillFrameRect(frame, 9, y, FLOOR_COLS - 1, y, "#190a1c");
    }
  }
  paintPad(frame, zone, color, occupied) {
    fillFrameRect(frame, zone.minX, zone.minY, zone.maxX, zone.maxY, occupied ? "#ffffff" : color);
    const insetColor = occupied ? color : "#061015";
    if (zone.maxX - zone.minX > 1 && zone.maxY - zone.minY > 1) {
      fillFrameRect(frame, zone.minX + 1, zone.minY + 1, zone.maxX - 1, zone.maxY - 1, insetColor);
    }
  }
  paintRoundWin(frame) {
    const elapsed = Math.max(0, this.nowMillis - this.roundWinAtMillis);
    paintDiamondWave(frame, {
      centerX: 8,
      centerY: 16,
      color: ({ distance, step }) => successColors[(distance + step) % successColors.length],
      period: 7,
      bandWidth: 4,
      step: Math.floor(elapsed / 90)
    });
  }
  paintResult(frame) {
    const elapsed = Math.max(0, this.nowMillis - this.finishedAtMillis);
    if (this.success) {
      paintDiamondWave(frame, {
        centerX: 8,
        centerY: 16,
        color: ({ distance, step }) => successColors[(distance + step) % successColors.length],
        period: 9,
        bandWidth: 6,
        step: Math.floor(elapsed / 85)
      });
      return;
    }
    fillFrameRect(frame, 0, 0, FLOOR_COLS - 1, FLOOR_ROWS - 1, Math.floor(elapsed / 180) % 2 === 0 ? "#4a0715" : "#17030a");
    paintDiamondRing(frame, { centerX: 8, centerY: 16, color: "#ff3151", radius: 2 + Math.floor(elapsed / 100) % 13 });
  }
  updateHoldStart(atMillis) {
    if (this.bothPadsOccupied()) {
      this.holdStartedAtMillis ??= atMillis;
    } else {
      this.holdStartedAtMillis = null;
    }
  }
  bothPadsOccupied() {
    return this.currentPadOccupied("left") && this.currentPadOccupied("right");
  }
  currentPadOccupied(side) {
    const challenge = equilibrioChallenges[this.challengeIndex];
    return challenge ? this.padOccupied(challenge[side]) : false;
  }
  padOccupied(zone) {
    for (let y = zone.minY; y <= zone.maxY; y += 1) {
      for (let x = zone.minX; x <= zone.maxX; x += 1) {
        if (this.heldTiles.has(tileKey2(x, y))) return true;
      }
    }
    return false;
  }
  currentPadSide(x, y) {
    const challenge = equilibrioChallenges[this.challengeIndex];
    if (!challenge) return null;
    if (insideZone(x, y, challenge.left)) return "left";
    if (insideZone(x, y, challenge.right)) return "right";
    return null;
  }
  holdProgress() {
    if (this.holdStartedAtMillis === null || !this.bothPadsOccupied()) return 0;
    return Math.max(0, Math.min(1, (this.nowMillis - this.holdStartedAtMillis) / this.profile().holdMillis));
  }
  profile() {
    return difficultyProfiles[this.config.difficulty] ?? difficultyProfiles.medium;
  }
  elapsedMillis() {
    if (this.phase === "waiting" || this.phase === "starting" || this.phase === "ready") return 0;
    return Math.max(0, this.nowMillis - this.startedAtMillis);
  }
  remainingMillis() {
    return Math.max(0, this.config.durationMillis - this.elapsedMillis());
  }
  scoredPlayers() {
    const score = Math.min(this.challengeIndex + Number(this.phase === "round-win" || this.success), equilibrioChallenges.length);
    return defaultPlayers(this.config.playerCount, this.config.players).map((player) => ({ ...player, label: player.label || `Jugador ${player.index + 1}`, score, lives: -1 }));
  }
  resetState(nowMillis) {
    this.challengeIndex = 0;
    this.finishedAtMillis = 0;
    this.heldTiles.clear();
    this.holdStartedAtMillis = null;
    this.nowMillis = nowMillis;
    this.phase = "ready";
    this.readyGate.reset(nowMillis);
    this.roundWinAtMillis = 0;
    this.stability = equilibrioMaxStability;
    this.startedAtMillis = nowMillis;
    this.success = false;
    this.players = this.scoredPlayers();
  }
};
function tileKey2(x, y) {
  return `${x},${y}`;
}
function insideZone(x, y, zone) {
  return x >= zone.minX && x <= zone.maxX && y >= zone.minY && y <= zone.maxY;
}

// games/equilibrio/src/fixtures.ts
function startedGame() {
  const game8 = createGame5({ playerCount: 0, durationMillis: manifest5.defaultDurationMillis, difficulty: "medium" });
  game8.init(0);
  game8.press({ x: 4, y: 16, pressed: true, atMillis: 100 });
  game8.press({ x: 11, y: 16, pressed: true, atMillis: 180 });
  game8.tick({ atMillis: 2180 });
  game8.release({ x: 4, y: 16, pressed: false, atMillis: 2200 });
  game8.release({ x: 11, y: 16, pressed: false, atMillis: 2210 });
  return game8;
}
var runningGame3 = startedGame();
var runningFrame4 = runningGame3.render();
var runningSnapshot4 = runningGame3.snapshot();
var holdingGame = startedGame();
holdingGame.press({ x: 3, y: 6, pressed: true, atMillis: 2300 });
holdingGame.press({ x: 12, y: 6, pressed: true, atMillis: 2350 });
holdingGame.tick({ atMillis: 3150 });
var holdingFrame = holdingGame.render();
var holdingSnapshot = holdingGame.snapshot();
var roundWinGame = startedGame();
roundWinGame.press({ x: 3, y: 6, pressed: true, atMillis: 2300 });
roundWinGame.press({ x: 12, y: 6, pressed: true, atMillis: 2350 });
roundWinGame.tick({ atMillis: 2350 + equilibrioDifficultyProfile("medium").holdMillis });
var roundWinFrame = roundWinGame.render();
var roundWinSnapshot = roundWinGame.snapshot();
var finishedGame3 = startedGame();
var clock = 2300;
for (const challenge of equilibrioChallenges) {
  const left = { x: challenge.left.minX, y: challenge.left.minY };
  const right = { x: challenge.right.minX, y: challenge.right.minY };
  finishedGame3.press({ ...left, pressed: true, atMillis: clock });
  finishedGame3.press({ ...right, pressed: true, atMillis: clock + 50 });
  clock += equilibrioDifficultyProfile("medium").holdMillis + 50;
  finishedGame3.tick({ atMillis: clock });
  if (finishedGame3.snapshot().phase === "round-win") {
    clock += equilibrioRoundWinMillis;
    finishedGame3.tick({ atMillis: clock });
  }
  clock += 50;
}
var finishedFrame3 = finishedGame3.render();
var finishedSnapshot3 = finishedGame3.snapshot();

// games/estela/src/index.ts
var src_exports6 = {};
__export(src_exports6, {
  PlayerDisplay: () => PlayerDisplay6,
  createGame: () => createGame6,
  estelaStartPositions: () => estelaStartPositions,
  finishedFrame: () => finishedFrame4,
  finishedSnapshot: () => finishedSnapshot4,
  gameWinAnimationMillis: () => gameWinAnimationMillis2,
  initEvents: () => initEvents2,
  manifest: () => manifest6,
  roundWinAnimationMillis: () => roundWinAnimationMillis,
  roundWinFrame: () => roundWinFrame2,
  roundWinSnapshot: () => roundWinSnapshot2,
  roundsToWin: () => roundsToWin,
  runningFrame: () => runningFrame5,
  runningSnapshot: () => runningSnapshot5
});

// games/estela/src/display.tsx
var import_jsx_runtime8 = __toESM(require_jsx_runtime(), 1);
var estelaStyles = `
.estela-display .duelo-hero { grid-template-columns: minmax(0,1fr) 480px; }
.estela-display .duelo-player-grid { align-content: stretch; }
.estela-display .duelo-player-card.is-eliminated { filter: grayscale(.78); opacity: .48; }
.estela-display .duelo-player-card.is-round-winner,
.estela-display .duelo-player-card.is-game-winner { animation: estelaWinnerCard .7s ease-in-out infinite alternate; }
.estela-display .duelo-player-track > i { width: var(--estela-trail-progress); }
.estela-display .duelo-player-card footer strong { color: var(--duelo-player); }
.estela-result { align-content:center; background:rgba(3,6,14,.9); display:grid; inset:0; justify-items:center; position:absolute; z-index:4; }
.estela-result strong { color:#fff; font-size:clamp(66px,5vw,96px); line-height:1; text-align:center; }
.estela-result span { color:#36d9ff; font-size:25px; font-weight:900; margin-top:18px; text-transform:uppercase; }
.estela-result.is-round-win { animation:estelaRoundWin .58s ease-in-out infinite alternate; }
.estela-result.is-game-win { animation:estelaGameWin .9s linear infinite; background:linear-gradient(100deg,rgba(3,6,14,.94),rgba(216,92,255,.28),rgba(38,217,255,.28),rgba(3,6,14,.94)); background-size:220% 100%; }
@keyframes estelaWinnerCard { from { filter:brightness(1); } to { filter:brightness(1.3); } }
@keyframes estelaRoundWin { from { box-shadow:inset 0 0 40px rgba(54,217,255,.14); } to { box-shadow:inset 0 0 110px rgba(216,92,255,.42); } }
@keyframes estelaGameWin { from { background-position:0 0; } to { background-position:100% 0; } }
@media (prefers-reduced-motion:reduce) { .estela-display *, .estela-display *::before, .estela-display *::after { animation:none!important; transition:none!important; } }
`;
function PlayerDisplay6({ snapshot }) {
  const hero = heroContent2(snapshot);
  const shellPhase = snapshot.phase === "round-win" ? "running" : snapshot.phase;
  const winner = snapshot.gameWinnerIndex >= 0 ? snapshot.playerProgress[snapshot.gameWinnerIndex] : void 0;
  const roundWinner = snapshot.roundWinnerIndex >= 0 ? snapshot.playerProgress[snapshot.roundWinnerIndex] : void 0;
  const columns = snapshot.playerCount <= 4 ? 2 : snapshot.playerCount <= 6 ? 3 : 4;
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(GameDisplayShell, { title: snapshot.label, phase: shellPhase, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: `duelo-display estela-display is-phase-${snapshot.phase}`, style: { "--duelo-grid-columns": columns }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("style", { children: estelaStyles }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(PlayerReadyOverlay, { snapshot }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("section", { className: "duelo-hero", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "duelo-hero-copy", children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { children: hero.eyebrow }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("strong", { children: hero.title }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("b", { children: hero.caption })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "duelo-hero-metrics", children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Metric, { label: "Ronda", value: snapshot.currentRound }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Metric, { label: "En pie", value: snapshot.activeTargets }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Metric, { label: "Borde", value: snapshot.arenaInset })
      ] }),
      snapshot.phase === "round-win" && roundWinner ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Result, { className: "is-round-win", title: `Ronda para ${roundWinner.label}`, caption: "La siguiente ronda empieza en breve" }) : null,
      snapshot.phase === "finished" && winner ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Result, { className: "is-game-win", title: `\xA1Gana ${winner.label}!`, caption: `${winner.roundWins} rondas ganadas` }) : null
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("section", { className: "duelo-player-grid", "aria-label": "Jugadores de Estela", children: snapshot.playerProgress.map((player) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(PlayerCard, { player, roundWinner: snapshot.roundWinnerIndex === player.index, gameWinner: snapshot.gameWinnerIndex === player.index, target: snapshot.roundsToWin }, player.index)) }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("footer", { className: "duelo-event-rail", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { children: "\xDAltimo evento" }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("strong", { children: snapshot.lastEventMessage }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("b", { children: [
        "Primero en ganar ",
        snapshot.roundsToWin,
        " rondas"
      ] })
    ] })
  ] }) });
}
function PlayerCard({ player, roundWinner, gameWinner, target: target3 }) {
  const style = {
    "--duelo-player": player.color,
    "--duelo-player-rgb": hexToRgb3(player.color),
    "--duelo-progress": player.roundWins / Math.max(target3, 1),
    "--estela-trail-progress": `${Math.min(100, player.trailLength * 5)}%`
  };
  const classes = `${player.alive ? "" : " is-eliminated"}${roundWinner ? " is-round-winner" : ""}${gameWinner ? " is-game-winner" : ""}`;
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("article", { className: `duelo-player-card${classes}`, style, children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("header", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("i", {}),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "duelo-player-name", children: player.label }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("b", { children: gameWinner ? "Ganador" : roundWinner ? "Gana la ronda" : player.alive ? "En juego" : "Eliminado" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "duelo-player-score", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("strong", { children: player.roundWins }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { children: "rondas" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "duelo-player-track", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("i", {}) }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("footer", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { children: "Longitud de estela" }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("strong", { children: player.trailLength })
    ] })
  ] });
}
function Metric({ label, value }) {
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("article", { className: "duelo-hero-metric", children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("strong", { children: value })
  ] });
}
function Result({ className, title, caption }) {
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: `estela-result ${className}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("strong", { children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { children: caption })
  ] });
}
function heroContent2(snapshot) {
  if (snapshot.phase === "waiting") return { eyebrow: `Listos ${snapshot.readyPlayers}/${snapshot.requiredPlayers}`, title: "Busca tu color", caption: "Cada jugador permanece en su plataforma" };
  if (snapshot.phase === "starting") return { eyebrow: "Todos listos", title: String(Math.max(1, Math.ceil((snapshot.countdownMillis ?? 0) / 1e3))), caption: "Prepara tu primera direcci\xF3n" };
  if (snapshot.phase === "round-win") return { eyebrow: `Ronda ${snapshot.currentRound}`, title: "\xDAltimo en pie", caption: "Las estelas se reinician para la siguiente ronda" };
  if (snapshot.phase === "finished") return { eyebrow: "Partida terminada", title: "Victoria", caption: "La luz m\xE1s resistente domina la pista" };
  return { eyebrow: `Ronda ${snapshot.currentRound}`, title: "\xA1No cruces las estelas!", caption: "El borde rojo se acerca durante la ronda" };
}
function hexToRgb3(color) {
  return /^#[0-9a-f]{6}$/i.test(color) ? [1, 3, 5].map((offset) => Number.parseInt(color.slice(offset, offset + 2), 16)).join(", ") : "255, 255, 255";
}

// games/estela/src/manifest.ts
var manifest6 = {
  id: "estela",
  label: "Estela",
  description: "Dibuja una estela de luz, evita todos los rastros y s\xE9 el \xFAltimo jugador en pie.",
  availability: { development: true, production: true },
  catalog: {
    category: "versus",
    color: "#d85cff",
    durationLabel: "Al mejor de 3",
    modeLabel: "Supervivencia de luz",
    audioLabel: "M\xFAsica + efectos",
    rules: [
      "Cada jugador empieza en la plataforma de su color",
      "Mu\xE9vete para extender tu estela sin tocar ning\xFAn rastro",
      "El \xFAltimo jugador en pie gana la ronda"
    ]
  },
  players: { allowAny: false, min: 2, max: 8 },
  start: { mode: "player-ready", countdownMillis: 3e3, releaseGraceMillis: 2e3 },
  config: { difficulty: { default: "medium", options: ["easy", "medium", "hard"] } },
  defaultDurationMillis: 0,
  display: { entry: "./display" },
  preview: {
    seed: 137,
    playerCount: 4,
    difficulty: "medium",
    actions: [
      { atMillis: 100, type: "press", x: 2, y: 2 },
      { atMillis: 100, type: "press", x: 13, y: 29 },
      { atMillis: 100, type: "press", x: 13, y: 2 },
      { atMillis: 100, type: "press", x: 2, y: 29 }
    ],
    captureStartMillis: 3300,
    frameCount: 24,
    frameIntervalMillis: 120
  },
  tags: ["competitive", "multiplayer", "light-trails", "typescript"]
};

// games/estela/src/game.ts
var roundsToWin = 2;
var roundWinAnimationMillis = 1800;
var gameWinAnimationMillis2 = 3200;
var playerColors = ["#ff365c", "#26d9ff", "#66ff9a", "#ffe176", "#d85cff", "#ff8a36", "#ffffff", "#3d73ff"];
var allStartPositions = [
  { x: 2, y: 2 },
  { x: 13, y: 29 },
  { x: 13, y: 2 },
  { x: 2, y: 29 },
  { x: 7, y: 2 },
  { x: 8, y: 29 },
  { x: 2, y: 15 },
  { x: 13, y: 16 }
];
var shrinkIntervals = { easy: 18e3, medium: 13e3, hard: 9e3 };
function createGame6(config) {
  return new EstelaGame(config);
}
function estelaStartPositions(count) {
  return allStartPositions.slice(0, count).map((position) => ({ ...position }));
}
var EstelaGame = class {
  alive = [];
  config;
  currentPositions = [];
  currentRound = 1;
  finishedAtMillis;
  gameWinnerIndex = -1;
  lastEvent = gameEvent("none", "Busca tu plataforma", 0);
  nowMillis = 0;
  phase = "ready";
  players = [];
  readyGate;
  roundStartedAtMillis = 0;
  roundTransitionAtMillis = 0;
  roundWinnerIndex = -1;
  roundWins = [];
  startPositions = [];
  trails = /* @__PURE__ */ new Map();
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest6);
    this.startPositions = estelaStartPositions(this.config.playerCount);
    this.readyGate = createPlayerReadyGate(manifest6.start, this.readyZones(), this.config.nowMillis);
    this.resetState(this.config.nowMillis);
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
    if (this.phase !== "running" || !event.pressed) return [];
    const playerIndex = this.nearestAlivePlayer(event.x, event.y);
    if (playerIndex < 0) return [];
    if (!this.inArena(event.x, event.y) || this.trails.has(tileKey3(event.x, event.y))) {
      return this.eliminate(playerIndex, event.atMillis);
    }
    this.currentPositions[playerIndex] = { x: event.x, y: event.y };
    this.trails.set(tileKey3(event.x, event.y), playerIndex);
    this.players = this.scoredPlayers();
    this.lastEvent = gameEvent("move", `${this.playerLabel(playerIndex)} extiende su estela`, event.atMillis);
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
    if (this.phase === "round-win" && event.atMillis - this.roundTransitionAtMillis >= roundWinAnimationMillis) {
      if ((this.roundWins[this.roundWinnerIndex] ?? 0) >= roundsToWin) {
        this.phase = "finished";
        this.gameWinnerIndex = this.roundWinnerIndex;
        this.finishedAtMillis = event.atMillis;
        this.lastEvent = gameEvent("win", `\xA1Gana ${this.playerLabel(this.gameWinnerIndex)}!`, event.atMillis);
      } else {
        this.currentRound += 1;
        this.resetRound(event.atMillis);
        this.phase = "running";
        this.lastEvent = gameEvent("start", `Ronda ${this.currentRound}`, event.atMillis);
      }
      return [this.lastEvent];
    }
    if (this.phase !== "running") return [];
    const events = [];
    for (const [index, position] of this.currentPositions.entries()) {
      if (this.alive[index] && !this.inArena(position.x, position.y)) events.push(...this.eliminate(index, event.atMillis));
      if (this.phase !== "running") break;
    }
    return events;
  }
  render() {
    const frame = createFrame("#02030a");
    if (this.phase === "waiting" || this.phase === "starting") {
      this.startPositions.forEach((position, index) => {
        const step = Math.floor(this.nowMillis / (this.phase === "starting" ? 100 : 180));
        paintDiamondRing(frame, { centerX: position.x, centerY: position.y, radius: 1 + step % 3, color: playerColors[index] ?? "#ffffff" });
        paintFrameCell(frame, position.x, position.y, playerColors[index] ?? "#ffffff");
      });
      return frame;
    }
    if (this.phase === "finished") {
      const step = Math.floor((this.nowMillis - (this.finishedAtMillis ?? this.nowMillis)) / 110);
      paintDiamondWave(frame, {
        color: ({ distance }) => playerColors[(distance + step) % playerColors.length] ?? "#ffffff",
        step
      });
      return frame;
    }
    if (this.phase === "round-win") {
      const winnerColor = playerColors[this.roundWinnerIndex] ?? "#ffffff";
      fillFrameRect(frame, 0, 0, FLOOR_COLS, FLOOR_ROWS, "#050812");
      const step = Math.floor((this.nowMillis - this.roundTransitionAtMillis) / 130);
      paintDiamondWave(frame, { color: winnerColor, step });
      return frame;
    }
    const inset = this.arenaInset();
    for (let border = 0; border < inset; border += 1) {
      fillFrameRect(frame, border, border, FLOOR_COLS - border * 2, 1, "#ff244d");
      fillFrameRect(frame, border, FLOOR_ROWS - border - 1, FLOOR_COLS - border * 2, 1, "#ff244d");
      fillFrameRect(frame, border, border, 1, FLOOR_ROWS - border * 2, "#ff244d");
      fillFrameRect(frame, FLOOR_COLS - border - 1, border, 1, FLOOR_ROWS - border * 2, "#ff244d");
    }
    for (const [key, owner] of this.trails) {
      const [x, y] = parseTile2(key);
      paintFrameCell(frame, x, y, playerColors[owner] ?? "#ffffff");
    }
    this.currentPositions.forEach((position, index) => {
      if (this.alive[index]) paintFrameCell(frame, position.x, position.y, "#ffffff");
    });
    return frame;
  }
  snapshot() {
    const ready = this.readyGate.state(this.nowMillis);
    return {
      currentGame: manifest6.id,
      label: manifest6.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: this.players,
      score: Math.max(...this.roundWins, 0),
      lives: -1,
      elapsedMillis: this.phase === "waiting" || this.phase === "starting" ? 0 : Math.max(0, this.nowMillis - this.roundStartedAtMillis),
      remainingMillis: 0,
      activeTargets: this.alive.filter(Boolean).length,
      success: this.phase === "finished",
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? ready.countdownMillis : 0,
      readyPlayers: ready.readyPlayers,
      requiredPlayers: ready.requiredPlayers,
      matchTarget: roundsToWin,
      arenaInset: this.arenaInset(),
      currentRound: this.currentRound,
      gameWinnerIndex: this.gameWinnerIndex,
      playerProgress: this.progress(),
      roundWinnerIndex: this.roundWinnerIndex,
      roundsToWin,
      startPositions: this.startPositions.map((position) => ({ ...position })),
      trailCells: [...this.trails].map(([key, playerIndex]) => {
        const [x, y] = parseTile2(key);
        return { x, y, playerIndex };
      }),
      roundWinMillis: this.phase === "round-win" ? Math.max(0, roundWinAnimationMillis - (this.nowMillis - this.roundTransitionAtMillis)) : 0,
      gameWinMillis: this.phase === "finished" ? Math.min(gameWinAnimationMillis2, Math.max(0, this.nowMillis - (this.finishedAtMillis ?? this.nowMillis))) : 0
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest6);
    this.startPositions = estelaStartPositions(this.config.playerCount);
    this.readyGate = createPlayerReadyGate(manifest6.start, this.readyZones(), this.config.nowMillis);
    this.resetState(this.config.nowMillis);
  }
  applyReadyTransition(transition, nowMillis) {
    if (transition === "players-ready") {
      this.phase = "starting";
      this.lastEvent = gameEvent("ready", "Todos en posici\xF3n", nowMillis);
    } else if (transition === "players-left") {
      this.phase = "waiting";
      this.lastEvent = gameEvent("ready", "Vuelve a tu color", nowMillis);
    } else if (transition === "started") {
      this.phase = "running";
      this.resetRound(nowMillis);
      this.lastEvent = gameEvent("start", "\xA1Deja tu estela!", nowMillis);
    } else return [];
    return [this.lastEvent];
  }
  arenaInset() {
    if (this.phase !== "running") return 0;
    const interval = shrinkIntervals[this.config.difficulty] ?? shrinkIntervals.medium;
    return Math.min(4, Math.floor(Math.max(0, this.nowMillis - this.roundStartedAtMillis) / interval));
  }
  eliminate(playerIndex, atMillis) {
    if (!this.alive[playerIndex]) return [];
    this.alive[playerIndex] = false;
    const event = gameEvent("miss", `${this.playerLabel(playerIndex)} queda fuera`, atMillis);
    this.lastEvent = event;
    if (this.alive.filter(Boolean).length <= 1) {
      const winnerIndex = this.alive.findIndex(Boolean);
      if (winnerIndex >= 0) {
        this.roundWinnerIndex = winnerIndex;
        this.roundWins[winnerIndex] = (this.roundWins[winnerIndex] ?? 0) + 1;
        this.players = this.scoredPlayers();
        this.phase = "round-win";
        this.roundTransitionAtMillis = atMillis;
        this.lastEvent = gameEvent("round-win", `Ronda para ${this.playerLabel(winnerIndex)}`, atMillis);
        return [event, this.lastEvent];
      }
    }
    this.players = this.scoredPlayers();
    return [event];
  }
  inArena(x, y) {
    const inset = this.arenaInset();
    return x >= inset && x < FLOOR_COLS - inset && y >= inset && y < FLOOR_ROWS - inset;
  }
  nearestAlivePlayer(x, y) {
    let best = -1;
    let bestDistance = Number.POSITIVE_INFINITY;
    this.currentPositions.forEach((position, index) => {
      if (!this.alive[index]) return;
      const distance = Math.abs(position.x - x) + Math.abs(position.y - y);
      if (distance < bestDistance) {
        best = index;
        bestDistance = distance;
      }
    });
    return best;
  }
  playerLabel(index) {
    return this.players[index]?.label ?? `Jugador ${index + 1}`;
  }
  progress() {
    return this.players.map((player, index) => ({
      index,
      label: player.label,
      color: player.color,
      alive: this.alive[index] ?? false,
      roundWins: this.roundWins[index] ?? 0,
      trailLength: [...this.trails.values()].filter((owner) => owner === index).length
    }));
  }
  readyZones() {
    return this.startPositions.map(({ x, y }) => ({
      minX: Math.max(0, x - 1),
      maxX: Math.min(FLOOR_COLS - 1, x + 1),
      minY: Math.max(0, y - 1),
      maxY: Math.min(FLOOR_ROWS - 1, y + 1)
    }));
  }
  resetRound(nowMillis) {
    this.alive = this.startPositions.map(() => true);
    this.currentPositions = this.startPositions.map((position) => ({ ...position }));
    this.roundStartedAtMillis = nowMillis;
    this.roundWinnerIndex = -1;
    this.trails.clear();
    this.startPositions.forEach((position, index) => this.trails.set(tileKey3(position.x, position.y), index));
    this.players = this.scoredPlayers();
  }
  resetState(nowMillis) {
    this.readyGate.reset(nowMillis);
    this.currentRound = 1;
    this.finishedAtMillis = void 0;
    this.gameWinnerIndex = -1;
    this.lastEvent = gameEvent("ready", "Busca tu plataforma de color", nowMillis);
    this.nowMillis = nowMillis;
    this.phase = "waiting";
    this.roundTransitionAtMillis = 0;
    this.roundWins = this.startPositions.map(() => 0);
    this.players = defaultPlayers(this.config.playerCount, this.config.players).map((player, index) => ({
      ...player,
      label: this.config.players[index]?.label || this.config.players[index]?.name || `Jugador ${index + 1}`,
      color: this.config.players[index]?.color ?? playerColors[index] ?? "#ffffff",
      lives: -1,
      score: 0
    }));
    this.resetRound(nowMillis);
  }
  scoredPlayers() {
    return this.players.map((player, index) => ({ ...player, score: this.roundWins[index] ?? 0, lives: -1 }));
  }
};
function tileKey3(x, y) {
  return `${x},${y}`;
}
function parseTile2(key) {
  const [x = "0", y = "0"] = key.split(",");
  return [Number(x), Number(y)];
}

// games/estela/src/fixtures.ts
var runningGame4 = createGame6({ playerCount: 4, difficulty: "medium" });
var initEvents2 = runningGame4.init(0);
start(runningGame4);
runningGame4.press({ x: 3, y: 2, pressed: true, atMillis: 3200 });
var runningFrame5 = runningGame4.render();
var runningSnapshot5 = runningGame4.snapshot();
var roundWinGame2 = createGame6({ playerCount: 2 });
roundWinGame2.init(0);
start(roundWinGame2);
eliminateFirst(roundWinGame2, 3200);
var roundWinFrame2 = roundWinGame2.render();
var roundWinSnapshot2 = roundWinGame2.snapshot();
roundWinGame2.tick({ atMillis: 3201 + roundWinAnimationMillis });
eliminateFirst(roundWinGame2, 5200);
roundWinGame2.tick({ atMillis: 5201 + roundWinAnimationMillis });
roundWinGame2.tick({ atMillis: 7500 });
var finishedFrame4 = roundWinGame2.render();
var finishedSnapshot4 = roundWinGame2.snapshot();
function start(game8) {
  game8.snapshot().startPositions.forEach((position) => game8.press({ ...position, pressed: true, atMillis: 100 }));
  game8.tick({ atMillis: 3100 });
}
function eliminateFirst(game8, atMillis) {
  game8.press({ x: 3, y: 2, pressed: true, atMillis });
  game8.press({ x: 2, y: 2, pressed: true, atMillis: atMillis + 1 });
}

// games/guardianes/src/index.ts
var src_exports7 = {};
__export(src_exports7, {
  PlayerDisplay: () => PlayerDisplay7,
  createGame: () => createGame7,
  damagedFrame: () => damagedFrame,
  damagedSnapshot: () => damagedSnapshot,
  defendedFrame: () => defendedFrame,
  defendedSnapshot: () => defendedSnapshot,
  failedFrame: () => failedFrame,
  failedSnapshot: () => failedSnapshot,
  finishedFrame: () => finishedFrame5,
  finishedSnapshot: () => finishedSnapshot5,
  guardianLanes: () => guardianLanes,
  guardianesDifficultyProfile: () => guardianesDifficultyProfile,
  guardianesGameFailMillis: () => guardianesGameFailMillis,
  guardianesGameWinMillis: () => guardianesGameWinMillis,
  guardianesMaxLives: () => guardianesMaxLives,
  guardianesThreatChart: () => guardianesThreatChart,
  manifest: () => manifest7,
  runningFrame: () => runningFrame6,
  runningSnapshot: () => runningSnapshot6
});

// games/guardianes/src/manifest.ts
var manifest7 = {
  id: "guardianes",
  label: "Guardianes",
  description: "Activa los cuatro escudos del suelo y protege el n\xFAcleo de una oleada de amenazas.",
  availability: { development: true, production: true },
  catalog: {
    category: "arcade",
    color: "#35d7ff",
    durationLabel: "42s",
    modeLabel: "Defensa cooperativa",
    audioLabel: "Efectos",
    rules: [
      "Entra en el n\xFAcleo central para iniciar",
      "Observa por qu\xE9 carril baja cada amenaza",
      "Pisa el escudo del mismo color antes del impacto",
      "Protege las cuatro vidas del n\xFAcleo hasta el final"
    ]
  },
  players: {
    allowAny: true,
    min: 1,
    max: 8
  },
  start: { mode: "player-ready", countdownMillis: 2e3, releaseGraceMillis: 1200 },
  config: {
    difficulty: {
      default: "medium",
      options: ["easy", "medium", "hard", "expert"]
    }
  },
  defaultDurationMillis: 42e3,
  display: {
    entry: "./display"
  },
  preview: {
    seed: 137,
    playerCount: 0,
    difficulty: "medium",
    actions: [
      { atMillis: 100, type: "press", x: 8, y: 16 },
      { atMillis: 2150, type: "release", x: 8, y: 16 },
      { atMillis: 3100, type: "press", x: 2, y: 28 }
    ],
    captureStartMillis: 3300,
    frameCount: 28,
    frameIntervalMillis: 100
  },
  tags: ["defensa", "cooperativo", "arcade", "multijugador", "typescript"]
};

// games/guardianes/src/game.ts
var guardianesMaxLives = 4;
var guardianesGameWinMillis = 5e3;
var guardianesGameFailMillis = 5e3;
var backgroundColor4 = "#02050b";
var readyZone = { minX: 5, maxX: 10, minY: 14, maxY: 18 };
var successColors2 = ["#35d7ff", "#ff3bd7", "#ffe176", "#5fff9e", "#ffffff"];
var guardianLanes = [
  { color: "#35d7ff", label: "Azul", minX: 0, maxX: 3, shieldX: 1 },
  { color: "#ff3bd7", label: "Rosa", minX: 4, maxX: 7, shieldX: 5 },
  { color: "#ffe176", label: "Amarillo", minX: 8, maxX: 11, shieldX: 9 },
  { color: "#5fff9e", label: "Verde", minX: 12, maxX: 15, shieldX: 13 }
];
var threatPattern = [0, 2, 1, 3, 0, 3, 2, 1, 1, 3, 0, 2, 3, 1, 2, 0];
var difficultyProfiles2 = {
  easy: { spacingMillis: 2e3, travelMillis: 4e3 },
  medium: { spacingMillis: 1750, travelMillis: 3300 },
  hard: { spacingMillis: 1500, travelMillis: 2700 },
  expert: { spacingMillis: 1300, travelMillis: 2200 }
};
function guardianesDifficultyProfile(difficulty) {
  return { ...difficultyProfiles2[difficulty] ?? difficultyProfiles2.medium };
}
function guardianesThreatChart(difficulty = "medium") {
  const profile2 = difficultyProfiles2[difficulty] ?? difficultyProfiles2.medium;
  return threatPattern.map((lane, index) => {
    const spawnMillis = 1e3 + index * profile2.spacingMillis;
    return { impactMillis: spawnMillis + profile2.travelMillis, lane, spawnMillis };
  });
}
function createGame7(config) {
  return new GuardianesGame(config);
}
var GuardianesGame = class {
  blockedThreats = 0;
  chart = [];
  config;
  finishedAtMillis = 0;
  heldTiles = /* @__PURE__ */ new Set();
  lastEvent = gameEvent("none", "Los escudos est\xE1n preparados", 0);
  lives = guardianesMaxLives;
  nowMillis = 0;
  phase = "ready";
  players = [];
  readyGate;
  resolvedThreats = 0;
  startedAtMillis = 0;
  success = false;
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest7);
    this.readyGate = createPlayerReadyGate(manifest7.start, [readyZone], this.config.nowMillis);
    this.resetState(this.config.nowMillis);
  }
  init(nowMillis) {
    this.resetState(nowMillis);
    this.phase = "waiting";
    this.lastEvent = gameEvent("ready", "Entra en el n\xFAcleo para iniciar", nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.update(event), event.atMillis);
    }
    if (this.phase !== "running" || !event.pressed) return [];
    const lane = this.shieldLaneAt(event.x, event.y);
    if (lane < 0) return [];
    this.heldTiles.add(tileKey4(event.x, event.y));
    this.lastEvent = gameEvent("shield", `Escudo ${guardianLanes[lane].label.toLowerCase()} activado`, event.atMillis);
    return [this.lastEvent];
  }
  release(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.update({ ...event, pressed: false }), event.atMillis);
    }
    this.heldTiles.delete(tileKey4(event.x, event.y));
    return [];
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.tick(event.atMillis), event.atMillis);
    }
    if (this.phase === "finished") {
      const resultMillis = this.success ? guardianesGameWinMillis : guardianesGameFailMillis;
      if (event.atMillis - this.finishedAtMillis >= resultMillis) {
        this.resetState(event.atMillis);
        this.phase = "waiting";
        this.lastEvent = gameEvent("ready", "Entra en el n\xFAcleo para iniciar", event.atMillis);
        return [this.lastEvent];
      }
      return [];
    }
    if (this.phase !== "running") return [];
    const events = [];
    while (this.resolvedThreats < this.chart.length) {
      const threat = this.chart[this.resolvedThreats];
      if (this.elapsedMillis() < threat.impactMillis) break;
      const blocked = this.shieldLaneActive(threat.lane);
      this.resolvedThreats += 1;
      if (blocked) {
        this.blockedThreats += 1;
        this.lastEvent = gameEvent("hit", `Amenaza ${guardianLanes[threat.lane].label.toLowerCase()} bloqueada`, event.atMillis);
      } else {
        this.lives = Math.max(0, this.lives - 1);
        this.lastEvent = gameEvent("miss", `Impacto en el carril ${guardianLanes[threat.lane].label.toLowerCase()}`, event.atMillis);
      }
      this.players = this.scoredPlayers();
      events.push(this.lastEvent);
      if (this.lives === 0) return [...events, ...this.finish(false, event.atMillis, "El n\xFAcleo qued\xF3 sin defensas")];
    }
    if (this.resolvedThreats >= this.chart.length) return [...events, ...this.finish(true, event.atMillis, "Oleada repelida")];
    if (this.remainingMillis() <= 0) return [...events, ...this.finish(false, event.atMillis, "La oleada super\xF3 las defensas")];
    return events;
  }
  render() {
    const frame = createFrame(backgroundColor4);
    this.paintLanes(frame);
    if (this.phase === "waiting" || this.phase === "starting") {
      fillFrameRect(frame, readyZone.minX, readyZone.minY, readyZone.maxX, readyZone.maxY, this.phase === "starting" ? "#ffe176" : "#145cff");
      paintDiamondRing(frame, { centerX: 8, centerY: 16, color: this.phase === "starting" ? "#ffffff" : "#35d7ff", radius: 2 + Math.floor(this.nowMillis / 150) % 9 });
      return frame;
    }
    if (this.phase === "finished") {
      this.paintResult(frame);
      return frame;
    }
    for (let lane = 0; lane < guardianLanes.length; lane += 1) {
      const descriptor = guardianLanes[lane];
      const active = this.shieldLaneActive(lane);
      fillFrameRect(frame, descriptor.minX, 26, descriptor.maxX, 31, active ? descriptor.color : "#10182a");
      fillFrameRect(frame, descriptor.minX + 1, 27, descriptor.maxX - 1, 30, active ? "#ffffff" : descriptor.color);
    }
    for (const threat of this.visibleThreats()) {
      const lane = guardianLanes[threat.lane];
      const y = Math.max(0, Math.min(24, Math.round(threat.progress * 24)));
      fillFrameRect(frame, lane.minX, y, lane.maxX, Math.min(25, y + 1), "#ff3151");
      paintFrameCell(frame, lane.shieldX, y, "#ffffff");
    }
    return frame;
  }
  snapshot() {
    const readyState = this.readyGate.state(this.nowMillis);
    return {
      currentGame: manifest7.id,
      label: manifest7.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: this.players,
      score: this.blockedThreats,
      lives: this.lives,
      maxLives: guardianesMaxLives,
      elapsedMillis: this.elapsedMillis(),
      remainingMillis: this.remainingMillis(),
      activeTargets: this.phase === "running" ? this.visibleThreats().length : 0,
      success: this.success,
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? readyState.countdownMillis : 0,
      readyPlayers: readyState.readyPlayers,
      requiredPlayers: readyState.requiredPlayers,
      matchTarget: this.chart.length,
      blockedThreats: this.blockedThreats,
      shieldLanes: guardianLanes.map((_lane, index) => index).filter((lane) => this.shieldLaneActive(lane)),
      threatCount: this.chart.length,
      threatIndex: this.resolvedThreats,
      threats: this.visibleThreats()
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest7);
    this.readyGate = createPlayerReadyGate(manifest7.start, [readyZone], this.config.nowMillis);
    this.resetState(this.config.nowMillis);
    this.phase = "waiting";
    this.lastEvent = gameEvent("ready", "Entra en el n\xFAcleo para iniciar", this.config.nowMillis);
  }
  applyReadyTransition(transition, nowMillis) {
    if (transition === "players-ready") {
      this.phase = "starting";
      this.lastEvent = gameEvent("ready", "N\xFAcleo protegido", nowMillis);
      return [this.lastEvent];
    }
    if (transition === "players-left") {
      this.phase = "waiting";
      this.lastEvent = gameEvent("ready", "Vuelve al n\xFAcleo central", nowMillis);
      return [this.lastEvent];
    }
    if (transition === "started") {
      this.phase = "running";
      this.startedAtMillis = nowMillis;
      this.heldTiles.clear();
      this.lastEvent = gameEvent("start", "Activa el primer escudo", nowMillis);
      return [this.lastEvent];
    }
    return [];
  }
  finish(success, atMillis, message) {
    if (this.phase === "finished") return [];
    this.phase = "finished";
    this.success = success;
    this.finishedAtMillis = atMillis;
    this.heldTiles.clear();
    this.players = this.scoredPlayers();
    this.lastEvent = gameEvent(success ? "win" : "fail", message, atMillis);
    return [this.lastEvent];
  }
  paintLanes(frame) {
    for (const lane of guardianLanes) {
      fillFrameRect(frame, lane.minX, 0, lane.maxX, FLOOR_ROWS - 1, "#050917");
      fillFrameRect(frame, lane.minX, 0, lane.minX, FLOOR_ROWS - 1, "#10182a");
    }
    for (let y = 4; y < FLOOR_ROWS; y += 5) {
      fillFrameRect(frame, 0, y, FLOOR_COLS - 1, y, "#090f20");
    }
  }
  paintResult(frame) {
    const elapsed = Math.max(0, this.nowMillis - this.finishedAtMillis);
    if (this.success) {
      paintDiamondWave(frame, {
        centerX: 8,
        centerY: 16,
        color: ({ distance, step }) => successColors2[(distance + step) % successColors2.length],
        period: 8,
        bandWidth: 5,
        step: Math.floor(elapsed / 85)
      });
      return;
    }
    fillFrameRect(frame, 0, 0, FLOOR_COLS - 1, FLOOR_ROWS - 1, Math.floor(elapsed / 170) % 2 === 0 ? "#4f0615" : "#140208");
    paintDiamondRing(frame, { centerX: 8, centerY: 16, color: "#ff3151", radius: 2 + Math.floor(elapsed / 100) % 13 });
  }
  visibleThreats() {
    if (this.phase !== "running") return [];
    const elapsed = this.elapsedMillis();
    return this.chart.slice(this.resolvedThreats).filter((threat) => elapsed >= threat.spawnMillis && elapsed <= threat.impactMillis).map((threat) => ({
      lane: threat.lane,
      millisRemaining: Math.max(0, threat.impactMillis - elapsed),
      progress: Math.max(0, Math.min(1, (elapsed - threat.spawnMillis) / (threat.impactMillis - threat.spawnMillis)))
    }));
  }
  shieldLaneAt(x, y) {
    if (y < 26 || y >= FLOOR_ROWS) return -1;
    return guardianLanes.findIndex((lane) => x >= lane.minX && x <= lane.maxX);
  }
  shieldLaneActive(laneIndex) {
    const lane = guardianLanes[laneIndex];
    if (!lane) return false;
    for (let y = 26; y < FLOOR_ROWS; y += 1) {
      for (let x = lane.minX; x <= lane.maxX; x += 1) {
        if (this.heldTiles.has(tileKey4(x, y))) return true;
      }
    }
    return false;
  }
  elapsedMillis() {
    if (this.phase === "waiting" || this.phase === "starting" || this.phase === "ready") return 0;
    return Math.max(0, this.nowMillis - this.startedAtMillis);
  }
  remainingMillis() {
    return Math.max(0, this.config.durationMillis - this.elapsedMillis());
  }
  scoredPlayers() {
    return defaultPlayers(this.config.playerCount, this.config.players).map((player) => ({ ...player, label: player.label || `Jugador ${player.index + 1}`, score: this.blockedThreats, lives: this.lives }));
  }
  resetState(nowMillis) {
    this.blockedThreats = 0;
    this.chart = guardianesThreatChart(this.config.difficulty);
    this.finishedAtMillis = 0;
    this.heldTiles.clear();
    this.lastEvent = gameEvent("none", "Los escudos est\xE1n preparados", nowMillis);
    this.lives = guardianesMaxLives;
    this.nowMillis = nowMillis;
    this.phase = "ready";
    this.readyGate.reset(nowMillis);
    this.resolvedThreats = 0;
    this.startedAtMillis = nowMillis;
    this.success = false;
    this.players = this.scoredPlayers();
  }
};
function tileKey4(x, y) {
  return `${x},${y}`;
}

// games/guardianes/src/display.tsx
var import_jsx_runtime9 = __toESM(require_jsx_runtime(), 1);
var guardianesStyles = `
.guardianes-display{background:radial-gradient(circle at 50% 70%,rgba(53,215,255,.18),transparent 34%),linear-gradient(155deg,#020613,#071025 55%,#120516);display:grid;gap:24px;grid-template-columns:minmax(0,1fr) 430px;inset:0;overflow:hidden;padding:34px 40px 30px;position:absolute}
.guardianes-stage{align-content:center;display:grid;gap:24px;min-width:0}
.guardianes-title{color:#d8e8f1;font-size:25px;font-weight:900;letter-spacing:.12em;text-align:center;text-transform:uppercase}
.guardianes-lanes{display:grid;gap:15px;grid-template-columns:repeat(4,1fr);height:510px}
.guardianes-lane{background:linear-gradient(180deg,rgba(255,49,81,.18),rgba(8,14,32,.9) 48%,color-mix(in srgb,var(--lane) 10%,#070d1d));border:3px solid rgba(255,255,255,.09);border-radius:24px;display:grid;grid-template-rows:1fr auto;overflow:hidden;position:relative}
.guardianes-threat{background:#ff3151;border-radius:15px;box-shadow:0 0 35px #ff3151;height:74px;left:18%;position:absolute;top:calc(var(--threat-progress)*70% + 5%);transform:rotate(45deg);width:64%}
.guardianes-threat::after{background:#fff;border-radius:8px;content:"";inset:24%;position:absolute}
.guardianes-shield{align-items:center;background:#0b1427;border-top:4px solid var(--lane);display:flex;flex-direction:column;justify-content:center;min-height:130px;opacity:.52;padding:15px;text-align:center;transition:.15s ease}
.guardianes-shield.is-active{background:color-mix(in srgb,var(--lane) 30%,#081226);box-shadow:inset 0 0 55px var(--lane);opacity:1}
.guardianes-shield i{background:var(--lane);border-radius:999px 999px 20px 20px;box-shadow:0 0 26px var(--lane);height:46px;width:70px}.guardianes-shield strong{color:#fff;font-size:24px;margin-top:10px}
.guardianes-sidebar{align-content:center;display:grid;gap:17px}
.guardianes-card{background:rgba(5,12,29,.9);border:1px solid rgba(255,255,255,.12);border-radius:22px;display:grid;gap:8px;padding:20px 24px}.guardianes-card span{color:#9baec5;font-size:18px;font-weight:900;letter-spacing:.1em;text-transform:uppercase}.guardianes-card strong{color:#fff;font-size:56px;line-height:1}
.guardianes-lives .ml-lives-meter{justify-content:flex-start;margin-top:7px}.guardianes-lives .ml-life-heart-glyph{font-size:52px}
.guardianes-progress{background:#152038;border-radius:999px;height:14px;overflow:hidden}.guardianes-progress i{background:linear-gradient(90deg,#35d7ff,#ff3bd7,#ffe176,#5fff9e);display:block;height:100%;width:var(--guardian-progress)}
.guardianes-event{background:rgba(53,215,255,.09);border:1px solid rgba(53,215,255,.3);border-radius:20px;color:#fff;font-size:24px;font-weight:900;min-height:84px;padding:21px}
.guardianes-result{align-content:center;background:#050814;display:grid;inset:0;justify-items:center;padding:60px;position:absolute;text-align:center;z-index:5}.guardianes-result strong{color:#fff;font-size:clamp(78px,8vw,142px);line-height:.94}.guardianes-result span{color:#b8eefd;font-size:31px;font-weight:900;margin-top:25px}
.guardianes-result.is-win{animation:guardianesWin 1.15s linear infinite;background:linear-gradient(110deg,#06304a,#48113f,#66530e,#145234,#06304a);background-size:250% 100%}.guardianes-result.is-fail strong{color:#ff637d}
@keyframes guardianesWin{from{background-position:0 0}to{background-position:100% 0}}@media(prefers-reduced-motion:reduce){.guardianes-display *{animation:none!important;transition:none!important}}
`;
function PlayerDisplay7({ snapshot }) {
  const style = { "--guardian-progress": `${snapshot.threatIndex / Math.max(snapshot.threatCount, 1) * 100}%` };
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(GameDisplayShell, { title: snapshot.label, phase: snapshot.phase, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "guardianes-display", style, children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("style", { children: guardianesStyles }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(PlayerReadyOverlay, { snapshot }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("main", { className: "guardianes-stage", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "guardianes-title", children: "Activa el escudo antes del impacto" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("section", { className: "guardianes-lanes", children: guardianLanes.map((lane, index) => {
        const threat = snapshot.threats.find((candidate) => candidate.lane === index);
        const active = snapshot.shieldLanes.includes(index);
        return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("article", { className: "guardianes-lane", style: { "--lane": lane.color }, children: [
          threat ? /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("i", { className: "guardianes-threat", style: { "--threat-progress": threat.progress } }) : null,
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", {}),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: `guardianes-shield${active ? " is-active" : ""}`, children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("i", {}),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("strong", { children: lane.label })
          ] })
        ] }, lane.label);
      }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("aside", { className: "guardianes-sidebar", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("article", { className: "guardianes-card guardianes-lives", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: "Vidas del n\xFAcleo" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(LivesMeter, { lives: snapshot.lives, maxLives: snapshot.maxLives ?? guardianesMaxLives })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("article", { className: "guardianes-card", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: "Amenazas bloqueadas" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("strong", { children: [
          snapshot.blockedThreats,
          "/",
          snapshot.threatCount
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "guardianes-progress", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("i", {}) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("article", { className: "guardianes-card", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: "Tiempo" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("strong", { children: formatClock(snapshot.remainingMillis) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "guardianes-event", children: snapshot.lastEventMessage || "Los escudos est\xE1n preparados" })
    ] }),
    snapshot.phase === "finished" ? /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: `guardianes-result ${snapshot.success ? "is-win" : "is-fail"}`, children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("strong", { children: snapshot.success ? "\xA1N\xFAcleo protegido!" : "Defensas superadas" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: snapshot.success ? `${snapshot.blockedThreats} amenazas bloqueadas` : "Coordina los escudos y vuelve a intentarlo" })
    ] }) : null
  ] }) });
}

// games/guardianes/src/fixtures.ts
function startedGame2() {
  const game8 = createGame7({ playerCount: 0, durationMillis: manifest7.defaultDurationMillis, difficulty: "medium" });
  game8.init(0);
  game8.press({ x: 8, y: 16, pressed: true, atMillis: 100 });
  game8.tick({ atMillis: 2100 });
  game8.release({ x: 8, y: 16, pressed: false, atMillis: 2120 });
  return game8;
}
var runningGame5 = startedGame2();
runningGame5.tick({ atMillis: 4500 });
var runningFrame6 = runningGame5.render();
var runningSnapshot6 = runningGame5.snapshot();
var defendedGame = startedGame2();
var firstThreat = guardianesThreatChart()[0];
var firstLane = guardianLanes[firstThreat.lane];
defendedGame.press({ x: firstLane.shieldX, y: 28, pressed: true, atMillis: 2500 });
defendedGame.tick({ atMillis: 2100 + firstThreat.impactMillis });
var defendedFrame = defendedGame.render();
var defendedSnapshot = defendedGame.snapshot();
var damagedGame = startedGame2();
for (const threat of guardianesThreatChart().slice(0, 2)) damagedGame.tick({ atMillis: 2100 + threat.impactMillis });
var damagedFrame = damagedGame.render();
var damagedSnapshot = damagedGame.snapshot();
var failedGame = startedGame2();
for (const threat of guardianesThreatChart().slice(0, 4)) failedGame.tick({ atMillis: 2100 + threat.impactMillis });
var failedFrame = failedGame.render();
var failedSnapshot = failedGame.snapshot();
var finishedGame4 = startedGame2();
for (const threat of guardianesThreatChart()) {
  const lane = guardianLanes[threat.lane];
  finishedGame4.press({ x: lane.shieldX, y: 28, pressed: true, atMillis: 2100 + threat.impactMillis - 100 });
  finishedGame4.tick({ atMillis: 2100 + threat.impactMillis });
  finishedGame4.release({ x: lane.shieldX, y: 28, pressed: false, atMillis: 2100 + threat.impactMillis + 10 });
}
var finishedFrame5 = finishedGame4.render();
var finishedSnapshot5 = finishedGame4.snapshot();

// games/hello-world/src/index.ts
var src_exports8 = {};
__export(src_exports8, {
  PlayerDisplay: () => PlayerDisplay8,
  createGame: () => createGame8,
  damagedFrame: () => damagedFrame2,
  damagedSnapshot: () => damagedSnapshot2,
  hazardColor: () => hazardColor2,
  helloWorldCelebrationMillis: () => helloWorldCelebrationMillis,
  helloWorldHazards: () => helloWorldHazards,
  helloWorldStartingLives: () => helloWorldStartingLives,
  helloWorldTargetScore: () => helloWorldTargetScore,
  helloWorldTargets: () => helloWorldTargets,
  idleColor: () => idleColor2,
  initEvents: () => initEvents3,
  losingFrame: () => losingFrame,
  losingSnapshot: () => losingSnapshot,
  manifest: () => manifest8,
  runningFrame: () => runningFrame7,
  runningSnapshot: () => runningSnapshot7,
  startingFrame: () => startingFrame2,
  startingSnapshot: () => startingSnapshot2,
  targetColor: () => targetColor,
  trailColor: () => trailColor,
  waitingFrame: () => waitingFrame2,
  waitingSnapshot: () => waitingSnapshot2,
  winningFrame: () => winningFrame,
  winningSnapshot: () => winningSnapshot
});

// games/hello-world/src/display.tsx
var import_jsx_runtime10 = __toESM(require_jsx_runtime(), 1);
function PlayerDisplay8({
  snapshot,
  frame
}) {
  const target3 = snapshot.matchTarget ?? 5;
  const finished3 = snapshot.phase === "finished";
  const resultClass = finished3 ? snapshot.success ? "is-result-win" : "is-result-lose" : "";
  const statusTone = snapshot.success ? "green" : snapshot.lastEventCue === "fail" ? "red" : "cyan";
  const restartSeconds = Math.max(1, Math.ceil(snapshot.celebrationMillis / 1e3));
  const statusValue = finished3 ? /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("span", { className: "hello-world-result-copy", children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { children: snapshot.success ? "\xA1Ganaste!" : snapshot.lastEventMessage }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("small", { children: [
      "Reinicio en ",
      restartSeconds
    ] })
  ] }) : snapshot.lastEventMessage || "Verde suma, rojo resta una vida";
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(GameDisplayShell, { title: snapshot.label, phase: snapshot.phase, children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: `ml-solo-display hello-world-display ${resultClass}`.trim(), children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(PlayerReadyOverlay, { snapshot }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "ml-solo-summary", children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(MetricRow, { columns: 3, className: "ml-solo-number-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(MetricPanel, { label: "Meta", tone: "green", value: `${snapshot.score}/${target3}` }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(MetricPanel, { label: "Vidas", tone: "red", value: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(LivesMeter, { lives: snapshot.lives, maxLives: snapshot.maxLives }) }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(MetricPanel, { label: "Tiempo", tone: "yellow", value: formatClock(snapshot.remainingMillis) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
        MetricPanel,
        {
          className: "ml-solo-message",
          label: finished3 ? snapshot.success ? "Victoria" : "Fin de la partida" : "Estado",
          tone: statusTone,
          value: statusValue
        }
      )
    ] }),
    frame ? /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(FramePreviewPanel, { className: "ml-solo-floor", frame, label: "Recorrido en el suelo" }) : null
  ] }) });
}

// games/hello-world/src/manifest.ts
var manifest8 = {
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
var hazardColor2 = "#ff2036";
var trailColor = "#1f6feb";
var idleColor2 = "#05070a";
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
function createGame8(config) {
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
    this.config = normalizeGameConfig(config, manifest8);
    this.readyGate = createPlayerReadyGate(manifest8.start, createHorizontalPlayerReadyZones(1), this.config.nowMillis);
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
    const target3 = this.currentTarget();
    if (!target3 || event.x !== target3.x || event.y !== target3.y) {
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
    const frame = createFrame(idleColor2);
    if (this.phase === "waiting" || this.phase === "starting") {
      this.drawPlayerStart(frame);
      return frame;
    }
    for (const target4 of targetPath.slice(0, this.score)) {
      paintFrameCell(frame, target4.x, target4.y, trailColor);
    }
    if (this.phase === "finished") {
      this.drawResultAnimation(frame);
      return frame;
    }
    const target3 = this.currentTarget();
    if (target3) {
      fillFrameRect(frame, target3.x - 1, target3.y - 1, 3, 3, targetColor);
      paintFrameCell(frame, target3.x, target3.y, "#ffffff");
    }
    const hazard = this.currentHazard();
    if (hazard) {
      paintFrameCell(frame, hazard.x, hazard.y, hazardColor2);
    }
    return frame;
  }
  snapshot() {
    const readyState = this.readyGate.state(this.nowMillis);
    return {
      currentGame: manifest8.id,
      label: manifest8.label,
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
    }, manifest8);
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
          paintFrameCell(frame, x, y, (x + animationStep) % 4 === 0 ? "#ff8090" : hazardColor2);
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
  return targetPath.map((target3) => ({ ...target3 }));
}

// games/hello-world/src/fixtures.ts
var waitingGame2 = createGame8({ seed: 2024, playerCount: 1, durationMillis: 3e4 });
var initEvents3 = waitingGame2.init(0);
var waitingFrame2 = waitingGame2.render();
var waitingSnapshot2 = waitingGame2.snapshot();
var startingGame2 = createGame8({ seed: 2024, playerCount: 1, durationMillis: 3e4 });
startingGame2.init(0);
startingGame2.press({ x: 8, y: 16, pressed: true, atMillis: 100 });
startingGame2.tick({ atMillis: 1100 });
var startingFrame2 = startingGame2.render();
var startingSnapshot2 = startingGame2.snapshot();
var runningGame6 = createStartedGame();
var runningFrame7 = runningGame6.render();
var runningSnapshot7 = runningGame6.snapshot();
var damagedGame2 = createStartedGame();
var firstHazard = helloWorldHazards()[0];
if (!firstHazard) {
  throw new Error("Hola Mundo requires at least one hazard fixture.");
}
damagedGame2.press({ ...firstHazard, pressed: true, atMillis: 2200 });
var damagedFrame2 = damagedGame2.render();
var damagedSnapshot2 = damagedGame2.snapshot();
var winningGame = createStartedGame();
helloWorldTargets().forEach((target3, index) => {
  winningGame.press({ ...target3, pressed: true, atMillis: 2200 + index * 100 });
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
  const game8 = createGame8({ seed: 2024, playerCount: 1, durationMillis: 3e4 });
  game8.init(0);
  game8.press({ x: 8, y: 16, pressed: true, atMillis: 100 });
  game8.tick({ atMillis: 2100 });
  return game8;
}

// games/lava/src/index.ts
var src_exports9 = {};
__export(src_exports9, {
  PlayerDisplay: () => PlayerDisplay9,
  createGame: () => createGame9,
  damagedFrame: () => damagedFrame3,
  damagedSnapshot: () => damagedSnapshot3,
  initEvents: () => initEvents4,
  lavaCelebrationMillis: () => lavaCelebrationMillis,
  lavaDamageImmunityMillis: () => lavaDamageImmunityMillis,
  lavaStartingLives: () => lavaStartingLives,
  manifest: () => manifest9,
  runningFrame: () => runningFrame8,
  runningSnapshot: () => runningSnapshot8,
  startingSnapshot: () => startingSnapshot3,
  waitingSnapshot: () => waitingSnapshot3
});

// games/lava/src/display.tsx
var import_jsx_runtime11 = __toESM(require_jsx_runtime(), 1);
function PlayerDisplay9({ snapshot, frame }) {
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(GameDisplayShell, { title: snapshot.label, phase: snapshot.phase, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "ml-solo-display", children: [
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(PlayerReadyOverlay, { snapshot }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "ml-solo-summary", children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(MetricRow, { columns: 3, className: "ml-solo-number-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(MetricPanel, { label: "Plataformas", tone: "green", value: snapshot.score }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(MetricPanel, { label: "Tiempo", tone: "cyan", value: formatClock(snapshot.remainingMillis) }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(MetricPanel, { label: "Vidas", tone: "red", value: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(LivesMeter, { lives: snapshot.lives, maxLives: snapshot.maxLives }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(MetricPanel, { className: "ml-solo-message", label: "Equipo", tone: snapshot.success ? "green" : snapshot.lives === 0 ? "red" : "yellow", value: snapshot.lastEventMessage || "Pisa solo las plataformas verdes" })
    ] }),
    frame ? /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(FramePreviewPanel, { className: "ml-solo-floor", frame, label: "Lava en el suelo" }) : null
  ] }) });
}

// games/lava/src/manifest.ts
var manifest9 = {
  id: "lava",
  label: "El suelo es lava",
  description: "Moveos en equipo, evitad la lava y conquistad plataformas seguras durante un minuto.",
  availability: { development: true, production: true },
  catalog: { category: "team", color: "#ff5268", durationLabel: "60s", modeLabel: "Plataformas", audioLabel: "M\xFAsica + efectos", rules: ["Espera en la zona azul", "Pisa las plataformas verdes", "Evita la lava roja durante un minuto"] },
  players: { allowAny: true, min: 1, max: 6 },
  start: { mode: "player-ready", releaseGraceMillis: 1500 },
  defaultDurationMillis: 6e4,
  config: { difficulty: { options: ["easy", "medium", "hard", "expert"], default: "medium" } },
  display: { entry: "./display" },
  preview: { seed: 137, playerCount: 0, difficulty: "medium", actions: [{ atMillis: 100, type: "press", x: 8, y: 16 }], captureStartMillis: 4e3, frameCount: 24, frameIntervalMillis: 120 },
  tags: ["lava", "cooperativo", "typescript"]
};

// games/lava/src/game.ts
var lavaStartingLives = 3;
var lavaCelebrationMillis = 5e3;
var lavaDamageImmunityMillis = 1e3;
var difficultySettings = {
  easy: { speed: 2, width: 4, height: 3, spawnMillis: 2400 },
  medium: { speed: 2.6, width: 3, height: 3, spawnMillis: 2e3 },
  hard: { speed: 3.2, width: 3, height: 2, spawnMillis: 1650 },
  expert: { speed: 4, width: 2, height: 2, spawnMillis: 1350 }
};
function createGame9(config) {
  return new LavaGame(config);
}
var LavaGame = class {
  config;
  finishedAtMillis;
  lastDamageAtMillis = Number.NEGATIVE_INFINITY;
  lastEvent = gameEvent("none", "Listo", 0);
  lives = lavaStartingLives;
  nextPlatformId = 1;
  nextSpawnAtMillis = 0;
  nowMillis = 0;
  phase = "ready";
  platforms = [];
  players;
  readyGate;
  rng;
  score = 0;
  startedAtMillis = 0;
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest9);
    this.readyGate = createPlayerReadyGate(manifest9.start, [{ minX: 5, maxX: 10, minY: 13, maxY: 18 }], this.config.nowMillis);
    this.rng = createSeededRng(this.config.seed);
    this.players = this.scoredPlayers();
  }
  init(nowMillis) {
    this.resetState(nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") return this.applyReadyTransition(this.readyGate.update(event), event.atMillis);
    if (this.phase !== "running" || !event.pressed) return [];
    this.advancePlatforms(event.atMillis);
    const safe = this.visiblePlatforms().find((platform) => inside(event, platform));
    if (safe) {
      this.platforms = this.platforms.filter((platform) => platform.id !== safe.id);
      this.score += 1;
      this.players = this.scoredPlayers();
      this.lastEvent = gameEvent("coin", `Plataforma ${this.score}`, event.atMillis);
      return [this.lastEvent];
    }
    if (event.atMillis - this.lastDamageAtMillis < lavaDamageImmunityMillis) return [];
    this.lastDamageAtMillis = event.atMillis;
    this.lives -= 1;
    this.players = this.scoredPlayers();
    if (this.lives <= 0) return this.finish(false, "La lava os ha alcanzado", event.atMillis);
    this.lastEvent = gameEvent("damage", `Vida perdida, quedan ${this.lives}`, event.atMillis);
    return [this.lastEvent];
  }
  release(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") return this.applyReadyTransition(this.readyGate.update({ ...event, pressed: false }), event.atMillis);
    return [];
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") return this.applyReadyTransition(this.readyGate.tick(event.atMillis), event.atMillis);
    if (this.phase === "finished") {
      if (event.atMillis - (this.finishedAtMillis ?? event.atMillis) >= lavaCelebrationMillis) {
        this.resetState(event.atMillis);
        return [this.lastEvent];
      }
      return [];
    }
    this.advancePlatforms(event.atMillis);
    if (this.phase === "running" && this.remainingMillis() === 0) return this.finish(true, `${this.score} plataformas seguras`, event.atMillis);
    return [];
  }
  render() {
    const frame = createFrame("#8e0b1d");
    if (this.phase === "waiting" || this.phase === "starting") {
      const step = Math.floor(this.nowMillis / (this.phase === "starting" ? 100 : 180));
      paintDiamondRing(frame, { centerX: 8, centerY: 16, radius: 2 + step % 8, color: this.phase === "starting" ? "#ffe176" : "#22d3ee" });
      return frame;
    }
    const pulse = Math.floor(this.nowMillis / 160);
    for (let y = 0; y < FLOOR_ROWS; y += 1) for (let x = 0; x < FLOOR_COLS; x += 1) {
      paintFrameCell(frame, x, y, (x * 5 + y + pulse) % 13 < 3 ? "#ff5a1f" : "#b20d21");
    }
    for (const platform of this.visiblePlatforms()) fillFrameRect(frame, platform.x, platform.y, platform.width, platform.height, "#39e77d");
    if (this.phase === "finished") {
      paintDiamondWave(frame, { color: this.lives > 0 ? "#39e77d" : "#ff334e", step: Math.floor((this.nowMillis - (this.finishedAtMillis ?? this.nowMillis)) / 140) });
    }
    return frame;
  }
  snapshot() {
    const ready = this.readyGate.state(this.nowMillis);
    return {
      currentGame: manifest9.id,
      label: manifest9.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: this.players,
      score: this.score,
      lives: this.lives,
      maxLives: lavaStartingLives,
      elapsedMillis: this.elapsedMillis(),
      remainingMillis: this.remainingMillis(),
      activeTargets: this.phase === "running" ? this.visiblePlatforms().length : 0,
      success: this.phase === "finished" && this.lives > 0,
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? ready.countdownMillis : 0,
      readyPlayers: ready.readyPlayers,
      requiredPlayers: ready.requiredPlayers,
      safePlatforms: this.visiblePlatforms(),
      celebrationMillis: this.phase === "finished" ? Math.max(0, lavaCelebrationMillis - (this.nowMillis - (this.finishedAtMillis ?? this.nowMillis))) : 0
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest9);
    this.resetState(this.config.nowMillis);
  }
  advancePlatforms(nowMillis) {
    if (this.phase !== "running") return;
    const settings = difficultySettings[this.config.difficulty] ?? difficultySettings.medium;
    while (nowMillis >= this.nextSpawnAtMillis) {
      this.platforms.push({ id: this.nextPlatformId++, bornMillis: this.nextSpawnAtMillis, width: settings.width, height: settings.height, x: this.rng.range(0, FLOOR_COLS - settings.width) });
      this.nextSpawnAtMillis += settings.spawnMillis;
    }
    this.platforms = this.platforms.filter((platform) => this.platformY(platform) < FLOOR_ROWS);
  }
  applyReadyTransition(transition, nowMillis) {
    if (transition === "players-ready") {
      this.phase = "starting";
      this.lastEvent = gameEvent("ready", "Equipo listo", nowMillis);
    } else if (transition === "players-left") {
      this.phase = "waiting";
      this.lastEvent = gameEvent("ready", "Vuelve a la zona azul", nowMillis);
    } else if (transition === "started") {
      this.phase = "running";
      this.startedAtMillis = nowMillis;
      this.nextSpawnAtMillis = nowMillis;
      this.advancePlatforms(nowMillis);
      this.lastEvent = gameEvent("start", "Pisa solo las plataformas verdes", nowMillis);
    } else return [];
    return [this.lastEvent];
  }
  elapsedMillis() {
    if (this.phase === "waiting" || this.phase === "starting") return 0;
    return Math.max(0, (this.finishedAtMillis ?? this.nowMillis) - this.startedAtMillis);
  }
  finish(success, message, atMillis) {
    this.phase = "finished";
    this.finishedAtMillis = atMillis;
    this.lastEvent = gameEvent(success ? "win" : "fail", message, atMillis);
    return [this.lastEvent];
  }
  platformY(platform) {
    const speed = (difficultySettings[this.config.difficulty] ?? difficultySettings.medium).speed;
    return Math.floor((this.nowMillis - platform.bornMillis) * speed / 1e3) - platform.height;
  }
  remainingMillis() {
    return Math.max(0, this.config.durationMillis - this.elapsedMillis());
  }
  resetState(nowMillis) {
    this.readyGate.reset(nowMillis);
    this.finishedAtMillis = void 0;
    this.lastDamageAtMillis = Number.NEGATIVE_INFINITY;
    this.lastEvent = gameEvent("ready", "Espera en la zona azul", nowMillis);
    this.lives = lavaStartingLives;
    this.nextPlatformId = 1;
    this.nextSpawnAtMillis = nowMillis;
    this.nowMillis = nowMillis;
    this.phase = "waiting";
    this.platforms = [];
    this.rng = createSeededRng(this.config.seed);
    this.score = 0;
    this.startedAtMillis = nowMillis;
    this.players = this.scoredPlayers();
  }
  scoredPlayers() {
    return defaultPlayers(this.config.playerCount, this.config.players).map((player) => ({ ...player, score: this.score, lives: this.lives }));
  }
  visiblePlatforms() {
    return this.platforms.map((platform) => ({ id: platform.id, x: platform.x, y: this.platformY(platform), width: platform.width, height: platform.height })).filter((platform) => platform.y + platform.height > 0 && platform.y < FLOOR_ROWS);
  }
};
function inside(point, platform) {
  return point.x >= platform.x && point.x < platform.x + platform.width && point.y >= platform.y && point.y < platform.y + platform.height;
}

// games/lava/src/fixtures.ts
var game2 = createGame9({ playerCount: 0, seed: 137, difficulty: "medium" });
var initEvents4 = game2.init(0);
var waitingSnapshot3 = game2.snapshot();
game2.press({ x: 8, y: 16, pressed: true, atMillis: 100 });
var startingSnapshot3 = game2.snapshot();
game2.tick({ atMillis: 2100 });
game2.tick({ atMillis: 4e3 });
var runningFrame8 = game2.render();
var runningSnapshot8 = game2.snapshot();
game2.press({ x: 0, y: 31, pressed: true, atMillis: 4100 });
var damagedFrame3 = game2.render();
var damagedSnapshot3 = game2.snapshot();

// games/memory-challenge/src/index.ts
var src_exports10 = {};
__export(src_exports10, {
  PlayerDisplay: () => PlayerDisplay10,
  createGame: () => createGame10,
  failedFrame: () => failedFrame2,
  failedSnapshot: () => failedSnapshot2,
  finishedFrame: () => finishedFrame6,
  finishedSnapshot: () => finishedSnapshot6,
  laneLayout: () => laneLayout,
  manifest: () => manifest10,
  memorizingFrame: () => memorizingFrame,
  memorizingSnapshot: () => memorizingSnapshot,
  recallingFrame: () => recallingFrame,
  recallingSnapshot: () => recallingSnapshot,
  startingFrame: () => startingFrame3,
  startingSnapshot: () => startingSnapshot4,
  waitingFrame: () => waitingFrame3,
  waitingSnapshot: () => waitingSnapshot4
});

// games/memory-challenge/src/display.tsx
var import_jsx_runtime12 = __toESM(require_jsx_runtime(), 1);
function PlayerDisplay10({ snapshot }) {
  const countdown = Math.max(1, Math.ceil((snapshot.countdownMillis ?? 0) / 1e3));
  const hero = heroContent3(snapshot, countdown);
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(GameDisplayShell, { title: snapshot.label, phase: snapshot.phase, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: `memory-challenge-display is-phase-${snapshot.phase} is-stage-${snapshot.memoryStage}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("section", { className: "memory-challenge-hero", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { children: hero.eyebrow }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("strong", { children: hero.title }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("b", { children: hero.caption })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("article", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { children: "Tiempo" }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("strong", { children: formatClock(snapshot.remainingMillis) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("article", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { children: "Mejor camino" }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("strong", { children: snapshot.score })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("section", { className: "memory-challenge-players", style: { "--memory-columns": snapshot.playerCount }, children: snapshot.playerProgress.map((player) => /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(PlayerCard2, { player, ready: snapshot.readyPlayerIndices.includes(player.index), winner: snapshot.winnerIndex === player.index }, player.index)) }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("footer", { className: "memory-challenge-event", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { children: snapshot.phase === "finished" ? "Resultado" : "\xDAltimo evento" }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("strong", { children: snapshot.lastEventMessage }, snapshot.motionEventId),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("b", { children: snapshot.phase === "running" ? stageLabel(snapshot) : `${snapshot.readyPlayers}/${snapshot.requiredPlayers} listos` })
    ] })
  ] }) });
}
function PlayerCard2({ player, ready, winner }) {
  const progress = player.pathLength === 0 ? 0 : player.bestProgress / player.pathLength;
  const style = { "--memory-player": player.color, "--memory-player-rgb": hexToRgb4(player.color), "--memory-progress": progress };
  const status = winner ? "Ganador" : player.status === "failed" ? "Vuelve al inicio" : player.status === "memorizing" ? "Memoriza" : ready ? "Listo" : "En carrera";
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("article", { className: `memory-challenge-player is-${player.status}${winner ? " is-winner" : ""}`, style, children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("header", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("i", {}),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("strong", { children: player.label }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("b", { children: status })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "memory-challenge-score", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("strong", { children: player.bestProgress }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("span", { children: [
        "de ",
        player.pathLength,
        " baldosas"
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "memory-challenge-track", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("i", {}) }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("footer", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { children: "Avance actual" }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("strong", { children: [
        Math.round(progress * 100),
        "%"
      ] })
    ] })
  ] });
}
function heroContent3(snapshot, countdown) {
  if (snapshot.phase === "waiting") return { eyebrow: `Listos ${snapshot.readyPlayers}/${snapshot.requiredPlayers}`, title: "Busca tu salida", caption: "Cada jugador ocupa la zona iluminada de su calle" };
  if (snapshot.phase === "starting") return { eyebrow: "Todos listos", title: String(countdown), caption: "Mira bien: tu camino aparecer\xE1 enseguida" };
  if (snapshot.phase === "finished") return snapshot.winnerIndex >= 0 ? { eyebrow: "Camino completado", title: `\xA1Gana ${snapshot.winnerLabel}!`, caption: "La ruta vencedora vuelve a iluminarse" } : { eyebrow: "Tiempo agotado", title: "La lava gana", caption: "Nueva carrera en unos segundos" };
  if (snapshot.memoryStage === "memorize") return { eyebrow: `Oculto en ${formatClock(snapshot.stageMillis)}`, title: "Memoriza tu camino", caption: "Sigue el color desde tu salida hasta el final" };
  return { eyebrow: "Camino oculto", title: "Avanza de memoria", caption: "Si fallas, vuelve a tu salida para ver la ruta otra vez" };
}
function stageLabel(snapshot) {
  return snapshot.memoryStage === "memorize" ? `Se oculta en ${formatClock(snapshot.stageMillis)}` : "Camino oculto";
}
function hexToRgb4(color) {
  if (!/^#[0-9a-f]{6}$/i.test(color)) return "255, 255, 255";
  return [1, 3, 5].map((offset) => Number.parseInt(color.slice(offset, offset + 2), 16)).join(", ");
}

// games/memory-challenge/src/manifest.ts
var manifest10 = {
  id: "memory-challenge",
  label: "Reto de memoria",
  description: "Memoriza un camino oculto en tu calle y rec\xF3rrelo antes que los dem\xE1s sin pisar la lava.",
  availability: { development: true, production: true },
  catalog: {
    category: "team",
    color: "#005af8",
    durationLabel: "90 s",
    modeLabel: "Camino oculto",
    audioLabel: "M\xFAsica + efectos",
    rules: [
      "Cada jugador ocupa la salida de su calle",
      "Memoriza el camino iluminado antes de que desaparezca",
      "Si pisas la lava, vuelve a tu salida para intentarlo otra vez"
    ]
  },
  players: { allowAny: false, min: 1, max: 4 },
  start: { mode: "player-ready", releaseGraceMillis: 1200 },
  defaultDurationMillis: 9e4,
  display: { entry: "./display" },
  preview: {
    seed: 137,
    playerCount: 2,
    actions: [
      { atMillis: 100, type: "press", x: 3, y: 0 },
      { atMillis: 100, type: "press", x: 11, y: 0 }
    ],
    captureStartMillis: 2200,
    frameCount: 18,
    frameIntervalMillis: 120
  },
  tags: ["memory", "race", "multiplayer", "typescript"]
};

// games/memory-challenge/src/game.ts
var memorizeMillis = 2800;
var retryRevealMillis = 1500;
var winAnimationMillis2 = 4e3;
var startRows = 2;
var lavaDark = "#120301";
var lavaBright = "#8f1a08";
var failColor = "#ff6b22";
var white2 = "#ffffff";
function createGame10(config) {
  return new MemoryChallengeGame(config);
}
var MemoryChallengeGame = class {
  config;
  rng;
  lanes = [];
  readyZones = [];
  readyGate;
  players = [];
  phase = "waiting";
  memoryStage = "memorize";
  nowMillis = 0;
  startedAtMillis = 0;
  stageEndsAtMillis = 0;
  finishAtMillis = 0;
  winnerIndex = -1;
  motionEventId = 0;
  lastEvent = gameEvent("none", "Listo", 0);
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest10);
    this.rng = createSeededRng(this.config.seed);
    this.rebuildBoard();
    this.readyGate = createPlayerReadyGate(manifest10.start, this.readyZones, this.config.nowMillis);
    this.resetState(this.config.nowMillis);
  }
  init(nowMillis) {
    this.resetState(nowMillis);
    this.lastEvent = gameEvent("ready", "Busca tu salida iluminada", nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.record(this.applyReadyTransition(this.readyGate.update(event), event.atMillis));
    }
    if (this.phase !== "running" || !event.pressed) return [];
    const playerIndex = this.playerForPoint(event.x, event.y);
    if (playerIndex < 0) return [];
    const player = this.players[playerIndex];
    if (!player) return [];
    if (player.status === "failed") {
      if (this.contains(this.readyZones[playerIndex], event.x, event.y)) {
        player.status = "memorizing";
        player.progress = 0;
        player.revealUntilMillis = event.atMillis + retryRevealMillis;
        this.motionEventId += 1;
        return this.record([gameEvent("start", `${player.label} vuelve a memorizar`, event.atMillis)]);
      }
      return [];
    }
    if (player.status === "finished" || this.memoryStage === "memorize") return [];
    const expected = player.path[player.progress];
    if (expected?.x === event.x && expected.y === event.y) {
      player.progress += 1;
      player.bestProgress = Math.max(player.bestProgress, player.progress);
      player.status = "recalling";
      this.motionEventId += 1;
      if (player.progress >= player.pathLength) return this.finishWin(playerIndex, event.atMillis);
      const cue = player.progress === 1 || player.progress % 5 === 0 ? "coin" : "hit";
      return this.record([gameEvent(cue, `${player.label}: ${player.progress} de ${player.pathLength}`, event.atMillis)]);
    }
    if (player.path.slice(0, player.progress).some((point) => point.x === event.x && point.y === event.y)) return [];
    player.status = "failed";
    player.progress = 0;
    player.revealUntilMillis = 0;
    this.motionEventId += 1;
    return this.record([gameEvent("damage", `${player.label} pis\xF3 la lava`, event.atMillis)]);
  }
  release(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.record(this.applyReadyTransition(this.readyGate.update({ ...event, pressed: false }), event.atMillis));
    }
    return [];
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.record(this.applyReadyTransition(this.readyGate.tick(event.atMillis), event.atMillis));
    }
    if (this.phase === "finished") {
      if (event.atMillis - this.finishAtMillis >= winAnimationMillis2) {
        this.resetState(event.atMillis);
        return this.record([gameEvent("ready", "Nueva carrera de memoria", event.atMillis)]);
      }
      return [];
    }
    if (this.memoryStage === "memorize" && event.atMillis >= this.stageEndsAtMillis) {
      this.memoryStage = "recall";
      for (const player of this.players) player.status = "recalling";
      this.motionEventId += 1;
      return this.record([gameEvent("start", "Los caminos se han ocultado", event.atMillis)]);
    }
    if (this.remainingMillis() <= 0) return this.finishLoss(event.atMillis);
    return [];
  }
  render() {
    const frame = createFrame("#05070a");
    this.drawLava(frame);
    this.drawLaneBorders(frame);
    if (this.phase === "waiting" || this.phase === "starting") {
      this.drawReadiness(frame);
      return frame;
    }
    if (this.phase === "finished") {
      this.drawFinished(frame);
      return frame;
    }
    for (const player of this.players) {
      this.drawStart(frame, player);
      const reveal = this.memoryStage === "memorize" || player.status === "failed" || this.nowMillis < player.revealUntilMillis;
      player.path.forEach((point, index) => {
        if (index < player.progress || reveal) {
          paintFrameCell(frame, point.x, point.y, player.status === "failed" ? failColor : player.color);
        }
      });
      const next = player.path[player.progress];
      if (next && player.status === "recalling" && !reveal && Math.floor(this.nowMillis / 220) % 2 === 0) {
        paintFrameCell(frame, next.x, next.y, "#211008");
      }
    }
    return frame;
  }
  snapshot() {
    const readyState = this.readyGate.state(this.nowMillis);
    const readyPlayerIndices = this.readyZones.flatMap((_, index) => this.readyGate.zoneReady(index, this.nowMillis) ? [index] : []);
    const best = Math.max(0, ...this.players.map((player) => player.bestProgress));
    return {
      currentGame: manifest10.id,
      label: manifest10.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: this.players.map((player) => ({ index: player.index, label: player.label, color: player.color, score: player.bestProgress, lives: -1 })),
      score: best,
      lives: -1,
      elapsedMillis: this.elapsedMillis(),
      remainingMillis: this.phase === "finished" ? Math.max(0, this.finishAtMillis + winAnimationMillis2 - this.nowMillis) : this.remainingMillis(),
      activeTargets: this.phase === "running" ? this.players.filter((player) => player.status !== "finished").length : 0,
      success: this.winnerIndex >= 0,
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? readyState.countdownMillis : 0,
      readyPlayers: readyState.readyPlayers,
      requiredPlayers: readyState.requiredPlayers,
      matchTarget: Math.max(0, ...this.players.map((player) => player.pathLength)),
      memoryStage: this.memoryStage,
      stageMillis: this.memoryStage === "memorize" ? Math.max(0, this.stageEndsAtMillis - this.nowMillis) : 0,
      winnerIndex: this.winnerIndex,
      winnerLabel: this.players[this.winnerIndex]?.label ?? "",
      playerProgress: this.players.map(({ revealUntilMillis: _reveal, path: _path, ...player }) => ({ ...player })),
      paths: this.players.map((player) => player.path.map((point) => ({ ...point }))),
      readyPlayerIndices,
      motionEventId: this.motionEventId
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest10);
    this.rng = createSeededRng(this.config.seed);
    this.rebuildBoard();
    this.readyGate = createPlayerReadyGate(manifest10.start, this.readyZones, this.config.nowMillis);
    this.resetState(this.config.nowMillis);
  }
  pathForPlayer(index) {
    return this.players[index]?.path.map((point) => ({ ...point })) ?? [];
  }
  playerReadyZones() {
    return this.readyZones.map((zone) => ({ ...zone }));
  }
  rebuildBoard() {
    this.lanes = laneLayout(this.config.playerCount);
    this.readyZones = this.lanes.map((lane) => {
      const width = Math.min(4, lane.width);
      const minX = lane.x + Math.floor((lane.width - width) / 2);
      return { minX, maxX: minX + width - 1, minY: 0, maxY: startRows - 1 };
    });
    const roster = defaultPlayers(this.config.playerCount, this.config.players);
    this.players = roster.map((player, index) => {
      const path = generatePath(this.rng, this.lanes[index], this.readyZones[index]);
      const label = player.label === `Player ${index + 1}` ? `Jugador ${index + 1}` : player.label;
      return { index, label, color: player.color, progress: 0, bestProgress: 0, pathLength: path.length, status: "memorizing", path, revealUntilMillis: 0 };
    });
  }
  resetState(nowMillis) {
    this.rng = createSeededRng(this.config.seed);
    this.rebuildBoard();
    this.readyGate.reset(nowMillis);
    this.phase = "waiting";
    this.memoryStage = "memorize";
    this.nowMillis = nowMillis;
    this.startedAtMillis = nowMillis;
    this.stageEndsAtMillis = 0;
    this.finishAtMillis = 0;
    this.winnerIndex = -1;
    this.motionEventId = 0;
    this.lastEvent = gameEvent("ready", "Busca tu salida iluminada", nowMillis);
  }
  applyReadyTransition(transition, nowMillis) {
    if (transition === "players-ready") {
      this.phase = "starting";
      this.motionEventId += 1;
      return [gameEvent("ready", "Todos los jugadores listos", nowMillis)];
    }
    if (transition === "players-left") {
      this.phase = "waiting";
      this.motionEventId += 1;
      return [gameEvent("ready", "Vuelve a tu salida", nowMillis)];
    }
    if (transition === "started") {
      this.phase = "running";
      this.memoryStage = "memorize";
      this.startedAtMillis = nowMillis;
      this.stageEndsAtMillis = nowMillis + memorizeMillis;
      this.players.forEach((player) => {
        player.status = "memorizing";
      });
      this.motionEventId += 1;
      return [gameEvent("start", "Memoriza tu camino", nowMillis)];
    }
    return [];
  }
  finishWin(index, atMillis) {
    const player = this.players[index];
    player.status = "finished";
    this.phase = "finished";
    this.memoryStage = "game-win";
    this.winnerIndex = index;
    this.finishAtMillis = atMillis;
    this.motionEventId += 1;
    return this.record([gameEvent("win", `\xA1${player.label} completa el camino!`, atMillis)]);
  }
  finishLoss(atMillis) {
    this.phase = "finished";
    this.memoryStage = "game-loss";
    this.finishAtMillis = atMillis;
    this.motionEventId += 1;
    return this.record([gameEvent("fail", "Se acab\xF3 el tiempo", atMillis)]);
  }
  elapsedMillis() {
    return this.phase === "waiting" || this.phase === "starting" ? 0 : Math.max(0, this.nowMillis - this.startedAtMillis);
  }
  remainingMillis() {
    return Math.max(0, this.config.durationMillis - this.elapsedMillis());
  }
  playerForPoint(x, y) {
    return this.lanes.findIndex((lane) => x >= lane.x && x < lane.x + lane.width && y >= 0 && y < FLOOR_ROWS);
  }
  contains(zone, x, y) {
    return Boolean(zone && x >= zone.minX && x <= zone.maxX && y >= zone.minY && y <= zone.maxY);
  }
  record(events) {
    const latest = events.at(-1);
    if (latest) this.lastEvent = latest;
    return events;
  }
  drawLava(frame) {
    const step = Math.floor(this.nowMillis / 140);
    for (let y = 0; y < FLOOR_ROWS; y += 1) for (let x = 0; x < FLOOR_COLS; x += 1) {
      if ((x * 5 + y * 3 + step) % 13 < 2) paintFrameCell(frame, x, y, lavaBright);
      else if ((x + y + step) % 4 === 0) paintFrameCell(frame, x, y, lavaDark);
    }
  }
  drawLaneBorders(frame) {
    for (const lane of this.lanes.slice(1)) for (let y = 0; y < FLOOR_ROWS; y += 1) paintFrameCell(frame, lane.x - 1, y, "#2b2f3a");
  }
  drawReadiness(frame) {
    this.players.forEach((player, index) => {
      const ready = this.readyGate.zoneReady(index, this.nowMillis);
      const zone = this.readyZones[index];
      for (let y = zone.minY; y <= zone.maxY; y += 1) for (let x = zone.minX; x <= zone.maxX; x += 1) {
        const pulse = (x + y + Math.floor(this.nowMillis / 130)) % 4;
        if (ready || pulse < 2) paintFrameCell(frame, x, y, ready ? white2 : player.color);
      }
      if (this.phase === "starting") player.path.forEach((point, pathIndex) => {
        if ((pathIndex + Math.floor(this.nowMillis / 90)) % 5 < 3) paintFrameCell(frame, point.x, point.y, player.color);
      });
    });
  }
  drawStart(frame, player) {
    const zone = this.readyZones[player.index];
    for (let y = zone.minY; y <= zone.maxY; y += 1) for (let x = zone.minX; x <= zone.maxX; x += 1) paintFrameCell(frame, x, y, player.color);
  }
  drawFinished(frame) {
    const wave2 = Math.floor((this.nowMillis - this.finishAtMillis) / 90);
    if (this.winnerIndex < 0) {
      for (let y = 0; y < FLOOR_ROWS; y += 1) for (let x = 0; x < FLOOR_COLS; x += 1) if ((x + y + wave2) % 5 < 2) paintFrameCell(frame, x, y, failColor);
      return;
    }
    const winner = this.players[this.winnerIndex];
    for (let y = 0; y < FLOOR_ROWS; y += 1) for (let x = 0; x < FLOOR_COLS; x += 1) {
      const lane = this.lanes[this.winnerIndex];
      if (x >= lane.x && x < lane.x + lane.width && (x + y + wave2) % 4 < 3) paintFrameCell(frame, x, y, winner.color);
    }
    winner.path.forEach((point, index) => paintFrameCell(frame, point.x, point.y, (index + wave2) % winner.pathLength === 0 ? white2 : winner.color));
  }
};
function laneLayout(count) {
  const safe = clamp(Math.trunc(count), 1, 4);
  if (safe === 1) return [{ x: 0, width: FLOOR_COLS }];
  if (safe === 2) return [{ x: 0, width: 8 }, { x: 8, width: 8 }];
  if (safe === 3) return [{ x: 0, width: 4 }, { x: 6, width: 4 }, { x: 12, width: 4 }];
  return Array.from({ length: 4 }, (_, index) => ({ x: index * 4, width: 4 }));
}
function generatePath(rng, lane, start2) {
  const path = [];
  let x = start2.minX + rng.int(start2.maxX - start2.minX + 1);
  let segment = 3 + rng.int(4);
  for (let y = startRows; y < FLOOR_ROWS; y += 1) {
    path.push({ x, y });
    segment -= 1;
    if (segment > 0 || y >= FLOOR_ROWS - 2) continue;
    const direction = rng.int(2) === 0 ? -1 : 1;
    const nextX = clamp(x + direction, lane.x, lane.x + lane.width - 1);
    if (nextX !== x) {
      x = nextX;
      path.push({ x, y });
    }
    segment = 3 + rng.int(5);
  }
  return path;
}

// games/memory-challenge/src/fixtures.ts
var players = [
  { name: "Verde", color: "#42e879" },
  { name: "Cian", color: "#24d9ff" }
];
function gameAt(stage) {
  const game8 = createGame10({ playerCount: 2, players, seed: 137 });
  game8.init(0);
  if (stage !== "waiting") occupy(game8, 100);
  if (stage === "memorize" || stage === "recall") game8.tick({ atMillis: 2200 });
  if (stage === "recall") game8.tick({ atMillis: 5100 });
  return game8;
}
var waiting = gameAt("waiting");
var waitingFrame3 = waiting.render();
var waitingSnapshot4 = waiting.snapshot();
var starting = gameAt("starting");
var startingFrame3 = starting.render();
var startingSnapshot4 = starting.snapshot();
var memorizing = gameAt("memorize");
var memorizingFrame = memorizing.render();
var memorizingSnapshot = memorizing.snapshot();
var recalling = gameAt("recall");
playSteps(recalling, 0, 7, 5200);
var recallingFrame = recalling.render();
var recallingSnapshot = recalling.snapshot();
var failed = gameAt("recall");
failed.press({ x: 7, y: 31, pressed: true, atMillis: 5200 });
var failedFrame2 = failed.render();
var failedSnapshot2 = failed.snapshot();
var finished = gameAt("recall");
playSteps(finished, 0, Number.POSITIVE_INFINITY, 5200);
var finishedFrame6 = finished.render();
var finishedSnapshot6 = finished.snapshot();
function occupy(game8, atMillis) {
  for (const zone of game8.playerReadyZones()) game8.press({ x: zone.minX, y: zone.minY, pressed: true, atMillis });
}
function playSteps(game8, player, count, atMillis) {
  game8.pathForPlayer(player).slice(0, count).forEach((point, index) => game8.press({ ...point, pressed: true, atMillis: atMillis + index }));
}

// games/memoria-v2/src/index.ts
var src_exports11 = {};
__export(src_exports11, {
  PlayerDisplay: () => PlayerDisplay11,
  createGame: () => createGame11,
  initEvents: () => initEvents5,
  manifest: () => manifest11,
  memoriaV2GameWinMillis: () => memoriaV2GameWinMillis,
  memoriaV2MemorizeMillis: () => memoriaV2MemorizeMillis,
  memoriaV2RoundWinMillis: () => memoriaV2RoundWinMillis,
  memoriaV2StartingLives: () => memoriaV2StartingLives,
  memoriaV2TotalLevels: () => memoriaV2TotalLevels,
  memorizeFrame: () => memorizeFrame,
  memorizeSnapshot: () => memorizeSnapshot,
  memoryTargetsForLevel: () => memoryTargetsForLevel,
  roundWinFrame: () => roundWinFrame3,
  roundWinSnapshot: () => roundWinSnapshot3,
  runningFrame: () => runningFrame9,
  runningSnapshot: () => runningSnapshot9,
  startingSnapshot: () => startingSnapshot5,
  waitingSnapshot: () => waitingSnapshot5
});

// games/memoria-v2/src/display.tsx
var import_jsx_runtime13 = __toESM(require_jsx_runtime(), 1);
function PlayerDisplay11({ snapshot, frame }) {
  const message = snapshot.memoryStage === "memorize" ? `Memoriza \xB7 ${formatClock(snapshot.stageMillis)}` : snapshot.lastEventMessage;
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(GameDisplayShell, { title: snapshot.label, phase: snapshot.phase, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "ml-solo-display", children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(PlayerReadyOverlay, { snapshot }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "ml-solo-summary", children: [
      /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(MetricRow, { columns: 3, className: "ml-solo-number-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(MetricPanel, { label: "Nivel", tone: "blue", value: `${snapshot.level}/${snapshot.totalLevels}` }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(MetricPanel, { label: "Aciertos", tone: "green", value: `${snapshot.claimedTargets}/${snapshot.totalTargets}` }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(MetricPanel, { label: "Vidas", tone: "red", value: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(LivesMeter, { lives: snapshot.lives, maxLives: snapshot.maxLives }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(MetricPanel, { className: "ml-solo-message", label: "Memoria", tone: snapshot.success ? "green" : snapshot.memoryStage === "game-loss" ? "red" : "yellow", value: message })
    ] }),
    frame ? /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(FramePreviewPanel, { className: "ml-solo-floor", frame, label: "Figura en el suelo" }) : null
  ] }) });
}

// games/memoria-v2/src/manifest.ts
var manifest11 = {
  id: "memoria-v2",
  label: "Memoria v2",
  description: "Memoriza y reconstruye figuras cada vez m\xE1s complejas durante veinte niveles.",
  availability: { development: true, production: true },
  catalog: {
    category: "team",
    color: "#22d3ee",
    durationLabel: "20 niveles",
    modeLabel: "Memoria progresiva",
    audioLabel: "M\xFAsica + efectos",
    rules: ["Memoriza la figura azul", "Reconstr\xFAyela cuando desaparezca", "Cada nivel permite tres errores"]
  },
  players: { allowAny: true, min: 1, max: 8 },
  start: { mode: "player-ready", releaseGraceMillis: 1500 },
  defaultDurationMillis: 36e4,
  display: { entry: "./display" },
  preview: {
    seed: 137,
    playerCount: 0,
    actions: [{ atMillis: 100, type: "press", x: 8, y: 16 }],
    captureStartMillis: 2300,
    frameCount: 24,
    frameIntervalMillis: 120
  },
  tags: ["memoria", "cooperativo", "typescript"]
};

// games/memoria-v2/src/game.ts
var memoriaV2TotalLevels = 20;
var memoriaV2StartingLives = 3;
var memoriaV2MemorizeMillis = 5e3;
var memoriaV2RoundWinMillis = 2200;
var memoriaV2GameWinMillis = 5e3;
function createGame11(config) {
  return new MemoriaV2Game(config);
}
function memoryTargetsForLevel(seed, level) {
  const rng = createSeededRng(seed + level * 2654435769 >>> 0);
  const targetCount = Math.min(20, 4 + Math.floor((level - 1) / 2));
  const points = [];
  const used = /* @__PURE__ */ new Set();
  while (points.length < targetCount) {
    const point = { x: rng.int(16), y: 4 + rng.int(24) };
    const key = `${point.x},${point.y}`;
    if (!used.has(key)) {
      used.add(key);
      points.push(point);
    }
  }
  return points;
}
var MemoriaV2Game = class {
  claimed = /* @__PURE__ */ new Set();
  config;
  lastEvent = gameEvent("none", "Listo", 0);
  level = 1;
  lives = memoriaV2StartingLives;
  nowMillis = 0;
  phase = "ready";
  players;
  readyGate;
  stage = "memorize";
  stageEndsAtMillis = 0;
  startedAtMillis = 0;
  targets = [];
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest11);
    this.readyGate = createPlayerReadyGate(manifest11.start, [{ minX: 5, maxX: 10, minY: 13, maxY: 18 }], this.config.nowMillis);
    this.targets = memoryTargetsForLevel(this.config.seed, this.level);
    this.players = this.scoredPlayers();
  }
  init(nowMillis) {
    this.resetState(nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") return this.applyReadyTransition(this.readyGate.update(event), event.atMillis);
    if (this.phase !== "running" || this.stage !== "recall" || !event.pressed) return [];
    const key = `${event.x},${event.y}`;
    if (this.targets.some((target3) => target3.x === event.x && target3.y === event.y)) {
      if (this.claimed.has(key)) return [];
      this.claimed.add(key);
      this.players = this.scoredPlayers();
      if (this.claimed.size === this.targets.length) return this.completeLevel(event.atMillis);
      this.lastEvent = gameEvent("hit", `Acierto ${this.claimed.size} de ${this.targets.length}`, event.atMillis);
      return [this.lastEvent];
    }
    this.lives -= 1;
    this.players = this.scoredPlayers();
    if (this.lives <= 0) return this.finish(false, "Sin vidas", event.atMillis);
    this.lastEvent = gameEvent("damage", `Error, quedan ${this.lives} vidas`, event.atMillis);
    return [this.lastEvent];
  }
  release(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") return this.applyReadyTransition(this.readyGate.update({ ...event, pressed: false }), event.atMillis);
    return [];
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") return this.applyReadyTransition(this.readyGate.tick(event.atMillis), event.atMillis);
    if (this.phase === "finished") {
      if (event.atMillis >= this.stageEndsAtMillis) {
        this.resetState(event.atMillis);
        return [this.lastEvent];
      }
      return [];
    }
    if (this.stage === "memorize" && event.atMillis >= this.stageEndsAtMillis) {
      this.stage = "recall";
      this.lastEvent = gameEvent("start", "Reconstruye la figura", event.atMillis);
      return [this.lastEvent];
    }
    if (this.stage === "round-win" && event.atMillis >= this.stageEndsAtMillis) {
      this.level += 1;
      this.lives = memoriaV2StartingLives;
      this.claimed.clear();
      this.targets = memoryTargetsForLevel(this.config.seed, this.level);
      this.stage = "memorize";
      this.stageEndsAtMillis = event.atMillis + memoriaV2MemorizeMillis;
      this.lastEvent = gameEvent("ready", `Memoriza el nivel ${this.level}`, event.atMillis);
      this.players = this.scoredPlayers();
      return [this.lastEvent];
    }
    return [];
  }
  render() {
    const frame = createFrame("#020712");
    if (this.phase === "waiting" || this.phase === "starting") {
      const step = Math.floor(this.nowMillis / (this.phase === "starting" ? 100 : 180));
      paintDiamondRing(frame, { centerX: 8, centerY: 16, radius: 2 + step % 8, color: this.phase === "starting" ? "#ffe176" : "#22d3ee" });
      return frame;
    }
    if (this.stage === "memorize") {
      for (const target3 of this.targets) paintFrameCell(frame, target3.x, target3.y, "#22d3ee");
    } else if (this.stage === "recall") {
      for (const target3 of this.targets) if (this.claimed.has(`${target3.x},${target3.y}`)) paintFrameCell(frame, target3.x, target3.y, "#35e77a");
    } else {
      const color = this.stage === "game-loss" ? "#ff334e" : this.stage === "round-win" ? "#ffe176" : "#35e77a";
      paintDiamondWave(frame, { color, step: Math.floor((this.stageEndsAtMillis - this.nowMillis) / 140) });
    }
    return frame;
  }
  snapshot() {
    const ready = this.readyGate.state(this.nowMillis);
    return {
      currentGame: manifest11.id,
      label: manifest11.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: this.players,
      score: this.claimed.size,
      lives: this.lives,
      maxLives: memoriaV2StartingLives,
      elapsedMillis: this.elapsedMillis(),
      remainingMillis: this.stage === "memorize" ? Math.max(0, this.stageEndsAtMillis - this.nowMillis) : 0,
      activeTargets: this.stage === "recall" ? this.targets.length - this.claimed.size : 0,
      success: this.phase === "finished" && this.stage === "game-win",
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? ready.countdownMillis : 0,
      readyPlayers: ready.readyPlayers,
      requiredPlayers: ready.requiredPlayers,
      matchTarget: this.targets.length,
      level: this.level,
      totalLevels: memoriaV2TotalLevels,
      memoryStage: this.stage,
      claimedTargets: this.claimed.size,
      totalTargets: this.targets.length,
      targets: this.targets.map((target3) => ({ ...target3 })),
      stageMillis: Math.max(0, this.stageEndsAtMillis - this.nowMillis)
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest11);
    this.resetState(this.config.nowMillis);
  }
  applyReadyTransition(transition, nowMillis) {
    if (transition === "players-ready") {
      this.phase = "starting";
      this.lastEvent = gameEvent("ready", "Jugador listo", nowMillis);
    } else if (transition === "players-left") {
      this.phase = "waiting";
      this.lastEvent = gameEvent("ready", "Vuelve al centro", nowMillis);
    } else if (transition === "started") {
      this.phase = "running";
      this.stage = "memorize";
      this.stageEndsAtMillis = nowMillis + memoriaV2MemorizeMillis;
      this.startedAtMillis = nowMillis;
      this.lastEvent = gameEvent("start", "Memoriza la figura azul", nowMillis);
    } else return [];
    return [this.lastEvent];
  }
  completeLevel(atMillis) {
    if (this.level >= memoriaV2TotalLevels) return this.finish(true, "Memoria completada", atMillis);
    this.stage = "round-win";
    this.stageEndsAtMillis = atMillis + memoriaV2RoundWinMillis;
    this.lastEvent = gameEvent("win", `Nivel ${this.level} completado`, atMillis);
    return [this.lastEvent];
  }
  elapsedMillis() {
    if (this.phase === "waiting" || this.phase === "starting") return 0;
    return Math.max(0, this.nowMillis - this.startedAtMillis);
  }
  finish(success, message, atMillis) {
    this.phase = "finished";
    this.stage = success ? "game-win" : "game-loss";
    this.stageEndsAtMillis = atMillis + memoriaV2GameWinMillis;
    this.lastEvent = gameEvent(success ? "win" : "fail", message, atMillis);
    return [this.lastEvent];
  }
  resetState(nowMillis) {
    this.readyGate.reset(nowMillis);
    this.claimed.clear();
    this.level = 1;
    this.lives = memoriaV2StartingLives;
    this.nowMillis = nowMillis;
    this.phase = "waiting";
    this.stage = "memorize";
    this.stageEndsAtMillis = 0;
    this.startedAtMillis = nowMillis;
    this.targets = memoryTargetsForLevel(this.config.seed, this.level);
    this.lastEvent = gameEvent("ready", "Espera en la zona central", nowMillis);
    this.players = this.scoredPlayers();
  }
  scoredPlayers() {
    return defaultPlayers(this.config.playerCount, this.config.players).map((player) => ({ ...player, score: this.level - 1, lives: this.lives }));
  }
};

// games/memoria-v2/src/fixtures.ts
var game3 = createGame11({ playerCount: 0, seed: 137 });
var initEvents5 = game3.init(0);
var waitingSnapshot5 = game3.snapshot();
game3.press({ x: 8, y: 16, pressed: true, atMillis: 100 });
var startingSnapshot5 = game3.snapshot();
game3.tick({ atMillis: 2100 });
var memorizeFrame = game3.render();
var memorizeSnapshot = game3.snapshot();
game3.tick({ atMillis: 7100 });
var runningFrame9 = game3.render();
var runningSnapshot9 = game3.snapshot();
for (const target3 of game3.snapshot().targets) game3.press({ ...target3, pressed: true, atMillis: 7200 });
var roundWinFrame3 = game3.render();
var roundWinSnapshot3 = game3.snapshot();

// games/meteor-dodge/src/index.ts
var src_exports12 = {};
__export(src_exports12, {
  PlayerDisplay: () => PlayerDisplay12,
  createGame: () => createGame12,
  damagedFrame: () => damagedFrame4,
  damagedSnapshot: () => damagedSnapshot4,
  failedFrame: () => failedFrame3,
  failedSnapshot: () => failedSnapshot3,
  finishedFrame: () => finishedFrame7,
  finishedSnapshot: () => finishedSnapshot7,
  gameWinAnimationMillis: () => gameWinAnimationMillis3,
  initEvents: () => initEvents6,
  manifest: () => manifest12,
  meteorCoreColor: () => meteorCoreColor,
  meteorDifficultyProfile: () => meteorDifficultyProfile,
  meteorImpactColor: () => meteorImpactColor,
  meteorImpactVisibleMillis: () => meteorImpactVisibleMillis,
  meteorWarningColor: () => meteorWarningColor,
  playerFootprintColor: () => playerFootprintColor,
  runningFrame: () => runningFrame10,
  runningSnapshot: () => runningSnapshot10,
  startingLives: () => startingLives3
});

// games/meteor-dodge/src/display.tsx
var import_jsx_runtime14 = __toESM(require_jsx_runtime(), 1);
function PlayerDisplay12({
  snapshot,
  frame
}) {
  const message = snapshot.phase === "finished" ? snapshot.success ? "\xA1Tormenta superada!" : "La tormenta te alcanz\xF3" : snapshot.lastEventMessage || "Esquiva las zonas rojas";
  const messageTone = snapshot.success ? "green" : snapshot.lives === 0 ? "red" : "cyan";
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(GameDisplayShell, { title: snapshot.label, phase: snapshot.phase, children: /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "ml-solo-display meteor-dodge-display", children: [
    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(PlayerReadyOverlay, { snapshot }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "ml-solo-summary", children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(MetricRow, { columns: 3, className: "ml-solo-number-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(MetricPanel, { label: "Esquivados", tone: "cyan", value: snapshot.dodgedMeteors }),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
          MetricPanel,
          {
            label: "Vidas",
            tone: "neutral",
            value: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(LivesMeter, { lives: snapshot.lives, maxLives: snapshot.maxLives })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(MetricPanel, { label: "Tiempo", tone: "yellow", value: formatClock(snapshot.remainingMillis) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(MetricPanel, { className: "ml-solo-message", label: "Estado", tone: messageTone, value: message })
    ] }),
    frame ? /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(FramePreviewPanel, { className: "ml-solo-floor", frame, label: "Tormenta en el suelo" }) : null
  ] }) });
}

// games/meteor-dodge/src/manifest.ts
var manifest12 = {
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
var startingLives3 = 3;
var gameWinAnimationMillis3 = 3e3;
var meteorImpactVisibleMillis = 450;
var meteorWarningColor = "#ff5a36";
var meteorCoreColor = "#ffe176";
var meteorImpactColor = "#ffffff";
var playerFootprintColor = "#35d7ff";
var backgroundColor5 = "#02050b";
var backgroundStripeColor = "#050d19";
var readyZoneColor = "#145cff";
var readyPulseColor = "#35d7ff";
var startingColor = "#ffe176";
var successColors3 = ["#35d7ff", "#5fff9e", "#ffe176", "#ff3bd7", "#ffffff"];
var failColors = ["#ff3151", "#7b1428", "#2a0710"];
var damageCooldownMillis = 1e3;
var firstMeteorDelayMillis = 350;
var maxSpawnCatchUp = 64;
var readyZone2 = { minX: 4, maxX: 11, minY: 12, maxY: 19 };
var mediumDifficultyProfile = {
  intervalMillis: 1550,
  largeMeteorEvery: 5,
  radius: 1,
  warningMillis: 1350
};
var difficultyProfiles3 = {
  easy: { intervalMillis: 1900, largeMeteorEvery: 0, radius: 1, warningMillis: 1650 },
  medium: mediumDifficultyProfile,
  hard: { intervalMillis: 1200, largeMeteorEvery: 3, radius: 1, warningMillis: 1050 },
  expert: { intervalMillis: 900, largeMeteorEvery: 1, radius: 2, warningMillis: 800 }
};
function createGame12(config) {
  return new MeteorDodgeGame(config);
}
var MeteorDodgeGame = class {
  config;
  dodgedMeteors = 0;
  finishedAtMillis = 0;
  lastDamageMillis = Number.NEGATIVE_INFINITY;
  lastEvent = gameEvent("none", "Listos para la tormenta", 0);
  lives = startingLives3;
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
    this.config = normalizeGameConfig(config, manifest12);
    this.rng = createSeededRng(this.config.seed);
    this.readyGate = createPlayerReadyGate(manifest12.start, [readyZone2], this.config.nowMillis);
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
    const frame = createFrame(backgroundColor5);
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
    const celebrationMillis = this.success && this.phase === "finished" ? Math.max(0, Math.min(gameWinAnimationMillis3, this.nowMillis - this.finishedAtMillis)) : 0;
    return {
      currentGame: manifest12.id,
      label: manifest12.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: this.players.map((player) => ({ ...player, lives: this.lives, score: this.dodgedMeteors })),
      score: this.dodgedMeteors,
      lives: this.lives,
      maxLives: startingLives3,
      elapsedMillis: this.elapsedMillis(),
      remainingMillis: this.remainingMillis(),
      activeTargets: this.meteors.filter((meteor) => meteor.result === "pending").length,
      success: this.success,
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? readyState.countdownMillis : 0,
      readyPlayers: readyState.readyPlayers,
      requiredPlayers: readyState.requiredPlayers,
      celebrating: this.success && this.phase === "finished" && celebrationMillis < gameWinAnimationMillis3,
      celebrationMillis,
      dodgedMeteors: this.dodgedMeteors,
      meteors: this.meteors.map((meteor) => ({ ...meteor })),
      stormDurationMillis: this.config.durationMillis
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest12);
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
    return difficultyProfiles3[this.config.difficulty] ?? mediumDifficultyProfile;
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
        fillFrameRect(frame, meteor.x - meteor.radius + 1, meteor.y - meteor.radius + 1, size - 2, size - 2, backgroundColor5);
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
    const x = readyZone2.minX + inset;
    const y = readyZone2.minY + inset;
    const width = readyZone2.maxX - readyZone2.minX + 1 - inset * 2;
    const height = readyZone2.maxY - readyZone2.minY + 1 - inset * 2;
    fillFrameRect(frame, x, y, width, height, color);
    if (width > 2 && height > 2) {
      fillFrameRect(frame, x + 1, y + 1, width - 2, height - 2, backgroundColor5);
    }
    paintFrameCell(frame, 7, 15, "#ffffff");
    paintFrameCell(frame, 8, 16, "#ffffff");
  }
  drawWinAnimation(frame) {
    const step = Math.floor(Math.max(0, this.nowMillis - this.finishedAtMillis) / 120);
    paintDiamondWave(frame, {
      color: ({ distance }) => successColors3[(distance + step) % successColors3.length] ?? successColors3[0],
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
    this.lives = startingLives3;
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
    const profile2 = this.difficultyProfile();
    let spawned = 0;
    while (this.nextMeteorMillis > 0 && this.nextMeteorMillis <= nowMillis && spawned < maxSpawnCatchUp) {
      const id = this.nextMeteorId;
      const large = profile2.largeMeteorEvery > 0 && id % profile2.largeMeteorEvery === 0;
      const radius = large ? Math.min(2, profile2.radius + 1) : profile2.radius;
      const impactAtMillis = this.nextMeteorMillis + profile2.warningMillis;
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
      this.nextMeteorMillis += profile2.intervalMillis;
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
  return { ...difficultyProfiles3[difficulty] ?? mediumDifficultyProfile };
}
function occupiedTileCoordinates(tile) {
  const [x = "0", y = "0"] = tile.split(",");
  return [Number(x), Number(y)];
}

// games/meteor-dodge/src/fixtures.ts
var runningGame7 = createGame12({ playerCount: 1, difficulty: "medium", seed: 137 });
var initEvents6 = runningGame7.init(0);
startGame2(runningGame7);
runningGame7.release({ x: 8, y: 16, pressed: false, atMillis: 2150 });
runningGame7.tick({ atMillis: 4e3 });
var runningFrame10 = runningGame7.render();
var runningSnapshot10 = runningGame7.snapshot();
var damagedGame3 = createGame12({ playerCount: 1, difficulty: "easy", seed: 137 });
damagedGame3.init(0);
startGame2(damagedGame3);
damageOnce(damagedGame3, 2450);
var damagedFrame4 = damagedGame3.render();
var damagedSnapshot4 = damagedGame3.snapshot();
var finishedGame5 = createGame12({ playerCount: 1, difficulty: "medium", durationMillis: 4e3, seed: 137 });
finishedGame5.init(0);
startGame2(finishedGame5);
finishedGame5.release({ x: 8, y: 16, pressed: false, atMillis: 2150 });
finishedGame5.tick({ atMillis: 6100 });
finishedGame5.tick({ atMillis: 7e3 });
var finishedFrame7 = finishedGame5.render();
var finishedSnapshot7 = finishedGame5.snapshot();
var failedGame2 = createGame12({ playerCount: 1, difficulty: "easy", seed: 137 });
failedGame2.init(0);
startGame2(failedGame2);
var failureClock = 2450;
for (let hit = 0; hit < 3; hit += 1) {
  failureClock = damageOnce(failedGame2, failureClock) + 1050;
}
var failedFrame3 = failedGame2.render();
var failedSnapshot3 = failedGame2.snapshot();
function startGame2(game8) {
  game8.press({ x: 8, y: 16, pressed: true, atMillis: 100 });
  game8.tick({ atMillis: 2100 });
}
function damageOnce(game8, nowMillis) {
  game8.release({ x: 8, y: 16, pressed: false, atMillis: nowMillis });
  game8.tick({ atMillis: nowMillis });
  const meteor = game8.snapshot().meteors.find((candidate) => candidate.result === "pending");
  if (!meteor) {
    return nowMillis;
  }
  game8.press({ x: meteor.x, y: meteor.y, pressed: true, atMillis: meteor.impactAtMillis - 1 });
  game8.tick({ atMillis: meteor.impactAtMillis });
  game8.release({ x: meteor.x, y: meteor.y, pressed: false, atMillis: meteor.impactAtMillis + 1 });
  return meteor.impactAtMillis + 1;
}

// games/parkour/src/index.ts
var src_exports13 = {};
__export(src_exports13, {
  PlayerDisplay: () => PublishedLevelPlayerDisplay,
  countdownFrame: () => countdownFrame,
  countdownSnapshot: () => countdownSnapshot,
  createGame: () => createGame13,
  createSessionController: () => createSessionController2,
  fallbackContent: () => fallbackContent,
  finishedFrame: () => finishedFrame8,
  finishedSnapshot: () => finishedSnapshot8,
  initEvents: () => initEvents7,
  manifest: () => manifest13,
  parkourEngineGame: () => parkourEngineGame,
  parkourGameId: () => parkourGameId,
  runningFrame: () => runningFrame11,
  runningSnapshot: () => runningSnapshot11
});

// packages/published-level-runtime/src/display.tsx
var import_jsx_runtime15 = __toESM(require_jsx_runtime(), 1);
function PublishedLevelPlayerDisplay({
  snapshot: rawSnapshot,
  frame
}) {
  const snapshot = rawSnapshot;
  const countdown = Math.max(1, Math.ceil((snapshot.countdownMillis ?? 0) / 1e3));
  const maxLives = Math.max(1, snapshot.maxLives ?? snapshot.lives);
  const lifeScale = Math.min(1, 3.3 / maxLives);
  const lifeStyle = {
    display: "block",
    transform: `scale(${lifeScale})`,
    transformOrigin: "left center",
    width: `${100 / lifeScale}%`
  };
  const phase = snapshot.phase === "countdown" ? "starting" : snapshot.phase;
  const clockMillis = snapshot.mode === "challenge" && snapshot.remainingMillis > 0 ? snapshot.remainingMillis : snapshot.elapsedMillis;
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(GameDisplayShell, { title: snapshot.label, phase, children: /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: `ml-solo-display published-level-display is-${snapshot.phase}`, children: [
    snapshot.phase === "countdown" ? /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(
      "section",
      {
        "aria-label": "El nivel est\xE1 a punto de empezar",
        className: "ml-player-ready-overlay is-starting",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "ml-player-ready-pulse", "aria-hidden": "true", children: [
            /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("i", {}),
            /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("i", {}),
            /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("i", {})
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("span", { children: snapshot.levelLabel || "Siguiente nivel" }),
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("strong", { children: countdown }),
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("b", { children: "Busca una zona verde y prep\xE1rate" })
        ]
      }
    ) : null,
    /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "ml-solo-summary", children: [
      /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(MetricRow, { columns: 3, className: "ml-solo-number-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(MetricPanel, { label: "Puntos", tone: "green", value: snapshot.score }),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
          MetricPanel,
          {
            label: "Vidas",
            tone: "red",
            value: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("span", { style: lifeStyle, children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(LivesMeter, { lives: snapshot.lives, maxLives }) })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(MetricPanel, { label: "Tiempo", tone: "cyan", value: formatClock(clockMillis) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
        MetricPanel,
        {
          className: "ml-solo-message",
          label: messageLabel(snapshot),
          tone: snapshot.phase === "finished" ? snapshot.success ? "green" : "red" : "blue",
          value: messageValue(snapshot)
        }
      )
    ] }),
    frame ? /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(FramePreviewPanel, { className: "ml-solo-floor", frame, label: "Juego en el suelo" }) : null
  ] }) });
}
function messageLabel(snapshot) {
  if (snapshot.phase === "finished") return snapshot.success ? "Resultado" : "Reintento";
  return snapshot.levelCount > 1 ? `Nivel ${Math.max(1, snapshot.levelNumber)} de ${snapshot.levelCount}` : "Misi\xF3n";
}
function messageValue(snapshot) {
  if (snapshot.phase === "finished") {
    if (snapshot.success) {
      return snapshot.isFinalLevel ? "\xA1Juego completado!" : "\xA1Nivel superado!";
    }
    const seconds = Math.max(1, Math.ceil(snapshot.resultMillis / 1e3));
    return `Vuelve a intentarlo en ${seconds}`;
  }
  const currentMillis = snapshot.phase === "countdown" ? snapshot.attemptStartedMillis - snapshot.countdownMillis : snapshot.attemptStartedMillis + snapshot.elapsedMillis;
  const recentSemanticEvent = ["coin", "doubleCoin", "damage"].includes(snapshot.lastEventCue) && currentMillis - snapshot.lastEventMillis <= 2500;
  if (recentSemanticEvent && snapshot.lastEventMessage) return snapshot.lastEventMessage;
  if (snapshot.objectivesRemaining > 0) {
    return snapshot.objectivesRemaining === 1 ? "Queda 1 objetivo" : `Quedan ${snapshot.objectivesRemaining} objetivos`;
  }
  return snapshot.levelDescription || "Recoge los objetivos y evita las baldosas rojas";
}

// packages/published-level-runtime/src/types.ts
var PUBLISHED_LEVEL_CONTENT_SCHEMA = "motion-levels-published-level-content-v1";

// packages/published-level-runtime/src/content.ts
var MAX_LEVELS = 160;
var MAX_RESULT_ANIMATIONS = 160;
var MAX_FRAMES_PER_RECORD = 4096;
var MAX_CELLS_PER_FRAME = FLOOR_COLS * FLOOR_ROWS * 2;
function createPublishedLevelContent(input2) {
  const gameId = requiredStableId(input2.gameId, "gameId");
  const engineGame = requiredString(input2.engineGame, "engineGame", 120).toLowerCase();
  const rawLevels = recordsFromPayload(input2.levelsPayload, "levelsPayload");
  if (rawLevels.length === 0) throw new Error("Published level content has no playable levels");
  if (rawLevels.length > MAX_LEVELS) {
    throw new Error(`Published level content exceeds the ${MAX_LEVELS} level limit`);
  }
  const levels = rawLevels.map((value, index) => normalizeLevelRecord(value, `levels[${index}]`));
  const levelIds = /* @__PURE__ */ new Set();
  for (const level of levels) {
    if (levelIds.has(level.id)) {
      throw new Error(`Published level content contains duplicate canonical level id ${level.id}`);
    }
    levelIds.add(level.id);
  }
  const rawAnimations = optionalRecordsFromPayload(input2.resultAnimationsPayload, "resultAnimationsPayload");
  if (rawAnimations.length > MAX_RESULT_ANIMATIONS) {
    throw new Error(`Published level content exceeds the ${MAX_RESULT_ANIMATIONS} animation limit`);
  }
  const resultAnimations = rawAnimations.map(
    (value, index) => normalizeAnimationRecord(value, `resultAnimations[${index}]`)
  );
  const selection = resolveLevelSelection(levels, input2.selectedLevelId, input2.selectedLevelSlug);
  const selectedLevelId = selection.id;
  const selectedLevelSlug = selection.slug;
  if (input2.mode !== void 0 && input2.mode !== "free" && input2.mode !== "challenge") {
    throw new Error("mode must be challenge or free");
  }
  const mode = input2.mode ?? "challenge";
  const suppliedRevision = input2.contentRevision;
  if (suppliedRevision !== void 0 && !/^[0-9a-f]{16,64}$/u.test(suppliedRevision)) {
    throw new Error("contentRevision must be 16 through 64 lowercase hexadecimal characters");
  }
  const contentRevision = suppliedRevision || contentHash({ gameId, engineGame, selectedLevelId, selectedLevelSlug, mode, levels, resultAnimations });
  return deepFreeze({
    schema: PUBLISHED_LEVEL_CONTENT_SCHEMA,
    gameId,
    engineGame,
    contentRevision,
    selectedLevelId,
    selectedLevelSlug,
    mode,
    levels,
    resultAnimations
  });
}
function parsePublishedLevelContent(value, expectedGameId, aliases = []) {
  if (!value || value.schema !== PUBLISHED_LEVEL_CONTENT_SCHEMA) {
    throw new Error(`Expected ${PUBLISHED_LEVEL_CONTENT_SCHEMA} content`);
  }
  if (typeof value.contentRevision !== "string") {
    throw new Error("content.contentRevision must be supplied by the content boundary");
  }
  const canonicalExpectedGameId = requiredStableId(expectedGameId, "expectedGameId");
  const contentGameId = requiredStableId(value.gameId, "content.gameId");
  if (contentGameId !== canonicalExpectedGameId) {
    throw new Error(`Published level content is for ${contentGameId}, expected ${canonicalExpectedGameId}`);
  }
  void aliases;
  const parsed = createPublishedLevelContent({
    gameId: contentGameId,
    engineGame: requiredString(value.engineGame, "content.engineGame", 120),
    contentRevision: value.contentRevision,
    selectedLevelId: optionalText(value.selectedLevelId, 120) || void 0,
    selectedLevelSlug: optionalText(value.selectedLevelSlug, 120) || void 0,
    mode: value.mode,
    levelsPayload: value.levels,
    resultAnimationsPayload: value.resultAnimations
  });
  return parsed;
}
function normalizeLevelId(value) {
  const clean = optionalText(value, 120).toLowerCase();
  if (!clean || clean === "starter") return "level-1";
  const numeric = /^(?:(?:nivel|level)[\s-]*)?(\d+)$/u.exec(clean);
  return numeric ? `level-${Math.max(1, Number(numeric[1]))}` : clean;
}
function recordsFromPayload(value, path) {
  if (Array.isArray(value)) return value;
  if (!isRecord(value) || !Array.isArray(value.levels)) {
    throw new Error(`${path} must be an array or an object with a levels array`);
  }
  return value.levels;
}
function optionalRecordsFromPayload(value, path) {
  if (value === void 0 || value === null) return [];
  return recordsFromPayload(value, path);
}
function normalizeLevelRecord(value, path) {
  const record = requiredRecord(value, path);
  const id = requiredStableId(record.id, `${path}.id`);
  const slugSource = requiredText(record.slug, `${path}.slug`, 120);
  const slug = normalizeLevelId(slugSource);
  const frames = normalizeFrames(record.frames, `${path}.frames`);
  if (frames.length === 0) throw new Error(`${path}.frames must contain at least one frame`);
  const rules = normalizeRules(record.rules, `${path}.rules`);
  const resultAnimations = normalizeResultAnimations(record.result_animations, `${path}.result_animations`);
  return compactObject({
    id,
    slug,
    settings_hash: optionalText(record.settings_hash, 160) || void 0,
    label: optionalText(record.label, 160) || levelLabel(slug),
    description: optionalText(record.description, 500) || void 0,
    difficulty: optionalText(record.difficulty, 40).toLowerCase() || void 0,
    life: optionalInteger(record.life, 0, 99, `${path}.life`),
    pass_score: optionalInteger(record.pass_score, 0, 1e5, `${path}.pass_score`),
    time_limit_seconds: optionalInteger(record.time_limit_seconds, 0, 86400, `${path}.time_limit_seconds`),
    frame_tick_ms: optionalInteger(record.frame_tick_ms, 1, 6e4, `${path}.frame_tick_ms`) ?? 25,
    rules,
    result_animations: resultAnimations,
    music_ref: optionalText(record.music_ref, 500) || void 0,
    music_volume: optionalFinite(record.music_volume, 0, 1, `${path}.music_volume`),
    narration_cue_ref: optionalText(record.narration_cue_ref, 500) || void 0,
    start_cue_ref: optionalText(record.start_cue_ref, 500) || void 0,
    coin_cue_ref: optionalText(record.coin_cue_ref, 500) || void 0,
    double_coin_cue_ref: optionalText(record.double_coin_cue_ref, 500) || void 0,
    damage_cue_ref: optionalText(record.damage_cue_ref, 500) || void 0,
    win_cue_ref: optionalText(record.win_cue_ref, 500) || void 0,
    defeat_cue_ref: optionalText(record.defeat_cue_ref, 500) || void 0,
    frames
  });
}
function normalizeAnimationRecord(value, path) {
  const record = requiredRecord(value, path);
  const slug = optionalText(record.slug ?? record.id, 120).toLowerCase();
  if (!slug) throw new Error(`${path} requires slug or id`);
  const frames = normalizeFrames(record.frames, `${path}.frames`);
  if (frames.length === 0) throw new Error(`${path}.frames must contain at least one frame`);
  const effects = record.tile_effects === void 0 ? {} : requiredRecord(record.tile_effects, `${path}.tile_effects`);
  const tileEffects = Object.fromEntries(Object.entries(effects).map(([kind, effect]) => {
    const effectRecord = requiredRecord(effect, `${path}.tile_effects.${kind}`);
    const color = normalizeHex(effectRecord.color);
    if (!color) throw new Error(`${path}.tile_effects.${kind}.color must be a six-digit hex color`);
    return [kind, { color }];
  }));
  return compactObject({
    id: optionalText(record.id, 120) || void 0,
    slug,
    frame_tick_ms: optionalInteger(record.frame_tick_ms, 1, 6e4, `${path}.frame_tick_ms`) ?? 50,
    tile_effects: tileEffects,
    frames
  });
}
function resolveLevelSelection(levels, requestedId, requestedSlug) {
  const cleanId = optionalText(requestedId, 120).toLowerCase();
  const cleanSlug = requestedSlug ? normalizeLevelId(requestedSlug) : "";
  let selected;
  if (cleanId) {
    selected = levels.find((level) => level.id.toLowerCase() === cleanId);
    if (!selected) {
      const legacyMatches = levels.filter((level) => normalizeLevelId(level.slug) === normalizeLevelId(cleanId));
      if (legacyMatches.length > 1) {
        throw new Error(`Legacy selected level alias ${cleanId} is ambiguous`);
      }
      selected = legacyMatches[0];
      if (!selected) throw new Error(`Selected level ${cleanId} is not present in content`);
    }
  } else if (cleanSlug) {
    const matches = levels.filter((level) => normalizeLevelId(level.slug) === cleanSlug);
    if (matches.length !== 1) throw new Error(`Selected level slug ${cleanSlug} is not uniquely resolvable`);
    selected = matches[0];
  } else {
    selected = levels[0];
  }
  if (!selected) throw new Error("Published level content has no selected level");
  if (cleanSlug && normalizeLevelId(selected.slug) !== cleanSlug) {
    throw new Error(`selectedLevelSlug ${cleanSlug} does not match selectedLevelId ${selected.id}`);
  }
  return selected;
}
function normalizeFrames(value, path) {
  if (!Array.isArray(value)) throw new Error(`${path} must be an array`);
  if (value.length > MAX_FRAMES_PER_RECORD) {
    throw new Error(`${path} exceeds the ${MAX_FRAMES_PER_RECORD} frame limit`);
  }
  return value.map((raw, frameIndex) => {
    const record = requiredRecord(raw, `${path}[${frameIndex}]`);
    if (!Array.isArray(record.c)) throw new Error(`${path}[${frameIndex}].c must be an array`);
    if (record.c.length > MAX_CELLS_PER_FRAME) {
      throw new Error(`${path}[${frameIndex}].c exceeds the ${MAX_CELLS_PER_FRAME} cell limit`);
    }
    return {
      r: optionalInteger(record.r, 1, 1e6, `${path}[${frameIndex}].r`) ?? 1,
      c: record.c.map((cell, cellIndex2) => normalizeCell(cell, `${path}[${frameIndex}].c[${cellIndex2}]`))
    };
  });
}
function normalizeCell(value, path) {
  if (!Array.isArray(value) || value.length < 3 || value.length > 4) {
    throw new Error(`${path} must be [x, y, kind] or [x, y, kind, uniq]`);
  }
  const x = requiredInteger(value[0], 0, FLOOR_COLS - 1, `${path}[0]`);
  const y = requiredInteger(value[1], 0, FLOOR_ROWS - 1, `${path}[1]`);
  const kind = requiredInteger(value[2], 0, 255, `${path}[2]`);
  const uniq = optionalText(value[3], 120);
  return uniq ? [x, y, kind, uniq] : [x, y, kind];
}
function normalizeRules(value, path) {
  const rules = value === void 0 ? {} : requiredRecord(value, path);
  const victoryCondition = optionalText(rules.victory_condition, 40);
  if (victoryCondition && victoryCondition !== "collect_all" && victoryCondition !== "score_at_least") {
    throw new Error(`${path}.victory_condition is not supported`);
  }
  const redAnimation = optionalText(rules.red_floor_animation, 40);
  if (redAnimation && redAnimation !== "none" && redAnimation !== "parkour_lava") {
    throw new Error(`${path}.red_floor_animation is not supported`);
  }
  const loadSide = optionalText(rules.green_platform_load_side, 20);
  if (loadSide && loadSide !== "left" && loadSide !== "right") {
    throw new Error(`${path}.green_platform_load_side is not supported`);
  }
  return {
    victory_condition: victoryCondition,
    difficulty_changes_layout: rules.difficulty_changes_layout === true,
    difficulty_settings: normalizeDifficultySettings(rules.difficulty_settings, `${path}.difficulty_settings`),
    red_floor_animation: redAnimation,
    red_damage_grace_period: rules.red_damage_grace_period === true,
    green_platform_load_animation: rules.green_platform_load_animation !== false,
    green_platform_load_side: loadSide === "right" ? "right" : "left",
    green_platform_disappear: rules.green_platform_disappear === true,
    green_platform_impact_ripple: rules.green_platform_impact_ripple === true,
    blue_platform_turn_green: rules.blue_platform_turn_green === true,
    blue_platform_capture_area: rules.blue_platform_capture_area === true
  };
}
function normalizeResultAnimations(value, path) {
  const animations = value === void 0 ? {} : requiredRecord(value, path);
  return {
    victory_animations: textList(animations.victory_animations, `${path}.victory_animations`),
    defeat_animations: textList(animations.defeat_animations, `${path}.defeat_animations`)
  };
}
function normalizeDifficultySettings(value, path) {
  if (value === void 0) return {};
  const settings = requiredRecord(value, path);
  const entries = Object.entries(settings);
  if (entries.length > 12) throw new Error(`${path} exceeds the 12 difficulty limit`);
  return Object.fromEntries(entries.map(([key, raw]) => {
    const normalizedKey = requiredText(key, `${path} key`, 40).toLowerCase();
    const setting = requiredRecord(raw, `${path}.${normalizedKey}`);
    return [normalizedKey, compactObject({
      life: optionalInteger(setting.life, 0, 99, `${path}.${normalizedKey}.life`),
      frame_duration_ms: optionalInteger(
        setting.frame_duration_ms,
        0,
        6e4,
        `${path}.${normalizedKey}.frame_duration_ms`
      ),
      gameplay_lives: optionalInteger(
        setting.gameplay_lives,
        0,
        99,
        `${path}.${normalizedKey}.gameplay_lives`
      ),
      gameplay_time_limit_seconds: optionalInteger(
        setting.gameplay_time_limit_seconds,
        0,
        86400,
        `${path}.${normalizedKey}.gameplay_time_limit_seconds`
      ),
      speed_multiplier: optionalFinite(
        setting.speed_multiplier,
        0,
        100,
        `${path}.${normalizedKey}.speed_multiplier`
      )
    })];
  }));
}
function textList(value, path) {
  if (value === void 0) return [];
  if (!Array.isArray(value)) throw new Error(`${path} must be an array`);
  if (value.length > 32) throw new Error(`${path} exceeds the 32 item limit`);
  return value.map((entry, index) => requiredText(entry, `${path}[${index}]`, 120).toLowerCase());
}
function levelLabel(id) {
  const match = /^level-(\d+)$/u.exec(id);
  return match ? `Nivel ${match[1]}` : id;
}
function normalizeHex(value) {
  const clean = optionalText(value, 20).toLowerCase();
  return /^#[0-9a-f]{6}$/u.test(clean) ? clean : "";
}
function requiredRecord(value, path) {
  if (!isRecord(value)) throw new Error(`${path} must be an object`);
  return value;
}
function requiredText(value, path, max) {
  const clean = optionalText(value, max);
  if (!clean) throw new Error(`${path} must be a non-empty string`);
  return clean;
}
function requiredString(value, path, max) {
  if (typeof value !== "string") throw new Error(`${path} must be a non-empty string`);
  return requiredText(value, path, max);
}
function requiredStableId(value, path) {
  const clean = requiredString(value, path, 120);
  if (value !== clean) {
    throw new Error(`${path} must use its canonical representation without surrounding or control characters`);
  }
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u;
  const hash2 = /^(?:[0-9a-f]{32}|[0-9a-f]{40}|[0-9a-f]{64})$/u;
  if (!uuid.test(clean) && !hash2.test(clean)) {
    throw new Error(`${path} must be a canonical UUID or lowercase 32/40/64-character hash`);
  }
  return clean;
}
function optionalText(value, max) {
  if (value === void 0 || value === null) return "";
  if (typeof value !== "string" && typeof value !== "number") return "";
  return [...String(value).trim()].filter((character) => character.codePointAt(0) >= 32 && character.codePointAt(0) !== 127).join("").slice(0, max);
}
function requiredInteger(value, min, max, path) {
  const number = Number(value);
  if (!Number.isFinite(number) || !Number.isInteger(number) || number < min || number > max) {
    throw new Error(`${path} must be an integer from ${min} through ${max}`);
  }
  return number;
}
function optionalInteger(value, min, max, path) {
  if (value === void 0 || value === null || value === "") return void 0;
  return requiredInteger(Number(value), min, max, path);
}
function optionalFinite(value, min, max, path) {
  if (value === void 0 || value === null || value === "") return void 0;
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) {
    throw new Error(`${path} must be a number from ${min} through ${max}`);
  }
  return number;
}
function isRecord(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function compactObject(value) {
  return Object.fromEntries(Object.entries(value).filter(([, child]) => child !== void 0));
}
function contentHash(value) {
  const source = stableStringify(value);
  let first = 2166136261;
  let second = 2654435769;
  for (let index = 0; index < source.length; index += 1) {
    const code = source.charCodeAt(index);
    first = Math.imul(first ^ code, 16777619) >>> 0;
    second = Math.imul(second ^ code, 2246822507) >>> 0;
  }
  return `${first.toString(16).padStart(8, "0")}${second.toString(16).padStart(8, "0")}`;
}
function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.entries(value).sort(([left], [right]) => left.localeCompare(right)).map(([key, child]) => `${JSON.stringify(key)}:${stableStringify(child)}`).join(",")}}`;
}
function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

// packages/published-level-runtime/src/controller.ts
var SHARED_PLANNERS = /* @__PURE__ */ new WeakMap();
function createPublishedLevelSessionController(options) {
  const initialGame = assertPublishedLevelGame(options.game);
  const initialSnapshot = initialGame.snapshot();
  if (initialSnapshot.currentGame !== options.manifest.id) {
    throw new Error(
      `Published-level controller cannot drive ${initialSnapshot.currentGame} as ${options.manifest.id}`
    );
  }
  if (!Number.isInteger(options.playerIndex) || options.playerIndex < 0 || options.playerIndex >= initialSnapshot.playerCount) {
    throw new Error("Published-level controller playerIndex must address a configured player");
  }
  const profileKey = normalizeProfile(options.profile);
  let shared = sharedPlanner(initialGame, options.seed, profileKey);
  shared.references += 1;
  let disposed = false;
  return Object.freeze({
    id: options.id,
    step(observation) {
      if (disposed) return void 0;
      if (observation.gameId !== options.manifest.id) return void 0;
      const game8 = assertPublishedLevelGame(observation.game);
      if (game8 !== shared.game) {
        releaseShared2(shared, options.playerIndex);
        shared = sharedPlanner(game8, options.seed, profileKey);
        shared.references += 1;
      }
      return decide(shared, options.playerIndex, observation);
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      releaseShared2(shared, options.playerIndex);
    }
  });
}
function decide(shared, playerIndex, observation) {
  const snapshot = observation.snapshot;
  if (snapshot.phase !== "running") {
    return { explanation: `Published level is ${snapshot.phase}; the authoritative countdown remains in the game` };
  }
  const semantic = shared.game.semanticTiles(observation.atMillis);
  const targets = targetGroups(semantic);
  const availableIds = new Set(targets.map((target4) => target4.uniq));
  for (const [owner, uniq] of shared.assignments) {
    if (!availableIds.has(uniq)) shared.assignments.delete(owner);
  }
  const current = semantic.find(
    (tile) => tile.x === observation.self.tile.x && tile.y === observation.self.tile.y
  );
  if (current?.originalKind === 3 && !current.removed && current.kind === 4) {
    return jumpResult("Purple objective is held; jump releases it for the required second press");
  }
  let assigned = shared.assignments.get(playerIndex);
  let target3 = assigned ? targets.find((candidate) => candidate.uniq === assigned) : void 0;
  if (!target3) {
    target3 = chooseTarget(shared, playerIndex, observation.self.tile, targets);
    assigned = target3?.uniq;
    if (assigned) shared.assignments.set(playerIndex, assigned);
  }
  if (!target3) {
    return { explanation: "No visible uncaptured blue or purple objective is available" };
  }
  const profile2 = profileFor(shared.profileKey, playerIndex);
  const occupied = observation.avatars.filter((avatar) => avatar.id !== observation.self.id).flatMap((avatar) => [avatar.tile, ...avatar.target ? [avatar.target] : []]);
  const route = bestRoute(shared.game, observation.self.tile, target3.tiles, semantic, occupied, profile2, observation.atMillis);
  if (!route || route.length === 0) {
    return {
      explanation: current?.originalKind === 3 && current.primed ? "Purple objective is primed; allow the avatar to land and press it a second time" : `Objective ${target3.uniq} is underfoot; allow floor authority to register the press`
    };
  }
  const immediate = observation.self.target ?? route[0];
  const airborneUntil = observation.self.airborneUntil ?? 0;
  if (observation.self.target && shared.game.dangerAt(immediate.x, immediate.y, observation.atMillis) > 0 && airborneUntil <= observation.atMillis) {
    const landingPath = safeLandingPath(
      shared.game,
      observation.self.target,
      route,
      semantic,
      observation.atMillis
    );
    return landingPath ? jumpResult(
      `A red hazard is forecast at ${immediate.x},${immediate.y}; jump to the next safe tile`,
      landingPath
    ) : jumpResult(`A red hazard is forecast at ${immediate.x},${immediate.y}; jump before crossing`);
  }
  if (observation.self.target) {
    return { explanation: `Following a semantic route to objective ${target3.uniq}` };
  }
  const destination = route.at(-1);
  const explanation = `Reserved objective ${target3.uniq}; planned ${route.length} safe tile${route.length === 1 ? "" : "s"}`;
  return Object.freeze({
    action: Object.freeze({ kind: "move", target: destination, path: Object.freeze(route), explanation }),
    explanation
  });
}
function jumpResult(explanation, landingPath = []) {
  const target3 = landingPath.at(-1);
  return Object.freeze({
    action: Object.freeze({
      kind: "jump",
      ...target3 ? {
        target: Object.freeze({ ...target3 }),
        path: Object.freeze(landingPath.map((point) => Object.freeze({ ...point })))
      } : {},
      explanation
    }),
    explanation
  });
}
function safeLandingPath(game8, immediate, route, semantic, atMillis) {
  const byKey = new Map(semantic.map((tile) => [pointKey2(tile), tile]));
  const path = [immediate, ...route].filter(
    (point, index, values) => index === 0 || pointKey2(point) !== pointKey2(values[index - 1])
  );
  const crossing = [];
  for (const point of path) {
    crossing.push(point);
    const tile = byKey.get(pointKey2(point));
    const hazardous = tile?.kind === 2 || game8.dangerAt(point.x, point.y, atMillis) > 0;
    if (!hazardous) return crossing.length <= 10 ? crossing : void 0;
  }
  return void 0;
}
function targetGroups(tiles) {
  const grouped = /* @__PURE__ */ new Map();
  for (const tile of tiles) {
    if (tile.removed || !tile.uniq || tile.originalKind !== 1 && tile.originalKind !== 3) continue;
    const group = grouped.get(tile.uniq) ?? [];
    group.push(tile);
    grouped.set(tile.uniq, group);
  }
  return [...grouped.entries()].map(([uniq, values]) => Object.freeze({
    uniq,
    tiles: Object.freeze(values.sort((left, right) => left.y - right.y || left.x - right.x))
  })).sort((left, right) => left.uniq.localeCompare(right.uniq));
}
function chooseTarget(shared, playerIndex, from, targets) {
  const claimed = new Set(
    [...shared.assignments.entries()].filter(([owner]) => owner !== playerIndex).map(([, uniq]) => uniq)
  );
  const unclaimed = targets.filter((target3) => !claimed.has(target3.uniq));
  const candidates = unclaimed.length > 0 ? unclaimed : targets;
  return [...candidates].sort((left, right) => {
    const leftDistance = groupDistance(from, left);
    const rightDistance = groupDistance(from, right);
    return leftDistance - rightDistance || stableRank(shared.seed, playerIndex, left.uniq) - stableRank(shared.seed, playerIndex, right.uniq) || left.uniq.localeCompare(right.uniq);
  })[0];
}
function groupDistance(from, target3) {
  return Math.min(...target3.tiles.map((tile) => manhattan(from, tile)));
}
function bestRoute(game8, from, destinations, semantic, occupied, profile2, atMillis) {
  const targetKeys = new Set(destinations.map(pointKey2));
  const byKey = new Map(semantic.map((tile) => [pointKey2(tile), tile]));
  const startKey = pointKey2(from);
  const open = /* @__PURE__ */ new Set([startKey]);
  const cameFrom = /* @__PURE__ */ new Map();
  const scores = /* @__PURE__ */ new Map([[startKey, 0]]);
  const estimates = /* @__PURE__ */ new Map([[startKey, nearestDistance(from, destinations)]]);
  while (open.size > 0) {
    const currentKey = [...open].sort(
      (left, right) => (estimates.get(left) ?? Infinity) - (estimates.get(right) ?? Infinity) || left.localeCompare(right)
    )[0];
    if (targetKeys.has(currentKey)) return reconstructPath2(cameFrom, currentKey).slice(1);
    open.delete(currentKey);
    const current = parsePointKey(currentKey);
    for (const next of neighbors(current)) {
      const nextKey = pointKey2(next);
      const tile = byKey.get(nextKey);
      const hazard = tile?.kind === 2 || game8.dangerAt(next.x, next.y, atMillis) > 0;
      const occupiedPenalty = occupied.some((spot) => spot.x === next.x && spot.y === next.y) ? profile2.occupiedCost : 0;
      const traversal = tile?.present ? 1 : profile2.emptyCost;
      const tentative = (scores.get(currentKey) ?? Infinity) + traversal + (hazard ? profile2.hazardCost : 0) + occupiedPenalty;
      if (tentative >= (scores.get(nextKey) ?? Infinity)) continue;
      cameFrom.set(nextKey, currentKey);
      scores.set(nextKey, tentative);
      estimates.set(nextKey, tentative + nearestDistance(next, destinations));
      open.add(nextKey);
    }
  }
  return void 0;
}
function reconstructPath2(cameFrom, end) {
  const path = [parsePointKey(end)];
  let cursor = end;
  while (cameFrom.has(cursor)) {
    cursor = cameFrom.get(cursor);
    path.push(parsePointKey(cursor));
  }
  return path.reverse();
}
function neighbors(point) {
  return [
    { x: point.x - 1, y: point.y },
    { x: point.x + 1, y: point.y },
    { x: point.x, y: point.y - 1 },
    { x: point.x, y: point.y + 1 }
  ].filter((next) => inFloorBounds(next.x, next.y));
}
function nearestDistance(point, destinations) {
  return Math.min(...destinations.map((destination) => manhattan(point, destination)));
}
function manhattan(left, right) {
  return Math.abs(left.x - right.x) + Math.abs(left.y - right.y);
}
function pointKey2(point) {
  return `${point.x},${point.y}`;
}
function parsePointKey(value) {
  const [x = "0", y = "0"] = value.split(",");
  return { x: Number(x), y: Number(y) };
}
function stableRank(seed, playerIndex, value) {
  let hash2 = (seed ^ Math.imul(playerIndex + 1, 2654435761)) >>> 0;
  for (let index = 0; index < value.length; index += 1) {
    hash2 = Math.imul(hash2 ^ value.charCodeAt(index), 2246822507) >>> 0;
  }
  return hash2;
}
function normalizeProfile(value) {
  const normalized = value?.trim().toLowerCase() || "balanced";
  if (!["balanced", "cautious", "bold", "expert", "mixed"].includes(normalized)) {
    throw new Error(`Unknown published-level controller profile: ${value}`);
  }
  return normalized;
}
function profileFor(profileKey, playerIndex) {
  const key = profileKey === "mixed" ? ["cautious", "balanced", "bold", "expert"][playerIndex % 4] : profileKey;
  if (key === "cautious") return { hazardCost: 120, occupiedCost: 16, emptyCost: 2.4 };
  if (key === "bold") return { hazardCost: 14, occupiedCost: 5, emptyCost: 1.4 };
  if (key === "expert") return { hazardCost: 200, occupiedCost: 12, emptyCost: 1.8 };
  return { hazardCost: 60, occupiedCost: 9, emptyCost: 1.8 };
}
function sharedPlanner(game8, seed, profileKey) {
  const existing = SHARED_PLANNERS.get(game8);
  if (existing) {
    if (existing.seed !== seed || existing.profileKey !== profileKey) {
      throw new Error("Published-level controllers sharing one game must use the same seed and profile");
    }
    return existing;
  }
  const shared = {
    game: game8,
    seed,
    profileKey,
    assignments: /* @__PURE__ */ new Map(),
    references: 0
  };
  SHARED_PLANNERS.set(game8, shared);
  return shared;
}
function releaseShared2(shared, playerIndex) {
  shared.assignments.delete(playerIndex);
  shared.references = Math.max(0, shared.references - 1);
  if (shared.references === 0) SHARED_PLANNERS.delete(shared.game);
}
function assertPublishedLevelGame(game8) {
  const candidate = game8;
  if (typeof candidate.semanticTiles !== "function" || typeof candidate.dangerAt !== "function" || typeof candidate.playerReadyZones !== "function") {
    throw new Error("Published-level controller requires a semantic published-level game instance");
  }
  return candidate;
}

// packages/published-level-runtime/src/engine.ts
var frameSize = FLOOR_COLS * FLOOR_ROWS;
var countdownDuration = 3e3;
var greenAppearWindow = 400;
var greenDisappearWindow = 800;
var greenImpactDuration = 1100;
var blueCaptureWindow = 600;
var damageCooldown = 1e3;
var resultDuration = 1250;
var failureRestartDuration = 3e3;
var black = { r: 0, g: 0, b: 0 };
var safeGreen = { r: 0, g: 255, b: 72 };
var blue = { r: 0, g: 0, b: 255 };
var red = { r: 255, g: 0, b: 0 };
var purple = { r: 245, g: 38, b: 255 };
var heldPurple = { r: 245, g: 250, b: 255 };
var hitYellow = { r: 255, g: 236, b: 82 };
var defaultAudio = Object.freeze({
  musicRef: "Motion/canciones/Background07.mp3",
  musicVolume: 0.18,
  narrationCueRef: "",
  startCueRef: "",
  coinCueRef: "Motion/sonidos/coin.wav",
  doubleCoinCueRef: "Motion/sonidos/coin.wav",
  damageCueRef: "Motion/sonidos/fallo.mp3",
  winCueRef: "Motion/sonidos/victoria.mp3",
  defeatCueRef: "Motion/sonidos/fallo.mp3"
});
function createPublishedLevelGame(product3, config) {
  return new PublishedLevelGame(product3, config);
}
var PublishedLevelGame = class {
  product;
  config;
  content;
  levels = [];
  animations = /* @__PURE__ */ new Map();
  level;
  players = publishedPlayers(1);
  nowMillis = 0;
  createdAt = 0;
  startedAt = countdownDuration;
  endedAt = 0;
  restartAt = 0;
  score = 0;
  lives = 5;
  success = false;
  ended = false;
  removed = /* @__PURE__ */ new Set();
  purpleHeld = /* @__PURE__ */ new Set();
  purplePrimed = /* @__PURE__ */ new Set();
  pressed = /* @__PURE__ */ new Set();
  greenImpacts = /* @__PURE__ */ new Set();
  ripples = [];
  capturedAt = /* @__PURE__ */ new Map();
  lastDamageAt = Number.NEGATIVE_INFINITY;
  lastDamageBy = /* @__PURE__ */ new Map();
  hitFlash = /* @__PURE__ */ new Map();
  lastEvent = gameEvent("none", "Listo", 0);
  constructor(product3, config) {
    this.product = product3;
    this.config = normalizeGameConfig(config, product3.manifest);
    this.content = this.resolveContent(this.config);
    this.rebuild(this.config.nowMillis);
  }
  init(nowMillis) {
    this.rebuild(nowMillis);
    return this.record([gameEvent("ready", `Prep\xE1rate para ${this.level.label}`, nowMillis)]);
  }
  press(event) {
    if (!inFloorBounds(event.x, event.y)) return [];
    this.nowMillis = event.atMillis;
    const events = this.tickState(event.atMillis);
    const key = cellIndex(event.x, event.y);
    if (event.pressed) this.pressed.add(key);
    else {
      this.pressed.delete(key);
      this.releasePurple(key, event.atMillis);
    }
    if (!event.pressed || this.ended || event.atMillis < this.startedAt) return this.record(events);
    this.triggerGreenImpact(key, event.atMillis);
    const pointEvents = this.applyPoint(this.pointAt(key, event.atMillis), key, event.atMillis);
    const completionEvents = this.tickState(event.atMillis);
    return this.record([
      ...events,
      ...pointEvents,
      ...completionEvents
    ]);
  }
  release(event) {
    return this.press({ ...event, pressed: false });
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    return this.record(this.tickState(event.atMillis));
  }
  render() {
    const frame = createFrame("#000000");
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      for (let x = 0; x < FLOOR_COLS; x += 1) {
        paintFrameCell(frame, x, y, rgbToHex(this.colorAt(cellIndex(x, y), this.nowMillis)));
      }
    }
    return frame;
  }
  snapshot() {
    const phase = this.ended ? "finished" : this.nowMillis < this.startedAt ? "countdown" : "running";
    const elapsedMillis = Math.max(0, this.nowMillis - this.startedAt);
    const remainingMillis = this.level.timeLimit > 0 && !this.ended ? Math.max(0, this.startedAt + this.level.timeLimit - this.nowMillis) : 0;
    const countdownMillis = this.nowMillis < this.startedAt ? this.startedAt - this.nowMillis : 0;
    const players2 = this.players.map((player) => ({ ...player, score: this.score, lives: this.lives }));
    return Object.freeze({
      currentGame: this.content.gameId,
      engineGame: this.content.engineGame,
      contentRevision: this.content.contentRevision,
      label: this.product.manifest.label,
      phase,
      playerCount: players2.length,
      players: players2,
      score: this.score,
      lives: this.lives,
      maxLives: this.startingLives(),
      elapsedMillis,
      remainingMillis,
      activeTargets: Math.max(0, this.level.scoreUniqs.size - this.removed.size),
      success: this.success,
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      lastEventMillis: this.lastEvent.atMillis,
      countdownMillis,
      difficulty: String(this.config.difficulty),
      level: this.level.id,
      levelSlug: this.level.slug,
      levelNumber: levelNumber(this.level.slug),
      levelCount: this.levels.length,
      levelLabel: this.level.label,
      levelDescription: this.level.description,
      isFinalLevel: this.levels.at(-1)?.id === this.level.id,
      objectivesTotal: this.level.scoreUniqs.size,
      objectivesRemaining: Math.max(0, this.level.scoreUniqs.size - this.removed.size),
      resultMillis: this.ended ? Math.max(0, (this.success ? resultDuration : failureRestartDuration) - (this.nowMillis - this.endedAt)) : 0,
      mode: this.content.mode,
      attemptCreatedMillis: this.createdAt,
      attemptStartedMillis: this.startedAt,
      attemptEndedMillis: this.endedAt,
      audio: this.level.audio
    });
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, this.product.manifest);
    this.content = this.resolveContent(this.config);
    this.rebuild(this.config.nowMillis);
  }
  playerReadyZones() {
    const first = this.level.frames[0];
    if (!first) return [];
    const safe = first.points.flatMap(
      (point, key) => point?.present === true && point.kind === 0 ? [key] : []
    );
    if (safe.length === 0) return [];
    return farthestSafeTiles(safe, Math.max(1, this.config.playerCount)).map((key) => {
      const x = key % FLOOR_COLS;
      const y = Math.floor(key / FLOOR_COLS);
      return { minX: x, maxX: x, minY: y, maxY: y };
    });
  }
  semanticTiles(atMillis = this.nowMillis) {
    const raw = this.frameAt(atMillis);
    if (!raw) return [];
    return raw.points.flatMap((point, index) => {
      if (!point?.present) return [];
      const effective = this.pointAt(index, atMillis);
      return [{
        x: index % FLOOR_COLS,
        y: Math.floor(index / FLOOR_COLS),
        kind: effective.kind,
        originalKind: point.kind,
        uniq: point.uniq,
        present: effective.present,
        removed: point.uniq ? this.removed.has(point.uniq) : false,
        primed: point.uniq ? this.purplePrimed.has(point.uniq) : false
      }];
    });
  }
  dangerAt(x, y, atMillis = this.nowMillis) {
    if (!inFloorBounds(x, y)) return 1;
    const key = cellIndex(x, y);
    const samples = [atMillis, atMillis + 200, atMillis + 400];
    return samples.reduce((danger2, sample) => Math.max(danger2, this.pointAt(key, sample).kind === 2 ? 1 : 0), 0);
  }
  resolveContent(config) {
    return parsePublishedLevelContent(
      config.content ?? this.product.fallbackContent,
      this.product.manifest.id
    );
  }
  rebuild(nowMillis) {
    this.levels = compileLevels(this.content, String(this.config.difficulty));
    this.animations = compileAnimations(this.content.resultAnimations);
    this.level = selectLevel(this.levels, this.content.selectedLevelId);
    this.players = publishedPlayers(Math.max(1, this.config.playerCount), this.config.players);
    this.createdAt = nowMillis;
    this.startedAt = nowMillis + countdownDuration;
    this.nowMillis = nowMillis;
    this.resetAttemptState();
  }
  resetAttemptState(preservePressed = false) {
    this.endedAt = 0;
    this.restartAt = 0;
    this.score = 0;
    this.lives = this.startingLives();
    this.success = false;
    this.ended = false;
    this.removed.clear();
    this.purpleHeld.clear();
    this.purplePrimed.clear();
    if (!preservePressed) this.pressed.clear();
    this.greenImpacts.clear();
    this.ripples = [];
    this.capturedAt.clear();
    this.lastDamageAt = Number.NEGATIVE_INFINITY;
    this.lastDamageBy.clear();
    this.hitFlash.clear();
    this.lastEvent = gameEvent("none", "Listo", this.nowMillis);
  }
  tickState(nowMillis) {
    this.pruneRipples(nowMillis);
    if (this.ended) {
      if (this.success && nowMillis >= this.endedAt + resultDuration && this.advanceSuccessLevel(nowMillis)) {
        return [gameEvent("ready", `Siguiente: ${this.level.label}`, nowMillis)];
      }
      if (!this.success && this.restartAt > 0 && nowMillis >= this.restartAt) {
        this.restartFailedLevel(nowMillis);
        return [gameEvent("ready", `Reintenta ${this.level.label}`, nowMillis)];
      }
      return [];
    }
    if (nowMillis < this.startedAt) return [];
    if (this.startedAt === this.createdAt && nowMillis === this.startedAt) return [];
    if (this.level.timeLimit > 0 && nowMillis - this.startedAt >= this.level.timeLimit) {
      this.finishFailure(nowMillis);
      return [gameEvent("fail", "Se acab\xF3 el tiempo", nowMillis)];
    }
    const events = [];
    for (const key of this.pressed) {
      if (this.pointAt(key, nowMillis).kind !== 2) continue;
      if (this.damage(key, nowMillis)) {
        events.push(gameEvent(this.ended ? "fail" : "damage", this.ended ? "Sin vidas" : `Impacto: quedan ${this.lives} vidas`, nowMillis));
      }
      if (this.ended) return events;
    }
    if (this.hasWon()) {
      if (this.level.winCondition === "collect_all" && this.level.passScore > 0) this.score += this.level.passScore;
      this.success = true;
      this.ended = true;
      this.endedAt = nowMillis;
      events.push(gameEvent("win", `${this.level.label} superado`, nowMillis));
    }
    return events;
  }
  hasWon() {
    return this.level.winCondition === "score_at_least" ? this.level.passScore > 0 && this.score >= this.level.passScore : this.level.scoreUniqs.size > 0 && this.removed.size >= this.level.scoreUniqs.size;
  }
  applyPoint(point, key, atMillis) {
    if (point.kind === 1) {
      const captured = this.captureBlue(point, key, atMillis);
      return captured > 0 ? [gameEvent("coin", `${this.score} puntos`, atMillis)] : [];
    }
    if (point.kind === 3 && point.uniq && !this.removed.has(point.uniq) && !this.purplePrimed.has(point.uniq)) {
      this.purpleHeld.add(point.uniq);
      return [gameEvent("doubleCoin", "Suelta y vuelve a pisar", atMillis)];
    }
    if (point.kind === 2 && this.damage(key, atMillis)) {
      return [gameEvent(this.ended ? "fail" : "damage", this.ended ? "Sin vidas" : `Impacto: quedan ${this.lives} vidas`, atMillis)];
    }
    return [];
  }
  releasePurple(key, atMillis) {
    if (this.ended || atMillis < this.startedAt) return;
    const point = this.rawPointAt(key, atMillis);
    if (!point.uniq || !this.purpleHeld.has(point.uniq)) return;
    this.purpleHeld.delete(point.uniq);
    if (!this.removed.has(point.uniq)) this.purplePrimed.add(point.uniq);
  }
  damage(key, atMillis) {
    if (this.level.damageGrace) {
      if (atMillis - this.lastDamageAt < damageCooldown) return false;
      this.lastDamageAt = atMillis;
    } else {
      const last = this.lastDamageBy.get(key) ?? Number.NEGATIVE_INFINITY;
      if (atMillis - last < damageCooldown) return false;
      this.lastDamageBy.set(key, atMillis);
    }
    this.hitFlash.set(key, atMillis + 350);
    if (this.lives > 0) this.lives -= 1;
    if (this.lives <= 0) this.finishFailure(atMillis);
    return true;
  }
  finishFailure(atMillis) {
    this.ended = true;
    this.success = false;
    this.endedAt = atMillis;
    this.restartAt = atMillis + failureRestartDuration;
  }
  restartFailedLevel(atMillis) {
    this.createdAt = atMillis;
    this.startedAt = atMillis;
    this.nowMillis = atMillis;
    this.resetAttemptState(true);
  }
  advanceSuccessLevel(atMillis) {
    const index = this.levels.findIndex((candidate) => candidate.id === this.level.id);
    const next = index >= 0 ? this.levels[index + 1] : void 0;
    if (!next) return false;
    this.level = next;
    this.createdAt = atMillis;
    this.startedAt = atMillis + countdownDuration;
    this.nowMillis = atMillis;
    this.resetAttemptState(true);
    return true;
  }
  colorAt(key, atMillis) {
    if (this.ended) return this.resultColorAt(key, atMillis);
    if ((this.hitFlash.get(key) ?? 0) > atMillis) return hitYellow;
    if (atMillis < this.startedAt) return this.countdownColorAt(key, atMillis);
    const point = this.pointAt(key, atMillis);
    return this.greenImpactColor(key, point, this.colorForPoint(key, point, atMillis), atMillis);
  }
  resultColorAt(key, atMillis) {
    const names = this.success ? this.level.victoryAnimations : this.level.defeatAnimations;
    const name = chosenResultAnimation(names, this.endedAt);
    const animation = name ? this.animations.get(name) : void 0;
    if (!animation) return black;
    const elapsed = Math.max(0, atMillis - this.endedAt) % Math.max(1, animation.totalDuration);
    let remaining = elapsed;
    let selected = animation.frames[animation.frames.length - 1];
    for (const frame of animation.frames) {
      if (remaining < frame.duration) {
        selected = frame;
        break;
      }
      remaining -= frame.duration;
    }
    const point = selected?.points[key];
    return point?.present ? animation.colors.get(point.kind) ?? black : black;
  }
  colorForPoint(key, point, atMillis) {
    if (!point.present) return black;
    if (point.kind === 2 && this.level.redAnimation === "parkour_lava") return lavaColor(key, atMillis);
    if (point.kind === 0 && point.uniq && this.removed.has(point.uniq) && this.level.blueTurnGreen) {
      return this.capturedBlueColor(point.uniq, atMillis);
    }
    if (point.kind === 0 && this.level.greenFade) return this.greenPlatformColor(key, atMillis);
    return basePointColor(point);
  }
  pointAt(key, atMillis) {
    const raw = this.rawPointAt(key, atMillis);
    if (raw.uniq && this.removed.has(raw.uniq)) {
      return this.level.blueTurnGreen && raw.kind === 1 ? { ...raw, kind: 0 } : emptyPoint;
    }
    if (raw.uniq && this.purplePrimed.has(raw.uniq)) return { ...raw, kind: 1 };
    if (raw.uniq && this.purpleHeld.has(raw.uniq)) return { ...raw, kind: 4 };
    return raw;
  }
  rawPointAt(key, atMillis) {
    return this.frameAt(atMillis)?.points[key] ?? emptyPoint;
  }
  frameAt(atMillis) {
    return framePosition(this.level, atMillis - this.startedAt).frame;
  }
  greenPlatformColor(key, atMillis) {
    const position = framePosition(this.level, atMillis - this.startedAt);
    const frame = position.frame;
    if (!frame) return black;
    const point = frame.points[key];
    if (!point?.present || point.kind !== 0) return black;
    let color = basePointColor(point);
    if (this.level.frames.length <= 1) return color;
    const index = position.index;
    const previous = this.level.frames[(index - 1 + this.level.frames.length) % this.level.frames.length]?.points[key] ?? emptyPoint;
    const next = this.level.frames[(index + 1) % this.level.frames.length]?.points[key] ?? emptyPoint;
    const appearWindow = Math.min(greenAppearWindow, frame.duration / 2);
    const disappearWindow = Math.min(greenDisappearWindow, frame.duration / 2);
    if ((!previous.present || previous.kind !== 0) && appearWindow > 0 && position.elapsed < appearWindow) {
      color = mixRgb2(this.transitionPointColor(key, previous, atMillis - position.elapsed), color, ease(position.elapsed / appearWindow));
    }
    const remaining = frame.duration - position.elapsed;
    if ((!next.present || next.kind !== 0) && disappearWindow > 0 && remaining < disappearWindow) {
      color = mixRgb2(color, this.transitionPointColor(key, next, atMillis + remaining), 1 - ease(remaining / disappearWindow));
    }
    return color;
  }
  transitionPointColor(key, point, atMillis) {
    if (!point.present) return black;
    return point.kind === 2 && this.level.redAnimation === "parkour_lava" ? lavaColor(key, atMillis) : basePointColor(point);
  }
  capturedBlueColor(uniq, atMillis) {
    const started = this.capturedAt.get(uniq);
    if (started === void 0 || atMillis - started >= blueCaptureWindow) return safeGreen;
    return mixRgb2(blue, safeGreen, ease(Math.max(0, atMillis - started) / blueCaptureWindow));
  }
  captureBlue(point, key, atMillis) {
    if (!point.uniq || this.removed.has(point.uniq)) return 0;
    const originalKind = this.frameAt(atMillis)?.points[key]?.kind;
    const uniqs = this.level.blueCapture && originalKind === 1 ? this.connectedBlueUniqs(key, atMillis) : [point.uniq];
    let captured = 0;
    for (const uniq of uniqs) {
      if (!uniq || this.removed.has(uniq)) continue;
      this.removed.add(uniq);
      this.capturedAt.set(uniq, atMillis);
      this.purpleHeld.delete(uniq);
      this.purplePrimed.delete(uniq);
      this.score += 1;
      captured += 1;
    }
    return captured;
  }
  connectedBlueUniqs(start2, atMillis) {
    const frame = this.frameAt(atMillis);
    if (!frame || frame.points[start2]?.kind !== 1) return [];
    const component = floodFill(start2, (key) => frame.points[key]?.present === true && frame.points[key]?.kind === 1);
    return [...new Set(component.map((key) => frame.points[key]?.uniq ?? "").filter(Boolean))];
  }
  triggerGreenImpact(key, atMillis) {
    if (!this.level.greenImpact || this.pointAt(key, atMillis).kind !== 0) return;
    const frame = this.frameAt(atMillis);
    if (!frame) return;
    const component = floodFill(key, (candidate) => frame.points[candidate]?.present === true && frame.points[candidate]?.kind === 0);
    if (component.length === 0) return;
    const componentKey = [...component].sort((a, b) => a - b).join(";");
    if (this.greenImpacts.has(componentKey)) return;
    this.greenImpacts.add(componentKey);
    this.ripples.push({
      centerX: component.reduce((sum, value) => sum + value % FLOOR_COLS + 0.5, 0) / component.length,
      centerY: component.reduce((sum, value) => sum + Math.floor(value / FLOOR_COLS) + 0.5, 0) / component.length,
      startedAt: atMillis
    });
  }
  greenImpactColor(key, point, base, atMillis) {
    if (!this.level.greenImpact || !point.present || point.kind !== 2) return base;
    const x = key % FLOOR_COLS + 0.5;
    const y = Math.floor(key / FLOOR_COLS) + 0.5;
    return this.ripples.reduce((color, ripple) => {
      const age = atMillis - ripple.startedAt;
      if (age < 0 || age > greenImpactDuration) return color;
      const progress = age / greenImpactDuration;
      const radius = 0.35 + progress * 7;
      const distance = Math.hypot(x - ripple.centerX, y - ripple.centerY);
      const strength = clamp013(1 - Math.abs(distance - radius) / 0.85) * (1 - progress);
      return strength > 0 ? mixRgb2(color, { r: 255, g: 185, b: 72 }, strength * 0.7) : color;
    }, base);
  }
  pruneRipples(atMillis) {
    this.ripples = this.ripples.filter((ripple) => atMillis - ripple.startedAt <= greenImpactDuration);
  }
  countdownColorAt(key, atMillis) {
    const first = this.level.frames[0];
    if (!first) return black;
    const point = first.points[key];
    if (!this.level.greenLoad) {
      return point?.present === true && point.kind === 0 ? basePointColor(point) : black;
    }
    const safeTiles = first ? countdownSafeTiles(first, this.level.greenLoadSide) : [];
    const x = key % FLOOR_COLS;
    const y = Math.floor(key / FLOOR_COLS);
    const countdownProgress = (atMillis - this.createdAt) / Math.max(1, this.startedAt - this.createdAt);
    for (let order = 0; order < safeTiles.length; order += 1) {
      const target3 = safeTiles[order];
      const progress = countdownTileProgress(countdownProgress, order, safeTiles.length);
      if (progress < 0) continue;
      const targetX = target3 % FLOOR_COLS;
      const targetY = Math.floor(target3 / FLOOR_COLS);
      if (targetX !== x || countdownFallingY(targetY, progress, this.level.greenLoadSide) !== y) continue;
      if (progress >= 1) return safeGreen;
      const phase = (atMillis - this.createdAt) / 1e3 * Math.PI * 4 + (targetX + targetY) * 0.22;
      return scaleRgb2(safeGreen, 0.78 + 0.22 * (0.5 + 0.5 * Math.sin(phase)));
    }
    return black;
  }
  startingLives() {
    return this.level.lives > 0 ? this.level.lives : 5;
  }
  record(events) {
    if (events.length > 0) this.lastEvent = events[events.length - 1];
    return events;
  }
};
var emptyPoint = Object.freeze({ present: false, kind: -1, uniq: "" });
function compileLevels(content, difficulty) {
  const selectedDifficulty = difficulty.trim().toLowerCase();
  const deduped = dedupeLevels(content.levels, selectedDifficulty);
  if (deduped.length === 0) throw new Error("Published level content has no levels for this difficulty");
  return deduped.map((raw) => compileLevel(raw, selectedDifficulty, content.mode));
}
function compileLevel(raw, difficulty, mode) {
  const settings = raw.rules?.difficulty_settings?.[difficulty];
  const hasSettings = Object.keys(raw.rules?.difficulty_settings ?? {}).length > 0;
  let lives = hasSettings ? settings?.life ?? 0 : raw.life ?? 0;
  let timeLimit = mode === "challenge" && !hasSettings ? (raw.time_limit_seconds ?? 0) * 1e3 : 0;
  let frameTick = raw.frame_tick_ms && raw.frame_tick_ms > 0 ? raw.frame_tick_ms : 25;
  if (hasSettings) {
    if ((settings?.life ?? 0) > 0) lives = settings.life;
    if (mode === "challenge" && (settings?.gameplay_time_limit_seconds ?? 0) > 0) {
      timeLimit = settings.gameplay_time_limit_seconds * 1e3;
    }
    if ((settings?.speed_multiplier ?? 0) > 0) frameTick = Math.max(1, frameTick / settings.speed_multiplier);
  }
  const scoreUniqs = /* @__PURE__ */ new Set();
  let totalDuration = 0;
  const frames = raw.frames.map((frame) => {
    const points = Array.from({ length: frameSize });
    for (const [x, y, kind, uniq = ""] of frame.c) {
      points[cellIndex(x, y)] = Object.freeze({ present: true, kind, uniq });
      if (uniq && (kind === 1 || kind === 3)) scoreUniqs.add(uniq);
    }
    const duration = Math.max(1, frame.r) * frameTick;
    totalDuration += duration;
    return Object.freeze({ duration, points: Object.freeze(points) });
  });
  const audio = Object.freeze({
    musicRef: raw.music_ref || defaultAudio.musicRef,
    musicVolume: raw.music_volume === void 0 ? defaultAudio.musicVolume : clamp3(raw.music_volume, 0, 1),
    narrationCueRef: raw.narration_cue_ref || "",
    startCueRef: raw.start_cue_ref || "",
    coinCueRef: raw.coin_cue_ref || defaultAudio.coinCueRef,
    doubleCoinCueRef: raw.double_coin_cue_ref || raw.coin_cue_ref || defaultAudio.doubleCoinCueRef,
    damageCueRef: raw.damage_cue_ref || defaultAudio.damageCueRef,
    winCueRef: raw.win_cue_ref || defaultAudio.winCueRef,
    defeatCueRef: raw.defeat_cue_ref || raw.damage_cue_ref || defaultAudio.defeatCueRef
  });
  return Object.freeze({
    id: raw.id,
    slug: normalizeLevelId(raw.slug),
    aliases: uniqueStrings([raw.slug]),
    label: raw.label,
    description: raw.description ?? "",
    difficulty,
    lives,
    passScore: raw.pass_score ?? 0,
    timeLimit,
    frameTick,
    winCondition: raw.rules?.victory_condition === "score_at_least" ? "score_at_least" : "collect_all",
    redAnimation: raw.rules?.red_floor_animation === "parkour_lava" ? "parkour_lava" : "none",
    victoryAnimations: uniqueStrings(raw.result_animations?.victory_animations),
    defeatAnimations: uniqueStrings(raw.result_animations?.defeat_animations),
    greenFade: raw.rules?.green_platform_disappear === true,
    greenImpact: raw.rules?.green_platform_impact_ripple === true,
    greenLoad: raw.rules?.green_platform_load_animation !== false,
    greenLoadSide: raw.rules?.green_platform_load_side === "right" ? "right" : "left",
    blueTurnGreen: raw.rules?.blue_platform_turn_green === true,
    blueCapture: raw.rules?.blue_platform_capture_area === true,
    damageGrace: raw.rules?.red_damage_grace_period === true,
    totalDuration,
    frames: Object.freeze(frames),
    scoreUniqs,
    audio
  });
}
function dedupeLevels(levels, difficulty) {
  const order = [];
  const byId = /* @__PURE__ */ new Map();
  for (const level of levels) {
    const id = normalizeLevelId(level.slug);
    const rank = level.difficulty?.toLowerCase() === difficulty ? 3 : level.rules?.difficulty_settings?.[difficulty] ? 2 : 1;
    const previous = byId.get(id);
    if (!previous) {
      order.push(id);
      byId.set(id, { level, rank });
    } else if (rank > previous.rank) byId.set(id, { level, rank });
  }
  return order.map((id) => byId.get(id).level);
}
function compileAnimations(records) {
  const result = /* @__PURE__ */ new Map();
  for (const record of records) {
    const frameTick = record.frame_tick_ms && record.frame_tick_ms > 0 ? record.frame_tick_ms : 50;
    let totalDuration = 0;
    const frames = (record.frames ?? []).map((frame) => {
      const points = Array.from({ length: frameSize });
      for (const [x, y, kind] of frame.c) points[cellIndex(x, y)] = { present: true, kind, uniq: "" };
      const duration = Math.max(1, frame.r) * frameTick;
      totalDuration += duration;
      return { duration, points };
    });
    if (frames.length === 0) continue;
    const colors = /* @__PURE__ */ new Map();
    for (const [kind, effect] of Object.entries(record.tile_effects ?? {})) {
      const parsed = parseHex(effect.color ?? "");
      if (parsed) colors.set(Number(kind), parsed);
    }
    const ids = uniqueStrings([record.slug, record.id ?? ""]);
    const compiled = Object.freeze({ ids, frameTick, totalDuration, frames, colors });
    for (const id of ids) result.set(id, compiled);
  }
  return result;
}
function selectLevel(levels, selected) {
  const exact = levels.find((level) => level.id === selected.toLowerCase());
  if (exact) return exact;
  const normalized = normalizeLevelId(selected);
  const aliases = levels.filter((level) => level.aliases.includes(normalized));
  if (aliases.length === 1) return aliases[0];
  if (aliases.length > 1) throw new Error(`Selected level alias ${selected} is ambiguous`);
  throw new Error(`Selected level ${selected} is not present in compiled content`);
}
function framePosition(level, rawElapsed) {
  if (level.frames.length === 0 || rawElapsed < 0) return { index: -1, elapsed: 0 };
  let elapsed = level.totalDuration > 0 ? rawElapsed % level.totalDuration : rawElapsed;
  for (let index2 = 0; index2 < level.frames.length; index2 += 1) {
    const frame2 = level.frames[index2];
    if (elapsed < frame2.duration) return { frame: frame2, index: index2, elapsed };
    elapsed -= frame2.duration;
  }
  const index = level.frames.length - 1;
  const frame = level.frames[index];
  return { frame, index, elapsed: frame?.duration ?? 0 };
}
function basePointColor(point) {
  if (!point.present) return black;
  if (point.kind === 0) return safeGreen;
  if (point.kind === 1) return blue;
  if (point.kind === 2) return red;
  if (point.kind === 3) return purple;
  if (point.kind === 4) return heldPurple;
  return black;
}
function lavaColor(key, atMillis) {
  const x = key % FLOOR_COLS;
  const y = Math.floor(key / FLOOR_COLS);
  const seconds = atMillis / 1e3 * 0.22;
  const nx = x / FLOOR_COLS;
  const ny = y / FLOOR_ROWS;
  const field = 0.5 + 0.5 * Math.sin((nx * 3 + ny * 1.6 + seconds * 0.7) * Math.PI) * Math.cos((nx * 2.2 - ny * 3.2 - seconds * 0.5) * Math.PI);
  const heat = clamp013(0.18 + field * 0.82);
  const flicker = 0.92 + 0.08 * Math.sin((x * 1.3 + y * 0.7 + seconds * 4.2) * Math.PI);
  return {
    r: byte((150 + 105 * heat) * flicker),
    g: byte((14 + 70 * heat) * flicker),
    b: byte((2 + 10 * heat) * flicker)
  };
}
function chosenResultAnimation(values, endedAt) {
  const normalized = uniqueStrings(values);
  if (normalized.length <= 1) return normalized[0] ?? "";
  return normalized[hashInt(Math.trunc(endedAt)) % normalized.length] ?? normalized[0];
}
function hashInt(value) {
  let x = value + 2654435769 >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 2246822507) >>> 0;
  x ^= x >>> 13;
  x = Math.imul(x, 3266489909) >>> 0;
  x ^= x >>> 16;
  return x & 2147483647;
}
function countdownSafeTiles(frame, side) {
  const result = [];
  const rows = Array.from({ length: FLOOR_ROWS }, (_, index) => side === "right" ? FLOOR_ROWS - 1 - index : index);
  for (const y of rows) for (let x = 0; x < FLOOR_COLS; x += 1) {
    const key = cellIndex(x, y);
    const point = frame.points[key];
    if (point?.present && point.kind === 0) result.push(key);
  }
  return result;
}
function countdownTileProgress(progressValue, order, total) {
  const progress = clamp013(progressValue);
  if (total <= 1) return Math.min(progress / 0.92, 1);
  const delay = order / (total - 1) * 0.68;
  return clamp3((progress - delay) / 0.24, -1, 1);
}
function countdownFallingY(targetY, tileProgress, side) {
  const progress = clamp013(tileProgress);
  const eased = 1 - (1 - progress) ** 3;
  const startY = side === "right" ? targetY - FLOOR_ROWS : targetY + FLOOR_ROWS;
  return Math.round(startY + (targetY - startY) * eased);
}
function farthestSafeTiles(safe, count) {
  const selected = [safe[Math.floor((safe.length - 1) / 2)]];
  while (selected.length < count) {
    const next = safe.filter((key) => !selected.includes(key)).map((key) => ({
      key,
      distance: Math.min(...selected.map((other) => tileDistanceSquared(key, other)))
    })).sort((left, right) => right.distance - left.distance || left.key - right.key)[0]?.key;
    selected.push(next ?? safe[selected.length % safe.length]);
  }
  return selected;
}
function tileDistanceSquared(left, right) {
  const deltaX = left % FLOOR_COLS - right % FLOOR_COLS;
  const deltaY = Math.floor(left / FLOOR_COLS) - Math.floor(right / FLOOR_COLS);
  return deltaX * deltaX + deltaY * deltaY;
}
function floodFill(start2, predicate) {
  if (!predicate(start2)) return [];
  const visited = /* @__PURE__ */ new Set([start2]);
  const queue = [start2];
  while (queue.length > 0) {
    const key = queue.shift();
    for (const next of neighbors2(key)) {
      if (!visited.has(next) && predicate(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }
  return [...visited];
}
function neighbors2(key) {
  const x = key % FLOOR_COLS;
  const y = Math.floor(key / FLOOR_COLS);
  return [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]].filter(([nextX, nextY]) => inFloorBounds(nextX, nextY)).map(([nextX, nextY]) => cellIndex(nextX, nextY));
}
function uniqueStrings(values) {
  return [...new Set((values ?? []).map((value) => value.trim().toLowerCase()).filter(Boolean))];
}
function publishedPlayers(count, supplied = []) {
  const colors = [
    "#ff0000",
    "#00ffff",
    "#00ff00",
    "#ff00ff",
    "#0000ff",
    "#ffff00"
  ];
  return Array.from({ length: count }, (_, index) => ({
    index,
    label: supplied[index]?.label || supplied[index]?.name || `Jugador ${index + 1}`,
    color: supplied[index]?.color || colors[index % colors.length],
    score: 0,
    lives: -1
  }));
}
function cellIndex(x, y) {
  return y * FLOOR_COLS + x;
}
function levelNumber(id) {
  return Number(/^level-(\d+)$/u.exec(id)?.[1] ?? 0);
}
function mixRgb2(from, to, amount) {
  const t = clamp013(amount);
  return {
    r: byte(from.r + (to.r - from.r) * t),
    g: byte(from.g + (to.g - from.g) * t),
    b: byte(from.b + (to.b - from.b) * t)
  };
}
function scaleRgb2(color, scale) {
  return { r: byte(color.r * scale), g: byte(color.g * scale), b: byte(color.b * scale) };
}
function ease(value) {
  const t = clamp013(value);
  return t * t * (3 - 2 * t);
}
function parseHex(value) {
  if (!/^#[0-9a-f]{6}$/iu.test(value)) return void 0;
  const number = Number.parseInt(value.slice(1), 16);
  return { r: number >> 16, g: number >> 8 & 255, b: number & 255 };
}
function byte(value) {
  return Math.max(0, Math.min(255, Math.round(value)));
}
function clamp013(value) {
  return clamp3(value, 0, 1);
}
function clamp3(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// games/parkour/src/manifest.ts
var parkourGameId = "c1daea4f-e586-4116-8cbe-871cde887a81";
var parkourEngineGame = "parkour";
var manifest13 = {
  id: parkourGameId,
  slug: parkourEngineGame,
  aliases: [parkourEngineGame],
  label: "Parkour",
  description: "Supera plataformas, recoge objetivos y evita la lava en niveles editables.",
  availability: { development: true, production: true },
  catalog: {
    category: "individual",
    color: "#ff9f45",
    durationLabel: "Mejor tiempo",
    modeLabel: "Niveles",
    audioLabel: "M\xFAsica + efectos",
    rules: [
      "Avanza por las plataformas verdes sin tocar la lava",
      "Recoge suficientes objetivos azules para superar cada nivel"
    ]
  },
  players: {
    allowAny: true,
    min: 1,
    max: 8
  },
  start: { mode: "immediate" },
  config: {
    difficulty: {
      default: "medium",
      options: ["easy", "medium", "hard"]
    },
    vars: []
  },
  defaultDurationMillis: 0,
  display: {
    entry: "./display"
  },
  preview: {
    seed: 137,
    playerCount: 0,
    difficulty: "medium",
    actions: [{ atMillis: 3100, type: "press", x: 7, y: 29 }],
    captureStartMillis: 3180,
    frameCount: 18,
    frameIntervalMillis: 120
  },
  tags: ["published-levels", "platform-editable", "jugar-3d", "individual", "typescript"]
};

// games/parkour/src/fixtures-content.ts
var fallbackContent = createPublishedLevelContent({
  gameId: parkourGameId,
  engineGame: parkourEngineGame,
  selectedLevelId: "11111111-1111-4111-8111-111111111101",
  selectedLevelSlug: "level-1",
  mode: "challenge",
  levelsPayload: [
    parkourLevel("11111111-1111-4111-8111-111111111101", "level-1", "Parkour / Nivel 1", 0),
    parkourLevel("11111111-1111-4111-8111-111111111102", "level-2", "Parkour / Nivel 2", 2)
  ],
  resultAnimationsPayload: {
    levels: [resultAnimation("game-pass", "#00ff48", victoryCells()), resultAnimation("game-fail", "#ff2036", defeatCells())]
  }
});
function parkourLevel(id, slug, label, shift) {
  return {
    id,
    slug,
    label,
    description: "Cruza la lava por las plataformas verdes y captura la plataforma azul.",
    life: 3,
    pass_score: 3,
    time_limit_seconds: 0,
    frame_tick_ms: 25,
    rules: {
      victory_condition: "score_at_least",
      difficulty_changes_layout: true,
      difficulty_settings: {
        easy: { life: 5, speed_multiplier: 0.8 },
        medium: { life: 3, speed_multiplier: 1 },
        hard: { life: 2, speed_multiplier: 1.3 }
      },
      red_floor_animation: "parkour_lava",
      red_damage_grace_period: false,
      green_platform_load_animation: true,
      green_platform_load_side: "left",
      green_platform_disappear: true,
      green_platform_impact_ripple: true,
      blue_platform_turn_green: true,
      blue_platform_capture_area: true
    },
    result_animations: {
      victory_animations: ["game-pass"],
      defeat_animations: ["game-fail"]
    },
    music_ref: "Motion/canciones/Background07.mp3",
    music_volume: 0.18,
    coin_cue_ref: "Motion/sonidos/coin.wav",
    damage_cue_ref: "Motion/sonidos/fallo.mp3",
    win_cue_ref: "Motion/sonidos/victoria.mp3",
    defeat_cue_ref: "Motion/sonidos/fallo.mp3",
    frames: [
      { r: 100, c: parkourCells(shift, 0) },
      { r: 100, c: parkourCells(shift, 1) }
    ]
  };
}
function parkourCells(levelShift, motionShift) {
  const cells = [];
  for (let y = 0; y < 32; y += 1) {
    for (let x = 0; x < 16; x += 1) cells.push([x, y, 2, `lava-${x}-${y}`]);
  }
  for (let y = 28; y < 32; y += 1) {
    for (let x = 5; x <= 10; x += 1) cells.push([x, y, 0, `start-${x}-${y}`]);
  }
  const islands = [23, 18, 13, 9].map((y, index) => ({
    x: 3 + index % 2 * 6 + (motionShift + levelShift) % 2,
    y: y - levelShift
  }));
  for (const [index, island] of islands.entries()) {
    for (let y = island.y; y <= island.y + 1; y += 1) {
      for (let x = island.x; x <= island.x + 3; x += 1) cells.push([x, y, 0, `island-${index}-${x}-${y}`]);
    }
  }
  const targetY = Math.max(2, 5 - levelShift);
  for (let x = 7; x <= 9; x += 1) cells.push([x, targetY, 1, `goal-${levelShift}-${x}`]);
  return cells;
}
function resultAnimation(slug, color, cells) {
  return {
    slug,
    frame_tick_ms: 50,
    tile_effects: { 0: { color } },
    frames: [{ r: 12, c: cells }, { r: 12, c: cells.map(([x, y, kind]) => [15 - x, 31 - y, kind]) }]
  };
}
function victoryCells() {
  const cells = [];
  for (let x = 0; x < 16; x += 1) cells.push([x, 0, 0], [x, 31, 0]);
  for (let y = 1; y < 31; y += 1) cells.push([0, y, 0], [15, y, 0]);
  for (let step = 0; step < 8; step += 1) cells.push([4 + step, 12 + step, 0], [11 - step, 12 + step, 0]);
  return cells;
}
function defeatCells() {
  const cells = [];
  for (let step = 0; step < 16; step += 1) cells.push([step, 8 + step, 0], [15 - step, 8 + step, 0]);
  return cells;
}

// games/parkour/src/game.ts
var product = Object.freeze({
  manifest: manifest13,
  fallbackContent
});
function createGame13(config) {
  return createPublishedLevelGame(product, config);
}
var createSessionController2 = createPublishedLevelSessionController;

// games/parkour/src/fixtures.ts
var game4 = createGame13({ playerCount: 1, difficulty: "medium" });
var initEvents7 = game4.init(0);
game4.tick({ atMillis: 1500 });
var countdownFrame = game4.render();
var countdownSnapshot = game4.snapshot();
game4.tick({ atMillis: 3e3 });
var runningFrame11 = game4.render();
var runningSnapshot11 = game4.snapshot();
game4.press({ x: 7, y: 5, pressed: true, atMillis: 3020 });
game4.tick({ atMillis: 3040 });
var finishedFrame8 = game4.render();
var finishedSnapshot8 = game4.snapshot();

// games/patrones/src/index.ts
var src_exports14 = {};
__export(src_exports14, {
  PlayerDisplay: () => PlayerDisplay13,
  createGame: () => createGame14,
  finishedFrame: () => finishedFrame9,
  finishedSnapshot: () => finishedSnapshot9,
  initEvents: () => initEvents8,
  manifest: () => manifest14,
  patronesCelebrationMillis: () => patronesCelebrationMillis,
  patternTargets: () => patternTargets,
  runningFrame: () => runningFrame12,
  runningSnapshot: () => runningSnapshot12,
  startingSnapshot: () => startingSnapshot6,
  waitingSnapshot: () => waitingSnapshot6
});

// games/patrones/src/display.tsx
var import_jsx_runtime16 = __toESM(require_jsx_runtime(), 1);
function PlayerDisplay13({ snapshot, frame }) {
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(GameDisplayShell, { title: snapshot.label, phase: snapshot.phase, children: /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "ml-solo-display", children: [
    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(PlayerReadyOverlay, { snapshot }),
    /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "ml-solo-summary", children: [
      /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(MetricRow, { columns: 3, className: "ml-solo-number-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(MetricPanel, { label: "Aciertos", tone: "green", value: snapshot.claimedTargets }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(MetricPanel, { label: "Objetivos", tone: "blue", value: snapshot.totalTargets }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(MetricPanel, { label: "Tiempo", tone: "cyan", value: formatClock(snapshot.remainingMillis) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(MetricPanel, { className: "ml-solo-message", label: "Patr\xF3n", tone: snapshot.success ? "green" : "yellow", value: snapshot.lastEventMessage || "Reconstruye el patr\xF3n azul" })
    ] }),
    frame ? /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(FramePreviewPanel, { className: "ml-solo-floor", frame, label: "Patr\xF3n en el suelo" }) : null
  ] }) });
}

// games/patrones/src/manifest.ts
var manifest14 = {
  id: "patrones",
  label: "Patrones",
  description: "Reconstruye patrones azules sin pisar baldosas incorrectas.",
  availability: { development: true, production: true },
  catalog: {
    category: "team",
    color: "#176bff",
    durationLabel: "45s",
    modeLabel: "Reconstrucci\xF3n",
    audioLabel: "M\xFAsica + efectos",
    rules: ["Memoriza el patr\xF3n azul", "Pisa cada objetivo una vez", "Evita las dem\xE1s baldosas"]
  },
  players: { allowAny: true, min: 1, max: 1 },
  start: { mode: "player-ready" },
  defaultDurationMillis: 45e3,
  config: { difficulty: { options: ["easy", "medium", "hard"], default: "medium" } },
  display: { entry: "./display" },
  preview: {
    seed: 137,
    playerCount: 0,
    difficulty: "medium",
    actions: [{ atMillis: 100, type: "press", x: 8, y: 16 }],
    captureStartMillis: 2300,
    frameCount: 24,
    frameIntervalMillis: 120
  },
  tags: ["patrones", "memoria", "typescript"]
};

// games/patrones/src/game.ts
var patronesCelebrationMillis = 5e3;
var patterns = {
  easy: [
    { x: 7, y: 11 },
    { x: 8, y: 11 },
    { x: 6, y: 12 },
    { x: 9, y: 12 },
    { x: 5, y: 13 },
    { x: 10, y: 13 },
    { x: 7, y: 14 },
    { x: 8, y: 14 }
  ],
  medium: [
    { x: 7, y: 8 },
    { x: 8, y: 8 },
    { x: 6, y: 10 },
    { x: 9, y: 10 },
    { x: 5, y: 12 },
    { x: 10, y: 12 },
    { x: 6, y: 14 },
    { x: 9, y: 14 },
    { x: 7, y: 16 },
    { x: 8, y: 16 },
    { x: 7, y: 18 },
    { x: 8, y: 18 }
  ],
  hard: [
    { x: 7, y: 7 },
    { x: 8, y: 7 },
    { x: 5, y: 9 },
    { x: 10, y: 9 },
    { x: 4, y: 12 },
    { x: 11, y: 12 },
    { x: 6, y: 13 },
    { x: 9, y: 13 },
    { x: 5, y: 16 },
    { x: 10, y: 16 },
    { x: 7, y: 17 },
    { x: 8, y: 17 },
    { x: 6, y: 20 },
    { x: 9, y: 20 },
    { x: 7, y: 22 },
    { x: 8, y: 22 }
  ]
};
function patternTargets(difficulty = "medium") {
  return (patterns[difficulty] ?? patterns.medium ?? []).map((point) => ({ ...point }));
}
function createGame14(config) {
  return new PatronesGame(config);
}
var PatronesGame = class {
  claimed = /* @__PURE__ */ new Set();
  config;
  finishedAtMillis;
  lastEvent = gameEvent("none", "Listo", 0);
  nowMillis = 0;
  phase = "ready";
  players;
  readyGate;
  startedAtMillis = 0;
  success = false;
  targets;
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest14);
    this.readyGate = createPlayerReadyGate(manifest14.start, [{ minX: 5, maxX: 10, minY: 13, maxY: 18 }], this.config.nowMillis);
    this.targets = patternTargets(this.config.difficulty);
    this.players = this.scoredPlayers();
  }
  init(nowMillis) {
    this.resetState(nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") return this.applyReadyTransition(this.readyGate.update(event), event.atMillis);
    if (this.phase !== "running" || !event.pressed) return [];
    const key = `${event.x},${event.y}`;
    if (this.targets.some((target3) => target3.x === event.x && target3.y === event.y)) {
      if (this.claimed.has(key)) return [];
      this.claimed.add(key);
      this.players = this.scoredPlayers();
      if (this.claimed.size === this.targets.length) return this.finish(true, "Patr\xF3n completado", event.atMillis);
      this.lastEvent = gameEvent("hit", `Acierto ${this.claimed.size} de ${this.targets.length}`, event.atMillis);
      return [this.lastEvent];
    }
    return this.finish(false, "Baldosa incorrecta", event.atMillis);
  }
  release(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") return this.applyReadyTransition(this.readyGate.update({ ...event, pressed: false }), event.atMillis);
    return [];
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") return this.applyReadyTransition(this.readyGate.tick(event.atMillis), event.atMillis);
    if (this.phase === "finished") {
      if (event.atMillis - (this.finishedAtMillis ?? event.atMillis) >= patronesCelebrationMillis) {
        this.resetState(event.atMillis);
        return [this.lastEvent];
      }
      return [];
    }
    if (this.phase === "running" && this.remainingMillis() === 0) return this.finish(false, "Tiempo agotado", event.atMillis);
    return [];
  }
  render() {
    const frame = createFrame("#030712");
    if (this.phase === "waiting" || this.phase === "starting") {
      const step = Math.floor(this.nowMillis / (this.phase === "starting" ? 100 : 180));
      paintDiamondRing(frame, { centerX: 8, centerY: 16, radius: 2 + step % 8, color: this.phase === "starting" ? "#ffe176" : "#176bff" });
      return frame;
    }
    for (const target3 of this.targets) {
      paintFrameCell(frame, target3.x, target3.y, this.claimed.has(`${target3.x},${target3.y}`) ? "#35e77a" : "#176bff");
    }
    if (this.phase === "finished") {
      paintDiamondWave(frame, { color: this.success ? "#35e77a" : "#ff334e", step: Math.floor((this.nowMillis - (this.finishedAtMillis ?? this.nowMillis)) / 140) });
    }
    return frame;
  }
  snapshot() {
    const ready = this.readyGate.state(this.nowMillis);
    return {
      currentGame: manifest14.id,
      label: manifest14.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: this.players,
      score: this.claimed.size,
      lives: -1,
      elapsedMillis: this.elapsedMillis(),
      remainingMillis: this.remainingMillis(),
      activeTargets: this.phase === "running" ? this.targets.length - this.claimed.size : 0,
      success: this.phase === "finished" && this.success,
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? ready.countdownMillis : 0,
      readyPlayers: ready.readyPlayers,
      requiredPlayers: ready.requiredPlayers,
      matchTarget: this.targets.length,
      claimedTargets: this.claimed.size,
      totalTargets: this.targets.length,
      celebrationMillis: this.phase === "finished" ? Math.max(0, patronesCelebrationMillis - (this.nowMillis - (this.finishedAtMillis ?? this.nowMillis))) : 0
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest14);
    this.targets = patternTargets(this.config.difficulty);
    this.resetState(this.config.nowMillis);
  }
  applyReadyTransition(transition, nowMillis) {
    if (transition === "players-ready") {
      this.phase = "starting";
      this.lastEvent = gameEvent("ready", "Jugador listo", nowMillis);
    } else if (transition === "players-left") {
      this.phase = "waiting";
      this.lastEvent = gameEvent("ready", "Vuelve al centro", nowMillis);
    } else if (transition === "started") {
      this.phase = "running";
      this.startedAtMillis = nowMillis;
      this.lastEvent = gameEvent("start", "Reconstruye el patr\xF3n azul", nowMillis);
    } else return [];
    return [this.lastEvent];
  }
  elapsedMillis() {
    if (this.phase === "waiting" || this.phase === "starting") return 0;
    return Math.max(0, (this.finishedAtMillis ?? this.nowMillis) - this.startedAtMillis);
  }
  finish(success, message, atMillis) {
    this.phase = "finished";
    this.success = success;
    this.finishedAtMillis = atMillis;
    this.lastEvent = gameEvent(success ? "win" : "fail", message, atMillis);
    return [this.lastEvent];
  }
  remainingMillis() {
    return Math.max(0, this.config.durationMillis - this.elapsedMillis());
  }
  resetState(nowMillis) {
    this.readyGate.reset(nowMillis);
    this.claimed.clear();
    this.finishedAtMillis = void 0;
    this.lastEvent = gameEvent("ready", "Espera en la zona central", nowMillis);
    this.nowMillis = nowMillis;
    this.phase = "waiting";
    this.startedAtMillis = nowMillis;
    this.success = false;
    this.players = this.scoredPlayers();
  }
  scoredPlayers() {
    return defaultPlayers(this.config.playerCount, this.config.players).map((player) => ({ ...player, score: this.claimed.size }));
  }
};

// games/patrones/src/fixtures.ts
var game5 = createGame14({ playerCount: 0, difficulty: "medium", durationMillis: manifest14.defaultDurationMillis });
var initEvents8 = game5.init(0);
var waitingSnapshot6 = game5.snapshot();
game5.press({ x: 8, y: 16, pressed: true, atMillis: 100 });
var startingSnapshot6 = game5.snapshot();
game5.tick({ atMillis: 2100 });
var runningFrame12 = game5.render();
var runningSnapshot12 = game5.snapshot();
patternTargets("medium").forEach((target3, index) => game5.press({ ...target3, pressed: true, atMillis: 2200 + index * 10 }));
var finishedFrame9 = game5.render();
var finishedSnapshot9 = game5.snapshot();

// games/ping-pong/src/index.ts
var src_exports15 = {};
__export(src_exports15, {
  PlayerDisplay: () => PlayerDisplay14,
  ballColor: () => ballColor2,
  blueColor: () => blueColor,
  createGame: () => createGame15,
  finishedSnapshot: () => finishedSnapshot10,
  manifest: () => manifest15,
  pingPongConfigVars: () => pingPongConfigVars,
  redColor: () => redColor,
  runningFrame: () => runningFrame13,
  runningSnapshot: () => runningSnapshot13,
  waitingSnapshot: () => waitingSnapshot7
});

// games/ping-pong/src/display.tsx
var import_jsx_runtime17 = __toESM(require_jsx_runtime(), 1);
function positionStyle(position) {
  return {
    "--ping-pong-ball-x": `${3.5 + position.y / 31 * 93}%`,
    "--ping-pong-ball-y": `${18 + position.x / 15 * 64}%`
  };
}
function PlayerDisplay14({
  snapshot
}) {
  const [red2, blue2] = snapshot.players;
  const redPlayer = red2 ?? { label: "Rojo", score: 0, color: "#ff1c28" };
  const bluePlayer = blue2 ?? { label: "Azul", score: 0, color: "#145cff" };
  const target3 = Math.max(snapshot.matchTarget, 1);
  const totalRounds2 = target3 * 2 - 1;
  const centerLabel = snapshot.phase === "starting" ? "Empieza en" : "Objetivo";
  const centerValue = snapshot.phase === "starting" ? formatClock(snapshot.countdownMillis) : target3;
  const centerCaption = snapshot.phase === "starting" ? "preparados" : "puntos para ganar";
  const rallyLabel = snapshot.phase === "finished" ? "\xDAltimo peloteo" : "Peloteo";
  const rallyValue = snapshot.phase === "finished" && snapshot.lastRoundHits > 0 ? snapshot.lastRoundHits : snapshot.roundHits;
  const lastValue = snapshot.lastRoundWinner || "-";
  const lastTone = lastValue === redPlayer.label ? "red" : lastValue === bluePlayer.label ? "blue" : "neutral";
  const readyVisible = snapshot.phase === "waiting" || snapshot.phase === "starting";
  const currentRound = Math.min(
    totalRounds2,
    snapshot.rounds.length + (snapshot.phase === "running" || snapshot.phase === "starting" ? 1 : 0)
  );
  const progressLabel = readyVisible ? "Listos" : "Ronda";
  const progressValue = readyVisible ? `${snapshot.activeTargets}/2` : `${currentRound}/${totalRounds2}`;
  const roundInProgress = snapshot.phase === "running";
  const activeRound = snapshot.phase === "finished" ? null : Math.min(totalRounds2, snapshot.rounds.length + 1);
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
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(GameDisplayShell, { title: snapshot.label, phase: snapshot.phase, variant: "versus", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(
    "div",
    {
      className: displayClassName,
      style: { "--ping-pong-rally-pace": snapshot.rallyPace },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
          VersusScoreboard,
          {
            className: "ping-pong-scoreboard",
            left: redPlayer,
            right: bluePlayer,
            target: target3,
            centerLabel,
            centerValue,
            centerCaption
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(
          "section",
          {
            "aria-label": `Trayectoria de la pelota: ${rallyCaption}`,
            className: "ping-pong-rally-lane",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: "ping-pong-rally-team is-red", children: "Rojo" }),
              /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: "ping-pong-rally-team is-blue", children: "Azul" }),
              /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: "ping-pong-rally-net", "aria-hidden": "true" }),
              /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: "ping-pong-rally-scan", "aria-hidden": "true" }),
              snapshot.ballTrail.map((position, index) => /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
                "i",
                {
                  "aria-hidden": "true",
                  className: "ping-pong-ball-trail",
                  style: { ...positionStyle(position), "--ping-pong-trail-index": index }
                },
                `${index}-${position.x}-${position.y}`
              )),
              /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
                "i",
                {
                  "aria-hidden": "true",
                  className: "ping-pong-ball",
                  style: positionStyle(snapshot.ball)
                }
              ),
              snapshot.impact ? /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
                "i",
                {
                  "aria-hidden": "true",
                  className: `ping-pong-impact is-${snapshot.impact.team === 0 ? "red" : "blue"}`,
                  style: impactStyle
                },
                snapshot.motionEventId
              ) : null,
              /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("strong", { className: "ping-pong-rally-caption", children: rallyCaption }, `caption-${snapshot.motionEventId}`)
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(MetricRow, { columns: 4, className: "ping-pong-metrics", children: [
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(MetricPanel, { className: "ping-pong-rally-metric", label: rallyLabel, tone: "cyan", value: rallyValue }),
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(MetricPanel, { className: "ping-pong-progress-metric", label: progressLabel, tone: readyVisible ? "green" : "yellow", value: progressValue }),
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(MetricPanel, { className: "ping-pong-last-metric", label: "\xDAltimo", tone: lastTone, value: lastValue }),
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(MetricPanel, { className: "ping-pong-time-metric", label: "Tiempo", tone: "amber", value: formatClock(snapshot.elapsedMillis) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
          RoundStrip,
          {
            className: "ping-pong-rounds",
            activeCaption: roundInProgress ? "Punto en curso" : "Por comenzar",
            activeLabel: roundInProgress ? "En juego" : "Siguiente",
            activeRound,
            rounds: snapshot.rounds,
            totalRounds: totalRounds2
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
var manifest15 = {
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
var idleColor3 = "#05070a";
var redRgb = { r: 255, g: 28, b: 40 };
var blueRgb = { r: 20, g: 92, b: 255 };
var whiteRgb = { r: 255, g: 255, b: 255 };
var postPointPauseMillis = 900;
var winAnimationMillis3 = 3e3;
var paddleYRed = 2;
var paddleYBlue = 29;
var paddleWidth2 = 5;
var serveX = Math.floor(FLOOR_COLS / 2);
var serveY = Math.floor(FLOOR_ROWS / 2);
var maximumSpeedRatio = 2.5;
function createGame15(config) {
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
    this.config = normalizeGameConfig(config, manifest15);
    this.rng = createSeededRng(this.config.seed);
    this.readyGate = createPlayerReadyGate(manifest15.start, createHorizontalPlayerReadyZones(2), this.config.nowMillis);
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
    const frame = createFrame(idleColor3);
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
    const remainingMillis = this.phase === "finished" && this.nowMillis < this.finishAtMillis + winAnimationMillis3 ? this.finishAtMillis + winAnimationMillis3 - this.nowMillis : 0;
    return {
      currentGame: manifest15.id,
      label: manifest15.label,
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
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest15);
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
      if (nowMillis - this.finishAtMillis >= winAnimationMillis3) {
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
    const countdownDuration2 = gameStartCountdownMillis(manifest15.start);
    const elapsed = Math.max(0, countdownDuration2 - this.readyGate.state(this.nowMillis).countdownMillis);
    const progress = clamp(elapsed / countdownDuration2, 0, 1);
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
          paintFrameCell(frame, x, y, mix2(base, 28 + wake * 74, wake * 24));
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
          paintFrameCell(frame, x, y, mix2(base, 28 + ring * 82, ring * 34));
        } else if (spark > 0 && fade > 0.18) {
          paintFrameCell(frame, x, y, mix2(base, 22 + fade * 44, fade * 12));
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
          paintFrameCell(frame, x, y, mix2(base, 38 + (3.8 - ribbon) * 15 + pulse * 12, 12 + pulse * 18));
        } else if (sparkle > 0.91) {
          paintFrameCell(frame, x, y, mix2(base, 48, 32));
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
        const wave2 = (Math.sin(x * 0.78 + y * 0.31 - flow) + 1) * 0.5;
        const lane = (x + y) % 3 === 0 ? 4 : 0;
        paintFrameCell(frame, x, y, tint(base, 4 + wave2 * 7 + lane));
      }
    }
    this.drawCenterLine(frame, 18 + (Math.sin(this.nowMillis / 140) + 1) * 5);
  }
  drawCenterLine(frame, level) {
    for (let x = 0; x < FLOOR_COLS; x += 1) {
      if ((x + Math.floor(this.nowMillis / 120)) % 3 !== 0) {
        continue;
      }
      paintFrameCell(frame, x, serveY - 1, mix2(whiteRgb, level, 0));
      paintFrameCell(frame, x, serveY, mix2(whiteRgb, level * 0.72, 0));
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
          paintFrameCell(frame, x, y, mix2(base, 30 + ring * 52, ring * 28 * (1 - progress)));
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
      paintFrameCell(frame, x + offset, y + 1, mix2(base, level - 8, 10));
      paintFrameCell(frame, x + offset, y + 2, tint(base, Math.max(18, level - 28)));
    }
  }
  drawPaddle(frame, x, y, base) {
    for (let offset = 0; offset < paddleWidth2; offset += 1) {
      const level = offset === Math.floor(paddleWidth2 / 2) ? 118 : 74;
      paintFrameCell(frame, x + offset, y, mix2(base, level, 18));
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
function mix2(color, colorPercent, whitePercent) {
  return rgbToHex(addRgb(scaleRgb(color, colorPercent), scaleRgb(whiteRgb, whitePercent)));
}

// games/ping-pong/src/fixtures.ts
var runningFrame13 = (() => {
  const frame = createFrame("#05070a");
  fillFrameRect(frame, 5, 2, 5, 1, redColor);
  fillFrameRect(frame, 6, 29, 5, 1, blueColor);
  paintFrameCell(frame, 8, 16, ballColor2);
  return frame;
})();
var waitingSnapshot7 = {
  currentGame: manifest15.id,
  label: manifest15.label,
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
var runningSnapshot13 = {
  ...waitingSnapshot7,
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
var finishedSnapshot10 = {
  ...runningSnapshot13,
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

// games/ping-pong-v2/src/index.ts
var src_exports16 = {};
__export(src_exports16, {
  PlayerDisplay: () => PlayerDisplay15,
  ballColor: () => ballColor3,
  blueColor: () => blueColor2,
  createGame: () => createGame16,
  finishedSnapshot: () => finishedSnapshot11,
  manifest: () => manifest16,
  pingPongV2ConfigVars: () => pingPongV2ConfigVars,
  redColor: () => redColor2,
  runningFrame: () => runningFrame14,
  runningSnapshot: () => runningSnapshot14,
  waitingSnapshot: () => waitingSnapshot8
});

// games/ping-pong-v2/src/display.tsx
var import_jsx_runtime18 = __toESM(require_jsx_runtime(), 1);
function positionStyle2(position) {
  return {
    "--ping-pong-ball-x": `${3.5 + position.y / 31 * 93}%`,
    "--ping-pong-ball-y": `${18 + position.x / 15 * 64}%`
  };
}
function PlayerDisplay15({
  snapshot
}) {
  const [red2, blue2] = snapshot.players;
  const redPlayer = red2 ?? { label: "Rojo", score: 0, color: "#ff1c28" };
  const bluePlayer = blue2 ?? { label: "Azul", score: 0, color: "#145cff" };
  const target3 = Math.max(snapshot.matchTarget, 1);
  const totalRounds2 = target3 * 2 - 1;
  const centerLabel = snapshot.phase === "starting" ? "Empieza en" : "Objetivo";
  const centerValue = snapshot.phase === "starting" ? formatClock(snapshot.countdownMillis) : target3;
  const centerCaption = snapshot.phase === "starting" ? "preparados" : "puntos para ganar";
  const rallyLabel = snapshot.phase === "finished" ? "\xDAltimo peloteo" : "Peloteo";
  const rallyValue = snapshot.phase === "finished" && snapshot.lastRoundHits > 0 ? snapshot.lastRoundHits : snapshot.roundHits;
  const lastValue = snapshot.lastRoundWinner || "-";
  const lastTone = lastValue === redPlayer.label ? "red" : lastValue === bluePlayer.label ? "blue" : "neutral";
  const readyVisible = snapshot.phase === "waiting" || snapshot.phase === "starting";
  const currentRound = Math.min(
    totalRounds2,
    snapshot.rounds.length + (snapshot.phase === "running" || snapshot.phase === "starting" ? 1 : 0)
  );
  const progressLabel = readyVisible ? "Listos" : "Ronda";
  const progressValue = readyVisible ? `${snapshot.activeTargets}/2` : `${currentRound}/${totalRounds2}`;
  const roundInProgress = snapshot.phase === "running";
  const activeRound = snapshot.phase === "finished" ? null : Math.min(totalRounds2, snapshot.rounds.length + 1);
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
  const impactStyle = snapshot.impact ? positionStyle2(snapshot.impact) : void 0;
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(GameDisplayShell, { title: snapshot.label, phase: snapshot.phase, variant: "versus", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(
    "div",
    {
      className: displayClassName,
      style: { "--ping-pong-rally-pace": snapshot.rallyPace },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
          VersusScoreboard,
          {
            className: "ping-pong-scoreboard",
            left: redPlayer,
            right: bluePlayer,
            target: target3,
            centerLabel,
            centerValue,
            centerCaption
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(
          "section",
          {
            "aria-label": `Trayectoria de la pelota: ${rallyCaption}`,
            className: "ping-pong-rally-lane",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "ping-pong-rally-team is-red", children: "Rojo" }),
              /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "ping-pong-rally-team is-blue", children: "Azul" }),
              /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "ping-pong-rally-net", "aria-hidden": "true" }),
              /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "ping-pong-rally-scan", "aria-hidden": "true" }),
              snapshot.ballTrail.map((position, index) => /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
                "i",
                {
                  "aria-hidden": "true",
                  className: "ping-pong-ball-trail",
                  style: { ...positionStyle2(position), "--ping-pong-trail-index": index }
                },
                `${index}-${position.x}-${position.y}`
              )),
              /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
                "i",
                {
                  "aria-hidden": "true",
                  className: "ping-pong-ball",
                  style: positionStyle2(snapshot.ball)
                }
              ),
              snapshot.impact ? /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
                "i",
                {
                  "aria-hidden": "true",
                  className: `ping-pong-impact is-${snapshot.impact.team === 0 ? "red" : "blue"}`,
                  style: impactStyle
                },
                snapshot.motionEventId
              ) : null,
              /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("strong", { className: "ping-pong-rally-caption", children: rallyCaption }, `caption-${snapshot.motionEventId}`)
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(MetricRow, { columns: 4, className: "ping-pong-metrics", children: [
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(MetricPanel, { className: "ping-pong-rally-metric", label: rallyLabel, tone: "cyan", value: rallyValue }),
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(MetricPanel, { className: "ping-pong-progress-metric", label: progressLabel, tone: readyVisible ? "green" : "yellow", value: progressValue }),
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(MetricPanel, { className: "ping-pong-last-metric", label: "\xDAltimo", tone: lastTone, value: lastValue }),
          /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(MetricPanel, { className: "ping-pong-time-metric", label: "Tiempo", tone: "amber", value: formatClock(snapshot.elapsedMillis) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
          RoundStrip,
          {
            className: "ping-pong-rounds",
            activeCaption: roundInProgress ? "Punto en curso" : "Por comenzar",
            activeLabel: roundInProgress ? "En juego" : "Siguiente",
            activeRound,
            rounds: snapshot.rounds,
            totalRounds: totalRounds2
          }
        )
      ]
    }
  ) });
}

// games/ping-pong-v2/src/manifest.ts
var pingPongV2ConfigVars = {
  pointsToWin: {
    key: "points_to_win",
    label: "Points to win",
    playerFacing: true,
    description: "The first team to reach this score wins.",
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
    description: "Starting ball speed on Easy before applying the difficulty curve.",
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
    description: "Rally acceleration after each successful paddle return.",
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
    description: "Per-level multiplier for starting speed and return acceleration.",
    type: "float",
    default: 1.2,
    min: 1,
    max: 1.35,
    step: 0.05
  }
};
var manifest16 = {
  id: "ping-pong-v2",
  label: "Ping Pong v2",
  description: "La versi\xF3n competitiva de Ping Pong: peloteos acelerados y partidas al mejor de cinco puntos.",
  availability: { development: true, production: true },
  catalog: {
    category: "versus",
    color: "#145cff",
    durationLabel: "A 5 puntos",
    modeLabel: "Rojo contra azul",
    audioLabel: "M\xFAsica + efectos",
    rules: ["Un equipo ocupa la mitad roja y otro la azul", "Mueve la pala pisando tu mitad", "Cada devoluci\xF3n acelera la pelota"]
  },
  players: { allowAny: true, min: 2, max: 2 },
  start: { mode: "player-ready", releaseGraceMillis: 1e3 },
  config: {
    difficulty: { default: "medium", options: ["easy", "medium", "hard", "expert"] },
    vars: Object.values(pingPongV2ConfigVars)
  },
  defaultDurationMillis: 0,
  display: { entry: "./display" },
  preview: {
    seed: 202,
    playerCount: 2,
    difficulty: "medium",
    options: { points_to_win: 5 },
    actions: [{ atMillis: 100, type: "press", x: 7, y: 3 }, { atMillis: 100, type: "press", x: 7, y: 28 }],
    captureStartMillis: 2200,
    frameCount: 18,
    frameIntervalMillis: 120
  },
  tags: ["arcade", "versus", "typescript", "v2"]
};

// games/ping-pong-v2/src/game.ts
var redColor2 = "#ff1c28";
var blueColor2 = "#145cff";
var ballColor3 = "#ffffff";
var idleColor4 = "#05070a";
var redRgb2 = { r: 255, g: 28, b: 40 };
var blueRgb2 = { r: 20, g: 92, b: 255 };
var whiteRgb2 = { r: 255, g: 255, b: 255 };
var postPointPauseMillis2 = 900;
var winAnimationMillis4 = 3e3;
var paddleYRed2 = 2;
var paddleYBlue2 = 29;
var paddleWidth3 = 5;
var serveX2 = Math.floor(FLOOR_COLS / 2);
var serveY2 = Math.floor(FLOOR_ROWS / 2);
var maximumSpeedRatio2 = 2.5;
function createGame16(config) {
  return new PingPongGame2(config);
}
var PingPongGame2 = class {
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
  ball = { x: serveX2, y: serveY2, dx: 1, dy: 1 };
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
    this.config = normalizeGameConfig(config, manifest16);
    this.rng = createSeededRng(this.config.seed);
    this.readyGate = createPlayerReadyGate(manifest16.start, createHorizontalPlayerReadyZones(2), this.config.nowMillis);
    this.winningScore = this.readWinningScore();
    this.players = this.createPlayers();
    this.speed = speedForConfig2(this.config);
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
    const frame = createFrame(idleColor4);
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
      paintFrameCell(frame, this.ball.x, this.ball.y, ballColor3);
    }
    return frame;
  }
  snapshot() {
    this.recordEvents(this.updatePhase(this.nowMillis));
    const readyState = this.readyGate.state(this.nowMillis);
    const countdownMillis = this.phase === "starting" ? readyState.countdownMillis : 0;
    const remainingMillis = this.phase === "finished" && this.nowMillis < this.finishAtMillis + winAnimationMillis4 ? this.finishAtMillis + winAnimationMillis4 - this.nowMillis : 0;
    return {
      currentGame: manifest16.id,
      label: manifest16.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: [
        {
          index: 0,
          label: this.labelForTeam(0),
          color: redColor2,
          score: this.teamScore[0],
          lives: -1
        },
        {
          index: 1,
          label: this.labelForTeam(1),
          color: blueColor2,
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
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest16);
    this.rng = createSeededRng(this.config.seed);
    this.winningScore = this.readWinningScore();
    this.players = this.createPlayers();
    this.speed = speedForConfig2(this.config);
    this.motionEventId = 0;
    this.resetGame(this.config.nowMillis);
    this.lastEvent = gameEvent("none", "Listo", this.config.nowMillis);
  }
  createPlayers() {
    return [
      { index: 0, label: "Rojo", color: redColor2, score: 0, lives: -1 },
      { index: 1, label: "Azul", color: blueColor2, score: 0, lives: -1 }
    ];
  }
  readWinningScore() {
    return readGameConfigOption(this.config.options, pingPongV2ConfigVars.pointsToWin);
  }
  resetGame(nowMillis) {
    this.readyGate.reset(nowMillis);
    this.teamScore = [0, 0];
    this.rounds = [];
    this.lastRoundHits = 0;
    this.lastRoundWinner = "";
    this.redPaddleX = Math.floor((FLOOR_COLS - paddleWidth3) / 2);
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
      if (nowMillis - this.finishAtMillis >= winAnimationMillis4) {
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
    const center = clamp(Math.round(x), Math.floor(paddleWidth3 / 2), FLOOR_COLS - 1 - Math.floor(paddleWidth3 / 2));
    const left = center - Math.floor(paddleWidth3 / 2);
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
    if (this.ball.dy < 0 && nextY === paddleYRed2 && nextX >= this.redPaddleX && nextX < this.redPaddleX + paddleWidth3) {
      this.reflectFromPaddle(nextX, this.redPaddleX);
      this.commitBall({ ...this.ball, x: nextX, y: paddleYRed2 + 1, dy: 1 });
      this.recordImpact(0, nextX, paddleYRed2);
      this.accelerate();
      return gameEvent("coin", "Rojo devuelve", nowMillis);
    }
    if (this.ball.dy > 0 && nextY === paddleYBlue2 && nextX >= this.bluePaddleX && nextX < this.bluePaddleX + paddleWidth3) {
      this.reflectFromPaddle(nextX, this.bluePaddleX);
      this.commitBall({ ...this.ball, x: nextX, y: paddleYBlue2 - 1, dy: -1 });
      this.recordImpact(1, nextX, paddleYBlue2);
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
    this.pauseUntilMillis = nowMillis + postPointPauseMillis2;
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
    this.ball = { ...this.ball, x: serveX2, y: serveY2 };
    this.ballTrail = [];
    this.currentIntervalMillis = this.speed.initialMillis;
    this.hitCount = 0;
    this.pauseUntilMillis = 0;
    this.serve();
  }
  serve() {
    this.ball = {
      x: serveX2,
      y: serveY2,
      dy: this.rng.int(2) === 0 ? -1 : 1,
      dx: this.rng.int(2) === 0 ? -1 : 1
    };
  }
  reflectFromPaddle(x, paddleX) {
    const center = paddleX + Math.floor(paddleWidth3 / 2);
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
      this.drawSoftBar(frame, 3, 5, 10, redRgb2);
    } else {
      this.drawBreathingOutline(frame, 0, redRgb2);
    }
    if (blueReady) {
      this.drawSoftBar(frame, 3, 24, 10, blueRgb2);
    } else {
      this.drawBreathingOutline(frame, 1, blueRgb2);
    }
  }
  drawReady(frame) {
    const countdownDuration2 = gameStartCountdownMillis(manifest16.start);
    const elapsed = Math.max(0, countdownDuration2 - this.readyGate.state(this.nowMillis).countdownMillis);
    const progress = clamp(elapsed / countdownDuration2, 0, 1);
    const radius = progress * (FLOOR_ROWS * 0.7);
    const pulse = 0.5 + Math.sin(elapsed / 86) * 0.5;
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      for (let x = 0; x < FLOOR_COLS; x += 1) {
        const dist = Math.abs(x - serveX2) + Math.abs(y - serveY2);
        const base = y >= FLOOR_ROWS / 2 ? blueRgb2 : redRgb2;
        const waveDistance = Math.abs(dist - radius);
        const wake = Math.max(0, 1 - waveDistance / 3.2);
        const ambient = 7 + (Math.sin(x * 0.82 + y * 0.38 - elapsed / 120) + 1) * 4;
        if (wake > 0) {
          paintFrameCell(frame, x, y, mix3(base, 28 + wake * 74, wake * 24));
        } else if (dist < radius) {
          paintFrameCell(frame, x, y, tint2(base, ambient + pulse * 10));
        }
      }
    }
    this.drawCenterLine(frame, 18 + pulse * 20);
    this.drawBallGlow(frame);
    paintFrameCell(frame, serveX2, serveY2, ballColor3);
  }
  drawScoreFlash(frame) {
    const base = this.scorer === 1 ? blueRgb2 : redRgb2;
    const elapsed = Math.max(0, this.nowMillis - this.pointAtMillis);
    const progress = clamp(elapsed / postPointPauseMillis2, 0, 1);
    const originY = this.scorer === 0 ? FLOOR_ROWS - 1 : 0;
    const radius = progress * (FLOOR_ROWS + 8);
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      for (let x = 0; x < FLOOR_COLS; x += 1) {
        const dist = Math.hypot((x - serveX2) * 1.35, y - originY);
        const ring = Math.max(0, 1 - Math.abs(dist - radius) / 3.4);
        const spark = Math.sin(x * 12.13 + y * 7.71 + elapsed / 38) > 0.9 ? 1 : 0;
        const fade = 1 - progress;
        if (ring > 0) {
          paintFrameCell(frame, x, y, mix3(base, 28 + ring * 82, ring * 34));
        } else if (spark > 0 && fade > 0.18) {
          paintFrameCell(frame, x, y, mix3(base, 22 + fade * 44, fade * 12));
        }
      }
    }
    this.drawCenterLine(frame, 12 + (1 - progress) * 24);
    this.drawPaddles(frame);
  }
  drawWin(frame) {
    const base = this.winner === 1 ? blueRgb2 : redRgb2;
    const elapsed = Math.max(0, this.nowMillis - this.finishAtMillis);
    const sweep = elapsed / 92;
    const pulse = 0.5 + Math.sin(elapsed / 110) * 0.5;
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      for (let x = 0; x < FLOOR_COLS; x += 1) {
        const directionY = this.winner === 0 ? FLOOR_ROWS - 1 - y : y;
        const ribbon = (directionY + x * 0.72 - sweep + FLOOR_ROWS * 4) % 11;
        const sparkle = Math.sin(x * 17.17 + y * 11.31 + elapsed / 55);
        if (ribbon < 3.8) {
          paintFrameCell(frame, x, y, mix3(base, 38 + (3.8 - ribbon) * 15 + pulse * 12, 12 + pulse * 18));
        } else if (sparkle > 0.91) {
          paintFrameCell(frame, x, y, mix3(base, 48, 32));
        }
      }
    }
    const coreLevel = 64 + pulse * 26;
    fillFrameRect(frame, serveX2 - 1, serveY2 - 1, 3, 3, tint2(whiteRgb2, coreLevel));
    paintFrameCell(frame, serveX2, serveY2, ballColor3);
  }
  drawArena(frame) {
    const flow = this.nowMillis / 185;
    for (let y = 1; y < FLOOR_ROWS - 1; y += 1) {
      const base = y < FLOOR_ROWS / 2 ? redRgb2 : blueRgb2;
      for (let x = 0; x < FLOOR_COLS; x += 1) {
        const wave2 = (Math.sin(x * 0.78 + y * 0.31 - flow) + 1) * 0.5;
        const lane = (x + y) % 3 === 0 ? 4 : 0;
        paintFrameCell(frame, x, y, tint2(base, 4 + wave2 * 7 + lane));
      }
    }
    this.drawCenterLine(frame, 18 + (Math.sin(this.nowMillis / 140) + 1) * 5);
  }
  drawCenterLine(frame, level) {
    for (let x = 0; x < FLOOR_COLS; x += 1) {
      if ((x + Math.floor(this.nowMillis / 120)) % 3 !== 0) {
        continue;
      }
      paintFrameCell(frame, x, serveY2 - 1, mix3(whiteRgb2, level, 0));
      paintFrameCell(frame, x, serveY2, mix3(whiteRgb2, level * 0.72, 0));
    }
  }
  drawBallTrail(frame) {
    this.ballTrail.forEach((position, index) => {
      const level = Math.max(10, 46 - index * 8);
      paintFrameCell(frame, position.x, position.y, tint2(whiteRgb2, level));
    });
  }
  drawBallGlow(frame) {
    const glow = 20 + (Math.sin(this.nowMillis / 70) + 1) * 7;
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      paintFrameCell(frame, this.ball.x + dx, this.ball.y + dy, tint2(whiteRgb2, glow));
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
    const base = this.lastImpact.team === 0 ? redRgb2 : blueRgb2;
    for (let y = Math.max(0, this.lastImpact.y - 7); y <= Math.min(FLOOR_ROWS - 1, this.lastImpact.y + 7); y += 1) {
      for (let x = Math.max(0, this.lastImpact.x - 7); x <= Math.min(FLOOR_COLS - 1, this.lastImpact.x + 7); x += 1) {
        const dist = Math.hypot(x - this.lastImpact.x, y - this.lastImpact.y);
        const ring = Math.max(0, 1 - Math.abs(dist - radius) / 1.45);
        if (ring > 0) {
          paintFrameCell(frame, x, y, mix3(base, 30 + ring * 52, ring * 28 * (1 - progress)));
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
    this.drawOutline(frame, inset, y, FLOOR_COLS - inset * 2, 8, tint2(base, level));
  }
  drawScore(frame) {
    for (let x = 0; x < this.teamScore[0] && x < FLOOR_COLS; x += 1) {
      paintFrameCell(frame, x, 0, redColor2);
    }
    for (let x = 0; x < this.teamScore[1] && x < FLOOR_COLS; x += 1) {
      paintFrameCell(frame, x, FLOOR_ROWS - 1, blueColor2);
    }
  }
  drawPaddles(frame) {
    this.drawPaddle(frame, this.redPaddleX, paddleYRed2, redRgb2);
    this.drawPaddle(frame, this.bluePaddleX, paddleYBlue2, blueRgb2);
  }
  drawWaitingHalf(frame, half, ready) {
    const startY = half === 1 ? FLOOR_ROWS / 2 : 0;
    const base = half === 1 ? blueRgb2 : redRgb2;
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
          paintFrameCell(frame, x, y, tint2(base, level));
        }
      }
    }
  }
  drawSoftBar(frame, x, y, width, base) {
    const pulse = Math.floor(this.nowMillis / 100) % 6;
    for (let offset = 0; offset < width; offset += 1) {
      const level = offset === pulse || offset === width - 1 - pulse ? 112 : 58 + offset * 4;
      paintFrameCell(frame, x + offset, y, tint2(base, level));
      paintFrameCell(frame, x + offset, y + 1, mix3(base, level - 8, 10));
      paintFrameCell(frame, x + offset, y + 2, tint2(base, Math.max(18, level - 28)));
    }
  }
  drawPaddle(frame, x, y, base) {
    for (let offset = 0; offset < paddleWidth3; offset += 1) {
      const level = offset === Math.floor(paddleWidth3 / 2) ? 118 : 74;
      paintFrameCell(frame, x + offset, y, mix3(base, level, 18));
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
function speedForConfig2(config) {
  const baseInitialSpeed = readGameConfigOption(config.options, pingPongV2ConfigVars.initialBallSpeed);
  const baseHitMultiplier = readGameConfigOption(config.options, pingPongV2ConfigVars.returnSpeedMultiplier);
  const difficultyStep = readGameConfigOption(config.options, pingPongV2ConfigVars.difficultyMultiplier);
  const difficultyFactor = difficultyStep ** difficultyIndex2(config.difficulty);
  const initialTilesPerSecond = baseInitialSpeed * difficultyFactor;
  const hitMultiplier = 1 + (baseHitMultiplier - 1) * difficultyFactor;
  const maximumTilesPerSecond = initialTilesPerSecond * maximumSpeedRatio2;
  return {
    difficultyFactor,
    hitMultiplier,
    initialTilesPerSecond,
    initialMillis: 1e3 / initialTilesPerSecond,
    minimumMillis: 1e3 / maximumTilesPerSecond
  };
}
function difficultyIndex2(value) {
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
function tint2(color, percent) {
  return rgbToHex(scaleRgb(color, percent));
}
function mix3(color, colorPercent, whitePercent) {
  return rgbToHex(addRgb(scaleRgb(color, colorPercent), scaleRgb(whiteRgb2, whitePercent)));
}

// games/ping-pong-v2/src/fixtures.ts
var runningFrame14 = (() => {
  const frame = createFrame("#05070a");
  fillFrameRect(frame, 5, 2, 5, 1, redColor2);
  fillFrameRect(frame, 6, 29, 5, 1, blueColor2);
  paintFrameCell(frame, 8, 16, ballColor3);
  return frame;
})();
var waitingSnapshot8 = {
  currentGame: manifest16.id,
  label: manifest16.label,
  phase: "waiting",
  playerCount: 2,
  players: [
    { index: 0, label: "Rojo", color: redColor2, score: 0, lives: -1 },
    { index: 1, label: "Azul", color: blueColor2, score: 0, lives: -1 }
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
var runningSnapshot14 = {
  ...waitingSnapshot8,
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
var finishedSnapshot11 = {
  ...runningSnapshot14,
  phase: "finished",
  score: 5,
  remainingMillis: 2400,
  success: true,
  lastEventCue: "score",
  lastEventMessage: "Punto para azul",
  players: [
    { index: 0, label: "Rojo", color: redColor2, score: 2, lives: -1 },
    { index: 1, label: "Azul", color: blueColor2, score: 3, lives: -1 }
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

// games/pulso/src/index.ts
var src_exports17 = {};
__export(src_exports17, {
  PlayerDisplay: () => PlayerDisplay16,
  comboFrame: () => comboFrame,
  comboSnapshot: () => comboSnapshot,
  createGame: () => createGame17,
  failedFrame: () => failedFrame4,
  failedSnapshot: () => failedSnapshot4,
  finishedFrame: () => finishedFrame10,
  finishedSnapshot: () => finishedSnapshot12,
  gameFailAnimationMillis: () => gameFailAnimationMillis,
  gameWinAnimationMillis: () => gameWinAnimationMillis4,
  manifest: () => manifest17,
  pulseChart: () => pulseChart,
  pulseDifficultyProfile: () => pulseDifficultyProfile,
  pulsePads: () => pulsePads,
  runningFrame: () => runningFrame15,
  runningSnapshot: () => runningSnapshot15,
  startingEnergy: () => startingEnergy
});

// games/pulso/src/manifest.ts
var manifest17 = {
  id: "pulso",
  label: "Pulso",
  description: "Ritmo cooperativo: pisa cada pulso a tiempo y mant\xE9n la energ\xEDa de la pista.",
  availability: { development: true, production: true },
  catalog: {
    category: "arcade",
    color: "#ff3bd7",
    durationLabel: "35s",
    modeLabel: "Ritmo cooperativo",
    audioLabel: "M\xFAsica y efectos",
    rules: [
      "Pisa la zona cuando el pulso llegue al centro",
      "Completa los acordes entre varios jugadores",
      "Mant\xE9n las notas largas hasta que terminen",
      "No dejes que la energ\xEDa llegue a cero"
    ]
  },
  players: {
    allowAny: true,
    min: 1,
    max: 8
  },
  start: { mode: "player-ready", countdownMillis: 2e3, releaseGraceMillis: 1200 },
  config: {
    difficulty: {
      default: "medium",
      options: ["easy", "medium", "hard", "expert"]
    }
  },
  defaultDurationMillis: 35e3,
  display: {
    entry: "./display"
  },
  preview: {
    seed: 137,
    playerCount: 0,
    difficulty: "medium",
    actions: [
      { atMillis: 100, type: "press", x: 8, y: 16 },
      { atMillis: 2150, type: "release", x: 8, y: 16 }
    ],
    captureStartMillis: 2600,
    frameCount: 24,
    frameIntervalMillis: 90
  },
  tags: ["ritmo", "cooperativo", "multijugador", "typescript"]
};

// games/pulso/src/game.ts
var gameWinAnimationMillis4 = 5e3;
var gameFailAnimationMillis = 5e3;
var startingEnergy = 64;
var backgroundColor6 = "#03020a";
var gridColor = "#09081a";
var readyColor = "#145cff";
var readyPulseColor2 = "#35d7ff";
var successColors4 = ["#35d7ff", "#ff3bd7", "#ffe176", "#5fff9e", "#ffffff"];
var failColors2 = ["#ff3151", "#8d1235", "#280512"];
var readyZone3 = { minX: 5, maxX: 10, minY: 13, maxY: 18 };
var pulsePads = [
  { color: "#35d7ff", label: "Azul", minX: 1, maxX: 6, minY: 4, maxY: 11, x: 3, y: 7 },
  { color: "#ff3bd7", label: "Rosa", minX: 9, maxX: 14, minY: 4, maxY: 11, x: 12, y: 7 },
  { color: "#ffe176", label: "Amarillo", minX: 1, maxX: 6, minY: 20, maxY: 27, x: 3, y: 23 },
  { color: "#5fff9e", label: "Verde", minX: 9, maxX: 14, minY: 20, maxY: 27, x: 12, y: 23 }
];
var profiles = {
  easy: { energyGain: 8, energyLoss: 9, spacingMillis: 1350, timingWindowMillis: 600 },
  medium: { energyGain: 7, energyLoss: 11, spacingMillis: 1150, timingWindowMillis: 460 },
  hard: { energyGain: 6, energyLoss: 13, spacingMillis: 980, timingWindowMillis: 350 },
  expert: { energyGain: 5, energyLoss: 15, spacingMillis: 820, timingWindowMillis: 270 }
};
var notePattern = [
  { zones: [0] },
  { zones: [1] },
  { zones: [2] },
  { zones: [3] },
  { zones: [0, 3] },
  { zones: [1] },
  { zones: [2], holdBeats: 0.75 },
  { zones: [0] },
  { zones: [1, 2] },
  { zones: [3] },
  { zones: [0] },
  { zones: [1], holdBeats: 0.8 },
  { zones: [2, 3] },
  { zones: [0] },
  { zones: [3] },
  { zones: [0, 1] },
  { zones: [2] },
  { zones: [3], holdBeats: 0.75 },
  { zones: [0, 2] },
  { zones: [1, 3] }
];
function pulseChart(difficulty = "medium") {
  const profile2 = profiles[difficulty] ?? profiles.medium;
  return notePattern.map((entry, index) => ({
    atMillis: 1200 + index * profile2.spacingMillis,
    holdMillis: Math.round((entry.holdBeats ?? 0) * profile2.spacingMillis),
    zones: [...entry.zones]
  }));
}
function pulseDifficultyProfile(difficulty) {
  return { ...profiles[difficulty] ?? profiles.medium };
}
function createGame17(config) {
  return new PulseGame(config);
}
var PulseGame = class {
  chart = [];
  combo = 0;
  config;
  energy = startingEnergy;
  finishedAtMillis = 0;
  hitZones = /* @__PURE__ */ new Set();
  heldZones = /* @__PURE__ */ new Set();
  lastEvent = gameEvent("none", "La pista est\xE1 lista", 0);
  maxCombo = 0;
  nowMillis = 0;
  noteIndex = 0;
  phase = "ready";
  players = [];
  readyGate;
  resolvedNotes = 0;
  startedAtMillis = 0;
  successfulNotes = 0;
  success = false;
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest17);
    this.readyGate = createPlayerReadyGate(manifest17.start, [readyZone3], this.config.nowMillis);
    this.resetState(this.config.nowMillis);
  }
  init(nowMillis) {
    this.resetState(nowMillis);
    this.phase = "waiting";
    this.lastEvent = gameEvent("ready", "Entra en el centro para iniciar", nowMillis);
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
    const zone = this.zoneAt(event.x, event.y);
    if (zone === -1) {
      return [];
    }
    this.heldZones.add(zone);
    const note = this.chart[this.noteIndex];
    if (!note || !note.zones.includes(zone)) {
      return [];
    }
    const delta = Math.abs(this.elapsedMillis() - note.atMillis);
    if (delta > this.profile().timingWindowMillis) {
      return [];
    }
    this.hitZones.add(zone);
    if (note.holdMillis > 0) {
      this.lastEvent = gameEvent("hold", `Mant\xE9n ${pulsePads[zone].label.toLowerCase()}`, event.atMillis);
      return [this.lastEvent];
    }
    if (note.zones.every((requiredZone) => this.hitZones.has(requiredZone))) {
      return this.completeNote(event.atMillis);
    }
    this.lastEvent = gameEvent("hit", "Completa el acorde", event.atMillis);
    return [this.lastEvent];
  }
  release(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.update({ ...event, pressed: false }), event.atMillis);
    }
    const zone = this.zoneAt(event.x, event.y);
    if (zone >= 0) {
      this.heldZones.delete(zone);
    }
    if (this.phase !== "running") {
      return [];
    }
    const note = this.chart[this.noteIndex];
    if (note?.holdMillis && note.zones.includes(zone) && this.hitZones.has(zone)) {
      return this.missNote(event.atMillis, "Nota larga soltada demasiado pronto");
    }
    return [];
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.tick(event.atMillis), event.atMillis);
    }
    if (this.phase === "finished") {
      const resultMillis = this.success ? gameWinAnimationMillis4 : gameFailAnimationMillis;
      if (event.atMillis - this.finishedAtMillis >= resultMillis) {
        this.resetState(event.atMillis);
        this.phase = "waiting";
        this.lastEvent = gameEvent("ready", "Entra en el centro para iniciar", event.atMillis);
        return [this.lastEvent];
      }
      return [];
    }
    if (this.phase !== "running") {
      return [];
    }
    if (this.elapsedMillis() >= this.config.durationMillis) {
      return this.finish(false, event.atMillis, "La energ\xEDa no lleg\xF3 al final");
    }
    const note = this.chart[this.noteIndex];
    if (!note) {
      return this.finish(this.energy > 0, event.atMillis, "Pista completada");
    }
    if (note.holdMillis > 0 && note.zones.every((zone) => this.hitZones.has(zone) && this.heldZones.has(zone))) {
      if (this.elapsedMillis() >= note.atMillis + note.holdMillis) {
        return this.completeNote(event.atMillis);
      }
    }
    if (this.elapsedMillis() > note.atMillis + this.profile().timingWindowMillis) {
      return this.missNote(event.atMillis, "Pulso perdido");
    }
    return [];
  }
  render() {
    const frame = createFrame(backgroundColor6);
    for (let y = 0; y < FLOOR_ROWS; y += 4) {
      fillFrameRect(frame, 0, y, FLOOR_COLS - 1, y, gridColor);
    }
    for (let x = 0; x < FLOOR_COLS; x += 4) {
      fillFrameRect(frame, x, 0, x, FLOOR_ROWS - 1, gridColor);
    }
    if (this.phase === "waiting" || this.phase === "starting") {
      fillFrameRect(frame, readyZone3.minX, readyZone3.minY, readyZone3.maxX, readyZone3.maxY, readyColor);
      const radius = 1 + Math.floor(this.nowMillis / 160) % 7;
      paintDiamondRing(frame, {
        centerX: 8,
        centerY: 16,
        color: this.phase === "starting" ? "#ffe176" : readyPulseColor2,
        radius
      });
      return frame;
    }
    if (this.phase === "finished") {
      this.paintResult(frame);
      return frame;
    }
    for (const pad of pulsePads) {
      fillFrameRect(frame, pad.minX, pad.minY, pad.maxX, pad.maxY, "#101025");
      paintFrameCell(frame, pad.x, pad.y, pad.color);
    }
    const note = this.chart[this.noteIndex];
    if (note) {
      const untilBeat = note.atMillis - this.elapsedMillis();
      const visibleMillis = this.profile().spacingMillis;
      const progress = Math.max(0, Math.min(1, 1 - untilBeat / visibleMillis));
      const radius = Math.max(1, Math.round(7 * (1 - progress)));
      for (const zone of note.zones) {
        const pad = pulsePads[zone];
        fillFrameRect(frame, pad.minX, pad.minY, pad.maxX, pad.maxY, this.hitZones.has(zone) ? "#ffffff" : "#18183a");
        paintDiamondRing(frame, { centerX: pad.x, centerY: pad.y, color: pad.color, radius });
        paintFrameCell(frame, pad.x, pad.y, pad.color);
      }
    }
    const progressCells = Math.round(this.noteIndex / this.chart.length * FLOOR_COLS);
    for (let x = 0; x < progressCells; x += 1) {
      paintFrameCell(frame, x, FLOOR_ROWS - 1, successColors4[x % successColors4.length]);
    }
    return frame;
  }
  snapshot() {
    const readyState = this.readyGate.state(this.nowMillis);
    const note = this.chart[this.noteIndex];
    const noteProgress = note ? Math.max(0, Math.min(1, 1 - (note.atMillis - this.elapsedMillis()) / this.profile().spacingMillis)) : 1;
    return {
      currentGame: manifest17.id,
      label: manifest17.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: this.players,
      score: this.successfulNotes,
      lives: -1,
      elapsedMillis: this.elapsedMillis(),
      remainingMillis: this.remainingMillis(),
      activeTargets: this.phase === "running" && note ? note.zones.length : 0,
      success: this.success,
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? readyState.countdownMillis : 0,
      readyPlayers: readyState.readyPlayers,
      requiredPlayers: readyState.requiredPlayers,
      matchTarget: this.chart.length,
      accuracy: this.resolvedNotes === 0 ? 100 : Math.round(this.successfulNotes / this.resolvedNotes * 100),
      celebrating: this.phase === "finished",
      combo: this.combo,
      energy: this.energy,
      hitZones: [...this.hitZones],
      maxCombo: this.maxCombo,
      noteCount: this.chart.length,
      noteIndex: this.noteIndex,
      noteKind: note?.holdMillis ? "hold" : (note?.zones.length ?? 0) > 1 ? "chord" : "tap",
      noteProgress,
      noteZones: note ? [...note.zones] : [],
      section: Math.min(4, Math.floor(this.noteIndex / this.chart.length * 4) + 1),
      timingWindowMillis: this.profile().timingWindowMillis
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest17);
    this.readyGate = createPlayerReadyGate(manifest17.start, [readyZone3], this.config.nowMillis);
    this.resetState(this.config.nowMillis);
    this.phase = "waiting";
    this.lastEvent = gameEvent("ready", "Entra en el centro para iniciar", this.config.nowMillis);
  }
  applyReadyTransition(transition, nowMillis) {
    if (transition === "players-ready") {
      this.phase = "starting";
      this.lastEvent = gameEvent("ready", "Ritmo preparado", nowMillis);
      return [this.lastEvent];
    }
    if (transition === "players-left") {
      this.phase = "waiting";
      this.lastEvent = gameEvent("ready", "Vuelve al centro", nowMillis);
      return [this.lastEvent];
    }
    if (transition === "started") {
      this.phase = "running";
      this.startedAtMillis = nowMillis;
      this.heldZones.clear();
      this.lastEvent = gameEvent("start", "Sigue el primer pulso", nowMillis);
      return [this.lastEvent];
    }
    return [];
  }
  completeNote(atMillis) {
    const note = this.chart[this.noteIndex];
    if (!note) {
      return [];
    }
    this.successfulNotes += 1;
    this.resolvedNotes += 1;
    this.combo += 1;
    this.maxCombo = Math.max(this.maxCombo, this.combo);
    this.energy = Math.min(100, this.energy + this.profile().energyGain + Math.max(0, note.zones.length - 1) * 2);
    this.noteIndex += 1;
    this.hitZones.clear();
    this.players = this.scoredPlayers();
    this.lastEvent = gameEvent("hit", this.combo >= 4 ? `\xA1Combo x${this.combo}!` : "Pulso perfecto", atMillis);
    if (this.noteIndex >= this.chart.length) {
      return this.finish(true, atMillis, "Pista completada");
    }
    return [this.lastEvent];
  }
  missNote(atMillis, message) {
    this.resolvedNotes += 1;
    this.combo = 0;
    this.energy = Math.max(0, this.energy - this.profile().energyLoss);
    this.noteIndex += 1;
    this.hitZones.clear();
    this.players = this.scoredPlayers();
    this.lastEvent = gameEvent("miss", message, atMillis);
    if (this.energy === 0) {
      return this.finish(false, atMillis, "La pista se qued\xF3 sin energ\xEDa");
    }
    if (this.noteIndex >= this.chart.length) {
      return this.finish(true, atMillis, "Pista completada");
    }
    return [this.lastEvent];
  }
  finish(success, atMillis, message) {
    this.phase = "finished";
    this.success = success;
    this.finishedAtMillis = atMillis;
    this.hitZones.clear();
    this.heldZones.clear();
    this.lastEvent = gameEvent(success ? "win" : "fail", message, atMillis);
    return [this.lastEvent];
  }
  paintResult(frame) {
    const elapsed = Math.max(0, this.nowMillis - this.finishedAtMillis);
    if (this.success) {
      paintDiamondWave(frame, {
        centerX: 8,
        centerY: 16,
        color: ({ distance, step }) => successColors4[(distance + step) % successColors4.length],
        period: 8,
        bandWidth: 5,
        step: Math.floor(elapsed / 90)
      });
      return;
    }
    const color = failColors2[Math.floor(elapsed / 180) % failColors2.length];
    fillFrameRect(frame, 0, 0, FLOOR_COLS - 1, FLOOR_ROWS - 1, color);
    const radius = 2 + Math.floor(elapsed / 120) % 12;
    paintDiamondRing(frame, { centerX: 8, centerY: 16, color: "#ff3151", radius });
  }
  zoneAt(x, y) {
    return pulsePads.findIndex((pad) => x >= pad.minX && x <= pad.maxX && y >= pad.minY && y <= pad.maxY);
  }
  profile() {
    return profiles[this.config.difficulty] ?? profiles.medium;
  }
  elapsedMillis() {
    if (this.phase === "waiting" || this.phase === "starting" || this.phase === "ready") {
      return 0;
    }
    return Math.max(0, this.nowMillis - this.startedAtMillis);
  }
  remainingMillis() {
    return Math.max(0, this.config.durationMillis - this.elapsedMillis());
  }
  scoredPlayers() {
    return defaultPlayers(this.config.playerCount, this.config.players).map((player) => ({
      ...player,
      label: player.label || `Jugador ${player.index + 1}`,
      score: this.successfulNotes,
      lives: -1
    }));
  }
  resetState(nowMillis) {
    this.chart = pulseChart(this.config.difficulty);
    this.combo = 0;
    this.energy = startingEnergy;
    this.finishedAtMillis = 0;
    this.hitZones.clear();
    this.heldZones.clear();
    this.maxCombo = 0;
    this.noteIndex = 0;
    this.nowMillis = nowMillis;
    this.phase = "ready";
    this.readyGate.reset(nowMillis);
    this.resolvedNotes = 0;
    this.startedAtMillis = nowMillis;
    this.success = false;
    this.successfulNotes = 0;
    this.players = this.scoredPlayers();
  }
};

// games/pulso/src/display.tsx
var import_jsx_runtime19 = __toESM(require_jsx_runtime(), 1);
var pulsoStyles = `
.pulso-display { --pulso-energy:#5fff9e; background:radial-gradient(circle at 50% 42%,rgba(255,59,215,.18),transparent 34%),linear-gradient(145deg,#050410,#0a071b 52%,#03040d); display:grid; gap:22px; grid-template-columns:minmax(0,1fr) 430px; grid-template-rows:minmax(0,1fr) auto; inset:0; overflow:hidden; padding:32px 38px 28px; position:absolute; }
.pulso-stage { align-content:center; display:grid; justify-items:center; min-width:0; position:relative; }
.pulso-beat { align-items:center; aspect-ratio:1; background:radial-gradient(circle,rgba(255,255,255,.12),rgba(255,59,215,.08) 46%,transparent 70%); border:5px solid rgba(255,255,255,.14); border-radius:50%; box-shadow:0 0 80px rgba(255,59,215,.2),inset 0 0 60px rgba(53,215,255,.1); display:flex; flex-direction:column; justify-content:center; position:relative; width:min(50vh,560px); }
.pulso-beat::before { border:7px solid rgba(255,255,255,.82); border-radius:50%; content:""; inset:calc(7% + var(--pulso-note-progress)*36%); opacity:calc(.28 + var(--pulso-note-progress)*.72); position:absolute; }
.pulso-beat small { color:#a9abc4; font-size:22px; font-weight:900; letter-spacing:.14em; text-transform:uppercase; }
.pulso-beat strong { color:#fff; font-size:clamp(100px,8vw,150px); letter-spacing:-.09em; line-height:.9; margin:13px 0 5px; text-shadow:0 0 35px rgba(255,59,215,.5); }
.pulso-beat span { color:#ffd9f8; font-size:28px; font-weight:900; }
.pulso-pads { display:grid; gap:14px; grid-template-columns:repeat(2,1fr); width:min(66vw,740px); }
.pulso-pad { align-items:center; background:rgba(15,15,37,.82); border:3px solid rgba(255,255,255,.08); border-radius:18px; display:flex; min-height:74px; opacity:.44; padding:12px 18px; transition:.14s ease; }
.pulso-pad i { background:var(--pulso-pad); border-radius:10px; box-shadow:0 0 24px var(--pulso-pad); height:32px; margin-right:15px; width:32px; }
.pulso-pad strong { color:#fff; font-size:24px; }
.pulso-pad.is-active { border-color:var(--pulso-pad); box-shadow:0 0 30px color-mix(in srgb,var(--pulso-pad) 38%,transparent); opacity:1; transform:scale(1.025); }
.pulso-pad.is-hit { background:rgba(255,255,255,.2); }
.pulso-sidebar { align-content:center; display:grid; gap:16px; min-width:0; }
.pulso-metric { background:rgba(12,12,31,.88); border:1px solid rgba(255,255,255,.11); border-radius:20px; display:grid; gap:7px; padding:18px 22px; }
.pulso-metric span { color:#9c9db8; font-size:18px; font-weight:900; letter-spacing:.1em; text-transform:uppercase; }
.pulso-metric strong { color:#fff; font-size:50px; line-height:1; }
.pulso-energy { overflow:hidden; position:relative; }
.pulso-energy::after { background:linear-gradient(90deg,#ff3151,#ffe176 45%,#5fff9e); bottom:0; content:""; height:8px; left:0; position:absolute; width:var(--pulso-energy-width); }
.pulso-energy strong { color:var(--pulso-energy); }
.pulso-sidebar-row { display:grid; gap:16px; grid-template-columns:1fr 1fr; }
.pulso-sidebar-row .pulso-metric strong { font-size:38px; }
.pulso-event { background:rgba(255,59,215,.11); border:1px solid rgba(255,59,215,.34); border-radius:20px; color:#fff; font-size:25px; font-weight:900; min-height:72px; padding:19px 22px; }
.pulso-footer { align-items:center; background:rgba(5,5,16,.9); border:1px solid rgba(255,255,255,.1); border-radius:17px; display:grid; gap:18px; grid-column:1/-1; grid-template-columns:auto 1fr auto; padding:14px 20px; }
.pulso-footer span,.pulso-footer b { color:#a9abc4; font-size:19px; }
.pulso-progress { background:#17172a; border-radius:999px; height:15px; overflow:hidden; }
.pulso-progress i { background:linear-gradient(90deg,#35d7ff,#ff3bd7,#ffe176,#5fff9e); display:block; height:100%; width:var(--pulso-track-progress); }
.pulso-result { align-content:center; background:#07040f; display:grid; inset:0; justify-items:center; position:absolute; z-index:5; }
.pulso-result strong { color:#fff; font-size:clamp(74px,7vw,126px); line-height:.95; text-align:center; }
.pulso-result span { color:#ff9bea; font-size:29px; font-weight:900; margin-top:20px; text-transform:uppercase; }
.pulso-result.is-win { animation:pulsoWin 1.1s linear infinite; background:linear-gradient(115deg,#050611,#123044,#422348,#3b3521,#050611); background-size:240% 100%; }
.pulso-result.is-fail strong { color:#ff6a82; }
.pulso-display.is-running .pulso-beat { animation:pulsoBeat .58s ease-in-out infinite alternate; }
@keyframes pulsoBeat { from { box-shadow:0 0 60px rgba(255,59,215,.14),inset 0 0 40px rgba(53,215,255,.08); } to { box-shadow:0 0 105px rgba(255,59,215,.3),inset 0 0 75px rgba(53,215,255,.16); } }
@keyframes pulsoWin { from { background-position:0 0; } to { background-position:100% 0; } }
@media (prefers-reduced-motion:reduce) { .pulso-display *, .pulso-display *::before, .pulso-display *::after { animation:none!important; transition:none!important; } }
`;
function PlayerDisplay16({ snapshot }) {
  const phaseClass = snapshot.phase === "finished" ? "finished" : snapshot.phase;
  const energyColor = snapshot.energy > 55 ? "#5fff9e" : snapshot.energy > 25 ? "#ffe176" : "#ff3151";
  const style = {
    "--pulso-energy": energyColor,
    "--pulso-energy-width": `${snapshot.energy}%`,
    "--pulso-note-progress": snapshot.noteProgress,
    "--pulso-track-progress": `${snapshot.noteIndex / Math.max(snapshot.noteCount, 1) * 100}%`
  };
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(GameDisplayShell, { title: snapshot.label, phase: phaseClass, children: /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: `pulso-display is-${snapshot.phase}`, style, children: [
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("style", { children: pulsoStyles }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(PlayerReadyOverlay, { snapshot }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("section", { className: "pulso-stage", children: [
      /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "pulso-beat", children: [
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("small", { children: noteLabel(snapshot) }),
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("strong", { children: snapshot.combo > 0 ? `x${snapshot.combo}` : "0" }),
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { children: snapshot.combo > 0 ? "combo" : "busca el pulso" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: "pulso-pads", children: pulsePads.map((pad, index) => {
        const active = snapshot.noteZones.includes(index);
        const hit = snapshot.hitZones.includes(index);
        return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("article", { className: `pulso-pad${active ? " is-active" : ""}${hit ? " is-hit" : ""}`, style: { "--pulso-pad": pad.color }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("i", {}),
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("strong", { children: pad.label })
        ] }, pad.label);
      }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("aside", { className: "pulso-sidebar", children: [
      /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("article", { className: "pulso-metric pulso-energy", children: [
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { children: "Energ\xEDa" }),
        /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("strong", { children: [
          snapshot.energy,
          "%"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("article", { className: "pulso-metric", children: [
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { children: "Precisi\xF3n" }),
        /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("strong", { children: [
          snapshot.accuracy,
          "%"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "pulso-sidebar-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("article", { className: "pulso-metric", children: [
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { children: "Secci\xF3n" }),
          /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("strong", { children: [
            snapshot.section,
            "/4"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("article", { className: "pulso-metric", children: [
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { children: "Tiempo" }),
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("strong", { children: formatClock(snapshot.remainingMillis) })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: "pulso-event", children: snapshot.lastEventMessage || "La pista est\xE1 lista" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("footer", { className: "pulso-footer", children: [
      /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { children: "Pista" }),
      /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: "pulso-progress", children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("i", {}) }),
      /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("b", { children: [
        snapshot.noteIndex,
        "/",
        snapshot.noteCount
      ] })
    ] }),
    snapshot.phase === "finished" ? /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: `pulso-result ${snapshot.success ? "is-win" : "is-fail"}`, children: [
      /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("strong", { children: snapshot.success ? "\xA1Pista completada!" : "Sin energ\xEDa" }),
      /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { children: snapshot.success ? `Combo m\xE1ximo x${snapshot.maxCombo} \xB7 Precisi\xF3n ${snapshot.accuracy}%` : "Recupera el ritmo y vuelve a intentarlo" })
    ] }) : null
  ] }) });
}
function noteLabel(snapshot) {
  if (snapshot.phase === "waiting") return "Pista preparada";
  if (snapshot.phase === "starting") return "Todos listos";
  if (snapshot.noteKind === "hold") return "Mant\xE9n la zona";
  if (snapshot.noteKind === "chord") return "Acorde simult\xE1neo";
  return "Siguiente pulso";
}

// games/pulso/src/fixtures.ts
function startedGame3() {
  const game8 = createGame17({ playerCount: 0, durationMillis: manifest17.defaultDurationMillis, difficulty: "medium" });
  game8.init(0);
  game8.press({ x: 8, y: 16, pressed: true, atMillis: 100 });
  game8.tick({ atMillis: 2100 });
  return game8;
}
var runningGame8 = startedGame3();
runningGame8.tick({ atMillis: 2100 + 1200 });
var runningFrame15 = runningGame8.render();
var runningSnapshot15 = runningGame8.snapshot();
var comboGame = startedGame3();
var comboChart = pulseChart();
for (const note of comboChart.slice(0, 7)) {
  for (const zone of note.zones) {
    const pad = pulsePads[zone];
    comboGame.press({ x: pad.x, y: pad.y, pressed: true, atMillis: 2100 + note.atMillis });
  }
  if (note.holdMillis > 0) {
    comboGame.tick({ atMillis: 2100 + note.atMillis + note.holdMillis });
  }
}
var comboFrame = comboGame.render();
var comboSnapshot = comboGame.snapshot();
var failedGame3 = startedGame3();
var profile = pulseDifficultyProfile("medium");
for (const note of pulseChart().slice(0, 6)) {
  failedGame3.tick({ atMillis: 2100 + note.atMillis + profile.timingWindowMillis + 1 });
}
var failedFrame4 = failedGame3.render();
var failedSnapshot4 = failedGame3.snapshot();
var finishedGame6 = startedGame3();
for (const note of pulseChart()) {
  for (const zone of note.zones) {
    const pad = pulsePads[zone];
    finishedGame6.press({ x: pad.x, y: pad.y, pressed: true, atMillis: 2100 + note.atMillis });
  }
  if (note.holdMillis > 0) {
    finishedGame6.tick({ atMillis: 2100 + note.atMillis + note.holdMillis });
  }
}
var finishedFrame10 = finishedGame6.render();
var finishedSnapshot12 = finishedGame6.snapshot();

// games/saltos/src/index.ts
var src_exports18 = {};
__export(src_exports18, {
  PlayerDisplay: () => PlayerDisplay17,
  createGame: () => createGame18,
  finishedFrame: () => finishedFrame11,
  finishedSnapshot: () => finishedSnapshot13,
  initEvents: () => initEvents9,
  manifest: () => manifest18,
  runningFrame: () => runningFrame16,
  runningSnapshot: () => runningSnapshot16,
  saltosCelebrationMillis: () => saltosCelebrationMillis,
  saltosStartingLives: () => saltosStartingLives,
  startingSnapshot: () => startingSnapshot7,
  waitingFrame: () => waitingFrame4,
  waitingSnapshot: () => waitingSnapshot9
});

// games/saltos/src/display.tsx
var import_jsx_runtime20 = __toESM(require_jsx_runtime(), 1);
function PlayerDisplay17({ snapshot, frame }) {
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(GameDisplayShell, { title: snapshot.label, phase: snapshot.phase, children: /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "ml-solo-display", children: [
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(PlayerReadyOverlay, { snapshot }),
    /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "ml-solo-summary", children: [
      /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(MetricRow, { columns: 3, className: "ml-solo-number-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(MetricPanel, { label: "Saltos", tone: "green", value: snapshot.score }),
        /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(MetricPanel, { label: "Tiempo", tone: "cyan", value: formatClock(snapshot.remainingMillis) }),
        /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(MetricPanel, { label: "Vida", tone: "red", value: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(LivesMeter, { lives: snapshot.lives, maxLives: snapshot.maxLives }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(MetricPanel, { className: "ml-solo-message", label: "Objetivo", tone: snapshot.success ? "green" : "yellow", value: snapshot.lastEventMessage || "Salta del azul al verde" })
    ] }),
    frame ? /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(FramePreviewPanel, { className: "ml-solo-floor", frame, label: "Juego en el suelo" }) : null
  ] }) });
}

// games/saltos/src/manifest.ts
var manifest18 = {
  id: "saltos",
  label: "Saltos",
  description: "Salta entre plataformas seguras sin tocar la lava durante un minuto.",
  availability: { development: true, production: true },
  catalog: {
    category: "individual",
    color: "#ff9f45",
    durationLabel: "60s",
    modeLabel: "Saltos",
    audioLabel: "M\xFAsica + efectos",
    rules: ["Espera en la plataforma azul", "Salta a la plataforma verde", "No pises la lava"]
  },
  players: { allowAny: true, min: 1, max: 1 },
  start: { mode: "player-ready" },
  defaultDurationMillis: 6e4,
  config: { difficulty: { options: ["easy", "medium", "hard"], default: "medium" } },
  display: { entry: "./display" },
  preview: {
    seed: 137,
    playerCount: 0,
    actions: [{ atMillis: 100, type: "press", x: 8, y: 4 }],
    captureStartMillis: 2300,
    frameCount: 24,
    frameIntervalMillis: 120
  },
  tags: ["saltos", "lava", "typescript"]
};

// games/saltos/src/game.ts
var saltosCelebrationMillis = 5e3;
var saltosStartingLives = 1;
var startPlatform = { x: 7, y: 3 };
var platformSize = 3;
function createGame18(config) {
  return new SaltosGame(config);
}
var SaltosGame = class {
  config;
  current = startPlatform;
  finishedAtMillis;
  lastEvent = gameEvent("none", "Listo", 0);
  lives = saltosStartingLives;
  nowMillis = 0;
  phase = "ready";
  players;
  readyGate;
  rng;
  score = 0;
  startedAtMillis = 0;
  target = startPlatform;
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest18);
    this.readyGate = createPlayerReadyGate(manifest18.start, [{ minX: 5, maxX: 10, minY: 0, maxY: 7 }], this.config.nowMillis);
    this.rng = createSeededRng(this.config.seed);
    this.players = this.scoredPlayers();
    this.target = this.nextTarget(this.current);
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
    if (this.phase !== "running" || !event.pressed) return [];
    if (insidePlatform(event, this.current)) return [];
    if (!insidePlatform(event, this.target)) {
      this.lives = 0;
      return this.finish(false, "Has pisado lava", event.atMillis);
    }
    this.current = this.target;
    this.score += 1;
    this.players = this.scoredPlayers();
    this.target = this.nextTarget(this.current);
    this.lastEvent = gameEvent("coin", `Salto ${this.score}`, event.atMillis);
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
      if (event.atMillis - (this.finishedAtMillis ?? event.atMillis) >= saltosCelebrationMillis) {
        this.resetState(event.atMillis);
        return [this.lastEvent];
      }
      return [];
    }
    if (this.phase === "running" && this.remainingMillis() === 0) {
      return this.finish(true, `${this.score} saltos completados`, event.atMillis);
    }
    return [];
  }
  render() {
    const frame = createFrame("#170408");
    if (this.phase === "waiting" || this.phase === "starting") {
      const step = Math.floor(this.nowMillis / (this.phase === "starting" ? 100 : 180));
      paintDiamondRing(frame, { centerX: 8, centerY: 4, radius: 2 + step % 5, color: this.phase === "starting" ? "#ffe176" : "#1677ff" });
      return frame;
    }
    this.paintLava(frame);
    fillFrameRect(frame, this.current.x, this.current.y, platformSize, platformSize, "#1677ff");
    if (this.phase === "running") {
      fillFrameRect(frame, this.target.x, this.target.y, platformSize, platformSize, "#38e86b");
      paintFrameCell(frame, this.target.x + 1, this.target.y + 1, "#ffffff");
    } else {
      paintDiamondWave(frame, { color: this.lives > 0 ? "#38e86b" : "#ff263d", step: Math.floor((this.nowMillis - (this.finishedAtMillis ?? this.nowMillis)) / 140) });
    }
    return frame;
  }
  snapshot() {
    const ready = this.readyGate.state(this.nowMillis);
    return {
      currentGame: manifest18.id,
      label: manifest18.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: this.players,
      score: this.score,
      lives: this.lives,
      maxLives: saltosStartingLives,
      elapsedMillis: this.elapsedMillis(),
      remainingMillis: this.remainingMillis(),
      activeTargets: this.phase === "running" ? 1 : 0,
      success: this.phase === "finished" && this.lives > 0,
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? ready.countdownMillis : 0,
      readyPlayers: ready.readyPlayers,
      requiredPlayers: ready.requiredPlayers,
      currentPlatform: { ...this.current },
      targetPlatform: this.phase === "running" ? { ...this.target } : void 0,
      celebrationMillis: this.phase === "finished" ? Math.max(0, saltosCelebrationMillis - (this.nowMillis - (this.finishedAtMillis ?? this.nowMillis))) : 0
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest18);
    this.resetState(this.config.nowMillis);
  }
  applyReadyTransition(transition, nowMillis) {
    if (transition === "players-ready") {
      this.phase = "starting";
      this.lastEvent = gameEvent("ready", "Jugador listo", nowMillis);
    } else if (transition === "players-left") {
      this.phase = "waiting";
      this.lastEvent = gameEvent("ready", "Vuelve a la plataforma azul", nowMillis);
    } else if (transition === "started") {
      this.phase = "running";
      this.startedAtMillis = nowMillis;
      this.lastEvent = gameEvent("start", "Salta del azul al verde", nowMillis);
    } else return [];
    return [this.lastEvent];
  }
  elapsedMillis() {
    if (this.phase === "waiting" || this.phase === "starting") return 0;
    const end = this.finishedAtMillis ?? this.nowMillis;
    return Math.max(0, end - this.startedAtMillis);
  }
  finish(success, message, atMillis) {
    this.phase = "finished";
    this.finishedAtMillis = atMillis;
    this.lastEvent = gameEvent(success ? "win" : "damage", message, atMillis);
    return [this.lastEvent];
  }
  nextTarget(from) {
    for (let attempt = 0; attempt < 20; attempt += 1) {
      const candidate = {
        x: this.rng.range(0, FLOOR_COLS - platformSize),
        y: this.rng.range(0, FLOOR_ROWS - platformSize)
      };
      if (Math.abs(candidate.x - from.x) + Math.abs(candidate.y - from.y) >= 7) return candidate;
    }
    return { x: from.x < 8 ? 12 : 1, y: from.y < 16 ? 25 : 3 };
  }
  paintLava(frame) {
    const pulse = Math.floor(this.nowMillis / 180);
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      for (let x = 0; x < FLOOR_COLS; x += 1) {
        paintFrameCell(frame, x, y, (x * 3 + y + pulse) % 11 < 2 ? "#ff5a1f" : "#b20d21");
      }
    }
  }
  resetState(nowMillis) {
    this.readyGate.reset(nowMillis);
    this.rng = createSeededRng(this.config.seed);
    this.current = { ...startPlatform };
    this.target = this.nextTarget(this.current);
    this.finishedAtMillis = void 0;
    this.lastEvent = gameEvent("ready", "Espera en la plataforma azul", nowMillis);
    this.lives = saltosStartingLives;
    this.nowMillis = nowMillis;
    this.phase = "waiting";
    this.score = 0;
    this.startedAtMillis = nowMillis;
    this.players = this.scoredPlayers();
  }
  remainingMillis() {
    return Math.max(0, this.config.durationMillis - this.elapsedMillis());
  }
  scoredPlayers() {
    return defaultPlayers(this.config.playerCount, this.config.players).map((player) => ({ ...player, score: this.score, lives: this.lives }));
  }
};
function insidePlatform(point, platform) {
  return point.x >= platform.x && point.x < platform.x + platformSize && point.y >= platform.y && point.y < platform.y + platformSize;
}

// games/saltos/src/fixtures.ts
var game6 = createGame18({ playerCount: 0, durationMillis: manifest18.defaultDurationMillis, seed: 137 });
var initEvents9 = game6.init(0);
var waitingFrame4 = game6.render();
var waitingSnapshot9 = game6.snapshot();
game6.press({ x: 8, y: 4, pressed: true, atMillis: 100 });
var startingSnapshot7 = game6.snapshot();
game6.tick({ atMillis: 2100 });
var runningFrame16 = game6.render();
var runningSnapshot16 = game6.snapshot();
var target = game6.snapshot().targetPlatform;
if (target) game6.press({ ...target, pressed: true, atMillis: 2200 });
game6.tick({ atMillis: 62100 });
var finishedFrame11 = game6.render();
var finishedSnapshot13 = game6.snapshot();

// games/suelo-seguro/src/index.ts
var src_exports19 = {};
__export(src_exports19, {
  PlayerDisplay: () => PlayerDisplay18,
  createGame: () => createGame19,
  damagedFrame: () => damagedFrame5,
  damagedSnapshot: () => damagedSnapshot5,
  failedFrame: () => failedFrame5,
  failedSnapshot: () => failedSnapshot5,
  finishedFrame: () => finishedFrame12,
  finishedSnapshot: () => finishedSnapshot14,
  manifest: () => manifest19,
  resetSnapshot: () => resetSnapshot,
  roundWinFrame: () => roundWinFrame4,
  roundWinSnapshot: () => roundWinSnapshot4,
  runningFrame: () => runningFrame17,
  runningSnapshot: () => runningSnapshot17,
  sueloSeguroDamageImmunityMillis: () => sueloSeguroDamageImmunityMillis,
  sueloSeguroDepartureGraceMillis: () => sueloSeguroDepartureGraceMillis,
  sueloSeguroDifficultyProfile: () => sueloSeguroDifficultyProfile,
  sueloSeguroGameResultMillis: () => sueloSeguroGameResultMillis,
  sueloSeguroHazardOrigin: () => sueloSeguroHazardOrigin,
  sueloSeguroHazardSize: () => sueloSeguroHazardSize,
  sueloSeguroPlatformAnchors: () => sueloSeguroPlatformAnchors,
  sueloSeguroPlatformSize: () => sueloSeguroPlatformSize,
  sueloSeguroRequiredTransfers: () => sueloSeguroRequiredTransfers,
  sueloSeguroRoundWinMillis: () => sueloSeguroRoundWinMillis,
  sueloSeguroStartingPlatforms: () => sueloSeguroStartingPlatforms,
  sueloSeguroTurnFailMillis: () => sueloSeguroTurnFailMillis
});

// games/suelo-seguro/src/display.tsx
var import_jsx_runtime21 = __toESM(require_jsx_runtime(), 1);
var sueloSeguroStyles = `
.suelo-seguro-display{background:radial-gradient(circle at 50% 42%,rgba(53,215,255,.14),transparent 32%),linear-gradient(145deg,#02070b,#071219 54%,#18050c);display:grid;gap:28px;grid-template-columns:390px minmax(0,1fr) 430px;inset:0;overflow:hidden;padding:34px 40px;position:absolute}
.suelo-seguro-floor{align-content:center;background:rgba(2,8,12,.82);border:1px solid rgba(255,255,255,.11);border-radius:28px;display:grid;justify-items:center;padding:22px}.suelo-seguro-floor>span{color:#9bb1bc;font-size:19px;font-weight:900;letter-spacing:.11em;text-transform:uppercase}.suelo-seguro-floor .ml-floor-preview{height:720px;width:360px}
.suelo-seguro-main{align-content:center;display:grid;gap:24px;min-width:0}.suelo-seguro-turn{background:linear-gradient(145deg,rgba(8,18,26,.96),color-mix(in srgb,var(--active-color) 15%,#071017));border:4px solid var(--active-color);border-radius:30px;box-shadow:0 0 58px color-mix(in srgb,var(--active-color) 28%,transparent);display:grid;gap:15px;justify-items:center;min-height:270px;padding:32px;text-align:center}.suelo-seguro-turn span{color:#b8c8d0;font-size:22px;font-weight:900;letter-spacing:.11em;text-transform:uppercase}.suelo-seguro-turn strong{color:#fff;font-size:clamp(52px,4.1vw,78px);line-height:1;white-space:normal}.suelo-seguro-turn b{color:var(--active-color);font-size:30px;line-height:1.15;white-space:normal}
.suelo-seguro-turn-clock{background:#111d22;border-radius:999px;height:18px;overflow:hidden;width:100%}.suelo-seguro-turn-clock i{background:linear-gradient(90deg,#ff183d,#ffe176,var(--active-color));display:block;height:100%;transition:width .1s linear;width:var(--turn-progress)}
.suelo-seguro-players{display:grid;gap:12px;grid-template-columns:repeat(var(--player-columns),minmax(0,1fr))}.suelo-seguro-player{align-items:center;background:rgba(7,16,23,.9);border:2px solid color-mix(in srgb,var(--player-color) 35%,transparent);border-radius:18px;display:grid;gap:7px;grid-template-columns:13px minmax(0,1fr);padding:12px 16px}.suelo-seguro-player.is-active{background:color-mix(in srgb,var(--player-color) 18%,#071017);border-color:var(--player-color);box-shadow:0 0 24px color-mix(in srgb,var(--player-color) 25%,transparent)}.suelo-seguro-player i{background:var(--player-color);border-radius:5px;box-shadow:0 0 13px var(--player-color);grid-row:1/3;height:38px}.suelo-seguro-player span{color:#fff;font-size:19px;font-weight:900;line-height:1.05;min-width:0;white-space:normal}.suelo-seguro-player strong{color:var(--player-color);font-size:27px;line-height:1;white-space:normal}
.suelo-seguro-sidebar{align-content:center;display:grid;gap:18px}.suelo-seguro-card{background:rgba(5,14,20,.92);border:1px solid rgba(255,255,255,.12);border-radius:23px;display:grid;gap:10px;padding:22px 25px}.suelo-seguro-card>span{color:#9fb2bc;font-size:19px;font-weight:900;letter-spacing:.1em;text-transform:uppercase}.suelo-seguro-card strong{color:#fff;font-size:60px;line-height:1}.suelo-seguro-card small{color:#9fb2bc;font-size:18px;font-weight:800;line-height:1.25;white-space:normal}.suelo-seguro-lives .ml-lives-meter{justify-content:flex-start}.suelo-seguro-lives .ml-life-heart-glyph{font-size:50px}.suelo-seguro-progress{background:#142229;border-radius:999px;height:14px;overflow:hidden}.suelo-seguro-progress i{background:linear-gradient(90deg,#35d7ff,#5fff9e,#ffe176);display:block;height:100%;width:var(--relay-progress)}.suelo-seguro-event{background:rgba(53,215,255,.08);border:1px solid rgba(53,215,255,.26);border-radius:21px;color:#fff;font-size:25px;font-weight:900;line-height:1.15;min-height:92px;padding:23px;white-space:normal}
.suelo-seguro-result{align-content:center;background:rgba(2,7,11,.95);display:grid;inset:0;justify-items:center;padding:70px;position:absolute;text-align:center;z-index:6}.suelo-seguro-result strong{color:#fff;font-size:clamp(76px,7vw,132px);line-height:.95;white-space:normal}.suelo-seguro-result span{color:#c8dae2;font-size:32px;font-weight:900;margin-top:26px;white-space:normal}.suelo-seguro-result.is-round{animation:sueloRound .7s ease-in-out infinite alternate;background:linear-gradient(120deg,#062135,color-mix(in srgb,var(--active-color) 38%,#07131b),#0a3a29)}.suelo-seguro-result.is-game-fail strong{color:#ff526e}.suelo-seguro-result.is-game-win{animation:sueloWin 1.1s linear infinite;background:linear-gradient(110deg,#06304a,#501448,#6c5c0e,#15573b,#06304a);background-size:260% 100%}
.suelo-seguro-life-lost{align-items:center;animation:sueloLifeLost 1.2s ease-out both;background:rgba(31,8,14,.92);border:1px solid rgba(255,82,110,.55);border-radius:18px;bottom:36px;box-shadow:0 18px 45px rgba(0,0,0,.38);display:flex;gap:14px;left:50%;padding:16px 24px;position:absolute;transform:translateX(-50%);z-index:7}.suelo-seguro-life-lost strong{color:#ff8297;font-size:26px;white-space:normal}.suelo-seguro-life-lost span{color:#d8c2c7;font-size:20px;font-weight:800;white-space:normal}
@keyframes sueloRound{from{filter:saturate(.85);transform:scale(1)}to{filter:saturate(1.35);transform:scale(1.012)}}@keyframes sueloWin{from{background-position:0 0}to{background-position:100% 0}}@keyframes sueloLifeLost{0%{opacity:0;transform:translate(-50%,10px)}16%,78%{opacity:1;transform:translate(-50%,0)}100%{opacity:0;transform:translate(-50%,-4px)}}@media(prefers-reduced-motion:reduce){.suelo-seguro-display *{animation:none!important;transition:none!important}}
`;
function PlayerDisplay18({ snapshot, frame }) {
  const active = snapshot.players[snapshot.activePlayerIndex];
  const turnProgress = snapshot.turnDurationMillis > 0 ? snapshot.turnRemainingMillis / snapshot.turnDurationMillis * 100 : 0;
  const columns = snapshot.playerCount <= 4 ? 2 : snapshot.playerCount <= 6 ? 3 : 4;
  const style = {
    "--active-color": active?.color ?? "#5fff9e",
    "--player-columns": columns,
    "--relay-progress": `${snapshot.completedTransfers / Math.max(snapshot.requiredTransfers, 1) * 100}%`,
    "--turn-progress": `${turnProgress}%`
  };
  const shellPhase = snapshot.phase === "round-win" || snapshot.phase === "turn-fail" ? "running" : snapshot.phase;
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(GameDisplayShell, { title: snapshot.label, phase: shellPhase, children: /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "suelo-seguro-display", style, children: [
    /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("style", { children: sueloSeguroStyles }),
    /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(PlayerReadyOverlay, { snapshot }),
    frame ? /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(FramePreviewPanel, { className: "suelo-seguro-floor", frame, label: "Pista en movimiento" }) : /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", {}),
    /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("main", { className: "suelo-seguro-main", children: [
      /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("section", { className: "suelo-seguro-turn", children: [
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { children: "Turno de" }),
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("strong", { children: snapshot.activePlayerLabel }),
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("b", { children: snapshot.phase === "running" ? "Busca la plataforma de tu color" : "Prep\xE1rate para el siguiente relevo" }),
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "suelo-seguro-turn-clock", children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("i", {}) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("section", { className: "suelo-seguro-players", "aria-label": "Jugadores", children: snapshot.players.map((player) => /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("article", { className: `suelo-seguro-player${player.index === snapshot.activePlayerIndex ? " is-active" : ""}`, style: { "--player-color": player.color }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("i", {}),
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { children: player.label }),
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("strong", { children: player.score > 0 ? formatRelayTime(player.score) : "\u2014" })
      ] }, player.index)) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("aside", { className: "suelo-seguro-sidebar", children: [
      /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("article", { className: "suelo-seguro-card suelo-seguro-lives", children: [
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { children: "Vidas del equipo" }),
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(LivesMeter, { lives: snapshot.lives, maxLives: snapshot.maxLives })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("article", { className: "suelo-seguro-card", children: [
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { children: "Tiempo del equipo" }),
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("strong", { children: formatRelayTime(snapshot.teamTransferMillis) }),
        /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("small", { children: [
          "Menos es mejor \xB7 quedan ",
          formatClock(snapshot.remainingMillis)
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("article", { className: "suelo-seguro-card", children: [
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { children: "Relevos seguros" }),
        /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("strong", { children: [
          snapshot.completedTransfers,
          "/",
          snapshot.requiredTransfers
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "suelo-seguro-progress", children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("i", {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("small", { children: [
          "Mejor relevo: ",
          snapshot.bestTransferMillis === null ? "\u2014" : formatRelayTime(snapshot.bestTransferMillis)
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "suelo-seguro-event", children: snapshot.lastEventMessage || "El suelo est\xE1 preparado" })
    ] }),
    snapshot.phase === "round-win" ? /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Result2, { className: "is-round", title: `\xA1${snapshot.activePlayerLabel} est\xE1 a salvo!`, caption: `Relevo en ${formatRelayTime(snapshot.lastTransferMillis ?? 0)} \xB7 equipo ${formatRelayTime(snapshot.teamTransferMillis)}` }) : null,
    snapshot.lastEventCue === "damage" ? /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "suelo-seguro-life-lost", role: "status", children: [
      /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("strong", { children: "Una vida menos" }),
      /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("span", { children: [
        "Quedan ",
        snapshot.lives,
        " para todo el equipo"
      ] })
    ] }, snapshot.lastEventMessage) : null,
    snapshot.phase === "finished" ? /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Result2, { className: snapshot.success ? "is-game-win" : "is-game-fail", title: snapshot.success ? "\xA1Equipo a salvo!" : "El rojo os alcanz\xF3", caption: snapshot.success ? `${snapshot.completedTransfers} relevos en ${formatRelayTime(snapshot.teamTransferMillis)}` : `${snapshot.completedTransfers} relevos \xB7 ${formatRelayTime(snapshot.teamTransferMillis)}` }) : null
  ] }) });
}
function formatRelayTime(millis) {
  return `${(Math.max(0, millis) / 1e3).toFixed(2).replace(".", ",")} s`;
}
function Result2({ className, title, caption }) {
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: `suelo-seguro-result ${className}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("strong", { children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { children: caption })
  ] });
}

// games/suelo-seguro/src/manifest.ts
var manifest19 = {
  id: "suelo-seguro",
  label: "Suelo Seguro",
  description: "El equipo enlaza refugios de 2\xD72 en el per\xEDmetro, comparte vidas y compite por completar los relevos en el menor tiempo.",
  availability: { development: true, production: true },
  catalog: {
    category: "team",
    color: "#5fff9e",
    durationLabel: "90s",
    modeLabel: "Relevos cooperativos",
    audioLabel: "Efectos",
    rules: [
      "Cada jugador empieza en un refugio de 2\xD72 del per\xEDmetro",
      "Los refugios aparecen separados y siempre en el borde",
      "El tiempo de cada relevo se suma al equipo: menos es mejor",
      "Evitad el bloque rojo de 8\xD78; las vidas son compartidas"
    ]
  },
  players: {
    allowAny: false,
    min: 1,
    max: 8
  },
  start: { mode: "player-ready", countdownMillis: 2e3, releaseGraceMillis: 1500 },
  config: {
    difficulty: {
      default: "medium",
      options: ["easy", "medium", "hard", "expert"]
    }
  },
  defaultDurationMillis: 9e4,
  display: {
    entry: "./display"
  },
  preview: {
    seed: 137,
    playerCount: 4,
    difficulty: "medium",
    actions: [
      { atMillis: 100, type: "press", x: 0, y: 0 },
      { atMillis: 180, type: "press", x: 14, y: 0 },
      { atMillis: 260, type: "press", x: 14, y: 30 },
      { atMillis: 340, type: "press", x: 0, y: 30 },
      { atMillis: 2450, type: "release", x: 0, y: 0 }
    ],
    captureStartMillis: 2700,
    frameCount: 30,
    frameIntervalMillis: 100
  },
  tags: ["plataformas", "cooperativo", "turnos", "reflejos", "multijugador", "typescript"]
};

// games/suelo-seguro/src/game.ts
var sueloSeguroPlatformSize = 2;
var sueloSeguroHazardSize = 8;
var sueloSeguroRoundWinMillis = 1400;
var sueloSeguroTurnFailMillis = 1200;
var sueloSeguroGameResultMillis = 5e3;
var sueloSeguroDamageImmunityMillis = 1100;
var sueloSeguroDepartureGraceMillis = 650;
var difficultyProfiles4 = {
  easy: { hazardStepMillis: 380, lives: 5, turnMillis: 5400 },
  medium: { hazardStepMillis: 310, lives: 4, turnMillis: 4800 },
  hard: { hazardStepMillis: 250, lives: 3, turnMillis: 4200 },
  expert: { hazardStepMillis: 190, lives: 2, turnMillis: 3600 }
};
var backgroundColor7 = "#05080b";
var dangerColor = "#ff183d";
var playerColors2 = [
  "#35d7ff",
  "#ff3bd7",
  "#ffe176",
  "#5fff9e",
  "#a88bff",
  "#ff8a3d",
  "#4c7dff",
  "#f5f7ff"
];
var perimeterStarts = [
  { x: 0, y: 0 },
  { x: 7, y: 0 },
  { x: 14, y: 0 },
  { x: 14, y: 15 },
  { x: 14, y: 30 },
  { x: 7, y: 30 },
  { x: 0, y: 30 },
  { x: 0, y: 15 }
];
var horizontalPlatformXs = [0, 3, 6, 9, 12, 14];
var verticalPlatformYs = [3, 6, 9, 12, 15, 18, 21, 24, 27];
var sueloSeguroPlatformAnchors = [
  ...horizontalPlatformXs.map((x) => ({ x, y: 0 })),
  ...verticalPlatformYs.map((y) => ({ x: FLOOR_COLS - sueloSeguroPlatformSize, y })),
  ...[...horizontalPlatformXs].reverse().map((x) => ({ x, y: FLOOR_ROWS - sueloSeguroPlatformSize })),
  ...[...verticalPlatformYs].reverse().map((y) => ({ x: 0, y }))
];
var hazardMaxX = FLOOR_COLS - sueloSeguroHazardSize;
var hazardMaxY = FLOOR_ROWS - sueloSeguroHazardSize;
var sueloSeguroHazardOrbit = [
  ...Array.from({ length: hazardMaxX + 1 }, (_, x) => ({ x, y: 0 })),
  ...Array.from({ length: hazardMaxY }, (_, index) => ({ x: hazardMaxX, y: index + 1 })),
  ...Array.from({ length: hazardMaxX }, (_, index) => ({ x: hazardMaxX - index - 1, y: hazardMaxY })),
  ...Array.from({ length: hazardMaxY - 1 }, (_, index) => ({ x: 0, y: hazardMaxY - index - 1 }))
];
var floorPerimeter = [
  ...Array.from({ length: FLOOR_COLS }, (_, x) => ({ x, y: 0 })),
  ...Array.from({ length: FLOOR_ROWS - 1 }, (_, index) => ({ x: FLOOR_COLS - 1, y: index + 1 })),
  ...Array.from({ length: FLOOR_COLS - 1 }, (_, index) => ({ x: FLOOR_COLS - index - 2, y: FLOOR_ROWS - 1 })),
  ...Array.from({ length: FLOOR_ROWS - 2 }, (_, index) => ({ x: 0, y: FLOOR_ROWS - index - 2 }))
];
function sueloSeguroDifficultyProfile(difficulty) {
  return { ...difficultyProfiles4[difficulty] ?? difficultyProfiles4.medium };
}
function sueloSeguroRequiredTransfers(playerCount) {
  return Math.max(6, playerCount * 2);
}
function sueloSeguroStartingPlatforms(playerCount) {
  return Array.from({ length: playerCount }, (_, index) => {
    const perimeterIndex = Math.floor(index * perimeterStarts.length / playerCount);
    return { ...perimeterStarts[perimeterIndex] };
  });
}
function sueloSeguroHazardOrigin(step) {
  return { ...sueloSeguroHazardOrbit[positiveModulo3(step, sueloSeguroHazardOrbit.length)] };
}
function createGame19(config) {
  return new SueloSeguroGame(config);
}
var SueloSeguroGame = class {
  activePlayerIndex = 0;
  bestTransferMillis = null;
  completedTransfers = 0;
  config;
  failedTurns = 0;
  finishedAtMillis = null;
  heldTiles = /* @__PURE__ */ new Set();
  lastDamageAtMillis = Number.NEGATIVE_INFINITY;
  lastEvent = gameEvent("none", "Busca tu plataforma", 0);
  lastTransferMillis = null;
  lives = 0;
  nowMillis = 0;
  phase = "ready";
  platforms = [];
  playerScores = [];
  players = [];
  readyGate;
  resultAtMillis = 0;
  rng;
  startedAtMillis = 0;
  success = false;
  targetPlatform = null;
  teamTransferMillis = 0;
  turnDeadlineMillis = 0;
  turnStartedAtMillis = 0;
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest19);
    this.readyGate = this.createReadyGate(this.config.nowMillis);
    this.rng = createSeededRng(this.config.seed);
    this.resetState(this.config.nowMillis);
  }
  init(nowMillis) {
    this.resetState(nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    const key = tileKey5(event.x, event.y);
    if (event.pressed) this.heldTiles.add(key);
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.update(event), event.atMillis);
    }
    if (this.phase !== "running" || !event.pressed) return [];
    if (this.targetPlatform && insidePlatform2(event.x, event.y, this.targetPlatform)) {
      return this.completeTransfer(event.atMillis);
    }
    if (this.isDangerousContact(event.x, event.y, event.atMillis)) {
      return this.takeDamage("Has pisado el patr\xF3n rojo", event.atMillis);
    }
    return [];
  }
  release(event) {
    this.nowMillis = event.atMillis;
    this.heldTiles.delete(tileKey5(event.x, event.y));
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
      if (event.atMillis - (this.finishedAtMillis ?? event.atMillis) >= sueloSeguroGameResultMillis) {
        this.resetState(event.atMillis);
        return [this.lastEvent];
      }
      return [];
    }
    if (this.phase === "round-win" || this.phase === "turn-fail") {
      const transitionMillis = this.phase === "round-win" ? sueloSeguroRoundWinMillis : sueloSeguroTurnFailMillis;
      if (event.atMillis - this.resultAtMillis >= transitionMillis) {
        this.advancePlayer();
        this.beginTurn(event.atMillis);
        return [this.lastEvent];
      }
      return [];
    }
    if (this.phase !== "running") return [];
    if (this.remainingMillis() <= 0) return this.finish(false, "Se acab\xF3 el tiempo", event.atMillis);
    if (this.targetPlatform && this.heldOnPlatform(this.targetPlatform)) {
      return this.completeTransfer(event.atMillis);
    }
    if (event.atMillis >= this.turnDeadlineMillis) {
      return this.failTurn(event.atMillis);
    }
    if (event.atMillis >= this.turnStartedAtMillis + sueloSeguroDepartureGraceMillis && this.heldOnDanger(event.atMillis)) {
      return this.takeDamage("El patr\xF3n rojo ha alcanzado al equipo", event.atMillis);
    }
    return [];
  }
  render() {
    const frame = createFrame(backgroundColor7);
    if (this.phase === "waiting" || this.phase === "starting") {
      this.paintWaiting(frame);
      return frame;
    }
    if (this.phase === "finished") {
      this.paintFinished(frame);
      return frame;
    }
    this.paintHazard(frame);
    for (const platform of this.visiblePlatforms()) this.paintPlatform(frame, platform);
    if (this.phase === "round-win") {
      const winner = this.players[this.activePlayerIndex];
      paintDiamondRing(frame, {
        centerX: (this.platforms[this.activePlayerIndex]?.x ?? 7) + 0.5,
        centerY: (this.platforms[this.activePlayerIndex]?.y ?? 15) + 0.5,
        color: winner?.color ?? "#5fff9e",
        radius: 2 + Math.floor((this.nowMillis - this.resultAtMillis) / 110) % 10,
        thickness: 2
      });
    }
    return frame;
  }
  snapshot() {
    const ready = this.readyGate.state(this.nowMillis);
    const profile2 = this.profile();
    const active = this.players[this.activePlayerIndex];
    const visiblePlatforms = this.visiblePlatforms();
    return {
      currentGame: manifest19.id,
      label: manifest19.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: this.players,
      score: this.teamTransferMillis,
      lives: this.lives,
      maxLives: profile2.lives,
      elapsedMillis: this.elapsedMillis(),
      remainingMillis: this.remainingMillis(),
      activeTargets: this.targetPlatform ? 1 : 0,
      success: this.phase === "finished" && this.success,
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? ready.countdownMillis : 0,
      readyPlayers: ready.readyPlayers,
      requiredPlayers: ready.requiredPlayers,
      activePlayerIndex: this.activePlayerIndex,
      activePlayerLabel: active?.label ?? "Jugador 1",
      bestTransferMillis: this.bestTransferMillis,
      completedTransfers: this.completedTransfers,
      failedTurns: this.failedTurns,
      hazardStep: this.hazardStep(this.nowMillis),
      lastTransferMillis: this.lastTransferMillis,
      platforms: visiblePlatforms,
      requiredTransfers: sueloSeguroRequiredTransfers(this.config.playerCount),
      stage: this.stage(),
      targetPlatform: visiblePlatforms.find((platform) => platform.target) ?? null,
      teamTransferMillis: this.teamTransferMillis,
      turnDurationMillis: profile2.turnMillis,
      turnRemainingMillis: this.phase === "running" ? Math.max(0, this.turnDeadlineMillis - this.nowMillis) : 0
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest19);
    this.readyGate = this.createReadyGate(this.config.nowMillis);
    this.resetState(this.config.nowMillis);
  }
  applyReadyTransition(transition, nowMillis) {
    if (transition === "players-ready") {
      this.phase = "starting";
      this.lastEvent = gameEvent("ready", "Todos en su plataforma", nowMillis);
    } else if (transition === "players-left") {
      this.phase = "waiting";
      this.lastEvent = gameEvent("ready", "Vuelve a tu plataforma", nowMillis);
    } else if (transition === "started") {
      this.phase = "running";
      this.startedAtMillis = nowMillis;
      this.beginTurn(nowMillis);
    } else {
      return [];
    }
    return [this.lastEvent];
  }
  beginTurn(nowMillis) {
    this.phase = "running";
    this.turnStartedAtMillis = nowMillis;
    this.turnDeadlineMillis = nowMillis + this.profile().turnMillis;
    this.targetPlatform = this.pickTargetPlatform();
    const active = this.players[this.activePlayerIndex];
    this.lastEvent = gameEvent("turn", `${active?.label ?? "Jugador"}: busca tu nueva plataforma`, nowMillis);
  }
  completeTransfer(atMillis) {
    if (!this.targetPlatform || this.phase !== "running") return [];
    const transferMillis = Math.max(0, atMillis - this.turnStartedAtMillis);
    this.platforms[this.activePlayerIndex] = { ...this.targetPlatform };
    this.targetPlatform = null;
    this.completedTransfers += 1;
    this.lastTransferMillis = transferMillis;
    this.bestTransferMillis = this.bestTransferMillis === null ? transferMillis : Math.min(this.bestTransferMillis, transferMillis);
    this.teamTransferMillis += transferMillis;
    this.playerScores[this.activePlayerIndex] = (this.playerScores[this.activePlayerIndex] ?? 0) + transferMillis;
    this.updatePlayers();
    if (this.completedTransfers >= sueloSeguroRequiredTransfers(this.config.playerCount)) {
      return this.finish(true, `Todos los relevos en ${formatTransferTime(this.teamTransferMillis)}`, atMillis);
    }
    this.phase = "round-win";
    this.resultAtMillis = atMillis;
    const active = this.players[this.activePlayerIndex];
    this.lastEvent = gameEvent("round-win", `${active?.label ?? "Jugador"} lleg\xF3 en ${formatTransferTime(transferMillis)}`, atMillis);
    return [this.lastEvent];
  }
  failTurn(atMillis) {
    if (this.targetPlatform) this.platforms[this.activePlayerIndex] = { ...this.targetPlatform };
    this.targetPlatform = null;
    this.failedTurns += 1;
    const events = this.takeDamage("No has llegado a tiempo", atMillis);
    if (this.phase === "finished") return events;
    this.phase = "turn-fail";
    this.resultAtMillis = atMillis;
    return events;
  }
  takeDamage(message, atMillis) {
    if (atMillis - this.lastDamageAtMillis < sueloSeguroDamageImmunityMillis) return [];
    this.lastDamageAtMillis = atMillis;
    this.lives = Math.max(0, this.lives - 1);
    this.updatePlayers();
    if (this.lives === 0) return this.finish(false, "El patr\xF3n rojo ha ganado", atMillis);
    this.lastEvent = gameEvent("damage", `${message}; quedan ${this.lives} vidas`, atMillis);
    return [this.lastEvent];
  }
  finish(success, message, atMillis) {
    this.phase = "finished";
    this.finishedAtMillis = atMillis;
    this.success = success;
    this.targetPlatform = null;
    this.lastEvent = gameEvent(success ? "win" : "fail", message, atMillis);
    return [this.lastEvent];
  }
  advancePlayer() {
    this.activePlayerIndex = (this.activePlayerIndex + 1) % this.config.playerCount;
  }
  pickTargetPlatform() {
    const origin = this.platforms[this.activePlayerIndex];
    const occupied = this.platforms.filter((_platform, index) => index !== this.activePlayerIndex);
    const candidates = sueloSeguroPlatformAnchors.filter(
      (candidate) => !samePlatform(origin, candidate) && !occupied.some((platform) => touchesOrAdjacent(platform, candidate)) && manhattan2(origin, candidate) >= 8
    );
    const fallback = sueloSeguroPlatformAnchors.filter(
      (candidate) => !samePlatform(origin, candidate) && !occupied.some((platform) => touchesOrAdjacent(platform, candidate))
    );
    const pool = candidates.length > 0 ? candidates : fallback;
    const selected = pool[this.rng.int(pool.length)];
    if (!selected) throw new Error("Suelo Seguro could not place a separated perimeter platform");
    return { ...selected };
  }
  paintWaiting(frame) {
    const step = Math.floor(this.nowMillis / (this.phase === "starting" ? 100 : 150));
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      for (let x = 0; x < FLOOR_COLS; x += 1) {
        if (positiveModulo3(x * 7 + y * 3 + step, 47) === 0) paintFrameCell(frame, x, y, "#0a2630");
      }
    }
    floorPerimeter.forEach((cell, index) => {
      const trail = positiveModulo3(index - step, 23);
      if (trail === 0) paintFrameCell(frame, cell.x, cell.y, this.phase === "starting" ? "#ffe176" : "#7feaff");
      else if (trail === 1 || trail === 22) paintFrameCell(frame, cell.x, cell.y, "#164a5a");
    });
    this.platforms.forEach((platform, index) => {
      const ready = this.readyGate.zoneReady(index, this.nowMillis);
      const color = ready ? "#ffffff" : this.players[index]?.color ?? playerColors2[index];
      fillFrameRect(frame, platform.x, platform.y, sueloSeguroPlatformSize, sueloSeguroPlatformSize, color);
      if (!ready) {
        const shimmer = positiveModulo3(step + index, sueloSeguroPlatformSize * sueloSeguroPlatformSize);
        paintFrameCell(
          frame,
          platform.x + shimmer % sueloSeguroPlatformSize,
          platform.y + Math.floor(shimmer / sueloSeguroPlatformSize),
          "#ffffff"
        );
      }
    });
    paintDiamondRing(frame, {
      centerX: 7.5,
      centerY: 15.5,
      color: this.phase === "starting" ? "#ffe176" : "#35d7ff",
      radius: 2 + step % 11
    });
  }
  paintHazard(frame) {
    const origin = sueloSeguroHazardOrigin(this.hazardStep(this.nowMillis));
    fillFrameRect(frame, origin.x, origin.y, sueloSeguroHazardSize, sueloSeguroHazardSize, dangerColor);
  }
  paintPlatform(frame, platform) {
    const pulse = platform.target && Math.floor(this.nowMillis / 180) % 2 === 0 ? "#ffffff" : platform.color;
    fillFrameRect(frame, platform.x, platform.y, sueloSeguroPlatformSize, sueloSeguroPlatformSize, pulse);
  }
  paintFinished(frame) {
    const step = Math.floor((this.nowMillis - (this.finishedAtMillis ?? this.nowMillis)) / 120);
    paintDiamondWave(frame, {
      color: ({ distance }) => this.success ? playerColors2[distance % playerColors2.length] : distance % 2 === 0 ? dangerColor : "#560719",
      step,
      period: this.success ? 8 : 5,
      bandWidth: this.success ? 4 : 3
    });
  }
  visiblePlatforms() {
    const visible = this.platforms.map((platform, ownerIndex) => ({ platform, ownerIndex })).filter(({ ownerIndex }) => this.phase !== "running" || ownerIndex !== this.activePlayerIndex).map(({ platform, ownerIndex }) => ({
      ...platform,
      color: this.players[ownerIndex]?.color ?? playerColors2[ownerIndex],
      ownerIndex,
      target: false
    }));
    if (this.targetPlatform) {
      visible.push({
        ...this.targetPlatform,
        color: this.players[this.activePlayerIndex]?.color ?? playerColors2[this.activePlayerIndex],
        ownerIndex: this.activePlayerIndex,
        target: true
      });
    }
    return visible;
  }
  heldOnPlatform(platform) {
    for (const key of this.heldTiles) {
      const [x, y] = key.split(",").map(Number);
      if (insidePlatform2(x ?? -1, y ?? -1, platform)) return true;
    }
    return false;
  }
  heldOnDanger(atMillis) {
    for (const key of this.heldTiles) {
      const [x, y] = key.split(",").map(Number);
      if (this.isDangerousContact(x ?? -1, y ?? -1, atMillis)) return true;
    }
    return false;
  }
  isDangerousContact(x, y, atMillis) {
    if (this.visiblePlatforms().some((platform) => insidePlatform2(x, y, platform))) return false;
    const origin = sueloSeguroHazardOrigin(this.hazardStep(atMillis));
    return x >= origin.x && x < origin.x + sueloSeguroHazardSize && y >= origin.y && y < origin.y + sueloSeguroHazardSize;
  }
  hazardStep(atMillis) {
    return Math.floor(Math.max(0, atMillis - this.startedAtMillis) / this.profile().hazardStepMillis);
  }
  stage() {
    if (this.phase === "waiting" || this.phase === "starting") return "waiting";
    if (this.phase === "round-win") return "round-win";
    if (this.phase === "turn-fail") return "turn-fail";
    if (this.phase === "finished") return this.success ? "game-win" : "game-fail";
    return "moving";
  }
  elapsedMillis() {
    if (this.phase === "waiting" || this.phase === "starting" || this.phase === "ready") return 0;
    return Math.max(0, (this.finishedAtMillis ?? this.nowMillis) - this.startedAtMillis);
  }
  remainingMillis() {
    return Math.max(0, this.config.durationMillis - this.elapsedMillis());
  }
  profile() {
    return sueloSeguroDifficultyProfile(this.config.difficulty);
  }
  createReadyGate(nowMillis) {
    const zones = sueloSeguroStartingPlatforms(this.config.playerCount).map((platform) => ({
      minX: platform.x,
      maxX: platform.x + sueloSeguroPlatformSize - 1,
      minY: platform.y,
      maxY: platform.y + sueloSeguroPlatformSize - 1
    }));
    return createPlayerReadyGate(manifest19.start, zones, nowMillis);
  }
  resetState(nowMillis) {
    this.activePlayerIndex = 0;
    this.bestTransferMillis = null;
    this.completedTransfers = 0;
    this.failedTurns = 0;
    this.finishedAtMillis = null;
    this.heldTiles.clear();
    this.lastDamageAtMillis = Number.NEGATIVE_INFINITY;
    this.lastTransferMillis = null;
    this.lives = this.profile().lives;
    this.nowMillis = nowMillis;
    this.phase = "waiting";
    this.platforms = sueloSeguroStartingPlatforms(this.config.playerCount);
    this.playerScores = Array.from({ length: this.config.playerCount }, () => 0);
    this.readyGate.reset(nowMillis);
    this.resultAtMillis = 0;
    this.rng = createSeededRng(this.config.seed);
    this.startedAtMillis = nowMillis;
    this.success = false;
    this.targetPlatform = null;
    this.teamTransferMillis = 0;
    this.turnDeadlineMillis = 0;
    this.turnStartedAtMillis = 0;
    this.updatePlayers();
    this.lastEvent = gameEvent("ready", "Cada jugador ocupa su plataforma", nowMillis);
  }
  updatePlayers() {
    this.players = defaultPlayers(this.config.playerCount, this.config.players).map((player, index) => ({
      ...player,
      label: /^Player \d+$/u.test(player.label) ? `Jugador ${index + 1}` : player.label,
      color: this.config.players[index]?.color ?? playerColors2[index] ?? playerColors2[0],
      score: this.playerScores[index] ?? 0,
      lives: this.lives
    }));
  }
};
function tileKey5(x, y) {
  return `${x},${y}`;
}
function insidePlatform2(x, y, platform) {
  return x >= platform.x && x < platform.x + sueloSeguroPlatformSize && y >= platform.y && y < platform.y + sueloSeguroPlatformSize;
}
function touchesOrAdjacent(left, right) {
  return left.x <= right.x + sueloSeguroPlatformSize && left.x + sueloSeguroPlatformSize >= right.x && left.y <= right.y + sueloSeguroPlatformSize && left.y + sueloSeguroPlatformSize >= right.y;
}
function samePlatform(left, right) {
  return left.x === right.x && left.y === right.y;
}
function manhattan2(left, right) {
  return Math.abs(left.x - right.x) + Math.abs(left.y - right.y);
}
function formatTransferTime(millis) {
  return `${(Math.max(0, millis) / 1e3).toFixed(2).replace(".", ",")} s`;
}
function positiveModulo3(value, divisor) {
  return (value % divisor + divisor) % divisor;
}

// games/suelo-seguro/src/fixtures.ts
function startedGame4() {
  const game8 = createGame19({ playerCount: 4, durationMillis: manifest19.defaultDurationMillis, difficulty: "medium", seed: 137 });
  game8.init(0);
  sueloSeguroStartingPlatforms(4).forEach((platform, index) => {
    game8.press({ x: platform.x, y: platform.y, pressed: true, atMillis: 100 + index * 80 });
  });
  game8.tick({ atMillis: 2400 });
  return game8;
}
var runningGame9 = startedGame4();
runningGame9.tick({ atMillis: 2700 });
var runningFrame17 = runningGame9.render();
var runningSnapshot17 = runningGame9.snapshot();
var roundWinGame3 = startedGame4();
var firstTarget = roundWinGame3.snapshot().targetPlatform;
roundWinGame3.press({ x: firstTarget.x, y: firstTarget.y, pressed: true, atMillis: 2650 });
var roundWinFrame4 = roundWinGame3.render();
var roundWinSnapshot4 = roundWinGame3.snapshot();
var damagedGame4 = startedGame4();
damagedGame4.tick({ atMillis: 3100 });
var danger = damagedGame4.render().cells.find((cell) => cell.color === "#ff183d");
damagedGame4.press({ x: danger.x, y: danger.y, pressed: true, atMillis: 3100 });
var damagedFrame5 = damagedGame4.render();
var damagedSnapshot5 = damagedGame4.snapshot();
var failedGame4 = startedGame4();
var failedClock = 2400;
while (failedGame4.snapshot().phase !== "finished") {
  failedClock += failedGame4.snapshot().phase === "turn-fail" ? sueloSeguroTurnFailMillis : failedGame4.snapshot().turnRemainingMillis;
  failedGame4.tick({ atMillis: failedClock });
}
var failedFrame5 = failedGame4.render();
var failedSnapshot5 = failedGame4.snapshot();
var finishedGame7 = startedGame4();
var clock2 = 2650;
while (finishedGame7.snapshot().phase !== "finished") {
  const target3 = finishedGame7.snapshot().targetPlatform;
  if (!target3) throw new Error("fixture expected an active target platform");
  finishedGame7.press({ x: target3.x, y: target3.y, pressed: true, atMillis: clock2 });
  finishedGame7.release({ x: target3.x, y: target3.y, pressed: false, atMillis: clock2 + 20 });
  if (finishedGame7.snapshot().phase !== "finished") {
    clock2 += sueloSeguroRoundWinMillis + 40;
    finishedGame7.tick({ atMillis: clock2 });
    clock2 += 40;
  }
}
var finishedFrame12 = finishedGame7.render();
var finishedSnapshot14 = finishedGame7.snapshot();
var resetGame = startedGame4();
resetGame.tick({ atMillis: manifest19.defaultDurationMillis + 2400 });
resetGame.tick({ atMillis: manifest19.defaultDurationMillis + 2400 + sueloSeguroGameResultMillis });
var resetSnapshot = resetGame.snapshot();

// games/temporada1-niveles/src/index.ts
var src_exports20 = {};
__export(src_exports20, {
  PlayerDisplay: () => PublishedLevelPlayerDisplay,
  countdownFrame: () => countdownFrame2,
  countdownSnapshot: () => countdownSnapshot2,
  createGame: () => createGame20,
  createSessionController: () => createSessionController3,
  fallbackContent: () => fallbackContent2,
  finishedFrame: () => finishedFrame13,
  finishedSnapshot: () => finishedSnapshot15,
  initEvents: () => initEvents10,
  manifest: () => manifest20,
  runningFrame: () => runningFrame18,
  runningSnapshot: () => runningSnapshot18,
  temporada1EngineGame: () => temporada1EngineGame,
  temporada1GameId: () => temporada1GameId
});

// games/temporada1-niveles/src/manifest.ts
var temporada1GameId = "4773837e-3565-49d7-8953-3b40f59fca7b";
var temporada1EngineGame = "temporada1-niveles";
var manifest20 = {
  id: temporada1GameId,
  slug: temporada1EngineGame,
  aliases: [temporada1EngineGame],
  label: "Temporada 1",
  description: "Ruta cooperativa de 24 niveles con puntos, peligros y retos cl\xE1sicos de la pista.",
  availability: { development: true, production: true },
  catalog: {
    category: "team",
    color: "#8dff6e",
    durationLabel: "Por nivel",
    modeLabel: "Temporada",
    audioLabel: "M\xFAsica + efectos",
    rules: [
      "Recoge todos los objetivos azules y morados",
      "Los objetivos morados necesitan dos pisadas y las baldosas rojas quitan vidas"
    ]
  },
  players: {
    allowAny: false,
    min: 1,
    max: 6
  },
  start: { mode: "immediate" },
  config: {
    difficulty: {
      default: "medium",
      options: ["easy", "medium", "hard", "expert"]
    },
    vars: []
  },
  defaultDurationMillis: 0,
  display: {
    entry: "./display"
  },
  preview: {
    seed: 137,
    playerCount: 4,
    difficulty: "medium",
    actions: [{ atMillis: 3100, type: "press", x: 7, y: 29 }],
    captureStartMillis: 3180,
    frameCount: 18,
    frameIntervalMillis: 120
  },
  tags: ["published-levels", "platform-editable", "jugar-3d", "team", "typescript"]
};

// games/temporada1-niveles/src/fixtures-content.ts
var fallbackContent2 = createPublishedLevelContent({
  gameId: temporada1GameId,
  engineGame: temporada1EngineGame,
  selectedLevelId: "22222222-2222-4222-8222-222222222201",
  selectedLevelSlug: "level-1",
  mode: "challenge",
  levelsPayload: [
    temporadaLevel("22222222-2222-4222-8222-222222222201", "level-1", "Temporada 1 / Nivel 1", 0),
    temporadaLevel("22222222-2222-4222-8222-222222222202", "level-2", "Temporada 1 / Nivel 2", 2)
  ],
  resultAnimationsPayload: {
    levels: [resultAnimation2("game-pass", "#35d7ff", victoryCells2()), resultAnimation2("game-fail", "#ff2036", defeatCells2())]
  }
});
function temporadaLevel(id, slug, label, offset) {
  return {
    id,
    slug,
    label,
    description: "Esquiva las l\xEDneas rojas y recoge todos los objetivos azules y morados.",
    life: 4,
    pass_score: 10,
    time_limit_seconds: 75,
    frame_tick_ms: 25,
    rules: {
      victory_condition: "collect_all",
      difficulty_changes_layout: false,
      difficulty_settings: {
        easy: { life: 5, gameplay_time_limit_seconds: 100, speed_multiplier: 0.8 },
        medium: { life: 4, gameplay_time_limit_seconds: 75, speed_multiplier: 1 },
        hard: { life: 3, gameplay_time_limit_seconds: 60, speed_multiplier: 1.25 },
        expert: { life: 2, gameplay_time_limit_seconds: 45, speed_multiplier: 1.5 }
      },
      red_floor_animation: "none",
      red_damage_grace_period: false,
      green_platform_load_animation: true,
      green_platform_load_side: "left",
      green_platform_disappear: false,
      green_platform_impact_ripple: false,
      blue_platform_turn_green: false,
      blue_platform_capture_area: false
    },
    result_animations: {
      victory_animations: ["game-pass"],
      defeat_animations: ["game-fail"]
    },
    music_ref: "Motion/canciones/Background07.mp3",
    music_volume: 0.18,
    coin_cue_ref: "Motion/sonidos/coin.wav",
    double_coin_cue_ref: "Motion/sonidos/coin.wav",
    damage_cue_ref: "Motion/sonidos/fallo.mp3",
    win_cue_ref: "Motion/sonidos/victoria.mp3",
    defeat_cue_ref: "Motion/sonidos/fallo.mp3",
    frames: [
      { r: 24, c: temporadaCells(offset, 0) },
      { r: 24, c: temporadaCells(offset, 1) },
      { r: 24, c: temporadaCells(offset, 2) }
    ]
  };
}
function temporadaCells(levelOffset, motionOffset) {
  const cells = [];
  for (let y = 28; y < 32; y += 1) {
    for (let x = 3; x <= 12; x += 1) cells.push([x, y, 0, `safe-${x}-${y}`]);
  }
  for (let y = 3; y <= 26; y += 6) {
    for (let x = 5; x <= 10; x += 1) cells.push([x, y, 0, `rest-${x}-${y}`]);
  }
  const lineA = 8 + (motionOffset + levelOffset) % 3;
  const lineB = 19 - (motionOffset + levelOffset) % 3;
  for (let x = 0; x < 16; x += 1) {
    cells.push([x, lineA, 2, `laser-a-${x}`], [x, lineB, 2, `laser-b-${x}`]);
  }
  cells.push(
    [2 + levelOffset, 5, 1, `blue-a-${levelOffset}`],
    [13 - levelOffset, 24, 1, `blue-b-${levelOffset}`],
    [8, 14, 3, `purple-${levelOffset}`]
  );
  return cells;
}
function resultAnimation2(slug, color, cells) {
  return {
    slug,
    frame_tick_ms: 50,
    tile_effects: { 0: { color } },
    frames: [{ r: 10, c: cells }, { r: 10, c: cells.map(([x, y, kind]) => [15 - x, y, kind]) }]
  };
}
function victoryCells2() {
  const cells = [];
  for (let radius = 0; radius <= 7; radius += 1) {
    cells.push([7 - radius, 16, 0], [8 + radius, 16, 0], [7, 16 - radius, 0], [8, 16 + radius, 0]);
  }
  return cells.filter(([x, y]) => x >= 0 && x < 16 && y >= 0 && y < 32);
}
function defeatCells2() {
  const cells = [];
  for (let y = 7; y < 25; y += 1) cells.push([5, y, 0], [10, y, 0]);
  for (let x = 5; x <= 10; x += 1) cells.push([x, 7, 0], [x, 24, 0]);
  return cells;
}

// games/temporada1-niveles/src/game.ts
var product2 = Object.freeze({
  manifest: manifest20,
  fallbackContent: fallbackContent2
});
function createGame20(config) {
  return createPublishedLevelGame(product2, config);
}
var createSessionController3 = createPublishedLevelSessionController;

// games/temporada1-niveles/src/fixtures.ts
var game7 = createGame20({ playerCount: 4, difficulty: "medium" });
var initEvents10 = game7.init(0);
game7.tick({ atMillis: 1500 });
var countdownFrame2 = game7.render();
var countdownSnapshot2 = game7.snapshot();
game7.tick({ atMillis: 3e3 });
var runningFrame18 = game7.render();
var runningSnapshot18 = game7.snapshot();
game7.press({ x: 2, y: 5, pressed: true, atMillis: 3020 });
game7.press({ x: 13, y: 24, pressed: true, atMillis: 3040 });
game7.press({ x: 8, y: 14, pressed: true, atMillis: 3060 });
game7.release({ x: 8, y: 14, pressed: false, atMillis: 3080 });
game7.press({ x: 8, y: 14, pressed: true, atMillis: 3100 });
game7.tick({ atMillis: 3120 });
var finishedFrame13 = game7.render();
var finishedSnapshot15 = game7.snapshot();

// games/tira-soga/src/index.ts
var src_exports21 = {};
__export(src_exports21, {
  PlayerDisplay: () => PlayerDisplay19,
  blueColor: () => blueColor3,
  blueFieldColor: () => blueFieldColor,
  blueFieldFirstRow: () => blueFieldFirstRow,
  centerLineColor: () => centerLineColor,
  createGame: () => createGame21,
  finishedFrame: () => finishedFrame14,
  finishedSnapshot: () => finishedSnapshot16,
  gameWinAnimationMillis: () => gameWinAnimationMillis5,
  initEvents: () => initEvents11,
  knotColor: () => knotColor,
  manifest: () => manifest21,
  onBlueTilePressed: () => onBlueTilePressed,
  onRedTilePressed: () => onRedTilePressed,
  redColor: () => redColor3,
  redFieldColor: () => redFieldColor,
  redFieldLastRow: () => redFieldLastRow,
  ropeColor: () => ropeColor,
  ropeLimit: () => ropeLimit,
  roundTransitionMillis: () => roundTransitionMillis,
  roundWinAnimationMillis: () => roundWinAnimationMillis2,
  roundWinFrame: () => roundWinFrame5,
  roundWinSnapshot: () => roundWinSnapshot5,
  roundsToWin: () => roundsToWin2,
  runningFrame: () => runningFrame19,
  runningSnapshot: () => runningSnapshot19,
  startingFrame: () => startingFrame4,
  startingSnapshot: () => startingSnapshot8,
  teamForTile: () => teamForTile,
  teamLabel: () => teamLabel,
  tiraSogaReadyZones: () => tiraSogaReadyZones,
  totalRounds: () => totalRounds,
  waitingFrame: () => waitingFrame5,
  waitingSnapshot: () => waitingSnapshot10
});

// games/tira-soga/src/display.tsx
var import_jsx_runtime22 = __toESM(require_jsx_runtime(), 1);
var tiraSogaStyles = `
.tira-soga-display {
  display: grid;
  gap: 18px;
  grid-template-rows: minmax(220px, .72fr) minmax(150px, .42fr) 108px minmax(210px, .54fr);
  min-height: 0;
  position: relative;
}
.tira-soga-scoreboard .ml-player-score-panel > strong { font-size: clamp(132px, 9vw, 190px); }
.tira-soga-scoreboard .ml-versus-center strong { font-size: clamp(64px, 4.6vw, 92px); }
.tira-soga-arena {
  align-items: stretch;
  background: linear-gradient(90deg, rgba(255,28,40,.17), rgba(7,10,17,.92) 31%, rgba(7,10,17,.92) 69%, rgba(20,92,255,.2));
  border: 1px solid rgba(255,255,255,.2);
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr) 150px;
  min-height: 0;
  overflow: hidden;
  position: relative;
}
.tira-soga-team {
  align-content: center;
  display: grid;
  font-size: 28px;
  font-weight: 950;
  letter-spacing: .1em;
  text-align: center;
  text-transform: uppercase;
}
.tira-soga-team.is-red { background: rgba(255,28,40,.2); color: #ff7b84; }
.tira-soga-team.is-blue { background: rgba(20,92,255,.22); color: #79a0ff; }
.tira-soga-track {
  align-self: center;
  height: 78px;
  margin: 0 42px;
  position: relative;
}
.tira-soga-rope {
  background: repeating-linear-gradient(105deg, #8d571d 0 8px, #f4c56a 8px 16px, #b87527 16px 24px);
  box-shadow: 0 0 24px rgba(244,197,106,.32);
  height: 18px;
  left: 0;
  position: absolute;
  right: 0;
  top: 30px;
}
.tira-soga-center {
  background: rgba(255,255,255,.65);
  bottom: 2px;
  left: 50%;
  position: absolute;
  top: 2px;
  width: 2px;
}
.tira-soga-knot {
  background: #fff7d6;
  border: 6px solid #d99331;
  border-radius: 50%;
  box-shadow: 0 0 0 7px rgba(255,159,28,.16), 0 0 30px rgba(255,247,214,.8);
  height: 42px;
  left: var(--tira-soga-rope-x);
  position: absolute;
  top: 18px;
  transform: translateX(-50%);
  transition: left 160ms cubic-bezier(.2,.9,.2,1);
  width: 42px;
  z-index: 2;
}
.tira-soga-caption {
  bottom: 8px;
  color: #fff;
  font-size: 25px;
  font-weight: 950;
  left: 190px;
  letter-spacing: .04em;
  position: absolute;
  right: 190px;
  text-align: center;
  text-shadow: 0 2px 12px #000;
}
.tira-soga-result {
  align-content: center;
  background: rgba(3,6,12,.88);
  display: grid;
  inset: 0;
  justify-items: center;
  position: absolute;
  z-index: 4;
}
.tira-soga-result strong { color: #fff; font-size: 54px; line-height: 1; }
.tira-soga-result span { color: #f4c56a; font-size: 21px; font-weight: 900; margin-top: 10px; text-transform: uppercase; }
.tira-soga-display.is-phase-waiting .tira-soga-knot {
  animation: tira-soga-waiting 1.25s ease-in-out infinite;
}
.tira-soga-display.is-phase-starting .tira-soga-rope {
  animation: tira-soga-starting .36s linear infinite;
}
.tira-soga-result.is-round-win {
  animation: tira-soga-round-win .52s ease-in-out infinite alternate;
  background: rgba(3,6,12,.82);
}
.tira-soga-result.is-game-win {
  animation: tira-soga-game-win .8s ease-in-out infinite alternate;
  background: linear-gradient(110deg, rgba(3,6,12,.9), rgba(244,197,106,.24), rgba(3,6,12,.9));
  background-size: 220% 100%;
}
.tira-soga-result.is-game-win strong { font-size: 68px; }
@keyframes tira-soga-waiting {
  0%, 100% { box-shadow: 0 0 0 5px rgba(255,159,28,.12), 0 0 18px rgba(255,247,214,.5); }
  50% { box-shadow: 0 0 0 12px rgba(255,159,28,.25), 0 0 38px rgba(255,247,214,.95); }
}
@keyframes tira-soga-starting {
  from { background-position: 0 0; }
  to { background-position: 24px 0; }
}
@keyframes tira-soga-round-win {
  from { box-shadow: inset 0 0 35px rgba(244,197,106,.2); }
  to { box-shadow: inset 0 0 90px rgba(244,197,106,.58); }
}
@keyframes tira-soga-game-win {
  from { background-position: 0 0; }
  to { background-position: 100% 0; }
}
@media (prefers-reduced-motion: reduce) {
  .tira-soga-display .tira-soga-knot,
  .tira-soga-display .tira-soga-rope,
  .tira-soga-display .tira-soga-result {
    animation: none !important;
    transition: none !important;
  }
}
.tira-soga-metrics .ml-metric { padding-block: 20px; }
.tira-soga-metrics .ml-metric-value { font-size: 52px; }
.tira-soga-rounds {
  gap: 8px;
  grid-template-rows: auto 5px minmax(76px, 1fr);
  padding: 14px 18px 16px;
}
.tira-soga-rounds .ml-round-strip-title { gap: 4px; }
.tira-soga-rounds .ml-round-strip-title > span { font-size: 20px; }
.tira-soga-rounds .ml-round-strip-title small { font-size: 13px; }
.tira-soga-rounds .ml-round-strip-count strong { font-size: 36px; }
.tira-soga-rounds .ml-round-strip-count span { font-size: 15px; }
.tira-soga-rounds .ml-round-card {
  align-content: start;
  gap: 5px;
  padding: 9px 12px 12px;
}
.tira-soga-rounds .ml-round-card-head span { font-size: 14px; }
.tira-soga-rounds .ml-round-card strong {
  font-size: 21px;
  line-height: 1.05;
}
.tira-soga-rounds .ml-round-card b {
  font-size: 12px;
  line-height: 1.15;
  white-space: normal;
}
`;
function PlayerDisplay19({
  snapshot
}) {
  const [red2, blue2] = snapshot.players;
  const redPlayer = red2 ?? { label: "Rojo", score: 0, color: "#ff1c28" };
  const bluePlayer = blue2 ?? { label: "Azul", score: 0, color: "#145cff" };
  const currentRound = snapshot.currentRound ?? 1;
  const totalRounds2 = snapshot.totalRounds ?? 5;
  const pressesPerAdvance = snapshot.pressesPerAdvance ?? 1;
  const ropePosition = snapshot.ropePosition ?? 0;
  const ropeLimit2 = snapshot.ropeLimit ?? 6;
  const rounds = snapshot.rounds ?? [];
  const ropePercent = 50 + ropePosition / Math.max(ropeLimit2, 1) * 43;
  const winnerLabel = snapshot.winnerIndex === 0 ? "Rojo" : "Azul";
  const roundWinnerLabel = snapshot.roundWinnerIndex === 0 ? "Rojo" : "Azul";
  const hasRoundResult = snapshot.phase !== "finished" && snapshot.roundWinnerIndex !== -1;
  const readyVisible = snapshot.phase === "waiting" || snapshot.phase === "starting";
  const centerLabel = snapshot.phase === "waiting" ? "Listos" : snapshot.phase === "starting" ? "Empieza en" : "Ronda";
  const centerValue = snapshot.phase === "waiting" ? `${snapshot.readyPlayers ?? 0}/${snapshot.requiredPlayers ?? 2}` : snapshot.phase === "starting" ? formatClock(snapshot.countdownMillis ?? 0) : `${currentRound}/${totalRounds2}`;
  const centerCaption = readyVisible ? snapshot.phase === "waiting" ? "en posici\xF3n" : "preparados" : `${snapshot.difficultyLabel ?? "Medio"} \xB7 ${pressesPerAdvance} ${pressesPerAdvance === 1 ? "pisada" : "pisadas"} por avance`;
  const caption = snapshot.phase === "finished" ? `Victoria ${winnerLabel}` : hasRoundResult ? `Ronda para ${roundWinnerLabel.toLowerCase()}` : ropePosition === 0 ? "\xA1Pisad vuestro campo para tirar!" : ropePosition < 0 ? "Rojo toma ventaja" : "Azul toma ventaja";
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(GameDisplayShell, { title: snapshot.label, phase: snapshot.phase, variant: "versus", children: /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(
    "div",
    {
      className: `tira-soga-display is-phase-${snapshot.phase}`,
      style: { "--tira-soga-rope-x": `${ropePercent}%` },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("style", { children: tiraSogaStyles }),
        /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(PlayerReadyOverlay, { snapshot }),
        /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
          VersusScoreboard,
          {
            className: "tira-soga-scoreboard",
            left: redPlayer,
            right: bluePlayer,
            target: snapshot.matchTarget ?? 3,
            centerLabel,
            centerValue,
            centerCaption
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("section", { className: "tira-soga-arena", "aria-label": `Posici\xF3n de la soga: ${ropePosition}`, children: [
          /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", { className: "tira-soga-team is-red", children: "Rojo" }),
          /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: "tira-soga-track", "aria-hidden": "true", children: [
            /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("i", { className: "tira-soga-rope" }),
            /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("i", { className: "tira-soga-center" }),
            /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("i", { className: "tira-soga-knot" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", { className: "tira-soga-team is-blue", children: "Azul" }),
          /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("strong", { className: "tira-soga-caption", children: caption }),
          snapshot.phase === "finished" ? /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: "tira-soga-result is-game-win", children: [
            /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("strong", { children: [
              "\xA1Gana ",
              winnerLabel,
              "!"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("span", { children: [
              "Resultado final ",
              redPlayer.score,
              " \u2013 ",
              bluePlayer.score
            ] })
          ] }) : hasRoundResult ? /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: "tira-soga-result is-round-win", children: [
            /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("strong", { children: [
              "Ronda para ",
              roundWinnerLabel
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", { children: "Siguiente ronda en breve" })
          ] }) : null
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(MetricRow, { columns: 4, className: "tira-soga-metrics", children: [
          /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(MetricPanel, { label: "Pisadas rojas", tone: "red", value: snapshot.redPresses ?? 0 }),
          /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(MetricPanel, { label: "Avance rojo", tone: "amber", value: `${snapshot.redProgress ?? 0}/${pressesPerAdvance}` }),
          /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(MetricPanel, { label: "Avance azul", tone: "cyan", value: `${snapshot.blueProgress ?? 0}/${pressesPerAdvance}` }),
          /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(MetricPanel, { label: "Pisadas azules", tone: "blue", value: snapshot.bluePresses ?? 0 })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
          RoundStrip,
          {
            className: "tira-soga-rounds",
            activeCaption: "Soga en juego",
            activeLabel: "En juego",
            activeRound: snapshot.phase === "finished" ? null : currentRound,
            rounds,
            totalRounds: totalRounds2
          }
        )
      ]
    }
  ) });
}

// games/tira-soga/src/manifest.ts
var manifest21 = {
  id: "tira-soga",
  label: "Tira-Soga",
  description: "Five-round team tug of war driven by rapid presses on the red and blue floor halves.",
  availability: { development: true, production: false },
  catalog: {
    category: "versus",
    color: "#ff9f1c",
    durationLabel: "Sin l\xEDmite",
    modeLabel: "Tira y afloja",
    audioLabel: "Efectos",
    rules: [
      "Rojo ocupa la mitad superior y azul la inferior",
      "Pisa r\xE1pidamente tu campo para arrastrar la soga",
      "Gana tres de las cinco rondas"
    ]
  },
  players: {
    allowAny: true,
    min: 2,
    max: 2
  },
  start: {
    mode: "player-ready",
    countdownMillis: 3e3,
    releaseGraceMillis: 2e3
  },
  config: {
    difficulty: {
      default: "medium",
      options: ["easy", "medium", "hard"]
    }
  },
  defaultDurationMillis: 0,
  display: {
    entry: "./display"
  },
  preview: {
    seed: 137,
    playerCount: 2,
    difficulty: "medium",
    actions: [
      { atMillis: 100, type: "press", x: 4, y: 8 },
      { atMillis: 100, type: "press", x: 11, y: 24 }
    ],
    captureStartMillis: 3200,
    frameCount: 18,
    frameIntervalMillis: 120
  },
  tags: ["competitive", "teams", "two-player", "typescript"]
};

// games/tira-soga/src/game.ts
var redColor3 = "#ff1c28";
var blueColor3 = "#145cff";
var redFieldColor = "#720c17";
var blueFieldColor = "#0b3189";
var centerLineColor = "#ff9f1c";
var ropeColor = "#f4c56a";
var knotColor = "#fff7d6";
var totalRounds = 5;
var roundsToWin2 = 3;
var ropeLimit = 6;
var roundWinAnimationMillis2 = 1800;
var gameWinAnimationMillis5 = 5e3;
var roundTransitionMillis = roundWinAnimationMillis2;
var redFieldLastRow = 14;
var blueFieldFirstRow = 17;
var difficultyPresses = {
  easy: 1,
  medium: 2,
  hard: 3
};
var difficultyLabels = {
  easy: "F\xE1cil",
  medium: "Medio",
  hard: "Dif\xEDcil"
};
function createGame21(config) {
  return new TiraSogaGame(config);
}
function tiraSogaReadyZones() {
  return [
    { minX: 0, maxX: FLOOR_COLS - 1, minY: 0, maxY: redFieldLastRow },
    { minX: 0, maxX: FLOOR_COLS - 1, minY: blueFieldFirstRow, maxY: FLOOR_ROWS - 1 }
  ];
}
var TiraSogaGame = class {
  config;
  phase = "waiting";
  startedAtMillis = 0;
  nowMillis = 0;
  ropePosition = 0;
  teamScore = [0, 0];
  teamPresses = [0, 0];
  teamProgress = [0, 0];
  rounds = [];
  roundWinnerIndex = -1;
  winnerIndex = -1;
  roundWonAtMillis = 0;
  roundPauseUntilMillis = 0;
  finishAtMillis = 0;
  motionEventId = 0;
  readyZones = tiraSogaReadyZones();
  readyGate;
  heldTiles = Array.from({ length: FLOOR_COLS * FLOOR_ROWS }, () => false);
  flashUntil = Array.from({ length: FLOOR_COLS * FLOOR_ROWS }, () => 0);
  lastEvent = gameEvent("none", "Listos para tirar", 0);
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest21);
    this.readyGate = createPlayerReadyGate(manifest21.start, this.readyZones, this.config.nowMillis);
    this.resetMatch(this.config.nowMillis);
  }
  init(nowMillis) {
    this.resetMatch(nowMillis);
    this.lastEvent = gameEvent("ready", "Tira-Soga espera a rojo y azul", nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    const readyTransition = this.readyGate.update(event);
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.recordEvents(this.applyReadyTransition(readyTransition, event.atMillis));
    }
    if (!event.pressed || this.phase !== "running" || this.roundWinnerIndex !== -1) {
      return [];
    }
    const tileIndex = this.tileIndex(event.x, event.y);
    const team = teamForTile(event.x, event.y);
    if (tileIndex === -1 || team === -1 || this.heldTiles[tileIndex]) {
      return [];
    }
    this.heldTiles[tileIndex] = true;
    this.flashUntil[tileIndex] = event.atMillis + 220;
    this.teamPresses[team] += 1;
    this.teamProgress[team] += 1;
    const threshold = this.pressesPerAdvance();
    if (this.teamProgress[team] < threshold) {
      return this.recordEvents([
        gameEvent(
          "hit",
          `${teamLabel(team)} suma ${this.teamProgress[team]} de ${threshold}`,
          event.atMillis
        )
      ]);
    }
    this.teamProgress[team] = 0;
    this.ropePosition += team === 0 ? -1 : 1;
    if (Math.abs(this.ropePosition) >= ropeLimit) {
      return this.recordEvents([this.finishRound(team, event.atMillis)]);
    }
    return this.recordEvents([
      gameEvent("hit", `${teamLabel(team)} tira de la soga`, event.atMillis)
    ]);
  }
  release(event) {
    this.nowMillis = event.atMillis;
    const tileIndex = this.tileIndex(event.x, event.y);
    if (tileIndex !== -1) {
      this.heldTiles[tileIndex] = false;
    }
    const readyTransition = this.readyGate.update({ ...event, pressed: false });
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.recordEvents(this.applyReadyTransition(readyTransition, event.atMillis));
    }
    return [];
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    const events = this.updateLifecycle(event.atMillis, this.readyGate.tick(event.atMillis));
    if (this.phase === "running" && this.roundWinnerIndex !== -1 && event.atMillis >= this.roundPauseUntilMillis) {
      this.startNextRound();
      events.push(gameEvent("start", `Ronda ${this.currentRound()}: \xA1a tirar!`, event.atMillis));
    }
    return this.recordEvents(events);
  }
  render() {
    const frame = createFrame("#05070a");
    if (this.phase === "waiting") {
      this.drawWaiting(frame);
      return frame;
    }
    if (this.phase === "starting") {
      this.drawStarting(frame);
      return frame;
    }
    if (this.phase === "finished") {
      this.drawGameWin(frame);
      return frame;
    }
    this.drawArena(frame);
    if (this.roundWinnerIndex !== -1) {
      this.drawRoundWin(frame);
    }
    return frame;
  }
  snapshot() {
    const readyState = this.readyGate.state(this.nowMillis);
    const players2 = this.scoredPlayers();
    const roundRemaining = Math.max(0, this.roundPauseUntilMillis - this.nowMillis);
    const gameRemaining = this.phase === "finished" ? Math.max(0, this.finishAtMillis + gameWinAnimationMillis5 - this.nowMillis) : 0;
    return {
      currentGame: manifest21.id,
      label: manifest21.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: players2,
      score: Math.max(...this.teamScore),
      lives: -1,
      elapsedMillis: this.phase === "waiting" || this.phase === "starting" ? 0 : Math.max(0, (this.phase === "finished" ? this.finishAtMillis : this.nowMillis) - this.startedAtMillis),
      remainingMillis: gameRemaining || roundRemaining,
      activeTargets: this.phase === "running" && this.roundWinnerIndex === -1 ? 2 : 0,
      success: this.phase === "finished",
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? readyState.countdownMillis : 0,
      readyPlayers: readyState.readyPlayers,
      requiredPlayers: readyState.requiredPlayers,
      matchTarget: roundsToWin2,
      roundHits: this.teamPresses[0] + this.teamPresses[1],
      lastRoundHits: this.rounds.at(-1)?.hits ?? 0,
      lastRoundWinner: this.rounds.at(-1)?.winnerLabel ?? "",
      difficulty: this.config.difficulty,
      difficultyLabel: difficultyLabels[this.config.difficulty] ?? "Medio",
      pressesPerAdvance: this.pressesPerAdvance(),
      ropePosition: this.ropePosition,
      ropeLimit,
      redPresses: this.teamPresses[0],
      bluePresses: this.teamPresses[1],
      redProgress: this.teamProgress[0],
      blueProgress: this.teamProgress[1],
      currentRound: this.currentRound(),
      totalRounds,
      rounds: this.rounds.map((round) => ({ ...round })),
      roundWinnerIndex: this.roundWinnerIndex,
      roundTransitionMillis: roundRemaining,
      winnerIndex: this.winnerIndex,
      motionEventId: this.motionEventId
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig(
      {
        ...this.config,
        ...config,
        options: { ...this.config.options, ...config.options }
      },
      manifest21
    );
    this.readyZones = tiraSogaReadyZones();
    this.readyGate = createPlayerReadyGate(manifest21.start, this.readyZones, this.config.nowMillis);
    this.resetMatch(this.config.nowMillis);
    this.lastEvent = gameEvent("ready", "Tira-Soga espera a rojo y azul", this.config.nowMillis);
  }
  playerReadyZones() {
    return this.readyZones.map((zone) => ({ ...zone }));
  }
  updateLifecycle(nowMillis, readyTransition) {
    if (this.phase === "finished") {
      if (nowMillis - this.finishAtMillis >= gameWinAnimationMillis5) {
        this.resetMatch(nowMillis);
        return [gameEvent("ready", "Nueva partida", nowMillis)];
      }
      return [];
    }
    return this.applyReadyTransition(readyTransition, nowMillis);
  }
  applyReadyTransition(transition, nowMillis) {
    if (transition === "players-ready") {
      this.phase = "starting";
      this.motionEventId += 1;
      return [gameEvent("start", "Rojo y azul listos", nowMillis)];
    }
    if (transition === "players-left") {
      this.phase = "waiting";
      this.motionEventId += 1;
      return [gameEvent("ready", "Vuelve a tu campo iluminado", nowMillis)];
    }
    if (transition === "started") {
      this.phase = "running";
      this.startedAtMillis = nowMillis;
      this.motionEventId += 1;
      return [gameEvent("start", "Ronda 1: \xA1a tirar!", nowMillis)];
    }
    return [];
  }
  finishRound(team, atMillis) {
    const round = this.currentRound();
    const hits = this.teamPresses[0] + this.teamPresses[1];
    this.teamScore[team] += 1;
    this.roundWinnerIndex = team;
    this.roundWonAtMillis = atMillis;
    this.rounds.push({
      index: round,
      winnerIndex: team,
      winnerLabel: teamLabel(team),
      hits
    });
    this.motionEventId += 1;
    if (this.rounds.length >= totalRounds) {
      this.phase = "finished";
      this.finishAtMillis = atMillis;
      this.winnerIndex = this.teamScore[0] > this.teamScore[1] ? 0 : 1;
      return gameEvent("win", `${teamLabel(this.winnerIndex)} gana Tira-Soga`, atMillis);
    }
    this.roundPauseUntilMillis = atMillis + roundWinAnimationMillis2;
    return gameEvent("hit", `Ronda ${round} para ${teamLabel(team).toLowerCase()}`, atMillis);
  }
  startNextRound() {
    this.ropePosition = 0;
    this.teamPresses = [0, 0];
    this.teamProgress = [0, 0];
    this.roundWinnerIndex = -1;
    this.roundWonAtMillis = 0;
    this.roundPauseUntilMillis = 0;
    this.heldTiles.fill(false);
    this.flashUntil.fill(0);
    this.motionEventId += 1;
  }
  resetMatch(nowMillis) {
    this.readyGate.reset(nowMillis);
    this.phase = "waiting";
    this.startedAtMillis = nowMillis;
    this.nowMillis = nowMillis;
    this.ropePosition = 0;
    this.teamScore = [0, 0];
    this.teamPresses = [0, 0];
    this.teamProgress = [0, 0];
    this.rounds = [];
    this.roundWinnerIndex = -1;
    this.winnerIndex = -1;
    this.roundWonAtMillis = 0;
    this.roundPauseUntilMillis = 0;
    this.finishAtMillis = 0;
    this.heldTiles.fill(false);
    this.flashUntil.fill(0);
    this.motionEventId = 0;
    this.motionEventId += 1;
  }
  currentRound() {
    return Math.min(totalRounds, this.rounds.length + (this.roundWinnerIndex === -1 ? 1 : 0));
  }
  pressesPerAdvance() {
    return difficultyPresses[this.config.difficulty] ?? 2;
  }
  ropeTileY(position = this.ropePosition) {
    const normalized = (position + ropeLimit) / (ropeLimit * 2);
    return Math.round(normalized * (FLOOR_ROWS - 1));
  }
  scoredPlayers() {
    return [
      { index: 0, label: "Rojo", color: redColor3, score: this.teamScore[0], lives: -1 },
      { index: 1, label: "Azul", color: blueColor3, score: this.teamScore[1], lives: -1 }
    ];
  }
  tileIndex(x, y) {
    if (!Number.isInteger(x) || !Number.isInteger(y) || !inFloorBounds(x, y)) {
      return -1;
    }
    return y * FLOOR_COLS + x;
  }
  recordEvents(events) {
    const last = events.at(-1);
    if (last) {
      this.lastEvent = last;
    }
    return events;
  }
  drawWaiting(frame) {
    this.drawBaseFields(frame, "#410912", "#071f5a");
    const step = Math.floor(this.nowMillis / 180);
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      const team = teamForTile(0, y);
      if (team === -1 || (y + step) % 5 !== 0) {
        continue;
      }
      fillFrameRect(frame, 0, y, FLOOR_COLS, 1, team === 0 ? redFieldColor : blueFieldColor);
    }
    this.drawRope(frame, 0);
  }
  drawStarting(frame) {
    this.drawBaseFields(frame, redFieldColor, blueFieldColor);
    paintDiamondWave(frame, {
      bandWidth: 2,
      period: 7,
      step: Math.floor(this.nowMillis / 90),
      color: ({ y }) => y < FLOOR_ROWS / 2 ? "#ff7b84" : "#79a0ff"
    });
    this.drawRope(frame, 0);
  }
  drawArena(frame) {
    const highlightedTeam = this.roundWinnerIndex;
    this.drawBaseFields(
      frame,
      highlightedTeam === 0 ? redColor3 : redFieldColor,
      highlightedTeam === 1 ? blueColor3 : blueFieldColor
    );
    this.drawRope(frame, this.ropePosition);
    for (let index = 0; index < this.flashUntil.length; index += 1) {
      if ((this.flashUntil[index] ?? 0) <= this.nowMillis) {
        continue;
      }
      const x = index % FLOOR_COLS;
      const y = Math.floor(index / FLOOR_COLS);
      const team = teamForTile(x, y);
      if (team !== -1) {
        paintFrameCell(frame, x, y, team === 0 ? "#ff8a92" : "#73a0ff");
      }
    }
  }
  drawRoundWin(frame) {
    const winner = this.roundWinnerIndex;
    if (winner === -1) {
      return;
    }
    const elapsed = Math.max(0, this.nowMillis - this.roundWonAtMillis);
    const centerY = winner === 0 ? 0 : FLOOR_ROWS - 1;
    paintDiamondRing(frame, {
      centerX: (FLOOR_COLS - 1) / 2,
      centerY,
      color: knotColor,
      radius: elapsed / 80 % 24,
      thickness: 1.4
    });
    paintDiamondRing(frame, {
      centerX: (FLOOR_COLS - 1) / 2,
      centerY,
      color: centerLineColor,
      radius: (elapsed / 80 + 7) % 24,
      thickness: 1
    });
  }
  drawGameWin(frame) {
    const winnerColor = this.winnerIndex === 0 ? redColor3 : blueColor3;
    fillFrameRect(frame, 0, 0, FLOOR_COLS, FLOOR_ROWS, winnerColor);
    const elapsed = Math.max(0, this.nowMillis - this.finishAtMillis);
    paintDiamondWave(frame, {
      bandWidth: 2,
      period: 9,
      step: Math.floor(elapsed / 80),
      color: centerLineColor
    });
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      for (let x = 0; x < FLOOR_COLS; x += 1) {
        if ((x * 17 + y * 11 + Math.floor(elapsed / 120)) % 37 === 0) {
          paintFrameCell(frame, x, y, knotColor);
        }
      }
    }
  }
  drawBaseFields(frame, red2, blue2) {
    fillFrameRect(frame, 0, 0, FLOOR_COLS, redFieldLastRow + 1, red2);
    fillFrameRect(
      frame,
      0,
      blueFieldFirstRow,
      FLOOR_COLS,
      FLOOR_ROWS - blueFieldFirstRow,
      blue2
    );
    fillFrameRect(frame, 0, 15, FLOOR_COLS, 2, centerLineColor);
  }
  drawRope(frame, position) {
    fillFrameRect(frame, 7, 0, 2, FLOOR_ROWS, ropeColor);
    const knotY = this.ropeTileY(position);
    fillFrameRect(frame, 5, knotY, 6, 1, knotColor);
    if (knotY > 0) {
      fillFrameRect(frame, 7, knotY - 1, 2, 1, knotColor);
    }
    if (knotY < FLOOR_ROWS - 1) {
      fillFrameRect(frame, 7, knotY + 1, 2, 1, knotColor);
    }
  }
};
function teamForTile(x, y) {
  if (!Number.isInteger(x) || !Number.isInteger(y) || !inFloorBounds(x, y)) {
    return -1;
  }
  if (y <= redFieldLastRow) {
    return 0;
  }
  if (y >= blueFieldFirstRow) {
    return 1;
  }
  return -1;
}
function teamLabel(team) {
  return team === 0 ? "Rojo" : "Azul";
}
function onRedTilePressed(game8, atMillis, x = 4, y = 8) {
  const events = game8.press({ x, y, pressed: true, atMillis });
  game8.release({ x, y, pressed: false, atMillis: atMillis + 1 });
  return events;
}
function onBlueTilePressed(game8, atMillis, x = 11, y = 24) {
  const events = game8.press({ x, y, pressed: true, atMillis });
  game8.release({ x, y, pressed: false, atMillis: atMillis + 1 });
  return events;
}

// games/tira-soga/src/fixtures.ts
var waitingGame3 = createGame21({ playerCount: 2, difficulty: "medium" });
var initEvents11 = waitingGame3.init(0);
var waitingFrame5 = waitingGame3.render();
var waitingSnapshot10 = waitingGame3.snapshot();
var startingGame3 = createGame21({ playerCount: 2, difficulty: "hard" });
startingGame3.init(0);
occupyReadyZones2(startingGame3, 100);
startingGame3.tick({ atMillis: 1100 });
var startingFrame4 = startingGame3.render();
var startingSnapshot8 = startingGame3.snapshot();
var runningGame10 = createGame21({ playerCount: 2, difficulty: "medium" });
runningGame10.init(0);
startGame3(runningGame10);
onRedTilePressed(runningGame10, 3200);
onRedTilePressed(runningGame10, 3300);
onBlueTilePressed(runningGame10, 3400);
onBlueTilePressed(runningGame10, 3500);
onBlueTilePressed(runningGame10, 3600);
onBlueTilePressed(runningGame10, 3700);
onBlueTilePressed(runningGame10, 3800);
var runningFrame19 = runningGame10.render();
var runningSnapshot19 = runningGame10.snapshot();
var roundWinGame4 = createGame21({ playerCount: 2, difficulty: "easy" });
roundWinGame4.init(0);
startGame3(roundWinGame4);
var roundWinTime = 3200;
for (let index = 0; index < ropeLimit; index += 1) {
  onRedTilePressed(roundWinGame4, roundWinTime);
  roundWinTime += 30;
}
roundWinGame4.tick({ atMillis: roundWinTime + 500 });
var roundWinFrame5 = roundWinGame4.render();
var roundWinSnapshot5 = roundWinGame4.snapshot();
var finishedGame8 = createGame21({ playerCount: 2, difficulty: "easy" });
finishedGame8.init(0);
startGame3(finishedGame8);
var fixtureTime = 3200;
function winFixtureRound(game8, team) {
  for (let index = 0; index < ropeLimit; index += 1) {
    if (team === 0) {
      onRedTilePressed(game8, fixtureTime);
    } else {
      onBlueTilePressed(game8, fixtureTime);
    }
    fixtureTime += 30;
  }
  if (game8.snapshot().phase !== "finished") {
    fixtureTime += roundWinAnimationMillis2;
    game8.tick({ atMillis: fixtureTime });
  }
}
for (const winner of [0, 1, 0, 1, 0]) {
  winFixtureRound(finishedGame8, winner);
}
finishedGame8.tick({ atMillis: fixtureTime + Math.floor(gameWinAnimationMillis5 / 3) });
var finishedFrame14 = finishedGame8.render();
var finishedSnapshot16 = finishedGame8.snapshot();
function occupyReadyZones2(game8, atMillis) {
  for (const zone of game8.playerReadyZones()) {
    game8.press({ x: zone.minX + 2, y: zone.minY + 2, pressed: true, atMillis });
  }
}
function startGame3(game8) {
  occupyReadyZones2(game8, 100);
  game8.tick({ atMillis: 3100 });
  for (const zone of game8.playerReadyZones()) {
    game8.release({ x: zone.minX + 2, y: zone.minY + 2, pressed: false, atMillis: 3101 });
  }
}

// games/tetris/src/index.ts
var src_exports22 = {};
__export(src_exports22, {
  PlayerDisplay: () => PlayerDisplay20,
  createGame: () => createGame22,
  manifest: () => manifest22,
  runningFrame: () => runningFrame20,
  runningSnapshot: () => runningSnapshot20,
  startingFrame: () => startingFrame5,
  startingSnapshot: () => startingSnapshot9,
  tetrisConfigVars: () => tetrisConfigVars,
  waitingFrame: () => waitingFrame6,
  waitingSnapshot: () => waitingSnapshot11
});

// games/tetris/src/display.tsx
var import_jsx_runtime23 = __toESM(require_jsx_runtime(), 1);
function PlayerDisplay20({ snapshot, frame }) {
  const result = resultCopy(snapshot);
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(GameDisplayShell, { title: snapshot.label, phase: snapshot.phase, children: /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { className: `tetris-display is-${snapshot.result}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(PlayerReadyOverlay, { snapshot }),
    /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("section", { className: "tetris-summary", children: [
      /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { className: "tetris-callout", children: [
        /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("span", { children: result.eyebrow }),
        /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("strong", { children: result.title }),
        /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("b", { children: result.caption })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)(MetricRow, { columns: 4, className: "tetris-metrics", children: [
        /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(MetricPanel, { label: "Puntos", tone: "cyan", value: snapshot.score }),
        /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(MetricPanel, { label: "L\xEDneas", tone: "yellow", value: `${snapshot.lines}/${snapshot.linesTarget}` }),
        /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(MetricPanel, { label: "Nivel", tone: "magenta", value: snapshot.level }),
        /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(MetricPanel, { label: "Tiempo", tone: "amber", value: formatClock(snapshot.elapsedMillis) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("section", { className: "tetris-main", children: [
      frame ? /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(FramePreviewPanel, { className: "tetris-floor", frame, label: "Pista de Tetris" }) : null,
      /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("aside", { className: "tetris-side", children: [
        /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(PieceCard, { label: "Pieza activa", piece: snapshot.activePiece }),
        /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(PieceCard, { label: "Siguiente", piece: snapshot.nextPiece }),
        /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("article", { className: "tetris-controls", children: [
          /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("span", { children: "Control f\xEDsico" }),
          /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("strong", { children: "\u2190 Rotar \xB7 Guiar \xB7 Rotar \u2192" }),
          /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("b", { children: "Baja al fondo para soltar" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("footer", { className: "tetris-event", children: [
      /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("span", { children: snapshot.result === "line-clear" ? "\xA1L\xEDnea!" : "\xDAltimo evento" }),
      /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("strong", { children: snapshot.lastEventMessage }, snapshot.motionEventId),
      /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("b", { children: eventDetail(snapshot) })
    ] })
  ] }) });
}
function PieceCard({ label, piece }) {
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("article", { className: "tetris-piece-card", style: { "--tetris-piece": piece.color }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("span", { children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { children: piece.cells.map(([x, y], index) => /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("i", { style: { gridColumn: x + 1, gridRow: y + 1 } }, index)) }),
    /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("strong", { children: shapeNames[piece.shape] ?? "Pieza" })
  ] });
}
var shapeNames = ["I", "O", "T", "S", "Z", "J", "L"];
function resultCopy(snapshot) {
  if (snapshot.result === "game-win") return { eyebrow: "Objetivo completado", title: "\xA1Tetris superado!", caption: `${snapshot.lines} l\xEDneas y ${snapshot.score} puntos` };
  if (snapshot.result === "game-loss") return { eyebrow: "Fin de partida", title: "Las piezas llegaron arriba", caption: "La pista se reinicia en unos segundos" };
  if (snapshot.result === "line-clear") return { eyebrow: "L\xEDnea eliminada", title: `+${snapshot.lastClearCount === 4 ? 800 : snapshot.lastClearCount * 100}`, caption: "La pista baja y el nivel contin\xFAa" };
  return { eyebrow: `Nivel ${snapshot.level}`, title: "Gu\xEDa la pieza", caption: "Usa todo el suelo para mover, rotar y soltar" };
}
function eventDetail(snapshot) {
  if (snapshot.phase === "finished") return `${snapshot.lines} ${snapshot.lines === 1 ? "l\xEDnea total" : "l\xEDneas totales"}`;
  if (snapshot.lastClearCount > 0) return `${snapshot.lastClearCount} ${snapshot.lastClearCount === 1 ? "l\xEDnea" : "l\xEDneas"}`;
  return `Objetivo ${snapshot.linesTarget}`;
}

// games/tetris/src/manifest.ts
var tetrisConfigVars = {
  linesToWin: { key: "lines_to_win", label: "L\xEDneas para ganar", playerFacing: true, description: "L\xEDneas que hay que eliminar para activar la celebraci\xF3n final.", type: "int", default: 10, min: 1, max: 40, step: 1 }
};
var manifest22 = {
  id: "tetris",
  label: "Tetris",
  description: "Gu\xEDa, rota y deja caer piezas f\xEDsicas en una pista cl\xE1sica de diez columnas.",
  availability: { development: true, production: true },
  catalog: { category: "arcade", color: "#36d9ff", durationLabel: "Sin l\xEDmite", modeLabel: "Tetris cl\xE1sico", audioLabel: "M\xFAsica + efectos", rules: ["Pisa una columna para guiar la pieza", "Pisa las diagonales junto a tu gu\xEDa para rotar", "Baja hasta el fondo para soltar la pieza y completa l\xEDneas"] },
  players: { allowAny: true, min: 1, max: 4 },
  start: { mode: "player-ready", releaseGraceMillis: 1500 },
  config: { difficulty: { default: "medium", options: ["easy", "medium", "hard"] }, vars: Object.values(tetrisConfigVars) },
  defaultDurationMillis: 0,
  display: { entry: "./display" },
  preview: { seed: 137, playerCount: 1, difficulty: "medium", options: { lines_to_win: 10 }, actions: [{ atMillis: 100, type: "press", x: 8, y: 29 }], captureStartMillis: 2200, frameCount: 18, frameIntervalMillis: 120 },
  tags: ["arcade", "puzzle", "classic", "typescript"]
};

// games/tetris/src/game.ts
var boardX = 3;
var boardWidth = 10;
var finishMillis = 4e3;
var rotateCooldownMillis = 180;
var palette = ["#36d9ff", "#ffd166", "#ff52c8", "#34c759", "#ff7a1a", "#0a84ff", "#ff3b30"];
var lineScores = [0, 100, 300, 500, 800];
var shapes = [
  [[[0, 0], [1, 0], [2, 0], [3, 0]], [[0, 0], [0, 1], [0, 2], [0, 3]], [[0, 0], [1, 0], [2, 0], [3, 0]], [[0, 0], [0, 1], [0, 2], [0, 3]]],
  [[[0, 0], [1, 0], [0, 1], [1, 1]], [[0, 0], [1, 0], [0, 1], [1, 1]], [[0, 0], [1, 0], [0, 1], [1, 1]], [[0, 0], [1, 0], [0, 1], [1, 1]]],
  [[[1, 0], [0, 1], [1, 1], [2, 1]], [[0, 0], [0, 1], [1, 1], [0, 2]], [[0, 0], [1, 0], [2, 0], [1, 1]], [[1, 0], [0, 1], [1, 1], [1, 2]]],
  [[[1, 0], [2, 0], [0, 1], [1, 1]], [[0, 0], [0, 1], [1, 1], [1, 2]], [[1, 0], [2, 0], [0, 1], [1, 1]], [[0, 0], [0, 1], [1, 1], [1, 2]]],
  [[[0, 0], [1, 0], [1, 1], [2, 1]], [[1, 0], [0, 1], [1, 1], [0, 2]], [[0, 0], [1, 0], [1, 1], [2, 1]], [[1, 0], [0, 1], [1, 1], [0, 2]]],
  [[[0, 0], [0, 1], [1, 1], [2, 1]], [[0, 0], [1, 0], [0, 1], [0, 2]], [[0, 0], [1, 0], [2, 0], [2, 1]], [[1, 0], [1, 1], [0, 2], [1, 2]]],
  [[[2, 0], [0, 1], [1, 1], [2, 1]], [[0, 0], [0, 1], [0, 2], [1, 2]], [[0, 0], [1, 0], [2, 0], [0, 1]], [[0, 0], [1, 0], [1, 1], [1, 2]]]
];
function createGame22(config) {
  return new TetrisGame(config);
}
var TetrisGame = class {
  config;
  rng;
  readyGate;
  board = [];
  active;
  next;
  phase = "waiting";
  result = "playing";
  nowMillis = 0;
  startedAtMillis = 0;
  lastFallMillis = 0;
  lastRotateMillis = -1e3;
  finishAtMillis = 0;
  lastClearMillis = 0;
  lastClearCount = 0;
  score = 0;
  lines = 0;
  level = 1;
  guideX = boardX + 5;
  guideY = FLOOR_ROWS - 1;
  motionEventId = 0;
  players = defaultPlayers(1);
  lastEvent = gameEvent("none", "Listo", 0);
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest22);
    this.rng = createSeededRng(this.config.seed);
    this.readyGate = createPlayerReadyGate(manifest22.start, [{ minX: 5, maxX: 10, minY: 28, maxY: 31 }], this.config.nowMillis);
    this.resetState(this.config.nowMillis);
  }
  init(nowMillis) {
    this.resetState(nowMillis);
    this.lastEvent = gameEvent("ready", "Entra en la zona de control", nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") return this.record(this.applyReady(this.readyGate.update(event), event.atMillis));
    if (this.phase !== "running" || !event.pressed) return [];
    if (event.y === this.guideY - 1 && event.x === this.guideX - 1) return this.rotate(-1, event.atMillis);
    if (event.y === this.guideY - 1 && event.x === this.guideX + 1) return this.rotate(1, event.atMillis);
    if (event.x < boardX || event.x >= boardX + boardWidth) return [];
    this.guideX = clamp(event.x, boardX + 1, boardX + boardWidth - 2);
    this.guideY = clamp(event.y, 1, FLOOR_ROWS - 1);
    const desiredX = clamp(event.x - Math.floor(pieceWidth(this.active) / 2), boardX, boardX + boardWidth - pieceWidth(this.active));
    if (!this.collides(this.active, desiredX, this.active.y, this.active.rotation)) this.active.x = desiredX;
    if (event.y >= FLOOR_ROWS - 2) return this.hardDrop(event.atMillis);
    return [];
  }
  release(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") return this.record(this.applyReady(this.readyGate.update({ ...event, pressed: false }), event.atMillis));
    return [];
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") return this.record(this.applyReady(this.readyGate.tick(event.atMillis), event.atMillis));
    if (this.phase === "finished") {
      if (event.atMillis - this.finishAtMillis >= finishMillis) {
        this.resetState(event.atMillis);
        return this.record([gameEvent("ready", "Nueva partida", event.atMillis)]);
      }
      return [];
    }
    if (this.result === "line-clear" && event.atMillis - this.lastClearMillis >= 550) this.result = "playing";
    const interval = gravityInterval(this.level, this.config.difficulty, this.guideY > this.active.y + 5);
    let steps = 0;
    while (event.atMillis - this.lastFallMillis >= interval && steps < 4 && this.phase === "running") {
      if (this.collides(this.active, this.active.x, this.active.y + 1, this.active.rotation)) return this.lockPiece(event.atMillis);
      this.active.y += 1;
      this.lastFallMillis += interval;
      steps += 1;
    }
    return [];
  }
  render() {
    const frame = createFrame("#05070a");
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      paintFrameCell(frame, boardX - 1, y, this.phase === "finished" ? "#67151f" : "#06131a");
      paintFrameCell(frame, boardX + boardWidth, y, this.phase === "finished" ? "#67151f" : "#06131a");
      for (let x = 0; x < boardWidth; x += 1) paintFrameCell(frame, boardX + x, y, this.board[y]?.[x] ?? "#020609");
    }
    if (this.phase === "waiting" || this.phase === "starting") {
      this.drawReady(frame);
      return frame;
    }
    if (this.phase === "finished") {
      this.drawFinish(frame);
      return frame;
    }
    this.drawPiece(frame, this.ghostPiece(), "#17404a");
    this.drawPiece(frame, this.active, this.active.color);
    if (this.board[this.guideY]?.[this.guideX - boardX] === null) paintFrameCell(frame, this.guideX, this.guideY, "#12303a");
    paintFrameCell(frame, this.guideX - 1, this.guideY - 1, "#7a1f61");
    paintFrameCell(frame, this.guideX + 1, this.guideY - 1, "#7a5f1f");
    if (this.lastClearCount > 0 && this.nowMillis - this.lastClearMillis < 350) for (let x = boardX; x < boardX + boardWidth; x += 1) paintFrameCell(frame, x, FLOOR_ROWS - 1, "#ffffff");
    for (let y = FLOOR_ROWS - Math.min(FLOOR_ROWS, this.lines); y < FLOOR_ROWS; y += 1) {
      paintFrameCell(frame, 0, y, "#ffd166");
      paintFrameCell(frame, FLOOR_COLS - 1, y, "#36d9ff");
    }
    return frame;
  }
  snapshot() {
    const ready = this.readyGate.state(this.nowMillis);
    const player = this.players[0];
    return {
      currentGame: manifest22.id,
      label: manifest22.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: [{ index: 0, label: player.label, color: player.color, score: this.score, lives: -1 }],
      score: this.score,
      lives: -1,
      elapsedMillis: this.phase === "waiting" || this.phase === "starting" ? 0 : Math.max(0, this.nowMillis - this.startedAtMillis),
      remainingMillis: this.phase === "finished" ? Math.max(0, this.finishAtMillis + finishMillis - this.nowMillis) : 0,
      activeTargets: this.phase === "running" ? 1 : 0,
      success: this.result === "game-win",
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? ready.countdownMillis : 0,
      readyPlayers: ready.readyPlayers,
      requiredPlayers: ready.requiredPlayers,
      result: this.result,
      lines: this.lines,
      level: this.level,
      linesTarget: this.linesToWin(),
      winnerLabel: player.label,
      activePiece: snapshotPiece(this.active),
      nextPiece: snapshotPiece(this.next),
      board: this.board.map((row) => [...row]),
      guideX: this.guideX,
      guideY: this.guideY,
      lastClearCount: this.lastClearCount,
      lineFlashMillis: Math.max(0, this.lastClearMillis + 550 - this.nowMillis),
      motionEventId: this.motionEventId
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest22);
    this.rng = createSeededRng(this.config.seed);
    this.readyGate.reset(this.config.nowMillis);
    this.resetState(this.config.nowMillis);
  }
  resetState(nowMillis) {
    this.rng = createSeededRng(this.config.seed);
    this.readyGate.reset(nowMillis);
    this.board = Array.from({ length: FLOOR_ROWS }, () => Array(boardWidth).fill(null));
    this.active = this.randomPiece();
    this.next = this.randomPiece();
    this.phase = "waiting";
    this.result = "playing";
    this.nowMillis = nowMillis;
    this.startedAtMillis = nowMillis;
    this.lastFallMillis = nowMillis;
    this.finishAtMillis = 0;
    this.lastClearMillis = 0;
    this.lastClearCount = 0;
    this.lastRotateMillis = -1e3;
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.guideX = boardX + 5;
    this.guideY = FLOOR_ROWS - 1;
    this.motionEventId = 0;
    const roster = defaultPlayers(Math.max(1, this.config.playerCount), this.config.players);
    const first = roster[0];
    this.players = [{ ...first, label: first.label === "Player 1" ? "Jugador" : first.label }];
    this.lastEvent = gameEvent("ready", "Entra en la zona de control", nowMillis);
  }
  applyReady(transition, nowMillis) {
    if (transition === "players-ready") {
      this.phase = "starting";
      this.motionEventId += 1;
      return [gameEvent("ready", "Control preparado", nowMillis)];
    }
    if (transition === "players-left") {
      this.phase = "waiting";
      this.motionEventId += 1;
      return [gameEvent("ready", "Vuelve a la zona de control", nowMillis)];
    }
    if (transition === "started") {
      this.phase = "running";
      this.startedAtMillis = nowMillis;
      this.lastFallMillis = nowMillis;
      this.motionEventId += 1;
      return [gameEvent("start", "Tetris en marcha", nowMillis)];
    }
    return [];
  }
  randomPiece() {
    const shape = this.rng.int(shapes.length);
    const piece = { shape, rotation: 0, x: 0, y: 0, color: palette[shape] };
    piece.x = boardX + Math.floor((boardWidth - pieceWidth(piece)) / 2);
    return piece;
  }
  rotate(direction, nowMillis) {
    if (nowMillis - this.lastRotateMillis < rotateCooldownMillis) return [];
    const rotation = (this.active.rotation + direction + 4) % 4;
    for (const kick of [0, -1, 1, -2, 2]) if (!this.collides(this.active, this.active.x + kick, this.active.y, rotation)) {
      this.active.x += kick;
      this.active.rotation = rotation;
      this.lastRotateMillis = nowMillis;
      this.motionEventId += 1;
      return this.record([gameEvent("tick", direction < 0 ? "Rotaci\xF3n izquierda" : "Rotaci\xF3n derecha", nowMillis)]);
    }
    return [];
  }
  hardDrop(nowMillis) {
    while (!this.collides(this.active, this.active.x, this.active.y + 1, this.active.rotation)) this.active.y += 1;
    return this.lockPiece(nowMillis);
  }
  lockPiece(nowMillis) {
    for (const [dx, dy] of pieceCells(this.active)) {
      const x = this.active.x + dx - boardX;
      const y = this.active.y + dy;
      if (y >= 0 && y < FLOOR_ROWS && x >= 0 && x < boardWidth) this.board[y][x] = this.active.color;
    }
    const cleared = this.clearLines();
    this.lastClearCount = cleared;
    if (cleared > 0) {
      this.lastClearMillis = nowMillis;
      this.lines += cleared;
      this.level = Math.floor(this.lines / 10) + 1;
      this.score += (lineScores[cleared] ?? 0) * this.level;
      this.result = "line-clear";
      this.motionEventId += 1;
      if (this.lines >= this.linesToWin()) return this.finish(true, nowMillis);
    }
    this.active = this.next;
    this.active.x = boardX + Math.floor((boardWidth - pieceWidth(this.active)) / 2);
    this.active.y = 0;
    this.next = this.randomPiece();
    this.guideX = this.active.x + Math.floor(pieceWidth(this.active) / 2);
    this.guideY = FLOOR_ROWS - 1;
    this.lastFallMillis = nowMillis;
    if (this.collides(this.active, this.active.x, this.active.y, this.active.rotation)) return this.finish(false, nowMillis);
    return cleared > 0 ? this.record([gameEvent("win", `${cleared === 1 ? "L\xEDnea" : `${cleared} l\xEDneas`} +${(lineScores[cleared] ?? 0) * this.level}`, nowMillis)]) : [];
  }
  clearLines() {
    let cleared = 0;
    for (let y = FLOOR_ROWS - 1; y >= 0; y -= 1) if (this.board[y].every(Boolean)) {
      this.board.splice(y, 1);
      this.board.unshift(Array(boardWidth).fill(null));
      cleared += 1;
      y += 1;
    }
    return cleared;
  }
  finish(success, nowMillis) {
    this.phase = "finished";
    this.result = success ? "game-win" : "game-loss";
    this.finishAtMillis = nowMillis;
    this.motionEventId += 1;
    const target3 = this.linesToWin();
    return this.record([gameEvent(success ? "win" : "fail", success ? `\xA1Objetivo de ${target3} ${target3 === 1 ? "l\xEDnea completado" : "l\xEDneas completado"}!` : "Las piezas llegaron arriba", nowMillis)]);
  }
  collides(piece, x, y, rotation) {
    return (shapes[piece.shape]?.[rotation] ?? []).some(([dx, dy]) => {
      const bx = x + dx - boardX;
      const by = y + dy;
      return bx < 0 || bx >= boardWidth || by >= FLOOR_ROWS || by >= 0 && this.board[by]?.[bx] !== null;
    });
  }
  ghostPiece() {
    const ghost = { ...this.active };
    while (!this.collides(ghost, ghost.x, ghost.y + 1, ghost.rotation)) ghost.y += 1;
    return ghost;
  }
  drawPiece(frame, piece, color) {
    for (const [dx, dy] of pieceCells(piece)) paintFrameCell(frame, piece.x + dx, piece.y + dy, color);
  }
  drawReady(frame) {
    const ready = this.readyGate.zoneReady(0, this.nowMillis);
    for (let y = 28; y < 32; y += 1) for (let x = 5; x <= 10; x += 1) if (ready || (x + y + Math.floor(this.nowMillis / 110)) % 4 < 2) paintFrameCell(frame, x, y, ready ? "#ffffff" : "#36d9ff");
  }
  drawFinish(frame) {
    const step = Math.floor((this.nowMillis - this.finishAtMillis) / 90);
    const color = this.result === "game-win" ? "#36d9ff" : "#ff3b30";
    for (let y = 0; y < FLOOR_ROWS; y += 1) for (let x = boardX; x < boardX + boardWidth; x += 1) if ((x + y + step) % 5 < 2) paintFrameCell(frame, x, y, color);
  }
  linesToWin() {
    return readGameConfigOption(this.config.options, tetrisConfigVars.linesToWin);
  }
  record(events) {
    const latest = events.at(-1);
    if (latest) this.lastEvent = latest;
    return events;
  }
};
function pieceCells(piece) {
  return shapes[piece.shape]?.[piece.rotation] ?? [];
}
function pieceWidth(piece) {
  const xs = pieceCells(piece).map(([x]) => x);
  return Math.max(...xs) - Math.min(...xs) + 1;
}
function snapshotPiece(piece) {
  return { shape: piece.shape, rotation: piece.rotation, x: piece.x, y: piece.y, color: piece.color, cells: pieceCells(piece).map((cell) => [...cell]) };
}
function gravityInterval(level, difficulty, fast) {
  const base = Math.max(100, 720 - (level - 1) * 45);
  const factor = difficulty === "easy" ? 1.25 : difficulty === "hard" ? 0.78 : 1;
  return Math.max(70, base * factor / (fast ? 3 : 1));
}

// games/tetris/src/fixtures.ts
function gameAt2(stage) {
  const game8 = createGame22({ playerCount: 1, seed: 137 });
  game8.init(0);
  if (stage !== "waiting") game8.press({ x: 8, y: 29, pressed: true, atMillis: 100 });
  if (stage === "running") game8.tick({ atMillis: 2200 });
  return game8;
}
var waiting2 = gameAt2("waiting");
var waitingFrame6 = waiting2.render();
var waitingSnapshot11 = waiting2.snapshot();
var starting2 = gameAt2("starting");
var startingFrame5 = starting2.render();
var startingSnapshot9 = starting2.snapshot();
var running = gameAt2("running");
running.press({ x: 5, y: 31, pressed: true, atMillis: 2300 });
var runningFrame20 = running.render();
var runningSnapshot20 = running.snapshot();

// games/whack-a-mole/src/index.ts
var src_exports23 = {};
__export(src_exports23, {
  PlayerDisplay: () => PlayerDisplay21,
  createGame: () => createGame23,
  finishedFrame: () => finishedFrame15,
  finishedSnapshot: () => finishedSnapshot17,
  manifest: () => manifest23,
  readyZonesForPlayers: () => readyZonesForPlayers,
  runningFrame: () => runningFrame21,
  runningSnapshot: () => runningSnapshot21,
  startingFrame: () => startingFrame6,
  startingSnapshot: () => startingSnapshot10,
  waitingFrame: () => waitingFrame7,
  waitingSnapshot: () => waitingSnapshot12
});

// games/whack-a-mole/src/display.tsx
var import_jsx_runtime24 = __toESM(require_jsx_runtime(), 1);
function PlayerDisplay21({ snapshot }) {
  const columns = snapshot.playerCount <= 4 ? 2 : snapshot.playerCount <= 6 ? 3 : 4;
  const leader = snapshot.playerProgress.reduce((best, player) => player.score > (snapshot.playerProgress[best]?.score ?? -1) ? player.index : best, 0);
  const hero = heroContent4(snapshot);
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(GameDisplayShell, { title: snapshot.label, phase: snapshot.phase, children: /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: `duelo-display whack-display is-phase-${snapshot.phase}`, style: { "--duelo-grid-columns": columns }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("section", { className: "duelo-hero", children: [
      /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "duelo-hero-copy", children: [
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("span", { children: hero.eyebrow }),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("strong", { children: hero.title }),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("b", { children: hero.caption })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "duelo-hero-metrics", children: [
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Metric2, { label: "Tiempo", value: formatClock(snapshot.remainingMillis) }),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Metric2, { label: "Topos", value: snapshot.activeTargets }),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Metric2, { label: "Puntos", value: snapshot.score })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("section", { className: "duelo-player-grid", "aria-label": "Puntuaci\xF3n de jugadores", children: snapshot.playerProgress.map((player) => /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(PlayerCard3, { player, leader: leader === player.index, ready: snapshot.readyPlayerIndices.includes(player.index), winner: snapshot.winnerIndex === player.index }, player.index)) }),
    /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("footer", { className: "duelo-event-rail", children: [
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("span", { children: snapshot.phase === "finished" ? "Resultado" : "\xDAltimo evento" }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("strong", { children: snapshot.lastEventMessage }, snapshot.motionEventId),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("b", { children: snapshot.phase === "running" ? `${snapshot.activeTargets} objetivos activos` : `${snapshot.readyPlayers}/${snapshot.requiredPlayers} listos` })
    ] })
  ] }) });
}
function PlayerCard3({ player, leader, ready, winner }) {
  const style = { "--duelo-player": player.color, "--duelo-player-rgb": hexToRgb5(player.color), "--duelo-progress": Math.min(1, player.score / 100) };
  const status = winner ? "Ganador" : leader && player.score > 0 ? "L\xEDder" : ready ? "Listo" : "Busca tu color";
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("article", { className: `duelo-player-card${winner ? " is-winner" : ""}${leader ? " is-leader" : ""}`, style, children: [
    /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("header", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("i", {}),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("span", { className: "duelo-player-name", children: player.label }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("b", { children: status })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "duelo-player-score", children: [
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("strong", { children: player.score }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("span", { children: "puntos" }),
      player.lastPoints > 0 ? /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("em", { children: [
        "+",
        player.lastPoints
      ] }, `${player.index}-${player.hits}`) : null
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { className: "duelo-player-track", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("i", {}) }),
    /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("footer", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("span", { children: "Topos atrapados" }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("strong", { children: player.hits })
    ] })
  ] });
}
function Metric2({ label, value }) {
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("article", { className: "duelo-hero-metric", children: [
    /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("span", { children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("strong", { children: value })
  ] });
}
function heroContent4(snapshot) {
  if (snapshot.phase === "waiting") return { eyebrow: `Listos ${snapshot.readyPlayers}/${snapshot.requiredPlayers}`, title: "Busca tu plataforma", caption: "Cada jugador permanece sobre su color" };
  if (snapshot.phase === "starting") return { eyebrow: "Todos listos", title: String(Math.max(1, Math.ceil((snapshot.countdownMillis ?? 0) / 1e3))), caption: "Los topos est\xE1n a punto de aparecer" };
  if (snapshot.phase === "finished") return { eyebrow: "Tiempo", title: `\xA1Gana ${snapshot.winnerLabel}!`, caption: "M\xE1s velocidad, m\xE1s puntos" };
  return { eyebrow: "Todos contra todos", title: "\xA1Atrapa los topos!", caption: "Corre hacia los cuadrados de colores antes de que se apaguen" };
}
function hexToRgb5(color) {
  return /^#[0-9a-f]{6}$/i.test(color) ? [1, 3, 5].map((offset) => Number.parseInt(color.slice(offset, offset + 2), 16)).join(", ") : "255, 255, 255";
}

// games/whack-a-mole/src/manifest.ts
var manifest23 = {
  id: "whack-a-mole",
  label: "Atrapa al topo",
  description: "Persigue objetivos de colores por todo el suelo y atr\xE1palos antes de que se apaguen.",
  availability: { development: true, production: true },
  catalog: {
    category: "versus",
    color: "#36d9ff",
    durationLabel: "60 s",
    modeLabel: "Todos contra todos",
    audioLabel: "M\xFAsica + efectos",
    rules: ["Cada jugador ocupa su plataforma de salida", "Pisa los objetivos de tu color antes de que desaparezcan", "Cuanto m\xE1s r\xE1pido llegues, m\xE1s puntos ganas"]
  },
  players: { allowAny: false, min: 1, max: 8 },
  start: { mode: "player-ready", releaseGraceMillis: 1200 },
  config: { difficulty: { default: "medium", options: ["easy", "medium"] } },
  defaultDurationMillis: 6e4,
  display: { entry: "./display" },
  preview: {
    seed: 404,
    playerCount: 4,
    difficulty: "medium",
    actions: [{ atMillis: 100, type: "press", x: 0, y: 0 }, { atMillis: 100, type: "press", x: 12, y: 28 }, { atMillis: 100, type: "press", x: 0, y: 28 }, { atMillis: 100, type: "press", x: 12, y: 0 }],
    captureStartMillis: 2300,
    frameCount: 18,
    frameIntervalMillis: 120
  },
  tags: ["arcade", "reaction", "multiplayer", "typescript"]
};

// games/whack-a-mole/src/game.ts
var targetSize = 2;
var finishMillis2 = 4e3;
var hitFlashMillis = 500;
var baseLifeMillis = 3400;
var minLifeMillis = 2300;
function createGame23(config) {
  return new WhackAMoleGame(config);
}
var WhackAMoleGame = class {
  config;
  rng;
  readyZones;
  readyGate;
  players = [];
  targets = [];
  lastPositions = [];
  catchUp = [];
  hitFlash = [];
  phase = "waiting";
  nowMillis = 0;
  startedAtMillis = 0;
  finishAtMillis = 0;
  winnerIndex = -1;
  motionEventId = 0;
  lastEvent = gameEvent("none", "Listo", 0);
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest23);
    this.rng = createSeededRng(this.config.seed);
    this.readyZones = readyZonesForPlayers(this.config.playerCount);
    this.readyGate = createPlayerReadyGate(manifest23.start, this.readyZones, this.config.nowMillis);
    this.resetState(this.config.nowMillis);
  }
  init(nowMillis) {
    this.resetState(nowMillis);
    this.lastEvent = gameEvent("ready", "Busca tu plataforma de color", nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") return this.record(this.applyReady(this.readyGate.update(event), event.atMillis));
    if (this.phase !== "running" || !event.pressed) return [];
    const targetIndex = this.targets.findIndex((target4) => event.atMillis < target4.deadlineMillis && containsTarget(target4, event.x, event.y));
    if (targetIndex < 0) return this.record([gameEvent("miss", "No hab\xEDa ning\xFAn topo ah\xED", event.atMillis)]);
    const target3 = this.targets[targetIndex];
    const player = this.players[target3.playerIndex];
    const points = targetScore(target3, event.atMillis);
    player.score += points;
    player.hits += 1;
    player.lastPoints = points;
    for (let dy = 0; dy < targetSize; dy += 1) for (let dx = 0; dx < targetSize; dx += 1) this.hitFlash.push({ x: target3.x + dx, y: target3.y + dy, untilMillis: event.atMillis + hitFlashMillis, color: player.color });
    this.lastPositions[target3.playerIndex] = { x: target3.x, y: target3.y };
    this.targets.splice(targetIndex, 1);
    this.spawnTarget(target3.playerIndex, event.atMillis);
    this.motionEventId += 1;
    return this.record([gameEvent("hit", `${player.label} +${points}`, event.atMillis)]);
  }
  release(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") return this.record(this.applyReady(this.readyGate.update({ ...event, pressed: false }), event.atMillis));
    return [];
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") return this.record(this.applyReady(this.readyGate.tick(event.atMillis), event.atMillis));
    if (this.phase === "finished") {
      if (event.atMillis - this.finishAtMillis >= finishMillis2) {
        this.resetState(event.atMillis);
        return this.record([gameEvent("ready", "Nueva caza", event.atMillis)]);
      }
      return [];
    }
    this.hitFlash = this.hitFlash.filter((flash) => flash.untilMillis > event.atMillis);
    const expired = this.targets.filter((target3) => event.atMillis >= target3.deadlineMillis);
    for (const target3 of expired) {
      this.catchUp[target3.playerIndex] = true;
      this.targets = this.targets.filter((candidate) => candidate !== target3);
      this.spawnTarget(target3.playerIndex, event.atMillis);
    }
    if (this.remainingMillis() <= 0) return this.finish(event.atMillis);
    return [];
  }
  render() {
    const frame = createFrame("#05070a");
    if (this.phase === "waiting" || this.phase === "starting") {
      this.drawReadiness(frame);
      return frame;
    }
    if (this.phase === "finished") {
      this.drawFinish(frame);
      return frame;
    }
    for (const target3 of this.targets) {
      const player = this.players[target3.playerIndex];
      const ratio = clamp((target3.deadlineMillis - this.nowMillis) / Math.max(1, target3.deadlineMillis - target3.bornMillis), 0.16, 1);
      const color = scaleHex(player.color, ratio);
      for (let dy = 0; dy < targetSize; dy += 1) for (let dx = 0; dx < targetSize; dx += 1) paintFrameCell(frame, target3.x + dx, target3.y + dy, color);
    }
    for (const flash of this.hitFlash) paintFrameCell(frame, flash.x, flash.y, "#ffffff");
    return frame;
  }
  snapshot() {
    const ready = this.readyGate.state(this.nowMillis);
    return {
      currentGame: manifest23.id,
      label: manifest23.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: this.players.map((player) => ({ index: player.index, label: player.label, color: player.color, score: player.score, lives: -1 })),
      score: this.players.reduce((sum, player) => sum + player.score, 0),
      lives: -1,
      elapsedMillis: this.elapsedMillis(),
      remainingMillis: this.phase === "finished" ? Math.max(0, this.finishAtMillis + finishMillis2 - this.nowMillis) : this.remainingMillis(),
      activeTargets: this.targets.length,
      success: this.phase === "finished",
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? ready.countdownMillis : 0,
      readyPlayers: ready.readyPlayers,
      requiredPlayers: ready.requiredPlayers,
      targets: this.targets.map((target3) => ({ ...target3, remainingMillis: Math.max(0, target3.deadlineMillis - this.nowMillis) })),
      playerProgress: this.players.map((player) => ({ ...player })),
      readyPlayerIndices: this.readyZones.flatMap((_, index) => this.readyGate.zoneReady(index, this.nowMillis) ? [index] : []),
      winnerIndex: this.winnerIndex,
      winnerLabel: this.players[this.winnerIndex]?.label ?? "",
      motionEventId: this.motionEventId
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest23);
    this.rng = createSeededRng(this.config.seed);
    this.readyZones = readyZonesForPlayers(this.config.playerCount);
    this.readyGate = createPlayerReadyGate(manifest23.start, this.readyZones, this.config.nowMillis);
    this.resetState(this.config.nowMillis);
  }
  playerReadyZones() {
    return this.readyZones.map((zone) => ({ ...zone }));
  }
  resetState(nowMillis) {
    this.rng = createSeededRng(this.config.seed);
    this.readyGate.reset(nowMillis);
    const roster = defaultPlayers(this.config.playerCount, this.config.players);
    this.players = roster.map((player, index) => ({ index, label: player.label === `Player ${index + 1}` ? `Jugador ${index + 1}` : player.label, color: player.color, score: 0, hits: 0, lastPoints: 0 }));
    this.targets = [];
    this.lastPositions = [];
    this.catchUp = [];
    this.hitFlash = [];
    this.phase = "waiting";
    this.nowMillis = nowMillis;
    this.startedAtMillis = nowMillis;
    this.finishAtMillis = 0;
    this.winnerIndex = -1;
    this.motionEventId = 0;
    this.lastEvent = gameEvent("ready", "Busca tu plataforma de color", nowMillis);
  }
  applyReady(transition, nowMillis) {
    if (transition === "players-ready") {
      this.phase = "starting";
      this.motionEventId += 1;
      return [gameEvent("ready", "Todos listos para cazar", nowMillis)];
    }
    if (transition === "players-left") {
      this.phase = "waiting";
      this.motionEventId += 1;
      return [gameEvent("ready", "Vuelve a tu plataforma", nowMillis)];
    }
    if (transition === "started") {
      this.phase = "running";
      this.startedAtMillis = nowMillis;
      this.targets = [];
      this.players.forEach((_, index) => this.spawnTarget(index, nowMillis));
      this.motionEventId += 1;
      return [gameEvent("start", "\xA1Atrapa los topos de colores!", nowMillis)];
    }
    return [];
  }
  spawnTarget(playerIndex, nowMillis) {
    let chosen = { x: this.rng.int(FLOOR_COLS - 1), y: this.rng.int(FLOOR_ROWS - 1) };
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const candidate = { x: this.rng.int(FLOOR_COLS - targetSize + 1), y: this.rng.int(FLOOR_ROWS - targetSize + 1) };
      const last = this.lastPositions[playerIndex];
      const distance = last ? (candidate.x - last.x) ** 2 + (candidate.y - last.y) ** 2 : 64;
      const clear = this.targets.every((target3) => Math.abs(candidate.x - target3.x) >= 4 || Math.abs(candidate.y - target3.y) >= 4);
      if (clear && distance >= 25 && distance <= 225) {
        chosen = candidate;
        break;
      }
    }
    const interval = this.targetInterval();
    const extra = this.catchUp[playerIndex] ? 2e3 : 0;
    this.catchUp[playerIndex] = false;
    this.targets.push({ playerIndex, ...chosen, bornMillis: nowMillis, deadlineMillis: nowMillis + interval + 1e3 + extra });
  }
  targetInterval() {
    const progress = clamp(this.elapsedMillis() / this.config.durationMillis, 0, 1);
    const base = baseLifeMillis - 1e3;
    const drop = baseLifeMillis - minLifeMillis;
    const difficulty = this.config.difficulty === "easy" ? 1.18 : 1;
    return (base - progress * drop) * difficulty;
  }
  finish(atMillis) {
    this.phase = "finished";
    this.finishAtMillis = atMillis;
    this.targets = [];
    this.winnerIndex = this.players.reduce((best, player, index) => player.score > (this.players[best]?.score ?? -1) ? index : best, 0);
    this.motionEventId += 1;
    return this.record([gameEvent("win", `\xA1Gana ${this.players[this.winnerIndex]?.label}!`, atMillis)]);
  }
  elapsedMillis() {
    return this.phase === "waiting" || this.phase === "starting" ? 0 : Math.max(0, this.nowMillis - this.startedAtMillis);
  }
  remainingMillis() {
    return Math.max(0, this.config.durationMillis - this.elapsedMillis());
  }
  record(events) {
    const latest = events.at(-1);
    if (latest) this.lastEvent = latest;
    return events;
  }
  drawReadiness(frame) {
    this.players.forEach((player, index) => {
      const zone = this.readyZones[index];
      const ready = this.readyGate.zoneReady(index, this.nowMillis);
      for (let y = zone.minY; y <= zone.maxY; y += 1) for (let x = zone.minX; x <= zone.maxX; x += 1) if (ready || (x + y + Math.floor(this.nowMillis / 120)) % 4 < 2) paintFrameCell(frame, x, y, ready ? "#ffffff" : player.color);
    });
  }
  drawFinish(frame) {
    const winner = this.players[this.winnerIndex];
    const step = Math.floor((this.nowMillis - this.finishAtMillis) / 90);
    for (let y = 0; y < FLOOR_ROWS; y += 1) for (let x = 0; x < FLOOR_COLS; x += 1) if ((x * 2 + y + step) % 7 < 3) paintFrameCell(frame, x, y, winner?.color ?? "#36d9ff");
  }
};
function readyZonesForPlayers(count) {
  const points = [[0, 0], [12, 28], [0, 28], [12, 0], [0, 14], [12, 14], [6, 0], [6, 28]];
  return points.slice(0, clamp(Math.trunc(count), 1, 8)).map(([x = 0, y = 0]) => ({ minX: x, maxX: x + 3, minY: y, maxY: y + 3 }));
}
function containsTarget(target3, x, y) {
  return x >= target3.x && x < target3.x + targetSize && y >= target3.y && y < target3.y + targetSize;
}
function targetScore(target3, nowMillis) {
  const total = Math.max(1, target3.deadlineMillis - target3.bornMillis);
  return 4 + Math.ceil(clamp((target3.deadlineMillis - nowMillis) / total, 0, 1) * 8);
}
function scaleHex(color, factor) {
  const value = color.replace("#", "");
  const parts = [0, 2, 4].map((offset) => Math.round(Number.parseInt(value.slice(offset, offset + 2), 16) * factor).toString(16).padStart(2, "0"));
  return `#${parts.join("")}`;
}

// games/whack-a-mole/src/fixtures.ts
function create(stage) {
  const game8 = createGame23({ playerCount: 4, seed: 404, durationMillis: stage === "finished" ? 3e3 : 6e4 });
  game8.init(0);
  if (stage !== "waiting") occupy2(game8);
  if (stage === "running" || stage === "finished") game8.tick({ atMillis: 2200 });
  if (stage === "finished") game8.tick({ atMillis: 5300 });
  return game8;
}
var waiting3 = create("waiting");
var waitingFrame7 = waiting3.render();
var waitingSnapshot12 = waiting3.snapshot();
var starting3 = create("starting");
var startingFrame6 = starting3.render();
var startingSnapshot10 = starting3.snapshot();
var running2 = create("running");
var target2 = running2.snapshot().targets[1];
running2.press({ x: target2.x, y: target2.y, pressed: true, atMillis: 2300 });
var runningFrame21 = running2.render();
var runningSnapshot21 = running2.snapshot();
var finished2 = create("finished");
var finishedFrame15 = finished2.render();
var finishedSnapshot17 = finished2.snapshot();
function occupy2(game8) {
  game8.playerReadyZones().forEach((zone) => game8.press({ x: zone.minX, y: zone.minY, pressed: true, atMillis: 100 }));
}

// packages/runner/src/registry.ts
var registeredGames = [
  src_exports2,
  src_exports,
  src_exports3,
  src_exports4,
  src_exports5,
  src_exports6,
  src_exports7,
  src_exports8,
  src_exports9,
  src_exports10,
  src_exports11,
  src_exports12,
  src_exports13,
  src_exports14,
  src_exports15,
  src_exports16,
  src_exports17,
  src_exports18,
  src_exports19,
  src_exports20,
  src_exports22,
  src_exports21,
  src_exports23
];
var gameRegistry = buildGameRegistry(registeredGames);
var gamePackageRegistry = new Map(
  registeredGames.map((game8) => [gameManifestSlug(game8.manifest), game8])
);
var gameCatalog = registeredGames.map((game8) => game8.manifest).sort((left, right) => left.id.localeCompare(right.id));
function buildGameRegistry(games) {
  const registry = /* @__PURE__ */ new Map();
  for (const game8 of games) {
    for (const key of gameManifestLookupKeys(game8.manifest)) {
      const existing = registry.get(key);
      if (existing && existing !== game8) {
        throw new Error(
          `game identity collision: ${key} is declared by ${existing.manifest.id} and ${game8.manifest.id}`
        );
      }
      registry.set(key, game8);
    }
  }
  return registry;
}

// packages/runner/src/session.ts
var RunnerSession = class {
  engine = null;
  gameId = "";
  initialConfig = null;
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
    const gameId = normalizeGameLookupKey(params?.gameId);
    const module = gameRegistry.get(gameId);
    if (!module) throw new Error(`unknown game: ${gameId}`);
    if (!module.manifest.availability.production && params.development !== true) {
      throw new Error(`game is not production eligible: ${gameId}`);
    }
    const config = normalizeGameConfig(params, module.manifest);
    const game8 = module.createGame(config);
    const events = game8.init(config.nowMillis);
    this.engine = createGameEngine(game8, { initialEvents: events, nowMillis: config.nowMillis });
    this.gameId = module.manifest.id;
    this.initialConfig = config;
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
      if (!module || !this.initialConfig) throw new Error("runner has no active game");
      const config = this.initialConfig;
      const game8 = module.createGame(config);
      const events = game8.init(config.nowMillis);
      this.engine = createGameEngine(game8, { initialEvents: events, nowMillis: config.nowMillis });
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

// packages/runner/src/telemetry.ts
import { performance as performance2 } from "node:perf_hooks";
var methods = ["init", "input", "control", "tick", "status"];
var RunnerTelemetryCollector = class {
  startedAt = performance2.now();
  requestsTotal = 0;
  errorsTotal = 0;
  methodTotals = /* @__PURE__ */ new Map();
  lastMethod = "invalid";
  lastRequestDurationMicros = 0;
  observe(method, startedAt, failed2 = false) {
    this.requestsTotal += 1;
    if (failed2) this.errorsTotal += 1;
    if (method !== "invalid") {
      this.methodTotals.set(method, (this.methodTotals.get(method) ?? 0) + 1);
    }
    this.lastMethod = method;
    this.lastRequestDurationMicros = Math.max(0, Math.round((performance2.now() - startedAt) * 1e3));
    return this.snapshot();
  }
  snapshot() {
    const memory = process.memoryUsage();
    const totals = Object.fromEntries(methods.map((method) => [`${method}Total`, this.methodTotals.get(method) ?? 0]));
    return {
      uptimeMillis: Math.max(0, Math.round(performance2.now() - this.startedAt)),
      requestsTotal: this.requestsTotal,
      errorsTotal: this.errorsTotal,
      ...totals,
      lastMethod: this.lastMethod,
      lastRequestDurationMicros: this.lastRequestDurationMicros,
      rssBytes: memory.rss,
      heapUsedBytes: memory.heapUsed
    };
  }
};

// packages/runner/src/runner.ts
var sourceRevision = true ? "1e9bf17c59da8b5c51b3acc4e580852bc00eab76" : "development";
var session = new RunnerSession();
var telemetry = new RunnerTelemetryCollector();
var input = createInterface({ input: process.stdin, crlfDelay: Infinity });
input.on("line", (line) => {
  let id = "";
  let method = "invalid";
  const startedAt = performance.now();
  try {
    const request = JSON.parse(line);
    id = String(request.id || "");
    if (!isRunnerMethod(request.method)) throw new Error(`unsupported runner method: ${String(request.method)}`);
    method = request.method;
    if (request.version !== runnerProtocolVersion) throw new Error(`unsupported protocol version: ${request.version}`);
    if (!id) throw new Error("request id is required");
    const state = session.handle(request);
    const response = {
      version: runnerProtocolVersion,
      id,
      ok: true,
      sourceRevision,
      telemetry: telemetry.observe(method, startedAt),
      state
    };
    process.stdout.write(`${JSON.stringify(response)}
`);
  } catch (error) {
    const response = {
      version: runnerProtocolVersion,
      id,
      ok: false,
      sourceRevision,
      telemetry: telemetry.observe(method, startedAt, true),
      error: error instanceof Error ? error.message : String(error)
    };
    process.stdout.write(`${JSON.stringify(response)}
`);
  }
});
function isRunnerMethod(value) {
  return value === "init" || value === "input" || value === "control" || value === "tick" || value === "status";
}
