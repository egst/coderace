function tap(obj, interceptor) {
	interceptor(obj);
	return obj;
}
