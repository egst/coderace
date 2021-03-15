each(['concat', 'join', 'slice'], function(name) {
	var method = ArrayProto[name];
	_.prototype[name] = function() {
		var obj = this._wrapped;
		if (obj != null) obj = method.apply(obj, arguments);
		return chainResult(this, obj);
	};
});
