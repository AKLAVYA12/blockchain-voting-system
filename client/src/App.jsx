
import { useEffect, useState } from "react";
import Web3 from "web3";
import VotingArtifact from "./contracts/Voting.json";
import "./App.css";

const CONTRACT_ADDRESS = "0xEd85d8a37EB136D595601b4263FdbdD36b310db6";
const EXPECTED_NETWORK_ID = "5777";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [votingOpen, setVotingOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadVotingData(votingContract, voter) {
    const count = Number(
      await votingContract.methods.candidateCount().call()
    );

    const results = [];

    for (let id = 1; id <= count; id++) {
      const candidate = await votingContract.methods
        .getCandidate(id)
        .call();

      results.push({
        id: Number(candidate.id),
        name: candidate.name,
        voteCount: Number(candidate.voteCount),
      });
    }

    setCandidates(results);
    setHasVoted(
      voter
        ? await votingContract.methods.hasVoted(voter).call()
        : false
    );
    setVotingOpen(
      await votingContract.methods.votingOpen().call()
    );
  }

  async function connectWallet() {
    try {
      setLoading(true);
      setMessage("");

      if (!window.ethereum) {
        throw new Error("Please install the MetaMask browser extension.");
      }

      const web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!accounts.length) {
        throw new Error("No wallet account was selected.");
      }

      const networkId = String(await web3.eth.net.getId());

      if (networkId !== EXPECTED_NETWORK_ID) {
        throw new Error(
          `Wrong network. Expected Ganache network ID ${EXPECTED_NETWORK_ID}, received ${networkId}.`
        );
      }

      const votingContract = new web3.eth.Contract(
        VotingArtifact.abi,
        CONTRACT_ADDRESS
      );

      const voter = accounts[0];

      await loadVotingData(votingContract, voter);

      setAccount(voter);
      setContract(votingContract);
      setMessage("Wallet connected successfully!");
    } catch (error) {
      setMessage(error.message || "Could not connect wallet.");
    } finally {
      setLoading(false);
    }
  }

  async function castVote(candidateId) {
    if (!contract || !account) return;

    try {
      setLoading(true);
      setMessage("Please confirm the transaction in MetaMask.");

      await contract.methods.vote(candidateId).send({
        from: account,
      });

      await loadVotingData(contract, account);
      setMessage("Your vote was recorded successfully!");
    } catch (error) {
      setMessage(
        error?.cause?.message ||
          error?.message ||
          "Transaction failed."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = () => {
      setAccount("");
      setContract(null);
      setCandidates([]);
      setHasVoted(false);
      setMessage("Wallet changed. Please reconnect.");
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener(
        "accountsChanged",
        handleAccountsChanged
      );
      window.ethereum.removeListener(
        "chainChanged",
        handleChainChanged
      );
    };
  }, []);

  return (
    <main className="app">
      <header className="header">
        <div className="brand">BlockVote</div>
        <button
          className="connect-button"
          onClick={connectWallet}
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : account
              ? `${account.slice(0, 6)}...${account.slice(-4)}`
              : "Connect MetaMask"}
        </button>
      </header>

      <section className="hero">
        <p className="eyebrow">DECENTRALIZED VOTING</p>
        <h1>Your vote.<br />On the blockchain.</h1>
        <p className="subtitle">
          Connect your wallet, choose a candidate, and cast your vote.
        </p>
        <span className={`status ${votingOpen ? "open" : "closed"}`}>
          {votingOpen ? "Voting is open" : "Voting is closed"}
        </span>
      </section>

      {message && (
        <div className="message" role="status">
          {message}
        </div>
      )}

      <section className="candidates">
        <div className="section-heading">
          <h2>Meet the candidates</h2>
          <p>Votes are recorded by the smart contract.</p>
        </div>

        <div className="candidate-grid">
          {candidates.map((candidate) => (
            <article className="candidate-card" key={candidate.id}>
              <div className="candidate-number">
                Candidate {candidate.id}
              </div>
              <h3>{candidate.name}</h3>
              <div className="vote-count">
                {candidate.voteCount}
              </div>
              <p className="vote-label">Votes received</p>

              <button
                className="vote-button"
                disabled={
                  !account ||
                  !contract ||
                  hasVoted ||
                  !votingOpen ||
                  loading
                }
                onClick={() => castVote(candidate.id)}
              >
                {!account
                  ? "Connect wallet first"
                  : hasVoted
                    ? "Already voted"
                    : !votingOpen
                      ? "Voting closed"
                      : "Vote for this candidate"}
              </button>
            </article>
          ))}
        </div>

        {account && (
          <button
            className="refresh-button"
            onClick={() => loadVotingData(contract, account)}
            disabled={loading}
          >
            Refresh results
          </button>
        )}
      </section>

      <footer>
        BlockVote · Educational blockchain project
      </footer>
    </main>
  );
}

export default App;
