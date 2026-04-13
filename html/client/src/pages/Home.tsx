import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Camera, LayoutGrid, Trophy, Sparkles } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

const features = [
  {
    icon: Camera,
    title: "写真1枚で即識別",
    desc: "ボトルやラベルを撮影するだけ。AIが銘柄・種別・産地を瞬時に解析します。",
    accent: "blue",
  },
  {
    icon: LayoutGrid,
    title: "マイリストで管理",
    desc: "飲んだ日本酒をインスタ風グリッドでアーカイブ。評価とリアクションも3秒で入力。",
    accent: "pink",
  },
  {
    icon: Trophy,
    title: "ランキングで発見",
    desc: "種別・地域・年代別のランキングで、新しいお気に入りを見つけましょう。",
    accent: "blue",
  },
];

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="pb-20 md:pb-0">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Geometric accents */}
        <div
          className="absolute top-8 right-8 w-48 h-48 opacity-40 pointer-events-none"
          style={{
            background: "var(--sake-blue-light)",
            borderRadius: "40% 60% 60% 40% / 40% 40% 60% 60%",
          }}
        />
        <div
          className="absolute bottom-12 left-4 w-32 h-32 opacity-30 pointer-events-none"
          style={{
            background: "var(--sake-pink-light)",
            borderRadius: "60% 40% 40% 60% / 60% 60% 40% 40%",
          }}
        />

        <div className="container py-16 md:py-24 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--sake-blue-light)] text-[var(--sake-blue)] text-xs font-semibold mb-6">
              <Sparkles size={12} />
              AI日本酒識別
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground leading-none mb-6">
              SAKE<br />
              <span className="font-light text-muted-foreground">LOG</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-8 max-w-lg">
              日本酒のボトルを撮るだけ。<br />
              AIが銘柄・種別・特徴を即座に識別し、<br />
              あなたの日本酒ライフを記録します。
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/search">
                <Button size="lg" className="gap-2 font-semibold">
                  <Camera size={18} />
                  今すぐ調べる
                  <ArrowRight size={16} />
                </Button>
              </Link>
              {!isAuthenticated && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => window.location.href = getLoginUrl()}
                  className="font-semibold"
                >
                  アカウント登録（無料）
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              ※ アカウント不要で「調べる」機能はすぐに利用できます
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc, accent }) => (
            <div
              key={title}
              className="bg-card rounded-2xl p-6 border border-border hover:shadow-md transition-shadow"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{
                  background: accent === "blue" ? "var(--sake-blue-light)" : "var(--sake-pink-light)",
                }}
              >
                <Icon
                  size={22}
                  style={{ color: accent === "blue" ? "var(--sake-blue)" : "var(--sake-pink)" }}
                />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-light">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container py-16 border-t border-border">
        <h2 className="text-3xl font-black tracking-tight mb-12">
          使い方
          <span className="text-muted-foreground font-light ml-3 text-xl">How it works</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "写真を撮る", desc: "日本酒のボトルやラベルを撮影。1枚に最大3本まで対応。" },
            { step: "02", title: "AIが識別", desc: "銘柄・種別・産地・精米歩合などを即座に解析・表示。" },
            { step: "03", title: "記録・シェア", desc: "評価やリアクションを付けてアーカイブ。SNSにもシェア可能。" },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-4">
              <div className="flex-shrink-0">
                <span className="text-5xl font-black text-border">{step}</span>
              </div>
              <div className="pt-2">
                <h3 className="font-bold text-lg mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16">
        <div
          className="rounded-2xl p-8 md:p-12 relative overflow-hidden"
          style={{ background: "var(--sake-blue-light)" }}
        >
          <div
            className="absolute -right-8 -top-8 w-40 h-40 opacity-50"
            style={{
              background: "var(--sake-pink-light)",
              borderRadius: "60% 40% 40% 60% / 60% 60% 40% 40%",
            }}
          />
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-3 text-foreground">
              さっそく試してみよう
            </h2>
            <p className="text-muted-foreground font-light mb-6">
              アカウント登録不要。今すぐ日本酒を識別できます。
            </p>
            <Link href="/search">
              <Button size="lg" className="gap-2 font-semibold">
                <Camera size={18} />
                調べる
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
