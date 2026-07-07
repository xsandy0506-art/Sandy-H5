import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, BookOpen, Utensils, Sparkles, Clock, CheckCircle2, Calendar, Heart, X, Volume2, VolumeX } from 'lucide-react'

const REMOTE = {
  schemePlan: '/scheme-plan.jpg',
  nightAerial: '/night-aerial.jpg',
  dayAerial: '/day-aerial.jpg',
  entrance: '/welcome-gate.jpg',
  centerLantern: '/center-lantern.jpg',
  waterfront: '/waterfront.jpg',
  gallery: '/gallery.jpg',
  promenade: '/promenade.jpg',
}

const LOCAL = {
  schemePlan: '/scheme-plan.jpg',
  nightAerial: '/night-aerial.jpg',
  dayAerial: '/day-aerial.jpg',
  entrance: '/welcome-gate.jpg',
  centerLantern: '/center-lantern.jpg',
  waterfront: '/waterfront.jpg',
  gallery: '/gallery.jpg',
  promenade: '/promenade.jpg',
}

const SCENES_META = [
  { id: 'scheme',     key: 'schemePlan',    name: '建筑总览', icon: '🏛', desc: '忠信花灯·客家海宴建筑方案全景图', video: null },
  { id: 'entrance',   key: 'entrance',      name: '迎灯门', icon: '🚪', desc: '客家迎客礼仪，步入千年客韵',   video: '/panorama-2.mp4' },
  { id: 'center',     key: 'centerLantern', name: '花灯阵', icon: '🏮', desc: '中心巨型花灯，光影随视角变幻', video: '/panorama-3.mp4' },
  { id: 'waterfront', key: 'waterfront',    name: '临水宴', icon: '🌊', desc: '黄昏微醺，入夜宴饮，绝佳观景', video: '/panorama-4.mp4' },
  { id: 'gallery',    key: 'gallery',       name: '展长廊', icon: '🖼', desc: '非遗传承，客家文化深度体验',   video: '/panorama-5.mp4' },
  { id: 'promenade',  key: 'promenade',     name: '滨海道', icon: '🏖', desc: '海风拂面，远眺珠海城市天际线', video: '/panorama-6.mp4' },
]

// 本地全景视频（首页点亮花灯后播放）
const PANORAMA_VIDEO = '/panorama.mp4'

const MENU_ITEMS = [
  {
    id: 'tofu', name: '花好月圆', subtitle: '客家酿豆腐', tag: '非遗技艺', price: '¥88',
    desc: '以手工嫩豆腐为皮，填入秘制猪肉鱼肉馅料，以客家古法文火慢煮。豆腐嫩滑细腻，内馅鲜香饱满，是客家宴席不可缺席的灵魂菜肴。',
    ingredients: ['手工豆腐', '猪肉', '鱼肉', '葱姜', '非遗配方'],
    bgColor: '#fef9ec', accent: '#d97706',
  },
  {
    id: 'chicken', name: '灯火可亲', subtitle: '古法粗盐焗鸡', tag: '古法工艺', price: '¥168',
    desc: '选用珠海散养走地鸡，以千年传承粗盐焗法烹制。沙姜玫瑰露腌制入味，炒热大粒海盐焗制，皮脆肉嫩，咸香鲜甜，是客家宴席的压轴之作。',
    ingredients: ['走地鸡', '粗海盐', '沙姜', '玫瑰露酒', '香叶'],
    bgColor: '#fffbeb', accent: '#b45309',
  },
  {
    id: 'oyster', name: '海韵客情', subtitle: '珠海鲜蚝烙', tag: '海鲜臻品', price: '¥128',
    desc: '珠海桂山岛直送新鲜生蚝，以客家传统煎烙手法，配红薯粉浆、鸡蛋、葱花，煎至两面金黄酥脆。蚝肉鲜嫩多汁，海陆风情完美融合。',
    ingredients: ['桂山岛生蚝', '红薯粉', '鲜鸡蛋', '葱花', '海鲜酱'],
    bgColor: '#ecfdf5', accent: '#065f46',
  },
  {
    id: 'dumpling', name: '竹报平安', subtitle: '传统客家笋粄', tag: '传统手作', price: '¥58',
    desc: '以粘米粉制皮，包入本地鲜竹笋、猪肉、虾仁馅料，手工捏制蒸制而成。皮薄馅丰，笋香清甜，是客家年节必备的吉祥食品。',
    ingredients: ['鲜竹笋', '粘米粉', '猪肉', '虾仁', '香菇'],
    bgColor: '#f0fdf4', accent: '#166534',
  },
]

const BLESSINGS = ['风调雨顺', '国泰民安', '岁岁平安', '阖家欢乐']

const PACKAGE_DATA = [
  {
    id: 'couple',
    name: '两人花灯夜宴',
    subtitle: '浪漫双人套餐',
    price: '¥688',
    badge: '热门推荐',
    bgFrom: '#7f1d1d', bgTo: '#b91c1c',
    accent: '#fbbf24',
    desc: '在花灯的柔光下，与最重要的人共享一席客家盛宴。专属布景打卡、手作花灯体验，让每一个瞬间都成为珍贵的记忆。',
    includes: ['特色花灯套餐 × 2 份', '手作花灯体验（两人）', '专属花灯打卡布景', '应季迎宾鲜花', '主厨推荐甜品'],
  },
  {
    id: 'vip',
    name: '非遗主灯私宴',
    subtitle: '尊享包场套餐',
    price: '¥3888',
    badge: '尊享首选',
    bgFrom: '#78350f', bgTo: '#d97706',
    accent: '#fef3c7',
    desc: '独享主灯包场空间，非遗传承人现场讲解花灯制作工艺，8 道招牌客家菜配套，定制专属花灯一盏带走，是送礼宴请的极致之选。',
    includes: ['主灯区域全场包场', '非遗传承人工艺讲解', '8 道招牌客家菜', '定制花灯一盏（带走）', '私人管家全程服务'],
  },
]

const HISTORY_DATA = [
  {
    id: 'song',
    era: '宋 · 960—1279',
    title: '宋代起源',
    icon: '灯',
    color: '#1a3a6e',
    accent: '#fbbf24',
    animType: 'lattice',
    desc: '忠信花灯发祥于宋代，初为客家先民祭祖祈福之用，以竹篾为骨、彩纸糊面，承载家族繁衍与岁岁平安的美好愿景。彼时花灯形制简朴，却蕴含客家人对故土与祖先的深厚情感，每逢元宵，万灯齐明，蔚为壮观。',
    quote: '竹篾编骨，彩纸糊面，一盏花灯点亮客家人的精神家园。',
  },
  {
    id: 'ming',
    era: '明清 · 1368—1912',
    title: '明清兴盛',
    icon: '花',
    color: '#7f1d1d',
    accent: '#fde68a',
    animType: 'bloom',
    desc: '明清时期，忠信花灯成为元宵节盛典的核心，造型愈加精巧繁复。刺绣、剪纸、蜡染工艺相继融入，花灯图案吉祥富丽，形成独特的客家美学体系，制灯亦成为家族荣耀与工匠尊严的象征。',
    quote: '工艺集百家之长，一盏花灯承载一门百年风华。',
  },
  {
    id: 'modern',
    era: '当代 · 20世纪',
    title: '现代传承',
    icon: '匠',
    color: '#78350f',
    accent: '#fed7aa',
    animType: 'weave',
    desc: '二十世纪，忠信花灯被列入国家级非物质文化遗产名录。传承人坚守手工技艺，以师徒制延续千年匠心，在机械化浪潮中守护一份珍贵的文化基因，并走进校园与社区，让非遗薪火代代相传。',
    quote: '非遗匠心，薪火相传，手中的花灯是对祖先最深的敬意。',
  },
  {
    id: 'zhuhai',
    era: '珠海 · 当下',
    title: '珠海新生',
    icon: '海',
    color: '#0c4a6e',
    accent: '#7dd3fc',
    animType: 'ripple',
    desc: '扎根珠海，忠信花灯在海滨城市焕发新生。与现代光影技术深度融合，打造沉浸式文化体验，让古老非遗照亮当代生活。客家海宴餐厅以花灯为媒，在珠江入海口续写千年故事。',
    quote: '古灯新火，海风为证，在珠海续写花灯的千年传奇。',
  },
]

const CRAFT_COLORS = [
  { id: 'red',    name: '嫣红', hex: '#dc2626', light: '#fca5a5', dark: '#991b1b' },
  { id: 'gold',   name: '金黄', hex: '#d97706', light: '#fde68a', dark: '#92400e' },
  { id: 'blue',   name: '天蓝', hex: '#0284c7', light: '#bae6fd', dark: '#075985' },
  { id: 'purple', name: '瑞紫', hex: '#7c3aed', light: '#ddd6fe', dark: '#4c1d95' },
  { id: 'green',  name: '墨绿', hex: '#16a34a', light: '#bbf7d0', dark: '#14532d' },
]

const CRAFT_PATTERNS = [
  { id: 'peony',    name: '牡丹', char: '花', desc: '花开富贵' },
  { id: 'blessing', name: '福字', char: '福', desc: '五福临门' },
  { id: 'fish',    name: '鱼纹', char: '鱼', desc: '年年有余' },
  { id: 'cloud',   name: '云纹', char: '祥', desc: '祥云瑞气' },
]

const SPARKLE_POS = [
  [10,15],[30,5],[55,12],[78,8],[92,22],[8,48],
  [93,42],[4,68],[96,62],[18,82],[72,78],[48,88],
]

const POSTER_STYLES = [
  {
    id: 'gold', label: '红金喜庆',
    bg: 'linear-gradient(165deg, #7f1d1d 0%, #9f2424 50%, #7f1d1d 100%)',
    frame: '#d97706', titleColor: '#fbbf24', subColor: 'rgba(253,230,138,0.7)',
    blessColor: '#fde68a', bottomColor: 'rgba(253,230,138,0.55)',
  },
  {
    id: 'ink', label: '水墨写意',
    bg: '#faf5ef',
    frame: '#a8a29e', titleColor: '#1c1917', subColor: '#78716c',
    blessColor: '#292524', bottomColor: '#a8a29e',
  },
  {
    id: 'neon', label: '霾虹夜光',
    bg: 'linear-gradient(150deg, #0c0a20 0%, #0f052a 55%, #0a0c1e 100%)',
    frame: '#6d28d9', titleColor: '#a78bfa', subColor: '#7dd3fc',
    blessColor: '#e879f9', bottomColor: '#7dd3fc',
  },
  {
    id: 'floral', label: '花鸟古典',
    bg: 'linear-gradient(145deg, #fdf2f8 0%, #fff7ed 60%, #fdf2f8 100%)',
    frame: '#f9a8d4', titleColor: '#9d174d', subColor: '#be185d',
    blessColor: '#db2777', bottomColor: '#be185d',
  },
]

const POSTER_TEXTS = [
  {
    id: 'blessing',
    subtitle: '客家海宴 · 专属祈福花灯',
    bottomText: '愿灯火长明 · 万事顺遂',
    url: '客家海宴 ・ 珠海忐信花灯'
  },
  {
    id: 'heritage',
    subtitle: '非遗传承 · 千年工艺复兴',
    bottomText: '一盏花灯 · 一份美好祝福',
    url: '忠信花灯 ・ 客家文化体验'
  },
  {
    id: 'reunion',
    subtitle: '元宵月圆 · 灯下团聚时刻',
    bottomText: '灯下相聚 · 共享欢乐时光',
    url: '珠海客家海宴 ・ 非遗手作体验'
  },
  {
    id: 'modern',
    subtitle: '古韵新意 · 花灯艺术展厅',
    bottomText: '致敬传统 · 拥抱美好未来',
    url: '赏花灯 品海宴 ・ 客家风情体验'
  }
]

function probeImage(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = src
  })
}

