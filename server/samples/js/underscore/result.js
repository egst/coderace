function result(obj, path, fallback) {
	path = toPath(path);
	var length = path.length;
	if (!length) {
		return isFunction(fallback) ? fallback.call(obj) : fallback;
	}
	for (var i = 0; i < length; i++) {
		var prop = obj == null ? void 0 : obj[path[i]];
		if (prop === void 0) {
			prop = fallback;
			i = length; 		}
		obj = isFunction(prop) ? prop.call(obj) : prop;
	}
	return obj;
}
