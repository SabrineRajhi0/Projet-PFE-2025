package GestionCours.backend.springboot.Services;

import java.util.List;

import GestionCours.backend.springboot.Entity.User;

public interface AdminService {
	User addUserr(User user);



	User updateUser(Long id, User user);

	void deleteUser(Long id);

	User getUserById(Long id);

	List<User> getAllUserss();

}
