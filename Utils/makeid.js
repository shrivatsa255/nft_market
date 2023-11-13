export const makeid = (length) => {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz123456789';
  const characterLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * characterLength));
  }
  return result;
};
