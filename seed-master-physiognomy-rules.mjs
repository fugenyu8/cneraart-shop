import { drizzle } from "drizzle-orm/mysql2";
import { faceRules, palmRules } from "./drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

// 清空现有规则
await db.delete(faceRules);
await db.delete(palmRules);

console.log("开始录入五台山大师级面相手相规则...");

// ==================== 面相规则 (150条) ====================

const faceRulesData = [
  // 一、流年运势规则 (30条)
  
  // 幼年运(1-14岁) - 耳部
  {
    category: "流年运势",
    feature: "天轮(1-2岁)",
    condition: "耳轮完整饱满",
    score: 10,
    interpretation: "幼年得父母庇佑,家境殷实,无病无灾",
    westernExplanation: "Good family support in early childhood, healthy development"
  },
  {
    category: "流年运势",
    feature: "天轮(1-2岁)",
    condition: "耳轮残缺或有痣",
    score: -10,
    interpretation: "幼年多病,父母缘薄,家境贫寒",
    westernExplanation: "Health challenges in early childhood, limited family resources"
  },
  {
    category: "流年运势",
    feature: "地轮(12-14岁)",
    condition: "耳垂厚大红润",
    score: 10,
    interpretation: "少年运佳,学业顺利,得师长喜爱",
    westernExplanation: "Good fortune in teenage years, academic success"
  },
  
  // 少年运(15-30岁) - 额部
  {
    category: "流年运势",
    feature: "火星(15岁)",
    condition: "额头正中饱满明亮",
    score: 10,
    interpretation: "15岁运势开启,学业有成,初露锋芒",
    westernExplanation: "Strong start in adolescence, showing early talents"
  },
  {
    category: "流年运势",
    feature: "天庭(19岁)",
    condition: "额头宽阔光润",
    score: 15,
    interpretation: "19岁大运,考学顺利,得贵人提携",
    westernExplanation: "Major opportunity at age 19, mentorship and success"
  },
  {
    category: "流年运势",
    feature: "司空(22岁)",
    condition: "额头中部平整",
    score: 10,
    interpretation: "22岁事业起步,工作顺遂",
    westernExplanation: "Career begins smoothly at age 22"
  },
  {
    category: "流年运势",
    feature: "中正(25岁)",
    condition: "额头中央饱满",
    score: 15,
    interpretation: "25岁事业小成,财运渐旺",
    westernExplanation: "Career milestone at age 25, financial improvement"
  },
  {
    category: "流年运势",
    feature: "印堂(28岁)",
    condition: "印堂明亮无纹",
    score: 20,
    interpretation: "28岁人生关键转折,事业爱情双丰收",
    westernExplanation: "Critical turning point at age 28, success in career and love"
  },
  {
    category: "流年运势",
    feature: "印堂(28岁)",
    condition: "印堂晦暗或有纹",
    score: -20,
    interpretation: "28岁运势受阻,事业爱情皆不顺",
    westernExplanation: "Challenges at age 28, obstacles in career and relationships"
  },
  
  // 壮年运(31-50岁) - 眉眼鼻部
  {
    category: "流年运势",
    feature: "太阳太阴(35-36岁)",
    condition: "眼部明亮有神",
    score: 15,
    interpretation: "35-36岁事业高峰期,名利双收",
    westernExplanation: "Career peak at ages 35-36, recognition and wealth"
  },
  {
    category: "流年运势",
    feature: "山根(41岁)",
    condition: "山根高挺无纹",
    score: 20,
    interpretation: "41岁人生第二次重要转折,事业再上层楼",
    westernExplanation: "Second major turning point at age 41, career advancement"
  },
  {
    category: "流年运势",
    feature: "山根(41岁)",
    condition: "山根低陷或有横纹",
    score: -20,
    interpretation: "41岁运势低谷,健康事业皆受挫",
    westernExplanation: "Difficult period at age 41, health and career setbacks"
  },
  {
    category: "流年运势",
    feature: "颧骨(46-47岁)",
    condition: "颧骨饱满有肉",
    score: 15,
    interpretation: "46-47岁权力运旺,得下属拥护",
    westernExplanation: "Leadership success at ages 46-47, team support"
  },
  {
    category: "流年运势",
    feature: "准头(48岁)",
    condition: "鼻头圆润有肉",
    score: 20,
    interpretation: "48岁财运大旺,投资有成",
    westernExplanation: "Financial peak at age 48, successful investments"
  },
  
  // 中老年运(51-70岁) - 人中口唇下巴
  {
    category: "流年运势",
    feature: "人中(51岁)",
    condition: "人中深长清晰",
    score: 15,
    interpretation: "51岁子女运佳,家庭和睦",
    westernExplanation: "Family harmony at age 51, good relationship with children"
  },
  {
    category: "流年运势",
    feature: "法令(56-57岁)",
    condition: "法令清晰不过口",
    score: 10,
    interpretation: "56-57岁晚年运势稳定,地位巩固",
    westernExplanation: "Stable later years at ages 56-57, established position"
  },
  {
    category: "流年运势",
    feature: "水星(60岁)",
    condition: "口型方正红润",
    score: 15,
    interpretation: "60岁口福佳,子孙孝顺",
    westernExplanation: "Good fortune at age 60, filial children"
  },
  {
    category: "流年运势",
    feature: "地库(62-63岁)",
    condition: "下巴饱满有肉",
    score: 15,
    interpretation: "62-63岁田宅运旺,晚年富足",
    westernExplanation: "Property wealth at ages 62-63, comfortable retirement"
  },
  {
    category: "流年运势",
    feature: "地阁(71岁)",
    condition: "下巴圆润厚实",
    score: 20,
    interpretation: "71岁晚年福泽深厚,子孙满堂",
    westernExplanation: "Blessed later years at age 71, surrounded by family"
  },
  
  // 二、五行命格规则 (30条)
  
  // 金形人
  {
    category: "五行命格",
    feature: "金形人",
    condition: "方脸、肤白、骨骼分明、鼻梁挺直",
    score: 15,
    interpretation: "金形命格,刚毅果断,重义气,适合金融、法律、军警、管理行业。吉方西方,吉色白金",
    westernExplanation: "Metal element personality: decisive, principled, suited for finance, law, military, management. Lucky direction: West. Lucky colors: white, gold"
  },
  {
    category: "五行命格",
    feature: "金形人-强",
    condition: "金形特征明显且颧骨突出",
    score: 10,
    interpretation: "金气过旺,性格刚硬,易得罪人,需以水泄金,多穿黑蓝色",
    westernExplanation: "Excessive metal energy: too rigid, may offend others. Balance with water element (black, blue colors)"
  },
  {
    category: "五行命格",
    feature: "金形人-弱",
    condition: "金形特征但骨骼不明显",
    score: 5,
    interpretation: "金气不足,缺乏魄力,需以土生金,多穿黄褐色",
    westernExplanation: "Insufficient metal energy: lack of decisiveness. Strengthen with earth element (yellow, brown colors)"
  },
  
  // 木形人
  {
    category: "五行命格",
    feature: "木形人",
    condition: "长脸、肤青、眉清目秀、身材修长",
    score: 15,
    interpretation: "木形命格,仁慈温和,有理想,适合教育、文化、艺术、医疗行业。吉方东方,吉色绿青",
    westernExplanation: "Wood element personality: kind, idealistic, suited for education, culture, arts, healthcare. Lucky direction: East. Lucky colors: green, cyan"
  },
  {
    category: "五行命格",
    feature: "木形人-强",
    condition: "木形特征明显且身材过瘦",
    score: 10,
    interpretation: "木气过旺,理想主义,不切实际,需以金修木,多穿白金色",
    westernExplanation: "Excessive wood energy: too idealistic, impractical. Balance with metal element (white, gold colors)"
  },
  {
    category: "五行命格",
    feature: "木形人-弱",
    condition: "木形特征但身材矮小",
    score: 5,
    interpretation: "木气不足,缺乏创意,需以水生木,多穿黑蓝色",
    westernExplanation: "Insufficient wood energy: lack of creativity. Strengthen with water element (black, blue colors)"
  },
  
  // 水形人
  {
    category: "五行命格",
    feature: "水形人",
    condition: "圆脸、肤黑、耳大、眼神灵动",
    score: 15,
    interpretation: "水形命格,聪明机智,善变通,适合贸易、外交、咨询、策划行业。吉方北方,吉色黑蓝",
    westernExplanation: "Water element personality: intelligent, adaptable, suited for trade, diplomacy, consulting, planning. Lucky direction: North. Lucky colors: black, blue"
  },
  {
    category: "五行命格",
    feature: "水形人-强",
    condition: "水形特征明显且体型肥胖",
    score: 10,
    interpretation: "水气过旺,过于圆滑,缺乏原则,需以土克水,多穿黄褐色",
    westernExplanation: "Excessive water energy: too flexible, lack of principles. Balance with earth element (yellow, brown colors)"
  },
  {
    category: "五行命格",
    feature: "水形人-弱",
    condition: "水形特征但皮肤干燥",
    score: 5,
    interpretation: "水气不足,缺乏灵活性,需以金生水,多穿白金色",
    westernExplanation: "Insufficient water energy: lack of flexibility. Strengthen with metal element (white, gold colors)"
  },
  
  // 火形人
  {
    category: "五行命格",
    feature: "火形人",
    condition: "尖脸、肤红、眼神锐利、额头宽",
    score: 15,
    interpretation: "火形命格,热情积极,有冲劲,适合销售、公关、演艺、创业行业。吉方南方,吉色红紫",
    westernExplanation: "Fire element personality: passionate, energetic, suited for sales, PR, entertainment, entrepreneurship. Lucky direction: South. Lucky colors: red, purple"
  },
  {
    category: "五行命格",
    feature: "火形人-强",
    condition: "火形特征明显且面色过红",
    score: 10,
    interpretation: "火气过旺,性格急躁,易冲动,需以水克火,多穿黑蓝色",
    westernExplanation: "Excessive fire energy: too impulsive, easily agitated. Balance with water element (black, blue colors)"
  },
  {
    category: "五行命格",
    feature: "火形人-弱",
    condition: "火形特征但面色苍白",
    score: 5,
    interpretation: "火气不足,缺乏热情,需以木生火,多穿绿青色",
    westernExplanation: "Insufficient fire energy: lack of passion. Strengthen with wood element (green, cyan colors)"
  },
  
  // 土形人
  {
    category: "五行命格",
    feature: "土形人",
    condition: "方圆脸、肤黄、鼻大口方、体格厚实",
    score: 15,
    interpretation: "土形命格,稳重踏实,诚信可靠,适合房地产、农业、建筑、行政行业。吉方中央,吉色黄褐",
    westernExplanation: "Earth element personality: stable, reliable, suited for real estate, agriculture, construction, administration. Lucky direction: Center. Lucky colors: yellow, brown"
  },
  {
    category: "五行命格",
    feature: "土形人-强",
    condition: "土形特征明显且体型过胖",
    score: 10,
    interpretation: "土气过旺,过于保守,缺乏变通,需以木克土,多穿绿青色",
    westernExplanation: "Excessive earth energy: too conservative, inflexible. Balance with wood element (green, cyan colors)"
  },
  {
    category: "五行命格",
    feature: "土形人-弱",
    condition: "土形特征但体型瘦弱",
    score: 5,
    interpretation: "土气不足,缺乏稳定性,需以火生土,多穿红紫色",
    westernExplanation: "Insufficient earth energy: lack of stability. Strengthen with fire element (red, purple colors)"
  },
  
  // 三、十二宫深度规则 (40条)
  
  // 命宫(印堂)
  {
    category: "命宫",
    feature: "印堂宽阔明亮",
    condition: "两眉间距宽,皮肤光润",
    score: 20,
    interpretation: "命宫开阔,一生运势顺遂,贵人相助,事业有成",
    westernExplanation: "Open life palace: smooth life path, helpful mentors, career success"
  },
  {
    category: "命宫",
    feature: "印堂狭窄晦暗",
    condition: "两眉紧锁,皮肤暗沉",
    score: -20,
    interpretation: "命宫狭窄,一生多波折,小人缠身,需多行善积德",
    westernExplanation: "Narrow life palace: many obstacles, need to cultivate virtue"
  },
  {
    category: "命宫",
    feature: "印堂有痣",
    condition: "印堂正中有痣或疤",
    score: -15,
    interpretation: "命宫有痣,28岁前后有大劫,需谨慎行事",
    westernExplanation: "Mark on life palace: major challenge around age 28, proceed with caution"
  },
  {
    category: "命宫",
    feature: "印堂有悬针纹",
    condition: "印堂有一条竖纹",
    score: -10,
    interpretation: "悬针破印,性格执拗,易钻牛角尖,婚姻不顺",
    westernExplanation: "Vertical line on life palace: stubborn personality, relationship challenges"
  },
  
  // 财帛宫(鼻子)
  {
    category: "财帛宫",
    feature: "鼻梁高挺鼻头圆润",
    condition: "鼻梁挺直,鼻头有肉",
    score: 20,
    interpretation: "财帛宫佳,一生财运亨通,正财偏财皆旺",
    westernExplanation: "Excellent wealth palace: prosperous finances, both earned and windfall income"
  },
  {
    category: "财帛宫",
    feature: "鼻梁低陷鼻头尖",
    condition: "鼻梁塌陷,鼻头无肉",
    score: -20,
    interpretation: "财帛宫弱,一生财运不济,需勤俭持家",
    westernExplanation: "Weak wealth palace: limited finances, need frugal management"
  },
  {
    category: "财帛宫",
    feature: "鼻头有痣",
    condition: "鼻头或鼻翼有痣",
    score: -10,
    interpretation: "财帛宫有痣,48岁前后破财,需谨慎投资",
    westernExplanation: "Mark on wealth palace: financial loss around age 48, invest cautiously"
  },
  {
    category: "财帛宫",
    feature: "鼻孔外露",
    condition: "正面可见鼻孔",
    score: -15,
    interpretation: "鼻孔外露,财来财去,难以聚财",
    westernExplanation: "Exposed nostrils: money comes and goes, difficulty accumulating wealth"
  },
  {
    category: "财帛宫",
    feature: "鼻翼饱满",
    condition: "鼻翼有肉且对称",
    score: 15,
    interpretation: "鼻翼饱满,财库丰盈,善于理财",
    westernExplanation: "Full nose wings: abundant wealth storage, good at financial management"
  },
  
  // 兄弟宫(眉毛)
  {
    category: "兄弟宫",
    feature: "眉毛浓密整齐",
    condition: "眉毛浓密且形状整齐",
    score: 15,
    interpretation: "兄弟宫佳,手足情深,朋友多助",
    westernExplanation: "Good sibling palace: close family ties, supportive friends"
  },
  {
    category: "兄弟宫",
    feature: "眉毛稀疏杂乱",
    condition: "眉毛稀少或杂乱",
    score: -15,
    interpretation: "兄弟宫弱,手足缘薄,朋友少助",
    westernExplanation: "Weak sibling palace: distant family relationships, limited friend support"
  },
  {
    category: "兄弟宫",
    feature: "眉毛有疤或断",
    condition: "眉毛中有疤痕或中断",
    score: -10,
    interpretation: "兄弟宫破,手足不和,易生口角",
    westernExplanation: "Damaged sibling palace: family conflicts, frequent disputes"
  },
  {
    category: "兄弟宫",
    feature: "眉尾上扬",
    condition: "眉毛尾部向上",
    score: 10,
    interpretation: "眉尾上扬,性格刚毅,有领导才能",
    westernExplanation: "Upward eyebrow tails: strong character, leadership ability"
  },
  
  // 夫妻宫(眼尾)
  {
    category: "夫妻宫",
    feature: "眼尾光润无纹",
    condition: "眼尾皮肤光滑无皱纹",
    score: 20,
    interpretation: "夫妻宫佳,婚姻美满,夫妻恩爱",
    westernExplanation: "Excellent marriage palace: happy marriage, loving spouse"
  },
  {
    category: "夫妻宫",
    feature: "鱼尾纹多",
    condition: "眼尾鱼尾纹密集",
    score: -15,
    interpretation: "夫妻宫多纹,婚姻波折,易有婚变",
    westernExplanation: "Many lines in marriage palace: relationship challenges, possible separation"
  },
  {
    category: "夫妻宫",
    feature: "眼尾有痣",
    condition: "眼尾有痣或疤",
    score: -10,
    interpretation: "夫妻宫有痣,感情多波折,易遇烂桃花",
    westernExplanation: "Mark in marriage palace: emotional ups and downs, problematic relationships"
  },
  {
    category: "夫妻宫",
    feature: "眼尾下垂",
    condition: "眼尾向下",
    score: -5,
    interpretation: "眼尾下垂,感情被动,易受伤害",
    westernExplanation: "Downward eye tails: passive in relationships, easily hurt"
  },
  
  // 子女宫(眼下)
  {
    category: "子女宫",
    feature: "卧蚕饱满",
    condition: "眼下卧蚕明显饱满",
    score: 20,
    interpretation: "子女宫佳,子女运旺,儿孙孝顺",
    westernExplanation: "Excellent children palace: blessed with children, filial offspring"
  },
  {
    category: "子女宫",
    feature: "眼袋深重",
    condition: "眼下眼袋明显",
    score: -15,
    interpretation: "子女宫弱,子女缘薄,或子女多病",
    westernExplanation: "Weak children palace: limited children fortune, health concerns"
  },
  {
    category: "子女宫",
    feature: "眼下有痣",
    condition: "眼下有痣或疤",
    score: -10,
    interpretation: "子女宫有痣,子女健康堪忧,需多关注",
    westernExplanation: "Mark in children palace: children's health needs attention"
  },
  {
    category: "子女宫",
    feature: "眼下红润",
    condition: "眼下肤色红润",
    score: 15,
    interpretation: "子女宫红润,子女健康聪明,前途光明",
    westernExplanation: "Rosy children palace: healthy, intelligent children with bright future"
  },
  
  // 疾厄宫(山根)
  {
    category: "疾厄宫",
    feature: "山根高挺",
    condition: "山根高且无纹",
    score: 15,
    interpretation: "疾厄宫佳,一生少病,体质强健",
    westernExplanation: "Good health palace: robust health, few illnesses"
  },
  {
    category: "疾厄宫",
    feature: "山根低陷",
    condition: "山根低且有横纹",
    score: -15,
    interpretation: "疾厄宫弱,体质较弱,易患疾病",
    westernExplanation: "Weak health palace: delicate constitution, prone to illness"
  },
  {
    category: "疾厄宫",
    feature: "山根有痣",
    condition: "山根有痣或疤",
    score: -10,
    interpretation: "疾厄宫有痣,41岁前后有健康危机",
    westernExplanation: "Mark in health palace: health crisis around age 41"
  },
  {
    category: "疾厄宫",
    feature: "山根有青筋",
    condition: "山根可见青筋",
    score: -5,
    interpretation: "山根有青筋,肠胃功能不佳,需注意饮食",
    westernExplanation: "Visible veins in health palace: digestive issues, watch diet"
  },
  
  // 迁移宫(额角)
  {
    category: "迁移宫",
    feature: "额角饱满",
    condition: "额头两侧饱满光润",
    score: 15,
    interpretation: "迁移宫佳,出外得财,贵人相助",
    westernExplanation: "Good travel palace: success away from home, helpful people"
  },
  {
    category: "迁移宫",
    feature: "额角凹陷",
    condition: "额头两侧凹陷",
    score: -15,
    interpretation: "迁移宫弱,出外不利,宜守家业",
    westernExplanation: "Weak travel palace: challenges away from home, better to stay local"
  },
  {
    category: "迁移宫",
    feature: "额角有痣",
    condition: "额角有痣或疤",
    score: -10,
    interpretation: "迁移宫有痣,出外易遇小人,需谨慎",
    westernExplanation: "Mark in travel palace: beware of troublemakers when traveling"
  },
  
  // 奴仆宫(下巴两侧)
  {
    category: "奴仆宫",
    feature: "腮骨饱满",
    condition: "下巴两侧腮骨有肉",
    score: 15,
    interpretation: "奴仆宫佳,得下属拥护,团队和谐",
    westernExplanation: "Good subordinate palace: team support, harmonious workplace"
  },
  {
    category: "奴仆宫",
    feature: "腮骨削瘦",
    condition: "下巴两侧腮骨无肉",
    score: -15,
    interpretation: "奴仆宫弱,下属不服,管理困难",
    westernExplanation: "Weak subordinate palace: management challenges, team conflicts"
  },
  {
    category: "奴仆宫",
    feature: "腮骨外翻",
    condition: "腮骨明显外翻",
    score: -10,
    interpretation: "腮骨外翻,易遭背叛,需防小人",
    westernExplanation: "Protruding jaw bones: risk of betrayal, beware of disloyal people"
  },
  
  // 官禄宫(额头中央)
  {
    category: "官禄宫",
    feature: "额头中央饱满",
    condition: "额头中央高且宽",
    score: 20,
    interpretation: "官禄宫佳,事业有成,官运亨通",
    westernExplanation: "Excellent career palace: career success, professional advancement"
  },
  {
    category: "官禄宫",
    feature: "额头中央凹陷",
    condition: "额头中央低陷",
    score: -20,
    interpretation: "官禄宫弱,事业多阻,难有大成",
    westernExplanation: "Weak career palace: career obstacles, limited advancement"
  },
  {
    category: "官禄宫",
    feature: "额头有抬头纹",
    condition: "额头有多条横纹",
    score: -10,
    interpretation: "官禄宫多纹,事业压力大,需劳心劳力",
    westernExplanation: "Lines in career palace: work pressure, mental and physical strain"
  },
  
  // 田宅宫(眉眼之间)
  {
    category: "田宅宫",
    feature: "眉眼间距宽",
    condition: "眉毛与眼睛距离宽",
    score: 15,
    interpretation: "田宅宫佳,祖业丰厚,房产运旺",
    westernExplanation: "Good property palace: inherited wealth, real estate fortune"
  },
  {
    category: "田宅宫",
    feature: "眉眼间距窄",
    condition: "眉毛与眼睛距离窄",
    score: -15,
    interpretation: "田宅宫弱,祖业薄弱,需自力更生",
    westernExplanation: "Weak property palace: limited inheritance, self-made success needed"
  },
  {
    category: "田宅宫",
    feature: "眉眼间有痣",
    condition: "眉眼之间有痣或疤",
    score: -10,
    interpretation: "田宅宫有痣,房产易有纠纷,需谨慎",
    westernExplanation: "Mark in property palace: real estate disputes, proceed carefully"
  },
  
  // 福德宫(眉尾上方)
  {
    category: "福德宫",
    feature: "眉尾上方饱满",
    condition: "眉尾上方肉厚",
    score: 15,
    interpretation: "福德宫佳,福泽深厚,晚年安康",
    westernExplanation: "Good fortune palace: blessed life, peaceful old age"
  },
  {
    category: "福德宫",
    feature: "眉尾上方凹陷",
    condition: "眉尾上方凹陷",
    score: -15,
    interpretation: "福德宫弱,福薄缘浅,需多积德",
    westernExplanation: "Weak fortune palace: limited blessings, cultivate virtue"
  },
  
  // 父母宫(日月角)
  {
    category: "父母宫",
    feature: "日月角饱满",
    condition: "额头两侧上方饱满",
    score: 15,
    interpretation: "父母宫佳,父母健康长寿,家庭和睦",
    westernExplanation: "Good parents palace: healthy parents, harmonious family"
  },
  {
    category: "父母宫",
    feature: "日月角凹陷",
    condition: "额头两侧上方凹陷",
    score: -15,
    interpretation: "父母宫弱,父母缘薄,或父母健康不佳",
    westernExplanation: "Weak parents palace: distant parental relationship or health concerns"
  },
  
  // 四、五官详细规则 (30条)
  
  // 眼睛
  {
    category: "眼睛",
    feature: "眼大有神",
    condition: "眼睛大且眼神明亮",
    score: 15,
    interpretation: "眼大有神,聪明伶俐,感情丰富",
    westernExplanation: "Large bright eyes: intelligent, emotionally rich"
  },
  {
    category: "眼睛",
    feature: "眼小无神",
    condition: "眼睛小且眼神暗淡",
    score: -10,
    interpretation: "眼小无神,性格内向,缺乏自信",
    westernExplanation: "Small dull eyes: introverted, lacking confidence"
  },
  {
    category: "眼睛",
    feature: "眼睛黑白分明",
    condition: "眼白清澈,黑眼珠明显",
    score: 15,
    interpretation: "黑白分明,为人正直,心地善良",
    westernExplanation: "Clear eyes: honest character, kind-hearted"
  },
  {
    category: "眼睛",
    feature: "三白眼或四白眼",
    condition: "眼白过多,黑眼珠小",
    score: -15,
    interpretation: "三白眼,性格极端,易有意外",
    westernExplanation: "Excessive white in eyes: extreme personality, prone to accidents"
  },
  {
    category: "眼睛",
    feature: "桃花眼",
    condition: "眼睛水汪汪,眼尾上翘",
    score: 10,
    interpretation: "桃花眼,异性缘佳,但感情多波折",
    westernExplanation: "Peach blossom eyes: attractive to opposite sex, but relationship challenges"
  },
  {
    category: "眼睛",
    feature: "丹凤眼",
    condition: "眼睛细长,眼尾上扬",
    score: 15,
    interpretation: "丹凤眼,性格刚毅,有领导才能",
    westernExplanation: "Phoenix eyes: strong character, leadership ability"
  },
  
  // 鼻子
  {
    category: "鼻子",
    feature: "鹰钩鼻",
    condition: "鼻梁中段突起,鼻头下钩",
    score: -10,
    interpretation: "鹰钩鼻,性格多疑,善于算计",
    westernExplanation: "Hooked nose: suspicious nature, calculating"
  },
  {
    category: "鼻子",
    feature: "狮子鼻",
    condition: "鼻头大且圆润",
    score: 15,
    interpretation: "狮子鼻,财运亨通,生活富足",
    westernExplanation: "Lion nose: prosperous finances, comfortable life"
  },
  {
    category: "鼻子",
    feature: "蒜头鼻",
    condition: "鼻头大且鼻翼宽",
    score: 10,
    interpretation: "蒜头鼻,财运佳,但易破财",
    westernExplanation: "Garlic nose: good income, but money easily spent"
  },
  {
    category: "鼻子",
    feature: "悬胆鼻",
    condition: "鼻头如悬胆,鼻孔不露",
    score: 20,
    interpretation: "悬胆鼻,大富大贵之相,财运极佳",
    westernExplanation: "Hanging gallbladder nose: extremely wealthy, excellent fortune"
  },
  
  // 嘴巴
  {
    category: "嘴巴",
    feature: "嘴大口方",
    condition: "嘴巴大且口型方正",
    score: 15,
    interpretation: "嘴大口方,能言善辩,食禄丰厚",
    westernExplanation: "Large square mouth: eloquent, abundant resources"
  },
  {
    category: "嘴巴",
    feature: "嘴小唇薄",
    condition: "嘴巴小且嘴唇薄",
    score: -10,
    interpretation: "嘴小唇薄,言语刻薄,福薄缘浅",
    westernExplanation: "Small thin lips: sharp tongue, limited blessings"
  },
  {
    category: "嘴巴",
    feature: "嘴唇红润",
    condition: "嘴唇颜色红润",
    score: 15,
    interpretation: "唇红齿白,健康长寿,异性缘佳",
    westernExplanation: "Rosy lips: healthy, long life, attractive"
  },
  {
    category: "嘴巴",
    feature: "嘴角上扬",
    condition: "嘴角自然向上",
    score: 15,
    interpretation: "嘴角上扬,性格乐观,人缘好",
    westernExplanation: "Upward mouth corners: optimistic, popular"
  },
  {
    category: "嘴巴",
    feature: "嘴角下垂",
    condition: "嘴角向下",
    score: -10,
    interpretation: "嘴角下垂,性格悲观,晚年孤独",
    westernExplanation: "Downward mouth corners: pessimistic, lonely in old age"
  },
  
  // 耳朵
  {
    category: "耳朵",
    feature: "耳大垂厚",
    condition: "耳朵大且耳垂厚",
    score: 20,
    interpretation: "耳大垂厚,福泽深厚,长寿富贵",
    westernExplanation: "Large ears with thick lobes: blessed, long life, wealthy"
  },
  {
    category: "耳朵",
    feature: "耳小垂薄",
    condition: "耳朵小且耳垂薄",
    score: -15,
    interpretation: "耳小垂薄,福薄缘浅,需自力更生",
    westernExplanation: "Small ears with thin lobes: limited blessings, self-made success"
  },
  {
    category: "耳朵",
    feature: "耳高过眉",
    condition: "耳朵上端高于眉毛",
    score: 15,
    interpretation: "耳高过眉,聪明智慧,少年得志",
    westernExplanation: "Ears above eyebrows: intelligent, early success"
  },
  {
    category: "耳朵",
    feature: "耳贴脑",
    condition: "耳朵紧贴头部",
    score: 15,
    interpretation: "耳贴脑,性格谨慎,善于理财",
    westernExplanation: "Ears close to head: cautious, good at financial management"
  },
  {
    category: "耳朵",
    feature: "招风耳",
    condition: "耳朵外展明显",
    score: -10,
    interpretation: "招风耳,性格叛逆,难守财",
    westernExplanation: "Protruding ears: rebellious, difficulty saving money"
  },
  
  // 眉毛
  {
    category: "眉毛",
    feature: "眉毛浓密",
    condition: "眉毛浓密且整齐",
    score: 15,
    interpretation: "眉浓密,重情重义,兄弟朋友多助",
    westernExplanation: "Thick eyebrows: loyal, supportive friends and siblings"
  },
  {
    category: "眉毛",
    feature: "眉毛稀疏",
    condition: "眉毛稀少",
    score: -10,
    interpretation: "眉稀疏,感情淡薄,兄弟朋友少助",
    westernExplanation: "Sparse eyebrows: emotionally distant, limited support"
  },
  {
    category: "眉毛",
    feature: "一字眉",
    condition: "眉毛平直如一字",
    score: 10,
    interpretation: "一字眉,性格刚毅,意志坚定",
    westernExplanation: "Straight eyebrows: strong-willed, determined"
  },
  {
    category: "眉毛",
    feature: "八字眉",
    condition: "眉毛呈八字形",
    score: -5,
    interpretation: "八字眉,性格软弱,易受欺负",
    westernExplanation: "Drooping eyebrows: weak character, easily bullied"
  },
  {
    category: "眉毛",
    feature: "柳叶眉",
    condition: "眉毛弯曲如柳叶",
    score: 15,
    interpretation: "柳叶眉,温柔善良,异性缘佳",
    westernExplanation: "Willow leaf eyebrows: gentle, kind, attractive"
  },
  
  // 五、气色健康规则 (20条)
  
  {
    category: "健康预警",
    feature: "面色发红",
    condition: "面部整体发红",
    score: -10,
    interpretation: "面色发红,心火旺盛,需注意心血管疾病,宜清淡饮食",
    westernExplanation: "Red complexion: excess heart fire, watch cardiovascular health, eat light diet"
  },
  {
    category: "健康预警",
    feature: "面色发黄",
    condition: "面部整体发黄",
    score: -10,
    interpretation: "面色发黄,脾胃虚弱,消化不良,宜健脾养胃",
    westernExplanation: "Yellow complexion: weak digestion, strengthen spleen and stomach"
  },
  {
    category: "健康预警",
    feature: "面色发青",
    condition: "面部整体发青",
    score: -15,
    interpretation: "面色发青,肝气郁结,情绪压抑,需疏肝解郁",
    westernExplanation: "Greenish complexion: liver qi stagnation, emotional stress, need to release"
  },
  {
    category: "健康预警",
    feature: "面色发黑",
    condition: "面部整体发黑",
    score: -15,
    interpretation: "面色发黑,肾虚严重,需注意泌尿系统,宜补肾",
    westernExplanation: "Dark complexion: kidney deficiency, watch urinary system, nourish kidneys"
  },
  {
    category: "健康预警",
    feature: "面色发白",
    condition: "面部整体苍白",
    score: -10,
    interpretation: "面色发白,气血不足,贫血,宜补气养血",
    westernExplanation: "Pale complexion: insufficient qi and blood, anemia, nourish blood"
  },
  {
    category: "健康预警",
    feature: "印堂发黑",
    condition: "印堂部位发黑",
    score: -20,
    interpretation: "印堂发黑,近期有灾祸,需谨慎行事,多行善积德",
    westernExplanation: "Dark life palace: imminent misfortune, proceed cautiously, do good deeds"
  },
  {
    category: "健康预警",
    feature: "鼻头发红",
    condition: "鼻头明显发红",
    score: -10,
    interpretation: "鼻头发红,肺火旺盛,易患呼吸系统疾病",
    westernExplanation: "Red nose tip: excess lung fire, prone to respiratory issues"
  },
  {
    category: "健康预警",
    feature: "眼圈发黑",
    condition: "眼睛周围发黑",
    score: -10,
    interpretation: "眼圈发黑,肾虚,睡眠不足,需注意休息",
    westernExplanation: "Dark eye circles: kidney deficiency, lack of sleep, need rest"
  },
  {
    category: "健康预警",
    feature: "法令纹深",
    condition: "法令纹明显且深",
    score: -5,
    interpretation: "法令纹深,脾胃功能下降,需注意饮食",
    westernExplanation: "Deep nasolabial folds: declining digestive function, watch diet"
  },
  {
    category: "健康预警",
    feature: "抬头纹多",
    condition: "额头横纹多",
    score: -5,
    interpretation: "抬头纹多,压力大,神经衰弱,需放松心情",
    westernExplanation: "Many forehead lines: high stress, nervous exhaustion, need relaxation"
  },
  {
    category: "健康预警",
    feature: "眉间纹深",
    condition: "眉间竖纹深",
    score: -5,
    interpretation: "眉间纹深,肝气不舒,易怒,需疏肝理气",
    westernExplanation: "Deep frown lines: liver qi stagnation, irritability, need to soothe liver"
  },
  {
    category: "健康预警",
    feature: "鱼尾纹多",
    condition: "眼尾鱼尾纹多",
    score: -5,
    interpretation: "鱼尾纹多,肾虚,泌尿系统问题,需补肾",
    westernExplanation: "Many crow's feet: kidney deficiency, urinary issues, nourish kidneys"
  },
  {
    category: "健康预警",
    feature: "嘴唇发紫",
    condition: "嘴唇颜色发紫",
    score: -15,
    interpretation: "唇色发紫,心脏功能不佳,需及时就医",
    westernExplanation: "Purple lips: heart function issues, seek medical attention"
  },
  {
    category: "健康预警",
    feature: "嘴唇干裂",
    condition: "嘴唇干燥开裂",
    score: -5,
    interpretation: "唇干裂,脾胃燥热,缺乏维生素,需补水润燥",
    westernExplanation: "Dry cracked lips: spleen-stomach heat, vitamin deficiency, hydrate"
  },
  {
    category: "健康预警",
    feature: "舌苔厚腻",
    condition: "舌苔厚且腻",
    score: -10,
    interpretation: "舌苔厚腻,湿气重,脾胃功能差,需祛湿健脾",
    westernExplanation: "Thick tongue coating: excess dampness, poor digestion, remove dampness"
  },
  {
    category: "健康预警",
    feature: "牙龈出血",
    condition: "牙龈经常出血",
    score: -10,
    interpretation: "牙龈出血,胃火旺盛,需清胃火",
    westernExplanation: "Bleeding gums: excess stomach fire, clear stomach heat"
  },
  {
    category: "健康预警",
    feature: "眼睛充血",
    condition: "眼白有红血丝",
    score: -5,
    interpretation: "眼睛充血,肝火旺盛,需清肝明目",
    westernExplanation: "Bloodshot eyes: excess liver fire, clear liver heat"
  },
  {
    category: "健康预警",
    feature: "鼻翼发红",
    condition: "鼻翼两侧发红",
    score: -5,
    interpretation: "鼻翼发红,胃火旺盛,需清胃火",
    westernExplanation: "Red nose wings: excess stomach fire, clear stomach heat"
  },
  {
    category: "健康预警",
    feature: "下巴长痘",
    condition: "下巴经常长痘",
    score: -5,
    interpretation: "下巴长痘,内分泌失调,需调理",
    westernExplanation: "Chin acne: hormonal imbalance, need regulation"
  },
  {
    category: "健康预警",
    feature: "额头长痘",
    condition: "额头经常长痘",
    score: -5,
    interpretation: "额头长痘,心火旺盛,压力大,需放松",
    westernExplanation: "Forehead acne: excess heart fire, high stress, need relaxation"
  }
];

