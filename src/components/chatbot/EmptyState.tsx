"use client";

interface EmptyStateProps {
  onSelectQuestion: (q: string) => void;
}

const STARTER_QUESTIONS = [
  "Bagaimana cara menghitung harga jual yang tepat?",
  "Apa perbedaan CV dan PT untuk bisnis saya?",
  "Bisnis saya baru mulai, dari mana harus mulai?",
  "Bagaimana cara tahu bisnis saya sudah break-even?",
];

export function EmptyState({ onSelectQuestion }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-start gap-4 px-4 py-4">
      {/* BizBot greeting bubble */}
      <div className="flex items-end gap-2 w-full">
        <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 text-xs font-bold text-primary mb-1">
          B
        </div>
        <div className="bg-card border border-border/50 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm text-sm leading-relaxed max-w-[85%]">
          <p>👋 Halo! Saya <strong>BizBot</strong>, asisten bisnis kamu.</p>
          <p className="mt-2">Saya bisa membantu kamu dengan:</p>
          <ul className="mt-1 space-y-0.5 text-muted-foreground">
            <li>• Menghitung HPP dan harga jual produk</li>
            <li>• Merencanakan strategi bisnis kamu</li>
            <li>• Memahami kewajiban legal dan perizinan</li>
            <li>• Menganalisis cash flow dan break-even</li>
          </ul>
          <p className="mt-2 font-medium">Mau mulai dari mana?</p>
        </div>
      </div>

      {/* Starter questions */}
      <div className="flex flex-col gap-2 w-full pl-9">
        {STARTER_QUESTIONS.map((q, i) => (
          <button
            key={i}
            onClick={() => onSelectQuestion(q)}
            className="text-xs text-primary border border-primary/30 bg-primary/5 hover:bg-primary/15 hover:border-primary/60 rounded-full px-3 py-1.5 transition-all text-left"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
