import json
import os

locales_dir = "client/src/i18n/locales"

# "客户服务" in all languages
translations = {
    "zh.json": "客户服务",
    "zh-Hant.json": "客戶服務",
    "en.json": "Customer Service",
    "de.json": "Kundendienst",
    "fr.json": "Service Client",
    "es.json": "Servicio al Cliente",
    "it.json": "Servizio Clienti",
    "pt.json": "Atendimento ao Cliente",
    "ru.json": "Служба Поддержки",
    "ja.json": "カスタマーサービス",
    "ko.json": "고객 서비스",
    "ar.json": "خدمة العملاء",
    "hi.json": "ग्राहक सेवा",
    "th.json": "บริการลูกค้า",
    "vi.json": "Dịch Vụ Khách Hàng",
    "id.json": "Layanan Pelanggan",
    "tr.json": "Customer Service",
}

for filename, value in translations.items():
    filepath = os.path.join(locales_dir, filename)
    if not os.path.exists(filepath):
        print(f"SKIP: {filename} not found")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    if "common" not in data:
        data["common"] = {}
    
    old_value = data["common"].get("service", "NOT SET")
    data["common"]["service"] = value
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write('\n')
    
    print(f"OK: {filename}: '{old_value}' -> '{value}'")

print("\nDone! All files updated.")
