function contains(obj, item, fromIndex, guard) {
	if (!isArrayLike(obj)) obj = values(obj);
	if (typeof fromIndex != 'number' || guard) fromIndex = 0;
	return indexOf(obj, item, fromIndex) >= 0;
}