const FloatingLanterns = () => {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const newParticles = Array.from({ length: 18 }).map((_, index) => ({
      id: index,
      left: Math.random() * 92 + 4,
      size: Math.random() * 14 + 10,
      duration: Math.random() * 7 + 9,
      delay: Math.random() * 4,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="floating-lanterns">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="lantern-particle"
          style={{ left: `${particle.left}%`, width: particle.size, height: particle.size * 1.4 }}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: -420, opacity: [0, 0.8, 0.8, 0] }}
          transition={{ duration: particle.duration, delay: particle.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  )
}

const LanternPreview = ({ shape }) => {
  if (shape === '八角') {
    return (
      <div className="lantern-preview octagon">
        <div className="lantern-top" />
        <div className="lantern-body octagon-shape" />
      </div>
    )
  }

  if (shape === '宫灯') {
    return (
      <div className="lantern-preview palace">
        <div className="lantern-top" />
        <div className="lantern-body palace-shape" />
      </div>
    )
  }

  return (
    <div className="lantern-preview round">
      <div className="lantern-top" />
      <div className="lantern-body round-shape" />
    </div>
  )
}

const MasterLantern = () => (
  <div className="master-lantern-wrap">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="glow-ring"
        animate={{ scale: [1, 2.6], opacity: [0.55, 0] }}
        transition={{ duration: 2.4, delay: i * 0.75, repeat: Infinity, ease: 'easeOut' }}
      />
    ))}
    <motion.svg
      className="auspicious-ring"
      viewBox="0 0 200 200"
      animate={{ rotate: 360 }}
      transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
    >
      <circle cx="100" cy="100" r="88" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="6 5" opacity="0.45" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2
        const x = 100 + Math.cos(a) * 88
        const y = 100 + Math.sin(a) * 88
        return <circle key={i} cx={x} cy={y} r="5" fill="#fbbf24" opacity="0.8" />
      })}
      {Array.from({ length: 8 }, (_, i) => {
        const a = ((i + 0.5) / 8) * Math.PI * 2
        const x = 100 + Math.cos(a) * 72
        const y = 100 + Math.sin(a) * 72
        return <rect key={i} x={x - 5} y={y - 5} width="10" height="10" fill="#f97316" opacity="0.6" transform={`rotate(45 ${x} ${y})`} />
      })}
    </motion.svg>
    <motion.svg
      className="master-lantern-svg"
      viewBox="0 0 100 150"
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: [1, 1.04, 1], opacity: 1 }}
      transition={{
        scale: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
        opacity: { duration: 0.7, delay: 0.3 },
      }}
    >
      <defs>
        <radialGradient id="mlBodyGrad" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="35%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#9a3412" />
        </radialGradient>
        <radialGradient id="mlGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef9c3" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
        <filter id="mlBlur">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      {/* top string */}
      <line x1="50" y1="0" x2="50" y2="10" stroke="#fbbf24" strokeWidth="2" />
      {/* top cap */}
      <rect x="32" y="10" width="36" height="8" rx="4" fill="#b45309" />
      <ellipse cx="50" cy="20" rx="26" ry="6" fill="#d97706" />
      {/* body glow blur */}
      <ellipse cx="50" cy="80" rx="32" ry="52" fill="url(#mlGlow)" filter="url(#mlBlur)" opacity="0.7" />
      {/* body */}
      <path d="M 24 20 Q 4 55 4 80 Q 4 110 24 130 L 76 130 Q 96 110 96 80 Q 96 55 76 20 Z" fill="url(#mlBodyGrad)" />
      {/* horizontal deco lines */}
      <line x1="18" y1="50" x2="82" y2="50" stroke="#fbbf24" strokeWidth="1" opacity="0.5" />
      <line x1="10" y1="80" x2="90" y2="80" stroke="#fbbf24" strokeWidth="1" opacity="0.5" />
      <line x1="18" y1="110" x2="82" y2="110" stroke="#fbbf24" strokeWidth="1" opacity="0.5" />
      {/* 福 character */}
      <text x="50" y="96" textAnchor="middle" fontSize="38" fill="rgba(255,255,255,0.92)" fontWeight="bold" fontFamily="serif">福</text>
      {/* bottom cap */}
      <ellipse cx="50" cy="130" rx="26" ry="6" fill="#d97706" />
      <rect x="32" y="134" width="36" height="7" rx="3.5" fill="#b45309" />
      {/* tassels */}
      {[-10, -5, 0, 5, 10].map((dx) => (
        <line key={dx} x1={50 + dx} y1="140" x2={50 + dx * 1.5} y2="152" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
      ))}
    </motion.svg>
  </div>
)

