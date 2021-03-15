function map(obj, iteratee, context) {
	iteratee = cb(iteratee, context);
	var _keys = !isArrayLike(obj) && keys(obj),
		length = (_keys || obj).length,
		results = Array(length);
	for (var index = 0; index < length; index++) {
		var currentKey = _keys ? _keys[index] : index;
		results[index] = iteratee(obj[currentKey], currentKey, obj);
	}
	return results;
}
