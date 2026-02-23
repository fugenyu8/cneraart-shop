import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Star,
  Check,
  X,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

export default function Reviews() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(0);
  const limit = 20;

  const { data, isLoading, refetch } = trpc.admin.reviews.listAll.useQuery({
    status:
      statusFilter !== "all"
        ? (statusFilter as "pending" | "approved" | "rejected")
        : undefined,
    limit,
    offset: page * limit,
  });

  const approveMutation = trpc.admin.reviews.approve.useMutation({
    onSuccess: () => {
      toast.success("评价已通过");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const rejectMutation = trpc.admin.reviews.reject.useMutation({
    onSuccess: () => {
      toast.success("评价已拒绝");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.admin.reviews.delete.useMutation({
    onSuccess: () => {
      toast.success("评价已删除");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const reviews = data || [];

  const getStatusBadge = (review: any) => {
    if (review.isApproved) {
      return (
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
          已通过
        </Badge>
      );
    }
    // Check if rejected (not approved and has been reviewed)
    return (
      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
        待审核
      </Badge>
    );
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i <= rating
                ? "fill-amber-400 text-amber-400"
                : "text-slate-600"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-7 h-7 text-[oklch(82%_0.18_85)]" />
              评价管理
            </h1>
            <p className="text-slate-400 mt-1">审核和管理用户评价</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
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
              <SelectItem value="pending">待审核</SelectItem>
              <SelectItem value="approved">已通过</SelectItem>
              <SelectItem value="rejected">已拒绝</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400">ID</TableHead>
                <TableHead className="text-slate-400">用户</TableHead>
                <TableHead className="text-slate-400">产品ID</TableHead>
                <TableHead className="text-slate-400">评分</TableHead>
                <TableHead className="text-slate-400">标题</TableHead>
                <TableHead className="text-slate-400">内容</TableHead>
                <TableHead className="text-slate-400">状态</TableHead>
                <TableHead className="text-slate-400">时间</TableHead>
                <TableHead className="text-slate-400 text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center text-slate-400 py-8"
                  >
                    加载中...
                  </TableCell>
                </TableRow>
              ) : reviews.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center text-slate-400 py-8"
                  >
                    暂无评价数据
                  </TableCell>
                </TableRow>
              ) : (
                reviews.map((review: any) => (
                  <TableRow
                    key={review.id}
                    className="border-slate-800 hover:bg-slate-800/30"
                  >
                    <TableCell className="text-slate-300 font-mono text-sm">
                      {review.id}
                    </TableCell>
                    <TableCell className="text-white text-sm">
                      {review.userName || `用户#${review.userId || "匿名"}`}
                    </TableCell>
                    <TableCell className="text-slate-300 text-sm">
                      #{review.productId}
                    </TableCell>
                    <TableCell>{renderStars(review.rating)}</TableCell>
                    <TableCell className="text-white text-sm max-w-[120px] truncate">
                      {review.title || "—"}
                    </TableCell>
                    <TableCell className="text-slate-300 text-sm max-w-[200px] truncate">
                      {review.comment || "—"}
                    </TableCell>
                    <TableCell>{getStatusBadge(review)}</TableCell>
                    <TableCell className="text-slate-400 text-sm">
                      {new Date(review.createdAt).toLocaleDateString("zh-CN")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        {!review.isApproved && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              approveMutation.mutate({ reviewId: review.id })
                            }
                            className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                            title="通过"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        {!review.isApproved && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              rejectMutation.mutate({ reviewId: review.id })
                            }
                            className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                            title="拒绝"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm("确定删除此评价？")) {
                              deleteMutation.mutate({ reviewId: review.id });
                            }
                          }}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {reviews.length >= limit && (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-slate-400">第 {page + 1} 页</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
