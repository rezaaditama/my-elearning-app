import { useMemo, useState } from 'react';
import { decodeHtml } from '../../utils/htmlDecode';

type QuestionCardProps = {
  question: any;
  onAnswer: (choice: string) => void;
  disabled?: boolean;
};

const QuestionCard = ({ question, onAnswer, disabled }: QuestionCardProps) => {
  const [selected, setSelected] = useState<string | null>(null);

  const choices = useMemo(() => {
    if (!question) return [];
    const questionType =
      question.type === 'boolean'
        ? ['true', 'false']
        : [question.correct_answer, ...question.incorrect_answers];

    for (let i = questionType.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [questionType[i], questionType[j]] = [questionType[i], questionType[j]];
    }
    return questionType;
  }, [question]);

  //Fungsi Handle Select
  const handleSelect = (value: string) => {
    if (disabled) return;
    setSelected(value);
    onAnswer(value);

    if (!question) return null;
  };
  return (
    <div>
      <div className='mb-4 text-sm'>{decodeHtml(question.question)}</div>

      <div className='grid gap-2'>
        {choices.map((choice) => (
          <label
            key={choice}
            className={`p-3 border rounded cursor-pointer text-left ${
              selected === choice
                ? 'border-primary bg-primary/5'
                : 'border-neutral/20'
            }`}
          >
            <input
              type='radio'
              name='quiz-choice'
              value={choice}
              checked={selected === choice}
              onChange={() => handleSelect(choice)}
              className='mr-3'
            />
            <span>{decodeHtml(choice)}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
