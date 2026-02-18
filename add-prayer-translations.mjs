import fs from 'fs';
import path from 'path';

const localesDir = './client/src/i18n/locales';
const languages = ['zh', 'en', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'ja', 'ko', 'ar', 'hi', 'th', 'vi', 'id'];

const translations = {
  zh: {
    title: "代客祈福",
    subtitle: "五台山大师代您祈福，传递心愿，祈求平安",
    lampService: "供灯祈福",
    lampDesc: "在五台山圣地为您点亮祈福灯，照亮前程，驱散阴霾",
    lampFeature1: "五台山文殊菩萨道场供灯",
    lampFeature2: "大师诵经回向，功德圆满",
    lampFeature3: "提供供灯照片和祈福证明",
    perLamp: "盏",
    incenseService: "供香祈福",
    incenseDesc: "在五台山圣地为您敬香祈福，传递心愿，祈求吉祥",
    incenseFeature1: "五台山大雄宝殿敬香",
    incenseFeature2: "大师代为祈福回向",
    incenseFeature3: "提供敬香照片和祈福证明",
    perIncense: "支",
    formTitle: "提交祈福请求",
    formDesc: "请填写以下信息，我们将为您诚心祈福",
    name: "姓名",
    namePlaceholder: "请输入您的姓名或祈福对象姓名",
    email: "电子邮箱",
    emailPlaceholder: "用于接收祈福证明",
    serviceType: "祈福方式",
    serviceTypePlaceholder: "请选择祈福方式",
    prayerFor: "祈福对象",
    prayerForPlaceholder: "例如：本人、家人、朋友等",
    wish: "祈福心愿",
    wishPlaceholder: "请写下您的心愿，例如：平安健康、事业顺利、学业进步等",
    optional: "选填",
    quantity: "数量",
    lamps: "盏",
    incenses: "支",
    submit: "提交祈福请求",
    submitting: "提交中...",
    submitSuccess: "提交成功",
    submitSuccessDesc: "您的祈福请求已提交，我们将为您诚心祈福",
    requiredFields: "请填写所有必填项",
    deliveryTime: "* 我们将在3个工作日内完成祈福，并通过邮件发送祈福证明和照片",
    trust1Title: "五台山圣地",
    trust1Desc: "世界五大佛教圣地之一，文殊菩萨道场",
    trust2Title: "真实照片",
    trust2Desc: "每次祈福都会拍照记录，确保真实可信",
    trust3Title: "邮件反馈",
    trust3Desc: "祈福完成后，将照片和证明发送至您的邮箱"
  },
  en: {
    title: "Prayer Service",
    subtitle: "Masters from Mount Wutai pray for you, convey wishes, and seek peace",
    lampService: "Lamp Offering",
    lampDesc: "Light a prayer lamp for you at Mount Wutai sacred site to illuminate the path and dispel darkness",
    lampFeature1: "Lamp offering at Manjushri Bodhisattva Monastery",
    lampFeature2: "Master chanting and dedication for merit completion",
    lampFeature3: "Provide lamp offering photos and prayer certificate",
    perLamp: "lamp",
    incenseService: "Incense Offering",
    incenseDesc: "Offer incense for you at Mount Wutai sacred site to convey wishes and seek auspiciousness",
    incenseFeature1: "Incense offering at Main Hall",
    incenseFeature2: "Master praying and dedication on behalf",
    incenseFeature3: "Provide incense offering photos and prayer certificate",
    perIncense: "stick",
    formTitle: "Submit Prayer Request",
    formDesc: "Please fill in the following information, we will pray sincerely for you",
    name: "Name",
    namePlaceholder: "Enter your name or the name of the prayer recipient",
    email: "Email",
    emailPlaceholder: "For receiving prayer certificate",
    serviceType: "Prayer Method",
    serviceTypePlaceholder: "Select prayer method",
    prayerFor: "Prayer Recipient",
    prayerForPlaceholder: "e.g., Myself, Family, Friends, etc.",
    wish: "Prayer Wish",
    wishPlaceholder: "Write your wish, e.g., Peace and Health, Career Success, Academic Progress, etc.",
    optional: "Optional",
    quantity: "Quantity",
    lamps: "lamps",
    incenses: "sticks",
    submit: "Submit Prayer Request",
    submitting: "Submitting...",
    submitSuccess: "Submitted Successfully",
    submitSuccessDesc: "Your prayer request has been submitted, we will pray sincerely for you",
    requiredFields: "Please fill in all required fields",
    deliveryTime: "* We will complete the prayer within 3 business days and send the prayer certificate and photos via email",
    trust1Title: "Mount Wutai Sacred Site",
    trust1Desc: "One of the five major Buddhist sacred sites in the world, Manjushri Bodhisattva Monastery",
    trust2Title: "Authentic Photos",
    trust2Desc: "Each prayer is photographed to ensure authenticity and credibility",
    trust3Title: "Email Feedback",
    trust3Desc: "After prayer completion, photos and certificates will be sent to your email"
  }
};

languages.forEach(lang => {
  const filePath = path.join(localesDir, `${lang}.json`);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  content.prayer = translations[lang] || translations.en;
  
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf-8');
  console.log(`✓ Updated ${lang}.json`);
});

console.log('\n✓ All translations updated successfully!');
