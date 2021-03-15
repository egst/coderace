each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
	var method = ArrayProto[name];
	_.prototype[name] = function() {
		var obj = this._wrapped;
		if (obj != null) {
			method.apply(obj, arguments);
			if ((name === 'shift' || name === 'splice') && obj.length === 0) {
				delete obj[0];
			}
		}
		return chainResult(this, obj);
	};
});
