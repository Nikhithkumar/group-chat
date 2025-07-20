export interface Message {
	id: string;
	username: string;
	text: string;
	timestamp: string;
}

export interface JoinResponse {
	success?: boolean;
	error?: string;
	messages: Message[];
}
