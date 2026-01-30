'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatStore, type Chat } from '@/lib/store';

function ChatItem({ chat }: { chat: Chat }) {
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

				{/* Content */}
				<div className="flex-1 min-w-0">
					<div className="flex justify-between items-start gap-2">
						<h3 className="font-semibold text-slate-900 text-sm">
							{chat.name}
						</h3>
						<span
							className={`text-xs whitespace-nowrap ${
								chat.unread ? 'text-blue-500 font-semibold' : 'text-slate-400'
							}`}
						>
							{chat.timestamp}
						</span>
					</div>

					<div className="flex justify-between items-start gap-2 mt-1">
						<p className="text-xs text-slate-500 truncate">
							{chat.lastMessage}
						</p>
						{chat.isOnline && (
							<div className="w-2 h-2 rounded-full bg-green-500 shrink-0 mt-1" />
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export function ChatList() {
	const chats = useChatStore((state) => state.chats);
	const unreadCount = chats.filter((chat) => chat.unread).length;

	return (
		<div className="flex-1 flex flex-col bg-white">
			{/* Header */}
			<div className="p-6 border-b border-slate-200 flex justify-between items-start">
				<div>
					<h2 className="text-2xl font-bold text-slate-900">Recent Chats</h2>
					<p className="text-sm text-slate-500 mt-1">
						You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
					</p>
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
