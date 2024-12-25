# Verifiable Terminal

A web-based terminal interface for interacting with and verifying AI agents running in Trusted Execution Environments (TEE) on focEliza.

## Overview

Verifiable Terminal provides a user-friendly interface to:
- View and verify AI agent logs in real-time
- Inspect TEE attestations and verifiable states
- Search through agent activities and verify their authenticity
- Monitor agent signatures and cryptographic proofs

## Features

- **Real-time Log Monitoring**: Watch AI agent activities as they happen
- **Verifiable States**: Inspect and verify the state information of AI agents
- **TEE Attestation**: View detailed attestation proofs from the Trusted Execution Environment
- **Search Functionality**: Search through agent logs with instant results
- **Signature Verification**: Verify the authenticity of agent actions through cryptographic signatures

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/artela-network/verifiable-terminal.git
cd verifiable-terminal
```

2. Create a `.env` file in the root directory and add the following environment variable:
```bash
NEXT_PUBLIC_API_URL=http://...
```

3. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```