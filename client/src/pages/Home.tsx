import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useTranslation } from "react-i18next";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getLoginUrl } from "@/const";
import VideoPlayer from "@/components/VideoPlayer";
import { videos } from "@/config/videos";

export default function Home() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

  // 精选8张轮播图片（从35张中精选，减少加载量）
  const carouselImages = [
    "/wutai/carousel-01.jpg",
    "/wutai/carousel-05.jpg",
    "/wutai/carousel-09.jpg",
    "/wutai/carousel-13.jpg",
    "/wutai/carousel-18.jpg",
    "/wutai/carousel-22.jpg",
    "/wutai/carousel-27.jpg",
    "/wutai/carousel-31.jpg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

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
      {/* 顶部栏 - 移动端优化 */}
      <div className="bg-[#8B0000] text-[#F5DEB3] py-2 px-3 md:px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* 左侧:五台山背书 - 自动滚动 */}
          <div className="flex-1 mr-2 overflow-hidden">
            <div className="flex items-center gap-4 text-[10px] md:text-sm whitespace-nowrap animate-scroll">
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

          {/* 右侧:桌面端显示完整链接 */}
          <div className="hidden md:flex items-center gap-2 text-xs md:text-sm flex-shrink-0">
            <a href={getLoginUrl()} className="hover:text-white transition-colors">
              {t('topBar.register')}
            </a>
            <span>|</span>
            <a href={getLoginUrl()} className="hover:text-white transition-colors">
              {t('topBar.login')}
            </a>
            <span>|</span>
            <a href="https://report.cneraart.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              📝 {t('common.report')}
            </a>
            <span>|</span>
            <a href="https://service.cneraart.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              💬 {t('common.service')}
            </a>
            <span>|</span>
            <select
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-transparent border-none text-[#F5DEB3] hover:text-white cursor-pointer transition-colors focus:outline-none text-sm"
            >
              <option value="en" className="bg-[#8B0000] text-[#F5DEB3]">English</option>
              <option value="zh" className="bg-[#8B0000] text-[#F5DEB3]">中文</option>
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
              <option value="tr" className="bg-[#8B0000] text-[#F5DEB3]">Türkçe</option>
              <option value="zh-Hant" className="bg-[#8B0000] text-[#F5DEB3]">繁體中文</option>
            </select>
          </div>

          {/* 移动端:汉堡菜单 + 语言选择 */}
          <div className="flex md:hidden items-center gap-2 flex-shrink-0">
            <select
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-transparent border border-[#F5DEB3]/30 text-[#F5DEB3] rounded px-1 py-0.5 text-[11px] focus:outline-none"
            >
              <option value="en" className="bg-[#8B0000]">EN</option>
              <option value="zh" className="bg-[#8B0000]">中文</option>
              <option value="de" className="bg-[#8B0000]">DE</option>
              <option value="fr" className="bg-[#8B0000]">FR</option>
              <option value="es" className="bg-[#8B0000]">ES</option>
              <option value="ja" className="bg-[#8B0000]">日本語</option>
              <option value="ko" className="bg-[#8B0000]">한국어</option>
              <option value="zh-Hant" className="bg-[#8B0000]">繁體</option>
            </select>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-[#F5DEB3] p-1"
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* 移动端下拉菜单 */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#F5DEB3]/20 mt-2 pt-2 pb-1 space-y-2 text-xs">
            <a href={getLoginUrl()} className="block py-1.5 px-2 hover:bg-white/10 rounded transition-colors">
              {t('topBar.register')} / {t('topBar.login')}
            </a>
            <a href="https://report.cneraart.com" target="_blank" rel="noopener noreferrer" className="block py-1.5 px-2 hover:bg-white/10 rounded transition-colors">
              📝 {t('common.report')}
            </a>
            <a href="https://service.cneraart.com" target="_blank" rel="noopener noreferrer" className="block py-1.5 px-2 hover:bg-white/10 rounded transition-colors">
              💬 {t('common.service')}
            </a>
          </div>
        )}
      </div>

      {/* Hero Section - 移动端高度缩小 */}
      <section className="relative">
        <div className="relative h-[280px] sm:h-[380px] md:h-[500px] lg:h-[600px] overflow-hidden">
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

          {/* 文字叠加 - 移动端字体缩小 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-8">
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 md:mb-4 tracking-wider drop-shadow-2xl" style={{ fontFamily: '"Playfair Display", "Noto Serif SC", serif' }}>
              {t('hero.title')}
            </h1>
            <p className="text-sm sm:text-base md:text-xl text-white/90 font-light drop-shadow-lg max-w-lg md:max-w-none" style={{ fontFamily: '"Noto Sans SC", system-ui, sans-serif' }}>
              {t('hero.subtitle')}
            </p>
          </div>

          {/* 轮播指示器 - 移动端更小 */}
          <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-1.5 md:gap-2">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-1.5 md:h-2 rounded-full transition-all ${
                  index === currentImageIndex
                    ? "bg-white w-5 md:w-8"
                    : "bg-white/50 hover:bg-white/75 w-1.5 md:w-2"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 服务卡片区 - 只保留启蕴守护饰品，居中展示 */}
      <section className="relative py-10 md:py-20 px-3 md:px-4 bg-gradient-to-b from-gray-50 to-white">
        {/* 五台山背景图 */}
        <div className="absolute inset-0 opacity-[0.38]">
          <img src="/services/wutai-bg.jpg" alt="Wutai Temple" className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="max-w-4xl mx-auto">
          {/* 标题 */}
          <div className="text-center mb-6 md:mb-10 relative z-10">
            <h2 className="text-xl md:text-3xl font-serif font-semibold text-[#8B0000] mb-2 md:mb-4">{t('home.services_title')}</h2>
            <p className="text-sm md:text-base text-gray-600">{t('home.services_subtitle')}</p>
          </div>
          <div className="flex justify-center">
            {/* 启蕴守护饰品 - 居中大卡片 */}
            <Link href="/products">
              <div className="group relative bg-black/85 backdrop-blur-sm border border-[#D4AF37] md:border-2 rounded-xl md:rounded-2xl p-6 md:p-10 hover:shadow-2xl hover:shadow-[#D4AF37]/20 hover:-translate-y-2 hover:bg-black/90 transition-all duration-300 cursor-pointer overflow-hidden max-w-md w-full">
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(212, 175, 55, 0.3) 0%, transparent 50%)'}}></div>
                </div>
                <div className="relative z-10 flex flex-col items-center text-center space-y-3 md:space-y-5">
                  <div className="w-28 h-28 md:w-40 md:h-40 rounded-full overflow-hidden border border-[#D4AF37] md:border-2 shadow-lg shadow-[#D4AF37]/30 group-hover:scale-110 transition-transform">
                    <img src="/services/beads.png" alt="Qi-Yun Jewelry" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-xl font-medium text-[#FFD700] mb-1 md:mb-2 leading-tight">{t('serviceCards.blessedItems.title')}</h3>
                    <p className="text-xs md:text-sm font-light text-[#E8D4A0]">{t('serviceCards.blessedItems.subtitle')}</p>
                  </div>
                  <div className="mt-2">
                    <span className="inline-block px-4 py-2 md:px-6 md:py-2.5 bg-[#D4AF37]/20 border border-[#D4AF37]/50 rounded-full text-[#FFD700] text-xs md:text-sm group-hover:bg-[#D4AF37]/30 transition-colors">
                      {t('home.cta_products')}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 启蕴仪式流程 Section */}
      <section className="py-10 md:py-20 px-3 md:px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 md:mb-14">
            <h2 className="text-xl md:text-3xl font-serif font-semibold text-[#8B0000] mb-2 md:mb-4">{t('home.blessing_title')}</h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">{t('home.blessing_subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* 第一步：净化启蕴 */}
            <div className="text-center p-4 md:p-6 rounded-xl bg-gradient-to-b from-[#FFF8E7] to-white border border-[#D4AF37]/20">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-[#8B0000]/10 flex items-center justify-center">
                <span className="text-2xl md:text-3xl">🌿</span>
              </div>
              <h3 className="text-base md:text-lg font-semibold text-[#8B0000] mb-2">{t('home.blessing_step1')}</h3>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{t('home.blessing_step1_desc')}</p>
            </div>
            {/* 第二步：传承吟诵 */}
            <div className="text-center p-4 md:p-6 rounded-xl bg-gradient-to-b from-[#FFF8E7] to-white border border-[#D4AF37]/20">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-[#8B0000]/10 flex items-center justify-center">
                <span className="text-2xl md:text-3xl">📿</span>
              </div>
              <h3 className="text-base md:text-lg font-semibold text-[#8B0000] mb-2">{t('home.blessing_step2')}</h3>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{t('home.blessing_step2_desc')}</p>
            </div>
            {/* 第三步：能量赋予 */}
            <div className="text-center p-4 md:p-6 rounded-xl bg-gradient-to-b from-[#FFF8E7] to-white border border-[#D4AF37]/20">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-[#8B0000]/10 flex items-center justify-center">
                <span className="text-2xl md:text-3xl">✨</span>
              </div>
              <h3 className="text-base md:text-lg font-semibold text-[#8B0000] mb-2">{t('home.blessing_step3')}</h3>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{t('home.blessing_step3_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT US Section - 移动端优化 */}
      <section className="py-10 md:py-20 px-3 md:px-4 bg-[#8B0000] text-white relative overflow-hidden">
        {/* 书法装饰背景 */}
        <div className="absolute inset-0 opacity-10">
          <div className="text-6xl md:text-9xl font-serif leading-none">
            藏坂假弘王釋出洛魂裁<br/>
            出茶堅衛主后古其詩<br/>
            殿機將宗后座會熱日
          </div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-6 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-serif font-semibold mb-4 md:mb-8 tracking-wide">{t('aboutUs.title')}</h2>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 md:p-8 space-y-4 md:space-y-6">
            <p className="text-sm md:text-lg leading-relaxed">
              {t('aboutUs.paragraph1')}
            </p>
            <p className="text-sm md:text-lg leading-relaxed">
              {t('aboutUs.paragraph2')}
            </p>
          </div>

          {/* 启蕴仪式视频 */}
          <div className="mt-8 md:mt-12">
            <VideoPlayer 
              videoUrl={videos.imbuingCeremony.url}
              title={t('aboutUs.videoTitle') || videos.imbuingCeremony.titleEn}
              className="max-w-3xl mx-auto"
            />
          </div>
        </div>
      </section>

      {/* 五台山背书页脚 - 移动端优化 */}
      <footer className="relative py-10 md:py-16 text-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{backgroundImage: 'url(/footer-bg.jpg)'}}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="text-sm space-y-2 md:space-y-3">
            <p className="font-semibold text-xl md:text-2xl text-[#FFD700] drop-shadow-lg">{t('footer.wutaishan')}</p>
            <p className="text-xs md:text-base text-[#E8D4A0] drop-shadow-md">{t('footer.heritage')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
