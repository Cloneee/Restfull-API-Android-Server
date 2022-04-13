const expressJwt = require("express-jwt");

function authJwt() {
	const secret = process.env.SECRET;
	const api = process.env.API_URL;
	return expressJwt({
		secret,
		algorithms: ["HS256"],
		isRevoked: isRevoked,
	}).unless({
		path: [
			// { url: /\/api\/v1\/products(.*)/, method: ["GET", "OPTIONS"] },
			// { url: /\/api\/v1\/categories(.*)/, method: ["GET", "OPTIONS"] },
			`${api}/user/login`,
			`${api}/user/register`,
		],
	});
}

async function isRevoked(req, payload, next) {
	req.locals = {payload: payload}
	next()
}

module.exports = authJwt;
