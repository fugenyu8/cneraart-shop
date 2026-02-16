import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  // 产品查询已删除(用户要求删除NEW ARRIVALS/BEST SELLERS区域)

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
              <span className="font-semibold">{t('topBar.wutaishan')}</span>
              <span>{t('topBar.credential1')}</span>
              <span>-</span>
              <span>{t('topBar.credential2')}</span>
              <span>-</span>
              <span>{t('topBar.credential3')}</span>
              {/* 重复内容实现无缝循环 */}
              <span className="font-semibold">{t('topBar.wutaishan')}</span>
              <span>{t('topBar.credential1')}</span>
              <span>-</span>
              <span>{t('topBar.credential2')}</span>
              <span>-</span>
              <span>{t('topBar.credential3')}</span>
            </div>
          </div>

          {/* 右侧:注册/登录/语言 */}
          <div className="flex items-center gap-2 text-xs md:text-sm flex-shrink-0">
            <a href={getLoginUrl()} className="hover:text-white transition-colors">
              {t('topBar.register')}
            </a>
            <span>|</span>
            <a href={getLoginUrl()} className="hover:text-white transition-colors">
              {t('topBar.login')}
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
        <div className="absolute inset-0 opacity-[0.38]">
          <img src="/services/wutai-bg.jpg" alt="五台山寺庙" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* 1. 开光护佑法物 */}
            <Link href="/products">
              <div className="group relative bg-black/85 backdrop-blur-sm border-2 border-[#D4AF37] rounded-2xl p-4 md:p-6 hover:shadow-2xl hover:shadow-[#D4AF37]/20 hover:-translate-y-2 hover:bg-black/90 transition-all duration-300 cursor-pointer overflow-hidden">
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
                              <h3 className="text-xl font-medium text-[#FFD700] mb-2">{t('serviceCards.blessedItems.title')}</h3>
                    <p className="text-sm font-light text-[#E8D4A0]">{t('serviceCards.blessedItems.subtitle')}</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* 2. 命理运势 */}
            <Link href="/destiny">
              <div className="group relative bg-black/85 backdrop-blur-sm border-2 border-[#D4AF37] rounded-2xl p-4 md:p-6 hover:shadow-2xl hover:shadow-[#D4AF37]/20 hover:-translate-y-2 hover:bg-black/90 transition-all duration-300 cursor-pointer overflow-hidden">
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
                    <h3 className="text-xl font-medium text-[#FFD700] mb-2">{t('serviceCards.destiny.title')}</h3>
                    <p className="text-sm font-light text-[#E8D4A0]">{t('serviceCards.destiny.subtitle')}</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* 3. 面相手相风水 (合并) */}
            <Link href="/fortune">
              <div className="group relative bg-black/85 backdrop-blur-sm border-2 border-[#D4AF37] rounded-2xl p-4 md:p-6 hover:shadow-2xl hover:shadow-[#D4AF37]/20 hover:-translate-y-2 hover:bg-black/90 transition-all duration-300 cursor-pointer overflow-hidden">
                {/* 金色祥云纹理背景 */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(212, 175, 55, 0.3) 0%, transparent 50%)'}}></div>
                </div>
                
                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  {/* 实物照片 */}
                  <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/30 group-hover:scale-110 transition-transform">
                    <img src="/services/palmistry.jpg" alt="手相图谱" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-[#FFD700] mb-2">{t('serviceCards.palmistry.title')}</h3>
                    <p className="text-sm font-light text-[#E8D4A0]">{t('serviceCards.palmistry.subtitle')}</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* 4. 代客祈福 */}
            <Link href="/prayer">
              <div className="group relative bg-black/85 backdrop-blur-sm border-2 border-[#D4AF37] rounded-2xl p-4 md:p-6 hover:shadow-2xl hover:shadow-[#D4AF37]/20 hover:-translate-y-2 hover:bg-black/90 transition-all duration-300 cursor-pointer overflow-hidden">
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
                    <h3 className="text-xl font-medium text-[#FFD700] mb-2">{t('serviceCards.prayer.title')}</h3>
                    <p className="text-sm font-light text-[#E8D4A0]">{t('serviceCards.prayer.subtitle')}</p>
                  </div>
                </div>
              </div>
            </Link>
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
      <footer className="relative py-16 text-center overflow-hidden">
        {/* 五台山寺庙背景图 */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{backgroundImage: 'url(/footer-bg.jpg)'}}
        >
          {/* 半透明黑色遮罩 */}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="text-sm space-y-3">
            <p className="font-semibold text-2xl text-[#FFD700] drop-shadow-lg">五台山 · 世界五大佛教圣地之一 · 世界文化遗产名录</p>
            <p className="text-base text-[#E8D4A0] drop-shadow-md">中国四大佛教名山之首 · 文殊菩萨道场 · 千年佛教文化传承</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
