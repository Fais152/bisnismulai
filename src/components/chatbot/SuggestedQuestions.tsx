"use client";

interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (q: string) => void;
}

export function SuggestedQuestions({ questions, onSelect }: SuggestedQuestionsProps) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="px-4 pb-2 flex flex-wrap gap-2">
      {questions.map((q, i) => (
        <button
          key={i}
          onClick={() => onSelect(q)}
          className="text-xs text-primary border border-primary/30 bg-primary/5 hover:bg-primary/15 hover:border-primary/60 rounded-full px-3 py-1.5 transition-all text-left max-w-full"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
