import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, 'client/src/i18n/locales');

const translations = {
  reportView: {
    faceReadingReport: {
      zh: "面相分析报告",
      en: "Face Reading Report"
    },
    palmReadingReport: {
      zh: "手相分析报告",
      en: "Palm Reading Report"
    },
    fengshuiReport: {
      zh: "风水分析报告",
      en: "Feng Shui Report"
    },
    download: {
      zh: "下载报告",
      en: "Download Report"
    },
    downloading: {
      zh: "下载中...",
      en: "Downloading..."
    },
    downloadSuccess: {
      zh: "报告下载成功",
      en: "Report downloaded successfully"
    },
    downloadError: {
      zh: "下载失败,请重试",
      en: "Download failed, please try again"
    },
    generatedAt: {
      zh: "生成时间",
      en: "Generated At"
    },
    notFound: {
      zh: "报告未找到",
      en: "Report Not Found"
    },
    notFoundDesc: {
      zh: "抱歉,找不到您请求的报告。请检查链接是否正确。",
      en: "Sorry, we couldn't find the report you requested. Please check if the link is correct."
    },
    processing: {
      zh: "报告生成中",
      en: "Report Processing"
    },
    processingDesc: {
      zh: "您的报告正在生成中,请稍后再来查看。我们会在报告完成后通过邮件通知您。",
      en: "Your report is being generated. Please check back later. We'll notify you by email when it's ready."
    }
  },
  common: {
    back_home: {
      zh: "返回首页",
      en: "Back to Home"
    }
  }
};

const languages = ['zh', 'en'];

languages.forEach(lang => {
  const filePath = path.join(localesDir, `${lang}.json`);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  // Add reportView translations
  if (!content.reportView) {
    content.reportView = {};
  }
  Object.keys(translations.reportView).forEach(key => {
    content.reportView[key] = translations.reportView[key][lang];
  });
  
  // Add common.back_home translation
  if (!content.common) {
    content.common = {};
  }
  content.common.back_home = translations.common.back_home[lang];
  
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');
  console.log(`Updated ${lang}.json`);
});

console.log('All translations added successfully!');
