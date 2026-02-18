import fs from 'fs';
import path from 'path';

const localesDir = './client/src/i18n/locales';

// 商品翻译数据
const translations = {
  zh: {
    products: {
      510060: {
        name: "命理能量分析报告",
        shortDesc: "解锁古老东方智慧,探索您的命理能量密码",
        description: "基于生辰八字的深度命理分析,包含命理结构解读与流年运势分析,3-5日交付专属报告"
      },
      510061: {
        name: "命理分析 + 五台山祈福仪式",
        shortDesc: "深度命理解析 + 五台山圣地祈福,双重守护您的人生之路",
        description: "完整命理报告 + 五台山代祈福服务(供灯/上香),含视频记录,10-15日交付"
      }
    }
  },
  en: {
    products: {
      510060: {
        name: "Fortune Energy Analysis Report",
        shortDesc: "Unlock Ancient Eastern Wisdom, Explore Your Destiny Energy Code",
        description: "In-depth destiny analysis based on birth data, including Bazi structure interpretation and annual fortune analysis, delivered in 3-5 days"
      },
      510061: {
        name: "Destiny Analysis + Wutai Mountain Blessing Ceremony",
        shortDesc: "Deep Destiny Analysis + Sacred Wutai Mountain Blessing, Dual Protection for Your Life Path",
        description: "Complete destiny report + Wutai Mountain proxy blessing service (lamp/incense), with video recording, delivered in 10-15 days"
      }
    }
  },
  de: {
    products: {
      510060: {
        name: "Schicksalsenergie-Analysebericht",
        shortDesc: "Entschlüsseln Sie alte östliche Weisheit, erkunden Sie Ihren Schicksalsenergie-Code",
        description: "Tiefgehende Schicksalsanalyse basierend auf Geburtsdaten, einschließlich Bazi-Strukturinterpretation und jährlicher Glücksanalyse, Lieferung in 3-5 Tagen"
      },
      510061: {
        name: "Schicksalsanalyse + Wutai-Berg-Segenszeremonie",
        shortDesc: "Tiefe Schicksalsanalyse + Heiliger Wutai-Berg-Segen, Doppelter Schutz für Ihren Lebensweg",
        description: "Vollständiger Schicksalsbericht + Wutai-Berg-Stellvertreter-Segensdienst (Lampe/Räucherstäbchen), mit Videoaufzeichnung, Lieferung in 10-15 Tagen"
      }
    }
  },
  fr: {
    products: {
      510060: {
        name: "Rapport d'Analyse de l'Énergie du Destin",
        shortDesc: "Déverrouillez la Sagesse Orientale Ancienne, Explorez Votre Code d'Énergie du Destin",
        description: "Analyse approfondie du destin basée sur les données de naissance, incluant l'interprétation de la structure Bazi et l'analyse de la fortune annuelle, livré en 3-5 jours"
      },
      510061: {
        name: "Analyse du Destin + Cérémonie de Bénédiction du Mont Wutai",
        shortDesc: "Analyse Profonde du Destin + Bénédiction Sacrée du Mont Wutai, Double Protection pour Votre Chemin de Vie",
        description: "Rapport complet sur le destin + service de bénédiction par procuration du Mont Wutai (lampe/encens), avec enregistrement vidéo, livré en 10-15 jours"
      }
    }
  },
  es: {
    products: {
      510060: {
        name: "Informe de Análisis de Energía del Destino",
        shortDesc: "Desbloquea la Sabiduría Oriental Antigua, Explora Tu Código de Energía del Destino",
        description: "Análisis profundo del destino basado en datos de nacimiento, incluyendo interpretación de estructura Bazi y análisis de fortuna anual, entregado en 3-5 días"
      },
      510061: {
        name: "Análisis del Destino + Ceremonia de Bendición del Monte Wutai",
        shortDesc: "Análisis Profundo del Destino + Bendición Sagrada del Monte Wutai, Doble Protección para Tu Camino de Vida",
        description: "Informe completo del destino + servicio de bendición por poder del Monte Wutai (lámpara/incienso), con grabación de video, entregado en 10-15 días"
      }
    }
  },
  it: {
    products: {
      510060: {
        name: "Rapporto di Analisi dell'Energia del Destino",
        shortDesc: "Sblocca l'Antica Saggezza Orientale, Esplora il Tuo Codice Energetico del Destino",
        description: "Analisi approfondita del destino basata sui dati di nascita, inclusa l'interpretazione della struttura Bazi e l'analisi della fortuna annuale, consegnato in 3-5 giorni"
      },
      510061: {
        name: "Analisi del Destino + Cerimonia di Benedizione del Monte Wutai",
        shortDesc: "Analisi Profonda del Destino + Benedizione Sacra del Monte Wutai, Doppia Protezione per il Tuo Percorso di Vita",
        description: "Rapporto completo sul destino + servizio di benedizione per procura del Monte Wutai (lampada/incenso), con registrazione video, consegnato in 10-15 giorni"
      }
    }
  },
  pt: {
    products: {
      510060: {
        name: "Relatório de Análise de Energia do Destino",
        shortDesc: "Desbloqueie a Sabedoria Oriental Antiga, Explore Seu Código de Energia do Destino",
        description: "Análise profunda do destino baseada em dados de nascimento, incluindo interpretação da estrutura Bazi e análise da fortuna anual, entregue em 3-5 dias"
      },
      510061: {
        name: "Análise do Destino + Cerimônia de Bênção do Monte Wutai",
        shortDesc: "Análise Profunda do Destino + Bênção Sagrada do Monte Wutai, Dupla Proteção para Seu Caminho de Vida",
        description: "Relatório completo do destino + serviço de bênção por procuração do Monte Wutai (lâmpada/incenso), com gravação de vídeo, entregue em 10-15 dias"
      }
    }
  },
  ru: {
    products: {
      510060: {
        name: "Отчет об Анализе Энергии Судьбы",
        shortDesc: "Раскройте Древнюю Восточную Мудрость, Исследуйте Ваш Энергетический Код Судьбы",
        description: "Глубокий анализ судьбы на основе данных о рождении, включая интерпретацию структуры Бацзы и анализ годовой удачи, доставка в течение 3-5 дней"
      },
      510061: {
        name: "Анализ Судьбы + Церемония Благословения Горы Утай",
        shortDesc: "Глубокий Анализ Судьбы + Священное Благословение Горы Утай, Двойная Защита Вашего Жизненного Пути",
        description: "Полный отчет о судьбе + услуга благословения по доверенности на Горе Утай (лампа/благовония), с видеозаписью, доставка в течение 10-15 дней"
      }
    }
  },
  ja: {
    products: {
      510060: {
        name: "運命エネルギー分析レポート",
        shortDesc: "古代東洋の知恵を解き放ち、あなたの運命エネルギーコードを探る",
        description: "生年月日に基づく詳細な運命分析、八字構造の解釈と年間運勢分析を含む、3-5日で配信"
      },
      510061: {
        name: "運命分析 + 五台山祝福儀式",
        shortDesc: "深い運命分析 + 聖なる五台山の祝福、あなたの人生の道への二重の保護",
        description: "完全な運命レポート + 五台山代理祝福サービス(ランプ/お香)、ビデオ録画付き、10-15日で配信"
      }
    }
  },
  ko: {
    products: {
      510060: {
        name: "운명 에너지 분석 보고서",
        shortDesc: "고대 동양 지혜를 해제하고 당신의 운명 에너지 코드를 탐험하세요",
        description: "생년월일 데이터를 기반으로 한 심층 운명 분석, 바지 구조 해석 및 연간 운세 분석 포함, 3-5일 내 배송"
      },
      510061: {
        name: "운명 분석 + 우타이산 축복 의식",
        shortDesc: "깊은 운명 분석 + 신성한 우타이산 축복, 당신의 인생 길에 대한 이중 보호",
        description: "완전한 운명 보고서 + 우타이산 대리 축복 서비스(램프/향), 비디오 녹화 포함, 10-15일 내 배송"
      }
    }
  },
  ar: {
    products: {
      510060: {
        name: "تقرير تحليل طاقة المصير",
        shortDesc: "افتح الحكمة الشرقية القديمة، استكشف رمز طاقة مصيرك",
        description: "تحليل عميق للمصير بناءً على بيانات الميلاد، بما في ذلك تفسير هيكل بازي وتحليل الحظ السنوي، يتم التسليم في 3-5 أيام"
      },
      510061: {
        name: "تحليل المصير + حفل بركة جبل ووتاي",
        shortDesc: "تحليل عميق للمصير + بركة جبل ووتاي المقدسة، حماية مزدوجة لطريق حياتك",
        description: "تقرير مصير كامل + خدمة بركة بالوكالة من جبل ووتاي (مصباح/بخور)، مع تسجيل فيديو، يتم التسليم في 10-15 يومًا"
      }
    }
  },
  hi: {
    products: {
      510060: {
        name: "भाग्य ऊर्जा विश्लेषण रिपोर्ट",
        shortDesc: "प्राचीन पूर्वी ज्ञान को अनलॉक करें, अपने भाग्य ऊर्जा कोड का अन्वेषण करें",
        description: "जन्म डेटा के आधार पर गहन भाग्य विश्लेषण, बाज़ी संरचना व्याख्या और वार्षिक भाग्य विश्लेषण सहित, 3-5 दिनों में वितरित"
      },
      510061: {
        name: "भाग्य विश्लेषण + वुताई पर्वत आशीर्वाद समारोह",
        shortDesc: "गहन भाग्य विश्लेषण + पवित्र वुताई पर्वत आशीर्वाद, आपके जीवन पथ के लिए दोहरी सुरक्षा",
        description: "पूर्ण भाग्य रिपोर्ट + वुताई पर्वत प्रॉक्सी आशीर्वाद सेवा (दीपक/धूप), वीडियो रिकॉर्डिंग के साथ, 10-15 दिनों में वितरित"
      }
    }
  },
  th: {
    products: {
      510060: {
        name: "รายงานการวิเคราะห์พลังงานชะตากรรม",
        shortDesc: "ปลดล็อกภูมิปัญญาตะวันออกโบราณ สำรวจรหัสพลังงานชะตากรรมของคุณ",
        description: "การวิเคราะห์ชะตากรรมเชิงลึกตามข้อมูลการเกิด รวมถึงการตีความโครงสร้างบาจื้อและการวิเคราะห์โชคประจำปี ส่งมอบภายใน 3-5 วัน"
      },
      510061: {
        name: "การวิเคราะห์ชะตากรรม + พิธีอวยพรภูเขาอู่ไถ",
        shortDesc: "การวิเคราะห์ชะตากรรมเชิงลึก + พรศักดิ์สิทธิ์จากภูเขาอู่ไถ การปกป้องคู่สำหรับเส้นทางชีวิตของคุณ",
        description: "รายงานชะตากรรมฉบับสมบูรณ์ + บริการอวยพรแทนจากภูเขาอู่ไถ (ตะเกียง/ธูป) พร้อมการบันทึกวิดีโอ ส่งมอบภายใน 10-15 วัน"
      }
    }
  },
  vi: {
    products: {
      510060: {
        name: "Báo Cáo Phân Tích Năng Lượng Vận Mệnh",
        shortDesc: "Mở Khóa Trí Tuệ Phương Đông Cổ Đại, Khám Phá Mã Năng Lượng Vận Mệnh Của Bạn",
        description: "Phân tích vận mệnh sâu sắc dựa trên dữ liệu sinh, bao gồm giải thích cấu trúc Bát Tự và phân tích vận may hàng năm, giao hàng trong 3-5 ngày"
      },
      510061: {
        name: "Phân Tích Vận Mệnh + Nghi Lễ Chúc Phúc Núi Ngũ Đài",
        shortDesc: "Phân Tích Vận Mệnh Sâu Sắc + Phúc Lành Thiêng Liêng Từ Núi Ngũ Đài, Bảo Vệ Kép Cho Con Đường Cuộc Đời Bạn",
        description: "Báo cáo vận mệnh đầy đủ + dịch vụ chúc phúc ủy quyền từ Núi Ngũ Đài (đèn/hương), có ghi hình video, giao hàng trong 10-15 ngày"
      }
    }
  },
  id: {
    products: {
      510060: {
        name: "Laporan Analisis Energi Takdir",
        shortDesc: "Buka Kunci Kebijaksanaan Timur Kuno, Jelajahi Kode Energi Takdir Anda",
        description: "Analisis takdir mendalam berdasarkan data kelahiran, termasuk interpretasi struktur Bazi dan analisis keberuntungan tahunan, dikirim dalam 3-5 hari"
      },
      510061: {
        name: "Analisis Takdir + Upacara Berkah Gunung Wutai",
        shortDesc: "Analisis Takdir Mendalam + Berkah Suci Gunung Wutai, Perlindungan Ganda untuk Jalan Hidup Anda",
        description: "Laporan takdir lengkap + layanan berkah proksi Gunung Wutai (lampu/dupa), dengan rekaman video, dikirim dalam 10-15 hari"
      }
    }
  }
};

// 读取并更新每个语言文件
for (const [lang, data] of Object.entries(translations)) {
  const filePath = path.join(localesDir, `${lang}.json`);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  // 确保products对象存在
  if (!content.products) {
    content.products = {};
  }
  
  // 合并商品翻译
  content.products = {
    ...content.products,
    ...data.products
  };
  
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');
  console.log(`✅ Updated ${lang}.json`);
}

console.log('✅ All product translations updated!');