const HistoryAnim = ({ type, accent, color }) => {
  if (type === 'lattice') {
    // 宋代起源 — 花灯骨架：椭圆轮廓 + 横肋 + 顶盖 + 流苏 + 中心灯字
    const ribYs = [38, 53, 70, 87, 102]
    return (
      <svg viewBox="0 0 140 140" className="history-anim-svg">
        <defs>
          <radialGradient id="lgGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* glow */}
        <ellipse cx="70" cy="70" rx="40" ry="48" fill="url(#lgGlow)" />
        {/* lantern outline */}
        <motion.ellipse cx="70" cy="70" rx="44" ry="52" fill="none" stroke={accent} strokeWidth="2"
          strokeDasharray="310" initial={{ strokeDashoffset: 310 }} animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 1.1, ease: 'easeInOut' }} />
        {/* center vertical */}
        <motion.line x1="70" y1="18" x2="70" y2="122" stroke={accent} strokeWidth="0.8" opacity="0.4"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.8 }} />
        {/* horizontal ribs */}
        {ribYs.map((y, i) => {
          const dy = y - 70, xSpan = 44 * Math.sqrt(Math.max(0, 1 - (dy / 52) ** 2))
          return (
            <motion.line key={i} x1={70 - xSpan} y1={y} x2={70 + xSpan} y2={y}
              stroke={accent} strokeWidth="1.2" opacity="0.6"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.38, delay: 1.0 + i * 0.1 }} />
          )
        })}
        {/* top string */}
        <motion.line x1="70" y1="4" x2="70" y2="18" stroke={accent} strokeWidth="2"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.2 }} />
        {/* top cap */}
        <motion.ellipse cx="70" cy="18" rx="20" ry="5" fill={accent} opacity="0.85"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 0.3, delay: 0.15 }} style={{ transformOrigin: '70px 18px' }} />
        {/* bottom cap */}
        <motion.ellipse cx="70" cy="122" rx="20" ry="5" fill={accent} opacity="0.7"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 0.3, delay: 1.65 }} style={{ transformOrigin: '70px 122px' }} />
        {/* tassels */}
        {[-8, -4, 0, 4, 8].map((dx, i) => (
          <motion.line key={i} x1={70 + dx} y1="127" x2={70 + dx * 1.7} y2="138"
            stroke={accent} strokeWidth="1.5" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.25, delay: 1.8 + i * 0.07 }} />
        ))}
        {/* decorative cross lines */}
        {[[-28, 0, 28, 0], [0, -28, 0, 28]].map(([dx1, dy1, dx2, dy2], i) => (
          <motion.line key={i} x1={70 + dx1} y1={70 + dy1} x2={70 + dx2} y2={70 + dy2}
            stroke={accent} strokeWidth="0.7" opacity="0.3"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 1.55 + i * 0.1 }} />
        ))}
        {/* center glow circle */}
        <motion.circle cx="70" cy="70" r="17" fill={color}
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 1.55, type: 'spring', bounce: 0.4 }}
          style={{ transformOrigin: '70px 70px' }} />
        <motion.text x="70" y="79" textAnchor="middle" fontSize="20" fill={accent}
          fontFamily="serif" fontWeight="bold"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>灯</motion.text>
      </svg>
    )
  }

  if (type === 'bloom') {
    // 明清兴盛 — 三层牡丹：12外瓣 + 8中瓣 + 6内瓣 + 花蕊
    return (
      <svg viewBox="0 0 140 140" className="history-anim-svg">
        {/* outer 12 petals */}
        {Array.from({ length: 12 }, (_, i) => (
          <motion.ellipse key={`o${i}`} cx="70" cy="30" rx="8" ry="28"
            fill={accent} opacity="0.45"
            style={{ transformOrigin: '70px 70px' }}
            transform={`rotate(${i * 30}, 70, 70)`}
            initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 0.45 }}
            transition={{ duration: 0.38, delay: i * 0.06 }} />
        ))}
        {/* middle 8 petals */}
        {Array.from({ length: 8 }, (_, i) => (
          <motion.ellipse key={`m${i}`} cx="70" cy="44" rx="9" ry="19"
            fill="rgba(220,38,38,0.78)"
            style={{ transformOrigin: '70px 70px' }}
            transform={`rotate(${i * 45 + 22.5}, 70, 70)`}
            initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 0.78 }}
            transition={{ duration: 0.35, delay: 0.72 + i * 0.07 }} />
        ))}
        {/* inner 6 petals */}
        {Array.from({ length: 6 }, (_, i) => (
          <motion.ellipse key={`in${i}`} cx="70" cy="57" rx="7" ry="12"
            fill="#fef3c7" opacity="0.92"
            style={{ transformOrigin: '70px 70px' }}
            transform={`rotate(${i * 60}, 70, 70)`}
            initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 0.92 }}
            transition={{ duration: 0.3, delay: 1.3 + i * 0.08 }} />
        ))}
        {/* center */}
        <motion.circle cx="70" cy="70" r="14" fill={color}
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 1.8, type: 'spring' }}
          style={{ transformOrigin: '70px 70px' }} />
        {/* stamens */}
        {Array.from({ length: 10 }, (_, i) => {
          const a = (i / 10) * Math.PI * 2
          return (
            <motion.circle key={i} cx={70 + Math.cos(a) * 10} cy={70 + Math.sin(a) * 10} r="2.2"
              fill={accent}
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ duration: 0.18, delay: 1.9 + i * 0.04 }} />
          )
        })}
        <motion.text x="70" y="78" textAnchor="middle" fontSize="16"
          fill="rgba(255,255,255,0.95)" fontFamily="serif" fontWeight="bold"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 }}>花</motion.text>
      </svg>
    )
  }

  if (type === 'weave') {
    // 现代传承 — 竹编菱格：3×3 菱形格逐行展开
    const SP = 36, R = 13, START = 16
    const positions = Array.from({ length: 9 }, (_, i) => {
      const row = Math.floor(i / 3), col = i % 3
      return { cx: START + col * SP, cy: START + row * SP, delay: (row + col) * 0.13, isCenter: i === 4 }
    })
    const hLines = [], vLines = []
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 2; col++) {
        hLines.push({ x1: START + col * SP + R, y1: START + row * SP, x2: START + (col + 1) * SP - R, y2: START + row * SP, delay: 0.35 + row * 0.14 + col * 0.09 })
      }
    }
    for (let col = 0; col < 3; col++) {
      for (let row = 0; row < 2; row++) {
        vLines.push({ x1: START + col * SP, y1: START + row * SP + R, x2: START + col * SP, y2: START + (row + 1) * SP - R, delay: 0.35 + col * 0.14 + row * 0.09 })
      }
    }
    return (
      <svg viewBox="0 0 140 140" className="history-anim-svg">
        {hLines.map((l, i) => (
          <motion.line key={`h${i}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke={accent} strokeWidth="1" opacity="0.4"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.28, delay: l.delay }} />
        ))}
        {vLines.map((l, i) => (
          <motion.line key={`v${i}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke={accent} strokeWidth="1" opacity="0.4"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.28, delay: l.delay }} />
        ))}
        {positions.map(({ cx, cy, delay, isCenter }, i) => (
          <motion.path key={i}
            d={`M ${cx},${cy - R} L ${cx + R},${cy} L ${cx},${cy + R} L ${cx - R},${cy} Z`}
            fill={isCenter ? accent : 'none'}
            stroke={accent} strokeWidth={isCenter ? 0 : 1.8}
            opacity={isCenter ? 0.95 : 0.62}
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: isCenter ? 0.95 : 0.62 }}
            transition={{ duration: 0.32, delay, type: 'spring', bounce: 0.3 }}
            style={{ transformOrigin: `${cx}px ${cy}px` }} />
        ))}
        {/* diagonal decorative threads */}
        {[[START, START, START + 2 * SP, START + 2 * SP], [START + 2 * SP, START, START, START + 2 * SP]].map(([x1, y1, x2, y2], i) => (
          <motion.line key={`d${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={accent} strokeWidth="0.7" opacity="0.22"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 1.0 + i * 0.1 }} />
        ))}
        <motion.text x={START + SP} y={START + SP + 7} textAnchor="middle" fontSize="14"
          fill={color} fontFamily="serif" fontWeight="bold"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.25 }}>匠</motion.text>
      </svg>
    )
  }

  // ripple — 珠海新生：灯塔 + 三层海浪 + 涟漪扩散
  return (
    <svg viewBox="0 0 140 140" className="history-anim-svg">
      {/* expanding ripples */}
      {[14, 28, 42, 56].map((r, i) => (
        <motion.circle key={i} cx="70" cy="66" r={r}
          fill="none" stroke={accent} strokeWidth="1.4"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: [0, 0.6, 0] }}
          transition={{ duration: 2.4, delay: i * 0.5, repeat: Infinity, ease: 'easeOut' }}
          style={{ transformOrigin: '70px 66px' }} />
      ))}
      {/* lighthouse tower */}
      <motion.rect x="63" y="42" width="14" height="38" rx="2" fill={accent} opacity="0.88"
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }} style={{ transformOrigin: '70px 80px' }} />
      {/* lighthouse top */}
      <motion.path d="M 59,42 L 70,28 L 81,42 Z" fill={accent} opacity="0.96"
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 0.96 }}
        transition={{ duration: 0.32, delay: 0.65, type: 'spring' }}
        style={{ transformOrigin: '70px 35px' }} />
      {/* beacon glow */}
      <motion.circle cx="70" cy="31" r="5" fill="#fff" opacity="0.95"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.4, repeat: Infinity }} />
      {/* windows */}
      {[52, 63, 74].map((y, i) => (
        <motion.circle key={i} cx="70" cy={y} r="3" fill={color}
          initial={{ opacity: 0 }} animate={{ opacity: 0.85 }}
          transition={{ delay: 0.85 + i * 0.12 }} />
      ))}
      {/* base */}
      <motion.rect x="58" y="80" width="24" height="5" rx="2" fill={accent} opacity="0.7"
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ duration: 0.25, delay: 0.5 }} style={{ transformOrigin: '70px 82px' }} />
      {/* wave paths */}
      {[0, 1, 2].map((i) => {
        const by = 96 + i * 13
        return (
          <motion.path key={i}
            d={`M 6,${by} Q 26,${by - 9} 46,${by} Q 66,${by + 9} 86,${by} Q 106,${by - 9} 134,${by}`}
            fill="none" stroke={accent} strokeWidth="2.2" opacity={0.9 - i * 0.22}
            strokeDasharray="200" initial={{ strokeDashoffset: 200 }} animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 0.75, delay: 0.9 + i * 0.24 }} />
        )
      })}
    </svg>
  )
}

const HistoryDetailModal = ({ item, onClose }) => (
  <motion.div className="history-modal"
    initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
  >
    <div className="history-modal-header" style={{ background: `linear-gradient(160deg, ${item.color} 0%, ${item.color}cc 100%)` }}>
      <button className="history-modal-close" onClick={onClose}><X size={18} /></button>
      <motion.div className="history-era-badge" style={{ color: item.accent }}
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        {item.era}
      </motion.div>
      <motion.div className="history-modal-title"
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        {item.title}
      </motion.div>
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring', bounce: 0.3 }}>
        <HistoryAnim type={item.animType} accent={item.accent} color={item.color} />
      </motion.div>
    </div>
    <div className="history-modal-body">
      <motion.p className="history-modal-desc"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        {item.desc}
      </motion.p>
      <motion.div className="history-modal-quote" style={{ borderColor: item.color + '66', color: item.color }}
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
        「{item.quote}」
      </motion.div>
      <motion.button className="history-modal-btn" style={{ background: item.color }}
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
        onClick={onClose}>
        收起
      </motion.button>
    </div>
  </motion.div>
)

const DishIllustration = ({ id, accent }) => {
  if (id === 'tofu') return (
    <svg viewBox="0 0 300 210" className="dish-svg">
      <defs>
        <radialGradient id="plateTf" cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor="#fffdf8" /><stop offset="100%" stopColor="#f0e8d8" />
        </radialGradient>
      </defs>
      <ellipse cx="150" cy="185" rx="128" ry="13" fill="rgba(0,0,0,0.07)" />
      <ellipse cx="150" cy="110" rx="138" ry="96" fill="url(#plateTf)" />
      <ellipse cx="150" cy="110" rx="138" ry="96" fill="none" stroke="#e0cdb5" strokeWidth="3" />
      <ellipse cx="150" cy="110" rx="118" ry="80" fill="none" stroke="#eddfc8" strokeWidth="1" />
      {[[94,78],[176,78],[94,138],[176,138]].map(([x,y],i) => (
        <motion.g key={i} initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}}
          transition={{delay:i*0.12,type:'spring',bounce:0.3}} style={{transformOrigin:`${x}px ${y}px`}}>
          <rect x={x-26} y={y-26} width="52" height="52" rx="7" fill="#f2e4c4" />
          <rect x={x-26} y={y-26} width="52" height="52" rx="7" fill="none" stroke="#c8974a" strokeWidth="1.5" />
          <rect x={x-24} y={y-24} width="48" height="18" rx="5" fill="#e0ae58" opacity="0.65" />
          <circle cx={x} cy={y+8} r="10" fill="#b91c1c" opacity="0.82" />
          <circle cx={x} cy={y+8} r="6" fill="#ef4444" opacity="0.9" />
          <circle cx={x} cy={y+8} r="2.5" fill="#fca5a5" />
        </motion.g>
      ))}
      <motion.path d="M 62,172 Q 100,162 150,168 Q 200,174 238,164"
        fill="none" stroke="#92400e" strokeWidth="3" strokeLinecap="round" opacity="0.55"
        initial={{pathLength:0}} animate={{pathLength:1}} transition={{delay:0.55,duration:0.7}} />
      {[[90,95],[152,65],[210,95],[152,152]].map(([x,y],i) => (
        <motion.circle key={i} cx={x} cy={y} r="4" fill="#4ade80" opacity="0.75"
          initial={{scale:0}} animate={{scale:1}} transition={{delay:0.65+i*0.07}} />
      ))}
    </svg>
  )
  if (id === 'chicken') return (
    <svg viewBox="0 0 300 210" className="dish-svg">
      <defs>
        <radialGradient id="plateCk" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#fffef5" /><stop offset="100%" stopColor="#f5ead8" />
        </radialGradient>
        <radialGradient id="ckBody" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fde68a" /><stop offset="60%" stopColor="#d97706" /><stop offset="100%" stopColor="#92400e" />
        </radialGradient>
      </defs>
      <ellipse cx="150" cy="185" rx="128" ry="13" fill="rgba(0,0,0,0.07)" />
      <ellipse cx="150" cy="110" rx="138" ry="96" fill="url(#plateCk)" />
      <ellipse cx="150" cy="110" rx="138" ry="96" fill="none" stroke="#e0cdb5" strokeWidth="3" />
      <ellipse cx="150" cy="110" rx="118" ry="80" fill="none" stroke="#eddfc8" strokeWidth="1" />
      <motion.ellipse cx="145" cy="108" rx="72" ry="56" fill="url(#ckBody)"
        initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}}
        transition={{delay:0.1,type:'spring',bounce:0.25}} style={{transformOrigin:'145px 108px'}} />
      <motion.ellipse cx="200" cy="138" rx="28" ry="20" fill="#b45309"
        initial={{scale:0}} animate={{scale:1}} transition={{delay:0.3,type:'spring'}} style={{transformOrigin:'200px 138px'}} />
      <motion.rect x="218" y="128" width="26" height="10" rx="5" fill="#92400e"
        initial={{scaleX:0}} animate={{scaleX:1}} transition={{delay:0.45}} style={{transformOrigin:'218px 133px'}} />
      <motion.ellipse cx="100" cy="82" rx="22" ry="16" fill="#d97706" opacity="0.8"
        initial={{scale:0}} animate={{scale:1}} transition={{delay:0.35,type:'spring'}} style={{transformOrigin:'100px 82px'}} />
      {[[80,150],[120,165],[170,160],[210,155],[88,128],[175,90],[155,135]].map(([x,y],i) => (
        <motion.ellipse key={i} cx={x} cy={y} rx={3+Math.random()*3} ry={2+Math.random()*2}
          fill="#fff" opacity="0.82" initial={{scale:0}} animate={{scale:1}}
          transition={{delay:0.5+i*0.06}} style={{transformOrigin:`${x}px ${y}px`}} />
      ))}
      {[[78,170],[105,176],[140,178],[110,72],[80,62]].map(([x,y],i) => (
        <motion.ellipse key={i} cx={x} cy={y} rx="5" ry="3" fill="#4ade80" opacity="0.7"
          initial={{scale:0}} animate={{scale:1}} transition={{delay:0.72+i*0.07}}
          style={{transformOrigin:`${x}px ${y}px`}} />
      ))}
    </svg>
  )
  if (id === 'oyster') return (
    <svg viewBox="0 0 300 210" className="dish-svg">
      <defs>
        <radialGradient id="panBg" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#fef9c3" /><stop offset="100%" stopColor="#d97706" />
        </radialGradient>
      </defs>
      <ellipse cx="150" cy="185" rx="110" ry="12" fill="rgba(0,0,0,0.08)" />
      <circle cx="150" cy="112" r="100" fill="#374151" />
      <circle cx="150" cy="112" r="94" fill="url(#panBg)" />
      <circle cx="150" cy="112" r="94" fill="none" stroke="#1f2937" strokeWidth="5" />
      <motion.ellipse cx="150" cy="115" rx="72" ry="52" fill="#fbbf24" opacity="0.9"
        initial={{scale:0}} animate={{scale:1}} transition={{delay:0.1,type:'spring',bounce:0.2}}
        style={{transformOrigin:'150px 115px'}} />
      {[[112,90],[188,90],[108,130],[192,130],[150,72]].map(([x,y],i) => (
        <motion.g key={i} initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}}
          transition={{delay:0.2+i*0.1,type:'spring',bounce:0.3}} style={{transformOrigin:`${x}px ${y}px`}}>
          <path d={`M ${x-14},${y} Q ${x},${y-18} ${x+14},${y} Q ${x+8},${y+14} ${x},${y+16} Q ${x-8},${y+14} ${x-14},${y} Z`}
            fill="#6b7280" stroke="#9ca3af" strokeWidth="1" />
          <path d={`M ${x-10},${y+2} Q ${x},${y-10} ${x+10},${y+2} Q ${x+5},${y+12} ${x},${y+13} Q ${x-5},${y+12} ${x-10},${y+2} Z`}
            fill="#fde68a" opacity="0.95" />
          <circle cx={x} cy={y+4} r="4" fill="#f0fdf4" opacity="0.9" />
        </motion.g>
      ))}
      {[[95,148],[130,160],[170,160],[205,148],[150,155]].map(([x,y],i) => (
        <motion.circle key={i} cx={x} cy={y} r="3.5" fill="#4ade80" opacity="0.8"
          initial={{scale:0}} animate={{scale:1}} transition={{delay:0.72+i*0.07}}
          style={{transformOrigin:`${x}px ${y}px`}} />
      ))}
      <motion.path d="M 64,175 Q 90,168 112,172" fill="none" stroke="#92400e"
        strokeWidth="2" strokeLinecap="round" opacity="0.5"
        initial={{pathLength:0}} animate={{pathLength:1}} transition={{delay:0.8,duration:0.4}} />
    </svg>
  )
  // dumpling
  return (
    <svg viewBox="0 0 300 210" className="dish-svg">
      <defs>
        <radialGradient id="steamBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fafafa" /><stop offset="100%" stopColor="#e5e7eb" />
        </radialGradient>
      </defs>
      <ellipse cx="150" cy="188" rx="105" ry="12" fill="rgba(0,0,0,0.08)" />
      <motion.circle cx="150" cy="112" r="96" fill="url(#steamBg)"
        initial={{scale:0}} animate={{scale:1}} transition={{delay:0.05,type:'spring',bounce:0.2}}
        style={{transformOrigin:'150px 112px'}} />
      <motion.circle cx="150" cy="112" r="96" fill="none" stroke={accent} strokeWidth="3"
        initial={{pathLength:0}} animate={{pathLength:1}} transition={{delay:0.1,duration:0.7}} />
      {[72,82,92,102].map((r,i) => (
        <motion.circle key={i} cx="150" cy="112" r={r} fill="none" stroke={accent}
          strokeWidth="0.8" opacity="0.3"
          initial={{scale:0}} animate={{scale:1}} transition={{delay:0.12+i*0.06}}
          style={{transformOrigin:'150px 112px'}} />
      ))}
      {Array.from({length:8},(_,i) => (
        <motion.line key={i} x1={150+Math.cos((i/8)*Math.PI*2)*55} y1={112+Math.sin((i/8)*Math.PI*2)*55}
          x2={150+Math.cos((i/8)*Math.PI*2)*96} y2={112+Math.sin((i/8)*Math.PI*2)*96}
          stroke={accent} strokeWidth="1" opacity="0.25"
          initial={{pathLength:0}} animate={{pathLength:1}} transition={{delay:0.3+i*0.04}} />
      ))}
      {Array.from({length:6},(_,i) => {
        const a=(i/6)*Math.PI*2, r=52, cx=150+Math.cos(a)*r, cy=112+Math.sin(a)*r
        return (
          <motion.g key={i} initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}}
            transition={{delay:0.4+i*0.1,type:'spring',bounce:0.35}} style={{transformOrigin:`${cx}px ${cy}px`}}>
            <path d={`M ${cx-18},${cy} Q ${cx},${cy-22} ${cx+18},${cy} Q ${cx+14},${cy+10} ${cx},${cy+12} Q ${cx-14},${cy+10} ${cx-18},${cy} Z`}
              fill="#f8fafc" stroke={accent} strokeWidth="1.5" />
            {[-10,-5,0,5,10].map((dx,j) => (
              <line key={j} x1={cx+dx} y1={cy-2} x2={cx+dx*0.7} y2={cy-8}
                stroke={accent} strokeWidth="0.8" opacity="0.6" />
            ))}
          </motion.g>
        )
      })}
      <motion.circle cx="150" cy="112" r="18" fill={accent} opacity="0.15"
        animate={{scale:[1,1.15,1]}} transition={{duration:2.2,repeat:Infinity}} />
      <motion.text x="150" y="119" textAnchor="middle" fontSize="16" fill={accent}
        fontFamily="serif" fontWeight="bold"
        initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.0}}>竹</motion.text>
    </svg>
  )
}

function renderCraftPattern(id, color) {
  if (id === 'peony') return (
    <>
      {Array.from({length:8},(_,i)=>(<ellipse key={`op${i}`} cx="30" cy="11" rx="5.5" ry="16" fill={color} opacity="0.5" transform={`rotate(${i*45},30,30)`}/>))}
      {Array.from({length:6},(_,i)=>(<ellipse key={`mp${i}`} cx="30" cy="17" rx="5" ry="11" fill={color} opacity="0.72" transform={`rotate(${i*60+22},30,30)`}/>))}
      {Array.from({length:4},(_,i)=>(<ellipse key={`ip${i}`} cx="30" cy="22" rx="4" ry="7" fill={color} opacity="0.9" transform={`rotate(${i*90+45},30,30)`}/>))}
      <circle cx="30" cy="30" r="6.5" fill={color}/>
      {Array.from({length:8},(_,i)=>{ const a=(i/8)*Math.PI*2; return <circle key={i} cx={30+Math.cos(a)*4.5} cy={30+Math.sin(a)*4.5} r="1.5" fill="rgba(255,255,255,0.88)"/>})}
    </>
  )
  if (id === 'fish') return (
    <>
      <path d="M 46,30 L 58,16 L 58,44 Z" fill={color} opacity="0.72"/>
      <ellipse cx="27" cy="30" rx="20" ry="13" fill={color} opacity="0.9"/>
      <path d="M 22,17 Q 30,8 38,17" fill={color} opacity="0.65"/>
      <path d="M 22,43 Q 28,52 36,43" fill={color} opacity="0.5"/>
      {[[22,26],[28,26],[34,26],[18,30],[24,30],[30,30],[22,34],[28,34]].map(([x,y],i)=>(
        <path key={i} d={`M ${x-5},${y} Q ${x},${y-5} ${x+5},${y}`} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2"/>
      ))}
      <circle cx="12" cy="28" r="4" fill="rgba(255,255,255,0.95)"/>
      <circle cx="12" cy="28" r="2.2" fill={color}/>
      <circle cx="12.9" cy="27.1" r="0.9" fill="rgba(255,255,255,0.9)"/>
      <path d="M 7,31 Q 9,33 8,31" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" strokeLinecap="round"/>
    </>
  )
  if (id === 'cloud') return (
    <>
      <path d="M 10,36 Q 8,27 14,23 Q 17,19 22,21 Q 22,14 29,13 Q 36,12 38,19 Q 43,14 47,19 Q 52,24 49,31 Q 54,33 52,39 Q 50,45 43,43 L 17,43 Q 10,43 10,36 Z" fill={color} opacity="0.9"/>
      <path d="M 22,23 Q 28,17 34,20 Q 40,17 44,22" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M 17,43 Q 10,47 8,54 Q 15,56 17,51 Q 13,49 14,47" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" opacity="0.9"/>
      <path d="M 43,43 Q 50,47 52,54 Q 45,56 43,51 Q 47,49 46,47" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" opacity="0.9"/>
      {[[28,30],[35,28],[21,32]].map(([x,y],i)=>(<circle key={i} cx={x} cy={y} r="1.5" fill="rgba(255,255,255,0.4)"/>))}
    </>
  )
  return (
    <>
      <rect x="3" y="3" width="54" height="54" rx="6" fill="none" stroke={color} strokeWidth="2"/>
      <rect x="7" y="7" width="46" height="46" rx="4" fill="none" stroke={color} strokeWidth="0.9" opacity="0.5"/>
      {[[3,3],[57,3],[3,57],[57,57]].map(([x,y],i)=>(<path key={i} d={`M ${x},${y-3.5} L ${x+3.5},${y} L ${x},${y+3.5} L ${x-3.5},${y} Z`} fill={color}/>))}
      {[[30,3],[3,30],[57,30],[30,57]].map(([x,y],i)=>(<circle key={i} cx={x} cy={y} r="2" fill={color} opacity="0.6"/>))}
      <text x="30" y="39" textAnchor="middle" fontSize="30" fill={color} fontFamily="serif" fontWeight="bold">福</text>
    </>
  )
}

const CraftPatternIcon = ({ id, color = '#374151', size = 54 }) => (
  <svg viewBox="0 0 60 60" width={size} height={size}>
    {renderCraftPattern(id, color)}
  </svg>
)

const CraftShapePreview = ({ shape, active }) => {
  const col = active ? '#dc2626' : '#94a3b8'
  const lo  = active ? '#fca5a5' : '#e2e8f0'
  const gid = shape === '八角' ? 'csg8' : shape === '宫灯' ? 'csgP' : 'csgR'
  return (
    <svg viewBox="0 0 80 108" className="craft-shape-svg">
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={lo} /><stop offset="100%" stopColor={col} />
        </linearGradient>
      </defs>
      <line x1="40" y1="0" x2="40" y2="10" stroke={col} strokeWidth="2"/>
      <ellipse cx="40" cy="10" rx="14" ry="4" fill={col} opacity="0.85"/>
      {shape === '八角' && (
        <path d="M 40 16 L 62 23 L 72 38 L 72 66 L 62 81 L 40 88 L 18 81 L 8 66 L 8 38 L 18 23 Z" fill={`url(#${gid})`}/>
      )}
      {shape === '宫灯' && (
        <path d="M 40 16 Q 14 22 8 48 Q 4 68 14 82 Q 24 90 40 88 Q 56 90 66 82 Q 76 68 72 48 Q 66 22 40 16 Z" fill={`url(#${gid})`}/>
      )}
      {shape === '圆形' && (
        <ellipse cx="40" cy="52" rx="30" ry="38" fill={`url(#${gid})`}/>
      )}
      <ellipse cx="40" cy="88" rx="14" ry="4" fill={col} opacity="0.75"/>
      {[-5,-1,3,7].map((dx,i)=>(
        <line key={i} x1={40+dx} y1="92" x2={40+dx*1.6} y2="104" stroke={col} strokeWidth="1.5" strokeLinecap="round"/>
      ))}
      {active && (
        <motion.circle cx="40" cy="52" r="26"
          fill="none" stroke={col} strokeWidth="1.5" opacity="0.5"
          animate={{ scale:[1,1.2,1], opacity:[0.5,0.1,0.5] }}
          transition={{ duration:2, repeat:Infinity }} style={{transformOrigin:'40px 52px'}}/>
      )}
    </svg>
  )
}

const CraftFinalLantern = ({ shape, colorId, patternId, idSuffix = '' }) => {
  const c = CRAFT_COLORS.find(x => x.id === colorId) || CRAFT_COLORS[0]
  const p = CRAFT_PATTERNS.find(x => x.id === patternId) || CRAFT_PATTERNS[0]
  const gid = `cfl_${colorId}${idSuffix}`
  const glowId = `cflg_${colorId}${idSuffix}`
  const getBodyEl = () => {
    if (shape === '八角') return (
      <motion.path d="M 100 28 L 142 44 L 165 72 L 165 130 L 142 158 L 100 172 L 58 158 L 35 130 L 35 72 L 58 44 Z"
        fill={`url(#${gid})`}
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3, type: 'spring', bounce: 0.2 }}
        style={{ transformOrigin: '100px 100px' }} />
    )
    if (shape === '宫灯') return (
      <motion.path d="M 100 28 Q 50 40 36 82 Q 26 120 44 158 Q 62 178 100 175 Q 138 178 156 158 Q 174 120 164 82 Q 150 40 100 28 Z"
        fill={`url(#${gid})`}
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3, type: 'spring', bounce: 0.2 }}
        style={{ transformOrigin: '100px 100px' }} />
    )
    return (
      <motion.ellipse cx="100" cy="102" rx="62" ry="76"
        fill={`url(#${gid})`}
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
        transition={{ duration: 0.6, delay: 0.3, type: 'spring', bounce: 0.2 }}
        style={{ transformOrigin: '100px 102px' }} />
    )
  }
  return (
    <svg viewBox="0 0 200 255" className="craft-final-svg">
      <defs>
        <radialGradient id={gid} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor={c.light}/>
          <stop offset="55%" stopColor={c.hex}/>
          <stop offset="100%" stopColor={c.dark}/>
        </radialGradient>
        <radialGradient id={glowId} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor={c.light} stopOpacity="0.5"/>
          <stop offset="100%" stopColor={c.hex} stopOpacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="105" rx="90" ry="100" fill={`url(#${glowId})`}/>
      {/* sparkle stars */}
      {Array.from({length:8},(_,i)=>{
        const a=(i/8)*Math.PI*2
        return <motion.circle key={i} cx={100+Math.cos(a)*82} cy={102+Math.sin(a)*76} r="4"
          fill={c.light}
          animate={{scale:[0,1,0],opacity:[0,0.9,0]}}
          transition={{duration:1.6,delay:1.1+i*0.15,repeat:Infinity,repeatDelay:1.5}}/>
      })}
      <motion.line x1="100" y1="5" x2="100" y2="22" stroke={c.hex} strokeWidth="2.5"
        initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:0.3}}/>
      <motion.ellipse cx="100" cy="22" rx="28" ry="7" fill={c.dark}
        initial={{scaleX:0}} animate={{scaleX:1}} transition={{duration:0.3,delay:0.18}}
        style={{transformOrigin:'100px 22px'}}/>
      {getBodyEl()}
      {[62,84,102,120,142].map((y,i)=>{
        const dy=y-102, xSpan=shape==='圆形'?62*Math.sqrt(Math.max(0,1-(dy/76)**2)):60
        return <motion.line key={i} x1={100-xSpan*0.88} y1={y} x2={100+xSpan*0.88} y2={y}
          stroke={c.light} strokeWidth="0.9" opacity="0.5"
          initial={{pathLength:0}} animate={{pathLength:1}}
          transition={{duration:0.4,delay:0.5+i*0.07}}/>
      })}
      <motion.g initial={{opacity:0,scale:0.4}} animate={{opacity:1,scale:1}}
        transition={{delay:0.9,type:'spring',bounce:0.4}} style={{transformOrigin:'100px 100px'}}>
        <svg x="62" y="68" width="76" height="76" viewBox="0 0 60 60">
          {renderCraftPattern(patternId, 'rgba(255,255,255,0.88)')}
        </svg>
      </motion.g>
      <motion.ellipse cx="100" cy="188" rx="28" ry="7" fill={c.dark}
        initial={{scaleX:0}} animate={{scaleX:1}} transition={{duration:0.3,delay:0.7}}
        style={{transformOrigin:'100px 188px'}}/>
      {[-12,-6,0,6,12].map((dx,i)=>(
        <motion.line key={i} x1={100+dx} y1="195" x2={100+dx*1.8} y2="215"
          stroke={c.hex} strokeWidth="2" strokeLinecap="round"
          initial={{pathLength:0}} animate={{pathLength:1}}
          transition={{duration:0.25,delay:0.85+i*0.07}}/>
      ))}
    </svg>
  )
}

