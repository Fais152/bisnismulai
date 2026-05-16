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
    <div className="flex flex-col mb-2 px-2 items-start">
      <span className="text-[11px] font-bold mb-0.5 text-[#000080]">BizBot AI</span>
      <div className="win-inset px-3 py-2 text-[13px] leading-relaxed max-w-[85%] bg-[#FFFFFF] text-[#000000]">
        <p>👋 Halo! Saya <strong>BizBot</strong>, asisten bisnis kamu.</p>
        <p className="mt-2">Saya bisa membantu kamu dengan:</p>
        <ul className="mt-1 space-y-0.5 text-[#444444]">
          <li>• Menghitung HPP dan harga jual produk</li>
          <li>• Merencanakan strategi bisnis kamu</li>
          <li>• Memahami kewajiban legal dan perizinan</li>
          <li>• Menganalisis cash flow dan break-even</li>
        </ul>
        <p className="mt-2 font-bold">Mau mulai dari mana?</p>
      </div>

      <div className="flex flex-col gap-1 w-full pl-2 mt-2">
        {STARTER_QUESTIONS.map((q, i) => (
          <button
            key={i}
            onClick={() => onSelectQuestion(q)}
            className="btn-retro text-left text-[11px] px-2 py-1 max-w-[80%]"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
