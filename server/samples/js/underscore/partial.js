restArguments(function(func, boundArgs) {
	var placeholder = partial.placeholder;
	var bound = function() {
		var position = 0, length = boundArgs.length;
		var args = Array(length);
		for (var i = 0; i < length; i++) {
			args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
		}
		while (position < arguments.length) args.push(arguments[position++]);
		return executeBound(func, bound, this, this, args);
	};
	return bound;
});
