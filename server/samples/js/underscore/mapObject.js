function mapObject(obj, iteratee, context) {
	iteratee = cb(iteratee, context);
	var _keys = keys(obj),
		length = _keys.length,
		results = {};
	for (var index = 0; index < length; index++) {
		var currentKey = _keys[index];
		results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
	}
	return results;
}
