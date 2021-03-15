function first(array, n, guard) {
	if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
	if (n == null || guard) return array[0];
	return initial(array, array.length - n);
}
