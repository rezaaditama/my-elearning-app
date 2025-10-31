import React, { useEffect, useState } from 'react';
import type { Question } from '../../types/quizType';

type QuestionCardProps = {
  question: Question;
  index: number;
  onAnswer: (choice: string) => void;
  disabled?: boolean;
  storedAnswer?: string | null;
};

const normalize = (value: string | null | undefined) =>
  value ? String(value).trim().toLowerCase() : '';

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  onAnswer,
  disabled,
  storedAnswer,
}) => {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (storedAnswer) {
      setSelected(storedAnswer);
    }
  }, [storedAnswer, question.id, question]);

  //Handle Select
  const handleSelect = (value: string) => {
    if (disabled) return;
    setSelected(value);
    onAnswer(value);
  };

  return (
    <div>
      <div id={`question-${question.id}`} className='mb-4 text-sm'>
        {question.question}
      </div>

      <div
        className='grid gap-2'
        role='radiogroup'
        aria-labelledby={`question-${question.id ?? index}`}
      >
        {question.choices.map((choice, i) => {
          const isSelected =
            selected !== null && normalize(choice) === normalize(selected);
          return (
            <label
              key={`${question.id ?? index}-choice-${i}`}
              className={`p-3 border rounded cursor-pointer text-left ${
                selected === choice
                  ? 'border-primary bg-primary/5'
                  : 'border-neutral/20'
              }`}
            >
              <input
                type='radio'
                name={`quiz-choice-${question.id ?? index}`}
                value={choice}
                checked={isSelected}
                onChange={() => handleSelect(choice)}
                className='mr-3'
                disabled={disabled}
                aria-checked={selected === choice}
              />
              <span>{choice}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;
