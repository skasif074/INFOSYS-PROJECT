package edu.infosys.inventoryApplication.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import edu.infosys.inventoryApplication.bean.Product;

public interface ProductRepository extends JpaRepository<Product, String> {

    @Query("SELECT MAX(p.productId) FROM Product p")
    public String getMaxProductId();

    @Query("SELECT p.reorderLevel FROM Product p WHERE p.productId = ?1")
    public Double getReorderLevelByProductId(String id);

    @Query("SELECT p FROM Product p WHERE p.vendorId = ?1")
    public List<Product> getProductByVendor(String vendorId);
}