'use client';
import { useEffect, useState } from 'react';
import { useAccount, useConnect, useChainId, useSwitchChain } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import {
    intuitionTestnet,
    SupportedChainId,
    SUPPORTED_CHAINS,
} from '@/lib/wagmi';
import { cn } from '@/lib/utils';
import { Wallet, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function ConnectWallet() {
    const { address, isConnected } = useAccount();
    const { connect, connectors } = useConnect();
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
            if (error.code === 4902) {
                const targetChain = [baseSepolia, intuitionTestnet].find(
                    (c) => c.id === targetChainId
                );
                if (targetChain && window.ethereum) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainId: `0x${targetChainId.toString(16)}`,
                                    chainName: targetChain.name,
                                    rpcUrls: targetChain.rpcUrls.default.http,
                                    blockExplorerUrls: [
                                        targetChain.blockExplorers.default.url,
                                    ],
                                    nativeCurrency: targetChain.nativeCurrency,
                                },
                            ],
                        });
                        await switchChainAsync({ chainId: targetChainId });
                        setShowModal(false);
                    } catch (addError) {
                        console.error('Failed to add chain:', addError);
                    }
                }
            }
        }
    };

    const getChainName = () => {
        if (chainId === baseSepolia.id) return 'Base Sepolia';
        if (chainId === intuitionTestnet.id) return 'Intuition Testnet';
        return 'Unsupported Network';
    };

    if (!isConnected) {
        return (
            <div className='space-y-4'>
                <div className='rounded-lg border border-neutral-800 bg-neutral-950/50 p-6'>
                    <div className='space-y-4'>
                        <div className='flex items-center space-x-3'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-md border border-neutral-700 bg-neutral-800'>
                                <Wallet className='h-5 w-5 text-neutral-400' />
                            </div>
                            <div className='space-y-1'>
                                <h3 className='text-base font-medium text-white'>
                                    Connect Wallet
                                </h3>
                                <p className='text-sm text-neutral-500'>
                                    Connect your wallet to play and submit
                                    scores
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() =>
                                connect({ connector: connectors[0] })
                            }
                            className='w-full rounded-md bg-white px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-neutral-200'
                        >
                            Connect Wallet
                        </button>

                        <div className='text-xs text-neutral-600'>
                            Supports Intuition Testnet and Base Sepolia
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className='space-y-4'>
                <div
                    className={cn(
                        'rounded-lg border p-6',
                        isSupported
                            ? 'border-emerald-800 bg-emerald-950/20'
                            : 'border-amber-800 bg-amber-950/20'
                    )}
                >
                    <div className='space-y-4'>
                        <div className='flex items-center space-x-3'>
                            <div
                                className={cn(
                                    'flex h-10 w-10 items-center justify-center rounded-md border',
                                    isSupported
                                        ? 'border-emerald-700 bg-emerald-900/50'
                                        : 'border-amber-700 bg-amber-900/50'
                                )}
                            >
                                {isSupported ? (
                                    <CheckCircle2 className='h-5 w-5 text-emerald-400' />
                                ) : (
                                    <AlertTriangle className='h-5 w-5 text-amber-400' />
                                )}
                            </div>
                            <div className='space-y-1'>
                                <h3 className='text-base font-medium text-white'>
                                    {isSupported
                                        ? 'Wallet Connected'
                                        : 'Network Switch Required'}
                                </h3>
                                <div className='space-y-1'>
                                    <div className='font-mono text-sm text-neutral-400'>
                                        {address?.slice(0, 8)}...
                                        {address?.slice(-6)}
                                    </div>
                                    <div
                                        className={cn(
                                            'text-xs',
                                            isSupported
                                                ? 'text-emerald-400'
                                                : 'text-amber-400'
                                        )}
                                    >
                                        {getChainName()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {!isSupported && (
                            <div className='space-y-2 border-t border-amber-800 pt-4'>
                                <p className='text-sm text-amber-300'>
                                    Please switch to a supported network to
                                    continue
                                </p>
                                <div className='flex space-x-2'>
                                    <button
                                        onClick={() =>
                                            handleSwitchChain(
                                                intuitionTestnet.id
                                            )
                                        }
                                        disabled={isSwitching}
                                        className='flex-1 rounded-md bg-white px-3 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:opacity-50'
                                    >
                                        {isSwitching
                                            ? 'Switching...'
                                            : 'Intuition'}
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleSwitchChain(baseSepolia.id)
                                        }
                                        disabled={isSwitching}
                                        className='flex-1 rounded-md border border-amber-600 px-3 py-2 text-sm text-amber-100 transition-colors hover:bg-amber-900/20 disabled:opacity-50'
                                    >
                                        {isSwitching ? 'Switching...' : 'Base'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {isSupported && (
                            <div className='border-t border-emerald-800 pt-4'>
                                <div className='text-sm text-emerald-300'>
                                    Ready to play and submit scores on-chain
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Network Switch Modal */}
            {showModal && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4'>
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
