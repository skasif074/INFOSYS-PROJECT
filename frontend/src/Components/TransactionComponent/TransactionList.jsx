import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { findTransactionsByType } from '../../Services/TransactionService';
import { getRole, getUserId } from '../../Services/LoginService';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [role, setRole] = useState("");
  const [flag, setFlag] = useState("");
  const [loading, setLoading] = useState(true);
  const [reloadFlag, setReloadFlag] = useState(false);


  const [stats, setStats] = useState({ totalIn: 0, totalOut: 0 });

  const navigate = useNavigate();
  const param = useParams();
  const location = useLocation();

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    if (location.state?.reload) {
      setReloadFlag(prev => !prev);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const roleRes = await getRole();
        const userRole = roleRes.data;
        setRole(userRole);

        const userRes = await getUserId();
        const currentUserId = userRes.data;

        const [resIn, resOut] = await Promise.all([
          findTransactionsByType("IN"),
          findTransactionsByType("OUT")
        ]);

        let allIn = resIn.data || [];
        let allOut = resOut.data || [];


        if (userRole === "Vendor") {
          allIn = allIn.filter(t => String(t.userId) === String(currentUserId));
          allOut = allOut.filter(t => String(t.userId) === String(currentUserId));
        }

        const tIn = allIn.reduce((sum, t) => sum + parseFloat(t.transactionValue || 0), 0);
        const tOut = allOut.reduce((sum, t) => sum + parseFloat(t.transactionValue || 0), 0);
        setStats({ totalIn: tIn, totalOut: tOut });


        let displayData = [];
        if (param.pid === "ALL") {
          displayData = [...allIn, ...allOut];
          setFlag("Combined Audit");
        } else if (param.pid === "OUT") {
          displayData = allOut;
          setFlag("OUT");
        } else {
          displayData = allIn;
          setFlag("IN");
        }

        displayData.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));
        setTransactions(displayData);
      } catch (error) {
        console.error("Failed to load transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [param.pid, reloadFlag]);

  const returnBack = () => {
    if (!role) {
      navigate(-1);
      return;
    }
    const cleanRole = role.toLowerCase().trim();
    if (cleanRole === "admin") navigate('/admin-menu');
    else if (cleanRole === "manager") navigate('/manager-menu');
    else if (cleanRole === "vendor") navigate('/vendor-menu');
    else navigate('/');
  };


  const balance = stats.totalIn - stats.totalOut;
  const netBalance = (balance < 0 ? 0 : balance).toFixed(2);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative pt-16 flex items-center justify-center">
      <div className="fixed inset-0 bg-gradient-to-br from-base-300 via-base-200 to-base-300 -z-10 no-print"></div>
      
      <div className="container mx-auto px-4 py-4 relative z-10 w-full">
        <div className="card bg-base-100/30 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl print-container">
          <div className="card-body p-6">
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="print-header-text">
                <h1 className="text-2xl md:text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent print-black">
                  {flag === "Combined Audit" ? "Full Inventory Audit Report" : 
                   flag === "IN" ? "Stock Purchase Ledger" : "Stock Issue Ledger"}
                </h1>
                <p className="text-sm opacity-70 mt-1 print-black">
                  Generated on: {new Date().toLocaleDateString()} | System: SmartShelfX
                </p>
              </div>
              
              <div className="flex gap-2 no-print">
                <button onClick={handlePrint} className="btn btn-secondary btn-sm shadow-lg">
                  Print PDF
                </button>
                <button onClick={returnBack} className="btn btn-outline btn-sm">
                  Back
                </button>
              </div>
            </div>

            <div className="overflow-x-auto print-overflow-visible">
              <table className="table w-full border-separate border-spacing-y-2 print-table">
                <thead>
                  <tr className="text-base-content/60 print-black">
                    {param.pid === "ALL" && <th>Type</th>}
                    <th>ID</th>
                    <th>Product</th>
                    <th>Rate</th>
                    <th>Qty</th>
                    <th>Value</th>
                    <th>Operator</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((t) => (
                      <tr key={t.transactionId} className="bg-base-200/50 print-bg-white border-none">
                        {param.pid === "ALL" && (
                          <td>
                            <span className={`badge badge-sm font-bold ${t.transactionType === 'IN' ? 'badge-success' : 'badge-error'}`}>
                              {t.transactionType}
                            </span>
                          </td>
                        )}
                        <td className="font-mono font-bold text-primary print-black">#{t.transactionId}</td>
                        <td className="print-black">{t.productId}</td>
                        <td className="print-black">₹{t.rate}</td>
                        <td>
                          <span className={`font-bold ${t.transactionType === "IN" ? "text-success" : "text-error"}`}>
                            {t.transactionType === "IN" ? "+" : "-"}{t.quantity}
                          </span>
                        </td>
                        <td className="font-bold print-black">₹{t.transactionValue}</td>
                        <td className="text-xs opacity-70 print-black">{t.userId}</td>
                        <td className="text-xs opacity-70 print-black">{t.transactionDate}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={param.pid === "ALL" ? 8 : 7} className="text-center py-10 opacity-50">
                        No transactions found for your account.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-10 p-6 bg-base-300/50 rounded-2xl border border-white/5 print-footer-box">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                <div className="print-footer-item">
                  <p className="text-xs uppercase tracking-widest opacity-60 mb-1 print-black">Total Purchases (IN)</p>
                  <p className="text-3xl font-black text-success print-black">₹{stats.totalIn.toFixed(2)}</p>
                </div>
                <div className="print-footer-item">
                  <p className="text-xs uppercase tracking-widest opacity-60 mb-1 print-black">Total Issued (OUT)</p>
                  <p className="text-3xl font-black text-error print-black">₹{stats.totalOut.toFixed(2)}</p>
                </div>
                <div className="print-footer-item border-t md:border-t-0 md:border-l border-white/10 md:pl-8 pt-4 md:pt-0">
                  <p className="text-xs uppercase tracking-widest opacity-60 mb-1 print-black">Net Inventory Value</p>
                  <p className="text-3xl font-black text-primary print-black">₹{netBalance}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print, .btn, .fixed, .navbar { display: none !important; }
          @page { size: A4 landscape; margin: 10mm; }
          body { background: white !important; padding: 0 !important; }
          .print-container {
            background: white !important;
            border: none !important;
            box-shadow: none !important;
            backdrop-filter: none !important;
            width: 100% !important;
            display: block !important;
          }
          .print-black { 
            color: black !important; 
            background: none !important; 
            -webkit-text-fill-color: black !important;
            opacity: 1 !important;
          }
          .print-overflow-visible { overflow: visible !important; }
          .print-table { 
            width: 100% !important; 
            border-collapse: collapse !important; 
            table-layout: auto !important;
          }
          .print-table th, .print-table td {
            border-bottom: 1px solid #eee !important;
            padding: 12px 8px !important;
            color: black !important;
            font-size: 10pt !important;
          }
          .print-bg-white { background: white !important; }
          .print-footer-box {
            background: #f9f9f9 !important;
            border: 1px solid #ddd !important;
            margin-top: 20px !important;
            display: block !important;
          }
          .print-footer-item { display: inline-block !important; width: 30% !important; }
          .text-success { color: #16a34a !important; }
          .text-error { color: #dc2626 !important; }
        }
      `}</style>
    </div>
  );
};

export default TransactionList;