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
import { Search, Users, Shield, ShieldCheck, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export default function Customers() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const limit = 20;

  const { data, isLoading, refetch } = trpc.admin.customers.listAll.useQuery({
    search: search || undefined,
    role: roleFilter !== "all" ? (roleFilter as "user" | "admin") : undefined,
    limit,
    offset: page * limit,
  });

  const userDetail = trpc.admin.customers.getById.useQuery(
    { userId: selectedUserId! },
    { enabled: !!selectedUserId }
  );

  const updateRole = trpc.admin.customers.updateRole.useMutation({
    onSuccess: () => {
      toast.success("用户角色已更新");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const users = data?.users || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users className="w-7 h-7 text-[oklch(82%_0.18_85)]" />
              用户管理
            </h1>
            <p className="text-slate-400 mt-1">共 {total} 位注册用户</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="搜索用户名或邮箱..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>
          <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(0); }}>
            <SelectTrigger className="w-36 bg-slate-800/50 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              <SelectItem value="all">全部角色</SelectItem>
              <SelectItem value="user">普通用户</SelectItem>
              <SelectItem value="admin">管理员</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400">ID</TableHead>
                <TableHead className="text-slate-400">用户名</TableHead>
                <TableHead className="text-slate-400">邮箱</TableHead>
                <TableHead className="text-slate-400">角色</TableHead>
                <TableHead className="text-slate-400">语言</TableHead>
                <TableHead className="text-slate-400">注册时间</TableHead>
                <TableHead className="text-slate-400">最近登录</TableHead>
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
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-slate-400 py-8">
                    暂无用户数据
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user: any) => (
                  <TableRow key={user.id} className="border-slate-800 hover:bg-slate-800/30">
                    <TableCell className="text-slate-300 font-mono text-sm">{user.id}</TableCell>
                    <TableCell className="text-white font-medium">{user.name || "—"}</TableCell>
                    <TableCell className="text-slate-300 text-sm">{user.email || "—"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={user.role === "admin" ? "default" : "secondary"}
                        className={
                          user.role === "admin"
                            ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                            : "bg-slate-700/50 text-slate-300 border-slate-600"
                        }
                      >
                        {user.role === "admin" ? (
                          <><ShieldCheck className="w-3 h-3 mr-1" />管理员</>
                        ) : (
                          <><Shield className="w-3 h-3 mr-1" />用户</>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300 text-sm">{user.preferredLanguage}</TableCell>
                    <TableCell className="text-slate-400 text-sm">
                      {new Date(user.createdAt).toLocaleDateString("zh-CN")}
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm">
                      {new Date(user.lastSignedIn).toLocaleDateString("zh-CN")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedUserId(user.id)}
                          className="text-slate-400 hover:text-white"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newRole = user.role === "admin" ? "user" : "admin";
                            if (confirm(`确定将 ${user.name || user.email} 的角色改为 ${newRole === "admin" ? "管理员" : "普通用户"} 吗？`)) {
                              updateRole.mutate({ userId: user.id, role: newRole });
                            }
                          }}
                          className="text-slate-400 hover:text-amber-400"
                        >
                          <ShieldCheck className="w-4 h-4" />
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
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">
              第 {page + 1} / {totalPages} 页
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

        {/* User Detail Dialog */}
        <Dialog open={!!selectedUserId} onOpenChange={() => setSelectedUserId(null)}>
          <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">用户详情</DialogTitle>
            </DialogHeader>
            {userDetail.isLoading ? (
              <div className="text-center py-8 text-slate-400">加载中...</div>
            ) : userDetail.data ? (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-400">用户名</p>
                    <p className="text-white font-medium">{userDetail.data.name || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">邮箱</p>
                    <p className="text-white">{userDetail.data.email || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">角色</p>
                    <Badge className={userDetail.data.role === "admin" ? "bg-amber-500/20 text-amber-400" : "bg-slate-700/50 text-slate-300"}>
                      {userDetail.data.role === "admin" ? "管理员" : "普通用户"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">注册时间</p>
                    <p className="text-white">{new Date(userDetail.data.createdAt).toLocaleString("zh-CN")}</p>
                  </div>
                </div>

                {/* Orders */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-[oklch(82%_0.18_85)]">
                    订单记录 ({userDetail.data.orders?.length || 0})
                  </h3>
                  {userDetail.data.orders && userDetail.data.orders.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {userDetail.data.orders.slice(0, 10).map((order: any) => (
                        <div key={order.id} className="flex items-center justify-between bg-slate-800/50 rounded-lg px-4 py-2">
                          <div>
                            <span className="text-white font-mono text-sm">{order.orderNumber}</span>
                            <span className="text-slate-400 text-sm ml-3">
                              {new Date(order.createdAt).toLocaleDateString("zh-CN")}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[oklch(82%_0.18_85)] font-medium">
                              ${Number(order.totalAmount).toFixed(2)}
                            </span>
                            <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm">暂无订单</p>
                  )}
                </div>

                {/* Addresses */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-[oklch(82%_0.18_85)]">
                    收货地址 ({userDetail.data.addresses?.length || 0})
                  </h3>
                  {userDetail.data.addresses && userDetail.data.addresses.length > 0 ? (
                    <div className="space-y-2">
                      {userDetail.data.addresses.map((addr: any) => (
                        <div key={addr.id} className="bg-slate-800/50 rounded-lg px-4 py-2 text-sm text-slate-300">
                          <p className="font-medium text-white">{addr.fullName} · {addr.phone}</p>
                          <p>{addr.country} {addr.state} {addr.city} {addr.addressLine1}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm">暂无地址</p>
                  )}
                </div>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
