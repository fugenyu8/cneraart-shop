import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, CheckCircle, XCircle, Download, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function BatchShipmentUpload() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const batchUploadMutation = trpc.admin.orders.batchUpdateTracking.useMutation();
  const { data: history } = trpc.admin.orders.getBatchHistory.useQuery();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadResult(null);
    }
  };

  const parseCSV = (text: string) => {
    const lines = text.trim().split("\n");
    const records = [];

    // 跳过标题行
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = line.split(",").map((p) => p.trim());
      if (parts.length >= 2) {
        records.push({
          orderNumber: parts[0],
          trackingNumber: parts[1],
          carrier: parts[2] || undefined,
        });
      }
    }

    return records;
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsProcessing(true);
    setUploadResult(null);

    try {
      const text = await file.text();
      const records = parseCSV(text);

      if (records.length === 0) {
        setUploadResult({
          success: false,
          message: "CSV文件中没有有效的数据",
        });
        setIsProcessing(false);
        return;
      }

      const result = await batchUploadMutation.mutateAsync({ records });
      setUploadResult(result);
      setFile(null);
    } catch (error: any) {
      setUploadResult({
        success: false,
        message: error.message || "上传失败",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const template = `订单号,运单号,物流公司
ORD-1234567890,1234567890123,USPS
ORD-0987654321,9876543210987,FedEx
ORD-1111222233,5555666677777,UPS`;

    const blob = new Blob([template], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "shipment_template.csv";
    link.click();
  };

  return (
    <div className="container max-w-6xl py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">批量上传运单号</h1>
        <p className="text-slate-400">通过CSV文件批量导入订单物流信息</p>
      </div>

      {/* 上传区域 */}
      <Card className="bg-slate-900/50 border-slate-800 mb-6">
        <CardHeader>
          <CardTitle className="text-white">上传CSV文件</CardTitle>
          <CardDescription className="text-slate-400">
            支持CSV格式,包含订单号、运单号和物流公司(可选)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 下载模板 */}
          <Alert className="bg-blue-500/10 border-blue-500/30">
            <AlertCircle className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-blue-300">
              <div className="flex items-center justify-between">
                <span>首次使用?下载CSV模板文件</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadTemplate}
                  className="bg-transparent border-blue-500/50 text-blue-300 hover:bg-blue-500/20"
                >
                  <Download className="h-4 w-4 mr-2" />
                  下载模板
                </Button>
              </div>
            </AlertDescription>
          </Alert>

          {/* 文件上传 */}
          <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-slate-600 transition-colors">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="cursor-pointer">
              <Upload className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <p className="text-white font-medium mb-2">
                {file ? file.name : "点击选择CSV文件"}
              </p>
              <p className="text-sm text-slate-400">或拖拽文件到此处</p>
            </label>
          </div>

          {/* 上传按钮 */}
          <div className="flex justify-end">
            <Button
              onClick={handleUpload}
              disabled={!file || isProcessing}
              className="bg-[oklch(82%_0.18_85)] hover:bg-[oklch(77%_0.18_85)] text-slate-900"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-900 mr-2"></div>
                  处理中...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  开始上传
                </>
              )}
            </Button>
          </div>

          {/* 上传结果 */}
          {uploadResult && (
            <Alert
              className={
                uploadResult.success === false
                  ? "bg-red-500/10 border-red-500/30"
                  : "bg-green-500/10 border-green-500/30"
              }
            >
              {uploadResult.success === false ? (
                <XCircle className="h-4 w-4 text-red-400" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-400" />
              )}
              <AlertDescription
                className={uploadResult.success === false ? "text-red-300" : "text-green-300"}
              >
                {uploadResult.message || (
                  <div>
                    <p className="font-medium mb-2">批量上传完成!</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">总数:</span>{" "}
                        <span className="font-semibold">{uploadResult.total}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">成功:</span>{" "}
                        <span className="font-semibold text-green-400">{uploadResult.success}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">失败:</span>{" "}
                        <span className="font-semibold text-red-400">{uploadResult.failed}</span>
                      </div>
                    </div>
                    {uploadResult.errors && uploadResult.errors.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-1">错误详情:</p>
                        <div className="max-h-40 overflow-y-auto space-y-1">
                          {uploadResult.errors.map((err: any, idx: number) => (
                            <p key={idx} className="text-xs text-red-300">
                              {err.orderNumber}: {err.error}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* 上传历史 */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">上传历史</CardTitle>
          <CardDescription className="text-slate-400">最近的批量上传记录</CardDescription>
        </CardHeader>
        <CardContent>
          {history && history.length > 0 ? (
            <div className="space-y-3">
              {history.map((record: any) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="h-4 w-4 text-slate-400" />
                      <span className="text-white font-medium">{record.fileName}</span>
                      <Badge
                        variant="outline"
                        className={
                          record.status === "completed"
                            ? "border-green-500/50 text-green-400"
                            : record.status === "failed"
                            ? "border-red-500/50 text-red-400"
                            : "border-yellow-500/50 text-yellow-400"
                        }
                      >
                        {record.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm text-slate-400">
                      <div>
                        总数: <span className="text-white">{record.totalRecords}</span>
                      </div>
                      <div>
                        成功: <span className="text-green-400">{record.successCount}</span>
                      </div>
                      <div>
                        失败: <span className="text-red-400">{record.failureCount}</span>
                      </div>
                      <div>
                        时间:{" "}
                        <span className="text-white">
                          {new Date(record.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>暂无上传记录</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
