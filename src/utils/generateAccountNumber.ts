export function generateAccountNumber(): string {
  const getRandomDigit = () => Math.floor(Math.random() * 10).toString();

  const part1 = Array.from({ length: 4 }, getRandomDigit).join('');
  const part2 = Array.from({ length: 4 }, getRandomDigit).join('');
  const part3 = Array.from({ length: 4 }, getRandomDigit).join('');

  return `${part1}-${part2}-${part3}`;
}
