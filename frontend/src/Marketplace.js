import { ethers, BigNumber } from 'ethers';
const value = BigNumber.from("1000");

export default function Marketplace({ marketplaceContract, signer }) {
  const [orders, setOrders] = useState([]);

  // Fetch all open orders from contract
  const fetchOrders = async () => {
    if (!marketplaceContract) return;
    try {
      const count = await marketplaceContract.orderCount();
      const fetched = [];
      for (let i = 1; i <= count; i++) {
        const order = await marketplaceContract.orders(i);
        if (order.open) {
          fetched.push({
            id: i,
            seller: order.seller,
            token: order.token,
            amount: order.amount,
            pricePerToken: order.pricePerToken
          });
        }
      }
      setOrders(fetched);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  // Buy specified amount of tokens from order
  const buyOrder = async (orderId, amount) => {
    if (!marketplaceContract || !signer) return;

    try {
      const order = await marketplaceContract.orders(orderId);
      if (!order.open) return alert("Order is closed!");

      // Calculate total value: pricePerToken * amount
      const totalValue = order.pricePerToken.mul(ethers.BigNumber.from(amount));

      const tx = await marketplaceContract.buy(orderId, amount, { value: totalValue });
      await tx.wait();
      alert(`Successfully bought ${amount} token(s)!`);
      fetchOrders();
    } catch (err) {
      console.error("Error buying order:", err);
      alert("Transaction failed. Check console.");
    }
  };

  useEffect(() => {
    if (marketplaceContract) fetchOrders();
  }, [marketplaceContract]);

  return (
    <div>
      <h3>Marketplace</h3>
      {orders.length === 0 ? (
        <p>No open orders available</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            style={{ border: '1px solid gray', margin: '5px', padding: '5px' }}
          >
            <p>Seller: {order.seller}</p>
            <p>Amount Available: {order.amount.toString()}</p>
            <p>Price per Token (wei): {order.pricePerToken.toString()}</p>
            <button
              disabled={!order.open || order.amount.toString() === '0'}
              onClick={() => buyOrder(order.id, 1)}
            >
              Buy 1 Token
            </button>
          </div>
        ))
      )}
    </div>
  );
}
