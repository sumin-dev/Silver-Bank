import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const PadContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  margin-top: 10px;
`;

const PadButton = styled.button`
  border: solid 1px #f0f0f0;
  font-size: 24px;
  cursor: pointer;
  background-color: #f8f9fa;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const SpecialButton = styled(PadButton)`
  background-color: #d9534f;
  color: white;
  &:hover {
    background-color: #c9302c;
  }
`;

interface NumberPadProps {
  onClick: (value: string) => void;
  onDelete: () => void;
  onClear: () => void;
}

const NumberPad: React.FC<NumberPadProps> = ({
  onClick,
  onDelete,
  onClear,
}) => {
  const [numbers, setNumbers] = useState<number[]>([]);

  const shuffleArray = (array: number[]): number[] => {
    return array.sort(() => Math.random() - 0.5);
  };

  const onNumberClick = (value: number) => {
    onClick(value.toString());
    setNumbers(shuffleArray(numbers));
  };

  const renderButton = (index: number) => {
    if (index === 5) {
      return (
        <SpecialButton onClick={onDelete} type="button" key={index}>
          ⌫
        </SpecialButton>
      );
    } else if (index === 11) {
      return (
        <SpecialButton onClick={onClear} type="button" key={index}>
          𝗖
        </SpecialButton>
      );
    } else {
      const number = numbers[index < 5 ? index : index - 1];
      return (
        <PadButton
          key={index}
          onClick={() => onNumberClick(number)}
          type="button"
        >
          {number}
        </PadButton>
      );
    }
  };

  useEffect(() => {
    setNumbers(shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]));
  }, []);

  return (
    <PadContainer>
      {Array.from({ length: 12 }, (_, idx) => renderButton(idx))}
    </PadContainer>
  );
};

export default NumberPad;
