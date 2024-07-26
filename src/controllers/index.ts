import HomeController from './home.controller';
import LoginController from './login.controller';
import TokenController from './tokens.controller';

class Controller {
  public static home() {
    return HomeController;
  }

  public static authentication() {
    return LoginController;
  }

  public static tokens() {
    return TokenController;
  }
}

export default Controller;
