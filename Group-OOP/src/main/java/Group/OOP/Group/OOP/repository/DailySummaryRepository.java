package Group.OOP.Group.OOP.repository;

import Group.OOP.Group.OOP.entity.DailySummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

public interface DailySummaryRepository extends JpaRepository<DailySummary, Integer>{
    // tìm danh sách hoạt động của user theo ngày
    @Query("select d from DailySummary d where d.userId = :userId and d.date = :date")
    public DailySummary getDailySummaryByIdAndDate(Integer userId , LocalDate date);

    @Query("SELECT d FROM DailySummary d " +
            "WHERE d.userId = :userId " +
            "AND MONTH(d.date) = :month " )
    public List<DailySummary> findByUserIdAndMonth(
            Integer userId, Integer month
    );

    DailySummary findFirstByUserIdAndDate(Integer userId , LocalDate date);
}
