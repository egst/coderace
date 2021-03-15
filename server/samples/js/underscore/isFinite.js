export default function isFinite(obj) {
	return !isSymbol(obj) && _isFinite(obj) && !isNaN(parseFloat(obj));
}
