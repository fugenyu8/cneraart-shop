import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/**
 * 命理测算服务页面
 * 展示面相、手相、风水三大服务
 */
export default function FortuneServices() {
  const { t, i18n } = useTranslation();

  const services = [
    {
      id: "face",
      title: "面相分析",
      titleEn: "Face Reading",
      description: "基于传统面相学,分析面部特征,解读运势吉凶",
      descriptionEn: "Traditional face reading to analyze facial features and interpret fortune",
      icon: "👤",
      features: ["十二宫位分析", "流年运势", "事业财运", "健康婚姻"],
      featuresEn: ["12 Palaces Analysis", "Annual Fortune", "Career & Wealth", "Health & Marriage"],
      price: "¥199",
    },
    {
      id: "palm",
      title: "手相分析",
      titleEn: "Palm Reading",
      description: "解读掌纹奥秘,洞察人生轨迹",
      descriptionEn: "Decode palm lines to reveal life path and destiny",
      icon: "✋",
      features: ["三大主线", "财运线", "事业线", "婚姻线"],
      featuresEn: ["3 Major Lines", "Money Line", "Career Line", "Marriage Line"],
      price: "¥199",
    },
    {
      id: "fengshui",
      title: "家居风水",
      titleEn: "Feng Shui",
      description: "五台山大师风水智慧,调和居家气场",
      descriptionEn: "Master feng shui wisdom to harmonize home energy",
      icon: "🏠",
      features: ["布局分析", "色彩搭配", "化解煞气", "招财旺运"],
      featuresEn: ["Layout Analysis", "Color Harmony", "Resolve Negative Energy", "Attract Wealth"],
      price: "¥299",
    },
  ];

  const isZh = i18n.language === "zh";

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
              <a className="text-yellow-400 hover:text-yellow-300">{isZh ? "命理服务" : "Fortune Services"}</a>
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
          {isZh ? "命理运势分析" : "Fortune & Destiny Analysis"}
        </h1>
        <p className="text-xl text-slate-300">
          {isZh
            ? "融合中国古老智慧,解读人生运势与命运指引"
            : "Ancient Chinese wisdom for life path and fortune guidance"}
        </p>
      </div>

      {/* 服务卡片 */}
      <div className="container mx-auto grid gap-8 pb-20 md:grid-cols-3">
        {services.map((service) => (
          <Card
            key={service.id}
            className="border-slate-700 bg-slate-900/50 p-8 backdrop-blur-sm transition-all hover:border-yellow-400/50 hover:shadow-lg hover:shadow-yellow-400/10"
          >
            <div className="mb-6 text-center text-6xl">{service.icon}</div>
            <h2 className="mb-3 text-center text-2xl font-bold text-yellow-400">
              {isZh ? service.title : service.titleEn}
            </h2>
            <p className="mb-6 text-center text-slate-300">
              {isZh ? service.description : service.descriptionEn}
            </p>

            <div className="mb-6 space-y-2">
              <p className="font-semibold text-yellow-400">{isZh ? "服务内容:" : "Features:"}</p>
              <ul className="space-y-1 text-sm text-slate-300">
                {(isZh ? service.features : service.featuresEn).map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-yellow-400">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6 text-center">
              <span className="text-3xl font-bold text-yellow-400">{service.price}</span>
            </div>

            <Button
              className="w-full bg-yellow-400 text-slate-950 hover:bg-yellow-300"
              onClick={() => {
                // TODO: 跳转到服务购买页面
                alert(isZh ? "即将开放,敬请期待!" : "Coming soon!");
              }}
            >
              {isZh ? "立即预约" : "Book Now"}
            </Button>
          </Card>
        ))}
      </div>

      {/* 服务流程 */}
      <div className="border-t border-slate-800 bg-slate-950/50 py-16">
        <div className="container mx-auto">
          <h2 className="mb-12 text-center text-3xl font-bold text-yellow-400">
            {isZh ? "服务流程" : "Service Process"}
          </h2>
          <div className="grid gap-8 md:grid-cols-4">
            {[
              {
                step: "1",
                title: isZh ? "选择服务" : "Choose Service",
                desc: isZh ? "选择面相、手相或风水服务" : "Select face, palm or feng shui",
              },
              {
                step: "2",
                title: isZh ? "上传图片" : "Upload Image",
                desc: isZh ? "上传清晰的照片或房间图片" : "Upload clear photos",
              },
              {
                step: "3",
                title: isZh ? "AI分析" : "AI Analysis",
                desc: isZh ? "结合传统智慧与AI技术分析" : "Traditional wisdom + AI",
              },
              {
                step: "4",
                title: isZh ? "查看报告" : "View Report",
                desc: isZh ? "获取详细的命理分析报告" : "Get detailed report",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-yellow-400 bg-slate-900 text-2xl font-bold text-yellow-400">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-yellow-400">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="border-t border-slate-800 py-8 text-center text-slate-500">
        <p>© 2026 源·华渡 YUAN·HUADU. {isZh ? "保留所有权利" : "All rights reserved"}.</p>
      </footer>
    </div>
  );
}
