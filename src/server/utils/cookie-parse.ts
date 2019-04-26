export default function cookieParser(str: string) {
  const arr = str.replace(/\s/ig, '').split(';');
  const obj: {[key: string]: string} = {};
  arr.forEach((v) => {
    const kv = v.split('=');
    const key = kv[0];
    const value = kv[1];
    obj[key] = value;
  });

  return obj;
}
