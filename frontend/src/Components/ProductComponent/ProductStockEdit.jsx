import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, editProductStock } from '../../Services/ProductService';
import { getUserId } from '../../Services/LoginService';
import { transactionIdGenerate, saveTransaction } from '../../Services/TransactionService';

const ProductStockEdit = () => {
  const [product, setProduct] = useState({
    productId: "", productName: "", skuId: "", purchasePrice: 0.0,
    salesPrice: 0.0, reorderLevel: 0.0, stock: 0.0, vendorId: "", status: true,
  });
  const [newId, setNewId] = useState(0);
  const [errors, setErrors] = useState({});
  const [userId, setUserId] = useState("");
  const [tdate, setTdate] = useState(new Date().toISOString().split('T')[0]);
  const [quantity, setQuantity] = useState(0);
  const [transValue, setTransValue] = useState(null);
  const [warns, setWarns] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const param = useParams();
  const flag = param.no; 

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productRes, userIdRes, idRes] = await Promise.all([
          getProductById(param.pid),
          getUserId(),
          transactionIdGenerate(param.no)
        ]);
        setProduct(productRes.data);
        setUserId(userIdRes.data);
        setNewId(idRes.data);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };
    loadData();
  }, [param.pid, param.no]);

  const stockEdit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const rate = flag === "1" ? product.purchasePrice : product.salesPrice;
    const type = flag === "1" ? "IN" : "OUT";
    const totalValue = parseFloat(rate) * parseFloat(quantity);

    const transactionData = {
      transactionId: newId,
      transactionType: type,
      productId: product.productId,
      rate: rate,
      quantity: quantity,
      transactionValue: totalValue,
      userId: userId,
      transactionDate: tdate,
    };

    try {
      await saveTransaction(transactionData);
      await editProductStock(product, quantity, flag);
      setTransValue(totalValue);
      setIsSuccess(true);
      if (flag === "2" && (product.stock - quantity) <= product.reorderLevel) {
        setWarns("Warning: Stock has reached Re-Order Level.");
      }
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleValidation = (event) => {
    event.preventDefault();
    let tempErrors = {};
    if (!quantity || quantity <= 0) tempErrors.quantity = "Enter a valid quantity";
    if (flag === "2" && quantity > product.stock) tempErrors.quantity = "Insufficient stock available";
    setErrors(tempErrors);
    if (Object.keys(tempErrors).length === 0) stockEdit(event);
  };

  const resetForm = () => {
    setQuantity(0);
    setErrors({});
    setIsSuccess(false);
    setWarns(null);
  };

  return (
    <div className="min-h-screen w-full relative pt-16 flex items-center">
      <div className="fixed inset-0 bg-gradient-to-br from-base-300 via-base-200 to-base-300 -z-10"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-secondary/5 animate-gradient-shift -z-10"></div>
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-float-slow -z-10"></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] animate-float-slower -z-10"></div>

      <div className="container mx-auto px-4 py-2 relative z-10 w-full">
        <div className="flex flex-col md:flex-row gap-6">

          <div className="flex-1">
            <div className="card bg-base-100/30 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl h-full">
              <div className="card-body p-6">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Stock <span className="text-primary">{flag === "1" ? "Purchase" : "Issue"}</span>
                </h1>
                <p className="text-sm opacity-70 mt-1">
                  Transaction Reference for <strong>{product.productName}</strong>
                </p>
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                    <span className="opacity-70">Product ID</span>
                    <span className="font-mono font-medium">{product.productId}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                    <span className="opacity-70">SKU ID</span>
                    <span className="font-mono font-medium">{product.skuId}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                    <span className="opacity-70">Current Stock</span>
                    <span className="font-mono font-medium">{product.stock}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                    <span className="opacity-70">Reorder Level</span>
                    <span className="font-mono font-medium">{product.reorderLevel}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                    <span className="opacity-70">{flag === "1" ? "Purchase Price" : "Sales Price"}</span>
                    <span className="font-mono font-medium text-primary">₹{flag === "1" ? product.purchasePrice : product.salesPrice}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="card bg-base-100/30 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl">
              <div className="card-body p-6">
                <h2 className="text-2xl font-bold mb-1">Transaction Details</h2>
                <p className="text-sm opacity-70 mb-4">Enter quantity and date below</p>

                <form onSubmit={handleValidation} className="space-y-5">
                  <div className="form-control">
                    <label className="label py-0">
                      <span className="label-text">Transaction ID</span>
                    </label>
                    <input
                      value={newId}
                      readOnly
                      className="input input-lg bg-base-200/40 border border-white/10 rounded-xl cursor-not-allowed opacity-70"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label py-0">
                      <span className="label-text">Transaction Date</span>
                    </label>
                    <input
                      type="date"
                      className="input input-lg bg-base-200/40 border border-white/10 rounded-xl"
                      value={tdate}
                      onChange={(e) => setTdate(e.target.value)}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label py-0">
                      <span className="label-text">{flag === "1" ? "Purchase Quantity" : "Issue Quantity"}</span>
                    </label>
                    <input
                      type="number"
                      step="1"
                      placeholder="0"
                      className={`input input-lg bg-base-200/40 border border-white/10 rounded-xl ${errors.quantity ? 'border-error ring-2 ring-error/20' : ''}`}
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                    {errors.quantity && <p className="text-error text-xs mt-1 ml-2 animate-shake">{errors.quantity}</p>}
                  </div>

                  {isSuccess && (
                    <div className="flex items-center justify-center gap-2 text-success text-sm font-medium bg-success/10 py-2 px-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      ✓ Transaction Saved. Value: <strong>₹{transValue}</strong>
                    </div>
                  )}

                  {warns && (
                    <div className="flex items-center justify-center gap-2 text-warning text-sm font-medium bg-warning/10 py-2 px-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      ⚠️ {warns}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className={`btn btn-primary flex-1 ${loading ? 'loading' : ''}`}
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Confirm"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline flex-1"
                      onClick={() => navigate('/product-list')}
                    >
                      Back
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradient-shift {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -20px) scale(1.05); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 30px) scale(1.1); }
        }
        .animate-gradient-shift {
          animation: gradient-shift 8s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float-slower 16s ease-in-out infinite;
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default ProductStockEdit;