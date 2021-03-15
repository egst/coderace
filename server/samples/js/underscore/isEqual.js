function isEqual(a, b, aStack, bStack) {
			if (a === b) return a !== 0 || 1 / a === 1 / b;
		if (a == null || b == null) return false;
		if (a !== a) return b !== b;
		var type = typeof a;
	if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
	return deepEq(a, b, aStack, bStack);
}
