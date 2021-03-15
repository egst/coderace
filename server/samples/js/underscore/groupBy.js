group(function(result, value, key) {
	if (has(result, key)) result[key].push(value); else result[key] = [value];
});