const PosterModal = ({ shape, colorId, patternId, styleIdx, onClose }) => {
  const posterRef = React.useRef(null)
  const pressTimerRef = React.useRef(null)
  const [textIdx, setTextIdx] = React.useState(Math.floor(Math.random() * POSTER_TEXTS.length))

  const savePosterImage = React.useCallback(async () => {
    if (!posterRef.current) {
      console.log('posterRef 不存在')
      return
    }
    try {
      // 随机选择新的文案样式
      setTextIdx(Math.floor(Math.random() * POSTER_TEXTS.length))
      
      // 动态加载 html2canvas
      if (!window.html2canvas) {
        console.log('正在加载 html2canvas...')
        const script = document.createElement('script')
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
        script.onload = async () => {
          console.log('html2canvas 加载成功')
          await new Promise(r => setTimeout(r, 300))
          await captureAndDownload()
        }
        script.onerror = () => {
          console.error('html2canvas 加载失败')
          alert('加载保存工具失败，请稍后重试')
        }
        document.head.appendChild(script)
      } else {
        console.log('html2canvas 已存在')
        await new Promise(r => setTimeout(r, 300))
        await captureAndDownload()
      }
    } catch (e) {
      console.error('Failed to save poster:', e)
      alert('保存失败：' + e.message)
    }
  }, [])

  const captureAndDownload = async () => {
    if (!posterRef.current) return
    try {
      const canvas = await window.html2canvas(posterRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      })
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `忠信花灯-${new Date().toISOString().slice(0,10)}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }, 'image/png')
    } catch (e) {
      console.error('Capture failed:', e)
    }
  }

  const handleTouchStart = () => {
    pressTimerRef.current = setTimeout(() => {
      savePosterImage()
    }, 500)
  }

  const handleTouchEnd = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current)
      pressTimerRef.current = null
    }
  }

  const ps = POSTER_STYLES[styleIdx % POSTER_STYLES.length]
  const isDark = ps.id === 'gold' || ps.id === 'neon'
  return (
    <motion.div className="poster-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* background tap to close */}
      <div className="poster-bg-tap" onClick={onClose} />
      <div className="poster-wrapper">
        <motion.div className={`poster-card poster-card--${ps.id}`} style={{ background: ps.bg }}
          ref={posterRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseUp={handleTouchEnd}
          initial={{ scale: 0.82, y: 60, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}>
          {/* Frame / decorations */}
          {ps.id === 'gold' && (
            <svg className="poster-deco" viewBox="0 0 320 500">
              <rect x="10" y="10" width="300" height="480" rx="6" fill="none" stroke={ps.frame} strokeWidth="2"/>
              <rect x="16" y="16" width="288" height="468" rx="4" fill="none" stroke={ps.frame} strokeWidth="0.8" opacity="0.55"/>
              {[[10,10],[310,10],[10,490],[310,490]].map(([x,y],i)=>(
                <path key={i} d={`M ${x},${y-6} L ${x+6},${y} L ${x},${y+6} L ${x-6},${y} Z`} fill={ps.frame}/>
              ))}
              {[[10,250],[310,250]].map(([x,y],i)=>(<circle key={i} cx={x} cy={y} r="3" fill={ps.frame} opacity="0.7"/>))}
              {[[160,10],[160,490]].map(([x,y],i)=>(<circle key={i} cx={x} cy={y} r="3" fill={ps.frame} opacity="0.7"/>))}
            </svg>
          )}
          {ps.id === 'ink' && (
            <svg className="poster-deco" viewBox="0 0 320 500">
              {/* corner brush strokes */}
              <path d="M 10,50 Q 12,20 40,16" fill="none" stroke="#57534e" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
              <path d="M 50,10 Q 20,12 16,40" fill="none" stroke="#57534e" strokeWidth="2" strokeLinecap="round" opacity="0.35"/>
              <path d="M 310,50 Q 308,20 280,16" fill="none" stroke="#57534e" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
              <path d="M 270,10 Q 300,12 304,40" fill="none" stroke="#57534e" strokeWidth="2" strokeLinecap="round" opacity="0.35"/>
              <path d="M 10,450 Q 12,480 40,484" fill="none" stroke="#57534e" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
              <path d="M 50,490 Q 20,488 16,460" fill="none" stroke="#57534e" strokeWidth="2" strokeLinecap="round" opacity="0.35"/>
              {/* red seal */}
              <rect x="255" y="445" width="48" height="48" rx="4" fill="#dc2626" opacity="0.88"/>
              <rect x="258" y="448" width="42" height="42" rx="2" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
              <text x="279" y="462" textAnchor="middle" fontSize="8" fill="white" fontFamily="serif" letterSpacing="1">山海清梵</text>
              <text x="279" y="475" textAnchor="middle" fontSize="10" fill="white" fontFamily="serif" fontWeight="bold">客家灯</text>
              <text x="279" y="487" textAnchor="middle" fontSize="8" fill="white" fontFamily="serif" letterSpacing="1">山海清梵</text>
            </svg>
          )}
          {ps.id === 'neon' && (
            <svg className="poster-deco" viewBox="0 0 320 500">
              <rect x="12" y="12" width="296" height="476" rx="8" fill="none" stroke={ps.frame} strokeWidth="1.5" opacity="0.7"/>
              {[0,1,2].map(i=>(
                <circle key={i} cx="160" cy="230" r={60+i*30} fill="none" stroke={ps.titleColor} strokeWidth="0.6" opacity={0.12-i*0.03}/>
              ))}
              {Array.from({length:18},(_,i)=>{
                const a=(i/18)*Math.PI*2; const r=80+Math.random()*80
                return <circle key={i} cx={160+Math.cos(a)*r} cy={230+Math.sin(a)*r*0.7} r="2" fill={i%2===0?ps.titleColor:ps.blessColor} opacity="0.4"/>
              })}
              {/* grid lines */}
              {[80,160,240].map((x,i)=>(
                <line key={i} x1={x} y1="12" x2={x} y2="488" stroke={ps.frame} strokeWidth="0.4" opacity="0.2"/>
              ))}
              {[125,250,375].map((y,i)=>(
                <line key={i} x1="12" y1={y} x2="308" y2={y} stroke={ps.frame} strokeWidth="0.4" opacity="0.2"/>
              ))}
            </svg>
          )}
          {ps.id === 'floral' && (
            <svg className="poster-deco" viewBox="0 0 320 500">
              <rect x="12" y="12" width="296" height="476" rx="10" fill="none" stroke={ps.frame} strokeWidth="2"/>
              {/* corner peonies */}
              {[[32,32],[288,32],[32,468],[288,468]].map(([cx,cy],ci)=>(
                <g key={ci}>
                  {Array.from({length:6},(_,i)=>(
                    <ellipse key={i} cx={cx} cy={cy-12} rx="5" ry="11"
                      fill={ps.blessColor} opacity="0.55"
                      transform={`rotate(${i*60},${cx},${cy})`}/>
                  ))}
                  {Array.from({length:4},(_,i)=>(
                    <ellipse key={i} cx={cx} cy={cy-7} rx="4" ry="7"
                      fill={ps.blessColor} opacity="0.75"
                      transform={`rotate(${i*90+45},${cx},${cy})`}/>
                  ))}
                  <circle cx={cx} cy={cy} r="5" fill={ps.blessColor} opacity="0.9"/>
                </g>
              ))}
              {/* mid-edge flourishes */}
              {[[160,12],[160,488]].map(([x,y],i)=>(
                <circle key={i} cx={x} cy={y} r="4" fill={ps.frame} opacity="0.8"/>
              ))}
            </svg>
          )}
          {/* Content */}
          <div className="poster-content">
            <motion.div className="poster-top-label" style={{ color: ps.subColor }}
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              {ps.label} · 客家花灯
            </motion.div>
            <motion.div className="poster-main-title" style={{ color: ps.titleColor,
              textShadow: ps.id==='neon' ? `0 0 12px ${ps.titleColor}` : 'none' }}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35 }}>
              忠信花灯
            </motion.div>
            <motion.div className="poster-sub-title" style={{ color: ps.subColor }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              {POSTER_TEXTS[textIdx].subtitle}
            </motion.div>
            <motion.div className="poster-lantern-area"
              initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.25, type: 'spring', bounce: 0.28 }}>
              <CraftFinalLantern shape={shape} colorId={colorId} patternId={patternId} idSuffix="_poster" />
            </motion.div>
            <div className={`poster-blessings poster-blessings--${ps.id}`}>
              {BLESSINGS.map((b, i) => (
                <motion.div key={b} className="poster-blessing"
                  style={{ color: ps.blessColor, textShadow: ps.id==='neon' ? `0 0 8px ${ps.blessColor}` : 'none' }}
                  initial={{ opacity: 0, x: i%2===0 ? -24 : 24 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + i * 0.12 }}>
                  {b}
                </motion.div>
              ))}
            </div>
            <motion.div className="poster-bottom-text" style={{ color: ps.bottomColor }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
              {POSTER_TEXTS[textIdx].bottomText}
            </motion.div>
            <motion.div className="poster-url" style={{ color: ps.bottomColor }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
              {POSTER_TEXTS[textIdx].url}
            </motion.div>
          </div>
        </motion.div>
        <div className="poster-actions">
          <div className="poster-hint">📱 长按卡片或点击下方按钮可保存图片</div>
          <button className="poster-close-btn" onClick={savePosterImage}>💾 保存图片</button>
          <button className="poster-close-btn" onClick={onClose}>关闭</button>
        </div>
      </div>
    </motion.div>
  )
}

const PackageAnim = ({ id, accent }) => {
  if (id === 'couple') return (
    <svg viewBox="0 0 300 180" className="pkg-svg">
      <defs>
        <radialGradient id="pkgGlow1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* background glow */}
      <ellipse cx="150" cy="90" rx="130" ry="80" fill="url(#pkgGlow1)" />
      {/* left lantern */}
      {[0,1,2].map(i => (
        <motion.circle key={i} cx="95" cy="90" r={18+i*16}
          fill="none" stroke={accent} strokeWidth="1" opacity="0.25"
          animate={{ scale:[1,1.4,1], opacity:[0.25,0,0.25] }}
          transition={{ duration:2.4, delay:i*0.7, repeat:Infinity }} style={{transformOrigin:'95px 90px'}} />
      ))}
      <motion.g initial={{y:8,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.2,type:'spring'}}>
        <line x1="95" y1="30" x2="95" y2="42" stroke={accent} strokeWidth="2"/>
        <ellipse cx="95" cy="42" rx="18" ry="5" fill={accent} opacity="0.8"/>
        <path d="M 77 42 Q 62 62 62 82 Q 62 108 77 118 L 113 118 Q 128 108 128 82 Q 128 62 113 42 Z" fill="#b91c1c"/>
        <path d="M 77 42 Q 62 62 62 82 Q 62 108 77 118 L 113 118 Q 128 108 128 82 Q 128 62 113 42 Z" fill="none" stroke={accent} strokeWidth="1.5"/>
        <ellipse cx="95" cy="118" rx="18" ry="5" fill={accent} opacity="0.7"/>
        <text x="95" y="87" textAnchor="middle" fontSize="18" fill={accent} fontFamily="serif" fontWeight="bold">囍</text>
        {[-8,-3,2,7].map((dx,i)=>(
          <motion.line key={i} x1={95+dx} y1="123" x2={95+dx*1.5} y2="134"
            stroke={accent} strokeWidth="1.5" strokeLinecap="round"
            initial={{pathLength:0}} animate={{pathLength:1}} transition={{delay:0.8+i*0.07}}/>
        ))}
      </motion.g>
      {/* right lantern */}
      {[0,1,2].map(i => (
        <motion.circle key={i} cx="205" cy="90" r={18+i*16}
          fill="none" stroke={accent} strokeWidth="1" opacity="0.25"
          animate={{ scale:[1,1.4,1], opacity:[0.25,0,0.25] }}
          transition={{ duration:2.4, delay:0.35+i*0.7, repeat:Infinity }} style={{transformOrigin:'205px 90px'}} />
      ))}
      <motion.g initial={{y:8,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.35,type:'spring'}}>
        <line x1="205" y1="30" x2="205" y2="42" stroke={accent} strokeWidth="2"/>
        <ellipse cx="205" cy="42" rx="18" ry="5" fill={accent} opacity="0.8"/>
        <path d="M 187 42 Q 172 62 172 82 Q 172 108 187 118 L 223 118 Q 238 108 238 82 Q 238 62 223 42 Z" fill="#b91c1c"/>
        <path d="M 187 42 Q 172 62 172 82 Q 172 108 187 118 L 223 118 Q 238 108 238 82 Q 238 62 223 42 Z" fill="none" stroke={accent} strokeWidth="1.5"/>
        <ellipse cx="205" cy="118" rx="18" ry="5" fill={accent} opacity="0.7"/>
        <text x="205" y="87" textAnchor="middle" fontSize="18" fill={accent} fontFamily="serif" fontWeight="bold">喜</text>
        {[-8,-3,2,7].map((dx,i)=>(
          <motion.line key={i} x1={205+dx} y1="123" x2={205+dx*1.5} y2="134"
            stroke={accent} strokeWidth="1.5" strokeLinecap="round"
            initial={{pathLength:0}} animate={{pathLength:1}} transition={{delay:0.9+i*0.07}}/>
        ))}
      </motion.g>
      {/* hearts between */}
      {[[148,55],[152,75],[148,95]].map(([x,y],i)=>(
        <motion.text key={i} x={x} y={y} textAnchor="middle" fontSize={14-i*2}
          fill={accent} opacity="0.9"
          initial={{scale:0,opacity:0}} animate={{scale:1,opacity:0.9}}
          transition={{delay:0.6+i*0.2,type:'spring',bounce:0.5}}
          style={{transformOrigin:`${x}px ${y}px`}}>♥</motion.text>
      ))}
    </svg>
  )
  // VIP package
  return (
    <svg viewBox="0 0 300 180" className="pkg-svg">
      <defs>
        <radialGradient id="pkgGlow2" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.45" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* radiant beams */}
      {Array.from({length:12},(_,i)=>{
        const a=(i/12)*Math.PI*2
        return (
          <motion.line key={i}
            x1={150+Math.cos(a)*28} y1={90+Math.sin(a)*28}
            x2={150+Math.cos(a)*120} y2={90+Math.sin(a)*120}
            stroke={accent} strokeWidth="1.5" opacity="0.3"
            initial={{pathLength:0}} animate={{pathLength:1}}
            transition={{duration:0.5,delay:i*0.06}}/>
        )
      })}
      {/* ripple glow */}
      <ellipse cx="150" cy="90" rx="120" ry="80" fill="url(#pkgGlow2)"/>
      {[0,1,2].map(i=>(
        <motion.circle key={i} cx="150" cy="90" r={32+i*22}
          fill="none" stroke={accent} strokeWidth="1.2" opacity="0.3"
          animate={{scale:[1,1.35,1],opacity:[0.3,0,0.3]}}
          transition={{duration:2.6,delay:i*0.8,repeat:Infinity}} style={{transformOrigin:'150px 90px'}}/>
      ))}
      {/* grand lantern */}
      <motion.g initial={{scale:0.5,opacity:0}} animate={{scale:1,opacity:1}}
        transition={{delay:0.15,type:'spring',bounce:0.3}} style={{transformOrigin:'150px 90px'}}>
        <line x1="150" y1="8" x2="150" y2="26" stroke={accent} strokeWidth="2.5"/>
        <ellipse cx="150" cy="26" rx="26" ry="7" fill={accent} opacity="0.85"/>
        <path d="M 124 26 Q 100 52 100 82 Q 100 118 124 132 L 176 132 Q 200 118 200 82 Q 200 52 176 26 Z" fill="#92400e"/>
        <path d="M 124 26 Q 100 52 100 82 Q 100 118 124 132 L 176 132 Q 200 118 200 82 Q 200 52 176 26 Z"
          fill="none" stroke={accent} strokeWidth="2"/>
        {[44,62,82,102,118].map((y,i)=>{
          const dy=y-82, xSpan=50*Math.sqrt(Math.max(0,1-(dy/56)**2))
          return <line key={i} x1={150-xSpan} y1={y} x2={150+xSpan} y2={y} stroke={accent} strokeWidth="1" opacity="0.5"/>
        })}
        <text x="150" y="92" textAnchor="middle" fontSize="28" fill={accent} fontFamily="serif" fontWeight="bold">福</text>
        <ellipse cx="150" cy="132" rx="26" ry="7" fill={accent} opacity="0.75"/>
        {[-10,-5,0,5,10].map((dx,i)=>(
          <line key={i} x1={150+dx} y1="139" x2={150+dx*1.7} y2="152"
            stroke={accent} strokeWidth="1.8" strokeLinecap="round"/>
        ))}
      </motion.g>
      {/* crown above */}
      <motion.text x="150" y="18" textAnchor="middle" fontSize="14" fill={accent}
        initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:0.7}}>👑</motion.text>
    </svg>
  )
}

const PackageModal = ({ item, onClose }) => (
  <motion.div className="pkg-modal"
    initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
  >
    <div className="pkg-modal-header" style={{ background: `linear-gradient(150deg, ${item.bgFrom} 0%, ${item.bgTo} 100%)` }}>
      <button className="pkg-modal-close" onClick={onClose}><X size={18} /></button>
      <motion.span className="pkg-badge" style={{ background: item.accent, color: item.bgFrom }}
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        {item.badge}
      </motion.span>
      <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', bounce: 0.25 }}>
        <PackageAnim id={item.id} accent={item.accent} />
      </motion.div>
    </div>
    <div className="pkg-modal-body">
      <motion.div className="pkg-name-row"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}>
        <div>
          <div className="pkg-modal-name">{item.name}</div>
          <div className="pkg-modal-subtitle">{item.subtitle}</div>
        </div>
        <div className="pkg-modal-price" style={{ color: item.bgTo }}>{item.price}</div>
      </motion.div>
      <motion.p className="pkg-modal-desc"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        {item.desc}
      </motion.p>
      <motion.div className="pkg-includes"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.62 }}>
        <div className="pkg-inc-label">套餐内容</div>
        {item.includes.map((inc, i) => (
          <motion.div key={inc} className="pkg-inc-item"
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.68 + i * 0.08 }}>
            <span className="pkg-inc-dot" style={{ background: item.bgTo }} />
            {inc}
          </motion.div>
        ))}
      </motion.div>
      <motion.button className="pkg-order-btn"
        style={{ background: `linear-gradient(135deg, ${item.bgFrom}, ${item.bgTo})` }}
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
        onClick={onClose}>
        立即预订
      </motion.button>
    </div>
  </motion.div>
)

const DishModal = ({ item, onClose }) => (
  <motion.div className="dish-modal"
    initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
  >
    <div className="dish-modal-header" style={{ background: `linear-gradient(160deg, ${item.bgColor} 0%, ${item.bgColor}bb 100%)` }}>
      <button className="dish-modal-close" onClick={onClose}><X size={18} /></button>
      <motion.span className="dish-tag" style={{ background: item.accent }}
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        {item.tag}
      </motion.span>
      <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', bounce: 0.3 }}>
        <DishIllustration id={item.id} accent={item.accent} />
      </motion.div>
    </div>
    <div className="dish-modal-body">
      <motion.div className="dish-name-row"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}>
        <div>
          <div className="dish-modal-name">{item.name}</div>
          <div className="dish-modal-subtitle">{item.subtitle}</div>
        </div>
        <div className="dish-modal-price" style={{ color: item.accent }}>{item.price}</div>
      </motion.div>
      <motion.p className="dish-modal-desc"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        {item.desc}
      </motion.p>
      <motion.div className="dish-ingredients"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.62 }}>
        <div className="dish-ing-label">主要食材</div>
        <div className="dish-ing-tags">
          {item.ingredients.map(ing => (
            <span key={ing} className="dish-ing-tag" style={{ borderColor: item.accent + '55', color: item.accent }}>{ing}</span>
          ))}
        </div>
      </motion.div>
      <motion.button className="dish-order-btn" style={{ background: item.accent }}
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.76 }}
        onClick={onClose}>
        加入预订
      </motion.button>
    </div>
  </motion.div>
)

export default function HakkaLanternH5() {
  const [activeTab, setActiveTab] = useState('home')
  const [isLoading, setIsLoading] = useState(true)
  const [isLit, setIsLit] = useState(false)
  const [playVideoOnLit, setPlayVideoOnLit] = useState(false)
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false)
  const [activeScene, setActiveScene] = useState(SCENES_META[0])
  const [collected, setCollected] = useState({})
  const [showBlessing, setShowBlessing] = useState(false)
  const [selectedHistory, setSelectedHistory] = useState(null)
  const [selectedDish, setSelectedDish] = useState(null)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [showPoster, setShowPoster] = useState(false)
  const [posterStyle, setPosterStyle] = useState(0)
  const [craftStep, setCraftStep] = useState(0)
  const [selectedShape, setSelectedShape] = useState('圆形')
  const [selectedColor, setSelectedColor] = useState('red')
  const [selectedPattern, setSelectedPattern] = useState('peony')
  const [showSchemeModal, setShowSchemeModal] = useState(false)
  const [schemeZoom, setSchemeZoom] = useState(1)
  const [schemePan, setSchemePan] = useState({ x: 0, y: 0 })
  const [audioEnabled, setAudioEnabled] = useState(true)
  const schemeImageRef = useRef(null)
  const schemeLastDistanceRef = useRef(null)
  const [loadedImages, setLoadedImages] = useState({
    nightAerial: REMOTE.nightAerial,
    dayAerial: REMOTE.dayAerial,
    entrance: REMOTE.entrance,
    centerLantern: REMOTE.centerLantern,
    waterfront: REMOTE.waterfront,
    gallery: REMOTE.gallery,
    promenade: REMOTE.promenade,
  })

  useEffect(() => {
    let mounted = true

    async function checkImages() {
      const resolved = {}
      for (const key of Object.keys(REMOTE)) {
        const remoteUrl = REMOTE[key]
        const localUrl = LOCAL[key] || remoteUrl
        const ok = await probeImage(remoteUrl).catch(() => false)
        resolved[key] = ok ? remoteUrl : localUrl
      }

      if (!mounted) return
      // 等待 hero 背景（封面）图片完全加载再隐藏 loading
      const coverUrl = resolved.dayAerial || resolved.nightAerial || Object.values(resolved)[0]
      const img = new Image()
      let settled = false
      img.onload = () => {
        if (!mounted) return
        settled = true
        setLoadedImages(resolved)
        // 确保加载屏幕至少显示 1.5 秒，让用户能看到完整的加载动画
        setTimeout(() => setIsLoading(false), 1500)
      }
      img.onerror = () => {
        if (!mounted) return
        if (settled) return
        setLoadedImages(resolved)
        setIsLoading(false)
      }
      img.src = coverUrl
    }

    checkImages()
    return () => {
      mounted = false
    }
  }, [])

  // 禁用自动切换逻辑 - 改为由视频结束回调控制
  // useEffect(() => {
  //   if (isLit && activeTab === 'home') {
  //     const timeout = setTimeout(() => {
  //       setActiveTab('roam')
  //       if (playVideoOnLit) {
  //         setTimeout(() => {
  //           try { openPanorama() } catch (e) {}
  //           setPlayVideoOnLit(false)
  //         }, 300)
  //       }
  //     }, 2200)
  //     return () => clearTimeout(timeout)
  //   }
  // }, [isLit, activeTab])

  const scenes = SCENES_META.map((scene) => ({
    ...scene,
    img: loadedImages[scene.key] || REMOTE[scene.key],
  }))

  const videoRef = useRef(null)
  const fallbackTimerRef = useRef(null)
  const audioRef = useRef(null)

  function clearFallbackTimer() {
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current)
      fallbackTimerRef.current = null
    }
  }

  function startFallbackTimer() {
    clearFallbackTimer()
    fallbackTimerRef.current = setTimeout(() => {
      const v = videoRef.current
      // 如果视频存在且仍未播放，则认为播放被阻止，直接进入漫游
      if (!v || v.paused) {
        try {
          setShouldAutoPlay(false)
          setActiveTab('roam')
        } catch (e) {}
      }
      clearFallbackTimer()
    }, 5000)
  }

  const [showIntroVideo, setShowIntroVideo] = useState(false)
  const [introSrc, setIntroSrc] = useState(PANORAMA_VIDEO)

  // 在加载中时就播放背景音乐
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    
    // 设置音频属性
    audio.muted = false
    audio.loop = true
    audio.volume = 0.5
    
    // 尝试自动播放（加载中或加载完成后）
    const attemptAutoPlay = async () => {
      try {
        if (audioEnabled && !showIntroVideo) {
          await audio.play()
        } else if (!audioEnabled || showIntroVideo) {
          audio.pause()
        }
      } catch (e) {
        // 如果自动播放被浏览器阻止，添加点击监听器
        const playOnClick = async () => {
          try {
            if (audioEnabled && !showIntroVideo) {
              await audio.play()
            }
            document.removeEventListener('click', playOnClick)
          } catch (err) {}
        }
        document.addEventListener('click', playOnClick)
        return () => document.removeEventListener('click', playOnClick)
      }
    }
    
    attemptAutoPlay()
  }, [audioEnabled, showIntroVideo])

  // 当视频播放时暂停背景音乐
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    
    if (showIntroVideo) {
      // 视频出现，暂停背景音乐
      audio.pause()
    } else {
      // 视频结束，恢复背景音乐
      if (audioEnabled) {
        audio.play().catch(() => {})
      }
    }
  }, [showIntroVideo, audioEnabled])

  useEffect(() => {
    if (!showIntroVideo) return
    const v = videoRef.current
    if (!v) return
    // 确保视频源为当前 introSrc
    try { v.src = introSrc } catch(e) {}
    // 强制开启声音（不可关闭）以保证体验由用户手势触发时有声播放
    v.muted = false
    v.currentTime = 0
    v.play().catch(() => {})
    // 启动回退以防播放被阻止
    startFallbackTimer()
    return () => clearFallbackTimer()
  }, [showIntroVideo, introSrc])

  function handleSkipIntro() {
    clearFallbackTimer()
    setShowIntroVideo(false)
    setActiveTab('roam')
  }

  // mute toggle removed: videos are forced to play with sound and cannot be muted by user

  function handleVideoEnded() {
    try {
      clearFallbackTimer()
      setShouldAutoPlay(false)
      setShowIntroVideo(false)
      // 切换到正式的空间漫游界面
      setActiveTab('roam')
    } catch (e) {}
  }

  function openPanorama() {
    const v = videoRef.current
    if (!v) return
    try {
      v.scrollIntoView({ behavior: 'smooth', block: 'center' })
      // 为避免浏览器阻止自动播放，先静音再播放（用户可手动取消静音）
      v.muted = true
      v.play().catch(() => {})
      v.focus()
    } catch (e) {
      // ignore
    }
  }

  useEffect(() => {
    if (!scenes.find((scene) => scene.id === activeScene.id)) {
      setActiveScene(scenes[0])
    }
  }, [scenes, activeScene.id])

  const currentScene = scenes.find((scene) => scene.id === activeScene.id) || scenes[0]
  const collectedCount = Object.keys(collected).length
  const isAllCollected = collectedCount >= scenes.length
  const backgroundImage = isLit ? loadedImages.nightAerial || REMOTE.nightAerial : loadedImages.dayAerial || REMOTE.dayAerial

  return (
    <div className="app">
      <audio
        ref={audioRef}
        preload="auto"
        style={{ display: 'none' }}
      >
        <source src="/background-music.m4a" type="audio/mp4" />
        <source src="/background-music.m4a" type="audio/aac" />
      </audio>
      <button 
        className="audio-control-btn"
        onClick={() => {
          setAudioEnabled(!audioEnabled)
          const audio = audioRef.current
          if (!audio) return
          if (!audioEnabled) {
            audio.play().catch(() => {})
          } else {
            audio.pause()
          }
        }}
        title={audioEnabled ? '关闭音量' : '开启音量'}
      >
        {audioEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>
      <div className="page-body">
        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="loading-overlay"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="loader"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
              >
                <motion.svg
                  className="brand-logo"
                  viewBox="0 0 64 64"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{
                    y: -window.innerHeight - 100,
                    opacity: 0,
                    scale: 0.3,
                    rotate: 60,
                  }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                >
                  <defs>
                    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
                      <stop offset="0%" stopColor="#FF8A00" />
                      <stop offset="100%" stopColor="#FF3D00" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <motion.g
                    animate={{ scale: [1, 1.08, 1], opacity: [1, 0.9, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    filter="url(#glow)"
                  >
                    <rect x="18" y="10" width="28" height="34" rx="6" fill="url(#g)" />
                    <rect x="26" y="44" width="12" height="6" rx="3" fill="#FF3D00" />
                    <motion.circle
                      cx="32"
                      cy="26"
                      r="4"
                      fill="rgba(255,255,255,0.9)"
                      animate={{ r: [4, 5, 4] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </motion.g>
                </motion.svg>

                <motion.div
                  className="loader-text brand-title"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  exit={{ opacity: 0 }}
                >
                  忠信花灯
                </motion.div>

                <motion.div
                  className="loader-text brand-sub"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                  exit={{ opacity: 0 }}
                >
                  正在点亮空间，马上就好…
                </motion.div>

                <motion.div
                  className="loader-progress"
                  initial={{ width: 0 }}
                  animate={{ width: '80%' }}
                  transition={{ delay: 0.25, duration: 0.6, ease: 'easeInOut' }}
                  exit={{ opacity: 0 }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="home-screen"
            >
              <div className="hero-background" style={{ backgroundImage: `url(${backgroundImage})` }} />
              <div className="hero-overlay" />
              <div className="hero-content">
                <div className="hero-label">忠信花灯</div>
                <div className="hero-title">客家海宴餐厅</div>
                <div className="hero-copy">一盏花灯 千年客韵<br />一席海宴 百味归家</div>
                {!isLit ? (
                  <button className="hero-button" onClick={() => { 
                    try { 
                      setIsLit(true); 
                      setShouldAutoPlay(true);
                      // 显示夜景 5 秒后再切视频
                      setTimeout(() => {
                        setShowIntroVideo(true);
                      }, 5000);
                    } catch(e){} 
                  }}>
                    <Sparkles className="button-icon" /> 点亮花灯
                  </button>
                ) : (
                  <div className="hero-status">
                    <Clock className="status-icon" /> 花灯已亮，正在入宴...
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {activeTab === 'roam' && (
            <motion.div key="roam" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} className="section">
                <div className="scene-frame">
                <img className="scene-image" src={currentScene.img} alt={currentScene.name} />
                <div className="scene-label" role="button" tabIndex={0} onClick={() => { setIntroSrc(currentScene.video || PANORAMA_VIDEO); setShowIntroVideo(true); }} onKeyDown={(e)=>{ if(e.key==="Enter"||e.key===" ") { setIntroSrc(currentScene.video || PANORAMA_VIDEO); setShowIntroVideo(true); } }}>
                  全景导览
                </div>
                <div className="scene-name">{currentScene.name}</div>
                <div className="scene-desc">{currentScene.desc}</div>
                <button className="collect-button" onClick={() => {
                  setCollected((prev) => ({ ...prev, [currentScene.id]: true }));
                  if (currentScene.id === 'scheme') {
                    setShowSchemeModal(true);
                  } else {
                    setIntroSrc(currentScene.video || PANORAMA_VIDEO);
                    setShowIntroVideo(true);
                  }
                }}>
                  {collected[currentScene.id] ? (
                    <><CheckCircle2 /> 已收集</>
                  ) : (
                    <><Sparkles /> 收集此场景碎片</>
                  )}
                </button>
              </div>

              <div className="card">
                <div className="card-row">
                  <div>
                    <div className="card-label">收集花灯碎片</div>
                    <div className="card-small">已收集 {collectedCount} / {scenes.length}</div>
                  </div>
                  <div className="progress-wrapper">
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${(collectedCount / scenes.length) * 100}%` }} /></div>
                  </div>
                </div>

                <div className="scene-tabs">
                  {scenes.map((scene, idx) => (
                    <motion.button
                      key={scene.id}
                      className={`scene-button ${currentScene.id === scene.id ? 'active' : ''}`}
                      onClick={() => setActiveScene(scene)}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <span className="scene-icon">{scene.icon}</span>
                      <span className="scene-text">{scene.name}</span>
                      {collected[scene.id] && <span className="scene-checked">✓</span>}
                    </motion.button>
                  ))}
                </div>

                <button className={`cta-button ${isAllCollected ? 'primary' : 'disabled'}`} onClick={() => isAllCollected && setShowBlessing(true)}>
                  {isAllCollected ? '点亮主灯，祈福迎祥' : '游历上方5个场景，集齐碎片解锁'}
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div key="history" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} className="section">
              <div className="section-title">忠信花灯非遗档案</div>
              <div className="section-copy">从宋代起源到珠海新生，探索花灯背后的客家礼序。</div>
              <div className="timeline">
                {HISTORY_DATA.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    className="timeline-item clickable"
                    role="button"
                    tabIndex={0}
                    initial={{ opacity: 0, x: -28 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => setSelectedHistory(item)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedHistory(item) }}
                  >
                    <div className="timeline-badge" style={{ background: item.color, color: item.accent, fontSize: '18px', fontFamily: 'serif', fontWeight: 800 }}>
                      {item.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="timeline-era">{item.era}</div>
                      <div className="timeline-title">{item.title}</div>
                      <div className="timeline-text">点击探索花灯背后的故事 →</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'menu' && (
            <motion.div key="menu" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} className="section">
              <div className="menu-hero card">
                <div className="menu-hero-title">沉浸式花灯宴</div>
                <div className="menu-hero-copy">以花灯造型为菜单载体，品味客家山海。</div>
              </div>
              <div className="menu-list">
                {MENU_ITEMS.map((item, idx) => (
                  <motion.div key={item.id} className="menu-item card small-card"
                    role="button" tabIndex={0}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.09 }}
                    onClick={() => setSelectedDish(item)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedDish(item) }}
                  >
                    <div className="menu-thumb" style={{ background: item.bgColor }}>
                      <DishIllustration id={item.id} accent={item.accent} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="menu-tag" style={{ background: item.accent }}>{item.tag}</div>
                      <div className="menu-name">{item.name}</div>
                      <div className="menu-desc">{item.subtitle}</div>
                    </div>
                    <div className="menu-price" style={{ color: item.accent }}>{item.price}</div>
                  </motion.div>
                ))}
              </div>
              <div className="card pkg-card">
                <motion.div className="pkg-card-title"
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}>
                  套餐预订
                </motion.div>
                {PACKAGE_DATA.map((pkg, idx) => (
                  <motion.button key={pkg.id} className="pkg-btn"
                    style={{ background: `linear-gradient(135deg, ${pkg.bgFrom} 0%, ${pkg.bgTo} 100%)` }}
                    initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.48 + idx * 0.14, type: 'spring', bounce: 0.3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedPackage(pkg)}
                  >
                    <div className="pkg-btn-inner">
                      <div style={{ flex: 1 }}>
                        <div className="pkg-btn-badge" style={{ background: pkg.accent, color: pkg.bgFrom }}>{pkg.badge}</div>
                        <div className="pkg-btn-name">{pkg.name}</div>
                        <div className="pkg-btn-sub">{pkg.subtitle}</div>
                      </div>
                      <div className="pkg-btn-price" style={{ color: pkg.accent }}>{pkg.price}</div>
                    </div>
                    <div className="pkg-btn-preview">
                      <PackageAnim id={pkg.id} accent={pkg.accent} />
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'craft' && (() => {
            const colorData = CRAFT_COLORS.find(c => c.id === selectedColor) || CRAFT_COLORS[0]
            const patternData = CRAFT_PATTERNS.find(p => p.id === selectedPattern) || CRAFT_PATTERNS[0]
            return (
              <motion.div key="craft" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} className="section craft-section">
                {/* header */}
                <div className="craft-header">
                  <div className="craft-title">线上工坊</div>
                  <div className="craft-subtitle">做一盏你的专属客家花灯</div>
                  <div className="craft-stepper">
                    {['选形', '配色', '纹样', '完成'].map((label, i) => (
                      <div key={i} className={`craft-step ${craftStep === i ? 'cur' : craftStep > i ? 'done' : ''}`}>
                        <div className="craft-step-circle" style={craftStep >= i ? { background: colorData.hex } : {}}>
                          {craftStep > i ? '✓' : i + 1}
                        </div>
                        <div className="craft-step-label">{label}</div>
                        {i < 3 && <div className="craft-step-line" style={craftStep > i ? { background: colorData.hex } : {}} />}
                      </div>
                    ))}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {/* Step 0 选形 */}
                  {craftStep === 0 && (
                    <motion.div key="s0" className="craft-card" initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -32 }}>
                      <div className="craft-card-title">选择花灯形状</div>
                      <div className="craft-shape-grid">
                        {['圆形', '八角', '宫灯'].map(shape => (
                          <motion.button key={shape}
                            className={`craft-shape-card ${selectedShape === shape ? 'active' : ''}`}
                            style={selectedShape === shape ? { borderColor: colorData.hex, boxShadow: `0 0 0 2px ${colorData.hex}44` } : {}}
                            onClick={() => setSelectedShape(shape)}
                            whileTap={{ scale: 0.95 }}>
                            <CraftShapePreview shape={shape} active={selectedShape === shape} />
                            <span className="craft-shape-label">{shape}</span>
                          </motion.button>
                        ))}
                      </div>
                      <motion.button className="craft-next-btn" style={{ background: colorData.hex }}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        onClick={() => setCraftStep(1)}>
                        下一步：配色 →
                      </motion.button>
                    </motion.div>
                  )}

                  {/* Step 1 配色 */}
                  {craftStep === 1 && (
                    <motion.div key="s1" className="craft-card" initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -32 }}>
                      <div className="craft-card-title">选择花灯色彩</div>
                      <div className="craft-color-row">
                        {CRAFT_COLORS.map(c => (
                          <motion.button key={c.id} className={`craft-color-btn ${selectedColor === c.id ? 'active' : ''}`}
                            onClick={() => setSelectedColor(c.id)} whileTap={{ scale: 0.9 }}>
                            <motion.div className="craft-color-circle"
                              style={{ background: `linear-gradient(135deg,${c.light},${c.hex})` }}
                              animate={selectedColor === c.id ? { scale: 1.15, boxShadow: `0 0 0 3px ${c.hex}, 0 0 0 6px ${c.light}` } : { scale: 1, boxShadow: '0 0 0 0px transparent, 0 0 0 0px transparent' }}>
                              {selectedColor === c.id && (
                                <motion.span className="craft-color-check" initial={{ scale: 0 }} animate={{ scale: 1 }}>✓</motion.span>
                              )}
                            </motion.div>
                            <span className="craft-color-name">{c.name}</span>
                          </motion.button>
                        ))}
                      </div>
                      {/* lantern preview */}
                      <div className="craft-preview-wrap">
                        <CraftShapePreview shape={selectedShape} active />
                        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
                          <svg viewBox="0 0 80 108" width="80" height="108" style={{ position:'absolute' }}>
                            {selectedShape === '圆形' && <ellipse cx="40" cy="52" rx="29" ry="37" fill={colorData.hex} opacity="0.35"/>}
                            {selectedShape === '八角' && <path d="M 40 16 L 62 23 L 72 38 L 72 66 L 62 81 L 40 88 L 18 81 L 8 66 L 8 38 L 18 23 Z" fill={colorData.hex} opacity="0.35"/>}
                            {selectedShape === '宫灯' && <path d="M 40 16 Q 14 22 8 48 Q 4 68 14 82 Q 24 90 40 88 Q 56 90 66 82 Q 76 68 72 48 Q 66 22 40 16 Z" fill={colorData.hex} opacity="0.35"/>}
                          </svg>
                        </div>
                      </div>
                      <div className="craft-btn-row">
                        <button className="craft-back-btn" onClick={() => setCraftStep(0)}>← 返回</button>
                        <motion.button className="craft-next-btn" style={{ background: colorData.hex }}
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                          onClick={() => setCraftStep(2)}>下一步：纹样 →</motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2 纹样 */}
                  {craftStep === 2 && (
                    <motion.div key="s2" className="craft-card" initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -32 }}>
                      <div className="craft-card-title">选择吉祥纹样</div>
                      <div className="craft-pattern-grid">
                        {CRAFT_PATTERNS.map((p, i) => (
                          <motion.button key={p.id}
                            className={`craft-pattern-card ${selectedPattern === p.id ? 'active' : ''}`}
                            style={selectedPattern === p.id ? { borderColor: colorData.hex, background: colorData.light } : {}}
                            onClick={() => setSelectedPattern(p.id)}
                            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            whileTap={{ scale: 0.96 }}>
                            <CraftPatternIcon id={p.id} color={selectedPattern === p.id ? colorData.hex : '#64748b'} size={52} />
                            <span className="craft-pattern-name">{p.name}</span>
                            <span className="craft-pattern-desc">{p.desc}</span>
                          </motion.button>
                        ))}
                      </div>
                      <div className="craft-btn-row">
                        <button className="craft-back-btn" onClick={() => setCraftStep(1)}>← 返回</button>
                        <motion.button className="craft-next-btn" style={{ background: colorData.hex }}
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                          onClick={() => setCraftStep(3)}>完成制作 ✨</motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3 完成 */}
                  {craftStep === 3 && (
                    <motion.div key="s3" className="craft-card craft-result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      {SPARKLE_POS.map(([left, top], i) => (
                        <motion.div key={i} className="craft-sparkle"
                          style={{ left: `${left}%`, top: `${top}%`, background: colorData.hex }}
                          animate={{ scale: [0,1.4,0], opacity: [0,1,0] }}
                          transition={{ duration: 1.4, delay: i * 0.18, repeat: Infinity, repeatDelay: 2 }} />
                      ))}
                      <motion.div className="craft-done-title"
                        initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        🎉 专属花灯制作完成！
                      </motion.div>
                      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, type: 'spring', bounce: 0.3 }}>
                        <CraftFinalLantern shape={selectedShape} colorId={selectedColor} patternId={selectedPattern} />
                      </motion.div>
                      <motion.div className="craft-result-tags"
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
                        <span className="craft-tag">{selectedShape}</span>
                        <span className="craft-tag" style={{ color: colorData.hex, borderColor: colorData.hex + '44' }}>{colorData.name}</span>
                        <span className="craft-tag">{patternData.name} · {patternData.desc}</span>
                      </motion.div>
                      <motion.button className="craft-share-btn"
                        style={{ background: `linear-gradient(135deg,${colorData.dark},${colorData.hex})` }}
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
                        onClick={() => { setPosterStyle(Math.floor(Math.random() * 4)); setShowPoster(true) }}>
                        <Heart className="button-icon" size={16} /> 保存花灯 · 领取体验券
                      </motion.button>
                      <motion.button className="craft-restart-btn"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
                        onClick={() => { setCraftStep(0); setSelectedShape('圆形'); setSelectedColor('red'); setSelectedPattern('peony') }}>
                        重新制作
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })()}
        </AnimatePresence>
      </div>

      {/* 视频overlay - 放在page-body外，全屏显示 */}
      <AnimatePresence>
        {showIntroVideo && (
          <motion.div
            className="intro-overlay"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <motion.video
              ref={videoRef}
              id="intro-video"
              className="intro-video"
              src={PANORAMA_VIDEO}
              controls
              preload="auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              onEnded={() => {
                setShowIntroVideo(false)
                clearFallbackTimer()
                handleVideoEnded()
              }}
            />
            <motion.div
              className="intro-controls"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <button className="intro-btn skip" onClick={handleSkipIntro}>跳过</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showSchemeModal && (
        <motion.div 
          className="scheme-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            setShowSchemeModal(false)
            setSchemeZoom(1)
            setSchemePan({ x: 0, y: 0 })
          }}
        >
          <motion.div 
            className="scheme-modal-container"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="scheme-modal-close"
              onClick={() => {
                setShowSchemeModal(false)
                setSchemeZoom(1)
                setSchemePan({ x: 0, y: 0 })
              }}
            >
              <X size={28} />
            </button>
            <div className="scheme-image-wrapper">
              <img 
                ref={schemeImageRef}
                src={currentScene.img} 
                alt="建筑方案全景图"
                className="scheme-modal-image"
                style={{
                  transform: `scale(${schemeZoom}) translate(${schemePan.x}px, ${schemePan.y}px)`,
                  cursor: schemeZoom > 1 ? 'grab' : 'default',
                }}
                onTouchStart={(e) => {
                  if (e.touches.length === 2) {
                    const touch1 = e.touches[0]
                    const touch2 = e.touches[1]
                    const distance = Math.hypot(
                      touch2.clientX - touch1.clientX,
                      touch2.clientY - touch1.clientY
                    )
                    schemeLastDistanceRef.current = distance
                  }
                }}
                onTouchMove={(e) => {
                  if (e.touches.length === 2 && schemeLastDistanceRef.current) {
                    const touch1 = e.touches[0]
                    const touch2 = e.touches[1]
                    const distance = Math.hypot(
                      touch2.clientX - touch1.clientX,
                      touch2.clientY - touch1.clientY
                    )
                    const scale = distance / schemeLastDistanceRef.current
                    setSchemeZoom((prev) => Math.max(1, Math.min(4, prev * scale)))
                    schemeLastDistanceRef.current = distance
                  }
                }}
                onTouchEnd={() => {
                  schemeLastDistanceRef.current = null
                }}
                onDoubleClick={() => {
                  if (schemeZoom > 1.5) {
                    setSchemeZoom(1)
                    setSchemePan({ x: 0, y: 0 })
                  } else {
                    setSchemeZoom(2.5)
                  }
                }}
              />
            </div>
            <div className="scheme-modal-info">
              <h3>建筑总览</h3>
              <p>忠信花灯·客家海宴建筑方案全景图</p>
              <p style={{ marginTop: '12px', fontSize: '12px', opacity: 0.7 }}>
                {schemeZoom > 1 ? '拖动查看 | 双击缩小' : '双击放大 | 捏合缩放'}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="tabbar">
        <button className={`tab-button ${activeTab === 'roam' ? 'active' : ''}`} onClick={() => setActiveTab('roam')}>
          <MapPin />
          <span>空间漫游</span>
        </button>
        <button className={`tab-button ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
          <BookOpen />
          <span>花灯溯源</span>
        </button>
        <button className={`tab-button ${activeTab === 'menu' ? 'active' : ''}`} onClick={() => setActiveTab('menu')}>
          <Utensils />
          <span>夜宴预订</span>
        </button>
        <button className={`tab-button ${activeTab === 'craft' ? 'active' : ''}`} onClick={() => setActiveTab('craft')}>
          <Sparkles />
          <span>非遗手作</span>
        </button>
      </div>

      <AnimatePresence>
        {showBlessing && (
          <motion.div className="blessing-mask" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <FloatingLanterns />
            <button className="blessing-close" onClick={() => setShowBlessing(false)}><X size={18} /></button>
            <div className="blessing-content">
              <motion.div
                className="blessing-main-title"
                initial={{ y: -24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                主灯祈福
              </motion.div>

              <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4, duration: 0.7, type: 'spring', bounce: 0.35 }}>
                <MasterLantern />
              </motion.div>

              <div className="blessing-phrases">
                <motion.div className="blessing-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
                  祝您
                </motion.div>
                {BLESSINGS.map((phrase, i) => (
                  <motion.div
                    key={phrase}
                    className="blessing-phrase"
                    initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.25 + i * 0.38, duration: 0.55, ease: 'easeOut' }}
                  >
                    {phrase}
                  </motion.div>
                ))}
              </div>

              <motion.button
                className="blessing-btn"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.0 }}
                onClick={() => setShowBlessing(false)}
              >
                收下祝福
              </motion.button>
            </div>
          </motion.div>
        )}

        {selectedHistory && (
          <HistoryDetailModal
            key={selectedHistory.id}
            item={selectedHistory}
            onClose={() => setSelectedHistory(null)}
          />
        )}
        {selectedDish && (
          <DishModal
            key={selectedDish.id}
            item={selectedDish}
            onClose={() => setSelectedDish(null)}
          />
        )}
        {selectedPackage && (
          <PackageModal
            key={selectedPackage.id}
            item={selectedPackage}
            onClose={() => setSelectedPackage(null)}
          />
        )}
        {showPoster && (
          <PosterModal
            key={`poster-${posterStyle}`}
            shape={selectedShape}
            colorId={selectedColor}
            patternId={selectedPattern}
            styleIdx={posterStyle}
            onClose={() => setShowPoster(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
