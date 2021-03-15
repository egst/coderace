function wrap(func, wrapper) {
	return partial(wrapper, func);
}
