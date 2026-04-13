import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LogIn, LogOut, Crown, User, ChevronDown, Check } from "lucide-react";

const GENDER_OPTIONS = [
  { value: "male", label: "男性" },
  { value: "female", label: "女性" },
  { value: "other", label: "その他" },
  { value: "prefer_not_to_say", label: "回答しない" },
];

const AGE_OPTIONS = [
  { value: "teens", label: "10代" },
  { value: "twenties", label: "20代" },
  { value: "thirties", label: "30代" },
  { value: "forties", label: "40代" },
  { value: "fifties", label: "50代" },
  { value: "sixties_plus", label: "60代以上" },
];

const PREFECTURES = [
  "北海道", "青森", "岩手", "宮城", "秋田", "山形", "福島",
  "茨城", "栃木", "群馬", "埼玉", "千葉", "東京", "神奈川",
  "新潟", "富山", "石川", "福井", "山梨", "長野", "岐阜", "静岡", "愛知",
  "三重", "滋賀", "京都", "大阪", "兵庫", "奈良", "和歌山",
  "鳥取", "島根", "岡山", "広島", "山口", "徳島", "香川", "愛媛", "高知",
  "福岡", "佐賀", "長崎", "熊本", "大分", "宮崎", "鹿児島", "沖縄",
];

export default function Profile() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [nickname, setNickname] = useState(user?.nickname || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [ageGroup, setAgeGroup] = useState(user?.ageGroup || "");
  const [prefecture, setPrefecture] = useState(user?.prefecture || "");
  const [country, setCountry] = useState(user?.country || "Japan");
  const [saved, setSaved] = useState(false);

  const updateMutation = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      setSaved(true);
      toast.success("プロフィールを更新しました");
      setTimeout(() => setSaved(false), 2000);
    },
    onError: () => toast.error("更新に失敗しました"),
  });

  const { data: myList } = trpc.sake.myList.useQuery(undefined, { enabled: isAuthenticated });

  if (loading) {
    return (
      <main className="container py-16 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--sake-blue)] border-t-transparent animate-spin" />
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="container py-16 pb-24 md:pb-16 flex flex-col items-center justify-center text-center gap-6">
        <div
          className="w-24 h-24 opacity-60"
          style={{ background: "var(--sake-pink-light)", borderRadius: "60% 40% 40% 60% / 60% 60% 40% 40%" }}
        />
        <div>
          <h1 className="text-2xl font-black tracking-tight mb-2">プロフィール</h1>
          <p className="text-muted-foreground font-light text-sm mb-6">
            ログインしてプロフィールを管理しましょう
          </p>
          <Button onClick={() => window.location.href = getLoginUrl()} className="gap-2">
            <LogIn size={16} />
            ログイン / 登録
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-8 pb-24 md:pb-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight mb-1">プロフィール</h1>
        <p className="text-muted-foreground font-light text-sm">アカウント情報と設定</p>
      </div>

      {/* User card */}
      <div className="bg-card rounded-2xl border border-border p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black"
            style={{ background: "var(--sake-blue-light)", color: "var(--sake-blue)" }}
          >
            {(user?.nickname || user?.name || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-xl">{user?.nickname || user?.name || "ユーザー"}</h2>
              {user?.isPremium && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{ background: "var(--sake-pink-light)", color: "var(--sake-pink)" }}
                >
                  <Crown size={10} />
                  プレミアム
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground font-light">{user?.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <p className="text-2xl font-black">{myList?.length ?? 0}</p>
            <p className="text-xs text-muted-foreground font-light">アーカイブ数</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black">{user?.isPremium ? "有料" : "無料"}</p>
            <p className="text-xs text-muted-foreground font-light">プラン</p>
          </div>
        </div>
      </div>

      {/* Plan info */}
      {!user?.isPremium && (
        <div
          className="rounded-2xl p-5 mb-6 border"
          style={{ background: "var(--sake-blue-light)", borderColor: "var(--sake-blue-light)" }}
        >
          <div className="flex items-start gap-3">
            <Crown size={20} style={{ color: "var(--sake-blue)" }} className="flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm mb-1">プレミアムプランにアップグレード</h3>
              <p className="text-xs text-muted-foreground font-light leading-relaxed mb-3">
                有料会員になると、アーカイブを非公開に設定できます。
                現在の無料プランでは、識別結果・アーカイブが公開設定となります。
              </p>
              <Button size="sm" className="gap-2 text-xs">
                <Crown size={12} />
                アップグレード（近日公開）
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Profile form */}
      <div className="bg-card rounded-2xl border border-border p-6 mb-6">
        <h3 className="font-bold text-lg mb-5">プロフィール編集</h3>
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-1.5 block">ニックネーム</Label>
            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="ニックネームを入力"
              maxLength={64}
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-1.5 block">性別</Label>
            <div className="grid grid-cols-2 gap-2">
              {GENDER_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  className={`px-3 py-2 rounded-xl border text-sm font-medium transition-colors ${
                    gender === value
                      ? "border-[var(--sake-blue)] bg-[var(--sake-blue-light)] text-foreground"
                      : "border-border hover:bg-accent text-muted-foreground"
                  }`}
                  onClick={() => setGender(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-1.5 block">年代</Label>
            <div className="grid grid-cols-3 gap-2">
              {AGE_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  className={`px-3 py-2 rounded-xl border text-sm font-medium transition-colors ${
                    ageGroup === value
                      ? "border-[var(--sake-blue)] bg-[var(--sake-blue-light)] text-foreground"
                      : "border-border hover:bg-accent text-muted-foreground"
                  }`}
                  onClick={() => setAgeGroup(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-1.5 block">都道府県</Label>
            <div className="relative">
              <select
                value={prefecture}
                onChange={(e) => setPrefecture(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm appearance-none cursor-pointer pr-8"
              >
                <option value="">選択してください</option>
                {PREFECTURES.map((pref) => (
                  <option key={pref} value={pref}>{pref}</option>
                ))}
              </select>
              <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-1.5 block">国</Label>
            <Input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="国名を入力（例: Japan）"
            />
          </div>

          <Button
            className="w-full gap-2 font-semibold"
            onClick={() => updateMutation.mutate({
              nickname: nickname || undefined,
              gender: gender as any || undefined,
              ageGroup: ageGroup as any || undefined,
              prefecture: prefecture || undefined,
              country: country || undefined,
            })}
            disabled={updateMutation.isPending}
          >
            {saved ? <><Check size={16} />保存しました</> : "プロフィールを保存"}
          </Button>
        </div>
      </div>

      {/* Logout */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="font-bold text-lg mb-3">アカウント</h3>
        <Button
          variant="outline"
          className="gap-2 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5"
          onClick={() => { logout(); toast.success("ログアウトしました"); }}
        >
          <LogOut size={16} />
          ログアウト
        </Button>
      </div>
    </main>
  );
}
