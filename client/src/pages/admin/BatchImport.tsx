import { useState, useRef, useCallback } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Upload,
  FileSpreadsheet,
  Archive,
  CheckCircle2,
  XCircle,
  Loader2,
  Download,
  RefreshCw,
  Info,
  Package,
  Image,
  MessageSquare,
} from "lucide-react";

const ADMIN_TOKEN = "cneraart-admin-2024";

const CATEGORIES = [
  { id: 90001, name: "守护星座 (Zodiac Guardians)" },
  { id: 90002, name: "太阳星座守护 (Sun Sign Guardians)" },
  { id: 90003, name: "月亮星座守护 (Moon Sign Guardians)" },
  { id: 90004, name: "财富运势 (Wealth & Fortune)" },
  { id: 90005, name: "平安健康 (Health & Safety)" },
  { id: 90006, name: "智慧学业 (Wisdom & Study)" },
  { id: 90007, name: "内心平静 (Inner Peace)" },
];

interface TaskStatus {
  id: string;
  status: "pending" | "processing" | "done" | "error";
  progress: number;
  message: string;
  logs: string[];
  result?: {
    productsCreated: number;
    imagesUploaded: number;
    reviewsGenerated: number;
    errors: string[];
  };
}

export default function BatchImport() {
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [imagesFile, setImagesFile] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState("90005");
  const [reviewCount, setReviewCount] = useState("300");
  const [uploading, setUploading] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [taskStatus, setTaskStatus] = useState<TaskStatus | null>(null);
  const [exporting, setExporting] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startPolling = useCallback((id: string) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/admin/batch-import/${id}?token=${ADMIN_TOKEN}`);
        if (!res.ok) return;
        const data: TaskStatus = await res.json();
        setTaskStatus(data);
        if (data.status === "done" || data.status === "error") {
          clearInterval(pollRef.current!);
          pollRef.current = null;
          setUploading(false);
          if (data.status === "done") {
            toast.success("导入完成！" + data.message);
          } else {
            toast.error("导入失败：" + data.message);
          }
        }
      } catch (e) {
        // ignore
      }
    }, 1500);
  }, []);

  const handleSubmit = async () => {
    if (!excelFile) {
      toast.error("请选择Excel文件");
      return;
    }

    setUploading(true);
    setTaskStatus(null);

    const formData = new FormData();
    formData.append("excel", excelFile);
    if (imagesFile) formData.append("images", imagesFile);
    formData.append("categoryId", categoryId);
    formData.append("reviewCount", reviewCount);

    try {
      const res = await fetch(`/api/admin/batch-import?token=${ADMIN_TOKEN}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "上传失败");
      }

      const data = await res.json();
      setTaskId(data.taskId);
      toast.info("导入任务已启动，正在处理...");
      startPolling(data.taskId);
    } catch (err: any) {
      toast.error("启动失败：" + err.message);
      setUploading(false);
    }
  };

  const handleExportSQL = async () => {
    setExporting(true);
    try {
      const res = await fetch(`/api/admin/export-sql?token=${ADMIN_TOKEN}`);
      if (!res.ok) throw new Error("导出失败");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `products-${new Date().toISOString().slice(0, 10)}.sql`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("SQL文件已下载！可直接导入到生产数据库");
    } catch (err: any) {
      toast.error("导出失败：" + err.message);
    } finally {
      setExporting(false);
    }
  };

  const statusColor = {
    pending: "bg-gray-100 text-gray-700",
    processing: "bg-blue-100 text-blue-700",
    done: "bg-green-100 text-green-700",
    error: "bg-red-100 text-red-700",
  };

  const statusLabel = {
    pending: "等待中",
    processing: "处理中",
    done: "完成",
    error: "失败",
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">产品批量导入</h1>
          <p className="text-gray-500 mt-1">
            上传 Excel 文件和图片压缩包，系统自动处理并写入数据库
          </p>
        </div>

        {/* 使用说明 */}
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-amber-800">
              <Info className="w-4 h-4" />
              Excel 格式说明
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-amber-700 space-y-1">
            <p>Excel 第一行为表头，支持以下列名（不区分大小写）：</p>
            <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-xs bg-white p-3 rounded border border-amber-200">
              <div><span className="font-bold">Product Name</span> / 产品名称 <span className="text-red-500">*必填</span></div>
              <div><span className="font-bold">Sale Price</span> / 售价（USD）</div>
              <div><span className="font-bold">Description (Chinese)</span> / 描述</div>
              <div><span className="font-bold">Image Files</span> / 图片文件名（逗号分隔）</div>
            </div>
            <p className="mt-2">图片压缩包：支持 .zip 格式，图片按文件名排序自动分配给产品（每产品3张）</p>
          </CardContent>
        </Card>

        {/* 导入表单 */}
        <Card>
          <CardHeader>
            <CardTitle>上传文件</CardTitle>
            <CardDescription>选择 Excel 产品数据文件和图片压缩包</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Excel上传 */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-green-600" />
                  Excel 文件 <span className="text-red-500">*</span>
                </Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                    excelFile
                      ? "border-green-400 bg-green-50"
                      : "border-gray-300 hover:border-amber-400 hover:bg-amber-50"
                  }`}
                  onClick={() => document.getElementById("excel-input")?.click()}
                >
                  {excelFile ? (
                    <div className="flex items-center justify-center gap-2 text-green-700">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-sm font-medium">{excelFile.name}</span>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">点击上传 .xlsx / .xls</p>
                    </div>
                  )}
                </div>
                <input
                  id="excel-input"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
                />
              </div>

              {/* 图片压缩包上传 */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Archive className="w-4 h-4 text-blue-600" />
                  图片压缩包（可选）
                </Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                    imagesFile
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-300 hover:border-amber-400 hover:bg-amber-50"
                  }`}
                  onClick={() => document.getElementById("images-input")?.click()}
                >
                  {imagesFile ? (
                    <div className="flex items-center justify-center gap-2 text-blue-700">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        {imagesFile.name} ({(imagesFile.size / 1024 / 1024).toFixed(1)} MB)
                      </span>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">点击上传 .zip（最大100MB）</p>
                    </div>
                  )}
                </div>
                <input
                  id="images-input"
                  type="file"
                  accept=".zip"
                  className="hidden"
                  onChange={(e) => setImagesFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 分类选择 */}
              <div className="space-y-2">
                <Label>目标分类</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 评论数量 */}
              <div className="space-y-2">
                <Label>每产品评论数量</Label>
                <Input
                  type="number"
                  value={reviewCount}
                  onChange={(e) => setReviewCount(e.target.value)}
                  min="0"
                  max="500"
                  placeholder="300"
                />
                <p className="text-xs text-gray-500">设为 0 则不生成评论</p>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={uploading || !excelFile}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
              size="lg"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  处理中...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  开始导入
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* 任务进度 */}
        {taskStatus && (
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">导入进度</CardTitle>
                <Badge className={statusColor[taskStatus.status]}>
                  {statusLabel[taskStatus.status]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{taskStatus.message}</span>
                  <span className="font-medium">{taskStatus.progress}%</span>
                </div>
                <Progress value={taskStatus.progress} className="h-2" />
              </div>

              {/* 结果统计 */}
              {taskStatus.result && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <Package className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <div className="text-xl font-bold text-green-700">
                      {taskStatus.result.productsCreated}
                    </div>
                    <div className="text-xs text-green-600">产品创建</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <Image className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <div className="text-xl font-bold text-blue-700">
                      {taskStatus.result.imagesUploaded}
                    </div>
                    <div className="text-xs text-blue-600">图片上传</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <MessageSquare className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <div className="text-xl font-bold text-purple-700">
                      {taskStatus.result.reviewsGenerated}
                    </div>
                    <div className="text-xs text-purple-600">评论生成</div>
                  </div>
                </div>
              )}

              {/* 错误列表 */}
              {taskStatus.result?.errors && taskStatus.result.errors.length > 0 && (
                <div className="bg-red-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-red-700 mb-2 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    处理错误 ({taskStatus.result.errors.length})
                  </p>
                  <ul className="text-xs text-red-600 space-y-1">
                    {taskStatus.result.errors.slice(0, 5).map((e, i) => (
                      <li key={i}>• {e}</li>
                    ))}
                    {taskStatus.result.errors.length > 5 && (
                      <li>... 还有 {taskStatus.result.errors.length - 5} 个错误</li>
                    )}
                  </ul>
                </div>
              )}

              {/* 处理日志 */}
              <div className="bg-gray-900 rounded-lg p-3 max-h-48 overflow-y-auto">
                <p className="text-xs text-gray-400 mb-2 font-mono">处理日志</p>
                {taskStatus.logs.map((log, i) => (
                  <p key={i} className="text-xs font-mono text-gray-300 leading-relaxed">
                    {log}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 数据库同步导出 */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-600" />
              导出 SQL（同步到生产数据库）
            </CardTitle>
            <CardDescription>
              将当前数据库中所有产品、图片、分类数据导出为 SQL 文件，直接在生产数据库中运行即可同步
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
              <p className="font-medium mb-1">使用方法：</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>点击下方按钮下载最新的 SQL 文件</li>
                <li>在 Railway 数据库控制台或 MySQL 客户端中运行该 SQL</li>
                <li>或者通过 SSH 执行：<code className="bg-blue-100 px-1 rounded">mysql -u user -p dbname &lt; products.sql</code></li>
              </ol>
            </div>
            <Button
              onClick={handleExportSQL}
              disabled={exporting}
              variant="outline"
              className="border-blue-400 text-blue-700 hover:bg-blue-50"
            >
              {exporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  导出中...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  下载最新 SQL 文件
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
