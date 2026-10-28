import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, LogOut, MapPin, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type SavedAddress = Tables<"addresses">;
type ProfileSection = "profile" | "addresses";

type AddressForm = {
  recipientName: string;
  phone: string;
  city: string;
  postalCode: string;
  addressLine: string;
  notes: string;
};

const emptyAddress: AddressForm = {
  recipientName: "",
  phone: "",
  city: "",
  postalCode: "",
  addressLine: "",
  notes: "",
};

export const Route = createFileRoute("/profil")({
  head: () => ({
    meta: [
      { title: "Моят профил — Преждарница" },
      { name: "description", content: "Управлявайте данните в своя профил в Преждарница." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [addressForm, setAddressForm] = useState<AddressForm>(emptyAddress);
  const [activeSection, setActiveSection] = useState<ProfileSection>("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [message, setMessage] = useState("");
  const [addressMessage, setAddressMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (!session) {
        setLoading(false);
        return;
      }

      setUserId(session.user.id);
      setEmail(session.user.email ?? null);

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("first_name, last_name, phone")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!mounted) return;

      if (profileError) {
        setError(profileError.message);
      } else if (data) {
        setFirstName(data.first_name ?? "");
        setLastName(data.last_name ?? "");
        setPhone(data.phone ?? "");
      }

      const { data: savedAddresses, error: addressesError } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (!mounted) return;

      if (addressesError) {
        setError(addressesError.message);
      } else {
        setAddresses(savedAddresses ?? []);
      }

      setLoading(false);
    };

    void loadProfile();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUserId(null);
        setEmail(null);
      }
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!userId) {
      setError("Моля, влезте в профила си, за да запазите данните.");
      return;
    }

    setSaving(true);
    const { error: saveError } = await supabase.from("profiles").upsert({
      id: userId,
      first_name: firstName.trim() || null,
      last_name: lastName.trim() || null,
      phone: phone.trim() || null,
    });
    setSaving(false);

    if (saveError) {
      setError(saveError.message);
      return;
    }

    setMessage("Личните данни са запазени успешно.");
  };

  const handleAddressSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setAddressMessage("");
    setError("");

    if (!userId) {
      setError("Моля, влезте в профила си, за да добавите адрес.");
      return;
    }

    setSavingAddress(true);
    const { data, error: saveError } = await supabase
      .from("addresses")
      .insert({
        user_id: userId,
        recipient_name: addressForm.recipientName.trim(),
        phone: addressForm.phone.trim(),
        city: addressForm.city.trim(),
        postal_code: addressForm.postalCode.trim(),
        address_line: addressForm.addressLine.trim(),
        notes: addressForm.notes.trim() || null,
      })
      .select()
      .single();
    setSavingAddress(false);

    if (saveError) {
      setError(saveError.message);
      return;
    }

    setAddresses((current) => [data, ...current]);
    setAddressForm(emptyAddress);
    setAddressMessage("Адресът е добавен успешно.");
  };

  const handleSignOut = async () => {
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      setError(signOutError.message);
      return;
    }

    await navigate({ to: "/" });
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center text-muted-foreground">
        Зареждане на профила…
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <UserRound className="mx-auto h-16 w-16 text-primary" />
        <h1 className="mt-5 font-display text-3xl font-extrabold">Влезте в профила си</h1>
        <p className="mt-2 text-muted-foreground">
          Трябва да сте влезли, за да управлявате личните си данни.
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link to="/vhod">Към входа</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:py-20">
      <section className="rounded-[2rem] bg-card p-6 shadow-lg sm:p-8">
        <div className="text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <UserRound className="h-8 w-8" />
          </span>
          <h1 className="mt-5 font-display text-3xl font-extrabold">Моят профил</h1>
          <p className="mt-2 text-muted-foreground">
            Запазете данните си за по-бързо завършване на поръчките.
          </p>
        </div>

        <div
          className="mt-8 grid grid-cols-2 rounded-full bg-muted p-1"
          role="tablist"
          aria-label="Раздели на профила"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeSection === "profile"}
            onClick={() => setActiveSection("profile")}
            className={`cursor-pointer rounded-full px-3 py-2 text-sm font-extrabold transition-transform hover:scale-105 ${
              activeSection === "profile"
                ? "bg-card text-primary shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            Лични данни
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeSection === "addresses"}
            onClick={() => setActiveSection("addresses")}
            className={`cursor-pointer rounded-full px-3 py-2 text-sm font-extrabold transition-transform hover:scale-105 ${
              activeSection === "addresses"
                ? "bg-card text-primary shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            Адреси
          </button>
        </div>

        <Button
          type="button"
          variant="outline"
          className="mt-4 w-full rounded-full"
          onClick={handleSignOut}
        >
          <LogOut /> Изход
        </Button>

        {activeSection === "profile" && (
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="profile-email">Имейл адрес</Label>
              <Input
                id="profile-email"
                type="email"
                value={email ?? ""}
                readOnly
                className="h-11 rounded-xl bg-muted"
              />
              {/* <p className="text-xs text-muted-foreground">Имейлът се управлява от Supabase Auth.</p> */}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first-name">Име</Label>
                <Input
                  id="first-name"
                  type="text"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Фамилия</Label>
                <Input
                  id="last-name"
                  type="text"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder={/*"0888 123 456" */ undefined}
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="h-11 rounded-xl"
              />
            </div>

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
              disabled={saving}
              className="h-11 w-full rounded-full font-extrabold"
            >
              {saving ? "Запазване…" : "Запази промените"}
            </Button>
          </form>
        )}

        {activeSection === "addresses" && (
          <div className="mt-10 border-t border-border pt-8">
            <div className="flex items-center gap-3">
              <MapPin className="h-6 w-6 text-primary" />
              <div>
                <h2 className="font-display text-2xl font-extrabold">Добави адрес</h2>
                <p className="text-sm text-muted-foreground">Запазете адрес за доставка.</p>
              </div>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleAddressSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="recipient-name">Получател</Label>
                  <Input
                    id="recipient-name"
                    value={addressForm.recipientName}
                    onChange={(event) =>
                      setAddressForm((current) => ({
                        ...current,
                        recipientName: event.target.value,
                      }))
                    }
                    className="h-11 rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address-phone">Телефон</Label>
                  <Input
                    id="address-phone"
                    type="tel"
                    value={addressForm.phone}
                    onChange={(event) =>
                      setAddressForm((current) => ({ ...current, phone: event.target.value }))
                    }
                    className="h-11 rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Град</Label>
                  <Input
                    id="city"
                    value={addressForm.city}
                    onChange={(event) =>
                      setAddressForm((current) => ({ ...current, city: event.target.value }))
                    }
                    className="h-11 rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal-code">Пощенски код</Label>
                  <Input
                    id="postal-code"
                    inputMode="numeric"
                    value={addressForm.postalCode}
                    onChange={(event) =>
                      setAddressForm((current) => ({ ...current, postalCode: event.target.value }))
                    }
                    className="h-11 rounded-xl"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address-line">Адрес</Label>
                <Input
                  id="address-line"
                  value={addressForm.addressLine}
                  onChange={(event) =>
                    setAddressForm((current) => ({ ...current, addressLine: event.target.value }))
                  }
                  className="h-11 rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address-notes">Бележка към адреса (по желание)</Label>
                <Input
                  id="address-notes"
                  value={addressForm.notes}
                  onChange={(event) =>
                    setAddressForm((current) => ({ ...current, notes: event.target.value }))
                  }
                  className="h-11 rounded-xl"
                />
              </div>
              <Button
                type="submit"
                disabled={savingAddress}
                variant={/* variant="outline" */ undefined}
                className="h-11 w-full rounded-full font-extrabold"
              >
                {savingAddress ? "Добавяне…" : "Добави адрес"}
              </Button>
              {addressMessage && (
                <p className="flex items-start gap-2 rounded-xl border border-green-200 bg-green-100 px-3 py-2 text-sm text-green-800">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> {addressMessage}
                </p>
              )}
            </form>

            {addresses.length > 0 && (
              <div className="mt-8 space-y-3">
                <h3 className="font-display text-xl font-extrabold">Запазени адреси</h3>
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="rounded-2xl border border-border bg-background p-4 text-sm"
                  >
                    <p className="font-extrabold">{address.recipient_name}</p>
                    <p className="mt-1 text-muted-foreground">
                      {address.address_line}, {address.postal_code} {address.city}
                    </p>
                    <p className="mt-1 text-muted-foreground">{address.phone}</p>
                    {address.notes && <p className="mt-1 text-muted-foreground">{address.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
