function create(prototype, props) {
	var result = baseCreate(prototype);
	if (props) extendOwn(result, props);
	return result;
}
