import type { TemplateInfo, InvitationTemplateProps } from './types'
import { Template01ClassicGold } from './Template01ClassicGold'
import { Template02RoseGarden } from './Template02RoseGarden'
import { Template03RoyalNavy } from './Template03RoyalNavy'
import { Template04BlushMinimal } from './Template04BlushMinimal'
import { Template05EmeraldLuxury } from './Template05EmeraldLuxury'
import { Template06SunsetOmbre } from './Template06SunsetOmbre'
import { Template07ArabicCalligraphy } from './Template07ArabicCalligraphy'
import { Template08LavenderDream } from './Template08LavenderDream'
import { Template09BurgundyVelvet } from './Template09BurgundyVelvet'
import { Template10OceanBreeze } from './Template10OceanBreeze'
import { Template11MidnightGold } from './Template11MidnightGold'
import { Template12CherryBlossom } from './Template12CherryBlossom'
import { Template13TerracottaBoho } from './Template13TerracottaBoho'
import { Template14IvoryLace } from './Template14IvoryLace'
import { Template15SageEucalyptus } from './Template15SageEucalyptus'
import { Template16DustyBlue } from './Template16DustyBlue'
import { Template17MoroccanTiles } from './Template17MoroccanTiles'
import { Template18PeachWatercolor } from './Template18PeachWatercolor'
import { Template19StarryNight } from './Template19StarryNight'
import { Template20CoralReef } from './Template20CoralReef'

export type { InvitationTemplateProps, TemplateInfo } from './types'

export const templateComponents: Record<number, React.ComponentType<InvitationTemplateProps>> = {
  1: Template01ClassicGold,
  2: Template02RoseGarden,
  3: Template03RoyalNavy,
  4: Template04BlushMinimal,
  5: Template05EmeraldLuxury,
  6: Template06SunsetOmbre,
  7: Template07ArabicCalligraphy,
  8: Template08LavenderDream,
  9: Template09BurgundyVelvet,
  10: Template10OceanBreeze,
  11: Template11MidnightGold,
  12: Template12CherryBlossom,
  13: Template13TerracottaBoho,
  14: Template14IvoryLace,
  15: Template15SageEucalyptus,
  16: Template16DustyBlue,
  17: Template17MoroccanTiles,
  18: Template18PeachWatercolor,
  19: Template19StarryNight,
  20: Template20CoralReef,
}

export const templateRegistry: TemplateInfo[] = [
  { id: 1,  name: 'Classic Gold',          nameAr: 'الذهب الكلاسيكي',       category: 'classic',    colors: { primary: '#C9A96E', secondary: '#FFF8F0', accent: '#3D2B1F' } },
  { id: 2,  name: 'Rose Garden',           nameAr: 'حديقة الورد',           category: 'floral',     colors: { primary: '#D4829D', secondary: '#FFF5F5', accent: '#6B3A4F' } },
  { id: 3,  name: 'Royal Navy',            nameAr: 'الأزرق الملكي',         category: 'luxury',     colors: { primary: '#8896B5', secondary: '#1B2A4A', accent: '#FFFFFF' } },
  { id: 4,  name: 'Blush Minimal',         nameAr: 'البساطة الوردية',       category: 'minimalist', colors: { primary: '#D4829D', secondary: '#FFFFFF', accent: '#2D2D2D' } },
  { id: 5,  name: 'Emerald Luxury',        nameAr: 'الزمرد الفاخر',         category: 'luxury',     colors: { primary: '#C9A96E', secondary: '#164A38', accent: '#E8DFC8' } },
  { id: 6,  name: 'Sunset Ombré',          nameAr: 'غروب الشمس',           category: 'modern',     colors: { primary: '#D4956A', secondary: '#FFF5EB', accent: '#7A4B2A' } },
  { id: 7,  name: 'Arabic Calligraphy',    nameAr: 'الخط العربي',           category: 'cultural',   colors: { primary: '#C9A96E', secondary: '#F8F4E8', accent: '#5A4010' } },
  { id: 8,  name: 'Lavender Dream',        nameAr: 'حلم اللافندر',          category: 'modern',     colors: { primary: '#B794F4', secondary: '#F5F0FF', accent: '#553C9A' } },
  { id: 9,  name: 'Burgundy Velvet',       nameAr: 'المخمل العنابي',        category: 'luxury',     colors: { primary: '#C9A96E', secondary: '#4A0E1F', accent: '#F5E6D0' } },
  { id: 10, name: 'Ocean Breeze',          nameAr: 'نسيم المحيط',           category: 'modern',     colors: { primary: '#38B2AC', secondary: '#E0F4F4', accent: '#234E52' } },
  { id: 11, name: 'Midnight & Gold',       nameAr: 'منتصف الليل والذهب',    category: 'luxury',     colors: { primary: '#C9A96E', secondary: '#111111', accent: '#FFFFFF' } },
  { id: 12, name: 'Cherry Blossom',        nameAr: 'أزهار الكرز',           category: 'floral',     colors: { primary: '#FFB6C1', secondary: '#FFF5F7', accent: '#8B4060' } },
  { id: 13, name: 'Terracotta Boho',       nameAr: 'البوهيمي الترابي',      category: 'cultural',   colors: { primary: '#C4856C', secondary: '#FDF6F0', accent: '#8B5A3C' } },
  { id: 14, name: 'Ivory Lace',            nameAr: 'الدانتيل العاجي',       category: 'classic',    colors: { primary: '#C9B896', secondary: '#FFFEF8', accent: '#4A3F30' } },
  { id: 15, name: 'Sage & Eucalyptus',     nameAr: 'الأوكالبتوس الأخضر',    category: 'floral',     colors: { primary: '#6B8E6B', secondary: '#F5FAF0', accent: '#3D5A3D' } },
  { id: 16, name: 'Dusty Blue',            nameAr: 'الأزرق الباهت',         category: 'minimalist', colors: { primary: '#7B9EC4', secondary: '#EEF2F7', accent: '#3A5A7C' } },
  { id: 17, name: 'Moroccan Tiles',        nameAr: 'بلاط مغربي',           category: 'cultural',   colors: { primary: '#1A5F7A', secondary: '#FFFDF5', accent: '#0D3347' } },
  { id: 18, name: 'Peach Watercolor',      nameAr: 'ألوان مائية خوخية',     category: 'playful',    colors: { primary: '#E08060', secondary: '#FFFFFF', accent: '#7A4030' } },
  { id: 19, name: 'Starry Night',          nameAr: 'ليلة مرصّعة بالنجوم',   category: 'modern',     colors: { primary: '#FFD700', secondary: '#0C1445', accent: '#FFFFFF' } },
  { id: 20, name: 'Coral Reef (OurBride)', nameAr: 'المرجان (عروستنا)',     category: 'playful',    colors: { primary: '#F14836', secondary: '#FFF5F3', accent: '#2D2D2D' } },
]

export const getTemplateComponent = (id: number): React.ComponentType<InvitationTemplateProps> | null => {
  return templateComponents[id] || null
}

export const getCategoryLabel = (category: TemplateInfo['category']): string => {
  const labels: Record<string, string> = {
    classic: 'Classic',
    modern: 'Modern',
    floral: 'Floral',
    luxury: 'Luxury',
    minimalist: 'Minimalist',
    cultural: 'Cultural',
    playful: 'Playful',
  }
  return labels[category] || category
}
