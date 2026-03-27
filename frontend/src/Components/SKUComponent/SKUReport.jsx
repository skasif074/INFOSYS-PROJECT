import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAllSKUs, deleteSKUById } from "../../Services/SKUService";
import { getRole } from '../../Services/LoginService';

const SKUReport = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [skuList, setSkuList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const roleRes = await getRole();
        setRole(roleRes.data);
        const skuRes = await getAllSKUs();
        setSkuList(skuRes.data);
        setFilteredList(skuRes.data);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredList(skuList);
    } else {
      const lowerTerm = searchTerm.toLowerCase();
      const filtered = skuList.filter(sku =>
        sku.skuId?.toLowerCase().includes(lowerTerm) ||
        sku.category?.toLowerCase().includes(lowerTerm) ||
        sku.skuDescription?.toLowerCase().includes(lowerTerm)
      );
      setFilteredList(filtered);
    }
  }, [searchTerm, skuList]);

  const handleReturn = () => {
    if (role === 'Admin') navigate('/admin-menu');
    else if (role === 'Manager') navigate('/manager-menu');
    else navigate('/');
  };

  const handleDelete = async (id) => {
    try {
      await deleteSKUById(id);
      // Update local lists after deletion
      const updatedList = skuList.filter(sku => sku.skuId !== id);
      setSkuList(updatedList);
      setFilteredList(updatedList);
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete SKU. Please try again.");
    }
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
      {/* Fixed Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-base-300 via-base-200 to-base-300 -z-10"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-secondary/5 animate-gradient-shift -z-10"></div>
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-float-slow -z-10"></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] animate-float-slower -z-10"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="card bg-base-100/30 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl">
          <div className="card-body p-6 md:p-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {role === 'Admin' ? 'Admin SKU Registry' : 'Manager SKU Registry'}
                </h1>
                <p className="text-sm opacity-70 mt-1">Manage and monitor Stock Keeping Units</p>
              </div>
              <button
                onClick={handleReturn}
                className="btn btn-outline btn-sm gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Return to Menu
              </button>
            </div>

            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by SKU ID, Category, or Description..."
                  className="input input-bordered w-full bg-base-200/40 border-white/10 focus:border-primary/50 pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-sm font-semibold">#</th>
                    <th className="text-sm font-semibold">SKU ID</th>
                    <th className="text-sm font-semibold">Category</th>
                    <th className="text-sm font-semibold">Description</th>
                    {role === 'Admin' && <th className="text-sm font-semibold text-center">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredList.length > 0 ? (
                    filteredList.map((sku, index) => (
                      <tr key={sku.skuId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="text-sm opacity-60">{index + 1}</td>
                        <td className="font-mono text-sm font-bold text-info">{sku.skuId}</td>
                        <td>
                          <span className="badge badge-outline badge-sm">{sku.category}</span>
                        </td>
                        <td className="text-sm max-w-xs truncate">{sku.skuDescription}</td>
                        {role === 'Admin' && (
                          <td className="text-center">
                            <div className="flex justify-center gap-2">
                              <Link to={`/update-sku/${sku.skuId}`}>
                                <button className="btn btn-xs btn-ghost btn-square text-info" title="Edit">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                              </Link>
                              <button
                                onClick={() => setDeleteConfirm(sku.skuId)}
                                className="btn btn-xs btn-ghost btn-square text-error"
                                title="Delete"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={role === 'Admin' ? "5" : "4"} className="text-center py-8 text-base-content/60">
                        No SKU records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>


            <div className="mt-6 block md:hidden">
              <button onClick={handleReturn} className="btn btn-outline w-full">
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card bg-base-200/90 backdrop-blur-xl border border-white/20 rounded-2xl max-w-md w-full shadow-2xl">
            <div className="card-body">
              <h3 className="card-title text-lg">Confirm Delete</h3>
              <p className="text-sm opacity-80">
                Are you sure you want to delete SKU <strong>{deleteConfirm}</strong>? This action cannot be undone.
              </p>
              <div className="card-actions justify-end mt-4 gap-2">
                <button className="btn btn-ghost btn-sm" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                <button className="btn btn-error btn-sm" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

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

export default SKUReport;