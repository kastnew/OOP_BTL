package Group.OOP.Group.OOP.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "Users")
@Data // tự động sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor // constructor không tham số (bắt buộc cho JPA)
@AllArgsConstructor // constructor đầy đủ tất cả field
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "User_ID")
    private Integer id;

    @Column(name = "First_Name", length = 50)
    private String firstName;

    @Column(name = "Last_Name", length = 50)
    private String lastName;

    @Column(name = "Age")
    private Integer age;

    @Column(name = "Gender", length = 20)
    private String gender;

    public User(String firstName , String lastName , Integer age ,
                String gender)
    {
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.gender = gender;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }


}
