'use client';
import { useState } from 'react';
import { Play, Zap, Target, Trophy } from 'lucide-react';

export default function HeroSection() {
    return (
        <section className='relative pt-32 pb-16 px-8'>
            <div className='max-w-[1400px] mx-auto'>
                <div className='text-center max-w-4xl mx-auto mb-20'>
                    {/* Main heading */}
                    <div className='mb-8'>
                        <h2 className='text-6xl md:text-7xl font-light tracking-tight text-white mb-6 leading-[0.9]'>
                            Master Web3
                            <span className='block text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600'>
                                Through Play
                            </span>
                        </h2>
                        <p className='text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto'>
                            Learn blockchain, AI, and crypto terminology through
                            an elegant snake game. Your scores are permanently
                            recorded on-chain.
                        </p>
                    </div>

                    {/* Feature pills */}
                    <div className='flex flex-wrap justify-center gap-3 mb-12'>
                        <div className='flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm'>
                            <Zap className='w-4 h-4 text-yellow-400' />
                            <span className='text-sm text-gray-300'>
                                On-chain Scores
                            </span>
                        </div>
                        <div className='flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm'>
                            <Target className='w-4 h-4 text-blue-400' />
                            <span className='text-sm text-gray-300'>
                                Learn by Playing
                            </span>
                        </div>
                        <div className='flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm'>
                            <Trophy className='w-4 h-4 text-purple-400' />
                            <span className='text-sm text-gray-300'>
                                Global Leaderboard
                            </span>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className='flex items-center justify-center'>
                        <div className='flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 rounded-full backdrop-blur-sm text-gray-300'>
                            <Play className='w-4 h-4' />
                            <span className='text-sm'>Start playing below</span>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto'>
                    <div className='text-center'>
                        <div className='text-3xl font-light text-white mb-2'>
                            3
                        </div>
                        <div className='text-sm text-gray-500'>
                            Learning Categories
                        </div>
                    </div>
                    <div className='text-center'>
                        <div className='text-3xl font-light text-white mb-2'>
                            2
                        </div>
                        <div className='text-sm text-gray-500'>
                            Supported Networks
                        </div>
                    </div>
                    <div className='text-center'>
                        <div className='text-3xl font-light text-white mb-2'>
                            50
                        </div>
                        <div className='text-sm text-gray-500'>Max Score</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
