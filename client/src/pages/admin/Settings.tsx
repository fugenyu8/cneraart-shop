import { useState } from "react";
import { useTranslation } from "react-i18next";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Store,
  Globe,
  CreditCard,
  Bell,
  Shield,
  Truck,
  Mail,
} from "lucide-react";

export default function Settings() {
  const { t } = useTranslation();
  const [shopName, setShopName] = useState("源・华渡 Cneraart");
  const [shopEmail, setShopEmail] = useState("contact@cneraart.com");
  const [currency, setCurrency] = useState("USD");
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [enableAutoShipping, setEnableAutoShipping] = useState(false);

  const handleSave = () => {
    toast.success(t("admin.settingsSaved", "Settings saved successfully"));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("admin.settings", "Settings")}
          </h1>
          <p className="text-gray-500 mt-1">
            {t("admin.settingsDesc", "Manage your store settings and preferences")}
          </p>
        </div>

        {/* Store Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              {t("admin.storeInfo", "Store Information")}
            </CardTitle>
            <CardDescription>
              {t("admin.storeInfoDesc", "Basic information about your store")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{t("admin.storeName", "Store Name")}</Label>
                <Input
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("admin.storeEmail", "Contact Email")}</Label>
                <Input
                  type="email"
                  value={shopEmail}
                  onChange={(e) => setShopEmail(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Currency & Payment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {t("admin.paymentSettings", "Payment Settings")}
            </CardTitle>
            <CardDescription>
              {t("admin.paymentSettingsDesc", "Configure payment methods and currency")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t("admin.currency", "Default Currency")}</Label>
              <Input
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                placeholder="USD"
              />
            </div>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium">{t("admin.paymentMethods", "Payment Methods")}</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  <span>PayPal</span>
                </div>
                <Switch checked={true} disabled />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-green-600" />
                  <span>{t("admin.wechatPay", "WeChat Pay")}</span>
                </div>
                <Switch checked={true} disabled />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-blue-500" />
                  <span>{t("admin.alipay", "Alipay")}</span>
                </div>
                <Switch checked={true} disabled />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-600" />
                  <span>{t("admin.bankTransfer", "Bank Transfer")}</span>
                </div>
                <Switch checked={true} disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              {t("admin.notifications", "Notifications")}
            </CardTitle>
            <CardDescription>
              {t("admin.notificationsDesc", "Configure notification preferences")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t("admin.orderNotifications", "Order Notifications")}</p>
                <p className="text-sm text-gray-500">
                  {t("admin.orderNotificationsDesc", "Receive notifications for new orders")}
                </p>
              </div>
              <Switch
                checked={enableNotifications}
                onCheckedChange={setEnableNotifications}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t("admin.emailNotifications", "Email Notifications")}</p>
                <p className="text-sm text-gray-500">
                  {t("admin.emailNotificationsDesc", "Send email confirmations to customers")}
                </p>
              </div>
              <Switch checked={true} disabled />
            </div>
          </CardContent>
        </Card>

        {/* Shipping */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              {t("admin.shippingSettings", "Shipping Settings")}
            </CardTitle>
            <CardDescription>
              {t("admin.shippingSettingsDesc", "Configure shipping options")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t("admin.freeShipping", "Free Shipping")}</p>
                <p className="text-sm text-gray-500">
                  {t("admin.freeShippingDesc", "Enable free shipping for all orders")}
                </p>
              </div>
              <Switch checked={true} disabled />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t("admin.autoShipping", "Auto-generate Shipping Labels")}</p>
                <p className="text-sm text-gray-500">
                  {t("admin.autoShippingDesc", "Automatically generate shipping labels for new orders")}
                </p>
              </div>
              <Switch
                checked={enableAutoShipping}
                onCheckedChange={setEnableAutoShipping}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="bg-amber-700 hover:bg-amber-800">
            {t("admin.saveSettings", "Save Settings")}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
