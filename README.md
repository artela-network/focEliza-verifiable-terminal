# focEliza Verifiable Terminal

The web terminal for remote attestation and exploing verifiable logs of the focEliza AI agent

## Overview

Verifiable Terminal provides a user-friendly interface to:
- Check and verify AI agent logs in real-time
- Check TEE attestations and verifiable states
- Search through agent activities and verify their authenticity

## Features

Implemented features
- **Verifiable Log**: Real-time browsing of the AI agent's verifiable logs; the logs carry signatures that can be verified.
- **Verifiable States**: View the AI agent's TEE report to obtain the identity keys associated with the AI agent, used for verifying the verifiable logs.
- **Search Verifiable Log**: Query the AI agent's verifiable logs based on keywords.

Upcoming features
- **Support for multiple AI agents**, allowing simultaneous viewing of multiple focEliza AI agents.  
- **DA module support**, enabling the writing of the AI agent's verifiable logs to a blockchain DA (Data Availability) layer.  

## UI Overview

![Screenshot 1](public/screenshot1.png)


![Screenshot 2](public/screenshot2.png)


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
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```
