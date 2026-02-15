import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useParams, useRoute } from "wouter";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import { storagePut } from "@/lib/storage";

export default function ProductForm() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const [, params] = useRoute("/admin/products/:id/edit");
  const productId = params?.id ? parseInt(params.id) : null;
  const isEditMode = productId !== null;

  // 表单状态
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    shortDescription: "",
    regularPrice: "",
    salePrice: "",
    sku: "",
    stock: "0",
    lowStockThreshold: "10",
    categoryId: "",
    status: "draft" as "draft" | "published" | "archived",
    featured: false,
    blessingTemple: "",
    blessingMaster: "",
    blessingDate: "",
    blessingDescription: "",
  });

  const [images, setImages] = useState<Array<{ url: string; fileKey: string; isPrimary: boolean }>>([]);
  const [uploading, setUploading] = useState(false);

  // 获取分类列表
  const { data: categories } = trpc.categories.list.useQuery();

  // TODO: 获取产品详情(编辑模式)
  // const { data: product, isLoading: loadingProduct } = trpc.admin.products.getById.useQuery(
  //   { productId: productId! },
  //   { enabled: isEditMode }
  // );
  const product = null as any;
  const loadingProduct = false;

  // 创建/更新产品
  const createMutation = trpc.admin.products.create.useMutation({
    onSuccess: () => {
      toast.success(isEditMode ? "产品已更新" : "产品已创建");
      navigate("/admin/products");
    },
    onError: (error: any) => {
      toast.error(error.message || "操作失败");
    },
  });

  // TODO: 更新产品mutation
  const updateMutation = {
    mutate: () => {},
    isPending: false,
  } as any;

  // 加载产品数据(编辑模式)
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description || "",
        shortDescription: product.shortDescription || "",
        regularPrice: product.regularPrice,
        salePrice: product.salePrice || "",
        sku: product.sku || "",
        stock: product.stock.toString(),
        lowStockThreshold: product.lowStockThreshold?.toString() || "10",
        categoryId: product.categoryId?.toString() || "",
        status: product.status,
        featured: product.featured || false,
        blessingTemple: product.blessingTemple || "",
        blessingMaster: product.blessingMaster || "",
        blessingDate: product.blessingDate ? new Date(product.blessingDate).toISOString().split("T")[0] : "",
        blessingDescription: product.blessingDescription || "",
      });
      if (product.images) {
        setImages(product.images.map((img: any) => ({
          url: img.url,
          fileKey: img.fileKey,
          isPrimary: img.isPrimary,
        })));
      }
    }
  }, [product]);

  // 自动生成slug
  const handleNameChange = (name: string) => {
    setFormData({ ...formData, name });
    if (!isEditMode) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  // 图片上传
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        // 生成随机文件名
        const randomSuffix = Math.random().toString(36).substring(2, 15);
        const fileKey = `products/${Date.now()}-${randomSuffix}.${file.name.split(".").pop()}`;
        
        // 读取文件
        const buffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);
        
        // 上传到S3
        const { url } = await storagePut(fileKey, uint8Array, file.type);
        
        setImages((prev) => [
          ...prev,
          {
            url,
            fileKey,
            isPrimary: prev.length === 0, // 第一张图片设为主图
          },
        ]);
      }
      toast.success("图片上传成功");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("图片上传失败");
    } finally {
      setUploading(false);
    }
  };

  // 删除图片
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 设置主图
  const handleSetPrimary = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 验证
    if (!formData.name || !formData.slug || !formData.regularPrice) {
      toast.error("请填写必填字段");
      return;
    }

    if (images.length === 0) {
      toast.error("请至少上传一张产品图片");
      return;
    }

    const productData = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      shortDescription: formData.shortDescription,
      regularPrice: parseFloat(formData.regularPrice),
      salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
      sku: formData.sku,
      stock: parseInt(formData.stock),
      lowStockThreshold: parseInt(formData.lowStockThreshold),
      categoryId: formData.categoryId ? parseInt(formData.categoryId) : undefined,
      status: formData.status,
      featured: formData.featured,
      blessingTemple: formData.blessingTemple,
      blessingMaster: formData.blessingMaster,
      blessingDate: formData.blessingDate ? new Date(formData.blessingDate) : undefined,
      blessingDescription: formData.blessingDescription,
      images: images.map((img, index) => ({
        url: img.url,
        fileKey: img.fileKey,
        isPrimary: img.isPrimary,
        displayOrder: index,
      })),
    };

    if (isEditMode) {
      updateMutation.mutate({ productId: productId!, ...productData });
    } else {
      createMutation.mutate(productData);
    }
  };

  if (isEditMode && loadingProduct) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-[oklch(82%_0.18_85)]" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl">
        {/* 页面标题 */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/products")}
            className="mb-4 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回产品列表
          </Button>
          <h1 className="text-3xl font-bold text-white">
            {isEditMode ? "编辑产品" : "添加产品"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本信息 */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="name" className="text-slate-300">
                    产品名称 *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="slug" className="text-slate-300">
                    URL别名 *
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="shortDescription" className="text-slate-300">
                    简短描述
                  </Label>
                  <Textarea
                    id="shortDescription"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                    rows={2}
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="description" className="text-slate-300">
                    详细描述
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                    rows={6}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 价格和库存 */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">价格和库存</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="regularPrice" className="text-slate-300">
                    原价 * ($)
                  </Label>
                  <Input
                    id="regularPrice"
                    type="number"
                    step="0.01"
                    value={formData.regularPrice}
                    onChange={(e) => setFormData({ ...formData, regularPrice: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="salePrice" className="text-slate-300">
                    促销价 ($)
                  </Label>
                  <Input
                    id="salePrice"
                    type="number"
                    step="0.01"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="sku" className="text-slate-300">
                    SKU
                  </Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="stock" className="text-slate-300">
                    库存数量 *
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="lowStockThreshold" className="text-slate-300">
                    低库存警告阈值
                  </Label>
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    value={formData.lowStockThreshold}
                    onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="categoryId" className="text-slate-300">
                    分类
                  </Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800">
                      <SelectItem value="">无分类</SelectItem>
                      {categories?.map((cat: any) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 产品图片 */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">产品图片 *</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url}
                        alt={`Product ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border-2 border-slate-700"
                      />
                      {image.isPrimary && (
                        <div className="absolute top-2 left-2 bg-[oklch(82%_0.18_85)] text-slate-900 text-xs px-2 py-1 rounded">
                          主图
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        {!image.isPrimary && (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleSetPrimary(index)}
                            className="bg-white text-slate-900 hover:bg-slate-200"
                          >
                            设为主图
                          </Button>
                        )}
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <Label
                    htmlFor="imageUpload"
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-[oklch(82%_0.18_85)] transition-colors"
                  >
                    {uploading ? (
                      <Loader2 className="w-8 h-8 animate-spin text-[oklch(82%_0.18_85)]" />
                    ) : (
                      <div className="text-center">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                        <span className="text-slate-400">点击上传图片</span>
                      </div>
                    )}
                  </Label>
                  <Input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 开光信息 */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">开光信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="blessingTemple" className="text-slate-300">
                    开光寺庙
                  </Label>
                  <Input
                    id="blessingTemple"
                    value={formData.blessingTemple}
                    onChange={(e) => setFormData({ ...formData, blessingTemple: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                    placeholder="例如: 五台山五爷庙"
                  />
                </div>

                <div>
                  <Label htmlFor="blessingMaster" className="text-slate-300">
                    开光大师
                  </Label>
                  <Input
                    id="blessingMaster"
                    value={formData.blessingMaster}
                    onChange={(e) => setFormData({ ...formData, blessingMaster: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="blessingDate" className="text-slate-300">
                    开光日期
                  </Label>
                  <Input
                    id="blessingDate"
                    type="date"
                    value={formData.blessingDate}
                    onChange={(e) => setFormData({ ...formData, blessingDate: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="blessingDescription" className="text-slate-300">
                    开光仪式说明
                  </Label>
                  <Textarea
                    id="blessingDescription"
                    value={formData.blessingDescription}
                    onChange={(e) => setFormData({ ...formData, blessingDescription: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 发布设置 */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">发布设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status" className="text-slate-300">
                    状态
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800">
                      <SelectItem value="draft">草稿</SelectItem>
                      <SelectItem value="published">已发布</SelectItem>
                      <SelectItem value="archived">已归档</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 pt-8">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-800"
                  />
                  <Label htmlFor="featured" className="text-slate-300 cursor-pointer">
                    设为精选产品
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 提交按钮 */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-[oklch(82%_0.18_85)] hover:bg-[oklch(82%_0.18_85)]/90 text-slate-900"
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {isEditMode ? "更新产品" : "创建产品"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/products")}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              取消
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
