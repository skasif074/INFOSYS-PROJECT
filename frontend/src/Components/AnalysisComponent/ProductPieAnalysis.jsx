import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProductWiseTotalSale } from "../../Services/TransactionService";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ProductPieAnalysis = () => {
  let navigate = useNavigate();
  const [productSale, setProductSale] = useState([]);

  const setProductSaleData = () => {
    getProductWiseTotalSale()
      .then((response) => {
        setProductSale(response.data);
      })
      .catch((error) => {
        alert("Error Ocurred while loading data:" + error);
      });
  };

  useEffect(() => {
    setProductSaleData();
  }, []);

  const chartData = {
    labels: productSale.map((p) => p.productName),
    datasets: [
      {
        data: productSale.map((p) => p.totalSaleValue),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  const returnBack = () => {
    navigate("/admin-menu");
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h3 className="text-2xl font-bold mb-4">
        Product Sale Dashboard
      </h3>

      <div align="left">
        <table className="w-full border mb-6">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">
                Product Name
              </th>
              <th className="border px-4 py-2">
                Sales Amount
              </th>
            </tr>
          </thead>

          <tbody>
            {productSale.map((p, i) => (
              <tr key={i} className="text-center">
                <td className="border px-4 py-2">
                  {p.productName}
                </td>
                <td className="border px-4 py-2">
                  {Number(p.totalSaleValue).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <div style={{ width: "80%", maxWidth: "300px" }}>
          <h5>Total Sale per Product</h5>
          <Pie data={chartData} />
        </div>
      </div>

      <button
        style={{ marginLeft: "10px" }}
        onClick={() => returnBack()}
        className="btn btn-success"
      >
        Return
      </button>
    </div>
  );
};

export default ProductPieAnalysis;