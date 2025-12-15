package Group.OOP.Group.OOP.controller;

import Group.OOP.Group.OOP.entity.DailyActivity;
import Group.OOP.Group.OOP.service.DailyActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/DailyActivity")
public class DailyActivityController {
    @Autowired
    private DailyActivityService dailyActivityService;

    // them hoat dong
    @PostMapping("/create")
    public void createDailyActivity(@RequestBody DailyActivity newDailyActivity){
        dailyActivityService.createDailyActivity(newDailyActivity);
    }
    // xem danh sach hoat dong CUA 1 NGUOI
    @GetMapping("/{id}")
    public List<DailyActivity> getDailyActivities(@PathVariable Integer id){
        return dailyActivityService.ListDailyActivity(id) ;
    }

    // cập nhật hoạt động
    @PatchMapping("/up")
    public void updateDailyActivity(@RequestBody DailyActivity new_daily_activity){
        dailyActivityService.updateDailyActivity(new_daily_activity) ;
    }

    // xoá hoạt động
    @GetMapping("/delete/{activityId}")
    public void deleteDailyActivity(@PathVariable Integer activityId){
        dailyActivityService.deleteDailyActivity(activityId);
    }

}
