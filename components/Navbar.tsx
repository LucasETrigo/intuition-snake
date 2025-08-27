'use client';
import {
    useAccount,
    useConnect,
    useDisconnect,
    useChainId,
    useSwitchChain,
} from 'wagmi';
import { LogOut, Wallet, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { baseSepolia } from 'wagmi/chains';
import {
    intuitionTestnet,
    SupportedChainId,
    SUPPORTED_CHAINS,
} from '@/lib/wagmi';
import { cn } from '@/lib/utils';

export default function Navbar() {
    const { address, isConnected } = useAccount();
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();
    const chainId = useChainId();
    const { switchChainAsync, isPending: isSwitching } = useSwitchChain();
    const [showModal, setShowModal] = useState(false);

    const isSupported = SUPPORTED_CHAINS.includes(chainId as SupportedChainId);

    useEffect(() => {
        if (isConnected && !isSupported) {
            setShowModal(true);
        } else {
            setShowModal(false);
        }
    }, [isConnected, isSupported]);

    const handleSwitchChain = async (targetChainId: SupportedChainId) => {
        try {
            await switchChainAsync({ chainId: targetChainId });
            setShowModal(false);
        } catch (error: any) {
            console.error('Switch chain error:', error);
        }
    };

    const getChainName = () => {
        if (chainId === baseSepolia.id) return 'Base Sepolia';
        if (chainId === intuitionTestnet.id) return 'Intuition Testnet';
        return 'Unsupported';
    };

    return (
        <>
            <nav className='fixed top-0 left-0 right-0 z-50 border-b border-neutral-800 bg-black/80 backdrop-blur-xl'>
                <div className='mx-auto max-w-7xl px-6'>
                    <div className='flex h-16 items-center justify-between'>
                        {/* Logo */}
                        <div className='flex items-center space-x-3'>
                            <div className='h-8 w-8 rounded-md border border-neutral-700 bg-neutral-900 flex items-center justify-center'>
                                <div className='h-3 w-3 rounded-sm bg-white'></div>
                            </div>
                            <div className='text-sm font-medium text-white'>
                                Knowledge Snake
                            </div>
                        </div>

                        {/* Wallet Connection */}
                        <div className='flex items-center space-x-4'>
                            {isConnected ? (
                                <>
                                    <div
                                        className={cn(
                                            'flex items-center space-x-3 rounded-md border px-3 py-1.5',
                                            isSupported
                                                ? 'border-emerald-800 bg-emerald-950/20'
                                                : 'border-amber-800 bg-amber-950/20'
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                'h-2 w-2 rounded-full',
                                                isSupported
                                                    ? 'bg-emerald-500'
                                                    : 'bg-amber-500'
                                            )}
                                        ></div>
                                        <span className='text-sm font-mono text-neutral-300'>
                                            {address?.slice(0, 6)}...
                                            {address?.slice(-4)}
                                        </span>
                                        <span className='text-xs text-neutral-500'>
                                            {getChainName().split(' ')[0]}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => disconnect()}
                                        className='flex h-8 w-8 items-center justify-center rounded-md border border-neutral-800 text-neutral-500 transition-colors hover:bg-neutral-900 hover:text-neutral-300'
                                    >
                                        <LogOut className='h-4 w-4' />
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() =>
                                        connect({ connector: connectors[0] })
                                    }
                                    className='flex items-center space-x-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200'
                                >
                                    <Wallet className='h-4 w-4' />
                                    <span>Connect Wallet</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Network Switch Modal */}
            {showModal && (
                <div className='fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4'>
                    <div className='w-full max-w-sm rounded-lg border border-neutral-800 bg-black p-6 shadow-xl'>
                        <div className='space-y-4'>
                            <div className='text-center'>
                                <AlertTriangle className='mx-auto mb-3 h-8 w-8 text-amber-400' />
                                <h3 className='text-lg font-medium text-white'>
                                    Network Not Supported
                                </h3>
                                <p className='text-sm text-neutral-400'>
                                    Please switch to continue using the
                                    application
                                </p>
                            </div>

                            <div className='rounded-md border border-neutral-800 bg-neutral-950/50 p-3 text-center'>
                                <div className='text-xs text-neutral-500'>
                                    Current Network
                                </div>
                                <div className='font-mono text-sm text-white'>
                                    {chainId || 'Unknown'}
                                </div>
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
                                        : 'Switch to Intuition Testnet'}
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
                                        : 'Switch to Base Sepolia'}
                                </button>
                            </div>

                            <button
                                onClick={() => setShowModal(false)}
                                className='w-full text-center text-xs text-neutral-500 hover:text-neutral-400'
                            >
                                Continue with current network
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
