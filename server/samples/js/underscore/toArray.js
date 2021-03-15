function toArray(obj) {
	if (!obj) return [];
	if (isArray(obj)) return slice.call(obj);
	if (isString(obj)) {
		return obj.match(reStrSymbol);
	}
	if (isArrayLike(obj)) return map(obj, identity);
	return values(obj);
}
