package Group.OOP.Group.OOP.controller;

import Group.OOP.Group.OOP.entity.Sleep;
import Group.OOP.Group.OOP.service.SleepService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Sleep")
public class SleepController {
    @Autowired
    SleepService sleepService;

    // them hoat dong
    @PostMapping("/create")
    public void createSleep(@RequestBody Sleep sleep) {
        sleepService.createSleep(sleep) ;
    }

    // lấy giấc ngủ của 1 người
    @GetMapping("/{id}")
    public List<Sleep> getSleeps(@PathVariable Integer id) {
        return sleepService.ListSleep(id) ;
    }

    // up
    @PostMapping("/up/{id}")
    public void updateSleep(@PathVariable Integer id, @RequestBody Sleep new_sleep) {
         sleepService.updateSleep(id, new_sleep) ;
    }
    //delete
    @GetMapping("/delete/{id}")
    public void deleteSleep(@PathVariable Integer id) {
        sleepService.deleteSleep(id); ;
    }


}
