package com.syc.board.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Created by sandy.noa on 6/7/2018.
 */
@Document(collection = "rooms")
public class Room {

    @Id
    private String id;
    private String url;
    private String members;

    public Room() {}

    public Room(String url, String members) {
        this.url = url;
        this.members = members;
    }

    public String getId() {
        return id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getMembers() {
        return members;
    }

    public void setMembers(String members) {
        this.members = members;
    }
}
