import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Trophy, Filter, Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { IdentifiedSake } from "../../../drizzle/schema";

const SAKE_TYPES = [
  { value: "", label: "すべて" },
  { value: "junmai", label: "純米酒" },
  { value: "tokubetsu_junmai", label: "特別純米酒" },
  { value: "junmai_ginjo", label: "純米吟醸酒" },
  { value: "junmai_daiginjo", label: "純米大吟醸酒" },
  { value: "honjozo", label: "本醸造酒" },
  { value: "tokubetsu_honjozo", label: "特別本醸造" },
  { value: "ginjo", label: "吟醸酒" },
  { value: "daiginjo", label: "大吟醸酒" },
  { value: "other", label: "その他" },
];

const GENDERS = [
  { value: "", label: "すべて" },
  { value: "male", label: "男性" },
  { value: "female", label: "女性" },
  { value: "other", label: "その他" },
];

const AGE_GROUPS = [
  { value: "", label: "すべて" },
  { value: "teens", label: "10代" },
  { value: "twenties", label: "20代" },
  { value: "thirties", label: "30代" },
  { value: "forties", label: "40代" },
  { value: "fifties", label: "50代" },
  { value: "sixties_plus", label: "60代以上" },
];

const PREFECTURES = [
  "", "北海道", "青森", "岩手", "宮城", "秋田", "山形", "福島",
  "茨城", "栃木", "群馬", "埼玉", "千葉", "東京", "神奈川",
  "新潟", "富山", "石川", "福井", "山梨", "長野", "岐阜", "静岡", "愛知",
  "三重", "滋賀", "京都", "大阪", "兵庫", "奈良", "和歌山",
  "鳥取", "島根", "岡山", "広島", "山口", "徳島", "香川", "愛媛", "高知",
  "福岡", "佐賀", "長崎", "熊本", "大分", "宮崎", "鹿児島", "沖縄",
];

const COUNTRIES = [
  { value: "", label: "すべての国" },
  { value: "Japan", label: "日本" },
  { value: "USA", label: "アメリカ" },
  { value: "France", label: "フランス" },
  { value: "UK", label: "イギリス" },
  { value: "Australia", label: "オーストラリア" },
  { value: "Other", label: "その他" },
];

type FilterCategory = "type" | "gender" | "age" | "prefecture" | "country";

