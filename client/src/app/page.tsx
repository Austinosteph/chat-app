'use client';

import { Sidebar } from '@/components/sidebar';
import { ChatList } from '@/components/chat-list';
import { ChatDetail } from '@/components/chat-detail';
import { WelcomeScreen } from '@/components/welcome-screen';
import { useChatStore } from '@/lib/store';

export default function Home() {
	const { userName, selectedChatId } = useChatStore();

	if (!userName) {
		return <WelcomeScreen />;
	}

	return (
		<main className="flex h-screen bg-slate-50">
			<Sidebar />
			<div className="flex-1 flex overflow-hidden">
				<div
					className={`${
						selectedChatId ? 'hidden md:block' : 'w-full md:w-96'
					} border-r border-slate-200 overflow-hidden`}
				>
					<ChatList />
				</div>
				<div
					className={`${selectedChatId ? 'flex-1' : 'hidden md:flex'} flex-col`}
				>
					<ChatDetail />
				</div>
			</div>
		</main>
	);
}
