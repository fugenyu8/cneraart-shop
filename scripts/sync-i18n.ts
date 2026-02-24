/**
 * 同步 i18n 翻译文件
 * 以 zh.json 为基准，补全所有语言文件缺失的 key
 */
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCALES_DIR = path.join(__dirname, "../client/src/i18n/locales");

// 翻译映射表 - 为缺失的 key 提供各语言翻译
const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    "aboutUs.videoTitle": "Consecration Ceremony by Senior Monks",
    "allProducts.add_to_cart": "Add to Cart",
    "allProducts.filter_all": "All Categories",
    "allProducts.in_stock": "In Stock",
    "allProducts.no_results": "No Products Found",
    "allProducts.no_results_desc": "Please try adjusting your search or filters",
    "allProducts.only_left": "Only {{count}} left",
    "allProducts.out_of_stock": "Sold Out",
    "allProducts.search_placeholder": "Search products...",
    "allProducts.sort_label": "Sort By",
    "allProducts.sort_latest": "Newest",
    "allProducts.sort_popular": "Most Popular",
    "allProducts.sort_price_high": "Price: High to Low",
    "allProducts.sort_price_low": "Price: Low to High",
    "allProducts.title": "All Products",
    "allProducts.view_details": "View Details",
    "blessing.scrollHint": "Scroll to see more",
    "blessing.step1.description": "Purification with holy water, agarwood incense, and ancient mantras before the Buddha",
    "blessing.step1.title": "Holy Water Purification",
    "blessing.step2.description": "Senior monks chant sutras with devotion, Buddha's name resounding",
    "blessing.step2.title": "Sutra Chanting & Blessing",
    "blessing.step3.description": "Receiving the wisdom light of Manjushri Bodhisattva and the wealth blessing of Wu Ye",
    "blessing.step3.title": "Sacred Empowerment",
    "blessing.subtitle": "Led by Wutai Mountain Senior Monks, Ancient Tradition",
    "blessing.title": "Consecration Process",
    "common.uploading": "Uploading...",
    "product_detail.uploading_images": "Uploading images...",
    "services.blessed.cta": "Explore Consecrated Items",
    "services.blessed.description": "Sacred dharma instruments consecrated by Wutai Mountain senior monks, protecting your life journey",
    "services.blessed.title": "Consecrated Sacred Items",
    "services.fortune.destiny.description": "Ancient Chinese wisdom, interpreting life fortune and destiny guidance",
    "services.fortune.destiny.title": "Destiny Analysis",
    "services.fortune.fengshui.description": "Harmonizing living spaces with cosmic energy",
    "services.fortune.fengshui.title": "Home Feng Shui Analysis",
    "services.fortune.palm.description": "Revealing ancient wisdom through palm and face reading",
    "services.fortune.palm.title": "Palm & Face Reading",
    "services.fortune.title": "Fortune Services",
    "services.prayer.cta": "Explore Prayer Services",
    "services.prayer.description": "Lamp offerings, incense burning, and various prayer ceremonies for you and your family",
    "services.prayer.title": "Prayer Services",
    "services.subtitle": "Ancient Eastern Wisdom · Modern Spiritual Guidance",
    "services.title": "Our Services",
    // ReportView 新增的 key
    "reportView.report": "Analysis Report",
    "reportView.statusCompleted": "Completed",
    "reportView.statusProcessing": "Processing",
    "reportView.statusPending": "Pending",
    "reportView.statusFailed": "Failed",
    "reportView.processingTime": "Reports are typically delivered within 48 hours",
    "reportView.backToOrders": "Back to Orders",
    "reportView.downloadPDF": "Download PDF",
    "reportView.exploreProducts": "Explore Products",
  },
  ja: {
    "aboutUs.videoTitle": "高僧による開光儀式",
    "allProducts.add_to_cart": "カートに追加",
    "allProducts.filter_all": "全カテゴリ",
    "allProducts.in_stock": "在庫あり",
    "allProducts.no_results": "商品が見つかりません",
    "allProducts.no_results_desc": "検索条件を変更してください",
    "allProducts.only_left": "残り{{count}}点",
    "allProducts.out_of_stock": "売り切れ",
    "allProducts.search_placeholder": "商品を検索...",
    "allProducts.sort_label": "並び替え",
    "allProducts.sort_latest": "新着順",
    "allProducts.sort_popular": "人気順",
    "allProducts.sort_price_high": "価格の高い順",
    "allProducts.sort_price_low": "価格の安い順",
    "allProducts.title": "全商品",
    "allProducts.view_details": "詳細を見る",
    "blessing.scrollHint": "スクロールして詳細を見る",
    "blessing.step1.description": "聖水、沈香、古代の真言で仏前にて浄化",
    "blessing.step1.title": "聖水浄化",
    "blessing.step2.description": "高僧が心を込めて経文を唱え、仏号が響き渡る",
    "blessing.step2.title": "読経加持",
    "blessing.step3.description": "文殊菩薩の智慧の光と五爺財神の富貴の力を授かる",
    "blessing.step3.title": "聖地灌頂",
    "blessing.subtitle": "五台山高僧主持、古法伝承",
    "blessing.title": "開光の流れ",
    "common.uploading": "アップロード中...",
    "product_detail.uploading_images": "画像をアップロード中...",
    "services.blessed.cta": "開光法物を探す",
    "services.blessed.description": "五台山高僧が開光した神聖な法器、あなたの人生を守護",
    "services.blessed.title": "開光法物",
    "services.fortune.destiny.description": "古代中国の知恵で人生の運勢と運命を解読",
    "services.fortune.destiny.title": "運命分析",
    "services.fortune.fengshui.description": "住空間と宇宙エネルギーの調和",
    "services.fortune.fengshui.title": "家居風水分析",
    "services.fortune.palm.description": "手相と人相で古代の知恵を解き明かす",
    "services.fortune.palm.title": "手相・人相分析",
    "services.fortune.title": "占いサービス",
    "services.prayer.cta": "祈福サービスを探す",
    "services.prayer.description": "灯明、お香、各種祈福儀式であなたとご家族の幸福を祈る",
    "services.prayer.title": "代理祈福サービス",
    "services.subtitle": "古代東洋の知恵 · 現代のスピリチュアルガイダンス",
    "services.title": "サービス一覧",
    "reportView.report": "分析レポート",
    "reportView.statusCompleted": "完了",
    "reportView.statusProcessing": "処理中",
    "reportView.statusPending": "保留中",
    "reportView.statusFailed": "失敗",
    "reportView.processingTime": "レポートは通常48時間以内に配信されます",
    "reportView.backToOrders": "注文に戻る",
    "reportView.downloadPDF": "PDFダウンロード",
    "reportView.exploreProducts": "商品を探す",
  },
  ko: {
    "aboutUs.videoTitle": "고승 개광 의식",
    "allProducts.add_to_cart": "장바구니에 추가",
    "allProducts.filter_all": "전체 카테고리",
    "allProducts.in_stock": "재고 있음",
    "allProducts.no_results": "상품을 찾을 수 없습니다",
    "allProducts.no_results_desc": "검색 조건을 변경해 주세요",
    "allProducts.only_left": "{{count}}개 남음",
    "allProducts.out_of_stock": "품절",
    "allProducts.search_placeholder": "상품 검색...",
    "allProducts.sort_label": "정렬",
    "allProducts.sort_latest": "최신순",
    "allProducts.sort_popular": "인기순",
    "allProducts.sort_price_high": "높은 가격순",
    "allProducts.sort_price_low": "낮은 가격순",
    "allProducts.title": "전체 상품",
    "allProducts.view_details": "상세 보기",
    "blessing.scrollHint": "스크롤하여 더 보기",
    "blessing.step1.description": "성수, 침향, 고대 주문으로 부처님 앞에서 정화",
    "blessing.step1.title": "성수 정화",
    "blessing.step2.description": "고승이 정성을 다해 경전을 독송",
    "blessing.step2.title": "독경 가지",
    "blessing.step3.description": "문수보살의 지혜의 빛과 오야재신의 부귀의 힘을 받음",
    "blessing.step3.title": "성지 관정",
    "blessing.subtitle": "오대산 고승 주관, 고법 전승",
    "blessing.title": "개광 과정",
    "common.uploading": "업로드 중...",
    "product_detail.uploading_images": "이미지 업로드 중...",
    "services.blessed.cta": "개광 법물 탐색",
    "services.blessed.description": "오대산 고승이 개광한 신성한 법기, 당신의 인생 여정을 수호",
    "services.blessed.title": "개광 법물",
    "services.fortune.destiny.description": "고대 중국 지혜로 인생 운세와 운명 해석",
    "services.fortune.destiny.title": "운명 분석",
    "services.fortune.fengshui.description": "거주 공간과 우주 에너지의 조화",
    "services.fortune.fengshui.title": "가정 풍수 분석",
    "services.fortune.palm.description": "수상과 관상으로 고대 지혜를 밝히다",
    "services.fortune.palm.title": "수상·관상 분석",
    "services.fortune.title": "운세 서비스",
    "services.prayer.cta": "기복 서비스 탐색",
    "services.prayer.description": "등공양, 향공양 및 각종 기복 의식",
    "services.prayer.title": "대리 기복 서비스",
    "services.subtitle": "고대 동양 지혜 · 현대 영적 안내",
    "services.title": "서비스",
    "reportView.report": "분석 보고서",
    "reportView.statusCompleted": "완료",
    "reportView.statusProcessing": "처리 중",
    "reportView.statusPending": "대기 중",
    "reportView.statusFailed": "실패",
    "reportView.processingTime": "보고서는 보통 48시간 이내에 전달됩니다",
    "reportView.backToOrders": "주문으로 돌아가기",
    "reportView.downloadPDF": "PDF 다운로드",
    "reportView.exploreProducts": "상품 탐색",
  },
};

