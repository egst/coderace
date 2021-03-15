function has(obj, path) {
	path = toPath(path);
	var length = path.length;
	for (var i = 0; i < length; i++) {
		var key = path[i];
		if (!_has(obj, key)) return false;
		obj = obj[key];
	}
	return !!length;
}
