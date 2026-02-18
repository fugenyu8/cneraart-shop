import fs from 'fs';
import path from 'path';

const localesDir = './client/src/i18n/locales';
const languages = ['zh', 'en', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'ja', 'ko', 'ar', 'hi', 'th', 'vi', 'id'];

const translations = {
  zh: {
    title: "命理运势",
    subtitle: "紫微斗数深度解析，洞察人生运势轨迹",
    formTitle: "提交您的生辰信息",
    formDesc: "请准确填写以下信息，我们将为您生成专业的命理分析报告",
    name: "姓名",
    namePlaceholder: "请输入您的姓名",
    email: "电子邮箱",
    emailPlaceholder: "用于接收报告",
    gender: "性别",
    genderPlaceholder: "请选择性别",
    male: "男",
    female: "女",
    birthDate: "出生日期",
    year: "年",
    month: "月",
    day: "日",
    birthTime: "出生时辰",
    optional: "选填",
    hour: "时",
    minute: "分",
    question: "您想了解的问题",
    questionPlaceholder: "例如：事业发展、财运、婚姻、健康等",
    submit: "提交分析请求",
    submitting: "提交中...",
    submitSuccess: "提交成功",
    submitSuccessDesc: "您的请求已提交，报告将在48小时内发送至您的邮箱",
    requiredFields: "请填写所有必填项",
    deliveryTime: "* 专业大师将在48小时内完成分析，并通过邮件发送详细报告",
    feature1Title: "紫微斗数",
    feature1Desc: "传承千年的命理学精髓，深度解析命盘",
    feature2Title: "流年运势",
    feature2Desc: "预测未来运势走向，把握人生机遇",
    feature3Title: "专业大师",
    feature3Desc: "五台山资深大师亲自推演，确保准确性"
  },
  en: {
    title: "Destiny Analysis",
    subtitle: "In-depth Zi Wei Dou Shu analysis to reveal your life's trajectory",
    formTitle: "Submit Your Birth Information",
    formDesc: "Please fill in the following information accurately for a professional destiny analysis report",
    name: "Name",
    namePlaceholder: "Enter your name",
    email: "Email",
    emailPlaceholder: "For receiving the report",
    gender: "Gender",
    genderPlaceholder: "Select gender",
    male: "Male",
    female: "Female",
    birthDate: "Birth Date",
    year: "Year",
    month: "Month",
    day: "Day",
    birthTime: "Birth Time",
    optional: "Optional",
    hour: "Hour",
    minute: "Minute",
    question: "Your Questions",
    questionPlaceholder: "e.g., Career, Wealth, Marriage, Health, etc.",
    submit: "Submit Analysis Request",
    submitting: "Submitting...",
    submitSuccess: "Submitted Successfully",
    submitSuccessDesc: "Your request has been submitted. The report will be sent to your email within 48 hours",
    requiredFields: "Please fill in all required fields",
    deliveryTime: "* Professional masters will complete the analysis within 48 hours and send a detailed report via email",
    feature1Title: "Zi Wei Dou Shu",
    feature1Desc: "Thousand-year-old destiny science essence, in-depth chart analysis",
    feature2Title: "Annual Fortune",
    feature2Desc: "Predict future trends and seize life opportunities",
    feature3Title: "Professional Masters",
    feature3Desc: "Personally analyzed by senior masters from Mount Wutai for accuracy"
  }
};

// 为其他语言使用英文翻译
languages.forEach(lang => {
  const filePath = path.join(localesDir, `${lang}.json`);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  content.destiny = translations[lang] || translations.en;
  
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf-8');
  console.log(`✓ Updated ${lang}.json`);
});

console.log('\n✓ All translations updated successfully!');
