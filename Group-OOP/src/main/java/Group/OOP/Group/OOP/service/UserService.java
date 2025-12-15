package Group.OOP.Group.OOP.service;

import Group.OOP.Group.OOP.entity.User;
import Group.OOP.Group.OOP.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // in ra tất cả thông tin khách hàng
//    public void test() {
//        List<User> listUser = userRepository.getAllUser();
//        for (User user : listUser) {
//            System.out.println(user);
//        }
//    }

    // lấy thông tin 1 user bất kỳ
    public User printUserInfo(Integer userId){
        Optional<User> tmp = userRepository.findById(userId);
        User user = tmp.get() ;
        if(user != null)
            {
                System.out.println("=== THÔNG TIN USER ===");
                System.out.println("ID: " + user.getId());
                System.out.println("Họ và tên: " + user.getFirstName() + " " + user.getLastName());
                System.out.println("Tuổi: " + user.getAge());
                System.out.println("Giới tính: " + user.getGender());
            } else {
                System.out.println("❌ Không tìm thấy user với ID: " + userId);
            }
        return user ;
    }
    // update 1 số thông tin của user
    public User updateUser(Integer id , User userUpdate){
        Optional<User> userOptional = userRepository.findById(id); ;

        if (userOptional.isEmpty()) {
            throw new RuntimeException("Không tìm thấy user với ID: " + id);
        }

        User user = userOptional.get() ;

        if(userUpdate.getFirstName() != null){
          user.setFirstName(userUpdate.getFirstName()) ;
        }
        if(userUpdate.getLastName() != null){
            user.setLastName(userUpdate.getLastName()) ;
        }
        if(userUpdate.getAge() != null){
            user.setAge(userUpdate.getAge()) ;
        }
        if(userUpdate.getGender() != null) {
            user.setGender(userUpdate.getGender());
        }
        return userRepository.save(user) ;
    }

    // Thêm 1 user
//    public User createUser(User newUser){
//        if(userRepository.existsUser(newUser.getFirstName(), newUser.getLastName(), newUser.getAge(), newUser.getGender()) == true) {
//            throw new RuntimeException("Email đã tồn tại");
//        }
//        return userRepository.save(newUser);
//    }

}
