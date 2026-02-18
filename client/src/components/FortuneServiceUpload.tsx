import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface FortuneServiceUploadProps {
  serviceType: "face" | "palm" | "fengshui";
  onImagesChange: (images: File[]) => void;
  onQuestionChange: (question: string) => void;
}

/**
 * 命理服务图片上传组件
 * 用于面相、手相、风水服务的图片上传
 */
export default function FortuneServiceUpload({
  serviceType,
  onImagesChange,
  onQuestionChange,
}: FortuneServiceUploadProps) {
  const { t } = useTranslation();
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [question, setQuestion] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 根据服务类型确定最大图片数量
  const maxImages = serviceType === "fengshui" ? 10 : 5;
  const minImages = serviceType === "fengshui" ? 3 : 2;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (images.length + files.length > maxImages) {
      toast.error(t("fortuneUpload.maxImagesError", { max: maxImages }));
      return;
    }

    // 验证文件类型和大小
    const validFiles = files.filter(file => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name}: ${t("fortuneUpload.invalidFileType")}`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB
        toast.error(`${file.name}: ${t("fortuneUpload.fileTooLarge")}`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // 创建预览
    const newPreviews: string[] = [];
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string);
        if (newPreviews.length === validFiles.length) {
          const updatedImages = [...images, ...validFiles];
          const updatedPreviews = [...previews, ...newPreviews];
          setImages(updatedImages);
          setPreviews(updatedPreviews);
          onImagesChange(updatedImages);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setImages(updatedImages);
    setPreviews(updatedPreviews);
    onImagesChange(updatedImages);
    
    // 清空input以允许重新选择相同文件
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleQuestionChange = (value: string) => {
    setQuestion(value);
    onQuestionChange(value);
  };

  const getUploadGuidance = () => {
    switch (serviceType) {
      case "face":
        return t("fortuneUpload.faceGuidance");
      case "palm":
        return t("fortuneUpload.palmGuidance");
      case "fengshui":
        return t("fortuneUpload.fengshuiGuidance");
      default:
        return "";
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">{t("fortuneUpload.title")}</h3>
        <p className="text-sm text-muted-foreground mb-4">{getUploadGuidance()}</p>
        
        {/* 上传按钮 */}
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={images.length >= maxImages}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {t("fortuneUpload.selectImages")}
          </Button>
          <span className="text-sm text-muted-foreground">
            {t("fortuneUpload.imageCount", { current: images.length, max: maxImages })}
          </span>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* 图片预览网格 */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border-2 border-border"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 空状态 */}
      {previews.length === 0 && (
        <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
          <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">
            {t("fortuneUpload.noImages")}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("fortuneUpload.minImagesRequired", { min: minImages })}
          </p>
        </div>
      )}

      {/* 问题描述(可选) */}
      <div className="space-y-2">
        <Label htmlFor="question">{t("fortuneUpload.questionLabel")}</Label>
        <Textarea
          id="question"
          placeholder={t("fortuneUpload.questionPlaceholder")}
          value={question}
          onChange={(e) => handleQuestionChange(e.target.value)}
          rows={4}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground">
          {t("fortuneUpload.questionHint")}
        </p>
      </div>

      {/* 上传要求提示 */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
        <p className="text-sm font-medium">{t("fortuneUpload.requirements")}</p>
        <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
          <li>{t("fortuneUpload.req1")}</li>
          <li>{t("fortuneUpload.req2")}</li>
          <li>{t("fortuneUpload.req3")}</li>
          <li>{t("fortuneUpload.req4")}</li>
        </ul>
      </div>
    </Card>
  );
}
