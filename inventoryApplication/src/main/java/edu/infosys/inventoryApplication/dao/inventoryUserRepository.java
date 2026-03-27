package edu.infosys.inventoryApplication.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import edu.infosys.inventoryApplication.bean.inventoryUser;

public interface inventoryUserRepository extends JpaRepository<inventoryUser, String> {

    @Query("Select username from inventoryUser where role=?1")
    public List<String> getUsersByRole(String role);

}