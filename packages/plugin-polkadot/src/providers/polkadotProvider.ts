import { IAgentRuntime, Memory, Provider, State } from "@elizaos/core";
import { GraphQLClient, gql } from 'graphql-request';

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

const polkadotProvider: Provider = {
    get: async (_runtime: IAgentRuntime, _message: Memory, _state?: State) => {
        try {
            const client = new GraphQLClient(POLKASSEMBLY_ENDPOINT);
            const data: any = await client.request(GET_LATEST_REFERENDA);

            if (!data.posts || data.posts.length === 0) {
                return "No active Polkadot referenda found.";
            }

            let report = "## Active OpenGov Referenda (Ingested via GraphQL)\n\n";

            data.posts.forEach((post: any) => {
                const title = post.title || "No Title";
                const content = post.content || "No content available.";
                const shortContent = content.length > 500 ? content.substring(0, 500) + "..." : content;

                report += `### Referendum #${post.id}\n`;
                report += `**Title**: ${title}\n`;
                report += `**Proposer**: ${post.proposer}\n`;
                report += `**Status**: ${post.status}\n`;
                report += `**Track**: ${post.track_no}\n`;
                report += `**Summary**: ${shortContent}\n`;
                report += `\n---\n`;
            });

            return report;
        } catch (error) {
            console.error("Error fetching referenda via GraphQL:", error);
            return "Error fetching Polkadot referenda data. Please check logs.";
        }
    }
};

export { polkadotProvider };
