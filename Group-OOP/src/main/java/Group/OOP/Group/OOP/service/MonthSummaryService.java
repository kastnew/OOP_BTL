package Group.OOP.Group.OOP.service;

import Group.OOP.Group.OOP.dto.MonthSummary;
import Group.OOP.Group.OOP.entity.DailySummary;
import Group.OOP.Group.OOP.repository.DailySummaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class MonthSummaryService {
    @Autowired
    DailySummaryRepository dailySummaryRepository;

    MonthSummaryService monthSummaryService;
    final float HIGH_SUGAR = 50f;    // g/ngày
    final float HIGH_FAT = 70f;      // g/ngày
    final float LOW_FIBER = 25f;     // g/ngày
    final float LOW_PROTEIN = 60f;

    public MonthSummary monthSummary(Integer userId , Integer month) {
        List<DailySummary> monthSummaries = dailySummaryRepository.findByUserIdAndMonth(userId, month);

        Float avgCaloriesIn = 0.0f;
        Float avgCaloriesOut = 0.0f;
        Float avgProtein = 0.0f;
        Float avgFat = 0.0f;
        Float avgFiber = 0.0f;
        Float avgSugar = 0.0f;

        Integer daysCaloriesInMoreThanOut = 0;
        Integer daysHighSugar = 0;
        Integer daysHighFat = 0;
        Integer daysLowFiber = 0;
        Integer daysLowProtein = 0;

        Integer totalDays = 0;
        StringBuilder note = new StringBuilder();;

        for (DailySummary dailySummary : monthSummaries) {
            avgCaloriesIn += dailySummary.getCaloriesConsumed();
            avgCaloriesOut += dailySummary.getCaloriesBurned();
            avgProtein += dailySummary.getTotalProtein();
            avgFat += dailySummary.getTotalFat();
            avgFiber += dailySummary.getTotalFiber();
            avgSugar += dailySummary.getTotalSugar();

            if (dailySummary.getCaloriesConsumed() > dailySummary.getCaloriesBurned()) {
                daysCaloriesInMoreThanOut++;
            }
            if (dailySummary.getTotalSugar() > HIGH_SUGAR) {
                daysHighSugar++;
            }
            if (dailySummary.getTotalFat() > HIGH_FAT) {
                daysHighFat++;
            }
            if (dailySummary.getTotalFiber() < LOW_FIBER) {
                daysLowFiber++;
            }
            if(dailySummary.getTotalProtein() < LOW_PROTEIN) {
                daysLowProtein++;
            }
            totalDays++;
        }
        avgCaloriesIn = avgCaloriesIn/totalDays;
        avgCaloriesOut = avgCaloriesOut/totalDays;
        avgProtein = avgProtein/totalDays;
        avgFat = avgFat/totalDays;
        avgFiber = avgFiber/totalDays;
        avgSugar = avgSugar/totalDays;

        if(daysHighSugar >= 1){
            note.append("Tháng này bạn có một số ngày ăn đường vượt mức.\n");
            note.append("Nên ăn ít đường lại");
        }
        else {
            note.append("Tháng này bạn tiêu thụ đường hợp lý.\n");
            note.append("Giữ mức tiêu thụ đường hoặc giảm đi");
        }

        // ===== FAT =====
        if (daysHighFat >= 1) {
            note.append("Tháng này bạn có một số ngày tiêu thụ chất béo vượt mức.\n");
            note.append("Nên hạn chế đồ chiên rán, mỡ động vật và thức ăn nhanh.\n");
        } else {
            note.append("Tháng này bạn tiêu thụ chất béo ở mức hợp lý.\n");
            note.append("Hãy tiếp tục duy trì chế độ ăn hiện tại.\n");
        }

// ===== FIBER =====
        if (daysLowFiber >= 1) {
            note.append("Tháng này bạn có một số ngày thiếu chất xơ.\n");
            note.append("Nên bổ sung thêm rau xanh, trái cây và ngũ cốc nguyên hạt.\n");
        } else {
            note.append("Tháng này bạn cung cấp đủ chất xơ cho cơ thể.\n");
            note.append("Hãy tiếp tục duy trì thói quen ăn nhiều rau xanh.\n");
        }

// ===== PROTEIN =====
        if (daysLowProtein >= 1) {
            note.append("Tháng này bạn có một số ngày nạp protein chưa đủ.\n");
            note.append("Nên tăng cường thịt nạc, cá, trứng, sữa hoặc các loại đậu.\n");
        } else {
            note.append("Tháng này lượng protein bạn nạp vào ở mức phù hợp.\n");
            note.append("Tiếp tục duy trì chế độ ăn giàu protein chất lượng.\n");
        }

        if(daysCaloriesInMoreThanOut * 2 >= totalDays)
        {
            note.append("Tháng này bạn hơi lười.\n");
            note.append("Nên tăng tập luyện.\n");
        } else {
            note.append("Tháng này bạn khá chăm chỉ tập luyện.\n");
            note.append("Tiếp tục duy trì chế độ tập luyện.\n");
        }

        MonthSummary ms = new MonthSummary();

        ms.setUserId(userId);
        ms.setMonth(month);

        // ===== Giá trị trung bình =====
        ms.setAvgCaloriesIn(avgCaloriesIn.doubleValue());
        ms.setAvgCaloriesOut(avgCaloriesOut.doubleValue());
        ms.setAvgProtein(avgProtein.doubleValue());
        ms.setAvgFat(avgFat.doubleValue());
        ms.setAvgFiber(avgFiber.doubleValue());
        ms.setAvgSugar(avgSugar.doubleValue());

        // ===== Thống kê theo ngày =====
        ms.setDaysCaloriesInMoreThanOut(daysCaloriesInMoreThanOut);
        ms.setDaysHighSugar(daysHighSugar);
        ms.setDaysHighFat(daysHighFat);
        ms.setDaysLowFiber(daysLowFiber);
        ms.setDaysLowProtein(daysLowProtein);

        // ===== Tổng hợp =====
        ms.setTotalDays(totalDays);
        ms.setNote(note);

        return ms;
    }
}
