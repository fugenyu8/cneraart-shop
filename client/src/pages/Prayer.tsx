import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast as showToast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function Prayer() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    serviceType: "lamp" | "incense" | "";
    prayerFor: string;
    wish: string;
    quantity: string;
  }>({
    name: "",
    email: "",
    serviceType: "",
    prayerFor: "",
    wish: "",
    quantity: "1",
  });

  const submitPrayer = trpc.fortune.submitPrayer.useMutation({
    onSuccess: () => {
      showToast.success(t("prayer.submitSuccess"), {
        description: t("prayer.submitSuccessDesc"),
      });
      setFormData({
        name: "",
        email: "",
        serviceType: "",
        prayerFor: "",
        wish: "",
        quantity: "1",
      });
    },
    onError: (error: any) => {
      showToast.error(t("common.error"), {
        description: error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.serviceType || !formData.prayerFor) {
      showToast.error(t("common.error"), {
        description: t("prayer.requiredFields"),
      });
      return;
    }

    submitPrayer.mutate({
      ...formData,
      serviceType: formData.serviceType as "lamp" | "incense",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-900 to-amber-900 text-white py-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/">
            <a className="text-2xl font-bold">☯ {t("common.siteName")}</a>
          </Link>
          <nav className="flex gap-6">
            <Link href="/products"><a className="hover:text-amber-200">{t("nav.products")}</a></Link>
            <Link href="/fortune"><a className="hover:text-amber-200">{t("nav.fortuneServices")}</a></Link>
            <Link href="/cart"><a className="hover:text-amber-200">{t("nav.cart")}</a></Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-[400px] bg-cover bg-center" style={{
        backgroundImage: "url('https://cdn.manus.space/file/manus-pub/cneraart-shop/prayer-bg.jpg')",
      }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container mx-auto h-full flex flex-col items-center justify-center text-white text-center">
          <h1 className="text-5xl font-bold mb-4">🙏 {t("prayer.title")} 🙏</h1>
          <p className="text-xl max-w-2xl">{t("prayer.subtitle")}</p>
        </div>
      </div>

      {/* Services Section */}
      <div className="container mx-auto py-16">
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="border-2 border-amber-500">
            <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100">
              <CardTitle className="text-2xl text-center">🕯️ {t("prayer.lampService")}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">{t("prayer.lampDesc")}</p>
              <ul className="space-y-2 text-sm">
                <li>✓ {t("prayer.lampFeature1")}</li>
                <li>✓ {t("prayer.lampFeature2")}</li>
                <li>✓ {t("prayer.lampFeature3")}</li>
              </ul>
              <div className="mt-4 text-2xl font-bold text-amber-900 text-center">
                $9.9 / {t("prayer.perLamp")}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-500">
            <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100">
              <CardTitle className="text-2xl text-center">🔥 {t("prayer.incenseService")}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">{t("prayer.incenseDesc")}</p>
              <ul className="space-y-2 text-sm">
                <li>✓ {t("prayer.incenseFeature1")}</li>
                <li>✓ {t("prayer.incenseFeature2")}</li>
                <li>✓ {t("prayer.incenseFeature3")}</li>
              </ul>
              <div className="mt-4 text-2xl font-bold text-amber-900 text-center">
                $7.9 / {t("prayer.perIncense")}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Section */}
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl text-center">{t("prayer.formTitle")}</CardTitle>
            <CardDescription className="text-center">{t("prayer.formDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">{t("prayer.name")} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t("prayer.namePlaceholder")}
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">{t("prayer.email")} *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={t("prayer.emailPlaceholder")}
                  required
                />
              </div>

              {/* Service Type */}
              <div className="space-y-2">
                <Label htmlFor="serviceType">{t("prayer.serviceType")} *</Label>
                <Select value={formData.serviceType} onValueChange={(value) => setFormData({ ...formData, serviceType: value as "lamp" | "incense" })}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("prayer.serviceTypePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lamp">{t("prayer.lampService")}</SelectItem>
                    <SelectItem value="incense">{t("prayer.incenseService")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Prayer For */}
              <div className="space-y-2">
                <Label htmlFor="prayerFor">{t("prayer.prayerFor")} *</Label>
                <Input
                  id="prayerFor"
                  value={formData.prayerFor}
                  onChange={(e) => setFormData({ ...formData, prayerFor: e.target.value })}
                  placeholder={t("prayer.prayerForPlaceholder")}
                  required
                />
              </div>

              {/* Wish */}
              <div className="space-y-2">
                <Label htmlFor="wish">{t("prayer.wish")} ({t("prayer.optional")})</Label>
                <Textarea
                  id="wish"
                  value={formData.wish}
                  onChange={(e) => setFormData({ ...formData, wish: e.target.value })}
                  placeholder={t("prayer.wishPlaceholder")}
                  rows={4}
                />
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity">{t("prayer.quantity")}</Label>
                <Select value={formData.quantity} onValueChange={(value) => setFormData({ ...formData, quantity: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 3, 7, 21, 49, 108].map(num => (
                      <SelectItem key={num} value={String(num)}>{num} {formData.serviceType === 'lamp' ? t("prayer.lamps") : t("prayer.incenses")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-900 to-amber-900 hover:from-red-800 hover:to-amber-800"
                disabled={submitPrayer.isPending}
              >
                {submitPrayer.isPending ? t("prayer.submitting") : t("prayer.submit")}
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                {t("prayer.deliveryTime")}
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Trust Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">🏔️ {t("prayer.trust1Title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">{t("prayer.trust1Desc")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-center">📸 {t("prayer.trust2Title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">{t("prayer.trust2Desc")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-center">✉️ {t("prayer.trust3Title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">{t("prayer.trust3Desc")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
