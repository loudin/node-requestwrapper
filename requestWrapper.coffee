httpRequest = require 'http'
httpsRequest = require 'https'

buildRequestOptions = (url, method) ->
	reqType = null
	port = null
	if url.indexOf("https://") != -1
		reqType = httpsRequest
		port = 443
	else
		reqType = httpRequest
		port = 80
	
	url = url.substring(url.indexOf("//")+2) if url.indexOf("http") != -1		#Change URL to remove http header if necessary
	
	host = null
	path = null
	if url.indexOf("/") == -1
		host = url
	else
		host = url.substring(0,url.indexOf("/"))
		path = url.substring(url.indexOf("/"))
		
	request = 
		reqType: reqType
		options: 
			host: host
			port: port
			path: path
			method: method

jsonToQueryString = (json) ->
	str = ""
	for key, value of json
		str += "#{key}=#{value}&"
	return str.slice(0,-1)
				
queryStringToJSON = (querystring) ->
	arr = querystring.split('&')
	obj = {}
	for elem in arr
		bits = elem.split("=")
		obj[bits[0]] = bits[1]
	return obj

exports.get = (url, callback) ->
	requestParams = buildRequestOptions url, "GET"
	reqType = requestParams.reqType
	reqOptions = requestParams.options
		
	request = reqType.request reqOptions, (response) ->
		allData = ""
		response.on 'data', (d) ->
			allData += d
		response.on 'end', ->
			callback(null, allData) if callback
			
	request.on 'error', (e) ->
		callback("Error with your request") if callback
	request.end()
	
exports.post = (url, params, callback) ->
	requestParams = buildRequestOptions url, "POST"
	reqType = requestParams.reqType
	reqOptions = requestParams.options
	
	params = jsonToQueryString(params)
	reqOptions.headers = {	"Content-Type": 'application/x-www-form-urlencoded', "Content-Length": params.length	}

	request = reqType.request reqOptions, (response) ->
		allData = ""
		response.on 'data', (d) ->
			allData += d
		response.on 'end', ->
			callback(null, allData) if callback
	
	request.write(params)
	request.on 'error', (e) ->
		callback("Error with your request") if callback
	request.end()
	