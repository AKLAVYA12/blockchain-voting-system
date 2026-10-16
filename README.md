# BlockVote — Blockchain Voting System

BlockVote is a decentralized voting application built using blockchain technology. Users can connect their MetaMask wallet, view candidates, and cast votes. Smart contracts handle vote counting and prevent the same wallet address from voting more than once.

## Technologies Used

- **Solidity** — Smart contract development
- **Truffle** — Smart contract compilation, deployment, and testing
- **Ganache** — Local blockchain for development and testing
- **React.js** — Frontend user interface
- **Vite** — Frontend development server and build tool
- **Web3.js** — Connects the frontend to the blockchain
- **MetaMask** — Wallet connection and transaction signing
- **Node.js and npm** — JavaScript runtime and package management
- **Git and GitHub** — Version control and source code hosting

## Features

- Connect MetaMask wallet
- Display candidates and vote counts
- Cast votes through blockchain transactions
- Prevent duplicate voting from the same wallet address
- Restrict election closure to the administrator
- Reject invalid candidate IDs and votes after voting closes
- Automated smart contract tests

## How to Run the Project

### 1. Start Ganache

Open Ganache and start your local blockchain. Make sure the RPC endpoint is `http://127.0.0.1:7546` and the network ID is `5777`, matching your project configuration.

### 2. Deploy the Smart Contracts

Open a terminal in the project root and run:

```bash
npx truffle migrate --reset
```

### 3. Update the Contract Artifact

Copy the newly compiled contract artifact into the frontend:

```powershell
Copy-Item .\build\contracts\Voting.json .\client\src\contracts\Voting.json -Force
```

Get the newly deployed contract address:

```powershell
node -e "console.log(require('./build/contracts/Voting.json').networks['5777'].address)"
```

Update `CONTRACT_ADDRESS` in `client/src/App.jsx` with this address.

### 4. Start the Frontend

Open a terminal in the project root and run:

```bash
cd client
npm install
npm run dev
```

Open the local URL shown in the terminal, usually `http://localhost:5173`, and connect MetaMask to your Ganache network.

## How to Reset the Local Blockchain

To start a fresh election with zero votes:

1. Stop the current Ganache session.
2. Restart Ganache or create a fresh workspace.
3. Verify the RPC port and network ID match `truffle-config.js`.
4. From the project root, redeploy the contracts:

   ```bash
   npx truffle migrate --reset
   ```

5. Copy the updated `Voting.json` artifact into `client/src/contracts/`.
6. Update `CONTRACT_ADDRESS` in `client/src/App.jsx` with the new deployed address.
7. Refresh the frontend and reconnect MetaMask.

**Note:** Redeploying creates a new voting contract with zero votes. Restarting or resetting Ganache can also reset its accounts, balances, and local blockchain history. MetaMask may need to refresh its account transaction history.

## Run Tests

From the project root:

```bash
npx truffle test
```

The tests check candidate initialization, successful voting, duplicate-vote prevention, invalid candidate rejection, administrator permissions, and voting closure.
