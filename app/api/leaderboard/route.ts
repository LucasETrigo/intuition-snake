import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { SUPPORTED_CHAINS } from '@/lib/wagmi';

const FILE_PATH = path.join(process.cwd(), 'data', 'leaderboard.json');

export async function GET() {
    try {
        const data = await fs.readFile(FILE_PATH, 'utf-8');
        const scores = JSON.parse(data);
        return NextResponse.json(scores);
    } catch (error) {
        return NextResponse.json([]);
    }
}

export async function POST(req: NextRequest) {
    try {
        const { address, score, theme, words, chainId, txHash } =
            await req.json();
        if (!SUPPORTED_CHAINS.includes(chainId)) {
            return NextResponse.json(
                {
                    error: `Invalid chain ID. Supported: ${SUPPORTED_CHAINS.join(
                        ', '
                    )}`,
                },
                { status: 400 }
            );
        }
        if (!address || !score || !theme || !txHash) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const newScore = {
            address,
            score,
            theme,
            words: words ?? 0,
            chainId,
            txHash,
            createdAt: new Date().toISOString(),
        };

        let scores = [];
        try {
            const data = await fs.readFile(FILE_PATH, 'utf-8');
            scores = JSON.parse(data);
        } catch (error) {
            await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
        }

        scores.push(newScore);
        await fs.writeFile(FILE_PATH, JSON.stringify(scores, null, 2));
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Failed to save score' },
            { status: 500 }
        );
    }
}
