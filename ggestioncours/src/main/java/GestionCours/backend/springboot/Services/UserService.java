package GestionCours.backend.springboot.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import GestionCours.backend.springboot.Entity.User;
@Service
public interface UserService {

	List<User> getAllUsers();
	User getUserById(Long id);
	User addUser(User user);
	User updateUser(Long id, User userDetails);
	void deleteUser(Long id);
	User getUserByEmail(String email);
	//User addUser(User user, String rawPassword);
	User findByEmail(String email);
	
	void unblockUser(Long userId);
	String rejectUser(Long userId, String reason);
	void blockUser(Long userId, String reason);
	String activateUser(Long userId);
	User findById(long userId);
	User findByResetToken(String token);
	void updateUser(User user);

}