export default function Ranking() {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("type");
  const [filters, setFilters] = useState({
    sakeType: "",
    gender: "",
    ageGroup: "",
    prefecture: "",
    country: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data: rankings, isLoading } = trpc.ranking.get.useQuery({
    sakeType: filters.sakeType || undefined,
    gender: filters.gender || undefined,
    ageGroup: filters.ageGroup || undefined,
    prefecture: filters.prefecture || undefined,
    country: filters.country || undefined,
    limit: 20,
  });

  const categoryTabs: { key: FilterCategory; label: string }[] = [
    { key: "type", label: "種別" },
    { key: "gender", label: "性別" },
    { key: "age", label: "年代" },
    { key: "prefecture", label: "都道府県" },
    { key: "country", label: "国別" },
  ];

  const renderFilterOptions = () => {
    switch (activeCategory) {
      case "type":
        return SAKE_TYPES.map(({ value, label }) => (
          <button
            key={value}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              filters.sakeType === value
                ? "bg-foreground text-background"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
            onClick={() => setFilters(f => ({ ...f, sakeType: value }))}
          >
            {label}
          </button>
        ));
      case "gender":
        return GENDERS.map(({ value, label }) => (
          <button
            key={value}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              filters.gender === value
                ? "bg-foreground text-background"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
            onClick={() => setFilters(f => ({ ...f, gender: value }))}
          >
            {label}
          </button>
        ));
      case "age":
        return AGE_GROUPS.map(({ value, label }) => (
          <button
            key={value}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              filters.ageGroup === value
                ? "bg-foreground text-background"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
            onClick={() => setFilters(f => ({ ...f, ageGroup: value }))}
          >
            {label}
          </button>
        ));
      case "prefecture":
        return PREFECTURES.map((pref) => (
          <button
            key={pref}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              filters.prefecture === pref
                ? "bg-foreground text-background"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
            onClick={() => setFilters(f => ({ ...f, prefecture: pref }))}
          >
            {pref || "すべて"}
          </button>
        ));
      case "country":
        return COUNTRIES.map(({ value, label }) => (
          <button
            key={value}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              filters.country === value
                ? "bg-foreground text-background"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
            onClick={() => setFilters(f => ({ ...f, country: value }))}
          >
            {label}
          </button>
        ));
    }
  };

  const SAKE_TYPE_LABELS: Record<string, string> = {
    junmai: "純米酒", tokubetsu_junmai: "特別純米酒",
    junmai_ginjo: "純米吟醸酒", junmai_daiginjo: "純米大吟醸酒",
    honjozo: "本醸造酒", tokubetsu_honjozo: "特別本醸造",
    ginjo: "吟醸酒", daiginjo: "大吟醸酒", other: "その他",
  };

  const medalColors = ["text-yellow-500", "text-slate-400", "text-amber-600"];
  const medalBg = ["bg-yellow-50 border-yellow-200", "bg-slate-50 border-slate-200", "bg-amber-50 border-amber-200"];

  return (
    <main className="container py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1 flex items-center gap-3">
            <Trophy size={28} className="text-yellow-500" />
            ランキング
          </h1>
          <p className="text-muted-foreground font-light text-sm">
            みんなの評価をもとにした日本酒ランキング
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={15} />
          フィルター
          <ChevronDown size={13} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </Button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-card rounded-2xl border border-border p-5 mb-6">
          {/* Category tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {categoryTabs.map(({ key, label }) => (
              <button
                key={key}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
                  activeCategory === key
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
                onClick={() => setActiveCategory(key)}
              >
                {label}
              </button>
            ))}
          </div>
          {/* Options */}
          <div className="flex flex-wrap gap-2">
            {renderFilterOptions()}
          </div>
        </div>
      )}

      {/* Rankings */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-secondary rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : !rankings || rankings.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div
            className="w-24 h-24 opacity-50"
            style={{ background: "var(--sake-blue-light)", borderRadius: "40% 60% 60% 40% / 40% 40% 60% 60%" }}
          />
          <div>
            <p className="font-semibold text-lg mb-1">まだランキングデータがありません</p>
            <p className="text-muted-foreground font-light text-sm">
              日本酒を識別・評価するとランキングに反映されます
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {rankings.map((item: any, index: number) => {
            const sake = item.sake as IdentifiedSake;
            if (!sake) return null;
            const rank = index + 1;
            const isTop3 = rank <= 3;

            return (
              <div
                key={`${item.sakeRecordId}-${item.sakeIndex}`}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-shadow hover:shadow-sm ${
                  isTop3 ? medalBg[rank - 1] : "bg-card border-border"
                }`}
              >
                {/* Rank */}
                <div className="flex-shrink-0 w-10 text-center">
                  {isTop3 ? (
                    <Trophy size={22} className={medalColors[rank - 1]} />
                  ) : (
                    <span className="text-lg font-black text-muted-foreground">{rank}</span>
                  )}
                </div>

                {/* Image */}
                <div className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-secondary">
                  <img
                    src={item.record?.imageUrl}
                    alt={sake.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                      style={{ background: "var(--sake-blue-light)", color: "var(--sake-blue)" }}
                    >
                      {SAKE_TYPE_LABELS[sake.type] || "その他"}
                    </span>
                    {sake.prefecture && sake.prefecture !== "不明" && (
                      <span className="text-[10px] text-muted-foreground">{sake.prefecture}</span>
                    )}
                  </div>
                  <p className="font-bold text-sm leading-tight truncate">{sake.name}</p>
                  <p className="text-xs text-muted-foreground font-light truncate">{sake.brewery}</p>
                </div>

                {/* Score */}
                <div className="flex-shrink-0 text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <Star size={13} fill="var(--sake-pink)" stroke="var(--sake-pink)" />
                    <span className="font-bold text-sm">
                      {item.avgStars ? Number(item.avgStars).toFixed(1) : "-"}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{item.totalRatings}件</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
