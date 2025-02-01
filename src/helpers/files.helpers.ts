import * as fs from 'fs';

class Files {
  public static async delete(url: string) {
    if (fs.existsSync(url))
      return new Promise((resolve, reject) => {
        fs.unlink(url, error => {
          if (error) reject(error.message);
          resolve('File deleted');
        });
      });
  }

  public static async createFile(path: string, data: Buffer) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, data, error => {
        if (error) reject(error);
        resolve('File created');
      });
    });
  }

  public static async readFile(path: string): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      fs.readFile(path, (error, data) => {
        if (error) {
          reject(error.message);
        } else {
          resolve(data);
        }
      });
    });
  }

  public static exists(path: string): boolean {
    return fs.existsSync(path);
  }
}

export default Files;
