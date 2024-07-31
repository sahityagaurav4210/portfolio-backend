import HomeController from './home.controller';
import LoginController from './login.controller';
import PortfolioController from './portfolio.controller';
import TokenController from './tokens.controller';
import UserController from './user.controller';

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

  public static portfolio() {
    return PortfolioController;
  }

  public static user() {
    return UserController;
  }
}

export default Controller;
