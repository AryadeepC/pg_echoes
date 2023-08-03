const sym = "123456789ABCDEF";
const getRndInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const rcg = () => {
  let color = "#";
  for (var i = 0; i < 6; i++) {
    color += sym[getRndInteger(0, 15)];
  }
  
  return color;
};
