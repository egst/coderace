function isMatch(object, attrs) {
	var _keys = keys(attrs), length = _keys.length;
	if (object == null) return !length;
	var obj = Object(object);
	for (var i = 0; i < length; i++) {
		var key = _keys[i];
		if (attrs[key] !== obj[key] || !(key in obj)) return false;
	}
	return true;
}
