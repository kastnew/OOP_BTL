package Group.OOP.Group.OOP.controller;

import Group.OOP.Group.OOP.entity.User;
import Group.OOP.Group.OOP.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/test")
public class UserController {

    @Autowired
    private UserService userService;
    User uu = new User("Minh", "Nguyen", 28, "Mail");
    // lấy thông tin 1 user bất kỳ
    @GetMapping("/{id}")
    public User getUser(@PathVariable Integer id) {
       return userService.printUserInfo(id) ;
    }

    // update thông tin 1 user
    @PatchMapping("/up/{id}")
    public void updateUser(@PathVariable Integer id , @RequestBody User user) {
        userService.updateUser(id ,user) ;
    }
//    @PatchMapping("/up{id}")
//    public void updateUser(@PathVariable Integer id) {
//        userService.updateUser(id , uu) ;
//    }

    // thêm 1 user
//    @PostMapping
//    public void createUser(@RequestBody User newUser){
//        userService.createUser(newUser);
//    }

    // delete 1 user

}