// 递归设置嵌套对象的值
function setNestedValue(obj: any, dotPath: string, value: string) {
  const parts = dotPath.split(".");
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]]) current[parts[i]] = {};
    current = current[parts[i]];
  }
  current[parts[parts.length - 1]] = value;
}

// 递归获取嵌套对象的值
function getNestedValue(obj: any, dotPath: string): string | undefined {
  const parts = dotPath.split(".");
  let current = obj;
  for (const part of parts) {
    if (!current || typeof current !== "object") return undefined;
    current = current[part];
  }
  return typeof current === "string" ? current : undefined;
}

// 获取所有 key
function getAllKeys(obj: any, prefix = ""): string[] {
  const keys: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "object" && v !== null && !Array.isArray(v)) {
      keys.push(...getAllKeys(v, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

async function main() {
  // 读取中文基准
  const zhPath = path.join(LOCALES_DIR, "zh.json");
  const zh = JSON.parse(fs.readFileSync(zhPath, "utf-8"));
  
  // 先给中文添加新的 reportView key
  const newZhKeys: Record<string, string> = {
    "reportView.report": "分析报告",
    "reportView.statusCompleted": "已完成",
    "reportView.statusProcessing": "分析中",
    "reportView.statusPending": "待处理",
    "reportView.statusFailed": "失败",
    "reportView.processingTime": "报告通常在48小时内交付",
    "reportView.backToOrders": "返回订单",
    "reportView.downloadPDF": "下载PDF报告",
    "reportView.exploreProducts": "探索产品",
  };
  
  for (const [key, value] of Object.entries(newZhKeys)) {
    if (!getNestedValue(zh, key)) {
      setNestedValue(zh, key, value);
    }
  }
  fs.writeFileSync(zhPath, JSON.stringify(zh, null, 2) + "\n", "utf-8");
  console.log(`✅ 更新 zh.json (添加 ${Object.keys(newZhKeys).length} 个新 key)`);

  const zhKeys = getAllKeys(zh);
  console.log(`基准 zh.json: ${zhKeys.length} keys\n`);

  // 处理每个语言文件
  const localeFiles = fs.readdirSync(LOCALES_DIR).filter(f => f.endsWith(".json") && f !== "zh.json");

  for (const file of localeFiles) {
    const lang = file.replace(".json", "");
    const filePath = path.join(LOCALES_DIR, file);
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const langKeys = getAllKeys(data);
    const missingKeys = zhKeys.filter(k => !langKeys.includes(k));

    if (missingKeys.length === 0) {
      console.log(`✅ ${lang}: 完整 (${langKeys.length} keys)`);
      continue;
    }

    let addedFromTranslation = 0;
    let addedFromFallback = 0;

    for (const key of missingKeys) {
      // 优先使用翻译映射表
      const translation = TRANSLATIONS[lang]?.[key];
      if (translation) {
        setNestedValue(data, key, translation);
        addedFromTranslation++;
      } else if (lang === "zh-Hant") {
        // 繁体中文直接用简体
        const zhValue = getNestedValue(zh, key);
        if (zhValue) {
          setNestedValue(data, key, zhValue);
          addedFromFallback++;
        }
      } else {
        // 其他语言：使用英文翻译作为 fallback
        const enTranslation = TRANSLATIONS.en?.[key];
        if (enTranslation) {
          setNestedValue(data, key, enTranslation);
          addedFromFallback++;
        } else {
          // 最终 fallback: 使用中文原文
          const zhValue = getNestedValue(zh, key);
          if (zhValue) {
            setNestedValue(data, key, zhValue);
            addedFromFallback++;
          }
        }
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
    console.log(`✅ ${lang}: 补全 ${missingKeys.length} 个 key (翻译: ${addedFromTranslation}, fallback: ${addedFromFallback})`);
  }

  console.log("\n同步完成！");
}

main().catch(console.error);
