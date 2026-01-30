import { create } from 'zustand';

export interface Message {
	id: string;
	senderId: string;
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
	timestamp: string;
	isOnline: boolean;
	unread: boolean;
	messagePreview: string;
	messages?: Message[];
	isTyping?: boolean;
}

interface ChatStore {
	chats: Chat[];
	selectedChatId: string | null;
	userName: string | null;
	selectChat: (id: string) => void;
	markAsRead: (id: string) => void;
	sendMessage: (chatId: string, content: string) => void;
	setTyping: (chatId: string, isTyping: boolean) => void;
	setUserName: (name: string) => void;
}

const mockChats: Chat[] = [
	{
		id: '1',
		name: 'Sarah Miller',
		avatar: 'SM',
		lastMessage: 'Has anyone looke...',
		timestamp: 'JUST NOW',
		isOnline: true,
		unread: true,
		messagePreview: 'Has anyone looked at the new design system yet?',
		isTyping: false,
		messages: [
			{
				id: 'm1',
				senderId: 'sarah',
				senderName: 'Sarah',
				senderAvatar: 'SM',
				content:
					'Has anyone looked at the new React hooks for server components yet?',
				timestamp: '10:42 AM',
				isOwn: false,
			},
			{
				id: 'm2',
				senderId: 'user',
				senderName: 'You',
				senderAvatar: 'U',
				content:
					'Just started reading the docs! The useOptimistic hook looks incredibly useful for chat UIs like this one.',
				timestamp: '10:45 AM',
				isOwn: true,
			},
			{
				id: 'm3',
				senderId: 'alex',
				senderName: 'Alex',
				senderAvatar: 'AR',
				content:
					"I'm planning to refactor the dashboard components this afternoon.",
				timestamp: '10:46 AM',
				isOwn: false,
			},
			{
				id: 'm4',
				senderId: 'alex',
				senderName: 'Alex',
				senderAvatar: 'AR',
				content: 'Should make the UI much snappier. 🚀',
				timestamp: '10:47 AM',
				isOwn: false,
			},
		],
	},
	{
		id: '2',
		name: '#coding-front...',
		avatar: '💻',
		lastMessage: "Alex: I'm planning to refa...",
		timestamp: '10:45 PM',
		isOnline: false,
		unread: true,
		messagePreview: "Alex: I'm planning to refactor the API endpoints",
	},
	{
		id: '3',
		name: 'Alex Rivera',
		avatar: 'AR',
		lastMessage: 'The new UI library d...',
		timestamp: '9:12 AM',
		isOnline: true,
		unread: false,
		messagePreview: 'The new UI library documentation is really helpful',
	},
	{
		id: '4',
		name: 'Jordan Smith',
		avatar: 'JS',
		lastMessage: "I'll be out of office until M...",
		timestamp: 'Yesterday',
		isOnline: false,
		unread: false,
		messagePreview: "I'll be out of office until Monday afternoon",
	},
	{
		id: '5',
		name: '#gaming-lounge',
		avatar: '🎮',
		lastMessage: 'Sarah: Anyone up for so...',
		timestamp: 'Oct 12',
		isOnline: false,
		unread: false,
		messagePreview: 'Sarah: Anyone up for some gaming tonight?',
	},
	{
		id: '6',
		name: 'Marcus Chen',
		avatar: 'MC',
		lastMessage: 'Sent an attachment: quar...',
		timestamp: 'Oct 11',
		isOnline: true,
		unread: false,
		messagePreview: 'Sent an attachment: quarterly-report.pdf',
	},
];

export const useChatStore = create<ChatStore>((set) => ({
	chats: mockChats,
	selectedChatId: null,
	userName: null,
	selectChat: (id: string) =>
		set((state) => ({
			selectedChatId: id,
			chats: state.chats.map((chat) =>
				chat.id === id ? { ...chat, unread: false } : chat,
			),
		})),
	markAsRead: (id: string) =>
		set((state) => ({
			chats: state.chats.map((chat) =>
				chat.id === id ? { ...chat, unread: false } : chat,
			),
		})),
	sendMessage: (chatId: string, content: string) =>
		set((state) => ({
			chats: state.chats.map((chat) => {
				if (chat.id === chatId) {
					const newMessage: Message = {
						id: `m${Date.now()}`,
						senderId: 'user',
						senderName: 'You',
						senderAvatar: 'JD',
						content,
						timestamp: new Date().toLocaleTimeString('en-US', {
							hour: '2-digit',
							minute: '2-digit',
						}),
						isOwn: true,
					};
					return {
						...chat,
						messages: [...(chat.messages || []), newMessage],
						lastMessage: content.substring(0, 30) + '...',
					};
				}
				return chat;
			}),
		})),
	setTyping: (chatId: string, isTyping: boolean) =>
		set((state) => ({
			chats: state.chats.map((chat) =>
				chat.id === chatId ? { ...chat, isTyping } : chat,
			),
		})),
	setUserName: (name: string) => set({ userName: name }),
}));
