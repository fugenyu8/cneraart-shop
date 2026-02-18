import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast as showToast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";

export default function ReportView() {
  const { t } = useTranslation();
  const { bookingId } = useParams<{ bookingId: string }>();
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: booking, isLoading, error } = trpc.fortune.getBooking.useQuery(
    { bookingId: parseInt(bookingId || "0") },
    { enabled: !!bookingId }
  );

  const handleDownloadPDF = async () => {
    if (!booking?.report) return;
    
    setIsDownloading(true);
    try {
      // 创建PDF下载链接
      const element = document.createElement("a");
      const blob = new Blob([booking.report], { type: "text/markdown" });
      element.href = URL.createObjectURL(blob);
      element.download = `${booking.serviceType}-report-${bookingId}.md`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      URL.revokeObjectURL(element.href);
      
      showToast.success(t("reportView.downloadSuccess"));
    } catch (error) {
      showToast.error(t("common.error"), {
        description: t("reportView.downloadError"),
      });
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900 mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">{t("reportView.notFound")}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">{t("reportView.notFoundDesc")}</p>
            <Link href="/">
              <Button>{t("nav.home")}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (booking.status !== "completed") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center">{t("reportView.processing")}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="animate-pulse mb-4">
              <div className="h-2 bg-amber-200 rounded-full w-full mb-2"></div>
              <div className="h-2 bg-amber-200 rounded-full w-3/4 mx-auto"></div>
            </div>
            <p className="text-muted-foreground mb-4">{t("reportView.processingDesc")}</p>
            <Link href="/">
              <Button>{t("nav.home")}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-900 to-amber-900 text-white py-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/">
            <a className="text-2xl font-bold">☯ {t("common.site_name")}</a>
          </Link>
          <nav className="flex gap-6">
            <Link href="/products"><a className="hover:text-amber-200">{t("nav.products")}</a></Link>
            <Link href="/fortune"><a className="hover:text-amber-200">{t("nav.fortune_services")}</a></Link>
            <Link href="/cart"><a className="hover:text-amber-200">{t("nav.cart")}</a></Link>
          </nav>
        </div>
      </header>

      {/* Report Content */}
      <div className="container mx-auto py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">
                {booking.serviceType === "face" && t("reportView.faceReadingReport")}
                {booking.serviceType === "palm" && t("reportView.palmReadingReport")}
                {booking.serviceType === "fengshui" && t("reportView.fengshuiReport")}
              </CardTitle>
              <Button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                variant="outline"
                className="bg-white"
              >
                {isDownloading ? t("reportView.downloading") : t("reportView.download")}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {t("reportView.generatedAt")}: {new Date(booking.createdAt).toLocaleString()}
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="prose prose-amber max-w-none">
              <Streamdown>{booking.report || ""}</Streamdown>
            </div>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="text-center mt-8">
          <Link href="/">
            <Button variant="outline">{t("common.back_home")}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
