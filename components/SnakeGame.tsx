'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    useAccount,
    useChainId,
    usePublicClient,
    useWalletClient,
    useSwitchChain,
} from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/lib/addresses';
import { ArrowUpRight, Play, Square, RotateCcw, Settings } from 'lucide-react';
import { baseSepolia } from 'wagmi/chains';
import {
    intuitionTestnet,
    SupportedChainId,
    SUPPORTED_CHAINS,
} from '@/lib/wagmi';
import { cn } from '@/lib/utils';
import { parseAbi } from 'viem';

// Game configuration
const GRID = 24;
const CELL_SIZE = 14;
const INITIAL_SPEED = 180;
const SPEED_MIN = 90;
const FOODS_PER_LEVEL = 5;
const MAX_SCORE = 50;
const MAX_OBSTACLES = 8;

const WORDS: Record<string, string[]> = {
    Crypto: [
        'Ethereum',
        'Solidity',
        'DeFi',
        'Rollup',
        'MEV',
        'Bridge',
        'L2',
        'ZK',
        'OP',
        'Base',
        'Airdrop',
        'RPC',
        'Gas',
        'Wallet',
        'EVM',
        'ERC20',
        'ERC721',
        'Liquidity',
        'Stake',
        'Yield',
        'DAO',
        'Governance',
        'Flash',
        'Oracle',
        'Uniswap',
        'AMM',
        'LP',
        'Slippage',
        'TVL',
        'APY',
    ],
    AI: [
        'Transformer',
        'Token',
        'Prompt',
        'Embedding',
        'Diffusion',
        'LoRA',
        'RAG',
        'Agent',
        'Inference',
        'Latent',
        'RLHF',
        'Dataset',
        'GPU',
        'CUDA',
        'Batch',
        'LLM',
        'Context',
        'Vector',
        'Cache',
        'MoE',
        'Attention',
        'Gradient',
        'Backprop',
        'Neural',
        'Training',
        'Finetune',
    ],
    Memes: [
        'WAGMI',
        'HODL',
        'NGMI',
        'Rekt',
        'FOMO',
        'FUD',
        'Devs',
        'Ape',
        'Moon',
        'Degen',
        'Pump',
        'Dump',
        'Giga',
        'GM',
        'Ser',
        'CT',
        'Copium',
        'Based',
        'Pepe',
        'Doge',
        'Diamond',
        'Hands',
        'Paper',
        'Rocket',
        'Lambo',
        'Tendies',
        'YOLO',
        'Shill',
        'Bag',
        'Mooning',
    ],
};

// ABI for ScoreRegistry
const SCORE_REGISTRY_ABI = parseAbi([
    'function submitScore(uint256 _score, string calldata _theme, uint256 _words) external',
]);

// Types
type Vec = { x: number; y: number };
interface Cell extends Vec {}
interface TxInfo {
    label: string;
    hash: `0x${string}`;
}

const ZERO_HASH =
    '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`;

async function submitToMultiVault(
    walletClient: any,
    publicClient: any,
    address: `0x${string}`,
    score: number,
    theme: string
) {
    return { transactionHash: ZERO_HASH };
}

