'use client';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '@/lib/wagmi';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
    preload: true,
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30 * 1000,
            refetchOnWindowFocus: false,
        },
    },
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang='en' className={`${inter.variable} antialiased`}>
            <head>
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1'
                />
                <meta
                    name='description'
                    content='Learn Web3 terminology through an elegant snake game. Record your scores on-chain.'
                />
                <title>Knowledge Snake - Learn Web3 Through Gaming</title>
            </head>
            <body className='min-h-screen overflow-x-hidden text-white bg-black selection:bg-white/10'>
                {/* Ambient Background */}
                <div className='fixed inset-0 -z-50'>
                    <div className='absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.1),transparent)]' />
                    <div className='absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]' />
                </div>
                <WagmiProvider config={wagmiConfig}>
                    <QueryClientProvider client={queryClient}>
                        <div className='relative min-h-screen'>{children}</div>
                    </QueryClientProvider>
                </WagmiProvider>

                {/* Grain Texture */}
                <div className='fixed inset-0 pointer-events-none opacity-[0.015] mix-blend-soft-light'>
                    <div
                        className='absolute inset-0'
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg%20width%3D'200'%20height%3D'200'%20xmlns%3D'http%3A//www.w3.org/2000/svg'%3E%3Cfilter%20id%3D'noise'%3E%3CfeTurbulence%20type%3D'fractalNoise'%20baseFrequency%3D'0.9'%20numOctaves%3D'4'%20stitchTiles%3D'stitch'/%3E%3C/filter%3E%3Crect%20width%3D'100%25'%20height%3D'100%25'%20filter%3D'url(%23noise)'%20opacity%3D'1'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'repeat',
                        }}
                    />
                </div>
            </body>
        </html>
    );
}
