import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Camera, Lock, Globe, Trash2, Star, Share2, LogIn } from "lucide-react";
import { Link } from "wouter";
import RatingModal from "@/components/RatingModal";
import type { IdentifiedSake } from "../../../drizzle/schema";

const SAKE_TYPE_LABELS: Record<string, string> = {
  junmai: "純米酒", tokubetsu_junmai: "特別純米酒",
  junmai_ginjo: "純米吟醸酒", junmai_daiginjo: "純米大吟醸酒",
  honjozo: "本醸造酒", tokubetsu_honjozo: "特別本醸造",
  ginjo: "吟醸酒", daiginjo: "大吟醸酒", other: "その他",
};

export default function MyList() {
  const { isAuthenticated, user } = useAuth();
  const [ratingTarget, setRatingTarget] = useState<{ sake: IdentifiedSake; index: number; recordId: number } | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<number | null>(null);

  const { data: records, refetch } = trpc.sake.myList.useQuery(undefined, { enabled: isAuthenticated });
  const deleteMutation = trpc.sake.delete.useMutation({ onSuccess: () => { refetch(); toast.success("削除しました"); } });
  const visibilityMutation = trpc.sake.setVisibility.useMutation({
    onSuccess: () => { refetch(); toast.success("公開設定を変更しました"); },
    onError: (e) => toast.error(e.message),
  });

  if (!isAuthenticated) {
    return (
      <main className="container py-16 pb-24 md:pb-16 flex flex-col items-center justify-center text-center gap-6">
        <div
          className="w-24 h-24 opacity-60"
          style={{ background: "var(--sake-blue-light)", borderRadius: "40% 60% 60% 40% / 40% 40% 60% 60%" }}
        />
        <div>
          <h1 className="text-2xl font-black tracking-tight mb-2">マイリスト</h1>
          <p className="text-muted-foreground font-light text-sm mb-6">
            識別した日本酒をアーカイブするには<br />ログインが必要です
          </p>
          <Button onClick={() => window.location.href = getLoginUrl()} className="gap-2">
            <LogIn size={16} />
            ログイン / 登録
          </Button>
        </div>
      </main>
    );
  }

  const allSakes = records?.flatMap((record) =>
    (record.identifiedSakes as IdentifiedSake[]).map((sake, i) => ({
      sake,
      sakeIndex: i,
      record,
    }))
  ) ?? [];

  return (
    <main className="container py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1">マイリスト</h1>
          <p className="text-muted-foreground font-light text-sm">
            {allSakes.length}本のお酒を記録中
          </p>
        </div>
        <Link href="/search">
          <Button size="sm" className="gap-2">
            <Camera size={15} />
            追加
          </Button>
        </Link>
      </div>

      {allSakes.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
          <div
            className="w-28 h-28 opacity-50"
            style={{ background: "var(--sake-pink-light)", borderRadius: "60% 40% 40% 60% / 60% 60% 40% 40%" }}
          />
          <div>
            <p className="font-semibold text-lg mb-2">まだ記録がありません</p>
            <p className="text-muted-foreground font-light text-sm mb-4">
              日本酒の写真を撮って、最初の1本を記録しましょう
            </p>
            <Link href="/search">
              <Button className="gap-2">
                <Camera size={16} />
                調べる
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        /* Instagram-style grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {allSakes.map(({ sake, sakeIndex, record }) => (
            <div
              key={`${record.id}-${sakeIndex}`}
              className="group relative bg-card rounded-xl border border-border overflow-hidden cursor-pointer hover:shadow-md transition-all"
              onClick={() => setSelectedRecord(selectedRecord === record.id ? null : record.id)}
            >
              {/* Image */}
              <div className="aspect-square relative overflow-hidden bg-secondary">
                <img
                  src={record.imageUrl}
                  alt={sake.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {/* Visibility badge */}
                <div className="absolute top-2 right-2">
                  {record.isPublic ? (
                    <div className="w-6 h-6 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center">
                      <Globe size={12} className="text-foreground" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-foreground/80 backdrop-blur-sm flex items-center justify-center">
                      <Lock size={12} className="text-background" />
                    </div>
                  )}
                </div>
                {/* Type badge */}
                <div className="absolute bottom-2 left-2">
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ background: "var(--sake-blue-light)", color: "var(--sake-blue)" }}
                  >
                    {SAKE_TYPE_LABELS[sake.type] || "その他"}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="font-bold text-sm leading-tight truncate">{sake.name}</p>
                <p className="text-xs text-muted-foreground font-light truncate">{sake.brewery}</p>
              </div>

              {/* Expanded actions */}
              {selectedRecord === record.id && (
                <div
                  className="border-t border-border p-3 space-y-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full gap-2 text-xs"
                    onClick={() => setRatingTarget({ sake, index: sakeIndex, recordId: record.id })}
                  >
                    <Star size={12} />
                    評価する
                  </Button>
                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-1 text-xs"
                      onClick={() => {
                        const text = `${sake.name}（${sake.brewery}）を飲みました！ #SAKELOG #日本酒`;
                        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
                      }}
                    >
                      <Share2 size={11} />
                      シェア
                    </Button>
                    {user?.isPremium && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-1 text-xs"
                        onClick={() => visibilityMutation.mutate({ recordId: record.id, isPublic: !record.isPublic })}
                      >
                        {record.isPublic ? <Lock size={11} /> : <Globe size={11} />}
                        {record.isPublic ? "非公開" : "公開"}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:text-destructive text-xs px-2"
                      onClick={() => {
                        if (confirm("削除しますか？")) deleteMutation.mutate({ recordId: record.id });
                      }}
                    >
                      <Trash2 size={11} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Rating Modal */}
      {ratingTarget && (
        <RatingModal
          sake={ratingTarget.sake}
          sakeIndex={ratingTarget.index}
          recordId={ratingTarget.recordId}
          onClose={() => setRatingTarget(null)}
        />
      )}
    </main>
  );
}
