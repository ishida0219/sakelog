import { useState, useRef } from "react";
import { X, Download, Share2, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { IdentifiedSake } from "../../../drizzle/schema";

const SAKE_TYPE_LABELS: Record<string, string> = {
  junmai: "純米酒", tokubetsu_junmai: "特別純米酒",
  junmai_ginjo: "純米吟醸酒", junmai_daiginjo: "純米大吟醸酒",
  honjozo: "本醸造酒", tokubetsu_honjozo: "特別本醸造",
  ginjo: "吟醸酒", daiginjo: "大吟醸酒", other: "その他",
};

interface Props {
  sake: IdentifiedSake;
  imageUrl?: string;
  onClose: () => void;
}

export default function ShareModal({ sake, imageUrl, onClose }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [cardImageUrl, setCardImageUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateShareImage = async () => {
    setIsGenerating(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 800;
      const ctx = canvas.getContext("2d")!;

      // Background - cool grey
      ctx.fillStyle = "#F0F2F5";
      ctx.fillRect(0, 0, 800, 800);

      // Geometric accent - blue blob
      ctx.fillStyle = "rgba(180, 210, 240, 0.5)";
      ctx.beginPath();
      ctx.ellipse(680, 120, 160, 140, 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Geometric accent - pink blob
      ctx.fillStyle = "rgba(240, 200, 210, 0.4)";
      ctx.beginPath();
      ctx.ellipse(120, 680, 120, 110, -0.3, 0, Math.PI * 2);
      ctx.fill();

      // Logo
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(50, 50, 36, 36);
      ctx.fillStyle = "#F0F2F5";
      ctx.font = "bold 18px 'Inter', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("S", 68, 74);
      ctx.fillStyle = "#1a1a2e";
      ctx.font = "bold 20px 'Inter', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("SAKELOG", 96, 74);

      // Sake type badge
      ctx.fillStyle = "rgba(180, 210, 240, 0.7)";
      ctx.beginPath();
      ctx.roundRect(50, 130, 160, 32, 16);
      ctx.fill();
      ctx.fillStyle = "#2563eb";
      ctx.font = "bold 14px 'Noto Sans JP', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(SAKE_TYPE_LABELS[sake.type] || "その他", 130, 151);

      // Sake name
      ctx.fillStyle = "#1a1a2e";
      ctx.font = "bold 52px 'Noto Sans JP', sans-serif";
      ctx.textAlign = "left";
      const name = sake.name.length > 8 ? sake.name.substring(0, 8) + "…" : sake.name;
      ctx.fillText(name, 50, 240);

      // Brewery
      ctx.fillStyle = "#666";
      ctx.font = "300 24px 'Noto Sans JP', sans-serif";
      ctx.fillText(sake.brewery, 50, 285);

      // Divider
      ctx.strokeStyle = "#ddd";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(50, 320);
      ctx.lineTo(750, 320);
      ctx.stroke();

      // Details
      const details = [
        { label: "産地", value: sake.prefecture || "不明" },
        { label: "アルコール", value: sake.alcoholContent || "-" },
        { label: "精米歩合", value: sake.ricePoliching || "-" },
      ];
      details.forEach((d, i) => {
        const x = 50 + i * 240;
        ctx.fillStyle = "#999";
        ctx.font = "300 14px 'Inter', sans-serif";
        ctx.fillText(d.label, x, 360);
        ctx.fillStyle = "#1a1a2e";
        ctx.font = "bold 20px 'Noto Sans JP', sans-serif";
        ctx.fillText(d.value, x, 390);
      });

      // Description
      if (sake.description) {
        ctx.fillStyle = "#555";
        ctx.font = "300 16px 'Noto Sans JP', sans-serif";
        const words = sake.description;
        const maxWidth = 700;
        const lineHeight = 26;
        let y = 450;
        // Simple word wrap
        let line = "";
        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i];
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && i > 0) {
            ctx.fillText(line, 50, y);
            line = words[i];
            y += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, 50, y);
      }

      // Pairing food
      if (sake.pairingFood && sake.pairingFood.length > 0) {
        ctx.fillStyle = "#999";
        ctx.font = "300 13px 'Inter', sans-serif";
        ctx.fillText("おすすめ料理", 50, 640);
        sake.pairingFood.slice(0, 3).forEach((food, i) => {
          ctx.fillStyle = "rgba(240, 200, 210, 0.6)";
          ctx.beginPath();
          ctx.roundRect(50 + i * 120, 655, 110, 30, 15);
          ctx.fill();
          ctx.fillStyle = "#c2185b";
          ctx.font = "500 13px 'Noto Sans JP', sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(food, 105 + i * 120, 675);
          ctx.textAlign = "left";
        });
      }

      // Footer
      ctx.fillStyle = "#bbb";
      ctx.font = "300 13px 'Inter', sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("#SAKELOG  #日本酒", 750, 760);

      const dataUrl = canvas.toDataURL("image/png");
      setCardImageUrl(dataUrl);
    } catch (err) {
      console.error(err);
      toast.error("画像生成に失敗しました");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!cardImageUrl) return;
    const a = document.createElement("a");
    a.href = cardImageUrl;
    a.download = `sakelog-${sake.name}.png`;
    a.click();
    toast.success("画像を保存しました");
  };

  const handleTwitterShare = () => {
    const text = `${sake.name}（${sake.brewery}）を飲みました！\n${SAKE_TYPE_LABELS[sake.type] || ""} ${sake.prefecture || ""}\n#SAKELOG #日本酒`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleInstagramShare = async () => {
    if (!cardImageUrl) {
      toast.info("まず「シェア画像を生成」してから画像を保存し、Instagramに投稿してください");
      return;
    }
    // Web Share API (mobile)
    if (navigator.share && navigator.canShare) {
      try {
        const blob = await (await fetch(cardImageUrl)).blob();
        const file = new File([blob], `sakelog-${sake.name}.png`, { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: sake.name, text: `#SAKELOG #日本酒` });
          return;
        }
      } catch {}
    }
    // Fallback: download + guide
    handleDownload();
    toast.info("画像を保存しました。Instagramアプリから投稿してください");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-2xl border border-border shadow-xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 pb-3">
          <h3 className="font-black text-lg tracking-tight">シェア</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-accent transition-colors">
            <X size={15} />
          </button>
        </div>

        <div className="px-5 pb-5 space-y-3">
          {/* Preview */}
          {cardImageUrl && (
            <div className="rounded-xl overflow-hidden border border-border">
              <img src={cardImageUrl} alt="シェア画像" className="w-full" />
            </div>
          )}

          {!cardImageUrl && (
            <Button
              className="w-full gap-2"
              variant="outline"
              onClick={generateShareImage}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />生成中...</>
              ) : (
                <><Share2 size={16} />シェア画像を生成</>
              )}
            </Button>
          )}

          {cardImageUrl && (
            <Button variant="outline" className="w-full gap-2" onClick={handleDownload}>
              <Download size={16} />
              画像を保存
            </Button>
          )}

          <Button className="w-full gap-2" onClick={handleTwitterShare}>
            <Twitter size={16} />
            X（Twitter）でシェア
          </Button>

          <Button
            className="w-full gap-2"
            style={{ background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)", color: "white", border: "none" }}
            onClick={handleInstagramShare}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Instagramでシェア
          </Button>
        </div>
      </div>
    </div>
  );
}
