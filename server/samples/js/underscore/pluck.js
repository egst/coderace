function pluck(obj, key) {
	return map(obj, property(key));
}
