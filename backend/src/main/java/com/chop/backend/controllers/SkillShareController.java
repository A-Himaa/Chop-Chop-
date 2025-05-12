package com.chop.backend.controllers;

import com.chop.backend.controllers.SkillShareController;
import com.chop.backend.models.SkillShare;
import com.chop.backend.repositories.SkillShareRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/SkillShares")
public class SkillShareController {
    
    private final SkillShareRepository SkillShareRepository;
    
    @Autowired
    public SkillShareController(SkillShareRepository SkillShareRepository) {
        this.SkillShareRepository = SkillShareRepository;
    }
    
    //Retrieve all recipie posts
    @GetMapping
    public ResponseEntity<List<SkillShare>> getSkillShares() {
        List<SkillShare> SkillShares = SkillShareRepository.findAll();
        return new ResponseEntity<>(SkillShares, HttpStatus.OK);
    }
    
    //Filter by ID
    @GetMapping("/{userId}")
    public ResponseEntity<List<SkillShare>> getSkillSharesByUserId(@PathVariable String userId) {
        List<SkillShare> SkillShares = SkillShareRepository.findByUserId(userId);
        return new ResponseEntity<>(SkillShares, HttpStatus.OK);
    }
    
    //Create function
    @PostMapping
    public ResponseEntity<SkillShare> createSkillShare(@RequestBody SkillShare SkillShare) {
        SkillShare savedSkillShare = SkillShareRepository.save(SkillShare);
        return new ResponseEntity<>(savedSkillShare, HttpStatus.CREATED);
    }
    
    //Delete function
    @DeleteMapping("/{SkillShareId}")
    public ResponseEntity<Void> deleteSkillShare(@PathVariable String SkillShareId) {
        SkillShareRepository.deleteById(SkillShareId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    //Update function
    @PutMapping("/{SkillShareId}")
    public ResponseEntity<SkillShare> updateSkillShare(@PathVariable String SkillShareId, @RequestBody SkillShare updatedSkillShare) {
        // Check if the Skill Share with the given ID exists
        if (!SkillShareRepository.existsById(SkillShareId)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        
        // Set the ID of the updated Skill Share
        updatedSkillShare.setId(SkillShareId);
        
        // Update the Skill Share
        SkillShare savedSkillShare = SkillShareRepository.save(updatedSkillShare);
        
        return new ResponseEntity<>(savedSkillShare, HttpStatus.OK);
    }
}