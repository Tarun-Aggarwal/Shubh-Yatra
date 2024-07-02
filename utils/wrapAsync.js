module.exports = function (fn){
	return function(req, resp, next){
		fn(req, resp, next).catch((err) => next(err));
	}
}
