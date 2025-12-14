import { GraphQLClient, gql } from 'graphql-request';
import crypto from 'crypto';
import { initDb, saveReferendum, getUnanalyzed } from './db.ts';

const POLKASSEMBLY_ENDPOINT = 'https://squid.subsquid.io/polkadot-polkassembly/graphql';

const GET_LATEST_REFERENDA = gql`
  query GetLatestReferenda {
    posts(limit: 5, orderBy: created_at_DESC, where: {type_eq: ReferendumV2}) {
      id
      title
      proposer
      content
      created_at
      track_no
      status
    }
  }
`;

async function fetchReferenda() {
    console.log("Ingesting latest referenda from Polkadot...");
    const client = new GraphQLClient(POLKASSEMBLY_ENDPOINT);
    const data: any = await client.request(GET_LATEST_REFERENDA);
    return data.posts;
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
// setInterval(main, 10 * 60 * 1000); // 10 minutes
