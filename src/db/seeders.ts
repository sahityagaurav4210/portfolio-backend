import { createAdmin, updatePageStatus, updateWebsites } from "./dumps";

class Seeders {
  constructor() { }

  public async run() {
    await createAdmin();
    await updateWebsites();
    await updatePageStatus();
  }
}

export default Seeders;