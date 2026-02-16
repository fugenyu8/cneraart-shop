import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/**
 * 相学风水服务页面
 * 展示面相、手相、风水三大服务
 */
export default function FortuneServices() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

  const services = [
    {
      id: "face",
      icon: "👤",
      price: "$9.9",
      productSlug: "face-reading-service",
    },
    {
      id: "palm",
      icon: "✋",
      price: "$9.9",
      productSlug: "palm-reading-service",
    },
    {
      id: "fengshui",
      icon: "🏠",
      price: "$11.9",
      productSlug: "fengshui-service",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* 导航栏 */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between py-4">
          <Link href="/">
            <a className="flex items-center gap-2">
              <span className="text-2xl">☯</span>
              <span className="text-xl font-bold text-yellow-400">源・华渡</span>
            </a>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/products">
              <a className="text-yellow-400 hover:text-yellow-300">{t("nav.products")}</a>
            </Link>
            <Link href="/fortune">
              <a className="text-yellow-400 hover:text-yellow-300">{t("fortuneServices.navLink")}</a>
            </Link>
            <Link href="/cart">
              <a className="text-yellow-400 hover:text-yellow-300">{t("nav.cart")}</a>
            </Link>
          </div>
        </div>
      </nav>

      {/* 页头 */}
      <div className="container mx-auto py-16 text-center">
        <h1 className="mb-4 text-5xl font-bold text-yellow-400">
          {t("fortuneServices.pageTitle")}
        </h1>
        <p className="text-lg text-slate-300">
          {t("fortuneServices.pageSubtitle")}
        </p>
      </div>

      {/* 服务卡片 */}
      <div className="container mx-auto grid gap-6 px-4 pb-20 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
        {services.map((service) => (
          <Card
            key={service.id}
            className="border-slate-700 bg-slate-900/50 p-6 backdrop-blur-sm transition-all hover:border-yellow-400/50 hover:shadow-lg hover:shadow-yellow-400/10 sm:p-8"
          >
            <div className="mb-4 text-center text-5xl sm:mb-6 sm:text-6xl">{service.icon}</div>
            <h2 className="mb-2 text-center text-xl font-bold text-yellow-400 sm:mb-3 sm:text-2xl">
              {t(`fortuneServices.${service.id}Title`)}
            </h2>
            <p className="mb-4 text-center text-sm text-slate-300 sm:mb-6 sm:text-base">
              {t(`fortuneServices.${service.id}Description`)}
            </p>

            <div className="mb-4 space-y-2 sm:mb-6">
              <p className="font-semibold text-yellow-400">{t("fortuneServices.featuresLabel")}</p>
              <ul className="space-y-1 text-sm text-slate-300">
                {[1, 2, 3, 4].map((idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-yellow-400">✓</span>
                    {t(`fortuneServices.${service.id}Feature${idx}`)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-4 text-center sm:mb-6">
              <span className="text-2xl font-bold text-yellow-400 sm:text-3xl">{service.price}</span>
            </div>

            <Button
              className="w-full bg-yellow-400 text-slate-950 hover:bg-yellow-300 min-h-[44px]"
              onClick={() => setLocation(`/products/${service.productSlug}`)}
            >
              {t("fortuneServices.bookNow")}
            </Button>
          </Card>
        ))}
      </div>

      {/* 服务流程 */}
      <div className="border-t border-slate-800 bg-slate-950/50 py-16">
        <div className="container mx-auto">
          <h2 className="mb-12 text-center text-3xl font-bold text-yellow-400">
            {t("fortuneServices.serviceProcess")}
          </h2>
          <div className="grid gap-8 md:grid-cols-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-yellow-400 bg-slate-900 text-2xl font-bold text-yellow-400">
                  {step}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-yellow-400">
                  {t(`fortuneServices.step${step}Title`)}
                </h3>
                <p className="text-sm text-slate-400">
                  {t(`fortuneServices.step${step}Desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="border-t border-slate-800 py-8 text-center text-slate-500">
        <p>© 2026 源·华渡 YUAN·HUADU. {t("footer.allRightsReserved")}.</p>
      </footer>
    </div>
  );
}
