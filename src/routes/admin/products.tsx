import { createFileRoute, Link } from "@tanstack/react-router";
import { Archive, Check, Edit3, PackagePlus, RotateCcw, ShieldAlert } from "lucide-react";
import { useEffect, useState, type ComponentProps, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/admin/products")({
  head: () => ({
    meta: [{ title: "Управление на продукти — Преждарница" }],
  }),
  component: AdminProductsPage,
});

type ProductRow = Tables<"products">;
type VariantRow = Tables<"product_variants">;
type ProductForm = {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: string;
  oldPrice: string;
  imageKey: string;
  galleryKeys: string;
  description: string;
  details: string;
  badge: string;
  sortOrder: string;
  isActive: boolean;
};

type VariantForm = {
  id: string;
  name: string;
  imageKey: string;
  isActive: boolean;
};

const emptyForm: ProductForm = {
  id: "",
  name: "",
  category: "prezhdi",
  subcategory: "",
  price: "",
  oldPrice: "",
  imageKey: "",
  galleryKeys: "",
  description: "",
  details: "",
  badge: "",
  sortOrder: "0",
  isActive: true,
};

const emptyVariantForm: VariantForm = {
  id: "",
  name: "",
  imageKey: "",
  isActive: true,
};

function formFromProduct(product: ProductRow): ProductForm {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    subcategory: product.subcategory ?? "",
    price: String(product.price),
    oldPrice: product.old_price === null ? "" : String(product.old_price),
    imageKey: product.image_key,
    galleryKeys: product.gallery_keys.join(", "),
    description: product.description ?? "",
    details: product.details.join("\n"),
    badge: product.badge ?? "",
    sortOrder: String(product.sort_order),
    isActive: product.is_active,
  };
}

