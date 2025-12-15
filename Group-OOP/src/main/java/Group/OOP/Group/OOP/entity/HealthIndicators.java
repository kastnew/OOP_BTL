package Group.OOP.Group.OOP.entity;

import jakarta.persistence.* ;
import lombok.Data ;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "Health_Indicators")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class HealthIndicators {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Indicator_ID")
    private Integer indicatorId ;

    @OneToOne
    @JoinColumn(name = "User_ID")
    private User user ;

    @Column(name = "Height")
    private Float height ;

    @Column(name = "Weight")
    private Float weight ;

    @Column(name = "Blood_Pressure")
    private Float bloodPressure ;

    @Column(name = "Heart_Rate")
    private Float heartRate ;

    @Column(name = "BMI")
    private Float bmi ;

    @Column(name = "Health_Status" , length = 100)
    private String healthStatus ;
}
