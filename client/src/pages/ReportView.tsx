import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast as showToast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";
import { Download, ArrowLeft, Clock, CheckCircle, AlertCircle, FileText } from "lucide-react";

export default function ReportView() {
  const { t } = useTranslation();
  const { bookingId } = useParams<{ bookingId: string }>();
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: booking, isLoading, error } = trpc.fortune.getBooking.useQuery(
    { bookingId: parseInt(bookingId || "0") },
    { enabled: !!bookingId }
  );

  const handleDownloadPDF = async () => {
    if (!booking) return;

    setIsDownloading(true);
    try {
      // 优先使用 reportUrl（S3 上的 PDF）
      if (booking.reportUrl) {
        const link = document.createElement("a");
        link.href = booking.reportUrl;
        link.download = `${booking.serviceType}-report-${bookingId}.pdf`;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast.success(t("reportView.downloadSuccess"));
        return;
      }

      // 如果没有 PDF URL，下载 Markdown 报告
      if (booking.report) {
        const element = document.createElement("a");
        const blob = new Blob([booking.report], { type: "text/markdown;charset=utf-8" });
        element.href = URL.createObjectURL(blob);
        element.download = `${booking.serviceType}-report-${bookingId}.md`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        URL.revokeObjectURL(element.href);
        showToast.success(t("reportView.downloadSuccess"));
      }
    } catch (error) {
      showToast.error(t("common.error"), {
        description: t("reportView.downloadError"),
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // 获取服务类型的显示名称
  const getServiceTitle = (type: string) => {
    switch (type) {
      case "face": return t("reportView.faceReadingReport");
      case "palm": return t("reportView.palmReadingReport");
      case "fengshui": return t("reportView.fengshuiReport");
      default: return t("reportView.report");
    }
  };

  // 获取状态 badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />{t("reportView.statusCompleted")}</Badge>;
      case "in_progress":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200"><Clock className="w-3 h-3 mr-1 animate-spin" />{t("reportView.statusProcessing")}</Badge>;
      case "pending":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200"><Clock className="w-3 h-3 mr-1" />{t("reportView.statusPending")}</Badge>;
      default:
        return <Badge className="bg-red-100 text-red-800 border-red-200"><AlertCircle className="w-3 h-3 mr-1" />{t("reportView.statusFailed")}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[oklch(82%_0.18_85)] mx-auto mb-4"></div>
          <p className="text-slate-400">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Card className="max-w-md bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-center text-red-400">{t("reportView.notFound")}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-slate-400 mb-4">{t("reportView.notFoundDesc")}</p>
            <Link href="/">
              <Button className="bg-[oklch(82%_0.18_85)] hover:bg-[oklch(82%_0.18_85)]/90 text-slate-900">{t("nav.home")}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (booking.status !== "completed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Card className="max-w-md bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-center text-white flex items-center justify-center gap-2">
              <Clock className="w-5 h-5 text-[oklch(82%_0.18_85)] animate-pulse" />
              {t("reportView.processing")}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {/* 进度条 */}
            <div className="w-full bg-slate-800 rounded-full h-2 mb-4">
              <div className="bg-[oklch(82%_0.18_85)] h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
            <p className="text-slate-400 mb-2">{t("reportView.processingDesc")}</p>
            <p className="text-slate-500 text-sm mb-6">{t("reportView.processingTime")}</p>
            <Link href="/my-orders">
              <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("reportView.backToOrders")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Report Content */}
      <div className="container mx-auto px-4 py-8">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/my-orders">
            <Button variant="ghost" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("reportView.backToOrders")}
            </Button>
          </Link>
          {getStatusBadge(booking.status)}
        </div>

        <Card className="max-w-4xl mx-auto bg-slate-900/50 border-slate-800">
          <CardHeader className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-b border-slate-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl sm:text-2xl text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[oklch(82%_0.18_85)]" />
                  {getServiceTitle(booking.serviceType)}
                </CardTitle>
                <p className="text-sm text-slate-400 mt-2">
                  {t("reportView.generatedAt")}: {new Date(booking.createdAt).toLocaleString()}
                </p>
              </div>
              <Button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="bg-[oklch(82%_0.18_85)] hover:bg-[oklch(82%_0.18_85)]/90 text-slate-900 shrink-0"
              >
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? t("reportView.downloading") : (booking.reportUrl ? t("reportView.downloadPDF") : t("reportView.download"))}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6 px-4 sm:px-6">
            <div className="prose prose-invert prose-amber max-w-none 
              prose-headings:text-[oklch(82%_0.18_85)] 
              prose-p:text-slate-300 
              prose-strong:text-white
              prose-table:text-slate-300
              prose-th:text-[oklch(82%_0.18_85)]
              prose-td:border-slate-700
              prose-th:border-slate-700
              prose-hr:border-slate-800">
              <Streamdown>{booking.report || ""}</Streamdown>
            </div>
          </CardContent>
        </Card>

        {/* 底部操作 */}
        <div className="flex justify-center gap-4 mt-8">
          <Link href="/my-orders">
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
              {t("reportView.backToOrders")}
            </Button>
          </Link>
          <Link href="/products">
            <Button className="bg-[oklch(82%_0.18_85)] hover:bg-[oklch(82%_0.18_85)]/90 text-slate-900">
              {t("reportView.exploreProducts")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
