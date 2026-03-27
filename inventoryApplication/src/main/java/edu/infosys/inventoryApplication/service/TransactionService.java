package edu.infosys.inventoryApplication.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.infosys.inventoryApplication.bean.ProductSale;
import edu.infosys.inventoryApplication.dao.TransactionDao;

@Service
public class TransactionService {

    @Autowired
    private TransactionDao transactionDao;

    /**
     * Generates a unique Transaction ID based on type.
     * flag 1 = IN, flag 2 = OUT
     */
    public String generateId(int flag) {
        String type = (flag == 1) ? "IN" : "OUT";
        String prefix = (flag == 1) ? "IN" : "OT";
        
        // Fetches max ID from DB (e.g., "IN100001")
        String id = transactionDao.findMaxTransactionIdByType(type);

        if (id == null) {
            // Default starting IDs if no records exist
            return prefix + "100001";
        } else {
            // Extract numeric part, increment, and re-attach prefix
            try {
                // substring(2) removes "IN" or "OT"
                int numericPart = Integer.parseInt(id.substring(2));
                numericPart++;
                return prefix + numericPart;
            } catch (Exception e) {
                // Fallback in case of parsing errors
                return prefix + "100001";
            }
        }
    }

    public List<ProductSale> getProductWiseTotalSale() {
        List<ProductSale> salesList = transactionDao.getProductWiseTotalSale();
        HashMap<String, ProductSale> salesMap = new HashMap<String, ProductSale>();

        for (ProductSale prod : salesList) {
            if (salesMap.containsKey(prod.getProductName())) {
                Double val = salesMap.get(prod.getProductName()).getTotalSaleValue();
                val = val + prod.getTotalSaleValue();
                prod.setTotalSaleValue(val);
                salesMap.put(prod.getProductName(), prod);
            } else {
                salesMap.put(prod.getProductName(), prod);
            }
        }

        List<ProductSale> newList = new ArrayList<ProductSale>();
        salesMap.forEach((k, v) -> newList.add(v));
        return newList;
    }
}