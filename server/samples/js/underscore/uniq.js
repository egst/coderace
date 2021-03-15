function uniq(array, isSorted, iteratee, context) {
	if (!isBoolean(isSorted)) {
		context = iteratee;
		iteratee = isSorted;
		isSorted = false;
	}
	if (iteratee != null) iteratee = cb(iteratee, context);
	var result = [];
	var seen = [];
	for (var i = 0, length = getLength(array); i < length; i++) {
		var value = array[i],
			computed = iteratee ? iteratee(value, i, array) : value;
		if (isSorted && !iteratee) {
			if (!i || seen !== computed) result.push(value);
			seen = computed;
		} else if (iteratee) {
			if (!contains(seen, computed)) {
				seen.push(computed);
				result.push(value);
			}
		} else if (!contains(result, value)) {
			result.push(value);
		}
	}
	return result;
}
