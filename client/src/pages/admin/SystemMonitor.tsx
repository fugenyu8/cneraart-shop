import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import {
  Activity,
  RefreshCw,
  Server,
  Globe,
  Clock,
  HardDrive,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Zap,
  Timer,
} from "lucide-react";

function formatUptime(seconds: number): string {
  if (seconds < 60) return `${Math.floor(seconds)}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.floor(seconds % 60)}s`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours < 24) return `${hours}h ${minutes}m`;
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
}

function formatMemory(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function StatusIcon({ status }: { status: string }) {
  if (status === "online") return <CheckCircle2 className="w-5 h-5 text-green-400" />;
  if (status === "degraded") return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
  return <WifiOff className="w-5 h-5 text-red-400" />;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "online") return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">在线</Badge>;
  if (status === "degraded") return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">异常</Badge>;
  return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">离线</Badge>;
}

function ResponseTimeBadge({ ms }: { ms: number }) {
  if (ms === 0) return null;
  const color = ms < 500 ? "text-green-400" : ms < 1500 ? "text-yellow-400" : "text-red-400";
  const bgColor = ms < 500 ? "bg-green-500/10" : ms < 1500 ? "bg-yellow-500/10" : "bg-red-500/10";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono ${color} ${bgColor}`}>
      <Timer className="w-3 h-3" />
      {ms}ms
    </span>
  );
}

export default function SystemMonitor() {
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { data: systems, isLoading, refetch, isFetching } = trpc.admin.systemMonitor.getSystemStatus.useQuery(
    undefined,
    { refetchInterval: autoRefresh ? 15000 : false }
  );

  const onlineCount = systems?.filter((s) => s.status === "online").length || 0;
  const totalCount = systems?.length || 4;
  const avgResponseTime = systems
    ? Math.round(systems.reduce((sum, s) => sum + (s.responseTime || 0), 0) / systems.filter(s => s.responseTime > 0).length || 0)
    : 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">系统监控</h1>
            <p className="text-slate-400">
              实时监控四个系统的运行状态 · {onlineCount}/{totalCount} 在线
              {autoRefresh && <span className="text-green-400 ml-2">● 每15秒自动刷新</span>}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`border-slate-700 ${autoRefresh ? "text-green-400" : "text-slate-400"}`}
            >
              <Activity className="w-4 h-4 mr-1" />
              {autoRefresh ? "自动刷新: 开" : "自动刷新: 关"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="border-slate-700 text-slate-300"
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${isFetching ? "animate-spin" : ""}`} />
              刷新
            </Button>
          </div>
        </div>

        {/* 总览卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-green-500/10">
                  <Wifi className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">在线系统</p>
                  <p className="text-2xl font-bold text-white">{onlineCount}/{totalCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">平均响应</p>
                  <p className="text-2xl font-bold text-white">
                    {avgResponseTime > 0 ? `${avgResponseTime}ms` : "--"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-purple-500/10">
                  <Server className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">总系统数</p>
                  <p className="text-2xl font-bold text-white">{totalCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-amber-500/10">
                  <Clock className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">最后检查</p>
                  <p className="text-lg font-bold text-white">
                    {systems?.[0]?.lastChecked
                      ? new Date(systems[0].lastChecked).toLocaleTimeString("zh-CN")
                      : "--:--:--"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 系统详情卡片 */}
        {isLoading ? (
          <div className="text-center py-12 text-slate-400">
            <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin" />
            正在检测系统状态...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {systems?.map((sys) => (
              <Card key={sys.domain} className="bg-slate-900/50 border-slate-800 overflow-hidden">
                {/* 状态条 */}
                <div
                  className={`h-1 ${
                    sys.status === "online"
                      ? "bg-green-500"
                      : sys.status === "degraded"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                />
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <StatusIcon status={sys.status} />
                      <div>
                        <CardTitle className="text-white text-lg">{sys.name}</CardTitle>
                        <a
                          href={`https://${sys.domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-slate-400 hover:text-blue-400 flex items-center gap-1"
                        >
                          {sys.domain}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <StatusBadge status={sys.status} />
                      <ResponseTimeBadge ms={sys.responseTime || 0} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sys.status === "online" ? (
                    <>
                      {/* 运行时间 */}
                      {sys.uptime > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400 flex items-center gap-2">
                            <Clock className="w-4 h-4" /> 运行时间
                          </span>
                          <span className="text-white font-medium">{formatUptime(sys.uptime)}</span>
                        </div>
                      )}
                      {/* 内存使用 */}
                      {sys.memory && (
                        <>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400 flex items-center gap-2">
                              <HardDrive className="w-4 h-4" /> 堆内存
                            </span>
                            <span className="text-white font-medium">
                              {formatMemory(sys.memory.heapUsed)} / {formatMemory(sys.memory.heapTotal)}
                            </span>
                          </div>
                          {/* 内存使用率进度条 */}
                          <div className="w-full bg-slate-800 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                sys.memory.heapUsed / sys.memory.heapTotal > 0.8
                                  ? "bg-red-500"
                                  : sys.memory.heapUsed / sys.memory.heapTotal > 0.6
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }`}
                              style={{ width: `${Math.min((sys.memory.heapUsed / sys.memory.heapTotal) * 100, 100)}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400 flex items-center gap-2">
                              <HardDrive className="w-4 h-4" /> RSS
                            </span>
                            <span className="text-white font-medium">{formatMemory(sys.memory.rss)}</span>
                          </div>
                        </>
                      )}
                      {/* 版本 */}
                      {sys.version && sys.version !== 'unknown' && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400 flex items-center gap-2">
                            <Globe className="w-4 h-4" /> 版本
                          </span>
                          <span className="text-white font-mono text-xs">
                            {sys.version?.substring(0, 8)}
                          </span>
                        </div>
                      )}
                      {/* 无详细信息时的提示 */}
                      {!sys.uptime && !sys.memory && (
                        <div className="py-2 text-center">
                          <p className="text-slate-500 text-sm">服务在线，无详细运行数据</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="py-4 text-center">
                      <WifiOff className="w-8 h-8 mx-auto mb-2 text-red-400/50" />
                      <p className="text-red-400 text-sm">
                        {(sys as any).error || "无法连接到服务器"}
                      </p>
                      <p className="text-slate-500 text-xs mt-1">请检查部署状态</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
