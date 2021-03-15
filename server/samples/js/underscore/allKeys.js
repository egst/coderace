function allKeys(obj) {
	if (!isObject(obj)) return [];
	var keys = [];
	for (var key in obj) keys.push(key);
	if (hasEnumBug) collectNonEnumProps(obj, keys);
	return keys;
}
