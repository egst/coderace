function mixin(obj) {
	each(functions(obj), function(name) {
		var func = _[name] = obj[name];
		_.prototype[name] = function() {
			var args = [this._wrapped];
			push.apply(args, arguments);
			return chainResult(this, func.apply(_, args));
		};
	});
	return _;
}
