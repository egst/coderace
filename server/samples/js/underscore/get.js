function get(object, path, defaultValue) {
	var value = deepGet(object, toPath(path));
	return isUndefined(value) ? defaultValue : value;
}
