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
      bgImage: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663348895853/ZAFjuxDZUofEkpZc.jpg",
    },
    {
      id: "palm",
      icon: "✋",
      price: "$9.9",
      productSlug: "palm-reading-service",
      bgImage: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663348895853/ZAFjuxDZUofEkpZc.jpg",
    },
    {
      id: "fengshui",
      icon: "🏠",
      price: "$11.9",
      productSlug: "fengshui-service",
      bgImage: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663348895853/jtrXCCDaeXLygmpi.jpg",
    },
  ];

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663348895853/csMLGvQpeweGRqUe.jpg')`
      }}
    >
      {/* 导航栏 */}
      <nav className="border-b border-amber-900/30 bg-[#8B0000]/95 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between py-4">
          <Link href="/">
            <span className="flex items-center gap-2 cursor-pointer">
              <span className="text-2xl">☯</span>
              <span className="text-xl font-bold text-amber-400">源・华渡</span>
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/products">
              <span className="text-amber-300 hover:text-amber-200 cursor-pointer">{t("nav.products")}</span>
            </Link>
            <Link href="/fortune">
              <span className="text-amber-300 hover:text-amber-200 cursor-pointer">{t("fortuneServices.navLink")}</span>
            </Link>
            <Link href="/cart">
              <span className="text-amber-300 hover:text-amber-200 cursor-pointer">{t("nav.cart")}</span>
            </Link>
            <a href="https://report.cneraart.com" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:text-amber-200">📝 {t("common.report")}</a>
            <a href="https://service.cneraart.com" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:text-amber-200">💬 {t("common.service")}</a>
          </div>
        </div>
      </nav>

      {/* 页头 */}
      <div className="container mx-auto py-20 text-center">
        <div className="inline-block mb-6">
          <div className="text-7xl mb-4">☯</div>
        </div>
        <h1 className="mb-6 text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 drop-shadow-[0_0_30px_rgba(251,191,36,0.5)]">
          {t("fortuneServices.pageTitle")}
        </h1>
        <p className="text-xl text-amber-200/90 max-w-3xl mx-auto leading-relaxed">
          {t("fortuneServices.pageSubtitle")}
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-amber-400/50"></div>
          <span className="text-amber-400 text-2xl">✦</span>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-amber-400/50"></div>
        </div>
      </div>

      {/* 服务卡片 */}
      <div className="container mx-auto grid gap-8 px-4 pb-20 sm:grid-cols-2 md:grid-cols-3 md:gap-10">
        {services.map((service) => (
          <Card
            key={service.id}
            className="relative overflow-hidden border-2 border-amber-600/30 bg-black/60 backdrop-blur-md p-8 transition-all duration-300 hover:border-amber-400/80 hover:shadow-2xl hover:shadow-amber-400/30 hover:scale-105"
          >
            {/* 背景装饰 */}
            <div 
              className="absolute inset-0 opacity-10 bg-cover bg-center"
              style={{ backgroundImage: `url('${service.bgImage}')` }}
            ></div>
            
            {/* 内容 */}
            <div className="relative z-10">
              <div className="mb-6 text-center text-6xl drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]">
                {service.icon}
              </div>
              <h2 className="mb-3 text-center text-2xl font-bold text-amber-400">
                {t(`fortuneServices.${service.id}Title`)}
              </h2>
              <p className="mb-6 text-center text-base text-amber-100/80 leading-relaxed">
                {t(`fortuneServices.${service.id}Description`)}
              </p>

              <div className="mb-6 space-y-3">
                <p className="font-semibold text-amber-400 text-center border-b border-amber-600/30 pb-2">
                  {t("fortuneServices.featuresLabel")}
                </p>
                <ul className="space-y-2 text-sm text-amber-100/90">
                  {[1, 2, 3, 4].map((idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 mt-0.5">✓</span>
                      <span>{t(`fortuneServices.${service.id}Feature${idx}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6 text-center py-4 bg-gradient-to-r from-amber-900/30 via-amber-800/40 to-amber-900/30 rounded-lg">
                <span className="text-4xl font-bold text-amber-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
                  {service.price}
                </span>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 text-white hover:from-amber-500 hover:to-yellow-500 min-h-[48px] text-lg font-semibold shadow-lg shadow-amber-600/50 transition-all duration-300"
                onClick={() => setLocation(`/products/${service.productSlug}`)}
              >
                {t("fortuneServices.bookNow")}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* 服务流程 */}
      <div className="border-t border-amber-900/30 bg-black/40 backdrop-blur-sm py-20">
        <div className="container mx-auto">
          <h2 className="mb-4 text-center text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
            {t("fortuneServices.serviceProcess")}
          </h2>
          <div className="flex items-center justify-center gap-4 mb-16">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400/50"></div>
            <span className="text-amber-400 text-xl">✦</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400/50"></div>
          </div>
          
          <div className="grid gap-10 md:grid-cols-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="text-center group">
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full border-3 border-amber-500 bg-gradient-to-br from-amber-900/50 to-black/50 text-3xl font-bold text-amber-300 shadow-lg shadow-amber-600/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-amber-400/50">
                  {step}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-amber-400">
                  {t(`fortuneServices.step${step}Title`)}
                </h3>
                <p className="text-base text-amber-200/70 leading-relaxed">
                  {t(`fortuneServices.step${step}Desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 信任保障 */}
      <div className="border-t border-amber-900/30 bg-gradient-to-b from-black/40 to-black/60 py-16">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-amber-400 mb-8">
            {t("fortuneServices.trustTitle")}
          </h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6 bg-black/40 border border-amber-600/30 rounded-lg">
              <div className="text-4xl mb-3">🔒</div>
              <h4 className="text-lg font-semibold text-amber-300 mb-2">
                {t("fortuneServices.privacy")}
              </h4>
              <p className="text-sm text-amber-100/70">
                {t("fortuneServices.privacyDesc")}
              </p>
            </div>
            <div className="p-6 bg-black/40 border border-amber-600/30 rounded-lg">
              <div className="text-4xl mb-3">⚡</div>
              <h4 className="text-lg font-semibold text-amber-300 mb-2">
                {t("fortuneServices.speed")}
              </h4>
              <p className="text-sm text-amber-100/70">
                {t("fortuneServices.speedDesc")}
              </p>
            </div>
            <div className="p-6 bg-black/40 border border-amber-600/30 rounded-lg">
              <div className="text-4xl mb-3">🎯</div>
              <h4 className="text-lg font-semibold text-amber-300 mb-2">
                {t("fortuneServices.accuracy")}
              </h4>
              <p className="text-sm text-amber-100/70">
                {t("fortuneServices.accuracyDesc")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="border-t border-amber-900/30 py-8 text-center text-amber-300/60 bg-black/60">
        <p>© 2026 源·华渡 YUAN·HUADU. {t("footer.allRightsReserved")}.</p>
      </footer>
    </div>
  );
}
