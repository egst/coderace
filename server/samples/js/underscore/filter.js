function filter(obj, predicate, context) {
	var results = [];
	predicate = cb(predicate, context);
	each(obj, function(value, index, list) {
		if (predicate(value, index, list)) results.push(value);
	});
	return results;
}
