var typedArrayPattern = /\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/;
function isTypedArray(obj) {
	return nativeIsView ? (nativeIsView(obj) && !isDataView(obj)) :
		isBufferLike(obj) && typedArrayPattern.test(toString.call(obj));
}