function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [variants, setVariants] = useState<VariantRow[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [variantForm, setVariantForm] = useState<VariantForm>(emptyVariantForm);
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadProducts = async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .maybeSingle();

    if (profileError || profile?.role !== "admin") {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const { data, error: productsError } = await supabase
      .from("products")
      .select("*")
      .order("is_active", { ascending: false })
      .order("sort_order")
      .order("name");

    const { data: variantData, error: variantsError } = await supabase
      .from("product_variants")
      .select("*")
      .order("name");

    if (productsError) setError(productsError.message);
    if (variantsError) setError(variantsError.message);
    setProducts(data ?? []);
    setVariants(variantData ?? []);
    setIsAdmin(true);
    setLoading(false);
  };

  useEffect(() => {
    void loadProducts();
  }, []);

  const updateForm = (key: keyof ProductForm, value: string | boolean) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setVariantForm(emptyVariantForm);
    setShowVariantForm(false);
    setError("");
    setMessage("");
  };

  const saveVariant = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.id || !variantForm.id.trim() || !variantForm.name.trim() || !variantForm.imageKey.trim()) {
      setError("За подпродукта са нужни ID, име и image key.");
      return;
    }

    const payload = {
      id: variantForm.id.trim(),
      product_id: form.id,
      name: variantForm.name.trim(),
      image_key: variantForm.imageKey.trim(),
      is_active: variantForm.isActive,
    };

    const result = variants.some((variant) => variant.id === variantForm.id)
      ? await supabase.from("product_variants").update(payload).eq("id", variantForm.id)
      : await supabase.from("product_variants").insert(payload);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    setMessage("Подпродуктът е записан.");
    setVariantForm(emptyVariantForm);
    setShowVariantForm(false);
    await loadProducts();
  };

  const setVariantActive = async (variant: VariantRow, isActive: boolean) => {
    setError("");
    const { error: updateError } = await supabase
      .from("product_variants")
      .update({ is_active: isActive })
      .eq("id", variant.id);
    if (updateError) setError(updateError.message);
    else await loadProducts();
  };

  const saveProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const price = Number(form.price.replace(",", "."));
    const oldPrice = form.oldPrice ? Number(form.oldPrice.replace(",", ".")) : null;
    if (!form.id.trim() || !form.name.trim() || !form.imageKey.trim() || !Number.isFinite(price)) {
      setError("Попълнете ID, име, основна снимка и валидна цена.");
      setSaving(false);
      return;
    }
    if (oldPrice !== null && (!Number.isFinite(oldPrice) || oldPrice < price)) {
      setError("Старата цена трябва да е празна или по-висока от текущата.");
      setSaving(false);
      return;
    }

    const payload = {
      id: form.id.trim(),
      name: form.name.trim(),
      category: form.category,
      subcategory: form.subcategory.trim() || null,
      price,
      old_price: oldPrice,
      image_key: form.imageKey.trim(),
      gallery_keys: form.galleryKeys.split(",").map((item) => item.trim()).filter(Boolean),
      description: form.description.trim() || null,
      details: form.details.split("\n").map((item) => item.trim()).filter(Boolean),
      badge: form.badge || null,
      sort_order: Number.parseInt(form.sortOrder, 10) || 0,
      is_active: form.isActive,
    };

    const result = products.some((product) => product.id === form.id)
      ? await supabase.from("products").update(payload).eq("id", form.id)
      : await supabase.from("products").insert(payload);

    if (result.error) {
      setError(result.error.message);
    } else {
      setMessage("Продуктът е записан.");
      await loadProducts();
      setForm((current) => ({ ...current, id: payload.id }));
      setVariantForm(emptyVariantForm);
    }
    setSaving(false);
  };

  const setProductActive = async (product: ProductRow, isActive: boolean) => {
    setError("");
    const { error: updateError } = await supabase
      .from("products")
      .update({ is_active: isActive })
      .eq("id", product.id);
    if (updateError) setError(updateError.message);
    else await loadProducts();
  };

  if (loading || isAdmin === null) {
    return <div className="mx-auto max-w-6xl px-4 py-20 text-center text-muted-foreground">Зареждане…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center">
        <ShieldAlert className="h-12 w-12 text-berry" />
        <h1 className="mt-4 font-display text-3xl font-extrabold">Нямате достъп</h1>
        <p className="mt-2 text-muted-foreground">Тази страница е достъпна само за администратор.</p>
        <Button asChild className="mt-6 rounded-full"><Link to="/">Към началото</Link></Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-primary">Администрация</p>
          <h1 className="font-display text-4xl font-extrabold text-foreground">Продукти</h1>
          <p className="mt-1 text-muted-foreground">Добавяйте, редактирайте и скривайте продукти от каталога.</p>
        </div>
        <Button variant="outline" className="rounded-full" onClick={resetForm}><PackagePlus /> Нов продукт</Button>
      </div>

      {(error || message) && (
        <div className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${error ? "border-destructive/20 bg-destructive/10 text-destructive" : "border-green-200 bg-green-100 text-green-800"}`}>
          {error || message}
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
        <section className="order-2 rounded-[2rem] bg-card p-5 shadow-sm lg:order-1">
          <h2 className="font-display text-2xl font-extrabold">Каталог ({products.length})</h2>
          <div className="mt-4 space-y-3">
            {products.map((product) => (
              <div key={product.id} className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 ${product.is_active ? "border-border" : "border-dashed border-muted-foreground/40 opacity-65"}`}>
                <div className="min-w-0">
                  <p className="font-bold">{product.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{product.id} · {product.price.toFixed(2)} € · {product.is_active ? "активен" : "скрит"}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setForm(formFromProduct(product)); setVariantForm(emptyVariantForm); setShowVariantForm(false); setMessage(""); setError(""); }}><Edit3 /> Редакция</Button>
                  <Button variant="ghost" size="sm" onClick={() => void setProductActive(product, !product.is_active)} title={product.is_active ? "Скрий" : "Възстанови"}>
                    {product.is_active ? <Archive /> : <RotateCcw />}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="order-1 rounded-[2rem] bg-card p-5 shadow-sm lg:order-2">
          <h2 className="font-display text-2xl font-extrabold">{form.id ? "Редактиране" : "Нов продукт"}</h2>
          <form className="mt-5 space-y-4" onSubmit={saveProduct}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="ID" value={form.id} onChange={(value) => updateForm("id", value)} disabled={Boolean(products.find((product) => product.id === form.id))} />
              <Field label="Име" value={form.name} onChange={(value) => updateForm("name", value)} />
              <Field label="Категория" value={form.category} onChange={(value) => updateForm("category", value)} placeholder="prezhdi / makrame / gotovi / aksesoari" />
              <Field label="Подкатегория" value={form.subcategory} onChange={(value) => updateForm("subcategory", value)} />
              <Field label="Цена (€)" type="number" step="0.01" value={form.price} onChange={(value) => updateForm("price", value)} />
              <Field label="Стара цена (€)" type="number" step="0.01" value={form.oldPrice} onChange={(value) => updateForm("oldPrice", value)} />
              <Field label="Основна снимка (image key)" value={form.imageKey} onChange={(value) => updateForm("imageKey", value)} fixedLabelHeight />
              <Field label="Допълнителни снимки (със запетая)" value={form.galleryKeys} onChange={(value) => updateForm("galleryKeys", value)} fixedLabelHeight />
              <Field label="Badge" value={form.badge} onChange={(value) => updateForm("badge", value)} placeholder="Ново / Хит / Промоция" />
              <Field label="Подредба" type="number" value={form.sortOrder} onChange={(value) => updateForm("sortOrder", value)} />
            </div>
            <div>
              <Label htmlFor="description">Описание</Label>
              <Textarea id="description" className="mt-1" value={form.description} onChange={(event) => updateForm("description", event.target.value)} />
            </div>
            <div>
              <Label htmlFor="details">Детайли (по един на ред)</Label>
              <Textarea id="details" className="mt-1" value={form.details} onChange={(event) => updateForm("details", event.target.value)} />
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-bold">
              <input type="checkbox" checked={form.isActive} onChange={(event) => updateForm("isActive", event.target.checked)} />
              Показвай в каталога
            </label>
            <Button type="submit" disabled={saving} className="w-full rounded-full">{saving ? "Записване…" : <><Check /> Запази продукта</>}</Button>
          </form>
          {form.id && products.some((product) => product.id === form.id) ? (
            <div className="mt-8 border-t border-border pt-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-xl font-extrabold">Подпродукти / варианти</h3>
                  <p className="text-sm text-muted-foreground">Например цветове или размери на този продукт.</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => { setVariantForm(emptyVariantForm); setShowVariantForm((current) => !current); }}><PackagePlus /> {showVariantForm ? "Скрий" : "Нов"}</Button>
              </div>
              {showVariantForm && <form className="mt-4 space-y-3 rounded-xl bg-muted/40 p-4" onSubmit={saveVariant}>
                <p className="text-sm font-bold">{variantForm.id ? "Редактиране на подпродукт" : "Нов подпродукт"}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="ID на подпродукт" value={variantForm.id} onChange={(value) => setVariantForm((current) => ({ ...current, id: value }))} disabled={Boolean(variants.find((variant) => variant.id === variantForm.id))} />
                  <Field label="Име на подпродукт" value={variantForm.name} onChange={(value) => setVariantForm((current) => ({ ...current, name: value }))} />
                  <Field label="Снимка (image key)" value={variantForm.imageKey} onChange={(value) => setVariantForm((current) => ({ ...current, imageKey: value }))} fixedLabelHeight />
                </div>
                <label className="flex cursor-pointer items-center gap-2 text-sm font-bold">
                  <input type="checkbox" checked={variantForm.isActive} onChange={(event) => setVariantForm((current) => ({ ...current, isActive: event.target.checked }))} />
                  Показвай варианта
                </label>
                <Button type="submit" className="w-full rounded-full"><Check /> Запази варианта</Button>
              </form>}
              <div className="mt-4 space-y-2">
                {variants.filter((variant) => variant.product_id === form.id).map((variant) => (
                  <div key={variant.id} className={`flex items-center justify-between gap-3 rounded-xl border p-3 ${variant.is_active ? "border-border" : "border-dashed border-muted-foreground/40 opacity-65"}`}>
                    <div className="min-w-0">
                      <p className="font-bold">{variant.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{variant.id} · {variant.image_key}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button type="button" variant="outline" size="sm" onClick={() => { setVariantForm({ id: variant.id, name: variant.name, imageKey: variant.image_key, isActive: variant.is_active }); setShowVariantForm(true); }}><Edit3 /></Button>
                      <Button type="button" variant="ghost" size="sm" onClick={() => void setVariantActive(variant, !variant.is_active)} title={variant.is_active ? "Скрий" : "Възстанови"}>{variant.is_active ? <Archive /> : <RotateCcw />}</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-6 rounded-xl bg-muted/40 p-4 text-sm text-muted-foreground">Запазете продукта, за да добавите подпродукти или варианти.</p>
          )}
        </section>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, fixedLabelHeight = false, ...props }: { label: string; value: string; onChange: (value: string) => void; fixedLabelHeight?: boolean } & Omit<ComponentProps<typeof Input>, "value" | "onChange">) {
  const id = label.toLowerCase().replaceAll(" ", "-");
  return (
    <div>
      <Label htmlFor={id} className={fixedLabelHeight ? "block h-10 leading-5" : undefined}>
        {label}
      </Label>
      <Input id={id} className="mt-1" value={value} onChange={(event) => onChange(event.target.value)} {...props} />
    </div>
  );
}
