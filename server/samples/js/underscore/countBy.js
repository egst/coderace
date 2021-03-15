group(function(result, value, key) {
	if (has(result, key)) result[key]++; else result[key] = 1;
});
