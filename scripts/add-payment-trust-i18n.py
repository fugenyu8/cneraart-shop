#!/usr/bin/env python3
"""
为结算页信任引导卡片添加多语言翻译键
从外部 JSON 文件读取翻译内容，避免 Python 源码中的多语言字符问题
"""
import json
import os

LOCALES_DIR = "client/src/i18n/locales"
TRANSLATIONS_FILE = "scripts/payment-trust-translations.json"

NEW_KEYS = [
    "direct_payment_title",
    "direct_payment_desc",
    "direct_discount_text",
    "sacred_vow_title",
    "sacred_vow_desc",
]

def update_locale(lang_code, translations):
    filepath = os.path.join(LOCALES_DIR, f"{lang_code}.json")
    if not os.path.exists(filepath):
        print(f"  WARNING: File not found: {filepath}")
        return False

    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)

    if "checkout" not in data:
        print(f"  WARNING: No 'checkout' key in {lang_code}.json")
        return False

    lang_translations = translations.get(lang_code, translations.get("en", {}))
    for key in NEW_KEYS:
        if key in lang_translations:
            data["checkout"][key] = lang_translations[key]

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"  OK {lang_code}: {len(NEW_KEYS)} keys updated")
    return True

if __name__ == "__main__":
    with open(TRANSLATIONS_FILE, "r", encoding="utf-8") as f:
        translations = json.load(f)

    langs = list(translations.keys())
    print(f"Updating {len(langs)} language files...")
    success = 0
    for lang in langs:
        if update_locale(lang, translations):
            success += 1
    print(f"\nDone: {success}/{len(langs)} files updated.")
