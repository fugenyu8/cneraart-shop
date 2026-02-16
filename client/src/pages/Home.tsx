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

  // 轮播图片列表(用户提供的10张五台山照片)
  const carouselImages = [
    "/wutai/W1(6).jpg",
    "/wutai/wutais1(23).jpg",
    "/wutai/wf1(10).jpg",
    "/wutai/佛1.jpg",
    "/wutai/wutais1(18).jpg",
    "/wutai/fowt1(1).jpg",
    "/wutai/wutai1(3).jpg",
    "/wutai/hh1(6).jpg",
    "/wutai/hh1(5).jpg",
    "/wutai/W1(2).jpg",
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
          {/* 左侧:五台山背书 - 自动滚动 */}
          <div className="flex-1 mr-4 overflow-hidden">
            <div className="flex items-center gap-4 text-xs md:text-sm whitespace-nowrap animate-scroll">
              <span className="font-semibold">五台山</span>
              <span>世界五大佛教圣地之一</span>
              <span>-</span>
              <span>中国四大佛教名山之首</span>
              <span>-</span>
              <span>世界文化遗产名录</span>
              {/* 重复内容实现无缝循环 */}
              <span className="font-semibold">五台山</span>
              <span>世界五大佛教圣地之一</span>
              <span>-</span>
              <span>中国四大佛教名山之首</span>
              <span>-</span>
              <span>世界文化遗产名录</span>
            </div>
          </div>

          {/* 右侧:注册/登录/语言 */}
          <div className="flex items-center gap-2 text-xs md:text-sm flex-shrink-0">
            <a href={getLoginUrl()} className="hover:text-white transition-colors">
              注册
            </a>
            <span>|</span>
            <a href={getLoginUrl()} className="hover:text-white transition-colors">
              登录
            </a>
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
                className="w-full h-full object-cover object-center"
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}

          {/* 渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

          {/* 文字叠加 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-wider drop-shadow-2xl" style={{ fontFamily: 'Cinzel, serif' }}>
              {t('hero.title')}
            </h1>
            <p className="text-base md:text-xl text-white/90 font-light drop-shadow-lg" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              {t('hero.subtitle')}
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
      <section className="relative py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        {/* 五台山背景图 */}
        <div className="absolute inset-0 opacity-30">
          <img src="/services/wutai-bg.jpg" alt="五台山寺庙" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* 1. 开光护佑法物 */}
            <Link href="/products">
              <div className="group relative bg-black/75 backdrop-blur-sm border-2 border-[#D4AF37] rounded-2xl p-4 md:p-6 hover:shadow-2xl hover:shadow-[#D4AF37]/20 hover:-translate-y-2 hover:bg-black/85 transition-all duration-300 cursor-pointer overflow-hidden">
                {/* 金色祥云纹理背景 */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(212, 175, 55, 0.3) 0%, transparent 50%)'}}></div>
                </div>
                
                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  {/* 实物照片 */}
                  <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/30 group-hover:scale-110 transition-transform">
                    <img src="/services/beads.png" alt="开光佛珠" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#FFD700] mb-2">开光护佑法物</h3>
                    <p className="text-sm text-[#E8D4A0]">传统仪轨，大师加持</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* 2. 命理运势 */}
            <Link href="/destiny">
              <div className="group relative bg-black/75 backdrop-blur-sm border-2 border-[#D4AF37] rounded-2xl p-4 md:p-6 hover:shadow-2xl hover:shadow-[#D4AF37]/20 hover:-translate-y-2 hover:bg-black/85 transition-all duration-300 cursor-pointer overflow-hidden">
                {/* 金色祥云纹理背景 */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(212, 175, 55, 0.3) 0%, transparent 50%)'}}></div>
                </div>
                
                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  {/* 实物照片 */}
                  <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/30 group-hover:scale-110 transition-transform">
                    <img src="/services/compass1.jpg" alt="八卦罗盘" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#FFD700] mb-2">命理运势</h3>
                    <p className="text-sm text-[#E8D4A0]">流年运势,破解难题</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* 3. 面相手相风水 (合并) */}
            <Link href="/fortune">
              <div className="group relative bg-black/75 backdrop-blur-sm border-2 border-[#D4AF37] rounded-2xl p-4 md:p-6 hover:shadow-2xl hover:shadow-[#D4AF37]/20 hover:-translate-y-2 hover:bg-black/85 transition-all duration-300 cursor-pointer overflow-hidden">
                {/* 金色祥云纹理背景 */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(212, 175, 55, 0.3) 0%, transparent 50%)'}}></div>
                </div>
                
                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  {/* 实物照片 */}
                  <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/30 group-hover:scale-110 transition-transform">
                    <img src="/services/compass2.jpg" alt="风水罗盘" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#FFD700] mb-2">面相手相风水</h3>
                    <p className="text-sm text-[#E8D4A0]">古老智慧，解读当下</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* 4. 代客祈福 */}
            <Link href="/prayer">
              <div className="group relative bg-black/75 backdrop-blur-sm border-2 border-[#D4AF37] rounded-2xl p-4 md:p-6 hover:shadow-2xl hover:shadow-[#D4AF37]/20 hover:-translate-y-2 hover:bg-black/85 transition-all duration-300 cursor-pointer overflow-hidden">
                {/* 金色祥云纹理背景 */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(212, 175, 55, 0.3) 0%, transparent 50%)'}}></div>
                </div>
                
                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  {/* 实物照片 */}
                  <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/30 group-hover:scale-110 transition-transform">
                    <img src="/services/lotus-lamp.jpg" alt="莲花灯" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#FFD700] mb-2">代客祈福</h3>
                    <p className="text-sm text-[#E8D4A0]">跨越山海,代传祈愿</p>
                  </div>
                </div>
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
