import { Star, MapPin, Droplets, Wheat } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { IdentifiedSake } from "../../../drizzle/schema";

const SAKE_TYPE_LABELS: Record<string, string> = {
  junmai: "純米酒",
  tokubetsu_junmai: "特別純米酒",
  junmai_ginjo: "純米吟醸酒",
  junmai_daiginjo: "純米大吟醸酒",
  honjozo: "本醸造酒",
  tokubetsu_honjozo: "特別本醸造",
  ginjo: "吟醸酒",
  daiginjo: "大吟醸酒",
  other: "その他",
};

interface Props {
  sake: IdentifiedSake;
  onRate?: () => void;
  recordId?: number | null;
  compact?: boolean;
}

export default function SakeResultCard({ sake, onRate, recordId, compact }: Props) {
  const confidencePct = Math.round(sake.confidence * 100);

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                style={{
                  background: "var(--sake-blue-light)",
                  color: "var(--sake-blue)",
                }}
              >
                {SAKE_TYPE_LABELS[sake.type] || "その他"}
              </span>
              {sake.confidence > 0 && (
                <span className="text-xs text-muted-foreground">
                  識別精度 {confidencePct}%
                </span>
              )}
            </div>
            <h3 className="font-black text-xl tracking-tight text-foreground leading-tight">
              {sake.name}
            </h3>
            <p className="text-sm text-muted-foreground font-light">{sake.brewery}</p>
          </div>
          {/* Confidence indicator */}
          {sake.confidence > 0 && (
            <div className="flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold"
              style={{
                borderColor: sake.confidence > 0.7 ? "var(--sake-blue)" : sake.confidence > 0.4 ? "var(--sake-pink)" : "var(--border)",
                color: sake.confidence > 0.7 ? "var(--sake-blue)" : sake.confidence > 0.4 ? "var(--sake-pink)" : "var(--muted-foreground)",
              }}
            >
              {confidencePct}
            </div>
          )}
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {sake.prefecture && sake.prefecture !== "不明" && (
            <span className="flex items-center gap-1">
              <MapPin size={11} />
              {sake.prefecture}
            </span>
          )}
          {sake.alcoholContent && (
            <span className="flex items-center gap-1">
              <Droplets size={11} />
              {sake.alcoholContent}
            </span>
          )}
          {sake.ricePoliching && (
            <span className="flex items-center gap-1">
              <Wheat size={11} />
              精米歩合 {sake.ricePoliching}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      {!compact && (
        <div className="px-5 pb-4">
          {sake.flavor && (
            <div className="mb-2">
              <span
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mr-2"
                style={{ background: "var(--sake-pink-light)", color: "var(--sake-pink)" }}
              >
                {sake.flavor}
              </span>
            </div>
          )}
          <p className="text-sm text-muted-foreground font-light leading-relaxed">
            {sake.description}
          </p>
          {sake.pairingFood && sake.pairingFood.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="text-xs text-muted-foreground mr-1">合う料理:</span>
              {sake.pairingFood.map((food) => (
                <span
                  key={food}
                  className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                >
                  {food}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      {onRate && recordId && (
        <div className="px-5 pb-5 pt-1 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 w-full font-medium"
            onClick={onRate}
          >
            <Star size={14} />
            評価・リアクションを入力
          </Button>
        </div>
      )}
    </div>
  );
}
