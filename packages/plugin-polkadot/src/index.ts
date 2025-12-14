import { Plugin } from "@elizaos/core";
import { polkadotProvider } from "./providers/polkadotProvider.ts";

export const polkadotPlugin: Plugin = {
    name: "polkadot",
    description: "Polkadot integration plugin",
    actions: [],
    evaluators: [],
    providers: [polkadotProvider],
};

export default polkadotPlugin;
