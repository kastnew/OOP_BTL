package Group.OOP.Group.OOP.entity;

import jakarta.persistence.* ;
import lombok.Data ;
import lombok.AllArgsConstructor ;
import lombok.NoArgsConstructor ;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailySummary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Summary_ID")
    private Integer summaryId;

    @Column(name = "User_ID")
    private Integer userId;

    @Column(name = "Total_Activity_Time")
    private Float totalActivityTime;

    @Column(name = "Total_Rest_Time")
    private Float totalRestTime;

    @Column(name = "Calories_Consumed")
    private Float caloriesConsumed;

    @Column(name = "Calories_Burned")
    private Float caloriesBurned;

    @Column(name = "Total_Sugar")
    private Float totalSugar;

    @Column(name = "Total_Protein")
    private Float totalProtein;

    @Column(name = "Total_Fat")
    private Float totalFat;

    @Column(name = "Total_Fiber")
    private Float totalFiber;

    @Column(name = "Rating")
    private Float rating;

    @Column(name = "Notes", length = 255)
    private String notes;

    @Column(name = "Summary_Date")
    private LocalDate date;

    // GETTERS
    public Integer getSummaryId() {
        return summaryId;
    }

    public Integer getUserId() {
        return userId;
    }

    public Float getTotalActivityTime() {
        return totalActivityTime;
    }

    public Float getTotalRestTime() {
        return totalRestTime;
    }

    public Float getCaloriesConsumed() {
        return caloriesConsumed;
    }

    public Float getCaloriesBurned() {
        return caloriesBurned;
    }

    public Float getTotalSugar() {
        return totalSugar;
    }

    public Float getTotalProtein() {
        return totalProtein;
    }

    public Float getTotalFat() {
        return totalFat;
    }

    public Float getTotalFiber() {
        return totalFiber;
    }

    public Float getRating() {
        return rating;
    }

    public String getNotes() {
        return notes;
    }

    public LocalDate getDate() {
        return date;
    }

    // SETTERS
    public void setSummaryId(Integer summaryId) {
        this.summaryId = summaryId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public void setTotalActivityTime(Float totalActivityTime) {
        this.totalActivityTime = totalActivityTime;
    }

    public void setTotalRestTime(Float totalRestTime) {
        this.totalRestTime = totalRestTime;
    }

    public void setCaloriesConsumed(Float caloriesConsumed) {
        this.caloriesConsumed = caloriesConsumed;
    }

    public void setCaloriesBurned(Float caloriesBurned) {
        this.caloriesBurned = caloriesBurned;
    }

    public void setTotalSugar(Float totalSugar) {
        this.totalSugar = totalSugar;
    }

    public void setTotalProtein(Float totalProtein) {
        this.totalProtein = totalProtein;
    }

    public void setTotalFat(Float totalFat) {
        this.totalFat = totalFat;
    }

    public void setTotalFiber(Float totalFiber) {
        this.totalFiber = totalFiber;
    }

    public void setRating(Float rating) {
        this.rating = rating;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }
}
