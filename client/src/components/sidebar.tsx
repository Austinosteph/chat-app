'use client';
import { useChatStore } from '@/lib/store';
import { Home, Bell, Settings } from 'lucide-react';

export function Sidebar() {
	const { userName } = useChatStore();
	const initials = userName
		? userName
				.match(/\b\w/g)
				?.slice(0, 2)
				.map((char) => char.toUpperCase())
				.join('')
		: '';
	return (
		<div className="w-20 bg-linear-to-b from-slate-50 to-slate-100 border-r border-slate-200 flex flex-col items-center justify-between py-8">
			{/* Top Icons */}
			<div className="flex flex-col gap-8">
				{/* Home Icon */}
				<div className="w-10 h-10 rounded-lg bg-blue-500 text-white flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
					<Home size={20} />
				</div>

				{/* Notification Icon */}
				<button className="w-10 h-10 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer hover:bg-slate-300 transition-colors">
					<Bell size={20} />
				</button>

				{/* Settings Icon */}
				<button className="w-10 h-10 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer hover:bg-slate-300 transition-colors">
					<Settings size={20} />
				</button>
			</div>

			{/* Bottom User Avatar */}
			<div className="w-12 h-12 rounded-full bg-blue-500 text-white font-bold text-sm flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
				{initials}
			</div>
		</div>
	);
}
