package Group.OOP.Group.OOP.repository;

import Group.OOP.Group.OOP.entity.Meal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
public interface MealRepository extends JpaRepository<Meal, Integer> {
    @Query("select m from Meal m where m.userId = :userId")
    public List<Meal> getMealByUserId(Integer userId);

    // tìm danh sách hoạt động của user theo ngày
    @Query("select m from Meal m where m.userId = :userId and m.date = :date")
    public List<Meal> getMealsByIdAndDate(Integer userId , LocalDate date);
}
