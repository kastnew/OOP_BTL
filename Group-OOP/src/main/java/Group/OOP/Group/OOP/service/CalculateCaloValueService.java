package Group.OOP.Group.OOP.service;

import Group.OOP.Group.OOP.entity.DailyActivity;
import Group.OOP.Group.OOP.repository.DailyActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Service
public class CalculateCaloValueService extends CalculateNutritionValueService{

    @Autowired
    private DailyActivityRepository dailyActivityRepository;

    @Override
    public float getTotalByDay(Integer userId , LocalDate date){
        List<DailyActivity> listDA = dailyActivityRepository.getDailyActivitiesByIdAndDate(userId , date);
        float total = 0f;
        for (DailyActivity a : listDA) {
            if (a.getCaloriesBurned() != null) {
                total += a.getCaloriesBurned();
            }
        }
        return total;
    }

//    @Override
//    public float getTotalByMonth(Integer userId , Date date){
//
//    }

}
