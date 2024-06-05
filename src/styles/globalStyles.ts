import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyles = createGlobalStyle`
${reset};
* {
  box-sizing: border-box;
  font-family: "Noto Sans KR", sans-serif;
}
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-text-fill-color: ${({ theme }) => theme.colors.black};
  -webkit-box-shadow: 0 0 0px 1000px ${({ theme }) =>
    theme.colors.bgDarkGrey} inset;
  transition: background-color 5000s ease-in-out 0s;
  font-family: "Noto Sans KR", sans-serif;
}
.modal-enter {
  transform: translate(-50%, -100%);
}
.modal-enter-active {
  transform: translate(-50%, 10px);
  transition: transform 500ms;
}
.modal-exit {
  transform: translate(-50%, 10px);
}
.modal-exit-active {
  transform: translate(-50%, -100%);
  transition: transform 500ms;
}
`;

export default GlobalStyles;
