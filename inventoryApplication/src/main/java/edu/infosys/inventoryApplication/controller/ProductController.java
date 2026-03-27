package edu.infosys.inventoryApplication.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import edu.infosys.inventoryApplication.bean.Product;
import edu.infosys.inventoryApplication.dao.ProductDao;
import edu.infosys.inventoryApplication.service.InventoryUserService;
import edu.infosys.inventoryApplication.service.ProductService;

@RestController
@RequestMapping("/invent/")
@CrossOrigin(origins = "http://localhost:3131", allowCredentials = "true")
public class ProductController {

	@Autowired
	private ProductService service;

	@Autowired
	private ProductDao productDao;

	@Autowired
	private InventoryUserService userService;

	@GetMapping("/product")
	public List<Product> displayAllProducts() {
		List<Product> productList = productDao.showAllProducts();
		return productList;
	}

	@PostMapping("/product")
	public void saveNewProduct(@RequestBody Product product) {
		Product finalProduct = service.setSalesPrice(product);
		productDao.saveProduct(finalProduct);
	}

	@GetMapping("/product/{id}")
	public Product getProductById(@PathVariable String id) {
		Product product = productDao.getProductById(id);
		return product;
	}

	@DeleteMapping("/product/{id}")
	public void deleteProduct(@PathVariable String id) {
		productDao.removeProduct(id);
	}

	@PutMapping("/product/{qty}/{flag}")
	public void editProductStock(@RequestBody Product product,@PathVariable double qty,@PathVariable int flag) {
		Product updatedProduct = service.stockEdit(product, qty, flag);
		productDao.saveProduct(updatedProduct);
	}

	@PutMapping("/product")
	public void editProductPrice(@RequestBody Product product) {
		Product updatedProduct = service.setSalesPrice(product);
		productDao.saveProduct(updatedProduct);
	}
	
    @GetMapping("/id-gen")
    public String productIdGenerator() {
        return service.generateProductId();
    }

    @GetMapping("/vendor")
    public List<Product> getProductByVendor() {
        String vendorId = userService.getUserId();
        return productDao.getProductByVendor(vendorId);
    }

    @GetMapping("/vendor/{id}")
    public List<Product> getProductByVendor(@PathVariable String id) {
        return productDao.getProductByVendor(id);
    }
}