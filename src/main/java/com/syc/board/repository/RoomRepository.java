package com.syc.board.repository;

import com.syc.board.model.Room;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Created by sandy.noa on 6/7/2018.
 */
public interface RoomRepository extends MongoRepository<Room, String> {

}
