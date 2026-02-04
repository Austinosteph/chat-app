'use client';

import { socket } from '@/lib/socket';
import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendIcon, PlusIcon, SmileIcon, ChevronLeft } from 'lucide-react';

export function ChatDetail() {
	const { userName } = useChatStore();
	const initials = userName
		? userName
				.match(/\b\w/g)
				?.slice(0, 2)
				.map((char) => char.toUpperCase())
				.join('')
		: '';
	const { chats, selectedChatId, sentMessage } = useChatStore();
	const [messageInput, setMessageInput] = useState('');
	const [typingStatus, setTypingStatus] = useState('');
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const selectedChat = chats.find((chat) => chat.id === selectedChatId);

	// Scroll to bottom whenever messages change
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [selectedChat?.messages]);

	//listens for incomming message
	useEffect(() => {
		const handleIncomingMessage = (data: {
			userName: string;
			message: string;
		}) => {
			// Avoid adding your own messages again
			if (data.userName !== userName) {
				useChatStore
					.getState()
					.receiveMessage(data.userName, { message: data.message });
			}
		};

		// Listen for incoming messages
		socket.on('message', handleIncomingMessage);

		// Clean up the listener when component unmounts or userName changes
		return () => {
			socket.off('message', handleIncomingMessage);
		};
	}, [userName]);

	// Sent message
	const handleSendMessage = () => {
		if (messageInput.trim() && selectedChatId && userName) {
			socket.emit('message', {
				userName,
				message: messageInput,
			});

			sentMessage(selectedChatId, messageInput);
			setMessageInput('');
		}
	};

	// Handle Input Changes
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setMessageInput(e.target.value);

		// Emit "typing" event to the server
		socket.emit('typing', { userName });
	};

	//listen for typingStatus
	useEffect(() => {
		let typingTimer: NodeJS.Timeout;

		// Listen for typing events from other users
		socket.on('user_typing', (data) => {
			setTypingStatus(`${data.userName} is typing...`);

			// Clear existing timer and set a new one
			clearTimeout(typingTimer);
			typingTimer = setTimeout(() => {
				setTypingStatus('');
			}, 2000);
		});

		return () => {
			socket.off('user_typing');
			clearTimeout(typingTimer);
		};
	}, [socket]);

	if (!selectedChat) {
		return (
			<div className="flex-1 flex items-center bg-gray-50">
				<p className="text-gray-500 md:pl-28 lg:pl-64 pl-10">
					Select a chat to start messaging
				</p>
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
							<div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
								{message.senderAvatar || message.senderName[0]}
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
							<div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
								{initials}
							</div>
						)}
					</div>
				))}

				<div ref={messagesEndRef} />
			</div>

			{/* show user typing */}
			{typingStatus && (
				<div className=" px-6 py-16 text-center">
					<p className="text-sm font-semibold text-gray-500 italic">
						{typingStatus}
					</p>
				</div>
			)}

			{/* Input */}
			<div className="border-t border-gray-200 p-4">
				<div className="flex items-center gap-3">
					<Button variant="ghost" size="icon" className="text-gray-400">
						<PlusIcon className="w-5 h-5" />
					</Button>

					<Input
						placeholder={`Message ${selectedChat.name}`}
						value={messageInput}
						onChange={handleInputChange}
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
