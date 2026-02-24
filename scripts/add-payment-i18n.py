#!/usr/bin/env python3
"""为所有语言文件添加新的支付方式相关翻译 key"""

import json
import os
from pathlib import Path

LOCALES_DIR = Path("/home/ubuntu/cneraart-shop/client/src/i18n/locales")

# 新增的 checkout key（以中文为基准）
NEW_KEYS = {
    "zh": {
        "checkout.bank_transfer": "银行转账",
        "checkout.bank_transfer_desc": "SWIFT/TT 国际电汇",
        "checkout.alipay": "支付宝",
        "checkout.alipay_desc": "支付宝转账付款",
        "checkout.paypal_desc": "PayPal 在线支付",
        "checkout.copied": "已复制",
        "checkout.copy": "复制",
        "checkout.bank_transfer_notice": "请通过 SWIFT(T/T) 电汇至以下账户",
        "checkout.bank_transfer_notice_desc": "转账完成后，我们将在 1-2 个工作日内确认到账并处理您的订单。",
        "checkout.transfer_amount": "转账金额",
        "checkout.account_number": "账户号码",
        "checkout.account_name": "账户名称",
        "checkout.bank_name": "银行名称",
        "checkout.bank_address": "银行地址",
        "checkout.country_region": "国家/地区",
        "checkout.account_type": "账户类型",
        "checkout.bank_code": "银行代码",
        "checkout.branch_code": "分行代码",
        "checkout.payment_memo": "付款备注（必填）",
        "checkout.memo_format_hint": "请在汇款时备注此订单号，以便我们快速确认您的付款。",
        "checkout.swift_remark": "仅支持 SWIFT(电汇/TT) 和香港本地 CHATS/ACH 网络收款",
        "checkout.alipay_notice": "请转账至以下支付宝账户",
        "checkout.alipay_notice_desc": "转账完成后，我们将在 24 小时内确认到账并处理您的订单。",
        "checkout.alipay_account": "支付宝账号",
        "checkout.alipay_steps_title": "操作步骤：",
        "checkout.alipay_step1": "打开支付宝，选择「转账」",
        "checkout.alipay_step2": "输入上方账号和转账金额，备注中填写订单号",
        "checkout.alipay_step3": "转账完成后，请耐心等待确认",
        "checkout.creating_order": "创建订单中...",
        "checkout.confirm_and_view_bank_info": "确认订单并查看汇款信息",
        "checkout.confirm_and_view_alipay_info": "确认订单并查看支付宝信息",
        "checkout.order_created_pending": "订单已创建，请按照以下信息完成付款",
        "checkout.order_created_transfer_info": "订单已创建！请按照以下信息完成银行转账。",
        "checkout.order_created_alipay_info": "订单已创建！请按照以下信息完成支付宝转账。",
        "checkout.view_order_detail": "查看订单详情",
        "checkout.secure_payment": "所有支付信息均受加密保护",
        "checkout.payment_error": "支付失败，请重试",
        "checkout.credit_card": "银行卡",
        "checkout.card_desc": "信用卡/借记卡支付",
        "checkout.pay_with_card": "银行卡支付",
        "checkout.pay_with_alipay": "支付宝支付",
        "checkout.proceed_to_payment": "进入支付",
    },
    "zh-Hant": {
        "checkout.bank_transfer": "銀行轉帳",
        "checkout.bank_transfer_desc": "SWIFT/TT 國際電匯",
        "checkout.alipay": "支付寶",
        "checkout.alipay_desc": "支付寶轉帳付款",
        "checkout.paypal_desc": "PayPal 線上支付",
        "checkout.copied": "已複製",
        "checkout.copy": "複製",
        "checkout.bank_transfer_notice": "請透過 SWIFT(T/T) 電匯至以下帳戶",
        "checkout.bank_transfer_notice_desc": "轉帳完成後，我們將在 1-2 個工作日內確認到帳並處理您的訂單。",
        "checkout.transfer_amount": "轉帳金額",
        "checkout.account_number": "帳戶號碼",
        "checkout.account_name": "帳戶名稱",
        "checkout.bank_name": "銀行名稱",
        "checkout.bank_address": "銀行地址",
        "checkout.country_region": "國家/地區",
        "checkout.account_type": "帳戶類型",
        "checkout.bank_code": "銀行代碼",
        "checkout.branch_code": "分行代碼",
        "checkout.payment_memo": "付款備註（必填）",
        "checkout.memo_format_hint": "請在匯款時備註此訂單號，以便我們快速確認您的付款。",
        "checkout.swift_remark": "僅支持 SWIFT(電匯/TT) 和香港本地 CHATS/ACH 網路收款",
        "checkout.alipay_notice": "請轉帳至以下支付寶帳戶",
        "checkout.alipay_notice_desc": "轉帳完成後，我們將在 24 小時內確認到帳並處理您的訂單。",
        "checkout.alipay_account": "支付寶帳號",
        "checkout.alipay_steps_title": "操作步驟：",
        "checkout.alipay_step1": "打開支付寶，選擇「轉帳」",
        "checkout.alipay_step2": "輸入上方帳號和轉帳金額，備註中填寫訂單號",
        "checkout.alipay_step3": "轉帳完成後，請耐心等待確認",
        "checkout.creating_order": "建立訂單中...",
        "checkout.confirm_and_view_bank_info": "確認訂單並查看匯款資訊",
        "checkout.confirm_and_view_alipay_info": "確認訂單並查看支付寶資訊",
        "checkout.order_created_pending": "訂單已建立，請按照以下資訊完成付款",
        "checkout.order_created_transfer_info": "訂單已建立！請按照以下資訊完成銀行轉帳。",
        "checkout.order_created_alipay_info": "訂單已建立！請按照以下資訊完成支付寶轉帳。",
        "checkout.view_order_detail": "查看訂單詳情",
        "checkout.secure_payment": "所有支付資訊均受加密保護",
        "checkout.payment_error": "支付失敗，請重試",
        "checkout.credit_card": "銀行卡",
        "checkout.card_desc": "信用卡/簽帳卡支付",
        "checkout.pay_with_card": "銀行卡支付",
        "checkout.pay_with_alipay": "支付寶支付",
        "checkout.proceed_to_payment": "進入支付",
    },
    "en": {
        "checkout.bank_transfer": "Bank Transfer",
        "checkout.bank_transfer_desc": "SWIFT/TT Wire Transfer",
        "checkout.alipay": "Alipay",
        "checkout.alipay_desc": "Alipay Transfer",
        "checkout.paypal_desc": "PayPal Online Payment",
        "checkout.copied": "Copied",
        "checkout.copy": "Copy",
        "checkout.bank_transfer_notice": "Please wire transfer via SWIFT(T/T) to the following account",
        "checkout.bank_transfer_notice_desc": "After the transfer is completed, we will confirm receipt within 1-2 business days and process your order.",
        "checkout.transfer_amount": "Transfer Amount",
        "checkout.account_number": "Account Number",
        "checkout.account_name": "Account Name",
        "checkout.bank_name": "Bank Name",
        "checkout.bank_address": "Bank Address",
        "checkout.country_region": "Country/Region",
        "checkout.account_type": "Account Type",
        "checkout.bank_code": "Bank Code",
        "checkout.branch_code": "Branch Code",
        "checkout.payment_memo": "Payment Memo (Required)",
        "checkout.memo_format_hint": "Please include this order number in the transfer memo for quick payment confirmation.",
        "checkout.swift_remark": "Only supports SWIFT (Wire/TT) and Hong Kong local CHATS/ACH network payments",
        "checkout.alipay_notice": "Please transfer to the following Alipay account",
        "checkout.alipay_notice_desc": "After the transfer is completed, we will confirm receipt within 24 hours and process your order.",
        "checkout.alipay_account": "Alipay Account",
        "checkout.alipay_steps_title": "Steps:",
        "checkout.alipay_step1": "Open Alipay and select 'Transfer'",
        "checkout.alipay_step2": "Enter the account number and amount above, include the order number in the memo",
        "checkout.alipay_step3": "After the transfer, please wait for confirmation",
        "checkout.creating_order": "Creating order...",
        "checkout.confirm_and_view_bank_info": "Confirm Order & View Bank Info",
        "checkout.confirm_and_view_alipay_info": "Confirm Order & View Alipay Info",
        "checkout.order_created_pending": "Order created. Please complete payment using the information below.",
        "checkout.order_created_transfer_info": "Order created! Please complete the bank transfer using the information below.",
        "checkout.order_created_alipay_info": "Order created! Please complete the Alipay transfer using the information below.",
        "checkout.view_order_detail": "View Order Details",
        "checkout.secure_payment": "All payment information is encrypted and secure",
        "checkout.payment_error": "Payment failed, please try again",
        "checkout.credit_card": "Credit Card",
        "checkout.card_desc": "Credit/Debit Card Payment",
        "checkout.pay_with_card": "Pay with Card",
        "checkout.pay_with_alipay": "Pay with Alipay",
        "checkout.proceed_to_payment": "Proceed to Payment",
    },
    "ja": {
        "checkout.bank_transfer": "銀行振込",
        "checkout.bank_transfer_desc": "SWIFT/TT 国際送金",
        "checkout.alipay": "アリペイ",
        "checkout.alipay_desc": "アリペイ送金",
        "checkout.paypal_desc": "PayPal オンライン決済",
        "checkout.copied": "コピーしました",
        "checkout.copy": "コピー",
        "checkout.bank_transfer_notice": "以下の口座にSWIFT(T/T)で送金してください",
        "checkout.bank_transfer_notice_desc": "送金完了後、1〜2営業日以内に入金を確認し、ご注文を処理いたします。",
        "checkout.transfer_amount": "送金金額",
        "checkout.account_number": "口座番号",
        "checkout.account_name": "口座名義",
        "checkout.bank_name": "銀行名",
        "checkout.bank_address": "銀行住所",
        "checkout.country_region": "国/地域",
        "checkout.account_type": "口座種別",
        "checkout.bank_code": "銀行コード",
        "checkout.branch_code": "支店コード",
        "checkout.payment_memo": "振込備考（必須）",
        "checkout.memo_format_hint": "迅速な入金確認のため、送金時にこの注文番号を備考に記載してください。",
        "checkout.swift_remark": "SWIFT(電信送金/TT)および香港ローカルCHATS/ACHネットワークのみ対応",
        "checkout.alipay_notice": "以下のアリペイアカウントに送金してください",
        "checkout.alipay_notice_desc": "送金完了後、24時間以内に入金を確認し、ご注文を処理いたします。",
        "checkout.alipay_account": "アリペイアカウント",
        "checkout.alipay_steps_title": "操作手順：",
        "checkout.alipay_step1": "アリペイを開き、「送金」を選択",
        "checkout.alipay_step2": "上記のアカウント番号と金額を入力し、備考に注文番号を記入",
        "checkout.alipay_step3": "送金完了後、確認をお待ちください",
        "checkout.creating_order": "注文作成中...",
        "checkout.confirm_and_view_bank_info": "注文確定して振込情報を表示",
        "checkout.confirm_and_view_alipay_info": "注文確定してアリペイ情報を表示",
        "checkout.order_created_pending": "注文が作成されました。以下の情報に従ってお支払いください。",
        "checkout.order_created_transfer_info": "注文が作成されました！以下の情報に従って銀行振込を完了してください。",
        "checkout.order_created_alipay_info": "注文が作成されました！以下の情報に従ってアリペイ送金を完了してください。",
        "checkout.view_order_detail": "注文詳細を見る",
        "checkout.secure_payment": "すべての決済情報は暗号化で保護されています",
        "checkout.payment_error": "決済に失敗しました。もう一度お試しください",
        "checkout.credit_card": "クレジットカード",
        "checkout.card_desc": "クレジット/デビットカード決済",
        "checkout.pay_with_card": "カードで支払う",
        "checkout.pay_with_alipay": "アリペイで支払う",
        "checkout.proceed_to_payment": "支払いに進む",
    },
    "ko": {
        "checkout.bank_transfer": "은행 송금",
        "checkout.bank_transfer_desc": "SWIFT/TT 국제 송금",
        "checkout.alipay": "알리페이",
        "checkout.alipay_desc": "알리페이 송금",
        "checkout.paypal_desc": "PayPal 온라인 결제",
        "checkout.copied": "복사됨",
        "checkout.copy": "복사",
        "checkout.bank_transfer_notice": "아래 계좌로 SWIFT(T/T) 송금해 주세요",
        "checkout.bank_transfer_notice_desc": "송금 완료 후 1-2 영업일 이내에 입금을 확인하고 주문을 처리합니다.",
        "checkout.transfer_amount": "송금 금액",
        "checkout.account_number": "계좌번호",
        "checkout.account_name": "예금주",
        "checkout.bank_name": "은행명",
        "checkout.bank_address": "은행 주소",
        "checkout.country_region": "국가/지역",
        "checkout.account_type": "계좌 유형",
        "checkout.bank_code": "은행 코드",
        "checkout.branch_code": "지점 코드",
        "checkout.payment_memo": "입금 메모 (필수)",
        "checkout.memo_format_hint": "빠른 입금 확인을 위해 송금 시 이 주문번호를 메모에 기재해 주세요.",
        "checkout.swift_remark": "SWIFT(전신송금/TT) 및 홍콩 현지 CHATS/ACH 네트워크만 지원",
        "checkout.alipay_notice": "아래 알리페이 계정으로 송금해 주세요",
        "checkout.alipay_notice_desc": "송금 완료 후 24시간 이내에 입금을 확인하고 주문을 처리합니다.",
        "checkout.alipay_account": "알리페이 계정",
        "checkout.alipay_steps_title": "이용 방법:",
        "checkout.alipay_step1": "알리페이를 열고 '송금'을 선택",
        "checkout.alipay_step2": "위 계좌번호와 금액을 입력하고 메모에 주문번호 기재",
        "checkout.alipay_step3": "송금 완료 후 확인을 기다려 주세요",
        "checkout.creating_order": "주문 생성 중...",
        "checkout.confirm_and_view_bank_info": "주문 확인 및 송금 정보 보기",
        "checkout.confirm_and_view_alipay_info": "주문 확인 및 알리페이 정보 보기",
        "checkout.order_created_pending": "주문이 생성되었습니다. 아래 정보에 따라 결제를 완료해 주세요.",
        "checkout.order_created_transfer_info": "주문이 생성되었습니다! 아래 정보에 따라 은행 송금을 완료해 주세요.",
        "checkout.order_created_alipay_info": "주문이 생성되었습니다! 아래 정보에 따라 알리페이 송금을 완료해 주세요.",
        "checkout.view_order_detail": "주문 상세 보기",
        "checkout.secure_payment": "모든 결제 정보는 암호화로 보호됩니다",
        "checkout.payment_error": "결제 실패, 다시 시도해 주세요",
        "checkout.credit_card": "신용카드",
        "checkout.card_desc": "신용카드/체크카드 결제",
        "checkout.pay_with_card": "카드로 결제",
        "checkout.pay_with_alipay": "알리페이로 결제",
        "checkout.proceed_to_payment": "결제 진행",
    },
}

