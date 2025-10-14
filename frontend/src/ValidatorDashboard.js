
import { useEffect, useState } from 'react';

export default function ValidatorDashboard({ registryContract, signer }) {
  const [properties, setProperties] = useState([]);

  const fetchProperties = async () => {
    const count = await registryContract.propertyCount();
    let props = [];
    for (let i = 1; i <= count; i++) {
      const prop = await registryContract.properties(i);
      if (!prop.registered) props.push(prop);
    }
    setProperties(props);
  };

  const voteProperty = async (propertyId, approve) => {
    const tx = await registryContract.validatorContract().vote(propertyId, approve);
    await tx.wait();
    fetchProperties();
  };

  useEffect(() => {
    if (registryContract) fetchProperties();
  }, [registryContract]);

  return (
    <div>
      <h3>Validator Dashboard</h3>
      {properties.map((prop) => (
        <div key={prop.id} style={{ border: '1px solid black', margin: '5px', padding: '5px' }}>
          <p>Name: {prop.name}</p>
          <p>Owner: {prop.owner}</p>
          <p>Coordinates: {prop.coordinates}</p>
          <button onClick={() => voteProperty(prop.id, true)}>Approve</button>
          <button onClick={() => voteProperty(prop.id, false)}>Reject</button>
        </div>
      ))}
    </div>
  );
}
