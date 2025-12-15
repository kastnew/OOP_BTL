package Group.OOP.Group.OOP.controller;

import Group.OOP.Group.OOP.entity.Meal;
import Group.OOP.Group.OOP.service.MealService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Meal")
public class MealController {
   @Autowired
   MealService mealService ;

   // them hoat dong
    @PostMapping("/create")
    public void createMeal(@RequestBody Meal meal) {
         mealService.createMeal(meal) ;
    }

    // lấy bữa ăn của 1 người
    @GetMapping("/{id}")
    public List<Meal> getMeals(@PathVariable Integer id) {
        return mealService.ListMeal(id) ;
    }

    // update
    @PostMapping("/up")
    public Meal updateMeal(@RequestBody Meal new_meal) {
        return mealService.updateMeal(new_meal) ;
    }

    //delete
    @GetMapping("/delete/{id}")
    public void deleteMeal(@PathVariable Integer id) {
        mealService.deleteMeal(id) ;
    }
}
