import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Search, LayoutGrid, Trophy, User, LogIn } from "lucide-react";

const navItems = [
  { href: "/search", label: "調べる", icon: Search },
  { href: "/mylist", label: "マイリスト", icon: LayoutGrid },
  { href: "/ranking", label: "ランキング", icon: Trophy },
];

export default function NavBar() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();

  return (
    <>
      {/* Desktop top nav */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                  <span className="text-background text-xs font-black tracking-tight">S</span>
                </div>
                <span className="font-black text-lg tracking-tight text-foreground">SAKELOG</span>
              </div>
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href}>
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      location === href
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                </Link>
              ))}
            </nav>

            {/* Auth */}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <Link href="/profile">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer">
                    <div className="w-7 h-7 rounded-full bg-[var(--sake-blue-light)] flex items-center justify-center">
                      <span className="text-[var(--sake-blue)] text-xs font-bold">
                        {(user?.nickname || user?.name || "U").charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden sm:inline">{user?.nickname || user?.name || "プロフィール"}</span>
                  </button>
                </Link>
              ) : (
                <Button
                  size="sm"
                  onClick={() => window.location.href = getLoginUrl()}
                  className="gap-2"
                >
                  <LogIn size={15} />
                  ログイン
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <button
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                  location === href
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                <Icon size={20} strokeWidth={location === href ? 2.5 : 1.5} />
                <span className="text-[10px] font-medium">{label}</span>
              </button>
            </Link>
          ))}
          <Link href={isAuthenticated ? "/profile" : "/search"}>
            <button
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                location === "/profile"
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
              onClick={() => { if (!isAuthenticated) window.location.href = getLoginUrl(); }}
            >
              <User size={20} strokeWidth={location === "/profile" ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium">{isAuthenticated ? "プロフィール" : "ログイン"}</span>
            </button>
          </Link>
        </div>
      </nav>
    </>
  );
}
