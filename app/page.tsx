import Navbar from '@/components/Navbar';
import SnakeGame from '@/components/SnakeGame';
import Leaderboard from '@/components/Leaderboard';

export default function Home() {
    return (
        <div className='min-h-screen bg-black relative overflow-hidden'>
            {/* Premium Visible Grid Background */}
            <div className='fixed inset-0 -z-10'>
                {/* Main structural grid - clearly visible */}
                <div
                    className='absolute inset-0'
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
                        `,
                        backgroundSize: '32px 32px',
                    }}
                />

                {/* Secondary larger grid */}
                <div
                    className='absolute inset-0'
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
                        `,
                        backgroundSize: '128px 128px',
                    }}
                />

                {/* Subtle dot pattern */}
                <div
                    className='absolute inset-0 opacity-30'
                    style={{
                        backgroundImage: `
                            radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 1px)
                        `,
                        backgroundSize: '64px 64px',
                    }}
                />

                {/* Gradient fade from center */}
                <div className='absolute inset-0 bg-gradient-to-br from-transparent via-black/20 to-black/40' />

                {/* Ambient light sources */}
                <div className='absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-neutral-800/[0.02] rounded-full blur-3xl animate-float' />
                <div className='absolute bottom-1/4 right-1/3 w-[600px] h-[600px] bg-neutral-700/[0.02] rounded-full blur-3xl animate-float delay-300' />
            </div>

            {/* Navigation */}
            <Navbar />

            {/* Main Container */}
            <main className='pt-20'>
                <div className='container-ultra py-16 gpu-layer'>
                    {/* Enhanced Header with animations */}
                    <div className='mb-20 animate-fade-in-up'>
                        <div className='max-w-5xl'>
                            <div className='space-y-8'>
                                <div className='space-y-6'>
                                    <div className='inline-flex items-center space-x-2 rounded-full glass-minimal px-4 py-2 animate-scale-in delay-200'>
                                        <div className='h-2 w-2 rounded-full bg-emerald-400 animate-breathe'></div>
                                        <span className='text-xs text-neutral-400 font-medium tracking-wide'>
                                            Live on Intuition Testnet
                                        </span>
                                    </div>
                                    <h1 className='text-hero text-white animate-fade-in-up delay-300'>
                                        Learn Web3 Through
                                        <span className='block text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-500 animate-fade-in-up delay-400'>
                                            Interactive Gaming
                                        </span>
                                    </h1>
                                </div>
                                <p className='text-xl text-refined text-neutral-400 max-w-4xl animate-fade-in-up delay-500'>
                                    Master blockchain, AI, and cryptocurrency
                                    terminology through an elegantly designed
                                    snake game. Your achievements and progress
                                    are permanently recorded on-chain on
                                    Intuition for global competition.
                                </p>
                                <div className='flex flex-wrap items-center gap-6 pt-4 animate-slide-in-left delay-600'>
                                    <div className='flex items-center space-x-2 text-sm text-elegant text-neutral-500'>
                                        <div className='h-1.5 w-1.5 rounded-full bg-neutral-500'></div>
                                        <span>50+ curated terms</span>
                                    </div>
                                    <div className='flex items-center space-x-2 text-sm text-elegant text-neutral-500'>
                                        <div className='h-1.5 w-1.5 rounded-full bg-neutral-500'></div>
                                        <span>On-chain leaderboard</span>
                                    </div>
                                    <div className='flex items-center space-x-2 text-sm text-elegant text-neutral-500'>
                                        <div className='h-1.5 w-1.5 rounded-full bg-neutral-500'></div>
                                        <span>Intuition Testnet support</span>
                                    </div>
                                    <div className='flex items-center space-x-2 text-sm text-elegant text-neutral-500'>
                                        <div className='h-1.5 w-1.5 rounded-full bg-neutral-500'></div>
                                        <span>Real-time scoring</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Grid */}
                    <div className='grid lg:grid-cols-3 gap-8 animate-fade-in-up delay-700'>
                        {/* Game Column */}
                        <div className='lg:col-span-2'>
                            <div className='glass-ultra rounded-2xl p-8 hover-elegant shadow-2xl shadow-black/10'>
                                <SnakeGame />
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className='space-y-6 animate-fade-in-up delay-800'>
                            {/* Leaderboard */}
                            <div className='glass-ultra rounded-2xl p-6 hover-elegant shadow-2xl shadow-black/10'>
                                <Leaderboard />
                            </div>

                            {/* Enhanced Info Card */}
                            <div className='glass-ultra rounded-2xl p-6 hover-elegant shadow-2xl shadow-black/10'>
                                <div className='space-y-6'>
                                    <div className='space-y-2'>
                                        <h3 className='text-base font-medium text-white text-elegant'>
                                            Game Instructions
                                        </h3>
                                        <p className='text-sm text-neutral-500 text-elegant'>
                                            Master the controls and dominate the
                                            leaderboard
                                        </p>
                                    </div>
                                    <div className='space-y-5'>
                                        <div className='space-y-3'>
                                            <h4 className='text-sm font-medium text-neutral-300 text-elegant'>
                                                Movement Controls
                                            </h4>
                                            <div className='grid grid-cols-3 gap-2 max-w-[140px] mx-auto'>
                                                <div></div>
                                                <kbd className='h-9 w-9 flex items-center justify-center glass-minimal border-elegant rounded-lg text-xs font-mono text-neutral-300 hover-scale'>
                                                    W
                                                </kbd>
                                                <div></div>
                                                <kbd className='h-9 w-9 flex items-center justify-center glass-minimal border-elegant rounded-lg text-xs font-mono text-neutral-300 hover-scale'>
                                                    A
                                                </kbd>
                                                <kbd className='h-9 w-9 flex items-center justify-center glass-minimal border-elegant rounded-lg text-xs font-mono text-neutral-300 hover-scale'>
                                                    S
                                                </kbd>
                                                <kbd className='h-9 w-9 flex items-center justify-center glass-minimal border-elegant rounded-lg text-xs font-mono text-neutral-300 hover-scale'>
                                                    D
                                                </kbd>
                                            </div>
                                        </div>
                                        <div className='space-y-3 text-sm text-refined text-neutral-400 leading-relaxed'>
                                            <div className='flex items-start space-x-3'>
                                                <div className='h-1.5 w-1.5 rounded-full bg-neutral-600 mt-2 flex-shrink-0'></div>
                                                <p>
                                                    Navigate your snake to
                                                    collect terminology tiles
                                                    and expand your knowledge
                                                </p>
                                            </div>
                                            <div className='flex items-start space-x-3'>
                                                <div className='h-1.5 w-1.5 rounded-full bg-neutral-600 mt-2 flex-shrink-0'></div>
                                                <p>
                                                    Choose from Crypto, AI, or
                                                    Memes categories for
                                                    targeted learning
                                                </p>
                                            </div>
                                            <div className='flex items-start space-x-3'>
                                                <div className='h-1.5 w-1.5 rounded-full bg-neutral-600 mt-2 flex-shrink-0'></div>
                                                <p>
                                                    Submit high scores on-chain
                                                    to compete on the global
                                                    leaderboard
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
