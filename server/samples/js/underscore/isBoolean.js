function isBoolean(obj) {
	return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
}
