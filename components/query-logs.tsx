import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDateTime } from "@/lib/utils"
import type { LogEntry } from "@/types"

interface QueryLogsProps {
  logs: LogEntry[]
}

export function QueryLogs({ logs }: QueryLogsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>İstek Logları</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-2">
            {logs.map((log, index) => (
              <div key={index} className="p-3 border rounded-lg text-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono">{log.kimlikNo}</span>
                  <Badge variant={log.status === "success" ? "default" : "destructive"}>
                    {log.status === "success" ? "Başarılı" : "Hata"}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Kod: {log.responseCode}</div>
                  <div>Süre: {log.responseTime}ms</div>
                  <div>{formatDateTime(log.timestamp)}</div>
                  {log.error && <div className="text-red-600">Hata: {log.error}</div>}
                </div>
              </div>
            ))}
            {logs.length === 0 && <div className="text-center text-muted-foreground py-8">Henüz log yok</div>}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
