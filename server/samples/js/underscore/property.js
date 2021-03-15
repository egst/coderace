function property(path) {
	path = toPath(path);
	return function(obj) {
		return deepGet(obj, path);
	};
}
