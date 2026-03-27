import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveTransaction, transactionIdGenerate } from '../../Services/TransactionService';
import { displayAllProducts } from '../../Services/ProductService';
import { getRole, getUserId } from '../../Services/LoginService'; // Added for dynamic Auth

const TransactionEntry = () => {
  const navigate = useNavigate();
  
 
  const [products, setProducts] = useState([]);
  const [role, setRole] = useState("");
  const [transaction, setTransaction] = useState({
    transactionId: '',
    transactionType: '',
    productId: '',
    rate: '',
    quantity: '',
    transactionValue: '',
    userId: '', 
    transactionDate: new Date().toISOString().split('T')[0],
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // --- EFFECT 1: Fetch Products and User Info ---
  useEffect(() => {
    const fetchAuthAndData = async () => {
      try {
        const roleRes = await getRole();
        setRole(roleRes.data);
        
        const userRes = await getUserId();
        setTransaction(prev => ({ ...prev, userId: userRes.data }));

        const res = await displayAllProducts();
        setProducts(res.data);
      } catch (err) {
        console.error("Initialization failed", err);
      }
    };
    fetchAuthAndData();
  }, []);

  useEffect(() => {
    const fetchNewId = async () => {
      if (transaction.transactionType) {
        try {
          const flag = transaction.transactionType === 'IN' ? 1 : 2;
          const res = await transactionIdGenerate(flag);
          setTransaction(prev => ({ ...prev, transactionId: res.data }));
        } catch (err) {
          console.error("ID Generation failed", err);
        }
      }
    };
    fetchNewId();
  }, [transaction.transactionType]);

  useEffect(() => {
    const r = parseFloat(transaction.rate) || 0;
    const q = parseFloat(transaction.quantity) || 0;
    const total = (r * q).toFixed(2);
    setTransaction(prev => ({ ...prev, transactionValue: total }));
  }, [transaction.rate, transaction.quantity]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "productId") {
      const selectedProd = products.find(p => p.productId === value);
      if (selectedProd) {
        setTransaction(prev => ({ 
          ...prev, 
          productId: value,
          rate: transaction.transactionType === "OUT" ? selectedProd.salesPrice : selectedProd.purchasePrice 
        }));
      }
    } else {
      setTransaction(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let tempErrors = {};
    
    const currentProduct = products.find(p => p.productId === transaction.productId);

    // 1. Basic Validation
    if (!transaction.transactionType) tempErrors.transactionType = "Select Type";
    if (!transaction.productId) tempErrors.productId = "Select Product";
    if (!transaction.rate || transaction.rate <= 0) tempErrors.rate = "Invalid Rate";
    if (!transaction.quantity || transaction.quantity <= 0) tempErrors.quantity = "Invalid Qty";

    if (transaction.transactionType === "OUT" && currentProduct) {
      if (parseInt(transaction.quantity) > currentProduct.stock) {
        tempErrors.quantity = `Insufficient Stock! Only ${currentProduct.stock} available.`;
      }
    }

    if (currentProduct) {
        const basePrice = transaction.transactionType === "OUT" ? currentProduct.salesPrice : currentProduct.purchasePrice;
        if (parseFloat(transaction.rate) > basePrice * 5) {
            const confirm = window.confirm(`Warning: Rate ₹${transaction.rate} is much higher than usual. Is this a typo?`);
            if (!confirm) return;
        }
    }

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    setLoading(true);
    try {
      await saveTransaction(transaction);
      const targetMenu = role === "Admin" ? "/admin-menu" : role === "Manager" ? "/manager-menu" : "/vendor-menu";
      navigate(targetMenu, { state: { reload: true } });
    } catch (error) {
      alert("Error saving transaction to database.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative pt-16 flex items-center bg-base-300">
      <div className="container mx-auto px-4 py-4 z-10 w-full">
        <div className="card bg-base-100/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden">
          <div className="flex flex-col md:flex-row h-full">
            

            <div className="md:w-1/3 bg-primary/10 p-8 border-r border-white/5">
              <h1 className="text-3xl font-extrabold text-primary mb-2">SmartShelfX</h1>
              <p className="text-sm opacity-60 mb-8">Role: {role} | Operator: {transaction.userId}</p>
              
              <div className="space-y-4">
                <div className="bg-base-200/50 p-4 rounded-2xl border border-white/5">
                  <p className="text-xs uppercase opacity-50 mb-1">Generated ID</p>
                  <p className="font-mono text-xl font-bold">{transaction.transactionId || "---"}</p>
                </div>
                <div className="bg-base-200/50 p-4 rounded-2xl border border-white/5">
                  <p className="text-xs uppercase opacity-50 mb-1">Total Transaction Value</p>
                  <p className="text-2xl font-bold text-success">₹ {transaction.transactionValue}</p>
                </div>
              </div>
            </div>


            <div className="flex-1 p-8">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="form-control">
                  <label className="label-text mb-2 block font-semibold">Movement Type</label>
                  <select 
                    name="transactionType" 
                    className={`select select-bordered w-full bg-base-200 ${errors.transactionType ? 'select-error' : ''}`}
                    value={transaction.transactionType} 
                    onChange={handleChange}
                  >
                    <option value="">Choose IN or OUT</option>
                    <option value="IN">IN (Stock Purchase)</option>
                    <option value="OUT">OUT (Stock Issue)</option>
                  </select>
                  {errors.transactionType && <span className="text-error text-xs mt-1">{errors.transactionType}</span>}
                </div>

                <div className="form-control">
                  <label className="label-text mb-2 block font-semibold">Select Product</label>
                  <select 
                    name="productId" 
                    className={`select select-bordered w-full bg-base-200 ${errors.productId ? 'select-error' : ''}`}
                    value={transaction.productId} 
                    onChange={handleChange}
                    disabled={!transaction.transactionType}
                  >
                    <option value="">{transaction.transactionType ? "-- Select Product --" : "Select Type First"}</option>
                    {products.map(p => (
                      <option key={p.productId} value={p.productId}>
                        {p.productId} - {p.productName} (Stock: {p.stock})
                      </option>
                    ))}
                  </select>
                  {errors.productId && <span className="text-error text-xs mt-1">{errors.productId}</span>}
                </div>

                <div className="form-control">
                  <label className="label-text mb-2 block font-semibold">Unit Rate (₹)</label>
                  <input 
                    type="number" 
                    name="rate" 
                    className={`input input-bordered bg-base-200 ${errors.rate ? 'input-error' : ''}`}
                    value={transaction.rate} 
                    onChange={handleChange} 
                  />
                  {errors.rate && <span className="text-error text-xs mt-1">{errors.rate}</span>}
                </div>

                <div className="form-control">
                  <label className="label-text mb-2 block font-semibold">Quantity</label>
                  <input 
                    type="number" 
                    name="quantity" 
                    className={`input input-bordered bg-base-200 ${errors.quantity ? 'input-error' : ''}`}
                    value={transaction.quantity} 
                    onChange={handleChange} 
                  />
                  {errors.quantity && <span className="text-error text-xs mt-1">{errors.quantity}</span>}
                </div>

                <div className="md:col-span-2 flex gap-4 pt-4 border-t border-white/5">
                  <button 
                    type="submit" 
                    className={`btn btn-primary flex-1 ${loading ? 'loading' : ''}`}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Submit Transaction"}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-ghost" 
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionEntry;