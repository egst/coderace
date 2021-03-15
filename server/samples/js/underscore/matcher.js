function matcher(attrs) {
	attrs = extendOwn({}, attrs);
	return function(obj) {
		return isMatch(obj, attrs);
	};
}
