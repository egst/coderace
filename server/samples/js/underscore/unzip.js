function unzip(array) {
	var length = array && max(array, getLength).length || 0;
	var result = Array(length);

	for (var index = 0; index < length; index++) {
		result[index] = pluck(array, index);
	}
	return result;
}
