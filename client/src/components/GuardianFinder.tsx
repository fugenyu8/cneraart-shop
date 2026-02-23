import { useState } from "react";
import { useTranslation } from "react-i18next";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { getLocalized } from "@/lib/localized";

export default function GuardianFinder() {
  const { t } = useTranslation();
  const [birthdate, setBirthdate] = useState("");
  const [showResults, setShowResults] = useState(false);
  
  const { data: recommendations, isLoading, refetch } = trpc.products.getGuardianRecommendations.useQuery(
    { birthdate },
    { enabled: false }
  );

  const handleFind = async () => {
    if (!birthdate) {
      alert(t("guardianFinder.pleaseSelectDate"));
      return;
    }
    await refetch();
    setShowResults(true);
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-[#FAF8F3] to-[#F5E6D3]">
      <div className="max-w-6xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-12">
          <div className="inline-block">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-[#8B1A1A] mb-2">
              {t("guardianFinder.title")}
            </h2>
            <div className="h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
          </div>
          <p className="mt-4 text-[#5D4E37] font-light max-w-2xl mx-auto">
            {t("guardianFinder.subtitle")}
          </p>
        </div>

        {/* 输入区域 */}
        <div className="max-w-md mx-auto mb-12">
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-[#D4AF37] shadow-lg">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#5D4E37] mb-2">
                  {t("guardianFinder.birthdateLabel")}
                </label>
                <Input
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  className="w-full border-[#D4AF37] focus:ring-[#D4AF37]"
                />
              </div>
              <Button
                onClick={handleFind}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#8B1A1A] to-[#A52A2A] hover:from-[#A52A2A] hover:to-[#8B1A1A] text-white font-medium py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {isLoading ? t("guardianFinder.searching") : t("guardianFinder.findButton")}
              </Button>
            </div>
          </Card>
        </div>

        {/* 推荐结果 */}
        {showResults && recommendations && (
          <div className="space-y-8 animate-fadeIn">
            {/* 生肖推荐 */}
            {recommendations.zodiac && (
              <div>
                <h3 className="text-2xl font-serif font-semibold text-[#8B1A1A] mb-4 text-center">
                  {t("guardianFinder.yourZodiac")}: {t(`zodiac.${recommendations.zodiacSign}`)}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.zodiac.map((product: any) => (
                    <Link key={product.id} href={`/products/${product.slug}`}>
                      <Card className="group cursor-pointer overflow-hidden bg-white border-2 border-[#D4AF37] hover:shadow-2xl hover:shadow-[#D4AF37]/30 transition-all duration-300 hover:-translate-y-2">
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={product.images[0]}
                            alt={getLocalized(product.name)}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="font-medium text-[#5D4E37] mb-2 line-clamp-2">
                            {getLocalized(product.name)}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold text-[#8B1A1A]">
                              ${product.salePrice || product.regularPrice}
                            </span>
                            {product.salePrice && product.salePrice < product.regularPrice && (
                              <span className="text-sm text-gray-400 line-through">
                                ${product.regularPrice}
                              </span>
                            )}
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 星座推荐 */}
            {recommendations.constellation && (
              <div>
                <h3 className="text-2xl font-serif font-semibold text-[#8B1A1A] mb-4 text-center">
                  {t("guardianFinder.yourConstellation")}: {t(`constellation.${recommendations.constellationSign}`)}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.constellation.map((product: any) => (
                    <Link key={product.id} href={`/products/${product.slug}`}>
                      <Card className="group cursor-pointer overflow-hidden bg-white border-2 border-[#D4AF37] hover:shadow-2xl hover:shadow-[#D4AF37]/30 transition-all duration-300 hover:-translate-y-2">
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={product.images[0]}
                            alt={getLocalized(product.name)}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="font-medium text-[#5D4E37] mb-2 line-clamp-2">
                            {getLocalized(product.name)}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold text-[#8B1A1A]">
                              ${product.salePrice || product.regularPrice}
                            </span>
                            {product.salePrice && product.salePrice < product.regularPrice && (
                              <span className="text-sm text-gray-400 line-through">
                                ${product.regularPrice}
                              </span>
                            )}
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
