var isArguments = tagTester('Arguments');

(function() {
	if (!isArguments(arguments)) {
		isArguments = function(obj) {
			return has(obj, 'callee');
		};
	}
}());
