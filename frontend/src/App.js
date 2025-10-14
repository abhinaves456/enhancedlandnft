import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MapComponent from './MapComponent';
import ValidatorDashboard from './ValidatorDashboard';
import Marketplace from './Marketplace'; // React component
import PropertyRegistryContract from './contracts/PropertyRegistry.json';
import MarketplaceContract from './contracts/Marketplace.json';
function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [registryContract, setRegistryContract] = useState(null);
  const [marketplaceContract, setMarketplaceContract] = useState(null);
  const [propertyName, setPropertyName] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [propertyCoords, setPropertyCoords] = useState([]);

  const REGISTRY_ADDRESS = 'YOUR_PROPERTY_REGISTRY_ADDRESS';
  const MARKETPLACE_ADDRESS = 'YOUR_MARKETPLACE_ADDRESS';

  // Connect MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      const tempProvider = new ethers.BrowserProvider(window.ethereum);
      await tempProvider.send("eth_requestAccounts", []);
      const tempSigner = await tempProvider.getSigner();
      const addr = await tempSigner.getAddress();
      setProvider(tempProvider);
      setSigner(tempSigner);
      setAccount(addr);

      const registry = new ethers.Contract(REGISTRY_ADDRESS, PropertyRegistryABI.abi, tempSigner);
      setRegistryContract(registry);

      const market = new ethers.Contract(MARKETPLACE_ADDRESS, MarketplaceABI.abi, tempSigner);
      setMarketplaceContract(market);
    } else {
      alert("Install MetaMask!");
    }
  };

  // Submit property
  const submitProperty = async () => {
    if (!propertyName || !ipfsHash || propertyCoords.length === 0) {
      alert("Fill all fields!");
      return;
    }
    const tx = await registryContract.submitProperty(propertyName, ipfsHash, JSON.stringify(propertyCoords));
    await tx.wait();
    alert("Property submitted!");
    setPropertyName('');
    setIpfsHash('');
    setPropertyCoords([]);
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => {
        connectWallet();
      });
    }
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Enhanced Land NFT Marketplace</h1>
      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected: {account}</p>

          <h2>Submit Property</h2>
          <input 
            type="text" 
            placeholder="Property Name" 
            value={propertyName} 
            onChange={(e) => setPropertyName(e.target.value)} 
          />
          <input 
            type="text" 
            placeholder="IPFS Hash" 
            value={ipfsHash} 
            onChange={(e) => setIpfsHash(e.target.value)} 
          />
          <MapComponent addPropertyCoords={setPropertyCoords} />
          <button onClick={submitProperty}>Submit Property</button>

          <hr />
          <ValidatorDashboard registryContract={registryContract} />
          <hr />
          <Marketplace marketplaceContract={marketplaceContract} signer={signer} />
        </div>
      )}
    </div>
  );
}

export default App;