# 其他语言使用英文作为基础
OTHER_LANGS = {
    "de": {
        "checkout.bank_transfer": "Banküberweisung",
        "checkout.bank_transfer_desc": "SWIFT/TT Internationale Überweisung",
        "checkout.alipay": "Alipay",
        "checkout.alipay_desc": "Alipay-Überweisung",
        "checkout.paypal_desc": "PayPal Online-Zahlung",
        "checkout.copied": "Kopiert",
        "checkout.copy": "Kopieren",
        "checkout.bank_transfer_notice": "Bitte überweisen Sie per SWIFT(T/T) auf folgendes Konto",
        "checkout.bank_transfer_notice_desc": "Nach Abschluss der Überweisung bestätigen wir den Eingang innerhalb von 1-2 Werktagen und bearbeiten Ihre Bestellung.",
        "checkout.transfer_amount": "Überweisungsbetrag",
        "checkout.account_number": "Kontonummer",
        "checkout.account_name": "Kontoinhaber",
        "checkout.bank_name": "Bankname",
        "checkout.bank_address": "Bankadresse",
        "checkout.country_region": "Land/Region",
        "checkout.account_type": "Kontotyp",
        "checkout.bank_code": "Bankleitzahl",
        "checkout.branch_code": "Filialnummer",
        "checkout.payment_memo": "Zahlungsvermerk (Pflichtfeld)",
        "checkout.memo_format_hint": "Bitte geben Sie diese Bestellnummer als Verwendungszweck an.",
        "checkout.swift_remark": "Nur SWIFT (Überweisung/TT) und Hongkong CHATS/ACH werden unterstützt",
        "checkout.alipay_notice": "Bitte überweisen Sie an folgendes Alipay-Konto",
        "checkout.alipay_notice_desc": "Nach der Überweisung bestätigen wir den Eingang innerhalb von 24 Stunden.",
        "checkout.alipay_account": "Alipay-Konto",
        "checkout.alipay_steps_title": "Anleitung:",
        "checkout.alipay_step1": "Öffnen Sie Alipay und wählen Sie 'Überweisen'",
        "checkout.alipay_step2": "Geben Sie Kontonummer und Betrag ein, Bestellnummer im Vermerk angeben",
        "checkout.alipay_step3": "Warten Sie nach der Überweisung auf die Bestätigung",
        "checkout.creating_order": "Bestellung wird erstellt...",
        "checkout.confirm_and_view_bank_info": "Bestellung bestätigen & Bankdaten anzeigen",
        "checkout.confirm_and_view_alipay_info": "Bestellung bestätigen & Alipay-Daten anzeigen",
        "checkout.order_created_pending": "Bestellung erstellt. Bitte zahlen Sie gemäß den folgenden Informationen.",
        "checkout.order_created_transfer_info": "Bestellung erstellt! Bitte führen Sie die Überweisung durch.",
        "checkout.order_created_alipay_info": "Bestellung erstellt! Bitte führen Sie die Alipay-Überweisung durch.",
        "checkout.view_order_detail": "Bestelldetails anzeigen",
        "checkout.secure_payment": "Alle Zahlungsinformationen sind verschlüsselt",
        "checkout.payment_error": "Zahlung fehlgeschlagen, bitte erneut versuchen",
        "checkout.credit_card": "Kreditkarte",
        "checkout.card_desc": "Kredit-/Debitkartenzahlung",
        "checkout.pay_with_card": "Mit Karte bezahlen",
        "checkout.pay_with_alipay": "Mit Alipay bezahlen",
        "checkout.proceed_to_payment": "Zur Zahlung",
    },
    "es": {
        "checkout.bank_transfer": "Transferencia Bancaria",
        "checkout.bank_transfer_desc": "Transferencia SWIFT/TT",
        "checkout.alipay": "Alipay",
        "checkout.alipay_desc": "Transferencia Alipay",
        "checkout.paypal_desc": "Pago en línea PayPal",
        "checkout.copied": "Copiado",
        "checkout.copy": "Copiar",
        "checkout.bank_transfer_notice": "Transfiera vía SWIFT(T/T) a la siguiente cuenta",
        "checkout.bank_transfer_notice_desc": "Confirmaremos la recepción en 1-2 días hábiles y procesaremos su pedido.",
        "checkout.transfer_amount": "Monto a transferir",
        "checkout.account_number": "Número de cuenta",
        "checkout.account_name": "Titular de la cuenta",
        "checkout.bank_name": "Nombre del banco",
        "checkout.bank_address": "Dirección del banco",
        "checkout.country_region": "País/Región",
        "checkout.account_type": "Tipo de cuenta",
        "checkout.bank_code": "Código bancario",
        "checkout.branch_code": "Código de sucursal",
        "checkout.payment_memo": "Nota de pago (obligatorio)",
        "checkout.memo_format_hint": "Incluya este número de pedido en la nota de transferencia.",
        "checkout.swift_remark": "Solo admite SWIFT (transferencia/TT) y red local CHATS/ACH de Hong Kong",
        "checkout.alipay_notice": "Transfiera a la siguiente cuenta de Alipay",
        "checkout.alipay_notice_desc": "Confirmaremos la recepción en 24 horas y procesaremos su pedido.",
        "checkout.alipay_account": "Cuenta Alipay",
        "checkout.alipay_steps_title": "Pasos:",
        "checkout.alipay_step1": "Abra Alipay y seleccione 'Transferir'",
        "checkout.alipay_step2": "Ingrese el número de cuenta y monto, incluya el número de pedido",
        "checkout.alipay_step3": "Espere la confirmación después de la transferencia",
        "checkout.creating_order": "Creando pedido...",
        "checkout.confirm_and_view_bank_info": "Confirmar pedido y ver datos bancarios",
        "checkout.confirm_and_view_alipay_info": "Confirmar pedido y ver datos de Alipay",
        "checkout.order_created_pending": "Pedido creado. Complete el pago según la información a continuación.",
        "checkout.order_created_transfer_info": "¡Pedido creado! Complete la transferencia bancaria.",
        "checkout.order_created_alipay_info": "¡Pedido creado! Complete la transferencia por Alipay.",
        "checkout.view_order_detail": "Ver detalles del pedido",
        "checkout.secure_payment": "Toda la información de pago está cifrada",
        "checkout.payment_error": "Pago fallido, intente de nuevo",
        "checkout.credit_card": "Tarjeta de crédito",
        "checkout.card_desc": "Pago con tarjeta de crédito/débito",
        "checkout.pay_with_card": "Pagar con tarjeta",
        "checkout.pay_with_alipay": "Pagar con Alipay",
        "checkout.proceed_to_payment": "Proceder al pago",
    },
    "fr": {
        "checkout.bank_transfer": "Virement bancaire",
        "checkout.bank_transfer_desc": "Virement SWIFT/TT",
        "checkout.alipay": "Alipay",
        "checkout.alipay_desc": "Virement Alipay",
        "checkout.paypal_desc": "Paiement en ligne PayPal",
        "checkout.copied": "Copié",
        "checkout.copy": "Copier",
        "checkout.bank_transfer_notice": "Veuillez effectuer un virement SWIFT(T/T) sur le compte suivant",
        "checkout.bank_transfer_notice_desc": "Nous confirmerons la réception sous 1-2 jours ouvrables et traiterons votre commande.",
        "checkout.transfer_amount": "Montant du virement",
        "checkout.account_number": "Numéro de compte",
        "checkout.account_name": "Titulaire du compte",
        "checkout.bank_name": "Nom de la banque",
        "checkout.bank_address": "Adresse de la banque",
        "checkout.country_region": "Pays/Région",
        "checkout.account_type": "Type de compte",
        "checkout.bank_code": "Code banque",
        "checkout.branch_code": "Code agence",
        "checkout.payment_memo": "Référence de paiement (obligatoire)",
        "checkout.memo_format_hint": "Veuillez inclure ce numéro de commande dans la référence du virement.",
        "checkout.swift_remark": "Uniquement SWIFT (virement/TT) et réseau local CHATS/ACH de Hong Kong",
        "checkout.alipay_notice": "Veuillez transférer sur le compte Alipay suivant",
        "checkout.alipay_notice_desc": "Nous confirmerons la réception sous 24 heures et traiterons votre commande.",
        "checkout.alipay_account": "Compte Alipay",
        "checkout.alipay_steps_title": "Étapes :",
        "checkout.alipay_step1": "Ouvrez Alipay et sélectionnez 'Transférer'",
        "checkout.alipay_step2": "Entrez le numéro de compte et le montant, incluez le numéro de commande",
        "checkout.alipay_step3": "Attendez la confirmation après le virement",
        "checkout.creating_order": "Création de la commande...",
        "checkout.confirm_and_view_bank_info": "Confirmer et voir les coordonnées bancaires",
        "checkout.confirm_and_view_alipay_info": "Confirmer et voir les infos Alipay",
        "checkout.order_created_pending": "Commande créée. Veuillez effectuer le paiement ci-dessous.",
        "checkout.order_created_transfer_info": "Commande créée ! Veuillez effectuer le virement bancaire.",
        "checkout.order_created_alipay_info": "Commande créée ! Veuillez effectuer le virement Alipay.",
        "checkout.view_order_detail": "Voir les détails de la commande",
        "checkout.secure_payment": "Toutes les informations de paiement sont chiffrées",
        "checkout.payment_error": "Échec du paiement, veuillez réessayer",
        "checkout.credit_card": "Carte bancaire",
        "checkout.card_desc": "Paiement par carte de crédit/débit",
        "checkout.pay_with_card": "Payer par carte",
        "checkout.pay_with_alipay": "Payer avec Alipay",
        "checkout.proceed_to_payment": "Procéder au paiement",
    },
}

