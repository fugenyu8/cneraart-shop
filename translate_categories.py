import json

# 7个新分类的翻译
translations = {
    "en": {
        "zodiac_guardians": "Zodiac Guardians",
        "zodiac_guardians_desc": "Exclusive zodiac guardian artifacts based on your birth year",
        "sun_sign_guardians": "Sun Sign Guardians",
        "sun_sign_guardians_desc": "Guardians for your outer personality and life direction based on your birth date",
        "moon_sign_guardians": "Moon Sign Guardians",
        "moon_sign_guardians_desc": "Guardians for your emotional world and inner needs, enhancing emotional energy",
        "wealth_fortune": "Wealth & Fortune",
        "wealth_fortune_desc": "Boost career development, attract wealth and prosperity",
        "health_safety": "Health & Safety",
        "health_safety_desc": "Ward off illness and disasters, ensure peace and health",
        "wisdom_study": "Wisdom & Study",
        "wisdom_study_desc": "Unlock wisdom, academic progress, and exam success",
        "inner_peace": "Inner Peace",
        "inner_peace_desc": "Calm the mind, eliminate worries, achieve inner tranquility"
    },
    "de": {
        "zodiac_guardians": "Tierkreis-Wächter",
        "zodiac_guardians_desc": "Exklusive Tierkreis-Schutzartefakte basierend auf Ihrem Geburtsjahr",
        "sun_sign_guardians": "Sonnenzeichen-Wächter",
        "sun_sign_guardians_desc": "Wächter für Ihre äußere Persönlichkeit und Lebensrichtung basierend auf Ihrem Geburtsdatum",
        "moon_sign_guardians": "Mondzeichen-Wächter",
        "moon_sign_guardians_desc": "Wächter für Ihre emotionale Welt und innere Bedürfnisse, stärken emotionale Energie",
        "wealth_fortune": "Wohlstand & Glück",
        "wealth_fortune_desc": "Fördern Sie Karriereentwicklung, ziehen Sie Wohlstand und Wohlstand an",
        "health_safety": "Gesundheit & Sicherheit",
        "health_safety_desc": "Wehren Sie Krankheiten und Katastrophen ab, sorgen Sie für Frieden und Gesundheit",
        "wisdom_study": "Weisheit & Studium",
        "wisdom_study_desc": "Weisheit freischalten, akademischer Fortschritt und Prüfungserfolg",
        "inner_peace": "Innerer Frieden",
        "inner_peace_desc": "Beruhigen Sie den Geist, beseitigen Sie Sorgen, erreichen Sie innere Ruhe"
    },
    "fr": {
        "zodiac_guardians": "Gardiens du Zodiaque",
        "zodiac_guardians_desc": "Artefacts de gardien du zodiaque exclusifs basés sur votre année de naissance",
        "sun_sign_guardians": "Gardiens du Signe Solaire",
        "sun_sign_guardians_desc": "Gardiens pour votre personnalité extérieure et direction de vie basés sur votre date de naissance",
        "moon_sign_guardians": "Gardiens du Signe Lunaire",
        "moon_sign_guardians_desc": "Gardiens pour votre monde émotionnel et besoins intérieurs, renforçant l'énergie émotionnelle",
        "wealth_fortune": "Richesse & Fortune",
        "wealth_fortune_desc": "Stimuler le développement de carrière, attirer richesse et prospérité",
        "health_safety": "Santé & Sécurité",
        "health_safety_desc": "Éloigner les maladies et les catastrophes, assurer la paix et la santé",
        "wisdom_study": "Sagesse & Étude",
        "wisdom_study_desc": "Débloquer la sagesse, progrès académique et réussite aux examens",
        "inner_peace": "Paix Intérieure",
        "inner_peace_desc": "Calmer l'esprit, éliminer les soucis, atteindre la tranquillité intérieure"
    },
    "es": {
        "zodiac_guardians": "Guardianes del Zodíaco",
        "zodiac_guardians_desc": "Artefactos guardianes del zodíaco exclusivos basados en tu año de nacimiento",
        "sun_sign_guardians": "Guardianes del Signo Solar",
        "sun_sign_guardians_desc": "Guardianes para tu personalidad exterior y dirección de vida basados en tu fecha de nacimiento",
        "moon_sign_guardians": "Guardianes del Signo Lunar",
        "moon_sign_guardians_desc": "Guardianes para tu mundo emocional y necesidades internas, fortaleciendo la energía emocional",
        "wealth_fortune": "Riqueza y Fortuna",
        "wealth_fortune_desc": "Impulsar el desarrollo profesional, atraer riqueza y prosperidad",
        "health_safety": "Salud y Seguridad",
        "health_safety_desc": "Alejar enfermedades y desastres, asegurar paz y salud",
        "wisdom_study": "Sabiduría y Estudio",
        "wisdom_study_desc": "Desbloquear sabiduría, progreso académico y éxito en exámenes",
        "inner_peace": "Paz Interior",
        "inner_peace_desc": "Calmar la mente, eliminar preocupaciones, lograr tranquilidad interior"
    },
    "it": {
        "zodiac_guardians": "Guardiani dello Zodiaco",
        "zodiac_guardians_desc": "Artefatti guardiani dello zodiaco esclusivi basati sul tuo anno di nascita",
        "sun_sign_guardians": "Guardiani del Segno Solare",
        "sun_sign_guardians_desc": "Guardiani per la tua personalità esteriore e direzione di vita basati sulla tua data di nascita",
        "moon_sign_guardians": "Guardiani del Segno Lunare",
        "moon_sign_guardians_desc": "Guardiani per il tuo mondo emotivo e bisogni interiori, rafforzando l'energia emotiva",
        "wealth_fortune": "Ricchezza e Fortuna",
        "wealth_fortune_desc": "Stimolare lo sviluppo della carriera, attrarre ricchezza e prosperità",
        "health_safety": "Salute e Sicurezza",
        "health_safety_desc": "Allontanare malattie e disastri, garantire pace e salute",
        "wisdom_study": "Saggezza e Studio",
        "wisdom_study_desc": "Sbloccare la saggezza, progresso accademico e successo negli esami",
        "inner_peace": "Pace Interiore",
        "inner_peace_desc": "Calmare la mente, eliminare le preoccupazioni, raggiungere la tranquillità interiore"
    },
    "pt": {
        "zodiac_guardians": "Guardiões do Zodíaco",
        "zodiac_guardians_desc": "Artefatos guardiões do zodíaco exclusivos baseados no seu ano de nascimento",
        "sun_sign_guardians": "Guardiões do Signo Solar",
        "sun_sign_guardians_desc": "Guardiões para sua personalidade exterior e direção de vida baseados na sua data de nascimento",
        "moon_sign_guardians": "Guardiões do Signo Lunar",
        "moon_sign_guardians_desc": "Guardiões para seu mundo emocional e necessidades internas, fortalecendo a energia emocional",
        "wealth_fortune": "Riqueza e Fortuna",
        "wealth_fortune_desc": "Impulsionar o desenvolvimento da carreira, atrair riqueza e prosperidade",
        "health_safety": "Saúde e Segurança",
        "health_safety_desc": "Afastar doenças e desastres, garantir paz e saúde",
        "wisdom_study": "Sabedoria e Estudo",
        "wisdom_study_desc": "Desbloquear sabedoria, progresso acadêmico e sucesso em exames",
        "inner_peace": "Paz Interior",
        "inner_peace_desc": "Acalmar a mente, eliminar preocupações, alcançar tranquilidade interior"
    },
    "ru": {
        "zodiac_guardians": "Хранители Зодиака",
        "zodiac_guardians_desc": "Эксклюзивные артефакты-хранители зодиака на основе вашего года рождения",
        "sun_sign_guardians": "Хранители Солнечного Знака",
        "sun_sign_guardians_desc": "Хранители вашей внешней личности и жизненного направления на основе вашей даты рождения",
        "moon_sign_guardians": "Хранители Лунного Знака",
        "moon_sign_guardians_desc": "Хранители вашего эмоционального мира и внутренних потребностей, усиливающие эмоциональную энергию",
        "wealth_fortune": "Богатство и Удача",
        "wealth_fortune_desc": "Стимулировать развитие карьеры, привлекать богатство и процветание",
        "health_safety": "Здоровье и Безопасность",
        "health_safety_desc": "Отгонять болезни и бедствия, обеспечивать мир и здоровье",
        "wisdom_study": "Мудрость и Учеба",
        "wisdom_study_desc": "Разблокировать мудрость, академический прогресс и успех на экзаменах",
        "inner_peace": "Внутренний Покой",
        "inner_peace_desc": "Успокоить разум, устранить беспокойства, достичь внутреннего спокойствия"
    },
    "ja": {
        "zodiac_guardians": "十二支の守護者",
        "zodiac_guardians_desc": "生まれ年に基づく専属の十二支守護アーティファクト",
        "sun_sign_guardians": "太陽星座の守護者",
        "sun_sign_guardians_desc": "生年月日に基づく外向的な性格と人生の方向性の守護者",
        "moon_sign_guardians": "月星座の守護者",
        "moon_sign_guardians_desc": "感情の世界と内なるニーズの守護者、感情エネルギーを強化",
        "wealth_fortune": "財運と幸運",
        "wealth_fortune_desc": "キャリア開発を促進し、富と繁栄を引き寄せる",
        "health_safety": "健康と安全",
        "health_safety_desc": "病気や災害を遠ざけ、平和と健康を確保",
        "wisdom_study": "知恵と学業",
        "wisdom_study_desc": "知恵を解き放ち、学業の進歩と試験の成功",
        "inner_peace": "内なる平和",
        "inner_peace_desc": "心を落ち着かせ、悩みを取り除き、内なる静けさを達成"
    },
    "ko": {
        "zodiac_guardians": "십이지 수호자",
        "zodiac_guardians_desc": "출생 연도를 기반으로 한 전용 십이지 수호 유물",
        "sun_sign_guardians": "태양 별자리 수호자",
        "sun_sign_guardians_desc": "생년월일을 기반으로 한 외향적 성격과 인생 방향의 수호자",
        "moon_sign_guardians": "달 별자리 수호자",
        "moon_sign_guardians_desc": "감정 세계와 내면의 필요를 위한 수호자, 감정 에너지 강화",
        "wealth_fortune": "재물과 행운",
        "wealth_fortune_desc": "경력 개발 촉진, 부와 번영 유치",
        "health_safety": "건강과 안전",
        "health_safety_desc": "질병과 재난을 물리치고 평화와 건강 보장",
        "wisdom_study": "지혜와 학업",
        "wisdom_study_desc": "지혜를 열고 학업 진보와 시험 성공",
        "inner_peace": "내면의 평화",
        "inner_peace_desc": "마음을 진정시키고 걱정을 없애고 내면의 평온함 달성"
    },
    "ar": {
        "zodiac_guardians": "حراس الأبراج",
        "zodiac_guardians_desc": "قطع أثرية حصرية لحراس الأبراج بناءً على سنة ميلادك",
        "sun_sign_guardians": "حراس البرج الشمسي",
        "sun_sign_guardians_desc": "حراس لشخصيتك الخارجية واتجاه حياتك بناءً على تاريخ ميلادك",
        "moon_sign_guardians": "حراس البرج القمري",
        "moon_sign_guardians_desc": "حراس لعالمك العاطفي واحتياجاتك الداخلية، تعزيز الطاقة العاطفية",
        "wealth_fortune": "الثروة والحظ",
        "wealth_fortune_desc": "تعزيز التطور المهني، جذب الثروة والازدهار",
        "health_safety": "الصحة والسلامة",
        "health_safety_desc": "صد الأمراض والكوارث، ضمان السلام والصحة",
        "wisdom_study": "الحكمة والدراسة",
        "wisdom_study_desc": "فتح الحكمة، التقدم الأكاديمي والنجاح في الامتحانات",
        "inner_peace": "السلام الداخلي",
        "inner_peace_desc": "تهدئة العقل، إزالة القلق، تحقيق الهدوء الداخلي"
    },
    "hi": {
        "zodiac_guardians": "राशि संरक्षक",
        "zodiac_guardians_desc": "आपके जन्म वर्ष के आधार पर विशेष राशि संरक्षक कलाकृतियाँ",
        "sun_sign_guardians": "सूर्य राशि संरक्षक",
        "sun_sign_guardians_desc": "आपकी जन्म तिथि के आधार पर आपके बाहरी व्यक्तित्व और जीवन दिशा के संरक्षक",
        "moon_sign_guardians": "चंद्र राशि संरक्षक",
        "moon_sign_guardians_desc": "आपकी भावनात्मक दुनिया और आंतरिक जरूरतों के संरक्षक, भावनात्मक ऊर्जा को मजबूत करना",
        "wealth_fortune": "धन और भाग्य",
        "wealth_fortune_desc": "करियर विकास को बढ़ावा देना, धन और समृद्धि को आकर्षित करना",
        "health_safety": "स्वास्थ्य और सुरक्षा",
        "health_safety_desc": "बीमारियों और आपदाओं को दूर करना, शांति और स्वास्थ्य सुनिश्चित करना",
        "wisdom_study": "ज्ञान और अध्ययन",
        "wisdom_study_desc": "ज्ञान को अनलॉक करना, शैक्षणिक प्रगति और परीक्षा सफलता",
        "inner_peace": "आंतरिक शांति",
        "inner_peace_desc": "मन को शांत करना, चिंताओं को दूर करना, आंतरिक शांति प्राप्त करना"
    },
    "th": {
        "zodiac_guardians": "ผู้พิทักษ์ราศี",
        "zodiac_guardians_desc": "สิ่งประดิษฐ์ผู้พิทักษ์ราศีพิเศษตามปีเกิดของคุณ",
        "sun_sign_guardians": "ผู้พิทักษ์ราศีดวงอาทิตย์",
        "sun_sign_guardians_desc": "ผู้พิทักษ์บุคลิกภาพภายนอกและทิศทางชีวิตของคุณตามวันเกิดของคุณ",
        "moon_sign_guardians": "ผู้พิทักษ์ราศีดวงจันทร์",
        "moon_sign_guardians_desc": "ผู้พิทักษ์โลกอารมณ์และความต้องการภายในของคุณ เสริมพลังอารมณ์",
        "wealth_fortune": "ความมั่งคั่งและโชคลาภ",
        "wealth_fortune_desc": "ส่งเสริมการพัฒนาอาชีพ ดึงดูดความมั่งคั่งและความเจริญรุ่งเรือง",
        "health_safety": "สุขภาพและความปลอดภัย",
        "health_safety_desc": "ขับไล่โรคภัยและภัยพิบัติ รับประกันความสงบและสุขภาพ",
        "wisdom_study": "ปัญญาและการศึกษา",
        "wisdom_study_desc": "ปลดล็อกปัญญา ความก้าวหน้าทางวิชาการและความสำเร็จในการสอบ",
        "inner_peace": "ความสงบภายใน",
        "inner_peace_desc": "สงบจิตใจ กำจัดความกังวล บรรลุความสงบภายใน"
    },
    "vi": {
        "zodiac_guardians": "Người Bảo Vệ Cung Hoàng Đạo",
        "zodiac_guardians_desc": "Hiện vật bảo vệ cung hoàng đạo độc quyền dựa trên năm sinh của bạn",
        "sun_sign_guardians": "Người Bảo Vệ Cung Mặt Trời",
        "sun_sign_guardians_desc": "Người bảo vệ tính cách bên ngoài và hướng đi cuộc sống của bạn dựa trên ngày sinh",
        "moon_sign_guardians": "Người Bảo Vệ Cung Mặt Trăng",
        "moon_sign_guardians_desc": "Người bảo vệ thế giới cảm xúc và nhu cầu nội tâm của bạn, tăng cường năng lượng cảm xúc",
        "wealth_fortune": "Tài Lộc và Vận May",
        "wealth_fortune_desc": "Thúc đẩy phát triển sự nghiệp, thu hút tài lộc và thịnh vượng",
        "health_safety": "Sức Khỏe và An Toàn",
        "health_safety_desc": "Xua đuổi bệnh tật và tai họa, đảm bảo bình an và sức khỏe",
        "wisdom_study": "Trí Tuệ và Học Tập",
        "wisdom_study_desc": "Mở khóa trí tuệ, tiến bộ học tập và thành công trong kỳ thi",
        "inner_peace": "Bình An Nội Tâm",
        "inner_peace_desc": "Xoa dịu tâm trí, loại bỏ lo lắng, đạt được sự thanh thản nội tâm"
    },
    "id": {
        "zodiac_guardians": "Penjaga Zodiak",
        "zodiac_guardians_desc": "Artefak penjaga zodiak eksklusif berdasarkan tahun kelahiran Anda",
        "sun_sign_guardians": "Penjaga Tanda Matahari",
        "sun_sign_guardians_desc": "Penjaga kepribadian luar dan arah hidup Anda berdasarkan tanggal lahir Anda",
        "moon_sign_guardians": "Penjaga Tanda Bulan",
        "moon_sign_guardians_desc": "Penjaga dunia emosional dan kebutuhan batin Anda, memperkuat energi emosional",
        "wealth_fortune": "Kekayaan & Keberuntungan",
        "wealth_fortune_desc": "Mendorong pengembangan karir, menarik kekayaan dan kemakmuran",
        "health_safety": "Kesehatan & Keamanan",
        "health_safety_desc": "Menangkal penyakit dan bencana, memastikan kedamaian dan kesehatan",
        "wisdom_study": "Kebijaksanaan & Studi",
        "wisdom_study_desc": "Membuka kebijaksanaan, kemajuan akademis dan kesuksesan ujian",
        "inner_peace": "Kedamaian Batin",
        "inner_peace_desc": "Menenangkan pikiran, menghilangkan kekhawatiran, mencapai ketenangan batin"
    }
}

# 更新所有语言文件
for lang, trans in translations.items():
    file_path = f"client/src/i18n/locales/{lang}.json"
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # 添加新的分类翻译
        if "categories" not in data:
            data["categories"] = {}
        
        data["categories"].update(trans)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"✓ Updated {lang}.json")
    except Exception as e:
        print(f"✗ Error updating {lang}.json: {e}")

print("\n✓ All translation files updated!")
