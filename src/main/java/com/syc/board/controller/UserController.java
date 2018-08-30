package com.syc.board.controller;

import com.syc.board.model.User;
import com.syc.board.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;
import java.util.Optional;

/**
 * Created by sandy.noa on 6/7/2018.
 */
@Controller
@RequestMapping("/users")
public class UserController {

    private final String GET_USERS_VIEW = "users";
    private final String GET_USER_VIEW = "user";
    private final String NEW_USER_VIEW = "new";
    private final String EDIT_USER_VIEW = "edit";

    @Autowired
    UserRepository userRepository;

    @GetMapping
    public String getUsers(Model model) {
        model.addAttribute("users", userRepository.findAll());
        return GET_USERS_VIEW;
    }

    /*@GetMapping
    public List<User> getUsers() {
        return userRepository.findAll();
    }*/

    /*
    @GetMapping
    @RequestMapping("/{id}")
    public String getUser(@PathVariable String id, Model model) {
        model.addAttribute("user", userRepository.findById(id));
        return GET_USER_VIEW;
    }

    @RequestMapping("/new")
    public String create(Model model) {
        return NEW_USER_VIEW;
    }

    @PostMapping
    public String addUser(@RequestParam String email, @RequestParam String user,
                          @RequestParam String password, @RequestParam String url,
                          @RequestParam Date signUpDate, @RequestParam Date startDate,
                          @RequestParam Date endDate, @RequestParam String language) {

        User newUser = new User(email, user, password, url, signUpDate, startDate, endDate, language);
        userRepository.save(newUser);

        return GET_USERS_VIEW + "/" + newUser.getId();
    }

    @DeleteMapping
    public String delete(@RequestParam String id) {
        Optional<User> user = userRepository.findById(id);
        userRepository.delete(user.get());

        return GET_USER_VIEW;
    }


    @RequestMapping("/{id}")
    public String edit(@PathVariable String id, Model model) {
        model.addAttribute("user", userRepository.findById(id));
        return EDIT_USER_VIEW;
    }

    @PutMapping
    public String update(@RequestParam String email, @RequestParam String user,
                         @RequestParam String password, @RequestParam String url,
                         @RequestParam Date signUpDate, @RequestParam Date startDate,
                         @RequestParam Date endDate, @RequestParam String language) {

        User updUser = new User(email, user, password, url, signUpDate, startDate, endDate, language);
        userRepository.save(updUser);

        return GET_USERS_VIEW + "/" + updUser.getId();
    }*/
}
