restArguments(function(obj, keys) {
	var iteratee = keys[0], context;
	if (isFunction(iteratee)) {
		iteratee = negate(iteratee);
		if (keys.length > 1) context = keys[1];
	} else {
		keys = map(flatten(keys, false, false), String);
		iteratee = function(value, key) {
			return !contains(keys, key);
		};
	}
	return pick(obj, iteratee, context);
});
