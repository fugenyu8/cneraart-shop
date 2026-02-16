import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { data: allProducts } = trpc.products.list.useQuery({ limit: 20 });
  
  // 分离新品和畅销品
  const newArrivals = allProducts?.slice(0, 4) || [];
  const bestSellers = allProducts?.slice(4, 8) || [];

  // 轮播图片列表(10张五台山照片)
  const carouselImages = [
    "/wutai/fojiaowutaishan1(16).jpg",
    "/wutai/hh1(5).jpg",
    "/wutai/wutai1(3).jpg",
    "/wutai/hh1(6).jpg",
    "/wutai/fojiaowutaishan1(18).jpg",
    "/wutai/wutais1(18).jpg",
    "/wutai/fwts1(3).jpg",
    "/wutai/wf1(10).jpg",
    "/wutai/fowt1(1).jpg",
    "/wutai/wutais1(23).jpg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 自动轮播(每5秒切换)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // 语言切换
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      {/* 顶部栏 - 参照service.cneraart.com */}
      <div className="bg-[#8B0000] text-[#F5DEB3] py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          {/* 左侧:五台山背书 - 横向滚动 */}
          <div className="flex items-center gap-1 text-xs md:text-sm overflow-x-auto whitespace-nowrap flex-1 mr-4">
            <span className="font-semibold">五台山</span>
            <span className="mx-1">世界五大佛教圣地之一</span>
            <span>-</span>
            <span className="mx-1">中国四大佛教名山之首</span>
            <span>-</span>
            <span className="mx-1">世界文化遗产名录</span>
          </div>

          {/* 右侧:注册/登录/语言 */}
          <div className="flex items-center gap-2 text-xs md:text-sm flex-shrink-0">
            {user ? (
              <Link href="/account">
                <span className="hover:text-white cursor-pointer transition-colors">
                  {user.name || user.email}
                </span>
              </Link>
            ) : (
              <>
                <a href={getLoginUrl()} className="hover:text-white transition-colors">
                  注册
                </a>
                <span>|</span>
                <a href={getLoginUrl()} className="hover:text-white transition-colors">
                  登录
                </a>
              </>
            )}
            <span>|</span>
            <select
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-transparent border-none text-[#F5DEB3] hover:text-white cursor-pointer transition-colors focus:outline-none"
            >
              <option value="zh" className="bg-[#8B0000] text-[#F5DEB3]">中文</option>
              <option value="en" className="bg-[#8B0000] text-[#F5DEB3]">English</option>
              <option value="de" className="bg-[#8B0000] text-[#F5DEB3]">Deutsch</option>
              <option value="fr" className="bg-[#8B0000] text-[#F5DEB3]">Français</option>
              <option value="es" className="bg-[#8B0000] text-[#F5DEB3]">Español</option>
              <option value="it" className="bg-[#8B0000] text-[#F5DEB3]">Italiano</option>
              <option value="pt" className="bg-[#8B0000] text-[#F5DEB3]">Português</option>
              <option value="ru" className="bg-[#8B0000] text-[#F5DEB3]">Русский</option>
              <option value="ja" className="bg-[#8B0000] text-[#F5DEB3]">日本語</option>
              <option value="ko" className="bg-[#8B0000] text-[#F5DEB3]">한국어</option>
              <option value="ar" className="bg-[#8B0000] text-[#F5DEB3]">العربية</option>
              <option value="hi" className="bg-[#8B0000] text-[#F5DEB3]">हिन्दी</option>
              <option value="th" className="bg-[#8B0000] text-[#F5DEB3]">ไทย</option>
              <option value="vi" className="bg-[#8B0000] text-[#F5DEB3]">Tiếng Việt</option>
              <option value="id" className="bg-[#8B0000] text-[#F5DEB3]">Bahasa Indonesia</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hero Section - 10张照片轮播 */}
      <section className="relative">
        <div className="relative h-[500px] md:h-[600px] overflow-hidden">
          {/* 轮播图片 */}
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={image}
                alt={`Wutai Mountain ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}

          {/* 渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

          {/* 文字叠加 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-wider drop-shadow-2xl">
              ANCIENT EASTERN BLESSINGS
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light drop-shadow-lg">
              HELPING YOU RESOLVE TROUBLES
            </p>
          </div>

          {/* 轮播指示器 */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex
                    ? "bg-white w-8"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 服务卡片区 */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* 1. 销售开光法物 */}
            <Link href="/products">
              <div className="group bg-[#FAF8F3] border border-[#D4AF37]/30 rounded-lg p-6 hover:border-[#D4AF37] hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer min-h-[44px] flex flex-col items-center justify-center">
                <div className="text-4xl mb-3">🙏</div>
                <h3 className="text-sm font-semibold text-[#5D4E37] text-center">销售开光法物</h3>
                <p className="text-xs text-gray-600 mt-1 text-center">五台山开光加持</p>
              </div>
            </Link>

            {/* 2. 面相手相 */}
            <Link href="/fortune">
              <div className="group bg-[#FAF8F3] border border-[#D4AF37]/30 rounded-lg p-6 hover:border-[#D4AF37] hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer min-h-[44px] flex flex-col items-center justify-center">
                <div className="text-4xl mb-3">👤</div>
                <h3 className="text-sm font-semibold text-[#5D4E37] text-center">面相手相</h3>
                <p className="text-xs text-gray-600 mt-1 text-center">传统命理测算</p>
              </div>
            </Link>

            {/* 3. 家居风水 */}
            <Link href="/fortune">
              <div className="group bg-[#FAF8F3] border border-[#D4AF37]/30 rounded-lg p-6 hover:border-[#D4AF37] hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer min-h-[44px] flex flex-col items-center justify-center">
                <div className="text-4xl mb-3">🏠</div>
                <h3 className="text-sm font-semibold text-[#5D4E37] text-center">家居风水</h3>
                <p className="text-xs text-gray-600 mt-1 text-center">大师风水布局</p>
              </div>
            </Link>

            {/* 4. 命理运势推演 */}
            <Link href="/destiny">
              <div className="group bg-[#FAF8F3] border border-[#D4AF37]/30 rounded-lg p-6 hover:border-[#D4AF37] hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer min-h-[44px] flex flex-col items-center justify-center">
                <div className="text-4xl mb-3">☘️</div>
                <h3 className="text-sm font-semibold text-[#5D4E37] text-center">命理运势</h3>
                <p className="text-xs text-gray-600 mt-1 text-center">八字紫微推演</p>
              </div>
            </Link>

            {/* 5. 代祈福 */}
            <Link href="/prayer">
              <div className="group bg-[#FAF8F3] border border-[#D4AF37]/30 rounded-lg p-6 hover:border-[#D4AF37] hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer min-h-[44px] flex flex-col items-center justify-center">
                <div className="text-4xl mb-3">🕯️</div>
                <h3 className="text-sm font-semibold text-[#5D4E37] text-center">代客祈福</h3>
                <p className="text-xs text-gray-600 mt-1 text-center">五台山代您祈福</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <button className="bg-white border border-gray-300 px-8 py-2 rounded-md text-[#5D4E37] font-medium hover:bg-gray-50 transition-colors">
              NEW ARRIVALS
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product: any) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="group block bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all">
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={product.images?.[0]?.url || "/placeholder-product.jpg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm text-[#5D4E37] mb-2 line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
                      {product.name}
                    </h3>
                    {/* 社交证明 */}
                    <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                      <span>🔥</span>
                      <span>已有{Math.floor(50 + (product.id * 37) % 450)}人请回此法物</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-[#5D4E37]">
                        ${product.salePrice ? Number(product.salePrice).toFixed(2) : Number(product.regularPrice).toFixed(2)}
                      </span>
                      {product.salePrice && Number(product.salePrice) < Number(product.regularPrice) && (
                        <span className="text-sm text-gray-400 line-through">
                          ${Number(product.regularPrice).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BEST SELLERS Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <button className="bg-white border border-gray-300 px-8 py-2 rounded-md text-[#5D4E37] font-medium hover:bg-gray-50 transition-colors">
              BEST SELLERS
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product: any) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="group block bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all">
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={product.images?.[0]?.url || "/placeholder-product.jpg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm text-[#5D4E37] mb-2 line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
                      {product.name}
                    </h3>
                    {/* 社交证明 */}
                    <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                      <span>🔥</span>
                      <span>已有{Math.floor(50 + (product.id * 37) % 450)}人请回此法物</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-[#5D4E37]">
                        ${product.salePrice ? Number(product.salePrice).toFixed(2) : Number(product.regularPrice).toFixed(2)}
                      </span>
                      {product.salePrice && Number(product.salePrice) < Number(product.regularPrice) && (
                        <span className="text-sm text-gray-400 line-through">
                          ${Number(product.regularPrice).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT US Section - 深红色背景 */}
      <section className="py-20 px-4 bg-[#8B1A1A] text-white relative overflow-hidden">
        {/* 书法装饰背景 */}
        <div className="absolute inset-0 opacity-10">
          <div className="text-9xl font-serif leading-none">
            藏坂假弘王釋出洛魂裁<br/>
            出茶堅衛主后古其詩<br/>
            殿機將宗后座會熱日
          </div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-8">ABOUT US</h2>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 space-y-6">
            <p className="text-lg leading-relaxed">
              Masters from China's sacred Wutai Mountain personally interpret the Four Pillars of Destiny. 
              By analyzing the interactions of the Five Elements, they clarify opportunities in career, wealth, 
              health and relationships, warn of obstacles, help avoid risks while pursuing benefits, and enlighten 
              wisdom to broaden horizons.
            </p>
            <p className="text-lg leading-relaxed">
              Traditional Chinese ritual ceremonies follow ancient rites like consecration (Kai Guang) and scripture 
              chanting. Unique and solemn, these ceremonies grant customized blessings to promote a smooth and 
              prosperous life.
            </p>
          </div>
        </div>
      </section>

      {/* 五台山背书页脚 */}
      <footer className="bg-[#5D4E37] text-[#D4AF37] py-8 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-sm space-y-2">
            <p className="font-semibold text-lg">五台山 · 世界五大佛教圣地之一 · 世界文化遗产名录</p>
            <p className="text-xs">中国四大佛教名山之首 · 文殊菩萨道场 · 千年佛教文化传承</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
