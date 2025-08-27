'use client';
import { useQuery } from '@tanstack/react-query';
import {
    ArrowUpRight,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Score {
    address: string;
    score: number;
    theme: string;
    words: number;
    chainId: number;
    txHash: string;
    createdAt: string;
}

const explorerFor = (chainId: number) => {
    if (chainId === 84532) return 'https://sepolia.basescan.org';
    if (chainId === 13579) return 'https://testnet.explorer.intuition.systems';
    return 'https://etherscan.io';
};

const chainName = (chainId: number) => {
    if (chainId === 84532) return 'Base';
    if (chainId === 13579) return 'Intuition';
    return 'Unknown';
};

const ITEMS_PER_PAGE = 8;

export default function Leaderboard() {
    const [currentPage, setCurrentPage] = useState(1);

    const {
        data: scores,
        refetch,
        isLoading,
        isFetching,
    } = useQuery<Score[]>({
        queryKey: ['leaderboard'],
        queryFn: async () => {
            const res = await fetch('/api/leaderboard');
            if (!res.ok) throw new Error('Failed to fetch leaderboard');
            return res.json();
        },
        refetchInterval: 30000,
    });

    const sortedScores = scores?.sort((a, b) => b.score - a.score) || [];
    const totalPages = Math.ceil(sortedScores.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentScores = sortedScores.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                    <h3 className='text-base font-medium text-white'>
                        Leaderboard
                    </h3>
                    <p className='text-sm text-neutral-500'>Global rankings</p>
                </div>
                <button
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className='flex h-8 w-8 items-center justify-center rounded-md border border-neutral-700/50 text-neutral-500 transition-colors hover:bg-neutral-900/50 hover:text-neutral-300 disabled:opacity-50'
                >
                    <RotateCcw
                        className={cn('h-4 w-4', isFetching && 'animate-spin')}
                    />
                </button>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-3 gap-4 text-center'>
                <div className='space-y-1'>
                    <div className='text-lg font-medium text-white'>
                        {scores?.length || 0}
                    </div>
                    <div className='text-xs text-neutral-500'>Players</div>
                </div>
                <div className='space-y-1'>
                    <div className='text-lg font-medium text-white'>
                        {sortedScores[0]?.score || 0}
                    </div>
                    <div className='text-xs text-neutral-500'>High Score</div>
                </div>
                <div className='space-y-1'>
                    <div className='text-lg font-medium text-white'>
                        {scores?.length
                            ? Math.round(
                                  scores.reduce((sum, s) => sum + s.score, 0) /
                                      scores.length
                              )
                            : 0}
                    </div>
                    <div className='text-xs text-neutral-500'>Average</div>
                </div>
            </div>

            {/* List */}
            <div className='space-y-1'>
                {isLoading ? (
                    <div className='space-y-2'>
                        {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                            <div
                                key={i}
                                className='flex items-center justify-between rounded-md border border-neutral-800/50 bg-neutral-950/30 p-3'
                            >
                                <div className='flex items-center space-x-3'>
                                    <div className='h-5 w-5 animate-pulse rounded bg-neutral-800'></div>
                                    <div className='space-y-1'>
                                        <div className='h-4 w-20 animate-pulse rounded bg-neutral-800'></div>
                                        <div className='h-3 w-16 animate-pulse rounded bg-neutral-800'></div>
                                    </div>
                                </div>
                                <div className='h-4 w-6 animate-pulse rounded bg-neutral-800'></div>
                            </div>
                        ))}
                    </div>
                ) : currentScores.length === 0 ? (
                    <div className='py-8 text-center'>
                        <div className='text-sm text-neutral-500'>
                            No scores yet
                        </div>
                    </div>
                ) : (
                    currentScores.map((score, index) => {
                        const globalPosition = startIndex + index + 1;
                        const timeSince = new Date(
                            Date.now() - new Date(score.createdAt).getTime()
                        );
                        const hoursAgo = Math.floor(
                            timeSince.getTime() / (1000 * 60 * 60)
                        );
                        const daysAgo = Math.floor(hoursAgo / 24);

                        return (
                            <div
                                key={`${score.address}-${score.createdAt}`}
                                className='flex items-center justify-between rounded-md border border-neutral-800/50 bg-neutral-950/30 p-3 transition-colors hover:bg-neutral-900/30 backdrop-blur-sm'
                            >
                                <div className='flex items-center space-x-3'>
                                    <div className='flex h-6 w-6 items-center justify-center text-xs font-medium text-neutral-400'>
                                        {globalPosition}
                                    </div>
                                    <div className='space-y-0.5'>
                                        <div className='font-mono text-sm text-white'>
                                            {score.address.slice(0, 6)}...
                                            {score.address.slice(-4)}
                                        </div>
                                        <div className='flex items-center space-x-2 text-xs text-neutral-500'>
                                            <span>{score.theme}</span>
                                            <span>•</span>
                                            <span>{score.words} words</span>
                                            <span>•</span>
                                            <span>
                                                {chainName(score.chainId)}
                                            </span>
                                            <span>•</span>
                                            <span>
                                                {daysAgo > 0
                                                    ? `${daysAgo}d`
                                                    : hoursAgo > 0
                                                    ? `${hoursAgo}h`
                                                    : 'now'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <div className='text-sm font-medium text-white'>
                                        {score.score}
                                    </div>
                                    <a
                                        href={`${explorerFor(
                                            score.chainId
                                        )}/tx/${score.txHash}`}
                                        target='_blank'
                                        rel='noreferrer'
                                        className='flex h-6 w-6 items-center justify-center text-neutral-500 transition-colors hover:text-neutral-300'
                                    >
                                        <ArrowUpRight className='h-3 w-3' />
                                    </a>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className='flex items-center justify-between border-t border-neutral-800/50 pt-4'>
                    <div className='text-xs text-neutral-500'>
                        Showing {startIndex + 1}-
                        {Math.min(endIndex, sortedScores.length)} of{' '}
                        {sortedScores.length}
                    </div>
                    <div className='flex items-center space-x-2'>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className='flex h-8 w-8 items-center justify-center rounded-md border border-neutral-700/50 text-neutral-500 transition-colors hover:bg-neutral-900/50 hover:text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed'
                        >
                            <ChevronLeft className='h-4 w-4' />
                        </button>

                        <div className='flex items-center space-x-1'>
                            {Array.from(
                                { length: Math.min(5, totalPages) },
                                (_, i) => {
                                    let page;
                                    if (totalPages <= 5) {
                                        page = i + 1;
                                    } else if (currentPage <= 3) {
                                        page = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        page = totalPages - 4 + i;
                                    } else {
                                        page = currentPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={page}
                                            onClick={() =>
                                                handlePageChange(page)
                                            }
                                            className={cn(
                                                'flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium transition-colors',
                                                page === currentPage
                                                    ? 'bg-white text-black'
                                                    : 'border border-neutral-700/50 text-neutral-500 hover:bg-neutral-900/50 hover:text-neutral-300'
                                            )}
                                        >
                                            {page}
                                        </button>
                                    );
                                }
                            )}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className='flex h-8 w-8 items-center justify-center rounded-md border border-neutral-700/50 text-neutral-500 transition-colors hover:bg-neutral-900/50 hover:text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed'
                        >
                            <ChevronRight className='h-4 w-4' />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
