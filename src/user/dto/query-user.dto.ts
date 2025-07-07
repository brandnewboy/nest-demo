export interface QueryUserDto {
	page: number;
	limit?: number;
	username?: string;
	role?: number;
	gender?: number;
}
