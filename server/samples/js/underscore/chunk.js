function chunk(array, count) {
	if (count == null || count < 1) return [];
	var result = [];
	var i = 0, length = array.length;
	while (i < length) {
		result.push(slice.call(array, i, i += count));
	}
	return result;
}
