import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, LogOut, Mail, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/vhod")({
  head: () => ({
    meta: [
      { title: "Вход и регистрация — Преждарница" },
      { name: "description", content: "Влезте или създайте профил в Преждарница." },
    ],
  }),
  component: AuthPage,
});

type AuthMode = "login" | "signup";

function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSignedInEmail(data.session?.user.email ?? null);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setSignedInEmail(session?.user.email ?? null);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setMessage("");
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (mode === "signup" && password !== confirmPassword) {
      setError("Паролите не съвпадат.");
      return;
    }

    setLoading(true);
    const result =
      mode === "signup"
        ? await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/` },
          })
        : await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (result.error) {
      if (result.error.code === "over_email_send_rate_limit") {
        setError(
          "Извършили сте твърде много опити за регистрация с този имейл адрес. Моля, опитайте отново след известно време.",
        );
      } else if (result.error.code === "invalid_credentials") {
        setError("Невалидни имейл адрес или парола.");
      } else {
        setError(result.error.message);
      }

      return;
    }
    if (mode === "signup" && !result.data.session) {
      setMessage("Профилът е създаден! Проверете имейла си, за да потвърдите регистрацията.");
      setPassword("");
      setConfirmPassword("");
      return;
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSignedInEmail(null);
    setMessage("Излязохте от профила си.");
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-12 sm:py-20">
      <section className="w-full max-w-md rounded-[2rem] bg-card p-6 shadow-lg sm:p-8">
        {signedInEmail ? (
          <div className="text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <UserRound className="h-8 w-8" />
            </span>
            <h1 className="mt-5 font-display text-3xl font-extrabold text-foreground">
              Здравейте!
            </h1>
            <p className="mt-2 text-muted-foreground">Влезли сте като {signedInEmail}.</p>
            <div className="mt-6 flex flex-col gap-3">
              <Button asChild className="w-full rounded-full">
                <Link to="/katalog">Към каталога</Link>
              </Button>
              <Button variant="outline" className="w-full rounded-full" onClick={handleSignOut}>
                <LogOut /> Изход
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <UserRound className="h-8 w-8" />
              </span>
              <h1 className="mt-5 font-display text-3xl font-extrabold text-foreground">
                {mode === "signup" ? "Създайте профил" : "Добре дошли отново"}
              </h1>
              <p className="mt-2 text-muted-foreground">
                {mode === "signup"
                  ? "Запазвайте любимите си артикули и следете поръчките си."
                  : "Влезте в профила си в Преждарница."}
              </p>
            </div>

            <div
              className="mt-6 grid grid-cols-2 rounded-full bg-muted p-1"
              role="tablist"
              aria-label="Тип на формата"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === "login"}
                onClick={() => switchMode("login")}
                className={`cursor-pointer rounded-full px-3 py-2 text-sm font-extrabold transition-transform hover:scale-105 ${
                  mode === "login" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
                }`}
              >
                Вход
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "signup"}
                onClick={() => switchMode("signup")}
                className={`cursor-pointer rounded-full px-3 py-2 text-sm font-extrabold transition-transform hover:scale-105 ${
                  mode === "signup" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
                }`}
              >
                Регистрация
              </button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Имейл адрес</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-11 rounded-xl pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Парола</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  placeholder="Минимум 6 символа"
                  minLength={6}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-11 rounded-xl"
                  required
                />
              </div>
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Потвърдете паролата</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Въведете паролата отново"
                    minLength={6}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="h-11 rounded-xl"
                    required
                  />
                </div>
              )}

              {error && (
                <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}
              {message && (
                <p className="flex items-start gap-2 rounded-xl border border-green-200 bg-green-100 px-3 py-2 text-sm text-green-800">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> {message}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full rounded-full font-extrabold"
              >
                {loading ? "Моля, изчакайте…" : mode === "signup" ? "Създай профил" : "Вход"}
              </Button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
