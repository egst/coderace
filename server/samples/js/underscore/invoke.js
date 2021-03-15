restArguments(function(obj, path, args) {
	var contextPath, func;
	if (isFunction(path)) {
		func = path;
	} else {
		path = toPath(path);
		contextPath = path.slice(0, -1);
		path = path[path.length - 1];
	}
	return map(obj, function(context) {
		var method = func;
		if (!method) {
			if (contextPath && contextPath.length) {
				context = deepGet(context, contextPath);
			}
			if (context == null) return void 0;
			method = context[path];
		}
		return method == null ? method : method.apply(context, args);
	});
});
