function invert(obj) {
	var result = {};
	var _keys = keys(obj);
	for (var i = 0, length = _keys.length; i < length; i++) {
		result[obj[_keys[i]]] = _keys[i];
	}
	return result;
}
