function find(obj, predicate, context) {
	var keyFinder = isArrayLike(obj) ? findIndex : findKey;
	var key = keyFinder(obj, predicate, context);
	if (key !== void 0 && key !== -1) return obj[key];
}
