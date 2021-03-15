restArguments(function(func, wait, args) {
	return setTimeout(function() {
		return func.apply(null, args);
	}, wait);
});
