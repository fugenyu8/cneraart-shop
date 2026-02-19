#!/usr/bin/env node
/**
 * 扩展面相、手相、风水服务数据库
 * 为三个服务添加更全面细致的分析规则
 */

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

console.log('🚀 开始扩展服务数据库...\n');

// ============= 面相规则扩展 =============
console.log('📊 扩展面相分析规则...');

const expandedFaceRules = [
  // 额头部分 - 扩展
  { palaceName: '命宫', featureName: '额头', conditionOperator: '==', conditionValue: 'very_wide', score: 95, category: '事业', interpretation: '额头极为宽阔,天庭饱满,智慧超群,思维敏捷,具有卓越的领导才能和战略眼光。早年运势极佳,贵人相助,事业发展顺遂。', suggestion: '充分发挥领导才能,可从事管理、战略规划等高层工作。注意保持谦逊,避免过于自信。' },
  { featureName: '额头', featureType: 'forehead', conditionType: 'height', conditionValue: 'very_high', score: 92, interpretation: '额头极高,天庭开阔,智慧出众,思考深邃,具有哲学家般的思维。适合从事研究、教育、咨询等需要深度思考的工作。', suggestion: '发挥思考优势,可在学术、研究领域取得卓越成就。注意与人沟通时要通俗易懂。' },
  { featureName: '额头', featureType: 'forehead', conditionType: 'smoothness', conditionValue: 'very_smooth', score: 90, interpretation: '额头极为光滑,无杂纹,心性纯净,思维清晰,少有烦恼。一生运势平稳,贵人相助,事业顺遂。', suggestion: '保持心态平和,继续发展事业。可多行善事,积累福报。' },
  { featureName: '额头', featureType: 'forehead', conditionType: 'color', conditionValue: 'bright', score: 88, interpretation: '额头明亮有光泽,精神饱满,运势旺盛,近期有喜事临门。事业发展顺利,财运亨通。', suggestion: '把握当前良机,积极进取。注意保持身体健康,劳逸结合。' },
  
  // 眉毛部分 - 扩展
  { featureName: '眉毛', featureType: 'eyebrow', conditionType: 'shape', conditionValue: 'crescent', score: 92, interpretation: '眉如新月,温柔善良,人缘极佳,异性缘旺。性格温和,善解人意,容易获得他人信任和帮助。', suggestion: '发挥人际优势,可从事公关、销售、服务等工作。注意保持原则,不要过于迁就他人。' },
  { featureName: '眉毛', featureType: 'eyebrow', conditionType: 'thickness', conditionValue: 'very_thick', score: 85, interpretation: '眉毛浓密,性格刚毅,意志坚定,执行力强。做事果断,不畏困难,容易在竞争中脱颖而出。', suggestion: '发挥执行力优势,可在竞争激烈的行业取得成功。注意控制脾气,避免冲动行事。' },
  { featureName: '眉毛', featureType: 'eyebrow', conditionType: 'length', conditionValue: 'very_long', score: 90, interpretation: '眉毛修长,超过眼尾,兄弟姐妹缘深,朋友众多,人脉广阔。中年运势极佳,事业发展顺遂。', suggestion: '善用人脉资源,可在需要团队协作的领域发展。注意维护关系,真诚待人。' },
  { featureName: '眉毛', featureType: 'eyebrow', conditionType: 'distance', conditionValue: 'wide', score: 87, interpretation: '眉间距宽,心胸开阔,包容力强,不拘小节。性格豁达,容易原谅他人,人际关系和谐。', suggestion: '发挥包容优势,可从事调解、咨询等工作。注意保持原则,不要过于宽容。' },
  
  // 眼睛部分 - 扩展
  { featureName: '眼睛', featureType: 'eye', conditionType: 'size', conditionValue: 'very_large', score: 90, interpretation: '眼睛极大,炯炯有神,观察力敏锐,洞察力强。性格外向,表达能力强,容易获得他人信任。', suggestion: '发挥观察力优势,可从事侦探、分析、研究等工作。注意保护眼睛,避免过度用眼。' },
  { featureName: '眼睛', featureType: 'eye', conditionType: 'brightness', conditionValue: 'very_bright', score: 95, interpretation: '眼神明亮有光,精神饱满,智慧超群,运势极佳。近期有重大机遇,事业发展迅速。', suggestion: '把握当前良机,积极进取。可在创业、投资等领域取得成功。' },
  { featureName: '眼睛', featureType: 'eye', conditionType: 'shape', conditionValue: 'phoenix', score: 93, interpretation: '凤眼,眼尾上扬,贵气十足,天生富贵命。性格高雅,品味独特,容易获得高层赏识。', suggestion: '发挥贵气优势,可在艺术、文化、高端服务等领域发展。注意保持谦逊,避免傲慢。' },
  { featureName: '眼睛', featureType: 'eye', conditionType: 'distance', conditionValue: 'moderate', score: 88, interpretation: '两眼间距适中,性格平衡,理性与感性并重。做事稳重,考虑周全,容易获得成功。', suggestion: '保持平衡心态,可在需要综合能力的领域发展。注意培养专长,形成核心竞争力。' },
  
  // 鼻子部分 - 扩展
  { featureName: '鼻子', featureType: 'nose', conditionType: 'height', conditionValue: 'very_high', score: 92, interpretation: '鼻梁极高,自尊心强,追求卓越,不甘平庸。事业心重,容易在专业领域取得突出成就。', suggestion: '发挥专业优势,可在技术、艺术等领域深耕。注意控制自尊心,虚心学习。' },
  { featureName: '鼻子', featureType: 'nose', conditionValue: 'large_round', score: 95, interpretation: '鼻头丰隆圆润,财库丰厚,财运极佳。中年后财富积累迅速,生活富足,家业兴旺。', suggestion: '善于理财投资,可在金融、房地产等领域发展。注意量入为出,稳健投资。' },
  { featureName: '鼻子', featureType: 'nose', conditionType: 'straightness', conditionValue: 'very_straight', score: 90, interpretation: '鼻梁笔直,性格正直,原则性强,不易妥协。做事公正,容易获得他人尊重和信任。', suggestion: '发挥正直优势,可从事法律、监察、管理等工作。注意灵活变通,避免过于刚硬。' },
  { featureName: '鼻子', featureType: 'nose', conditionType: 'width', conditionValue: 'wide', score: 87, interpretation: '鼻翼宽阔,财运旺盛,赚钱能力强。性格豪爽,善于交际,人脉广阔,容易获得商机。', suggestion: '发挥赚钱能力,可在商业、销售等领域发展。注意控制开支,避免浪费。' },
  
  // 嘴巴部分 - 扩展
  { featureName: '嘴巴', featureType: 'mouth', conditionType: 'size', conditionValue: 'very_large', score: 88, interpretation: '嘴巴极大,食禄丰厚,一生不愁吃穿。性格豪爽,善于表达,容易获得他人喜爱。', suggestion: '发挥表达优势,可从事演讲、主持、销售等工作。注意控制饮食,保持健康。' },
  { featureName: '嘴巴', featureType: 'mouth', conditionType: 'shape', conditionValue: 'bow', score: 92, interpretation: '嘴型如弓,唇红齿白,贵气十足。性格温柔,善解人意,异性缘极佳,容易获得幸福婚姻。', suggestion: '发挥魅力优势,可在艺术、娱乐、公关等领域发展。注意保持真诚,避免虚伪。' },
  { featureName: '嘴巴', featureType: 'mouth', conditionType: 'thickness', conditionValue: 'thick', score: 85, interpretation: '嘴唇厚实,重情重义,感情丰富。性格热情,善于关心他人,容易获得深厚友谊。', suggestion: '发挥情感优势,可在教育、咨询、服务等工作发展。注意保护自己,避免过度付出。' },
  { featureName: '嘴巴', featureType: 'mouth', conditionType: 'corners', conditionValue: 'upturned', score: 90, interpretation: '嘴角上扬,性格乐观,心态积极。一生多喜事,运势顺遂,容易获得幸福人生。', suggestion: '保持乐观心态,继续积极生活。可多帮助他人,传播正能量。' },
  
  // 耳朵部分 - 扩展
  { featureName: '耳朵', featureType: 'ear', conditionType: 'size', conditionValue: 'very_large', score: 93, interpretation: '耳朵极大,福气深厚,长寿之相。性格稳重,智慧超群,一生多贵人相助。', suggestion: '发挥智慧优势,可在需要经验积累的领域发展。注意保养身体,享受长寿福气。' },
  { featureName: '耳朵', featureType: 'ear', conditionType: 'thickness', conditionValue: 'very_thick', score: 90, interpretation: '耳朵厚实,肾气充足,身体健康,精力旺盛。财运亨通,一生富足,家业兴旺。', suggestion: '保持健康生活方式,继续发展事业。可多运动锻炼,延年益寿。' },
  { featureName: '耳朵', featureType: 'ear', conditionType: 'position', conditionValue: 'high', score: 88, interpretation: '耳朵位置高,超过眉毛,智慧超群,早年得志。性格聪慧,学习能力强,容易在年轻时取得成功。', suggestion: '发挥智慧优势,可在学术、科技等领域发展。注意保持谦逊,继续学习进步。' },
  { featureName: '耳朵', featureType: 'ear', conditionType: 'shape', conditionValue: 'attached', score: 85, interpretation: '耳朵贴脑,性格稳重,做事谨慎,不易冲动。一生运势平稳,少有大起大落。', suggestion: '发挥稳重优势,可在需要细致工作的领域发展。注意适度冒险,把握机遇。' },
  
  // 下巴部分 - 扩展
  { featureName: '下巴', featureType: 'chin', conditionType: 'shape', conditionValue: 'round_full', score: 92, interpretation: '下巴圆润饱满,晚年运势极佳,福禄双全。性格温和,人缘好,容易获得子女孝顺。', suggestion: '保持良好心态,享受晚年福气。可多培养兴趣爱好,丰富晚年生活。' },
  { featureName: '下巴', featureType: 'chin', conditionType: 'length', conditionValue: 'very_long', score: 88, interpretation: '下巴修长,意志坚定,耐力超群。做事有始有终,不轻言放弃,容易在长期项目中取得成功。', suggestion: '发挥耐力优势,可在需要长期坚持的领域发展。注意劳逸结合,避免过度劳累。' },
  { featureName: '下巴', featureType: 'chin', conditionType: 'width', conditionValue: 'wide', score: 85, interpretation: '下巴宽阔,地阁方圆,晚年运势旺盛,财富积累丰厚。性格稳重,做事踏实,容易获得成功。', suggestion: '继续稳健发展,可在房地产、投资等领域积累财富。注意保养身体,享受晚年。' },
  
  // 颧骨部分 - 扩展
  { featureName: '颧骨', featureType: 'cheekbone', conditionType: 'height', conditionValue: 'very_high', score: 90, interpretation: '颧骨高耸,权力欲强,领导才能卓越。性格果断,执行力强,容易在管理岗位取得成功。', suggestion: '发挥领导才能,可在管理、政治等领域发展。注意控制权力欲,避免独断专行。' },
  { featureName: '颧骨', featureType: 'cheekbone', conditionType: 'prominence', conditionValue: 'moderate', score: 88, interpretation: '颧骨适中,性格平衡,既有主见又善于听取意见。做事稳重,容易获得团队信任。', suggestion: '发挥平衡优势,可在需要团队协作的领域发展。注意培养领导力,提升影响力。' },
  { featureName: '颧骨', featureType: 'cheekbone', conditionType: 'symmetry', conditionValue: 'perfect', score: 92, interpretation: '颧骨对称完美,性格公正,处事公平,容易获得他人尊重。一生运势平稳,事业发展顺遂。', suggestion: '发挥公正优势,可从事法律、仲裁、管理等工作。注意保持客观,避免偏见。' },
  
  // 人中部分 - 扩展
  { featureName: '人中', featureType: 'philtrum', conditionType: 'depth', conditionValue: 'very_deep', score: 90, interpretation: '人中极深,子女缘深厚,子孙满堂。性格正直,做事有原则,容易获得子女孝顺。', suggestion: '注重家庭教育,培养优秀子女。可多关心家人,享受天伦之乐。' },
  { featureName: '人中', featureType: 'philtrum', conditionType: 'length', conditionValue: 'very_long', score: 88, interpretation: '人中修长,长寿之相,身体健康,精力旺盛。一生多福气,晚年运势极佳。', suggestion: '保持健康生活方式,可多运动锻炼。注意保养身体,享受长寿福气。' },
  { featureName: '人中', featureType: 'philtrum', conditionType: 'width', conditionValue: 'moderate', score: 85, interpretation: '人中宽度适中,性格平和,做事稳重。子女缘佳,家庭和睦,一生幸福美满。', suggestion: '注重家庭和谐,培养良好亲子关系。可多陪伴家人,享受家庭温暖。' },
  
  // 法令纹部分 - 扩展
  { featureName: '法令纹', featureType: 'nasolabial_fold', conditionType: 'depth', conditionValue: 'deep_clear', score: 88, interpretation: '法令纹深而清晰,权威感强,领导才能卓越。中年后事业发展迅速,地位提升,受人尊重。', suggestion: '发挥领导才能,可在管理、政治等领域取得成就。注意保持谦逊,避免傲慢。' },
  { featureName: '法令纹', featureType: 'nasolabial_fold', conditionType: 'length', conditionValue: 'very_long', score: 90, interpretation: '法令纹极长,延伸至下巴,长寿之相,晚年运势极佳。一生多福气,子孙满堂,家业兴旺。', suggestion: '保持健康生活方式,享受长寿福气。可多培养兴趣爱好,丰富晚年生活。' },
  { featureName: '法令纹', featureType: 'nasolabial_fold', conditionType: 'symmetry', conditionValue: 'perfect', score: 87, interpretation: '法令纹对称完美,性格公正,处事公平。中年运势平稳,事业发展顺遂,家庭和睦。', suggestion: '发挥公正优势,可从事法律、仲裁等工作。注意保持客观,避免偏见。' },
];

