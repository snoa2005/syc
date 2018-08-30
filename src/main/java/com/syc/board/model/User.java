package com.syc.board.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

/**
 * Created by sandy.noa on 6/7/2018.
 */
@Document(collection = "users")
public class User {

    @Id
    private String id;
    private String email;
    private String user;
    private String password;
    private String url;
    private Date signUpDate;
    private Date startDate;
    private Date endDate;
    private String language;

    public User() {}

    public User(String email, String user, String password, String url, Date signUpDate,
                Date startDate, Date endDate, String language) {
        this.email = email;
        this.user = user;
        this.password = password;
        this.url = url;
        this.signUpDate = signUpDate;
        this.startDate = startDate;
        this.endDate = endDate;
        this.language = language;
    }

    public String getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Date getSignUpDate() {
        return signUpDate;
    }

    public void setSignUpDate(Date signUpDate) {
        this.signUpDate = signUpDate;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }
}
