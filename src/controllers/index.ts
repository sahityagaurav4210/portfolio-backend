import HomeController from './home.controller';
import LoginController from './login.controller';
import PortfolioController from './portfolio.controller';
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

  public static portfolio() {
    return PortfolioController;
  }
}

export default Controller;
