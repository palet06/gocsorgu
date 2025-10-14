import {
  kisaDonemNedenleri,
  uzunDonemTurkSoylu,
  insaniIkametNedenleri,
  aileDestekleyiciTur,
  ogrenciKalisNeden,
} from "./mappings"
import type { ApiResponse, QueryResult } from "@/types"

export function processApiResponse(kimlikNo: string, response: ApiResponse): QueryResult {
  

  if (!response.success || !response.data) {
    
    return {
      ykn: kimlikNo,
      ad: "Veri Yok",
      soyad: "Veri Yok",
      izinTuru: "Veri Yok",
      gerekce: `API Hatası: ${response.message || "Bilinmeyen hata"}`,
      izinBitisTarihi: "Veri Yok",
      status: "Hata",
    }
  }

  const data = response.data
  

  // Basic info - fields are nested under data.kisi
  const kisi = data.kisi || {}
  const ykn = kisi.yabanciKimlikNo || kimlikNo
  const ad = kisi.ad || "Veri Yok"
  const soyad = kisi.soyad || "Veri Yok"


  // Find the latest record from ikametOzetList (under kisi)
  let latestOzetRecord = null
  let latestDate = new Date(0)

  if (kisi.ikametOzetList && kisi.ikametOzetList.length > 0) {

    const today = new Date()
    for (const record of kisi.ikametOzetList) {

      try {
        // Check if baslangicTarihi exists
        if (!record.baslangicTarihi) {

          continue
        }

        if (record.sonlandirmaTarihi || record.iptalTarihi || record.iptalSonlandirmaTarihi) {
          
          continue
        }

        // Check if bitisTarihi is null or in the future
        let isActive = false
        if (!record.bitisTarihi) {
          // No end date means it's still active
          isActive = true
          
        } else {
          const bitisDate = new Date(record.bitisTarihi)
          if (!isNaN(bitisDate.getTime()) && bitisDate > today) {
            // End date is in the future
            isActive = true
           
          } else {
           
          }
        }

        if (isActive) {
          const date = record.bitisTarihi ? new Date(record.bitisTarihi) : new Date(8640000000000000) // Max date if no end date
          if (!isNaN(date.getTime()) && date > latestDate) {
            latestDate = date
            latestOzetRecord = record
           
          }
        }
      } catch (error) {
        
      }
    }
  }

  let izinTuru = "Veri Yok"
  let izinBitisTarihi = "Veri Yok"
  let gerekce = "Veri Yok"

  if (latestOzetRecord) {
    console.log("latest record",latestOzetRecord)
    
    izinTuru = latestOzetRecord.verilisNedeni || "Veri Yok"
    izinBitisTarihi = (latestOzetRecord.bitisTarihi ? formatDate(latestOzetRecord.bitisTarihi):"İzin Bitiş Tarihi Yok") || (latestOzetRecord.iptalSonlandirmaTarihi?formatDate(latestOzetRecord.iptalSonlandirmaTarihi): "İzin Bitiş Tarihi Yok")
    

    // Process gerekce according to complex rules
    gerekce = processGerekce(latestOzetRecord.verilisNedeni, data.ikametIzniBilgileriList)
    
  } else {
    
  }

  const result = {
    ykn,
    ad,
    soyad,
    izinTuru,
    gerekce,
    izinBitisTarihi,
    status: "Başarılı",
  }

  
  return result
}

function processGerekce(verilisNedeni: string, ikametIzniBilgileriList: any[]): string {
 

  if (!ikametIzniBilgileriList || ikametIzniBilgileriList.length === 0) {
 
    return "Veri Yok"
  }

  // Find the latest record from ikametIzniBilgileriList
  let latestIzinRecord = null
  let latestDate = new Date(0)

  console.log("[v0] Processing ikametIzniBilgileriList:", ikametIzniBilgileriList)
  for (const record of ikametIzniBilgileriList) {
 
    try {
      const date = new Date(record.bitisTarihi)
      if (!isNaN(date.getTime()) && date > latestDate) {
        latestDate = date
        latestIzinRecord = record
 
      }
    } catch (error) {
      console.log("[v0] Error processing izin record date:", error)
    }
  }

  if (!latestIzinRecord) {
    
    return "Veri Yok"
  }

  

  // Rule 1: If verilisNedeni is "Aile", check aileDestekleyiciTur first
  if (verilisNedeni === "Aile" && latestIzinRecord.aileDestekleyiciTur) {
    console.log("[v0] Checking aileDestekleyiciTur:", latestIzinRecord.aileDestekleyiciTur)
    const mapped = aileDestekleyiciTur[latestIzinRecord.aileDestekleyiciTur as keyof typeof aileDestekleyiciTur]
    if (mapped) {
      console.log("[v0] Found aileDestekleyiciTur mapping:", mapped)
      return mapped
    }
  }

  // Check other fields in priority order
  if (latestIzinRecord.kisaDonemKalisNeden) {
    
    const mapped = kisaDonemNedenleri[latestIzinRecord.kisaDonemKalisNeden as keyof typeof kisaDonemNedenleri]
    if (mapped) {
      
      return mapped + " (Kısa Dönem)"
    }
  }

  if (latestIzinRecord.ogrenciKalisNeden) {
    
    const mapped = ogrenciKalisNeden[latestIzinRecord.ogrenciKalisNeden as keyof typeof ogrenciKalisNeden]
    if (mapped) {
    
      return mapped + " (Öğrenci)"
    }
  }

  if (latestIzinRecord.insaniIkametIzniKalisNeden) {
    
    const mapped =
      insaniIkametNedenleri[latestIzinRecord.insaniIkametIzniKalisNeden as keyof typeof insaniIkametNedenleri]
    if (mapped) {
      
      return mapped + " (İnsani)"
    }
  }

  if (latestIzinRecord.turkSoylu) {
    
    const mapped = uzunDonemTurkSoylu[latestIzinRecord.turkSoylu as keyof typeof uzunDonemTurkSoylu]
    if (mapped) {
      
      return mapped + " (Uzun Dönem)"
    }
  }

  
  return "Veri Yok"
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return "Veri Yok"
    }

    return date.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Europe/Istanbul",
    })
  } catch {
    return "Veri Yok"
  }
}
