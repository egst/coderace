function reject(obj, predicate, context) {
	return filter(obj, negate(cb(predicate)), context);
}
