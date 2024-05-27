export function changeNumberToKorean(accountNumber: string): string {
  const numberMap: { [key: string]: string } = {
    '0': '영',
    '1': '일',
    '2': '이',
    '3': '삼',
    '4': '사',
    '5': '오',
    '6': '육',
    '7': '칠',
    '8': '팔',
    '9': '구',
    '-': ' ',
  };

  return accountNumber
    .split('')
    .map((char) => numberMap[char])
    .join('');
}