# 对于其他语言，使用英文翻译作为 fallback
FALLBACK_LANGS = ["ar", "hi", "id", "it", "pt", "ru", "th", "tr", "vi"]


def set_nested(data, dotted_key, value):
    """设置嵌套字典的值，如 'checkout.bank_transfer' -> data['checkout']['bank_transfer']"""
    keys = dotted_key.split(".")
    d = data
    for k in keys[:-1]:
        if k not in d:
            d[k] = {}
        d = d[k]
    d[keys[-1]] = value


def main():
    # 处理主要语言
    all_langs = {**NEW_KEYS, **OTHER_LANGS}
    
    for lang, translations in all_langs.items():
        filepath = LOCALES_DIR / f"{lang}.json"
        if not filepath.exists():
            print(f"  [SKIP] {lang}.json not found")
            continue
        
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        added = 0
        for key, value in translations.items():
            keys = key.split(".")
            section = keys[0]
            field = keys[1]
            if section not in data:
                data[section] = {}
            if field not in data[section]:
                data[section][field] = value
                added += 1
        
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            f.write("\n")
        
        print(f"  [{lang}] Added {added} new keys")
    
    # 处理 fallback 语言（使用英文）
    en_translations = NEW_KEYS["en"]
    for lang in FALLBACK_LANGS:
        filepath = LOCALES_DIR / f"{lang}.json"
        if not filepath.exists():
            print(f"  [SKIP] {lang}.json not found")
            continue
        
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        added = 0
        for key, value in en_translations.items():
            keys = key.split(".")
            section = keys[0]
            field = keys[1]
            if section not in data:
                data[section] = {}
            if field not in data[section]:
                data[section][field] = value
                added += 1
        
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            f.write("\n")
        
        print(f"  [{lang}] Added {added} new keys (English fallback)")
    
    print("\nDone!")


if __name__ == "__main__":
    main()
