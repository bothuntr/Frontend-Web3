import { useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import logo from "./logo.svg";

const contractAddress = "YOUR_CONTRACT_ADDRESS";

const abi = [
  "function setFavoriteNumber(uint256 _num)",
  "function favoriteNumber() view returns (uint256)"
];

function App() {
  const [account, setAccount] = useState("");
  const [number, setNumber] = useState("");
  const [storedNumber, setStoredNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Install MetaMask");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(contractAddress, abi, signer);
    window.contract = contract;

    setAccount(accounts[0]);
  };

  const setNumberFunc = async () => {
    if (!window.contract) return alert("Connect wallet first");
    if (number === "") return alert("Please enter a number");

    try {
      setLoading(true);
      const tx = await window.contract.setFavoriteNumber(Number(number));
      await tx.wait();
      alert("Transaction successful 🚀");
    } catch (err) {
      console.error(err);
      alert("Transaction failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const getNumber = async () => {
    if (!window.contract) return alert("Connect wallet first");

    const num = await window.contract.favoriteNumber();
    setStoredNumber(num.toString());
  };

  const shortAddress = account
    ? `${account.slice(0, 6)}...${account.slice(-4)}`
    : "";

  return (
    <div className="container">
      <div className="card">

        <img src={logo} className="logo" alt="logo" />
        <h1>Sign in</h1>
        <p className="subtitle">Connect your Web3 wallet to continue</p>

        <button
          className="btn btn-primary"
          onClick={connectWallet}
        >
          {account ? `Connected: ${shortAddress}` : "Connect Wallet"}
        </button>

        {account && (
          <p className={`account ${account ? "visible" : ""}`}>
            {account}
          </p>
        )}

        <div className="divider" />

        <div className="input-wrapper">
          <label htmlFor="fav-number">Favorite number</label>
          <input
            id="fav-number"
            type="number"
            placeholder="Enter a number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={setNumberFunc}
          disabled={loading}
        >
          {loading ? "Processing..." : "Send Transaction"}
        </button>

        <button
          className="btn btn-outlined"
          onClick={getNumber}
        >
          Fetch Stored Number
        </button>

        <div className="result-box">
          <div className="result-label">Stored Value</div>
          {storedNumber
            ? <div className="result-value">{storedNumber}</div>
            : <div className="result-empty">Not fetched yet</div>
          }
        </div>

      </div>
    </div>
  );
}

export default App;
