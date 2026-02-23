import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  BarChart3,
} from "lucide-react";

export default function DestinyReports() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const limit = 20;

  const { data, isLoading } = trpc.admin.destinyReports.listAll.useQuery({
    status: statusFilter !== "all" ? statusFilter : undefined,
    search: search || undefined,
    limit,
    offset: page * limit,
  });

  const stats = trpc.admin.destinyReports.getStats.useQuery();

  const reportDetail = trpc.admin.destinyReports.getById.useQuery(
    { reportId: selectedReportId! },
    { enabled: !!selectedReportId }
  );

  const reports = (data?.reports || []) as any[];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            已完成
          </Badge>
        );
      case "GENERATING":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            生成中
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
            <Clock className="w-3 h-3 mr-1" />
            等待中
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <AlertCircle className="w-3 h-3 mr-1" />
            失败
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-700/50 text-slate-300">{status}</Badge>
        );
    }
  };

  const getSegmentBadge = (status: string) => {
    if (status === "COMPLETED" || status === "SUCCESS") {
      return <span className="text-emerald-400 text-xs">✓</span>;
    } else if (status === "GENERATING" || status === "IN_PROGRESS") {
      return <span className="text-blue-400 text-xs">⟳</span>;
    } else if (status === "FAILED") {
      return <span className="text-red-400 text-xs">✗</span>;
    }
    return <span className="text-slate-500 text-xs">○</span>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <FileText className="w-7 h-7 text-[oklch(82%_0.18_85)]" />
              能量报告管理
            </h1>
            <p className="text-slate-400 mt-1">
              管理 destiny_reports 能量报告生成任务
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        {stats.data && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-400">总报告数</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.data.total}</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-slate-400">今日新增</span>
              </div>
              <p className="text-2xl font-bold text-amber-400">{stats.data.todayCount}</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-slate-400">已完成</span>
              </div>
              <p className="text-2xl font-bold text-emerald-400">
                {stats.data.statusCounts?.COMPLETED || 0}
              </p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Loader2 className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-slate-400">生成中</span>
              </div>
              <p className="text-2xl font-bold text-blue-400">
                {stats.data.statusCounts?.GENERATING || 0}
              </p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-xs text-slate-400">失败</span>
              </div>
              <p className="text-2xl font-bold text-red-400">
                {stats.data.statusCounts?.FAILED || 0}
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-3 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="搜索邮箱或姓名..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setPage(0);
            }}
          >
            <SelectTrigger className="w-36 bg-slate-800/50 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="PENDING">等待中</SelectItem>
              <SelectItem value="GENERATING">生成中</SelectItem>
              <SelectItem value="COMPLETED">已完成</SelectItem>
              <SelectItem value="FAILED">失败</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400">ID</TableHead>
                <TableHead className="text-slate-400">姓名</TableHead>
                <TableHead className="text-slate-400">邮箱</TableHead>
                <TableHead className="text-slate-400">出生日期</TableHead>
                <TableHead className="text-slate-400">状态</TableHead>
                <TableHead className="text-slate-400">段落进度</TableHead>
                <TableHead className="text-slate-400">创建时间</TableHead>
                <TableHead className="text-slate-400 text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-slate-400 py-8">
                    加载中...
                  </TableCell>
                </TableRow>
              ) : reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-slate-400 py-8">
                    暂无报告数据
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report: any) => (
                  <TableRow key={report.id} className="border-slate-800 hover:bg-slate-800/30">
                    <TableCell className="text-slate-300 font-mono text-sm">
                      {report.id}
                    </TableCell>
                    <TableCell className="text-white font-medium text-sm">
                      {report.name || "—"}
                    </TableCell>
                    <TableCell className="text-slate-300 text-sm">
                      {report.email}
                    </TableCell>
                    <TableCell className="text-slate-300 text-sm">
                      {report.birthDate
                        ? new Date(report.birthDate).toLocaleDateString("zh-CN")
                        : "—"}
                    </TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1.5 items-center">
                        {[1, 2, 3, 4, 5].map((seg) => (
                          <div
                            key={seg}
                            className="flex items-center gap-0.5"
                            title={`段落${seg}: ${report[`segment${seg}Status`]}`}
                          >
                            <span className="text-slate-500 text-xs">{seg}</span>
                            {getSegmentBadge(report[`segment${seg}Status`])}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm">
                      {new Date(report.createdAt).toLocaleString("zh-CN")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedReportId(report.id)}
                        className="text-slate-400 hover:text-white"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">
              第 {page + 1} / {totalPages} 页 · 共 {total} 条
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages - 1}
                onClick={() => setPage(page + 1)}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Detail Dialog */}
        <Dialog open={!!selectedReportId} onOpenChange={() => setSelectedReportId(null)}>
          <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">报告详情 #{selectedReportId}</DialogTitle>
            </DialogHeader>
            {reportDetail.isLoading ? (
              <div className="text-center py-8 text-slate-400">加载中...</div>
            ) : reportDetail.data ? (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-slate-400">姓名</p>
                    <p className="text-white font-medium">
                      {reportDetail.data.name || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">邮箱</p>
                    <p className="text-white">{reportDetail.data.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">状态</p>
                    {getStatusBadge(reportDetail.data.status)}
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">出生日期</p>
                    <p className="text-white">
                      {reportDetail.data.birthDate
                        ? new Date(reportDetail.data.birthDate).toLocaleString("zh-CN")
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">出生时间</p>
                    <p className="text-white">{reportDetail.data.birthTime || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">出生地</p>
                    <p className="text-white">{reportDetail.data.birthLocation || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">创建时间</p>
                    <p className="text-white">
                      {new Date(reportDetail.data.createdAt).toLocaleString("zh-CN")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">投递时间</p>
                    <p className="text-white">
                      {reportDetail.data.deliveredAt
                        ? new Date(reportDetail.data.deliveredAt).toLocaleString("zh-CN")
                        : "未投递"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">完整性检查</p>
                    <p className={reportDetail.data.integrityCheckPassed ? "text-emerald-400" : "text-red-400"}>
                      {reportDetail.data.integrityCheckPassed ? "通过" : "未通过"}
                    </p>
                  </div>
                </div>

                {/* Segment Status */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-[oklch(82%_0.18_85)]">
                    段落生成状态
                  </h3>
                  <div className="grid grid-cols-5 gap-3">
                    {[1, 2, 3, 4, 5].map((seg) => {
                      const status = reportDetail.data[`segment${seg}Status`];
                      const retryCount = reportDetail.data[`segment${seg}RetryCount`];
                      return (
                        <div
                          key={seg}
                          className="bg-slate-800/50 rounded-lg p-3 text-center"
                        >
                          <p className="text-xs text-slate-400 mb-1">段落 {seg}</p>
                          <div className="mb-1">{getSegmentBadge(status)}</div>
                          <p className="text-xs text-slate-500">
                            {status}
                          </p>
                          {retryCount > 0 && (
                            <p className="text-xs text-amber-400 mt-1">
                              重试 {retryCount} 次
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Report Content Path */}
                {reportDetail.data.reportContentPath && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-[oklch(82%_0.18_85)]">
                      报告文件路径
                    </h3>
                    <code className="block bg-slate-800 rounded-lg p-3 text-sm text-slate-300 break-all">
                      {reportDetail.data.reportContentPath}
                    </code>
                  </div>
                )}

                {/* Report Hash */}
                {reportDetail.data.reportHash && (
                  <div>
                    <p className="text-sm text-slate-400">报告哈希</p>
                    <code className="text-xs text-slate-500 font-mono">
                      {reportDetail.data.reportHash}
                    </code>
                  </div>
                )}
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
