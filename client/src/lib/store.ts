import { create } from 'zustand';

export interface Message {
	id: string;
	senderName: string;
	senderAvatar: string;
	content: string;
	timestamp: string;
	isOwn: boolean;
}

export interface Chat {
	id: string;
	name: string;
	avatar: string;
	lastMessage: string;
	messages: Message[];
}

interface ChatStore {
	userName: string | null;
	chats: Chat[];
	selectedChatId: string | null;
	sentMessage: (chatId: string, content: string) => void;
	receiveMessage: (userName: string, message: { message: string }) => void;
	setUserName: (name: string) => void;
	selectChat: (id: string) => void;
	markAsRead: (id: string) => void;
}

const mockChats: Chat[] = [
	{
		id: '1',
		name: 'General Chat',
		avatar: '💬',
		lastMessage: '',
		messages: [],
	},
];

export const useChatStore = create<ChatStore>((set) => ({
	chats: mockChats,
	selectedChatId: '1',
	userName: null,

	// send a message from the user
	sentMessage: (chatId, content) =>
		set((state) => ({
			chats: state.chats.map((chat) =>
				chat.id === chatId
					? {
							...chat,
							messages: [
								...chat.messages,
								{
									id: `m${Date.now()}`,
									senderName: 'You',
									senderAvatar: 'JD',
									content,
									timestamp: new Date().toLocaleTimeString([], {
										hour: '2-digit',
										minute: '2-digit',
									}),
									isOwn: true,
								},
							],
							lastMessage: content,
						}
					: chat,
			),
		})),

	// receive a message from WebSocket
	receiveMessage: (userName: string, message: { message: string }) =>
		set((state) => ({
			chats: state.chats.map((chat) =>
				chat.id === state.selectedChatId
					? {
							...chat,
							messages: [
								...chat.messages,
								{
									id: `m${Date.now()}`,
									senderName: userName,
									senderAvatar: userName[0],
									content: message.message,
									timestamp: new Date().toLocaleTimeString([], {
										hour: '2-digit',
										minute: '2-digit',
									}),
									isOwn: false,
								},
							],
							lastMessage: message.message,
						}
					: chat,
			),
		})),

	setUserName: (name: string) => set({ userName: name }),
	selectChat: (id: string) => set({ selectedChatId: id }),
	markAsRead: (id: string) =>
		set((state) => ({
			chats: state.chats.map((chat) =>
				chat.id === id ? { ...chat, lastMessage: chat.lastMessage } : chat,
			),
		})),
}));
