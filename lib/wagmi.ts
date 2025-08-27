import { createConfig, http } from 'wagmi';
import { baseSepolia, mainnet } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { createPublicClient, defineChain } from 'viem';

export const intuitionTestnet = defineChain({
    id: 13579,
    name: 'Intuition Testnet',
    nativeCurrency: {
        name: 'Testnet TRUST',
        symbol: 'tTRUST',
        decimals: 18,
    },
    rpcUrls: {
        default: {
            http: ['https://testnet.rpc.intuition.systems'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Intuition Explorer',
            url: 'https://testnet.explorer.intuition.systems',
        },
    },
    testnet: true,
});

export const wagmiConfig = createConfig({
    chains: [baseSepolia, intuitionTestnet, mainnet],
    connectors: [injected({ shimDisconnect: true })],
    transports: {
        [baseSepolia.id]: http(),
        [intuitionTestnet.id]: http(),
        [mainnet.id]: http(),
    },
});

export const SUPPORTED_CHAINS = [baseSepolia.id, intuitionTestnet.id] as const;
export type SupportedChainId = (typeof SUPPORTED_CHAINS)[number];

export const makePublicClient = (chainId: SupportedChainId = baseSepolia.id) =>
    createPublicClient({
        chain:
            [baseSepolia, intuitionTestnet, mainnet].find(
                (c) => c.id === chainId
            ) || baseSepolia,
        transport: http(),
    });
