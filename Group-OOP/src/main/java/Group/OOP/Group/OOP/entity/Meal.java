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

public class Meal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Meal_ID")
    private Integer mealId ;

    @Column(name = "User_ID")
    private Integer userId ;

    @Column(name = "Dish_Name" , length = 100)
    private String dishName ;

    @Column(name = "Meal_Type" , length = 50)
    private String mealType ;

    @Column(name = "Protein")
    private Float protein ;

    @Column(name = "Fat")
    private Float fat ;

    @Column(name = "Fiber")
    private Float fiber ;

    @Column(name = "Sugar")
    private Float sugar ;

    @Column(name = "Calories")
    private Float calories ;

    @Column(name = "Meal_Date")
    private LocalDate date ;

    public Integer getMealId() {
        return mealId;
    }

    public void setMealId(Integer mealId) {
        this.mealId = mealId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getDishName() {
        return dishName;
    }

    public void setDishName(String dishName) {
        this.dishName = dishName;
    }

    public String getMealType() {
        return mealType;
    }

    public void setMealType(String mealType) {
        this.mealType = mealType;
    }

    public Float getProtein() {
        return protein;
    }

    public void setProtein(Float protein) {
        this.protein = protein;
    }

    public Float getFat() {
        return fat;
    }

    public void setFat(Float fat) {
        this.fat = fat;
    }

    public Float getFiber() {
        return fiber;
    }

    public void setFiber(Float fiber) {
        this.fiber = fiber;
    }

    public Float getSugar() {
        return sugar;
    }

    public void setSugar(Float sugar) {
        this.sugar = sugar;
    }

    public Float getCalories() {
        return calories;
    }

    public void setCalories(Float calories) {
        this.calories = calories;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public void updateFrom(Meal other) {
        if (other == null) return;

        this.userId = other.getUserId();
        this.dishName = other.getDishName();
        this.mealType = other.getMealType();
        this.protein = other.getProtein();
        this.fat = other.getFat();
        this.fiber = other.getFiber();
        this.sugar = other.getSugar();
        this.calories = other.getCalories();
        this.date = other.getDate();

        // Không cập nhật mealId vì đây là khóa chính
        // this.mealId = other.getMealId();
    }

}
