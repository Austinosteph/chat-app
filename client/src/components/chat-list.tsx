'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatStore, type Chat } from '@/lib/store';
import { useEffect } from 'react';
import { socket } from '@/lib/socket';

function ChatItem({ chat }: { chat: Chat }) {
	//websocket configuration
	useEffect(() => {
		socket.connect();

		socket.on('connect', () => {
			console.log('Connected:', socket.id);
		});
	}, []);

	const { selectedChatId, selectChat, markAsRead } = useChatStore();

	const handleClick = () => {
		selectChat(chat.id);
		markAsRead(chat.id);
	};

	const isSelected = selectedChatId === chat.id;

	return (
		<div
			onClick={handleClick}
			className={`p-4 cursor-pointer transition-colors ${
				isSelected
					? 'bg-blue-50 border-l-4 border-l-blue-500'
					: 'hover:bg-slate-50'
			}`}
		>
			<div className="flex gap-3 items-start">
				{/* Avatar */}
				<div
					className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white shrink-0 ${
						chat.avatar === '💻'
							? 'bg-slate-400'
							: chat.avatar === '🎮'
								? 'bg-slate-400'
								: chat.avatar === 'SM'
									? 'bg-amber-400'
									: chat.avatar === 'AR'
										? 'bg-slate-500'
										: chat.avatar === 'JS'
											? 'bg-slate-600'
											: chat.avatar === 'MC'
												? 'bg-slate-700'
												: 'bg-slate-400'
					}`}
				>
					{chat.avatar}
				</div>
				{/* Chat info */}
				<div className="flex-1">
					<p className="font-semibold text-gray-900">{chat.name}</p>{' '}
					{/* ✅ show name */}
					<p className="text-sm text-gray-500 truncate">
						{chat.lastMessage}
					</p>{' '}
					{/* optional */}
				</div>
			</div>
		</div>
	);
}

export function ChatList() {
	const chats = useChatStore((state) => state.chats);

	return (
		<div className="flex-1 flex flex-col bg-white">
			{/* Header */}
			<div className="p-6 border-b border-slate-200 flex justify-between items-start">
				<div>
					<h2 className="text-2xl font-bold text-slate-900">Recent Chats</h2>
				</div>
				<Button
					size="icon"
					className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
				>
					<Plus size={20} />
				</Button>
			</div>

			{/* Chat List */}
			<div className="flex-1 overflow-y-auto">
				{chats.map((chat) => (
					<ChatItem key={chat.id} chat={chat} />
				))}
			</div>
		</div>
	);
}
