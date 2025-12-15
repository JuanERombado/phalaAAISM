import { IAgentRuntime, Memory, Provider, State } from "@elizaos/core";


const POLKASSEMBLY_API = 'https://api.polkassembly.io/api/v1/listing/on-chain-posts';

const polkadotProvider: Provider = {
    get: async (_runtime: IAgentRuntime, _message: Memory, _state?: State) => {
        try {
            console.log("Fetching Polkadot data via Polkassembly REST API...");
            
            // Headers for Polkassembly
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
            
            const response = await fetch(url, { headers });
            
            if (!response.ok) {
                 return "Error: Failed to fetch from Polkassembly API (" + response.status + ")";
            }

            const json: any = await response.json();
            const posts = json.posts;

            if (!posts || posts.length === 0) {
                return "No active Polkadot referenda found.";
            }

            let report = "## Active OpenGov Referenda (Live Data)\n\n";

            posts.forEach((post: any) => {
                const title = post.title || "No Title";
                const content = post.content || post.description || "No content available.";
                const shortContent = content.length > 500 ? content.substring(0, 500) + "..." : content;

                report += `### Referendum #${post.post_id}\n`;
                report += `**Title**: ${title}\n`;
                report += `**Proposer**: ${post.proposer}\n`;
                report += `**Status**: ${post.status}\n`;
                report += `**Track**: ${post.track_no}\n`;
                report += `**Summary**: ${shortContent}\n`;
                report += `\n---\n`;
            });

            return report;
        } catch (error) {
            console.error("Error fetching referenda:", error);
            return "Error fetching Polkadot referenda data. Please check logs.";
        }
    }
};

export { polkadotProvider };
