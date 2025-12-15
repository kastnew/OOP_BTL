package Group.OOP.Group.OOP.entity;

import jakarta.persistence.*;
import lombok.Data ;
import lombok.NoArgsConstructor ;
import lombok.AllArgsConstructor ;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "Daily_Activity")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class DailyActivity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Activity_ID")
    private Integer activityId;

    @Column(name = "User_ID")
    private Integer userId;

    @Column(name = "Activity_Name" , length = 100)
    private String activityName ;

    @Column(name = "Start_Time")
    private Date startTime ;

    @Column(name = "End_Time")
    private Date endTime ;

    @Column(name = "Calories_Burned")
    private Float caloriesBurned ;

    @Column(name = "Activity_Date")
    private LocalDate date ;

    public void updateFrom(DailyActivity other) {
        this.userId = other.getUserId();
        this.activityName = other.getActivityName();
        this.startTime = other.getStartTime();
        this.endTime = other.getEndTime();
        this.caloriesBurned = other.getCaloriesBurned();
        this.date = other.getDate();
    }

    public Integer getActivityId() {
        return activityId;
    }

    public void setActivityId(Integer activityId) {
        this.activityId = activityId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setId(Integer userId) {
        this.userId = userId;
    }

    public String getActicityName() {
        return activityName;
    }

    public void setActicityName(String acticityName) {
        this.activityName = acticityName;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public Float getCaloriesBurned() {
        return caloriesBurned;
    }

    public void setCaloriesBurned(Float caloriesBurned) {
        this.caloriesBurned = caloriesBurned;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

}
