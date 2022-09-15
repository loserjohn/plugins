(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["yl"] = factory();
	else
		root["yl"] = factory();
})((typeof self !== 'undefined' ? self : this), function() {
return /******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 9669:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(1609);

/***/ }),

/***/ 5448:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);
var settle = __webpack_require__(6026);
var cookies = __webpack_require__(4372);
var buildURL = __webpack_require__(5327);
var buildFullPath = __webpack_require__(4097);
var parseHeaders = __webpack_require__(4109);
var isURLSameOrigin = __webpack_require__(7985);
var transitionalDefaults = __webpack_require__(7874);
var AxiosError = __webpack_require__(2648);
var CanceledError = __webpack_require__(644);
var parseProtocol = __webpack_require__(205);

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;
    var onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled);
      }
    }

    if (utils.isFormData(requestData) && utils.isStandardBrowserEnv()) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);

    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(new AxiosError('Request aborted', AxiosError.ECONNABORTED, config, request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
      var transitional = config.transitional || transitionalDefaults;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(new AxiosError(
        timeoutErrorMessage,
        transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
        config,
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = function(cancel) {
        if (!request) {
          return;
        }
        reject(!cancel || (cancel && cancel.type) ? new CanceledError() : cancel);
        request.abort();
        request = null;
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
      }
    }

    if (!requestData) {
      requestData = null;
    }

    var protocol = parseProtocol(fullPath);

    if (protocol && [ 'http', 'https', 'file' ].indexOf(protocol) === -1) {
      reject(new AxiosError('Unsupported protocol ' + protocol + ':', AxiosError.ERR_BAD_REQUEST, config));
      return;
    }


    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ 1609:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);
var bind = __webpack_require__(1849);
var Axios = __webpack_require__(321);
var mergeConfig = __webpack_require__(7185);
var defaults = __webpack_require__(5546);

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Expose Cancel & CancelToken
axios.CanceledError = __webpack_require__(644);
axios.CancelToken = __webpack_require__(4972);
axios.isCancel = __webpack_require__(6502);
axios.VERSION = (__webpack_require__(7288).version);
axios.toFormData = __webpack_require__(7675);

// Expose AxiosError class
axios.AxiosError = __webpack_require__(2648);

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(8713);

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(6268);

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports["default"] = axios;


/***/ }),

/***/ 4972:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var CanceledError = __webpack_require__(644);

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;

  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;

  // eslint-disable-next-line func-names
  this.promise.then(function(cancel) {
    if (!token._listeners) return;

    var i;
    var l = token._listeners.length;

    for (i = 0; i < l; i++) {
      token._listeners[i](cancel);
    }
    token._listeners = null;
  });

  // eslint-disable-next-line func-names
  this.promise.then = function(onfulfilled) {
    var _resolve;
    // eslint-disable-next-line func-names
    var promise = new Promise(function(resolve) {
      token.subscribe(resolve);
      _resolve = resolve;
    }).then(onfulfilled);

    promise.cancel = function reject() {
      token.unsubscribe(_resolve);
    };

    return promise;
  };

  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new CanceledError(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `CanceledError` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Subscribe to the cancel signal
 */

CancelToken.prototype.subscribe = function subscribe(listener) {
  if (this.reason) {
    listener(this.reason);
    return;
  }

  if (this._listeners) {
    this._listeners.push(listener);
  } else {
    this._listeners = [listener];
  }
};

/**
 * Unsubscribe from the cancel signal
 */

CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
  if (!this._listeners) {
    return;
  }
  var index = this._listeners.indexOf(listener);
  if (index !== -1) {
    this._listeners.splice(index, 1);
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ 644:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var AxiosError = __webpack_require__(2648);
var utils = __webpack_require__(4867);

/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function CanceledError(message) {
  // eslint-disable-next-line no-eq-null,eqeqeq
  AxiosError.call(this, message == null ? 'canceled' : message, AxiosError.ERR_CANCELED);
  this.name = 'CanceledError';
}

utils.inherits(CanceledError, AxiosError, {
  __CANCEL__: true
});

module.exports = CanceledError;


/***/ }),

/***/ 6502:
/***/ (function(module) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ 321:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);
var buildURL = __webpack_require__(5327);
var InterceptorManager = __webpack_require__(782);
var dispatchRequest = __webpack_require__(3572);
var mergeConfig = __webpack_require__(7185);
var buildFullPath = __webpack_require__(4097);
var validator = __webpack_require__(4875);

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(configOrUrl, config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof configOrUrl === 'string') {
    config = config || {};
    config.url = configOrUrl;
  } else {
    config = configOrUrl || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean),
      forcedJSONParsing: validators.transitional(validators.boolean),
      clarifyTimeoutError: validators.transitional(validators.boolean)
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  var fullPath = buildFullPath(config.baseURL, config.url);
  return buildURL(fullPath, config.params, config.paramsSerializer);
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/

  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request(mergeConfig(config || {}, {
        method: method,
        headers: isForm ? {
          'Content-Type': 'multipart/form-data'
        } : {},
        url: url,
        data: data
      }));
    };
  }

  Axios.prototype[method] = generateHTTPMethod();

  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
});

module.exports = Axios;


/***/ }),

/***/ 2648:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
function AxiosError(message, code, config, request, response) {
  Error.call(this);
  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  response && (this.response = response);
}

utils.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});

var prototype = AxiosError.prototype;
var descriptors = {};

[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED'
// eslint-disable-next-line func-names
].forEach(function(code) {
  descriptors[code] = {value: code};
});

Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype, 'isAxiosError', {value: true});

// eslint-disable-next-line func-names
AxiosError.from = function(error, code, config, request, response, customProps) {
  var axiosError = Object.create(prototype);

  utils.toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  });

  AxiosError.call(axiosError, error.message, code, config, request, response);

  axiosError.name = error.name;

  customProps && Object.assign(axiosError, customProps);

  return axiosError;
};

module.exports = AxiosError;


/***/ }),

/***/ 782:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ 4097:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var isAbsoluteURL = __webpack_require__(1793);
var combineURLs = __webpack_require__(7303);

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ 3572:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);
var transformData = __webpack_require__(8527);
var isCancel = __webpack_require__(6502);
var defaults = __webpack_require__(5546);
var CanceledError = __webpack_require__(644);

/**
 * Throws a `CanceledError` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new CanceledError();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ 7185:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(prop) {
    if (prop in config2) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  var mergeMap = {
    'url': valueFromConfig2,
    'method': valueFromConfig2,
    'data': valueFromConfig2,
    'baseURL': defaultToConfig2,
    'transformRequest': defaultToConfig2,
    'transformResponse': defaultToConfig2,
    'paramsSerializer': defaultToConfig2,
    'timeout': defaultToConfig2,
    'timeoutMessage': defaultToConfig2,
    'withCredentials': defaultToConfig2,
    'adapter': defaultToConfig2,
    'responseType': defaultToConfig2,
    'xsrfCookieName': defaultToConfig2,
    'xsrfHeaderName': defaultToConfig2,
    'onUploadProgress': defaultToConfig2,
    'onDownloadProgress': defaultToConfig2,
    'decompress': defaultToConfig2,
    'maxContentLength': defaultToConfig2,
    'maxBodyLength': defaultToConfig2,
    'beforeRedirect': defaultToConfig2,
    'transport': defaultToConfig2,
    'httpAgent': defaultToConfig2,
    'httpsAgent': defaultToConfig2,
    'cancelToken': defaultToConfig2,
    'socketPath': defaultToConfig2,
    'responseEncoding': defaultToConfig2,
    'validateStatus': mergeDirectKeys
  };

  utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
    var merge = mergeMap[prop] || mergeDeepProperties;
    var configValue = merge(prop);
    (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
};


/***/ }),

/***/ 6026:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var AxiosError = __webpack_require__(2648);

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(new AxiosError(
      'Request failed with status code ' + response.status,
      [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ 8527:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);
var defaults = __webpack_require__(5546);

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};


/***/ }),

/***/ 5546:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);
var normalizeHeaderName = __webpack_require__(6016);
var AxiosError = __webpack_require__(2648);
var transitionalDefaults = __webpack_require__(7874);
var toFormData = __webpack_require__(7675);

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(5448);
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(5448);
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {

  transitional: transitionalDefaults,

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }

    var isObjectPayload = utils.isObject(data);
    var contentType = headers && headers['Content-Type'];

    var isFileList;

    if ((isFileList = utils.isFileList(data)) || (isObjectPayload && contentType === 'multipart/form-data')) {
      var _FormData = this.env && this.env.FormData;
      return toFormData(isFileList ? {'files[]': data} : data, _FormData && new _FormData());
    } else if (isObjectPayload || contentType === 'application/json') {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }

    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional || defaults.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  env: {
    FormData: __webpack_require__(1623)
  },

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ 7874:
/***/ (function(module) {

"use strict";


module.exports = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};


/***/ }),

/***/ 7288:
/***/ (function(module) {

module.exports = {
  "version": "0.27.2"
};

/***/ }),

/***/ 1849:
/***/ (function(module) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ 5327:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ 7303:
/***/ (function(module) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ 4372:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ 1793:
/***/ (function(module) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ 6268:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return utils.isObject(payload) && (payload.isAxiosError === true);
};


/***/ }),

/***/ 7985:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ 6016:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ 1623:
/***/ (function(module) {

// eslint-disable-next-line strict
module.exports = null;


/***/ }),

/***/ 4109:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ 205:
/***/ (function(module) {

"use strict";


module.exports = function parseProtocol(url) {
  var match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || '';
};


/***/ }),

/***/ 8713:
/***/ (function(module) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ 7675:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);

/**
 * Convert a data object to FormData
 * @param {Object} obj
 * @param {?Object} [formData]
 * @returns {Object}
 **/

function toFormData(obj, formData) {
  // eslint-disable-next-line no-param-reassign
  formData = formData || new FormData();

  var stack = [];

  function convertValue(value) {
    if (value === null) return '';

    if (utils.isDate(value)) {
      return value.toISOString();
    }

    if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
      return typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }

    return value;
  }

  function build(data, parentKey) {
    if (utils.isPlainObject(data) || utils.isArray(data)) {
      if (stack.indexOf(data) !== -1) {
        throw Error('Circular reference detected in ' + parentKey);
      }

      stack.push(data);

      utils.forEach(data, function each(value, key) {
        if (utils.isUndefined(value)) return;
        var fullKey = parentKey ? parentKey + '.' + key : key;
        var arr;

        if (value && !parentKey && typeof value === 'object') {
          if (utils.endsWith(key, '{}')) {
            // eslint-disable-next-line no-param-reassign
            value = JSON.stringify(value);
          } else if (utils.endsWith(key, '[]') && (arr = utils.toArray(value))) {
            // eslint-disable-next-line func-names
            arr.forEach(function(el) {
              !utils.isUndefined(el) && formData.append(fullKey, convertValue(el));
            });
            return;
          }
        }

        build(value, fullKey);
      });

      stack.pop();
    } else {
      formData.append(parentKey, convertValue(data));
    }
  }

  build(obj);

  return formData;
}

module.exports = toFormData;


/***/ }),

/***/ 4875:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var VERSION = (__webpack_require__(7288).version);
var AxiosError = __webpack_require__(2648);

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};

/**
 * Transitional option validator
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new AxiosError(
        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
        AxiosError.ERR_DEPRECATED
      );
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new AxiosError('options must be an object', AxiosError.ERR_BAD_OPTION_VALUE);
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new AxiosError('option ' + opt + ' must be ' + result, AxiosError.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError('Unknown option ' + opt, AxiosError.ERR_BAD_OPTION);
    }
  }
}

module.exports = {
  assertOptions: assertOptions,
  validators: validators
};


/***/ }),

/***/ 4867:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(1849);

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

// eslint-disable-next-line func-names
var kindOf = (function(cache) {
  // eslint-disable-next-line func-names
  return function(thing) {
    var str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
  };
})(Object.create(null));

function kindOfTest(type) {
  type = type.toLowerCase();
  return function isKindOf(thing) {
    return kindOf(thing) === type;
  };
}

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return Array.isArray(val);
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
var isArrayBuffer = kindOfTest('ArrayBuffer');


/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (kindOf(val) !== 'object') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
var isDate = kindOfTest('Date');

/**
 * Determine if a value is a File
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
var isFile = kindOfTest('File');

/**
 * Determine if a value is a Blob
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
var isBlob = kindOfTest('Blob');

/**
 * Determine if a value is a FileList
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
var isFileList = kindOfTest('FileList');

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} thing The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(thing) {
  var pattern = '[object FormData]';
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) ||
    toString.call(thing) === pattern ||
    (isFunction(thing.toString) && thing.toString() === pattern)
  );
}

/**
 * Determine if a value is a URLSearchParams object
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
var isURLSearchParams = kindOfTest('URLSearchParams');

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 */

function inherits(constructor, superConstructor, props, descriptors) {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  props && Object.assign(constructor.prototype, props);
}

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function} [filter]
 * @returns {Object}
 */

function toFlatObject(sourceObj, destObj, filter) {
  var props;
  var i;
  var prop;
  var merged = {};

  destObj = destObj || {};

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if (!merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = Object.getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

  return destObj;
}

/*
 * determines whether a string ends with the characters of a specified string
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 * @returns {boolean}
 */
function endsWith(str, searchString, position) {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  var lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
}


/**
 * Returns new array from array like object
 * @param {*} [thing]
 * @returns {Array}
 */
function toArray(thing) {
  if (!thing) return null;
  var i = thing.length;
  if (isUndefined(i)) return null;
  var arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
}

// eslint-disable-next-line func-names
var isTypedArray = (function(TypedArray) {
  // eslint-disable-next-line func-names
  return function(thing) {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && Object.getPrototypeOf(Uint8Array));

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM,
  inherits: inherits,
  toFlatObject: toFlatObject,
  kindOf: kindOf,
  kindOfTest: kindOfTest,
  endsWith: endsWith,
  toArray: toArray,
  isTypedArray: isTypedArray,
  isFileList: isFileList
};


/***/ }),

/***/ 9662:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isCallable = __webpack_require__(614);
var tryToString = __webpack_require__(6330);

var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw $TypeError(tryToString(argument) + ' is not a function');
};


/***/ }),

/***/ 1223:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(5112);
var create = __webpack_require__(30);
var defineProperty = (__webpack_require__(3070).f);

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  defineProperty(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create(null)
  });
}

// add a key to Array.prototype[@@unscopables]
module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ 9670:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isObject = __webpack_require__(111);

var $String = String;
var $TypeError = TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw $TypeError($String(argument) + ' is not an object');
};


/***/ }),

/***/ 1318:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toIndexedObject = __webpack_require__(5656);
var toAbsoluteIndex = __webpack_require__(1400);
var lengthOfArrayLike = __webpack_require__(6244);

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ }),

/***/ 4326:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};


/***/ }),

/***/ 9920:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var hasOwn = __webpack_require__(2597);
var ownKeys = __webpack_require__(3887);
var getOwnPropertyDescriptorModule = __webpack_require__(1236);
var definePropertyModule = __webpack_require__(3070);

module.exports = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};


/***/ }),

/***/ 8880:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(9781);
var definePropertyModule = __webpack_require__(3070);
var createPropertyDescriptor = __webpack_require__(9114);

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ 9114:
/***/ (function(module) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ 8052:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isCallable = __webpack_require__(614);
var definePropertyModule = __webpack_require__(3070);
var makeBuiltIn = __webpack_require__(6339);
var defineGlobalProperty = __webpack_require__(3072);

module.exports = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable(value)) makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;
    else defineGlobalProperty(key, value);
  } else {
    try {
      if (!options.unsafe) delete O[key];
      else if (O[key]) simple = true;
    } catch (error) { /* empty */ }
    if (simple) O[key] = value;
    else definePropertyModule.f(O, key, {
      value: value,
      enumerable: false,
      configurable: !options.nonConfigurable,
      writable: !options.nonWritable
    });
  } return O;
};


/***/ }),

/***/ 3072:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);

// eslint-disable-next-line es-x/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(global, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global[key] = value;
  } return value;
};


/***/ }),

/***/ 9781:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(7293);

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});


/***/ }),

/***/ 317:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var isObject = __webpack_require__(111);

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),

/***/ 8113:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(5005);

module.exports = getBuiltIn('navigator', 'userAgent') || '';


/***/ }),

/***/ 7392:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var userAgent = __webpack_require__(8113);

var process = global.process;
var Deno = global.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

module.exports = version;


/***/ }),

/***/ 748:
/***/ (function(module) {

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),

/***/ 2109:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var getOwnPropertyDescriptor = (__webpack_require__(1236).f);
var createNonEnumerableProperty = __webpack_require__(8880);
var defineBuiltIn = __webpack_require__(8052);
var defineGlobalProperty = __webpack_require__(3072);
var copyConstructorProperties = __webpack_require__(9920);
var isForced = __webpack_require__(4705);

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    defineBuiltIn(target, key, sourceProperty, options);
  }
};


/***/ }),

/***/ 7293:
/***/ (function(module) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),

/***/ 4374:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(7293);

module.exports = !fails(function () {
  // eslint-disable-next-line es-x/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});


/***/ }),

/***/ 6916:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_BIND = __webpack_require__(4374);

var call = Function.prototype.call;

module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};


/***/ }),

/***/ 6530:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(9781);
var hasOwn = __webpack_require__(2597);

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};


/***/ }),

/***/ 1702:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_BIND = __webpack_require__(4374);

var FunctionPrototype = Function.prototype;
var bind = FunctionPrototype.bind;
var call = FunctionPrototype.call;
var uncurryThis = NATIVE_BIND && bind.bind(call, call);

module.exports = NATIVE_BIND ? function (fn) {
  return fn && uncurryThis(fn);
} : function (fn) {
  return fn && function () {
    return call.apply(fn, arguments);
  };
};


/***/ }),

/***/ 5005:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var isCallable = __webpack_require__(614);

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global[namespace]) : global[namespace] && global[namespace][method];
};


/***/ }),

/***/ 8173:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var aCallable = __webpack_require__(9662);

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return func == null ? undefined : aCallable(func);
};


/***/ }),

/***/ 7854:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es-x/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof __webpack_require__.g == 'object' && __webpack_require__.g) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();


/***/ }),

/***/ 2597:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);
var toObject = __webpack_require__(7908);

var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es-x/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};


/***/ }),

/***/ 3501:
/***/ (function(module) {

module.exports = {};


/***/ }),

/***/ 490:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(5005);

module.exports = getBuiltIn('document', 'documentElement');


/***/ }),

/***/ 4664:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(9781);
var fails = __webpack_require__(7293);
var createElement = __webpack_require__(317);

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});


/***/ }),

/***/ 8361:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);
var fails = __webpack_require__(7293);
var classof = __webpack_require__(4326);

var $Object = Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split(it, '') : $Object(it);
} : $Object;


/***/ }),

/***/ 2788:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);
var isCallable = __webpack_require__(614);
var store = __webpack_require__(5465);

var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;


/***/ }),

/***/ 9909:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_WEAK_MAP = __webpack_require__(8536);
var global = __webpack_require__(7854);
var uncurryThis = __webpack_require__(1702);
var isObject = __webpack_require__(111);
var createNonEnumerableProperty = __webpack_require__(8880);
var hasOwn = __webpack_require__(2597);
var shared = __webpack_require__(5465);
var sharedKey = __webpack_require__(6200);
var hiddenKeys = __webpack_require__(3501);

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = global.TypeError;
var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  var wmget = uncurryThis(store.get);
  var wmhas = uncurryThis(store.has);
  var wmset = uncurryThis(store.set);
  set = function (it, metadata) {
    if (wmhas(store, it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    wmset(store, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget(store, it) || {};
  };
  has = function (it) {
    return wmhas(store, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),

/***/ 614:
/***/ (function(module) {

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
module.exports = function (argument) {
  return typeof argument == 'function';
};


/***/ }),

/***/ 4705:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(7293);
var isCallable = __webpack_require__(614);

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),

/***/ 111:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isCallable = __webpack_require__(614);

module.exports = function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};


/***/ }),

/***/ 1913:
/***/ (function(module) {

module.exports = false;


/***/ }),

/***/ 2190:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(5005);
var isCallable = __webpack_require__(614);
var isPrototypeOf = __webpack_require__(7976);
var USE_SYMBOL_AS_UID = __webpack_require__(3307);

var $Object = Object;

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};


/***/ }),

/***/ 6244:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toLength = __webpack_require__(7466);

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};


/***/ }),

/***/ 6339:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(7293);
var isCallable = __webpack_require__(614);
var hasOwn = __webpack_require__(2597);
var DESCRIPTORS = __webpack_require__(9781);
var CONFIGURABLE_FUNCTION_NAME = (__webpack_require__(6530).CONFIGURABLE);
var inspectSource = __webpack_require__(2788);
var InternalStateModule = __webpack_require__(9909);

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
// eslint-disable-next-line es-x/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
  return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
});

var TEMPLATE = String(String).split('String');

var makeBuiltIn = module.exports = function (value, name, options) {
  if (String(name).slice(0, 7) === 'Symbol(') {
    name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
    if (DESCRIPTORS) defineProperty(value, 'name', { value: name, configurable: true });
    else value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
    defineProperty(value, 'length', { value: options.arity });
  }
  try {
    if (options && hasOwn(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS) defineProperty(value, 'prototype', { writable: false });
    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) { /* empty */ }
  var state = enforceInternalState(value);
  if (!hasOwn(state, 'source')) {
    state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
  } return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn(function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
}, 'toString');


/***/ }),

/***/ 4758:
/***/ (function(module) {

var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es-x/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};


/***/ }),

/***/ 133:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/* eslint-disable es-x/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__(7392);
var fails = __webpack_require__(7293);

// eslint-disable-next-line es-x/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol();
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});


/***/ }),

/***/ 8536:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var isCallable = __webpack_require__(614);
var inspectSource = __webpack_require__(2788);

var WeakMap = global.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(inspectSource(WeakMap));


/***/ }),

/***/ 30:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/* global ActiveXObject -- old IE, WSH */
var anObject = __webpack_require__(9670);
var definePropertiesModule = __webpack_require__(6048);
var enumBugKeys = __webpack_require__(748);
var hiddenKeys = __webpack_require__(3501);
var html = __webpack_require__(490);
var documentCreateElement = __webpack_require__(317);
var sharedKey = __webpack_require__(6200);

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = typeof document != 'undefined'
    ? document.domain && activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
      : NullProtoObjectViaIFrame()
    : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
// eslint-disable-next-line es-x/no-object-create -- safe
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
};


/***/ }),

/***/ 6048:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(9781);
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(3353);
var definePropertyModule = __webpack_require__(3070);
var anObject = __webpack_require__(9670);
var toIndexedObject = __webpack_require__(5656);
var objectKeys = __webpack_require__(1956);

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es-x/no-object-defineproperties -- safe
exports.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var props = toIndexedObject(Properties);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
  return O;
};


/***/ }),

/***/ 3070:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(9781);
var IE8_DOM_DEFINE = __webpack_require__(4664);
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(3353);
var anObject = __webpack_require__(9670);
var toPropertyKey = __webpack_require__(4948);

var $TypeError = TypeError;
// eslint-disable-next-line es-x/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ 1236:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(9781);
var call = __webpack_require__(6916);
var propertyIsEnumerableModule = __webpack_require__(5296);
var createPropertyDescriptor = __webpack_require__(9114);
var toIndexedObject = __webpack_require__(5656);
var toPropertyKey = __webpack_require__(4948);
var hasOwn = __webpack_require__(2597);
var IE8_DOM_DEFINE = __webpack_require__(4664);

// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};


/***/ }),

/***/ 8006:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__(6324);
var enumBugKeys = __webpack_require__(748);

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es-x/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),

/***/ 5181:
/***/ (function(__unused_webpack_module, exports) {

// eslint-disable-next-line es-x/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ 7976:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);

module.exports = uncurryThis({}.isPrototypeOf);


/***/ }),

/***/ 6324:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);
var hasOwn = __webpack_require__(2597);
var toIndexedObject = __webpack_require__(5656);
var indexOf = (__webpack_require__(1318).indexOf);
var hiddenKeys = __webpack_require__(3501);

var push = uncurryThis([].push);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};


/***/ }),

/***/ 1956:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__(6324);
var enumBugKeys = __webpack_require__(748);

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es-x/no-object-keys -- safe
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};


/***/ }),

/***/ 5296:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;


/***/ }),

/***/ 2140:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var call = __webpack_require__(6916);
var isCallable = __webpack_require__(614);
var isObject = __webpack_require__(111);

var $TypeError = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw $TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ 3887:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(5005);
var uncurryThis = __webpack_require__(1702);
var getOwnPropertyNamesModule = __webpack_require__(8006);
var getOwnPropertySymbolsModule = __webpack_require__(5181);
var anObject = __webpack_require__(9670);

var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};


/***/ }),

/***/ 4488:
/***/ (function(module) {

var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (it == undefined) throw $TypeError("Can't call method on " + it);
  return it;
};


/***/ }),

/***/ 6200:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var shared = __webpack_require__(2309);
var uid = __webpack_require__(9711);

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),

/***/ 5465:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var defineGlobalProperty = __webpack_require__(3072);

var SHARED = '__core-js_shared__';
var store = global[SHARED] || defineGlobalProperty(SHARED, {});

module.exports = store;


/***/ }),

/***/ 2309:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var IS_PURE = __webpack_require__(1913);
var store = __webpack_require__(5465);

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.24.1',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2014-2022 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.24.1/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});


/***/ }),

/***/ 1400:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toIntegerOrInfinity = __webpack_require__(9303);

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),

/***/ 5656:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(8361);
var requireObjectCoercible = __webpack_require__(4488);

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),

/***/ 9303:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var trunc = __webpack_require__(4758);

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};


/***/ }),

/***/ 7466:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toIntegerOrInfinity = __webpack_require__(9303);

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),

/***/ 7908:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var requireObjectCoercible = __webpack_require__(4488);

var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return $Object(requireObjectCoercible(argument));
};


/***/ }),

/***/ 7593:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var call = __webpack_require__(6916);
var isObject = __webpack_require__(111);
var isSymbol = __webpack_require__(2190);
var getMethod = __webpack_require__(8173);
var ordinaryToPrimitive = __webpack_require__(2140);
var wellKnownSymbol = __webpack_require__(5112);

var $TypeError = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw $TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};


/***/ }),

/***/ 4948:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toPrimitive = __webpack_require__(7593);
var isSymbol = __webpack_require__(2190);

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};


/***/ }),

/***/ 6330:
/***/ (function(module) {

var $String = String;

module.exports = function (argument) {
  try {
    return $String(argument);
  } catch (error) {
    return 'Object';
  }
};


/***/ }),

/***/ 9711:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};


/***/ }),

/***/ 3307:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/* eslint-disable es-x/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(133);

module.exports = NATIVE_SYMBOL
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';


/***/ }),

/***/ 3353:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(9781);
var fails = __webpack_require__(7293);

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype != 42;
});


/***/ }),

/***/ 5112:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var shared = __webpack_require__(2309);
var hasOwn = __webpack_require__(2597);
var uid = __webpack_require__(9711);
var NATIVE_SYMBOL = __webpack_require__(133);
var USE_SYMBOL_AS_UID = __webpack_require__(3307);

var WellKnownSymbolsStore = shared('wks');
var Symbol = global.Symbol;
var symbolFor = Symbol && Symbol['for'];
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
    var description = 'Symbol.' + name;
    if (NATIVE_SYMBOL && hasOwn(Symbol, name)) {
      WellKnownSymbolsStore[name] = Symbol[name];
    } else if (USE_SYMBOL_AS_UID && symbolFor) {
      WellKnownSymbolsStore[name] = symbolFor(description);
    } else {
      WellKnownSymbolsStore[name] = createWellKnownSymbol(description);
    }
  } return WellKnownSymbolsStore[name];
};


/***/ }),

/***/ 6699:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var $includes = (__webpack_require__(1318).includes);
var fails = __webpack_require__(7293);
var addToUnscopables = __webpack_require__(1223);

// FF99+ bug
var BROKEN_ON_SPARSE = fails(function () {
  return !Array(1).includes();
});

// `Array.prototype.includes` method
// https://tc39.es/ecma262/#sec-array.prototype.includes
$({ target: 'Array', proto: true, forced: BROKEN_ON_SPARSE }, {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('includes');


/***/ }),

/***/ 1474:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MultiDrag": function() { return /* binding */ MultiDragPlugin; },
/* harmony export */   "Sortable": function() { return /* binding */ Sortable; },
/* harmony export */   "Swap": function() { return /* binding */ SwapPlugin; }
/* harmony export */ });
/**!
 * Sortable 1.10.2
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */
function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var version = "1.10.2";

function userAgent(pattern) {
  if (typeof window !== 'undefined' && window.navigator) {
    return !!
    /*@__PURE__*/
    navigator.userAgent.match(pattern);
  }
}

var IE11OrLess = userAgent(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i);
var Edge = userAgent(/Edge/i);
var FireFox = userAgent(/firefox/i);
var Safari = userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);
var IOS = userAgent(/iP(ad|od|hone)/i);
var ChromeForAndroid = userAgent(/chrome/i) && userAgent(/android/i);

var captureMode = {
  capture: false,
  passive: false
};

function on(el, event, fn) {
  el.addEventListener(event, fn, !IE11OrLess && captureMode);
}

function off(el, event, fn) {
  el.removeEventListener(event, fn, !IE11OrLess && captureMode);
}

function matches(
/**HTMLElement*/
el,
/**String*/
selector) {
  if (!selector) return;
  selector[0] === '>' && (selector = selector.substring(1));

  if (el) {
    try {
      if (el.matches) {
        return el.matches(selector);
      } else if (el.msMatchesSelector) {
        return el.msMatchesSelector(selector);
      } else if (el.webkitMatchesSelector) {
        return el.webkitMatchesSelector(selector);
      }
    } catch (_) {
      return false;
    }
  }

  return false;
}

function getParentOrHost(el) {
  return el.host && el !== document && el.host.nodeType ? el.host : el.parentNode;
}

function closest(
/**HTMLElement*/
el,
/**String*/
selector,
/**HTMLElement*/
ctx, includeCTX) {
  if (el) {
    ctx = ctx || document;

    do {
      if (selector != null && (selector[0] === '>' ? el.parentNode === ctx && matches(el, selector) : matches(el, selector)) || includeCTX && el === ctx) {
        return el;
      }

      if (el === ctx) break;
      /* jshint boss:true */
    } while (el = getParentOrHost(el));
  }

  return null;
}

var R_SPACE = /\s+/g;

function toggleClass(el, name, state) {
  if (el && name) {
    if (el.classList) {
      el.classList[state ? 'add' : 'remove'](name);
    } else {
      var className = (' ' + el.className + ' ').replace(R_SPACE, ' ').replace(' ' + name + ' ', ' ');
      el.className = (className + (state ? ' ' + name : '')).replace(R_SPACE, ' ');
    }
  }
}

function css(el, prop, val) {
  var style = el && el.style;

  if (style) {
    if (val === void 0) {
      if (document.defaultView && document.defaultView.getComputedStyle) {
        val = document.defaultView.getComputedStyle(el, '');
      } else if (el.currentStyle) {
        val = el.currentStyle;
      }

      return prop === void 0 ? val : val[prop];
    } else {
      if (!(prop in style) && prop.indexOf('webkit') === -1) {
        prop = '-webkit-' + prop;
      }

      style[prop] = val + (typeof val === 'string' ? '' : 'px');
    }
  }
}

function matrix(el, selfOnly) {
  var appliedTransforms = '';

  if (typeof el === 'string') {
    appliedTransforms = el;
  } else {
    do {
      var transform = css(el, 'transform');

      if (transform && transform !== 'none') {
        appliedTransforms = transform + ' ' + appliedTransforms;
      }
      /* jshint boss:true */

    } while (!selfOnly && (el = el.parentNode));
  }

  var matrixFn = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  /*jshint -W056 */

  return matrixFn && new matrixFn(appliedTransforms);
}

function find(ctx, tagName, iterator) {
  if (ctx) {
    var list = ctx.getElementsByTagName(tagName),
        i = 0,
        n = list.length;

    if (iterator) {
      for (; i < n; i++) {
        iterator(list[i], i);
      }
    }

    return list;
  }

  return [];
}

function getWindowScrollingElement() {
  var scrollingElement = document.scrollingElement;

  if (scrollingElement) {
    return scrollingElement;
  } else {
    return document.documentElement;
  }
}
/**
 * Returns the "bounding client rect" of given element
 * @param  {HTMLElement} el                       The element whose boundingClientRect is wanted
 * @param  {[Boolean]} relativeToContainingBlock  Whether the rect should be relative to the containing block of (including) the container
 * @param  {[Boolean]} relativeToNonStaticParent  Whether the rect should be relative to the relative parent of (including) the contaienr
 * @param  {[Boolean]} undoScale                  Whether the container's scale() should be undone
 * @param  {[HTMLElement]} container              The parent the element will be placed in
 * @return {Object}                               The boundingClientRect of el, with specified adjustments
 */


function getRect(el, relativeToContainingBlock, relativeToNonStaticParent, undoScale, container) {
  if (!el.getBoundingClientRect && el !== window) return;
  var elRect, top, left, bottom, right, height, width;

  if (el !== window && el !== getWindowScrollingElement()) {
    elRect = el.getBoundingClientRect();
    top = elRect.top;
    left = elRect.left;
    bottom = elRect.bottom;
    right = elRect.right;
    height = elRect.height;
    width = elRect.width;
  } else {
    top = 0;
    left = 0;
    bottom = window.innerHeight;
    right = window.innerWidth;
    height = window.innerHeight;
    width = window.innerWidth;
  }

  if ((relativeToContainingBlock || relativeToNonStaticParent) && el !== window) {
    // Adjust for translate()
    container = container || el.parentNode; // solves #1123 (see: https://stackoverflow.com/a/37953806/6088312)
    // Not needed on <= IE11

    if (!IE11OrLess) {
      do {
        if (container && container.getBoundingClientRect && (css(container, 'transform') !== 'none' || relativeToNonStaticParent && css(container, 'position') !== 'static')) {
          var containerRect = container.getBoundingClientRect(); // Set relative to edges of padding box of container

          top -= containerRect.top + parseInt(css(container, 'border-top-width'));
          left -= containerRect.left + parseInt(css(container, 'border-left-width'));
          bottom = top + elRect.height;
          right = left + elRect.width;
          break;
        }
        /* jshint boss:true */

      } while (container = container.parentNode);
    }
  }

  if (undoScale && el !== window) {
    // Adjust for scale()
    var elMatrix = matrix(container || el),
        scaleX = elMatrix && elMatrix.a,
        scaleY = elMatrix && elMatrix.d;

    if (elMatrix) {
      top /= scaleY;
      left /= scaleX;
      width /= scaleX;
      height /= scaleY;
      bottom = top + height;
      right = left + width;
    }
  }

  return {
    top: top,
    left: left,
    bottom: bottom,
    right: right,
    width: width,
    height: height
  };
}
/**
 * Checks if a side of an element is scrolled past a side of its parents
 * @param  {HTMLElement}  el           The element who's side being scrolled out of view is in question
 * @param  {String}       elSide       Side of the element in question ('top', 'left', 'right', 'bottom')
 * @param  {String}       parentSide   Side of the parent in question ('top', 'left', 'right', 'bottom')
 * @return {HTMLElement}               The parent scroll element that the el's side is scrolled past, or null if there is no such element
 */


function isScrolledPast(el, elSide, parentSide) {
  var parent = getParentAutoScrollElement(el, true),
      elSideVal = getRect(el)[elSide];
  /* jshint boss:true */

  while (parent) {
    var parentSideVal = getRect(parent)[parentSide],
        visible = void 0;

    if (parentSide === 'top' || parentSide === 'left') {
      visible = elSideVal >= parentSideVal;
    } else {
      visible = elSideVal <= parentSideVal;
    }

    if (!visible) return parent;
    if (parent === getWindowScrollingElement()) break;
    parent = getParentAutoScrollElement(parent, false);
  }

  return false;
}
/**
 * Gets nth child of el, ignoring hidden children, sortable's elements (does not ignore clone if it's visible)
 * and non-draggable elements
 * @param  {HTMLElement} el       The parent element
 * @param  {Number} childNum      The index of the child
 * @param  {Object} options       Parent Sortable's options
 * @return {HTMLElement}          The child at index childNum, or null if not found
 */


function getChild(el, childNum, options) {
  var currentChild = 0,
      i = 0,
      children = el.children;

  while (i < children.length) {
    if (children[i].style.display !== 'none' && children[i] !== Sortable.ghost && children[i] !== Sortable.dragged && closest(children[i], options.draggable, el, false)) {
      if (currentChild === childNum) {
        return children[i];
      }

      currentChild++;
    }

    i++;
  }

  return null;
}
/**
 * Gets the last child in the el, ignoring ghostEl or invisible elements (clones)
 * @param  {HTMLElement} el       Parent element
 * @param  {selector} selector    Any other elements that should be ignored
 * @return {HTMLElement}          The last child, ignoring ghostEl
 */


function lastChild(el, selector) {
  var last = el.lastElementChild;

  while (last && (last === Sortable.ghost || css(last, 'display') === 'none' || selector && !matches(last, selector))) {
    last = last.previousElementSibling;
  }

  return last || null;
}
/**
 * Returns the index of an element within its parent for a selected set of
 * elements
 * @param  {HTMLElement} el
 * @param  {selector} selector
 * @return {number}
 */


function index(el, selector) {
  var index = 0;

  if (!el || !el.parentNode) {
    return -1;
  }
  /* jshint boss:true */


  while (el = el.previousElementSibling) {
    if (el.nodeName.toUpperCase() !== 'TEMPLATE' && el !== Sortable.clone && (!selector || matches(el, selector))) {
      index++;
    }
  }

  return index;
}
/**
 * Returns the scroll offset of the given element, added with all the scroll offsets of parent elements.
 * The value is returned in real pixels.
 * @param  {HTMLElement} el
 * @return {Array}             Offsets in the format of [left, top]
 */


function getRelativeScrollOffset(el) {
  var offsetLeft = 0,
      offsetTop = 0,
      winScroller = getWindowScrollingElement();

  if (el) {
    do {
      var elMatrix = matrix(el),
          scaleX = elMatrix.a,
          scaleY = elMatrix.d;
      offsetLeft += el.scrollLeft * scaleX;
      offsetTop += el.scrollTop * scaleY;
    } while (el !== winScroller && (el = el.parentNode));
  }

  return [offsetLeft, offsetTop];
}
/**
 * Returns the index of the object within the given array
 * @param  {Array} arr   Array that may or may not hold the object
 * @param  {Object} obj  An object that has a key-value pair unique to and identical to a key-value pair in the object you want to find
 * @return {Number}      The index of the object in the array, or -1
 */


function indexOfObject(arr, obj) {
  for (var i in arr) {
    if (!arr.hasOwnProperty(i)) continue;

    for (var key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] === arr[i][key]) return Number(i);
    }
  }

  return -1;
}

function getParentAutoScrollElement(el, includeSelf) {
  // skip to window
  if (!el || !el.getBoundingClientRect) return getWindowScrollingElement();
  var elem = el;
  var gotSelf = false;

  do {
    // we don't need to get elem css if it isn't even overflowing in the first place (performance)
    if (elem.clientWidth < elem.scrollWidth || elem.clientHeight < elem.scrollHeight) {
      var elemCSS = css(elem);

      if (elem.clientWidth < elem.scrollWidth && (elemCSS.overflowX == 'auto' || elemCSS.overflowX == 'scroll') || elem.clientHeight < elem.scrollHeight && (elemCSS.overflowY == 'auto' || elemCSS.overflowY == 'scroll')) {
        if (!elem.getBoundingClientRect || elem === document.body) return getWindowScrollingElement();
        if (gotSelf || includeSelf) return elem;
        gotSelf = true;
      }
    }
    /* jshint boss:true */

  } while (elem = elem.parentNode);

  return getWindowScrollingElement();
}

function extend(dst, src) {
  if (dst && src) {
    for (var key in src) {
      if (src.hasOwnProperty(key)) {
        dst[key] = src[key];
      }
    }
  }

  return dst;
}

function isRectEqual(rect1, rect2) {
  return Math.round(rect1.top) === Math.round(rect2.top) && Math.round(rect1.left) === Math.round(rect2.left) && Math.round(rect1.height) === Math.round(rect2.height) && Math.round(rect1.width) === Math.round(rect2.width);
}

var _throttleTimeout;

function throttle(callback, ms) {
  return function () {
    if (!_throttleTimeout) {
      var args = arguments,
          _this = this;

      if (args.length === 1) {
        callback.call(_this, args[0]);
      } else {
        callback.apply(_this, args);
      }

      _throttleTimeout = setTimeout(function () {
        _throttleTimeout = void 0;
      }, ms);
    }
  };
}

function cancelThrottle() {
  clearTimeout(_throttleTimeout);
  _throttleTimeout = void 0;
}

function scrollBy(el, x, y) {
  el.scrollLeft += x;
  el.scrollTop += y;
}

function clone(el) {
  var Polymer = window.Polymer;
  var $ = window.jQuery || window.Zepto;

  if (Polymer && Polymer.dom) {
    return Polymer.dom(el).cloneNode(true);
  } else if ($) {
    return $(el).clone(true)[0];
  } else {
    return el.cloneNode(true);
  }
}

function setRect(el, rect) {
  css(el, 'position', 'absolute');
  css(el, 'top', rect.top);
  css(el, 'left', rect.left);
  css(el, 'width', rect.width);
  css(el, 'height', rect.height);
}

function unsetRect(el) {
  css(el, 'position', '');
  css(el, 'top', '');
  css(el, 'left', '');
  css(el, 'width', '');
  css(el, 'height', '');
}

var expando = 'Sortable' + new Date().getTime();

function AnimationStateManager() {
  var animationStates = [],
      animationCallbackId;
  return {
    captureAnimationState: function captureAnimationState() {
      animationStates = [];
      if (!this.options.animation) return;
      var children = [].slice.call(this.el.children);
      children.forEach(function (child) {
        if (css(child, 'display') === 'none' || child === Sortable.ghost) return;
        animationStates.push({
          target: child,
          rect: getRect(child)
        });

        var fromRect = _objectSpread({}, animationStates[animationStates.length - 1].rect); // If animating: compensate for current animation


        if (child.thisAnimationDuration) {
          var childMatrix = matrix(child, true);

          if (childMatrix) {
            fromRect.top -= childMatrix.f;
            fromRect.left -= childMatrix.e;
          }
        }

        child.fromRect = fromRect;
      });
    },
    addAnimationState: function addAnimationState(state) {
      animationStates.push(state);
    },
    removeAnimationState: function removeAnimationState(target) {
      animationStates.splice(indexOfObject(animationStates, {
        target: target
      }), 1);
    },
    animateAll: function animateAll(callback) {
      var _this = this;

      if (!this.options.animation) {
        clearTimeout(animationCallbackId);
        if (typeof callback === 'function') callback();
        return;
      }

      var animating = false,
          animationTime = 0;
      animationStates.forEach(function (state) {
        var time = 0,
            target = state.target,
            fromRect = target.fromRect,
            toRect = getRect(target),
            prevFromRect = target.prevFromRect,
            prevToRect = target.prevToRect,
            animatingRect = state.rect,
            targetMatrix = matrix(target, true);

        if (targetMatrix) {
          // Compensate for current animation
          toRect.top -= targetMatrix.f;
          toRect.left -= targetMatrix.e;
        }

        target.toRect = toRect;

        if (target.thisAnimationDuration) {
          // Could also check if animatingRect is between fromRect and toRect
          if (isRectEqual(prevFromRect, toRect) && !isRectEqual(fromRect, toRect) && // Make sure animatingRect is on line between toRect & fromRect
          (animatingRect.top - toRect.top) / (animatingRect.left - toRect.left) === (fromRect.top - toRect.top) / (fromRect.left - toRect.left)) {
            // If returning to same place as started from animation and on same axis
            time = calculateRealTime(animatingRect, prevFromRect, prevToRect, _this.options);
          }
        } // if fromRect != toRect: animate


        if (!isRectEqual(toRect, fromRect)) {
          target.prevFromRect = fromRect;
          target.prevToRect = toRect;

          if (!time) {
            time = _this.options.animation;
          }

          _this.animate(target, animatingRect, toRect, time);
        }

        if (time) {
          animating = true;
          animationTime = Math.max(animationTime, time);
          clearTimeout(target.animationResetTimer);
          target.animationResetTimer = setTimeout(function () {
            target.animationTime = 0;
            target.prevFromRect = null;
            target.fromRect = null;
            target.prevToRect = null;
            target.thisAnimationDuration = null;
          }, time);
          target.thisAnimationDuration = time;
        }
      });
      clearTimeout(animationCallbackId);

      if (!animating) {
        if (typeof callback === 'function') callback();
      } else {
        animationCallbackId = setTimeout(function () {
          if (typeof callback === 'function') callback();
        }, animationTime);
      }

      animationStates = [];
    },
    animate: function animate(target, currentRect, toRect, duration) {
      if (duration) {
        css(target, 'transition', '');
        css(target, 'transform', '');
        var elMatrix = matrix(this.el),
            scaleX = elMatrix && elMatrix.a,
            scaleY = elMatrix && elMatrix.d,
            translateX = (currentRect.left - toRect.left) / (scaleX || 1),
            translateY = (currentRect.top - toRect.top) / (scaleY || 1);
        target.animatingX = !!translateX;
        target.animatingY = !!translateY;
        css(target, 'transform', 'translate3d(' + translateX + 'px,' + translateY + 'px,0)');
        repaint(target); // repaint

        css(target, 'transition', 'transform ' + duration + 'ms' + (this.options.easing ? ' ' + this.options.easing : ''));
        css(target, 'transform', 'translate3d(0,0,0)');
        typeof target.animated === 'number' && clearTimeout(target.animated);
        target.animated = setTimeout(function () {
          css(target, 'transition', '');
          css(target, 'transform', '');
          target.animated = false;
          target.animatingX = false;
          target.animatingY = false;
        }, duration);
      }
    }
  };
}

function repaint(target) {
  return target.offsetWidth;
}

function calculateRealTime(animatingRect, fromRect, toRect, options) {
  return Math.sqrt(Math.pow(fromRect.top - animatingRect.top, 2) + Math.pow(fromRect.left - animatingRect.left, 2)) / Math.sqrt(Math.pow(fromRect.top - toRect.top, 2) + Math.pow(fromRect.left - toRect.left, 2)) * options.animation;
}

var plugins = [];
var defaults = {
  initializeByDefault: true
};
var PluginManager = {
  mount: function mount(plugin) {
    // Set default static properties
    for (var option in defaults) {
      if (defaults.hasOwnProperty(option) && !(option in plugin)) {
        plugin[option] = defaults[option];
      }
    }

    plugins.push(plugin);
  },
  pluginEvent: function pluginEvent(eventName, sortable, evt) {
    var _this = this;

    this.eventCanceled = false;

    evt.cancel = function () {
      _this.eventCanceled = true;
    };

    var eventNameGlobal = eventName + 'Global';
    plugins.forEach(function (plugin) {
      if (!sortable[plugin.pluginName]) return; // Fire global events if it exists in this sortable

      if (sortable[plugin.pluginName][eventNameGlobal]) {
        sortable[plugin.pluginName][eventNameGlobal](_objectSpread({
          sortable: sortable
        }, evt));
      } // Only fire plugin event if plugin is enabled in this sortable,
      // and plugin has event defined


      if (sortable.options[plugin.pluginName] && sortable[plugin.pluginName][eventName]) {
        sortable[plugin.pluginName][eventName](_objectSpread({
          sortable: sortable
        }, evt));
      }
    });
  },
  initializePlugins: function initializePlugins(sortable, el, defaults, options) {
    plugins.forEach(function (plugin) {
      var pluginName = plugin.pluginName;
      if (!sortable.options[pluginName] && !plugin.initializeByDefault) return;
      var initialized = new plugin(sortable, el, sortable.options);
      initialized.sortable = sortable;
      initialized.options = sortable.options;
      sortable[pluginName] = initialized; // Add default options from plugin

      _extends(defaults, initialized.defaults);
    });

    for (var option in sortable.options) {
      if (!sortable.options.hasOwnProperty(option)) continue;
      var modified = this.modifyOption(sortable, option, sortable.options[option]);

      if (typeof modified !== 'undefined') {
        sortable.options[option] = modified;
      }
    }
  },
  getEventProperties: function getEventProperties(name, sortable) {
    var eventProperties = {};
    plugins.forEach(function (plugin) {
      if (typeof plugin.eventProperties !== 'function') return;

      _extends(eventProperties, plugin.eventProperties.call(sortable[plugin.pluginName], name));
    });
    return eventProperties;
  },
  modifyOption: function modifyOption(sortable, name, value) {
    var modifiedValue;
    plugins.forEach(function (plugin) {
      // Plugin must exist on the Sortable
      if (!sortable[plugin.pluginName]) return; // If static option listener exists for this option, call in the context of the Sortable's instance of this plugin

      if (plugin.optionListeners && typeof plugin.optionListeners[name] === 'function') {
        modifiedValue = plugin.optionListeners[name].call(sortable[plugin.pluginName], value);
      }
    });
    return modifiedValue;
  }
};

function dispatchEvent(_ref) {
  var sortable = _ref.sortable,
      rootEl = _ref.rootEl,
      name = _ref.name,
      targetEl = _ref.targetEl,
      cloneEl = _ref.cloneEl,
      toEl = _ref.toEl,
      fromEl = _ref.fromEl,
      oldIndex = _ref.oldIndex,
      newIndex = _ref.newIndex,
      oldDraggableIndex = _ref.oldDraggableIndex,
      newDraggableIndex = _ref.newDraggableIndex,
      originalEvent = _ref.originalEvent,
      putSortable = _ref.putSortable,
      extraEventProperties = _ref.extraEventProperties;
  sortable = sortable || rootEl && rootEl[expando];
  if (!sortable) return;
  var evt,
      options = sortable.options,
      onName = 'on' + name.charAt(0).toUpperCase() + name.substr(1); // Support for new CustomEvent feature

  if (window.CustomEvent && !IE11OrLess && !Edge) {
    evt = new CustomEvent(name, {
      bubbles: true,
      cancelable: true
    });
  } else {
    evt = document.createEvent('Event');
    evt.initEvent(name, true, true);
  }

  evt.to = toEl || rootEl;
  evt.from = fromEl || rootEl;
  evt.item = targetEl || rootEl;
  evt.clone = cloneEl;
  evt.oldIndex = oldIndex;
  evt.newIndex = newIndex;
  evt.oldDraggableIndex = oldDraggableIndex;
  evt.newDraggableIndex = newDraggableIndex;
  evt.originalEvent = originalEvent;
  evt.pullMode = putSortable ? putSortable.lastPutMode : undefined;

  var allEventProperties = _objectSpread({}, extraEventProperties, PluginManager.getEventProperties(name, sortable));

  for (var option in allEventProperties) {
    evt[option] = allEventProperties[option];
  }

  if (rootEl) {
    rootEl.dispatchEvent(evt);
  }

  if (options[onName]) {
    options[onName].call(sortable, evt);
  }
}

var pluginEvent = function pluginEvent(eventName, sortable) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      originalEvent = _ref.evt,
      data = _objectWithoutProperties(_ref, ["evt"]);

  PluginManager.pluginEvent.bind(Sortable)(eventName, sortable, _objectSpread({
    dragEl: dragEl,
    parentEl: parentEl,
    ghostEl: ghostEl,
    rootEl: rootEl,
    nextEl: nextEl,
    lastDownEl: lastDownEl,
    cloneEl: cloneEl,
    cloneHidden: cloneHidden,
    dragStarted: moved,
    putSortable: putSortable,
    activeSortable: Sortable.active,
    originalEvent: originalEvent,
    oldIndex: oldIndex,
    oldDraggableIndex: oldDraggableIndex,
    newIndex: newIndex,
    newDraggableIndex: newDraggableIndex,
    hideGhostForTarget: _hideGhostForTarget,
    unhideGhostForTarget: _unhideGhostForTarget,
    cloneNowHidden: function cloneNowHidden() {
      cloneHidden = true;
    },
    cloneNowShown: function cloneNowShown() {
      cloneHidden = false;
    },
    dispatchSortableEvent: function dispatchSortableEvent(name) {
      _dispatchEvent({
        sortable: sortable,
        name: name,
        originalEvent: originalEvent
      });
    }
  }, data));
};

function _dispatchEvent(info) {
  dispatchEvent(_objectSpread({
    putSortable: putSortable,
    cloneEl: cloneEl,
    targetEl: dragEl,
    rootEl: rootEl,
    oldIndex: oldIndex,
    oldDraggableIndex: oldDraggableIndex,
    newIndex: newIndex,
    newDraggableIndex: newDraggableIndex
  }, info));
}

var dragEl,
    parentEl,
    ghostEl,
    rootEl,
    nextEl,
    lastDownEl,
    cloneEl,
    cloneHidden,
    oldIndex,
    newIndex,
    oldDraggableIndex,
    newDraggableIndex,
    activeGroup,
    putSortable,
    awaitingDragStarted = false,
    ignoreNextClick = false,
    sortables = [],
    tapEvt,
    touchEvt,
    lastDx,
    lastDy,
    tapDistanceLeft,
    tapDistanceTop,
    moved,
    lastTarget,
    lastDirection,
    pastFirstInvertThresh = false,
    isCircumstantialInvert = false,
    targetMoveDistance,
    // For positioning ghost absolutely
ghostRelativeParent,
    ghostRelativeParentInitialScroll = [],
    // (left, top)
_silent = false,
    savedInputChecked = [];
/** @const */

var documentExists = typeof document !== 'undefined',
    PositionGhostAbsolutely = IOS,
    CSSFloatProperty = Edge || IE11OrLess ? 'cssFloat' : 'float',
    // This will not pass for IE9, because IE9 DnD only works on anchors
supportDraggable = documentExists && !ChromeForAndroid && !IOS && 'draggable' in document.createElement('div'),
    supportCssPointerEvents = function () {
  if (!documentExists) return; // false when <= IE11

  if (IE11OrLess) {
    return false;
  }

  var el = document.createElement('x');
  el.style.cssText = 'pointer-events:auto';
  return el.style.pointerEvents === 'auto';
}(),
    _detectDirection = function _detectDirection(el, options) {
  var elCSS = css(el),
      elWidth = parseInt(elCSS.width) - parseInt(elCSS.paddingLeft) - parseInt(elCSS.paddingRight) - parseInt(elCSS.borderLeftWidth) - parseInt(elCSS.borderRightWidth),
      child1 = getChild(el, 0, options),
      child2 = getChild(el, 1, options),
      firstChildCSS = child1 && css(child1),
      secondChildCSS = child2 && css(child2),
      firstChildWidth = firstChildCSS && parseInt(firstChildCSS.marginLeft) + parseInt(firstChildCSS.marginRight) + getRect(child1).width,
      secondChildWidth = secondChildCSS && parseInt(secondChildCSS.marginLeft) + parseInt(secondChildCSS.marginRight) + getRect(child2).width;

  if (elCSS.display === 'flex') {
    return elCSS.flexDirection === 'column' || elCSS.flexDirection === 'column-reverse' ? 'vertical' : 'horizontal';
  }

  if (elCSS.display === 'grid') {
    return elCSS.gridTemplateColumns.split(' ').length <= 1 ? 'vertical' : 'horizontal';
  }

  if (child1 && firstChildCSS["float"] && firstChildCSS["float"] !== 'none') {
    var touchingSideChild2 = firstChildCSS["float"] === 'left' ? 'left' : 'right';
    return child2 && (secondChildCSS.clear === 'both' || secondChildCSS.clear === touchingSideChild2) ? 'vertical' : 'horizontal';
  }

  return child1 && (firstChildCSS.display === 'block' || firstChildCSS.display === 'flex' || firstChildCSS.display === 'table' || firstChildCSS.display === 'grid' || firstChildWidth >= elWidth && elCSS[CSSFloatProperty] === 'none' || child2 && elCSS[CSSFloatProperty] === 'none' && firstChildWidth + secondChildWidth > elWidth) ? 'vertical' : 'horizontal';
},
    _dragElInRowColumn = function _dragElInRowColumn(dragRect, targetRect, vertical) {
  var dragElS1Opp = vertical ? dragRect.left : dragRect.top,
      dragElS2Opp = vertical ? dragRect.right : dragRect.bottom,
      dragElOppLength = vertical ? dragRect.width : dragRect.height,
      targetS1Opp = vertical ? targetRect.left : targetRect.top,
      targetS2Opp = vertical ? targetRect.right : targetRect.bottom,
      targetOppLength = vertical ? targetRect.width : targetRect.height;
  return dragElS1Opp === targetS1Opp || dragElS2Opp === targetS2Opp || dragElS1Opp + dragElOppLength / 2 === targetS1Opp + targetOppLength / 2;
},

/**
 * Detects first nearest empty sortable to X and Y position using emptyInsertThreshold.
 * @param  {Number} x      X position
 * @param  {Number} y      Y position
 * @return {HTMLElement}   Element of the first found nearest Sortable
 */
_detectNearestEmptySortable = function _detectNearestEmptySortable(x, y) {
  var ret;
  sortables.some(function (sortable) {
    if (lastChild(sortable)) return;
    var rect = getRect(sortable),
        threshold = sortable[expando].options.emptyInsertThreshold,
        insideHorizontally = x >= rect.left - threshold && x <= rect.right + threshold,
        insideVertically = y >= rect.top - threshold && y <= rect.bottom + threshold;

    if (threshold && insideHorizontally && insideVertically) {
      return ret = sortable;
    }
  });
  return ret;
},
    _prepareGroup = function _prepareGroup(options) {
  function toFn(value, pull) {
    return function (to, from, dragEl, evt) {
      var sameGroup = to.options.group.name && from.options.group.name && to.options.group.name === from.options.group.name;

      if (value == null && (pull || sameGroup)) {
        // Default pull value
        // Default pull and put value if same group
        return true;
      } else if (value == null || value === false) {
        return false;
      } else if (pull && value === 'clone') {
        return value;
      } else if (typeof value === 'function') {
        return toFn(value(to, from, dragEl, evt), pull)(to, from, dragEl, evt);
      } else {
        var otherGroup = (pull ? to : from).options.group.name;
        return value === true || typeof value === 'string' && value === otherGroup || value.join && value.indexOf(otherGroup) > -1;
      }
    };
  }

  var group = {};
  var originalGroup = options.group;

  if (!originalGroup || _typeof(originalGroup) != 'object') {
    originalGroup = {
      name: originalGroup
    };
  }

  group.name = originalGroup.name;
  group.checkPull = toFn(originalGroup.pull, true);
  group.checkPut = toFn(originalGroup.put);
  group.revertClone = originalGroup.revertClone;
  options.group = group;
},
    _hideGhostForTarget = function _hideGhostForTarget() {
  if (!supportCssPointerEvents && ghostEl) {
    css(ghostEl, 'display', 'none');
  }
},
    _unhideGhostForTarget = function _unhideGhostForTarget() {
  if (!supportCssPointerEvents && ghostEl) {
    css(ghostEl, 'display', '');
  }
}; // #1184 fix - Prevent click event on fallback if dragged but item not changed position


if (documentExists) {
  document.addEventListener('click', function (evt) {
    if (ignoreNextClick) {
      evt.preventDefault();
      evt.stopPropagation && evt.stopPropagation();
      evt.stopImmediatePropagation && evt.stopImmediatePropagation();
      ignoreNextClick = false;
      return false;
    }
  }, true);
}

var nearestEmptyInsertDetectEvent = function nearestEmptyInsertDetectEvent(evt) {
  if (dragEl) {
    evt = evt.touches ? evt.touches[0] : evt;

    var nearest = _detectNearestEmptySortable(evt.clientX, evt.clientY);

    if (nearest) {
      // Create imitation event
      var event = {};

      for (var i in evt) {
        if (evt.hasOwnProperty(i)) {
          event[i] = evt[i];
        }
      }

      event.target = event.rootEl = nearest;
      event.preventDefault = void 0;
      event.stopPropagation = void 0;

      nearest[expando]._onDragOver(event);
    }
  }
};

var _checkOutsideTargetEl = function _checkOutsideTargetEl(evt) {
  if (dragEl) {
    dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
  }
};
/**
 * @class  Sortable
 * @param  {HTMLElement}  el
 * @param  {Object}       [options]
 */


function Sortable(el, options) {
  if (!(el && el.nodeType && el.nodeType === 1)) {
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(el));
  }

  this.el = el; // root element

  this.options = options = _extends({}, options); // Export instance

  el[expando] = this;
  var defaults = {
    group: null,
    sort: true,
    disabled: false,
    store: null,
    handle: null,
    draggable: /^[uo]l$/i.test(el.nodeName) ? '>li' : '>*',
    swapThreshold: 1,
    // percentage; 0 <= x <= 1
    invertSwap: false,
    // invert always
    invertedSwapThreshold: null,
    // will be set to same as swapThreshold if default
    removeCloneOnHide: true,
    direction: function direction() {
      return _detectDirection(el, this.options);
    },
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    dragClass: 'sortable-drag',
    ignore: 'a, img',
    filter: null,
    preventOnFilter: true,
    animation: 0,
    easing: null,
    setData: function setData(dataTransfer, dragEl) {
      dataTransfer.setData('Text', dragEl.textContent);
    },
    dropBubble: false,
    dragoverBubble: false,
    dataIdAttr: 'data-id',
    delay: 0,
    delayOnTouchOnly: false,
    touchStartThreshold: (Number.parseInt ? Number : window).parseInt(window.devicePixelRatio, 10) || 1,
    forceFallback: false,
    fallbackClass: 'sortable-fallback',
    fallbackOnBody: false,
    fallbackTolerance: 0,
    fallbackOffset: {
      x: 0,
      y: 0
    },
    supportPointer: Sortable.supportPointer !== false && 'PointerEvent' in window,
    emptyInsertThreshold: 5
  };
  PluginManager.initializePlugins(this, el, defaults); // Set default options

  for (var name in defaults) {
    !(name in options) && (options[name] = defaults[name]);
  }

  _prepareGroup(options); // Bind all private methods


  for (var fn in this) {
    if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
      this[fn] = this[fn].bind(this);
    }
  } // Setup drag mode


  this.nativeDraggable = options.forceFallback ? false : supportDraggable;

  if (this.nativeDraggable) {
    // Touch start threshold cannot be greater than the native dragstart threshold
    this.options.touchStartThreshold = 1;
  } // Bind events


  if (options.supportPointer) {
    on(el, 'pointerdown', this._onTapStart);
  } else {
    on(el, 'mousedown', this._onTapStart);
    on(el, 'touchstart', this._onTapStart);
  }

  if (this.nativeDraggable) {
    on(el, 'dragover', this);
    on(el, 'dragenter', this);
  }

  sortables.push(this.el); // Restore sorting

  options.store && options.store.get && this.sort(options.store.get(this) || []); // Add animation state manager

  _extends(this, AnimationStateManager());
}

Sortable.prototype =
/** @lends Sortable.prototype */
{
  constructor: Sortable,
  _isOutsideThisEl: function _isOutsideThisEl(target) {
    if (!this.el.contains(target) && target !== this.el) {
      lastTarget = null;
    }
  },
  _getDirection: function _getDirection(evt, target) {
    return typeof this.options.direction === 'function' ? this.options.direction.call(this, evt, target, dragEl) : this.options.direction;
  },
  _onTapStart: function _onTapStart(
  /** Event|TouchEvent */
  evt) {
    if (!evt.cancelable) return;

    var _this = this,
        el = this.el,
        options = this.options,
        preventOnFilter = options.preventOnFilter,
        type = evt.type,
        touch = evt.touches && evt.touches[0] || evt.pointerType && evt.pointerType === 'touch' && evt,
        target = (touch || evt).target,
        originalTarget = evt.target.shadowRoot && (evt.path && evt.path[0] || evt.composedPath && evt.composedPath()[0]) || target,
        filter = options.filter;

    _saveInputCheckedState(el); // Don't trigger start event when an element is been dragged, otherwise the evt.oldindex always wrong when set option.group.


    if (dragEl) {
      return;
    }

    if (/mousedown|pointerdown/.test(type) && evt.button !== 0 || options.disabled) {
      return; // only left button and enabled
    } // cancel dnd if original target is content editable


    if (originalTarget.isContentEditable) {
      return;
    }

    target = closest(target, options.draggable, el, false);

    if (target && target.animated) {
      return;
    }

    if (lastDownEl === target) {
      // Ignoring duplicate `down`
      return;
    } // Get the index of the dragged element within its parent


    oldIndex = index(target);
    oldDraggableIndex = index(target, options.draggable); // Check filter

    if (typeof filter === 'function') {
      if (filter.call(this, evt, target, this)) {
        _dispatchEvent({
          sortable: _this,
          rootEl: originalTarget,
          name: 'filter',
          targetEl: target,
          toEl: el,
          fromEl: el
        });

        pluginEvent('filter', _this, {
          evt: evt
        });
        preventOnFilter && evt.cancelable && evt.preventDefault();
        return; // cancel dnd
      }
    } else if (filter) {
      filter = filter.split(',').some(function (criteria) {
        criteria = closest(originalTarget, criteria.trim(), el, false);

        if (criteria) {
          _dispatchEvent({
            sortable: _this,
            rootEl: criteria,
            name: 'filter',
            targetEl: target,
            fromEl: el,
            toEl: el
          });

          pluginEvent('filter', _this, {
            evt: evt
          });
          return true;
        }
      });

      if (filter) {
        preventOnFilter && evt.cancelable && evt.preventDefault();
        return; // cancel dnd
      }
    }

    if (options.handle && !closest(originalTarget, options.handle, el, false)) {
      return;
    } // Prepare `dragstart`


    this._prepareDragStart(evt, touch, target);
  },
  _prepareDragStart: function _prepareDragStart(
  /** Event */
  evt,
  /** Touch */
  touch,
  /** HTMLElement */
  target) {
    var _this = this,
        el = _this.el,
        options = _this.options,
        ownerDocument = el.ownerDocument,
        dragStartFn;

    if (target && !dragEl && target.parentNode === el) {
      var dragRect = getRect(target);
      rootEl = el;
      dragEl = target;
      parentEl = dragEl.parentNode;
      nextEl = dragEl.nextSibling;
      lastDownEl = target;
      activeGroup = options.group;
      Sortable.dragged = dragEl;
      tapEvt = {
        target: dragEl,
        clientX: (touch || evt).clientX,
        clientY: (touch || evt).clientY
      };
      tapDistanceLeft = tapEvt.clientX - dragRect.left;
      tapDistanceTop = tapEvt.clientY - dragRect.top;
      this._lastX = (touch || evt).clientX;
      this._lastY = (touch || evt).clientY;
      dragEl.style['will-change'] = 'all';

      dragStartFn = function dragStartFn() {
        pluginEvent('delayEnded', _this, {
          evt: evt
        });

        if (Sortable.eventCanceled) {
          _this._onDrop();

          return;
        } // Delayed drag has been triggered
        // we can re-enable the events: touchmove/mousemove


        _this._disableDelayedDragEvents();

        if (!FireFox && _this.nativeDraggable) {
          dragEl.draggable = true;
        } // Bind the events: dragstart/dragend


        _this._triggerDragStart(evt, touch); // Drag start event


        _dispatchEvent({
          sortable: _this,
          name: 'choose',
          originalEvent: evt
        }); // Chosen item


        toggleClass(dragEl, options.chosenClass, true);
      }; // Disable "draggable"


      options.ignore.split(',').forEach(function (criteria) {
        find(dragEl, criteria.trim(), _disableDraggable);
      });
      on(ownerDocument, 'dragover', nearestEmptyInsertDetectEvent);
      on(ownerDocument, 'mousemove', nearestEmptyInsertDetectEvent);
      on(ownerDocument, 'touchmove', nearestEmptyInsertDetectEvent);
      on(ownerDocument, 'mouseup', _this._onDrop);
      on(ownerDocument, 'touchend', _this._onDrop);
      on(ownerDocument, 'touchcancel', _this._onDrop); // Make dragEl draggable (must be before delay for FireFox)

      if (FireFox && this.nativeDraggable) {
        this.options.touchStartThreshold = 4;
        dragEl.draggable = true;
      }

      pluginEvent('delayStart', this, {
        evt: evt
      }); // Delay is impossible for native DnD in Edge or IE

      if (options.delay && (!options.delayOnTouchOnly || touch) && (!this.nativeDraggable || !(Edge || IE11OrLess))) {
        if (Sortable.eventCanceled) {
          this._onDrop();

          return;
        } // If the user moves the pointer or let go the click or touch
        // before the delay has been reached:
        // disable the delayed drag


        on(ownerDocument, 'mouseup', _this._disableDelayedDrag);
        on(ownerDocument, 'touchend', _this._disableDelayedDrag);
        on(ownerDocument, 'touchcancel', _this._disableDelayedDrag);
        on(ownerDocument, 'mousemove', _this._delayedDragTouchMoveHandler);
        on(ownerDocument, 'touchmove', _this._delayedDragTouchMoveHandler);
        options.supportPointer && on(ownerDocument, 'pointermove', _this._delayedDragTouchMoveHandler);
        _this._dragStartTimer = setTimeout(dragStartFn, options.delay);
      } else {
        dragStartFn();
      }
    }
  },
  _delayedDragTouchMoveHandler: function _delayedDragTouchMoveHandler(
  /** TouchEvent|PointerEvent **/
  e) {
    var touch = e.touches ? e.touches[0] : e;

    if (Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1))) {
      this._disableDelayedDrag();
    }
  },
  _disableDelayedDrag: function _disableDelayedDrag() {
    dragEl && _disableDraggable(dragEl);
    clearTimeout(this._dragStartTimer);

    this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function _disableDelayedDragEvents() {
    var ownerDocument = this.el.ownerDocument;
    off(ownerDocument, 'mouseup', this._disableDelayedDrag);
    off(ownerDocument, 'touchend', this._disableDelayedDrag);
    off(ownerDocument, 'touchcancel', this._disableDelayedDrag);
    off(ownerDocument, 'mousemove', this._delayedDragTouchMoveHandler);
    off(ownerDocument, 'touchmove', this._delayedDragTouchMoveHandler);
    off(ownerDocument, 'pointermove', this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function _triggerDragStart(
  /** Event */
  evt,
  /** Touch */
  touch) {
    touch = touch || evt.pointerType == 'touch' && evt;

    if (!this.nativeDraggable || touch) {
      if (this.options.supportPointer) {
        on(document, 'pointermove', this._onTouchMove);
      } else if (touch) {
        on(document, 'touchmove', this._onTouchMove);
      } else {
        on(document, 'mousemove', this._onTouchMove);
      }
    } else {
      on(dragEl, 'dragend', this);
      on(rootEl, 'dragstart', this._onDragStart);
    }

    try {
      if (document.selection) {
        // Timeout neccessary for IE9
        _nextTick(function () {
          document.selection.empty();
        });
      } else {
        window.getSelection().removeAllRanges();
      }
    } catch (err) {}
  },
  _dragStarted: function _dragStarted(fallback, evt) {

    awaitingDragStarted = false;

    if (rootEl && dragEl) {
      pluginEvent('dragStarted', this, {
        evt: evt
      });

      if (this.nativeDraggable) {
        on(document, 'dragover', _checkOutsideTargetEl);
      }

      var options = this.options; // Apply effect

      !fallback && toggleClass(dragEl, options.dragClass, false);
      toggleClass(dragEl, options.ghostClass, true);
      Sortable.active = this;
      fallback && this._appendGhost(); // Drag start event

      _dispatchEvent({
        sortable: this,
        name: 'start',
        originalEvent: evt
      });
    } else {
      this._nulling();
    }
  },
  _emulateDragOver: function _emulateDragOver() {
    if (touchEvt) {
      this._lastX = touchEvt.clientX;
      this._lastY = touchEvt.clientY;

      _hideGhostForTarget();

      var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
      var parent = target;

      while (target && target.shadowRoot) {
        target = target.shadowRoot.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
        if (target === parent) break;
        parent = target;
      }

      dragEl.parentNode[expando]._isOutsideThisEl(target);

      if (parent) {
        do {
          if (parent[expando]) {
            var inserted = void 0;
            inserted = parent[expando]._onDragOver({
              clientX: touchEvt.clientX,
              clientY: touchEvt.clientY,
              target: target,
              rootEl: parent
            });

            if (inserted && !this.options.dragoverBubble) {
              break;
            }
          }

          target = parent; // store last element
        }
        /* jshint boss:true */
        while (parent = parent.parentNode);
      }

      _unhideGhostForTarget();
    }
  },
  _onTouchMove: function _onTouchMove(
  /**TouchEvent*/
  evt) {
    if (tapEvt) {
      var options = this.options,
          fallbackTolerance = options.fallbackTolerance,
          fallbackOffset = options.fallbackOffset,
          touch = evt.touches ? evt.touches[0] : evt,
          ghostMatrix = ghostEl && matrix(ghostEl, true),
          scaleX = ghostEl && ghostMatrix && ghostMatrix.a,
          scaleY = ghostEl && ghostMatrix && ghostMatrix.d,
          relativeScrollOffset = PositionGhostAbsolutely && ghostRelativeParent && getRelativeScrollOffset(ghostRelativeParent),
          dx = (touch.clientX - tapEvt.clientX + fallbackOffset.x) / (scaleX || 1) + (relativeScrollOffset ? relativeScrollOffset[0] - ghostRelativeParentInitialScroll[0] : 0) / (scaleX || 1),
          dy = (touch.clientY - tapEvt.clientY + fallbackOffset.y) / (scaleY || 1) + (relativeScrollOffset ? relativeScrollOffset[1] - ghostRelativeParentInitialScroll[1] : 0) / (scaleY || 1); // only set the status to dragging, when we are actually dragging

      if (!Sortable.active && !awaitingDragStarted) {
        if (fallbackTolerance && Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) < fallbackTolerance) {
          return;
        }

        this._onDragStart(evt, true);
      }

      if (ghostEl) {
        if (ghostMatrix) {
          ghostMatrix.e += dx - (lastDx || 0);
          ghostMatrix.f += dy - (lastDy || 0);
        } else {
          ghostMatrix = {
            a: 1,
            b: 0,
            c: 0,
            d: 1,
            e: dx,
            f: dy
          };
        }

        var cssMatrix = "matrix(".concat(ghostMatrix.a, ",").concat(ghostMatrix.b, ",").concat(ghostMatrix.c, ",").concat(ghostMatrix.d, ",").concat(ghostMatrix.e, ",").concat(ghostMatrix.f, ")");
        css(ghostEl, 'webkitTransform', cssMatrix);
        css(ghostEl, 'mozTransform', cssMatrix);
        css(ghostEl, 'msTransform', cssMatrix);
        css(ghostEl, 'transform', cssMatrix);
        lastDx = dx;
        lastDy = dy;
        touchEvt = touch;
      }

      evt.cancelable && evt.preventDefault();
    }
  },
  _appendGhost: function _appendGhost() {
    // Bug if using scale(): https://stackoverflow.com/questions/2637058
    // Not being adjusted for
    if (!ghostEl) {
      var container = this.options.fallbackOnBody ? document.body : rootEl,
          rect = getRect(dragEl, true, PositionGhostAbsolutely, true, container),
          options = this.options; // Position absolutely

      if (PositionGhostAbsolutely) {
        // Get relatively positioned parent
        ghostRelativeParent = container;

        while (css(ghostRelativeParent, 'position') === 'static' && css(ghostRelativeParent, 'transform') === 'none' && ghostRelativeParent !== document) {
          ghostRelativeParent = ghostRelativeParent.parentNode;
        }

        if (ghostRelativeParent !== document.body && ghostRelativeParent !== document.documentElement) {
          if (ghostRelativeParent === document) ghostRelativeParent = getWindowScrollingElement();
          rect.top += ghostRelativeParent.scrollTop;
          rect.left += ghostRelativeParent.scrollLeft;
        } else {
          ghostRelativeParent = getWindowScrollingElement();
        }

        ghostRelativeParentInitialScroll = getRelativeScrollOffset(ghostRelativeParent);
      }

      ghostEl = dragEl.cloneNode(true);
      toggleClass(ghostEl, options.ghostClass, false);
      toggleClass(ghostEl, options.fallbackClass, true);
      toggleClass(ghostEl, options.dragClass, true);
      css(ghostEl, 'transition', '');
      css(ghostEl, 'transform', '');
      css(ghostEl, 'box-sizing', 'border-box');
      css(ghostEl, 'margin', 0);
      css(ghostEl, 'top', rect.top);
      css(ghostEl, 'left', rect.left);
      css(ghostEl, 'width', rect.width);
      css(ghostEl, 'height', rect.height);
      css(ghostEl, 'opacity', '0.8');
      css(ghostEl, 'position', PositionGhostAbsolutely ? 'absolute' : 'fixed');
      css(ghostEl, 'zIndex', '100000');
      css(ghostEl, 'pointerEvents', 'none');
      Sortable.ghost = ghostEl;
      container.appendChild(ghostEl); // Set transform-origin

      css(ghostEl, 'transform-origin', tapDistanceLeft / parseInt(ghostEl.style.width) * 100 + '% ' + tapDistanceTop / parseInt(ghostEl.style.height) * 100 + '%');
    }
  },
  _onDragStart: function _onDragStart(
  /**Event*/
  evt,
  /**boolean*/
  fallback) {
    var _this = this;

    var dataTransfer = evt.dataTransfer;
    var options = _this.options;
    pluginEvent('dragStart', this, {
      evt: evt
    });

    if (Sortable.eventCanceled) {
      this._onDrop();

      return;
    }

    pluginEvent('setupClone', this);

    if (!Sortable.eventCanceled) {
      cloneEl = clone(dragEl);
      cloneEl.draggable = false;
      cloneEl.style['will-change'] = '';

      this._hideClone();

      toggleClass(cloneEl, this.options.chosenClass, false);
      Sortable.clone = cloneEl;
    } // #1143: IFrame support workaround


    _this.cloneId = _nextTick(function () {
      pluginEvent('clone', _this);
      if (Sortable.eventCanceled) return;

      if (!_this.options.removeCloneOnHide) {
        rootEl.insertBefore(cloneEl, dragEl);
      }

      _this._hideClone();

      _dispatchEvent({
        sortable: _this,
        name: 'clone'
      });
    });
    !fallback && toggleClass(dragEl, options.dragClass, true); // Set proper drop events

    if (fallback) {
      ignoreNextClick = true;
      _this._loopId = setInterval(_this._emulateDragOver, 50);
    } else {
      // Undo what was set in _prepareDragStart before drag started
      off(document, 'mouseup', _this._onDrop);
      off(document, 'touchend', _this._onDrop);
      off(document, 'touchcancel', _this._onDrop);

      if (dataTransfer) {
        dataTransfer.effectAllowed = 'move';
        options.setData && options.setData.call(_this, dataTransfer, dragEl);
      }

      on(document, 'drop', _this); // #1276 fix:

      css(dragEl, 'transform', 'translateZ(0)');
    }

    awaitingDragStarted = true;
    _this._dragStartId = _nextTick(_this._dragStarted.bind(_this, fallback, evt));
    on(document, 'selectstart', _this);
    moved = true;

    if (Safari) {
      css(document.body, 'user-select', 'none');
    }
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function _onDragOver(
  /**Event*/
  evt) {
    var el = this.el,
        target = evt.target,
        dragRect,
        targetRect,
        revert,
        options = this.options,
        group = options.group,
        activeSortable = Sortable.active,
        isOwner = activeGroup === group,
        canSort = options.sort,
        fromSortable = putSortable || activeSortable,
        vertical,
        _this = this,
        completedFired = false;

    if (_silent) return;

    function dragOverEvent(name, extra) {
      pluginEvent(name, _this, _objectSpread({
        evt: evt,
        isOwner: isOwner,
        axis: vertical ? 'vertical' : 'horizontal',
        revert: revert,
        dragRect: dragRect,
        targetRect: targetRect,
        canSort: canSort,
        fromSortable: fromSortable,
        target: target,
        completed: completed,
        onMove: function onMove(target, after) {
          return _onMove(rootEl, el, dragEl, dragRect, target, getRect(target), evt, after);
        },
        changed: changed
      }, extra));
    } // Capture animation state


    function capture() {
      dragOverEvent('dragOverAnimationCapture');

      _this.captureAnimationState();

      if (_this !== fromSortable) {
        fromSortable.captureAnimationState();
      }
    } // Return invocation when dragEl is inserted (or completed)


    function completed(insertion) {
      dragOverEvent('dragOverCompleted', {
        insertion: insertion
      });

      if (insertion) {
        // Clones must be hidden before folding animation to capture dragRectAbsolute properly
        if (isOwner) {
          activeSortable._hideClone();
        } else {
          activeSortable._showClone(_this);
        }

        if (_this !== fromSortable) {
          // Set ghost class to new sortable's ghost class
          toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : activeSortable.options.ghostClass, false);
          toggleClass(dragEl, options.ghostClass, true);
        }

        if (putSortable !== _this && _this !== Sortable.active) {
          putSortable = _this;
        } else if (_this === Sortable.active && putSortable) {
          putSortable = null;
        } // Animation


        if (fromSortable === _this) {
          _this._ignoreWhileAnimating = target;
        }

        _this.animateAll(function () {
          dragOverEvent('dragOverAnimationComplete');
          _this._ignoreWhileAnimating = null;
        });

        if (_this !== fromSortable) {
          fromSortable.animateAll();
          fromSortable._ignoreWhileAnimating = null;
        }
      } // Null lastTarget if it is not inside a previously swapped element


      if (target === dragEl && !dragEl.animated || target === el && !target.animated) {
        lastTarget = null;
      } // no bubbling and not fallback


      if (!options.dragoverBubble && !evt.rootEl && target !== document) {
        dragEl.parentNode[expando]._isOutsideThisEl(evt.target); // Do not detect for empty insert if already inserted


        !insertion && nearestEmptyInsertDetectEvent(evt);
      }

      !options.dragoverBubble && evt.stopPropagation && evt.stopPropagation();
      return completedFired = true;
    } // Call when dragEl has been inserted


    function changed() {
      newIndex = index(dragEl);
      newDraggableIndex = index(dragEl, options.draggable);

      _dispatchEvent({
        sortable: _this,
        name: 'change',
        toEl: el,
        newIndex: newIndex,
        newDraggableIndex: newDraggableIndex,
        originalEvent: evt
      });
    }

    if (evt.preventDefault !== void 0) {
      evt.cancelable && evt.preventDefault();
    }

    target = closest(target, options.draggable, el, true);
    dragOverEvent('dragOver');
    if (Sortable.eventCanceled) return completedFired;

    if (dragEl.contains(evt.target) || target.animated && target.animatingX && target.animatingY || _this._ignoreWhileAnimating === target) {
      return completed(false);
    }

    ignoreNextClick = false;

    if (activeSortable && !options.disabled && (isOwner ? canSort || (revert = !rootEl.contains(dragEl)) // Reverting item into the original list
    : putSortable === this || (this.lastPutMode = activeGroup.checkPull(this, activeSortable, dragEl, evt)) && group.checkPut(this, activeSortable, dragEl, evt))) {
      vertical = this._getDirection(evt, target) === 'vertical';
      dragRect = getRect(dragEl);
      dragOverEvent('dragOverValid');
      if (Sortable.eventCanceled) return completedFired;

      if (revert) {
        parentEl = rootEl; // actualization

        capture();

        this._hideClone();

        dragOverEvent('revert');

        if (!Sortable.eventCanceled) {
          if (nextEl) {
            rootEl.insertBefore(dragEl, nextEl);
          } else {
            rootEl.appendChild(dragEl);
          }
        }

        return completed(true);
      }

      var elLastChild = lastChild(el, options.draggable);

      if (!elLastChild || _ghostIsLast(evt, vertical, this) && !elLastChild.animated) {
        // If already at end of list: Do not insert
        if (elLastChild === dragEl) {
          return completed(false);
        } // assign target only if condition is true


        if (elLastChild && el === evt.target) {
          target = elLastChild;
        }

        if (target) {
          targetRect = getRect(target);
        }

        if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, !!target) !== false) {
          capture();
          el.appendChild(dragEl);
          parentEl = el; // actualization

          changed();
          return completed(true);
        }
      } else if (target.parentNode === el) {
        targetRect = getRect(target);
        var direction = 0,
            targetBeforeFirstSwap,
            differentLevel = dragEl.parentNode !== el,
            differentRowCol = !_dragElInRowColumn(dragEl.animated && dragEl.toRect || dragRect, target.animated && target.toRect || targetRect, vertical),
            side1 = vertical ? 'top' : 'left',
            scrolledPastTop = isScrolledPast(target, 'top', 'top') || isScrolledPast(dragEl, 'top', 'top'),
            scrollBefore = scrolledPastTop ? scrolledPastTop.scrollTop : void 0;

        if (lastTarget !== target) {
          targetBeforeFirstSwap = targetRect[side1];
          pastFirstInvertThresh = false;
          isCircumstantialInvert = !differentRowCol && options.invertSwap || differentLevel;
        }

        direction = _getSwapDirection(evt, target, targetRect, vertical, differentRowCol ? 1 : options.swapThreshold, options.invertedSwapThreshold == null ? options.swapThreshold : options.invertedSwapThreshold, isCircumstantialInvert, lastTarget === target);
        var sibling;

        if (direction !== 0) {
          // Check if target is beside dragEl in respective direction (ignoring hidden elements)
          var dragIndex = index(dragEl);

          do {
            dragIndex -= direction;
            sibling = parentEl.children[dragIndex];
          } while (sibling && (css(sibling, 'display') === 'none' || sibling === ghostEl));
        } // If dragEl is already beside target: Do not insert


        if (direction === 0 || sibling === target) {
          return completed(false);
        }

        lastTarget = target;
        lastDirection = direction;
        var nextSibling = target.nextElementSibling,
            after = false;
        after = direction === 1;

        var moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, after);

        if (moveVector !== false) {
          if (moveVector === 1 || moveVector === -1) {
            after = moveVector === 1;
          }

          _silent = true;
          setTimeout(_unsilent, 30);
          capture();

          if (after && !nextSibling) {
            el.appendChild(dragEl);
          } else {
            target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
          } // Undo chrome's scroll adjustment (has no effect on other browsers)


          if (scrolledPastTop) {
            scrollBy(scrolledPastTop, 0, scrollBefore - scrolledPastTop.scrollTop);
          }

          parentEl = dragEl.parentNode; // actualization
          // must be done before animation

          if (targetBeforeFirstSwap !== undefined && !isCircumstantialInvert) {
            targetMoveDistance = Math.abs(targetBeforeFirstSwap - getRect(target)[side1]);
          }

          changed();
          return completed(true);
        }
      }

      if (el.contains(dragEl)) {
        return completed(false);
      }
    }

    return false;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function _offMoveEvents() {
    off(document, 'mousemove', this._onTouchMove);
    off(document, 'touchmove', this._onTouchMove);
    off(document, 'pointermove', this._onTouchMove);
    off(document, 'dragover', nearestEmptyInsertDetectEvent);
    off(document, 'mousemove', nearestEmptyInsertDetectEvent);
    off(document, 'touchmove', nearestEmptyInsertDetectEvent);
  },
  _offUpEvents: function _offUpEvents() {
    var ownerDocument = this.el.ownerDocument;
    off(ownerDocument, 'mouseup', this._onDrop);
    off(ownerDocument, 'touchend', this._onDrop);
    off(ownerDocument, 'pointerup', this._onDrop);
    off(ownerDocument, 'touchcancel', this._onDrop);
    off(document, 'selectstart', this);
  },
  _onDrop: function _onDrop(
  /**Event*/
  evt) {
    var el = this.el,
        options = this.options; // Get the index of the dragged element within its parent

    newIndex = index(dragEl);
    newDraggableIndex = index(dragEl, options.draggable);
    pluginEvent('drop', this, {
      evt: evt
    });
    parentEl = dragEl && dragEl.parentNode; // Get again after plugin event

    newIndex = index(dragEl);
    newDraggableIndex = index(dragEl, options.draggable);

    if (Sortable.eventCanceled) {
      this._nulling();

      return;
    }

    awaitingDragStarted = false;
    isCircumstantialInvert = false;
    pastFirstInvertThresh = false;
    clearInterval(this._loopId);
    clearTimeout(this._dragStartTimer);

    _cancelNextTick(this.cloneId);

    _cancelNextTick(this._dragStartId); // Unbind events


    if (this.nativeDraggable) {
      off(document, 'drop', this);
      off(el, 'dragstart', this._onDragStart);
    }

    this._offMoveEvents();

    this._offUpEvents();

    if (Safari) {
      css(document.body, 'user-select', '');
    }

    css(dragEl, 'transform', '');

    if (evt) {
      if (moved) {
        evt.cancelable && evt.preventDefault();
        !options.dropBubble && evt.stopPropagation();
      }

      ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);

      if (rootEl === parentEl || putSortable && putSortable.lastPutMode !== 'clone') {
        // Remove clone(s)
        cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
      }

      if (dragEl) {
        if (this.nativeDraggable) {
          off(dragEl, 'dragend', this);
        }

        _disableDraggable(dragEl);

        dragEl.style['will-change'] = ''; // Remove classes
        // ghostClass is added in dragStarted

        if (moved && !awaitingDragStarted) {
          toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : this.options.ghostClass, false);
        }

        toggleClass(dragEl, this.options.chosenClass, false); // Drag stop event

        _dispatchEvent({
          sortable: this,
          name: 'unchoose',
          toEl: parentEl,
          newIndex: null,
          newDraggableIndex: null,
          originalEvent: evt
        });

        if (rootEl !== parentEl) {
          if (newIndex >= 0) {
            // Add event
            _dispatchEvent({
              rootEl: parentEl,
              name: 'add',
              toEl: parentEl,
              fromEl: rootEl,
              originalEvent: evt
            }); // Remove event


            _dispatchEvent({
              sortable: this,
              name: 'remove',
              toEl: parentEl,
              originalEvent: evt
            }); // drag from one list and drop into another


            _dispatchEvent({
              rootEl: parentEl,
              name: 'sort',
              toEl: parentEl,
              fromEl: rootEl,
              originalEvent: evt
            });

            _dispatchEvent({
              sortable: this,
              name: 'sort',
              toEl: parentEl,
              originalEvent: evt
            });
          }

          putSortable && putSortable.save();
        } else {
          if (newIndex !== oldIndex) {
            if (newIndex >= 0) {
              // drag & drop within the same list
              _dispatchEvent({
                sortable: this,
                name: 'update',
                toEl: parentEl,
                originalEvent: evt
              });

              _dispatchEvent({
                sortable: this,
                name: 'sort',
                toEl: parentEl,
                originalEvent: evt
              });
            }
          }
        }

        if (Sortable.active) {
          /* jshint eqnull:true */
          if (newIndex == null || newIndex === -1) {
            newIndex = oldIndex;
            newDraggableIndex = oldDraggableIndex;
          }

          _dispatchEvent({
            sortable: this,
            name: 'end',
            toEl: parentEl,
            originalEvent: evt
          }); // Save sorting


          this.save();
        }
      }
    }

    this._nulling();
  },
  _nulling: function _nulling() {
    pluginEvent('nulling', this);
    rootEl = dragEl = parentEl = ghostEl = nextEl = cloneEl = lastDownEl = cloneHidden = tapEvt = touchEvt = moved = newIndex = newDraggableIndex = oldIndex = oldDraggableIndex = lastTarget = lastDirection = putSortable = activeGroup = Sortable.dragged = Sortable.ghost = Sortable.clone = Sortable.active = null;
    savedInputChecked.forEach(function (el) {
      el.checked = true;
    });
    savedInputChecked.length = lastDx = lastDy = 0;
  },
  handleEvent: function handleEvent(
  /**Event*/
  evt) {
    switch (evt.type) {
      case 'drop':
      case 'dragend':
        this._onDrop(evt);

        break;

      case 'dragenter':
      case 'dragover':
        if (dragEl) {
          this._onDragOver(evt);

          _globalDragOver(evt);
        }

        break;

      case 'selectstart':
        evt.preventDefault();
        break;
    }
  },

  /**
   * Serializes the item into an array of string.
   * @returns {String[]}
   */
  toArray: function toArray() {
    var order = [],
        el,
        children = this.el.children,
        i = 0,
        n = children.length,
        options = this.options;

    for (; i < n; i++) {
      el = children[i];

      if (closest(el, options.draggable, this.el, false)) {
        order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
      }
    }

    return order;
  },

  /**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
  sort: function sort(order) {
    var items = {},
        rootEl = this.el;
    this.toArray().forEach(function (id, i) {
      var el = rootEl.children[i];

      if (closest(el, this.options.draggable, rootEl, false)) {
        items[id] = el;
      }
    }, this);
    order.forEach(function (id) {
      if (items[id]) {
        rootEl.removeChild(items[id]);
        rootEl.appendChild(items[id]);
      }
    });
  },

  /**
   * Save the current sorting
   */
  save: function save() {
    var store = this.options.store;
    store && store.set && store.set(this);
  },

  /**
   * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
   * @param   {HTMLElement}  el
   * @param   {String}       [selector]  default: `options.draggable`
   * @returns {HTMLElement|null}
   */
  closest: function closest$1(el, selector) {
    return closest(el, selector || this.options.draggable, this.el, false);
  },

  /**
   * Set/get option
   * @param   {string} name
   * @param   {*}      [value]
   * @returns {*}
   */
  option: function option(name, value) {
    var options = this.options;

    if (value === void 0) {
      return options[name];
    } else {
      var modifiedValue = PluginManager.modifyOption(this, name, value);

      if (typeof modifiedValue !== 'undefined') {
        options[name] = modifiedValue;
      } else {
        options[name] = value;
      }

      if (name === 'group') {
        _prepareGroup(options);
      }
    }
  },

  /**
   * Destroy
   */
  destroy: function destroy() {
    pluginEvent('destroy', this);
    var el = this.el;
    el[expando] = null;
    off(el, 'mousedown', this._onTapStart);
    off(el, 'touchstart', this._onTapStart);
    off(el, 'pointerdown', this._onTapStart);

    if (this.nativeDraggable) {
      off(el, 'dragover', this);
      off(el, 'dragenter', this);
    } // Remove draggable attributes


    Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function (el) {
      el.removeAttribute('draggable');
    });

    this._onDrop();

    this._disableDelayedDragEvents();

    sortables.splice(sortables.indexOf(this.el), 1);
    this.el = el = null;
  },
  _hideClone: function _hideClone() {
    if (!cloneHidden) {
      pluginEvent('hideClone', this);
      if (Sortable.eventCanceled) return;
      css(cloneEl, 'display', 'none');

      if (this.options.removeCloneOnHide && cloneEl.parentNode) {
        cloneEl.parentNode.removeChild(cloneEl);
      }

      cloneHidden = true;
    }
  },
  _showClone: function _showClone(putSortable) {
    if (putSortable.lastPutMode !== 'clone') {
      this._hideClone();

      return;
    }

    if (cloneHidden) {
      pluginEvent('showClone', this);
      if (Sortable.eventCanceled) return; // show clone at dragEl or original position

      if (rootEl.contains(dragEl) && !this.options.group.revertClone) {
        rootEl.insertBefore(cloneEl, dragEl);
      } else if (nextEl) {
        rootEl.insertBefore(cloneEl, nextEl);
      } else {
        rootEl.appendChild(cloneEl);
      }

      if (this.options.group.revertClone) {
        this.animate(dragEl, cloneEl);
      }

      css(cloneEl, 'display', '');
      cloneHidden = false;
    }
  }
};

function _globalDragOver(
/**Event*/
evt) {
  if (evt.dataTransfer) {
    evt.dataTransfer.dropEffect = 'move';
  }

  evt.cancelable && evt.preventDefault();
}

function _onMove(fromEl, toEl, dragEl, dragRect, targetEl, targetRect, originalEvent, willInsertAfter) {
  var evt,
      sortable = fromEl[expando],
      onMoveFn = sortable.options.onMove,
      retVal; // Support for new CustomEvent feature

  if (window.CustomEvent && !IE11OrLess && !Edge) {
    evt = new CustomEvent('move', {
      bubbles: true,
      cancelable: true
    });
  } else {
    evt = document.createEvent('Event');
    evt.initEvent('move', true, true);
  }

  evt.to = toEl;
  evt.from = fromEl;
  evt.dragged = dragEl;
  evt.draggedRect = dragRect;
  evt.related = targetEl || toEl;
  evt.relatedRect = targetRect || getRect(toEl);
  evt.willInsertAfter = willInsertAfter;
  evt.originalEvent = originalEvent;
  fromEl.dispatchEvent(evt);

  if (onMoveFn) {
    retVal = onMoveFn.call(sortable, evt, originalEvent);
  }

  return retVal;
}

function _disableDraggable(el) {
  el.draggable = false;
}

function _unsilent() {
  _silent = false;
}

function _ghostIsLast(evt, vertical, sortable) {
  var rect = getRect(lastChild(sortable.el, sortable.options.draggable));
  var spacer = 10;
  return vertical ? evt.clientX > rect.right + spacer || evt.clientX <= rect.right && evt.clientY > rect.bottom && evt.clientX >= rect.left : evt.clientX > rect.right && evt.clientY > rect.top || evt.clientX <= rect.right && evt.clientY > rect.bottom + spacer;
}

function _getSwapDirection(evt, target, targetRect, vertical, swapThreshold, invertedSwapThreshold, invertSwap, isLastTarget) {
  var mouseOnAxis = vertical ? evt.clientY : evt.clientX,
      targetLength = vertical ? targetRect.height : targetRect.width,
      targetS1 = vertical ? targetRect.top : targetRect.left,
      targetS2 = vertical ? targetRect.bottom : targetRect.right,
      invert = false;

  if (!invertSwap) {
    // Never invert or create dragEl shadow when target movemenet causes mouse to move past the end of regular swapThreshold
    if (isLastTarget && targetMoveDistance < targetLength * swapThreshold) {
      // multiplied only by swapThreshold because mouse will already be inside target by (1 - threshold) * targetLength / 2
      // check if past first invert threshold on side opposite of lastDirection
      if (!pastFirstInvertThresh && (lastDirection === 1 ? mouseOnAxis > targetS1 + targetLength * invertedSwapThreshold / 2 : mouseOnAxis < targetS2 - targetLength * invertedSwapThreshold / 2)) {
        // past first invert threshold, do not restrict inverted threshold to dragEl shadow
        pastFirstInvertThresh = true;
      }

      if (!pastFirstInvertThresh) {
        // dragEl shadow (target move distance shadow)
        if (lastDirection === 1 ? mouseOnAxis < targetS1 + targetMoveDistance // over dragEl shadow
        : mouseOnAxis > targetS2 - targetMoveDistance) {
          return -lastDirection;
        }
      } else {
        invert = true;
      }
    } else {
      // Regular
      if (mouseOnAxis > targetS1 + targetLength * (1 - swapThreshold) / 2 && mouseOnAxis < targetS2 - targetLength * (1 - swapThreshold) / 2) {
        return _getInsertDirection(target);
      }
    }
  }

  invert = invert || invertSwap;

  if (invert) {
    // Invert of regular
    if (mouseOnAxis < targetS1 + targetLength * invertedSwapThreshold / 2 || mouseOnAxis > targetS2 - targetLength * invertedSwapThreshold / 2) {
      return mouseOnAxis > targetS1 + targetLength / 2 ? 1 : -1;
    }
  }

  return 0;
}
/**
 * Gets the direction dragEl must be swapped relative to target in order to make it
 * seem that dragEl has been "inserted" into that element's position
 * @param  {HTMLElement} target       The target whose position dragEl is being inserted at
 * @return {Number}                   Direction dragEl must be swapped
 */


function _getInsertDirection(target) {
  if (index(dragEl) < index(target)) {
    return 1;
  } else {
    return -1;
  }
}
/**
 * Generate id
 * @param   {HTMLElement} el
 * @returns {String}
 * @private
 */


function _generateId(el) {
  var str = el.tagName + el.className + el.src + el.href + el.textContent,
      i = str.length,
      sum = 0;

  while (i--) {
    sum += str.charCodeAt(i);
  }

  return sum.toString(36);
}

function _saveInputCheckedState(root) {
  savedInputChecked.length = 0;
  var inputs = root.getElementsByTagName('input');
  var idx = inputs.length;

  while (idx--) {
    var el = inputs[idx];
    el.checked && savedInputChecked.push(el);
  }
}

function _nextTick(fn) {
  return setTimeout(fn, 0);
}

function _cancelNextTick(id) {
  return clearTimeout(id);
} // Fixed #973:


if (documentExists) {
  on(document, 'touchmove', function (evt) {
    if ((Sortable.active || awaitingDragStarted) && evt.cancelable) {
      evt.preventDefault();
    }
  });
} // Export utils


Sortable.utils = {
  on: on,
  off: off,
  css: css,
  find: find,
  is: function is(el, selector) {
    return !!closest(el, selector, el, false);
  },
  extend: extend,
  throttle: throttle,
  closest: closest,
  toggleClass: toggleClass,
  clone: clone,
  index: index,
  nextTick: _nextTick,
  cancelNextTick: _cancelNextTick,
  detectDirection: _detectDirection,
  getChild: getChild
};
/**
 * Get the Sortable instance of an element
 * @param  {HTMLElement} element The element
 * @return {Sortable|undefined}         The instance of Sortable
 */

Sortable.get = function (element) {
  return element[expando];
};
/**
 * Mount a plugin to Sortable
 * @param  {...SortablePlugin|SortablePlugin[]} plugins       Plugins being mounted
 */


Sortable.mount = function () {
  for (var _len = arguments.length, plugins = new Array(_len), _key = 0; _key < _len; _key++) {
    plugins[_key] = arguments[_key];
  }

  if (plugins[0].constructor === Array) plugins = plugins[0];
  plugins.forEach(function (plugin) {
    if (!plugin.prototype || !plugin.prototype.constructor) {
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(plugin));
    }

    if (plugin.utils) Sortable.utils = _objectSpread({}, Sortable.utils, plugin.utils);
    PluginManager.mount(plugin);
  });
};
/**
 * Create sortable instance
 * @param {HTMLElement}  el
 * @param {Object}      [options]
 */


Sortable.create = function (el, options) {
  return new Sortable(el, options);
}; // Export


Sortable.version = version;

var autoScrolls = [],
    scrollEl,
    scrollRootEl,
    scrolling = false,
    lastAutoScrollX,
    lastAutoScrollY,
    touchEvt$1,
    pointerElemChangedInterval;

function AutoScrollPlugin() {
  function AutoScroll() {
    this.defaults = {
      scroll: true,
      scrollSensitivity: 30,
      scrollSpeed: 10,
      bubbleScroll: true
    }; // Bind all private methods

    for (var fn in this) {
      if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
        this[fn] = this[fn].bind(this);
      }
    }
  }

  AutoScroll.prototype = {
    dragStarted: function dragStarted(_ref) {
      var originalEvent = _ref.originalEvent;

      if (this.sortable.nativeDraggable) {
        on(document, 'dragover', this._handleAutoScroll);
      } else {
        if (this.options.supportPointer) {
          on(document, 'pointermove', this._handleFallbackAutoScroll);
        } else if (originalEvent.touches) {
          on(document, 'touchmove', this._handleFallbackAutoScroll);
        } else {
          on(document, 'mousemove', this._handleFallbackAutoScroll);
        }
      }
    },
    dragOverCompleted: function dragOverCompleted(_ref2) {
      var originalEvent = _ref2.originalEvent;

      // For when bubbling is canceled and using fallback (fallback 'touchmove' always reached)
      if (!this.options.dragOverBubble && !originalEvent.rootEl) {
        this._handleAutoScroll(originalEvent);
      }
    },
    drop: function drop() {
      if (this.sortable.nativeDraggable) {
        off(document, 'dragover', this._handleAutoScroll);
      } else {
        off(document, 'pointermove', this._handleFallbackAutoScroll);
        off(document, 'touchmove', this._handleFallbackAutoScroll);
        off(document, 'mousemove', this._handleFallbackAutoScroll);
      }

      clearPointerElemChangedInterval();
      clearAutoScrolls();
      cancelThrottle();
    },
    nulling: function nulling() {
      touchEvt$1 = scrollRootEl = scrollEl = scrolling = pointerElemChangedInterval = lastAutoScrollX = lastAutoScrollY = null;
      autoScrolls.length = 0;
    },
    _handleFallbackAutoScroll: function _handleFallbackAutoScroll(evt) {
      this._handleAutoScroll(evt, true);
    },
    _handleAutoScroll: function _handleAutoScroll(evt, fallback) {
      var _this = this;

      var x = (evt.touches ? evt.touches[0] : evt).clientX,
          y = (evt.touches ? evt.touches[0] : evt).clientY,
          elem = document.elementFromPoint(x, y);
      touchEvt$1 = evt; // IE does not seem to have native autoscroll,
      // Edge's autoscroll seems too conditional,
      // MACOS Safari does not have autoscroll,
      // Firefox and Chrome are good

      if (fallback || Edge || IE11OrLess || Safari) {
        autoScroll(evt, this.options, elem, fallback); // Listener for pointer element change

        var ogElemScroller = getParentAutoScrollElement(elem, true);

        if (scrolling && (!pointerElemChangedInterval || x !== lastAutoScrollX || y !== lastAutoScrollY)) {
          pointerElemChangedInterval && clearPointerElemChangedInterval(); // Detect for pointer elem change, emulating native DnD behaviour

          pointerElemChangedInterval = setInterval(function () {
            var newElem = getParentAutoScrollElement(document.elementFromPoint(x, y), true);

            if (newElem !== ogElemScroller) {
              ogElemScroller = newElem;
              clearAutoScrolls();
            }

            autoScroll(evt, _this.options, newElem, fallback);
          }, 10);
          lastAutoScrollX = x;
          lastAutoScrollY = y;
        }
      } else {
        // if DnD is enabled (and browser has good autoscrolling), first autoscroll will already scroll, so get parent autoscroll of first autoscroll
        if (!this.options.bubbleScroll || getParentAutoScrollElement(elem, true) === getWindowScrollingElement()) {
          clearAutoScrolls();
          return;
        }

        autoScroll(evt, this.options, getParentAutoScrollElement(elem, false), false);
      }
    }
  };
  return _extends(AutoScroll, {
    pluginName: 'scroll',
    initializeByDefault: true
  });
}

function clearAutoScrolls() {
  autoScrolls.forEach(function (autoScroll) {
    clearInterval(autoScroll.pid);
  });
  autoScrolls = [];
}

function clearPointerElemChangedInterval() {
  clearInterval(pointerElemChangedInterval);
}

var autoScroll = throttle(function (evt, options, rootEl, isFallback) {
  // Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=505521
  if (!options.scroll) return;
  var x = (evt.touches ? evt.touches[0] : evt).clientX,
      y = (evt.touches ? evt.touches[0] : evt).clientY,
      sens = options.scrollSensitivity,
      speed = options.scrollSpeed,
      winScroller = getWindowScrollingElement();
  var scrollThisInstance = false,
      scrollCustomFn; // New scroll root, set scrollEl

  if (scrollRootEl !== rootEl) {
    scrollRootEl = rootEl;
    clearAutoScrolls();
    scrollEl = options.scroll;
    scrollCustomFn = options.scrollFn;

    if (scrollEl === true) {
      scrollEl = getParentAutoScrollElement(rootEl, true);
    }
  }

  var layersOut = 0;
  var currentParent = scrollEl;

  do {
    var el = currentParent,
        rect = getRect(el),
        top = rect.top,
        bottom = rect.bottom,
        left = rect.left,
        right = rect.right,
        width = rect.width,
        height = rect.height,
        canScrollX = void 0,
        canScrollY = void 0,
        scrollWidth = el.scrollWidth,
        scrollHeight = el.scrollHeight,
        elCSS = css(el),
        scrollPosX = el.scrollLeft,
        scrollPosY = el.scrollTop;

    if (el === winScroller) {
      canScrollX = width < scrollWidth && (elCSS.overflowX === 'auto' || elCSS.overflowX === 'scroll' || elCSS.overflowX === 'visible');
      canScrollY = height < scrollHeight && (elCSS.overflowY === 'auto' || elCSS.overflowY === 'scroll' || elCSS.overflowY === 'visible');
    } else {
      canScrollX = width < scrollWidth && (elCSS.overflowX === 'auto' || elCSS.overflowX === 'scroll');
      canScrollY = height < scrollHeight && (elCSS.overflowY === 'auto' || elCSS.overflowY === 'scroll');
    }

    var vx = canScrollX && (Math.abs(right - x) <= sens && scrollPosX + width < scrollWidth) - (Math.abs(left - x) <= sens && !!scrollPosX);
    var vy = canScrollY && (Math.abs(bottom - y) <= sens && scrollPosY + height < scrollHeight) - (Math.abs(top - y) <= sens && !!scrollPosY);

    if (!autoScrolls[layersOut]) {
      for (var i = 0; i <= layersOut; i++) {
        if (!autoScrolls[i]) {
          autoScrolls[i] = {};
        }
      }
    }

    if (autoScrolls[layersOut].vx != vx || autoScrolls[layersOut].vy != vy || autoScrolls[layersOut].el !== el) {
      autoScrolls[layersOut].el = el;
      autoScrolls[layersOut].vx = vx;
      autoScrolls[layersOut].vy = vy;
      clearInterval(autoScrolls[layersOut].pid);

      if (vx != 0 || vy != 0) {
        scrollThisInstance = true;
        /* jshint loopfunc:true */

        autoScrolls[layersOut].pid = setInterval(function () {
          // emulate drag over during autoscroll (fallback), emulating native DnD behaviour
          if (isFallback && this.layer === 0) {
            Sortable.active._onTouchMove(touchEvt$1); // To move ghost if it is positioned absolutely

          }

          var scrollOffsetY = autoScrolls[this.layer].vy ? autoScrolls[this.layer].vy * speed : 0;
          var scrollOffsetX = autoScrolls[this.layer].vx ? autoScrolls[this.layer].vx * speed : 0;

          if (typeof scrollCustomFn === 'function') {
            if (scrollCustomFn.call(Sortable.dragged.parentNode[expando], scrollOffsetX, scrollOffsetY, evt, touchEvt$1, autoScrolls[this.layer].el) !== 'continue') {
              return;
            }
          }

          scrollBy(autoScrolls[this.layer].el, scrollOffsetX, scrollOffsetY);
        }.bind({
          layer: layersOut
        }), 24);
      }
    }

    layersOut++;
  } while (options.bubbleScroll && currentParent !== winScroller && (currentParent = getParentAutoScrollElement(currentParent, false)));

  scrolling = scrollThisInstance; // in case another function catches scrolling as false in between when it is not
}, 30);

var drop = function drop(_ref) {
  var originalEvent = _ref.originalEvent,
      putSortable = _ref.putSortable,
      dragEl = _ref.dragEl,
      activeSortable = _ref.activeSortable,
      dispatchSortableEvent = _ref.dispatchSortableEvent,
      hideGhostForTarget = _ref.hideGhostForTarget,
      unhideGhostForTarget = _ref.unhideGhostForTarget;
  if (!originalEvent) return;
  var toSortable = putSortable || activeSortable;
  hideGhostForTarget();
  var touch = originalEvent.changedTouches && originalEvent.changedTouches.length ? originalEvent.changedTouches[0] : originalEvent;
  var target = document.elementFromPoint(touch.clientX, touch.clientY);
  unhideGhostForTarget();

  if (toSortable && !toSortable.el.contains(target)) {
    dispatchSortableEvent('spill');
    this.onSpill({
      dragEl: dragEl,
      putSortable: putSortable
    });
  }
};

function Revert() {}

Revert.prototype = {
  startIndex: null,
  dragStart: function dragStart(_ref2) {
    var oldDraggableIndex = _ref2.oldDraggableIndex;
    this.startIndex = oldDraggableIndex;
  },
  onSpill: function onSpill(_ref3) {
    var dragEl = _ref3.dragEl,
        putSortable = _ref3.putSortable;
    this.sortable.captureAnimationState();

    if (putSortable) {
      putSortable.captureAnimationState();
    }

    var nextSibling = getChild(this.sortable.el, this.startIndex, this.options);

    if (nextSibling) {
      this.sortable.el.insertBefore(dragEl, nextSibling);
    } else {
      this.sortable.el.appendChild(dragEl);
    }

    this.sortable.animateAll();

    if (putSortable) {
      putSortable.animateAll();
    }
  },
  drop: drop
};

_extends(Revert, {
  pluginName: 'revertOnSpill'
});

function Remove() {}

Remove.prototype = {
  onSpill: function onSpill(_ref4) {
    var dragEl = _ref4.dragEl,
        putSortable = _ref4.putSortable;
    var parentSortable = putSortable || this.sortable;
    parentSortable.captureAnimationState();
    dragEl.parentNode && dragEl.parentNode.removeChild(dragEl);
    parentSortable.animateAll();
  },
  drop: drop
};

_extends(Remove, {
  pluginName: 'removeOnSpill'
});

var lastSwapEl;

function SwapPlugin() {
  function Swap() {
    this.defaults = {
      swapClass: 'sortable-swap-highlight'
    };
  }

  Swap.prototype = {
    dragStart: function dragStart(_ref) {
      var dragEl = _ref.dragEl;
      lastSwapEl = dragEl;
    },
    dragOverValid: function dragOverValid(_ref2) {
      var completed = _ref2.completed,
          target = _ref2.target,
          onMove = _ref2.onMove,
          activeSortable = _ref2.activeSortable,
          changed = _ref2.changed,
          cancel = _ref2.cancel;
      if (!activeSortable.options.swap) return;
      var el = this.sortable.el,
          options = this.options;

      if (target && target !== el) {
        var prevSwapEl = lastSwapEl;

        if (onMove(target) !== false) {
          toggleClass(target, options.swapClass, true);
          lastSwapEl = target;
        } else {
          lastSwapEl = null;
        }

        if (prevSwapEl && prevSwapEl !== lastSwapEl) {
          toggleClass(prevSwapEl, options.swapClass, false);
        }
      }

      changed();
      completed(true);
      cancel();
    },
    drop: function drop(_ref3) {
      var activeSortable = _ref3.activeSortable,
          putSortable = _ref3.putSortable,
          dragEl = _ref3.dragEl;
      var toSortable = putSortable || this.sortable;
      var options = this.options;
      lastSwapEl && toggleClass(lastSwapEl, options.swapClass, false);

      if (lastSwapEl && (options.swap || putSortable && putSortable.options.swap)) {
        if (dragEl !== lastSwapEl) {
          toSortable.captureAnimationState();
          if (toSortable !== activeSortable) activeSortable.captureAnimationState();
          swapNodes(dragEl, lastSwapEl);
          toSortable.animateAll();
          if (toSortable !== activeSortable) activeSortable.animateAll();
        }
      }
    },
    nulling: function nulling() {
      lastSwapEl = null;
    }
  };
  return _extends(Swap, {
    pluginName: 'swap',
    eventProperties: function eventProperties() {
      return {
        swapItem: lastSwapEl
      };
    }
  });
}

function swapNodes(n1, n2) {
  var p1 = n1.parentNode,
      p2 = n2.parentNode,
      i1,
      i2;
  if (!p1 || !p2 || p1.isEqualNode(n2) || p2.isEqualNode(n1)) return;
  i1 = index(n1);
  i2 = index(n2);

  if (p1.isEqualNode(p2) && i1 < i2) {
    i2++;
  }

  p1.insertBefore(n2, p1.children[i1]);
  p2.insertBefore(n1, p2.children[i2]);
}

var multiDragElements = [],
    multiDragClones = [],
    lastMultiDragSelect,
    // for selection with modifier key down (SHIFT)
multiDragSortable,
    initialFolding = false,
    // Initial multi-drag fold when drag started
folding = false,
    // Folding any other time
dragStarted = false,
    dragEl$1,
    clonesFromRect,
    clonesHidden;

function MultiDragPlugin() {
  function MultiDrag(sortable) {
    // Bind all private methods
    for (var fn in this) {
      if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
        this[fn] = this[fn].bind(this);
      }
    }

    if (sortable.options.supportPointer) {
      on(document, 'pointerup', this._deselectMultiDrag);
    } else {
      on(document, 'mouseup', this._deselectMultiDrag);
      on(document, 'touchend', this._deselectMultiDrag);
    }

    on(document, 'keydown', this._checkKeyDown);
    on(document, 'keyup', this._checkKeyUp);
    this.defaults = {
      selectedClass: 'sortable-selected',
      multiDragKey: null,
      setData: function setData(dataTransfer, dragEl) {
        var data = '';

        if (multiDragElements.length && multiDragSortable === sortable) {
          multiDragElements.forEach(function (multiDragElement, i) {
            data += (!i ? '' : ', ') + multiDragElement.textContent;
          });
        } else {
          data = dragEl.textContent;
        }

        dataTransfer.setData('Text', data);
      }
    };
  }

  MultiDrag.prototype = {
    multiDragKeyDown: false,
    isMultiDrag: false,
    delayStartGlobal: function delayStartGlobal(_ref) {
      var dragged = _ref.dragEl;
      dragEl$1 = dragged;
    },
    delayEnded: function delayEnded() {
      this.isMultiDrag = ~multiDragElements.indexOf(dragEl$1);
    },
    setupClone: function setupClone(_ref2) {
      var sortable = _ref2.sortable,
          cancel = _ref2.cancel;
      if (!this.isMultiDrag) return;

      for (var i = 0; i < multiDragElements.length; i++) {
        multiDragClones.push(clone(multiDragElements[i]));
        multiDragClones[i].sortableIndex = multiDragElements[i].sortableIndex;
        multiDragClones[i].draggable = false;
        multiDragClones[i].style['will-change'] = '';
        toggleClass(multiDragClones[i], this.options.selectedClass, false);
        multiDragElements[i] === dragEl$1 && toggleClass(multiDragClones[i], this.options.chosenClass, false);
      }

      sortable._hideClone();

      cancel();
    },
    clone: function clone(_ref3) {
      var sortable = _ref3.sortable,
          rootEl = _ref3.rootEl,
          dispatchSortableEvent = _ref3.dispatchSortableEvent,
          cancel = _ref3.cancel;
      if (!this.isMultiDrag) return;

      if (!this.options.removeCloneOnHide) {
        if (multiDragElements.length && multiDragSortable === sortable) {
          insertMultiDragClones(true, rootEl);
          dispatchSortableEvent('clone');
          cancel();
        }
      }
    },
    showClone: function showClone(_ref4) {
      var cloneNowShown = _ref4.cloneNowShown,
          rootEl = _ref4.rootEl,
          cancel = _ref4.cancel;
      if (!this.isMultiDrag) return;
      insertMultiDragClones(false, rootEl);
      multiDragClones.forEach(function (clone) {
        css(clone, 'display', '');
      });
      cloneNowShown();
      clonesHidden = false;
      cancel();
    },
    hideClone: function hideClone(_ref5) {
      var _this = this;

      var sortable = _ref5.sortable,
          cloneNowHidden = _ref5.cloneNowHidden,
          cancel = _ref5.cancel;
      if (!this.isMultiDrag) return;
      multiDragClones.forEach(function (clone) {
        css(clone, 'display', 'none');

        if (_this.options.removeCloneOnHide && clone.parentNode) {
          clone.parentNode.removeChild(clone);
        }
      });
      cloneNowHidden();
      clonesHidden = true;
      cancel();
    },
    dragStartGlobal: function dragStartGlobal(_ref6) {
      var sortable = _ref6.sortable;

      if (!this.isMultiDrag && multiDragSortable) {
        multiDragSortable.multiDrag._deselectMultiDrag();
      }

      multiDragElements.forEach(function (multiDragElement) {
        multiDragElement.sortableIndex = index(multiDragElement);
      }); // Sort multi-drag elements

      multiDragElements = multiDragElements.sort(function (a, b) {
        return a.sortableIndex - b.sortableIndex;
      });
      dragStarted = true;
    },
    dragStarted: function dragStarted(_ref7) {
      var _this2 = this;

      var sortable = _ref7.sortable;
      if (!this.isMultiDrag) return;

      if (this.options.sort) {
        // Capture rects,
        // hide multi drag elements (by positioning them absolute),
        // set multi drag elements rects to dragRect,
        // show multi drag elements,
        // animate to rects,
        // unset rects & remove from DOM
        sortable.captureAnimationState();

        if (this.options.animation) {
          multiDragElements.forEach(function (multiDragElement) {
            if (multiDragElement === dragEl$1) return;
            css(multiDragElement, 'position', 'absolute');
          });
          var dragRect = getRect(dragEl$1, false, true, true);
          multiDragElements.forEach(function (multiDragElement) {
            if (multiDragElement === dragEl$1) return;
            setRect(multiDragElement, dragRect);
          });
          folding = true;
          initialFolding = true;
        }
      }

      sortable.animateAll(function () {
        folding = false;
        initialFolding = false;

        if (_this2.options.animation) {
          multiDragElements.forEach(function (multiDragElement) {
            unsetRect(multiDragElement);
          });
        } // Remove all auxiliary multidrag items from el, if sorting enabled


        if (_this2.options.sort) {
          removeMultiDragElements();
        }
      });
    },
    dragOver: function dragOver(_ref8) {
      var target = _ref8.target,
          completed = _ref8.completed,
          cancel = _ref8.cancel;

      if (folding && ~multiDragElements.indexOf(target)) {
        completed(false);
        cancel();
      }
    },
    revert: function revert(_ref9) {
      var fromSortable = _ref9.fromSortable,
          rootEl = _ref9.rootEl,
          sortable = _ref9.sortable,
          dragRect = _ref9.dragRect;

      if (multiDragElements.length > 1) {
        // Setup unfold animation
        multiDragElements.forEach(function (multiDragElement) {
          sortable.addAnimationState({
            target: multiDragElement,
            rect: folding ? getRect(multiDragElement) : dragRect
          });
          unsetRect(multiDragElement);
          multiDragElement.fromRect = dragRect;
          fromSortable.removeAnimationState(multiDragElement);
        });
        folding = false;
        insertMultiDragElements(!this.options.removeCloneOnHide, rootEl);
      }
    },
    dragOverCompleted: function dragOverCompleted(_ref10) {
      var sortable = _ref10.sortable,
          isOwner = _ref10.isOwner,
          insertion = _ref10.insertion,
          activeSortable = _ref10.activeSortable,
          parentEl = _ref10.parentEl,
          putSortable = _ref10.putSortable;
      var options = this.options;

      if (insertion) {
        // Clones must be hidden before folding animation to capture dragRectAbsolute properly
        if (isOwner) {
          activeSortable._hideClone();
        }

        initialFolding = false; // If leaving sort:false root, or already folding - Fold to new location

        if (options.animation && multiDragElements.length > 1 && (folding || !isOwner && !activeSortable.options.sort && !putSortable)) {
          // Fold: Set all multi drag elements's rects to dragEl's rect when multi-drag elements are invisible
          var dragRectAbsolute = getRect(dragEl$1, false, true, true);
          multiDragElements.forEach(function (multiDragElement) {
            if (multiDragElement === dragEl$1) return;
            setRect(multiDragElement, dragRectAbsolute); // Move element(s) to end of parentEl so that it does not interfere with multi-drag clones insertion if they are inserted
            // while folding, and so that we can capture them again because old sortable will no longer be fromSortable

            parentEl.appendChild(multiDragElement);
          });
          folding = true;
        } // Clones must be shown (and check to remove multi drags) after folding when interfering multiDragElements are moved out


        if (!isOwner) {
          // Only remove if not folding (folding will remove them anyways)
          if (!folding) {
            removeMultiDragElements();
          }

          if (multiDragElements.length > 1) {
            var clonesHiddenBefore = clonesHidden;

            activeSortable._showClone(sortable); // Unfold animation for clones if showing from hidden


            if (activeSortable.options.animation && !clonesHidden && clonesHiddenBefore) {
              multiDragClones.forEach(function (clone) {
                activeSortable.addAnimationState({
                  target: clone,
                  rect: clonesFromRect
                });
                clone.fromRect = clonesFromRect;
                clone.thisAnimationDuration = null;
              });
            }
          } else {
            activeSortable._showClone(sortable);
          }
        }
      }
    },
    dragOverAnimationCapture: function dragOverAnimationCapture(_ref11) {
      var dragRect = _ref11.dragRect,
          isOwner = _ref11.isOwner,
          activeSortable = _ref11.activeSortable;
      multiDragElements.forEach(function (multiDragElement) {
        multiDragElement.thisAnimationDuration = null;
      });

      if (activeSortable.options.animation && !isOwner && activeSortable.multiDrag.isMultiDrag) {
        clonesFromRect = _extends({}, dragRect);
        var dragMatrix = matrix(dragEl$1, true);
        clonesFromRect.top -= dragMatrix.f;
        clonesFromRect.left -= dragMatrix.e;
      }
    },
    dragOverAnimationComplete: function dragOverAnimationComplete() {
      if (folding) {
        folding = false;
        removeMultiDragElements();
      }
    },
    drop: function drop(_ref12) {
      var evt = _ref12.originalEvent,
          rootEl = _ref12.rootEl,
          parentEl = _ref12.parentEl,
          sortable = _ref12.sortable,
          dispatchSortableEvent = _ref12.dispatchSortableEvent,
          oldIndex = _ref12.oldIndex,
          putSortable = _ref12.putSortable;
      var toSortable = putSortable || this.sortable;
      if (!evt) return;
      var options = this.options,
          children = parentEl.children; // Multi-drag selection

      if (!dragStarted) {
        if (options.multiDragKey && !this.multiDragKeyDown) {
          this._deselectMultiDrag();
        }

        toggleClass(dragEl$1, options.selectedClass, !~multiDragElements.indexOf(dragEl$1));

        if (!~multiDragElements.indexOf(dragEl$1)) {
          multiDragElements.push(dragEl$1);
          dispatchEvent({
            sortable: sortable,
            rootEl: rootEl,
            name: 'select',
            targetEl: dragEl$1,
            originalEvt: evt
          }); // Modifier activated, select from last to dragEl

          if (evt.shiftKey && lastMultiDragSelect && sortable.el.contains(lastMultiDragSelect)) {
            var lastIndex = index(lastMultiDragSelect),
                currentIndex = index(dragEl$1);

            if (~lastIndex && ~currentIndex && lastIndex !== currentIndex) {
              // Must include lastMultiDragSelect (select it), in case modified selection from no selection
              // (but previous selection existed)
              var n, i;

              if (currentIndex > lastIndex) {
                i = lastIndex;
                n = currentIndex;
              } else {
                i = currentIndex;
                n = lastIndex + 1;
              }

              for (; i < n; i++) {
                if (~multiDragElements.indexOf(children[i])) continue;
                toggleClass(children[i], options.selectedClass, true);
                multiDragElements.push(children[i]);
                dispatchEvent({
                  sortable: sortable,
                  rootEl: rootEl,
                  name: 'select',
                  targetEl: children[i],
                  originalEvt: evt
                });
              }
            }
          } else {
            lastMultiDragSelect = dragEl$1;
          }

          multiDragSortable = toSortable;
        } else {
          multiDragElements.splice(multiDragElements.indexOf(dragEl$1), 1);
          lastMultiDragSelect = null;
          dispatchEvent({
            sortable: sortable,
            rootEl: rootEl,
            name: 'deselect',
            targetEl: dragEl$1,
            originalEvt: evt
          });
        }
      } // Multi-drag drop


      if (dragStarted && this.isMultiDrag) {
        // Do not "unfold" after around dragEl if reverted
        if ((parentEl[expando].options.sort || parentEl !== rootEl) && multiDragElements.length > 1) {
          var dragRect = getRect(dragEl$1),
              multiDragIndex = index(dragEl$1, ':not(.' + this.options.selectedClass + ')');
          if (!initialFolding && options.animation) dragEl$1.thisAnimationDuration = null;
          toSortable.captureAnimationState();

          if (!initialFolding) {
            if (options.animation) {
              dragEl$1.fromRect = dragRect;
              multiDragElements.forEach(function (multiDragElement) {
                multiDragElement.thisAnimationDuration = null;

                if (multiDragElement !== dragEl$1) {
                  var rect = folding ? getRect(multiDragElement) : dragRect;
                  multiDragElement.fromRect = rect; // Prepare unfold animation

                  toSortable.addAnimationState({
                    target: multiDragElement,
                    rect: rect
                  });
                }
              });
            } // Multi drag elements are not necessarily removed from the DOM on drop, so to reinsert
            // properly they must all be removed


            removeMultiDragElements();
            multiDragElements.forEach(function (multiDragElement) {
              if (children[multiDragIndex]) {
                parentEl.insertBefore(multiDragElement, children[multiDragIndex]);
              } else {
                parentEl.appendChild(multiDragElement);
              }

              multiDragIndex++;
            }); // If initial folding is done, the elements may have changed position because they are now
            // unfolding around dragEl, even though dragEl may not have his index changed, so update event
            // must be fired here as Sortable will not.

            if (oldIndex === index(dragEl$1)) {
              var update = false;
              multiDragElements.forEach(function (multiDragElement) {
                if (multiDragElement.sortableIndex !== index(multiDragElement)) {
                  update = true;
                  return;
                }
              });

              if (update) {
                dispatchSortableEvent('update');
              }
            }
          } // Must be done after capturing individual rects (scroll bar)


          multiDragElements.forEach(function (multiDragElement) {
            unsetRect(multiDragElement);
          });
          toSortable.animateAll();
        }

        multiDragSortable = toSortable;
      } // Remove clones if necessary


      if (rootEl === parentEl || putSortable && putSortable.lastPutMode !== 'clone') {
        multiDragClones.forEach(function (clone) {
          clone.parentNode && clone.parentNode.removeChild(clone);
        });
      }
    },
    nullingGlobal: function nullingGlobal() {
      this.isMultiDrag = dragStarted = false;
      multiDragClones.length = 0;
    },
    destroyGlobal: function destroyGlobal() {
      this._deselectMultiDrag();

      off(document, 'pointerup', this._deselectMultiDrag);
      off(document, 'mouseup', this._deselectMultiDrag);
      off(document, 'touchend', this._deselectMultiDrag);
      off(document, 'keydown', this._checkKeyDown);
      off(document, 'keyup', this._checkKeyUp);
    },
    _deselectMultiDrag: function _deselectMultiDrag(evt) {
      if (typeof dragStarted !== "undefined" && dragStarted) return; // Only deselect if selection is in this sortable

      if (multiDragSortable !== this.sortable) return; // Only deselect if target is not item in this sortable

      if (evt && closest(evt.target, this.options.draggable, this.sortable.el, false)) return; // Only deselect if left click

      if (evt && evt.button !== 0) return;

      while (multiDragElements.length) {
        var el = multiDragElements[0];
        toggleClass(el, this.options.selectedClass, false);
        multiDragElements.shift();
        dispatchEvent({
          sortable: this.sortable,
          rootEl: this.sortable.el,
          name: 'deselect',
          targetEl: el,
          originalEvt: evt
        });
      }
    },
    _checkKeyDown: function _checkKeyDown(evt) {
      if (evt.key === this.options.multiDragKey) {
        this.multiDragKeyDown = true;
      }
    },
    _checkKeyUp: function _checkKeyUp(evt) {
      if (evt.key === this.options.multiDragKey) {
        this.multiDragKeyDown = false;
      }
    }
  };
  return _extends(MultiDrag, {
    // Static methods & properties
    pluginName: 'multiDrag',
    utils: {
      /**
       * Selects the provided multi-drag item
       * @param  {HTMLElement} el    The element to be selected
       */
      select: function select(el) {
        var sortable = el.parentNode[expando];
        if (!sortable || !sortable.options.multiDrag || ~multiDragElements.indexOf(el)) return;

        if (multiDragSortable && multiDragSortable !== sortable) {
          multiDragSortable.multiDrag._deselectMultiDrag();

          multiDragSortable = sortable;
        }

        toggleClass(el, sortable.options.selectedClass, true);
        multiDragElements.push(el);
      },

      /**
       * Deselects the provided multi-drag item
       * @param  {HTMLElement} el    The element to be deselected
       */
      deselect: function deselect(el) {
        var sortable = el.parentNode[expando],
            index = multiDragElements.indexOf(el);
        if (!sortable || !sortable.options.multiDrag || !~index) return;
        toggleClass(el, sortable.options.selectedClass, false);
        multiDragElements.splice(index, 1);
      }
    },
    eventProperties: function eventProperties() {
      var _this3 = this;

      var oldIndicies = [],
          newIndicies = [];
      multiDragElements.forEach(function (multiDragElement) {
        oldIndicies.push({
          multiDragElement: multiDragElement,
          index: multiDragElement.sortableIndex
        }); // multiDragElements will already be sorted if folding

        var newIndex;

        if (folding && multiDragElement !== dragEl$1) {
          newIndex = -1;
        } else if (folding) {
          newIndex = index(multiDragElement, ':not(.' + _this3.options.selectedClass + ')');
        } else {
          newIndex = index(multiDragElement);
        }

        newIndicies.push({
          multiDragElement: multiDragElement,
          index: newIndex
        });
      });
      return {
        items: _toConsumableArray(multiDragElements),
        clones: [].concat(multiDragClones),
        oldIndicies: oldIndicies,
        newIndicies: newIndicies
      };
    },
    optionListeners: {
      multiDragKey: function multiDragKey(key) {
        key = key.toLowerCase();

        if (key === 'ctrl') {
          key = 'Control';
        } else if (key.length > 1) {
          key = key.charAt(0).toUpperCase() + key.substr(1);
        }

        return key;
      }
    }
  });
}

function insertMultiDragElements(clonesInserted, rootEl) {
  multiDragElements.forEach(function (multiDragElement, i) {
    var target = rootEl.children[multiDragElement.sortableIndex + (clonesInserted ? Number(i) : 0)];

    if (target) {
      rootEl.insertBefore(multiDragElement, target);
    } else {
      rootEl.appendChild(multiDragElement);
    }
  });
}
/**
 * Insert multi-drag clones
 * @param  {[Boolean]} elementsInserted  Whether the multi-drag elements are inserted
 * @param  {HTMLElement} rootEl
 */


function insertMultiDragClones(elementsInserted, rootEl) {
  multiDragClones.forEach(function (clone, i) {
    var target = rootEl.children[clone.sortableIndex + (elementsInserted ? Number(i) : 0)];

    if (target) {
      rootEl.insertBefore(clone, target);
    } else {
      rootEl.appendChild(clone);
    }
  });
}

function removeMultiDragElements() {
  multiDragElements.forEach(function (multiDragElement) {
    if (multiDragElement === dragEl$1) return;
    multiDragElement.parentNode && multiDragElement.parentNode.removeChild(multiDragElement);
  });
}

Sortable.mount(new AutoScrollPlugin());
Sortable.mount(Remove, Revert);

/* harmony default export */ __webpack_exports__["default"] = (Sortable);



/***/ }),

/***/ 9980:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory(__webpack_require__(1474));
	else {}
})((typeof self !== 'undefined' ? self : this), function(__WEBPACK_EXTERNAL_MODULE_a352__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __nested_webpack_require_688__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __nested_webpack_require_688__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__nested_webpack_require_688__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__nested_webpack_require_688__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__nested_webpack_require_688__.d = function(exports, name, getter) {
/******/ 		if(!__nested_webpack_require_688__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__nested_webpack_require_688__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__nested_webpack_require_688__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __nested_webpack_require_688__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__nested_webpack_require_688__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __nested_webpack_require_688__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__nested_webpack_require_688__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__nested_webpack_require_688__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__nested_webpack_require_688__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__nested_webpack_require_688__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __nested_webpack_require_688__(__nested_webpack_require_688__.s = "fb15");
/******/ })
/************************************************************************/
/******/ ({

/***/ "01f9":
/***/ (function(module, exports, __nested_webpack_require_4164__) {

"use strict";

var LIBRARY = __nested_webpack_require_4164__("2d00");
var $export = __nested_webpack_require_4164__("5ca1");
var redefine = __nested_webpack_require_4164__("2aba");
var hide = __nested_webpack_require_4164__("32e9");
var Iterators = __nested_webpack_require_4164__("84f2");
var $iterCreate = __nested_webpack_require_4164__("41a0");
var setToStringTag = __nested_webpack_require_4164__("7f20");
var getPrototypeOf = __nested_webpack_require_4164__("38fd");
var ITERATOR = __nested_webpack_require_4164__("2b4c")('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),

/***/ "02f4":
/***/ (function(module, exports, __nested_webpack_require_7070__) {

var toInteger = __nested_webpack_require_7070__("4588");
var defined = __nested_webpack_require_7070__("be13");
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),

/***/ "0390":
/***/ (function(module, exports, __nested_webpack_require_7783__) {

"use strict";

var at = __nested_webpack_require_7783__("02f4")(true);

 // `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? at(S, index).length : 1);
};


/***/ }),

/***/ "0bfb":
/***/ (function(module, exports, __nested_webpack_require_8134__) {

"use strict";

// 21.2.5.3 get RegExp.prototype.flags
var anObject = __nested_webpack_require_8134__("cb7c");
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),

/***/ "0d58":
/***/ (function(module, exports, __nested_webpack_require_8593__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __nested_webpack_require_8593__("ce10");
var enumBugKeys = __nested_webpack_require_8593__("e11e");

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ "1495":
/***/ (function(module, exports, __nested_webpack_require_8892__) {

var dP = __nested_webpack_require_8892__("86cc");
var anObject = __nested_webpack_require_8892__("cb7c");
var getKeys = __nested_webpack_require_8892__("0d58");

module.exports = __nested_webpack_require_8892__("9e1e") ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),

/***/ "214f":
/***/ (function(module, exports, __nested_webpack_require_9392__) {

"use strict";

__nested_webpack_require_9392__("b0c5");
var redefine = __nested_webpack_require_9392__("2aba");
var hide = __nested_webpack_require_9392__("32e9");
var fails = __nested_webpack_require_9392__("79e5");
var defined = __nested_webpack_require_9392__("be13");
var wks = __nested_webpack_require_9392__("2b4c");
var regexpExec = __nested_webpack_require_9392__("520a");

var SPECIES = wks('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length === 2 && result[0] === 'a' && result[1] === 'b';
})();

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;
    re.exec = function () { execCalled = true; return null; };
    if (KEY === 'split') {
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
    }
    re[SYMBOL]('');
    return !execCalled;
  }) : undefined;

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var fns = exec(
      defined,
      SYMBOL,
      ''[KEY],
      function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
        if (regexp.exec === regexpExec) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            // The native String method already delegates to @@method (this
            // polyfilled function), leasing to infinite recursion.
            // We avoid it by directly calling the native @@method method.
            return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
          }
          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
        }
        return { done: false };
      }
    );
    var strfn = fns[0];
    var rxfn = fns[1];

    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};


/***/ }),

/***/ "230e":
/***/ (function(module, exports, __nested_webpack_require_12849__) {

var isObject = __nested_webpack_require_12849__("d3f4");
var document = __nested_webpack_require_12849__("7726").document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ "23c6":
/***/ (function(module, exports, __nested_webpack_require_13233__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __nested_webpack_require_13233__("2d95");
var TAG = __nested_webpack_require_13233__("2b4c")('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),

/***/ "2621":
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ "2aba":
/***/ (function(module, exports, __nested_webpack_require_14160__) {

var global = __nested_webpack_require_14160__("7726");
var hide = __nested_webpack_require_14160__("32e9");
var has = __nested_webpack_require_14160__("69a8");
var SRC = __nested_webpack_require_14160__("ca5a")('src');
var $toString = __nested_webpack_require_14160__("fa5b");
var TO_STRING = 'toString';
var TPL = ('' + $toString).split(TO_STRING);

__nested_webpack_require_14160__("8378").inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),

/***/ "2aeb":
/***/ (function(module, exports, __nested_webpack_require_15334__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __nested_webpack_require_15334__("cb7c");
var dPs = __nested_webpack_require_15334__("1495");
var enumBugKeys = __nested_webpack_require_15334__("e11e");
var IE_PROTO = __nested_webpack_require_15334__("613b")('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __nested_webpack_require_15334__("230e")('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __nested_webpack_require_15334__("fab2").appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),

/***/ "2b4c":
/***/ (function(module, exports, __nested_webpack_require_16945__) {

var store = __nested_webpack_require_16945__("5537")('wks');
var uid = __nested_webpack_require_16945__("ca5a");
var Symbol = __nested_webpack_require_16945__("7726").Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),

/***/ "2d00":
/***/ (function(module, exports) {

module.exports = false;


/***/ }),

/***/ "2d95":
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "2fdb":
/***/ (function(module, exports, __nested_webpack_require_17667__) {

"use strict";
// 21.1.3.7 String.prototype.includes(searchString, position = 0)

var $export = __nested_webpack_require_17667__("5ca1");
var context = __nested_webpack_require_17667__("d2c8");
var INCLUDES = 'includes';

$export($export.P + $export.F * __nested_webpack_require_17667__("5147")(INCLUDES), 'String', {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ "32e9":
/***/ (function(module, exports, __nested_webpack_require_18235__) {

var dP = __nested_webpack_require_18235__("86cc");
var createDesc = __nested_webpack_require_18235__("4630");
module.exports = __nested_webpack_require_18235__("9e1e") ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "38fd":
/***/ (function(module, exports, __nested_webpack_require_18611__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __nested_webpack_require_18611__("69a8");
var toObject = __nested_webpack_require_18611__("4bf8");
var IE_PROTO = __nested_webpack_require_18611__("613b")('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),

/***/ "41a0":
/***/ (function(module, exports, __nested_webpack_require_19205__) {

"use strict";

var create = __nested_webpack_require_19205__("2aeb");
var descriptor = __nested_webpack_require_19205__("4630");
var setToStringTag = __nested_webpack_require_19205__("7f20");
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__nested_webpack_require_19205__("32e9")(IteratorPrototype, __nested_webpack_require_19205__("2b4c")('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),

/***/ "456d":
/***/ (function(module, exports, __nested_webpack_require_19831__) {

// 19.1.2.14 Object.keys(O)
var toObject = __nested_webpack_require_19831__("4bf8");
var $keys = __nested_webpack_require_19831__("0d58");

__nested_webpack_require_19831__("5eda")('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),

/***/ "4588":
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ "4630":
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "4bf8":
/***/ (function(module, exports, __nested_webpack_require_20609__) {

// 7.1.13 ToObject(argument)
var defined = __nested_webpack_require_20609__("be13");
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ "5147":
/***/ (function(module, exports, __nested_webpack_require_20831__) {

var MATCH = __nested_webpack_require_20831__("2b4c")('match');
module.exports = function (KEY) {
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch (e) {
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch (f) { /* empty */ }
  } return true;
};


/***/ }),

/***/ "520a":
/***/ (function(module, exports, __nested_webpack_require_21176__) {

"use strict";


var regexpFlags = __nested_webpack_require_21176__("0bfb");

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var LAST_INDEX = 'lastIndex';

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/,
      re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
})();

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

    match = nativeExec.call(re, str);

    if (UPDATES_LAST_INDEX_WRONG && match) {
      re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      // eslint-disable-next-line no-loop-func
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;


/***/ }),

/***/ "52a7":
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),

/***/ "5537":
/***/ (function(module, exports, __nested_webpack_require_23109__) {

var core = __nested_webpack_require_23109__("8378");
var global = __nested_webpack_require_23109__("7726");
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __nested_webpack_require_23109__("2d00") ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "5ca1":
/***/ (function(module, exports, __nested_webpack_require_23642__) {

var global = __nested_webpack_require_23642__("7726");
var core = __nested_webpack_require_23642__("8378");
var hide = __nested_webpack_require_23642__("32e9");
var redefine = __nested_webpack_require_23642__("2aba");
var ctx = __nested_webpack_require_23642__("9b43");
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ "5eda":
/***/ (function(module, exports, __nested_webpack_require_25367__) {

// most Object methods by ES6 should accept primitives
var $export = __nested_webpack_require_25367__("5ca1");
var core = __nested_webpack_require_25367__("8378");
var fails = __nested_webpack_require_25367__("79e5");
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),

/***/ "5f1b":
/***/ (function(module, exports, __nested_webpack_require_25845__) {

"use strict";


var classof = __nested_webpack_require_25845__("23c6");
var builtinExec = RegExp.prototype.exec;

 // `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw new TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }
  if (classof(R) !== 'RegExp') {
    throw new TypeError('RegExp#exec called on incompatible receiver');
  }
  return builtinExec.call(R, S);
};


/***/ }),

/***/ "613b":
/***/ (function(module, exports, __nested_webpack_require_26551__) {

var shared = __nested_webpack_require_26551__("5537")('keys');
var uid = __nested_webpack_require_26551__("ca5a");
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ "626a":
/***/ (function(module, exports, __nested_webpack_require_26811__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __nested_webpack_require_26811__("2d95");
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ "6762":
/***/ (function(module, exports, __nested_webpack_require_27194__) {

"use strict";

// https://github.com/tc39/Array.prototype.includes
var $export = __nested_webpack_require_27194__("5ca1");
var $includes = __nested_webpack_require_27194__("c366")(true);

$export($export.P, 'Array', {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

__nested_webpack_require_27194__("9c6c")('includes');


/***/ }),

/***/ "6821":
/***/ (function(module, exports, __nested_webpack_require_27659__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __nested_webpack_require_27659__("626a");
var defined = __nested_webpack_require_27659__("be13");
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ "69a8":
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "6a99":
/***/ (function(module, exports, __nested_webpack_require_28155__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __nested_webpack_require_28155__("d3f4");
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "7333":
/***/ (function(module, exports, __nested_webpack_require_28898__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __nested_webpack_require_28898__("0d58");
var gOPS = __nested_webpack_require_28898__("2621");
var pIE = __nested_webpack_require_28898__("52a7");
var toObject = __nested_webpack_require_28898__("4bf8");
var IObject = __nested_webpack_require_28898__("626a");
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __nested_webpack_require_28898__("79e5")(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;


/***/ }),

/***/ "7726":
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ "77f1":
/***/ (function(module, exports, __nested_webpack_require_30635__) {

var toInteger = __nested_webpack_require_30635__("4588");
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ "79e5":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ "7f20":
/***/ (function(module, exports, __nested_webpack_require_31112__) {

var def = __nested_webpack_require_31112__("86cc").f;
var has = __nested_webpack_require_31112__("69a8");
var TAG = __nested_webpack_require_31112__("2b4c")('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),

/***/ "8378":
/***/ (function(module, exports) {

var core = module.exports = { version: '2.6.5' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ "84f2":
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "86cc":
/***/ (function(module, exports, __nested_webpack_require_31751__) {

var anObject = __nested_webpack_require_31751__("cb7c");
var IE8_DOM_DEFINE = __nested_webpack_require_31751__("c69a");
var toPrimitive = __nested_webpack_require_31751__("6a99");
var dP = Object.defineProperty;

exports.f = __nested_webpack_require_31751__("9e1e") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "9b43":
/***/ (function(module, exports, __nested_webpack_require_32441__) {

// optional / simple context binding
var aFunction = __nested_webpack_require_32441__("d8e8");
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "9c6c":
/***/ (function(module, exports, __nested_webpack_require_33048__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __nested_webpack_require_33048__("2b4c")('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) __nested_webpack_require_33048__("32e9")(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ "9def":
/***/ (function(module, exports, __nested_webpack_require_33448__) {

// 7.1.15 ToLength
var toInteger = __nested_webpack_require_33448__("4588");
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ "9e1e":
/***/ (function(module, exports, __nested_webpack_require_33750__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__nested_webpack_require_33750__("79e5")(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "a352":
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_a352__;

/***/ }),

/***/ "a481":
/***/ (function(module, exports, __nested_webpack_require_34139__) {

"use strict";


var anObject = __nested_webpack_require_34139__("cb7c");
var toObject = __nested_webpack_require_34139__("4bf8");
var toLength = __nested_webpack_require_34139__("9def");
var toInteger = __nested_webpack_require_34139__("4588");
var advanceStringIndex = __nested_webpack_require_34139__("0390");
var regExpExec = __nested_webpack_require_34139__("5f1b");
var max = Math.max;
var min = Math.min;
var floor = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
__nested_webpack_require_34139__("214f")('replace', 2, function (defined, REPLACE, $replace, maybeCallNative) {
  return [
    // `String.prototype.replace` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = defined(this);
      var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
      return fn !== undefined
        ? fn.call(searchValue, O, replaceValue)
        : $replace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      var res = maybeCallNative($replace, regexp, this, replaceValue);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);
      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec(rx, S);
        if (result === null) break;
        results.push(result);
        if (!global) break;
        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }
      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];
        var matched = String(result[0]);
        var position = max(min(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];

    // https://tc39.github.io/ecma262/#sec-getsubstitution
  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return $replace.call(replacement, symbols, function (match, ch) {
      var capture;
      switch (ch.charAt(0)) {
        case '$': return '$';
        case '&': return matched;
        case '`': return str.slice(0, position);
        case "'": return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default: // \d\d?
          var n = +ch;
          if (n === 0) return match;
          if (n > m) {
            var f = floor(n / 10);
            if (f === 0) return match;
            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
            return match;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  }
});


/***/ }),

/***/ "aae3":
/***/ (function(module, exports, __nested_webpack_require_38885__) {

// 7.2.8 IsRegExp(argument)
var isObject = __nested_webpack_require_38885__("d3f4");
var cof = __nested_webpack_require_38885__("2d95");
var MATCH = __nested_webpack_require_38885__("2b4c")('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};


/***/ }),

/***/ "ac6a":
/***/ (function(module, exports, __nested_webpack_require_39282__) {

var $iterators = __nested_webpack_require_39282__("cadf");
var getKeys = __nested_webpack_require_39282__("0d58");
var redefine = __nested_webpack_require_39282__("2aba");
var global = __nested_webpack_require_39282__("7726");
var hide = __nested_webpack_require_39282__("32e9");
var Iterators = __nested_webpack_require_39282__("84f2");
var wks = __nested_webpack_require_39282__("2b4c");
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}


/***/ }),

/***/ "b0c5":
/***/ (function(module, exports, __nested_webpack_require_41209__) {

"use strict";

var regexpExec = __nested_webpack_require_41209__("520a");
__nested_webpack_require_41209__("5ca1")({
  target: 'RegExp',
  proto: true,
  forced: regexpExec !== /./.exec
}, {
  exec: regexpExec
});


/***/ }),

/***/ "be13":
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ "c366":
/***/ (function(module, exports, __nested_webpack_require_41706__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __nested_webpack_require_41706__("6821");
var toLength = __nested_webpack_require_41706__("9def");
var toAbsoluteIndex = __nested_webpack_require_41706__("77f1");
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ "c649":
/***/ (function(module, __webpack_exports__, __nested_webpack_require_42729__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (binding) */ __nested_webpack_require_42729__.d(__webpack_exports__, "c", function() { return insertNodeAt; });
/* harmony export (binding) */ __nested_webpack_require_42729__.d(__webpack_exports__, "a", function() { return camelize; });
/* harmony export (binding) */ __nested_webpack_require_42729__.d(__webpack_exports__, "b", function() { return console; });
/* harmony export (binding) */ __nested_webpack_require_42729__.d(__webpack_exports__, "d", function() { return removeNode; });
/* harmony import */ var core_js_modules_es6_regexp_replace__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_42729__("a481");
/* harmony import */ var core_js_modules_es6_regexp_replace__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nested_webpack_require_42729__.n(core_js_modules_es6_regexp_replace__WEBPACK_IMPORTED_MODULE_0__);


function getConsole() {
  if (typeof window !== "undefined") {
    return window.console;
  }

  return global.console;
}

var console = getConsole();

function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

var regex = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(regex, function (_, c) {
    return c ? c.toUpperCase() : "";
  });
});

function removeNode(node) {
  if (node.parentElement !== null) {
    node.parentElement.removeChild(node);
  }
}

function insertNodeAt(fatherNode, node, position) {
  var refNode = position === 0 ? fatherNode.children[0] : fatherNode.children[position - 1].nextSibling;
  fatherNode.insertBefore(node, refNode);
}


/* WEBPACK VAR INJECTION */}.call(this, __nested_webpack_require_42729__("c8ba")))

/***/ }),

/***/ "c69a":
/***/ (function(module, exports, __nested_webpack_require_44512__) {

module.exports = !__nested_webpack_require_44512__("9e1e") && !__nested_webpack_require_44512__("79e5")(function () {
  return Object.defineProperty(__nested_webpack_require_44512__("230e")('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "c8ba":
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "ca5a":
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ "cadf":
/***/ (function(module, exports, __nested_webpack_require_45568__) {

"use strict";

var addToUnscopables = __nested_webpack_require_45568__("9c6c");
var step = __nested_webpack_require_45568__("d53b");
var Iterators = __nested_webpack_require_45568__("84f2");
var toIObject = __nested_webpack_require_45568__("6821");

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __nested_webpack_require_45568__("01f9")(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),

/***/ "cb7c":
/***/ (function(module, exports, __nested_webpack_require_46777__) {

var isObject = __nested_webpack_require_46777__("d3f4");
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ "ce10":
/***/ (function(module, exports, __nested_webpack_require_47019__) {

var has = __nested_webpack_require_47019__("69a8");
var toIObject = __nested_webpack_require_47019__("6821");
var arrayIndexOf = __nested_webpack_require_47019__("c366")(false);
var IE_PROTO = __nested_webpack_require_47019__("613b")('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ "d2c8":
/***/ (function(module, exports, __nested_webpack_require_47655__) {

// helper for String#{startsWith, endsWith, includes}
var isRegExp = __nested_webpack_require_47655__("aae3");
var defined = __nested_webpack_require_47655__("be13");

module.exports = function (that, searchString, NAME) {
  if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};


/***/ }),

/***/ "d3f4":
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "d53b":
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),

/***/ "d8e8":
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ "e11e":
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ "f559":
/***/ (function(module, exports, __nested_webpack_require_48796__) {

"use strict";
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])

var $export = __nested_webpack_require_48796__("5ca1");
var toLength = __nested_webpack_require_48796__("9def");
var context = __nested_webpack_require_48796__("d2c8");
var STARTS_WITH = 'startsWith';
var $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * __nested_webpack_require_48796__("5147")(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = context(this, searchString, STARTS_WITH);
    var index = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});


/***/ }),

/***/ "f6fd":
/***/ (function(module, exports) {

// document.currentScript polyfill by Adam Miller

// MIT license

(function(document){
  var currentScript = "currentScript",
      scripts = document.getElementsByTagName('script'); // Live NodeList collection

  // If browser needs currentScript polyfill, add get currentScript() to the document object
  if (!(currentScript in document)) {
    Object.defineProperty(document, currentScript, {
      get: function(){

        // IE 6-10 supports script readyState
        // IE 10+ support stack trace
        try { throw new Error(); }
        catch (err) {

          // Find the second match for the "at" string to get file src url from stack.
          // Specifically works with the format of stack traces in IE.
          var i, res = ((/.*at [^\(]*\((.*):.+:.+\)$/ig).exec(err.stack) || [false])[1];

          // For all scripts on the page, if src matches or if ready state is interactive, return the script tag
          for(i in scripts){
            if(scripts[i].src == res || scripts[i].readyState == "interactive"){
              return scripts[i];
            }
          }

          // If no match, return null
          return null;
        }
      }
    });
  }
})(document);


/***/ }),

/***/ "f751":
/***/ (function(module, exports, __nested_webpack_require_50913__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __nested_webpack_require_50913__("5ca1");

$export($export.S + $export.F, 'Object', { assign: __nested_webpack_require_50913__("7333") });


/***/ }),

/***/ "fa5b":
/***/ (function(module, exports, __nested_webpack_require_51166__) {

module.exports = __nested_webpack_require_51166__("5537")('native-function-to-string', Function.toString);


/***/ }),

/***/ "fab2":
/***/ (function(module, exports, __nested_webpack_require_51344__) {

var document = __nested_webpack_require_51344__("7726").document;
module.exports = document && document.documentElement;


/***/ }),

/***/ "fb15":
/***/ (function(module, __webpack_exports__, __nested_webpack_require_51548__) {

"use strict";
// ESM COMPAT FLAG
__nested_webpack_require_51548__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  if (true) {
    __nested_webpack_require_51548__("f6fd")
  }

  var setPublicPath_i
  if ((setPublicPath_i = window.document.currentScript) && (setPublicPath_i = setPublicPath_i.src.match(/(.+\/)[^/]+\.js(\?.*)?$/))) {
    __nested_webpack_require_51548__.p = setPublicPath_i[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.assign.js
var es6_object_assign = __nested_webpack_require_51548__("f751");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.string.starts-with.js
var es6_string_starts_with = __nested_webpack_require_51548__("f559");

// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom.iterable.js
var web_dom_iterable = __nested_webpack_require_51548__("ac6a");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.iterator.js
var es6_array_iterator = __nested_webpack_require_51548__("cadf");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.keys.js
var es6_object_keys = __nested_webpack_require_51548__("456d");

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js
function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js




function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
// EXTERNAL MODULE: ./node_modules/core-js/modules/es7.array.includes.js
var es7_array_includes = __nested_webpack_require_51548__("6762");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.string.includes.js
var es6_string_includes = __nested_webpack_require_51548__("2fdb");

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/iterableToArray.js
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js




function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
// EXTERNAL MODULE: external {"commonjs":"sortablejs","commonjs2":"sortablejs","amd":"sortablejs","root":"Sortable"}
var external_commonjs_sortablejs_commonjs2_sortablejs_amd_sortablejs_root_Sortable_ = __nested_webpack_require_51548__("a352");
var external_commonjs_sortablejs_commonjs2_sortablejs_amd_sortablejs_root_Sortable_default = /*#__PURE__*/__nested_webpack_require_51548__.n(external_commonjs_sortablejs_commonjs2_sortablejs_amd_sortablejs_root_Sortable_);

// EXTERNAL MODULE: ./src/util/helper.js
var helper = __nested_webpack_require_51548__("c649");

// CONCATENATED MODULE: ./src/vuedraggable.js












function buildAttribute(object, propName, value) {
  if (value === undefined) {
    return object;
  }

  object = object || {};
  object[propName] = value;
  return object;
}

function computeVmIndex(vnodes, element) {
  return vnodes.map(function (elt) {
    return elt.elm;
  }).indexOf(element);
}

function _computeIndexes(slots, children, isTransition, footerOffset) {
  if (!slots) {
    return [];
  }

  var elmFromNodes = slots.map(function (elt) {
    return elt.elm;
  });
  var footerIndex = children.length - footerOffset;

  var rawIndexes = _toConsumableArray(children).map(function (elt, idx) {
    return idx >= footerIndex ? elmFromNodes.length : elmFromNodes.indexOf(elt);
  });

  return isTransition ? rawIndexes.filter(function (ind) {
    return ind !== -1;
  }) : rawIndexes;
}

function emit(evtName, evtData) {
  var _this = this;

  this.$nextTick(function () {
    return _this.$emit(evtName.toLowerCase(), evtData);
  });
}

function delegateAndEmit(evtName) {
  var _this2 = this;

  return function (evtData) {
    if (_this2.realList !== null) {
      _this2["onDrag" + evtName](evtData);
    }

    emit.call(_this2, evtName, evtData);
  };
}

function isTransitionName(name) {
  return ["transition-group", "TransitionGroup"].includes(name);
}

function vuedraggable_isTransition(slots) {
  if (!slots || slots.length !== 1) {
    return false;
  }

  var _slots = _slicedToArray(slots, 1),
      componentOptions = _slots[0].componentOptions;

  if (!componentOptions) {
    return false;
  }

  return isTransitionName(componentOptions.tag);
}

function getSlot(slot, scopedSlot, key) {
  return slot[key] || (scopedSlot[key] ? scopedSlot[key]() : undefined);
}

function computeChildrenAndOffsets(children, slot, scopedSlot) {
  var headerOffset = 0;
  var footerOffset = 0;
  var header = getSlot(slot, scopedSlot, "header");

  if (header) {
    headerOffset = header.length;
    children = children ? [].concat(_toConsumableArray(header), _toConsumableArray(children)) : _toConsumableArray(header);
  }

  var footer = getSlot(slot, scopedSlot, "footer");

  if (footer) {
    footerOffset = footer.length;
    children = children ? [].concat(_toConsumableArray(children), _toConsumableArray(footer)) : _toConsumableArray(footer);
  }

  return {
    children: children,
    headerOffset: headerOffset,
    footerOffset: footerOffset
  };
}

function getComponentAttributes($attrs, componentData) {
  var attributes = null;

  var update = function update(name, value) {
    attributes = buildAttribute(attributes, name, value);
  };

  var attrs = Object.keys($attrs).filter(function (key) {
    return key === "id" || key.startsWith("data-");
  }).reduce(function (res, key) {
    res[key] = $attrs[key];
    return res;
  }, {});
  update("attrs", attrs);

  if (!componentData) {
    return attributes;
  }

  var on = componentData.on,
      props = componentData.props,
      componentDataAttrs = componentData.attrs;
  update("on", on);
  update("props", props);
  Object.assign(attributes.attrs, componentDataAttrs);
  return attributes;
}

var eventsListened = ["Start", "Add", "Remove", "Update", "End"];
var eventsToEmit = ["Choose", "Unchoose", "Sort", "Filter", "Clone"];
var readonlyProperties = ["Move"].concat(eventsListened, eventsToEmit).map(function (evt) {
  return "on" + evt;
});
var draggingElement = null;
var props = {
  options: Object,
  list: {
    type: Array,
    required: false,
    default: null
  },
  value: {
    type: Array,
    required: false,
    default: null
  },
  noTransitionOnDrag: {
    type: Boolean,
    default: false
  },
  clone: {
    type: Function,
    default: function _default(original) {
      return original;
    }
  },
  element: {
    type: String,
    default: "div"
  },
  tag: {
    type: String,
    default: null
  },
  move: {
    type: Function,
    default: null
  },
  componentData: {
    type: Object,
    required: false,
    default: null
  }
};
var draggableComponent = {
  name: "draggable",
  inheritAttrs: false,
  props: props,
  data: function data() {
    return {
      transitionMode: false,
      noneFunctionalComponentMode: false
    };
  },
  render: function render(h) {
    var slots = this.$slots.default;
    this.transitionMode = vuedraggable_isTransition(slots);

    var _computeChildrenAndOf = computeChildrenAndOffsets(slots, this.$slots, this.$scopedSlots),
        children = _computeChildrenAndOf.children,
        headerOffset = _computeChildrenAndOf.headerOffset,
        footerOffset = _computeChildrenAndOf.footerOffset;

    this.headerOffset = headerOffset;
    this.footerOffset = footerOffset;
    var attributes = getComponentAttributes(this.$attrs, this.componentData);
    return h(this.getTag(), attributes, children);
  },
  created: function created() {
    if (this.list !== null && this.value !== null) {
      helper["b" /* console */].error("Value and list props are mutually exclusive! Please set one or another.");
    }

    if (this.element !== "div") {
      helper["b" /* console */].warn("Element props is deprecated please use tag props instead. See https://github.com/SortableJS/Vue.Draggable/blob/master/documentation/migrate.md#element-props");
    }

    if (this.options !== undefined) {
      helper["b" /* console */].warn("Options props is deprecated, add sortable options directly as vue.draggable item, or use v-bind. See https://github.com/SortableJS/Vue.Draggable/blob/master/documentation/migrate.md#options-props");
    }
  },
  mounted: function mounted() {
    var _this3 = this;

    this.noneFunctionalComponentMode = this.getTag().toLowerCase() !== this.$el.nodeName.toLowerCase() && !this.getIsFunctional();

    if (this.noneFunctionalComponentMode && this.transitionMode) {
      throw new Error("Transition-group inside component is not supported. Please alter tag value or remove transition-group. Current tag value: ".concat(this.getTag()));
    }

    var optionsAdded = {};
    eventsListened.forEach(function (elt) {
      optionsAdded["on" + elt] = delegateAndEmit.call(_this3, elt);
    });
    eventsToEmit.forEach(function (elt) {
      optionsAdded["on" + elt] = emit.bind(_this3, elt);
    });
    var attributes = Object.keys(this.$attrs).reduce(function (res, key) {
      res[Object(helper["a" /* camelize */])(key)] = _this3.$attrs[key];
      return res;
    }, {});
    var options = Object.assign({}, this.options, attributes, optionsAdded, {
      onMove: function onMove(evt, originalEvent) {
        return _this3.onDragMove(evt, originalEvent);
      }
    });
    !("draggable" in options) && (options.draggable = ">*");
    this._sortable = new external_commonjs_sortablejs_commonjs2_sortablejs_amd_sortablejs_root_Sortable_default.a(this.rootContainer, options);
    this.computeIndexes();
  },
  beforeDestroy: function beforeDestroy() {
    if (this._sortable !== undefined) this._sortable.destroy();
  },
  computed: {
    rootContainer: function rootContainer() {
      return this.transitionMode ? this.$el.children[0] : this.$el;
    },
    realList: function realList() {
      return this.list ? this.list : this.value;
    }
  },
  watch: {
    options: {
      handler: function handler(newOptionValue) {
        this.updateOptions(newOptionValue);
      },
      deep: true
    },
    $attrs: {
      handler: function handler(newOptionValue) {
        this.updateOptions(newOptionValue);
      },
      deep: true
    },
    realList: function realList() {
      this.computeIndexes();
    }
  },
  methods: {
    getIsFunctional: function getIsFunctional() {
      var fnOptions = this._vnode.fnOptions;
      return fnOptions && fnOptions.functional;
    },
    getTag: function getTag() {
      return this.tag || this.element;
    },
    updateOptions: function updateOptions(newOptionValue) {
      for (var property in newOptionValue) {
        var value = Object(helper["a" /* camelize */])(property);

        if (readonlyProperties.indexOf(value) === -1) {
          this._sortable.option(value, newOptionValue[property]);
        }
      }
    },
    getChildrenNodes: function getChildrenNodes() {
      if (this.noneFunctionalComponentMode) {
        return this.$children[0].$slots.default;
      }

      var rawNodes = this.$slots.default;
      return this.transitionMode ? rawNodes[0].child.$slots.default : rawNodes;
    },
    computeIndexes: function computeIndexes() {
      var _this4 = this;

      this.$nextTick(function () {
        _this4.visibleIndexes = _computeIndexes(_this4.getChildrenNodes(), _this4.rootContainer.children, _this4.transitionMode, _this4.footerOffset);
      });
    },
    getUnderlyingVm: function getUnderlyingVm(htmlElt) {
      var index = computeVmIndex(this.getChildrenNodes() || [], htmlElt);

      if (index === -1) {
        //Edge case during move callback: related element might be
        //an element different from collection
        return null;
      }

      var element = this.realList[index];
      return {
        index: index,
        element: element
      };
    },
    getUnderlyingPotencialDraggableComponent: function getUnderlyingPotencialDraggableComponent(_ref) {
      var vue = _ref.__vue__;

      if (!vue || !vue.$options || !isTransitionName(vue.$options._componentTag)) {
        if (!("realList" in vue) && vue.$children.length === 1 && "realList" in vue.$children[0]) return vue.$children[0];
        return vue;
      }

      return vue.$parent;
    },
    emitChanges: function emitChanges(evt) {
      var _this5 = this;

      this.$nextTick(function () {
        _this5.$emit("change", evt);
      });
    },
    alterList: function alterList(onList) {
      if (this.list) {
        onList(this.list);
        return;
      }

      var newList = _toConsumableArray(this.value);

      onList(newList);
      this.$emit("input", newList);
    },
    spliceList: function spliceList() {
      var _arguments = arguments;

      var spliceList = function spliceList(list) {
        return list.splice.apply(list, _toConsumableArray(_arguments));
      };

      this.alterList(spliceList);
    },
    updatePosition: function updatePosition(oldIndex, newIndex) {
      var updatePosition = function updatePosition(list) {
        return list.splice(newIndex, 0, list.splice(oldIndex, 1)[0]);
      };

      this.alterList(updatePosition);
    },
    getRelatedContextFromMoveEvent: function getRelatedContextFromMoveEvent(_ref2) {
      var to = _ref2.to,
          related = _ref2.related;
      var component = this.getUnderlyingPotencialDraggableComponent(to);

      if (!component) {
        return {
          component: component
        };
      }

      var list = component.realList;
      var context = {
        list: list,
        component: component
      };

      if (to !== related && list && component.getUnderlyingVm) {
        var destination = component.getUnderlyingVm(related);

        if (destination) {
          return Object.assign(destination, context);
        }
      }

      return context;
    },
    getVmIndex: function getVmIndex(domIndex) {
      var indexes = this.visibleIndexes;
      var numberIndexes = indexes.length;
      return domIndex > numberIndexes - 1 ? numberIndexes : indexes[domIndex];
    },
    getComponent: function getComponent() {
      return this.$slots.default[0].componentInstance;
    },
    resetTransitionData: function resetTransitionData(index) {
      if (!this.noTransitionOnDrag || !this.transitionMode) {
        return;
      }

      var nodes = this.getChildrenNodes();
      nodes[index].data = null;
      var transitionContainer = this.getComponent();
      transitionContainer.children = [];
      transitionContainer.kept = undefined;
    },
    onDragStart: function onDragStart(evt) {
      this.context = this.getUnderlyingVm(evt.item);
      evt.item._underlying_vm_ = this.clone(this.context.element);
      draggingElement = evt.item;
    },
    onDragAdd: function onDragAdd(evt) {
      var element = evt.item._underlying_vm_;

      if (element === undefined) {
        return;
      }

      Object(helper["d" /* removeNode */])(evt.item);
      var newIndex = this.getVmIndex(evt.newIndex);
      this.spliceList(newIndex, 0, element);
      this.computeIndexes();
      var added = {
        element: element,
        newIndex: newIndex
      };
      this.emitChanges({
        added: added
      });
    },
    onDragRemove: function onDragRemove(evt) {
      Object(helper["c" /* insertNodeAt */])(this.rootContainer, evt.item, evt.oldIndex);

      if (evt.pullMode === "clone") {
        Object(helper["d" /* removeNode */])(evt.clone);
        return;
      }

      var oldIndex = this.context.index;
      this.spliceList(oldIndex, 1);
      var removed = {
        element: this.context.element,
        oldIndex: oldIndex
      };
      this.resetTransitionData(oldIndex);
      this.emitChanges({
        removed: removed
      });
    },
    onDragUpdate: function onDragUpdate(evt) {
      Object(helper["d" /* removeNode */])(evt.item);
      Object(helper["c" /* insertNodeAt */])(evt.from, evt.item, evt.oldIndex);
      var oldIndex = this.context.index;
      var newIndex = this.getVmIndex(evt.newIndex);
      this.updatePosition(oldIndex, newIndex);
      var moved = {
        element: this.context.element,
        oldIndex: oldIndex,
        newIndex: newIndex
      };
      this.emitChanges({
        moved: moved
      });
    },
    updateProperty: function updateProperty(evt, propertyName) {
      evt.hasOwnProperty(propertyName) && (evt[propertyName] += this.headerOffset);
    },
    computeFutureIndex: function computeFutureIndex(relatedContext, evt) {
      if (!relatedContext.element) {
        return 0;
      }

      var domChildren = _toConsumableArray(evt.to.children).filter(function (el) {
        return el.style["display"] !== "none";
      });

      var currentDOMIndex = domChildren.indexOf(evt.related);
      var currentIndex = relatedContext.component.getVmIndex(currentDOMIndex);
      var draggedInList = domChildren.indexOf(draggingElement) !== -1;
      return draggedInList || !evt.willInsertAfter ? currentIndex : currentIndex + 1;
    },
    onDragMove: function onDragMove(evt, originalEvent) {
      var onMove = this.move;

      if (!onMove || !this.realList) {
        return true;
      }

      var relatedContext = this.getRelatedContextFromMoveEvent(evt);
      var draggedContext = this.context;
      var futureIndex = this.computeFutureIndex(relatedContext, evt);
      Object.assign(draggedContext, {
        futureIndex: futureIndex
      });
      var sendEvt = Object.assign({}, evt, {
        relatedContext: relatedContext,
        draggedContext: draggedContext
      });
      return onMove(sendEvt, originalEvent);
    },
    onDragEnd: function onDragEnd() {
      this.computeIndexes();
      draggingElement = null;
    }
  }
};

if (typeof window !== "undefined" && "Vue" in window) {
  window.Vue.component("draggable", draggableComponent);
}

/* harmony default export */ var vuedraggable = (draggableComponent);
// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (vuedraggable);



/***/ })

/******/ })["default"];
});
//# sourceMappingURL=vuedraggable.umd.js.map

/***/ }),

/***/ 2431:
/***/ (function(module) {

"use strict";
module.exports = JSON.parse('[{"code":"110000","name":"北京市","province":"11","children":[{"code":"110101","name":"东城区","province":"11","city":"01","area":"01"},{"code":"110102","name":"西城区","province":"11","city":"01","area":"02"},{"code":"110105","name":"朝阳区","province":"11","city":"01","area":"05"},{"code":"110106","name":"丰台区","province":"11","city":"01","area":"06"},{"code":"110107","name":"石景山区","province":"11","city":"01","area":"07"},{"code":"110108","name":"海淀区","province":"11","city":"01","area":"08"},{"code":"110109","name":"门头沟区","province":"11","city":"01","area":"09"},{"code":"110111","name":"房山区","province":"11","city":"01","area":"11"},{"code":"110112","name":"通州区","province":"11","city":"01","area":"12"},{"code":"110113","name":"顺义区","province":"11","city":"01","area":"13"},{"code":"110114","name":"昌平区","province":"11","city":"01","area":"14"},{"code":"110115","name":"大兴区","province":"11","city":"01","area":"15"},{"code":"110116","name":"怀柔区","province":"11","city":"01","area":"16"},{"code":"110117","name":"平谷区","province":"11","city":"01","area":"17"},{"code":"110118","name":"密云区","province":"11","city":"01","area":"18"},{"code":"110119","name":"延庆区","province":"11","city":"01","area":"19"}]},{"code":"120000","name":"天津市","province":"12","children":[{"code":"120101","name":"和平区","province":"12","city":"01","area":"01"},{"code":"120102","name":"河东区","province":"12","city":"01","area":"02"},{"code":"120103","name":"河西区","province":"12","city":"01","area":"03"},{"code":"120104","name":"南开区","province":"12","city":"01","area":"04"},{"code":"120105","name":"河北区","province":"12","city":"01","area":"05"},{"code":"120106","name":"红桥区","province":"12","city":"01","area":"06"},{"code":"120110","name":"东丽区","province":"12","city":"01","area":"10"},{"code":"120111","name":"西青区","province":"12","city":"01","area":"11"},{"code":"120112","name":"津南区","province":"12","city":"01","area":"12"},{"code":"120113","name":"北辰区","province":"12","city":"01","area":"13"},{"code":"120114","name":"武清区","province":"12","city":"01","area":"14"},{"code":"120115","name":"宝坻区","province":"12","city":"01","area":"15"},{"code":"120116","name":"滨海新区","province":"12","city":"01","area":"16"},{"code":"120117","name":"宁河区","province":"12","city":"01","area":"17"},{"code":"120118","name":"静海区","province":"12","city":"01","area":"18"},{"code":"120119","name":"蓟州区","province":"12","city":"01","area":"19"}]},{"code":"130000","name":"河北省","province":"13","children":[{"code":"130100","name":"石家庄市","province":"13","city":"01","children":[{"code":"130102","name":"长安区","province":"13","city":"01","area":"02"},{"code":"130104","name":"桥西区","province":"13","city":"01","area":"04"},{"code":"130105","name":"新华区","province":"13","city":"01","area":"05"},{"code":"130107","name":"井陉矿区","province":"13","city":"01","area":"07"},{"code":"130108","name":"裕华区","province":"13","city":"01","area":"08"},{"code":"130109","name":"藁城区","province":"13","city":"01","area":"09"},{"code":"130110","name":"鹿泉区","province":"13","city":"01","area":"10"},{"code":"130111","name":"栾城区","province":"13","city":"01","area":"11"},{"code":"130121","name":"井陉县","province":"13","city":"01","area":"21"},{"code":"130123","name":"正定县","province":"13","city":"01","area":"23"},{"code":"130125","name":"行唐县","province":"13","city":"01","area":"25"},{"code":"130126","name":"灵寿县","province":"13","city":"01","area":"26"},{"code":"130127","name":"高邑县","province":"13","city":"01","area":"27"},{"code":"130128","name":"深泽县","province":"13","city":"01","area":"28"},{"code":"130129","name":"赞皇县","province":"13","city":"01","area":"29"},{"code":"130130","name":"无极县","province":"13","city":"01","area":"30"},{"code":"130131","name":"平山县","province":"13","city":"01","area":"31"},{"code":"130132","name":"元氏县","province":"13","city":"01","area":"32"},{"code":"130133","name":"赵县","province":"13","city":"01","area":"33"},{"code":"130181","name":"辛集市","province":"13","city":"01","area":"81"},{"code":"130183","name":"晋州市","province":"13","city":"01","area":"83"},{"code":"130184","name":"新乐市","province":"13","city":"01","area":"84"},{"code":"130101","name":"市辖区","province":"13","city":"01","area":"01"},{"code":"130171","name":"石家庄高新技术产业开发区","province":"13","city":"01","area":"71"},{"code":"130172","name":"石家庄循环化工园区","province":"13","city":"01","area":"72"}]},{"code":"130200","name":"唐山市","province":"13","city":"02","children":[{"code":"130202","name":"路南区","province":"13","city":"02","area":"02"},{"code":"130203","name":"路北区","province":"13","city":"02","area":"03"},{"code":"130204","name":"古冶区","province":"13","city":"02","area":"04"},{"code":"130205","name":"开平区","province":"13","city":"02","area":"05"},{"code":"130207","name":"丰南区","province":"13","city":"02","area":"07"},{"code":"130208","name":"丰润区","province":"13","city":"02","area":"08"},{"code":"130209","name":"曹妃甸区","province":"13","city":"02","area":"09"},{"code":"130224","name":"滦南县","province":"13","city":"02","area":"24"},{"code":"130225","name":"乐亭县","province":"13","city":"02","area":"25"},{"code":"130227","name":"迁西县","province":"13","city":"02","area":"27"},{"code":"130229","name":"玉田县","province":"13","city":"02","area":"29"},{"code":"130281","name":"遵化市","province":"13","city":"02","area":"81"},{"code":"130283","name":"迁安市","province":"13","city":"02","area":"83"},{"code":"130284","name":"滦州市","province":"13","city":"02","area":"84"},{"code":"130201","name":"市辖区","province":"13","city":"02","area":"01"},{"code":"130271","name":"河北唐山芦台经济开发区","province":"13","city":"02","area":"71"},{"code":"130272","name":"唐山市汉沽管理区","province":"13","city":"02","area":"72"},{"code":"130273","name":"唐山高新技术产业开发区","province":"13","city":"02","area":"73"},{"code":"130274","name":"河北唐山海港经济开发区","province":"13","city":"02","area":"74"}]},{"code":"130300","name":"秦皇岛市","province":"13","city":"03","children":[{"code":"130302","name":"海港区","province":"13","city":"03","area":"02"},{"code":"130303","name":"山海关区","province":"13","city":"03","area":"03"},{"code":"130304","name":"北戴河区","province":"13","city":"03","area":"04"},{"code":"130306","name":"抚宁区","province":"13","city":"03","area":"06"},{"code":"130321","name":"青龙满族自治县","province":"13","city":"03","area":"21"},{"code":"130322","name":"昌黎县","province":"13","city":"03","area":"22"},{"code":"130324","name":"卢龙县","province":"13","city":"03","area":"24"},{"code":"130301","name":"市辖区","province":"13","city":"03","area":"01"},{"code":"130371","name":"秦皇岛市经济技术开发区","province":"13","city":"03","area":"71"},{"code":"130372","name":"北戴河新区","province":"13","city":"03","area":"72"}]},{"code":"130400","name":"邯郸市","province":"13","city":"04","children":[{"code":"130402","name":"邯山区","province":"13","city":"04","area":"02"},{"code":"130403","name":"丛台区","province":"13","city":"04","area":"03"},{"code":"130404","name":"复兴区","province":"13","city":"04","area":"04"},{"code":"130406","name":"峰峰矿区","province":"13","city":"04","area":"06"},{"code":"130407","name":"肥乡区","province":"13","city":"04","area":"07"},{"code":"130408","name":"永年区","province":"13","city":"04","area":"08"},{"code":"130423","name":"临漳县","province":"13","city":"04","area":"23"},{"code":"130424","name":"成安县","province":"13","city":"04","area":"24"},{"code":"130425","name":"大名县","province":"13","city":"04","area":"25"},{"code":"130426","name":"涉县","province":"13","city":"04","area":"26"},{"code":"130427","name":"磁县","province":"13","city":"04","area":"27"},{"code":"130430","name":"邱县","province":"13","city":"04","area":"30"},{"code":"130431","name":"鸡泽县","province":"13","city":"04","area":"31"},{"code":"130432","name":"广平县","province":"13","city":"04","area":"32"},{"code":"130433","name":"馆陶县","province":"13","city":"04","area":"33"},{"code":"130434","name":"魏县","province":"13","city":"04","area":"34"},{"code":"130435","name":"曲周县","province":"13","city":"04","area":"35"},{"code":"130481","name":"武安市","province":"13","city":"04","area":"81"},{"code":"130401","name":"市辖区","province":"13","city":"04","area":"01"},{"code":"130471","name":"邯郸经济技术开发区","province":"13","city":"04","area":"71"},{"code":"130473","name":"邯郸冀南新区","province":"13","city":"04","area":"73"}]},{"code":"130500","name":"邢台市","province":"13","city":"05","children":[{"code":"130502","name":"襄都区","province":"13","city":"05","area":"02"},{"code":"130503","name":"信都区","province":"13","city":"05","area":"03"},{"code":"130505","name":"任泽区","province":"13","city":"05","area":"05"},{"code":"130506","name":"南和区","province":"13","city":"05","area":"06"},{"code":"130522","name":"临城县","province":"13","city":"05","area":"22"},{"code":"130523","name":"内丘县","province":"13","city":"05","area":"23"},{"code":"130524","name":"柏乡县","province":"13","city":"05","area":"24"},{"code":"130525","name":"隆尧县","province":"13","city":"05","area":"25"},{"code":"130528","name":"宁晋县","province":"13","city":"05","area":"28"},{"code":"130529","name":"巨鹿县","province":"13","city":"05","area":"29"},{"code":"130530","name":"新河县","province":"13","city":"05","area":"30"},{"code":"130531","name":"广宗县","province":"13","city":"05","area":"31"},{"code":"130532","name":"平乡县","province":"13","city":"05","area":"32"},{"code":"130533","name":"威县","province":"13","city":"05","area":"33"},{"code":"130534","name":"清河县","province":"13","city":"05","area":"34"},{"code":"130535","name":"临西县","province":"13","city":"05","area":"35"},{"code":"130581","name":"南宫市","province":"13","city":"05","area":"81"},{"code":"130582","name":"沙河市","province":"13","city":"05","area":"82"},{"code":"130501","name":"市辖区","province":"13","city":"05","area":"01"},{"code":"130571","name":"河北邢台经济开发区","province":"13","city":"05","area":"71"}]},{"code":"130600","name":"保定市","province":"13","city":"06","children":[{"code":"130602","name":"竞秀区","province":"13","city":"06","area":"02"},{"code":"130606","name":"莲池区","province":"13","city":"06","area":"06"},{"code":"130607","name":"满城区","province":"13","city":"06","area":"07"},{"code":"130608","name":"清苑区","province":"13","city":"06","area":"08"},{"code":"130609","name":"徐水区","province":"13","city":"06","area":"09"},{"code":"130623","name":"涞水县","province":"13","city":"06","area":"23"},{"code":"130624","name":"阜平县","province":"13","city":"06","area":"24"},{"code":"130626","name":"定兴县","province":"13","city":"06","area":"26"},{"code":"130627","name":"唐县","province":"13","city":"06","area":"27"},{"code":"130628","name":"高阳县","province":"13","city":"06","area":"28"},{"code":"130629","name":"容城县","province":"13","city":"06","area":"29"},{"code":"130630","name":"涞源县","province":"13","city":"06","area":"30"},{"code":"130631","name":"望都县","province":"13","city":"06","area":"31"},{"code":"130632","name":"安新县","province":"13","city":"06","area":"32"},{"code":"130633","name":"易县","province":"13","city":"06","area":"33"},{"code":"130634","name":"曲阳县","province":"13","city":"06","area":"34"},{"code":"130635","name":"蠡县","province":"13","city":"06","area":"35"},{"code":"130636","name":"顺平县","province":"13","city":"06","area":"36"},{"code":"130637","name":"博野县","province":"13","city":"06","area":"37"},{"code":"130638","name":"雄县","province":"13","city":"06","area":"38"},{"code":"130681","name":"涿州市","province":"13","city":"06","area":"81"},{"code":"130682","name":"定州市","province":"13","city":"06","area":"82"},{"code":"130683","name":"安国市","province":"13","city":"06","area":"83"},{"code":"130684","name":"高碑店市","province":"13","city":"06","area":"84"},{"code":"130601","name":"市辖区","province":"13","city":"06","area":"01"},{"code":"130671","name":"保定高新技术产业开发区","province":"13","city":"06","area":"71"},{"code":"130672","name":"保定白沟新城","province":"13","city":"06","area":"72"}]},{"code":"130700","name":"张家口市","province":"13","city":"07","children":[{"code":"130702","name":"桥东区","province":"13","city":"07","area":"02"},{"code":"130703","name":"桥西区","province":"13","city":"07","area":"03"},{"code":"130705","name":"宣化区","province":"13","city":"07","area":"05"},{"code":"130706","name":"下花园区","province":"13","city":"07","area":"06"},{"code":"130708","name":"万全区","province":"13","city":"07","area":"08"},{"code":"130709","name":"崇礼区","province":"13","city":"07","area":"09"},{"code":"130722","name":"张北县","province":"13","city":"07","area":"22"},{"code":"130723","name":"康保县","province":"13","city":"07","area":"23"},{"code":"130724","name":"沽源县","province":"13","city":"07","area":"24"},{"code":"130725","name":"尚义县","province":"13","city":"07","area":"25"},{"code":"130726","name":"蔚县","province":"13","city":"07","area":"26"},{"code":"130727","name":"阳原县","province":"13","city":"07","area":"27"},{"code":"130728","name":"怀安县","province":"13","city":"07","area":"28"},{"code":"130730","name":"怀来县","province":"13","city":"07","area":"30"},{"code":"130731","name":"涿鹿县","province":"13","city":"07","area":"31"},{"code":"130732","name":"赤城县","province":"13","city":"07","area":"32"},{"code":"130701","name":"市辖区","province":"13","city":"07","area":"01"},{"code":"130771","name":"张家口经济开发区","province":"13","city":"07","area":"71"},{"code":"130772","name":"张家口市察北管理区","province":"13","city":"07","area":"72"},{"code":"130773","name":"张家口市塞北管理区","province":"13","city":"07","area":"73"}]},{"code":"130800","name":"承德市","province":"13","city":"08","children":[{"code":"130802","name":"双桥区","province":"13","city":"08","area":"02"},{"code":"130803","name":"双滦区","province":"13","city":"08","area":"03"},{"code":"130804","name":"鹰手营子矿区","province":"13","city":"08","area":"04"},{"code":"130821","name":"承德县","province":"13","city":"08","area":"21"},{"code":"130822","name":"兴隆县","province":"13","city":"08","area":"22"},{"code":"130824","name":"滦平县","province":"13","city":"08","area":"24"},{"code":"130825","name":"隆化县","province":"13","city":"08","area":"25"},{"code":"130826","name":"丰宁满族自治县","province":"13","city":"08","area":"26"},{"code":"130827","name":"宽城满族自治县","province":"13","city":"08","area":"27"},{"code":"130828","name":"围场满族蒙古族自治县","province":"13","city":"08","area":"28"},{"code":"130881","name":"平泉市","province":"13","city":"08","area":"81"},{"code":"130801","name":"市辖区","province":"13","city":"08","area":"01"},{"code":"130871","name":"承德高新技术产业开发区","province":"13","city":"08","area":"71"}]},{"code":"130900","name":"沧州市","province":"13","city":"09","children":[{"code":"130902","name":"新华区","province":"13","city":"09","area":"02"},{"code":"130903","name":"运河区","province":"13","city":"09","area":"03"},{"code":"130921","name":"沧县","province":"13","city":"09","area":"21"},{"code":"130922","name":"青县","province":"13","city":"09","area":"22"},{"code":"130923","name":"东光县","province":"13","city":"09","area":"23"},{"code":"130924","name":"海兴县","province":"13","city":"09","area":"24"},{"code":"130925","name":"盐山县","province":"13","city":"09","area":"25"},{"code":"130926","name":"肃宁县","province":"13","city":"09","area":"26"},{"code":"130927","name":"南皮县","province":"13","city":"09","area":"27"},{"code":"130928","name":"吴桥县","province":"13","city":"09","area":"28"},{"code":"130929","name":"献县","province":"13","city":"09","area":"29"},{"code":"130930","name":"孟村回族自治县","province":"13","city":"09","area":"30"},{"code":"130981","name":"泊头市","province":"13","city":"09","area":"81"},{"code":"130982","name":"任丘市","province":"13","city":"09","area":"82"},{"code":"130983","name":"黄骅市","province":"13","city":"09","area":"83"},{"code":"130984","name":"河间市","province":"13","city":"09","area":"84"},{"code":"130901","name":"市辖区","province":"13","city":"09","area":"01"},{"code":"130971","name":"河北沧州经济开发区","province":"13","city":"09","area":"71"},{"code":"130972","name":"沧州高新技术产业开发区","province":"13","city":"09","area":"72"},{"code":"130973","name":"沧州渤海新区","province":"13","city":"09","area":"73"}]},{"code":"131000","name":"廊坊市","province":"13","city":"10","children":[{"code":"131002","name":"安次区","province":"13","city":"10","area":"02"},{"code":"131003","name":"广阳区","province":"13","city":"10","area":"03"},{"code":"131022","name":"固安县","province":"13","city":"10","area":"22"},{"code":"131023","name":"永清县","province":"13","city":"10","area":"23"},{"code":"131024","name":"香河县","province":"13","city":"10","area":"24"},{"code":"131025","name":"大城县","province":"13","city":"10","area":"25"},{"code":"131026","name":"文安县","province":"13","city":"10","area":"26"},{"code":"131028","name":"大厂回族自治县","province":"13","city":"10","area":"28"},{"code":"131081","name":"霸州市","province":"13","city":"10","area":"81"},{"code":"131082","name":"三河市","province":"13","city":"10","area":"82"},{"code":"131001","name":"市辖区","province":"13","city":"10","area":"01"},{"code":"131071","name":"廊坊经济技术开发区","province":"13","city":"10","area":"71"}]},{"code":"131100","name":"衡水市","province":"13","city":"11","children":[{"code":"131102","name":"桃城区","province":"13","city":"11","area":"02"},{"code":"131103","name":"冀州区","province":"13","city":"11","area":"03"},{"code":"131121","name":"枣强县","province":"13","city":"11","area":"21"},{"code":"131122","name":"武邑县","province":"13","city":"11","area":"22"},{"code":"131123","name":"武强县","province":"13","city":"11","area":"23"},{"code":"131124","name":"饶阳县","province":"13","city":"11","area":"24"},{"code":"131125","name":"安平县","province":"13","city":"11","area":"25"},{"code":"131126","name":"故城县","province":"13","city":"11","area":"26"},{"code":"131127","name":"景县","province":"13","city":"11","area":"27"},{"code":"131128","name":"阜城县","province":"13","city":"11","area":"28"},{"code":"131182","name":"深州市","province":"13","city":"11","area":"82"},{"code":"131101","name":"市辖区","province":"13","city":"11","area":"01"},{"code":"131171","name":"河北衡水高新技术产业开发区","province":"13","city":"11","area":"71"},{"code":"131172","name":"衡水滨湖新区","province":"13","city":"11","area":"72"}]}]},{"code":"140000","name":"山西省","province":"14","children":[{"code":"140100","name":"太原市","province":"14","city":"01","children":[{"code":"140105","name":"小店区","province":"14","city":"01","area":"05"},{"code":"140106","name":"迎泽区","province":"14","city":"01","area":"06"},{"code":"140107","name":"杏花岭区","province":"14","city":"01","area":"07"},{"code":"140108","name":"尖草坪区","province":"14","city":"01","area":"08"},{"code":"140109","name":"万柏林区","province":"14","city":"01","area":"09"},{"code":"140110","name":"晋源区","province":"14","city":"01","area":"10"},{"code":"140121","name":"清徐县","province":"14","city":"01","area":"21"},{"code":"140122","name":"阳曲县","province":"14","city":"01","area":"22"},{"code":"140123","name":"娄烦县","province":"14","city":"01","area":"23"},{"code":"140181","name":"古交市","province":"14","city":"01","area":"81"},{"code":"140101","name":"市辖区","province":"14","city":"01","area":"01"},{"code":"140171","name":"山西转型综合改革示范区","province":"14","city":"01","area":"71"}]},{"code":"140200","name":"大同市","province":"14","city":"02","children":[{"code":"140212","name":"新荣区","province":"14","city":"02","area":"12"},{"code":"140213","name":"平城区","province":"14","city":"02","area":"13"},{"code":"140214","name":"云冈区","province":"14","city":"02","area":"14"},{"code":"140215","name":"云州区","province":"14","city":"02","area":"15"},{"code":"140221","name":"阳高县","province":"14","city":"02","area":"21"},{"code":"140222","name":"天镇县","province":"14","city":"02","area":"22"},{"code":"140223","name":"广灵县","province":"14","city":"02","area":"23"},{"code":"140224","name":"灵丘县","province":"14","city":"02","area":"24"},{"code":"140225","name":"浑源县","province":"14","city":"02","area":"25"},{"code":"140226","name":"左云县","province":"14","city":"02","area":"26"},{"code":"140201","name":"市辖区","province":"14","city":"02","area":"01"},{"code":"140271","name":"山西大同经济开发区","province":"14","city":"02","area":"71"}]},{"code":"140300","name":"阳泉市","province":"14","city":"03","children":[{"code":"140302","name":"城区","province":"14","city":"03","area":"02"},{"code":"140303","name":"矿区","province":"14","city":"03","area":"03"},{"code":"140311","name":"郊区","province":"14","city":"03","area":"11"},{"code":"140321","name":"平定县","province":"14","city":"03","area":"21"},{"code":"140322","name":"盂县","province":"14","city":"03","area":"22"},{"code":"140301","name":"市辖区","province":"14","city":"03","area":"01"}]},{"code":"140400","name":"长治市","province":"14","city":"04","children":[{"code":"140403","name":"潞州区","province":"14","city":"04","area":"03"},{"code":"140404","name":"上党区","province":"14","city":"04","area":"04"},{"code":"140405","name":"屯留区","province":"14","city":"04","area":"05"},{"code":"140406","name":"潞城区","province":"14","city":"04","area":"06"},{"code":"140423","name":"襄垣县","province":"14","city":"04","area":"23"},{"code":"140425","name":"平顺县","province":"14","city":"04","area":"25"},{"code":"140426","name":"黎城县","province":"14","city":"04","area":"26"},{"code":"140427","name":"壶关县","province":"14","city":"04","area":"27"},{"code":"140428","name":"长子县","province":"14","city":"04","area":"28"},{"code":"140429","name":"武乡县","province":"14","city":"04","area":"29"},{"code":"140430","name":"沁县","province":"14","city":"04","area":"30"},{"code":"140431","name":"沁源县","province":"14","city":"04","area":"31"},{"code":"140401","name":"市辖区","province":"14","city":"04","area":"01"},{"code":"140471","name":"山西长治高新技术产业园区","province":"14","city":"04","area":"71"}]},{"code":"140500","name":"晋城市","province":"14","city":"05","children":[{"code":"140502","name":"城区","province":"14","city":"05","area":"02"},{"code":"140521","name":"沁水县","province":"14","city":"05","area":"21"},{"code":"140522","name":"阳城县","province":"14","city":"05","area":"22"},{"code":"140524","name":"陵川县","province":"14","city":"05","area":"24"},{"code":"140525","name":"泽州县","province":"14","city":"05","area":"25"},{"code":"140581","name":"高平市","province":"14","city":"05","area":"81"},{"code":"140501","name":"市辖区","province":"14","city":"05","area":"01"}]},{"code":"140600","name":"朔州市","province":"14","city":"06","children":[{"code":"140602","name":"朔城区","province":"14","city":"06","area":"02"},{"code":"140603","name":"平鲁区","province":"14","city":"06","area":"03"},{"code":"140621","name":"山阴县","province":"14","city":"06","area":"21"},{"code":"140622","name":"应县","province":"14","city":"06","area":"22"},{"code":"140623","name":"右玉县","province":"14","city":"06","area":"23"},{"code":"140681","name":"怀仁市","province":"14","city":"06","area":"81"},{"code":"140601","name":"市辖区","province":"14","city":"06","area":"01"},{"code":"140671","name":"山西朔州经济开发区","province":"14","city":"06","area":"71"}]},{"code":"140700","name":"晋中市","province":"14","city":"07","children":[{"code":"140702","name":"榆次区","province":"14","city":"07","area":"02"},{"code":"140703","name":"太谷区","province":"14","city":"07","area":"03"},{"code":"140721","name":"榆社县","province":"14","city":"07","area":"21"},{"code":"140722","name":"左权县","province":"14","city":"07","area":"22"},{"code":"140723","name":"和顺县","province":"14","city":"07","area":"23"},{"code":"140724","name":"昔阳县","province":"14","city":"07","area":"24"},{"code":"140725","name":"寿阳县","province":"14","city":"07","area":"25"},{"code":"140727","name":"祁县","province":"14","city":"07","area":"27"},{"code":"140728","name":"平遥县","province":"14","city":"07","area":"28"},{"code":"140729","name":"灵石县","province":"14","city":"07","area":"29"},{"code":"140781","name":"介休市","province":"14","city":"07","area":"81"},{"code":"140701","name":"市辖区","province":"14","city":"07","area":"01"}]},{"code":"140800","name":"运城市","province":"14","city":"08","children":[{"code":"140802","name":"盐湖区","province":"14","city":"08","area":"02"},{"code":"140821","name":"临猗县","province":"14","city":"08","area":"21"},{"code":"140822","name":"万荣县","province":"14","city":"08","area":"22"},{"code":"140823","name":"闻喜县","province":"14","city":"08","area":"23"},{"code":"140824","name":"稷山县","province":"14","city":"08","area":"24"},{"code":"140825","name":"新绛县","province":"14","city":"08","area":"25"},{"code":"140826","name":"绛县","province":"14","city":"08","area":"26"},{"code":"140827","name":"垣曲县","province":"14","city":"08","area":"27"},{"code":"140828","name":"夏县","province":"14","city":"08","area":"28"},{"code":"140829","name":"平陆县","province":"14","city":"08","area":"29"},{"code":"140830","name":"芮城县","province":"14","city":"08","area":"30"},{"code":"140881","name":"永济市","province":"14","city":"08","area":"81"},{"code":"140882","name":"河津市","province":"14","city":"08","area":"82"},{"code":"140801","name":"市辖区","province":"14","city":"08","area":"01"}]},{"code":"140900","name":"忻州市","province":"14","city":"09","children":[{"code":"140902","name":"忻府区","province":"14","city":"09","area":"02"},{"code":"140921","name":"定襄县","province":"14","city":"09","area":"21"},{"code":"140922","name":"五台县","province":"14","city":"09","area":"22"},{"code":"140923","name":"代县","province":"14","city":"09","area":"23"},{"code":"140924","name":"繁峙县","province":"14","city":"09","area":"24"},{"code":"140925","name":"宁武县","province":"14","city":"09","area":"25"},{"code":"140926","name":"静乐县","province":"14","city":"09","area":"26"},{"code":"140927","name":"神池县","province":"14","city":"09","area":"27"},{"code":"140928","name":"五寨县","province":"14","city":"09","area":"28"},{"code":"140929","name":"岢岚县","province":"14","city":"09","area":"29"},{"code":"140930","name":"河曲县","province":"14","city":"09","area":"30"},{"code":"140931","name":"保德县","province":"14","city":"09","area":"31"},{"code":"140932","name":"偏关县","province":"14","city":"09","area":"32"},{"code":"140981","name":"原平市","province":"14","city":"09","area":"81"},{"code":"140901","name":"市辖区","province":"14","city":"09","area":"01"},{"code":"140971","name":"五台山风景名胜区","province":"14","city":"09","area":"71"}]},{"code":"141000","name":"临汾市","province":"14","city":"10","children":[{"code":"141002","name":"尧都区","province":"14","city":"10","area":"02"},{"code":"141021","name":"曲沃县","province":"14","city":"10","area":"21"},{"code":"141022","name":"翼城县","province":"14","city":"10","area":"22"},{"code":"141023","name":"襄汾县","province":"14","city":"10","area":"23"},{"code":"141024","name":"洪洞县","province":"14","city":"10","area":"24"},{"code":"141025","name":"古县","province":"14","city":"10","area":"25"},{"code":"141026","name":"安泽县","province":"14","city":"10","area":"26"},{"code":"141027","name":"浮山县","province":"14","city":"10","area":"27"},{"code":"141028","name":"吉县","province":"14","city":"10","area":"28"},{"code":"141029","name":"乡宁县","province":"14","city":"10","area":"29"},{"code":"141030","name":"大宁县","province":"14","city":"10","area":"30"},{"code":"141031","name":"隰县","province":"14","city":"10","area":"31"},{"code":"141032","name":"永和县","province":"14","city":"10","area":"32"},{"code":"141033","name":"蒲县","province":"14","city":"10","area":"33"},{"code":"141034","name":"汾西县","province":"14","city":"10","area":"34"},{"code":"141081","name":"侯马市","province":"14","city":"10","area":"81"},{"code":"141082","name":"霍州市","province":"14","city":"10","area":"82"},{"code":"141001","name":"市辖区","province":"14","city":"10","area":"01"}]},{"code":"141100","name":"吕梁市","province":"14","city":"11","children":[{"code":"141102","name":"离石区","province":"14","city":"11","area":"02"},{"code":"141121","name":"文水县","province":"14","city":"11","area":"21"},{"code":"141122","name":"交城县","province":"14","city":"11","area":"22"},{"code":"141123","name":"兴县","province":"14","city":"11","area":"23"},{"code":"141124","name":"临县","province":"14","city":"11","area":"24"},{"code":"141125","name":"柳林县","province":"14","city":"11","area":"25"},{"code":"141126","name":"石楼县","province":"14","city":"11","area":"26"},{"code":"141127","name":"岚县","province":"14","city":"11","area":"27"},{"code":"141128","name":"方山县","province":"14","city":"11","area":"28"},{"code":"141129","name":"中阳县","province":"14","city":"11","area":"29"},{"code":"141130","name":"交口县","province":"14","city":"11","area":"30"},{"code":"141181","name":"孝义市","province":"14","city":"11","area":"81"},{"code":"141182","name":"汾阳市","province":"14","city":"11","area":"82"},{"code":"141101","name":"市辖区","province":"14","city":"11","area":"01"}]}]},{"code":"150000","name":"内蒙古自治区","province":"15","children":[{"code":"150100","name":"呼和浩特市","province":"15","city":"01","children":[{"code":"150102","name":"新城区","province":"15","city":"01","area":"02"},{"code":"150103","name":"回民区","province":"15","city":"01","area":"03"},{"code":"150104","name":"玉泉区","province":"15","city":"01","area":"04"},{"code":"150105","name":"赛罕区","province":"15","city":"01","area":"05"},{"code":"150121","name":"土默特左旗","province":"15","city":"01","area":"21"},{"code":"150122","name":"托克托县","province":"15","city":"01","area":"22"},{"code":"150123","name":"和林格尔县","province":"15","city":"01","area":"23"},{"code":"150124","name":"清水河县","province":"15","city":"01","area":"24"},{"code":"150125","name":"武川县","province":"15","city":"01","area":"25"},{"code":"150101","name":"市辖区","province":"15","city":"01","area":"01"},{"code":"150172","name":"呼和浩特经济技术开发区","province":"15","city":"01","area":"72"}]},{"code":"150200","name":"包头市","province":"15","city":"02","children":[{"code":"150202","name":"东河区","province":"15","city":"02","area":"02"},{"code":"150203","name":"昆都仑区","province":"15","city":"02","area":"03"},{"code":"150204","name":"青山区","province":"15","city":"02","area":"04"},{"code":"150205","name":"石拐区","province":"15","city":"02","area":"05"},{"code":"150206","name":"白云鄂博矿区","province":"15","city":"02","area":"06"},{"code":"150207","name":"九原区","province":"15","city":"02","area":"07"},{"code":"150221","name":"土默特右旗","province":"15","city":"02","area":"21"},{"code":"150222","name":"固阳县","province":"15","city":"02","area":"22"},{"code":"150223","name":"达尔罕茂明安联合旗","province":"15","city":"02","area":"23"},{"code":"150201","name":"市辖区","province":"15","city":"02","area":"01"},{"code":"150271","name":"包头稀土高新技术产业开发区","province":"15","city":"02","area":"71"}]},{"code":"150300","name":"乌海市","province":"15","city":"03","children":[{"code":"150302","name":"海勃湾区","province":"15","city":"03","area":"02"},{"code":"150303","name":"海南区","province":"15","city":"03","area":"03"},{"code":"150304","name":"乌达区","province":"15","city":"03","area":"04"},{"code":"150301","name":"市辖区","province":"15","city":"03","area":"01"}]},{"code":"150400","name":"赤峰市","province":"15","city":"04","children":[{"code":"150402","name":"红山区","province":"15","city":"04","area":"02"},{"code":"150403","name":"元宝山区","province":"15","city":"04","area":"03"},{"code":"150404","name":"松山区","province":"15","city":"04","area":"04"},{"code":"150421","name":"阿鲁科尔沁旗","province":"15","city":"04","area":"21"},{"code":"150422","name":"巴林左旗","province":"15","city":"04","area":"22"},{"code":"150423","name":"巴林右旗","province":"15","city":"04","area":"23"},{"code":"150424","name":"林西县","province":"15","city":"04","area":"24"},{"code":"150425","name":"克什克腾旗","province":"15","city":"04","area":"25"},{"code":"150426","name":"翁牛特旗","province":"15","city":"04","area":"26"},{"code":"150428","name":"喀喇沁旗","province":"15","city":"04","area":"28"},{"code":"150429","name":"宁城县","province":"15","city":"04","area":"29"},{"code":"150430","name":"敖汉旗","province":"15","city":"04","area":"30"},{"code":"150401","name":"市辖区","province":"15","city":"04","area":"01"}]},{"code":"150500","name":"通辽市","province":"15","city":"05","children":[{"code":"150502","name":"科尔沁区","province":"15","city":"05","area":"02"},{"code":"150521","name":"科尔沁左翼中旗","province":"15","city":"05","area":"21"},{"code":"150522","name":"科尔沁左翼后旗","province":"15","city":"05","area":"22"},{"code":"150523","name":"开鲁县","province":"15","city":"05","area":"23"},{"code":"150524","name":"库伦旗","province":"15","city":"05","area":"24"},{"code":"150525","name":"奈曼旗","province":"15","city":"05","area":"25"},{"code":"150526","name":"扎鲁特旗","province":"15","city":"05","area":"26"},{"code":"150581","name":"霍林郭勒市","province":"15","city":"05","area":"81"},{"code":"150501","name":"市辖区","province":"15","city":"05","area":"01"},{"code":"150571","name":"通辽经济技术开发区","province":"15","city":"05","area":"71"}]},{"code":"150600","name":"鄂尔多斯市","province":"15","city":"06","children":[{"code":"150602","name":"东胜区","province":"15","city":"06","area":"02"},{"code":"150603","name":"康巴什区","province":"15","city":"06","area":"03"},{"code":"150621","name":"达拉特旗","province":"15","city":"06","area":"21"},{"code":"150622","name":"准格尔旗","province":"15","city":"06","area":"22"},{"code":"150623","name":"鄂托克前旗","province":"15","city":"06","area":"23"},{"code":"150624","name":"鄂托克旗","province":"15","city":"06","area":"24"},{"code":"150625","name":"杭锦旗","province":"15","city":"06","area":"25"},{"code":"150626","name":"乌审旗","province":"15","city":"06","area":"26"},{"code":"150627","name":"伊金霍洛旗","province":"15","city":"06","area":"27"},{"code":"150601","name":"市辖区","province":"15","city":"06","area":"01"}]},{"code":"150700","name":"呼伦贝尔市","province":"15","city":"07","children":[{"code":"150702","name":"海拉尔区","province":"15","city":"07","area":"02"},{"code":"150703","name":"扎赉诺尔区","province":"15","city":"07","area":"03"},{"code":"150721","name":"阿荣旗","province":"15","city":"07","area":"21"},{"code":"150722","name":"莫力达瓦达斡尔族自治旗","province":"15","city":"07","area":"22"},{"code":"150723","name":"鄂伦春自治旗","province":"15","city":"07","area":"23"},{"code":"150724","name":"鄂温克族自治旗","province":"15","city":"07","area":"24"},{"code":"150725","name":"陈巴尔虎旗","province":"15","city":"07","area":"25"},{"code":"150726","name":"新巴尔虎左旗","province":"15","city":"07","area":"26"},{"code":"150727","name":"新巴尔虎右旗","province":"15","city":"07","area":"27"},{"code":"150781","name":"满洲里市","province":"15","city":"07","area":"81"},{"code":"150782","name":"牙克石市","province":"15","city":"07","area":"82"},{"code":"150783","name":"扎兰屯市","province":"15","city":"07","area":"83"},{"code":"150784","name":"额尔古纳市","province":"15","city":"07","area":"84"},{"code":"150785","name":"根河市","province":"15","city":"07","area":"85"},{"code":"150701","name":"市辖区","province":"15","city":"07","area":"01"}]},{"code":"150800","name":"巴彦淖尔市","province":"15","city":"08","children":[{"code":"150802","name":"临河区","province":"15","city":"08","area":"02"},{"code":"150821","name":"五原县","province":"15","city":"08","area":"21"},{"code":"150822","name":"磴口县","province":"15","city":"08","area":"22"},{"code":"150823","name":"乌拉特前旗","province":"15","city":"08","area":"23"},{"code":"150824","name":"乌拉特中旗","province":"15","city":"08","area":"24"},{"code":"150825","name":"乌拉特后旗","province":"15","city":"08","area":"25"},{"code":"150826","name":"杭锦后旗","province":"15","city":"08","area":"26"},{"code":"150801","name":"市辖区","province":"15","city":"08","area":"01"}]},{"code":"150900","name":"乌兰察布市","province":"15","city":"09","children":[{"code":"150902","name":"集宁区","province":"15","city":"09","area":"02"},{"code":"150921","name":"卓资县","province":"15","city":"09","area":"21"},{"code":"150922","name":"化德县","province":"15","city":"09","area":"22"},{"code":"150923","name":"商都县","province":"15","city":"09","area":"23"},{"code":"150924","name":"兴和县","province":"15","city":"09","area":"24"},{"code":"150925","name":"凉城县","province":"15","city":"09","area":"25"},{"code":"150926","name":"察哈尔右翼前旗","province":"15","city":"09","area":"26"},{"code":"150927","name":"察哈尔右翼中旗","province":"15","city":"09","area":"27"},{"code":"150928","name":"察哈尔右翼后旗","province":"15","city":"09","area":"28"},{"code":"150929","name":"四子王旗","province":"15","city":"09","area":"29"},{"code":"150981","name":"丰镇市","province":"15","city":"09","area":"81"},{"code":"150901","name":"市辖区","province":"15","city":"09","area":"01"}]},{"code":"152200","name":"兴安盟","province":"15","city":"22","children":[{"code":"152201","name":"乌兰浩特市","province":"15","city":"22","area":"01"},{"code":"152202","name":"阿尔山市","province":"15","city":"22","area":"02"},{"code":"152221","name":"科尔沁右翼前旗","province":"15","city":"22","area":"21"},{"code":"152222","name":"科尔沁右翼中旗","province":"15","city":"22","area":"22"},{"code":"152223","name":"扎赉特旗","province":"15","city":"22","area":"23"},{"code":"152224","name":"突泉县","province":"15","city":"22","area":"24"}]},{"code":"152500","name":"锡林郭勒盟","province":"15","city":"25","children":[{"code":"152501","name":"二连浩特市","province":"15","city":"25","area":"01"},{"code":"152502","name":"锡林浩特市","province":"15","city":"25","area":"02"},{"code":"152522","name":"阿巴嘎旗","province":"15","city":"25","area":"22"},{"code":"152523","name":"苏尼特左旗","province":"15","city":"25","area":"23"},{"code":"152524","name":"苏尼特右旗","province":"15","city":"25","area":"24"},{"code":"152525","name":"东乌珠穆沁旗","province":"15","city":"25","area":"25"},{"code":"152526","name":"西乌珠穆沁旗","province":"15","city":"25","area":"26"},{"code":"152527","name":"太仆寺旗","province":"15","city":"25","area":"27"},{"code":"152528","name":"镶黄旗","province":"15","city":"25","area":"28"},{"code":"152529","name":"正镶白旗","province":"15","city":"25","area":"29"},{"code":"152530","name":"正蓝旗","province":"15","city":"25","area":"30"},{"code":"152531","name":"多伦县","province":"15","city":"25","area":"31"},{"code":"152571","name":"乌拉盖管委会","province":"15","city":"25","area":"71"}]},{"code":"152900","name":"阿拉善盟","province":"15","city":"29","children":[{"code":"152921","name":"阿拉善左旗","province":"15","city":"29","area":"21"},{"code":"152922","name":"阿拉善右旗","province":"15","city":"29","area":"22"},{"code":"152923","name":"额济纳旗","province":"15","city":"29","area":"23"},{"code":"152971","name":"内蒙古阿拉善高新技术产业开发区","province":"15","city":"29","area":"71"}]}]},{"code":"210000","name":"辽宁省","province":"21","children":[{"code":"210100","name":"沈阳市","province":"21","city":"01","children":[{"code":"210102","name":"和平区","province":"21","city":"01","area":"02"},{"code":"210103","name":"沈河区","province":"21","city":"01","area":"03"},{"code":"210104","name":"大东区","province":"21","city":"01","area":"04"},{"code":"210105","name":"皇姑区","province":"21","city":"01","area":"05"},{"code":"210106","name":"铁西区","province":"21","city":"01","area":"06"},{"code":"210111","name":"苏家屯区","province":"21","city":"01","area":"11"},{"code":"210112","name":"浑南区","province":"21","city":"01","area":"12"},{"code":"210113","name":"沈北新区","province":"21","city":"01","area":"13"},{"code":"210114","name":"于洪区","province":"21","city":"01","area":"14"},{"code":"210115","name":"辽中区","province":"21","city":"01","area":"15"},{"code":"210123","name":"康平县","province":"21","city":"01","area":"23"},{"code":"210124","name":"法库县","province":"21","city":"01","area":"24"},{"code":"210181","name":"新民市","province":"21","city":"01","area":"81"},{"code":"210101","name":"市辖区","province":"21","city":"01","area":"01"}]},{"code":"210200","name":"大连市","province":"21","city":"02","children":[{"code":"210202","name":"中山区","province":"21","city":"02","area":"02"},{"code":"210203","name":"西岗区","province":"21","city":"02","area":"03"},{"code":"210204","name":"沙河口区","province":"21","city":"02","area":"04"},{"code":"210211","name":"甘井子区","province":"21","city":"02","area":"11"},{"code":"210212","name":"旅顺口区","province":"21","city":"02","area":"12"},{"code":"210213","name":"金州区","province":"21","city":"02","area":"13"},{"code":"210214","name":"普兰店区","province":"21","city":"02","area":"14"},{"code":"210224","name":"长海县","province":"21","city":"02","area":"24"},{"code":"210281","name":"瓦房店市","province":"21","city":"02","area":"81"},{"code":"210283","name":"庄河市","province":"21","city":"02","area":"83"},{"code":"210201","name":"市辖区","province":"21","city":"02","area":"01"}]},{"code":"210300","name":"鞍山市","province":"21","city":"03","children":[{"code":"210302","name":"铁东区","province":"21","city":"03","area":"02"},{"code":"210303","name":"铁西区","province":"21","city":"03","area":"03"},{"code":"210304","name":"立山区","province":"21","city":"03","area":"04"},{"code":"210311","name":"千山区","province":"21","city":"03","area":"11"},{"code":"210321","name":"台安县","province":"21","city":"03","area":"21"},{"code":"210323","name":"岫岩满族自治县","province":"21","city":"03","area":"23"},{"code":"210381","name":"海城市","province":"21","city":"03","area":"81"},{"code":"210301","name":"市辖区","province":"21","city":"03","area":"01"}]},{"code":"210400","name":"抚顺市","province":"21","city":"04","children":[{"code":"210402","name":"新抚区","province":"21","city":"04","area":"02"},{"code":"210403","name":"东洲区","province":"21","city":"04","area":"03"},{"code":"210404","name":"望花区","province":"21","city":"04","area":"04"},{"code":"210411","name":"顺城区","province":"21","city":"04","area":"11"},{"code":"210421","name":"抚顺县","province":"21","city":"04","area":"21"},{"code":"210422","name":"新宾满族自治县","province":"21","city":"04","area":"22"},{"code":"210423","name":"清原满族自治县","province":"21","city":"04","area":"23"},{"code":"210401","name":"市辖区","province":"21","city":"04","area":"01"}]},{"code":"210500","name":"本溪市","province":"21","city":"05","children":[{"code":"210502","name":"平山区","province":"21","city":"05","area":"02"},{"code":"210503","name":"溪湖区","province":"21","city":"05","area":"03"},{"code":"210504","name":"明山区","province":"21","city":"05","area":"04"},{"code":"210505","name":"南芬区","province":"21","city":"05","area":"05"},{"code":"210521","name":"本溪满族自治县","province":"21","city":"05","area":"21"},{"code":"210522","name":"桓仁满族自治县","province":"21","city":"05","area":"22"},{"code":"210501","name":"市辖区","province":"21","city":"05","area":"01"}]},{"code":"210600","name":"丹东市","province":"21","city":"06","children":[{"code":"210602","name":"元宝区","province":"21","city":"06","area":"02"},{"code":"210603","name":"振兴区","province":"21","city":"06","area":"03"},{"code":"210604","name":"振安区","province":"21","city":"06","area":"04"},{"code":"210624","name":"宽甸满族自治县","province":"21","city":"06","area":"24"},{"code":"210681","name":"东港市","province":"21","city":"06","area":"81"},{"code":"210682","name":"凤城市","province":"21","city":"06","area":"82"},{"code":"210601","name":"市辖区","province":"21","city":"06","area":"01"}]},{"code":"210700","name":"锦州市","province":"21","city":"07","children":[{"code":"210702","name":"古塔区","province":"21","city":"07","area":"02"},{"code":"210703","name":"凌河区","province":"21","city":"07","area":"03"},{"code":"210711","name":"太和区","province":"21","city":"07","area":"11"},{"code":"210726","name":"黑山县","province":"21","city":"07","area":"26"},{"code":"210727","name":"义县","province":"21","city":"07","area":"27"},{"code":"210781","name":"凌海市","province":"21","city":"07","area":"81"},{"code":"210782","name":"北镇市","province":"21","city":"07","area":"82"},{"code":"210701","name":"市辖区","province":"21","city":"07","area":"01"}]},{"code":"210800","name":"营口市","province":"21","city":"08","children":[{"code":"210802","name":"站前区","province":"21","city":"08","area":"02"},{"code":"210803","name":"西市区","province":"21","city":"08","area":"03"},{"code":"210804","name":"鲅鱼圈区","province":"21","city":"08","area":"04"},{"code":"210811","name":"老边区","province":"21","city":"08","area":"11"},{"code":"210881","name":"盖州市","province":"21","city":"08","area":"81"},{"code":"210882","name":"大石桥市","province":"21","city":"08","area":"82"},{"code":"210801","name":"市辖区","province":"21","city":"08","area":"01"}]},{"code":"210900","name":"阜新市","province":"21","city":"09","children":[{"code":"210902","name":"海州区","province":"21","city":"09","area":"02"},{"code":"210903","name":"新邱区","province":"21","city":"09","area":"03"},{"code":"210904","name":"太平区","province":"21","city":"09","area":"04"},{"code":"210905","name":"清河门区","province":"21","city":"09","area":"05"},{"code":"210911","name":"细河区","province":"21","city":"09","area":"11"},{"code":"210921","name":"阜新蒙古族自治县","province":"21","city":"09","area":"21"},{"code":"210922","name":"彰武县","province":"21","city":"09","area":"22"},{"code":"210901","name":"市辖区","province":"21","city":"09","area":"01"}]},{"code":"211000","name":"辽阳市","province":"21","city":"10","children":[{"code":"211002","name":"白塔区","province":"21","city":"10","area":"02"},{"code":"211003","name":"文圣区","province":"21","city":"10","area":"03"},{"code":"211004","name":"宏伟区","province":"21","city":"10","area":"04"},{"code":"211005","name":"弓长岭区","province":"21","city":"10","area":"05"},{"code":"211011","name":"太子河区","province":"21","city":"10","area":"11"},{"code":"211021","name":"辽阳县","province":"21","city":"10","area":"21"},{"code":"211081","name":"灯塔市","province":"21","city":"10","area":"81"},{"code":"211001","name":"市辖区","province":"21","city":"10","area":"01"}]},{"code":"211100","name":"盘锦市","province":"21","city":"11","children":[{"code":"211102","name":"双台子区","province":"21","city":"11","area":"02"},{"code":"211103","name":"兴隆台区","province":"21","city":"11","area":"03"},{"code":"211104","name":"大洼区","province":"21","city":"11","area":"04"},{"code":"211122","name":"盘山县","province":"21","city":"11","area":"22"},{"code":"211101","name":"市辖区","province":"21","city":"11","area":"01"}]},{"code":"211200","name":"铁岭市","province":"21","city":"12","children":[{"code":"211202","name":"银州区","province":"21","city":"12","area":"02"},{"code":"211204","name":"清河区","province":"21","city":"12","area":"04"},{"code":"211221","name":"铁岭县","province":"21","city":"12","area":"21"},{"code":"211223","name":"西丰县","province":"21","city":"12","area":"23"},{"code":"211224","name":"昌图县","province":"21","city":"12","area":"24"},{"code":"211281","name":"调兵山市","province":"21","city":"12","area":"81"},{"code":"211282","name":"开原市","province":"21","city":"12","area":"82"},{"code":"211201","name":"市辖区","province":"21","city":"12","area":"01"}]},{"code":"211300","name":"朝阳市","province":"21","city":"13","children":[{"code":"211302","name":"双塔区","province":"21","city":"13","area":"02"},{"code":"211303","name":"龙城区","province":"21","city":"13","area":"03"},{"code":"211321","name":"朝阳县","province":"21","city":"13","area":"21"},{"code":"211322","name":"建平县","province":"21","city":"13","area":"22"},{"code":"211324","name":"喀喇沁左翼蒙古族自治县","province":"21","city":"13","area":"24"},{"code":"211381","name":"北票市","province":"21","city":"13","area":"81"},{"code":"211382","name":"凌源市","province":"21","city":"13","area":"82"},{"code":"211301","name":"市辖区","province":"21","city":"13","area":"01"}]},{"code":"211400","name":"葫芦岛市","province":"21","city":"14","children":[{"code":"211402","name":"连山区","province":"21","city":"14","area":"02"},{"code":"211403","name":"龙港区","province":"21","city":"14","area":"03"},{"code":"211404","name":"南票区","province":"21","city":"14","area":"04"},{"code":"211421","name":"绥中县","province":"21","city":"14","area":"21"},{"code":"211422","name":"建昌县","province":"21","city":"14","area":"22"},{"code":"211481","name":"兴城市","province":"21","city":"14","area":"81"},{"code":"211401","name":"市辖区","province":"21","city":"14","area":"01"}]}]},{"code":"220000","name":"吉林省","province":"22","children":[{"code":"220100","name":"长春市","province":"22","city":"01","children":[{"code":"220102","name":"南关区","province":"22","city":"01","area":"02"},{"code":"220103","name":"宽城区","province":"22","city":"01","area":"03"},{"code":"220104","name":"朝阳区","province":"22","city":"01","area":"04"},{"code":"220105","name":"二道区","province":"22","city":"01","area":"05"},{"code":"220106","name":"绿园区","province":"22","city":"01","area":"06"},{"code":"220112","name":"双阳区","province":"22","city":"01","area":"12"},{"code":"220113","name":"九台区","province":"22","city":"01","area":"13"},{"code":"220122","name":"农安县","province":"22","city":"01","area":"22"},{"code":"220182","name":"榆树市","province":"22","city":"01","area":"82"},{"code":"220183","name":"德惠市","province":"22","city":"01","area":"83"},{"code":"220184","name":"公主岭市","province":"22","city":"01","area":"84"},{"code":"220101","name":"市辖区","province":"22","city":"01","area":"01"},{"code":"220171","name":"长春经济技术开发区","province":"22","city":"01","area":"71"},{"code":"220172","name":"长春净月高新技术产业开发区","province":"22","city":"01","area":"72"},{"code":"220173","name":"长春高新技术产业开发区","province":"22","city":"01","area":"73"},{"code":"220174","name":"长春汽车经济技术开发区","province":"22","city":"01","area":"74"}]},{"code":"220200","name":"吉林市","province":"22","city":"02","children":[{"code":"220202","name":"昌邑区","province":"22","city":"02","area":"02"},{"code":"220203","name":"龙潭区","province":"22","city":"02","area":"03"},{"code":"220204","name":"船营区","province":"22","city":"02","area":"04"},{"code":"220211","name":"丰满区","province":"22","city":"02","area":"11"},{"code":"220221","name":"永吉县","province":"22","city":"02","area":"21"},{"code":"220281","name":"蛟河市","province":"22","city":"02","area":"81"},{"code":"220282","name":"桦甸市","province":"22","city":"02","area":"82"},{"code":"220283","name":"舒兰市","province":"22","city":"02","area":"83"},{"code":"220284","name":"磐石市","province":"22","city":"02","area":"84"},{"code":"220201","name":"市辖区","province":"22","city":"02","area":"01"},{"code":"220271","name":"吉林经济开发区","province":"22","city":"02","area":"71"},{"code":"220272","name":"吉林高新技术产业开发区","province":"22","city":"02","area":"72"},{"code":"220273","name":"吉林中国新加坡食品区","province":"22","city":"02","area":"73"}]},{"code":"220300","name":"四平市","province":"22","city":"03","children":[{"code":"220302","name":"铁西区","province":"22","city":"03","area":"02"},{"code":"220303","name":"铁东区","province":"22","city":"03","area":"03"},{"code":"220322","name":"梨树县","province":"22","city":"03","area":"22"},{"code":"220323","name":"伊通满族自治县","province":"22","city":"03","area":"23"},{"code":"220382","name":"双辽市","province":"22","city":"03","area":"82"},{"code":"220301","name":"市辖区","province":"22","city":"03","area":"01"}]},{"code":"220400","name":"辽源市","province":"22","city":"04","children":[{"code":"220402","name":"龙山区","province":"22","city":"04","area":"02"},{"code":"220403","name":"西安区","province":"22","city":"04","area":"03"},{"code":"220421","name":"东丰县","province":"22","city":"04","area":"21"},{"code":"220422","name":"东辽县","province":"22","city":"04","area":"22"},{"code":"220401","name":"市辖区","province":"22","city":"04","area":"01"}]},{"code":"220500","name":"通化市","province":"22","city":"05","children":[{"code":"220502","name":"东昌区","province":"22","city":"05","area":"02"},{"code":"220503","name":"二道江区","province":"22","city":"05","area":"03"},{"code":"220521","name":"通化县","province":"22","city":"05","area":"21"},{"code":"220523","name":"辉南县","province":"22","city":"05","area":"23"},{"code":"220524","name":"柳河县","province":"22","city":"05","area":"24"},{"code":"220581","name":"梅河口市","province":"22","city":"05","area":"81"},{"code":"220582","name":"集安市","province":"22","city":"05","area":"82"},{"code":"220501","name":"市辖区","province":"22","city":"05","area":"01"}]},{"code":"220600","name":"白山市","province":"22","city":"06","children":[{"code":"220602","name":"浑江区","province":"22","city":"06","area":"02"},{"code":"220605","name":"江源区","province":"22","city":"06","area":"05"},{"code":"220621","name":"抚松县","province":"22","city":"06","area":"21"},{"code":"220622","name":"靖宇县","province":"22","city":"06","area":"22"},{"code":"220623","name":"长白朝鲜族自治县","province":"22","city":"06","area":"23"},{"code":"220681","name":"临江市","province":"22","city":"06","area":"81"},{"code":"220601","name":"市辖区","province":"22","city":"06","area":"01"}]},{"code":"220700","name":"松原市","province":"22","city":"07","children":[{"code":"220702","name":"宁江区","province":"22","city":"07","area":"02"},{"code":"220721","name":"前郭尔罗斯蒙古族自治县","province":"22","city":"07","area":"21"},{"code":"220722","name":"长岭县","province":"22","city":"07","area":"22"},{"code":"220723","name":"乾安县","province":"22","city":"07","area":"23"},{"code":"220781","name":"扶余市","province":"22","city":"07","area":"81"},{"code":"220701","name":"市辖区","province":"22","city":"07","area":"01"},{"code":"220771","name":"吉林松原经济开发区","province":"22","city":"07","area":"71"}]},{"code":"220800","name":"白城市","province":"22","city":"08","children":[{"code":"220802","name":"洮北区","province":"22","city":"08","area":"02"},{"code":"220821","name":"镇赉县","province":"22","city":"08","area":"21"},{"code":"220822","name":"通榆县","province":"22","city":"08","area":"22"},{"code":"220881","name":"洮南市","province":"22","city":"08","area":"81"},{"code":"220882","name":"大安市","province":"22","city":"08","area":"82"},{"code":"220801","name":"市辖区","province":"22","city":"08","area":"01"},{"code":"220871","name":"吉林白城经济开发区","province":"22","city":"08","area":"71"}]},{"code":"222400","name":"延边朝鲜族自治州","province":"22","city":"24","children":[{"code":"222401","name":"延吉市","province":"22","city":"24","area":"01"},{"code":"222402","name":"图们市","province":"22","city":"24","area":"02"},{"code":"222403","name":"敦化市","province":"22","city":"24","area":"03"},{"code":"222404","name":"珲春市","province":"22","city":"24","area":"04"},{"code":"222405","name":"龙井市","province":"22","city":"24","area":"05"},{"code":"222406","name":"和龙市","province":"22","city":"24","area":"06"},{"code":"222424","name":"汪清县","province":"22","city":"24","area":"24"},{"code":"222426","name":"安图县","province":"22","city":"24","area":"26"}]}]},{"code":"230000","name":"黑龙江省","province":"23","children":[{"code":"230100","name":"哈尔滨市","province":"23","city":"01","children":[{"code":"230102","name":"道里区","province":"23","city":"01","area":"02"},{"code":"230103","name":"南岗区","province":"23","city":"01","area":"03"},{"code":"230104","name":"道外区","province":"23","city":"01","area":"04"},{"code":"230108","name":"平房区","province":"23","city":"01","area":"08"},{"code":"230109","name":"松北区","province":"23","city":"01","area":"09"},{"code":"230110","name":"香坊区","province":"23","city":"01","area":"10"},{"code":"230111","name":"呼兰区","province":"23","city":"01","area":"11"},{"code":"230112","name":"阿城区","province":"23","city":"01","area":"12"},{"code":"230113","name":"双城区","province":"23","city":"01","area":"13"},{"code":"230123","name":"依兰县","province":"23","city":"01","area":"23"},{"code":"230124","name":"方正县","province":"23","city":"01","area":"24"},{"code":"230125","name":"宾县","province":"23","city":"01","area":"25"},{"code":"230126","name":"巴彦县","province":"23","city":"01","area":"26"},{"code":"230127","name":"木兰县","province":"23","city":"01","area":"27"},{"code":"230128","name":"通河县","province":"23","city":"01","area":"28"},{"code":"230129","name":"延寿县","province":"23","city":"01","area":"29"},{"code":"230183","name":"尚志市","province":"23","city":"01","area":"83"},{"code":"230184","name":"五常市","province":"23","city":"01","area":"84"},{"code":"230101","name":"市辖区","province":"23","city":"01","area":"01"}]},{"code":"230200","name":"齐齐哈尔市","province":"23","city":"02","children":[{"code":"230202","name":"龙沙区","province":"23","city":"02","area":"02"},{"code":"230203","name":"建华区","province":"23","city":"02","area":"03"},{"code":"230204","name":"铁锋区","province":"23","city":"02","area":"04"},{"code":"230205","name":"昂昂溪区","province":"23","city":"02","area":"05"},{"code":"230206","name":"富拉尔基区","province":"23","city":"02","area":"06"},{"code":"230207","name":"碾子山区","province":"23","city":"02","area":"07"},{"code":"230208","name":"梅里斯达斡尔族区","province":"23","city":"02","area":"08"},{"code":"230221","name":"龙江县","province":"23","city":"02","area":"21"},{"code":"230223","name":"依安县","province":"23","city":"02","area":"23"},{"code":"230224","name":"泰来县","province":"23","city":"02","area":"24"},{"code":"230225","name":"甘南县","province":"23","city":"02","area":"25"},{"code":"230227","name":"富裕县","province":"23","city":"02","area":"27"},{"code":"230229","name":"克山县","province":"23","city":"02","area":"29"},{"code":"230230","name":"克东县","province":"23","city":"02","area":"30"},{"code":"230231","name":"拜泉县","province":"23","city":"02","area":"31"},{"code":"230281","name":"讷河市","province":"23","city":"02","area":"81"},{"code":"230201","name":"市辖区","province":"23","city":"02","area":"01"}]},{"code":"230300","name":"鸡西市","province":"23","city":"03","children":[{"code":"230302","name":"鸡冠区","province":"23","city":"03","area":"02"},{"code":"230303","name":"恒山区","province":"23","city":"03","area":"03"},{"code":"230304","name":"滴道区","province":"23","city":"03","area":"04"},{"code":"230305","name":"梨树区","province":"23","city":"03","area":"05"},{"code":"230306","name":"城子河区","province":"23","city":"03","area":"06"},{"code":"230307","name":"麻山区","province":"23","city":"03","area":"07"},{"code":"230321","name":"鸡东县","province":"23","city":"03","area":"21"},{"code":"230381","name":"虎林市","province":"23","city":"03","area":"81"},{"code":"230382","name":"密山市","province":"23","city":"03","area":"82"},{"code":"230301","name":"市辖区","province":"23","city":"03","area":"01"}]},{"code":"230400","name":"鹤岗市","province":"23","city":"04","children":[{"code":"230402","name":"向阳区","province":"23","city":"04","area":"02"},{"code":"230403","name":"工农区","province":"23","city":"04","area":"03"},{"code":"230404","name":"南山区","province":"23","city":"04","area":"04"},{"code":"230405","name":"兴安区","province":"23","city":"04","area":"05"},{"code":"230406","name":"东山区","province":"23","city":"04","area":"06"},{"code":"230407","name":"兴山区","province":"23","city":"04","area":"07"},{"code":"230421","name":"萝北县","province":"23","city":"04","area":"21"},{"code":"230422","name":"绥滨县","province":"23","city":"04","area":"22"},{"code":"230401","name":"市辖区","province":"23","city":"04","area":"01"}]},{"code":"230500","name":"双鸭山市","province":"23","city":"05","children":[{"code":"230502","name":"尖山区","province":"23","city":"05","area":"02"},{"code":"230503","name":"岭东区","province":"23","city":"05","area":"03"},{"code":"230505","name":"四方台区","province":"23","city":"05","area":"05"},{"code":"230506","name":"宝山区","province":"23","city":"05","area":"06"},{"code":"230521","name":"集贤县","province":"23","city":"05","area":"21"},{"code":"230522","name":"友谊县","province":"23","city":"05","area":"22"},{"code":"230523","name":"宝清县","province":"23","city":"05","area":"23"},{"code":"230524","name":"饶河县","province":"23","city":"05","area":"24"},{"code":"230501","name":"市辖区","province":"23","city":"05","area":"01"}]},{"code":"230600","name":"大庆市","province":"23","city":"06","children":[{"code":"230602","name":"萨尔图区","province":"23","city":"06","area":"02"},{"code":"230603","name":"龙凤区","province":"23","city":"06","area":"03"},{"code":"230604","name":"让胡路区","province":"23","city":"06","area":"04"},{"code":"230605","name":"红岗区","province":"23","city":"06","area":"05"},{"code":"230606","name":"大同区","province":"23","city":"06","area":"06"},{"code":"230621","name":"肇州县","province":"23","city":"06","area":"21"},{"code":"230622","name":"肇源县","province":"23","city":"06","area":"22"},{"code":"230623","name":"林甸县","province":"23","city":"06","area":"23"},{"code":"230624","name":"杜尔伯特蒙古族自治县","province":"23","city":"06","area":"24"},{"code":"230601","name":"市辖区","province":"23","city":"06","area":"01"},{"code":"230671","name":"大庆高新技术产业开发区","province":"23","city":"06","area":"71"}]},{"code":"230700","name":"伊春市","province":"23","city":"07","children":[{"code":"230717","name":"伊美区","province":"23","city":"07","area":"17"},{"code":"230718","name":"乌翠区","province":"23","city":"07","area":"18"},{"code":"230719","name":"友好区","province":"23","city":"07","area":"19"},{"code":"230722","name":"嘉荫县","province":"23","city":"07","area":"22"},{"code":"230723","name":"汤旺县","province":"23","city":"07","area":"23"},{"code":"230724","name":"丰林县","province":"23","city":"07","area":"24"},{"code":"230725","name":"大箐山县","province":"23","city":"07","area":"25"},{"code":"230726","name":"南岔县","province":"23","city":"07","area":"26"},{"code":"230751","name":"金林区","province":"23","city":"07","area":"51"},{"code":"230781","name":"铁力市","province":"23","city":"07","area":"81"},{"code":"230701","name":"市辖区","province":"23","city":"07","area":"01"}]},{"code":"230800","name":"佳木斯市","province":"23","city":"08","children":[{"code":"230803","name":"向阳区","province":"23","city":"08","area":"03"},{"code":"230804","name":"前进区","province":"23","city":"08","area":"04"},{"code":"230805","name":"东风区","province":"23","city":"08","area":"05"},{"code":"230811","name":"郊区","province":"23","city":"08","area":"11"},{"code":"230822","name":"桦南县","province":"23","city":"08","area":"22"},{"code":"230826","name":"桦川县","province":"23","city":"08","area":"26"},{"code":"230828","name":"汤原县","province":"23","city":"08","area":"28"},{"code":"230881","name":"同江市","province":"23","city":"08","area":"81"},{"code":"230882","name":"富锦市","province":"23","city":"08","area":"82"},{"code":"230883","name":"抚远市","province":"23","city":"08","area":"83"},{"code":"230801","name":"市辖区","province":"23","city":"08","area":"01"}]},{"code":"230900","name":"七台河市","province":"23","city":"09","children":[{"code":"230902","name":"新兴区","province":"23","city":"09","area":"02"},{"code":"230903","name":"桃山区","province":"23","city":"09","area":"03"},{"code":"230904","name":"茄子河区","province":"23","city":"09","area":"04"},{"code":"230921","name":"勃利县","province":"23","city":"09","area":"21"},{"code":"230901","name":"市辖区","province":"23","city":"09","area":"01"}]},{"code":"231000","name":"牡丹江市","province":"23","city":"10","children":[{"code":"231002","name":"东安区","province":"23","city":"10","area":"02"},{"code":"231003","name":"阳明区","province":"23","city":"10","area":"03"},{"code":"231004","name":"爱民区","province":"23","city":"10","area":"04"},{"code":"231005","name":"西安区","province":"23","city":"10","area":"05"},{"code":"231025","name":"林口县","province":"23","city":"10","area":"25"},{"code":"231081","name":"绥芬河市","province":"23","city":"10","area":"81"},{"code":"231083","name":"海林市","province":"23","city":"10","area":"83"},{"code":"231084","name":"宁安市","province":"23","city":"10","area":"84"},{"code":"231085","name":"穆棱市","province":"23","city":"10","area":"85"},{"code":"231086","name":"东宁市","province":"23","city":"10","area":"86"},{"code":"231001","name":"市辖区","province":"23","city":"10","area":"01"},{"code":"231071","name":"牡丹江经济技术开发区","province":"23","city":"10","area":"71"}]},{"code":"231100","name":"黑河市","province":"23","city":"11","children":[{"code":"231102","name":"爱辉区","province":"23","city":"11","area":"02"},{"code":"231123","name":"逊克县","province":"23","city":"11","area":"23"},{"code":"231124","name":"孙吴县","province":"23","city":"11","area":"24"},{"code":"231181","name":"北安市","province":"23","city":"11","area":"81"},{"code":"231182","name":"五大连池市","province":"23","city":"11","area":"82"},{"code":"231183","name":"嫩江市","province":"23","city":"11","area":"83"},{"code":"231101","name":"市辖区","province":"23","city":"11","area":"01"}]},{"code":"231200","name":"绥化市","province":"23","city":"12","children":[{"code":"231202","name":"北林区","province":"23","city":"12","area":"02"},{"code":"231221","name":"望奎县","province":"23","city":"12","area":"21"},{"code":"231222","name":"兰西县","province":"23","city":"12","area":"22"},{"code":"231223","name":"青冈县","province":"23","city":"12","area":"23"},{"code":"231224","name":"庆安县","province":"23","city":"12","area":"24"},{"code":"231225","name":"明水县","province":"23","city":"12","area":"25"},{"code":"231226","name":"绥棱县","province":"23","city":"12","area":"26"},{"code":"231281","name":"安达市","province":"23","city":"12","area":"81"},{"code":"231282","name":"肇东市","province":"23","city":"12","area":"82"},{"code":"231283","name":"海伦市","province":"23","city":"12","area":"83"},{"code":"231201","name":"市辖区","province":"23","city":"12","area":"01"}]},{"code":"232700","name":"大兴安岭地区","province":"23","city":"27","children":[{"code":"232701","name":"漠河市","province":"23","city":"27","area":"01"},{"code":"232721","name":"呼玛县","province":"23","city":"27","area":"21"},{"code":"232722","name":"塔河县","province":"23","city":"27","area":"22"},{"code":"232761","name":"加格达奇区","province":"23","city":"27","area":"61"},{"code":"232762","name":"松岭区","province":"23","city":"27","area":"62"},{"code":"232763","name":"新林区","province":"23","city":"27","area":"63"},{"code":"232764","name":"呼中区","province":"23","city":"27","area":"64"}]}]},{"code":"310000","name":"上海市","province":"31","children":[{"code":"310101","name":"黄浦区","province":"31","city":"01","area":"01"},{"code":"310104","name":"徐汇区","province":"31","city":"01","area":"04"},{"code":"310105","name":"长宁区","province":"31","city":"01","area":"05"},{"code":"310106","name":"静安区","province":"31","city":"01","area":"06"},{"code":"310107","name":"普陀区","province":"31","city":"01","area":"07"},{"code":"310109","name":"虹口区","province":"31","city":"01","area":"09"},{"code":"310110","name":"杨浦区","province":"31","city":"01","area":"10"},{"code":"310112","name":"闵行区","province":"31","city":"01","area":"12"},{"code":"310113","name":"宝山区","province":"31","city":"01","area":"13"},{"code":"310114","name":"嘉定区","province":"31","city":"01","area":"14"},{"code":"310115","name":"浦东新区","province":"31","city":"01","area":"15"},{"code":"310116","name":"金山区","province":"31","city":"01","area":"16"},{"code":"310117","name":"松江区","province":"31","city":"01","area":"17"},{"code":"310118","name":"青浦区","province":"31","city":"01","area":"18"},{"code":"310120","name":"奉贤区","province":"31","city":"01","area":"20"},{"code":"310151","name":"崇明区","province":"31","city":"01","area":"51"}]},{"code":"320000","name":"江苏省","province":"32","children":[{"code":"320100","name":"南京市","province":"32","city":"01","children":[{"code":"320102","name":"玄武区","province":"32","city":"01","area":"02"},{"code":"320104","name":"秦淮区","province":"32","city":"01","area":"04"},{"code":"320105","name":"建邺区","province":"32","city":"01","area":"05"},{"code":"320106","name":"鼓楼区","province":"32","city":"01","area":"06"},{"code":"320111","name":"浦口区","province":"32","city":"01","area":"11"},{"code":"320113","name":"栖霞区","province":"32","city":"01","area":"13"},{"code":"320114","name":"雨花台区","province":"32","city":"01","area":"14"},{"code":"320115","name":"江宁区","province":"32","city":"01","area":"15"},{"code":"320116","name":"六合区","province":"32","city":"01","area":"16"},{"code":"320117","name":"溧水区","province":"32","city":"01","area":"17"},{"code":"320118","name":"高淳区","province":"32","city":"01","area":"18"},{"code":"320101","name":"市辖区","province":"32","city":"01","area":"01"}]},{"code":"320200","name":"无锡市","province":"32","city":"02","children":[{"code":"320205","name":"锡山区","province":"32","city":"02","area":"05"},{"code":"320206","name":"惠山区","province":"32","city":"02","area":"06"},{"code":"320211","name":"滨湖区","province":"32","city":"02","area":"11"},{"code":"320213","name":"梁溪区","province":"32","city":"02","area":"13"},{"code":"320214","name":"新吴区","province":"32","city":"02","area":"14"},{"code":"320281","name":"江阴市","province":"32","city":"02","area":"81"},{"code":"320282","name":"宜兴市","province":"32","city":"02","area":"82"},{"code":"320201","name":"市辖区","province":"32","city":"02","area":"01"}]},{"code":"320300","name":"徐州市","province":"32","city":"03","children":[{"code":"320302","name":"鼓楼区","province":"32","city":"03","area":"02"},{"code":"320303","name":"云龙区","province":"32","city":"03","area":"03"},{"code":"320305","name":"贾汪区","province":"32","city":"03","area":"05"},{"code":"320311","name":"泉山区","province":"32","city":"03","area":"11"},{"code":"320312","name":"铜山区","province":"32","city":"03","area":"12"},{"code":"320321","name":"丰县","province":"32","city":"03","area":"21"},{"code":"320322","name":"沛县","province":"32","city":"03","area":"22"},{"code":"320324","name":"睢宁县","province":"32","city":"03","area":"24"},{"code":"320381","name":"新沂市","province":"32","city":"03","area":"81"},{"code":"320382","name":"邳州市","province":"32","city":"03","area":"82"},{"code":"320301","name":"市辖区","province":"32","city":"03","area":"01"},{"code":"320371","name":"徐州经济技术开发区","province":"32","city":"03","area":"71"}]},{"code":"320400","name":"常州市","province":"32","city":"04","children":[{"code":"320402","name":"天宁区","province":"32","city":"04","area":"02"},{"code":"320404","name":"钟楼区","province":"32","city":"04","area":"04"},{"code":"320411","name":"新北区","province":"32","city":"04","area":"11"},{"code":"320412","name":"武进区","province":"32","city":"04","area":"12"},{"code":"320413","name":"金坛区","province":"32","city":"04","area":"13"},{"code":"320481","name":"溧阳市","province":"32","city":"04","area":"81"},{"code":"320401","name":"市辖区","province":"32","city":"04","area":"01"}]},{"code":"320500","name":"苏州市","province":"32","city":"05","children":[{"code":"320505","name":"虎丘区","province":"32","city":"05","area":"05"},{"code":"320506","name":"吴中区","province":"32","city":"05","area":"06"},{"code":"320507","name":"相城区","province":"32","city":"05","area":"07"},{"code":"320508","name":"姑苏区","province":"32","city":"05","area":"08"},{"code":"320509","name":"吴江区","province":"32","city":"05","area":"09"},{"code":"320581","name":"常熟市","province":"32","city":"05","area":"81"},{"code":"320582","name":"张家港市","province":"32","city":"05","area":"82"},{"code":"320583","name":"昆山市","province":"32","city":"05","area":"83"},{"code":"320585","name":"太仓市","province":"32","city":"05","area":"85"},{"code":"320501","name":"市辖区","province":"32","city":"05","area":"01"},{"code":"320571","name":"苏州工业园区","province":"32","city":"05","area":"71"}]},{"code":"320600","name":"南通市","province":"32","city":"06","children":[{"code":"320612","name":"通州区","province":"32","city":"06","area":"12"},{"code":"320613","name":"崇川区","province":"32","city":"06","area":"13"},{"code":"320614","name":"海门区","province":"32","city":"06","area":"14"},{"code":"320623","name":"如东县","province":"32","city":"06","area":"23"},{"code":"320681","name":"启东市","province":"32","city":"06","area":"81"},{"code":"320682","name":"如皋市","province":"32","city":"06","area":"82"},{"code":"320685","name":"海安市","province":"32","city":"06","area":"85"},{"code":"320601","name":"市辖区","province":"32","city":"06","area":"01"},{"code":"320671","name":"南通经济技术开发区","province":"32","city":"06","area":"71"}]},{"code":"320700","name":"连云港市","province":"32","city":"07","children":[{"code":"320703","name":"连云区","province":"32","city":"07","area":"03"},{"code":"320706","name":"海州区","province":"32","city":"07","area":"06"},{"code":"320707","name":"赣榆区","province":"32","city":"07","area":"07"},{"code":"320722","name":"东海县","province":"32","city":"07","area":"22"},{"code":"320723","name":"灌云县","province":"32","city":"07","area":"23"},{"code":"320724","name":"灌南县","province":"32","city":"07","area":"24"},{"code":"320701","name":"市辖区","province":"32","city":"07","area":"01"},{"code":"320771","name":"连云港经济技术开发区","province":"32","city":"07","area":"71"},{"code":"320772","name":"连云港高新技术产业开发区","province":"32","city":"07","area":"72"}]},{"code":"320800","name":"淮安市","province":"32","city":"08","children":[{"code":"320803","name":"淮安区","province":"32","city":"08","area":"03"},{"code":"320804","name":"淮阴区","province":"32","city":"08","area":"04"},{"code":"320812","name":"清江浦区","province":"32","city":"08","area":"12"},{"code":"320813","name":"洪泽区","province":"32","city":"08","area":"13"},{"code":"320826","name":"涟水县","province":"32","city":"08","area":"26"},{"code":"320830","name":"盱眙县","province":"32","city":"08","area":"30"},{"code":"320831","name":"金湖县","province":"32","city":"08","area":"31"},{"code":"320801","name":"市辖区","province":"32","city":"08","area":"01"},{"code":"320871","name":"淮安经济技术开发区","province":"32","city":"08","area":"71"}]},{"code":"320900","name":"盐城市","province":"32","city":"09","children":[{"code":"320902","name":"亭湖区","province":"32","city":"09","area":"02"},{"code":"320903","name":"盐都区","province":"32","city":"09","area":"03"},{"code":"320904","name":"大丰区","province":"32","city":"09","area":"04"},{"code":"320921","name":"响水县","province":"32","city":"09","area":"21"},{"code":"320922","name":"滨海县","province":"32","city":"09","area":"22"},{"code":"320923","name":"阜宁县","province":"32","city":"09","area":"23"},{"code":"320924","name":"射阳县","province":"32","city":"09","area":"24"},{"code":"320925","name":"建湖县","province":"32","city":"09","area":"25"},{"code":"320981","name":"东台市","province":"32","city":"09","area":"81"},{"code":"320901","name":"市辖区","province":"32","city":"09","area":"01"},{"code":"320971","name":"盐城经济技术开发区","province":"32","city":"09","area":"71"}]},{"code":"321000","name":"扬州市","province":"32","city":"10","children":[{"code":"321002","name":"广陵区","province":"32","city":"10","area":"02"},{"code":"321003","name":"邗江区","province":"32","city":"10","area":"03"},{"code":"321012","name":"江都区","province":"32","city":"10","area":"12"},{"code":"321023","name":"宝应县","province":"32","city":"10","area":"23"},{"code":"321081","name":"仪征市","province":"32","city":"10","area":"81"},{"code":"321084","name":"高邮市","province":"32","city":"10","area":"84"},{"code":"321001","name":"市辖区","province":"32","city":"10","area":"01"},{"code":"321071","name":"扬州经济技术开发区","province":"32","city":"10","area":"71"}]},{"code":"321100","name":"镇江市","province":"32","city":"11","children":[{"code":"321102","name":"京口区","province":"32","city":"11","area":"02"},{"code":"321111","name":"润州区","province":"32","city":"11","area":"11"},{"code":"321112","name":"丹徒区","province":"32","city":"11","area":"12"},{"code":"321181","name":"丹阳市","province":"32","city":"11","area":"81"},{"code":"321182","name":"扬中市","province":"32","city":"11","area":"82"},{"code":"321183","name":"句容市","province":"32","city":"11","area":"83"},{"code":"321101","name":"市辖区","province":"32","city":"11","area":"01"},{"code":"321171","name":"镇江新区","province":"32","city":"11","area":"71"}]},{"code":"321200","name":"泰州市","province":"32","city":"12","children":[{"code":"321202","name":"海陵区","province":"32","city":"12","area":"02"},{"code":"321203","name":"高港区","province":"32","city":"12","area":"03"},{"code":"321204","name":"姜堰区","province":"32","city":"12","area":"04"},{"code":"321281","name":"兴化市","province":"32","city":"12","area":"81"},{"code":"321282","name":"靖江市","province":"32","city":"12","area":"82"},{"code":"321283","name":"泰兴市","province":"32","city":"12","area":"83"},{"code":"321201","name":"市辖区","province":"32","city":"12","area":"01"},{"code":"321271","name":"泰州医药高新技术产业开发区","province":"32","city":"12","area":"71"}]},{"code":"321300","name":"宿迁市","province":"32","city":"13","children":[{"code":"321302","name":"宿城区","province":"32","city":"13","area":"02"},{"code":"321311","name":"宿豫区","province":"32","city":"13","area":"11"},{"code":"321322","name":"沭阳县","province":"32","city":"13","area":"22"},{"code":"321323","name":"泗阳县","province":"32","city":"13","area":"23"},{"code":"321324","name":"泗洪县","province":"32","city":"13","area":"24"},{"code":"321301","name":"市辖区","province":"32","city":"13","area":"01"},{"code":"321371","name":"宿迁经济技术开发区","province":"32","city":"13","area":"71"}]}]},{"code":"330000","name":"浙江省","province":"33","children":[{"code":"330100","name":"杭州市","province":"33","city":"01","children":[{"code":"330102","name":"上城区","province":"33","city":"01","area":"02"},{"code":"330103","name":"下城区","province":"33","city":"01","area":"03"},{"code":"330104","name":"江干区","province":"33","city":"01","area":"04"},{"code":"330105","name":"拱墅区","province":"33","city":"01","area":"05"},{"code":"330106","name":"西湖区","province":"33","city":"01","area":"06"},{"code":"330108","name":"滨江区","province":"33","city":"01","area":"08"},{"code":"330109","name":"萧山区","province":"33","city":"01","area":"09"},{"code":"330110","name":"余杭区","province":"33","city":"01","area":"10"},{"code":"330111","name":"富阳区","province":"33","city":"01","area":"11"},{"code":"330112","name":"临安区","province":"33","city":"01","area":"12"},{"code":"330122","name":"桐庐县","province":"33","city":"01","area":"22"},{"code":"330127","name":"淳安县","province":"33","city":"01","area":"27"},{"code":"330182","name":"建德市","province":"33","city":"01","area":"82"},{"code":"330101","name":"市辖区","province":"33","city":"01","area":"01"},{"code":"330113","name":"临平区","province":"33","city":"01","area":"13"},{"code":"330114","name":"钱塘区","province":"33","city":"01","area":"14"}]},{"code":"330200","name":"宁波市","province":"33","city":"02","children":[{"code":"330203","name":"海曙区","province":"33","city":"02","area":"03"},{"code":"330205","name":"江北区","province":"33","city":"02","area":"05"},{"code":"330206","name":"北仑区","province":"33","city":"02","area":"06"},{"code":"330211","name":"镇海区","province":"33","city":"02","area":"11"},{"code":"330212","name":"鄞州区","province":"33","city":"02","area":"12"},{"code":"330213","name":"奉化区","province":"33","city":"02","area":"13"},{"code":"330225","name":"象山县","province":"33","city":"02","area":"25"},{"code":"330226","name":"宁海县","province":"33","city":"02","area":"26"},{"code":"330281","name":"余姚市","province":"33","city":"02","area":"81"},{"code":"330282","name":"慈溪市","province":"33","city":"02","area":"82"},{"code":"330201","name":"市辖区","province":"33","city":"02","area":"01"}]},{"code":"330300","name":"温州市","province":"33","city":"03","children":[{"code":"330302","name":"鹿城区","province":"33","city":"03","area":"02"},{"code":"330303","name":"龙湾区","province":"33","city":"03","area":"03"},{"code":"330304","name":"瓯海区","province":"33","city":"03","area":"04"},{"code":"330305","name":"洞头区","province":"33","city":"03","area":"05"},{"code":"330324","name":"永嘉县","province":"33","city":"03","area":"24"},{"code":"330326","name":"平阳县","province":"33","city":"03","area":"26"},{"code":"330327","name":"苍南县","province":"33","city":"03","area":"27"},{"code":"330328","name":"文成县","province":"33","city":"03","area":"28"},{"code":"330329","name":"泰顺县","province":"33","city":"03","area":"29"},{"code":"330381","name":"瑞安市","province":"33","city":"03","area":"81"},{"code":"330382","name":"乐清市","province":"33","city":"03","area":"82"},{"code":"330383","name":"龙港市","province":"33","city":"03","area":"83"},{"code":"330301","name":"市辖区","province":"33","city":"03","area":"01"},{"code":"330371","name":"温州经济技术开发区","province":"33","city":"03","area":"71"}]},{"code":"330400","name":"嘉兴市","province":"33","city":"04","children":[{"code":"330402","name":"南湖区","province":"33","city":"04","area":"02"},{"code":"330411","name":"秀洲区","province":"33","city":"04","area":"11"},{"code":"330421","name":"嘉善县","province":"33","city":"04","area":"21"},{"code":"330424","name":"海盐县","province":"33","city":"04","area":"24"},{"code":"330481","name":"海宁市","province":"33","city":"04","area":"81"},{"code":"330482","name":"平湖市","province":"33","city":"04","area":"82"},{"code":"330483","name":"桐乡市","province":"33","city":"04","area":"83"},{"code":"330401","name":"市辖区","province":"33","city":"04","area":"01"}]},{"code":"330500","name":"湖州市","province":"33","city":"05","children":[{"code":"330502","name":"吴兴区","province":"33","city":"05","area":"02"},{"code":"330503","name":"南浔区","province":"33","city":"05","area":"03"},{"code":"330521","name":"德清县","province":"33","city":"05","area":"21"},{"code":"330522","name":"长兴县","province":"33","city":"05","area":"22"},{"code":"330523","name":"安吉县","province":"33","city":"05","area":"23"},{"code":"330501","name":"市辖区","province":"33","city":"05","area":"01"}]},{"code":"330600","name":"绍兴市","province":"33","city":"06","children":[{"code":"330602","name":"越城区","province":"33","city":"06","area":"02"},{"code":"330603","name":"柯桥区","province":"33","city":"06","area":"03"},{"code":"330604","name":"上虞区","province":"33","city":"06","area":"04"},{"code":"330624","name":"新昌县","province":"33","city":"06","area":"24"},{"code":"330681","name":"诸暨市","province":"33","city":"06","area":"81"},{"code":"330683","name":"嵊州市","province":"33","city":"06","area":"83"},{"code":"330601","name":"市辖区","province":"33","city":"06","area":"01"}]},{"code":"330700","name":"金华市","province":"33","city":"07","children":[{"code":"330702","name":"婺城区","province":"33","city":"07","area":"02"},{"code":"330703","name":"金东区","province":"33","city":"07","area":"03"},{"code":"330723","name":"武义县","province":"33","city":"07","area":"23"},{"code":"330726","name":"浦江县","province":"33","city":"07","area":"26"},{"code":"330727","name":"磐安县","province":"33","city":"07","area":"27"},{"code":"330781","name":"兰溪市","province":"33","city":"07","area":"81"},{"code":"330782","name":"义乌市","province":"33","city":"07","area":"82"},{"code":"330783","name":"东阳市","province":"33","city":"07","area":"83"},{"code":"330784","name":"永康市","province":"33","city":"07","area":"84"},{"code":"330701","name":"市辖区","province":"33","city":"07","area":"01"}]},{"code":"330800","name":"衢州市","province":"33","city":"08","children":[{"code":"330802","name":"柯城区","province":"33","city":"08","area":"02"},{"code":"330803","name":"衢江区","province":"33","city":"08","area":"03"},{"code":"330822","name":"常山县","province":"33","city":"08","area":"22"},{"code":"330824","name":"开化县","province":"33","city":"08","area":"24"},{"code":"330825","name":"龙游县","province":"33","city":"08","area":"25"},{"code":"330881","name":"江山市","province":"33","city":"08","area":"81"},{"code":"330801","name":"市辖区","province":"33","city":"08","area":"01"}]},{"code":"330900","name":"舟山市","province":"33","city":"09","children":[{"code":"330902","name":"定海区","province":"33","city":"09","area":"02"},{"code":"330903","name":"普陀区","province":"33","city":"09","area":"03"},{"code":"330921","name":"岱山县","province":"33","city":"09","area":"21"},{"code":"330922","name":"嵊泗县","province":"33","city":"09","area":"22"},{"code":"330901","name":"市辖区","province":"33","city":"09","area":"01"}]},{"code":"331000","name":"台州市","province":"33","city":"10","children":[{"code":"331002","name":"椒江区","province":"33","city":"10","area":"02"},{"code":"331003","name":"黄岩区","province":"33","city":"10","area":"03"},{"code":"331004","name":"路桥区","province":"33","city":"10","area":"04"},{"code":"331022","name":"三门县","province":"33","city":"10","area":"22"},{"code":"331023","name":"天台县","province":"33","city":"10","area":"23"},{"code":"331024","name":"仙居县","province":"33","city":"10","area":"24"},{"code":"331081","name":"温岭市","province":"33","city":"10","area":"81"},{"code":"331082","name":"临海市","province":"33","city":"10","area":"82"},{"code":"331083","name":"玉环市","province":"33","city":"10","area":"83"},{"code":"331001","name":"市辖区","province":"33","city":"10","area":"01"}]},{"code":"331100","name":"丽水市","province":"33","city":"11","children":[{"code":"331102","name":"莲都区","province":"33","city":"11","area":"02"},{"code":"331121","name":"青田县","province":"33","city":"11","area":"21"},{"code":"331122","name":"缙云县","province":"33","city":"11","area":"22"},{"code":"331123","name":"遂昌县","province":"33","city":"11","area":"23"},{"code":"331124","name":"松阳县","province":"33","city":"11","area":"24"},{"code":"331125","name":"云和县","province":"33","city":"11","area":"25"},{"code":"331126","name":"庆元县","province":"33","city":"11","area":"26"},{"code":"331127","name":"景宁畲族自治县","province":"33","city":"11","area":"27"},{"code":"331181","name":"龙泉市","province":"33","city":"11","area":"81"},{"code":"331101","name":"市辖区","province":"33","city":"11","area":"01"}]}]},{"code":"340000","name":"安徽省","province":"34","children":[{"code":"340100","name":"合肥市","province":"34","city":"01","children":[{"code":"340102","name":"瑶海区","province":"34","city":"01","area":"02"},{"code":"340103","name":"庐阳区","province":"34","city":"01","area":"03"},{"code":"340104","name":"蜀山区","province":"34","city":"01","area":"04"},{"code":"340111","name":"包河区","province":"34","city":"01","area":"11"},{"code":"340121","name":"长丰县","province":"34","city":"01","area":"21"},{"code":"340122","name":"肥东县","province":"34","city":"01","area":"22"},{"code":"340123","name":"肥西县","province":"34","city":"01","area":"23"},{"code":"340124","name":"庐江县","province":"34","city":"01","area":"24"},{"code":"340181","name":"巢湖市","province":"34","city":"01","area":"81"},{"code":"340101","name":"市辖区","province":"34","city":"01","area":"01"},{"code":"340171","name":"合肥高新技术产业开发区","province":"34","city":"01","area":"71"},{"code":"340172","name":"合肥经济技术开发区","province":"34","city":"01","area":"72"},{"code":"340173","name":"合肥新站高新技术产业开发区","province":"34","city":"01","area":"73"}]},{"code":"340200","name":"芜湖市","province":"34","city":"02","children":[{"code":"340202","name":"镜湖区","province":"34","city":"02","area":"02"},{"code":"340207","name":"鸠江区","province":"34","city":"02","area":"07"},{"code":"340209","name":"弋江区","province":"34","city":"02","area":"09"},{"code":"340210","name":"湾沚区","province":"34","city":"02","area":"10"},{"code":"340212","name":"繁昌区","province":"34","city":"02","area":"12"},{"code":"340223","name":"南陵县","province":"34","city":"02","area":"23"},{"code":"340281","name":"无为市","province":"34","city":"02","area":"81"},{"code":"340201","name":"市辖区","province":"34","city":"02","area":"01"},{"code":"340271","name":"芜湖经济技术开发区","province":"34","city":"02","area":"71"},{"code":"340272","name":"安徽芜湖三山经济开发区","province":"34","city":"02","area":"72"}]},{"code":"340300","name":"蚌埠市","province":"34","city":"03","children":[{"code":"340302","name":"龙子湖区","province":"34","city":"03","area":"02"},{"code":"340303","name":"蚌山区","province":"34","city":"03","area":"03"},{"code":"340304","name":"禹会区","province":"34","city":"03","area":"04"},{"code":"340311","name":"淮上区","province":"34","city":"03","area":"11"},{"code":"340321","name":"怀远县","province":"34","city":"03","area":"21"},{"code":"340322","name":"五河县","province":"34","city":"03","area":"22"},{"code":"340323","name":"固镇县","province":"34","city":"03","area":"23"},{"code":"340301","name":"市辖区","province":"34","city":"03","area":"01"},{"code":"340371","name":"蚌埠市高新技术开发区","province":"34","city":"03","area":"71"},{"code":"340372","name":"蚌埠市经济开发区","province":"34","city":"03","area":"72"}]},{"code":"340400","name":"淮南市","province":"34","city":"04","children":[{"code":"340402","name":"大通区","province":"34","city":"04","area":"02"},{"code":"340403","name":"田家庵区","province":"34","city":"04","area":"03"},{"code":"340404","name":"谢家集区","province":"34","city":"04","area":"04"},{"code":"340405","name":"八公山区","province":"34","city":"04","area":"05"},{"code":"340406","name":"潘集区","province":"34","city":"04","area":"06"},{"code":"340421","name":"凤台县","province":"34","city":"04","area":"21"},{"code":"340422","name":"寿县","province":"34","city":"04","area":"22"},{"code":"340401","name":"市辖区","province":"34","city":"04","area":"01"}]},{"code":"340500","name":"马鞍山市","province":"34","city":"05","children":[{"code":"340503","name":"花山区","province":"34","city":"05","area":"03"},{"code":"340504","name":"雨山区","province":"34","city":"05","area":"04"},{"code":"340506","name":"博望区","province":"34","city":"05","area":"06"},{"code":"340521","name":"当涂县","province":"34","city":"05","area":"21"},{"code":"340522","name":"含山县","province":"34","city":"05","area":"22"},{"code":"340523","name":"和县","province":"34","city":"05","area":"23"},{"code":"340501","name":"市辖区","province":"34","city":"05","area":"01"}]},{"code":"340600","name":"淮北市","province":"34","city":"06","children":[{"code":"340602","name":"杜集区","province":"34","city":"06","area":"02"},{"code":"340603","name":"相山区","province":"34","city":"06","area":"03"},{"code":"340604","name":"烈山区","province":"34","city":"06","area":"04"},{"code":"340621","name":"濉溪县","province":"34","city":"06","area":"21"},{"code":"340601","name":"市辖区","province":"34","city":"06","area":"01"}]},{"code":"340700","name":"铜陵市","province":"34","city":"07","children":[{"code":"340705","name":"铜官区","province":"34","city":"07","area":"05"},{"code":"340706","name":"义安区","province":"34","city":"07","area":"06"},{"code":"340711","name":"郊区","province":"34","city":"07","area":"11"},{"code":"340722","name":"枞阳县","province":"34","city":"07","area":"22"},{"code":"340701","name":"市辖区","province":"34","city":"07","area":"01"}]},{"code":"340800","name":"安庆市","province":"34","city":"08","children":[{"code":"340802","name":"迎江区","province":"34","city":"08","area":"02"},{"code":"340803","name":"大观区","province":"34","city":"08","area":"03"},{"code":"340811","name":"宜秀区","province":"34","city":"08","area":"11"},{"code":"340822","name":"怀宁县","province":"34","city":"08","area":"22"},{"code":"340825","name":"太湖县","province":"34","city":"08","area":"25"},{"code":"340826","name":"宿松县","province":"34","city":"08","area":"26"},{"code":"340827","name":"望江县","province":"34","city":"08","area":"27"},{"code":"340828","name":"岳西县","province":"34","city":"08","area":"28"},{"code":"340881","name":"桐城市","province":"34","city":"08","area":"81"},{"code":"340882","name":"潜山市","province":"34","city":"08","area":"82"},{"code":"340801","name":"市辖区","province":"34","city":"08","area":"01"},{"code":"340871","name":"安徽安庆经济开发区","province":"34","city":"08","area":"71"}]},{"code":"341000","name":"黄山市","province":"34","city":"10","children":[{"code":"341002","name":"屯溪区","province":"34","city":"10","area":"02"},{"code":"341003","name":"黄山区","province":"34","city":"10","area":"03"},{"code":"341004","name":"徽州区","province":"34","city":"10","area":"04"},{"code":"341021","name":"歙县","province":"34","city":"10","area":"21"},{"code":"341022","name":"休宁县","province":"34","city":"10","area":"22"},{"code":"341023","name":"黟县","province":"34","city":"10","area":"23"},{"code":"341024","name":"祁门县","province":"34","city":"10","area":"24"},{"code":"341001","name":"市辖区","province":"34","city":"10","area":"01"}]},{"code":"341100","name":"滁州市","province":"34","city":"11","children":[{"code":"341102","name":"琅琊区","province":"34","city":"11","area":"02"},{"code":"341103","name":"南谯区","province":"34","city":"11","area":"03"},{"code":"341122","name":"来安县","province":"34","city":"11","area":"22"},{"code":"341124","name":"全椒县","province":"34","city":"11","area":"24"},{"code":"341125","name":"定远县","province":"34","city":"11","area":"25"},{"code":"341126","name":"凤阳县","province":"34","city":"11","area":"26"},{"code":"341181","name":"天长市","province":"34","city":"11","area":"81"},{"code":"341182","name":"明光市","province":"34","city":"11","area":"82"},{"code":"341101","name":"市辖区","province":"34","city":"11","area":"01"},{"code":"341171","name":"中新苏滁高新技术产业开发区","province":"34","city":"11","area":"71"},{"code":"341172","name":"滁州经济技术开发区","province":"34","city":"11","area":"72"}]},{"code":"341200","name":"阜阳市","province":"34","city":"12","children":[{"code":"341202","name":"颍州区","province":"34","city":"12","area":"02"},{"code":"341203","name":"颍东区","province":"34","city":"12","area":"03"},{"code":"341204","name":"颍泉区","province":"34","city":"12","area":"04"},{"code":"341221","name":"临泉县","province":"34","city":"12","area":"21"},{"code":"341222","name":"太和县","province":"34","city":"12","area":"22"},{"code":"341225","name":"阜南县","province":"34","city":"12","area":"25"},{"code":"341226","name":"颍上县","province":"34","city":"12","area":"26"},{"code":"341282","name":"界首市","province":"34","city":"12","area":"82"},{"code":"341201","name":"市辖区","province":"34","city":"12","area":"01"},{"code":"341271","name":"阜阳合肥现代产业园区","province":"34","city":"12","area":"71"},{"code":"341272","name":"阜阳经济技术开发区","province":"34","city":"12","area":"72"}]},{"code":"341300","name":"宿州市","province":"34","city":"13","children":[{"code":"341302","name":"埇桥区","province":"34","city":"13","area":"02"},{"code":"341321","name":"砀山县","province":"34","city":"13","area":"21"},{"code":"341322","name":"萧县","province":"34","city":"13","area":"22"},{"code":"341323","name":"灵璧县","province":"34","city":"13","area":"23"},{"code":"341324","name":"泗县","province":"34","city":"13","area":"24"},{"code":"341301","name":"市辖区","province":"34","city":"13","area":"01"},{"code":"341371","name":"宿州马鞍山现代产业园区","province":"34","city":"13","area":"71"},{"code":"341372","name":"宿州经济技术开发区","province":"34","city":"13","area":"72"}]},{"code":"341500","name":"六安市","province":"34","city":"15","children":[{"code":"341502","name":"金安区","province":"34","city":"15","area":"02"},{"code":"341503","name":"裕安区","province":"34","city":"15","area":"03"},{"code":"341504","name":"叶集区","province":"34","city":"15","area":"04"},{"code":"341522","name":"霍邱县","province":"34","city":"15","area":"22"},{"code":"341523","name":"舒城县","province":"34","city":"15","area":"23"},{"code":"341524","name":"金寨县","province":"34","city":"15","area":"24"},{"code":"341525","name":"霍山县","province":"34","city":"15","area":"25"},{"code":"341501","name":"市辖区","province":"34","city":"15","area":"01"}]},{"code":"341600","name":"亳州市","province":"34","city":"16","children":[{"code":"341602","name":"谯城区","province":"34","city":"16","area":"02"},{"code":"341621","name":"涡阳县","province":"34","city":"16","area":"21"},{"code":"341622","name":"蒙城县","province":"34","city":"16","area":"22"},{"code":"341623","name":"利辛县","province":"34","city":"16","area":"23"},{"code":"341601","name":"市辖区","province":"34","city":"16","area":"01"}]},{"code":"341700","name":"池州市","province":"34","city":"17","children":[{"code":"341702","name":"贵池区","province":"34","city":"17","area":"02"},{"code":"341721","name":"东至县","province":"34","city":"17","area":"21"},{"code":"341722","name":"石台县","province":"34","city":"17","area":"22"},{"code":"341723","name":"青阳县","province":"34","city":"17","area":"23"},{"code":"341701","name":"市辖区","province":"34","city":"17","area":"01"}]},{"code":"341800","name":"宣城市","province":"34","city":"18","children":[{"code":"341802","name":"宣州区","province":"34","city":"18","area":"02"},{"code":"341821","name":"郎溪县","province":"34","city":"18","area":"21"},{"code":"341823","name":"泾县","province":"34","city":"18","area":"23"},{"code":"341824","name":"绩溪县","province":"34","city":"18","area":"24"},{"code":"341825","name":"旌德县","province":"34","city":"18","area":"25"},{"code":"341881","name":"宁国市","province":"34","city":"18","area":"81"},{"code":"341882","name":"广德市","province":"34","city":"18","area":"82"},{"code":"341801","name":"市辖区","province":"34","city":"18","area":"01"},{"code":"341871","name":"宣城市经济开发区","province":"34","city":"18","area":"71"}]}]},{"code":"350000","name":"福建省","province":"35","children":[{"code":"350100","name":"福州市","province":"35","city":"01","children":[{"code":"350102","name":"鼓楼区","province":"35","city":"01","area":"02"},{"code":"350103","name":"台江区","province":"35","city":"01","area":"03"},{"code":"350104","name":"仓山区","province":"35","city":"01","area":"04"},{"code":"350105","name":"马尾区","province":"35","city":"01","area":"05"},{"code":"350111","name":"晋安区","province":"35","city":"01","area":"11"},{"code":"350112","name":"长乐区","province":"35","city":"01","area":"12"},{"code":"350121","name":"闽侯县","province":"35","city":"01","area":"21"},{"code":"350122","name":"连江县","province":"35","city":"01","area":"22"},{"code":"350123","name":"罗源县","province":"35","city":"01","area":"23"},{"code":"350124","name":"闽清县","province":"35","city":"01","area":"24"},{"code":"350125","name":"永泰县","province":"35","city":"01","area":"25"},{"code":"350128","name":"平潭县","province":"35","city":"01","area":"28"},{"code":"350181","name":"福清市","province":"35","city":"01","area":"81"},{"code":"350101","name":"市辖区","province":"35","city":"01","area":"01"}]},{"code":"350200","name":"厦门市","province":"35","city":"02","children":[{"code":"350203","name":"思明区","province":"35","city":"02","area":"03"},{"code":"350205","name":"海沧区","province":"35","city":"02","area":"05"},{"code":"350206","name":"湖里区","province":"35","city":"02","area":"06"},{"code":"350211","name":"集美区","province":"35","city":"02","area":"11"},{"code":"350212","name":"同安区","province":"35","city":"02","area":"12"},{"code":"350213","name":"翔安区","province":"35","city":"02","area":"13"},{"code":"350201","name":"市辖区","province":"35","city":"02","area":"01"}]},{"code":"350300","name":"莆田市","province":"35","city":"03","children":[{"code":"350302","name":"城厢区","province":"35","city":"03","area":"02"},{"code":"350303","name":"涵江区","province":"35","city":"03","area":"03"},{"code":"350304","name":"荔城区","province":"35","city":"03","area":"04"},{"code":"350305","name":"秀屿区","province":"35","city":"03","area":"05"},{"code":"350322","name":"仙游县","province":"35","city":"03","area":"22"},{"code":"350301","name":"市辖区","province":"35","city":"03","area":"01"}]},{"code":"350400","name":"三明市","province":"35","city":"04","children":[{"code":"350402","name":"梅列区","province":"35","city":"04","area":"02"},{"code":"350403","name":"三元区","province":"35","city":"04","area":"03"},{"code":"350421","name":"明溪县","province":"35","city":"04","area":"21"},{"code":"350423","name":"清流县","province":"35","city":"04","area":"23"},{"code":"350424","name":"宁化县","province":"35","city":"04","area":"24"},{"code":"350425","name":"大田县","province":"35","city":"04","area":"25"},{"code":"350426","name":"尤溪县","province":"35","city":"04","area":"26"},{"code":"350427","name":"沙县","province":"35","city":"04","area":"27"},{"code":"350428","name":"将乐县","province":"35","city":"04","area":"28"},{"code":"350429","name":"泰宁县","province":"35","city":"04","area":"29"},{"code":"350430","name":"建宁县","province":"35","city":"04","area":"30"},{"code":"350481","name":"永安市","province":"35","city":"04","area":"81"},{"code":"350401","name":"市辖区","province":"35","city":"04","area":"01"},{"code":"350404","name":"三元区","province":"35","city":"04","area":"04"},{"code":"350405","name":"沙县区","province":"35","city":"04","area":"05"}]},{"code":"350500","name":"泉州市","province":"35","city":"05","children":[{"code":"350502","name":"鲤城区","province":"35","city":"05","area":"02"},{"code":"350503","name":"丰泽区","province":"35","city":"05","area":"03"},{"code":"350504","name":"洛江区","province":"35","city":"05","area":"04"},{"code":"350505","name":"泉港区","province":"35","city":"05","area":"05"},{"code":"350521","name":"惠安县","province":"35","city":"05","area":"21"},{"code":"350524","name":"安溪县","province":"35","city":"05","area":"24"},{"code":"350525","name":"永春县","province":"35","city":"05","area":"25"},{"code":"350526","name":"德化县","province":"35","city":"05","area":"26"},{"code":"350527","name":"金门县","province":"35","city":"05","area":"27"},{"code":"350581","name":"石狮市","province":"35","city":"05","area":"81"},{"code":"350582","name":"晋江市","province":"35","city":"05","area":"82"},{"code":"350583","name":"南安市","province":"35","city":"05","area":"83"},{"code":"350501","name":"市辖区","province":"35","city":"05","area":"01"}]},{"code":"350600","name":"漳州市","province":"35","city":"06","children":[{"code":"350602","name":"芗城区","province":"35","city":"06","area":"02"},{"code":"350603","name":"龙文区","province":"35","city":"06","area":"03"},{"code":"350622","name":"云霄县","province":"35","city":"06","area":"22"},{"code":"350623","name":"漳浦县","province":"35","city":"06","area":"23"},{"code":"350624","name":"诏安县","province":"35","city":"06","area":"24"},{"code":"350625","name":"长泰县","province":"35","city":"06","area":"25"},{"code":"350626","name":"东山县","province":"35","city":"06","area":"26"},{"code":"350627","name":"南靖县","province":"35","city":"06","area":"27"},{"code":"350628","name":"平和县","province":"35","city":"06","area":"28"},{"code":"350629","name":"华安县","province":"35","city":"06","area":"29"},{"code":"350681","name":"龙海市","province":"35","city":"06","area":"81"},{"code":"350601","name":"市辖区","province":"35","city":"06","area":"01"},{"code":"350604","name":"龙海区","province":"35","city":"06","area":"04"},{"code":"350605","name":"长泰区","province":"35","city":"06","area":"05"}]},{"code":"350700","name":"南平市","province":"35","city":"07","children":[{"code":"350702","name":"延平区","province":"35","city":"07","area":"02"},{"code":"350703","name":"建阳区","province":"35","city":"07","area":"03"},{"code":"350721","name":"顺昌县","province":"35","city":"07","area":"21"},{"code":"350722","name":"浦城县","province":"35","city":"07","area":"22"},{"code":"350723","name":"光泽县","province":"35","city":"07","area":"23"},{"code":"350724","name":"松溪县","province":"35","city":"07","area":"24"},{"code":"350725","name":"政和县","province":"35","city":"07","area":"25"},{"code":"350781","name":"邵武市","province":"35","city":"07","area":"81"},{"code":"350782","name":"武夷山市","province":"35","city":"07","area":"82"},{"code":"350783","name":"建瓯市","province":"35","city":"07","area":"83"},{"code":"350701","name":"市辖区","province":"35","city":"07","area":"01"}]},{"code":"350800","name":"龙岩市","province":"35","city":"08","children":[{"code":"350802","name":"新罗区","province":"35","city":"08","area":"02"},{"code":"350803","name":"永定区","province":"35","city":"08","area":"03"},{"code":"350821","name":"长汀县","province":"35","city":"08","area":"21"},{"code":"350823","name":"上杭县","province":"35","city":"08","area":"23"},{"code":"350824","name":"武平县","province":"35","city":"08","area":"24"},{"code":"350825","name":"连城县","province":"35","city":"08","area":"25"},{"code":"350881","name":"漳平市","province":"35","city":"08","area":"81"},{"code":"350801","name":"市辖区","province":"35","city":"08","area":"01"}]},{"code":"350900","name":"宁德市","province":"35","city":"09","children":[{"code":"350902","name":"蕉城区","province":"35","city":"09","area":"02"},{"code":"350921","name":"霞浦县","province":"35","city":"09","area":"21"},{"code":"350922","name":"古田县","province":"35","city":"09","area":"22"},{"code":"350923","name":"屏南县","province":"35","city":"09","area":"23"},{"code":"350924","name":"寿宁县","province":"35","city":"09","area":"24"},{"code":"350925","name":"周宁县","province":"35","city":"09","area":"25"},{"code":"350926","name":"柘荣县","province":"35","city":"09","area":"26"},{"code":"350981","name":"福安市","province":"35","city":"09","area":"81"},{"code":"350982","name":"福鼎市","province":"35","city":"09","area":"82"},{"code":"350901","name":"市辖区","province":"35","city":"09","area":"01"}]}]},{"code":"360000","name":"江西省","province":"36","children":[{"code":"360100","name":"南昌市","province":"36","city":"01","children":[{"code":"360102","name":"东湖区","province":"36","city":"01","area":"02"},{"code":"360103","name":"西湖区","province":"36","city":"01","area":"03"},{"code":"360104","name":"青云谱区","province":"36","city":"01","area":"04"},{"code":"360111","name":"青山湖区","province":"36","city":"01","area":"11"},{"code":"360112","name":"新建区","province":"36","city":"01","area":"12"},{"code":"360113","name":"红谷滩区","province":"36","city":"01","area":"13"},{"code":"360121","name":"南昌县","province":"36","city":"01","area":"21"},{"code":"360123","name":"安义县","province":"36","city":"01","area":"23"},{"code":"360124","name":"进贤县","province":"36","city":"01","area":"24"},{"code":"360101","name":"市辖区","province":"36","city":"01","area":"01"}]},{"code":"360200","name":"景德镇市","province":"36","city":"02","children":[{"code":"360202","name":"昌江区","province":"36","city":"02","area":"02"},{"code":"360203","name":"珠山区","province":"36","city":"02","area":"03"},{"code":"360222","name":"浮梁县","province":"36","city":"02","area":"22"},{"code":"360281","name":"乐平市","province":"36","city":"02","area":"81"},{"code":"360201","name":"市辖区","province":"36","city":"02","area":"01"}]},{"code":"360300","name":"萍乡市","province":"36","city":"03","children":[{"code":"360302","name":"安源区","province":"36","city":"03","area":"02"},{"code":"360313","name":"湘东区","province":"36","city":"03","area":"13"},{"code":"360321","name":"莲花县","province":"36","city":"03","area":"21"},{"code":"360322","name":"上栗县","province":"36","city":"03","area":"22"},{"code":"360323","name":"芦溪县","province":"36","city":"03","area":"23"},{"code":"360301","name":"市辖区","province":"36","city":"03","area":"01"}]},{"code":"360400","name":"九江市","province":"36","city":"04","children":[{"code":"360402","name":"濂溪区","province":"36","city":"04","area":"02"},{"code":"360403","name":"浔阳区","province":"36","city":"04","area":"03"},{"code":"360404","name":"柴桑区","province":"36","city":"04","area":"04"},{"code":"360423","name":"武宁县","province":"36","city":"04","area":"23"},{"code":"360424","name":"修水县","province":"36","city":"04","area":"24"},{"code":"360425","name":"永修县","province":"36","city":"04","area":"25"},{"code":"360426","name":"德安县","province":"36","city":"04","area":"26"},{"code":"360428","name":"都昌县","province":"36","city":"04","area":"28"},{"code":"360429","name":"湖口县","province":"36","city":"04","area":"29"},{"code":"360430","name":"彭泽县","province":"36","city":"04","area":"30"},{"code":"360481","name":"瑞昌市","province":"36","city":"04","area":"81"},{"code":"360482","name":"共青城市","province":"36","city":"04","area":"82"},{"code":"360483","name":"庐山市","province":"36","city":"04","area":"83"},{"code":"360401","name":"市辖区","province":"36","city":"04","area":"01"}]},{"code":"360500","name":"新余市","province":"36","city":"05","children":[{"code":"360502","name":"渝水区","province":"36","city":"05","area":"02"},{"code":"360521","name":"分宜县","province":"36","city":"05","area":"21"},{"code":"360501","name":"市辖区","province":"36","city":"05","area":"01"}]},{"code":"360600","name":"鹰潭市","province":"36","city":"06","children":[{"code":"360602","name":"月湖区","province":"36","city":"06","area":"02"},{"code":"360603","name":"余江区","province":"36","city":"06","area":"03"},{"code":"360681","name":"贵溪市","province":"36","city":"06","area":"81"},{"code":"360601","name":"市辖区","province":"36","city":"06","area":"01"}]},{"code":"360700","name":"赣州市","province":"36","city":"07","children":[{"code":"360702","name":"章贡区","province":"36","city":"07","area":"02"},{"code":"360703","name":"南康区","province":"36","city":"07","area":"03"},{"code":"360704","name":"赣县区","province":"36","city":"07","area":"04"},{"code":"360722","name":"信丰县","province":"36","city":"07","area":"22"},{"code":"360723","name":"大余县","province":"36","city":"07","area":"23"},{"code":"360724","name":"上犹县","province":"36","city":"07","area":"24"},{"code":"360725","name":"崇义县","province":"36","city":"07","area":"25"},{"code":"360726","name":"安远县","province":"36","city":"07","area":"26"},{"code":"360728","name":"定南县","province":"36","city":"07","area":"28"},{"code":"360729","name":"全南县","province":"36","city":"07","area":"29"},{"code":"360730","name":"宁都县","province":"36","city":"07","area":"30"},{"code":"360731","name":"于都县","province":"36","city":"07","area":"31"},{"code":"360732","name":"兴国县","province":"36","city":"07","area":"32"},{"code":"360733","name":"会昌县","province":"36","city":"07","area":"33"},{"code":"360734","name":"寻乌县","province":"36","city":"07","area":"34"},{"code":"360735","name":"石城县","province":"36","city":"07","area":"35"},{"code":"360781","name":"瑞金市","province":"36","city":"07","area":"81"},{"code":"360783","name":"龙南市","province":"36","city":"07","area":"83"},{"code":"360701","name":"市辖区","province":"36","city":"07","area":"01"}]},{"code":"360800","name":"吉安市","province":"36","city":"08","children":[{"code":"360802","name":"吉州区","province":"36","city":"08","area":"02"},{"code":"360803","name":"青原区","province":"36","city":"08","area":"03"},{"code":"360821","name":"吉安县","province":"36","city":"08","area":"21"},{"code":"360822","name":"吉水县","province":"36","city":"08","area":"22"},{"code":"360823","name":"峡江县","province":"36","city":"08","area":"23"},{"code":"360824","name":"新干县","province":"36","city":"08","area":"24"},{"code":"360825","name":"永丰县","province":"36","city":"08","area":"25"},{"code":"360826","name":"泰和县","province":"36","city":"08","area":"26"},{"code":"360827","name":"遂川县","province":"36","city":"08","area":"27"},{"code":"360828","name":"万安县","province":"36","city":"08","area":"28"},{"code":"360829","name":"安福县","province":"36","city":"08","area":"29"},{"code":"360830","name":"永新县","province":"36","city":"08","area":"30"},{"code":"360881","name":"井冈山市","province":"36","city":"08","area":"81"},{"code":"360801","name":"市辖区","province":"36","city":"08","area":"01"}]},{"code":"360900","name":"宜春市","province":"36","city":"09","children":[{"code":"360902","name":"袁州区","province":"36","city":"09","area":"02"},{"code":"360921","name":"奉新县","province":"36","city":"09","area":"21"},{"code":"360922","name":"万载县","province":"36","city":"09","area":"22"},{"code":"360923","name":"上高县","province":"36","city":"09","area":"23"},{"code":"360924","name":"宜丰县","province":"36","city":"09","area":"24"},{"code":"360925","name":"靖安县","province":"36","city":"09","area":"25"},{"code":"360926","name":"铜鼓县","province":"36","city":"09","area":"26"},{"code":"360981","name":"丰城市","province":"36","city":"09","area":"81"},{"code":"360982","name":"樟树市","province":"36","city":"09","area":"82"},{"code":"360983","name":"高安市","province":"36","city":"09","area":"83"},{"code":"360901","name":"市辖区","province":"36","city":"09","area":"01"}]},{"code":"361000","name":"抚州市","province":"36","city":"10","children":[{"code":"361002","name":"临川区","province":"36","city":"10","area":"02"},{"code":"361003","name":"东乡区","province":"36","city":"10","area":"03"},{"code":"361021","name":"南城县","province":"36","city":"10","area":"21"},{"code":"361022","name":"黎川县","province":"36","city":"10","area":"22"},{"code":"361023","name":"南丰县","province":"36","city":"10","area":"23"},{"code":"361024","name":"崇仁县","province":"36","city":"10","area":"24"},{"code":"361025","name":"乐安县","province":"36","city":"10","area":"25"},{"code":"361026","name":"宜黄县","province":"36","city":"10","area":"26"},{"code":"361027","name":"金溪县","province":"36","city":"10","area":"27"},{"code":"361028","name":"资溪县","province":"36","city":"10","area":"28"},{"code":"361030","name":"广昌县","province":"36","city":"10","area":"30"},{"code":"361001","name":"市辖区","province":"36","city":"10","area":"01"}]},{"code":"361100","name":"上饶市","province":"36","city":"11","children":[{"code":"361102","name":"信州区","province":"36","city":"11","area":"02"},{"code":"361103","name":"广丰区","province":"36","city":"11","area":"03"},{"code":"361104","name":"广信区","province":"36","city":"11","area":"04"},{"code":"361123","name":"玉山县","province":"36","city":"11","area":"23"},{"code":"361124","name":"铅山县","province":"36","city":"11","area":"24"},{"code":"361125","name":"横峰县","province":"36","city":"11","area":"25"},{"code":"361126","name":"弋阳县","province":"36","city":"11","area":"26"},{"code":"361127","name":"余干县","province":"36","city":"11","area":"27"},{"code":"361128","name":"鄱阳县","province":"36","city":"11","area":"28"},{"code":"361129","name":"万年县","province":"36","city":"11","area":"29"},{"code":"361130","name":"婺源县","province":"36","city":"11","area":"30"},{"code":"361181","name":"德兴市","province":"36","city":"11","area":"81"},{"code":"361101","name":"市辖区","province":"36","city":"11","area":"01"}]}]},{"code":"370000","name":"山东省","province":"37","children":[{"code":"370100","name":"济南市","province":"37","city":"01","children":[{"code":"370102","name":"历下区","province":"37","city":"01","area":"02"},{"code":"370103","name":"市中区","province":"37","city":"01","area":"03"},{"code":"370104","name":"槐荫区","province":"37","city":"01","area":"04"},{"code":"370105","name":"天桥区","province":"37","city":"01","area":"05"},{"code":"370112","name":"历城区","province":"37","city":"01","area":"12"},{"code":"370113","name":"长清区","province":"37","city":"01","area":"13"},{"code":"370114","name":"章丘区","province":"37","city":"01","area":"14"},{"code":"370115","name":"济阳区","province":"37","city":"01","area":"15"},{"code":"370116","name":"莱芜区","province":"37","city":"01","area":"16"},{"code":"370117","name":"钢城区","province":"37","city":"01","area":"17"},{"code":"370124","name":"平阴县","province":"37","city":"01","area":"24"},{"code":"370126","name":"商河县","province":"37","city":"01","area":"26"},{"code":"370101","name":"市辖区","province":"37","city":"01","area":"01"},{"code":"370171","name":"济南高新技术产业开发区","province":"37","city":"01","area":"71"}]},{"code":"370200","name":"青岛市","province":"37","city":"02","children":[{"code":"370202","name":"市南区","province":"37","city":"02","area":"02"},{"code":"370203","name":"市北区","province":"37","city":"02","area":"03"},{"code":"370211","name":"黄岛区","province":"37","city":"02","area":"11"},{"code":"370212","name":"崂山区","province":"37","city":"02","area":"12"},{"code":"370213","name":"李沧区","province":"37","city":"02","area":"13"},{"code":"370214","name":"城阳区","province":"37","city":"02","area":"14"},{"code":"370215","name":"即墨区","province":"37","city":"02","area":"15"},{"code":"370281","name":"胶州市","province":"37","city":"02","area":"81"},{"code":"370283","name":"平度市","province":"37","city":"02","area":"83"},{"code":"370285","name":"莱西市","province":"37","city":"02","area":"85"},{"code":"370201","name":"市辖区","province":"37","city":"02","area":"01"},{"code":"370271","name":"青岛高新技术产业开发区","province":"37","city":"02","area":"71"}]},{"code":"370300","name":"淄博市","province":"37","city":"03","children":[{"code":"370302","name":"淄川区","province":"37","city":"03","area":"02"},{"code":"370303","name":"张店区","province":"37","city":"03","area":"03"},{"code":"370304","name":"博山区","province":"37","city":"03","area":"04"},{"code":"370305","name":"临淄区","province":"37","city":"03","area":"05"},{"code":"370306","name":"周村区","province":"37","city":"03","area":"06"},{"code":"370321","name":"桓台县","province":"37","city":"03","area":"21"},{"code":"370322","name":"高青县","province":"37","city":"03","area":"22"},{"code":"370323","name":"沂源县","province":"37","city":"03","area":"23"},{"code":"370301","name":"市辖区","province":"37","city":"03","area":"01"}]},{"code":"370400","name":"枣庄市","province":"37","city":"04","children":[{"code":"370402","name":"市中区","province":"37","city":"04","area":"02"},{"code":"370403","name":"薛城区","province":"37","city":"04","area":"03"},{"code":"370404","name":"峄城区","province":"37","city":"04","area":"04"},{"code":"370405","name":"台儿庄区","province":"37","city":"04","area":"05"},{"code":"370406","name":"山亭区","province":"37","city":"04","area":"06"},{"code":"370481","name":"滕州市","province":"37","city":"04","area":"81"},{"code":"370401","name":"市辖区","province":"37","city":"04","area":"01"}]},{"code":"370500","name":"东营市","province":"37","city":"05","children":[{"code":"370502","name":"东营区","province":"37","city":"05","area":"02"},{"code":"370503","name":"河口区","province":"37","city":"05","area":"03"},{"code":"370505","name":"垦利区","province":"37","city":"05","area":"05"},{"code":"370522","name":"利津县","province":"37","city":"05","area":"22"},{"code":"370523","name":"广饶县","province":"37","city":"05","area":"23"},{"code":"370501","name":"市辖区","province":"37","city":"05","area":"01"},{"code":"370571","name":"东营经济技术开发区","province":"37","city":"05","area":"71"},{"code":"370572","name":"东营港经济开发区","province":"37","city":"05","area":"72"}]},{"code":"370600","name":"烟台市","province":"37","city":"06","children":[{"code":"370602","name":"芝罘区","province":"37","city":"06","area":"02"},{"code":"370611","name":"福山区","province":"37","city":"06","area":"11"},{"code":"370612","name":"牟平区","province":"37","city":"06","area":"12"},{"code":"370613","name":"莱山区","province":"37","city":"06","area":"13"},{"code":"370614","name":"蓬莱区","province":"37","city":"06","area":"14"},{"code":"370681","name":"龙口市","province":"37","city":"06","area":"81"},{"code":"370682","name":"莱阳市","province":"37","city":"06","area":"82"},{"code":"370683","name":"莱州市","province":"37","city":"06","area":"83"},{"code":"370685","name":"招远市","province":"37","city":"06","area":"85"},{"code":"370686","name":"栖霞市","province":"37","city":"06","area":"86"},{"code":"370687","name":"海阳市","province":"37","city":"06","area":"87"},{"code":"370601","name":"市辖区","province":"37","city":"06","area":"01"},{"code":"370671","name":"烟台高新技术产业开发区","province":"37","city":"06","area":"71"},{"code":"370672","name":"烟台经济技术开发区","province":"37","city":"06","area":"72"}]},{"code":"370700","name":"潍坊市","province":"37","city":"07","children":[{"code":"370702","name":"潍城区","province":"37","city":"07","area":"02"},{"code":"370703","name":"寒亭区","province":"37","city":"07","area":"03"},{"code":"370704","name":"坊子区","province":"37","city":"07","area":"04"},{"code":"370705","name":"奎文区","province":"37","city":"07","area":"05"},{"code":"370724","name":"临朐县","province":"37","city":"07","area":"24"},{"code":"370725","name":"昌乐县","province":"37","city":"07","area":"25"},{"code":"370781","name":"青州市","province":"37","city":"07","area":"81"},{"code":"370782","name":"诸城市","province":"37","city":"07","area":"82"},{"code":"370783","name":"寿光市","province":"37","city":"07","area":"83"},{"code":"370784","name":"安丘市","province":"37","city":"07","area":"84"},{"code":"370785","name":"高密市","province":"37","city":"07","area":"85"},{"code":"370786","name":"昌邑市","province":"37","city":"07","area":"86"},{"code":"370701","name":"市辖区","province":"37","city":"07","area":"01"},{"code":"370772","name":"潍坊滨海经济技术开发区","province":"37","city":"07","area":"72"}]},{"code":"370800","name":"济宁市","province":"37","city":"08","children":[{"code":"370811","name":"任城区","province":"37","city":"08","area":"11"},{"code":"370812","name":"兖州区","province":"37","city":"08","area":"12"},{"code":"370826","name":"微山县","province":"37","city":"08","area":"26"},{"code":"370827","name":"鱼台县","province":"37","city":"08","area":"27"},{"code":"370828","name":"金乡县","province":"37","city":"08","area":"28"},{"code":"370829","name":"嘉祥县","province":"37","city":"08","area":"29"},{"code":"370830","name":"汶上县","province":"37","city":"08","area":"30"},{"code":"370831","name":"泗水县","province":"37","city":"08","area":"31"},{"code":"370832","name":"梁山县","province":"37","city":"08","area":"32"},{"code":"370881","name":"曲阜市","province":"37","city":"08","area":"81"},{"code":"370883","name":"邹城市","province":"37","city":"08","area":"83"},{"code":"370801","name":"市辖区","province":"37","city":"08","area":"01"},{"code":"370871","name":"济宁高新技术产业开发区","province":"37","city":"08","area":"71"}]},{"code":"370900","name":"泰安市","province":"37","city":"09","children":[{"code":"370902","name":"泰山区","province":"37","city":"09","area":"02"},{"code":"370911","name":"岱岳区","province":"37","city":"09","area":"11"},{"code":"370921","name":"宁阳县","province":"37","city":"09","area":"21"},{"code":"370923","name":"东平县","province":"37","city":"09","area":"23"},{"code":"370982","name":"新泰市","province":"37","city":"09","area":"82"},{"code":"370983","name":"肥城市","province":"37","city":"09","area":"83"},{"code":"370901","name":"市辖区","province":"37","city":"09","area":"01"}]},{"code":"371000","name":"威海市","province":"37","city":"10","children":[{"code":"371002","name":"环翠区","province":"37","city":"10","area":"02"},{"code":"371003","name":"文登区","province":"37","city":"10","area":"03"},{"code":"371082","name":"荣成市","province":"37","city":"10","area":"82"},{"code":"371083","name":"乳山市","province":"37","city":"10","area":"83"},{"code":"371001","name":"市辖区","province":"37","city":"10","area":"01"},{"code":"371071","name":"威海火炬高技术产业开发区","province":"37","city":"10","area":"71"},{"code":"371072","name":"威海经济技术开发区","province":"37","city":"10","area":"72"},{"code":"371073","name":"威海临港经济技术开发区","province":"37","city":"10","area":"73"}]},{"code":"371100","name":"日照市","province":"37","city":"11","children":[{"code":"371102","name":"东港区","province":"37","city":"11","area":"02"},{"code":"371103","name":"岚山区","province":"37","city":"11","area":"03"},{"code":"371121","name":"五莲县","province":"37","city":"11","area":"21"},{"code":"371122","name":"莒县","province":"37","city":"11","area":"22"},{"code":"371101","name":"市辖区","province":"37","city":"11","area":"01"},{"code":"371171","name":"日照经济技术开发区","province":"37","city":"11","area":"71"}]},{"code":"371300","name":"临沂市","province":"37","city":"13","children":[{"code":"371302","name":"兰山区","province":"37","city":"13","area":"02"},{"code":"371311","name":"罗庄区","province":"37","city":"13","area":"11"},{"code":"371312","name":"河东区","province":"37","city":"13","area":"12"},{"code":"371321","name":"沂南县","province":"37","city":"13","area":"21"},{"code":"371322","name":"郯城县","province":"37","city":"13","area":"22"},{"code":"371323","name":"沂水县","province":"37","city":"13","area":"23"},{"code":"371324","name":"兰陵县","province":"37","city":"13","area":"24"},{"code":"371325","name":"费县","province":"37","city":"13","area":"25"},{"code":"371326","name":"平邑县","province":"37","city":"13","area":"26"},{"code":"371327","name":"莒南县","province":"37","city":"13","area":"27"},{"code":"371328","name":"蒙阴县","province":"37","city":"13","area":"28"},{"code":"371329","name":"临沭县","province":"37","city":"13","area":"29"},{"code":"371301","name":"市辖区","province":"37","city":"13","area":"01"},{"code":"371371","name":"临沂高新技术产业开发区","province":"37","city":"13","area":"71"}]},{"code":"371400","name":"德州市","province":"37","city":"14","children":[{"code":"371402","name":"德城区","province":"37","city":"14","area":"02"},{"code":"371403","name":"陵城区","province":"37","city":"14","area":"03"},{"code":"371422","name":"宁津县","province":"37","city":"14","area":"22"},{"code":"371423","name":"庆云县","province":"37","city":"14","area":"23"},{"code":"371424","name":"临邑县","province":"37","city":"14","area":"24"},{"code":"371425","name":"齐河县","province":"37","city":"14","area":"25"},{"code":"371426","name":"平原县","province":"37","city":"14","area":"26"},{"code":"371427","name":"夏津县","province":"37","city":"14","area":"27"},{"code":"371428","name":"武城县","province":"37","city":"14","area":"28"},{"code":"371481","name":"乐陵市","province":"37","city":"14","area":"81"},{"code":"371482","name":"禹城市","province":"37","city":"14","area":"82"},{"code":"371401","name":"市辖区","province":"37","city":"14","area":"01"},{"code":"371471","name":"德州经济技术开发区","province":"37","city":"14","area":"71"},{"code":"371472","name":"德州运河经济开发区","province":"37","city":"14","area":"72"}]},{"code":"371500","name":"聊城市","province":"37","city":"15","children":[{"code":"371502","name":"东昌府区","province":"37","city":"15","area":"02"},{"code":"371503","name":"茌平区","province":"37","city":"15","area":"03"},{"code":"371521","name":"阳谷县","province":"37","city":"15","area":"21"},{"code":"371522","name":"莘县","province":"37","city":"15","area":"22"},{"code":"371524","name":"东阿县","province":"37","city":"15","area":"24"},{"code":"371525","name":"冠县","province":"37","city":"15","area":"25"},{"code":"371526","name":"高唐县","province":"37","city":"15","area":"26"},{"code":"371581","name":"临清市","province":"37","city":"15","area":"81"},{"code":"371501","name":"市辖区","province":"37","city":"15","area":"01"}]},{"code":"371600","name":"滨州市","province":"37","city":"16","children":[{"code":"371602","name":"滨城区","province":"37","city":"16","area":"02"},{"code":"371603","name":"沾化区","province":"37","city":"16","area":"03"},{"code":"371621","name":"惠民县","province":"37","city":"16","area":"21"},{"code":"371622","name":"阳信县","province":"37","city":"16","area":"22"},{"code":"371623","name":"无棣县","province":"37","city":"16","area":"23"},{"code":"371625","name":"博兴县","province":"37","city":"16","area":"25"},{"code":"371681","name":"邹平市","province":"37","city":"16","area":"81"},{"code":"371601","name":"市辖区","province":"37","city":"16","area":"01"}]},{"code":"371700","name":"菏泽市","province":"37","city":"17","children":[{"code":"371702","name":"牡丹区","province":"37","city":"17","area":"02"},{"code":"371703","name":"定陶区","province":"37","city":"17","area":"03"},{"code":"371721","name":"曹县","province":"37","city":"17","area":"21"},{"code":"371722","name":"单县","province":"37","city":"17","area":"22"},{"code":"371723","name":"成武县","province":"37","city":"17","area":"23"},{"code":"371724","name":"巨野县","province":"37","city":"17","area":"24"},{"code":"371725","name":"郓城县","province":"37","city":"17","area":"25"},{"code":"371726","name":"鄄城县","province":"37","city":"17","area":"26"},{"code":"371728","name":"东明县","province":"37","city":"17","area":"28"},{"code":"371701","name":"市辖区","province":"37","city":"17","area":"01"},{"code":"371771","name":"菏泽经济技术开发区","province":"37","city":"17","area":"71"},{"code":"371772","name":"菏泽高新技术开发区","province":"37","city":"17","area":"72"}]}]},{"code":"410000","name":"河南省","province":"41","children":[{"code":"410100","name":"郑州市","province":"41","city":"01","children":[{"code":"410102","name":"中原区","province":"41","city":"01","area":"02"},{"code":"410103","name":"二七区","province":"41","city":"01","area":"03"},{"code":"410104","name":"管城回族区","province":"41","city":"01","area":"04"},{"code":"410105","name":"金水区","province":"41","city":"01","area":"05"},{"code":"410106","name":"上街区","province":"41","city":"01","area":"06"},{"code":"410108","name":"惠济区","province":"41","city":"01","area":"08"},{"code":"410122","name":"中牟县","province":"41","city":"01","area":"22"},{"code":"410181","name":"巩义市","province":"41","city":"01","area":"81"},{"code":"410182","name":"荥阳市","province":"41","city":"01","area":"82"},{"code":"410183","name":"新密市","province":"41","city":"01","area":"83"},{"code":"410184","name":"新郑市","province":"41","city":"01","area":"84"},{"code":"410185","name":"登封市","province":"41","city":"01","area":"85"},{"code":"410101","name":"市辖区","province":"41","city":"01","area":"01"},{"code":"410171","name":"郑州经济技术开发区","province":"41","city":"01","area":"71"},{"code":"410172","name":"郑州高新技术产业开发区","province":"41","city":"01","area":"72"},{"code":"410173","name":"郑州航空港经济综合实验区","province":"41","city":"01","area":"73"}]},{"code":"410200","name":"开封市","province":"41","city":"02","children":[{"code":"410202","name":"龙亭区","province":"41","city":"02","area":"02"},{"code":"410203","name":"顺河回族区","province":"41","city":"02","area":"03"},{"code":"410204","name":"鼓楼区","province":"41","city":"02","area":"04"},{"code":"410205","name":"禹王台区","province":"41","city":"02","area":"05"},{"code":"410212","name":"祥符区","province":"41","city":"02","area":"12"},{"code":"410221","name":"杞县","province":"41","city":"02","area":"21"},{"code":"410222","name":"通许县","province":"41","city":"02","area":"22"},{"code":"410223","name":"尉氏县","province":"41","city":"02","area":"23"},{"code":"410225","name":"兰考县","province":"41","city":"02","area":"25"},{"code":"410201","name":"市辖区","province":"41","city":"02","area":"01"}]},{"code":"410300","name":"洛阳市","province":"41","city":"03","children":[{"code":"410302","name":"老城区","province":"41","city":"03","area":"02"},{"code":"410303","name":"西工区","province":"41","city":"03","area":"03"},{"code":"410304","name":"瀍河回族区","province":"41","city":"03","area":"04"},{"code":"410305","name":"涧西区","province":"41","city":"03","area":"05"},{"code":"410306","name":"吉利区","province":"41","city":"03","area":"06"},{"code":"410311","name":"洛龙区","province":"41","city":"03","area":"11"},{"code":"410322","name":"孟津县","province":"41","city":"03","area":"22"},{"code":"410323","name":"新安县","province":"41","city":"03","area":"23"},{"code":"410324","name":"栾川县","province":"41","city":"03","area":"24"},{"code":"410325","name":"嵩县","province":"41","city":"03","area":"25"},{"code":"410326","name":"汝阳县","province":"41","city":"03","area":"26"},{"code":"410327","name":"宜阳县","province":"41","city":"03","area":"27"},{"code":"410328","name":"洛宁县","province":"41","city":"03","area":"28"},{"code":"410329","name":"伊川县","province":"41","city":"03","area":"29"},{"code":"410381","name":"偃师市","province":"41","city":"03","area":"81"},{"code":"410301","name":"市辖区","province":"41","city":"03","area":"01"},{"code":"410307","name":"偃师区","province":"41","city":"03","area":"07"},{"code":"410308","name":"孟津区","province":"41","city":"03","area":"08"},{"code":"410371","name":"洛阳高新技术产业开发区","province":"41","city":"03","area":"71"}]},{"code":"410400","name":"平顶山市","province":"41","city":"04","children":[{"code":"410402","name":"新华区","province":"41","city":"04","area":"02"},{"code":"410403","name":"卫东区","province":"41","city":"04","area":"03"},{"code":"410404","name":"石龙区","province":"41","city":"04","area":"04"},{"code":"410411","name":"湛河区","province":"41","city":"04","area":"11"},{"code":"410421","name":"宝丰县","province":"41","city":"04","area":"21"},{"code":"410422","name":"叶县","province":"41","city":"04","area":"22"},{"code":"410423","name":"鲁山县","province":"41","city":"04","area":"23"},{"code":"410425","name":"郏县","province":"41","city":"04","area":"25"},{"code":"410481","name":"舞钢市","province":"41","city":"04","area":"81"},{"code":"410482","name":"汝州市","province":"41","city":"04","area":"82"},{"code":"410401","name":"市辖区","province":"41","city":"04","area":"01"},{"code":"410471","name":"平顶山高新技术产业开发区","province":"41","city":"04","area":"71"},{"code":"410472","name":"平顶山市城乡一体化示范区","province":"41","city":"04","area":"72"}]},{"code":"410500","name":"安阳市","province":"41","city":"05","children":[{"code":"410502","name":"文峰区","province":"41","city":"05","area":"02"},{"code":"410503","name":"北关区","province":"41","city":"05","area":"03"},{"code":"410505","name":"殷都区","province":"41","city":"05","area":"05"},{"code":"410506","name":"龙安区","province":"41","city":"05","area":"06"},{"code":"410522","name":"安阳县","province":"41","city":"05","area":"22"},{"code":"410523","name":"汤阴县","province":"41","city":"05","area":"23"},{"code":"410526","name":"滑县","province":"41","city":"05","area":"26"},{"code":"410527","name":"内黄县","province":"41","city":"05","area":"27"},{"code":"410581","name":"林州市","province":"41","city":"05","area":"81"},{"code":"410501","name":"市辖区","province":"41","city":"05","area":"01"},{"code":"410571","name":"安阳高新技术产业开发区","province":"41","city":"05","area":"71"}]},{"code":"410600","name":"鹤壁市","province":"41","city":"06","children":[{"code":"410602","name":"鹤山区","province":"41","city":"06","area":"02"},{"code":"410603","name":"山城区","province":"41","city":"06","area":"03"},{"code":"410611","name":"淇滨区","province":"41","city":"06","area":"11"},{"code":"410621","name":"浚县","province":"41","city":"06","area":"21"},{"code":"410622","name":"淇县","province":"41","city":"06","area":"22"},{"code":"410601","name":"市辖区","province":"41","city":"06","area":"01"},{"code":"410671","name":"鹤壁经济技术开发区","province":"41","city":"06","area":"71"}]},{"code":"410700","name":"新乡市","province":"41","city":"07","children":[{"code":"410702","name":"红旗区","province":"41","city":"07","area":"02"},{"code":"410703","name":"卫滨区","province":"41","city":"07","area":"03"},{"code":"410704","name":"凤泉区","province":"41","city":"07","area":"04"},{"code":"410711","name":"牧野区","province":"41","city":"07","area":"11"},{"code":"410721","name":"新乡县","province":"41","city":"07","area":"21"},{"code":"410724","name":"获嘉县","province":"41","city":"07","area":"24"},{"code":"410725","name":"原阳县","province":"41","city":"07","area":"25"},{"code":"410726","name":"延津县","province":"41","city":"07","area":"26"},{"code":"410727","name":"封丘县","province":"41","city":"07","area":"27"},{"code":"410781","name":"卫辉市","province":"41","city":"07","area":"81"},{"code":"410782","name":"辉县市","province":"41","city":"07","area":"82"},{"code":"410783","name":"长垣市","province":"41","city":"07","area":"83"},{"code":"410701","name":"市辖区","province":"41","city":"07","area":"01"},{"code":"410771","name":"新乡高新技术产业开发区","province":"41","city":"07","area":"71"},{"code":"410772","name":"新乡经济技术开发区","province":"41","city":"07","area":"72"},{"code":"410773","name":"新乡市平原城乡一体化示范区","province":"41","city":"07","area":"73"}]},{"code":"410800","name":"焦作市","province":"41","city":"08","children":[{"code":"410802","name":"解放区","province":"41","city":"08","area":"02"},{"code":"410803","name":"中站区","province":"41","city":"08","area":"03"},{"code":"410804","name":"马村区","province":"41","city":"08","area":"04"},{"code":"410811","name":"山阳区","province":"41","city":"08","area":"11"},{"code":"410821","name":"修武县","province":"41","city":"08","area":"21"},{"code":"410822","name":"博爱县","province":"41","city":"08","area":"22"},{"code":"410823","name":"武陟县","province":"41","city":"08","area":"23"},{"code":"410825","name":"温县","province":"41","city":"08","area":"25"},{"code":"410882","name":"沁阳市","province":"41","city":"08","area":"82"},{"code":"410883","name":"孟州市","province":"41","city":"08","area":"83"},{"code":"410801","name":"市辖区","province":"41","city":"08","area":"01"},{"code":"410871","name":"焦作城乡一体化示范区","province":"41","city":"08","area":"71"}]},{"code":"410900","name":"濮阳市","province":"41","city":"09","children":[{"code":"410902","name":"华龙区","province":"41","city":"09","area":"02"},{"code":"410922","name":"清丰县","province":"41","city":"09","area":"22"},{"code":"410923","name":"南乐县","province":"41","city":"09","area":"23"},{"code":"410926","name":"范县","province":"41","city":"09","area":"26"},{"code":"410927","name":"台前县","province":"41","city":"09","area":"27"},{"code":"410928","name":"濮阳县","province":"41","city":"09","area":"28"},{"code":"410901","name":"市辖区","province":"41","city":"09","area":"01"},{"code":"410971","name":"河南濮阳工业园区","province":"41","city":"09","area":"71"},{"code":"410972","name":"濮阳经济技术开发区","province":"41","city":"09","area":"72"}]},{"code":"411000","name":"许昌市","province":"41","city":"10","children":[{"code":"411002","name":"魏都区","province":"41","city":"10","area":"02"},{"code":"411003","name":"建安区","province":"41","city":"10","area":"03"},{"code":"411024","name":"鄢陵县","province":"41","city":"10","area":"24"},{"code":"411025","name":"襄城县","province":"41","city":"10","area":"25"},{"code":"411081","name":"禹州市","province":"41","city":"10","area":"81"},{"code":"411082","name":"长葛市","province":"41","city":"10","area":"82"},{"code":"411001","name":"市辖区","province":"41","city":"10","area":"01"},{"code":"411071","name":"许昌经济技术开发区","province":"41","city":"10","area":"71"}]},{"code":"411100","name":"漯河市","province":"41","city":"11","children":[{"code":"411102","name":"源汇区","province":"41","city":"11","area":"02"},{"code":"411103","name":"郾城区","province":"41","city":"11","area":"03"},{"code":"411104","name":"召陵区","province":"41","city":"11","area":"04"},{"code":"411121","name":"舞阳县","province":"41","city":"11","area":"21"},{"code":"411122","name":"临颍县","province":"41","city":"11","area":"22"},{"code":"411101","name":"市辖区","province":"41","city":"11","area":"01"},{"code":"411171","name":"漯河经济技术开发区","province":"41","city":"11","area":"71"}]},{"code":"411200","name":"三门峡市","province":"41","city":"12","children":[{"code":"411202","name":"湖滨区","province":"41","city":"12","area":"02"},{"code":"411203","name":"陕州区","province":"41","city":"12","area":"03"},{"code":"411221","name":"渑池县","province":"41","city":"12","area":"21"},{"code":"411224","name":"卢氏县","province":"41","city":"12","area":"24"},{"code":"411281","name":"义马市","province":"41","city":"12","area":"81"},{"code":"411282","name":"灵宝市","province":"41","city":"12","area":"82"},{"code":"411201","name":"市辖区","province":"41","city":"12","area":"01"},{"code":"411271","name":"河南三门峡经济开发区","province":"41","city":"12","area":"71"}]},{"code":"411300","name":"南阳市","province":"41","city":"13","children":[{"code":"411302","name":"宛城区","province":"41","city":"13","area":"02"},{"code":"411303","name":"卧龙区","province":"41","city":"13","area":"03"},{"code":"411321","name":"南召县","province":"41","city":"13","area":"21"},{"code":"411322","name":"方城县","province":"41","city":"13","area":"22"},{"code":"411323","name":"西峡县","province":"41","city":"13","area":"23"},{"code":"411324","name":"镇平县","province":"41","city":"13","area":"24"},{"code":"411325","name":"内乡县","province":"41","city":"13","area":"25"},{"code":"411326","name":"淅川县","province":"41","city":"13","area":"26"},{"code":"411327","name":"社旗县","province":"41","city":"13","area":"27"},{"code":"411328","name":"唐河县","province":"41","city":"13","area":"28"},{"code":"411329","name":"新野县","province":"41","city":"13","area":"29"},{"code":"411330","name":"桐柏县","province":"41","city":"13","area":"30"},{"code":"411381","name":"邓州市","province":"41","city":"13","area":"81"},{"code":"411301","name":"市辖区","province":"41","city":"13","area":"01"},{"code":"411371","name":"南阳高新技术产业开发区","province":"41","city":"13","area":"71"},{"code":"411372","name":"南阳市城乡一体化示范区","province":"41","city":"13","area":"72"}]},{"code":"411400","name":"商丘市","province":"41","city":"14","children":[{"code":"411402","name":"梁园区","province":"41","city":"14","area":"02"},{"code":"411403","name":"睢阳区","province":"41","city":"14","area":"03"},{"code":"411421","name":"民权县","province":"41","city":"14","area":"21"},{"code":"411422","name":"睢县","province":"41","city":"14","area":"22"},{"code":"411423","name":"宁陵县","province":"41","city":"14","area":"23"},{"code":"411424","name":"柘城县","province":"41","city":"14","area":"24"},{"code":"411425","name":"虞城县","province":"41","city":"14","area":"25"},{"code":"411426","name":"夏邑县","province":"41","city":"14","area":"26"},{"code":"411481","name":"永城市","province":"41","city":"14","area":"81"},{"code":"411401","name":"市辖区","province":"41","city":"14","area":"01"},{"code":"411471","name":"豫东综合物流产业聚集区","province":"41","city":"14","area":"71"},{"code":"411472","name":"河南商丘经济开发区","province":"41","city":"14","area":"72"}]},{"code":"411500","name":"信阳市","province":"41","city":"15","children":[{"code":"411502","name":"浉河区","province":"41","city":"15","area":"02"},{"code":"411503","name":"平桥区","province":"41","city":"15","area":"03"},{"code":"411521","name":"罗山县","province":"41","city":"15","area":"21"},{"code":"411522","name":"光山县","province":"41","city":"15","area":"22"},{"code":"411523","name":"新县","province":"41","city":"15","area":"23"},{"code":"411524","name":"商城县","province":"41","city":"15","area":"24"},{"code":"411525","name":"固始县","province":"41","city":"15","area":"25"},{"code":"411526","name":"潢川县","province":"41","city":"15","area":"26"},{"code":"411527","name":"淮滨县","province":"41","city":"15","area":"27"},{"code":"411528","name":"息县","province":"41","city":"15","area":"28"},{"code":"411501","name":"市辖区","province":"41","city":"15","area":"01"},{"code":"411571","name":"信阳高新技术产业开发区","province":"41","city":"15","area":"71"}]},{"code":"411600","name":"周口市","province":"41","city":"16","children":[{"code":"411602","name":"川汇区","province":"41","city":"16","area":"02"},{"code":"411603","name":"淮阳区","province":"41","city":"16","area":"03"},{"code":"411621","name":"扶沟县","province":"41","city":"16","area":"21"},{"code":"411622","name":"西华县","province":"41","city":"16","area":"22"},{"code":"411623","name":"商水县","province":"41","city":"16","area":"23"},{"code":"411624","name":"沈丘县","province":"41","city":"16","area":"24"},{"code":"411625","name":"郸城县","province":"41","city":"16","area":"25"},{"code":"411627","name":"太康县","province":"41","city":"16","area":"27"},{"code":"411628","name":"鹿邑县","province":"41","city":"16","area":"28"},{"code":"411681","name":"项城市","province":"41","city":"16","area":"81"},{"code":"411601","name":"市辖区","province":"41","city":"16","area":"01"},{"code":"411671","name":"河南周口经济开发区","province":"41","city":"16","area":"71"}]},{"code":"411700","name":"驻马店市","province":"41","city":"17","children":[{"code":"411702","name":"驿城区","province":"41","city":"17","area":"02"},{"code":"411721","name":"西平县","province":"41","city":"17","area":"21"},{"code":"411722","name":"上蔡县","province":"41","city":"17","area":"22"},{"code":"411723","name":"平舆县","province":"41","city":"17","area":"23"},{"code":"411724","name":"正阳县","province":"41","city":"17","area":"24"},{"code":"411725","name":"确山县","province":"41","city":"17","area":"25"},{"code":"411726","name":"泌阳县","province":"41","city":"17","area":"26"},{"code":"411727","name":"汝南县","province":"41","city":"17","area":"27"},{"code":"411728","name":"遂平县","province":"41","city":"17","area":"28"},{"code":"411729","name":"新蔡县","province":"41","city":"17","area":"29"},{"code":"411701","name":"市辖区","province":"41","city":"17","area":"01"},{"code":"411771","name":"河南驻马店经济开发区","province":"41","city":"17","area":"71"}]},{"code":"419000","name":"河南省-省直辖县级行政区划","province":"41","city":"90","children":[{"code":"419001","name":"济源市","province":"41","city":"90","area":"01"}]}]},{"code":"420000","name":"湖北省","province":"42","children":[{"code":"420100","name":"武汉市","province":"42","city":"01","children":[{"code":"420102","name":"江岸区","province":"42","city":"01","area":"02"},{"code":"420103","name":"江汉区","province":"42","city":"01","area":"03"},{"code":"420104","name":"硚口区","province":"42","city":"01","area":"04"},{"code":"420105","name":"汉阳区","province":"42","city":"01","area":"05"},{"code":"420106","name":"武昌区","province":"42","city":"01","area":"06"},{"code":"420107","name":"青山区","province":"42","city":"01","area":"07"},{"code":"420111","name":"洪山区","province":"42","city":"01","area":"11"},{"code":"420112","name":"东西湖区","province":"42","city":"01","area":"12"},{"code":"420113","name":"汉南区","province":"42","city":"01","area":"13"},{"code":"420114","name":"蔡甸区","province":"42","city":"01","area":"14"},{"code":"420115","name":"江夏区","province":"42","city":"01","area":"15"},{"code":"420116","name":"黄陂区","province":"42","city":"01","area":"16"},{"code":"420117","name":"新洲区","province":"42","city":"01","area":"17"},{"code":"420101","name":"市辖区","province":"42","city":"01","area":"01"}]},{"code":"420200","name":"黄石市","province":"42","city":"02","children":[{"code":"420202","name":"黄石港区","province":"42","city":"02","area":"02"},{"code":"420203","name":"西塞山区","province":"42","city":"02","area":"03"},{"code":"420204","name":"下陆区","province":"42","city":"02","area":"04"},{"code":"420205","name":"铁山区","province":"42","city":"02","area":"05"},{"code":"420222","name":"阳新县","province":"42","city":"02","area":"22"},{"code":"420281","name":"大冶市","province":"42","city":"02","area":"81"},{"code":"420201","name":"市辖区","province":"42","city":"02","area":"01"}]},{"code":"420300","name":"十堰市","province":"42","city":"03","children":[{"code":"420302","name":"茅箭区","province":"42","city":"03","area":"02"},{"code":"420303","name":"张湾区","province":"42","city":"03","area":"03"},{"code":"420304","name":"郧阳区","province":"42","city":"03","area":"04"},{"code":"420322","name":"郧西县","province":"42","city":"03","area":"22"},{"code":"420323","name":"竹山县","province":"42","city":"03","area":"23"},{"code":"420324","name":"竹溪县","province":"42","city":"03","area":"24"},{"code":"420325","name":"房县","province":"42","city":"03","area":"25"},{"code":"420381","name":"丹江口市","province":"42","city":"03","area":"81"},{"code":"420301","name":"市辖区","province":"42","city":"03","area":"01"}]},{"code":"420500","name":"宜昌市","province":"42","city":"05","children":[{"code":"420502","name":"西陵区","province":"42","city":"05","area":"02"},{"code":"420503","name":"伍家岗区","province":"42","city":"05","area":"03"},{"code":"420504","name":"点军区","province":"42","city":"05","area":"04"},{"code":"420505","name":"猇亭区","province":"42","city":"05","area":"05"},{"code":"420506","name":"夷陵区","province":"42","city":"05","area":"06"},{"code":"420525","name":"远安县","province":"42","city":"05","area":"25"},{"code":"420526","name":"兴山县","province":"42","city":"05","area":"26"},{"code":"420527","name":"秭归县","province":"42","city":"05","area":"27"},{"code":"420528","name":"长阳土家族自治县","province":"42","city":"05","area":"28"},{"code":"420529","name":"五峰土家族自治县","province":"42","city":"05","area":"29"},{"code":"420581","name":"宜都市","province":"42","city":"05","area":"81"},{"code":"420582","name":"当阳市","province":"42","city":"05","area":"82"},{"code":"420583","name":"枝江市","province":"42","city":"05","area":"83"},{"code":"420501","name":"市辖区","province":"42","city":"05","area":"01"}]},{"code":"420600","name":"襄阳市","province":"42","city":"06","children":[{"code":"420602","name":"襄城区","province":"42","city":"06","area":"02"},{"code":"420606","name":"樊城区","province":"42","city":"06","area":"06"},{"code":"420607","name":"襄州区","province":"42","city":"06","area":"07"},{"code":"420624","name":"南漳县","province":"42","city":"06","area":"24"},{"code":"420625","name":"谷城县","province":"42","city":"06","area":"25"},{"code":"420626","name":"保康县","province":"42","city":"06","area":"26"},{"code":"420682","name":"老河口市","province":"42","city":"06","area":"82"},{"code":"420683","name":"枣阳市","province":"42","city":"06","area":"83"},{"code":"420684","name":"宜城市","province":"42","city":"06","area":"84"},{"code":"420601","name":"市辖区","province":"42","city":"06","area":"01"}]},{"code":"420700","name":"鄂州市","province":"42","city":"07","children":[{"code":"420702","name":"梁子湖区","province":"42","city":"07","area":"02"},{"code":"420703","name":"华容区","province":"42","city":"07","area":"03"},{"code":"420704","name":"鄂城区","province":"42","city":"07","area":"04"},{"code":"420701","name":"市辖区","province":"42","city":"07","area":"01"}]},{"code":"420800","name":"荆门市","province":"42","city":"08","children":[{"code":"420802","name":"东宝区","province":"42","city":"08","area":"02"},{"code":"420804","name":"掇刀区","province":"42","city":"08","area":"04"},{"code":"420822","name":"沙洋县","province":"42","city":"08","area":"22"},{"code":"420881","name":"钟祥市","province":"42","city":"08","area":"81"},{"code":"420882","name":"京山市","province":"42","city":"08","area":"82"},{"code":"420801","name":"市辖区","province":"42","city":"08","area":"01"}]},{"code":"420900","name":"孝感市","province":"42","city":"09","children":[{"code":"420902","name":"孝南区","province":"42","city":"09","area":"02"},{"code":"420921","name":"孝昌县","province":"42","city":"09","area":"21"},{"code":"420922","name":"大悟县","province":"42","city":"09","area":"22"},{"code":"420923","name":"云梦县","province":"42","city":"09","area":"23"},{"code":"420981","name":"应城市","province":"42","city":"09","area":"81"},{"code":"420982","name":"安陆市","province":"42","city":"09","area":"82"},{"code":"420984","name":"汉川市","province":"42","city":"09","area":"84"},{"code":"420901","name":"市辖区","province":"42","city":"09","area":"01"}]},{"code":"421000","name":"荆州市","province":"42","city":"10","children":[{"code":"421002","name":"沙市区","province":"42","city":"10","area":"02"},{"code":"421003","name":"荆州区","province":"42","city":"10","area":"03"},{"code":"421022","name":"公安县","province":"42","city":"10","area":"22"},{"code":"421024","name":"江陵县","province":"42","city":"10","area":"24"},{"code":"421081","name":"石首市","province":"42","city":"10","area":"81"},{"code":"421083","name":"洪湖市","province":"42","city":"10","area":"83"},{"code":"421087","name":"松滋市","province":"42","city":"10","area":"87"},{"code":"421088","name":"监利市","province":"42","city":"10","area":"88"},{"code":"421001","name":"市辖区","province":"42","city":"10","area":"01"},{"code":"421071","name":"荆州经济技术开发区","province":"42","city":"10","area":"71"}]},{"code":"421100","name":"黄冈市","province":"42","city":"11","children":[{"code":"421102","name":"黄州区","province":"42","city":"11","area":"02"},{"code":"421121","name":"团风县","province":"42","city":"11","area":"21"},{"code":"421122","name":"红安县","province":"42","city":"11","area":"22"},{"code":"421123","name":"罗田县","province":"42","city":"11","area":"23"},{"code":"421124","name":"英山县","province":"42","city":"11","area":"24"},{"code":"421125","name":"浠水县","province":"42","city":"11","area":"25"},{"code":"421126","name":"蕲春县","province":"42","city":"11","area":"26"},{"code":"421127","name":"黄梅县","province":"42","city":"11","area":"27"},{"code":"421181","name":"麻城市","province":"42","city":"11","area":"81"},{"code":"421182","name":"武穴市","province":"42","city":"11","area":"82"},{"code":"421101","name":"市辖区","province":"42","city":"11","area":"01"},{"code":"421171","name":"龙感湖管理区","province":"42","city":"11","area":"71"}]},{"code":"421200","name":"咸宁市","province":"42","city":"12","children":[{"code":"421202","name":"咸安区","province":"42","city":"12","area":"02"},{"code":"421221","name":"嘉鱼县","province":"42","city":"12","area":"21"},{"code":"421222","name":"通城县","province":"42","city":"12","area":"22"},{"code":"421223","name":"崇阳县","province":"42","city":"12","area":"23"},{"code":"421224","name":"通山县","province":"42","city":"12","area":"24"},{"code":"421281","name":"赤壁市","province":"42","city":"12","area":"81"},{"code":"421201","name":"市辖区","province":"42","city":"12","area":"01"}]},{"code":"421300","name":"随州市","province":"42","city":"13","children":[{"code":"421303","name":"曾都区","province":"42","city":"13","area":"03"},{"code":"421321","name":"随县","province":"42","city":"13","area":"21"},{"code":"421381","name":"广水市","province":"42","city":"13","area":"81"},{"code":"421301","name":"市辖区","province":"42","city":"13","area":"01"}]},{"code":"422800","name":"恩施土家族苗族自治州","province":"42","city":"28","children":[{"code":"422801","name":"恩施市","province":"42","city":"28","area":"01"},{"code":"422802","name":"利川市","province":"42","city":"28","area":"02"},{"code":"422822","name":"建始县","province":"42","city":"28","area":"22"},{"code":"422823","name":"巴东县","province":"42","city":"28","area":"23"},{"code":"422825","name":"宣恩县","province":"42","city":"28","area":"25"},{"code":"422826","name":"咸丰县","province":"42","city":"28","area":"26"},{"code":"422827","name":"来凤县","province":"42","city":"28","area":"27"},{"code":"422828","name":"鹤峰县","province":"42","city":"28","area":"28"}]},{"code":"429000","name":"湖北省-自治区直辖县级行政区划","province":"42","city":"90","children":[{"code":"429004","name":"仙桃市","province":"42","city":"90","area":"04"},{"code":"429005","name":"潜江市","province":"42","city":"90","area":"05"},{"code":"429006","name":"天门市","province":"42","city":"90","area":"06"},{"code":"429021","name":"神农架林区","province":"42","city":"90","area":"21"}]}]},{"code":"430000","name":"湖南省","province":"43","children":[{"code":"430100","name":"长沙市","province":"43","city":"01","children":[{"code":"430102","name":"芙蓉区","province":"43","city":"01","area":"02"},{"code":"430103","name":"天心区","province":"43","city":"01","area":"03"},{"code":"430104","name":"岳麓区","province":"43","city":"01","area":"04"},{"code":"430105","name":"开福区","province":"43","city":"01","area":"05"},{"code":"430111","name":"雨花区","province":"43","city":"01","area":"11"},{"code":"430112","name":"望城区","province":"43","city":"01","area":"12"},{"code":"430121","name":"长沙县","province":"43","city":"01","area":"21"},{"code":"430181","name":"浏阳市","province":"43","city":"01","area":"81"},{"code":"430182","name":"宁乡市","province":"43","city":"01","area":"82"},{"code":"430101","name":"市辖区","province":"43","city":"01","area":"01"}]},{"code":"430200","name":"株洲市","province":"43","city":"02","children":[{"code":"430202","name":"荷塘区","province":"43","city":"02","area":"02"},{"code":"430203","name":"芦淞区","province":"43","city":"02","area":"03"},{"code":"430204","name":"石峰区","province":"43","city":"02","area":"04"},{"code":"430211","name":"天元区","province":"43","city":"02","area":"11"},{"code":"430212","name":"渌口区","province":"43","city":"02","area":"12"},{"code":"430223","name":"攸县","province":"43","city":"02","area":"23"},{"code":"430224","name":"茶陵县","province":"43","city":"02","area":"24"},{"code":"430225","name":"炎陵县","province":"43","city":"02","area":"25"},{"code":"430281","name":"醴陵市","province":"43","city":"02","area":"81"},{"code":"430201","name":"市辖区","province":"43","city":"02","area":"01"},{"code":"430271","name":"云龙示范区","province":"43","city":"02","area":"71"}]},{"code":"430300","name":"湘潭市","province":"43","city":"03","children":[{"code":"430302","name":"雨湖区","province":"43","city":"03","area":"02"},{"code":"430304","name":"岳塘区","province":"43","city":"03","area":"04"},{"code":"430321","name":"湘潭县","province":"43","city":"03","area":"21"},{"code":"430381","name":"湘乡市","province":"43","city":"03","area":"81"},{"code":"430382","name":"韶山市","province":"43","city":"03","area":"82"},{"code":"430301","name":"市辖区","province":"43","city":"03","area":"01"},{"code":"430371","name":"湖南湘潭高新技术产业园区","province":"43","city":"03","area":"71"},{"code":"430372","name":"湘潭昭山示范区","province":"43","city":"03","area":"72"},{"code":"430373","name":"湘潭九华示范区","province":"43","city":"03","area":"73"}]},{"code":"430400","name":"衡阳市","province":"43","city":"04","children":[{"code":"430405","name":"珠晖区","province":"43","city":"04","area":"05"},{"code":"430406","name":"雁峰区","province":"43","city":"04","area":"06"},{"code":"430407","name":"石鼓区","province":"43","city":"04","area":"07"},{"code":"430408","name":"蒸湘区","province":"43","city":"04","area":"08"},{"code":"430412","name":"南岳区","province":"43","city":"04","area":"12"},{"code":"430421","name":"衡阳县","province":"43","city":"04","area":"21"},{"code":"430422","name":"衡南县","province":"43","city":"04","area":"22"},{"code":"430423","name":"衡山县","province":"43","city":"04","area":"23"},{"code":"430424","name":"衡东县","province":"43","city":"04","area":"24"},{"code":"430426","name":"祁东县","province":"43","city":"04","area":"26"},{"code":"430481","name":"耒阳市","province":"43","city":"04","area":"81"},{"code":"430482","name":"常宁市","province":"43","city":"04","area":"82"},{"code":"430401","name":"市辖区","province":"43","city":"04","area":"01"},{"code":"430471","name":"衡阳综合保税区","province":"43","city":"04","area":"71"},{"code":"430472","name":"湖南衡阳高新技术产业园区","province":"43","city":"04","area":"72"},{"code":"430473","name":"湖南衡阳松木经济开发区","province":"43","city":"04","area":"73"}]},{"code":"430500","name":"邵阳市","province":"43","city":"05","children":[{"code":"430502","name":"双清区","province":"43","city":"05","area":"02"},{"code":"430503","name":"大祥区","province":"43","city":"05","area":"03"},{"code":"430511","name":"北塔区","province":"43","city":"05","area":"11"},{"code":"430522","name":"新邵县","province":"43","city":"05","area":"22"},{"code":"430523","name":"邵阳县","province":"43","city":"05","area":"23"},{"code":"430524","name":"隆回县","province":"43","city":"05","area":"24"},{"code":"430525","name":"洞口县","province":"43","city":"05","area":"25"},{"code":"430527","name":"绥宁县","province":"43","city":"05","area":"27"},{"code":"430528","name":"新宁县","province":"43","city":"05","area":"28"},{"code":"430529","name":"城步苗族自治县","province":"43","city":"05","area":"29"},{"code":"430581","name":"武冈市","province":"43","city":"05","area":"81"},{"code":"430582","name":"邵东市","province":"43","city":"05","area":"82"},{"code":"430501","name":"市辖区","province":"43","city":"05","area":"01"}]},{"code":"430600","name":"岳阳市","province":"43","city":"06","children":[{"code":"430602","name":"岳阳楼区","province":"43","city":"06","area":"02"},{"code":"430603","name":"云溪区","province":"43","city":"06","area":"03"},{"code":"430611","name":"君山区","province":"43","city":"06","area":"11"},{"code":"430621","name":"岳阳县","province":"43","city":"06","area":"21"},{"code":"430623","name":"华容县","province":"43","city":"06","area":"23"},{"code":"430624","name":"湘阴县","province":"43","city":"06","area":"24"},{"code":"430626","name":"平江县","province":"43","city":"06","area":"26"},{"code":"430681","name":"汨罗市","province":"43","city":"06","area":"81"},{"code":"430682","name":"临湘市","province":"43","city":"06","area":"82"},{"code":"430601","name":"市辖区","province":"43","city":"06","area":"01"},{"code":"430671","name":"岳阳市屈原管理区","province":"43","city":"06","area":"71"}]},{"code":"430700","name":"常德市","province":"43","city":"07","children":[{"code":"430702","name":"武陵区","province":"43","city":"07","area":"02"},{"code":"430703","name":"鼎城区","province":"43","city":"07","area":"03"},{"code":"430721","name":"安乡县","province":"43","city":"07","area":"21"},{"code":"430722","name":"汉寿县","province":"43","city":"07","area":"22"},{"code":"430723","name":"澧县","province":"43","city":"07","area":"23"},{"code":"430724","name":"临澧县","province":"43","city":"07","area":"24"},{"code":"430725","name":"桃源县","province":"43","city":"07","area":"25"},{"code":"430726","name":"石门县","province":"43","city":"07","area":"26"},{"code":"430781","name":"津市市","province":"43","city":"07","area":"81"},{"code":"430701","name":"市辖区","province":"43","city":"07","area":"01"},{"code":"430771","name":"常德市西洞庭管理区","province":"43","city":"07","area":"71"}]},{"code":"430800","name":"张家界市","province":"43","city":"08","children":[{"code":"430802","name":"永定区","province":"43","city":"08","area":"02"},{"code":"430811","name":"武陵源区","province":"43","city":"08","area":"11"},{"code":"430821","name":"慈利县","province":"43","city":"08","area":"21"},{"code":"430822","name":"桑植县","province":"43","city":"08","area":"22"},{"code":"430801","name":"市辖区","province":"43","city":"08","area":"01"}]},{"code":"430900","name":"益阳市","province":"43","city":"09","children":[{"code":"430902","name":"资阳区","province":"43","city":"09","area":"02"},{"code":"430903","name":"赫山区","province":"43","city":"09","area":"03"},{"code":"430921","name":"南县","province":"43","city":"09","area":"21"},{"code":"430922","name":"桃江县","province":"43","city":"09","area":"22"},{"code":"430923","name":"安化县","province":"43","city":"09","area":"23"},{"code":"430981","name":"沅江市","province":"43","city":"09","area":"81"},{"code":"430901","name":"市辖区","province":"43","city":"09","area":"01"},{"code":"430971","name":"益阳市大通湖管理区","province":"43","city":"09","area":"71"},{"code":"430972","name":"湖南益阳高新技术产业园区","province":"43","city":"09","area":"72"}]},{"code":"431000","name":"郴州市","province":"43","city":"10","children":[{"code":"431002","name":"北湖区","province":"43","city":"10","area":"02"},{"code":"431003","name":"苏仙区","province":"43","city":"10","area":"03"},{"code":"431021","name":"桂阳县","province":"43","city":"10","area":"21"},{"code":"431022","name":"宜章县","province":"43","city":"10","area":"22"},{"code":"431023","name":"永兴县","province":"43","city":"10","area":"23"},{"code":"431024","name":"嘉禾县","province":"43","city":"10","area":"24"},{"code":"431025","name":"临武县","province":"43","city":"10","area":"25"},{"code":"431026","name":"汝城县","province":"43","city":"10","area":"26"},{"code":"431027","name":"桂东县","province":"43","city":"10","area":"27"},{"code":"431028","name":"安仁县","province":"43","city":"10","area":"28"},{"code":"431081","name":"资兴市","province":"43","city":"10","area":"81"},{"code":"431001","name":"市辖区","province":"43","city":"10","area":"01"}]},{"code":"431100","name":"永州市","province":"43","city":"11","children":[{"code":"431102","name":"零陵区","province":"43","city":"11","area":"02"},{"code":"431103","name":"冷水滩区","province":"43","city":"11","area":"03"},{"code":"431121","name":"祁阳县","province":"43","city":"11","area":"21"},{"code":"431122","name":"东安县","province":"43","city":"11","area":"22"},{"code":"431123","name":"双牌县","province":"43","city":"11","area":"23"},{"code":"431124","name":"道县","province":"43","city":"11","area":"24"},{"code":"431125","name":"江永县","province":"43","city":"11","area":"25"},{"code":"431126","name":"宁远县","province":"43","city":"11","area":"26"},{"code":"431127","name":"蓝山县","province":"43","city":"11","area":"27"},{"code":"431128","name":"新田县","province":"43","city":"11","area":"28"},{"code":"431129","name":"江华瑶族自治县","province":"43","city":"11","area":"29"},{"code":"431101","name":"市辖区","province":"43","city":"11","area":"01"},{"code":"431171","name":"永州经济技术开发区","province":"43","city":"11","area":"71"},{"code":"431173","name":"永州市回龙圩管理区","province":"43","city":"11","area":"73"},{"code":"431181","name":"祁阳市","province":"43","city":"11","area":"81"}]},{"code":"431200","name":"怀化市","province":"43","city":"12","children":[{"code":"431202","name":"鹤城区","province":"43","city":"12","area":"02"},{"code":"431221","name":"中方县","province":"43","city":"12","area":"21"},{"code":"431222","name":"沅陵县","province":"43","city":"12","area":"22"},{"code":"431223","name":"辰溪县","province":"43","city":"12","area":"23"},{"code":"431224","name":"溆浦县","province":"43","city":"12","area":"24"},{"code":"431225","name":"会同县","province":"43","city":"12","area":"25"},{"code":"431226","name":"麻阳苗族自治县","province":"43","city":"12","area":"26"},{"code":"431227","name":"新晃侗族自治县","province":"43","city":"12","area":"27"},{"code":"431228","name":"芷江侗族自治县","province":"43","city":"12","area":"28"},{"code":"431229","name":"靖州苗族侗族自治县","province":"43","city":"12","area":"29"},{"code":"431230","name":"通道侗族自治县","province":"43","city":"12","area":"30"},{"code":"431281","name":"洪江市","province":"43","city":"12","area":"81"},{"code":"431201","name":"市辖区","province":"43","city":"12","area":"01"},{"code":"431271","name":"怀化市洪江管理区","province":"43","city":"12","area":"71"}]},{"code":"431300","name":"娄底市","province":"43","city":"13","children":[{"code":"431302","name":"娄星区","province":"43","city":"13","area":"02"},{"code":"431321","name":"双峰县","province":"43","city":"13","area":"21"},{"code":"431322","name":"新化县","province":"43","city":"13","area":"22"},{"code":"431381","name":"冷水江市","province":"43","city":"13","area":"81"},{"code":"431382","name":"涟源市","province":"43","city":"13","area":"82"},{"code":"431301","name":"市辖区","province":"43","city":"13","area":"01"}]},{"code":"433100","name":"湘西土家族苗族自治州","province":"43","city":"31","children":[{"code":"433101","name":"吉首市","province":"43","city":"31","area":"01"},{"code":"433122","name":"泸溪县","province":"43","city":"31","area":"22"},{"code":"433123","name":"凤凰县","province":"43","city":"31","area":"23"},{"code":"433124","name":"花垣县","province":"43","city":"31","area":"24"},{"code":"433125","name":"保靖县","province":"43","city":"31","area":"25"},{"code":"433126","name":"古丈县","province":"43","city":"31","area":"26"},{"code":"433127","name":"永顺县","province":"43","city":"31","area":"27"},{"code":"433130","name":"龙山县","province":"43","city":"31","area":"30"}]}]},{"code":"440000","name":"广东省","province":"44","children":[{"code":"440100","name":"广州市","province":"44","city":"01","children":[{"code":"440103","name":"荔湾区","province":"44","city":"01","area":"03"},{"code":"440104","name":"越秀区","province":"44","city":"01","area":"04"},{"code":"440105","name":"海珠区","province":"44","city":"01","area":"05"},{"code":"440106","name":"天河区","province":"44","city":"01","area":"06"},{"code":"440111","name":"白云区","province":"44","city":"01","area":"11"},{"code":"440112","name":"黄埔区","province":"44","city":"01","area":"12"},{"code":"440113","name":"番禺区","province":"44","city":"01","area":"13"},{"code":"440114","name":"花都区","province":"44","city":"01","area":"14"},{"code":"440115","name":"南沙区","province":"44","city":"01","area":"15"},{"code":"440117","name":"从化区","province":"44","city":"01","area":"17"},{"code":"440118","name":"增城区","province":"44","city":"01","area":"18"},{"code":"440101","name":"市辖区","province":"44","city":"01","area":"01"}]},{"code":"440200","name":"韶关市","province":"44","city":"02","children":[{"code":"440203","name":"武江区","province":"44","city":"02","area":"03"},{"code":"440204","name":"浈江区","province":"44","city":"02","area":"04"},{"code":"440205","name":"曲江区","province":"44","city":"02","area":"05"},{"code":"440222","name":"始兴县","province":"44","city":"02","area":"22"},{"code":"440224","name":"仁化县","province":"44","city":"02","area":"24"},{"code":"440229","name":"翁源县","province":"44","city":"02","area":"29"},{"code":"440232","name":"乳源瑶族自治县","province":"44","city":"02","area":"32"},{"code":"440233","name":"新丰县","province":"44","city":"02","area":"33"},{"code":"440281","name":"乐昌市","province":"44","city":"02","area":"81"},{"code":"440282","name":"南雄市","province":"44","city":"02","area":"82"},{"code":"440201","name":"市辖区","province":"44","city":"02","area":"01"}]},{"code":"440300","name":"深圳市","province":"44","city":"03","children":[{"code":"440303","name":"罗湖区","province":"44","city":"03","area":"03"},{"code":"440304","name":"福田区","province":"44","city":"03","area":"04"},{"code":"440305","name":"南山区","province":"44","city":"03","area":"05"},{"code":"440306","name":"宝安区","province":"44","city":"03","area":"06"},{"code":"440307","name":"龙岗区","province":"44","city":"03","area":"07"},{"code":"440308","name":"盐田区","province":"44","city":"03","area":"08"},{"code":"440309","name":"龙华区","province":"44","city":"03","area":"09"},{"code":"440310","name":"坪山区","province":"44","city":"03","area":"10"},{"code":"440311","name":"光明区","province":"44","city":"03","area":"11"},{"code":"440301","name":"市辖区","province":"44","city":"03","area":"01"}]},{"code":"440400","name":"珠海市","province":"44","city":"04","children":[{"code":"440402","name":"香洲区","province":"44","city":"04","area":"02"},{"code":"440403","name":"斗门区","province":"44","city":"04","area":"03"},{"code":"440404","name":"金湾区","province":"44","city":"04","area":"04"},{"code":"440401","name":"市辖区","province":"44","city":"04","area":"01"}]},{"code":"440500","name":"汕头市","province":"44","city":"05","children":[{"code":"440507","name":"龙湖区","province":"44","city":"05","area":"07"},{"code":"440511","name":"金平区","province":"44","city":"05","area":"11"},{"code":"440512","name":"濠江区","province":"44","city":"05","area":"12"},{"code":"440513","name":"潮阳区","province":"44","city":"05","area":"13"},{"code":"440514","name":"潮南区","province":"44","city":"05","area":"14"},{"code":"440515","name":"澄海区","province":"44","city":"05","area":"15"},{"code":"440523","name":"南澳县","province":"44","city":"05","area":"23"},{"code":"440501","name":"市辖区","province":"44","city":"05","area":"01"}]},{"code":"440600","name":"佛山市","province":"44","city":"06","children":[{"code":"440604","name":"禅城区","province":"44","city":"06","area":"04"},{"code":"440605","name":"南海区","province":"44","city":"06","area":"05"},{"code":"440606","name":"顺德区","province":"44","city":"06","area":"06"},{"code":"440607","name":"三水区","province":"44","city":"06","area":"07"},{"code":"440608","name":"高明区","province":"44","city":"06","area":"08"},{"code":"440601","name":"市辖区","province":"44","city":"06","area":"01"}]},{"code":"440700","name":"江门市","province":"44","city":"07","children":[{"code":"440703","name":"蓬江区","province":"44","city":"07","area":"03"},{"code":"440704","name":"江海区","province":"44","city":"07","area":"04"},{"code":"440705","name":"新会区","province":"44","city":"07","area":"05"},{"code":"440781","name":"台山市","province":"44","city":"07","area":"81"},{"code":"440783","name":"开平市","province":"44","city":"07","area":"83"},{"code":"440784","name":"鹤山市","province":"44","city":"07","area":"84"},{"code":"440785","name":"恩平市","province":"44","city":"07","area":"85"},{"code":"440701","name":"市辖区","province":"44","city":"07","area":"01"}]},{"code":"440800","name":"湛江市","province":"44","city":"08","children":[{"code":"440802","name":"赤坎区","province":"44","city":"08","area":"02"},{"code":"440803","name":"霞山区","province":"44","city":"08","area":"03"},{"code":"440804","name":"坡头区","province":"44","city":"08","area":"04"},{"code":"440811","name":"麻章区","province":"44","city":"08","area":"11"},{"code":"440823","name":"遂溪县","province":"44","city":"08","area":"23"},{"code":"440825","name":"徐闻县","province":"44","city":"08","area":"25"},{"code":"440881","name":"廉江市","province":"44","city":"08","area":"81"},{"code":"440882","name":"雷州市","province":"44","city":"08","area":"82"},{"code":"440883","name":"吴川市","province":"44","city":"08","area":"83"},{"code":"440801","name":"市辖区","province":"44","city":"08","area":"01"}]},{"code":"440900","name":"茂名市","province":"44","city":"09","children":[{"code":"440902","name":"茂南区","province":"44","city":"09","area":"02"},{"code":"440904","name":"电白区","province":"44","city":"09","area":"04"},{"code":"440981","name":"高州市","province":"44","city":"09","area":"81"},{"code":"440982","name":"化州市","province":"44","city":"09","area":"82"},{"code":"440983","name":"信宜市","province":"44","city":"09","area":"83"},{"code":"440901","name":"市辖区","province":"44","city":"09","area":"01"}]},{"code":"441200","name":"肇庆市","province":"44","city":"12","children":[{"code":"441202","name":"端州区","province":"44","city":"12","area":"02"},{"code":"441203","name":"鼎湖区","province":"44","city":"12","area":"03"},{"code":"441204","name":"高要区","province":"44","city":"12","area":"04"},{"code":"441223","name":"广宁县","province":"44","city":"12","area":"23"},{"code":"441224","name":"怀集县","province":"44","city":"12","area":"24"},{"code":"441225","name":"封开县","province":"44","city":"12","area":"25"},{"code":"441226","name":"德庆县","province":"44","city":"12","area":"26"},{"code":"441284","name":"四会市","province":"44","city":"12","area":"84"},{"code":"441201","name":"市辖区","province":"44","city":"12","area":"01"}]},{"code":"441300","name":"惠州市","province":"44","city":"13","children":[{"code":"441302","name":"惠城区","province":"44","city":"13","area":"02"},{"code":"441303","name":"惠阳区","province":"44","city":"13","area":"03"},{"code":"441322","name":"博罗县","province":"44","city":"13","area":"22"},{"code":"441323","name":"惠东县","province":"44","city":"13","area":"23"},{"code":"441324","name":"龙门县","province":"44","city":"13","area":"24"},{"code":"441301","name":"市辖区","province":"44","city":"13","area":"01"}]},{"code":"441400","name":"梅州市","province":"44","city":"14","children":[{"code":"441402","name":"梅江区","province":"44","city":"14","area":"02"},{"code":"441403","name":"梅县区","province":"44","city":"14","area":"03"},{"code":"441422","name":"大埔县","province":"44","city":"14","area":"22"},{"code":"441423","name":"丰顺县","province":"44","city":"14","area":"23"},{"code":"441424","name":"五华县","province":"44","city":"14","area":"24"},{"code":"441426","name":"平远县","province":"44","city":"14","area":"26"},{"code":"441427","name":"蕉岭县","province":"44","city":"14","area":"27"},{"code":"441481","name":"兴宁市","province":"44","city":"14","area":"81"},{"code":"441401","name":"市辖区","province":"44","city":"14","area":"01"}]},{"code":"441500","name":"汕尾市","province":"44","city":"15","children":[{"code":"441502","name":"城区","province":"44","city":"15","area":"02"},{"code":"441521","name":"海丰县","province":"44","city":"15","area":"21"},{"code":"441523","name":"陆河县","province":"44","city":"15","area":"23"},{"code":"441581","name":"陆丰市","province":"44","city":"15","area":"81"},{"code":"441501","name":"市辖区","province":"44","city":"15","area":"01"}]},{"code":"441600","name":"河源市","province":"44","city":"16","children":[{"code":"441602","name":"源城区","province":"44","city":"16","area":"02"},{"code":"441621","name":"紫金县","province":"44","city":"16","area":"21"},{"code":"441622","name":"龙川县","province":"44","city":"16","area":"22"},{"code":"441623","name":"连平县","province":"44","city":"16","area":"23"},{"code":"441624","name":"和平县","province":"44","city":"16","area":"24"},{"code":"441625","name":"东源县","province":"44","city":"16","area":"25"},{"code":"441601","name":"市辖区","province":"44","city":"16","area":"01"}]},{"code":"441700","name":"阳江市","province":"44","city":"17","children":[{"code":"441702","name":"江城区","province":"44","city":"17","area":"02"},{"code":"441704","name":"阳东区","province":"44","city":"17","area":"04"},{"code":"441721","name":"阳西县","province":"44","city":"17","area":"21"},{"code":"441781","name":"阳春市","province":"44","city":"17","area":"81"},{"code":"441701","name":"市辖区","province":"44","city":"17","area":"01"}]},{"code":"441800","name":"清远市","province":"44","city":"18","children":[{"code":"441802","name":"清城区","province":"44","city":"18","area":"02"},{"code":"441803","name":"清新区","province":"44","city":"18","area":"03"},{"code":"441821","name":"佛冈县","province":"44","city":"18","area":"21"},{"code":"441823","name":"阳山县","province":"44","city":"18","area":"23"},{"code":"441825","name":"连山壮族瑶族自治县","province":"44","city":"18","area":"25"},{"code":"441826","name":"连南瑶族自治县","province":"44","city":"18","area":"26"},{"code":"441881","name":"英德市","province":"44","city":"18","area":"81"},{"code":"441882","name":"连州市","province":"44","city":"18","area":"82"},{"code":"441801","name":"市辖区","province":"44","city":"18","area":"01"}]},{"code":"441900","name":"东莞市","province":"44","city":"19","children":[]},{"code":"442000","name":"中山市","province":"44","city":"20","children":[]},{"code":"445100","name":"潮州市","province":"44","city":"51","children":[{"code":"445102","name":"湘桥区","province":"44","city":"51","area":"02"},{"code":"445103","name":"潮安区","province":"44","city":"51","area":"03"},{"code":"445122","name":"饶平县","province":"44","city":"51","area":"22"},{"code":"445101","name":"市辖区","province":"44","city":"51","area":"01"}]},{"code":"445200","name":"揭阳市","province":"44","city":"52","children":[{"code":"445202","name":"榕城区","province":"44","city":"52","area":"02"},{"code":"445203","name":"揭东区","province":"44","city":"52","area":"03"},{"code":"445222","name":"揭西县","province":"44","city":"52","area":"22"},{"code":"445224","name":"惠来县","province":"44","city":"52","area":"24"},{"code":"445281","name":"普宁市","province":"44","city":"52","area":"81"},{"code":"445201","name":"市辖区","province":"44","city":"52","area":"01"}]},{"code":"445300","name":"云浮市","province":"44","city":"53","children":[{"code":"445302","name":"云城区","province":"44","city":"53","area":"02"},{"code":"445303","name":"云安区","province":"44","city":"53","area":"03"},{"code":"445321","name":"新兴县","province":"44","city":"53","area":"21"},{"code":"445322","name":"郁南县","province":"44","city":"53","area":"22"},{"code":"445381","name":"罗定市","province":"44","city":"53","area":"81"},{"code":"445301","name":"市辖区","province":"44","city":"53","area":"01"}]}]},{"code":"450000","name":"广西壮族自治区","province":"45","children":[{"code":"450100","name":"南宁市","province":"45","city":"01","children":[{"code":"450102","name":"兴宁区","province":"45","city":"01","area":"02"},{"code":"450103","name":"青秀区","province":"45","city":"01","area":"03"},{"code":"450105","name":"江南区","province":"45","city":"01","area":"05"},{"code":"450107","name":"西乡塘区","province":"45","city":"01","area":"07"},{"code":"450108","name":"良庆区","province":"45","city":"01","area":"08"},{"code":"450109","name":"邕宁区","province":"45","city":"01","area":"09"},{"code":"450110","name":"武鸣区","province":"45","city":"01","area":"10"},{"code":"450123","name":"隆安县","province":"45","city":"01","area":"23"},{"code":"450124","name":"马山县","province":"45","city":"01","area":"24"},{"code":"450125","name":"上林县","province":"45","city":"01","area":"25"},{"code":"450126","name":"宾阳县","province":"45","city":"01","area":"26"},{"code":"450127","name":"横县","province":"45","city":"01","area":"27"},{"code":"450101","name":"市辖区","province":"45","city":"01","area":"01"},{"code":"450181","name":"横州市","province":"45","city":"01","area":"81"}]},{"code":"450200","name":"柳州市","province":"45","city":"02","children":[{"code":"450202","name":"城中区","province":"45","city":"02","area":"02"},{"code":"450203","name":"鱼峰区","province":"45","city":"02","area":"03"},{"code":"450204","name":"柳南区","province":"45","city":"02","area":"04"},{"code":"450205","name":"柳北区","province":"45","city":"02","area":"05"},{"code":"450206","name":"柳江区","province":"45","city":"02","area":"06"},{"code":"450222","name":"柳城县","province":"45","city":"02","area":"22"},{"code":"450223","name":"鹿寨县","province":"45","city":"02","area":"23"},{"code":"450224","name":"融安县","province":"45","city":"02","area":"24"},{"code":"450225","name":"融水苗族自治县","province":"45","city":"02","area":"25"},{"code":"450226","name":"三江侗族自治县","province":"45","city":"02","area":"26"},{"code":"450201","name":"市辖区","province":"45","city":"02","area":"01"}]},{"code":"450300","name":"桂林市","province":"45","city":"03","children":[{"code":"450302","name":"秀峰区","province":"45","city":"03","area":"02"},{"code":"450303","name":"叠彩区","province":"45","city":"03","area":"03"},{"code":"450304","name":"象山区","province":"45","city":"03","area":"04"},{"code":"450305","name":"七星区","province":"45","city":"03","area":"05"},{"code":"450311","name":"雁山区","province":"45","city":"03","area":"11"},{"code":"450312","name":"临桂区","province":"45","city":"03","area":"12"},{"code":"450321","name":"阳朔县","province":"45","city":"03","area":"21"},{"code":"450323","name":"灵川县","province":"45","city":"03","area":"23"},{"code":"450324","name":"全州县","province":"45","city":"03","area":"24"},{"code":"450325","name":"兴安县","province":"45","city":"03","area":"25"},{"code":"450326","name":"永福县","province":"45","city":"03","area":"26"},{"code":"450327","name":"灌阳县","province":"45","city":"03","area":"27"},{"code":"450328","name":"龙胜各族自治县","province":"45","city":"03","area":"28"},{"code":"450329","name":"资源县","province":"45","city":"03","area":"29"},{"code":"450330","name":"平乐县","province":"45","city":"03","area":"30"},{"code":"450332","name":"恭城瑶族自治县","province":"45","city":"03","area":"32"},{"code":"450381","name":"荔浦市","province":"45","city":"03","area":"81"},{"code":"450301","name":"市辖区","province":"45","city":"03","area":"01"}]},{"code":"450400","name":"梧州市","province":"45","city":"04","children":[{"code":"450403","name":"万秀区","province":"45","city":"04","area":"03"},{"code":"450405","name":"长洲区","province":"45","city":"04","area":"05"},{"code":"450406","name":"龙圩区","province":"45","city":"04","area":"06"},{"code":"450421","name":"苍梧县","province":"45","city":"04","area":"21"},{"code":"450422","name":"藤县","province":"45","city":"04","area":"22"},{"code":"450423","name":"蒙山县","province":"45","city":"04","area":"23"},{"code":"450481","name":"岑溪市","province":"45","city":"04","area":"81"},{"code":"450401","name":"市辖区","province":"45","city":"04","area":"01"}]},{"code":"450500","name":"北海市","province":"45","city":"05","children":[{"code":"450502","name":"海城区","province":"45","city":"05","area":"02"},{"code":"450503","name":"银海区","province":"45","city":"05","area":"03"},{"code":"450512","name":"铁山港区","province":"45","city":"05","area":"12"},{"code":"450521","name":"合浦县","province":"45","city":"05","area":"21"},{"code":"450501","name":"市辖区","province":"45","city":"05","area":"01"}]},{"code":"450600","name":"防城港市","province":"45","city":"06","children":[{"code":"450602","name":"港口区","province":"45","city":"06","area":"02"},{"code":"450603","name":"防城区","province":"45","city":"06","area":"03"},{"code":"450621","name":"上思县","province":"45","city":"06","area":"21"},{"code":"450681","name":"东兴市","province":"45","city":"06","area":"81"},{"code":"450601","name":"市辖区","province":"45","city":"06","area":"01"}]},{"code":"450700","name":"钦州市","province":"45","city":"07","children":[{"code":"450702","name":"钦南区","province":"45","city":"07","area":"02"},{"code":"450703","name":"钦北区","province":"45","city":"07","area":"03"},{"code":"450721","name":"灵山县","province":"45","city":"07","area":"21"},{"code":"450722","name":"浦北县","province":"45","city":"07","area":"22"},{"code":"450701","name":"市辖区","province":"45","city":"07","area":"01"}]},{"code":"450800","name":"贵港市","province":"45","city":"08","children":[{"code":"450802","name":"港北区","province":"45","city":"08","area":"02"},{"code":"450803","name":"港南区","province":"45","city":"08","area":"03"},{"code":"450804","name":"覃塘区","province":"45","city":"08","area":"04"},{"code":"450821","name":"平南县","province":"45","city":"08","area":"21"},{"code":"450881","name":"桂平市","province":"45","city":"08","area":"81"},{"code":"450801","name":"市辖区","province":"45","city":"08","area":"01"}]},{"code":"450900","name":"玉林市","province":"45","city":"09","children":[{"code":"450902","name":"玉州区","province":"45","city":"09","area":"02"},{"code":"450903","name":"福绵区","province":"45","city":"09","area":"03"},{"code":"450921","name":"容县","province":"45","city":"09","area":"21"},{"code":"450922","name":"陆川县","province":"45","city":"09","area":"22"},{"code":"450923","name":"博白县","province":"45","city":"09","area":"23"},{"code":"450924","name":"兴业县","province":"45","city":"09","area":"24"},{"code":"450981","name":"北流市","province":"45","city":"09","area":"81"},{"code":"450901","name":"市辖区","province":"45","city":"09","area":"01"}]},{"code":"451000","name":"百色市","province":"45","city":"10","children":[{"code":"451002","name":"右江区","province":"45","city":"10","area":"02"},{"code":"451003","name":"田阳区","province":"45","city":"10","area":"03"},{"code":"451022","name":"田东县","province":"45","city":"10","area":"22"},{"code":"451024","name":"德保县","province":"45","city":"10","area":"24"},{"code":"451026","name":"那坡县","province":"45","city":"10","area":"26"},{"code":"451027","name":"凌云县","province":"45","city":"10","area":"27"},{"code":"451028","name":"乐业县","province":"45","city":"10","area":"28"},{"code":"451029","name":"田林县","province":"45","city":"10","area":"29"},{"code":"451030","name":"西林县","province":"45","city":"10","area":"30"},{"code":"451031","name":"隆林各族自治县","province":"45","city":"10","area":"31"},{"code":"451081","name":"靖西市","province":"45","city":"10","area":"81"},{"code":"451082","name":"平果市","province":"45","city":"10","area":"82"},{"code":"451001","name":"市辖区","province":"45","city":"10","area":"01"}]},{"code":"451100","name":"贺州市","province":"45","city":"11","children":[{"code":"451102","name":"八步区","province":"45","city":"11","area":"02"},{"code":"451103","name":"平桂区","province":"45","city":"11","area":"03"},{"code":"451121","name":"昭平县","province":"45","city":"11","area":"21"},{"code":"451122","name":"钟山县","province":"45","city":"11","area":"22"},{"code":"451123","name":"富川瑶族自治县","province":"45","city":"11","area":"23"},{"code":"451101","name":"市辖区","province":"45","city":"11","area":"01"}]},{"code":"451200","name":"河池市","province":"45","city":"12","children":[{"code":"451202","name":"金城江区","province":"45","city":"12","area":"02"},{"code":"451203","name":"宜州区","province":"45","city":"12","area":"03"},{"code":"451221","name":"南丹县","province":"45","city":"12","area":"21"},{"code":"451222","name":"天峨县","province":"45","city":"12","area":"22"},{"code":"451223","name":"凤山县","province":"45","city":"12","area":"23"},{"code":"451224","name":"东兰县","province":"45","city":"12","area":"24"},{"code":"451225","name":"罗城仫佬族自治县","province":"45","city":"12","area":"25"},{"code":"451226","name":"环江毛南族自治县","province":"45","city":"12","area":"26"},{"code":"451227","name":"巴马瑶族自治县","province":"45","city":"12","area":"27"},{"code":"451228","name":"都安瑶族自治县","province":"45","city":"12","area":"28"},{"code":"451229","name":"大化瑶族自治县","province":"45","city":"12","area":"29"},{"code":"451201","name":"市辖区","province":"45","city":"12","area":"01"}]},{"code":"451300","name":"来宾市","province":"45","city":"13","children":[{"code":"451302","name":"兴宾区","province":"45","city":"13","area":"02"},{"code":"451321","name":"忻城县","province":"45","city":"13","area":"21"},{"code":"451322","name":"象州县","province":"45","city":"13","area":"22"},{"code":"451323","name":"武宣县","province":"45","city":"13","area":"23"},{"code":"451324","name":"金秀瑶族自治县","province":"45","city":"13","area":"24"},{"code":"451381","name":"合山市","province":"45","city":"13","area":"81"},{"code":"451301","name":"市辖区","province":"45","city":"13","area":"01"}]},{"code":"451400","name":"崇左市","province":"45","city":"14","children":[{"code":"451402","name":"江州区","province":"45","city":"14","area":"02"},{"code":"451421","name":"扶绥县","province":"45","city":"14","area":"21"},{"code":"451422","name":"宁明县","province":"45","city":"14","area":"22"},{"code":"451423","name":"龙州县","province":"45","city":"14","area":"23"},{"code":"451424","name":"大新县","province":"45","city":"14","area":"24"},{"code":"451425","name":"天等县","province":"45","city":"14","area":"25"},{"code":"451481","name":"凭祥市","province":"45","city":"14","area":"81"},{"code":"451401","name":"市辖区","province":"45","city":"14","area":"01"}]}]},{"code":"460000","name":"海南省","province":"46","children":[{"code":"460100","name":"海口市","province":"46","city":"01","children":[{"code":"460105","name":"秀英区","province":"46","city":"01","area":"05"},{"code":"460106","name":"龙华区","province":"46","city":"01","area":"06"},{"code":"460107","name":"琼山区","province":"46","city":"01","area":"07"},{"code":"460108","name":"美兰区","province":"46","city":"01","area":"08"},{"code":"460101","name":"市辖区","province":"46","city":"01","area":"01"}]},{"code":"460200","name":"三亚市","province":"46","city":"02","children":[{"code":"460202","name":"海棠区","province":"46","city":"02","area":"02"},{"code":"460203","name":"吉阳区","province":"46","city":"02","area":"03"},{"code":"460204","name":"天涯区","province":"46","city":"02","area":"04"},{"code":"460205","name":"崖州区","province":"46","city":"02","area":"05"},{"code":"460201","name":"市辖区","province":"46","city":"02","area":"01"}]},{"code":"460300","name":"三沙市","province":"46","city":"03","children":[{"code":"460321","name":"西沙群岛","province":"46","city":"03","area":"21"},{"code":"460322","name":"南沙群岛","province":"46","city":"03","area":"22"},{"code":"460323","name":"中沙群岛的岛礁及其海域","province":"46","city":"03","area":"23"}]},{"code":"460400","name":"儋州市","province":"46","city":"04","children":[]},{"code":"469000","name":"海南省-自治区直辖县级行政区划","province":"46","city":"90","children":[{"code":"469001","name":"五指山市","province":"46","city":"90","area":"01"},{"code":"469002","name":"琼海市","province":"46","city":"90","area":"02"},{"code":"469005","name":"文昌市","province":"46","city":"90","area":"05"},{"code":"469006","name":"万宁市","province":"46","city":"90","area":"06"},{"code":"469007","name":"东方市","province":"46","city":"90","area":"07"},{"code":"469021","name":"定安县","province":"46","city":"90","area":"21"},{"code":"469022","name":"屯昌县","province":"46","city":"90","area":"22"},{"code":"469023","name":"澄迈县","province":"46","city":"90","area":"23"},{"code":"469024","name":"临高县","province":"46","city":"90","area":"24"},{"code":"469025","name":"白沙黎族自治县","province":"46","city":"90","area":"25"},{"code":"469026","name":"昌江黎族自治县","province":"46","city":"90","area":"26"},{"code":"469027","name":"乐东黎族自治县","province":"46","city":"90","area":"27"},{"code":"469028","name":"陵水黎族自治县","province":"46","city":"90","area":"28"},{"code":"469029","name":"保亭黎族苗族自治县","province":"46","city":"90","area":"29"},{"code":"469030","name":"琼中黎族苗族自治县","province":"46","city":"90","area":"30"}]}]},{"code":"500000","name":"重庆市","province":"50","children":[{"code":"500101","name":"万州区","province":"50","city":"01","area":"01"},{"code":"500102","name":"涪陵区","province":"50","city":"01","area":"02"},{"code":"500103","name":"渝中区","province":"50","city":"01","area":"03"},{"code":"500104","name":"大渡口区","province":"50","city":"01","area":"04"},{"code":"500105","name":"江北区","province":"50","city":"01","area":"05"},{"code":"500106","name":"沙坪坝区","province":"50","city":"01","area":"06"},{"code":"500107","name":"九龙坡区","province":"50","city":"01","area":"07"},{"code":"500108","name":"南岸区","province":"50","city":"01","area":"08"},{"code":"500109","name":"北碚区","province":"50","city":"01","area":"09"},{"code":"500110","name":"綦江区","province":"50","city":"01","area":"10"},{"code":"500111","name":"大足区","province":"50","city":"01","area":"11"},{"code":"500112","name":"渝北区","province":"50","city":"01","area":"12"},{"code":"500113","name":"巴南区","province":"50","city":"01","area":"13"},{"code":"500114","name":"黔江区","province":"50","city":"01","area":"14"},{"code":"500115","name":"长寿区","province":"50","city":"01","area":"15"},{"code":"500116","name":"江津区","province":"50","city":"01","area":"16"},{"code":"500117","name":"合川区","province":"50","city":"01","area":"17"},{"code":"500118","name":"永川区","province":"50","city":"01","area":"18"},{"code":"500119","name":"南川区","province":"50","city":"01","area":"19"},{"code":"500120","name":"璧山区","province":"50","city":"01","area":"20"},{"code":"500151","name":"铜梁区","province":"50","city":"01","area":"51"},{"code":"500152","name":"潼南区","province":"50","city":"01","area":"52"},{"code":"500153","name":"荣昌区","province":"50","city":"01","area":"53"},{"code":"500154","name":"开州区","province":"50","city":"01","area":"54"},{"code":"500155","name":"梁平区","province":"50","city":"01","area":"55"},{"code":"500156","name":"武隆区","province":"50","city":"01","area":"56"},{"code":"500229","name":"城口县","province":"50","city":"02","area":"29"},{"code":"500230","name":"丰都县","province":"50","city":"02","area":"30"},{"code":"500231","name":"垫江县","province":"50","city":"02","area":"31"},{"code":"500233","name":"忠县","province":"50","city":"02","area":"33"},{"code":"500235","name":"云阳县","province":"50","city":"02","area":"35"},{"code":"500236","name":"奉节县","province":"50","city":"02","area":"36"},{"code":"500237","name":"巫山县","province":"50","city":"02","area":"37"},{"code":"500238","name":"巫溪县","province":"50","city":"02","area":"38"},{"code":"500240","name":"石柱土家族自治县","province":"50","city":"02","area":"40"},{"code":"500241","name":"秀山土家族苗族自治县","province":"50","city":"02","area":"41"},{"code":"500242","name":"酉阳土家族苗族自治县","province":"50","city":"02","area":"42"},{"code":"500243","name":"彭水苗族土家族自治县","province":"50","city":"02","area":"43"}]},{"code":"510000","name":"四川省","province":"51","children":[{"code":"510100","name":"成都市","province":"51","city":"01","children":[{"code":"510104","name":"锦江区","province":"51","city":"01","area":"04"},{"code":"510105","name":"青羊区","province":"51","city":"01","area":"05"},{"code":"510106","name":"金牛区","province":"51","city":"01","area":"06"},{"code":"510107","name":"武侯区","province":"51","city":"01","area":"07"},{"code":"510108","name":"成华区","province":"51","city":"01","area":"08"},{"code":"510112","name":"龙泉驿区","province":"51","city":"01","area":"12"},{"code":"510113","name":"青白江区","province":"51","city":"01","area":"13"},{"code":"510114","name":"新都区","province":"51","city":"01","area":"14"},{"code":"510115","name":"温江区","province":"51","city":"01","area":"15"},{"code":"510116","name":"双流区","province":"51","city":"01","area":"16"},{"code":"510117","name":"郫都区","province":"51","city":"01","area":"17"},{"code":"510118","name":"新津区","province":"51","city":"01","area":"18"},{"code":"510121","name":"金堂县","province":"51","city":"01","area":"21"},{"code":"510129","name":"大邑县","province":"51","city":"01","area":"29"},{"code":"510131","name":"蒲江县","province":"51","city":"01","area":"31"},{"code":"510181","name":"都江堰市","province":"51","city":"01","area":"81"},{"code":"510182","name":"彭州市","province":"51","city":"01","area":"82"},{"code":"510183","name":"邛崃市","province":"51","city":"01","area":"83"},{"code":"510184","name":"崇州市","province":"51","city":"01","area":"84"},{"code":"510185","name":"简阳市","province":"51","city":"01","area":"85"},{"code":"510101","name":"市辖区","province":"51","city":"01","area":"01"}]},{"code":"510300","name":"自贡市","province":"51","city":"03","children":[{"code":"510302","name":"自流井区","province":"51","city":"03","area":"02"},{"code":"510303","name":"贡井区","province":"51","city":"03","area":"03"},{"code":"510304","name":"大安区","province":"51","city":"03","area":"04"},{"code":"510311","name":"沿滩区","province":"51","city":"03","area":"11"},{"code":"510321","name":"荣县","province":"51","city":"03","area":"21"},{"code":"510322","name":"富顺县","province":"51","city":"03","area":"22"},{"code":"510301","name":"市辖区","province":"51","city":"03","area":"01"}]},{"code":"510400","name":"攀枝花市","province":"51","city":"04","children":[{"code":"510402","name":"东区","province":"51","city":"04","area":"02"},{"code":"510403","name":"西区","province":"51","city":"04","area":"03"},{"code":"510411","name":"仁和区","province":"51","city":"04","area":"11"},{"code":"510421","name":"米易县","province":"51","city":"04","area":"21"},{"code":"510422","name":"盐边县","province":"51","city":"04","area":"22"},{"code":"510401","name":"市辖区","province":"51","city":"04","area":"01"}]},{"code":"510500","name":"泸州市","province":"51","city":"05","children":[{"code":"510502","name":"江阳区","province":"51","city":"05","area":"02"},{"code":"510503","name":"纳溪区","province":"51","city":"05","area":"03"},{"code":"510504","name":"龙马潭区","province":"51","city":"05","area":"04"},{"code":"510521","name":"泸县","province":"51","city":"05","area":"21"},{"code":"510522","name":"合江县","province":"51","city":"05","area":"22"},{"code":"510524","name":"叙永县","province":"51","city":"05","area":"24"},{"code":"510525","name":"古蔺县","province":"51","city":"05","area":"25"},{"code":"510501","name":"市辖区","province":"51","city":"05","area":"01"}]},{"code":"510600","name":"德阳市","province":"51","city":"06","children":[{"code":"510603","name":"旌阳区","province":"51","city":"06","area":"03"},{"code":"510604","name":"罗江区","province":"51","city":"06","area":"04"},{"code":"510623","name":"中江县","province":"51","city":"06","area":"23"},{"code":"510681","name":"广汉市","province":"51","city":"06","area":"81"},{"code":"510682","name":"什邡市","province":"51","city":"06","area":"82"},{"code":"510683","name":"绵竹市","province":"51","city":"06","area":"83"},{"code":"510601","name":"市辖区","province":"51","city":"06","area":"01"}]},{"code":"510700","name":"绵阳市","province":"51","city":"07","children":[{"code":"510703","name":"涪城区","province":"51","city":"07","area":"03"},{"code":"510704","name":"游仙区","province":"51","city":"07","area":"04"},{"code":"510705","name":"安州区","province":"51","city":"07","area":"05"},{"code":"510722","name":"三台县","province":"51","city":"07","area":"22"},{"code":"510723","name":"盐亭县","province":"51","city":"07","area":"23"},{"code":"510725","name":"梓潼县","province":"51","city":"07","area":"25"},{"code":"510726","name":"北川羌族自治县","province":"51","city":"07","area":"26"},{"code":"510727","name":"平武县","province":"51","city":"07","area":"27"},{"code":"510781","name":"江油市","province":"51","city":"07","area":"81"},{"code":"510701","name":"市辖区","province":"51","city":"07","area":"01"}]},{"code":"510800","name":"广元市","province":"51","city":"08","children":[{"code":"510802","name":"利州区","province":"51","city":"08","area":"02"},{"code":"510811","name":"昭化区","province":"51","city":"08","area":"11"},{"code":"510812","name":"朝天区","province":"51","city":"08","area":"12"},{"code":"510821","name":"旺苍县","province":"51","city":"08","area":"21"},{"code":"510822","name":"青川县","province":"51","city":"08","area":"22"},{"code":"510823","name":"剑阁县","province":"51","city":"08","area":"23"},{"code":"510824","name":"苍溪县","province":"51","city":"08","area":"24"},{"code":"510801","name":"市辖区","province":"51","city":"08","area":"01"}]},{"code":"510900","name":"遂宁市","province":"51","city":"09","children":[{"code":"510903","name":"船山区","province":"51","city":"09","area":"03"},{"code":"510904","name":"安居区","province":"51","city":"09","area":"04"},{"code":"510921","name":"蓬溪县","province":"51","city":"09","area":"21"},{"code":"510923","name":"大英县","province":"51","city":"09","area":"23"},{"code":"510981","name":"射洪市","province":"51","city":"09","area":"81"},{"code":"510901","name":"市辖区","province":"51","city":"09","area":"01"}]},{"code":"511000","name":"内江市","province":"51","city":"10","children":[{"code":"511002","name":"市中区","province":"51","city":"10","area":"02"},{"code":"511011","name":"东兴区","province":"51","city":"10","area":"11"},{"code":"511024","name":"威远县","province":"51","city":"10","area":"24"},{"code":"511025","name":"资中县","province":"51","city":"10","area":"25"},{"code":"511083","name":"隆昌市","province":"51","city":"10","area":"83"},{"code":"511001","name":"市辖区","province":"51","city":"10","area":"01"},{"code":"511071","name":"内江经济开发区","province":"51","city":"10","area":"71"}]},{"code":"511100","name":"乐山市","province":"51","city":"11","children":[{"code":"511102","name":"市中区","province":"51","city":"11","area":"02"},{"code":"511111","name":"沙湾区","province":"51","city":"11","area":"11"},{"code":"511112","name":"五通桥区","province":"51","city":"11","area":"12"},{"code":"511113","name":"金口河区","province":"51","city":"11","area":"13"},{"code":"511123","name":"犍为县","province":"51","city":"11","area":"23"},{"code":"511124","name":"井研县","province":"51","city":"11","area":"24"},{"code":"511126","name":"夹江县","province":"51","city":"11","area":"26"},{"code":"511129","name":"沐川县","province":"51","city":"11","area":"29"},{"code":"511132","name":"峨边彝族自治县","province":"51","city":"11","area":"32"},{"code":"511133","name":"马边彝族自治县","province":"51","city":"11","area":"33"},{"code":"511181","name":"峨眉山市","province":"51","city":"11","area":"81"},{"code":"511101","name":"市辖区","province":"51","city":"11","area":"01"}]},{"code":"511300","name":"南充市","province":"51","city":"13","children":[{"code":"511302","name":"顺庆区","province":"51","city":"13","area":"02"},{"code":"511303","name":"高坪区","province":"51","city":"13","area":"03"},{"code":"511304","name":"嘉陵区","province":"51","city":"13","area":"04"},{"code":"511321","name":"南部县","province":"51","city":"13","area":"21"},{"code":"511322","name":"营山县","province":"51","city":"13","area":"22"},{"code":"511323","name":"蓬安县","province":"51","city":"13","area":"23"},{"code":"511324","name":"仪陇县","province":"51","city":"13","area":"24"},{"code":"511325","name":"西充县","province":"51","city":"13","area":"25"},{"code":"511381","name":"阆中市","province":"51","city":"13","area":"81"},{"code":"511301","name":"市辖区","province":"51","city":"13","area":"01"}]},{"code":"511400","name":"眉山市","province":"51","city":"14","children":[{"code":"511402","name":"东坡区","province":"51","city":"14","area":"02"},{"code":"511403","name":"彭山区","province":"51","city":"14","area":"03"},{"code":"511421","name":"仁寿县","province":"51","city":"14","area":"21"},{"code":"511423","name":"洪雅县","province":"51","city":"14","area":"23"},{"code":"511424","name":"丹棱县","province":"51","city":"14","area":"24"},{"code":"511425","name":"青神县","province":"51","city":"14","area":"25"},{"code":"511401","name":"市辖区","province":"51","city":"14","area":"01"}]},{"code":"511500","name":"宜宾市","province":"51","city":"15","children":[{"code":"511502","name":"翠屏区","province":"51","city":"15","area":"02"},{"code":"511503","name":"南溪区","province":"51","city":"15","area":"03"},{"code":"511504","name":"叙州区","province":"51","city":"15","area":"04"},{"code":"511523","name":"江安县","province":"51","city":"15","area":"23"},{"code":"511524","name":"长宁县","province":"51","city":"15","area":"24"},{"code":"511525","name":"高县","province":"51","city":"15","area":"25"},{"code":"511526","name":"珙县","province":"51","city":"15","area":"26"},{"code":"511527","name":"筠连县","province":"51","city":"15","area":"27"},{"code":"511528","name":"兴文县","province":"51","city":"15","area":"28"},{"code":"511529","name":"屏山县","province":"51","city":"15","area":"29"},{"code":"511501","name":"市辖区","province":"51","city":"15","area":"01"}]},{"code":"511600","name":"广安市","province":"51","city":"16","children":[{"code":"511602","name":"广安区","province":"51","city":"16","area":"02"},{"code":"511603","name":"前锋区","province":"51","city":"16","area":"03"},{"code":"511621","name":"岳池县","province":"51","city":"16","area":"21"},{"code":"511622","name":"武胜县","province":"51","city":"16","area":"22"},{"code":"511623","name":"邻水县","province":"51","city":"16","area":"23"},{"code":"511681","name":"华蓥市","province":"51","city":"16","area":"81"},{"code":"511601","name":"市辖区","province":"51","city":"16","area":"01"}]},{"code":"511700","name":"达州市","province":"51","city":"17","children":[{"code":"511702","name":"通川区","province":"51","city":"17","area":"02"},{"code":"511703","name":"达川区","province":"51","city":"17","area":"03"},{"code":"511722","name":"宣汉县","province":"51","city":"17","area":"22"},{"code":"511723","name":"开江县","province":"51","city":"17","area":"23"},{"code":"511724","name":"大竹县","province":"51","city":"17","area":"24"},{"code":"511725","name":"渠县","province":"51","city":"17","area":"25"},{"code":"511781","name":"万源市","province":"51","city":"17","area":"81"},{"code":"511701","name":"市辖区","province":"51","city":"17","area":"01"},{"code":"511771","name":"达州经济开发区","province":"51","city":"17","area":"71"}]},{"code":"511800","name":"雅安市","province":"51","city":"18","children":[{"code":"511802","name":"雨城区","province":"51","city":"18","area":"02"},{"code":"511803","name":"名山区","province":"51","city":"18","area":"03"},{"code":"511822","name":"荥经县","province":"51","city":"18","area":"22"},{"code":"511823","name":"汉源县","province":"51","city":"18","area":"23"},{"code":"511824","name":"石棉县","province":"51","city":"18","area":"24"},{"code":"511825","name":"天全县","province":"51","city":"18","area":"25"},{"code":"511826","name":"芦山县","province":"51","city":"18","area":"26"},{"code":"511827","name":"宝兴县","province":"51","city":"18","area":"27"},{"code":"511801","name":"市辖区","province":"51","city":"18","area":"01"}]},{"code":"511900","name":"巴中市","province":"51","city":"19","children":[{"code":"511902","name":"巴州区","province":"51","city":"19","area":"02"},{"code":"511903","name":"恩阳区","province":"51","city":"19","area":"03"},{"code":"511921","name":"通江县","province":"51","city":"19","area":"21"},{"code":"511922","name":"南江县","province":"51","city":"19","area":"22"},{"code":"511923","name":"平昌县","province":"51","city":"19","area":"23"},{"code":"511901","name":"市辖区","province":"51","city":"19","area":"01"},{"code":"511971","name":"巴中经济开发区","province":"51","city":"19","area":"71"}]},{"code":"512000","name":"资阳市","province":"51","city":"20","children":[{"code":"512002","name":"雁江区","province":"51","city":"20","area":"02"},{"code":"512021","name":"安岳县","province":"51","city":"20","area":"21"},{"code":"512022","name":"乐至县","province":"51","city":"20","area":"22"},{"code":"512001","name":"市辖区","province":"51","city":"20","area":"01"}]},{"code":"513200","name":"阿坝藏族羌族自治州","province":"51","city":"32","children":[{"code":"513201","name":"马尔康市","province":"51","city":"32","area":"01"},{"code":"513221","name":"汶川县","province":"51","city":"32","area":"21"},{"code":"513222","name":"理县","province":"51","city":"32","area":"22"},{"code":"513223","name":"茂县","province":"51","city":"32","area":"23"},{"code":"513224","name":"松潘县","province":"51","city":"32","area":"24"},{"code":"513225","name":"九寨沟县","province":"51","city":"32","area":"25"},{"code":"513226","name":"金川县","province":"51","city":"32","area":"26"},{"code":"513227","name":"小金县","province":"51","city":"32","area":"27"},{"code":"513228","name":"黑水县","province":"51","city":"32","area":"28"},{"code":"513230","name":"壤塘县","province":"51","city":"32","area":"30"},{"code":"513231","name":"阿坝县","province":"51","city":"32","area":"31"},{"code":"513232","name":"若尔盖县","province":"51","city":"32","area":"32"},{"code":"513233","name":"红原县","province":"51","city":"32","area":"33"}]},{"code":"513300","name":"甘孜藏族自治州","province":"51","city":"33","children":[{"code":"513301","name":"康定市","province":"51","city":"33","area":"01"},{"code":"513322","name":"泸定县","province":"51","city":"33","area":"22"},{"code":"513323","name":"丹巴县","province":"51","city":"33","area":"23"},{"code":"513324","name":"九龙县","province":"51","city":"33","area":"24"},{"code":"513325","name":"雅江县","province":"51","city":"33","area":"25"},{"code":"513326","name":"道孚县","province":"51","city":"33","area":"26"},{"code":"513327","name":"炉霍县","province":"51","city":"33","area":"27"},{"code":"513328","name":"甘孜县","province":"51","city":"33","area":"28"},{"code":"513329","name":"新龙县","province":"51","city":"33","area":"29"},{"code":"513330","name":"德格县","province":"51","city":"33","area":"30"},{"code":"513331","name":"白玉县","province":"51","city":"33","area":"31"},{"code":"513332","name":"石渠县","province":"51","city":"33","area":"32"},{"code":"513333","name":"色达县","province":"51","city":"33","area":"33"},{"code":"513334","name":"理塘县","province":"51","city":"33","area":"34"},{"code":"513335","name":"巴塘县","province":"51","city":"33","area":"35"},{"code":"513336","name":"乡城县","province":"51","city":"33","area":"36"},{"code":"513337","name":"稻城县","province":"51","city":"33","area":"37"},{"code":"513338","name":"得荣县","province":"51","city":"33","area":"38"}]},{"code":"513400","name":"凉山彝族自治州","province":"51","city":"34","children":[{"code":"513401","name":"西昌市","province":"51","city":"34","area":"01"},{"code":"513422","name":"木里藏族自治县","province":"51","city":"34","area":"22"},{"code":"513423","name":"盐源县","province":"51","city":"34","area":"23"},{"code":"513424","name":"德昌县","province":"51","city":"34","area":"24"},{"code":"513425","name":"会理县","province":"51","city":"34","area":"25"},{"code":"513426","name":"会东县","province":"51","city":"34","area":"26"},{"code":"513427","name":"宁南县","province":"51","city":"34","area":"27"},{"code":"513428","name":"普格县","province":"51","city":"34","area":"28"},{"code":"513429","name":"布拖县","province":"51","city":"34","area":"29"},{"code":"513430","name":"金阳县","province":"51","city":"34","area":"30"},{"code":"513431","name":"昭觉县","province":"51","city":"34","area":"31"},{"code":"513432","name":"喜德县","province":"51","city":"34","area":"32"},{"code":"513433","name":"冕宁县","province":"51","city":"34","area":"33"},{"code":"513434","name":"越西县","province":"51","city":"34","area":"34"},{"code":"513435","name":"甘洛县","province":"51","city":"34","area":"35"},{"code":"513436","name":"美姑县","province":"51","city":"34","area":"36"},{"code":"513437","name":"雷波县","province":"51","city":"34","area":"37"},{"code":"513402","name":"会理市","province":"51","city":"34","area":"02"}]}]},{"code":"520000","name":"贵州省","province":"52","children":[{"code":"520100","name":"贵阳市","province":"52","city":"01","children":[{"code":"520102","name":"南明区","province":"52","city":"01","area":"02"},{"code":"520103","name":"云岩区","province":"52","city":"01","area":"03"},{"code":"520111","name":"花溪区","province":"52","city":"01","area":"11"},{"code":"520112","name":"乌当区","province":"52","city":"01","area":"12"},{"code":"520113","name":"白云区","province":"52","city":"01","area":"13"},{"code":"520115","name":"观山湖区","province":"52","city":"01","area":"15"},{"code":"520121","name":"开阳县","province":"52","city":"01","area":"21"},{"code":"520122","name":"息烽县","province":"52","city":"01","area":"22"},{"code":"520123","name":"修文县","province":"52","city":"01","area":"23"},{"code":"520181","name":"清镇市","province":"52","city":"01","area":"81"},{"code":"520101","name":"市辖区","province":"52","city":"01","area":"01"}]},{"code":"520200","name":"六盘水市","province":"52","city":"02","children":[{"code":"520201","name":"钟山区","province":"52","city":"02","area":"01"},{"code":"520203","name":"六枝特区","province":"52","city":"02","area":"03"},{"code":"520204","name":"水城区","province":"52","city":"02","area":"04"},{"code":"520281","name":"盘州市","province":"52","city":"02","area":"81"}]},{"code":"520300","name":"遵义市","province":"52","city":"03","children":[{"code":"520302","name":"红花岗区","province":"52","city":"03","area":"02"},{"code":"520303","name":"汇川区","province":"52","city":"03","area":"03"},{"code":"520304","name":"播州区","province":"52","city":"03","area":"04"},{"code":"520322","name":"桐梓县","province":"52","city":"03","area":"22"},{"code":"520323","name":"绥阳县","province":"52","city":"03","area":"23"},{"code":"520324","name":"正安县","province":"52","city":"03","area":"24"},{"code":"520325","name":"道真仡佬族苗族自治县","province":"52","city":"03","area":"25"},{"code":"520326","name":"务川仡佬族苗族自治县","province":"52","city":"03","area":"26"},{"code":"520327","name":"凤冈县","province":"52","city":"03","area":"27"},{"code":"520328","name":"湄潭县","province":"52","city":"03","area":"28"},{"code":"520329","name":"余庆县","province":"52","city":"03","area":"29"},{"code":"520330","name":"习水县","province":"52","city":"03","area":"30"},{"code":"520381","name":"赤水市","province":"52","city":"03","area":"81"},{"code":"520382","name":"仁怀市","province":"52","city":"03","area":"82"},{"code":"520301","name":"市辖区","province":"52","city":"03","area":"01"}]},{"code":"520400","name":"安顺市","province":"52","city":"04","children":[{"code":"520402","name":"西秀区","province":"52","city":"04","area":"02"},{"code":"520403","name":"平坝区","province":"52","city":"04","area":"03"},{"code":"520422","name":"普定县","province":"52","city":"04","area":"22"},{"code":"520423","name":"镇宁布依族苗族自治县","province":"52","city":"04","area":"23"},{"code":"520424","name":"关岭布依族苗族自治县","province":"52","city":"04","area":"24"},{"code":"520425","name":"紫云苗族布依族自治县","province":"52","city":"04","area":"25"},{"code":"520401","name":"市辖区","province":"52","city":"04","area":"01"}]},{"code":"520500","name":"毕节市","province":"52","city":"05","children":[{"code":"520502","name":"七星关区","province":"52","city":"05","area":"02"},{"code":"520521","name":"大方县","province":"52","city":"05","area":"21"},{"code":"520522","name":"黔西县","province":"52","city":"05","area":"22"},{"code":"520523","name":"金沙县","province":"52","city":"05","area":"23"},{"code":"520524","name":"织金县","province":"52","city":"05","area":"24"},{"code":"520525","name":"纳雍县","province":"52","city":"05","area":"25"},{"code":"520526","name":"威宁彝族回族苗族自治县","province":"52","city":"05","area":"26"},{"code":"520527","name":"赫章县","province":"52","city":"05","area":"27"},{"code":"520501","name":"市辖区","province":"52","city":"05","area":"01"},{"code":"520581","name":"黔西市","province":"52","city":"05","area":"81"}]},{"code":"520600","name":"铜仁市","province":"52","city":"06","children":[{"code":"520602","name":"碧江区","province":"52","city":"06","area":"02"},{"code":"520603","name":"万山区","province":"52","city":"06","area":"03"},{"code":"520621","name":"江口县","province":"52","city":"06","area":"21"},{"code":"520622","name":"玉屏侗族自治县","province":"52","city":"06","area":"22"},{"code":"520623","name":"石阡县","province":"52","city":"06","area":"23"},{"code":"520624","name":"思南县","province":"52","city":"06","area":"24"},{"code":"520625","name":"印江土家族苗族自治县","province":"52","city":"06","area":"25"},{"code":"520626","name":"德江县","province":"52","city":"06","area":"26"},{"code":"520627","name":"沿河土家族自治县","province":"52","city":"06","area":"27"},{"code":"520628","name":"松桃苗族自治县","province":"52","city":"06","area":"28"},{"code":"520601","name":"市辖区","province":"52","city":"06","area":"01"}]},{"code":"522300","name":"黔西南布依族苗族自治州","province":"52","city":"23","children":[{"code":"522301","name":"兴义市","province":"52","city":"23","area":"01"},{"code":"522302","name":"兴仁市","province":"52","city":"23","area":"02"},{"code":"522323","name":"普安县","province":"52","city":"23","area":"23"},{"code":"522324","name":"晴隆县","province":"52","city":"23","area":"24"},{"code":"522325","name":"贞丰县","province":"52","city":"23","area":"25"},{"code":"522326","name":"望谟县","province":"52","city":"23","area":"26"},{"code":"522327","name":"册亨县","province":"52","city":"23","area":"27"},{"code":"522328","name":"安龙县","province":"52","city":"23","area":"28"}]},{"code":"522600","name":"黔东南苗族侗族自治州","province":"52","city":"26","children":[{"code":"522601","name":"凯里市","province":"52","city":"26","area":"01"},{"code":"522622","name":"黄平县","province":"52","city":"26","area":"22"},{"code":"522623","name":"施秉县","province":"52","city":"26","area":"23"},{"code":"522624","name":"三穗县","province":"52","city":"26","area":"24"},{"code":"522625","name":"镇远县","province":"52","city":"26","area":"25"},{"code":"522626","name":"岑巩县","province":"52","city":"26","area":"26"},{"code":"522627","name":"天柱县","province":"52","city":"26","area":"27"},{"code":"522628","name":"锦屏县","province":"52","city":"26","area":"28"},{"code":"522629","name":"剑河县","province":"52","city":"26","area":"29"},{"code":"522630","name":"台江县","province":"52","city":"26","area":"30"},{"code":"522631","name":"黎平县","province":"52","city":"26","area":"31"},{"code":"522632","name":"榕江县","province":"52","city":"26","area":"32"},{"code":"522633","name":"从江县","province":"52","city":"26","area":"33"},{"code":"522634","name":"雷山县","province":"52","city":"26","area":"34"},{"code":"522635","name":"麻江县","province":"52","city":"26","area":"35"},{"code":"522636","name":"丹寨县","province":"52","city":"26","area":"36"}]},{"code":"522700","name":"黔南布依族苗族自治州","province":"52","city":"27","children":[{"code":"522701","name":"都匀市","province":"52","city":"27","area":"01"},{"code":"522702","name":"福泉市","province":"52","city":"27","area":"02"},{"code":"522722","name":"荔波县","province":"52","city":"27","area":"22"},{"code":"522723","name":"贵定县","province":"52","city":"27","area":"23"},{"code":"522725","name":"瓮安县","province":"52","city":"27","area":"25"},{"code":"522726","name":"独山县","province":"52","city":"27","area":"26"},{"code":"522727","name":"平塘县","province":"52","city":"27","area":"27"},{"code":"522728","name":"罗甸县","province":"52","city":"27","area":"28"},{"code":"522729","name":"长顺县","province":"52","city":"27","area":"29"},{"code":"522730","name":"龙里县","province":"52","city":"27","area":"30"},{"code":"522731","name":"惠水县","province":"52","city":"27","area":"31"},{"code":"522732","name":"三都水族自治县","province":"52","city":"27","area":"32"}]}]},{"code":"530000","name":"云南省","province":"53","children":[{"code":"530100","name":"昆明市","province":"53","city":"01","children":[{"code":"530102","name":"五华区","province":"53","city":"01","area":"02"},{"code":"530103","name":"盘龙区","province":"53","city":"01","area":"03"},{"code":"530111","name":"官渡区","province":"53","city":"01","area":"11"},{"code":"530112","name":"西山区","province":"53","city":"01","area":"12"},{"code":"530113","name":"东川区","province":"53","city":"01","area":"13"},{"code":"530114","name":"呈贡区","province":"53","city":"01","area":"14"},{"code":"530115","name":"晋宁区","province":"53","city":"01","area":"15"},{"code":"530124","name":"富民县","province":"53","city":"01","area":"24"},{"code":"530125","name":"宜良县","province":"53","city":"01","area":"25"},{"code":"530126","name":"石林彝族自治县","province":"53","city":"01","area":"26"},{"code":"530127","name":"嵩明县","province":"53","city":"01","area":"27"},{"code":"530128","name":"禄劝彝族苗族自治县","province":"53","city":"01","area":"28"},{"code":"530129","name":"寻甸回族彝族自治县","province":"53","city":"01","area":"29"},{"code":"530181","name":"安宁市","province":"53","city":"01","area":"81"},{"code":"530101","name":"市辖区","province":"53","city":"01","area":"01"}]},{"code":"530300","name":"曲靖市","province":"53","city":"03","children":[{"code":"530302","name":"麒麟区","province":"53","city":"03","area":"02"},{"code":"530303","name":"沾益区","province":"53","city":"03","area":"03"},{"code":"530304","name":"马龙区","province":"53","city":"03","area":"04"},{"code":"530322","name":"陆良县","province":"53","city":"03","area":"22"},{"code":"530323","name":"师宗县","province":"53","city":"03","area":"23"},{"code":"530324","name":"罗平县","province":"53","city":"03","area":"24"},{"code":"530325","name":"富源县","province":"53","city":"03","area":"25"},{"code":"530326","name":"会泽县","province":"53","city":"03","area":"26"},{"code":"530381","name":"宣威市","province":"53","city":"03","area":"81"},{"code":"530301","name":"市辖区","province":"53","city":"03","area":"01"}]},{"code":"530400","name":"玉溪市","province":"53","city":"04","children":[{"code":"530402","name":"红塔区","province":"53","city":"04","area":"02"},{"code":"530403","name":"江川区","province":"53","city":"04","area":"03"},{"code":"530423","name":"通海县","province":"53","city":"04","area":"23"},{"code":"530424","name":"华宁县","province":"53","city":"04","area":"24"},{"code":"530425","name":"易门县","province":"53","city":"04","area":"25"},{"code":"530426","name":"峨山彝族自治县","province":"53","city":"04","area":"26"},{"code":"530427","name":"新平彝族傣族自治县","province":"53","city":"04","area":"27"},{"code":"530428","name":"元江哈尼族彝族傣族自治县","province":"53","city":"04","area":"28"},{"code":"530481","name":"澄江市","province":"53","city":"04","area":"81"},{"code":"530401","name":"市辖区","province":"53","city":"04","area":"01"}]},{"code":"530500","name":"保山市","province":"53","city":"05","children":[{"code":"530502","name":"隆阳区","province":"53","city":"05","area":"02"},{"code":"530521","name":"施甸县","province":"53","city":"05","area":"21"},{"code":"530523","name":"龙陵县","province":"53","city":"05","area":"23"},{"code":"530524","name":"昌宁县","province":"53","city":"05","area":"24"},{"code":"530581","name":"腾冲市","province":"53","city":"05","area":"81"},{"code":"530501","name":"市辖区","province":"53","city":"05","area":"01"}]},{"code":"530600","name":"昭通市","province":"53","city":"06","children":[{"code":"530602","name":"昭阳区","province":"53","city":"06","area":"02"},{"code":"530621","name":"鲁甸县","province":"53","city":"06","area":"21"},{"code":"530622","name":"巧家县","province":"53","city":"06","area":"22"},{"code":"530623","name":"盐津县","province":"53","city":"06","area":"23"},{"code":"530624","name":"大关县","province":"53","city":"06","area":"24"},{"code":"530625","name":"永善县","province":"53","city":"06","area":"25"},{"code":"530626","name":"绥江县","province":"53","city":"06","area":"26"},{"code":"530627","name":"镇雄县","province":"53","city":"06","area":"27"},{"code":"530628","name":"彝良县","province":"53","city":"06","area":"28"},{"code":"530629","name":"威信县","province":"53","city":"06","area":"29"},{"code":"530681","name":"水富市","province":"53","city":"06","area":"81"},{"code":"530601","name":"市辖区","province":"53","city":"06","area":"01"}]},{"code":"530700","name":"丽江市","province":"53","city":"07","children":[{"code":"530702","name":"古城区","province":"53","city":"07","area":"02"},{"code":"530721","name":"玉龙纳西族自治县","province":"53","city":"07","area":"21"},{"code":"530722","name":"永胜县","province":"53","city":"07","area":"22"},{"code":"530723","name":"华坪县","province":"53","city":"07","area":"23"},{"code":"530724","name":"宁蒗彝族自治县","province":"53","city":"07","area":"24"},{"code":"530701","name":"市辖区","province":"53","city":"07","area":"01"}]},{"code":"530800","name":"普洱市","province":"53","city":"08","children":[{"code":"530802","name":"思茅区","province":"53","city":"08","area":"02"},{"code":"530821","name":"宁洱哈尼族彝族自治县","province":"53","city":"08","area":"21"},{"code":"530822","name":"墨江哈尼族自治县","province":"53","city":"08","area":"22"},{"code":"530823","name":"景东彝族自治县","province":"53","city":"08","area":"23"},{"code":"530824","name":"景谷傣族彝族自治县","province":"53","city":"08","area":"24"},{"code":"530825","name":"镇沅彝族哈尼族拉祜族自治县","province":"53","city":"08","area":"25"},{"code":"530826","name":"江城哈尼族彝族自治县","province":"53","city":"08","area":"26"},{"code":"530827","name":"孟连傣族拉祜族佤族自治县","province":"53","city":"08","area":"27"},{"code":"530828","name":"澜沧拉祜族自治县","province":"53","city":"08","area":"28"},{"code":"530829","name":"西盟佤族自治县","province":"53","city":"08","area":"29"},{"code":"530801","name":"市辖区","province":"53","city":"08","area":"01"}]},{"code":"530900","name":"临沧市","province":"53","city":"09","children":[{"code":"530902","name":"临翔区","province":"53","city":"09","area":"02"},{"code":"530921","name":"凤庆县","province":"53","city":"09","area":"21"},{"code":"530922","name":"云县","province":"53","city":"09","area":"22"},{"code":"530923","name":"永德县","province":"53","city":"09","area":"23"},{"code":"530924","name":"镇康县","province":"53","city":"09","area":"24"},{"code":"530925","name":"双江拉祜族佤族布朗族傣族自治县","province":"53","city":"09","area":"25"},{"code":"530926","name":"耿马傣族佤族自治县","province":"53","city":"09","area":"26"},{"code":"530927","name":"沧源佤族自治县","province":"53","city":"09","area":"27"},{"code":"530901","name":"市辖区","province":"53","city":"09","area":"01"}]},{"code":"532300","name":"楚雄彝族自治州","province":"53","city":"23","children":[{"code":"532301","name":"楚雄市","province":"53","city":"23","area":"01"},{"code":"532322","name":"双柏县","province":"53","city":"23","area":"22"},{"code":"532323","name":"牟定县","province":"53","city":"23","area":"23"},{"code":"532324","name":"南华县","province":"53","city":"23","area":"24"},{"code":"532325","name":"姚安县","province":"53","city":"23","area":"25"},{"code":"532326","name":"大姚县","province":"53","city":"23","area":"26"},{"code":"532327","name":"永仁县","province":"53","city":"23","area":"27"},{"code":"532328","name":"元谋县","province":"53","city":"23","area":"28"},{"code":"532329","name":"武定县","province":"53","city":"23","area":"29"},{"code":"532331","name":"禄丰县","province":"53","city":"23","area":"31"},{"code":"532302","name":"禄丰市","province":"53","city":"23","area":"02"}]},{"code":"532500","name":"红河哈尼族彝族自治州","province":"53","city":"25","children":[{"code":"532501","name":"个旧市","province":"53","city":"25","area":"01"},{"code":"532502","name":"开远市","province":"53","city":"25","area":"02"},{"code":"532503","name":"蒙自市","province":"53","city":"25","area":"03"},{"code":"532504","name":"弥勒市","province":"53","city":"25","area":"04"},{"code":"532523","name":"屏边苗族自治县","province":"53","city":"25","area":"23"},{"code":"532524","name":"建水县","province":"53","city":"25","area":"24"},{"code":"532525","name":"石屏县","province":"53","city":"25","area":"25"},{"code":"532527","name":"泸西县","province":"53","city":"25","area":"27"},{"code":"532528","name":"元阳县","province":"53","city":"25","area":"28"},{"code":"532529","name":"红河县","province":"53","city":"25","area":"29"},{"code":"532530","name":"金平苗族瑶族傣族自治县","province":"53","city":"25","area":"30"},{"code":"532531","name":"绿春县","province":"53","city":"25","area":"31"},{"code":"532532","name":"河口瑶族自治县","province":"53","city":"25","area":"32"}]},{"code":"532600","name":"文山壮族苗族自治州","province":"53","city":"26","children":[{"code":"532601","name":"文山市","province":"53","city":"26","area":"01"},{"code":"532622","name":"砚山县","province":"53","city":"26","area":"22"},{"code":"532623","name":"西畴县","province":"53","city":"26","area":"23"},{"code":"532624","name":"麻栗坡县","province":"53","city":"26","area":"24"},{"code":"532625","name":"马关县","province":"53","city":"26","area":"25"},{"code":"532626","name":"丘北县","province":"53","city":"26","area":"26"},{"code":"532627","name":"广南县","province":"53","city":"26","area":"27"},{"code":"532628","name":"富宁县","province":"53","city":"26","area":"28"}]},{"code":"532800","name":"西双版纳傣族自治州","province":"53","city":"28","children":[{"code":"532801","name":"景洪市","province":"53","city":"28","area":"01"},{"code":"532822","name":"勐海县","province":"53","city":"28","area":"22"},{"code":"532823","name":"勐腊县","province":"53","city":"28","area":"23"}]},{"code":"532900","name":"大理白族自治州","province":"53","city":"29","children":[{"code":"532901","name":"大理市","province":"53","city":"29","area":"01"},{"code":"532922","name":"漾濞彝族自治县","province":"53","city":"29","area":"22"},{"code":"532923","name":"祥云县","province":"53","city":"29","area":"23"},{"code":"532924","name":"宾川县","province":"53","city":"29","area":"24"},{"code":"532925","name":"弥渡县","province":"53","city":"29","area":"25"},{"code":"532926","name":"南涧彝族自治县","province":"53","city":"29","area":"26"},{"code":"532927","name":"巍山彝族回族自治县","province":"53","city":"29","area":"27"},{"code":"532928","name":"永平县","province":"53","city":"29","area":"28"},{"code":"532929","name":"云龙县","province":"53","city":"29","area":"29"},{"code":"532930","name":"洱源县","province":"53","city":"29","area":"30"},{"code":"532931","name":"剑川县","province":"53","city":"29","area":"31"},{"code":"532932","name":"鹤庆县","province":"53","city":"29","area":"32"}]},{"code":"533100","name":"德宏傣族景颇族自治州","province":"53","city":"31","children":[{"code":"533102","name":"瑞丽市","province":"53","city":"31","area":"02"},{"code":"533103","name":"芒市","province":"53","city":"31","area":"03"},{"code":"533122","name":"梁河县","province":"53","city":"31","area":"22"},{"code":"533123","name":"盈江县","province":"53","city":"31","area":"23"},{"code":"533124","name":"陇川县","province":"53","city":"31","area":"24"}]},{"code":"533300","name":"怒江傈僳族自治州","province":"53","city":"33","children":[{"code":"533301","name":"泸水市","province":"53","city":"33","area":"01"},{"code":"533323","name":"福贡县","province":"53","city":"33","area":"23"},{"code":"533324","name":"贡山独龙族怒族自治县","province":"53","city":"33","area":"24"},{"code":"533325","name":"兰坪白族普米族自治县","province":"53","city":"33","area":"25"}]},{"code":"533400","name":"迪庆藏族自治州","province":"53","city":"34","children":[{"code":"533401","name":"香格里拉市","province":"53","city":"34","area":"01"},{"code":"533422","name":"德钦县","province":"53","city":"34","area":"22"},{"code":"533423","name":"维西傈僳族自治县","province":"53","city":"34","area":"23"}]}]},{"code":"540000","name":"西藏自治区","province":"54","children":[{"code":"540100","name":"拉萨市","province":"54","city":"01","children":[{"code":"540102","name":"城关区","province":"54","city":"01","area":"02"},{"code":"540103","name":"堆龙德庆区","province":"54","city":"01","area":"03"},{"code":"540104","name":"达孜区","province":"54","city":"01","area":"04"},{"code":"540121","name":"林周县","province":"54","city":"01","area":"21"},{"code":"540122","name":"当雄县","province":"54","city":"01","area":"22"},{"code":"540123","name":"尼木县","province":"54","city":"01","area":"23"},{"code":"540124","name":"曲水县","province":"54","city":"01","area":"24"},{"code":"540127","name":"墨竹工卡县","province":"54","city":"01","area":"27"},{"code":"540101","name":"市辖区","province":"54","city":"01","area":"01"},{"code":"540171","name":"格尔木藏青工业园区","province":"54","city":"01","area":"71"},{"code":"540172","name":"拉萨经济技术开发区","province":"54","city":"01","area":"72"},{"code":"540173","name":"西藏文化旅游创意园区","province":"54","city":"01","area":"73"},{"code":"540174","name":"达孜工业园区","province":"54","city":"01","area":"74"}]},{"code":"540200","name":"日喀则市","province":"54","city":"02","children":[{"code":"540202","name":"桑珠孜区","province":"54","city":"02","area":"02"},{"code":"540221","name":"南木林县","province":"54","city":"02","area":"21"},{"code":"540222","name":"江孜县","province":"54","city":"02","area":"22"},{"code":"540223","name":"定日县","province":"54","city":"02","area":"23"},{"code":"540224","name":"萨迦县","province":"54","city":"02","area":"24"},{"code":"540225","name":"拉孜县","province":"54","city":"02","area":"25"},{"code":"540226","name":"昂仁县","province":"54","city":"02","area":"26"},{"code":"540227","name":"谢通门县","province":"54","city":"02","area":"27"},{"code":"540228","name":"白朗县","province":"54","city":"02","area":"28"},{"code":"540229","name":"仁布县","province":"54","city":"02","area":"29"},{"code":"540230","name":"康马县","province":"54","city":"02","area":"30"},{"code":"540231","name":"定结县","province":"54","city":"02","area":"31"},{"code":"540232","name":"仲巴县","province":"54","city":"02","area":"32"},{"code":"540233","name":"亚东县","province":"54","city":"02","area":"33"},{"code":"540234","name":"吉隆县","province":"54","city":"02","area":"34"},{"code":"540235","name":"聂拉木县","province":"54","city":"02","area":"35"},{"code":"540236","name":"萨嘎县","province":"54","city":"02","area":"36"},{"code":"540237","name":"岗巴县","province":"54","city":"02","area":"37"}]},{"code":"540300","name":"昌都市","province":"54","city":"03","children":[{"code":"540302","name":"卡若区","province":"54","city":"03","area":"02"},{"code":"540321","name":"江达县","province":"54","city":"03","area":"21"},{"code":"540322","name":"贡觉县","province":"54","city":"03","area":"22"},{"code":"540323","name":"类乌齐县","province":"54","city":"03","area":"23"},{"code":"540324","name":"丁青县","province":"54","city":"03","area":"24"},{"code":"540325","name":"察雅县","province":"54","city":"03","area":"25"},{"code":"540326","name":"八宿县","province":"54","city":"03","area":"26"},{"code":"540327","name":"左贡县","province":"54","city":"03","area":"27"},{"code":"540328","name":"芒康县","province":"54","city":"03","area":"28"},{"code":"540329","name":"洛隆县","province":"54","city":"03","area":"29"},{"code":"540330","name":"边坝县","province":"54","city":"03","area":"30"}]},{"code":"540400","name":"林芝市","province":"54","city":"04","children":[{"code":"540402","name":"巴宜区","province":"54","city":"04","area":"02"},{"code":"540421","name":"工布江达县","province":"54","city":"04","area":"21"},{"code":"540422","name":"米林县","province":"54","city":"04","area":"22"},{"code":"540423","name":"墨脱县","province":"54","city":"04","area":"23"},{"code":"540424","name":"波密县","province":"54","city":"04","area":"24"},{"code":"540425","name":"察隅县","province":"54","city":"04","area":"25"},{"code":"540426","name":"朗县","province":"54","city":"04","area":"26"}]},{"code":"540500","name":"山南市","province":"54","city":"05","children":[{"code":"540502","name":"乃东区","province":"54","city":"05","area":"02"},{"code":"540521","name":"扎囊县","province":"54","city":"05","area":"21"},{"code":"540522","name":"贡嘎县","province":"54","city":"05","area":"22"},{"code":"540523","name":"桑日县","province":"54","city":"05","area":"23"},{"code":"540524","name":"琼结县","province":"54","city":"05","area":"24"},{"code":"540525","name":"曲松县","province":"54","city":"05","area":"25"},{"code":"540526","name":"措美县","province":"54","city":"05","area":"26"},{"code":"540527","name":"洛扎县","province":"54","city":"05","area":"27"},{"code":"540528","name":"加查县","province":"54","city":"05","area":"28"},{"code":"540529","name":"隆子县","province":"54","city":"05","area":"29"},{"code":"540530","name":"错那县","province":"54","city":"05","area":"30"},{"code":"540531","name":"浪卡子县","province":"54","city":"05","area":"31"},{"code":"540501","name":"市辖区","province":"54","city":"05","area":"01"}]},{"code":"540600","name":"那曲市","province":"54","city":"06","children":[{"code":"540602","name":"色尼区","province":"54","city":"06","area":"02"},{"code":"540621","name":"嘉黎县","province":"54","city":"06","area":"21"},{"code":"540622","name":"比如县","province":"54","city":"06","area":"22"},{"code":"540623","name":"聂荣县","province":"54","city":"06","area":"23"},{"code":"540624","name":"安多县","province":"54","city":"06","area":"24"},{"code":"540625","name":"申扎县","province":"54","city":"06","area":"25"},{"code":"540626","name":"索县","province":"54","city":"06","area":"26"},{"code":"540627","name":"班戈县","province":"54","city":"06","area":"27"},{"code":"540628","name":"巴青县","province":"54","city":"06","area":"28"},{"code":"540629","name":"尼玛县","province":"54","city":"06","area":"29"},{"code":"540630","name":"双湖县","province":"54","city":"06","area":"30"}]},{"code":"542500","name":"阿里地区","province":"54","city":"25","children":[{"code":"542521","name":"普兰县","province":"54","city":"25","area":"21"},{"code":"542522","name":"札达县","province":"54","city":"25","area":"22"},{"code":"542523","name":"噶尔县","province":"54","city":"25","area":"23"},{"code":"542524","name":"日土县","province":"54","city":"25","area":"24"},{"code":"542525","name":"革吉县","province":"54","city":"25","area":"25"},{"code":"542526","name":"改则县","province":"54","city":"25","area":"26"},{"code":"542527","name":"措勤县","province":"54","city":"25","area":"27"}]}]},{"code":"610000","name":"陕西省","province":"61","children":[{"code":"610100","name":"西安市","province":"61","city":"01","children":[{"code":"610102","name":"新城区","province":"61","city":"01","area":"02"},{"code":"610103","name":"碑林区","province":"61","city":"01","area":"03"},{"code":"610104","name":"莲湖区","province":"61","city":"01","area":"04"},{"code":"610111","name":"灞桥区","province":"61","city":"01","area":"11"},{"code":"610112","name":"未央区","province":"61","city":"01","area":"12"},{"code":"610113","name":"雁塔区","province":"61","city":"01","area":"13"},{"code":"610114","name":"阎良区","province":"61","city":"01","area":"14"},{"code":"610115","name":"临潼区","province":"61","city":"01","area":"15"},{"code":"610116","name":"长安区","province":"61","city":"01","area":"16"},{"code":"610117","name":"高陵区","province":"61","city":"01","area":"17"},{"code":"610118","name":"鄠邑区","province":"61","city":"01","area":"18"},{"code":"610122","name":"蓝田县","province":"61","city":"01","area":"22"},{"code":"610124","name":"周至县","province":"61","city":"01","area":"24"},{"code":"610101","name":"市辖区","province":"61","city":"01","area":"01"}]},{"code":"610200","name":"铜川市","province":"61","city":"02","children":[{"code":"610202","name":"王益区","province":"61","city":"02","area":"02"},{"code":"610203","name":"印台区","province":"61","city":"02","area":"03"},{"code":"610204","name":"耀州区","province":"61","city":"02","area":"04"},{"code":"610222","name":"宜君县","province":"61","city":"02","area":"22"},{"code":"610201","name":"市辖区","province":"61","city":"02","area":"01"}]},{"code":"610300","name":"宝鸡市","province":"61","city":"03","children":[{"code":"610302","name":"渭滨区","province":"61","city":"03","area":"02"},{"code":"610303","name":"金台区","province":"61","city":"03","area":"03"},{"code":"610304","name":"陈仓区","province":"61","city":"03","area":"04"},{"code":"610322","name":"凤翔县","province":"61","city":"03","area":"22"},{"code":"610323","name":"岐山县","province":"61","city":"03","area":"23"},{"code":"610324","name":"扶风县","province":"61","city":"03","area":"24"},{"code":"610326","name":"眉县","province":"61","city":"03","area":"26"},{"code":"610327","name":"陇县","province":"61","city":"03","area":"27"},{"code":"610328","name":"千阳县","province":"61","city":"03","area":"28"},{"code":"610329","name":"麟游县","province":"61","city":"03","area":"29"},{"code":"610330","name":"凤县","province":"61","city":"03","area":"30"},{"code":"610331","name":"太白县","province":"61","city":"03","area":"31"},{"code":"610301","name":"市辖区","province":"61","city":"03","area":"01"},{"code":"610305","name":"凤翔区","province":"61","city":"03","area":"05"}]},{"code":"610400","name":"咸阳市","province":"61","city":"04","children":[{"code":"610402","name":"秦都区","province":"61","city":"04","area":"02"},{"code":"610403","name":"杨陵区","province":"61","city":"04","area":"03"},{"code":"610404","name":"渭城区","province":"61","city":"04","area":"04"},{"code":"610422","name":"三原县","province":"61","city":"04","area":"22"},{"code":"610423","name":"泾阳县","province":"61","city":"04","area":"23"},{"code":"610424","name":"乾县","province":"61","city":"04","area":"24"},{"code":"610425","name":"礼泉县","province":"61","city":"04","area":"25"},{"code":"610426","name":"永寿县","province":"61","city":"04","area":"26"},{"code":"610428","name":"长武县","province":"61","city":"04","area":"28"},{"code":"610429","name":"旬邑县","province":"61","city":"04","area":"29"},{"code":"610430","name":"淳化县","province":"61","city":"04","area":"30"},{"code":"610431","name":"武功县","province":"61","city":"04","area":"31"},{"code":"610481","name":"兴平市","province":"61","city":"04","area":"81"},{"code":"610482","name":"彬州市","province":"61","city":"04","area":"82"},{"code":"610401","name":"市辖区","province":"61","city":"04","area":"01"}]},{"code":"610500","name":"渭南市","province":"61","city":"05","children":[{"code":"610502","name":"临渭区","province":"61","city":"05","area":"02"},{"code":"610503","name":"华州区","province":"61","city":"05","area":"03"},{"code":"610522","name":"潼关县","province":"61","city":"05","area":"22"},{"code":"610523","name":"大荔县","province":"61","city":"05","area":"23"},{"code":"610524","name":"合阳县","province":"61","city":"05","area":"24"},{"code":"610525","name":"澄城县","province":"61","city":"05","area":"25"},{"code":"610526","name":"蒲城县","province":"61","city":"05","area":"26"},{"code":"610527","name":"白水县","province":"61","city":"05","area":"27"},{"code":"610528","name":"富平县","province":"61","city":"05","area":"28"},{"code":"610581","name":"韩城市","province":"61","city":"05","area":"81"},{"code":"610582","name":"华阴市","province":"61","city":"05","area":"82"},{"code":"610501","name":"市辖区","province":"61","city":"05","area":"01"}]},{"code":"610600","name":"延安市","province":"61","city":"06","children":[{"code":"610602","name":"宝塔区","province":"61","city":"06","area":"02"},{"code":"610603","name":"安塞区","province":"61","city":"06","area":"03"},{"code":"610621","name":"延长县","province":"61","city":"06","area":"21"},{"code":"610622","name":"延川县","province":"61","city":"06","area":"22"},{"code":"610625","name":"志丹县","province":"61","city":"06","area":"25"},{"code":"610626","name":"吴起县","province":"61","city":"06","area":"26"},{"code":"610627","name":"甘泉县","province":"61","city":"06","area":"27"},{"code":"610628","name":"富县","province":"61","city":"06","area":"28"},{"code":"610629","name":"洛川县","province":"61","city":"06","area":"29"},{"code":"610630","name":"宜川县","province":"61","city":"06","area":"30"},{"code":"610631","name":"黄龙县","province":"61","city":"06","area":"31"},{"code":"610632","name":"黄陵县","province":"61","city":"06","area":"32"},{"code":"610681","name":"子长市","province":"61","city":"06","area":"81"},{"code":"610601","name":"市辖区","province":"61","city":"06","area":"01"}]},{"code":"610700","name":"汉中市","province":"61","city":"07","children":[{"code":"610702","name":"汉台区","province":"61","city":"07","area":"02"},{"code":"610703","name":"南郑区","province":"61","city":"07","area":"03"},{"code":"610722","name":"城固县","province":"61","city":"07","area":"22"},{"code":"610723","name":"洋县","province":"61","city":"07","area":"23"},{"code":"610724","name":"西乡县","province":"61","city":"07","area":"24"},{"code":"610725","name":"勉县","province":"61","city":"07","area":"25"},{"code":"610726","name":"宁强县","province":"61","city":"07","area":"26"},{"code":"610727","name":"略阳县","province":"61","city":"07","area":"27"},{"code":"610728","name":"镇巴县","province":"61","city":"07","area":"28"},{"code":"610729","name":"留坝县","province":"61","city":"07","area":"29"},{"code":"610730","name":"佛坪县","province":"61","city":"07","area":"30"},{"code":"610701","name":"市辖区","province":"61","city":"07","area":"01"}]},{"code":"610800","name":"榆林市","province":"61","city":"08","children":[{"code":"610802","name":"榆阳区","province":"61","city":"08","area":"02"},{"code":"610803","name":"横山区","province":"61","city":"08","area":"03"},{"code":"610822","name":"府谷县","province":"61","city":"08","area":"22"},{"code":"610824","name":"靖边县","province":"61","city":"08","area":"24"},{"code":"610825","name":"定边县","province":"61","city":"08","area":"25"},{"code":"610826","name":"绥德县","province":"61","city":"08","area":"26"},{"code":"610827","name":"米脂县","province":"61","city":"08","area":"27"},{"code":"610828","name":"佳县","province":"61","city":"08","area":"28"},{"code":"610829","name":"吴堡县","province":"61","city":"08","area":"29"},{"code":"610830","name":"清涧县","province":"61","city":"08","area":"30"},{"code":"610831","name":"子洲县","province":"61","city":"08","area":"31"},{"code":"610881","name":"神木市","province":"61","city":"08","area":"81"},{"code":"610801","name":"市辖区","province":"61","city":"08","area":"01"}]},{"code":"610900","name":"安康市","province":"61","city":"09","children":[{"code":"610902","name":"汉滨区","province":"61","city":"09","area":"02"},{"code":"610921","name":"汉阴县","province":"61","city":"09","area":"21"},{"code":"610922","name":"石泉县","province":"61","city":"09","area":"22"},{"code":"610923","name":"宁陕县","province":"61","city":"09","area":"23"},{"code":"610924","name":"紫阳县","province":"61","city":"09","area":"24"},{"code":"610925","name":"岚皋县","province":"61","city":"09","area":"25"},{"code":"610926","name":"平利县","province":"61","city":"09","area":"26"},{"code":"610927","name":"镇坪县","province":"61","city":"09","area":"27"},{"code":"610928","name":"旬阳县","province":"61","city":"09","area":"28"},{"code":"610929","name":"白河县","province":"61","city":"09","area":"29"},{"code":"610901","name":"市辖区","province":"61","city":"09","area":"01"},{"code":"610981","name":"旬阳市","province":"61","city":"09","area":"81"}]},{"code":"611000","name":"商洛市","province":"61","city":"10","children":[{"code":"611002","name":"商州区","province":"61","city":"10","area":"02"},{"code":"611021","name":"洛南县","province":"61","city":"10","area":"21"},{"code":"611022","name":"丹凤县","province":"61","city":"10","area":"22"},{"code":"611023","name":"商南县","province":"61","city":"10","area":"23"},{"code":"611024","name":"山阳县","province":"61","city":"10","area":"24"},{"code":"611025","name":"镇安县","province":"61","city":"10","area":"25"},{"code":"611026","name":"柞水县","province":"61","city":"10","area":"26"},{"code":"611001","name":"市辖区","province":"61","city":"10","area":"01"}]}]},{"code":"620000","name":"甘肃省","province":"62","children":[{"code":"620100","name":"兰州市","province":"62","city":"01","children":[{"code":"620102","name":"城关区","province":"62","city":"01","area":"02"},{"code":"620103","name":"七里河区","province":"62","city":"01","area":"03"},{"code":"620104","name":"西固区","province":"62","city":"01","area":"04"},{"code":"620105","name":"安宁区","province":"62","city":"01","area":"05"},{"code":"620111","name":"红古区","province":"62","city":"01","area":"11"},{"code":"620121","name":"永登县","province":"62","city":"01","area":"21"},{"code":"620122","name":"皋兰县","province":"62","city":"01","area":"22"},{"code":"620123","name":"榆中县","province":"62","city":"01","area":"23"},{"code":"620101","name":"市辖区","province":"62","city":"01","area":"01"},{"code":"620171","name":"兰州新区","province":"62","city":"01","area":"71"}]},{"code":"620200","name":"嘉峪关市","province":"62","city":"02","children":[{"code":"620201","name":"市辖区","province":"62","city":"02","area":"01"}]},{"code":"620300","name":"金昌市","province":"62","city":"03","children":[{"code":"620302","name":"金川区","province":"62","city":"03","area":"02"},{"code":"620321","name":"永昌县","province":"62","city":"03","area":"21"},{"code":"620301","name":"市辖区","province":"62","city":"03","area":"01"}]},{"code":"620400","name":"白银市","province":"62","city":"04","children":[{"code":"620402","name":"白银区","province":"62","city":"04","area":"02"},{"code":"620403","name":"平川区","province":"62","city":"04","area":"03"},{"code":"620421","name":"靖远县","province":"62","city":"04","area":"21"},{"code":"620422","name":"会宁县","province":"62","city":"04","area":"22"},{"code":"620423","name":"景泰县","province":"62","city":"04","area":"23"},{"code":"620401","name":"市辖区","province":"62","city":"04","area":"01"}]},{"code":"620500","name":"天水市","province":"62","city":"05","children":[{"code":"620502","name":"秦州区","province":"62","city":"05","area":"02"},{"code":"620503","name":"麦积区","province":"62","city":"05","area":"03"},{"code":"620521","name":"清水县","province":"62","city":"05","area":"21"},{"code":"620522","name":"秦安县","province":"62","city":"05","area":"22"},{"code":"620523","name":"甘谷县","province":"62","city":"05","area":"23"},{"code":"620524","name":"武山县","province":"62","city":"05","area":"24"},{"code":"620525","name":"张家川回族自治县","province":"62","city":"05","area":"25"},{"code":"620501","name":"市辖区","province":"62","city":"05","area":"01"}]},{"code":"620600","name":"武威市","province":"62","city":"06","children":[{"code":"620602","name":"凉州区","province":"62","city":"06","area":"02"},{"code":"620621","name":"民勤县","province":"62","city":"06","area":"21"},{"code":"620622","name":"古浪县","province":"62","city":"06","area":"22"},{"code":"620623","name":"天祝藏族自治县","province":"62","city":"06","area":"23"},{"code":"620601","name":"市辖区","province":"62","city":"06","area":"01"}]},{"code":"620700","name":"张掖市","province":"62","city":"07","children":[{"code":"620702","name":"甘州区","province":"62","city":"07","area":"02"},{"code":"620721","name":"肃南裕固族自治县","province":"62","city":"07","area":"21"},{"code":"620722","name":"民乐县","province":"62","city":"07","area":"22"},{"code":"620723","name":"临泽县","province":"62","city":"07","area":"23"},{"code":"620724","name":"高台县","province":"62","city":"07","area":"24"},{"code":"620725","name":"山丹县","province":"62","city":"07","area":"25"},{"code":"620701","name":"市辖区","province":"62","city":"07","area":"01"}]},{"code":"620800","name":"平凉市","province":"62","city":"08","children":[{"code":"620802","name":"崆峒区","province":"62","city":"08","area":"02"},{"code":"620821","name":"泾川县","province":"62","city":"08","area":"21"},{"code":"620822","name":"灵台县","province":"62","city":"08","area":"22"},{"code":"620823","name":"崇信县","province":"62","city":"08","area":"23"},{"code":"620825","name":"庄浪县","province":"62","city":"08","area":"25"},{"code":"620826","name":"静宁县","province":"62","city":"08","area":"26"},{"code":"620881","name":"华亭市","province":"62","city":"08","area":"81"},{"code":"620801","name":"市辖区","province":"62","city":"08","area":"01"}]},{"code":"620900","name":"酒泉市","province":"62","city":"09","children":[{"code":"620902","name":"肃州区","province":"62","city":"09","area":"02"},{"code":"620921","name":"金塔县","province":"62","city":"09","area":"21"},{"code":"620922","name":"瓜州县","province":"62","city":"09","area":"22"},{"code":"620923","name":"肃北蒙古族自治县","province":"62","city":"09","area":"23"},{"code":"620924","name":"阿克塞哈萨克族自治县","province":"62","city":"09","area":"24"},{"code":"620981","name":"玉门市","province":"62","city":"09","area":"81"},{"code":"620982","name":"敦煌市","province":"62","city":"09","area":"82"},{"code":"620901","name":"市辖区","province":"62","city":"09","area":"01"}]},{"code":"621000","name":"庆阳市","province":"62","city":"10","children":[{"code":"621002","name":"西峰区","province":"62","city":"10","area":"02"},{"code":"621021","name":"庆城县","province":"62","city":"10","area":"21"},{"code":"621022","name":"环县","province":"62","city":"10","area":"22"},{"code":"621023","name":"华池县","province":"62","city":"10","area":"23"},{"code":"621024","name":"合水县","province":"62","city":"10","area":"24"},{"code":"621025","name":"正宁县","province":"62","city":"10","area":"25"},{"code":"621026","name":"宁县","province":"62","city":"10","area":"26"},{"code":"621027","name":"镇原县","province":"62","city":"10","area":"27"},{"code":"621001","name":"市辖区","province":"62","city":"10","area":"01"}]},{"code":"621100","name":"定西市","province":"62","city":"11","children":[{"code":"621102","name":"安定区","province":"62","city":"11","area":"02"},{"code":"621121","name":"通渭县","province":"62","city":"11","area":"21"},{"code":"621122","name":"陇西县","province":"62","city":"11","area":"22"},{"code":"621123","name":"渭源县","province":"62","city":"11","area":"23"},{"code":"621124","name":"临洮县","province":"62","city":"11","area":"24"},{"code":"621125","name":"漳县","province":"62","city":"11","area":"25"},{"code":"621126","name":"岷县","province":"62","city":"11","area":"26"},{"code":"621101","name":"市辖区","province":"62","city":"11","area":"01"}]},{"code":"621200","name":"陇南市","province":"62","city":"12","children":[{"code":"621202","name":"武都区","province":"62","city":"12","area":"02"},{"code":"621221","name":"成县","province":"62","city":"12","area":"21"},{"code":"621222","name":"文县","province":"62","city":"12","area":"22"},{"code":"621223","name":"宕昌县","province":"62","city":"12","area":"23"},{"code":"621224","name":"康县","province":"62","city":"12","area":"24"},{"code":"621225","name":"西和县","province":"62","city":"12","area":"25"},{"code":"621226","name":"礼县","province":"62","city":"12","area":"26"},{"code":"621227","name":"徽县","province":"62","city":"12","area":"27"},{"code":"621228","name":"两当县","province":"62","city":"12","area":"28"},{"code":"621201","name":"市辖区","province":"62","city":"12","area":"01"}]},{"code":"622900","name":"临夏回族自治州","province":"62","city":"29","children":[{"code":"622901","name":"临夏市","province":"62","city":"29","area":"01"},{"code":"622921","name":"临夏县","province":"62","city":"29","area":"21"},{"code":"622922","name":"康乐县","province":"62","city":"29","area":"22"},{"code":"622923","name":"永靖县","province":"62","city":"29","area":"23"},{"code":"622924","name":"广河县","province":"62","city":"29","area":"24"},{"code":"622925","name":"和政县","province":"62","city":"29","area":"25"},{"code":"622926","name":"东乡族自治县","province":"62","city":"29","area":"26"},{"code":"622927","name":"积石山保安族东乡族撒拉族自治县","province":"62","city":"29","area":"27"}]},{"code":"623000","name":"甘南藏族自治州","province":"62","city":"30","children":[{"code":"623001","name":"合作市","province":"62","city":"30","area":"01"},{"code":"623021","name":"临潭县","province":"62","city":"30","area":"21"},{"code":"623022","name":"卓尼县","province":"62","city":"30","area":"22"},{"code":"623023","name":"舟曲县","province":"62","city":"30","area":"23"},{"code":"623024","name":"迭部县","province":"62","city":"30","area":"24"},{"code":"623025","name":"玛曲县","province":"62","city":"30","area":"25"},{"code":"623026","name":"碌曲县","province":"62","city":"30","area":"26"},{"code":"623027","name":"夏河县","province":"62","city":"30","area":"27"}]}]},{"code":"630000","name":"青海省","province":"63","children":[{"code":"630100","name":"西宁市","province":"63","city":"01","children":[{"code":"630102","name":"城东区","province":"63","city":"01","area":"02"},{"code":"630103","name":"城中区","province":"63","city":"01","area":"03"},{"code":"630104","name":"城西区","province":"63","city":"01","area":"04"},{"code":"630105","name":"城北区","province":"63","city":"01","area":"05"},{"code":"630106","name":"湟中区","province":"63","city":"01","area":"06"},{"code":"630121","name":"大通回族土族自治县","province":"63","city":"01","area":"21"},{"code":"630123","name":"湟源县","province":"63","city":"01","area":"23"},{"code":"630101","name":"市辖区","province":"63","city":"01","area":"01"}]},{"code":"630200","name":"海东市","province":"63","city":"02","children":[{"code":"630202","name":"乐都区","province":"63","city":"02","area":"02"},{"code":"630203","name":"平安区","province":"63","city":"02","area":"03"},{"code":"630222","name":"民和回族土族自治县","province":"63","city":"02","area":"22"},{"code":"630223","name":"互助土族自治县","province":"63","city":"02","area":"23"},{"code":"630224","name":"化隆回族自治县","province":"63","city":"02","area":"24"},{"code":"630225","name":"循化撒拉族自治县","province":"63","city":"02","area":"25"}]},{"code":"632200","name":"海北藏族自治州","province":"63","city":"22","children":[{"code":"632221","name":"门源回族自治县","province":"63","city":"22","area":"21"},{"code":"632222","name":"祁连县","province":"63","city":"22","area":"22"},{"code":"632223","name":"海晏县","province":"63","city":"22","area":"23"},{"code":"632224","name":"刚察县","province":"63","city":"22","area":"24"}]},{"code":"632300","name":"黄南藏族自治州","province":"63","city":"23","children":[{"code":"632301","name":"同仁市","province":"63","city":"23","area":"01"},{"code":"632322","name":"尖扎县","province":"63","city":"23","area":"22"},{"code":"632323","name":"泽库县","province":"63","city":"23","area":"23"},{"code":"632324","name":"河南蒙古族自治县","province":"63","city":"23","area":"24"}]},{"code":"632500","name":"海南藏族自治州","province":"63","city":"25","children":[{"code":"632521","name":"共和县","province":"63","city":"25","area":"21"},{"code":"632522","name":"同德县","province":"63","city":"25","area":"22"},{"code":"632523","name":"贵德县","province":"63","city":"25","area":"23"},{"code":"632524","name":"兴海县","province":"63","city":"25","area":"24"},{"code":"632525","name":"贵南县","province":"63","city":"25","area":"25"}]},{"code":"632600","name":"果洛藏族自治州","province":"63","city":"26","children":[{"code":"632621","name":"玛沁县","province":"63","city":"26","area":"21"},{"code":"632622","name":"班玛县","province":"63","city":"26","area":"22"},{"code":"632623","name":"甘德县","province":"63","city":"26","area":"23"},{"code":"632624","name":"达日县","province":"63","city":"26","area":"24"},{"code":"632625","name":"久治县","province":"63","city":"26","area":"25"},{"code":"632626","name":"玛多县","province":"63","city":"26","area":"26"}]},{"code":"632700","name":"玉树藏族自治州","province":"63","city":"27","children":[{"code":"632701","name":"玉树市","province":"63","city":"27","area":"01"},{"code":"632722","name":"杂多县","province":"63","city":"27","area":"22"},{"code":"632723","name":"称多县","province":"63","city":"27","area":"23"},{"code":"632724","name":"治多县","province":"63","city":"27","area":"24"},{"code":"632725","name":"囊谦县","province":"63","city":"27","area":"25"},{"code":"632726","name":"曲麻莱县","province":"63","city":"27","area":"26"}]},{"code":"632800","name":"海西蒙古族藏族自治州","province":"63","city":"28","children":[{"code":"632801","name":"格尔木市","province":"63","city":"28","area":"01"},{"code":"632802","name":"德令哈市","province":"63","city":"28","area":"02"},{"code":"632803","name":"茫崖市","province":"63","city":"28","area":"03"},{"code":"632821","name":"乌兰县","province":"63","city":"28","area":"21"},{"code":"632822","name":"都兰县","province":"63","city":"28","area":"22"},{"code":"632823","name":"天峻县","province":"63","city":"28","area":"23"},{"code":"632857","name":"大柴旦行政委员会","province":"63","city":"28","area":"57"}]}]},{"code":"640000","name":"宁夏回族自治区","province":"64","children":[{"code":"640100","name":"银川市","province":"64","city":"01","children":[{"code":"640104","name":"兴庆区","province":"64","city":"01","area":"04"},{"code":"640105","name":"西夏区","province":"64","city":"01","area":"05"},{"code":"640106","name":"金凤区","province":"64","city":"01","area":"06"},{"code":"640121","name":"永宁县","province":"64","city":"01","area":"21"},{"code":"640122","name":"贺兰县","province":"64","city":"01","area":"22"},{"code":"640181","name":"灵武市","province":"64","city":"01","area":"81"},{"code":"640101","name":"市辖区","province":"64","city":"01","area":"01"}]},{"code":"640200","name":"石嘴山市","province":"64","city":"02","children":[{"code":"640202","name":"大武口区","province":"64","city":"02","area":"02"},{"code":"640205","name":"惠农区","province":"64","city":"02","area":"05"},{"code":"640221","name":"平罗县","province":"64","city":"02","area":"21"},{"code":"640201","name":"市辖区","province":"64","city":"02","area":"01"}]},{"code":"640300","name":"吴忠市","province":"64","city":"03","children":[{"code":"640302","name":"利通区","province":"64","city":"03","area":"02"},{"code":"640303","name":"红寺堡区","province":"64","city":"03","area":"03"},{"code":"640323","name":"盐池县","province":"64","city":"03","area":"23"},{"code":"640324","name":"同心县","province":"64","city":"03","area":"24"},{"code":"640381","name":"青铜峡市","province":"64","city":"03","area":"81"},{"code":"640301","name":"市辖区","province":"64","city":"03","area":"01"}]},{"code":"640400","name":"固原市","province":"64","city":"04","children":[{"code":"640402","name":"原州区","province":"64","city":"04","area":"02"},{"code":"640422","name":"西吉县","province":"64","city":"04","area":"22"},{"code":"640423","name":"隆德县","province":"64","city":"04","area":"23"},{"code":"640424","name":"泾源县","province":"64","city":"04","area":"24"},{"code":"640425","name":"彭阳县","province":"64","city":"04","area":"25"},{"code":"640401","name":"市辖区","province":"64","city":"04","area":"01"}]},{"code":"640500","name":"中卫市","province":"64","city":"05","children":[{"code":"640502","name":"沙坡头区","province":"64","city":"05","area":"02"},{"code":"640521","name":"中宁县","province":"64","city":"05","area":"21"},{"code":"640522","name":"海原县","province":"64","city":"05","area":"22"},{"code":"640501","name":"市辖区","province":"64","city":"05","area":"01"}]}]},{"code":"650000","name":"新疆维吾尔自治区","province":"65","children":[{"code":"650100","name":"乌鲁木齐市","province":"65","city":"01","children":[{"code":"650102","name":"天山区","province":"65","city":"01","area":"02"},{"code":"650103","name":"沙依巴克区","province":"65","city":"01","area":"03"},{"code":"650104","name":"新市区","province":"65","city":"01","area":"04"},{"code":"650105","name":"水磨沟区","province":"65","city":"01","area":"05"},{"code":"650106","name":"头屯河区","province":"65","city":"01","area":"06"},{"code":"650107","name":"达坂城区","province":"65","city":"01","area":"07"},{"code":"650109","name":"米东区","province":"65","city":"01","area":"09"},{"code":"650121","name":"乌鲁木齐县","province":"65","city":"01","area":"21"},{"code":"650101","name":"市辖区","province":"65","city":"01","area":"01"}]},{"code":"650200","name":"克拉玛依市","province":"65","city":"02","children":[{"code":"650202","name":"独山子区","province":"65","city":"02","area":"02"},{"code":"650203","name":"克拉玛依区","province":"65","city":"02","area":"03"},{"code":"650204","name":"白碱滩区","province":"65","city":"02","area":"04"},{"code":"650205","name":"乌尔禾区","province":"65","city":"02","area":"05"},{"code":"650201","name":"市辖区","province":"65","city":"02","area":"01"}]},{"code":"650400","name":"吐鲁番市","province":"65","city":"04","children":[{"code":"650402","name":"高昌区","province":"65","city":"04","area":"02"},{"code":"650421","name":"鄯善县","province":"65","city":"04","area":"21"},{"code":"650422","name":"托克逊县","province":"65","city":"04","area":"22"}]},{"code":"650500","name":"哈密市","province":"65","city":"05","children":[{"code":"650502","name":"伊州区","province":"65","city":"05","area":"02"},{"code":"650521","name":"巴里坤哈萨克自治县","province":"65","city":"05","area":"21"},{"code":"650522","name":"伊吾县","province":"65","city":"05","area":"22"}]},{"code":"652300","name":"昌吉回族自治州","province":"65","city":"23","children":[{"code":"652301","name":"昌吉市","province":"65","city":"23","area":"01"},{"code":"652302","name":"阜康市","province":"65","city":"23","area":"02"},{"code":"652323","name":"呼图壁县","province":"65","city":"23","area":"23"},{"code":"652324","name":"玛纳斯县","province":"65","city":"23","area":"24"},{"code":"652325","name":"奇台县","province":"65","city":"23","area":"25"},{"code":"652327","name":"吉木萨尔县","province":"65","city":"23","area":"27"},{"code":"652328","name":"木垒哈萨克自治县","province":"65","city":"23","area":"28"}]},{"code":"652700","name":"博尔塔拉蒙古自治州","province":"65","city":"27","children":[{"code":"652701","name":"博乐市","province":"65","city":"27","area":"01"},{"code":"652702","name":"阿拉山口市","province":"65","city":"27","area":"02"},{"code":"652722","name":"精河县","province":"65","city":"27","area":"22"},{"code":"652723","name":"温泉县","province":"65","city":"27","area":"23"}]},{"code":"652800","name":"巴音郭楞蒙古自治州","province":"65","city":"28","children":[{"code":"652801","name":"库尔勒市","province":"65","city":"28","area":"01"},{"code":"652822","name":"轮台县","province":"65","city":"28","area":"22"},{"code":"652823","name":"尉犁县","province":"65","city":"28","area":"23"},{"code":"652824","name":"若羌县","province":"65","city":"28","area":"24"},{"code":"652825","name":"且末县","province":"65","city":"28","area":"25"},{"code":"652826","name":"焉耆回族自治县","province":"65","city":"28","area":"26"},{"code":"652827","name":"和静县","province":"65","city":"28","area":"27"},{"code":"652828","name":"和硕县","province":"65","city":"28","area":"28"},{"code":"652829","name":"博湖县","province":"65","city":"28","area":"29"},{"code":"652871","name":"库尔勒经济技术开发区","province":"65","city":"28","area":"71"}]},{"code":"652900","name":"阿克苏地区","province":"65","city":"29","children":[{"code":"652901","name":"阿克苏市","province":"65","city":"29","area":"01"},{"code":"652902","name":"库车市","province":"65","city":"29","area":"02"},{"code":"652922","name":"温宿县","province":"65","city":"29","area":"22"},{"code":"652924","name":"沙雅县","province":"65","city":"29","area":"24"},{"code":"652925","name":"新和县","province":"65","city":"29","area":"25"},{"code":"652926","name":"拜城县","province":"65","city":"29","area":"26"},{"code":"652927","name":"乌什县","province":"65","city":"29","area":"27"},{"code":"652928","name":"阿瓦提县","province":"65","city":"29","area":"28"},{"code":"652929","name":"柯坪县","province":"65","city":"29","area":"29"}]},{"code":"653000","name":"克孜勒苏柯尔克孜自治州","province":"65","city":"30","children":[{"code":"653001","name":"阿图什市","province":"65","city":"30","area":"01"},{"code":"653022","name":"阿克陶县","province":"65","city":"30","area":"22"},{"code":"653023","name":"阿合奇县","province":"65","city":"30","area":"23"},{"code":"653024","name":"乌恰县","province":"65","city":"30","area":"24"}]},{"code":"653100","name":"喀什地区","province":"65","city":"31","children":[{"code":"653101","name":"喀什市","province":"65","city":"31","area":"01"},{"code":"653121","name":"疏附县","province":"65","city":"31","area":"21"},{"code":"653122","name":"疏勒县","province":"65","city":"31","area":"22"},{"code":"653123","name":"英吉沙县","province":"65","city":"31","area":"23"},{"code":"653124","name":"泽普县","province":"65","city":"31","area":"24"},{"code":"653125","name":"莎车县","province":"65","city":"31","area":"25"},{"code":"653126","name":"叶城县","province":"65","city":"31","area":"26"},{"code":"653127","name":"麦盖提县","province":"65","city":"31","area":"27"},{"code":"653128","name":"岳普湖县","province":"65","city":"31","area":"28"},{"code":"653129","name":"伽师县","province":"65","city":"31","area":"29"},{"code":"653130","name":"巴楚县","province":"65","city":"31","area":"30"},{"code":"653131","name":"塔什库尔干塔吉克自治县","province":"65","city":"31","area":"31"}]},{"code":"653200","name":"和田地区","province":"65","city":"32","children":[{"code":"653201","name":"和田市","province":"65","city":"32","area":"01"},{"code":"653221","name":"和田县","province":"65","city":"32","area":"21"},{"code":"653222","name":"墨玉县","province":"65","city":"32","area":"22"},{"code":"653223","name":"皮山县","province":"65","city":"32","area":"23"},{"code":"653224","name":"洛浦县","province":"65","city":"32","area":"24"},{"code":"653225","name":"策勒县","province":"65","city":"32","area":"25"},{"code":"653226","name":"于田县","province":"65","city":"32","area":"26"},{"code":"653227","name":"民丰县","province":"65","city":"32","area":"27"}]},{"code":"654000","name":"伊犁哈萨克自治州","province":"65","city":"40","children":[{"code":"654002","name":"伊宁市","province":"65","city":"40","area":"02"},{"code":"654003","name":"奎屯市","province":"65","city":"40","area":"03"},{"code":"654004","name":"霍尔果斯市","province":"65","city":"40","area":"04"},{"code":"654021","name":"伊宁县","province":"65","city":"40","area":"21"},{"code":"654022","name":"察布查尔锡伯自治县","province":"65","city":"40","area":"22"},{"code":"654023","name":"霍城县","province":"65","city":"40","area":"23"},{"code":"654024","name":"巩留县","province":"65","city":"40","area":"24"},{"code":"654025","name":"新源县","province":"65","city":"40","area":"25"},{"code":"654026","name":"昭苏县","province":"65","city":"40","area":"26"},{"code":"654027","name":"特克斯县","province":"65","city":"40","area":"27"},{"code":"654028","name":"尼勒克县","province":"65","city":"40","area":"28"}]},{"code":"654200","name":"塔城地区","province":"65","city":"42","children":[{"code":"654201","name":"塔城市","province":"65","city":"42","area":"01"},{"code":"654202","name":"乌苏市","province":"65","city":"42","area":"02"},{"code":"654221","name":"额敏县","province":"65","city":"42","area":"21"},{"code":"654223","name":"沙湾县","province":"65","city":"42","area":"23"},{"code":"654224","name":"托里县","province":"65","city":"42","area":"24"},{"code":"654225","name":"裕民县","province":"65","city":"42","area":"25"},{"code":"654226","name":"和布克赛尔蒙古自治县","province":"65","city":"42","area":"26"},{"code":"654203","name":"沙湾市","province":"65","city":"42","area":"03"}]},{"code":"654300","name":"阿勒泰地区","province":"65","city":"43","children":[{"code":"654301","name":"阿勒泰市","province":"65","city":"43","area":"01"},{"code":"654321","name":"布尔津县","province":"65","city":"43","area":"21"},{"code":"654322","name":"富蕴县","province":"65","city":"43","area":"22"},{"code":"654323","name":"福海县","province":"65","city":"43","area":"23"},{"code":"654324","name":"哈巴河县","province":"65","city":"43","area":"24"},{"code":"654325","name":"青河县","province":"65","city":"43","area":"25"},{"code":"654326","name":"吉木乃县","province":"65","city":"43","area":"26"}]},{"code":"659000","name":"新疆维吾尔自治区-自治区直辖县级行政区划","province":"65","city":"90","children":[{"code":"659001","name":"石河子市","province":"65","city":"90","area":"01"},{"code":"659002","name":"阿拉尔市","province":"65","city":"90","area":"02"},{"code":"659003","name":"图木舒克市","province":"65","city":"90","area":"03"},{"code":"659004","name":"五家渠市","province":"65","city":"90","area":"04"},{"code":"659005","name":"北屯市","province":"65","city":"90","area":"05"},{"code":"659006","name":"铁门关市","province":"65","city":"90","area":"06"},{"code":"659007","name":"双河市","province":"65","city":"90","area":"07"},{"code":"659008","name":"可克达拉市","province":"65","city":"90","area":"08"},{"code":"659009","name":"昆玉市","province":"65","city":"90","area":"09"},{"code":"659010","name":"胡杨河市","province":"65","city":"90","area":"10"},{"code":"659011","name":"新星市","province":"65","city":"90","area":"11"}]}]},{"code":"710000","name":"台湾省","province":"71","children":[]},{"code":"810000","name":"香港特别行政区","province":"81","children":[{"code":"810001","name":"中西区","province":"81","city":"00","area":"01"},{"code":"810002","name":"湾仔区","province":"81","city":"00","area":"02"},{"code":"810003","name":"东区","province":"81","city":"00","area":"03"},{"code":"810004","name":"南区","province":"81","city":"00","area":"04"},{"code":"810005","name":"油尖旺区","province":"81","city":"00","area":"05"},{"code":"810006","name":"深水埗区","province":"81","city":"00","area":"06"},{"code":"810007","name":"九龙城区","province":"81","city":"00","area":"07"},{"code":"810008","name":"黄大仙区","province":"81","city":"00","area":"08"},{"code":"810009","name":"观塘区","province":"81","city":"00","area":"09"},{"code":"810010","name":"荃湾区","province":"81","city":"00","area":"10"},{"code":"810011","name":"屯门区","province":"81","city":"00","area":"11"},{"code":"810012","name":"元朗区","province":"81","city":"00","area":"12"},{"code":"810013","name":"北区","province":"81","city":"00","area":"13"},{"code":"810014","name":"大埔区","province":"81","city":"00","area":"14"},{"code":"810015","name":"西贡区","province":"81","city":"00","area":"15"},{"code":"810016","name":"沙田区","province":"81","city":"00","area":"16"},{"code":"810017","name":"葵青区","province":"81","city":"00","area":"17"},{"code":"810018","name":"离岛区","province":"81","city":"00","area":"18"}]},{"code":"820000","name":"澳门特别行政区","province":"82","children":[{"code":"820001","name":"花地玛堂区","province":"82","city":"00","area":"01"},{"code":"820002","name":"花王堂区","province":"82","city":"00","area":"02"},{"code":"820003","name":"望德堂区","province":"82","city":"00","area":"03"},{"code":"820004","name":"大堂区","province":"82","city":"00","area":"04"},{"code":"820005","name":"风顺堂区","province":"82","city":"00","area":"05"},{"code":"820006","name":"嘉模堂区","province":"82","city":"00","area":"06"},{"code":"820007","name":"路凼填海区","province":"82","city":"00","area":"07"},{"code":"820008","name":"圣方济各堂区","province":"82","city":"00","area":"08"}]}]');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	!function() {
/******/ 		__webpack_require__.p = "";
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ entry_lib; }
});

;// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
/* eslint-disable no-var */
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var currentScript = window.document.currentScript
  if (false) { var getCurrentScript; }

  var src = currentScript && currentScript.src.match(/(.+\/)[^/]+\.js(\?.*)?$/)
  if (src) {
    __webpack_require__.p = src[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-83.use[1]!./node_modules/babel-loader/lib/index.js!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./packages/citys/citys.vue?vue&type=template&id=0792051c&
var render = function render() {
  var _vm = this,
      _c = _vm._self._c;

  return _c('div', [_vm.type === 1 ? _c('div', [_c('el-select', {
    style: _vm.customerStyle,
    attrs: {
      "placeholder": "请选择省份",
      "filterable": "",
      "multiple": _vm.multiple,
      "clearable": ""
    },
    on: {
      "change": _vm.changeSelectCity
    },
    model: {
      value: _vm.val,
      callback: function ($$v) {
        _vm.val = $$v;
      },
      expression: "val"
    }
  }, _vm._l(_vm.options, function (item) {
    return _c('el-option', {
      key: item.code,
      attrs: {
        "label": item.name,
        "value": item.code
      }
    });
  }), 1)], 1) : _c('div', [_c('el-cascader', {
    style: _vm.customerStyle,
    attrs: {
      "options": _vm.options,
      "placeholder": "请选择省市",
      "props": _vm.cprop,
      "clearable": ""
    },
    on: {
      "change": _vm.changeSelectCity
    },
    model: {
      value: _vm.val,
      callback: function ($$v) {
        _vm.val = $$v;
      },
      expression: "val"
    }
  })], 1)]);
};

var staticRenderFns = [];

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.includes.js
var es_array_includes = __webpack_require__(6699);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-83.use[1]!./node_modules/babel-loader/lib/index.js!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./packages/citys/citys.vue?vue&type=script&lang=js&



const cityList = __webpack_require__(2431); // import cityList from '@/utils/citys'


const only = ['82', '81', '50', '31', '12', '11']; //特殊省份
// console.log(cityList)

/* harmony default export */ var citysvue_type_script_lang_js_ = ({
  name: 'yp-city',
  props: {
    type: {
      default: 1,
      type: Number
    },
    filterable: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number, Array],
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    customerStyle: {
      type: Object,

      default() {
        return {};
      }

    } // defaultValue: {
    //   type: [Number, String, Array]
    // }

  },

  data() {
    return {
      cityList: cityList,
      //省市区文件
      val: this.type == 1 ? '' : [],
      options: [],
      cprop: {
        value: 'code',
        label: 'name',
        children: 'children',
        multiple: this.multiple
      }
    };
  },

  watch: {},

  mounted() {
    this.getSelectOption();
  },

  methods: {
    //@xh专属注释
    //@name:直接设置 默认值   溯级处理
    //@params: treeLevel true-需要溯级   false  直接赋值
    //@des:
    setValue(v, treeLevel = false) {
      if (this.multiple && (typeof v == 'string' || typeof v == 'number')) {
        console.error('多选状态下 ,默认值必须为数组');
        return;
      }

      if (!treeLevel) {
        if (this.multiple) {
          // debugger
          let arr = [];

          switch (this.type) {
            case 1:
              this.val = v; // debugger

              break;

            case 2:
              arr = v.map(it => {
                return this.code2area(it[it.length - 1]);
              });
              this.val = arr;
              break;

            case 3:
              arr = v.map(it => {
                return this.code2area(it[it.length - 1]);
              });
              this.val = arr;
              break;

            default:
              break;
          }
        } else {
          this.val = v; // debugger
        }
      } else {
        let arr; //自动构造数据

        switch (this.type) {
          case 1:
            // 省级
            this.val = v;
            break;

          case 2:
            // 省级 市级
            arr = v.map(it => {
              return this.code2area(it);
            });

            if (this.multiple) {
              this.val = arr;
            } else {
              this.val = arr[0];
            }

            break;

          case 3:
            // 省级 市级 县级
            arr = v.map(it => {
              return this.code2area(it);
            });

            if (this.multiple) {
              this.val = arr;
            } else {
              this.val = arr[0];
            }

            break;

          default:
            break;
        }
      }
    },

    // 地域编码 转为三位地域数组地区多选用到
    arr2area(arr) {
      if (!arr[0]) {
        return;
      }

      const str = arr[0];
      let a = str.slice(0, 2);
      let b = str.slice(2, 4);
      let c = str.slice(4, 6);
      c = `${a}${b}${c}`;
      b = `${a}${b}00`;
      a = `${a}0000`;
      return [a, b, c].slice(0, this.type);
    },

    code2area(str) {
      let a = str.slice(0, 2);
      let b = str.slice(2, 4);
      let c = str.slice(4, 6);
      let spec = only.includes(a);
      c = `${a}${b}${c}`;
      b = `${a}${b}00`;
      a = `${a}0000`;

      if (spec) {
        // 特殊省份
        return [a, c].slice(0, this.type);
      } else {
        return [a, b, c].slice(0, this.type);
      }
    },

    //@xh专属注释
    //@name:
    //@params:
    //@des:重置
    resetVale() {
      if (this.type === 1) {
        this.val = '';
      } else {
        this.val = [];
      }
    },

    //@xh专属注释
    //@name:
    //@params:
    //@des:初始化选型
    getSelectOption() {
      // 如果是1 只拿省的数据
      if (this.type === 1) {
        this.getProvinceList();
      } else if (this.type === 2) {
        this.getCityList();
      } else {
        this.options = this.cityList;
      }
    },

    // 获取省分下拉
    getProvinceList() {
      let res = [];
      this.cityList.forEach(item => {
        let obj = {};
        obj.code = item.code;
        obj.name = item.name;
        res.push(obj);
      });
      this.options = res;
    },

    // 获取省市数据
    getCityList() {
      let res = [];
      this.cityList.forEach(item => {
        let obj = {
          code: '',
          name: '',
          children: []
        };
        obj.code = item.code;
        obj.name = item.name;
        item.children.forEach(val => {
          let or = {};
          or.code = val.code;
          or.name = val.name;
          obj.children.push(or);
        });
        res.push(obj);
      });
      this.options = res;
    },

    // 结果返回
    changeSelectCity(val) {
      console.log(val);
      let res = {
        data: val,
        result: null
      };

      if (this.multiple) {
        switch (this.type) {
          case 1:
            // 省级
            res = {
              data: val,
              result: val
            };
            break;

          case 2:
            // 省级 市级
            res = {
              data: val,
              result: val.map(it => {
                return it[1];
              })
            };
            break;

          case 3:
            // 省级 市级 县级
            res = {
              data: val,
              result: val.map(it => {
                return it[it.length - 1];
              })
            };
            break;

          default:
            break;
        }
      } else {
        if (this.type == 1) {
          res = {
            data: val,
            result: val
          };
        } else {
          res = {
            data: val,
            result: val[val.length - 1]
          };
        }
      }

      this.$emit('change', res); // debugger
    }

  }
});
;// CONCATENATED MODULE: ./packages/citys/citys.vue?vue&type=script&lang=js&
 /* harmony default export */ var citys_citysvue_type_script_lang_js_ = (citysvue_type_script_lang_js_); 
;// CONCATENATED MODULE: ./node_modules/@vue/vue-loader-v15/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent(
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */,
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options =
    typeof scriptExports === 'function' ? scriptExports.options : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) {
    // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
          injectStyles.call(
            this,
            (options.functional ? this.parent : this).$root.$options.shadowRoot
          )
        }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

;// CONCATENATED MODULE: ./packages/citys/citys.vue





/* normalize component */
;
var component = normalizeComponent(
  citys_citysvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var citys = (component.exports);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-83.use[1]!./node_modules/babel-loader/lib/index.js!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./packages/dan/dan.vue?vue&type=template&id=177870aa&scoped=true&
var danvue_type_template_id_177870aa_scoped_true_render = function render() {
  var _vm = this,
      _c = _vm._self._c;

  return _c('div', {
    staticClass: "components"
  }, [_c('div', {
    staticClass: "containerdanBox"
  }, [_c('aside', {
    staticClass: "title"
  }, [_vm._v(_vm._s(_vm.title))]), _c('div', {
    staticClass: "containerdan",
    style: _vm.backgropundStyle
  }, [_c('div', {
    staticClass: "danBar",
    class: _vm.animate ? 'animetdMove' : '',
    style: _vm.valueStyle
  }, [_c('span', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.value,
      expression: "value"
    }],
    staticClass: "labels",
    style: {
      color: _vm.activeColor
    }
  }, [_vm._v(_vm._s(_vm.percent || _vm.localPercent) + "% ")])]), _c('div', {
    staticClass: "target",
    style: _vm.targetStyle
  }, [_vm.target ? _c('span', {
    staticClass: "labels",
    style: {
      color: _vm.targetColor
    }
  }, [_vm._v(_vm._s(_vm.target))]) : _vm._e()])])]), _vm.showTip ? _c('div', {
    staticClass: "flex footer"
  }, [_c('div', {
    staticClass: "stip1",
    style: {
      background: _vm.activeColor
    }
  }), _c('span', {
    staticClass: "texts"
  }, [_vm._v(_vm._s(_vm.stipText))]), _c('div', {
    staticClass: "stip2",
    style: {
      background: _vm.targetColor
    }
  }), _c('span', {
    staticClass: "texts"
  }, [_vm._v(_vm._s(_vm.targetText))])]) : _vm._e()]);
};

var danvue_type_template_id_177870aa_scoped_true_staticRenderFns = [];

;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-83.use[1]!./node_modules/babel-loader/lib/index.js!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./packages/dan/dan.vue?vue&type=script&lang=js&
/* harmony default export */ var danvue_type_script_lang_js_ = ({
  name: 'yp-dan',
  components: {},
  props: {
    //左边的标题
    title: {
      type: String,
      default: '流水'
    },
    value: {
      type: Number,
      default: 80 //有效值

    },
    animate: {
      type: Boolean,
      default: true //有效值

    },
    // 目标值
    target: {
      type: Number,
      default: 90
    },
    //是否显示底部的deleng
    showTip: {
      type: Boolean,
      default: true
    },
    //颜色相关
    targetColor: {
      type: String,
      default: ''
    },
    activeColor: {
      type: String,
      default: ''
    },
    backColor: {
      type: String,
      default: ''
    },
    //左边示例 颜色
    stipText: {
      type: String,
      default: '实际进度'
    },
    //右边示例 颜色
    targetText: {
      type: String,
      default: '目标进度'
    }
  },

  data() {
    return {
      range: 1,
      ctime: 1,
      loading: false,
      // queryTime: [moment().subtract('days', 1).format('YYYY-MM-DD'), moment().subtract('days', 1).format('YYYY-MM-DD')],
      cusdashboardList: []
    };
  },

  computed: {
    percent() {
      const s = (this.value * 100 / this.sum).toFixed(2);
      return s;
    },

    sum() {
      return Math.max(this.target, this.value);
    },

    valueStyle() {
      const s = (this.value * 100 / this.sum).toFixed(2);
      console.log(98, this.activeColor);
      return {
        width: `${s}%`,
        background: this.activeColor || '-webkit-linear-gradient(right, #44b4e7, #618de2, #44b4e7, #9795f9, #44b4e7)'
      };
    },

    targetStyle() {
      let s = this.target * 100 / this.sum;
      return {
        left: `${s.toFixed(2)}%`,
        background: this.targetColor || 'rgb(25, 206, 107)'
      };
    },

    localPercent() {
      const s = (this.value * 100 / this.sum).toFixed(2);
      return s;
    },

    backgropundStyle() {
      return {
        background: this.backColor || 'rgb(224, 240, 253)'
      };
    }

  },

  mounted() {
    this.initData();
  },

  methods: {
    initData() {}

  }
});
;// CONCATENATED MODULE: ./packages/dan/dan.vue?vue&type=script&lang=js&
 /* harmony default export */ var dan_danvue_type_script_lang_js_ = (danvue_type_script_lang_js_); 
;// CONCATENATED MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-65.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-65.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-65.use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-65.use[3]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./packages/dan/dan.vue?vue&type=style&index=0&id=177870aa&prod&lang=scss&scoped=true&
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ./packages/dan/dan.vue?vue&type=style&index=0&id=177870aa&prod&lang=scss&scoped=true&

;// CONCATENATED MODULE: ./packages/dan/dan.vue



;


/* normalize component */

var dan_component = normalizeComponent(
  dan_danvue_type_script_lang_js_,
  danvue_type_template_id_177870aa_scoped_true_render,
  danvue_type_template_id_177870aa_scoped_true_staticRenderFns,
  false,
  null,
  "177870aa",
  null
  
)

/* harmony default export */ var dan = (dan_component.exports);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-83.use[1]!./node_modules/babel-loader/lib/index.js!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./packages/mounthPicker/mounthPicker.vue?vue&type=template&id=1f5d0f8d&
var mounthPickervue_type_template_id_1f5d0f8d_render = function render() {
  var _vm = this,
      _c = _vm._self._c;

  return _c('div', {
    directives: [{
      name: "clickOutside",
      rawName: "v-clickOutside",
      value: _vm.out,
      expression: "out"
    }],
    staticClass: "selectMonthBoxSquare clearFixed",
    attrs: {
      "id": "boxArea"
    }
  }, [_vm.required ? _c('span', {
    staticClass: "dot"
  }, [_vm._v("*")]) : _vm._e(), _c('el-input', {
    staticClass: "inputStyle",
    attrs: {
      "type": "text",
      "placeholder": "请选择查询月份",
      "readonly": ""
    },
    on: {
      "focus": function ($event) {
        _vm.showBox = true;
      }
    },
    model: {
      value: _vm.inputValue,
      callback: function ($$v) {
        _vm.inputValue = $$v;
      },
      expression: "inputValue"
    }
  }, [_c('i', {
    staticClass: "el-input__icon el-icon-date",
    attrs: {
      "slot": "prefix"
    },
    slot: "prefix"
  }), _vm.showClear ? _c('i', {
    staticClass: "el-input__icon el-icon-circle-close clearIconStyle",
    attrs: {
      "slot": "suffix"
    },
    on: {
      "click": function ($event) {
        return _vm.resetMonth(true);
      }
    },
    slot: "suffix"
  }) : _vm._e()]), _vm.showTips ? _c('el-tooltip', {
    staticClass: "item",
    attrs: {
      "effect": "dark",
      "content": _vm.inputValue,
      "placement": "top-start"
    }
  }, [_c('i', {
    staticClass: "el-icon-info"
  })]) : _vm._e(), _vm.showSum ? _c('span', {
    staticClass: "suffix"
  }, [_vm._v(" 共:" + _vm._s(_vm.resultTimes.length))]) : _vm._e(), _vm.showBox ? _c('div', {
    staticClass: "selectContentBox"
  }, [_c('div', {
    staticClass: "contentArea"
  }, [_c('div', {
    staticClass: "mounth mounth-wrap mounth-around",
    staticStyle: {
      "padding": "15px 0",
      "border-bottom": "1px solid #e5e5e5"
    }
  }, [_c('div', {
    staticClass: "cursor",
    staticStyle: {
      "width": "15%"
    }
  }, [_c('el-button', {
    attrs: {
      "disabled": _vm.curIndex >= _vm.DateList.length - 1,
      "icon": "el-icon-d-arrow-left",
      "circle": "",
      "size": "small"
    },
    on: {
      "click": _vm.reduceYear
    }
  })], 1), _c('div', [_vm._v(_vm._s(_vm.OneY) + "年")]), _c('div', {
    staticClass: "cursor t-r",
    staticStyle: {
      "width": "15%"
    }
  }, [_c('el-button', {
    attrs: {
      "disabled": _vm.curIndex <= 0,
      "icon": "el-icon-d-arrow-right",
      "circle": "",
      "size": "small"
    },
    on: {
      "click": _vm.addYear
    }
  })], 1)]), _c('div', {
    staticClass: "conterList"
  }, [_c('div', {
    staticClass: "mounth mounth-wrap monthLeft"
  }, _vm._l(_vm.DateList[_vm.curIndex].queryTime, function (item, index) {
    return _c('div', {
      key: index,
      class: _vm.filterClass(item)
    }, [_c('div', {
      staticClass: "selectOptions",
      on: {
        "click": function ($event) {
          return _vm.onSelect(item);
        }
      }
    }, [_vm._v(_vm._s(_vm.monthMap[item]) + "月")])]);
  }), 0)])]), _c('div', {
    staticClass: "buttonBox t-r"
  }, [_c('span', {
    staticClass: "suffix",
    staticStyle: {
      "margin-right": "10px"
    }
  }, [_vm._v(" (已选:" + _vm._s(_vm.optTimes.length) + ")")]), _c('el-button', {
    staticClass: "buttonStyle",
    attrs: {
      "size": "small",
      "type": "primary"
    },
    on: {
      "click": function ($event) {
        $event.stopPropagation();
        return _vm.handleSubmit.apply(null, arguments);
      }
    }
  }, [_vm._v("确定")]), _c('el-button', {
    staticClass: "buttonStyle",
    attrs: {
      "size": "small",
      "plain": ""
    },
    on: {
      "click": function ($event) {
        $event.stopPropagation();
        return _vm.resetMonth(false);
      }
    }
  }, [_vm._v("重置")])], 1)]) : _vm._e()], 1);
};

var mounthPickervue_type_template_id_1f5d0f8d_staticRenderFns = [];

;// CONCATENATED MODULE: ./packages/mounthPicker/clickOut/index.js
/*
 * @Author       : xh
 * @Date         : 2022-05-27 13:50:07
 * @LastEditors  : xh
 * @LastEditTime : 2022-06-23 10:47:03
 * @FilePath     : \finance-data-admin\src\directive\clickOut\index.js
 */
/* harmony default export */ var clickOut = ({
  bind(el, binding) {
    console.log('bind', el, binding);

    function documentHandler(e) {
      // el 包含其触发的元素 那当然不能触发啦
      if (el.contains(e.target)) {
        return false;
      } // 满足上面条件， 并且expression 的值不为空 触发（希望value是个函数）


      if (binding.expression) {
        //	调用自定义指令传来的函数，e是事件原对象 作为参数（为什么传e 因为有些情况需要把这个对象抛出方便用户的操作）
        binding.value(e);
      }
    } // 嗯？？？ 这么写有什么作用吗？ 当然有了，如果你想取消事件的监听，那么是不是需要这个函数。


    el.__vueClickOutside__ = documentHandler; // 在document上监听事件

    document.addEventListener('click', documentHandler);
  },

  unbind(el) {
    console.log('unbind', el); // 取消事件监听（el.__vueClickOutside 派上用场了吧）

    document.removeEventListener('click', el.__vueClickOutside__); // 既然都取消了 那么这个属性就没必要存在了

    delete el.__vueClickOutside__;
  }

});
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-83.use[1]!./node_modules/babel-loader/lib/index.js!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./packages/mounthPicker/mounthPicker.vue?vue&type=script&lang=js&

/* harmony default export */ var mounthPickervue_type_script_lang_js_ = ({
  name: 'yp-mounth-picker',
  directives: {
    clickOutside: clickOut
  },
  props: {
    //@xh专属注释
    //@name: v-model绑定的值
    //@params:
    //@des:
    value: {
      type: Array,
      default: () => []
    },
    //@xh专属注释
    //@name:获取 前多少年的数据  默认为 20
    //@params:
    //@des:
    yearlength: {
      type: Number,
      default: 20
    },
    //@xh专属注释
    //@name:是否 是必选  是的话 默认 当前月份必选
    //@params:
    //@des:
    required: {
      type: Boolean,
      default: false
    },
    //@xh专属注释
    //@name:是否显示提示图标
    //@params:
    //@des:
    showTips: {
      type: Boolean,
      default: false
    },
    //@xh专属注释
    //@name:是否显示总数
    //@params:
    //@des:
    showSum: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      DateList: [],
      // 年份月份数组
      optTime: [],
      // 月份选中结果数组
      OneY: '',
      // 当前年份
      curIndex: 0,
      // 当前年份下标值
      optTimes: [],
      // 点击月份时的所有选中结果
      resultTimes: [],
      // 点击“确定”按钮后的选择结果
      showBox: false,
      // 是否显示月份选择弹框
      inputValue: '',
      // 输入框的绑定值
      showClear: false,
      // 是否显示输入框右边的“清空”小图标
      monthMap: {
        // 月份显示为中文
        1: '一',
        2: '二',
        3: '三',
        4: '四',
        5: '五',
        6: '六',
        7: '七',
        8: '八',
        9: '九',
        10: '十',
        11: '十一',
        12: '十二'
      },
      defaultValue: [] //记录初始值

    };
  },

  created() {
    this.init();
  },

  mounted() {
    this.defaultValue = [...this.value];
    this.initDetault();
  },

  methods: {
    //@xh专属注释
    //@name:判读是选中样式
    //@params:
    //@des:
    filterClass(key) {
      const labels = `${this.DateList[this.curIndex].TimeYear}-${key <= 9 ? `0${key}` : key}`;
      const days = this.optTime[this.curIndex].queryTime;

      if (days.indexOf(labels) > -1) {
        // 有
        return 'onSelect';
      } else {
        // 无
        return 'select';
      }
    },

    //@xh专属注释
    //@name:
    //@params:
    //@des:选择时间回调
    onSelect(key) {
      const labels = `${this.DateList[this.curIndex].TimeYear}-${key <= 9 ? `0${key}` : key}`;
      const days = this.optTime[this.curIndex].queryTime;

      if (days.indexOf(labels) > -1) {
        // 反选
        const index = days.indexOf(labels);
        this.optTime[this.curIndex].queryTime.splice(index, 1);
      } else {
        // 添加
        this.optTime[this.curIndex].queryTime.push(labels);
      } // console.log(this.optTime, key)


      const arr = [];

      for (let item in this.optTime) {
        if (this.optTime[item].queryTime && this.optTime[item].queryTime.length > 0) {
          arr.push(...this.optTime[item].queryTime);
        }
      }

      this.optTimes = arr;
      this.inputValue = arr.join(','); // console.log('xh', this.optTimes)
    },

    //@xh专属注释
    //@name:组件失去焦点触发 值校验
    //@params:
    //@des:
    out() {
      // console.log(123)
      // 判断当前选中月份与上次点击“确定”按钮时的选择结果是否一致
      const arr = [...this.resultTimes];
      const arr2 = [...this.optTimes];
      let equalArr = arr.sort().toString() == arr2.sort().toString(); // debugger

      if (!equalArr) {
        // 如果不一致（因为是多选，所以必须是点击了“确定”按钮后才能进行查询）：
        // 将选择结果恢复到上次点击“确定”按钮时的结果
        this.optTimes = this.resultTimes; // 将输入框的值恢复到上次点击“确定”按钮时的值

        this.inputValue = this.optTimes.join(','); // 根据输入框是否有值来判断清空图标是否渲染

        this.showClear = this.inputValue == '' ? false : true; // 将月份选中结果恢复到上次点击“确定”按钮时的选中月份

        let _opt = this.resultTimes.map(v => {
          return v.substring(0, 4);
        });

        for (let item in this.optTime) {
          this.optTime[item].queryTime = [];

          _opt.map((items, indexs) => {
            if (items == this.optTime[item].TimeYear) {
              this.optTime[item].queryTime.push(this.resultTimes[indexs]);
            }
          });
        }
      }

      this.showBox = false; // 关
    },

    //@xh专属注释
    //@name:默认值设置
    //@params:
    //@des:
    checkResult(bool = false) {
      if (this.required) {
        let date = new Date(); // Sat Jul 06 2019 19:59:27 GMT+0800 (中国标准时间)
        //获取当前年份：

        let year = date.getFullYear(); // 2019
        //获取当前月份：

        let month = date.getMonth() + 1; // 7

        month = month > 9 ? month : '0' + month;
        let today = year + '-' + month; // 2019-07-06

        this.optTimes = [today];
        this.resultTimes = [today]; // 将输入框的值恢复到上次点击“确定”按钮时的值

        this.inputValue = today;

        let _opt = this.resultTimes.map(v => {
          return v.substring(0, 4);
        }); // console.log('xh', _opt, this.optTime)


        for (let item in this.optTime) {
          this.optTime[item].queryTime = [];

          _opt.map((items, indexs) => {
            if (items == this.optTime[item].TimeYear) {
              this.optTime[item].queryTime.push(this.resultTimes[indexs]);
            }
          });
        }
      }

      if (bool) {
        this.$emit('input', this.resultTimes);
      }
    },

    //@xh专属注释
    //@name:初始化默认值设置
    //@params:
    //@des:
    initDetault() {
      let date = new Date(); // Sat Jul 06 2019 19:59:27 GMT+0800 (中国标准时间)
      //获取当前年份：

      let year = date.getFullYear(); // 2019
      //获取当前月份：

      let month = date.getMonth() + 1; // 7

      month = month > 9 ? month : '0' + month;
      let today = year + '-' + month; // 2019-07-06

      if (this.defaultValue && this.defaultValue.length > 0) {
        this.optTimes = [...this.defaultValue];
        this.resultTimes = [...this.defaultValue];
        this.inputValue = this.defaultValue.join(',');
        this.$emit('input', [...this.defaultValue]);
      } else if (this.required) {
        this.optTimes = [today];
        this.resultTimes = [today]; // 将输入框的值恢复到上次点击“确定”按钮时的值

        this.inputValue = today;
        this.$emit('input', [today]);
      } else {
        this.$emit('input', []);
      }

      let _opt = this.resultTimes.map(v => {
        return v.substring(0, 4);
      }); // console.log('xh', _opt, this.optTime)


      for (let item in this.optTime) {
        this.optTime[item].queryTime = [];

        _opt.map((items, indexs) => {
          if (items == this.optTime[item].TimeYear) {
            this.optTime[item].queryTime.push(this.resultTimes[indexs]);
          }
        });
      }
    },

    // 初始化数据，获取前20年，然后循环 每一年里面都有12个月的 得到数组 opTime 和 DateList
    init() {
      let date = new Date(); // Sat Jul 06 2019 19:59:27 GMT+0800 (中国标准时间)
      //获取当前年份：

      let year = date.getFullYear(); // 2019
      //获取当前月份：

      let month = date.getMonth() + 1; // 7

      const _this = this;

      let _opt = [];
      let _optTime = [];
      let arr = new Array(12);
      let optDate = this.getDateList(); // console.log('xh123123', optDate)

      optDate.map((item, index) => {
        // 月份选择时el-checkbox-group绑定的值
        _optTime[index] = {
          TimeYear: item,
          queryTime: []
        }; // 给每一年份设置12个月份，el-checkbox初始化显示时使用

        _opt[index] = {
          TimeYear: item,
          queryTime: []
        };

        for (let i = 1; i <= arr.length; i++) {
          if (item !== year || month >= i) {
            _opt[index].queryTime.push(i);
          }
        }
      });
      console.log('xh1223', _opt);
      _this.optTime = _optTime;
      _this.DateList = _opt;
    },

    // 获取近20年年份列表，倒序排列，最新一年在最前面
    getDateList() {
      let Dates = new Date();
      let year = Dates.getFullYear();
      this.OneY = year;
      let optDate = [];

      for (let i = year - this.yearlength; i <= year + this.yearlength; i++) {
        optDate.push(i);

        if (i === year) {
          this.curIndex = i - (year - this.yearlength);
        }
      }

      return optDate.reverse();
    },

    // 确定
    handleSubmit() {
      const _this = this; // 更新输入框的值


      _this.inputValue = _this.optTimes.join(','); // 根据输入框是否有值来判断清空图标是否渲染

      _this.showClear = _this.inputValue == '' ? false : true; // 将点击“确定”按钮的选择结果保存起来（该值将在哪里使用：在点击弹框以外区域关闭弹框时使用，mounted中）

      _this.resultTimes = _this.optTimes; // console.log('xh12', _this.resultTimes, _this.resultTimes.length)
      // debugger
      // 关闭弹框

      _this.showBox = false; //全部删除 则恢复默认
      // if (_this.inputValue == '') {
      //   _this.initDetault()
      // }

      _this.$emit('input', _this.resultTimes); // debugger

    },

    // 重置
    resetMonth(bool = false) {
      const _this = this; // 将年份重置到当前年份


      let Dates = new Date();
      let year = Dates.getFullYear();
      _this.OneY = year; // 将已选择的月份清空

      _this.optTimes = [];

      for (let i in _this.optTime) {
        _this.optTime[i].queryTime = [];
      } // 将输入框清空


      _this.inputValue = ''; // 根据输入框是否有值来判断清空图标是否渲染，此处必然不渲染

      this.showClear = false; // 关闭月份选择弹框

      if (bool) {
        // 将点击“确定”按钮的选择结果清空
        _this.resultTimes = [];

        _this.checkResult(true);
      } else {
        _this.checkResult();
      }
    },

    // 左上角年份减少
    reduceYear() {
      const _this = this; // 如果已经是最后一年了，则年份不能再减少了


      if (_this.curIndex == _this.DateList.length - 1) return; // 当前下标值+1，根据下标值获取年份值

      _this.curIndex = _this.curIndex + 1;
      _this.OneY = _this.DateList[_this.curIndex].TimeYear;
    },

    // 右上角年份增加
    addYear() {
      const _this = this; // 如果已经是当前年份了，则年份不能再增加了


      if (_this.curIndex == 0) return; // 当前下标值-1，根据下标值获取年份值

      _this.curIndex = _this.curIndex - 1;
      _this.OneY = _this.DateList[_this.curIndex].TimeYear;
    } // 选择月份
    // onChange() {
    //   const _this = this
    //   // 遍历optTime中已选择的月份，将已选结果塞到optTimes数组中
    //   let _opt = _this.optTime
    //   let arr = []
    //   for (let item in _opt) {
    //     if (_opt[item].queryTime.length > 0)
    //       _opt[item].queryTime.filter((v) => {
    //         arr.push(v)
    //       })
    //   }
    //   _this.optTimes = arr
    //   // 更新输入框的值
    //   _this.inputValue = _this.optTimes.join(',')
    //   // 根据输入框是否有值来判断清空图标是否渲染
    //   _this.showClear = _this.inputValue == '' ? false : true
    // }


  }
});
;// CONCATENATED MODULE: ./packages/mounthPicker/mounthPicker.vue?vue&type=script&lang=js&
 /* harmony default export */ var mounthPicker_mounthPickervue_type_script_lang_js_ = (mounthPickervue_type_script_lang_js_); 
;// CONCATENATED MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-65.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-65.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-65.use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-65.use[3]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./packages/mounthPicker/mounthPicker.vue?vue&type=style&index=0&id=1f5d0f8d&prod&lang=scss&
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ./packages/mounthPicker/mounthPicker.vue?vue&type=style&index=0&id=1f5d0f8d&prod&lang=scss&

;// CONCATENATED MODULE: ./packages/mounthPicker/mounthPicker.vue



;


/* normalize component */

var mounthPicker_component = normalizeComponent(
  mounthPicker_mounthPickervue_type_script_lang_js_,
  mounthPickervue_type_template_id_1f5d0f8d_render,
  mounthPickervue_type_template_id_1f5d0f8d_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var mounthPicker = (mounthPicker_component.exports);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-83.use[1]!./node_modules/babel-loader/lib/index.js!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./packages/skus/skus.vue?vue&type=template&id=b4b38b8e&scoped=true&
var skusvue_type_template_id_b4b38b8e_scoped_true_render = function render() {
  var _vm = this,
      _c = _vm._self._c;

  return _c('div', {
    staticClass: "container",
    attrs: {
      "id": "sku"
    }
  }, [_c('div', {
    staticClass: "spec"
  }, [_c('h4', [_vm._v("商品规格")]), _c('span', {
    staticClass: "skutip"
  }, [_vm._v("* 商品的价格及库存以商品规格为准,拖动单元格可以改变规格顺序")]), _vm.enableSpec ? _c('el-button', {
    staticClass: "mar-t",
    attrs: {
      "type": "primary",
      "size": "small"
    },
    on: {
      "click": _vm.addType
    }
  }, [_vm._v("添加新规格")]) : _vm._e()], 1), _c('el-card', {
    staticClass: "specsBox",
    staticStyle: {
      "padding": "0"
    },
    attrs: {
      "shadow": "hover"
    }
  }, [_vm.productsInfo.goods_parameter.length > 0 ? _c('div', {
    staticClass: "specContent"
  }, [_c('draggable', _vm._b({
    staticClass: "list-group el-upload-list el-upload-list--picture-card",
    attrs: {
      "tag": "ul"
    },
    on: {
      "update": _vm.dragHandle,
      "start": function ($event) {
        _vm.isDragging = true;
      },
      "end": function ($event) {
        _vm.isDragging = false;
      }
    },
    model: {
      value: _vm.productsInfo.goods_parameter,
      callback: function ($$v) {
        _vm.$set(_vm.productsInfo, "goods_parameter", $$v);
      },
      expression: "productsInfo.goods_parameter"
    }
  }, 'draggable', _vm.dragOptions, false), _vm._l(_vm.productsInfo.goods_parameter, function (spec, index) {
    return _c('el-col', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: _vm.enableSpec,
        expression: "enableSpec"
      }],
      key: index,
      attrs: {
        "span": 24
      }
    }, [_c('el-card', {
      attrs: {
        "shadow": "hover"
      }
    }, [_c('div', {
      staticClass: "clearfix",
      attrs: {
        "slot": "header"
      },
      slot: "header"
    }, [_c('span', [_vm._v("规格名称：")]), _c('el-input', {
      staticClass: "spec-type",
      attrs: {
        "size": "small",
        "clearable": "",
        "placeholder": "请输入规格名，例如：尺寸"
      },
      on: {
        "blur": _vm._blur
      },
      model: {
        value: spec.name,
        callback: function ($$v) {
          _vm.$set(spec, "name", typeof $$v === 'string' ? $$v.trim() : $$v);
        },
        expression: "spec.name"
      }
    }), _c('span', {
      staticStyle: {
        "margin-left": "10px"
      }
    }, [_vm._v("规格项：")]), _c('el-input', {
      staticClass: "spec-type",
      attrs: {
        "size": "small",
        "clearable": "",
        "placeholder": "请输入规格项，例如：XXL"
      },
      model: {
        value: _vm.newSpecName[index],
        callback: function ($$v) {
          _vm.$set(_vm.newSpecName, index, typeof $$v === 'string' ? $$v.trim() : $$v);
        },
        expression: "newSpecName[index]"
      }
    }), _c('el-button', {
      attrs: {
        "size": "small"
      },
      on: {
        "click": function ($event) {
          return _vm.addSpec(spec.list, _vm.newSpecName[index], index);
        }
      }
    }, [_vm._v("+添加")]), index != 0 ? _c('el-switch', {
      staticStyle: {
        "float": "right",
        "margin-left": "20px",
        "margin-top": "8px"
      },
      attrs: {
        "active-color": "#13ce66",
        "inactive-color": "#f2f2f2"
      },
      on: {
        "change": _vm._changeSwitch
      },
      model: {
        value: spec.checked,
        callback: function ($$v) {
          _vm.$set(spec, "checked", $$v);
        },
        expression: "spec.checked"
      }
    }) : _vm._e(), index != 0 ? _c('el-button', {
      staticStyle: {
        "float": "right"
      },
      attrs: {
        "type": "primary",
        "size": "small"
      },
      on: {
        "click": function ($event) {
          return _vm.deleteType(index);
        }
      }
    }, [_vm._v("删除规格")]) : _vm._e()], 1), _c('div', {
      staticClass: "textitem"
    }, [index == 0 ? _c('el-row', {
      staticClass: "row-bg",
      staticStyle: {
        "margin-top": "0",
        "flex-wrap": "wrap"
      }
    }, _vm._l(spec.list, function (specName, ind) {
      return _c('el-col', {
        key: ind,
        attrs: {
          "span": 12,
          "sm": {
            span: 12
          }
        }
      }, [_c('div', {
        staticClass: "tabgsBox"
      }, [_c('span', {
        staticClass: "destitle"
      }, [_vm._v("序号：" + _vm._s(ind))]), _c('div', {
        staticStyle: {
          "overflow": "hidden",
          "margin-right": "10px"
        }
      }), _c('div', {
        staticStyle: {
          "flex": "1",
          "margin-right": "16px"
        }
      }, [_c('el-input', {
        staticClass: "price-modi",
        staticStyle: {
          "width": "100%"
        },
        attrs: {
          "size": "mini",
          "clearable": ""
        },
        on: {
          "blur": _vm._blur
        },
        model: {
          value: specName.name,
          callback: function ($$v) {
            _vm.$set(specName, "name", typeof $$v === 'string' ? $$v.trim() : $$v);
          },
          expression: "specName.name"
        }
      })], 1), _c('el-button', {
        staticClass: "el-icon-delete",
        staticStyle: {
          "margin-right": "10px"
        },
        attrs: {
          "size": "mini",
          "type": "primary",
          "circle": "",
          "disabled": ind == 0
        },
        on: {
          "click": function ($event) {
            return _vm.deleteSpec(ind, spec.list, index);
          }
        }
      }), _c('el-switch', {
        attrs: {
          "disabled": ind == 0,
          "active-color": "#13ce66",
          "inactive-color": "#f2f2f2"
        },
        on: {
          "change": _vm._changeSwitch
        },
        model: {
          value: specName.checked,
          callback: function ($$v) {
            _vm.$set(specName, "checked", $$v);
          },
          expression: "specName.checked"
        }
      })], 1)]);
    }), 1) : _vm._e(), index != 0 ? _c('el-row', {
      staticClass: "row-bg",
      staticStyle: {
        "margin-top": "0"
      }
    }, _vm._l(spec.list, function (specName, ind) {
      return _c('el-col', {
        key: `${index}_${ind}`,
        attrs: {
          "span": 12
        }
      }, [_c('div', {
        staticClass: "tabgsBox"
      }, [_c('span', {
        staticClass: "destitle"
      }, [_vm._v("序号：" + _vm._s(ind))]), _c('div', {
        staticStyle: {
          "overflow": "hidden",
          "margin-right": "10px"
        }
      }), _c('div', {
        staticStyle: {
          "flex": "1",
          "margin-right": "16px"
        }
      }, [_c('el-input', {
        staticClass: "price-modi",
        staticStyle: {
          "width": "100%"
        },
        attrs: {
          "size": "mini",
          "clearable": ""
        },
        on: {
          "blur": _vm._blur
        },
        model: {
          value: specName.name,
          callback: function ($$v) {
            _vm.$set(specName, "name", typeof $$v === 'string' ? $$v.trim() : $$v);
          },
          expression: "specName.name"
        }
      })], 1), _c('el-row', {
        staticStyle: {
          "margin-top": "0",
          "padding-right": "10px"
        },
        attrs: {
          "type": "flex",
          "justify": "end ",
          "align": "middle"
        }
      }, [_c('el-button', {
        staticClass: "el-icon-delete",
        staticStyle: {
          "margin-right": "10px"
        },
        attrs: {
          "size": "mini",
          "type": "primary",
          "circle": "",
          "disabled": ind == 0
        },
        on: {
          "click": function ($event) {
            return _vm.deleteSpec(ind, spec.list, index);
          }
        }
      }), _c('el-switch', {
        attrs: {
          "disabled": ind == 0,
          "active-color": "#13ce66",
          "inactive-color": "#f2f2f2"
        },
        on: {
          "change": _vm._changeSwitch
        },
        model: {
          value: specName.checked,
          callback: function ($$v) {
            _vm.$set(specName, "checked", $$v);
          },
          expression: "specName.checked"
        }
      })], 1)], 1)]);
    }), 1) : _vm._e()], 1)])], 1);
  }), 1)], 1) : _c('div', {
    staticClass: "noneText"
  }, [_vm._v("暂无数据")])]), _c('el-divider', [_vm._v("sku规格")]), _c('div', {
    staticClass: "menusBox"
  }, [_c('div', {
    staticClass: "spec"
  }, [_c('h4', [_vm._v("商品价格")]), _c('span', {
    staticClass: "skutip"
  }, [_vm._v("* 商品的价格批量填写")]), _c('el-button', {
    staticClass: "mar-t",
    attrs: {
      "type": "primary",
      "plain": "",
      "size": "small"
    },
    on: {
      "click": _vm._setSkuMsg
    }
  }, [_vm._v("一键设置")])], 1), _c('div', {
    staticClass: "specflex"
  }, [_c('div', {
    staticStyle: {
      "margin-bottom": "20px"
    },
    attrs: {
      "span": 6
    }
  }, [_vm._m(0), _c('el-input', {
    staticClass: "goods-price",
    attrs: {
      "size": "small"
    },
    model: {
      value: _vm.displayedPrices.skus_origin,
      callback: function ($$v) {
        _vm.$set(_vm.displayedPrices, "skus_origin", $$v);
      },
      expression: "displayedPrices.skus_origin"
    }
  }), _vm._v("   ")], 1), _c('div', {
    staticStyle: {
      "margin-bottom": "20px"
    },
    attrs: {
      "span": 6
    }
  }, [_vm._m(1), _c('el-input', {
    staticClass: "goods-price",
    attrs: {
      "size": "small"
    },
    model: {
      value: _vm.displayedPrices.skus_price,
      callback: function ($$v) {
        _vm.$set(_vm.displayedPrices, "skus_price", $$v);
      },
      expression: "displayedPrices.skus_price"
    }
  }), _vm._v("   ")], 1), _c('div', {
    staticStyle: {
      "margin-bottom": "20px"
    },
    attrs: {
      "span": 6
    }
  }, [_vm._m(2), _c('el-input', {
    staticClass: "goods-price",
    attrs: {
      "size": "small"
    },
    model: {
      value: _vm.displayedPrices.skus_stock,
      callback: function ($$v) {
        _vm.$set(_vm.displayedPrices, "skus_stock", $$v);
      },
      expression: "displayedPrices.skus_stock"
    }
  }), _vm._v("   ")], 1)])]), _vm.enableSpec && _vm.specs.length !== 0 ? [_c('el-table', {
    key: "aTable",
    attrs: {
      "data": _vm.productsInfo.goods_spec,
      "border": ""
    }
  }, [_c('el-table-column', {
    attrs: {
      "type": "index",
      "label": "序号",
      "width": "50"
    }
  }), _vm._l(_vm.vilidParameter, function (it, ids) {
    return _c('el-table-column', {
      key: ids,
      attrs: {
        "label": it.name
      },
      scopedSlots: _vm._u([{
        key: "default",
        fn: function (scope) {
          return [_c('span', [_vm._v(_vm._s(scope.row.skus_difference[ids]))])];
        }
      }], null, true)
    });
  }), _c('el-table-column', {
    attrs: {
      "label": "原价",
      "prop": "skus_origin"
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function (scope) {
        return [_c('el-popover', {
          attrs: {
            "trigger": "click",
            "placement": "top"
          }
        }, [_c('p', [_vm._v(" 原价: "), _c('el-input', {
          staticClass: "price-modi",
          attrs: {
            "size": "mini"
          },
          model: {
            value: scope.row.skus_origin,
            callback: function ($$v) {
              _vm.$set(scope.row, "skus_origin", _vm._n($$v));
            },
            expression: "scope.row.skus_origin"
          }
        })], 1), _c('div', {
          staticStyle: {
            "text-align": "right",
            "margin": "0"
          }
        }), _c('div', {
          staticClass: "name-wrapper",
          attrs: {
            "slot": "reference"
          },
          slot: "reference"
        }, [_vm._v(_vm._s(scope.row.skus_origin))])])];
      }
    }], null, false, 2107551040)
  }), _c('el-table-column', {
    attrs: {
      "prop": "skus_price",
      "label": "售价"
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function (scope) {
        return [_c('el-popover', {
          attrs: {
            "trigger": "click",
            "placement": "top"
          }
        }, [_c('p', [_vm._v(" 售价: "), _c('el-input', {
          staticClass: "price-modi",
          attrs: {
            "size": "mini"
          },
          model: {
            value: scope.row.skus_price,
            callback: function ($$v) {
              _vm.$set(scope.row, "skus_price", _vm._n($$v));
            },
            expression: "scope.row.skus_price"
          }
        })], 1), _c('div', {
          staticStyle: {
            "text-align": "right",
            "margin": "0"
          }
        }), _c('div', {
          staticClass: "name-wrapper",
          attrs: {
            "slot": "reference"
          },
          slot: "reference"
        }, [_vm._v(_vm._s(scope.row.skus_price))])])];
      }
    }], null, false, 1547825329)
  }), _c('el-table-column', {
    attrs: {
      "prop": "skus_stock",
      "label": "库存"
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function (scope) {
        return [_c('el-popover', {
          attrs: {
            "trigger": "click",
            "placement": "top"
          }
        }, [_c('p', [_vm._v(" 库存: "), _c('el-input', {
          staticClass: "price-modi",
          attrs: {
            "size": "mini"
          },
          model: {
            value: scope.row.skus_stock,
            callback: function ($$v) {
              _vm.$set(scope.row, "skus_stock", _vm._n($$v));
            },
            expression: "scope.row.skus_stock"
          }
        })], 1), _c('div', {
          staticStyle: {
            "text-align": "right",
            "margin": "0"
          }
        }), _c('div', {
          staticClass: "name-wrapper",
          attrs: {
            "slot": "reference"
          },
          slot: "reference"
        }, [_vm._v(_vm._s(scope.row.skus_stock))])])];
      }
    }], null, false, 2272532611)
  }), _vm.productsInfo.flashsale_code ? _c('el-table-column', {
    attrs: {
      "prop": "skus_stock",
      "label": "活动价格"
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function (scope) {
        return [_c('el-popover', {
          attrs: {
            "trigger": "click",
            "placement": "top"
          }
        }, [_c('p', [_vm._v(" 活动价格: "), _c('el-input', {
          staticClass: "price-modi",
          attrs: {
            "size": "mini"
          },
          model: {
            value: scope.row.sale_price,
            callback: function ($$v) {
              _vm.$set(scope.row, "sale_price", _vm._n($$v));
            },
            expression: "scope.row.sale_price"
          }
        })], 1), _c('div', {
          staticClass: "name-wrapper",
          attrs: {
            "slot": "reference"
          },
          slot: "reference"
        }, [_vm._v(_vm._s(scope.row.sale_price ? scope.row.sale_price : 0))])])];
      }
    }], null, false, 273050656)
  }) : _vm._e(), _vm.productsInfo.flashsale_code ? _c('el-table-column', {
    attrs: {
      "prop": "skus_stock",
      "label": "活动库存"
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function (scope) {
        return [_c('el-popover', {
          attrs: {
            "trigger": "click",
            "placement": "top"
          }
        }, [_c('p', [_vm._v(" 活动库存: "), _c('el-input', {
          staticClass: "price-modi",
          attrs: {
            "size": "mini"
          },
          model: {
            value: scope.row.sale_stock,
            callback: function ($$v) {
              _vm.$set(scope.row, "sale_stock", _vm._n($$v));
            },
            expression: "scope.row.sale_stock"
          }
        })], 1), _c('div', {
          staticClass: "name-wrapper",
          attrs: {
            "slot": "reference"
          },
          slot: "reference"
        }, [_vm._v(_vm._s(scope.row.sale_stock ? scope.row.sale_stock : 0))])])];
      }
    }], null, false, 1278048813)
  }) : _vm._e()], 2)] : _vm._e()], 2);
};

var skusvue_type_template_id_b4b38b8e_scoped_true_staticRenderFns = [function () {
  var _vm = this,
      _c = _vm._self._c;

  return _c('div', {
    staticStyle: {
      "margin-bottom": "10px"
    }
  }, [_c('b', {
    staticClass: "must-fill"
  }, [_vm._v("*")]), _vm._v("原价（元）:")]);
}, function () {
  var _vm = this,
      _c = _vm._self._c;

  return _c('div', {
    staticStyle: {
      "margin-bottom": "10px"
    }
  }, [_c('b', {
    staticClass: "must-fill"
  }, [_vm._v("*")]), _vm._v("售价（元）:")]);
}, function () {
  var _vm = this,
      _c = _vm._self._c;

  return _c('div', {
    staticStyle: {
      "margin-bottom": "10px"
    }
  }, [_c('b', {
    staticClass: "must-fill"
  }, [_vm._v("*")]), _vm._v("商品库存(件) :")]);
}];

;// CONCATENATED MODULE: ./packages/skus/skus.vue?vue&type=template&id=b4b38b8e&scoped=true&

// EXTERNAL MODULE: ./node_modules/vuedraggable/dist/vuedraggable.umd.js
var vuedraggable_umd = __webpack_require__(9980);
var vuedraggable_umd_default = /*#__PURE__*/__webpack_require__.n(vuedraggable_umd);
// EXTERNAL MODULE: ./node_modules/axios/index.js
var axios = __webpack_require__(9669);
var axios_default = /*#__PURE__*/__webpack_require__.n(axios);
;// CONCATENATED MODULE: ./examples/utils/request.js
 // import { Message } from 'element-ui'
// import store from '@/store'
// import { getToken } from '@/utils/auth'
// import { loginApi } from '@/api/api'
// import CryptoJS from 'crypto-js' 
// 缓存请求的数组

let cacheRequestArr = (/* unused pure expression or super */ null && ([]));
let count = 0;
let Token = null; // 将请求都push到数组中,数组是[function(token){}, function(token){},...]

function cacheRequestArrHandle(cb) {
  cacheRequestArr.push(cb);
} // 数组中的请求得到新的token之后执行，用新的token去重新发起请求


function afreshRequest(token) {
  cacheRequestArr.map(cb => cb(token));
  cacheRequestArr = [];
} // 获取sign签名


function getSign(signBefore) {
  // const arr = ['appSecret', 'timestamp', 'nonceStr', 'token', 'body']
  // let str = ''
  // arr.forEach((item) => {
  //   const value = signBefore[item]
  //   if (!value) {
  //     return
  //   } else {
  //     str += `&${item}=${signBefore[item]}`
  //   }
  // })
  return 'dsfasdfasdfasdfsdf';
}

let cacheList = [];
let request_status = false; // 防止重复请求获取临时秘钥的接口

const getToken = async () => {
  if (request_status) {
    return new Promise(resolve => {
      cacheList.push(data => {
        resolve(data);
      });
    });
  } else {
    request_status = true;
    const {
      data
    } = await axios_default().get('http://rest.apizza.net/mock/8b3df8e547994a420afc353aafe94efd/login');
    cacheList.forEach(item => {
      item(data);
    });
    cacheList = [];
    request_status = false;
    Token = '12312312321';
    return data;
  }
}; // 是否为开发环境


const isDev =  false || "production" === 'test'; // 是否是开发环境
// create an axios instance

const service = axios_default().create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout

});
service.interceptors.request.use(async config => {
  count += 1;
  console.log('count', count);
  let appId, appSecret, nonceStr;

  if (isDev) {
    appId = 'FvI0ogwb';
    appSecret = '66d9570cb545b46abc05945ce7df2a13609de5e7';
    nonceStr = 'HomeAdmin';
  } else {
    appId = 'FvI0ogwb';
    appSecret = '66d9570cb545b46abc05945ce7df2a13609de5e7';
    nonceStr = 'HomeAdmin';
  }

  const timestamp = Date.now();
  config.headers['app_id'] = appId;
  config.headers['timestamp'] = timestamp;
  config.headers['nonce_str'] = nonceStr;
  const signBefore = {
    appSecret,
    timestamp,
    nonceStr
  };
  const body = JSON.stringify(config.data); // console.log('body', body)
  // if (body != undefined && body.length > 0) {
  //   // base64
  //   var words = CryptoJS.enc.Utf8.parse(body)
  //   var base64 = CryptoJS.enc.Base64.stringify(words)
  //   signBefore.body = base64
  // }

  if (!Token) {
    let token = await getToken();
    config.headers['token'] = token; // signBefore.token = getToken()[0]
    // const now = new Date().getTime()
    // const tokenExpTime = getToken()[3]
    // if ((!tokenExpTime || tokenExpTime < now) && config.url !== loginApi.sessionRefresh) {
    //   // console.log(config.url + '时token过期')
    //   //将请求缓存起来
    //   // console.log('缓存' + config.url + '的请求')
    //   let retry = new Promise((resolve) => {
    //     cacheRequestArrHandle((token) => {
    //       signBefore.token = token
    //       const sign = getSign(signBefore)
    //       config.headers['sign'] = sign
    //       config.headers['token'] = token // token为刷新完成后传入的token
    //       // console.log('开始执行缓存的请求' + config.url + '--token是' + token)
    //       resolve(config)
    //     })
    //   })
    //   if (!store.getters.isRefreshing) {
    //     //开始刷新token
    //     // console.log('开始刷新')
    //     store
    //       .dispatch('user/sessionRefresh')
    //       .then(() => {
    //         // console.log('刷新成功')
    //         // 刷新token完成后重新请求之前的请求
    //         afreshRequest(getToken()[0])
    //       })
    //       .catch(() => {
    //         //刷新token失败，跳转登陆页
    //         cacheRequestArr = []
    //         store.dispatch('user/resetToken').then(() => {
    //           location.reload()
    //         })
    //       })
    //   }
    //   return retry
    // }
    // return new Promise((rol, rej) => {
    //   setTimeout(() => {
    //     rol(config)
    //   }, 4000)
    // })

    return config;
  }

  const sign = getSign(signBefore);
  config.headers['sign'] = sign;
  return config;
}, error => {
  // do something with request error
  console.log(error); // for debug

  return Promise.reject(error);
}); // response interceptor

service.interceptors.response.use(
/**
 * If you want to get http information such as headers or status
 * Please return  response => response
 */

/**
 * Determine the request status by custom code
 * Here is just an example
 * You can also judge the status by HTTP Status Code
 */
response => {
  const res = response.data;
  const {
    config
  } = response; //不校验code是否为1，直接把交给页面去处理

  if (config.unCheckCode) {
    return res;
  } // if the custom code is not 1, it is judged as an error.


  if (res.code !== 1) {
    // token无效
    if (res.code === 1003 || res.code === 1004 || res.code === 1005) {
      store.dispatch('user/resetToken').then(() => {
        setTimeout(() => {
          location.reload();
        }, 1000);
        Message({
          message: '登录状态失效，请重新登录',
          type: 'error',
          duration: 2.5 * 1000
        });
      });
      return;
    }

    const msg = res.code === -1 ? '服务器繁忙,请稍后再试' : res.msg || 'Error'; // Message({
    //   message: msg,
    //   type: 'error',
    //   duration: 2.5 * 1000
    // })

    console.log('msg' + msg); // for debug 

    return Promise.reject();
  } else {
    return res;
  }
}, error => {
  console.log('err' + error); // for debug
  // Message({
  //   message: error.message || 'Error',
  //   type: 'error',
  //   duration: 2.5 * 1000
  // })

  return Promise.reject(error);
});
function request(url, data = {}, {
  method = 'post',
  unCheckCode = false
} = {}) {
  return service({
    url,
    data,
    method,
    unCheckCode
  });
}
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-83.use[1]!./node_modules/babel-loader/lib/index.js!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./packages/skus/skus.vue?vue&type=script&lang=js&
// import UploadImage from './UploadImage'
 // import ActivityList from './activityList'


/* harmony default export */ var skusvue_type_script_lang_js_ = ({
  name: 'yp-skus',
  components: {
    // UploadImage,
    draggable: (vuedraggable_umd_default()) // ActivityList

  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },

  data() {
    return {
      arr: [1, 3, 5],
      visible2: false,
      // local
      // __flag
      // 规格种类的数量
      typesLength: null,
      enableSpec: true,
      // __data
      // 注意此项为数组 type Array
      originalPrices: [{
        skus_origin: 110,
        skus_price: 100,
        cost: 90,
        skus_stock: 110
      }],
      // 批量填写价格
      defaultAddPrices: {
        skus_origin: 100,
        skus_price: 90,
        cost: 80,
        skus_stock: 50
      },
      // from backend
      specs: [{
        type: '颜色',
        children: ['红', '蓝']
      }],
      // from backend
      specPrices: [{
        specs: ['红', '大'],
        prices: {
          skus_origin: 90,
          skus_price: 60,
          cost: 40,
          skus_stock: 10
        }
      }],
      newSpecName: ['', '', '', '', '', ''],
      tableData: [],
      uploadUrl: ({"NODE_ENV":"production","BASE_URL":"/"}).VUE_APP_BASE_API + '/Upload/File/Saves',
      imageUrl: '',
      activityShow: false,
      activityList: '',
      productsInfo: {
        goods_parameter: [],
        goods_spec: []
      }
    };
  },

  computed: {
    vilidParameter() {
      let arr = [];
      this.productsInfo.goods_parameter.map(item => {
        if (item.checked) {
          arr.push(item);
        }
      });
      return arr;
    },

    displayedPrices() {
      // //console.log(this.enableSpec ? this.defaultAddPrices : this.originalPrices[0])
      return this.enableSpec ? this.defaultAddPrices : this.originalPrices[0];
    },

    dragOptions() {
      return {
        animation: 0,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      };
    },

    currentAct() {
      let resitem = {};

      if (this.activityList) {
        this.activityList.some(item => {
          if (this.productsInfo.flashsale_code === item.flashsale_code) {
            resitem = item;
          }
        });
      } else {
        resitem = {
          begin_date: '',
          end_date: '',
          flashsale_code: '',
          goods_count: 0,
          status: 0,
          title: ''
        };
      }

      return resitem;
    }

  },

  created() {
    this.specs = [];
    this.specPrices = [];

    if (this.specs.length === 0) {
      // 初始化规格数据
      const obj = {};
      obj.type = '统一规格';
      obj.children = ['标准规格'];
      this.specs.push(obj);
    }

    this.typesLength = this.specs.length;
    this.enableSpec = !!this.typesLength;
    this.enableSpec = true; // this._getAllAct()
  },

  methods: {
    // 拖动回调
    dragHandle(e) {
      console.log(e);
      console.log(this.productsInfo.goods_parameter);
      this.calcTable();
    },

    // 一键设置
    _setSkuMsg() {
      this.$confirm('确定要一键设置所有属性信息？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.productsInfo.goods_spec.map(item => {
          item.skus_origin = this.displayedPrices.skus_origin;
          item.skus_price = this.displayedPrices.skus_price;
          item.skus_stock = this.displayedPrices.skus_stock;
        }); // this.closeLoading(this, loading)
      }).catch(err => {
        console.error(err);
      });
    },

    // 获取所有的可选活动
    async _getAllAct() {
      let data = {
        title: '',
        //限时购标题
        status: '',
        //状态
        pageIndex: 1,
        //页
        pageSize: 100 //条

      };
      const res = await this.__getAllAct(data);

      if (res.result === 1) {
        this.activityList = res.data.rows;
      }
    },

    async __getAllAct(data) {
      return request({
        url: '/Shop/ShopFlashSale/list',
        method: 'post',
        data
      });
    },

    // 确认参加活动
    _addInActivity(data) {
      // debugger
      // this.currentAct = data
      this.productsInfo.flashsale_code = data.flashsale_code;
      this.activityShow = false;
    },

    // 退出活动
    _outActivity() {
      this.productsInfo.flashsale_code = ''; // 所有skulist活动清0

      this.productsInfo.goods_spec.map(item => {
        item.sale_price = 0;
        item.sale_stock = 0;
      });
    },

    // 选择活动
    _chooseActivity() {
      this.activityShow = true;
    },

    _blur() {
      // console.log(e);
      this.calcTable();
    },

    _changeSwitch() {
      // console.log(e)
      this.calcTable();
    },

    specPicSuccess() {},

    beforeAvatarUpload() {},

    _submit() {// console.log(this.tableData)
    },

    arrTest() {
      this.arr = 0; //   const t = 0
      //   const _t = '0'
      // console.log("Boolean(t)");
      // console.log(Boolean(t));
      // console.log(Boolean(_t));
    },

    test() {// console.log(this.specs);
    },

    deleteType(index) {
      if (index == 0) {
        this.$message({
          message: '该条为默认规格，不可删除',
          type: 'error'
        });
        return;
      }

      this.$confirm('确定删除规格名么, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.productsInfo.goods_parameter.splice(index, 1);
        this.calcTable();
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    deleteSpec(ind, spec, index) {
      if (index === 0 && spec.length <= 1) {
        this.$message({
          type: 'error',
          message: '请保留至少一条商品属性!'
        });
        return;
      } else {
        spec.splice(ind, 1);

        if (spec.length == 0) {
          this.productsInfo.goods_parameter[index].checked = false;
        }

        this.calcTable();
      }
    },

    modiSpec(specName, spec, index) {
      spec[index] = specName; // console.log(this.specs);
    },

    addType() {
      // alert()
      const obj = {};
      obj.name = `新增规格${this.productsInfo.goods_parameter.length + 1}`;
      obj.checked = true;
      obj.list = [{
        name: '新增属性',
        pic: '',
        checked: true
      }];
      this.productsInfo.goods_parameter.push(obj);
      this.calcTable();
    },

    addSpec(spec, newSpecName, index) {
      // console.log(111,spec, newSpecName);
      // 检测新规格名是否规范 1, 不为空. 2,不重复
      if (!newSpecName) {
        this.$message({
          type: 'error',
          message: '规格项名称不能为空!'
        });
        return;
      } else if (spec.some(item => item.name == newSpecName)) {
        this.$message({
          type: 'error',
          message: '规格项名称不能为重复!'
        });
        return;
      }

      spec.push({
        name: newSpecName,
        pic: '',
        checked: true
      });
      this.calcTable();
      this.newSpecName[index] = ''; // //console.log(this.specs)
    },

    // 计算表格
    calcTable() {
      const arr = []; // console.log(1, this.productsInfo);

      this.productsInfo.goods_parameter.forEach(item => {
        if (item.checked) {
          // console.log(item.list)
          let l = item.list;
          let r = [];

          for (let i = 0; i < l.length; i++) {
            // console.log(1.1,l[i])
            // let allUnCheck = false
            if (l[i].checked) {
              if (!l[i].name) {
                l[i].name = '匿名属性';
              }

              r.push(l[i]); // allUnCheck = true
            }
          }

          if (!item.name) {
            item.name = '匿名规格';
          } // console.log(1.5,r)


          arr.push([...r]);
        } else {// let l = item.list
          // for(let i=0;i<l.length;i++){
          //     // console.log(1.1,l[i])
          //     if(l[i].checked){
          //         l[i].checked = false
          //     }
          // }
        }
      }); // console.log(arr)

      const tableData = this.creatSku(arr); // console.log(2, tableData)

      const a = [];
      tableData.map((item, ids) => {
        a.push({
          skus_difference: [...item],
          skus_origin: this.displayedPrices.skus_origin,
          skus_price: this.displayedPrices.skus_price,
          skus_stock: this.displayedPrices.skus_stock,
          sale_price: 0,
          sale_stock: 0,
          id: ids
        });
      });
      this.productsInfo.goods_spec = a; // console.log(a)
    },

    creatSku(array) {
      // console.log('所有属性维维数组', array)
      if (array.length == 0) {
        return [];
      }

      if (array.length < 2) {
        const a = [];
        array[0].forEach(it => {
          a.push([it.name]);
        });
        return a || [];
      } // console.log('2种规格以上', array)


      return array.reduce((total, currentproductsInfo) => {
        const res = [];
        total.forEach(t => {
          // console.log(t,currentproductsInfo);
          currentproductsInfo.forEach(cv => {
            if (Array.isArray(t)) {
              // 或者使用 Array.isArray(t)
              // console.log('数组',[...t, cv.name])
              res.push([...t, cv.name]);
            } else {
              // console.log('非数组',[t.name, cv.name])
              res.push([t.name, cv.name]);
            }
          });
        }); // console.log(res)

        return res;
      });
    },

    modiPrice() {},

    getResult() {
      return { ...this.productsInfo
      };
    },

    setResult(value) {
      if (!value) return; // debugger

      this.productsInfo = value;
    },

    resetResult() {
      // debugger
      this.productsInfo = {
        goods_parameter: [],
        goods_spec: []
      };
    } // 规格组合数组


  }
});
;// CONCATENATED MODULE: ./packages/skus/skus.vue?vue&type=script&lang=js&
 /* harmony default export */ var skus_skusvue_type_script_lang_js_ = (skusvue_type_script_lang_js_); 
;// CONCATENATED MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-65.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-65.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-65.use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-65.use[3]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./packages/skus/skus.vue?vue&type=style&index=0&id=b4b38b8e&prod&lang=scss&scoped=true&
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ./packages/skus/skus.vue?vue&type=style&index=0&id=b4b38b8e&prod&lang=scss&scoped=true&

;// CONCATENATED MODULE: ./packages/skus/skus.vue



;


/* normalize component */

var skus_component = normalizeComponent(
  skus_skusvue_type_script_lang_js_,
  skusvue_type_template_id_b4b38b8e_scoped_true_render,
  skusvue_type_template_id_b4b38b8e_scoped_true_staticRenderFns,
  false,
  null,
  "b4b38b8e",
  null
  
)

/* harmony default export */ var skus = (skus_component.exports);
;// CONCATENATED MODULE: ./packages/index.js
/*
 * @Author       : xh
 * @Date         : 2022-06-21 19:59:42
 * @LastEditors  : xh
 * @FileName     :
 */
 // import Buttons from './buttons/buttons.vue'






const install = function (Vue) {
  // extend组件构造器
  // const newTables = Vue.extend(Tables)
  Vue.component('yp-city', citys); // Vue.component('XhButtons', Buttons)

  Vue.component('yp-dan', dan);
  Vue.component('yp-mounth-picker', mounthPicker);
  Vue.component('yp-skus', skus);
}; // 注入 Vue


if (typeof window.Vue !== 'undefined' && window.Vue) {
  install(window.Vue);
}

/* harmony default export */ var packages_0 = ({
  install,
  Citys: citys,
  // Buttons,
  Dan: dan,
  MounthPicker: mounthPicker,
  Skus: skus
});
;// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = (packages_0);


}();
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=yl.umd.js.map