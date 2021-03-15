function propertyOf(obj) {
	if (obj == null) return noop;
	return function(path) {
		return get(obj, path);
	};
}
