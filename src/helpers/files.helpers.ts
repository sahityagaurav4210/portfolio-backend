import * as fs from 'fs';

class Files {
  public static async delete(url: string) {
    if (fs.existsSync(url))
      return new Promise((resolve, reject) => {
        fs.unlink(url, error => {
          if (error) reject(error);
          resolve('File deleted');
        });
      });
  }

  public static async createFile(path: string, data: Buffer) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, data, 'utf-8', error => {
        if (error) reject(error);
        resolve('File created');
      });
    });
  }
}

export default Files;
