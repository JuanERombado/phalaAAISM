# The OpenGov Sentinel 🛡️

**Automated Governance Risk Assurance via Confidential AI**

The **OpenGov Sentinel** is an autonomous AI security agent designed to solve the scalability crisis in decentralized governance. Operating inside a **Trusted Execution Environment (TEE)** on the Phala Network, the Sentinel monitors Polkadot OpenGov referenda 24/7. 

It ingests proposal data, verifies evidence against a strict **Risk Management Framework**, and publishes immutable, neutral risk assessments to help voters make safer, faster decisions.

---

## 🏗️ The Architecture (The "Three Pillars")

### 1. The Body: Confidential Compute 🔒
- **Base Framework**: [Eliza](https://github.com/ai16z/eliza) running on [Phala Network](https://phala.network) SGX TEEs.
- **Why**: Ensures the AI model and its decision-making logic are tamper-proof and invisible to node operators.
- **Security**: Keys and logic are sealed within the enclave.

### 2. The Eyes: Evidence-Based Data Provider 👁️
- **Custom Plugin**: `@elizaos/plugin-polkadot`
- **Function**: 
    - Fetches the **full text** of active referenda from the Polkassembly API.
    - **Immutable Audit Trail**: Hashes the input data (`SHA-256`) to create a cryptographic fingerprint of the proposal at the time of analysis. 
    - This ensures that the AI is analyzing the exact text presented, preventing "bait-and-switch" attacks.

### 3. The Brain: Compliance Engine 🧠
- **Persona**: OpenGov Sentinel (Not a Chatbot, but a Compliance Officer).
- **Risk Matrix**: A strict 0-10 scoring system based on the AAISM Risk Management Framework.
    - **Financial Risk**: Checks for itemized budgets, market-rate validation, and fiscal responsibility.
    - **Identity Risk**: Verifies on-chain identity, account age, and reputation.
    - **Execution Risk**: Demands clear milestones, deliverables, and success metrics.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 23+
- pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/JuanERombado/phalaAAISM.git

# Install dependencies
pnpm install

# Build the custom Polkadot plugin
cd packages/plugin-polkadot
pnpm run build

# Build the agent
cd ../..
pnpm build
```

### Running the Sentinel

```bash
# Start the agent with the Sentinel character
pnpm start --character="polkadot-sentinel.character.json"
```

---

## 📊 Example Output

When a user asks: *"What is the risk of Referendum #123?"*

**The Sentinel Responds:**

> ### OpenGov Sentinel Risk Report
> **Target**: Referendum #123
> **Evidence Hash**: `a1b2c3d4...`
> 
> #### 1. Financial Risk: 8/10 (High) 🔴
> - **Evidence**: "The proposal asks for 100,000 DOT with a single line item: 'Marketing'."
> - **Analysis**: Missing itemized budget. No market-rate comparison provided.
> 
> #### 2. Identity Risk: 2/10 (Low) 🟢
> - **Evidence**: "Proposer is a verified Registrar with 3 years of history."
> - **Analysis**: High reputation score.
> 
> #### 3. Execution Risk: 9/10 (Critical) 🔴
> - **Evidence**: "We will do good work."
> - **Analysis**: Zero milestones. No success metrics defined.
> 
> **FINAL VERDICT**: **CRITICAL RISK**. Recommend rejection until artifacts are provided.

---

## 📜 License
MIT
