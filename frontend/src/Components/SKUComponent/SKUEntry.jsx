import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveSKU } from "../../Services/SKUService";

const SKUEntry = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [flag, setFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [skuData, setSkuData] = useState({
    skuId: "",
    skuDescription: "",
    category: "",
  });

  useEffect(() => {
    setFlag(false);
  }, []);

  const createNewSKU = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await saveSKU(skuData);
      setFlag(true);
    } catch (error) {
      console.error("Failed to save SKU:", error);
      alert("Failed to save SKU. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onChangeHandler = (event) => {
    setFlag(false);
    const { name, value } = event.target;
    setSkuData(values => ({ ...values, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleValidation = (event) => {
    event.preventDefault();
    let tempErrors = {};
    let isValid = true;

    if (!skuData.skuId.trim()) { tempErrors.skuId = "SKU Id is required"; isValid = false; }
    if (!skuData.skuDescription.trim()) { tempErrors.skuDescription = "Description is required"; isValid = false; }
    if (!skuData.category.trim()) { tempErrors.category = "Category is required"; isValid = false; }

    setErrors(tempErrors);
    if (isValid) createNewSKU(event);
  };

  const nextEntry = () => {
    setSkuData({ skuId: "", skuDescription: "", category: "" });
    setFlag(false);
    setErrors({});
  };

  const returnToDashboard = () => {
    navigate('/admin-menu');
  };

  return (
    <div className="min-h-screen w-full relative pt-16">
      {/* Fixed Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-base-300 via-base-200 to-base-300 -z-10"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-secondary/5 animate-gradient-shift -z-10"></div>
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-float-slow -z-10"></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] animate-float-slower -z-10"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Panel - Branding */}
          <div className="flex-1">
            <div className="card bg-base-100/30 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl h-full">
              <div className="card-body p-8">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  SKU <span className="text-primary">Addition</span>
                </h1>
                <p className="text-sm opacity-70 mt-2">
                  Register a new Stock Keeping Unit to the AI-Inventory Master Catalog.
                </p>
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Unique identifier for tracking</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Categorize for better analytics</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Detailed description for clarity</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="flex-1">
            <div className="card bg-base-100/30 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl">
              <div className="card-body p-8">
                <h2 className="text-2xl font-bold mb-2">New Entry</h2>
                <p className="text-sm opacity-70 mb-6">Enter the technical specifications below</p>

                {flag ? (
                  <div className="text-center space-y-6">
                    <div className="flex items-center justify-center gap-2 text-success text-sm font-medium bg-success/10 py-3 px-4 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      🎉 New SKU Registered!
                    </div>
                    <div className="flex gap-4">
                      <button className="btn btn-primary flex-1" onClick={nextEntry}>
                        Add Another
                      </button>
                      <button className="btn btn-outline flex-1" onClick={returnToDashboard}>
                        Dashboard
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleValidation} className="space-y-6">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">SKU Identification ID</span>
                      </label>
                      <input
                        type="text"
                        name="skuId"
                        placeholder="e.g. ELEC-001"
                        className={`input input-lg bg-base-200/40 border border-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-xl transition-all duration-300 ${errors.skuId ? 'border-error ring-2 ring-error/20' : ''}`}
                        value={skuData.skuId}
                        onChange={onChangeHandler}
                      />
                      {errors.skuId && <p className="text-error text-xs mt-1 ml-2 animate-shake">{errors.skuId}</p>}
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Category</span>
                      </label>
                      <input
                        type="text"
                        name="category"
                        placeholder="e.g. Electronics"
                        className={`input input-lg bg-base-200/40 border border-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-xl transition-all duration-300 ${errors.category ? 'border-error ring-2 ring-error/20' : ''}`}
                        value={skuData.category}
                        onChange={onChangeHandler}
                      />
                      {errors.category && <p className="text-error text-xs mt-1 ml-2 animate-shake">{errors.category}</p>}
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Description</span>
                      </label>
                      <textarea
                        rows="3"
                        name="skuDescription"
                        placeholder="Describe the SKU specs..."
                        className={`textarea textarea-lg bg-base-200/40 border border-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-xl transition-all duration-300 ${errors.skuDescription ? 'border-error ring-2 ring-error/20' : ''}`}
                        value={skuData.skuDescription}
                        onChange={onChangeHandler}
                      />
                      {errors.skuDescription && <p className="text-error text-xs mt-1 ml-2 animate-shake">{errors.skuDescription}</p>}
                    </div>

                    <div className="flex gap-4 pt-2">
                      <button
                        type="submit"
                        className={`btn btn-primary flex-1 ${loading ? 'loading' : ''}`}
                        disabled={loading}
                      >
                        {loading ? "Submitting..." : "Submit Entry"}
                      </button>
                      <button type="button" className="btn btn-outline flex-1" onClick={returnToDashboard}>
                        Return
                      </button>
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

export default SKUEntry;