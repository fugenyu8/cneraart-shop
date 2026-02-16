import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { storagePut } from "@/lib/storage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

/**
 * 服务订单管理页面
 * 管理员查看服务订单、上传报告
 */
export default function ServiceOrders() {
  const { t } = useTranslation();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date_desc");

  // 获取服务订单列表
  const { data: orders, isLoading, refetch } = trpc.admin.serviceOrders.list.useQuery({
    limit: 50,
    offset: 0,
  });

  // 获取订单详情
  const { data: orderDetail } = trpc.admin.serviceOrders.getDetail.useQuery(
    { orderId: selectedOrderId! },
    { enabled: !!selectedOrderId }
  );

  // 上传报告mutation
  const uploadReportMutation = trpc.admin.serviceOrders.uploadReport.useMutation({
    onSuccess: () => {
      toast.success(t("admin.serviceOrders.reportUploaded"));
      setSelectedOrderId(null);
      setReportFile(null);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // 处理报告上传
  const handleUploadReport = async () => {
    if (!reportFile || !selectedOrderId) return;

    setUploading(true);
    try {
      // 1. 上传文件到S3
      const fileKey = `service-reports/${selectedOrderId}-${Date.now()}.pdf`;
      const arrayBuffer = await reportFile.arrayBuffer();
      const { url } = await storagePut(fileKey, new Uint8Array(arrayBuffer), "application/pdf");

      // 2. 更新数据库
      await uploadReportMutation.mutateAsync({
        orderId: selectedOrderId,
        reportUrl: url,
      });
    } catch (error: any) {
      toast.error(error.message || t("admin.serviceOrders.uploadFailed"));
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-center text-slate-400">{t("common.loading")}</p>
      </div>
    );
  }

  // 筛选和排序逻辑
  const filteredAndSortedOrders = useMemo(() => {
    if (!orders) return [];
    
    // 筛选
    let filtered = orders;
    if (statusFilter !== "all") {
      filtered = orders.filter((item: any) => item.order.status === statusFilter);
    }
    
    // 排序
    const sorted = [...filtered].sort((a: any, b: any) => {
      if (sortBy === "date_desc") {
        return new Date(b.order.createdAt).getTime() - new Date(a.order.createdAt).getTime();
      } else if (sortBy === "date_asc") {
        return new Date(a.order.createdAt).getTime() - new Date(b.order.createdAt).getTime();
      }
      return 0;
    });
    
    return sorted;
  }, [orders, statusFilter, sortBy]);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t("admin.serviceOrders.title")}</h1>
        <p className="text-slate-400">{t("admin.serviceOrders.subtitle")}</p>
      </div>

      {/* 筛选和排序控件 */}
      <div className="mb-6 flex gap-4">
        <div className="w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder={t("admin.serviceOrders.filterStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("admin.serviceOrders.allStatus")}</SelectItem>
              <SelectItem value="pending">{t("admin.serviceOrders.status.pending")}</SelectItem>
              <SelectItem value="processing">{t("admin.serviceOrders.status.processing")}</SelectItem>
              <SelectItem value="delivered">{t("admin.serviceOrders.status.delivered")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-48">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder={t("admin.serviceOrders.sortBy")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date_desc">{t("admin.serviceOrders.dateDesc")}</SelectItem>
              <SelectItem value="date_asc">{t("admin.serviceOrders.dateAsc")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("admin.serviceOrders.orderId")}</TableHead>
              <TableHead>{t("admin.serviceOrders.service")}</TableHead>
              <TableHead>{t("admin.serviceOrders.customer")}</TableHead>
              <TableHead>{t("admin.serviceOrders.date")}</TableHead>
              <TableHead>{t("admin.serviceOrders.status")}</TableHead>
              <TableHead>{t("admin.serviceOrders.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedOrders && filteredAndSortedOrders.length > 0 ? (
              filteredAndSortedOrders.map((item: any) => (
                <TableRow key={item.order.id}>
                  <TableCell>#{item.order.id}</TableCell>
                  <TableCell>{item.items.product?.name || "-"}</TableCell>
                  <TableCell>{item.user?.name || item.user?.email || "-"}</TableCell>
                  <TableCell>
                    {new Date(item.order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        item.order.status === "delivered"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {t(`admin.serviceOrders.status.${item.order.status}`)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => setSelectedOrderId(item.order.id)}
                    >
                      {t("admin.serviceOrders.viewDetail")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-slate-400">
                  {t("admin.serviceOrders.noOrders")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* 订单详情Dialog */}
      <Dialog open={!!selectedOrderId} onOpenChange={() => setSelectedOrderId(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("admin.serviceOrders.orderDetail")}</DialogTitle>
          </DialogHeader>

          {orderDetail && (
            <div className="space-y-6">
              {/* 用户信息 */}
              <div>
                <h3 className="mb-2 font-semibold">{t("admin.serviceOrders.customerInfo")}</h3>
                <div className="rounded-lg bg-slate-900/50 p-4">
                  <p><strong>{t("admin.serviceOrders.name")}:</strong> {orderDetail.user?.name || "-"}</p>
                  <p><strong>{t("admin.serviceOrders.email")}:</strong> {orderDetail.user?.email || "-"}</p>
                </div>
              </div>

              {/* 服务信息 */}
              <div>
                <h3 className="mb-2 font-semibold">{t("admin.serviceOrders.serviceInfo")}</h3>
                <div className="rounded-lg bg-slate-900/50 p-4">
                  {orderDetail.items.map((item: any, idx: number) => (
                    <p key={idx}>
                      <strong>{t("admin.serviceOrders.service")}:</strong> {item.product?.name || "-"}
                    </p>
                  ))}
                </div>
              </div>

              {/* 用户提交的信息 */}
              {orderDetail.booking && (
                <div>
                  <h3 className="mb-2 font-semibold">{t("admin.serviceOrders.submittedInfo")}</h3>
                  <div className="rounded-lg bg-slate-900/50 p-4 space-y-2">
                    <p><strong>{t("admin.serviceOrders.question")}:</strong></p>
                    <p className="text-slate-300">{orderDetail.booking.questionDescription || "-"}</p>
                    
                    {orderDetail.booking.imageUrls && orderDetail.booking.imageUrls.length > 0 && (
                      <div>
                        <p className="mb-2"><strong>{t("admin.serviceOrders.uploadedImages")}:</strong></p>
                        <div className="grid grid-cols-3 gap-2">
                          {orderDetail.booking.imageUrls.map((url: string, idx: number) => (
                            <img
                              key={idx}
                              src={url}
                              alt={`Image ${idx + 1}`}
                              className="h-24 w-full rounded object-cover"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 报告上传 */}
              <div>
                <h3 className="mb-2 font-semibold">{t("admin.serviceOrders.uploadReport")}</h3>
                {orderDetail.booking?.reportUrl ? (
                  <div className="rounded-lg bg-green-500/20 p-4">
                    <p className="text-green-400">{t("admin.serviceOrders.reportSent")}</p>
                    <a
                      href={orderDetail.booking.reportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline"
                    >
                      {t("admin.serviceOrders.viewReport")}
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setReportFile(e.target.files?.[0] || null)}
                      className="w-full"
                    />
                    <Button
                      onClick={handleUploadReport}
                      disabled={!reportFile || uploading}
                      className="w-full"
                    >
                      {uploading ? t("common.uploading") : t("admin.serviceOrders.uploadButton")}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
