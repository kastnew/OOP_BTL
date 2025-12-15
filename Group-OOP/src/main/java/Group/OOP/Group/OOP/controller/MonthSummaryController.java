package Group.OOP.Group.OOP.controller;

import Group.OOP.Group.OOP.dto.MonthSummary;
import Group.OOP.Group.OOP.service.MonthSummaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/monthsummary")
public class MonthSummaryController {
    @Autowired
    private MonthSummaryService monthSummaryService;

    @PostMapping("/{id}")
    public MonthSummary getMonthSummary(@PathVariable Integer id , @RequestBody Integer month) {
        return monthSummaryService.monthSummary(id, month);
    }
}
