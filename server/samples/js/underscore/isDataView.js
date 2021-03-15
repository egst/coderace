function ie10IsDataView(obj) {
	return obj != null && isFunction(obj.getInt8) && isArrayBuffer(obj.buffer);
}
