restArguments(function(array, rest) {
	rest = flatten(rest, true, true);
	return filter(array, function(value){
		return !contains(rest, value);
	});
});
