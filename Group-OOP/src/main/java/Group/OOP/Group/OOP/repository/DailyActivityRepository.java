package Group.OOP.Group.OOP.repository;

import Group.OOP.Group.OOP.entity.DailyActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

public interface  DailyActivityRepository extends JpaRepository<DailyActivity, Integer>  {
    @Query("select d from DailyActivity d where d.userId = :userId")
    public List<DailyActivity> getDailyActivitiesById(Integer userId);

    // tìm danh sách hoạt động của user theo ngày
    @Query("select d from DailyActivity d where d.userId = :userId and d.date = :date")
    public List<DailyActivity> getDailyActivitiesByIdAndDate(Integer userId , LocalDate date);

}
