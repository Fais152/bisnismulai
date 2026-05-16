"use client";

interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (q: string) => void;
}

export function SuggestedQuestions({ questions, onSelect }: SuggestedQuestionsProps) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="px-2 pb-2 flex flex-col items-start gap-1">
      {questions.map((q, i) => (
        <button
          key={i}
          onClick={() => onSelect(q)}
          className="btn-retro text-left text-[11px] px-2 py-1 max-w-[80%]"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
