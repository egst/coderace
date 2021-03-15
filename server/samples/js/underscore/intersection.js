function intersection(array) {
	var result = [];
	var argsLength = arguments.length;
	for (var i = 0, length = getLength(array); i < length; i++) {
		var item = array[i];
		if (contains(result, item)) continue;
		var j;
		for (j = 1; j < argsLength; j++) {
			if (!contains(arguments[j], item)) break;
		}
		if (j === argsLength) result.push(item);
	}
	return result;
}