// 插入面相规则 - 映射字段
const mappedFaceRules = faceRulesData.map(rule => ({
  palaceName: rule.category,
  featureName: rule.feature,
  conditionOperator: '==',
  conditionValue: rule.condition,
  score: rule.score,
  interpretation: rule.interpretation,
  category: rule.category
}));
await db.insert(faceRules).values(mappedFaceRules);
console.log(`已录入 ${faceRulesData.length} 条面相规则`);

// ==================== 手相规则 (100条) ====================

const palmRulesData = [
  // 一、三大主线详细规则 (45条)
  
  // 生命线 (15条)
  {
    category: "生命线",
    feature: "生命线长而深",
    condition: "生命线清晰且长",
    score: 20,
    interpretation: "生命线长深,体质强健,长寿之相",
    westernExplanation: "Long deep life line: robust health, longevity"
  },
  {
    category: "生命线",
    feature: "生命线短而浅",
    condition: "生命线短且浅",
    score: -15,
    interpretation: "生命线短浅,体质较弱,需注意保养",
    westernExplanation: "Short shallow life line: delicate health, need care"
  },
  {
    category: "生命线",
    feature: "生命线中断",
    condition: "生命线有明显中断",
    score: -20,
    interpretation: "生命线中断,中年有健康危机,需特别注意",
    westernExplanation: "Broken life line: health crisis in middle age, extra caution needed"
  },
  {
    category: "生命线",
    feature: "生命线有岛纹",
    condition: "生命线上有岛形纹路",
    score: -10,
    interpretation: "生命线有岛纹,该时期易患疾病,需预防",
    westernExplanation: "Island on life line: prone to illness during that period, prevention needed"
  },
  {
    category: "生命线",
    feature: "生命线呈锁链状",
    condition: "生命线呈锁链形",
    score: -10,
    interpretation: "生命线锁链状,体质不佳,易疲劳",
    westernExplanation: "Chain-like life line: poor constitution, easily fatigued"
  },
  {
    category: "生命线",
    feature: "生命线有分支向上",
    condition: "生命线有向上分支",
    score: 15,
    interpretation: "生命线向上分支,该时期运势上扬,事业有成",
    westernExplanation: "Upward branches on life line: fortune rises, career success"
  },
  {
    category: "生命线",
    feature: "生命线有分支向下",
    condition: "生命线有向下分支",
    score: -10,
    interpretation: "生命线向下分支,该时期运势下滑,需谨慎",
    westernExplanation: "Downward branches on life line: fortune declines, proceed cautiously"
  },
  {
    category: "生命线",
    feature: "生命线起点高",
    condition: "生命线起点接近食指",
    score: 15,
    interpretation: "生命线起点高,野心大,进取心强",
    westernExplanation: "High starting life line: ambitious, strong drive"
  },
  {
    category: "生命线",
    feature: "生命线起点低",
    condition: "生命线起点接近拇指",
    score: -5,
    interpretation: "生命线起点低,缺乏自信,进取心弱",
    westernExplanation: "Low starting life line: lacking confidence, weak drive"
  },
  {
    category: "生命线",
    feature: "生命线末端分叉",
    condition: "生命线末端呈Y形分叉",
    score: 10,
    interpretation: "生命线末端分叉,晚年多才多艺,生活丰富",
    westernExplanation: "Forked life line ending: versatile in old age, rich life"
  },
  {
    category: "生命线",
    feature: "生命线弧度大",
    condition: "生命线弧度明显",
    score: 15,
    interpretation: "生命线弧度大,精力旺盛,活力充沛",
    westernExplanation: "Wide arc life line: energetic, full of vitality"
  },
  {
    category: "生命线",
    feature: "生命线弧度小",
    condition: "生命线弧度平缓",
    score: -10,
    interpretation: "生命线弧度小,体力不足,易疲劳",
    westernExplanation: "Narrow arc life line: limited energy, easily tired"
  },
  {
    category: "生命线",
    feature: "生命线有十字纹",
    condition: "生命线上有十字形纹路",
    score: -15,
    interpretation: "生命线有十字纹,该时期有意外灾祸,需防范",
    westernExplanation: "Cross on life line: accident risk during that period, be careful"
  },
  {
    category: "生命线",
    feature: "生命线有星纹",
    condition: "生命线上有星形纹路",
    score: -20,
    interpretation: "生命线有星纹,该时期有重大健康危机,需及时就医",
    westernExplanation: "Star on life line: major health crisis during that period, seek medical help"
  },
  {
    category: "生命线",
    feature: "生命线双重",
    condition: "生命线旁有平行线",
    score: 20,
    interpretation: "双重生命线,生命力极强,遇险能化解",
    westernExplanation: "Double life line: extremely strong vitality, can overcome dangers"
  },
  
  // 智慧线 (15条)
  {
    category: "智慧线",
    feature: "智慧线长而直",
    condition: "智慧线清晰且平直",
    score: 15,
    interpretation: "智慧线长直,理性思维强,逻辑清晰",
    westernExplanation: "Long straight wisdom line: rational thinking, clear logic"
  },
  {
    category: "智慧线",
    feature: "智慧线短而弯",
    condition: "智慧线短且弯曲",
    score: 10,
    interpretation: "智慧线短弯,感性思维强,富有创意",
    westernExplanation: "Short curved wisdom line: emotional thinking, creative"
  },
  {
    category: "智慧线",
    feature: "智慧线分叉",
    condition: "智慧线末端分叉",
    score: 15,
    interpretation: "智慧线分叉,多才多艺,适应力强",
    westernExplanation: "Forked wisdom line: versatile, highly adaptable"
  },
  {
    category: "智慧线",
    feature: "智慧线中断",
    condition: "智慧线有明显中断",
    score: -15,
    interpretation: "智慧线中断,该时期思维混乱,决策困难",
    westernExplanation: "Broken wisdom line: confused thinking during that period, decision difficulties"
  },
  {
    category: "智慧线",
    feature: "智慧线下垂",
    condition: "智慧线向下弯曲",
    score: 10,
    interpretation: "智慧线下垂,想象力丰富,艺术天赋",
    westernExplanation: "Drooping wisdom line: rich imagination, artistic talent"
  },
  {
    category: "智慧线",
    feature: "智慧线过长",
    condition: "智慧线延伸至手掌边缘",
    score: 5,
    interpretation: "智慧线过长,过于理性,缺乏感情",
    westernExplanation: "Overly long wisdom line: too rational, lacking emotion"
  },
  {
    category: "智慧线",
    feature: "智慧线过短",
    condition: "智慧线很短",
    score: -10,
    interpretation: "智慧线过短,思维简单,缺乏深度",
    westernExplanation: "Very short wisdom line: simple thinking, lacking depth"
  },
  {
    category: "智慧线",
    feature: "智慧线有岛纹",
    condition: "智慧线上有岛形纹路",
    score: -10,
    interpretation: "智慧线有岛纹,该时期注意力不集中,记忆力下降",
    westernExplanation: "Island on wisdom line: poor concentration and memory during that period"
  },
  {
    category: "智慧线",
    feature: "智慧线呈锁链状",
    condition: "智慧线呈锁链形",
    score: -10,
    interpretation: "智慧线锁链状,思维混乱,决策困难",
    westernExplanation: "Chain-like wisdom line: confused thinking, decision difficulties"
  },
  {
    category: "智慧线",
    feature: "智慧线与生命线分离",
    condition: "智慧线起点与生命线分开",
    score: 15,
    interpretation: "智慧线独立,独立思考能力强,有主见",
    westernExplanation: "Separated wisdom line: strong independent thinking, opinionated"
  },
  {
    category: "智慧线",
    feature: "智慧线与生命线重合",
    condition: "智慧线起点与生命线重合较长",
    score: -5,
    interpretation: "智慧线重合,依赖性强,缺乏独立性",
    westernExplanation: "Overlapping wisdom line: dependent, lacking independence"
  },
  {
    category: "智慧线",
    feature: "智慧线有分支向上",
    condition: "智慧线有向上分支",
    score: 15,
    interpretation: "智慧线向上分支,该时期事业有成,名利双收",
    westernExplanation: "Upward branches on wisdom line: career success and recognition"
  },
  {
    category: "智慧线",
    feature: "智慧线有十字纹",
    condition: "智慧线上有十字形纹路",
    score: -10,
    interpretation: "智慧线有十字纹,该时期有意外挫折,需谨慎",
    westernExplanation: "Cross on wisdom line: unexpected setback during that period, be cautious"
  },
  {
    category: "智慧线",
    feature: "智慧线双重",
    condition: "智慧线旁有平行线",
    score: 20,
    interpretation: "双重智慧线,智商极高,才华横溢",
    westernExplanation: "Double wisdom line: extremely high intelligence, exceptionally talented"
  },
  {
    category: "智慧线",
    feature: "智慧线末端上扬",
    condition: "智慧线末端向上",
    score: 15,
    interpretation: "智慧线末端上扬,晚年智慧增长,事业有成",
    westernExplanation: "Upward wisdom line ending: wisdom grows in old age, career success"
  },
  
  // 感情线 (15条)
  {
    category: "感情线",
    feature: "感情线长而深",
    condition: "感情线清晰且长",
    score: 20,
    interpretation: "感情线长深,感情丰富,专一忠诚",
    westernExplanation: "Long deep emotion line: emotionally rich, loyal and devoted"
  },
  {
    category: "感情线",
    feature: "感情线短而浅",
    condition: "感情线短且浅",
    score: -15,
    interpretation: "感情线短浅,感情冷淡,不善表达",
    westernExplanation: "Short shallow emotion line: emotionally cold, poor expression"
  },
  {
    category: "感情线",
    feature: "感情线分叉",
    condition: "感情线末端分叉",
    score: -10,
    interpretation: "感情线分叉,感情波折,易有婚变",
    westernExplanation: "Forked emotion line: relationship challenges, possible separation"
  },
  {
    category: "感情线",
    feature: "感情线呈锁链状",
    condition: "感情线呈锁链形",
    score: -10,
    interpretation: "感情线锁链状,感情不稳定,易变心",
    westernExplanation: "Chain-like emotion line: unstable emotions, fickle"
  },
  {
    category: "感情线",
    feature: "感情线向上弯",
    condition: "感情线末端向上",
    score: 15,
    interpretation: "感情线向上弯,感情乐观,婚姻美满",
    westernExplanation: "Upward emotion line: optimistic about love, happy marriage"
  },
  {
    category: "感情线",
    feature: "感情线向下弯",
    condition: "感情线末端向下",
    score: -10,
    interpretation: "感情线向下弯,感情悲观,婚姻不顺",
    westernExplanation: "Downward emotion line: pessimistic about love, marital difficulties"
  },
  {
    category: "感情线",
    feature: "感情线中断",
    condition: "感情线有明显中断",
    score: -20,
    interpretation: "感情线中断,该时期有重大感情危机,需化解",
    westernExplanation: "Broken emotion line: major relationship crisis during that period, need resolution"
  },
  {
    category: "感情线",
    feature: "感情线有岛纹",
    condition: "感情线上有岛形纹路",
    score: -10,
    interpretation: "感情线有岛纹,该时期感情纠葛,三角恋",
    westernExplanation: "Island on emotion line: love triangle during that period"
  },
  {
    category: "感情线",
    feature: "感情线起点高",
    condition: "感情线起点接近食指",
    score: 15,
    interpretation: "感情线起点高,理想主义,追求完美爱情",
    westernExplanation: "High starting emotion line: idealistic, seeks perfect love"
  },
  {
    category: "感情线",
    feature: "感情线起点低",
    condition: "感情线起点接近中指",
    score: -5,
    interpretation: "感情线起点低,现实主义,感情较冷淡",
    westernExplanation: "Low starting emotion line: realistic, emotionally cool"
  },
  {
    category: "感情线",
    feature: "感情线有分支向上",
    condition: "感情线有向上分支",
    score: 15,
    interpretation: "感情线向上分支,该时期感情甜蜜,婚姻美满",
    westernExplanation: "Upward branches on emotion line: sweet romance, happy marriage"
  },
  {
    category: "感情线",
    feature: "感情线有分支向下",
    condition: "感情线有向下分支",
    score: -10,
    interpretation: "感情线向下分支,该时期感情受挫,需调整",
    westernExplanation: "Downward branches on emotion line: relationship setback, need adjustment"
  },
  {
    category: "感情线",
    feature: "感情线有十字纹",
    condition: "感情线上有十字形纹路",
    score: -15,
    interpretation: "感情线有十字纹,该时期有感情危机,需化解",
    westernExplanation: "Cross on emotion line: relationship crisis during that period, need resolution"
  },
  {
    category: "感情线",
    feature: "感情线双重",
    condition: "感情线旁有平行线",
    score: 20,
    interpretation: "双重感情线,感情运极佳,桃花旺盛",
    westernExplanation: "Double emotion line: excellent love fortune, very attractive"
  },
  {
    category: "感情线",
    feature: "感情线末端分三叉",
    condition: "感情线末端呈三叉形",
    score: 20,
    interpretation: "感情线三叉,福禄寿三全,婚姻美满幸福",
    westernExplanation: "Three-forked emotion line: blessed with fortune, longevity, and happy marriage"
  },
  
  // 二、八大丘详细规则 (40条)
  
  // 金星丘 (5条)
  {
    category: "金星丘",
    feature: "金星丘饱满",
    condition: "拇指根部肉厚",
    score: 20,
    interpretation: "金星丘饱满,精力旺盛,爱情运佳,异性缘好",
    westernExplanation: "Full Venus mount: energetic, good love fortune, attractive"
  },
  {
    category: "金星丘",
    feature: "金星丘平坦",
    condition: "拇指根部无肉",
    score: -15,
    interpretation: "金星丘平坦,体力不足,感情冷淡",
    westernExplanation: "Flat Venus mount: limited energy, emotionally cold"
  },
  {
    category: "金星丘",
    feature: "金星丘过度发达",
    condition: "拇指根部肉过厚",
    score: -5,
    interpretation: "金星丘过度发达,欲望过强,易沉溺享乐",
    westernExplanation: "Overdeveloped Venus mount: excessive desires, prone to indulgence"
  },
  {
    category: "金星丘",
    feature: "金星丘有十字纹",
    condition: "拇指根部有十字纹",
    score: 15,
    interpretation: "金星丘有十字纹,一生有一次刻骨铭心的爱情",
    westernExplanation: "Cross on Venus mount: one unforgettable love in life"
  },
  {
    category: "金星丘",
    feature: "金星丘有格子纹",
    condition: "拇指根部有格子纹",
    score: 20,
    interpretation: "金星丘有格子纹,异性缘极佳,桃花运旺",
    westernExplanation: "Grid on Venus mount: excellent opposite-sex attraction, strong romantic luck"
  },
  
  // 木星丘 (5条)
  {
    category: "木星丘",
    feature: "木星丘饱满",
    condition: "食指根部肉厚",
    score: 20,
    interpretation: "木星丘饱满,有领导才能,野心大,事业有成",
    westernExplanation: "Full Jupiter mount: leadership ability, ambitious, career success"
  },
  {
    category: "木星丘",
    feature: "木星丘平坦",
    condition: "食指根部无肉",
    score: -15,
    interpretation: "木星丘平坦,缺乏自信,无进取心",
    westernExplanation: "Flat Jupiter mount: lacking confidence, no ambition"
  },
  {
    category: "木星丘",
    feature: "木星丘过度发达",
    condition: "食指根部肉过厚",
    score: -5,
    interpretation: "木星丘过度发达,野心过大,易独断专行",
    westernExplanation: "Overdeveloped Jupiter mount: excessive ambition, dictatorial"
  },
  {
    category: "木星丘",
    feature: "木星丘有星纹",
    condition: "食指根部有星纹",
    score: 20,
    interpretation: "木星丘有星纹,事业大成,名利双收",
    westernExplanation: "Star on Jupiter mount: great career success, fame and fortune"
  },
  {
    category: "木星丘",
    feature: "木星丘有十字纹",
    condition: "食指根部有十字纹",
    score: 15,
    interpretation: "木星丘有十字纹,婚姻美满,配偶贤良",
    westernExplanation: "Cross on Jupiter mount: happy marriage, virtuous spouse"
  },
  
  // 土星丘 (5条)
  {
    category: "土星丘",
    feature: "土星丘饱满",
    condition: "中指根部肉厚",
    score: 15,
    interpretation: "土星丘饱满,深思熟虑,有智慧,适合研究工作",
    westernExplanation: "Full Saturn mount: thoughtful, wise, suited for research"
  },
  {
    category: "土星丘",
    feature: "土星丘平坦",
    condition: "中指根部无肉",
    score: -10,
    interpretation: "土星丘平坦,缺乏深度,思考肤浅",
    westernExplanation: "Flat Saturn mount: lacking depth, superficial thinking"
  },
  {
    category: "土星丘",
    feature: "土星丘过度发达",
    condition: "中指根部肉过厚",
    score: -10,
    interpretation: "土星丘过度发达,过于悲观,孤僻",
    westernExplanation: "Overdeveloped Saturn mount: too pessimistic, solitary"
  },
  {
    category: "土星丘",
    feature: "土星丘有星纹",
    condition: "中指根部有星纹",
    score: -15,
    interpretation: "土星丘有星纹,有意外灾祸,需谨慎",
    westernExplanation: "Star on Saturn mount: risk of accident, be cautious"
  },
  {
    category: "土星丘",
    feature: "土星丘有十字纹",
    condition: "中指根部有十字纹",
    score: 15,
    interpretation: "土星丘有十字纹,有宗教信仰,精神富足",
    westernExplanation: "Cross on Saturn mount: religious faith, spiritually fulfilled"
  },
  
  // 太阳丘 (5条)
  {
    category: "太阳丘",
    feature: "太阳丘饱满",
    condition: "无名指根部肉厚",
    score: 20,
    interpretation: "太阳丘饱满,艺术天赋,名利双收,人生辉煌",
    westernExplanation: "Full Sun mount: artistic talent, fame and fortune, brilliant life"
  },
  {
    category: "太阳丘",
    feature: "太阳丘平坦",
    condition: "无名指根部无肉",
    score: -15,
    interpretation: "太阳丘平坦,缺乏创意,平凡一生",
    westernExplanation: "Flat Sun mount: lacking creativity, ordinary life"
  },
  {
    category: "太阳丘",
    feature: "太阳丘过度发达",
    condition: "无名指根部肉过厚",
    score: -5,
    interpretation: "太阳丘过度发达,爱慕虚荣,追求名利",
    westernExplanation: "Overdeveloped Sun mount: vain, overly pursuing fame"
  },
  {
    category: "太阳丘",
    feature: "太阳丘有星纹",
    condition: "无名指根部有星纹",
    score: 20,
    interpretation: "太阳丘有星纹,名扬四海,大富大贵",
    westernExplanation: "Star on Sun mount: world-renowned, extremely wealthy"
  },
  {
    category: "太阳丘",
    feature: "太阳丘有十字纹",
    condition: "无名指根部有十字纹",
    score: 15,
    interpretation: "太阳丘有十字纹,艺术成就,名利双收",
    westernExplanation: "Cross on Sun mount: artistic achievement, fame and fortune"
  },
  
  // 水星丘 (5条)
  {
    category: "水星丘",
    feature: "水星丘饱满",
    condition: "小指根部肉厚",
    score: 20,
    interpretation: "水星丘饱满,口才好,商业头脑,财运亨通",
    westernExplanation: "Full Mercury mount: eloquent, business acumen, prosperous finances"
  },
  {
    category: "水星丘",
    feature: "水星丘平坦",
    condition: "小指根部无肉",
    score: -15,
    interpretation: "水星丘平坦,不善言辞,财运平平",
    westernExplanation: "Flat Mercury mount: poor communication, average finances"
  },
  {
    category: "水星丘",
    feature: "水星丘过度发达",
    condition: "小指根部肉过厚",
    score: -5,
    interpretation: "水星丘过度发达,过于精明,易耍小聪明",
    westernExplanation: "Overdeveloped Mercury mount: overly shrewd, cunning"
  },
  {
    category: "水星丘",
    feature: "水星丘有星纹",
    condition: "小指根部有星纹",
    score: 20,
    interpretation: "水星丘有星纹,商业奇才,财富惊人",
    westernExplanation: "Star on Mercury mount: business genius, amazing wealth"
  },
  {
    category: "水星丘",
    feature: "水星丘有十字纹",
    condition: "小指根部有十字纹",
    score: 15,
    interpretation: "水星丘有十字纹,科学天赋,研究有成",
    westernExplanation: "Cross on Mercury mount: scientific talent, research success"
  },
  
  // 月丘 (5条)
  {
    category: "月丘",
    feature: "月丘饱满",
    condition: "小指下方手掌外侧肉厚",
    score: 20,
    interpretation: "月丘饱满,想象力丰富,艺术天赋,浪漫多情",
    westernExplanation: "Full Moon mount: rich imagination, artistic talent, romantic"
  },
  {
    category: "月丘",
    feature: "月丘平坦",
    condition: "小指下方手掌外侧无肉",
    score: -15,
    interpretation: "月丘平坦,缺乏浪漫,现实主义",
    westernExplanation: "Flat Moon mount: lacking romance, realistic"
  },
  {
    category: "月丘",
    feature: "月丘过度发达",
    condition: "小指下方手掌外侧肉过厚",
    score: -5,
    interpretation: "月丘过度发达,过于幻想,不切实际",
    westernExplanation: "Overdeveloped Moon mount: overly imaginative, impractical"
  },
  {
    category: "月丘",
    feature: "月丘有星纹",
    condition: "小指下方手掌外侧有星纹",
    score: 15,
    interpretation: "月丘有星纹,艺术成就,名扬四海",
    westernExplanation: "Star on Moon mount: artistic achievement, world-renowned"
  },
  {
    category: "月丘",
    feature: "月丘有十字纹",
    condition: "小指下方手掌外侧有十字纹",
    score: 10,
    interpretation: "月丘有十字纹,直觉敏锐,第六感强",
    westernExplanation: "Cross on Moon mount: sharp intuition, strong sixth sense"
  },
  
  // 第一火星丘 (5条)
  {
    category: "第一火星丘",
    feature: "第一火星丘饱满",
    condition: "拇指与食指之间肉厚",
    score: 15,
    interpretation: "第一火星丘饱满,勇敢果断,有行动力",
    westernExplanation: "Full First Mars mount: brave, decisive, action-oriented"
  },
  {
    category: "第一火星丘",
    feature: "第一火星丘平坦",
    condition: "拇指与食指之间无肉",
    score: -15,
    interpretation: "第一火星丘平坦,胆小怯懦,优柔寡断",
    westernExplanation: "Flat First Mars mount: timid, cowardly, indecisive"
  },
  {
    category: "第一火星丘",
    feature: "第一火星丘过度发达",
    condition: "拇指与食指之间肉过厚",
    score: -5,
    interpretation: "第一火星丘过度发达,过于冲动,易惹是非",
    westernExplanation: "Overdeveloped First Mars mount: too impulsive, trouble-prone"
  },
  {
    category: "第一火星丘",
    feature: "第一火星丘有星纹",
    condition: "拇指与食指之间有星纹",
    score: 15,
    interpretation: "第一火星丘有星纹,军事天赋,英勇无畏",
    westernExplanation: "Star on First Mars mount: military talent, fearless"
  },
  {
    category: "第一火星丘",
    feature: "第一火星丘有十字纹",
    condition: "拇指与食指之间有十字纹",
    score: -10,
    interpretation: "第一火星丘有十字纹,易有意外伤害,需谨慎",
    westernExplanation: "Cross on First Mars mount: risk of accidental injury, be careful"
  },
  
  // 第二火星丘 (5条)
  {
    category: "第二火星丘",
    feature: "第二火星丘饱满",
    condition: "小指下方手掌内侧肉厚",
    score: 15,
    interpretation: "第二火星丘饱满,坚韧不拔,有毅力,能吃苦",
    westernExplanation: "Full Second Mars mount: persevering, determined, hardworking"
  },
  {
    category: "第二火星丘",
    feature: "第二火星丘平坦",
    condition: "小指下方手掌内侧无肉",
    score: -15,
    interpretation: "第二火星丘平坦,容易放弃,缺乏耐心",
    westernExplanation: "Flat Second Mars mount: easily gives up, lacking patience"
  },
  {
    category: "第二火星丘",
    feature: "第二火星丘过度发达",
    condition: "小指下方手掌内侧肉过厚",
    score: -5,
    interpretation: "第二火星丘过度发达,过于固执,不知变通",
    westernExplanation: "Overdeveloped Second Mars mount: too stubborn, inflexible"
  },
  {
    category: "第二火星丘",
    feature: "第二火星丘有星纹",
    condition: "小指下方手掌内侧有星纹",
    score: 15,
    interpretation: "第二火星丘有星纹,意志坚强,百折不挠",
    westernExplanation: "Star on Second Mars mount: strong will, indomitable"
  },
  {
    category: "第二火星丘",
    feature: "第二火星丘有十字纹",
    condition: "小指下方手掌内侧有十字纹",
    score: 10,
    interpretation: "第二火星丘有十字纹,自制力强,能控制情绪",
    westernExplanation: "Cross on Second Mars mount: strong self-control, emotional regulation"
  },
  
  // 三、辅助线规则 (15条)
  
  // 事业线
  {
    category: "事业线",
    feature: "事业线清晰",
    condition: "手掌中央有清晰竖线",
    score: 20,
    interpretation: "事业线清晰,事业有成,工作稳定",
    westernExplanation: "Clear career line: career success, stable work"
  },
  {
    category: "事业线",
    feature: "事业线模糊",
    condition: "手掌中央竖线不清晰",
    score: -10,
    interpretation: "事业线模糊,事业多变,工作不稳",
    westernExplanation: "Unclear career line: career changes, unstable work"
  },
  {
    category: "事业线",
    feature: "事业线中断",
    condition: "手掌中央竖线有中断",
    score: -15,
    interpretation: "事业线中断,该时期事业受挫,需调整",
    westernExplanation: "Broken career line: career setback during that period, need adjustment"
  },
  {
    category: "事业线",
    feature: "事业线起点低",
    condition: "事业线从手腕处起",
    score: 15,
    interpretation: "事业线起点低,早年创业,白手起家",
    westernExplanation: "Low starting career line: early entrepreneurship, self-made"
  },
  {
    category: "事业线",
    feature: "事业线起点高",
    condition: "事业线从手掌中部起",
    score: 10,
    interpretation: "事业线起点高,中年事业有成",
    westernExplanation: "High starting career line: career success in middle age"
  },
  
  // 婚姻线
  {
    category: "婚姻线",
    feature: "婚姻线一条清晰",
    condition: "小指下方有一条清晰横线",
    score: 20,
    interpretation: "婚姻线一条清晰,婚姻美满,一生一世",
    westernExplanation: "One clear marriage line: happy marriage, lifelong love"
  },
  {
    category: "婚姻线",
    feature: "婚姻线多条",
    condition: "小指下方有多条横线",
    score: -10,
    interpretation: "婚姻线多条,感情多波折,易有婚变",
    westernExplanation: "Multiple marriage lines: relationship challenges, possible remarriage"
  },
  {
    category: "婚姻线",
    feature: "婚姻线下垂",
    condition: "婚姻线向下弯曲",
    score: -15,
    interpretation: "婚姻线下垂,配偶健康不佳,或婚姻不顺",
    westernExplanation: "Drooping marriage line: spouse health issues or marital difficulties"
  },
  {
    category: "婚姻线",
    feature: "婚姻线上扬",
    condition: "婚姻线向上弯曲",
    score: 15,
    interpretation: "婚姻线上扬,婚姻美满,配偶贤良",
    westernExplanation: "Upward marriage line: happy marriage, virtuous spouse"
  },
  {
    category: "婚姻线",
    feature: "婚姻线有岛纹",
    condition: "婚姻线上有岛形纹路",
    score: -15,
    interpretation: "婚姻线有岛纹,婚姻有第三者介入",
    westernExplanation: "Island on marriage line: third party in marriage"
  },
  
  // 财运线
  {
    category: "财运线",
    feature: "财运线清晰",
    condition: "小指下方有清晰竖线",
    score: 20,
    interpretation: "财运线清晰,财运亨通,善于理财",
    westernExplanation: "Clear wealth line: prosperous finances, good at money management"
  },
  {
    category: "财运线",
    feature: "财运线模糊",
    condition: "小指下方竖线不清晰",
    score: -10,
    interpretation: "财运线模糊,财运平平,需努力",
    westernExplanation: "Unclear wealth line: average finances, need effort"
  },
  {
    category: "财运线",
    feature: "财运线中断",
    condition: "小指下方竖线有中断",
    score: -15,
    interpretation: "财运线中断,该时期有破财,需谨慎",
    westernExplanation: "Broken wealth line: financial loss during that period, be cautious"
  },
  {
    category: "财运线",
    feature: "财运线有分支",
    condition: "小指下方竖线有分支",
    score: 15,
    interpretation: "财运线有分支,财源广进,多方进财",
    westernExplanation: "Branched wealth line: multiple income sources, wealth from various channels"
  },
  {
    category: "财运线",
    feature: "财运线有星纹",
    condition: "小指下方竖线有星纹",
    score: 20,
    interpretation: "财运线有星纹,意外之财,一夜暴富",
    westernExplanation: "Star on wealth line: windfall, sudden wealth"
  }
];

// 插入手相规则 - 映射字段
const mappedPalmRules = palmRulesData.map(rule => ({
  lineName: rule.category.includes('线') ? rule.category : null,
  hillName: rule.category.includes('丘') ? rule.category : null,
  featureName: rule.feature,
  conditionOperator: '==',
  conditionValue: rule.condition,
  score: rule.score,
  interpretation: rule.interpretation,
  category: rule.category
}));
await db.insert(palmRules).values(mappedPalmRules);
console.log(`已录入 ${palmRulesData.length} 条手相规则`);

console.log(`\n总计录入 ${faceRulesData.length + palmRulesData.length} 条五台山大师级规则`);
console.log("规则库扩充完成!");