console.log(`准备插入 ${expandedFaceRules.length} 条面相规则...`);
for (const rule of expandedFaceRules) {
  await db.insert(schema.faceRules).values(rule);
}
console.log('✅ 面相规则扩展完成!\n');

// ============= 手相规则扩展 =============
console.log('🖐️ 扩展手相分析规则...');

const expandedPalmRules = [
  // 生命线扩展
  { lineName: '生命线', lineType: 'life', conditionType: 'length', conditionValue: 'very_long', score: 95, interpretation: '生命线极长,延伸至手腕,长寿之相,身体健康,精力旺盛。一生少病少灾,活力充沛,容易享受高寿。', suggestion: '保持健康生活方式,可多运动锻炼。注意劳逸结合,避免过度劳累。' },
  { lineName: '生命线', lineType: 'life', conditionType: 'depth', conditionValue: 'very_deep', score: 92, interpretation: '生命线极深,体质强健,生命力旺盛。抗病能力强,恢复力快,一生健康运极佳。', suggestion: '发挥体力优势,可从事需要体力的工作。注意保养身体,避免透支健康。' },
  { lineName: '生命线', lineType: 'life', conditionType: 'clarity', conditionValue: 'very_clear', score: 90, interpretation: '生命线极为清晰,无杂纹干扰,一生健康运势极佳,少有疾病困扰。精力充沛,活力十足。', suggestion: '保持良好生活习惯,继续享受健康人生。可多参与户外活动,增强体质。' },
  { lineName: '生命线', lineType: 'life', conditionType: 'curvature', conditionValue: 'wide_arc', score: 88, interpretation: '生命线弧度宽阔,包围金星丘,精力旺盛,活力充沛。性格外向,热情开朗,容易获得他人喜爱。', suggestion: '发挥活力优势,可从事需要社交的工作。注意控制情绪,避免过度兴奋。' },
  { lineName: '生命线', lineType: 'life', conditionType: 'branches', conditionValue: 'upward_many', score: 85, interpretation: '生命线有多条向上分支,一生多贵人相助,机遇众多。每个阶段都有新的发展机会,运势持续上升。', suggestion: '把握每个机遇,积极进取。注意维护人脉,真诚待人。' },
  
  // 智慧线扩展
  { lineName: '智慧线', lineType: 'head', conditionType: 'length', conditionValue: 'very_long', score: 95, interpretation: '智慧线极长,延伸至手掌边缘,智慧超群,思维深邃。分析能力强,逻辑严密,适合从事研究、分析等工作。', suggestion: '发挥智慧优势,可在学术、科研领域取得卓越成就。注意与人沟通时要通俗易懂。' },
  { lineName: '智慧线', lineType: 'head', conditionType: 'straightness', conditionValue: 'very_straight', score: 90, interpretation: '智慧线笔直,思维理性,逻辑清晰。做事有条理,分析能力强,适合从事技术、工程等工作。', suggestion: '发挥理性优势,可在需要逻辑思维的领域发展。注意培养创造力,避免过于刻板。' },
  { lineName: '智慧线', lineType: 'head', conditionType: 'depth', conditionValue: 'very_deep', score: 92, interpretation: '智慧线极深,专注力强,思考深入。做事认真,追求完美,容易在专业领域取得突出成就。', suggestion: '发挥专注优势,可在需要深度钻研的领域发展。注意劳逸结合,避免过度劳累。' },
  { lineName: '智慧线', lineType: 'head', conditionType: 'slope', conditionValue: 'gentle_down', score: 88, interpretation: '智慧线温和下斜,想象力丰富,创造力强。性格浪漫,艺术天赋高,适合从事创意、艺术等工作。', suggestion: '发挥创造力优势,可在艺术、设计等领域发展。注意保持理性,避免过于理想化。' },
  { lineName: '智慧线', lineType: 'head', conditionType: 'clarity', conditionValue: 'very_clear', score: 90, interpretation: '智慧线极为清晰,思维敏捷,判断准确。决策能力强,少有失误,容易在需要快速决策的领域成功。', suggestion: '发挥决策优势,可在商业、投资等领域发展。注意充分调研,避免冲动决策。' },
  
  // 感情线扩展
  { lineName: '感情线', lineType: 'heart', conditionType: 'length', conditionValue: 'very_long', score: 92, interpretation: '感情线极长,延伸至食指下方,感情丰富,重情重义。对爱情忠诚,容易获得幸福美满的婚姻。', suggestion: '珍惜感情,真诚待人。注意保持理性,避免过度付出。' },
  { lineName: '感情线', lineType: 'heart', conditionType: 'depth', conditionValue: 'very_deep', score: 90, interpretation: '感情线极深,感情专一,爱恨分明。对爱情执着,一旦认定就会全心投入,容易获得深厚感情。', suggestion: '发挥专一优势,建立稳定关系。注意控制情绪,避免过于执着。' },
  { lineName: '感情线', lineType: 'heart', conditionType: 'curvature', conditionValue: 'smooth_arc', score: 88, interpretation: '感情线呈平滑弧线,性格温柔,善解人意。感情细腻,容易获得他人喜爱,婚姻运极佳。', suggestion: '发挥温柔优势,建立和谐关系。注意保持自我,避免过度迁就。' },
  { lineName: '感情线', lineType: 'heart', conditionType: 'branches', conditionValue: 'upward_many', score: 85, interpretation: '感情线有多条向上分支,异性缘极佳,桃花运旺。容易获得多段美好感情,最终找到真爱。', suggestion: '珍惜每段感情,真诚待人。注意理性选择,避免滥情。' },
  { lineName: '感情线', lineType: 'heart', conditionType: 'ending', conditionValue: 'index_finger', score: 90, interpretation: '感情线延伸至食指下方,理想主义者,对爱情要求高。追求完美爱情,容易获得精神契合的伴侣。', suggestion: '保持理想,但也要接受现实。注意沟通理解,建立深厚感情。' },
  
  // 事业线扩展
  { lineName: '事业线', lineType: 'fate', conditionType: 'clarity', conditionValue: 'very_clear', score: 95, interpretation: '事业线极为清晰,事业运势极佳,目标明确,方向清晰。一生事业发展顺遂,容易取得卓越成就。', suggestion: '坚持目标,持续努力。注意把握机遇,勇于创新。' },
  { lineName: '事业线', lineType: 'fate', conditionType: 'straightness', conditionValue: 'very_straight', score: 92, interpretation: '事业线笔直,事业发展稳定,少有波折。做事有计划,执行力强,容易在稳定行业取得成功。', suggestion: '发挥稳定优势,可在大型企业、政府机关等发展。注意创新突破,避免过于保守。' },
  { lineName: '事业线', lineType: 'fate', conditionType: 'depth', conditionValue: 'very_deep', score: 90, interpretation: '事业线极深,事业心强,追求卓越。工作投入度高,容易在专业领域取得突出成就。', suggestion: '发挥事业心优势,可在竞争激烈的行业发展。注意工作生活平衡,避免过度劳累。' },
  { lineName: '事业线', lineType: 'fate', conditionType: 'starting_point', conditionValue: 'life_line', score: 88, interpretation: '事业线起于生命线,早年需依靠家庭支持,中年后事业独立发展。一生事业运势逐步上升,晚年成就显著。', suggestion: '珍惜家庭支持,努力奋斗。注意培养独立能力,逐步建立事业基础。' },
  { lineName: '事业线', lineType: 'fate', conditionType: 'ending', conditionValue: 'middle_finger', score: 92, interpretation: '事业线延伸至中指下方,事业运势极佳,容易在中年后取得重大成就。地位提升,受人尊重。', suggestion: '把握中年机遇,积极进取。注意保持谦逊,避免傲慢。' },
  
  // 财运线扩展
  { lineName: '财运线', lineType: 'sun', conditionType: 'clarity', conditionValue: 'very_clear', score: 95, interpretation: '财运线极为清晰,财运极佳,赚钱能力强。一生财富积累丰厚,容易实现财务自由。', suggestion: '善于理财投资,可在金融、商业等领域发展。注意量入为出,稳健投资。' },
  { lineName: '财运线', lineType: 'sun', conditionType: 'depth', conditionValue: 'very_deep', score: 92, interpretation: '财运线极深,财富积累稳定,财运持续旺盛。投资眼光准确,容易获得丰厚回报。', suggestion: '发挥投资优势,可在房地产、股票等领域发展。注意分散风险,避免过度投机。' },
  { lineName: '财运线', lineType: 'sun', conditionType: 'length', conditionValue: 'very_long', score: 90, interpretation: '财运线极长,一生财运持续旺盛,财富来源多样。容易通过多种渠道积累财富,晚年富足。', suggestion: '开拓多元收入渠道,可在多个领域投资。注意专注主业,避免分散精力。' },
  { lineName: '财运线', lineType: 'sun', conditionType: 'branches', conditionValue: 'multiple', score: 88, interpretation: '财运线有多条分支,财富来源多样,赚钱机会众多。容易通过副业、投资等获得额外收入。', suggestion: '把握赚钱机会,积极开拓。注意风险控制,避免过度投资。' },
  
  // 婚姻线扩展
  { lineName: '婚姻线', lineType: 'marriage', conditionType: 'clarity', conditionValue: 'very_clear', score: 92, interpretation: '婚姻线极为清晰,婚姻运势极佳,容易获得幸福美满的婚姻。伴侣关系和谐,感情深厚。', suggestion: '珍惜婚姻,真诚待人。注意沟通理解,维护感情。' },
  { lineName: '婚姻线', lineType: 'marriage', conditionType: 'depth', conditionValue: 'very_deep', score: 90, interpretation: '婚姻线极深,婚姻感情深厚,对伴侣忠诚。一生只有一段婚姻,感情稳定,白头偕老。', suggestion: '发挥忠诚优势,建立稳定婚姻。注意保持浪漫,增进感情。' },
  { lineName: '婚姻线', lineType: 'marriage', conditionType: 'length', conditionValue: 'very_long', score: 88, interpretation: '婚姻线极长,婚姻持续时间长,感情稳定。容易与伴侣相伴一生,共度美好时光。', suggestion: '珍惜长久感情,共同成长。注意保持新鲜感,避免感情平淡。' },
  { lineName: '婚姻线', lineType: 'marriage', conditionType: 'position', conditionValue: 'high', score: 85, interpretation: '婚姻线位置高,靠近小指根部,晚婚之相。晚年婚姻运势极佳,容易找到成熟稳重的伴侣。', suggestion: '不必着急婚姻,等待合适时机。注意提升自我,吸引优质伴侣。' },
  
  // 健康线扩展
  { lineName: '健康线', lineType: 'health', conditionType: 'absence', conditionValue: 'none', score: 95, interpretation: '无健康线,身体极为健康,少有疾病困扰。体质强健,抗病能力强,一生健康运极佳。', suggestion: '保持健康生活方式,继续享受健康人生。可多运动锻炼,增强体质。' },
  { lineName: '健康线', lineType: 'health', conditionType: 'clarity', conditionValue: 'faint', score: 88, interpretation: '健康线浅淡,身体健康状况良好,偶有小病小痛。注意保养身体,可避免疾病困扰。', suggestion: '注意定期体检,及时发现问题。保持健康生活方式,预防疾病。' },
  { lineName: '健康线', lineType: 'health', conditionType: 'straightness', conditionValue: 'straight', score: 85, interpretation: '健康线笔直,消化系统健康,肠胃功能良好。注意饮食规律,可保持健康状态。', suggestion: '保持良好饮食习惯,避免暴饮暴食。可多吃蔬菜水果,促进消化。' },
  
  // 直觉线扩展
  { lineName: '直觉线', lineType: 'intuition', conditionType: 'clarity', conditionValue: 'very_clear', score: 92, interpretation: '直觉线极为清晰,第六感强,直觉敏锐。容易预感未来,做出正确判断,适合从事需要直觉的工作。', suggestion: '发挥直觉优势,可在艺术、创意等领域发展。注意结合理性,避免过于主观。' },
  { lineName: '直觉线', lineType: 'intuition', conditionType: 'depth', conditionValue: 'very_deep', score: 90, interpretation: '直觉线极深,灵感丰富,创造力强。容易获得灵感启发,适合从事创意、艺术等工作。', suggestion: '发挥创造力优势,可在设计、写作等领域发展。注意记录灵感,及时实现。' },
  
  // 旅行线扩展
  { lineName: '旅行线', lineType: 'travel', conditionType: 'number', conditionValue: 'many', score: 88, interpretation: '旅行线众多,一生旅行机会多,见识广博。容易通过旅行获得成长,开拓视野。', suggestion: '把握旅行机会,多看多学。注意安全第一,做好准备。' },
  { lineName: '旅行线', lineType: 'travel', conditionType: 'clarity', conditionValue: 'very_clear', score: 85, interpretation: '旅行线极为清晰,重要旅行对人生影响深远。容易通过旅行改变命运,获得重大机遇。', suggestion: '珍惜旅行机会,积极探索。注意把握机遇,勇于尝试。' },
];

