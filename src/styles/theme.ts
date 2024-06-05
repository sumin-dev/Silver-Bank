const colors = {
  main: '#729d39',
  mainWithHover: '#36622b',

  black: '#171a1f',
  white: '#ffffff',
  blue: '#0000ff',

  red: '#ff6347',
  numberPadRed: '#d9534f',
  numberPadRedWithHover: '#c9302c',

  bgDarkGrey: '#f3f4f6',
  bgLightGrey: '#f8f9fa',
  menuIconGrey: '#6f7787',
  textGrey: '#9095a0',
  borderGrey: '#dddddd',
};

const common = {
  flexCenter: `
  display: flex;
  justify-content: center;
  align-items: center;
  `,

  flexColumnCenter: `
  display: flex;
  flex-direction: column;
  align-items: center;
  `,

  title: `
  font-size: 36px;
  font-weight: 700;
  color: ${colors.black}
  `,

  overlay: `
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  `,
};

const theme = {
  colors,
  common,
};

export default theme;
