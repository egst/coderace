restArguments(function(func, context, args) {
	if (!isFunction(func)) throw new TypeError('Bind must be called on a function');
	var bound = restArguments(function(callArgs) {
		return executeBound(func, bound, context, this, args.concat(callArgs));
	});
	return bound;
});
