package com.syc.board.repository;

import com.syc.board.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

/**
 * Created by sandy.noa on 6/7/2018.
 */
public interface UserRepository extends MongoRepository<User, String> {

    User findByEmailAndUser(String email, String user);

}
