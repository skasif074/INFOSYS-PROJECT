import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateSKU, getSKUById } from '../../Services/SKUService';

const SKUEdit = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [sku, setSku] = useState({});
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const param = useParams();

  useEffect(() => {
    const loadSKU = async () => {
      try {
        const response = await getSKUById(param.skuno);
        setSku(response.data);
        setDescription(response.data.skuDescription || "");
      } catch (error) {
        console.error("Failed to load SKU:", error);
        alert("SKU not found.");
        navigate('/sku-list');
      } finally {
        setLoading(false);
      }
    };
    loadSKU();
  }, [param.skuno, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrors({ skuDescription: "SKU description is required" });
      return;
    }

    const updatedSku = { ...sku, skuDescription: description };
    try {
      await updateSKU(updatedSku);
      alert("SKU updated successfully!");
      navigate('/sku-list');
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update SKU.");
    }
  };

  const handleCancel = () => {
    navigate('/sku-list');
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center pt-16">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative pt-16">
      <div className="fixed inset-0 bg-gradient-to-br from-base-300 via-base-200 to-base-300 -z-10"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-secondary/5 animate-gradient-shift -z-10"></div>
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-float-slow -z-10"></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] animate-float-slower -z-10"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Panel - SKU Info */}
          <div className="flex-1">
            <div className="card bg-base-100/30 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl h-full">
              <div className="card-body p-8">
                <div className="mb-6">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    SKU <span className="text-primary">Update</span>
                  </h1>
                  <p className="text-sm opacity-70 mt-2">
                    Modifying stock keeping unit details for the AI-inventory catalog.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="border border-white/10 rounded-xl p-4">
                    <div className="text-xs uppercase opacity-50 mb-1">SKU Reference</div>
                    <div className="font-mono text-lg font-bold">{sku.skuId || '—'}</div>
                  </div>
                  <div className="border border-white/10 rounded-xl p-4">
                    <div className="text-xs uppercase opacity-50 mb-1">Category</div>
                    <div className="text-lg font-semibold">{sku.category || '—'}</div>
                  </div>
                  {sku.createdDate && (
                    <div className="border border-white/10 rounded-xl p-4">
                      <div className="text-xs uppercase opacity-50 mb-1">Created</div>
                      <div className="text-sm">{new Date(sku.createdDate).toLocaleDateString()}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>


          <div className="flex-1">
            <div className="card bg-base-100/30 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl">
              <div className="card-body p-8">
                <h2 className="text-2xl font-bold mb-2">Edit Description</h2>
                <p className="text-sm opacity-70 mb-6">Update the technical details for this SKU</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">SKU Description</span>
                    </label>
                    <textarea
                      rows="5"
                      className={`textarea textarea-lg bg-base-200/40 border border-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-xl transition-all duration-300 ${errors.skuDescription ? 'border-error ring-2 ring-error/20' : ''}`}
                      placeholder="Enter detailed description..."
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        if (errors.skuDescription) setErrors({});
                      }}
                    />
                    {errors.skuDescription && (
                      <p className="text-error text-xs mt-1 ml-2 animate-shake">{errors.skuDescription}</p>
                    )}
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button type="submit" className="btn btn-primary flex-1">
                      Update SKU
                    </button>
                    <button type="button" className="btn btn-outline flex-1" onClick={handleCancel}>
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

export default SKUEdit;