function each(obj, iteratee, context) {
	iteratee = optimizeCb(iteratee, context);
	var i, length;
	if (isArrayLike(obj)) {
		for (i = 0, length = obj.length; i < length; i++) {
			iteratee(obj[i], i, obj);
		}
	} else {
		var _keys = keys(obj);
		for (i = 0, length = _keys.length; i < length; i++) {
			iteratee(obj[_keys[i]], _keys[i], obj);
		}
	}
	return obj;
}
