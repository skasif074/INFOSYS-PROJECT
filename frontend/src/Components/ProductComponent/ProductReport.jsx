import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { displayAllProducts, deleteAProduct, getProductByVendor } from '../../Services/ProductService';
import { getRole, getUserId } from '../../Services/LoginService';

const ProductReport = () => {
  const [products, setProducts] = useState([]);
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Identify who is logged in
        const roleRes = await getRole();
        const userRole = roleRes.data;
        setRole(userRole);

        const userRes = await getUserId();
        const currentUserId = userRes.data;

        // 2. The Logic Fork
        let productRes;
        const cleanRole = userRole.toLowerCase().trim();

        if (cleanRole === "admin" || cleanRole === "manager") {

          productRes = await displayAllProducts();
        } else {
          productRes = await getProductByVendor(currentUserId);
        }

        setProducts(productRes.data);
      } catch (error) {
        console.error("Failed to load products:", error);
      }
    };
    loadData();
  }, []);

  const removeProduct = async (id) => {
    try {
      await deleteAProduct(id);
      setProducts(products.filter(p => p.productId !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete product.");
    }
  };

  const returnBack = () => {
    const cleanRole = role.toLowerCase().trim();
    if (cleanRole === "admin") navigate('/admin-menu');
    else if (cleanRole === "manager") navigate('/manager-menu');
    else if (cleanRole === "vendor") navigate('/vendor-menu');
    else navigate('/');
  };

  // Search logic
  const filteredProducts = products.filter(p =>
    p.productName?.toLowerCase().includes(search.toLowerCase()) ||
    p.skuId?.toLowerCase().includes(search.toLowerCase()) ||
    p.vendorId?.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="min-h-screen w-full relative pt-16">
      <div className="fixed inset-0 bg-gradient-to-br from-base-300 via-base-200 to-base-300 -z-10"></div>
      
      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="card bg-base-100/30 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl">
          <div className="card-body p-6">
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {role === 'Admin' ? 'Product Administration' : 
                   role === 'Manager' ? 'Inventory Report' : 'Vendor Inventory'}
                </h1>
                <p className="text-sm opacity-70 mt-1">
                  {role === 'Vendor' ? 'Manage your assigned stock' : 'Global system inventory control'}
                </p>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="input input-bordered w-full md:w-80 bg-base-200/40 border-white/10 pl-10"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th>ID</th>
                    <th>SKU</th>
                    <th>Product Name</th>
                    <th>Vendor</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                      <tr key={product.productId} className="border-b border-white/5 hover:bg-white/5">
                        <td className="font-mono text-info text-xs">{product.productId}</td>
                        <td className="text-sm">{product.skuId}</td>
                        <td className="font-medium">{product.productName}</td>
                        <td className="text-sm opacity-70">{product.vendorId}</td>
                        <td className="text-sm">₹{product.purchasePrice}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            {product.stock}
                            {product.stock <= product.reorderLevel && (
                              <span className="badge badge-warning badge-xs">LOW</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${product.status ? 'badge-success' : 'badge-error'} badge-sm`}>
                            {product.status ? 'Permitted' : 'Reorder'}
                          </span>
                        </td>
                        <td className="text-center">
                          <div className="flex justify-center gap-2">
                            <Link to={`/edit-stock/${product.productId}/2`}>
                                <button className="btn btn-xs btn-circle btn-ghost" title="Issue OUT" disabled={!product.status}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </Link>
                            <Link to={`/edit-stock/${product.productId}/1`}>
                                <button className="btn btn-xs btn-circle btn-ghost" title="Buy IN">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                </button>
                            </Link>

                            {role === 'Admin' && (
                              <>
                                <Link to={`/edit-price/${product.productId}`}>
                                  <button className="btn btn-xs btn-ghost text-primary">Edit</button>
                                </Link>
                                <button
                                  onClick={() => setDeleteConfirm(product.productId)}
                                  className="btn btn-xs btn-ghost text-error"
                                >
                                  Del
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="8" className="text-center py-10 opacity-50">No products found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
              <button onClick={returnBack} className="btn btn-outline btn-sm">Return to Menu</button>
              
              {totalPages > 1 && (
                <div className="join">
                  <button className="join-item btn btn-sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>«</button>
                  <button className="join-item btn btn-sm">Page {currentPage}</button>
                  <button className="join-item btn btn-sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>»</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="card bg-base-200 max-w-sm w-full shadow-2xl border border-white/10">
            <div className="card-body">
              <h2 className="card-title text-error">Delete Product?</h2>
              <p className="text-sm">This will permanently remove the product from inventory.</p>
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-sm btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                <button className="btn btn-sm btn-error" onClick={() => removeProduct(deleteConfirm)}>Confirm Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductReport;