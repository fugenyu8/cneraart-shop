import { useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle2, Loader2, Image as ImageIcon, X, MessageCircle, Clock, Sparkles } from "lucide-react";

const WHATSAPP_NUMBER = "8618310686772";

interface PaymentProofUploadProps {
  orderId: number;
  orderNumber: string;
  paymentMethod?: string;
  customerNote?: string;
}

export function PaymentProofUpload({ orderId, orderNumber, paymentMethod, customerNote }: PaymentProofUploadProps) {
  const { t } = useTranslation();
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [uploaded, setUploaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = trpc.orders.uploadPaymentProof.useMutation({
    onSuccess: () => {
      setUploaded(true);
      toast.success(t("checkout.proof_uploaded_success", "Payment proof uploaded!"));
    },
    onError: (err: any) => {
      toast.error(err.message || t("checkout.proof_upload_error", "Failed to upload proof."));
    },
  });

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error(t("checkout.proof_invalid_type", "Please upload an image file."));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error(t("checkout.proof_too_large", "File size must be under 10MB"));
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => { setPreview(e.target?.result as string); };
    reader.readAsDataURL(file);
  }, [t]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleUpload = () => {
    if (!preview) return;
    uploadMutation.mutate({
      orderId,
      imageBase64: preview,
      mimeType: preview.split(";")[0].split(":")[1] || "image/jpeg",
    });
  };

  const handleRemove = () => {
    setPreview(null);
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const buildWhatsAppMessage = () => {
    const method = paymentMethod === "wechat_pay" ? "WeChat Pay" :
                   paymentMethod === "alipay" ? "Alipay" :
                   paymentMethod === "bank_transfer" ? "Bank Transfer" : "Direct Payment";
    let msg = "Hello! I have completed payment for Order " + orderNumber + " via " + method + ". Please help confirm receipt.";
    if (customerNote && customerNote.trim()) {
      msg += "\n\n📝 My note: " + customerNote.trim();
    }
    msg += "\n\nThank you!";
    return encodeURIComponent(msg);
  };

  const whatsappUrl = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + buildWhatsAppMessage();

  if (uploaded) {
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-3 bg-green-900/30 border border-green-700/50 rounded-xl p-4">
          <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-300">
              {t("checkout.proof_uploaded_title", "Payment Proof Received")} ✓
            </p>
            <p className="text-xs text-green-400/80 mt-1">
              {t("checkout.proof_uploaded_desc", "Your payment screenshot has been submitted successfully.")}
            </p>
          </div>
        </div>

        <div className="bg-amber-950/40 border border-amber-700/30 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <p className="text-sm font-semibold text-amber-300">
              {t("checkout.ritual_notice_title", "Sacred Qi-Yun Ritual Arranged")}
            </p>
          </div>
          <p className="text-xs text-amber-400/80 leading-relaxed">
            {t("checkout.ritual_notice_desc", "Your dharma object has been scheduled for the Qi-Yun consecration ceremony at Wutai Mountain. Once the ritual is complete, your item will be dispatched immediately. 法物必达，功德圆满。")}
          </p>
          <div className="flex items-start gap-2 mt-2 bg-amber-900/20 rounded-lg p-2.5">
            <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-500/90 leading-relaxed">
              {t("checkout.reply_slow_notice", "Due to the high volume of devotees, our response time may be slower than usual. Please allow 1–2 business days for order confirmation. We appreciate your understanding and patience.")}
            </p>
          </div>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg, #25D366, #128C7E)", color: "white", boxShadow: "0 4px 15px rgba(37,211,102,0.25)" }}
        >
          <MessageCircle className="w-5 h-5" />
          {t("checkout.whatsapp_confirm", "Send Confirmation via WhatsApp")}
          <span className="text-xs opacity-80 ml-1">+86 183 1068 6772</span>
        </a>
        <p className="text-xs text-slate-500 text-center">
          {t("checkout.whatsapp_optional", "Optional — tap to send your order number directly to our team")}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-amber-700/40 bg-amber-950/20 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Upload className="w-4 h-4 text-amber-400 shrink-0" />
        <p className="text-sm font-semibold text-amber-300">
          {t("checkout.upload_proof_title", "Upload Payment Screenshot")}
        </p>
      </div>
      <p className="text-xs text-amber-400/70 leading-relaxed">
        {t("checkout.upload_proof_desc", "Please upload a screenshot of your completed payment. This helps us verify and process your order faster.")}
      </p>

      {!preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative cursor-pointer rounded-lg border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center gap-2 py-8 px-4 ${isDragging ? "border-amber-400 bg-amber-400/10" : "border-amber-700/50 hover:border-amber-500/70 hover:bg-amber-900/20"}`}
        >
          <ImageIcon className="w-8 h-8 text-amber-600" />
          <p className="text-sm text-amber-400 text-center">
            {t("checkout.upload_proof_drag", "Tap to select or drag & drop your screenshot here")}
          </p>
          <p className="text-xs text-amber-600">JPG, PNG, WEBP · Max 10MB</p>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative rounded-lg overflow-hidden border border-amber-700/40 bg-slate-900">
            <img src={preview} alt="Payment proof preview" className="w-full max-h-64 object-contain" />
            <button onClick={handleRemove} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-slate-800/90 hover:bg-red-900/80 flex items-center justify-center transition-colors" title="Remove">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
          <p className="text-xs text-slate-400 truncate">{fileName}</p>
          <Button onClick={handleUpload} disabled={uploadMutation.isPending} className="w-full h-11 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-semibold">
            {uploadMutation.isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" />{t("checkout.uploading_proof", "Uploading...")}</>
            ) : (
              <><Upload className="w-4 h-4 mr-2" />{t("checkout.submit_proof", "Submit Payment Proof")}</>
            )}
          </Button>
        </div>
      )}

      <div className="pt-1 border-t border-amber-800/30">
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-green-400/80 hover:text-green-300 transition-colors">
          <MessageCircle className="w-3.5 h-3.5" />
          {t("checkout.whatsapp_contact_instead", "Or contact us directly on WhatsApp: +86 183 1068 6772")}
        </a>
      </div>
    </div>
  );
}