console.log(`准备插入 ${expandedPalmRules.length} 条手相规则...`);
for (const rule of expandedPalmRules) {
  await db.insert(schema.palmRules).values(rule);
}
console.log('✅ 手相规则扩展完成!\n');

// ============= 风水规则扩展 =============
console.log('🏠 扩展风水分析规则...');

const expandedFengshuiRules = [
  // 卧室风水扩展
  { roomType: 'bedroom', category: 'layout', ruleName: '床头朝向吉位', conditionType: 'bed_direction', conditionValue: 'auspicious', score: 95, interpretation: '床头朝向个人吉位,睡眠质量极佳,身体健康,精力充沛。有助于提升运势,促进事业发展。', suggestion: '保持当前布局,可在床头放置吉祥物增强能量。注意保持卧室整洁,促进能量流动。' },
  { roomType: 'bedroom', category: 'layout', ruleName: '床位稳固靠墙', conditionType: 'bed_support', conditionValue: 'solid_wall', score: 92, interpretation: '床头靠实墙,有靠山,事业稳定,贵人相助。睡眠安稳,心理安全感强,有助于健康和运势。', suggestion: '保持床头靠墙,避免移动。可在床头挂画,增强靠山力量。' },
  { roomType: 'bedroom', category: 'layout', ruleName: '避开横梁压顶', conditionType: 'beam_position', conditionValue: 'no_beam', score: 90, interpretation: '床上无横梁压顶,气场流畅,无压迫感。有助于睡眠质量,促进身体健康,事业发展顺遂。', suggestion: '保持当前布局,避免在床上方增加重物。可用吊顶遮挡横梁,化解煞气。' },
  { roomType: 'bedroom', category: 'layout', ruleName: '镜子不对床', conditionType: 'mirror_position', conditionValue: 'not_facing_bed', score: 88, interpretation: '镜子不对床,避免惊吓,睡眠安稳。有助于夫妻和谐,避免第三者介入,促进感情稳定。', suggestion: '保持镜子位置,或用布遮挡。可将镜子移至衣柜内,避免对床。' },
  { roomType: 'bedroom', category: 'layout', ruleName: '床下保持整洁', conditionType: 'under_bed', conditionValue: 'clean_empty', score: 85, interpretation: '床下整洁无杂物,气场流畅,有助于睡眠质量。避免积聚负能量,促进身体健康和运势。', suggestion: '定期清理床下,保持整洁。避免堆放杂物,保持空气流通。' },
  
  { roomType: 'bedroom', category: 'color', ruleName: '温馨暖色调', conditionType: 'wall_color', conditionValue: 'warm_tones', score: 90, interpretation: '卧室采用温馨暖色调,营造舒适氛围,有助于放松身心,提升睡眠质量。促进夫妻感情和谐。', suggestion: '保持当前色调,可增加暖色系软装。避免使用过于鲜艳的颜色,保持温馨氛围。' },
  { roomType: 'bedroom', category: 'color', ruleName: '避免纯黑纯白', conditionType: 'color_balance', conditionValue: 'balanced', score: 88, interpretation: '卧室色彩平衡,避免极端色彩,有助于情绪稳定。促进睡眠质量,避免情绪波动。', suggestion: '保持色彩平衡,可用中性色调为主。避免大面积使用黑白色,增加温馨感。' },
  { roomType: 'bedroom', category: 'color', ruleName: '柔和照明', conditionType: 'lighting', conditionValue: 'soft_warm', score: 85, interpretation: '卧室照明柔和温暖,营造舒适氛围,有助于放松身心。促进睡眠质量,避免刺眼光线。', suggestion: '使用暖色调灯光,避免冷白光。可增加调光功能,根据需要调节亮度。' },
  
  { roomType: 'bedroom', category: 'decoration', ruleName: '成双成对摆设', conditionType: 'decoration_pair', conditionValue: 'paired', score: 92, interpretation: '卧室摆设成双成对,象征夫妻和谐,感情稳定。有助于促进婚姻运势,增进夫妻感情。', suggestion: '保持成对摆设,如床头柜、台灯等。可增加成对装饰品,增强和谐能量。' },
  { roomType: 'bedroom', category: 'decoration', ruleName: '植物生机勃勃', conditionType: 'plants', conditionValue: 'healthy_green', score: 88, interpretation: '卧室摆放健康绿植,生机勃勃,有助于净化空气,提升能量。促进身体健康,增强运势。', suggestion: '选择适合卧室的植物,如绿萝、吊兰等。注意定期养护,保持植物健康。' },
  { roomType: 'bedroom', category: 'decoration', ruleName: '避免尖锐物品', conditionType: 'sharp_objects', conditionValue: 'none', score: 85, interpretation: '卧室无尖锐物品,避免煞气,气场和谐。有助于睡眠安稳,避免意外伤害,促进健康。', suggestion: '移除尖锐装饰品,选择圆润物品。可用布艺软装,增加温馨感。' },
  
  { roomType: 'bedroom', category: 'environment', ruleName: '空气流通良好', conditionType: 'ventilation', conditionValue: 'excellent', score: 95, interpretation: '卧室空气流通极佳,气场清新,有助于睡眠质量和身体健康。促进能量流动,增强运势。', suggestion: '保持通风习惯,定期开窗换气。可使用空气净化器,提升空气质量。' },
  { roomType: 'bedroom', category: 'environment', ruleName: '温度湿度适宜', conditionType: 'climate', conditionValue: 'comfortable', score: 90, interpretation: '卧室温湿度适宜,舒适宜人,有助于睡眠质量。促进身体健康,避免疾病困扰。', suggestion: '保持适宜温湿度,可使用空调和加湿器。注意定期清洁,保持卫生。' },
  { roomType: 'bedroom', category: 'environment', ruleName: '隔音效果良好', conditionType: 'soundproof', conditionValue: 'excellent', score: 88, interpretation: '卧室隔音效果极佳,安静舒适,有助于深度睡眠。促进身体恢复,增强精力。', suggestion: '保持隔音效果,可增加隔音窗帘。避免噪音干扰,营造安静环境。' },
  
  // 客厅风水扩展
  { roomType: 'living_room', category: 'layout', ruleName: '沙发背靠实墙', conditionType: 'sofa_support', conditionValue: 'solid_wall', score: 95, interpretation: '沙发背靠实墙,有靠山,家庭稳定,事业顺遂。有助于提升家运,促进家庭和谐。', suggestion: '保持沙发靠墙,避免移动。可在沙发后挂山水画,增强靠山力量。' },
  { roomType: 'living_room', category: 'layout', ruleName: '明堂开阔明亮', conditionType: 'open_space', conditionValue: 'spacious_bright', score: 92, interpretation: '客厅明堂开阔明亮,气场流畅,财运亨通。有助于提升家运,促进事业发展。', suggestion: '保持客厅整洁,避免堆放杂物。可增加照明,提升明亮度。' },
  { roomType: 'living_room', category: 'layout', ruleName: '财位布局得当', conditionType: 'wealth_position', conditionValue: 'optimized', score: 90, interpretation: '客厅财位布局得当,财运旺盛,财富积累顺利。有助于提升财运,促进家庭富足。', suggestion: '在财位摆放招财物品,如貔貅、金蟾等。保持财位整洁,避免压重物。' },
  { roomType: 'living_room', category: 'layout', ruleName: '动线流畅', conditionType: 'circulation', conditionValue: 'smooth', score: 88, interpretation: '客厅动线流畅,气场流通,家庭和谐。有助于提升家运,促进人际关系。', suggestion: '保持动线畅通,避免家具阻挡。可调整家具位置,优化布局。' },
  
  { roomType: 'living_room', category: 'color', ruleName: '明亮温馨色调', conditionType: 'color_scheme', conditionValue: 'warm_bright', score: 90, interpretation: '客厅采用明亮温馨色调,营造欢乐氛围,有助于家庭和谐。促进人际关系,增强家运。', suggestion: '保持当前色调,可增加暖色系装饰。避免使用阴暗色彩,保持明亮氛围。' },
  { roomType: 'living_room', category: 'color', ruleName: '五行色彩平衡', conditionType: 'five_elements', conditionValue: 'balanced', score: 88, interpretation: '客厅五行色彩平衡,气场和谐,有助于家庭稳定。促进各方面运势,增强家运。', suggestion: '根据家庭成员五行,调整色彩搭配。可咨询专业风水师,优化布局。' },
  
  { roomType: 'living_room', category: 'decoration', ruleName: '吉祥物摆放得当', conditionType: 'auspicious_items', conditionValue: 'proper', score: 92, interpretation: '客厅吉祥物摆放得当,增强正能量,有助于提升家运。促进财运、事业运,增强家庭和谐。', suggestion: '选择适合的吉祥物,如貔貅、金蟾、招财猫等。注意定期清洁,保持能量。' },
  { roomType: 'living_room', category: 'decoration', ruleName: '字画寓意吉祥', conditionType: 'artwork', conditionValue: 'auspicious', score: 88, interpretation: '客厅字画寓意吉祥,营造积极氛围,有助于提升家运。促进文化氛围,增强家庭品味。', suggestion: '选择寓意吉祥的字画,如山水画、牡丹图等。避免凶猛动物画,保持和谐氛围。' },
  { roomType: 'living_room', category: 'decoration', ruleName: '绿植生机勃勃', conditionType: 'plants', conditionValue: 'thriving', score: 85, interpretation: '客厅绿植生机勃勃,生气旺盛,有助于净化空气,提升能量。促进家庭健康,增强运势。', suggestion: '选择大叶绿植,如发财树、富贵竹等。注意定期养护,保持植物健康。' },
  
  { roomType: 'living_room', category: 'environment', ruleName: '采光充足', conditionType: 'natural_light', conditionValue: 'abundant', score: 95, interpretation: '客厅采光充足,阳气旺盛,有助于提升家运。促进家庭健康,增强正能量。', suggestion: '保持窗户清洁,最大化采光。可使用浅色窗帘,增加透光性。' },
  { roomType: 'living_room', category: 'environment', ruleName: '整洁有序', conditionType: 'cleanliness', conditionValue: 'excellent', score: 90, interpretation: '客厅整洁有序,气场清爽,有助于提升家运。促进家庭和谐,增强运势。', suggestion: '保持定期清洁习惯,避免堆放杂物。可增加收纳空间,保持整洁。' },
  
  // 书房风水扩展
  { roomType: 'study', category: 'layout', ruleName: '书桌朝向文昌位', conditionType: 'desk_direction', conditionValue: 'wenchang', score: 95, interpretation: '书桌朝向文昌位,学业运极佳,思维敏捷,学习效率高。有助于考试顺利,事业发展。', suggestion: '保持当前朝向,可在文昌位摆放文昌塔。注意保持书桌整洁,促进学习。' },
  { roomType: 'study', category: 'layout', ruleName: '座位背靠实墙', conditionType: 'seat_support', conditionValue: 'solid_wall', score: 92, interpretation: '座位背靠实墙,有靠山,学习稳定,贵人相助。有助于提升学业运,促进事业发展。', suggestion: '保持座位靠墙,避免移动。可在背后挂山水画,增强靠山力量。' },
  { roomType: 'study', category: 'layout', ruleName: '避免横梁压顶', conditionType: 'beam_position', conditionValue: 'no_beam', score: 90, interpretation: '书桌上无横梁压顶,思维清晰,无压迫感。有助于学习效率,促进事业发展。', suggestion: '保持当前布局,避免在书桌上方增加重物。可用吊顶遮挡横梁,化解煞气。' },
  { roomType: 'study', category: 'layout', ruleName: '窗外视野开阔', conditionType: 'window_view', conditionValue: 'open', score: 88, interpretation: '窗外视野开阔,思维开阔,灵感丰富。有助于学习创新,促进事业发展。', suggestion: '保持窗外视野,可适当休息眺望。避免窗外杂乱,保持整洁。' },
  
  { roomType: 'study', category: 'color', ruleName: '淡雅清新色调', conditionType: 'color_scheme', conditionValue: 'light_fresh', score: 90, interpretation: '书房采用淡雅清新色调,营造学习氛围,有助于集中注意力。促进学习效率,增强学业运。', suggestion: '保持当前色调,可增加绿色或蓝色元素。避免使用过于鲜艳的颜色,保持宁静氛围。' },
  { roomType: 'study', category: 'color', ruleName: '照明充足柔和', conditionType: 'lighting', conditionValue: 'adequate_soft', score: 88, interpretation: '书房照明充足柔和,有助于保护视力,提升学习效率。促进学业运,避免眼睛疲劳。', suggestion: '使用护眼台灯,避免直射光线。可增加间接照明,营造舒适氛围。' },
  
  { roomType: 'study', category: 'decoration', ruleName: '书籍摆放有序', conditionType: 'books_organization', conditionValue: 'orderly', score: 92, interpretation: '书籍摆放有序,思维清晰,学习效率高。有助于知识积累,促进学业运。', suggestion: '保持书籍整理习惯,分类摆放。可增加书架,优化收纳。' },
  { roomType: 'study', category: 'decoration', ruleName: '文昌塔摆放得当', conditionType: 'wenchang_tower', conditionValue: 'proper', score: 90, interpretation: '文昌塔摆放得当,学业运极佳,考试顺利。有助于提升智慧,促进事业发展。', suggestion: '将文昌塔摆放在文昌位或书桌左侧。注意定期清洁,保持能量。' },
  { roomType: 'study', category: 'decoration', ruleName: '励志字画', conditionType: 'motivational_art', conditionValue: 'inspiring', score: 85, interpretation: '书房挂励志字画,营造积极氛围,有助于激发学习动力。促进学业运,增强自信心。', suggestion: '选择励志名言或书法作品。避免消极内容,保持积极氛围。' },
  
  { roomType: 'study', category: 'environment', ruleName: '安静无干扰', conditionType: 'quietness', conditionValue: 'excellent', score: 95, interpretation: '书房安静无干扰,专注力强,学习效率极高。有助于深度思考,促进学业运。', suggestion: '保持安静环境,可增加隔音措施。避免噪音干扰,营造学习氛围。' },
  { roomType: 'study', category: 'environment', ruleName: '空气清新', conditionType: 'air_quality', conditionValue: 'excellent', score: 90, interpretation: '书房空气清新,思维清晰,学习效率高。有助于身体健康,促进学业运。', suggestion: '保持通风习惯,定期开窗换气。可摆放绿植,净化空气。' },
  
  // 厨房风水扩展
  { roomType: 'kitchen', category: 'layout', ruleName: '炉灶位置吉利', conditionType: 'stove_position', conditionValue: 'auspicious', score: 95, interpretation: '炉灶位置吉利,财运旺盛,家庭和谐。有助于提升家运,促进财富积累。', suggestion: '保持当前位置,避免移动。可在炉灶旁摆放吉祥物,增强能量。' },
  { roomType: 'kitchen', category: 'layout', ruleName: '水火分离', conditionType: 'water_fire_separation', conditionValue: 'separated', score: 92, interpretation: '水槽与炉灶分离,水火不冲,家庭和谐。有助于避免家庭矛盾,促进财运。', suggestion: '保持水火分离布局,避免相邻。可在中间放置木质砧板,化解冲突。' },
  { roomType: 'kitchen', category: 'layout', ruleName: '厨房门不对厕所', conditionType: 'door_position', conditionValue: 'not_facing_toilet', score: 90, interpretation: '厨房门不对厕所,避免污秽之气,家庭健康。有助于保持卫生,促进家运。', suggestion: '保持当前布局,或增加屏风遮挡。注意保持厨房清洁,避免异味。' },
  
  { roomType: 'kitchen', category: 'color', ruleName: '明亮清爽色调', conditionType: 'color_scheme', conditionValue: 'bright_clean', score: 88, interpretation: '厨房采用明亮清爽色调,营造卫生氛围,有助于食欲和健康。促进家庭和谐,增强家运。', suggestion: '保持当前色调,可使用白色或浅色系。避免使用阴暗色彩,保持明亮氛围。' },
  { roomType: 'kitchen', category: 'color', ruleName: '照明充足', conditionType: 'lighting', conditionValue: 'abundant', score: 85, interpretation: '厨房照明充足,操作安全,有助于烹饪效率。促进家庭健康,避免意外伤害。', suggestion: '增加照明设施,特别是操作台上方。可使用LED灯,节能环保。' },
  
  { roomType: 'kitchen', category: 'decoration', ruleName: '保持整洁有序', conditionType: 'organization', conditionValue: 'excellent', score: 92, interpretation: '厨房整洁有序,气场清爽,有助于家庭健康。促进财运,增强家运。', suggestion: '保持定期清洁习惯,避免油污积累。可增加收纳空间,保持整洁。' },
  { roomType: 'kitchen', category: 'decoration', ruleName: '刀具收纳妥当', conditionType: 'knife_storage', conditionValue: 'proper', score: 88, interpretation: '刀具收纳妥当,避免煞气,家庭安全。有助于避免意外伤害,促进家庭和谐。', suggestion: '将刀具收纳在刀架或抽屉中,避免外露。注意定期清洁,保持卫生。' },
  
  { roomType: 'kitchen', category: 'environment', ruleName: '通风良好', conditionType: 'ventilation', conditionValue: 'excellent', score: 95, interpretation: '厨房通风极佳,油烟排出顺畅,有助于家庭健康。促进空气清新,增强家运。', suggestion: '保持抽油烟机正常运转,定期清洁。可增加窗户,促进自然通风。' },
  { roomType: 'kitchen', category: 'environment', ruleName: '卫生条件优良', conditionType: 'hygiene', conditionValue: 'excellent', score: 90, interpretation: '厨房卫生条件优良,食品安全,有助于家庭健康。促进家运,避免疾病困扰。', suggestion: '保持定期清洁消毒习惯。注意食材新鲜,避免变质。' },
];

console.log(`准备插入 ${expandedFengshuiRules.length} 条风水规则...`);
for (const rule of expandedFengshuiRules) {
  await db.insert(schema.fengshuiRules).values(rule);
}
console.log('✅ 风水规则扩展完成!\n');

// 统计最终结果
const finalCounts = await db.execute(sql`
  SELECT 
    (SELECT COUNT(*) FROM face_rules) as face_count,
    (SELECT COUNT(*) FROM palm_rules) as palm_count,
    (SELECT COUNT(*) FROM fengshui_rules) as fengshui_count
`);

console.log('📊 数据库扩展完成统计:');
console.log(`面相规则总数: ${finalCounts.rows[0].face_count}`);
console.log(`手相规则总数: ${finalCounts.rows[0].palm_count}`);
console.log(`风水规则总数: ${finalCounts.rows[0].fengshui_count}`);
console.log('\n🎉 所有服务数据库扩展完成!');

await connection.end();
