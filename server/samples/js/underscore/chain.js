function chain(obj) {
	var instance = _(obj);
	instance._chain = true;
	return instance;
}
