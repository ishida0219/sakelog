import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { X, Star, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { IdentifiedSake } from "../../../drizzle/schema";

interface Props {
  sake: IdentifiedSake;
  sakeIndex: number;
  recordId: number;
  onClose: () => void;
}

type Step = "stars" | "q1" | "q2" | "q3" | "done";

const Q1_OPTIONS = [
  { value: "yes", emoji: "❤️", label: "はい" },
  { value: "maybe", emoji: "🙂", label: "たぶん" },
  { value: "neutral", emoji: "😐", label: "ふつう" },
  { value: "no", emoji: "❌", label: "いいえ" },
] as const;

const Q2_OPTIONS = [
  { value: "fish", emoji: "🐟", label: "魚" },
  { value: "meat", emoji: "🥩", label: "肉" },
  { value: "cheese", emoji: "🧀", label: "チーズ" },
  { value: "japanese", emoji: "🍚", label: "和食" },
  { value: "solo", emoji: "🍶", label: "単体" },
] as const;

const Q3_OPTIONS = [
  { value: "aroma", emoji: "✨", label: "香り" },
  { value: "umami", emoji: "💎", label: "旨み" },
  { value: "finish", emoji: "⚡", label: "キレ" },
  { value: "drinkability", emoji: "🌊", label: "飲みやすさ" },
  { value: "surprise", emoji: "🎯", label: "意外性" },
] as const;

export default function RatingModal({ sake, sakeIndex, recordId, onClose }: Props) {
  const [step, setStep] = useState<Step>("stars");
  const [stars, setStars] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [drinkAgain, setDrinkAgain] = useState<string | null>(null);
  const [pairing, setPairing] = useState<string | null>(null);
  const [impression, setImpression] = useState<string | null>(null);

  const upsertMutation = trpc.rating.upsert.useMutation();

  const handleSubmit = async () => {
    try {
      await upsertMutation.mutateAsync({
        sakeRecordId: recordId,
        sakeIndex,
        stars: stars > 0 ? stars : undefined,
        drinkAgain: drinkAgain as any,
        pairing: pairing as any,
        impression: impression as any,
      });
      setStep("done");
      setTimeout(() => {
        onClose();
        toast.success("評価を保存しました");
      }, 1200);
    } catch {
      toast.error("保存に失敗しました");
    }
  };

  const stepTitles: Record<Step, string> = {
    stars: "評価",
    q1: "また飲みたい？",
    q2: "何と合わせた？",
    q3: "どこが印象的？",
    done: "完了",
  };

  const stepProgress: Record<Step, number> = {
    stars: 1, q1: 2, q2: 3, q3: 4, done: 4,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl border border-border shadow-xl w-full max-w-sm overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-border">
          <div
            className="h-full bg-[var(--sake-blue)] transition-all duration-300"
            style={{ width: `${(stepProgress[step] / 4) * 100}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-3">
          <div>
            <p className="text-xs text-muted-foreground font-light">{sake.name}</p>
            <h3 className="font-black text-lg tracking-tight">{stepTitles[step]}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-accent transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <div className="px-5 pb-5">
          {/* Step: Stars */}
          {step === "stars" && (
            <div>
              <div className="flex justify-center gap-2 py-4">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    className="transition-transform hover:scale-110 active:scale-95"
                    onMouseEnter={() => setHoverStar(n)}
                    onMouseLeave={() => setHoverStar(0)}
                    onClick={() => setStars(n)}
                  >
                    <Star
                      size={36}
                      className="transition-colors"
                      fill={(hoverStar || stars) >= n ? "var(--sake-pink)" : "none"}
                      stroke={(hoverStar || stars) >= n ? "var(--sake-pink)" : "var(--border)"}
                      strokeWidth={1.5}
                    />
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep("q1")}
                >
                  スキップ
                </Button>
                <Button
                  className="flex-1 gap-1"
                  disabled={stars === 0}
                  onClick={() => setStep("q1")}
                >
                  次へ <ChevronRight size={15} />
                </Button>
              </div>
            </div>
          )}

          {/* Step: Q1 また飲みたい？ */}
          {step === "q1" && (
            <div>
              <div className="grid grid-cols-2 gap-2 py-3">
                {Q1_OPTIONS.map(({ value, emoji, label }) => (
                  <button
                    key={value}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left font-medium ${
                      drinkAgain === value
                        ? "border-[var(--sake-blue)] bg-[var(--sake-blue-light)]"
                        : "border-border hover:border-[var(--sake-blue)]/50 hover:bg-accent"
                    }`}
                    onClick={() => { setDrinkAgain(value); setTimeout(() => setStep("q2"), 200); }}
                  >
                    <span className="text-2xl">{emoji}</span>
                    <span className="text-sm">{label}</span>
                  </button>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={() => setStep("q2")}>
                スキップ
              </Button>
            </div>
          )}

          {/* Step: Q2 何と合わせた？ */}
          {step === "q2" && (
            <div>
              <div className="grid grid-cols-3 gap-2 py-3">
                {Q2_OPTIONS.map(({ value, emoji, label }) => (
                  <button
                    key={value}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                      pairing === value
                        ? "border-[var(--sake-blue)] bg-[var(--sake-blue-light)]"
                        : "border-border hover:border-[var(--sake-blue)]/50 hover:bg-accent"
                    }`}
                    onClick={() => { setPairing(value); setTimeout(() => setStep("q3"), 200); }}
                  >
                    <span className="text-2xl">{emoji}</span>
                    <span className="text-xs font-medium">{label}</span>
                  </button>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={() => setStep("q3")}>
                スキップ
              </Button>
            </div>
          )}

          {/* Step: Q3 どこが印象的？ */}
          {step === "q3" && (
            <div>
              <div className="grid grid-cols-3 gap-2 py-3">
                {Q3_OPTIONS.map(({ value, emoji, label }) => (
                  <button
                    key={value}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                      impression === value
                        ? "border-[var(--sake-pink)] bg-[var(--sake-pink-light)]"
                        : "border-border hover:border-[var(--sake-pink)]/50 hover:bg-accent"
                    }`}
                    onClick={() => { setImpression(value); setTimeout(() => handleSubmit(), 200); }}
                  >
                    <span className="text-2xl">{emoji}</span>
                    <span className="text-xs font-medium">{label}</span>
                  </button>
                ))}
              </div>
              <Button
                size="sm"
                className="w-full gap-2"
                onClick={handleSubmit}
                disabled={upsertMutation.isPending}
              >
                保存する
              </Button>
            </div>
          )}

          {/* Done */}
          {step === "done" && (
            <div className="flex flex-col items-center gap-3 py-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "var(--sake-blue-light)" }}
              >
                <Check size={28} style={{ color: "var(--sake-blue)" }} />
              </div>
              <p className="font-semibold text-foreground">評価を保存しました</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
