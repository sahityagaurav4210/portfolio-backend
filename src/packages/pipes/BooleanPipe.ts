import { IPipe } from "@interfaces/index";

class BooleanPipe implements IPipe<boolean> {
  public Convert(input: string): boolean {
    if (input === "true") return true;
    return false;
  }
}

export default BooleanPipe;