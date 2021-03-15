restArguments(function(obj, keys) {
	keys = flatten(keys, false, false);
	var index = keys.length;
	if (index < 1) throw new Error('bindAll must be passed function names');
	while (index--) {
		var key = keys[index];
		obj[key] = bind(obj[key], obj);
	}
	return obj;
});
