import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getLocalized } from "@/lib/localized";
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
import { trpc } from "@/lib/trpc";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

export default function AdminProducts() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published" | "archived">("all");

  // 获取产品列表
  const { data: products, isLoading, refetch } = trpc.admin.products.listAll.useQuery({
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  // 删除产品mutation
  const deleteMutation = trpc.admin.products.delete.useMutation({
    onSuccess: () => {
      toast.success("产品已删除");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || "删除失败");
    },
  });

  const handleDelete = (id: number, name: string) => {
    if (confirm(`确定要删除产品"${name}"吗?`)) {
      deleteMutation.mutate({ productId: id });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      draft: { variant: "secondary", label: "草稿" },
      published: { variant: "default", label: "已发布" },
      archived: { variant: "outline", label: "已归档" },
    };
    const config = variants[status] || variants.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredProducts = products?.filter((product: any) =>
    search ? getLocalized(product.name).toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题和操作 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{t("admin.products")}</h1>
            <p className="text-slate-400">管理您的产品库存和信息</p>
          </div>
          <Link href="/wobifa888/products/new">
            <Button className="bg-[oklch(82%_0.18_85)] hover:bg-[oklch(82%_0.18_85)]/90 text-slate-900">
              <Plus className="w-4 h-4 mr-2" />
              {t("admin.add_product")}
            </Button>
          </Link>
        </div>

        {/* 搜索和筛选 */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="搜索产品名称..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-slate-900/50 border-slate-800 text-white"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-40 bg-slate-900/50 border-slate-800 text-white">
              <SelectValue placeholder="状态筛选" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800">
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="draft">草稿</SelectItem>
              <SelectItem value="published">已发布</SelectItem>
              <SelectItem value="archived">已归档</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 产品列表 */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="text-center py-12 text-slate-400">{t("common.loading")}</div>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-slate-800/50">
                  <TableHead className="text-slate-300">产品</TableHead>
                  <TableHead className="text-slate-300">SKU</TableHead>
                  <TableHead className="text-slate-300">价格</TableHead>
                  <TableHead className="text-slate-300">库存</TableHead>
                  <TableHead className="text-slate-300">状态</TableHead>
                  <TableHead className="text-slate-300 text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product: any) => (
                  <TableRow key={product.id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.images?.[0] && (
                          <img
                            src={product.images[0].url}
                            alt={getLocalized(product.name)}
                            className="w-12 h-12 rounded object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-white">{getLocalized(product.name)}</p>
                          <p className="text-sm text-slate-400">{product.slug}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">{product.sku || "-"}</TableCell>
                    <TableCell className="text-slate-300">
                      {product.salePrice ? (
                        <div>
                          <span className="text-[oklch(82%_0.18_85)] font-semibold">
                            ${parseFloat(product.salePrice).toFixed(2)}
                          </span>
                          <span className="text-slate-500 line-through ml-2 text-sm">
                            ${parseFloat(product.regularPrice).toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-white font-semibold">
                          ${parseFloat(product.regularPrice).toFixed(2)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      <span
                        className={
                          product.stock <= (product.lowStockThreshold || 10)
                            ? "text-red-400"
                            : "text-green-400"
                        }
                      >
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(product.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/products/${product.slug}`}>
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/wobifa888/products/${product.id}/edit`}>
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleDelete(product.id, getLocalized(product.name))}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400 mb-4">暂无产品</p>
              <Link href="/wobifa888/products/new">
                <Button className="bg-[oklch(82%_0.18_85)] hover:bg-[oklch(82%_0.18_85)]/90 text-slate-900">
                  <Plus className="w-4 h-4 mr-2" />
                  添加第一个产品
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
