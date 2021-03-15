function isEmpty(obj) {
	if (obj == null) return true;
			var length = getLength(obj);
	if (typeof length == 'number' && (
		isArray(obj) || isString(obj) || isArguments(obj)
	)) return length === 0;
	return getLength(keys(obj)) === 0;
}
