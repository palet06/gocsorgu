export interface QueryResult {
  ykn: string
  ad: string
  soyad: string
  pasaportNo: string
  pasaportDuzenlemeTarihi: string
  pasaportGecerlilikTarihi: string
  pasaportVerenMakam: string 
   pasaportVerenUlke:string
  izinTuru: string
  gerekce: string
  izinBaslangicTarihi: string
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
    kisi:{
      yabanciKimlikNo: string
      ad: string
      soyad: string
      pasaport:{
        belgeNo:string
        duzenlemeTarih:string
        gecerlilikTarih:string
        verenMakam:string
        verenUlke:string
      }
    },
    ikametOzetList: Array<{
      verilisNedeni: string
      baslangicTarihi: string, // burayı eklemeyi unutma

      bitisTarihi: string
    }>
    ikametIzniBilgileriList: Array<{
      baslangicTarihi: string
      bitisTarihi: string
      aileDestekleyiciTur?: number
      kisaDonemKalisNeden?: number
      ogrenciKalisNeden?: number
      insaniIkametIzniKalisNeden?: number
      turkSoylu?: number
    }>
  }
}
