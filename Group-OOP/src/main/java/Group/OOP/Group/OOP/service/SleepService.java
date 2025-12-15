package Group.OOP.Group.OOP.service;

import Group.OOP.Group.OOP.entity.User;
import Group.OOP.Group.OOP.entity.Sleep;
import Group.OOP.Group.OOP.repository.SleepRepository;
import Group.OOP.Group.OOP.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.*;
import java.util.List;
import java.util.Optional;

@Service
public class SleepService {
    @Autowired
    private SleepRepository sleepRepository ;

    @Autowired
    private UserRepository userRepository;

    // them bua an
    public Sleep createSleep(Sleep new_sleep) {
        return sleepRepository.save(new_sleep) ;
    }

    // lấy thông tin giấc ngủ của 1 người trong 1 ngày
    public List<Sleep> ListSleep(Integer userId) {
        return sleepRepository.getSleepByUserId(userId) ;
    }
    // update
    public Sleep updateSleep(Integer sleepId , Sleep new_sleep) {
        Optional<Sleep> tmp = sleepRepository.findById(sleepId);
        Sleep sleep = tmp.get();

        sleep.updateFrom(new_sleep);
        return sleepRepository.save(sleep) ;
    }

    // delete
    public void deleteSleep(Integer sleepId) {
        sleepRepository.deleteById(sleepId) ;
    }

}
