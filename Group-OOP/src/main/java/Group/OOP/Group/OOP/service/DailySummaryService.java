package Group.OOP.Group.OOP.service;

import Group.OOP.Group.OOP.entity.DailySummary;
import Group.OOP.Group.OOP.repository.DailySummaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Date;

@Service
public class DailySummaryService {
    @Autowired
    private DailySummaryRepository dailySummaryRepository;

    public DailySummary updateOrCreateDailySummary(DailySummary newData) {
        return dailySummaryRepository.save(newData);
    }

    // lấy của 1 người trong 1 ngày
    public DailySummary findFirstByUserIdAndDate(Integer userId , LocalDate date) {
        return dailySummaryRepository.findFirstByUserIdAndDate(userId, date);
    }
}