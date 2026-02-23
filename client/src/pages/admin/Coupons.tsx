import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tag, Plus, Eye, Percent, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface CouponFormData {
  code: string;
  description: string;
  discountType: "percentage" | "fixed" | "buy_x_get_y";
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  perUserLimit?: number;
  startDate?: string;
  endDate?: string;
}

const defaultForm: CouponFormData = {
  code: "",
  description: "",
  discountType: "percentage",
  discountValue: 0,
};

export default function Coupons() {
  const [showCreate, setShowCreate] = useState(false);
  const [showUsages, setShowUsages] = useState<number | null>(null);
  const [form, setForm] = useState<CouponFormData>(defaultForm);

  const { data, isLoading, refetch } = trpc.admin.coupons.listAll.useQuery({});

  const createMutation = trpc.admin.coupons.create.useMutation({
    onSuccess: () => {
      toast.success("优惠券创建成功");
      setShowCreate(false);
      setForm(defaultForm);
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const toggleMutation = trpc.admin.coupons.toggleActive.useMutation({
    onSuccess: () => {
      toast.success("状态已更新");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const usagesQuery = trpc.admin.coupons.getUsages.useQuery(
    { couponId: showUsages! },
    { enabled: !!showUsages }
  );

  const coupons = data?.coupons || [];
  const total = data?.total || 0;

  const handleCreate = () => {
    if (!form.code.trim()) {
      toast.error("请输入优惠券代码");
      return;
    }
    if (form.discountValue <= 0) {
      toast.error("请输入有效的折扣值");
      return;
    }
    createMutation.mutate({
      code: form.code.toUpperCase(),
      description: form.description || undefined,
      discountType: form.discountType,
      discountValue: form.discountValue,
      minPurchase: form.minPurchase || undefined,
      maxDiscount: form.maxDiscount || undefined,
      usageLimit: form.usageLimit || undefined,
      perUserLimit: form.perUserLimit || undefined,
      startDate: form.startDate ? new Date(form.startDate) : undefined,
      endDate: form.endDate ? new Date(form.endDate) : undefined,
    });
  };

  const getDiscountDisplay = (coupon: any) => {
    if (coupon.discountType === "percentage") {
      return `${Number(coupon.discountValue)}% OFF`;
    } else if (coupon.discountType === "fixed") {
      return `$${Number(coupon.discountValue)} OFF`;
    }
    return coupon.discountType;
  };

  const isExpired = (coupon: any) => {
    if (!coupon.endDate) return false;
    return new Date(coupon.endDate) < new Date();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Tag className="w-7 h-7 text-[oklch(82%_0.18_85)]" />
              优惠券管理
            </h1>
            <p className="text-slate-400 mt-1">共 {total} 张优惠券</p>
          </div>
          <Button
            onClick={() => setShowCreate(true)}
            className="bg-[oklch(82%_0.18_85)] text-slate-900 hover:bg-[oklch(85%_0.18_85)]"
          >
            <Plus className="w-4 h-4 mr-2" />
            创建优惠券
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400">代码</TableHead>
                <TableHead className="text-slate-400">折扣</TableHead>
                <TableHead className="text-slate-400">最低消费</TableHead>
                <TableHead className="text-slate-400">使用次数</TableHead>
                <TableHead className="text-slate-400">有效期</TableHead>
                <TableHead className="text-slate-400">状态</TableHead>
                <TableHead className="text-slate-400 text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-slate-400 py-8">
                    加载中...
                  </TableCell>
                </TableRow>
              ) : coupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-slate-400 py-8">
                    暂无优惠券
                  </TableCell>
                </TableRow>
              ) : (
                coupons.map((coupon: any) => (
                  <TableRow key={coupon.id} className="border-slate-800 hover:bg-slate-800/30">
                    <TableCell>
                      <code className="bg-slate-800 text-[oklch(82%_0.18_85)] px-2 py-1 rounded text-sm font-mono">
                        {coupon.code}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        {coupon.discountType === "percentage" ? (
                          <Percent className="w-3 h-3 mr-1" />
                        ) : (
                          <DollarSign className="w-3 h-3 mr-1" />
                        )}
                        {getDiscountDisplay(coupon)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {coupon.minPurchase ? `$${Number(coupon.minPurchase).toFixed(2)}` : "—"}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {coupon.usageCount || 0} / {coupon.usageLimit || "∞"}
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm">
                      {coupon.startDate && coupon.endDate ? (
                        <span className={isExpired(coupon) ? "text-red-400" : ""}>
                          {new Date(coupon.startDate).toLocaleDateString("zh-CN")} ~{" "}
                          {new Date(coupon.endDate).toLocaleDateString("zh-CN")}
                          {isExpired(coupon) && " (已过期)"}
                        </span>
                      ) : (
                        "永久有效"
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={coupon.isActive}
                        onCheckedChange={(checked) =>
                          toggleMutation.mutate({ couponId: coupon.id, isActive: checked })
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowUsages(coupon.id)}
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

        {/* Create Dialog */}
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg">
            <DialogHeader>
              <DialogTitle>创建优惠券</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">优惠券代码 *</Label>
                  <Input
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    placeholder="WUTAI10"
                    className="bg-slate-800/50 border-slate-700 text-white uppercase"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">折扣类型 *</Label>
                  <Select
                    value={form.discountType}
                    onValueChange={(v: any) => setForm({ ...form, discountType: v })}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      <SelectItem value="percentage">百分比折扣</SelectItem>
                      <SelectItem value="fixed">固定金额</SelectItem>
                      <SelectItem value="buy_x_get_y">买X送Y</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-slate-300">描述</Label>
                <Input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="新用户首单优惠"
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">
                    折扣值 * {form.discountType === "percentage" ? "(%)" : "($)"}
                  </Label>
                  <Input
                    type="number"
                    value={form.discountValue || ""}
                    onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">最低消费 ($)</Label>
                  <Input
                    type="number"
                    value={form.minPurchase || ""}
                    onChange={(e) => setForm({ ...form, minPurchase: Number(e.target.value) || undefined })}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">使用次数限制</Label>
                  <Input
                    type="number"
                    value={form.usageLimit || ""}
                    onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) || undefined })}
                    placeholder="不限"
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">每人限用</Label>
                  <Input
                    type="number"
                    value={form.perUserLimit || ""}
                    onChange={(e) => setForm({ ...form, perUserLimit: Number(e.target.value) || undefined })}
                    placeholder="不限"
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">开始日期</Label>
                  <Input
                    type="date"
                    value={form.startDate || ""}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">结束日期</Label>
                  <Input
                    type="date"
                    value={form.endDate || ""}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setShowCreate(false)} className="text-slate-400">
                取消
              </Button>
              <Button
                onClick={handleCreate}
                disabled={createMutation.isPending}
                className="bg-[oklch(82%_0.18_85)] text-slate-900 hover:bg-[oklch(85%_0.18_85)]"
              >
                {createMutation.isPending ? "创建中..." : "创建"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Usages Dialog */}
        <Dialog open={!!showUsages} onOpenChange={() => setShowUsages(null)}>
          <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg">
            <DialogHeader>
              <DialogTitle>使用记录</DialogTitle>
            </DialogHeader>
            {usagesQuery.isLoading ? (
              <div className="text-center py-8 text-slate-400">加载中...</div>
            ) : usagesQuery.data && usagesQuery.data.length > 0 ? (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {usagesQuery.data.map((usage: any) => (
                  <div key={usage.id} className="flex items-center justify-between bg-slate-800/50 rounded-lg px-4 py-3">
                    <div>
                      <p className="text-white text-sm font-medium">{usage.userName || "用户"}</p>
                      <p className="text-slate-400 text-xs">{usage.userEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-medium">-${Number(usage.discountAmount).toFixed(2)}</p>
                      <p className="text-slate-500 text-xs">
                        {new Date(usage.createdAt).toLocaleString("zh-CN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-400 py-8">暂无使用记录</p>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
