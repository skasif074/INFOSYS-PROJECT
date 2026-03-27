package edu.infosys.inventoryApplication.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import edu.infosys.inventoryApplication.bean.ProductSale;
import edu.infosys.inventoryApplication.bean.Transaction;

@Repository
public class TransactionDaoImpl implements TransactionDao {

    @Autowired
    private TransactionRepository repository;

    @Override
    public void saveTransaction(Transaction transaction) {
        repository.save(transaction);
    }

    @Override
    public Transaction findTransactionById(String id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public String findMaxTransactionIdByType(String type) {
        return repository.findMaxTransactionIdByType(type);
    }

    @Override
    public List<Transaction> findTransactionsByType(String type) {
        return repository.findTransactionsByType(type);
    }

    @Override
    public void removeTransactionById(String id) {
        repository.deleteById(id);
    }
    
    @Override
    public List<Double> getDemandByProduct(String productId) {
        return repository.getDemandByProduct(productId);
    }

    @Override
    public List<ProductSale> getProductWiseTotalSale() {
        return repository.getProductWiseTotalSale();
    }

}