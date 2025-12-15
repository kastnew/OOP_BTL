package Group.OOP.Group.OOP.service;


import Group.OOP.Group.OOP.entity.DailySummary;
import Group.OOP.Group.OOP.entity.User;
import Group.OOP.Group.OOP.entity.Meal;
import Group.OOP.Group.OOP.repository.DailySummaryRepository;
import Group.OOP.Group.OOP.repository.MealRepository;
import Group.OOP.Group.OOP.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class MealService {
    @Autowired
    private MealRepository mealRepository ;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DailySummaryRepository dailySummaryRepository;

    @Autowired
    private CalculateProteinValueService calculateProteinValueService;

    @Autowired
    private CalculateFatValueService calculateFatValueService;

    @Autowired
    private CalculateFiberValueService calculateFiberValueService;

    @Autowired
    private CalculateSugarValueService calculateSugarValueService;

    @Autowired
    private CalculateCalorieIntakeValueService calculateCalorieIntakeValueService;

    // them bua an
    public Meal createMeal(Meal newMeal) {
        mealRepository.save(newMeal) ;

        DailySummary dailySummary = dailySummaryRepository.getDailySummaryByIdAndDate(newMeal.getUserId(), newMeal.getDate());
        if(dailySummary == null) {
            dailySummary = new DailySummary();
            dailySummary.setDate(newMeal.getDate());
            dailySummary.setUserId(newMeal.getUserId());
        }

        float totalProtein = calculateProteinValueService.getTotalByDay(newMeal.getUserId() , newMeal.getDate());
        dailySummary.setTotalProtein(totalProtein);

        float totalFat = calculateFatValueService.getTotalByDay(newMeal.getUserId() , newMeal.getDate());
        dailySummary.setTotalFat(totalFat);

        float totalFiber = calculateFiberValueService.getTotalByDay(newMeal.getUserId() , newMeal.getDate());
        dailySummary.setTotalFiber(totalFiber);

        float totalSugar = calculateSugarValueService.getTotalByDay(newMeal.getUserId() , newMeal.getDate());
        dailySummary.setTotalSugar(totalSugar);

        float totalCalorieIntake = calculateCalorieIntakeValueService.getTotalByDay(newMeal.getUserId() , newMeal.getDate());
        dailySummary.setCaloriesConsumed(totalCalorieIntake);

        dailySummaryRepository.save(dailySummary);
        return newMeal;
    }

    // lấy thông tin món ăn của 1 người trong 1 ngày
    public List<Meal> ListMeal(Integer userId) {
        return mealRepository.getMealByUserId(userId) ;
    }

    // update
    public Meal updateMeal(Meal newMeal) {
        mealRepository.save(newMeal) ;

        DailySummary dailySummary = dailySummaryRepository.getDailySummaryByIdAndDate(newMeal.getUserId(), newMeal.getDate());
        if(dailySummary == null) {
            dailySummary = new DailySummary();
            dailySummary.setDate(newMeal.getDate());
            dailySummary.setUserId(newMeal.getUserId());
        }

        float totalProtein = calculateProteinValueService.getTotalByDay(newMeal.getUserId() , newMeal.getDate());
        dailySummary.setTotalProtein(totalProtein);

        float totalFat = calculateFatValueService.getTotalByDay(newMeal.getUserId() , newMeal.getDate());
        dailySummary.setTotalFat(totalFat);

        float totalFiber = calculateFiberValueService.getTotalByDay(newMeal.getUserId() , newMeal.getDate());
        dailySummary.setTotalFiber(totalFiber);

        float totalSugar = calculateSugarValueService.getTotalByDay(newMeal.getUserId() , newMeal.getDate());
        dailySummary.setTotalSugar(totalSugar);

        float totalCalorieIntake = calculateCalorieIntakeValueService.getTotalByDay(newMeal.getUserId() , newMeal.getDate());
        dailySummary.setCaloriesConsumed(totalCalorieIntake);

        dailySummaryRepository.save(dailySummary);
        return newMeal;
    }

    // delete
    public void deleteMeal(Integer mealId) {

        Optional<Meal> tmp = mealRepository.findById(mealId);
        Meal meal = tmp.get() ;

        Integer userId = meal.getUserId();
        LocalDate date = meal.getDate();

        DailySummary dailySummary = dailySummaryRepository.getDailySummaryByIdAndDate(userId, date);
        mealRepository.deleteById(mealId) ;

        float totalProtein = calculateProteinValueService.getTotalByDay(userId, date);
        dailySummary.setTotalProtein(totalProtein);

        float totalFat = calculateFatValueService.getTotalByDay(userId, date);
        dailySummary.setTotalFat(totalFat);

        float totalFiber = calculateFiberValueService.getTotalByDay(userId, date);
        dailySummary.setTotalFiber(totalFiber);

        float totalSugar = calculateSugarValueService.getTotalByDay(userId, date);
        dailySummary.setTotalSugar(totalSugar);

        float totalCalorieIntake = calculateCalorieIntakeValueService.getTotalByDay(userId, date);
        dailySummary.setCaloriesConsumed(totalCalorieIntake);

        dailySummaryRepository.save(dailySummary);

    }
}
