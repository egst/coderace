function values(obj) {
	var _keys = keys(obj);
	var length = _keys.length;
	var values = Array(length);
	for (var i = 0; i < length; i++) {
		values[i] = obj[_keys[i]];
	}
	return values;
}
