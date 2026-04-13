import { useState, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Camera, Upload, X, Loader2, Bookmark, Share2, Star } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import SakeResultCard from "@/components/SakeResultCard";
import RatingModal from "@/components/RatingModal";
import ShareModal from "@/components/ShareModal";
import type { IdentifiedSake } from "../../../drizzle/schema";

export default function Search() {
  const { isAuthenticated } = useAuth();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string>("image/jpeg");
  const [isDragging, setIsDragging] = useState(false);
  const [results, setResults] = useState<IdentifiedSake[] | null>(null);
  const [recordId, setRecordId] = useState<number | null>(null);
  const [isArchived, setIsArchived] = useState(false);
  const [ratingTarget, setRatingTarget] = useState<{ sake: IdentifiedSake; index: number } | null>(null);
  const [shareTarget, setShareTarget] = useState<IdentifiedSake | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = trpc.sake.uploadImage.useMutation();
  const identifyMutation = trpc.sake.identify.useMutation();
  const archiveMutation = trpc.sake.archive.useMutation();

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("画像ファイルを選択してください");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("ファイルサイズは10MB以下にしてください");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);
      const base64 = dataUrl.split(",")[1];
      setImageBase64(base64);
      setImageMime(file.type);
      setResults(null);
      setRecordId(null);
      setIsArchived(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleIdentify = async () => {
    if (!imageBase64) return;
    try {
      const { url } = await uploadMutation.mutateAsync({ base64: imageBase64, mimeType: imageMime });
      const { sakes, recordId: rid } = await identifyMutation.mutateAsync({ imageUrl: url });
      setResults(sakes);
      setRecordId(rid ?? null);
    } catch (err) {
      toast.error("識別に失敗しました。もう一度お試しください。");
    }
  };

  const handleArchive = async () => {
    if (!recordId) return;
    if (!isAuthenticated) {
      toast.info("アーカイブするにはログインが必要です");
      window.location.href = getLoginUrl();
      return;
    }
    try {
      await archiveMutation.mutateAsync({ recordId });
      setIsArchived(true);
      toast.success("マイリストに保存しました");
    } catch {
      toast.error("保存に失敗しました");
    }
  };

  const handleShare = () => {
    if (!results || results.length === 0) return;
    setShareTarget(results[0]);
  };

  const isLoading = uploadMutation.isPending || identifyMutation.isPending;

  return (
    <main className="container py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight mb-1">調べる</h1>
        <p className="text-muted-foreground font-light text-sm">
          日本酒のボトルやラベルを撮影・アップロードしてAIで識別
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Area */}
        <div>
          {!imagePreview ? (
            <div
              className={`relative border-2 border-dashed rounded-2xl transition-colors cursor-pointer ${
                isDragging
                  ? "border-[var(--sake-blue)] bg-[var(--sake-blue-light)]"
                  : "border-border hover:border-[var(--sake-blue)] hover:bg-[var(--sake-blue-light)]/30"
              }`}
              style={{ minHeight: 320 }}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
                {/* Geometric decoration */}
                <div className="relative">
                  <div
                    className="absolute -inset-4 opacity-40"
                    style={{
                      background: "var(--sake-blue-light)",
                      borderRadius: "40% 60% 60% 40% / 40% 40% 60% 60%",
                    }}
                  />
                  <div className="relative w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center shadow-sm">
                    <Upload size={28} className="text-muted-foreground" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground mb-1">画像をドロップ</p>
                  <p className="text-sm text-muted-foreground font-light">またはタップして選択</p>
                  <p className="text-xs text-muted-foreground mt-2">1枚に最大3本まで対応 · JPG / PNG / WebP · 10MB以下</p>
                </div>
                <Button variant="outline" size="sm" className="gap-2 pointer-events-none">
                  <Camera size={15} />
                  写真を選択
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-border bg-card">
              <img
                src={imagePreview}
                alt="アップロード画像"
                className="w-full object-contain max-h-80"
              />
              <button
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/90 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-background transition-colors"
                onClick={() => { setImagePreview(null); setImageBase64(null); setResults(null); setRecordId(null); setIsArchived(false); }}
              >
                <X size={16} />
              </button>
              <div className="p-4 flex gap-3">
                <Button
                  className="flex-1 gap-2 font-semibold"
                  onClick={handleIdentify}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <><Loader2 size={16} className="animate-spin" />識別中...</>
                  ) : (
                    <><Camera size={16} />AIで識別する</>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => { setImagePreview(null); setImageBase64(null); setResults(null); setRecordId(null); setIsArchived(false); }}
                >
                  <X size={16} />
                </Button>
              </div>
            </div>
          )}

          {/* Action buttons after results */}
          {results && recordId && (
            <div className="flex gap-3 mt-4">
              <Button
                variant={isArchived ? "secondary" : "default"}
                className="flex-1 gap-2 font-semibold"
                onClick={handleArchive}
                disabled={isArchived || archiveMutation.isPending}
              >
                <Bookmark size={16} className={isArchived ? "fill-current" : ""} />
                {isArchived ? "保存済み" : "マイリストに保存"}
              </Button>
              <Button variant="outline" className="gap-2" onClick={handleShare}>
                <Share2 size={16} />
                シェア
              </Button>
            </div>
          )}
        </div>

        {/* Results */}
        <div>
          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <div className="relative">
                <div
                  className="absolute -inset-4 opacity-50 animate-pulse"
                  style={{
                    background: "var(--sake-blue-light)",
                    borderRadius: "40% 60% 60% 40% / 40% 40% 60% 60%",
                  }}
                />
                <Loader2 size={32} className="relative animate-spin text-[var(--sake-blue)]" />
              </div>
              <p className="text-muted-foreground font-light text-sm">AIが識別中です...</p>
            </div>
          )}

          {!isLoading && !results && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div
                className="w-20 h-20 opacity-60"
                style={{
                  background: "var(--sake-pink-light)",
                  borderRadius: "60% 40% 40% 60% / 60% 60% 40% 40%",
                }}
              />
              <p className="text-muted-foreground font-light text-sm mt-2">
                画像をアップロードすると<br />識別結果がここに表示されます
              </p>
            </div>
          )}

          {!isLoading && results && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg">
                  識別結果
                  <span className="text-muted-foreground font-light text-sm ml-2">{results.length}件</span>
                </h2>
              </div>
              {results.map((sake, i) => (
                <SakeResultCard
                  key={i}
                  sake={sake}
                  onRate={() => setRatingTarget({ sake, index: i })}
                  recordId={recordId}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Rating Modal */}
      {ratingTarget && recordId && (
        <RatingModal
          sake={ratingTarget.sake}
          sakeIndex={ratingTarget.index}
          recordId={recordId}
          onClose={() => setRatingTarget(null)}
        />
      )}

      {/* Share Modal */}
      {shareTarget && (
        <ShareModal
          sake={shareTarget}
          onClose={() => setShareTarget(null)}
        />
      )}
    </main>
  );
}
