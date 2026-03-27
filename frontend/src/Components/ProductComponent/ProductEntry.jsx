import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { saveNewProduct, productIdGenerator } from '../../Services/ProductService';
import { getUsersByRole } from '../../Services/LoginService';
import { getAllCategories, getSkuIdByCategory } from '../../Services/SKUService';

const ProductEntry = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    productId: "",
    productName: "",
    skuId: "",
    purchasePrice: 0.0,
    salesPrice: 0.0,
    reorderLevel: 0.0,
    stock: 0.0,
    vendorId: "",
    status: true
  });
  const [newId, setNewId] = useState("");
  const [vendorList, setVendorList] = useState([]);
  const [skuCategoryList, setSkuCategoryList] = useState([]);
  const [skuCategory, setSkuCategory] = useState("");
  const [skuIdList, setSkuIdList] = useState([]);
  const [flag, setFlag] = useState(false);
  const [errors, setErrors] = useState({});

  const setNewProductId = () => {
    productIdGenerator().then((response) => {
      setNewId(response.data);
    });
  };

  const setVendors = () => {
    getUsersByRole('Vendor').then((response) => {
      setVendorList(response.data);
    });
  };

  const getSkuCategoryList = () => {
    getAllCategories().then((response) => {
      setSkuCategoryList(response.data);
    });
  };

  useEffect(() => {
    setNewProductId();
    setVendors();
    getSkuCategoryList();
    setFlag(false);
  }, []);

  const saveProduct = (event) => {
    event.preventDefault();
    product.productId = newId;
    product.productName = skuCategory;

    if (parseFloat(product.stock) <= parseFloat(product.reorderLevel))
      product.status = false;

    saveNewProduct(product).then(res => {
      setFlag(true);
    });
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setProduct(values => ({ ...values, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleStateChange = (event) => {
    let value = event.target.value;
    setSkuCategory(value);
    if (value !== "---") {
      getSkuIdByCategory(value).then((response) => {
        setSkuIdList(response.data);
      });
    }
  };

  const handleValidation = (event) => {
    event.preventDefault();
    let tempErrors = {};
    let isValid = true;

    if (!skuCategory.trim() || skuCategory === "---") { tempErrors.skuCategory = "Category is required"; isValid = false; }
    if (parseFloat(product.purchasePrice) <= 0) { tempErrors.purchasePrice = "Price must be > 0"; isValid = false; }
    if (parseFloat(product.stock) <= 0) { tempErrors.stock = "Initial stock required"; isValid = false; }
    if (parseFloat(product.reorderLevel) <= 0) { tempErrors.reorderLevel = "Level required"; isValid = false; }
    if (!product.skuId.trim() || product.skuId === "---") { tempErrors.skuId = "SKU ID required"; isValid = false; }
    if (!product.vendorId.trim() || product.vendorId === "---") { tempErrors.vendorId = "Vendor required"; isValid = false; }

    setErrors(tempErrors);
    if (isValid) saveProduct(event);
  };

  return (
    <div className="min-h-screen w-full relative pt-16 flex items-center">
      {/* Fixed Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-base-300 via-base-200 to-base-300 -z-10"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-secondary/5 animate-gradient-shift -z-10"></div>
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-float-slow -z-10"></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] animate-float-slower -z-10"></div>

      <div className="container mx-auto px-4 py-2 relative z-10 w-full">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Panel - Branding */}
          <div className="flex-1">
            <div className="card bg-base-100/30 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl h-full">
              <div className="card-body p-6">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Product <span className="text-primary">Entry</span>
                </h1>
                <p className="text-sm opacity-70 mt-1">
                  Add new items to the AI‑inventory system. Fill in all required details.
                </p>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Auto‑generated Product ID</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Select SKU category and ID</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Assign to a vendor</span>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="flex-1">
            <div className="card bg-base-100/30 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl">
              <div className="card-body p-6">
                <h2 className="text-2xl font-bold mb-1">New Product Entry</h2>
                <p className="text-sm opacity-70 mb-4">Add items to AI‑Inventory System</p>

                {flag ? (
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2 text-success text-sm font-medium bg-success/10 py-2 px-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      🎉 New Product Added Successfully!
                    </div>
                    <div className="flex gap-3">
                      <button className="btn btn-primary flex-1" onClick={() => navigate('/admin-menu')}>Dashboard</button>
                      <button className="btn btn-outline flex-1" onClick={() => { setFlag(false); setNewProductId(); }}>Add Another</button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleValidation} className="space-y-4">

                    <div className="form-control">
                      <label className="label py-0">
                        <span className="label-text">Product ID (Auto‑generated)</span>
                      </label>
                      <input
                        value={newId}
                        readOnly
                        className="input input-lg bg-base-200/40 border border-white/10 rounded-xl cursor-not-allowed opacity-70"
                      />
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label py-0">
                          <span className="label-text">SKU Category</span>
                        </label>
                        <select
                          value={skuCategory}
                          onChange={handleStateChange}
                          className={`select select-lg bg-base-200/40 border border-white/10 rounded-xl ${errors.skuCategory ? 'border-error ring-2 ring-error/20' : ''}`}
                        >
                          <option>---</option>
                          {skuCategoryList.map((cat, i) => (
                            <option key={i} value={cat}>{cat}</option>
                          ))}
                        </select>
                        {errors.skuCategory && <p className="text-error text-xs mt-1 ml-2 animate-shake">{errors.skuCategory}</p>}
                      </div>

                      <div className="form-control">
                        <label className="label py-0">
                          <span className="label-text">SKU ID</span>
                        </label>
                        <select
                          name="skuId"
                          value={product.skuId}
                          onChange={onChangeHandler}
                          className={`select select-lg bg-base-200/40 border border-white/10 rounded-xl ${errors.skuId ? 'border-error ring-2 ring-error/20' : ''}`}
                        >
                          <option>---</option>
                          {skuIdList.map((id, i) => (
                            <option key={i} value={id}>{id}</option>
                          ))}
                        </select>
                        {errors.skuId && <p className="text-error text-xs mt-1 ml-2 animate-shake">{errors.skuId}</p>}
                      </div>

                      <div className="form-control">
                        <label className="label py-0">
                          <span className="label-text">Purchase Price ($)</span>
                        </label>
                        <input
                          type="number"
                          name="purchasePrice"
                          value={product.purchasePrice}
                          onChange={onChangeHandler}
                          className={`input input-lg bg-base-200/40 border border-white/10 rounded-xl ${errors.purchasePrice ? 'border-error ring-2 ring-error/20' : ''}`}
                          step="0.01"
                        />
                        {errors.purchasePrice && <p className="text-error text-xs mt-1 ml-2 animate-shake">{errors.purchasePrice}</p>}
                      </div>

                      <div className="form-control">
                        <label className="label py-0">
                          <span className="label-text">Initial Stock</span>
                        </label>
                        <input
                          type="number"
                          name="stock"
                          value={product.stock}
                          onChange={onChangeHandler}
                          className={`input input-lg bg-base-200/40 border border-white/10 rounded-xl ${errors.stock ? 'border-error ring-2 ring-error/20' : ''}`}
                        />
                        {errors.stock && <p className="text-error text-xs mt-1 ml-2 animate-shake">{errors.stock}</p>}
                      </div>

                      <div className="form-control">
                        <label className="label py-0">
                          <span className="label-text">Reorder Level</span>
                        </label>
                        <input
                          type="number"
                          name="reorderLevel"
                          value={product.reorderLevel}
                          onChange={onChangeHandler}
                          className={`input input-lg bg-base-200/40 border border-white/10 rounded-xl ${errors.reorderLevel ? 'border-error ring-2 ring-error/20' : ''}`}
                        />
                        {errors.reorderLevel && <p className="text-error text-xs mt-1 ml-2 animate-shake">{errors.reorderLevel}</p>}
                      </div>

                      <div className="form-control">
                        <label className="label py-0">
                          <span className="label-text">Assigned Vendor</span>
                        </label>
                        <select
                          name="vendorId"
                          value={product.vendorId}
                          onChange={onChangeHandler}
                          className={`select select-lg bg-base-200/40 border border-white/10 rounded-xl ${errors.vendorId ? 'border-error ring-2 ring-error/20' : ''}`}
                        >
                          <option>---</option>
                          {vendorList.map((v, i) => (
                            <option key={i} value={v}>{v}</option>
                          ))}
                        </select>
                        {errors.vendorId && <p className="text-error text-xs mt-1 ml-2 animate-shake">{errors.vendorId}</p>}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button type="submit" className="btn btn-primary flex-1">
                        Save Product
                      </button>
                      <Link to="/admin-menu" className="flex-1">
                        <button type="button" className="btn btn-outline w-full">
                          Cancel
                        </button>
                      </Link>
                    </div>
                  </form>
                )}
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

export default ProductEntry;