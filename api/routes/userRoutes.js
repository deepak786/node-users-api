module.exports = function(app) {
  var users = require('../controllers/userController');

  app.route('/users')
    .post(users.create_user)
    .get(users.check_header, users.list_all_users);


  app.route('/users/:userId')
    .get(users.get_user)
    .put(users.update_user)
    .delete(users.delete_user);

   app.route('/login')
   	.post(users.login);
};