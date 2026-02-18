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

export default function Destiny() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    birthHour: "",
    birthMinute: "",
    question: "",
  });

  const submitDestiny = trpc.fortune.submitDestiny.useMutation({
    onSuccess: () => {
      showToast.success(t("destiny.submitSuccess"), {
        description: t("destiny.submitSuccessDesc"),
      });
      setFormData({
        name: "",
        email: "",
        gender: "",
        birthYear: "",
        birthMonth: "",
        birthDay: "",
        birthHour: "",
        birthMinute: "",
        question: "",
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
    
    if (!formData.name || !formData.email || !formData.birthYear || !formData.birthMonth || !formData.birthDay) {
      showToast.error(t("common.error"), {
        description: t("destiny.requiredFields"),
      });
      return;
    }

    submitDestiny.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-900 to-amber-900 text-white py-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/">
            <a className="text-2xl font-bold">☯ {t("common.site_name")}</a>
          </Link>
          <nav className="flex gap-6">
            <Link href="/products"><a className="hover:text-amber-200">{t("nav.products")}</a></Link>
            <Link href="/fortune"><a className="hover:text-amber-200">{t("nav.fortune_services")}</a></Link>
            <Link href="/cart"><a className="hover:text-amber-200">{t("nav.cart")}</a></Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-[400px] bg-cover bg-center" style={{
        backgroundImage: "url('https://cdn.manus.space/file/manus-pub/cneraart-shop/destiny-bg.jpg')",
      }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container mx-auto h-full flex flex-col items-center justify-center text-white text-center">
          <h1 className="text-5xl font-bold mb-4">✦ {t("destiny.title")} ✦</h1>
          <p className="text-xl max-w-2xl">{t("destiny.subtitle")}</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="container mx-auto py-16">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl text-center">{t("destiny.formTitle")}</CardTitle>
            <CardDescription className="text-center">{t("destiny.formDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">{t("destiny.name")} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t("destiny.namePlaceholder")}
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">{t("destiny.email")} *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={t("destiny.emailPlaceholder")}
                  required
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label htmlFor="gender">{t("destiny.gender")}</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("destiny.genderPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t("destiny.male")}</SelectItem>
                    <SelectItem value="female">{t("destiny.female")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Birth Date */}
              <div className="space-y-2">
                <Label>{t("destiny.birthDate")} *</Label>
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    type="number"
                    placeholder={t("destiny.year")}
                    value={formData.birthYear}
                    onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
                    min="1900"
                    max="2100"
                    required
                  />
                  <Input
                    type="number"
                    placeholder={t("destiny.month")}
                    value={formData.birthMonth}
                    onChange={(e) => setFormData({ ...formData, birthMonth: e.target.value })}
                    min="1"
                    max="12"
                    required
                  />
                  <Input
                    type="number"
                    placeholder={t("destiny.day")}
                    value={formData.birthDay}
                    onChange={(e) => setFormData({ ...formData, birthDay: e.target.value })}
                    min="1"
                    max="31"
                    required
                  />
                </div>
              </div>

              {/* Birth Time (Optional) */}
              <div className="space-y-2">
                <Label>{t("destiny.birthTime")} ({t("destiny.optional")})</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder={t("destiny.hour")}
                    value={formData.birthHour}
                    onChange={(e) => setFormData({ ...formData, birthHour: e.target.value })}
                    min="0"
                    max="23"
                  />
                  <Input
                    type="number"
                    placeholder={t("destiny.minute")}
                    value={formData.birthMinute}
                    onChange={(e) => setFormData({ ...formData, birthMinute: e.target.value })}
                    min="0"
                    max="59"
                  />
                </div>
              </div>

              {/* Question */}
              <div className="space-y-2">
                <Label htmlFor="question">{t("destiny.question")} ({t("destiny.optional")})</Label>
                <Textarea
                  id="question"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder={t("destiny.questionPlaceholder")}
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-900 to-amber-900 hover:from-red-800 hover:to-amber-800"
                disabled={submitDestiny.isPending}
              >
                {submitDestiny.isPending ? t("destiny.submitting") : t("destiny.submit")}
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                {t("destiny.deliveryTime")}
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Service Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">📊 {t("destiny.feature1Title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">{t("destiny.feature1Desc")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-center">🔮 {t("destiny.feature2Title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">{t("destiny.feature2Desc")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-center">✨ {t("destiny.feature3Title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">{t("destiny.feature3Desc")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
