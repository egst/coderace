function clone(obj) {
	if (!isObject(obj)) return obj;
	return isArray(obj) ? obj.slice() : extend({}, obj);
}
