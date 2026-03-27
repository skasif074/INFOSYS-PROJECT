import React, { useEffect, useState } from 'react';
import { getProductById, editProductPrice } from '../../Services/ProductService';
import { useParams, useNavigate } from "react-router-dom";

const ProductPriceEdit = () => {
  const param = useParams();
  const navigate = useNavigate();
  const [newPrice, setNewPrice] = useState(0.0);
  const [product, setProduct] = useState({
    productId: "",
    productName: "",
    skuId: "",
    purchasePrice: 0.0,
    salesPrice: 0.0,
    reorderLevel: 0.0,
    stock: 0.0,
    vendorId: "",
    status: true,
  });
  const [flag, setFlag] = useState(false);

  const setProductData = () => {
    getProductById(param.pid).then((response) => {
      setProduct(response.data);
      setNewPrice(response.data.purchasePrice);
    });
  };

  useEffect(() => {
    setFlag(false);
    setProductData();
  }, []);

  const onChangeHandler = (event) => {
    setNewPrice(event.target.value);
  };

  const updatePrice = (event) => {
    event.preventDefault();
    const updatedProduct = { ...product, purchasePrice: newPrice };
    editProductPrice(updatedProduct).then(response => {
      setFlag(true);
      setProduct(updatedProduct);
    });
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
                  Price <span className="text-primary">Update</span>
                </h1>
                <p className="text-sm opacity-70 mt-1">
                  Modifying financial records for <strong>{product.productName || 'Product'}</strong>
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
                    <span className="opacity-70">Vendor</span>
                    <span className="font-mono font-medium">{product.vendorId}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                    <span className="opacity-70">Current Stock</span>
                    <span className="font-mono font-medium">{product.stock}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                    <span className="opacity-70">Current Price</span>
                    <span className="font-mono font-medium text-primary">${product.purchasePrice}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="flex-1">
            <div className="card bg-base-100/30 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl">
              <div className="card-body p-6">
                <h2 className="text-2xl font-bold mb-1">Edit Pricing</h2>
                <p className="text-sm opacity-70 mb-4">Adjust the purchase valuation below</p>

                <form onSubmit={updatePrice} className="space-y-5">
                  <div className="form-control">
                    <label className="label py-0">
                      <span className="label-text">New Purchase Price ($)</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="newPrice"
                      placeholder="0.00"
                      value={newPrice}
                      onChange={onChangeHandler}
                      className="input input-lg bg-base-200/40 border border-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-xl transition-all duration-300"
                    />
                  </div>

                  {flag && (
                    <div className="flex items-center justify-center gap-2 text-success text-sm font-medium bg-success/10 py-2 px-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      ✓ Price updated successfully
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="btn btn-primary flex-1">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline flex-1"
                      onClick={() => navigate('/product-list')}
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
      `}</style>
    </div>
  );
};

export default ProductPriceEdit;