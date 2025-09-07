export interface QueryResult {
  ykn: string
  ad: string
  soyad: string
  izinTuru: string
  gerekce: string
  izinBitisTarihi: string
  status: "Başarılı" | "Hata"
}

export interface LogEntry {
  kimlikNo: string
  status: "success" | "error"
  responseCode: number
  responseTime: number
  timestamp: Date
  error?: string
}

export interface ApiResponse {
  success: boolean
  message?: string
  data?: {
    yabanciKimlikNo: string
    ad: string
    soyad: string
    ikametOzetList: Array<{
      verilisNedeni: string
      bitisTarihi: string
    }>
    ikametIzniBilgileriList: Array<{
      bitisTarihi: string
      aileDestekleyiciTur?: number
      kisaDonemKalisNeden?: number
      ogrenciKalisNeden?: number
      insaniIkametIzniKalisNeden?: number
      turkSoylu?: number
    }>
  }
}
