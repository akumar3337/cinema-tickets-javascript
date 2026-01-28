export default class InvalidPurchaseException extends Error {
	constructor(message = 'Invalid purchase') {
		super(message);
		this.name = 'InvalidPurchaseException';
	}
}
