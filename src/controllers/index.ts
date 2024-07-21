import HomeController from './home.controller';
import LoginController from './login.controller';

class Controller {
  public static home() {
    return HomeController;
  }

  public static authentication() {
    return LoginController;
  }
}

export default Controller;
