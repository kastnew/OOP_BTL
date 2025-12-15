package Group.OOP.Group.OOP.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthSummary {

    // ===== Thông tin chung =====
    private Integer userId;
    private Integer month; // 1 - 12

    // ===== Giá trị trung bình mỗi ngày =====
    private Double avgCaloriesIn;     // calo nạp vào trung bình
    private Double avgCaloriesOut;    // calo tiêu hao trung bình
    private Double avgProtein;        // protein trung bình (g)
    private Double avgFat;            // fat trung bình (g)
    private Double avgFiber;          // fiber trung bình (g)
    private Double avgSugar;           // đường trung bình (g)

    // ===== Thống kê theo ngày =====
    private Integer daysCaloriesInMoreThanOut; // số ngày calo vào > calo ra
    private Integer daysHighSugar;              // số ngày nạp nhiều đường
    private Integer daysHighFat;                // số ngày ăn nhiều fat
    private Integer daysLowFiber;               // số ngày thiếu fiber
    private Integer daysLowProtein;               // số ngày thiếu protein


    // ===== Tổng hợp =====
    private Integer totalDays;                  // tổng số ngày có dữ liệu
    private StringBuilder note;

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }


    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public Double getAvgCaloriesIn() {
        return avgCaloriesIn;
    }

    public void setAvgCaloriesIn(Double avgCaloriesIn) {
        this.avgCaloriesIn = avgCaloriesIn;
    }

    public Double getAvgCaloriesOut() {
        return avgCaloriesOut;
    }

    public void setAvgCaloriesOut(Double avgCaloriesOut) {
        this.avgCaloriesOut = avgCaloriesOut;
    }

    public Double getAvgProtein() {
        return avgProtein;
    }

    public void setAvgProtein(Double avgProtein) {
        this.avgProtein = avgProtein;
    }

    public Double getAvgFat() {
        return avgFat;
    }

    public void setAvgFat(Double avgFat) {
        this.avgFat = avgFat;
    }

    public Double getAvgFiber() {
        return avgFiber;
    }

    public void setAvgFiber(Double avgFiber) {
        this.avgFiber = avgFiber;
    }

    public Double getAvgSugar() {
        return avgSugar;
    }

    public void setAvgSugar(Double avgSugar) {
        this.avgSugar = avgSugar;
    }

    public Integer getDaysCaloriesInMoreThanOut() {
        return daysCaloriesInMoreThanOut;
    }

    public void setDaysCaloriesInMoreThanOut(Integer daysCaloriesInMoreThanOut) {
        this.daysCaloriesInMoreThanOut = daysCaloriesInMoreThanOut;
    }

    public Integer getDaysHighSugar() {
        return daysHighSugar;
    }

    public void setDaysHighSugar(Integer daysHighSugar) {
        this.daysHighSugar = daysHighSugar;
    }

    public Integer getDaysHighFat() {
        return daysHighFat;
    }

    public void setDaysHighFat(Integer daysHighFat) {
        this.daysHighFat = daysHighFat;
    }

    public Integer getDaysLowFiber() {
        return daysLowFiber;
    }

    public void setDaysLowFiber(Integer daysLowFiber) {
        this.daysLowFiber = daysLowFiber;
    }

    public Integer getDaysLowProtein() {
        return daysLowProtein;
    }

    public void setDaysLowProtein(Integer daysLowProtein) {
        this.daysLowProtein = daysLowProtein;
    }

    public Integer getTotalDays() {
        return totalDays;
    }

    public void setTotalDays(Integer totalDays) {
        this.totalDays = totalDays;
    }

    public StringBuilder getNote() {
        return note;
    }

    public void setNote(StringBuilder note) {
        this.note = note;
    }
}
