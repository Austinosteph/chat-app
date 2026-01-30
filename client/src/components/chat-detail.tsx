'use client';

import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendIcon, PlusIcon, SmileIcon, ChevronLeft } from 'lucide-react';

export function ChatDetail() {
	const { chats, selectedChatId } = useChatStore();
	const [messageInput, setMessageInput] = useState('');
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const { sendMessage, setTyping } = useChatStore();

	const selectedChat = chats.find((chat) => chat.id === selectedChatId);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [selectedChat?.messages]);

	const handleSendMessage = () => {
		if (messageInput.trim() && selectedChatId) {
			sendMessage(selectedChatId, messageInput);
			setMessageInput('');

			// Simulate typing indicator
			setTyping(selectedChatId, true);
			setTimeout(() => {
				setTyping(selectedChatId, false);
			}, 2000);
		}
	};

	if (!selectedChat) {
		return (
			<div className="flex-1 flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<p className="text-gray-500">Select a chat to start messaging</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex-1 flex flex-col h-screen bg-white">
			{/* Header */}
			<div className="border-b border-gray-200 p-4 flex items-center gap-3">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => useChatStore.setState({ selectedChatId: null })}
					className="md:hidden text-gray-600 hover:bg-gray-100"
				>
					<ChevronLeft className="w-5 h-5" />
				</Button>
				<h2 className="text-lg font-semibold text-gray-900">
					{selectedChat.name}
				</h2>
			</div>

			{/* Messages */}
			<div className="flex-1 overflow-y-auto p-6 space-y-6">
				<div className="text-xs uppercase text-gray-400 text-center">Today</div>

				{selectedChat.messages?.map((message) => (
					<div
						key={message.id}
						className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} items-end gap-3`}
					>
						{!message.isOwn && (
							<div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
								{message.senderAvatar}
							</div>
						)}

						<div
							className={`flex flex-col ${message.isOwn ? 'items-end' : 'items-start'}`}
						>
							<span className="text-xs text-gray-500 mb-1">
								{message.senderName} {message.timestamp}
							</span>
							<div
								className={`max-w-xs px-4 py-3 rounded-lg ${
									message.isOwn
										? 'bg-blue-500 text-white rounded-br-none'
										: 'bg-gray-100 text-gray-900 rounded-bl-none'
								}`}
							>
								<p className="text-sm leading-relaxed">{message.content}</p>
							</div>
						</div>

						{message.isOwn && (
							<div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
								{message.senderAvatar}
							</div>
						)}
					</div>
				))}

				{selectedChat.isTyping && (
					<div className="flex items-end gap-3">
						<div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-semibold">
							{selectedChat.avatar}
						</div>
						<div className="text-xs text-gray-500 italic">
							{selectedChat.name.split(' ')[0]} is typing...
						</div>
					</div>
				)}

				<div ref={messagesEndRef} />
			</div>

			{/* Input */}
			<div className="border-t border-gray-200 p-4">
				<div className="flex items-center gap-3">
					<Button variant="ghost" size="icon" className="text-gray-400">
						<PlusIcon className="w-5 h-5" />
					</Button>

					<Input
						placeholder={`Message ${selectedChat.name}`}
						value={messageInput}
						onChange={(e) => setMessageInput(e.target.value)}
						onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
						className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-2 text-sm"
					/>

					<Button variant="ghost" size="icon" className="text-gray-400">
						<SmileIcon className="w-5 h-5" />
					</Button>

					<Button
						onClick={handleSendMessage}
						className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2"
						size="icon"
					>
						<SendIcon className="w-5 h-5" />
					</Button>
				</div>
			</div>
		</div>
	);
}
