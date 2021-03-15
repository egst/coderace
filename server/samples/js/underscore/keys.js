function keys(obj) {
	if (!isObject(obj)) return [];
	if (nativeKeys) return nativeKeys(obj);
	var keys = [];
	for (var key in obj) if (has(obj, key)) keys.push(key);
		if (hasEnumBug) collectNonEnumProps(obj, keys);
	return keys;
}
