package Group.OOP.Group.OOP.service;


import Group.OOP.Group.OOP.entity.Meal;
import Group.OOP.Group.OOP.repository.MealRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Service
public class CalculateCalorieIntakeValueService extends CalculateNutritionValueService {
    @Autowired
    private MealRepository mealRepository;

    @Override
    public float getTotalByDay(Integer userId , LocalDate date){
        List<Meal> listMeals = mealRepository.getMealsByIdAndDate(userId , date);
        float total = 0f;
        for (Meal a : listMeals) {
            if (a.getCalories() != null) {
                total += a.getCalories();
            }
        }
        return total;
    }
}
