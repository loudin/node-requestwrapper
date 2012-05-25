node-requestwrapper
===================

Really simple request wrapper for http GET and POST requests in Node.js.

Examples:

Request = require 'path/to/requestWrapper'

GET Request
	Request.get "http://www.google.com", (err,data) ->
		#Data is returned in whatever format the request specifies. In this case, HTML
		#Do things with the data object

	Request.get "https://graph.facebook.com/oauth/access_token?...etc", (err,data) ->
		return res.json {error: err } if err
		returnData = convertQueryStringToJson(data)		#Note: this function is a helper I use
		returnData.access_token...

POST Request
	connectToInstagram = "https://api.instagram.com/oauth/access_token"
	params = 
		client_id: "clientId"
		client_secret: "secret"
		grant_type: "authorization_code"
		redirect_uri: "redirect"
		code: code
			
	Request.post connectToInstagram, params, (err, data) ->
		data = JSON.parse(data)
		nameparts = data.user.full_name.split(" ")
		...