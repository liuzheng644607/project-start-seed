import * as fs from 'fs';

export default function getFiles(dir: string, fileList?: string[]): string[] {
  fileList = fileList || [];
  const files = fs.readdirSync(dir);
  const len = files.length;
  for (let i = 0; i < len; i++) {
    const name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, fileList);
    } else {
      fileList.push(name);
    }
  }
  return fileList;
}
