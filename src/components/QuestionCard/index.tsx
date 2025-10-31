import React, { useEffect, useState } from 'react';
import type { Question } from '../../types/quizType';

type QuestionCardProps = {
  question: Question;
  index: number;
  onAnswer: (choice: string) => void;
  disabled?: boolean;
  storedAnswer?: string | null;
};

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
  }, [storedAnswer]);

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
        aria-labelledby={`question-${question.id}`}
      >
        {question.choices.map((choice, i) => (
          <label
            key={`${question.id}-choice-${i}`}
            className={`p-3 border rounded cursor-pointer text-left ${
              selected === choice
                ? 'border-primary bg-primary/5'
                : 'border-neutral/20'
            }`}
          >
            <input
              type='radio'
              name={`quiz-choice-${index}`}
              value={choice}
              checked={selected === choice}
              onChange={() => handleSelect(choice)}
              className='mr-3'
              disabled={disabled}
              aria-checked={selected === choice}
            />
            <span>{choice}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
