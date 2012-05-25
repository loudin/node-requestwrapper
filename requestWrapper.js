(function() {
  var buildRequestOptions, httpRequest, httpsRequest, jsonToQueryString, queryStringToJSON;

  httpRequest = require('http');

  httpsRequest = require('https');

  buildRequestOptions = function(url, method) {
    var host, path, port, reqType, request;
    reqType = null;
    port = null;
    if (url.indexOf("https://") !== -1) {
      reqType = httpsRequest;
      port = 443;
    } else {
      reqType = httpRequest;
      port = 80;
    }
    if (url.indexOf("http") !== -1) url = url.substring(url.indexOf("//") + 2);
    host = null;
    path = null;
    if (url.indexOf("/") === -1) {
      host = url;
    } else {
      host = url.substring(0, url.indexOf("/"));
      path = url.substring(url.indexOf("/"));
    }
    return request = {
      reqType: reqType,
      options: {
        host: host,
        port: port,
        path: path,
        method: method
      }
    };
  };

  jsonToQueryString = function(json) {
    var key, str, value;
    str = "";
    for (key in json) {
      value = json[key];
      str += "" + key + "=" + value + "&";
    }
    return str.slice(0, -1);
  };

  queryStringToJSON = function(querystring) {
    var arr, bits, elem, obj, _i, _len;
    arr = querystring.split('&');
    obj = {};
    for (_i = 0, _len = arr.length; _i < _len; _i++) {
      elem = arr[_i];
      bits = elem.split("=");
      obj[bits[0]] = bits[1];
    }
    return obj;
  };

  exports.get = function(url, callback) {
    var reqOptions, reqType, request, requestParams;
    requestParams = buildRequestOptions(url, "GET");
    reqType = requestParams.reqType;
    reqOptions = requestParams.options;
    request = reqType.request(reqOptions, function(response) {
      var allData;
      allData = "";
      response.on('data', function(d) {
        return allData += d;
      });
      return response.on('end', function() {
        if (callback) return callback(null, allData);
      });
    });
    request.on('error', function(e) {
      if (callback) return callback("Error with your request");
    });
    return request.end();
  };

  exports.post = function(url, params, callback) {
    var reqOptions, reqType, request, requestParams;
    requestParams = buildRequestOptions(url, "POST");
    reqType = requestParams.reqType;
    reqOptions = requestParams.options;
    params = jsonToQueryString(params);
    reqOptions.headers = {
      "Content-Type": 'application/x-www-form-urlencoded',
      "Content-Length": params.length
    };
    request = reqType.request(reqOptions, function(response) {
      var allData;
      allData = "";
      response.on('data', function(d) {
        return allData += d;
      });
      return response.on('end', function() {
        if (callback) return callback(null, allData);
      });
    });
    request.write(params);
    request.on('error', function(e) {
      if (callback) return callback("Error with your request");
    });
    return request.end();
  };

}).call(this);
