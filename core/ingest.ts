import crypto from 'crypto';
import { initDb, saveReferendum, getUnanalyzed } from './db.ts';

const POLKASSEMBLY_API = 'https://api.polkassembly.io/api/v1/listing/on-chain-posts';

async function fetchReferenda() {
    console.log("Ingesting latest referenda from Polkassembly REST API...");
    
    // Headers required by Polkassembly
    const headers = { 
        'x-network': 'polkadot',
        'Content-Type': 'application/json'
    };
    
    // Query params
    const params = new URLSearchParams({
        proposalType: 'referendums_v2',
        listingLimit: '5',
        sortBy: 'newest',
        trackStatus: 'All'
    });

    const url = `${POLKASSEMBLY_API}?${params.toString()}`;

    try {
        const response = await fetch(url, { headers });
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        const json: any = await response.json();
        
        // Map REST response to our schema
        return json.posts.map((post: any) => ({
            id: post.post_id, // REST uses post_id
            title: post.title,
            proposer: post.proposer,
            content: post.content || post.description || "No content provided",
            created_at: post.created_at,
            track_no: post.track_no,
            status: post.status
        }));

    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
}

function generateHash(post: any) {
    const input = `ID:${post.id}|Title:${post.title}|Proposer:${post.proposer}|Content:${post.content}`;
    return crypto.createHash('sha256').update(input).digest('hex');
}

async function main() {
    initDb();

    try {
        const posts = await fetchReferenda();

        for (const post of posts) {
            const hash = generateHash(post);
            const ref = {
                id: post.id,
                title: post.title || "No Title",
                proposer: post.proposer || "Unknown",
                content: post.content || "",
                status: post.status,
                track_no: post.track_no,
                evidence_hash: hash
            };

            saveReferendum(ref);
            console.log(`Saved Referendum #${post.id} (Hash: ${hash.substring(0, 8)}...)`);
        }

        const pending = getUnanalyzed();
        if (pending.length > 0) {
            console.log(`\n[TRIGGER AGENT] Found ${pending.length} unanalyzed proposals.`);
            // In a real system, this would call the Agent API or push to a queue.
            // For now, we log it as the "Trigger".
        } else {
            console.log("\nAll proposals analyzed or up to date.");
        }

    } catch (error) {
        console.error("Ingestion failed:", error);
    }
}

// Run immediately
main();

// Optional: Interval loop
console.log("Starting Sentinel Ingestion Loop (Every 10 mins)...");
setInterval(main, 10 * 60 * 1000); // 10 minutes
