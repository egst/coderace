function size(obj) {
	if (obj == null) return 0;
	return isArrayLike(obj) ? obj.length : keys(obj).length;
}
