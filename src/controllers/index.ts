import ContractController from './contract.controller';
import HiringController from './hiring.controller';
import HomeController from './home.controller';
import LoginController from './login.controller';
import NetworkingController from './networking.controller';
import PortfolioController from './portfolio.controller';
import PublicController from './public.controller';
import SkillController from './skills.controller';
import TokenController from './tokens.controller';
import UserController from './user.controller';

class Controller {
  public static home() {
    return HomeController;
  }

  public static authentication() {
    return LoginController;
  }

  public static networking() {
    return NetworkingController;
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

  public static contract() {
    return ContractController;
  }

  public static hiring() {
    return HiringController;
  }

  public static skills() {
    return SkillController;
  }

  public static public() {
    return PublicController;
  }
}

export default Controller;
