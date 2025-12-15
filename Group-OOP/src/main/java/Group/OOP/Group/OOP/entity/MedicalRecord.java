package Group.OOP.Group.OOP.entity;

import jakarta.persistence.*;
import lombok.Data ;
import lombok.NoArgsConstructor ;
import lombok.AllArgsConstructor ;

import java.sql.Date;
import java.time.LocalDate;

@Entity
@Table(name = "Medical_Record")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Record_ID")
    private Integer recordId;

    @OneToOne
    @JoinColumn(name = "User_ID")
    private User user ;

    @Column(name = "Disease_Name" , length = 100)
    private String diseaseName ;

    @Column(name = "Disease_Type" , length = 100)
    private String diseaseType ;

    @Column(name = "Severity" , length = 50)
    private String severity ;

    @Column(name = "Status" , length = 50)
    private String status ;

    @Column(name = "Diagnosis_Date")
    private Date diagnosisDate ;

    @Column(name = "End_Date")
    private LocalDate endDate ;

    @Column(name = "Notes" , length = 255)
    private String notes ;

}
