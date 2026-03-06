'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Shuffle, Trash2, Link as LinkIcon, Check, Copy } from 'lucide-react';

export default function RandomSelector() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [inputText, setInputText] = useState('');
    const [items, setItems] = useState<string[]>([]);
    const [result, setResult] = useState<string | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [copied, setCopied] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load from URL params on mount
    useEffect(() => {
        const namesParam = searchParams.get('names');
        if (namesParam) {
            const parsedNames = namesParam.split(',').map(n => n.trim()).filter(n => n);
            if (parsedNames.length > 0) {
                setInputText(parsedNames.join('\n'));
                setItems(parsedNames);
            }
        }
    }, [searchParams]);

    // Update items when text changes
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setInputText(text);
        const newItems = text.split('\n').map(item => item.trim()).filter(item => item !== '');
        setItems(newItems);
    };

    // Handle file upload
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            setInputText(content);
            const newItems = content.split('\n').map(item => item.trim()).filter(item => item !== '');
            setItems(newItems);
        };
        reader.readAsText(file);

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Pick one random item
    const pickRandom = async () => {
        if (items.length === 0 || isAnimating) return;

        setIsAnimating(true);
        setResult(null);

        // Fake animation delay (Spinning effect simulation)
        const spinDuration = 2000;
        const intervalTime = 100;
        let elapsed = 0;

        const interval = setInterval(() => {
            setResult(items[Math.floor(Math.random() * items.length)]);
            elapsed += intervalTime;

            if (elapsed >= spinDuration) {
                clearInterval(interval);
                const finalResult = items[Math.floor(Math.random() * items.length)];
                setResult(finalResult);
                setIsAnimating(false);
            }
        }, intervalTime);
    };

    // Generate shareable link
    const copyShareLink = async () => {
        if (items.length === 0) return;

        const names = items.join(',');
        const url = new URL(window.location.href);
        url.searchParams.set('names', names);

        try {
            await navigator.clipboard.writeText(url.toString());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy link', err);
        }
    };

    const clearAll = () => {
        setInputText('');
        setItems([]);
        setResult(null);
        router.replace('/');
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
                <motion.h1
                    className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Team Random Selector
                </motion.h1>
                <motion.p
                    className="text-lg text-slate-600 max-w-2xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    회식 메뉴, 발표 순서 등을 재미있고 공정하게 랜덤으로 골라보세요.
                </motion.p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column: Inputs */}
                <motion.div
                    className="glass rounded-2xl p-6 flex flex-col space-y-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-slate-800">참가자 또는 항목 목록</h2>
                        <span className="text-sm font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                            {items.length} 개
                        </span>
                    </div>

                    <p className="text-sm text-slate-500">한 줄에 한 명(또는 항목)씩 입력해주세요.</p>

                    <textarea
                        className="w-full flex-1 min-h-[250px] p-4 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none shadow-inner"
                        placeholder="홍길동&#10;김철수&#10;이영희&#10;..."
                        value={inputText}
                        onChange={handleTextChange}
                    />

                    <div className="flex flex-wrap gap-2">
                        <input
                            type="file"
                            accept=".txt"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors text-slate-700 font-medium"
                        >
                            <Upload size={18} />
                            <span>.txt 파일 업로드</span>
                        </button>
                        <button
                            onClick={clearAll}
                            className="px-4 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                            title="모두 지우기"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </motion.div>

                {/* Right Column: Actions & Results */}
                <motion.div
                    className="flex flex-col space-y-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {/* Action Buttons */}
                    <div className="glass rounded-2xl p-6 space-y-4">
                        <button
                            onClick={pickRandom}
                            disabled={items.length === 0 || isAnimating}
                            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                        >
                            <Shuffle size={24} className={isAnimating ? 'animate-spin' : ''} />
                            <span>{isAnimating ? '추첨 중...' : '1명 랜덤 뽑기'}</span>
                        </button>

                        <button
                            onClick={copyShareLink}
                            disabled={items.length === 0}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 hover:border-blue-400 hover:text-blue-600 text-slate-700 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {copied ? <Check size={20} className="text-green-500" /> : <LinkIcon size={20} />}
                            <span>{copied ? '링크가 복사되었습니다!' : '현재 목록 공유 링크 복사'}</span>
                        </button>
                    </div>

                    {/* Result Area */}
                    <div className="glass rounded-2xl p-6 flex-1 flex flex-col items-center justify-center min-h-[250px] relative overflow-hidden">
                        <h2 className="absolute top-6 left-6 text-sm font-bold text-slate-400 uppercase tracking-widest">Result</h2>

                        <AnimatePresence mode="wait">
                            {result ? (
                                <motion.div
                                    key={result + (isAnimating ? '-animating' : '')}
                                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        y: 0,
                                        filter: isAnimating ? 'blur(2px)' : 'blur(0px)',
                                    }}
                                    exit={{ opacity: 0, scale: 1.2, transition: { duration: 0.15 } }}
                                    transition={{ type: 'spring', bounce: 0.5, duration: isAnimating ? 0.1 : 0.6 }}
                                    className="text-center"
                                >
                                    <div className={`text-5xl md:text-7xl font-black ${isAnimating ? 'text-slate-400' : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600'}`}>
                                        {result}
                                    </div>

                                    {!isAnimating && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.5 }}
                                            className="mt-6 inline-block"
                                        >
                                            <span className="px-4 py-1.5 bg-green-100 text-green-700 text-sm font-bold rounded-full shadow-sm">
                                                Winner! 🎉
                                            </span>
                                        </motion.div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-slate-300 flex flex-col items-center gap-4"
                                >
                                    <Shuffle size={48} className="opacity-20" />
                                    <p className="text-lg font-medium">버튼을 눌러 추첨을 시작하세요</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
