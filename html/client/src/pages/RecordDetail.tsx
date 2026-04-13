import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useParams, Link } from "wouter";
import { ArrowLeft, Share2, Star, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import SakeResultCard from "@/components/SakeResultCard";
import RatingModal from "@/components/RatingModal";
import { useAuth } from "@/_core/hooks/useAuth";
import type { IdentifiedSake } from "../../../drizzle/schema";
import { toast } from "sonner";

export default function RecordDetail() {
  const params = useParams<{ id: string }>();
  const recordId = parseInt(params.id || "0");
  const { isAuthenticated } = useAuth();
  const [ratingTarget, setRatingTarget] = useState<{ sake: IdentifiedSake; index: number } | null>(null);

  const { data: record, isLoading } = trpc.sake.getRecord.useQuery({ recordId }, { enabled: !!recordId });

  const handleShare = (sake: IdentifiedSake) => {
    const text = `${sake.name}（${sake.brewery}）を飲みました！ #SAKELOG #日本酒`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  if (isLoading) {
    return (
      <main className="container py-8">
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-48 bg-secondary rounded-2xl animate-pulse" />
          ))}
        </div>
      </main>
    );
  }

  if (!record) {
    return (
      <main className="container py-16 text-center">
        <p className="text-muted-foreground">レコードが見つかりませんでした</p>
        <Link href="/search">
          <Button variant="outline" className="mt-4">調べるに戻る</Button>
        </Link>
      </main>
    );
  }

  const sakes = record.identifiedSakes as IdentifiedSake[];

  return (
    <main className="container py-8 pb-24 md:pb-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/mylist">
          <button className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-accent transition-colors">
            <ArrowLeft size={17} />
          </button>
        </Link>
        <div>
          <h1 className="font-black text-xl tracking-tight">識別結果</h1>
          <p className="text-xs text-muted-foreground font-light">
            {new Date(record.createdAt).toLocaleDateString("ja-JP")}
          </p>
        </div>
      </div>

      {/* Original image */}
      <div className="rounded-2xl overflow-hidden border border-border mb-6">
        <img src={record.imageUrl} alt="日本酒" className="w-full object-contain max-h-64" />
      </div>

      {/* Sake cards */}
      <div className="space-y-4">
        {sakes.map((sake, i) => (
          <SakeResultCard
            key={i}
            sake={sake}
            onRate={isAuthenticated ? () => setRatingTarget({ sake, index: i }) : undefined}
            recordId={recordId}
          />
        ))}
      </div>

      {/* Share */}
      <div className="mt-6 flex gap-3">
        {sakes.map((sake, i) => (
          <Button
            key={i}
            variant="outline"
            className="flex-1 gap-2 text-sm"
            onClick={() => handleShare(sake)}
          >
            <Share2 size={15} />
            {sakes.length > 1 ? `${sake.name}をシェア` : "シェア"}
          </Button>
        ))}
      </div>

      {/* Rating Modal */}
      {ratingTarget && (
        <RatingModal
          sake={ratingTarget.sake}
          sakeIndex={ratingTarget.index}
          recordId={recordId}
          onClose={() => setRatingTarget(null)}
        />
      )}
    </main>
  );
}
