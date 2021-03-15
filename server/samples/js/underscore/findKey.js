function findKey(obj, predicate, context) {
	predicate = cb(predicate, context);
	var _keys = keys(obj), key;
	for (var i = 0, length = _keys.length; i < length; i++) {
		key = _keys[i];
		if (predicate(obj[key], key, obj)) return key;
	}
}
