export class CustomException extends Error {
	constructor(
		message: string,
		public statusCode: number,
	) {
		super(message);
	}
}
