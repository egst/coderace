function pairs(obj) {
	var _keys = keys(obj);
	var length = _keys.length;
	var pairs = Array(length);
	for (var i = 0; i < length; i++) {
		pairs[i] = [_keys[i], obj[_keys[i]]];
	}
	return pairs;
}