export default function SnakeGame() {
    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();
    const { switchChainAsync, isPending: isSwitching } = useSwitchChain();

    const [theme, setTheme] = useState<keyof typeof WORDS>('Crypto');
    const [snake, setSnake] = useState<Cell[]>([{ x: 3, y: 3 }]);
    const [food, setFood] = useState<Cell>({ x: 10, y: 10 });
    const [obstacles, setObstacles] = useState<Cell[]>([]);
    const [direction, setDirection] = useState<Vec>({ x: 1, y: 0 });
    const [speed, setSpeed] = useState<number>(INITIAL_SPEED);
    const [foodCount, setFoodCount] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const [level, setLevel] = useState<number>(1);
    const [word, setWord] = useState<string>(randWord(WORDS[theme]));
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [win, setWin] = useState<boolean>(false);
    const [playing, setPlaying] = useState<boolean>(false);
    const [publishing, setPublishing] = useState<boolean>(false);
    const [txs, setTxs] = useState<TxInfo[]>([]);
    const [showChainModal, setShowChainModal] = useState<boolean>(false);
    const [showScoreModal, setShowScoreModal] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const boardRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const explorer = useMemo(() => {
        if (chainId === baseSepolia.id) return 'https://sepolia.basescan.org';
        if (chainId === intuitionTestnet.id)
            return 'https://testnet.explorer.intuition.systems';
        return 'https://etherscan.io';
    }, [chainId]);

    // Check chain on game over or win
    useEffect(() => {
        if (
            (gameOver || win) &&
            isConnected &&
            !SUPPORTED_CHAINS.includes(chainId as SupportedChainId)
        ) {
            setShowChainModal(true);
        } else if (gameOver || win) {
            setShowScoreModal(true);
        }
    }, [gameOver, win, isConnected, chainId]);

    // Game logic
    useEffect(() => {
        if (!playing || gameOver || win) return;

        intervalRef.current = setInterval(() => {
            setSnake((prev) => {
                const head = {
                    x: (prev[0].x + direction.x + GRID) % GRID,
                    y: (prev[0].y + direction.y + GRID) % GRID,
                };

                if (
                    prev.some(
                        (c, i) => i > 0 && c.x === head.x && c.y === head.y
                    ) ||
                    obstacles.some((o) => o.x === head.x && o.y === head.y)
                ) {
                    setGameOver(true);
                    return prev;
                }

                const newSnake = [head, ...prev];
                if (head.x === food.x && head.y === food.y) {
                    setScore((s) => s + 1);
                    setFoodCount((c) => {
                        const newCount = c + 1;
                        if (newCount >= FOODS_PER_LEVEL) {
                            setLevel((l) => l + 1);
                            setSpeed((s) => Math.max(SPEED_MIN, s - 12));
                            setObstacles((o) =>
                                o.length < MAX_OBSTACLES
                                    ? [...o, randFreeCell(newSnake, o)]
                                    : o
                            );
                            return 0;
                        }
                        return newCount;
                    });
                    setWord(randWord(WORDS[theme]));
                    setFood(randFreeCell(newSnake, obstacles));

                    if (score + 1 >= MAX_SCORE) {
                        setWin(true);
                    }
                } else {
                    newSnake.pop();
                }

                return newSnake;
            });
        }, speed);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [
        playing,
        direction,
        food,
        foodCount,
        score,
        theme,
        obstacles,
        gameOver,
        win,
        speed,
        level,
    ]);

    // WASD controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!playing || gameOver || win) return;

            e.preventDefault();

            switch (e.key.toLowerCase()) {
                case 'w':
                case 'arrowup':
                    setDirection((d) => (d.y === 0 ? { x: 0, y: -1 } : d));
                    break;
                case 's':
                case 'arrowdown':
                    setDirection((d) => (d.y === 0 ? { x: 0, y: 1 } : d));
                    break;
                case 'a':
                case 'arrowleft':
                    setDirection((d) => (d.x === 0 ? { x: -1, y: 0 } : d));
                    break;
                case 'd':
                case 'arrowright':
                    setDirection((d) => (d.x === 0 ? { x: 1, y: 0 } : d));
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [playing, gameOver, win]);

    const handleSwitchChain = async (targetChainId: SupportedChainId) => {
        if (!switchChainAsync || !walletClient) {
            setErrorMessage('Wallet not available');
            return;
        }

        try {
            await switchChainAsync({ chainId: targetChainId });
            setShowChainModal(false);
            setErrorMessage('');
        } catch (error: any) {
            setErrorMessage(error.message || 'Failed to switch chain');
        }
    };

    const publishScore = async () => {
        if (!isConnected || !address || !publicClient || !walletClient) {
            setErrorMessage('Please connect your wallet first');
            return;
        }
        if (!SUPPORTED_CHAINS.includes(chainId as SupportedChainId)) {
            setShowChainModal(true);
            return;
        }

        setPublishing(true);
        setErrorMessage('');

        try {
            let txHash: `0x${string}`;
            const contractAddress =
                CONTRACT_ADDRESSES[chainId as SupportedChainId];

            if (chainId === baseSepolia.id) {
                const result = await submitToMultiVault(
                    walletClient,
                    publicClient,
                    contractAddress,
                    score,
                    theme
                );
                txHash = result.transactionHash;
            } else {
                const { request } = await publicClient.simulateContract({
                    account: address,
                    address: contractAddress,
                    abi: SCORE_REGISTRY_ABI,
                    functionName: 'submitScore',
                    args: [
                        BigInt(score),
                        theme,
                        BigInt(foodCount + (level - 1) * FOODS_PER_LEVEL),
                    ],
                });
                txHash = await walletClient.writeContract(request);
            }

            setTxs((prev) => [
                {
                    label: `Score ${score}`,
                    hash: txHash,
                },
                ...prev.slice(0, 2),
            ]);

            const res = await fetch('/api/leaderboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    address,
                    score,
                    theme,
                    words: foodCount + (level - 1) * FOODS_PER_LEVEL,
                    chainId,
                    txHash,
                }),
            });

            if (!res.ok) {
                const { error } = await res.json();
                throw new Error(error || 'Failed to submit score');
            }

            setShowScoreModal(false);
        } catch (error: any) {
            setErrorMessage('Failed to submit score: ' + error.message);
        } finally {
            setPublishing(false);
        }
    };

    const resetGame = () => {
        setSnake([{ x: 3, y: 3 }]);
        setFood({ x: 10, y: 10 });
        setObstacles([]);
        setDirection({ x: 1, y: 0 });
        setSpeed(INITIAL_SPEED);
        setFoodCount(0);
        setLevel(1);
        setScore(0);
        setWord(randWord(WORDS[theme]));
        setGameOver(false);
        setWin(false);
        setPlaying(false);
        setShowScoreModal(false);
        setShowChainModal(false);
    };

    return (
        <>
            <div className='space-y-8'>
                {/* Header */}
                <div className='flex items-center justify-between'>
                    <div className='space-y-1'>
                        <h2 className='text-xl font-medium tracking-tight text-white'>
                            Game
                        </h2>
                        <div className='flex items-center space-x-4 text-sm text-neutral-500'>
                            <span>Score: {score}</span>
                            <span>Level: {level}</span>
                            <span>Theme: {theme}</span>
                        </div>
                    </div>
                    <select
                        value={theme}
                        onChange={(e) => {
                            setTheme(e.target.value as keyof typeof WORDS);
                            setWord(
                                randWord(
                                    WORDS[e.target.value as keyof typeof WORDS]
                                )
                            );
                            resetGame();
                        }}
                        className='rounded-md border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-white focus:border-neutral-600 focus:outline-none'
                    >
                        {Object.keys(WORDS).map((t) => (
                            <option
                                key={t}
                                value={t}
                                className='bg-neutral-900'
                            >
                                {t}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Current Word */}
                <div className='rounded-lg border border-neutral-800 bg-neutral-900/50 p-6 text-center'>
                    <div className='mb-2 text-xs uppercase tracking-wide text-neutral-500'>
                        Next Term
                    </div>
                    <div className='text-lg font-medium text-white'>{word}</div>
                </div>

                {/* Game Board */}
                <div className='flex justify-center'>
                    <div className='relative'>
                        <div
                            ref={boardRef}
                            className='grid rounded-lg border border-neutral-800 bg-neutral-900 p-3'
                            style={{
                                gridTemplateColumns: `repeat(${GRID}, ${CELL_SIZE}px)`,
                                gridTemplateRows: `repeat(${GRID}, ${CELL_SIZE}px)`,
                                width: `${GRID * CELL_SIZE + 24}px`,
                                height: `${GRID * CELL_SIZE + 24}px`,
                            }}
                        >
                            {Array.from({ length: GRID * GRID }).map((_, i) => {
                                const x = i % GRID;
                                const y = Math.floor(i / GRID);
                                const isSnake = snake.some(
                                    (c) => c.x === x && c.y === y
                                );
                                const isHead =
                                    isSnake &&
                                    snake[0].x === x &&
                                    snake[0].y === y;
                                const isFood = food.x === x && food.y === y;
                                const isObstacle = obstacles.some(
                                    (o) => o.x === x && o.y === y
                                );

                                return (
                                    <div
                                        key={i}
                                        className={cn(
                                            'border border-neutral-800/50',
                                            isHead && 'bg-white',
                                            isSnake &&
                                                !isHead &&
                                                'bg-neutral-400',
                                            isFood && 'bg-white',
                                            isObstacle && 'bg-neutral-600'
                                        )}
                                    />
                                );
                            })}
                        </div>

                        {/* Game status overlay */}
                        {(gameOver || win) && (
                            <div className='absolute inset-0 flex items-center justify-center rounded-lg bg-black/80 backdrop-blur-sm'>
                                <div className='text-center'>
                                    <div className='mb-2 text-lg font-medium text-white'>
                                        {win ? 'Victory' : 'Game Over'}
                                    </div>
                                    <div className='text-sm text-neutral-400'>
                                        Score: {score}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Controls */}
                <div className='space-y-4'>
                    <div className='flex justify-center space-x-3'>
                        <button
                            onClick={() => {
                                setPlaying((p) => !p);
                                if (!playing && (gameOver || win)) resetGame();
                            }}
                            className='inline-flex items-center space-x-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200'
                        >
                            {playing ? (
                                <>
                                    <Square className='h-4 w-4' />
                                    <span>Pause</span>
                                </>
                            ) : (
                                <>
                                    <Play className='h-4 w-4' />
                                    <span>
                                        {gameOver || win ? 'New Game' : 'Start'}
                                    </span>
                                </>
                            )}
                        </button>

                        {(gameOver || win) && (
                            <button
                                onClick={resetGame}
                                className='inline-flex items-center space-x-2 rounded-md border border-neutral-700 px-4 py-2 text-sm text-white transition-colors hover:bg-neutral-900'
                            >
                                <RotateCcw className='h-4 w-4' />
                                <span>Reset</span>
                            </button>
                        )}
                    </div>

                    {/* Controls Guide */}
                    <div className='text-center text-xs text-neutral-500'>
                        Use WASD or arrow keys to move
                    </div>
                </div>

                {/* Error Message */}
                {errorMessage && (
                    <div className='rounded-lg border border-red-800 bg-red-900/20 p-4'>
                        <div className='text-sm text-red-300'>
                            {errorMessage}
                        </div>
                    </div>
                )}

                {/* Transaction History */}
                {txs.length > 0 && (
                    <div className='space-y-3'>
                        <h4 className='text-sm font-medium text-white'>
                            Recent Transactions
                        </h4>
                        <div className='space-y-2'>
                            {txs.map((tx, i) => (
                                <div
                                    key={i}
                                    className='flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950/50 p-3'
                                >
                                    <span className='text-sm text-white'>
                                        {tx.label}
                                    </span>
                                    <a
                                        href={`${explorer}/tx/${tx.hash}`}
                                        target='_blank'
                                        rel='noreferrer'
                                        className='flex items-center space-x-1 text-xs text-neutral-400 transition-colors hover:text-white'
                                    >
                                        <span className='font-mono'>
                                            {tx.hash.slice(0, 6)}...
                                            {tx.hash.slice(-4)}
                                        </span>
                                        <ArrowUpRight className='h-3 w-3' />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Score Modal */}
            {showScoreModal && (gameOver || win) && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4'>
                    <div className='w-full max-w-sm rounded-lg border border-neutral-800 bg-black p-6 shadow-xl'>
                        <div className='space-y-4'>
                            <div className='text-center'>
                                <h3 className='text-lg font-medium text-white'>
                                    {win ? 'Victory!' : 'Game Complete'}
                                </h3>
                                <p className='text-sm text-neutral-400'>
                                    Score: {score} • Theme: {theme}
                                </p>
                            </div>

                            <div className='space-y-2'>
                                <button
                                    onClick={publishScore}
                                    disabled={publishing}
                                    className='w-full rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:opacity-50'
                                >
                                    {publishing
                                        ? 'Publishing...'
                                        : 'Submit Score'}
                                </button>
                                <button
                                    onClick={() => setShowScoreModal(false)}
                                    className='w-full rounded-md border border-neutral-700 px-4 py-2 text-sm text-white transition-colors hover:bg-neutral-900'
                                >
                                    Skip
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Chain Switch Modal */}
            {showChainModal && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4'>
                    <div className='w-full max-w-sm rounded-lg border border-neutral-800 bg-black p-6 shadow-xl'>
                        <div className='space-y-4'>
                            <div className='text-center'>
                                <Settings className='mx-auto mb-3 h-8 w-8 text-neutral-400' />
                                <h3 className='text-lg font-medium text-white'>
                                    Switch Network
                                </h3>
                                <p className='text-sm text-neutral-400'>
                                    Please switch to a supported network
                                </p>
                            </div>

                            <div className='space-y-2'>
                                <button
                                    onClick={() =>
                                        handleSwitchChain(intuitionTestnet.id)
                                    }
                                    disabled={isSwitching}
                                    className='w-full rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:opacity-50'
                                >
                                    {isSwitching
                                        ? 'Switching...'
                                        : 'Intuition Testnet'}
                                </button>
                                <button
                                    onClick={() =>
                                        handleSwitchChain(baseSepolia.id)
                                    }
                                    disabled={isSwitching}
                                    className='w-full rounded-md border border-neutral-700 px-4 py-2 text-sm text-white transition-colors hover:bg-neutral-900 disabled:opacity-50'
                                >
                                    {isSwitching
                                        ? 'Switching...'
                                        : 'Base Sepolia'}
                                </button>
                            </div>

                            <button
                                onClick={() => setShowChainModal(false)}
                                className='w-full text-center text-xs text-neutral-500 hover:text-neutral-400'
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// Helper functions
function randWord(list: string[]) {
    return list[Math.floor(Math.random() * list.length)];
}

function randFreeCell(snake: Cell[], obstacles: Cell[], tries = 200): Cell {
    for (let i = 0; i < tries; i++) {
        const c = {
            x: Math.floor(Math.random() * GRID),
            y: Math.floor(Math.random() * GRID),
        };
        if (
            !snake.some((s) => s.x === c.x && s.y === c.y) &&
            !obstacles.some((o) => o.x === c.x && o.y === c.y)
        )
            return c;
    }
    return { x: 1, y: 1 };
}
