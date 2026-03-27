import React from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../Services/LoginService";

const VendorMenu = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser().then(() => {
      localStorage.clear();
      sessionStorage.clear();
      navigate("/");
    });
  };

  return (
    <div className="min-h-screen w-full relative pt-16">
      <div className="fixed inset-0 bg-gradient-to-br from-base-300 via-base-200 to-base-300 -z-10"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-secondary/5 animate-gradient-shift -z-10"></div>
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-float-slow -z-10"></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] animate-float-slower -z-10"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <nav className="navbar bg-base-100/30 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl mb-8 px-6 py-2 relative z-20">
          <div className="navbar-start">
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                </svg>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[100] p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                  <details>
                    <summary>SKU</summary>
                    <ul>
                      <li><a onClick={() => navigate("/sku-list")}>SKU List</a></li>
                    </ul>
                  </details>
                </li>
                <li>
                  <details>
                    <summary>Product</summary>
                    <ul>
                      <li><a onClick={() => navigate("/product-list")}>Product List</a></li>
                    </ul>
                  </details>
                </li>
                <li>
                  <details>
                    <summary>Transactions</summary>
                    <ul>
                      <li><a onClick={() => navigate("/add-transaction")}>Add Transaction</a></li>
                      <li><a onClick={() => navigate("/transaction-list")}>Transaction History</a></li>
                    </ul>
                  </details>
                </li>
              </ul>
            </div>
            <a className="btn btn-ghost text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SmartShelfX Vendor
            </a>
          </div>

          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 gap-12">
              <li tabIndex={0} className="mx-1">
                <details>
                  <summary className="px-4">SKU</summary>
                  <ul className="p-2 bg-base-100/80 backdrop-blur-md z-[100]">
                    <li><a onClick={() => navigate("/sku-list")}>SKU List</a></li>
                  </ul>
                </details>
              </li>
              <li tabIndex={0} className="mx-1">
                <details>
                  <summary className="px-4">Product</summary>
                  <ul className="p-2 bg-base-100/80 backdrop-blur-md z-[100]">
                    <li><a onClick={() => navigate("/product-list")}>Product List</a></li>
                  </ul>
                </details>
              </li>
              <li tabIndex={0} className="mx-1">
                <details>
                  <summary className="px-4">Transactions</summary>
                  <ul className="p-2 bg-base-100/80 backdrop-blur-md z-[100]">
                    <li><a onClick={() => navigate("/add-transaction")}>Add Transaction</a></li>
                    <li><a onClick={() => navigate("/transaction-list")}>Transaction History</a></li>
                  </ul>
                </details>
              </li>
            </ul>
          </div>

          <div className="navbar-end">
            <button onClick={handleLogout} className="btn btn-outline btn-error btn-sm gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </nav>

        <div className="hero min-h-[300px] rounded-3xl bg-base-100/30 backdrop-blur-2xl border border-white/10 shadow-2xl p-8 mb-12">
          <div className="hero-content text-center">
            <div>
              <h1 className="text-5xl font-bold">Welcome, <span className="text-primary">Vendor</span> 👋</h1>
              <p className="py-6 text-lg opacity-80 max-w-2xl mx-auto">
                Manage your inventory, track sales, and process transactions seamlessly with SmartShelfX.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-base-100/20 backdrop-blur-md border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer" onClick={() => navigate("/sku-list")}>
            <div className="card-body items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl mb-2">📦</div>
              <h2 className="card-title">View SKUs</h2>
              <p>Browse available stock keeping units.</p>
            </div>
          </div>
          <div className="card bg-base-100/20 backdrop-blur-md border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer" onClick={() => navigate("/product-list")}>
            <div className="card-body items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl mb-2">🏷️</div>
              <h2 className="card-title">Products</h2>
              <p>Check product details and availability.</p>
            </div>
          </div>
          <div className="card bg-base-100/20 backdrop-blur-md border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer" onClick={() => navigate("/add-transaction")}>
            <div className="card-body items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl mb-2">💰</div>
              <h2 className="card-title">Record Sale</h2>
              <p>Log outgoing transactions and update stock.</p>
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

export default VendorMenu;