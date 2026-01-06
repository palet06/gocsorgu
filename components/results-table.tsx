import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { QueryResult } from "@/types"

interface ResultsTableProps {
  results: QueryResult[]
}

export function ResultsTable({ results }: ResultsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sorgu Sonuçları ({results.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border max-h-96 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>YKN</TableHead>
                <TableHead>Ad</TableHead>
                <TableHead>Soyad</TableHead>
                <TableHead>İzin Türü</TableHead>
                <TableHead>Gerekçe</TableHead>
                <TableHead>İzin Başlangıç Tarihi</TableHead>
                <TableHead>İzin Bitiş Tarihi</TableHead>
                <TableHead>Pasaport No</TableHead>
                <TableHead>Pasaport Düzenleme Tarihi</TableHead>
                <TableHead>Pasaport Geçerlilik Tarihi</TableHead>
                <TableHead>Pasaport Veren Makam</TableHead>
                <TableHead>Pasaport Veren Ülke</TableHead>
                <TableHead>Durum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono">{result.ykn}</TableCell>
                  <TableCell>{result.ad}</TableCell>
                  <TableCell>{result.soyad}</TableCell>
                  <TableCell>{result.izinTuru}</TableCell>
                  <TableCell className="max-w-xs truncate" title={result.gerekce}>
                    {result.gerekce}
                  </TableCell>
                  <TableCell>{result.izinBaslangicTarihi}</TableCell>
                  <TableCell>{result.izinBitisTarihi}</TableCell>
                  <TableCell>{result.pasaportNo}</TableCell>
                  <TableCell>{result.pasaportDuzenlemeTarihi}</TableCell>
                  <TableCell>{result.pasaportGecerlilikTarihi}</TableCell>
                  <TableCell>{result.pasaportVerenMakam}</TableCell>
                  <TableCell>{result.pasaportVerenUlke}</TableCell>
                  
                  <TableCell>
                    <Badge variant={result.status === "Başarılı" ? "default" : "destructive"}>{result.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
              {results.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Henüz sonuç yok
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
