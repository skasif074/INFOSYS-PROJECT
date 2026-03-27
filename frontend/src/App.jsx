import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';

// Component Imports
import LoginPage from './Components/LoginComponent/LoginPage';
import RegisterUser from './Components/LoginComponent/RegisterUser';
import AdminMenu from './Components/LoginComponent/AdminMenu';
import ManagerMenu from './Components/LoginComponent/ManagerMenu';
import VendorMenu from './Components/LoginComponent/VendorMenu';
import SKUEntry from './Components/SKUComponent/SKUEntry';
import SKUReport from './Components/SKUComponent/SKUReport';
import ProductEntry from './Components/ProductComponent/ProductEntry';
import ProductReport from './Components/ProductComponent/ProductReport';
import ProductPriceEdit from './Components/ProductComponent/ProductPriceEdit';
import TransactionEntry from './Components/TransactionComponent/TransactionEntry';
import TransactionList from './Components/TransactionComponent/TransactionList';
import SKUEdit from './Components/SKUComponent/SKUEdit';
import ProductStockEdit from './Components/ProductComponent/ProductStockEdit';
import ProductPieAnalysis from './Components/AnalysisComponent/ProductPieAnalysis';
import OutTransactionForm from './Components/TransactionComponent/OutTransactionForm';

const allThemes = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave",
  "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua",
  "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk",
  "autumn", "business", "acid", "lemonade", "night", "coffee", "winter", "dim",
  "nord", "sunset"
];

function App() {
  const [theme, setTheme] = useState("night");

  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme && allThemes.includes(savedTheme)) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', "night");
    }
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('app-theme', newTheme);
  };

  return (
    <div className="App min-h-screen bg-base-300 transition-colors duration-300">
      
      {/* FIXED: Added 'no-print' class so the theme selector disappears when generating PDF */}
      <div className="fixed top-4 right-4 z-[1000] no-print">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-sm btn-ghost bg-base-100/50 backdrop-blur-md shadow-md">
            Themes
          </div>
          <div tabIndex={0} className="dropdown-content mt-2 w-48 max-h-60 overflow-y-auto bg-base-200 rounded-lg shadow-lg p-2 border border-white/10">
            {allThemes.map((t) => (
              <button
                key={t}
                onClick={() => handleThemeChange(t)}
                className={`block w-full text-left px-3 py-2 rounded capitalize text-sm mb-1 ${
                  theme === t ? "bg-primary text-primary-content" : "hover:bg-base-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/admin-menu" element={<AdminMenu />} />
          <Route path="/manager-menu" element={<ManagerMenu />} />
          <Route path="/vendor-menu" element={<VendorMenu />} />
          <Route path="/sku-entry" element={<SKUEntry />} />
          <Route path="/sku-list" element={<SKUReport />} />
          <Route path="/update-sku/:skuno" element={<SKUEdit />} />
          <Route path="/product-entry" element={<ProductEntry />} />
          <Route path="/product-list" element={<ProductReport />} />
          <Route path="/edit-price/:pid" element={<ProductPriceEdit />} />
          <Route path="/edit-stock/:pid/:no" element={<ProductStockEdit />} />
          <Route path="/add-transaction" element={<TransactionEntry />} />
          
          {/* 
             The ':pid?' allows for:
             - /transaction-list (Default/All)
             - /transaction-list/IN (Purchase)
             - /transaction-list/OUT (Issue)
             - /transaction-list/ALL (Combined Audit)
          */}
          <Route path="/transaction-list/:pid?" element={<TransactionList />} />
          
          <Route path="/product-pie" element={<ProductPieAnalysis />} />
          <Route path="/transactions/out" element={<OutTransactionForm />} />
          
          {/* Catch-all for better UX */}
          <Route path="*" element={
            <div className="min-h-screen flex flex-col items-center justify-center p-20 text-center">
              <h1 className="text-9xl font-bold opacity-20">404</h1>
              <p className="text-xl mt-4">The page you are looking for does not exist.</p>
              <button onClick={() => window.location.href='/'} className="btn btn-primary mt-8">Back to Home</button>
            </div>
          } />
        </Routes>
      </BrowserRouter>

      {/* GLOBAL PRINT STYLES: Ensures every PDF generated across the app is clean */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background-color: white !important;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}

export default App;