import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OutTransactionForm = () => {
  const navigate = useNavigate();


  const [transactionId, setTransactionId] = useState('');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [rate, setRate] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [transactionValue, setTransactionValue] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch auto ID, products, and users
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const idRes = await axios.get('http://localhost:8080/invent/trans-id/2'); // flag=2 for OUT
        setTransactionId(idRes.data);


        const prodRes = await axios.get('http://localhost:8080/invent/products'); // adjust endpoint
        setProducts(prodRes.data);
        if (prodRes.data.length > 0) setSelectedProduct(prodRes.data[0].id);

        const userRes = await axios.get('http://localhost:8080/invent/users'); // adjust endpoint
        setUsers(userRes.data);
        if (userRes.data.length > 0) setSelectedUser(userRes.data[0].id);
      } catch (err) {
        console.error('Failed to load form data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    setTransactionValue(rate * quantity);
  }, [rate, quantity]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:8080/invent/stock', {
        transactionId,
        transactionType: 'OUT',
        productId: selectedProduct,
        userId: selectedUser,
        rate,
        quantity,
        transactionValue,
        transactionDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      });

      alert('OUT Transaction Saved Successfully!');
      navigate(`/transactions/OUT`); // redirect to ledger
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Failed to save transaction.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-base-100 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-primary">OUT Transaction Form</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Transaction ID (read-only) */}
        <div>
          <label className="label">Transaction ID</label>
          <input
            type="text"
            value={transactionId}
            readOnly
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">Product</label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="select select-bordered w-full"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Operator/User</label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="select select-bordered w-full"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="label">Unit Rate</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="input input-bordered w-full"
              step="0.01"
            />
          </div>
          <div className="flex-1">
            <label className="label">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value))}
              className="input input-bordered w-full"
              step="0.01"
            />
          </div>
        </div>

        <div>
          <label className="label">Total Value</label>
          <input
            type="number"
            value={transactionValue}
            readOnly
            className="input input-bordered w-full"
          />
        </div>

        <button type="submit" className="btn btn-primary mt-4">
          Submit OUT Transaction
        </button>
      </form>
    </div>
  );
};

export default OutTransactionForm;