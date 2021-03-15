function sample(obj, n, guard) {
	if (n == null || guard) {
		if (!isArrayLike(obj)) obj = values(obj);
		return obj[random(obj.length - 1)];
	}
	var sample = isArrayLike(obj) ? clone(obj) : values(obj);
	var length = getLength(sample);
	n = Math.max(Math.min(n, length), 0);
	var last = length - 1;
	for (var index = 0; index < n; index++) {
		var rand = random(index, last);
		var temp = sample[index];
		sample[index] = sample[rand];
		sample[rand] = temp;
	}
	return sample.slice(0, n);
}
