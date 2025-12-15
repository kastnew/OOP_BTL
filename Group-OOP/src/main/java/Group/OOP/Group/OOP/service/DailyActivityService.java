package Group.OOP.Group.OOP.service;

import Group.OOP.Group.OOP.entity.DailySummary;
import Group.OOP.Group.OOP.entity.DailyActivity;
import Group.OOP.Group.OOP.repository.DailyActivityRepository;
import Group.OOP.Group.OOP.repository.DailySummaryRepository;
import Group.OOP.Group.OOP.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class DailyActivityService {
    @Autowired
    private DailyActivityRepository dailyActivityRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DailySummaryService dailySummaryService;

    @Autowired
    private DailySummaryRepository dailySummaryRepository;

    @Autowired
    private CalculateCaloValueService calculateCaloValueService;


    // them hoat dong
    public DailyActivity createDailyActivity(DailyActivity newDailyActivity) {
        dailyActivityRepository.save(newDailyActivity);

        DailySummary dailySummary = dailySummaryRepository.getDailySummaryByIdAndDate(newDailyActivity.getUserId(), newDailyActivity.getDate());
        if(dailySummary == null) {
            dailySummary = new DailySummary();
            dailySummary.setDate(newDailyActivity.getDate());
            dailySummary.setUserId(newDailyActivity.getUserId());
        }

        float total = calculateCaloValueService.getTotalByDay(newDailyActivity.getUserId() , newDailyActivity.getDate());
        dailySummary.setCaloriesBurned(total);
        dailySummaryRepository.save(dailySummary);
        return newDailyActivity;
    }

    // lấy danh sách hoạt động của 1 người 1 ngày
    public List<DailyActivity> ListDailyActivity(Integer userId) {
        return dailyActivityRepository.getDailyActivitiesById(userId);
    }

    // update hoạt động
    public DailyActivity updateDailyActivity(DailyActivity newDailyActivity) {
        dailyActivityRepository.save(newDailyActivity);

        DailySummary dailySummary = dailySummaryRepository.getDailySummaryByIdAndDate(newDailyActivity.getUserId(), newDailyActivity.getDate());
        if(dailySummary == null) {
            dailySummary = new DailySummary();
            dailySummary.setDate(newDailyActivity.getDate());
            dailySummary.setUserId(newDailyActivity.getUserId());
        }
        float total = calculateCaloValueService.getTotalByDay(newDailyActivity.getUserId() , newDailyActivity.getDate());
        dailySummary.setCaloriesBurned(total);
        dailySummaryRepository.save(dailySummary);
        return newDailyActivity;
    }

    // xoá hoạt động
    public void deleteDailyActivity(Integer activityId) {

        Optional<DailyActivity> tmp = dailyActivityRepository.findById(activityId);
        DailyActivity dailyActivity = tmp.get() ;

        Integer userId = dailyActivity.getUserId();
        LocalDate date = dailyActivity.getDate();

        DailySummary dailySummary = dailySummaryRepository.getDailySummaryByIdAndDate(userId, date);
        dailyActivityRepository.deleteById(activityId);

        float total = calculateCaloValueService.getTotalByDay(userId, date);
        dailySummary.setCaloriesBurned(total);
        dailySummaryRepository.save(dailySummary);
    }
}
