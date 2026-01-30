'use client';

import React from 'react';

import { useState } from 'react';
import { useChatStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function WelcomeScreen() {
	const [inputValue, setInputValue] = useState('');
	const { setUserName } = useChatStore();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (inputValue.trim()) {
			setUserName(inputValue.trim());
		}
	};

	return (
		<div className="flex items-center justify-center h-screen bg-linear-to-br from-blue-50 to-slate-100">
			<div className="w-full max-w-md px-8">
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500 mb-6">
						<span className="text-2xl text-white">💬</span>
					</div>
					<h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome</h1>
					<p className="text-slate-600">Join the conversation</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="name"
							className="block text-sm font-medium text-slate-700 mb-2"
						>
							What&apos;s your name?
						</label>
						<Input
							id="name"
							type="text"
							placeholder="Enter your name"
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							className="w-full"
							autoFocus
						/>
					</div>
					<Button
						type="submit"
						disabled={!inputValue.trim()}
						className="w-full bg-blue-500 hover:bg-blue-600 text-white"
					>
						Continue
					</Button>
				</form>

				<p className="text-center text-xs text-slate-500 mt-6">
					You can change your name anytime
				</p>
			</div>
		</div>
	);
}
