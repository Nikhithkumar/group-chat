// @store/messageStore.ts
import { create } from 'zustand';

export interface Message {
	id: string;
	username: string;
	text: string;
	timestamp: string;
}

interface MessageStore {
	messages: Message[];
	addMessage: (msg: Message) => void;
	setInitialMessages: (msgs: Message[]) => void;
	clearMessages: () => void;
}

export const useMessageStore = create<MessageStore>((set) => ({
	messages: [],
	addMessage: (msg) =>
		set((state) => {
			const newMessages = [...state.messages, msg];
			const last20 = newMessages.slice(-20); // keep only last 20 messages
			return { messages: last20 };
		}),
	setInitialMessages: (msgs) => set({ messages: msgs.slice(-20) }),
	clearMessages: () => set({ messages: [] }),
}));
