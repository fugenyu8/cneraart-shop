"""
使用 OpenAI API 批量翻译 i18n fallback key
"""
import json
import os
import sys
from openai import OpenAI

client = OpenAI()

LOCALES_DIR = os.path.join(os.path.dirname(__file__), "../client/src/i18n/locales")

LANG_NAMES = {
    "ar": "Arabic",
    "de": "German",
    "es": "Spanish",
    "fr": "French",
    "hi": "Hindi",
    "id": "Indonesian",
    "it": "Italian",
    "pt": "Portuguese (Brazilian)",
    "ru": "Russian",
    "th": "Thai",
    "tr": "Turkish",
    "vi": "Vietnamese",
}

def get_all_keys(obj, prefix=""):
    keys = {}
    for k, v in obj.items():
        full_key = f"{prefix}.{k}" if prefix else k
        if isinstance(v, dict):
            keys.update(get_all_keys(v, full_key))
        else:
            keys[full_key] = v
    return keys

def set_nested_value(obj, dot_path, value):
    parts = dot_path.split(".")
    current = obj
    for part in parts[:-1]:
        if part not in current:
            current[part] = {}
        current = current[part]
    current[parts[-1]] = value

def translate_batch(en_texts: dict, target_lang: str) -> dict:
    """使用 AI 翻译一批文本"""
    lang_name = LANG_NAMES.get(target_lang, target_lang)
    
    # 构建翻译请求
    texts_json = json.dumps(en_texts, ensure_ascii=False, indent=2)
    
    prompt = f"""Translate the following JSON key-value pairs from English to {lang_name}.
This is for a spiritual/cultural e-commerce website about Chinese traditional wisdom, Wutai Mountain Buddhist services, feng shui, palm reading, and face reading.

Important rules:
1. Keep all {{{{variable}}}} placeholders exactly as they are (e.g., {{{{count}}}})
2. Translate naturally and professionally for the target language
3. Keep the same JSON structure with same keys
4. For Buddhist/spiritual terms, use culturally appropriate translations
5. Return ONLY valid JSON, no explanation

English texts to translate:
{texts_json}"""

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": f"You are a professional translator specializing in {lang_name}. Return only valid JSON."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3,
        max_tokens=4000,
    )
    
    result_text = response.choices[0].message.content.strip()
    # 清理可能的 markdown 代码块
    if result_text.startswith("```"):
        result_text = result_text.split("\n", 1)[1]
        if result_text.endswith("```"):
            result_text = result_text[:-3].strip()
    
    return json.loads(result_text)

def main():
    # 读取英文文件
    with open(os.path.join(LOCALES_DIR, "en.json"), "r") as f:
        en = json.load(f)
    en_flat = get_all_keys(en)
    
    for lang in LANG_NAMES:
        filepath = os.path.join(LOCALES_DIR, f"{lang}.json")
        with open(filepath, "r") as f:
            data = json.load(f)
        
        lang_flat = get_all_keys(data)
        
        # 找出使用了英文 fallback 的 key（值与英文完全相同的）
        fallback_keys = {}
        for key, value in lang_flat.items():
            en_value = en_flat.get(key, "")
            if value == en_value and en_value:
                # 跳过产品名称和描述（这些保持英文）
                if key.startswith("products.") and (".name" in key or ".description" in key or ".shortDesc" in key):
                    continue
                fallback_keys[key] = en_value
        
        if not fallback_keys:
            print(f"✅ {lang}: 无需翻译")
            continue
        
        print(f"🔄 {lang} ({LANG_NAMES[lang]}): 翻译 {len(fallback_keys)} 个 key...", end=" ", flush=True)
        
        try:
            # 分批翻译（每批最多 50 个）
            keys_list = list(fallback_keys.items())
            all_translated = {}
            
            for i in range(0, len(keys_list), 50):
                batch = dict(keys_list[i:i+50])
                translated = translate_batch(batch, lang)
                all_translated.update(translated)
            
            # 写入翻译结果
            for key, value in all_translated.items():
                set_nested_value(data, key, value)
            
            with open(filepath, "w") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
                f.write("\n")
            
            print(f"✅ 完成 ({len(all_translated)} 个)")
        except Exception as e:
            print(f"❌ 错误: {e}")

if __name__ == "__main__":
    main()
