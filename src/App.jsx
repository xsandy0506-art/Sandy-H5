import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, Check, Palette, Play, Sparkles, Utensils, Volume2, VolumeX, X } from 'lucide-react'

const HERO_VIDEO = '/panorama.mp4'

const IMAGE_MAP = {
  schemePlan: '/scheme-plan.jpg',
  nightAerial: '/night-aerial.jpg',
  dayAerial: '/day-aerial.jpg',
  entrance: '/welcome-gate.jpg',
  centerLantern: '/center-lantern.jpg',
  waterfront: '/waterfront.jpg',
  gallery: '/gallery.jpg',
  promenade: '/promenade.jpg',
}

const SCENES = [
  { id: 'scheme', key: 'schemePlan', name: '建筑总览', icon: '🏛', desc: '忠信花灯·客家海宴建筑方案全景图', video: null },
  { id: 'entrance', key: 'entrance', name: '迎灯门', icon: '🚪', desc: '客家迎客礼仪，步入千年客韵', video: '/panorama-2.mp4' },
  { id: 'center', key: 'centerLantern', name: '花灯阵', icon: '🏮', desc: '中心巨型花灯，光影随视角变幻', video: '/panorama-3.mp4' },
  { id: 'waterfront', key: 'waterfront', name: '临水宴', icon: '🌊', desc: '黄昏微醺，入夜宴饮，绝佳观景', video: '/panorama-4.mp4' },
  { id: 'gallery', key: 'gallery', name: '展长廊', icon: '🖼', desc: '非遗传承，客家文化深度体验', video: '/panorama-5.mp4' },
  { id: 'promenade', key: 'promenade', name: '滨海道', icon: '🏖', desc: '海风拂面，远眺珠海城市天际线', video: '/panorama-6.mp4' },
]

const HISTORY_ITEMS = [
  { id: 'song', era: '宋代起源', title: '花灯礼序初成', desc: '从祈福灯影到迎宾礼序，花灯逐步进入客家公共生活。', detail: '花灯最早承载祈福、祭祖与迎宾功能，逐渐沉淀为客家礼制与节庆空间的重要视觉符号。', icon: '宋', color: '#fff7ed', accent: '#ea580c' },
  { id: 'ming', era: '明清兴盛', title: '灯阵与宴席并行', desc: '花灯、门楼与宴席动线共同构成完整的入宴仪式。', detail: '明清时期，花灯工艺和客家宴席秩序相互强化，形成了“入门、观灯、入席、祈福”的完整体验链路。', icon: '明', color: '#fef2f2', accent: '#dc2626' },
  { id: 'modern', era: '现代传承', title: '非遗进入日常', desc: '从节庆技艺转化为可被持续体验的文化空间。', detail: '花灯从传统节日工艺逐渐走向展陈、文旅和餐饮空间，成为可参与、可讲述、可传播的日常文化体验。', icon: '今', color: '#eff6ff', accent: '#2563eb' },
  { id: 'zhuhai', era: '珠海新生', title: '海宴夜景融合', desc: '以花灯为媒，把滨水夜宴做成珠海的新名片。', detail: '在珠海语境下，花灯不再只是传统符号，而与海风、夜景、宴席和城市观景轴一起重构了当代体验。', icon: '海', color: '#ecfeff', accent: '#0891b2' },
]

const MENU_ITEMS = [
  { id: 'tofu', name: '花好月圆', subtitle: '客家酿豆腐', tag: '非遗技艺', price: '¥88', icon: '🥢', bgColor: '#fef9ec', desc: '以手工嫩豆腐为皮，填入秘制猪肉鱼肉馅料，以客家古法文火慢煮。豆腐嫩滑细腻，内馅鲜香饱满。', ingredients: ['手工豆腐', '猪肉', '鱼肉', '葱姜', '非遗配方'] },
  { id: 'chicken', name: '灯火可亲', subtitle: '古法粗盐焗鸡', tag: '古法工艺', price: '¥168', icon: '🍗', bgColor: '#fffbeb', desc: '选用珠海散养走地鸡，以千年传承粗盐焗法烹制。皮脆肉嫩，咸香鲜甜。', ingredients: ['走地鸡', '粗海盐', '沙姜', '玫瑰露酒', '香叶'] },
  { id: 'oyster', name: '海韵客情', subtitle: '珠海鲜蚝烙', tag: '海鲜臻品', price: '¥128', icon: '🦪', bgColor: '#ecfdf5', desc: '珠海桂山岛直送新鲜生蚝，以客家传统煎烙手法烹制，蚝肉鲜嫩多汁。', ingredients: ['桂山岛生蚝', '红薯粉', '鲜鸡蛋', '葱花', '海鲜酱'] },
  { id: 'dumpling', name: '竹报平安', subtitle: '传统客家笋粄', tag: '传统手作', price: '¥58', icon: '🥟', bgColor: '#f0fdf4', desc: '以糯米粉制皮，包入鲜竹笋、猪肉、虾仁馅料，皮薄馅丰，笋香清甜。', ingredients: ['鲜竹笋', '糯米粉', '猪肉', '虾仁', '香菇'] },
]

const PACKAGES = [
  { id: 'couple', name: '两人花灯夜宴', subtitle: '浪漫双人套餐', price: '¥688', badge: '热门推荐', desc: '适合情侣与纪念日晚餐，包含主灯仪式、双人夜宴与滨水夜景座位。', includes: ['双人夜宴套餐', '主灯祈福体验', '滨水观景席', '专属拍照点位'], from: '#7f1d1d', to: '#b91c1c' },
  { id: 'family', name: '家宴团圆席', subtitle: '四至六人共享', price: '¥1288', badge: '家庭首选', desc: '适合亲友聚餐与节庆团圆，完整体验花灯入宴动线与非遗手作环节。', includes: ['六道招牌菜', '花灯迎宾流程', '节庆祝福牌', '家庭拍照纪念'], from: '#9a3412', to: '#ea580c' },
  { id: 'custom', name: '定制企业雅集', subtitle: '商务与团建活动', price: '¥2999 起', badge: '可定制', desc: '支持企业晚宴、文化沙龙与品牌活动，提供花灯主题空间与专属内容设计。', includes: ['专属场地布置', '主题欢迎词', '企业定制菜单', '活动执行支持'], from: '#0f766e', to: '#0ea5e9' },
]

const BLESSINGS = ['风调雨顺', '国泰民安', '岁岁平安', '阖家欢乐']
const CRAFT_COLORS = [
  { id: 'red', name: '绛红', hex: '#dc2626' },
  { id: 'gold', name: '鎏金', hex: '#d97706' },
  { id: 'teal', name: '海青', hex: '#0f766e' },
]
const CRAFT_PATTERNS = [
  { id: 'peony', name: '牡丹纹', desc: '寓意富贵与团圆' },
  { id: 'cloud', name: '祥云纹', desc: '寓意吉庆与顺遂' },
  { id: 'wave', name: '海潮纹', desc: '寓意海宴与生机' },
]

function LanternShape({ shape, active }) {
  if (shape === '八角') {
    return (
      <svg viewBox="0 0 120 120" className="craft-shape-svg" aria-hidden="true">
        <polygon points="42,8 78,8 102,30 102,90 78,112 42,112 18,90 18,30" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="8" />
      </svg>
    )
  }

  if (shape === '宫灯') {
    return (
      <svg viewBox="0 0 120 120" className="craft-shape-svg" aria-hidden="true">
        <path d="M36 22h48l10 16v42l-10 18H36L26 80V38z" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="8" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 120 120" className="craft-shape-svg" aria-hidden="true">
      <circle cx="60" cy="60" r="42" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="8" />
    </svg>
  )
}

export default function App() {
  const audioRef = useRef(null)
  const introVideoRef = useRef(null)
  const introTimerRef = useRef(null)

  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('home')
  const [isLit, setIsLit] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [selectedSceneId, setSelectedSceneId] = useState(SCENES[0].id)
  const [collected, setCollected] = useState({})
  const [showIntroVideo, setShowIntroVideo] = useState(false)
  const [currentVideo, setCurrentVideo] = useState(HERO_VIDEO)
  const [showSchemeModal, setShowSchemeModal] = useState(false)
  const [selectedHistory, setSelectedHistory] = useState(null)
  const [selectedDish, setSelectedDish] = useState(null)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [showBlessing, setShowBlessing] = useState(false)
  const [selectedBlessing, setSelectedBlessing] = useState(BLESSINGS[0])
  const [craftStep, setCraftStep] = useState(0)
  const [craftShape, setCraftShape] = useState('圆形')
  const [craftColor, setCraftColor] = useState(CRAFT_COLORS[0])
  const [craftPattern, setCraftPattern] = useState(CRAFT_PATTERNS[0])

  const scenesWithImages = useMemo(() => SCENES.map((scene) => ({ ...scene, img: IMAGE_MAP[scene.key] })), [])
  const selectedScene = scenesWithImages.find((scene) => scene.id === selectedSceneId) || scenesWithImages[0]
  const collectedCount = Object.keys(collected).length
  const allCollected = collectedCount >= scenesWithImages.length
  const heroImage = isLit ? IMAGE_MAP.nightAerial : IMAGE_MAP.dayAerial

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 1000)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.loop = true
    audio.volume = 0.45
    if (!audioEnabled || showIntroVideo) {
      audio.pause()
      return
    }
    audio.play().catch(() => {})
  }, [audioEnabled, showIntroVideo])

  useEffect(() => {
    if (!showIntroVideo) return
    const video = introVideoRef.current
    if (!video) return
    video.currentTime = 0
    video.play().catch(() => {})
  }, [showIntroVideo, currentVideo])

  useEffect(() => () => window.clearTimeout(introTimerRef.current), [])

  const openSceneVideo = (scene) => {
    if (!scene.video) {
      setShowSchemeModal(true)
      return
    }
    setCurrentVideo(scene.video)
    setShowIntroVideo(true)
  }

  const handleLightLantern = () => {
    setIsLit(true)
    setCurrentVideo(HERO_VIDEO)
    window.clearTimeout(introTimerRef.current)
    introTimerRef.current = window.setTimeout(() => setShowIntroVideo(true), 5000)
  }

  const handleCloseIntro = () => {
    window.clearTimeout(introTimerRef.current)
    setShowIntroVideo(false)
    setActiveTab('roam')
  }

  const handleSceneSelect = (scene) => {
    setSelectedSceneId(scene.id)
    setActiveTab('roam')
    openSceneVideo(scene)
  }

  const handleCollectScene = (scene) => {
    setCollected((current) => ({ ...current, [scene.id]: true }))
    if (scene.id === 'scheme') {
      setShowSchemeModal(true)
      return
    }
    openSceneVideo(scene)
  }

  return (
    <div className="app">
      <audio ref={audioRef} preload="auto" style={{ display: 'none' }}>
        <source src="/background-music.m4a" type="audio/mp4" />
      </audio>

      <button className="audio-control-btn" type="button" onClick={() => setAudioEnabled((current) => !current)} aria-label={audioEnabled ? '关闭背景音乐' : '开启背景音乐'}>
        {audioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>

      <AnimatePresence>
        {isLoading && (
          <motion.div className="loading-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="loader">
              <div className="brand-logo">🏮</div>
              <div className="loader-text brand-title">忠信花灯</div>
              <div className="loader-text brand-sub">正在点亮空间，马上就好…</div>
              <motion.div className="loader-progress" initial={{ width: 0 }} animate={{ width: '80%' }} transition={{ duration: 0.8 }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {activeTab === 'home' && (
          <motion.div key="home" className="home-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="hero-background" style={{ backgroundImage: `url(${heroImage})` }} />
            <div className="hero-overlay" />
            <div className="hero-content">
              <div className="hero-label">忠信花灯</div>
              <div className="hero-title">客家海宴餐厅</div>
              <div className="hero-copy">一盏花灯 千年客韵<br />一席海宴 百味归家</div>
              {isLit ? (
                <div className="hero-status">
                  <Sparkles size={18} /> 花灯已亮，正在入宴...
                </div>
              ) : (
                <button className="hero-button" type="button" onClick={handleLightLantern}>
                  <Sparkles className="button-icon" size={18} />
                  点亮花灯
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="page-body">
        <AnimatePresence mode="wait">
          {activeTab === 'roam' && (
            <motion.section key="roam" className="section" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}>
              <div className="card">
                <div className="card-row">
                  <div>
                    <div className="card-label">空间漫游</div>
                    <div className="card-small">点击场景图或“全景导览”直接播放对应视频</div>
                  </div>
                </div>

                <div className="scene-frame" role="button" tabIndex={0} onClick={() => openSceneVideo(selectedScene)} onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && openSceneVideo(selectedScene)}>
                  <img className="scene-image" src={selectedScene.img} alt={selectedScene.name} />
                  <button className="scene-label" type="button" onClick={(event) => { event.stopPropagation(); openSceneVideo(selectedScene) }}>
                    <Play size={14} />
                    全景导览
                  </button>
                  <div className="scene-name">{selectedScene.name}</div>
                  <div className="scene-desc">{selectedScene.desc}</div>
                </div>

                <button className="collect-button" type="button" onClick={() => handleCollectScene(selectedScene)}>
                  {collected[selectedScene.id] ? <><Check size={16} /> 已收集</> : <><Sparkles size={16} /> 收集此场景碎片</>}
                </button>

                <div className="card-row">
                  <div>
                    <div className="card-label">收集花灯碎片</div>
                    <div className="card-small">已收集 {collectedCount} / {scenesWithImages.length}</div>
                  </div>
                  <div className="progress-wrapper">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${(collectedCount / scenesWithImages.length) * 100}%` }} />
                    </div>
                  </div>
                </div>

                <div className="scene-tabs">
                  {scenesWithImages.map((scene) => (
                    <motion.button key={scene.id} className={`scene-button ${selectedScene.id === scene.id ? 'active' : ''}`} type="button" whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} onClick={() => handleSceneSelect(scene)}>
                      <span className="scene-icon">{scene.icon}</span>
                      <span className="scene-text">{scene.name}</span>
                      {collected[scene.id] && <span className="scene-checked">✓</span>}
                    </motion.button>
                  ))}
                </div>

                <button className={`cta-button ${allCollected ? 'primary' : 'disabled'}`} type="button" onClick={() => allCollected && setShowBlessing(true)}>
                  {allCollected ? '点亮主灯，祈福迎祥' : '游历上方场景，集齐碎片解锁'}
                </button>
              </div>
            </motion.section>
          )}

          {activeTab === 'history' && (
            <motion.section key="history" className="section" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}>
              <div className="section-title">忠信花灯非遗档案</div>
              <div className="section-copy">从宋代起源到珠海新生，探索花灯背后的客家礼序。</div>
              <div className="timeline">
                {HISTORY_ITEMS.map((item, index) => (
                  <motion.div key={item.id} className="timeline-item clickable" role="button" tabIndex={0} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.08 }} onClick={() => setSelectedHistory(item)} onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && setSelectedHistory(item)}>
                    <div className="timeline-badge" style={{ background: item.color, color: item.accent }}>{item.icon}</div>
                    <div>
                      <div className="timeline-era">{item.era}</div>
                      <div className="timeline-title">{item.title}</div>
                      <div className="timeline-text">点击探索花灯背后的故事 →</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {activeTab === 'menu' && (
            <motion.section key="menu" className="section" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}>
              <div className="menu-hero card">
                <div className="menu-hero-title">花灯海宴菜单</div>
                <div className="menu-hero-copy">从非遗客味到珠海海鲜，把一席海宴做成可被记住的灯下风味。</div>
              </div>

              <div className="menu-list">
                {MENU_ITEMS.map((dish) => (
                  <motion.button key={dish.id} className="menu-item card small-card" type="button" whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} onClick={() => setSelectedDish(dish)}>
                    <div className="menu-thumb" style={{ background: dish.bgColor }}>{dish.icon}</div>
                    <div className="menu-desc">
                      <div className="dish-name-row">
                        <div className="menu-name">{dish.name}</div>
                        <div className="menu-price">{dish.price}</div>
                      </div>
                      <div className="dish-modal-subtitle">{dish.subtitle}</div>
                      <div className="menu-tag">{dish.tag}</div>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="card pkg-card">
                <div className="section-title">夜宴套餐</div>
                <div className="section-copy">把空间、菜品、祝福和夜景整合进完整的入宴体验。</div>
                <div className="pkg-includes">
                  {PACKAGES.map((pkg) => (
                    <button key={pkg.id} className="pkg-btn" type="button" onClick={() => setSelectedPackage(pkg)} style={{ background: `linear-gradient(135deg, ${pkg.from}, ${pkg.to})` }}>
                      <div className="pkg-btn-inner">
                        <div className="pkg-btn-preview">{pkg.badge}</div>
                        <div className="pkg-btn-name">{pkg.name}</div>
                        <div className="pkg-btn-sub">{pkg.subtitle}</div>
                      </div>
                      <div className="pkg-btn-price">{pkg.price}</div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {activeTab === 'craft' && (
            <motion.section key="craft" className="section craft-section" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}>
              <div className="craft-header">
                <div className="craft-title">非遗手作</div>
                <div className="craft-subtitle">做一盏属于你的花灯，再把它带进今晚的海宴故事里。</div>
              </div>

              <div className="craft-stepper">
                {['形状', '配色', '纹样', '完成'].map((label, index) => (
                  <div key={label} className="craft-step-label">
                    <div className="craft-step-circle" style={craftStep >= index ? { background: craftColor.hex, borderColor: craftColor.hex, color: '#fff' } : {}}>{craftStep > index ? '✓' : index + 1}</div>
                    {label}
                    {index < 3 && <div className="craft-step-line" style={craftStep > index ? { background: craftColor.hex } : {}} />}
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {craftStep === 0 && (
                  <motion.div key="shape" className="craft-card" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
                    <div className="craft-card-title">选择花灯形状</div>
                    <div className="craft-shape-grid">
                      {['圆形', '八角', '宫灯'].map((shape) => (
                        <button key={shape} className={`craft-shape-card ${craftShape === shape ? 'active' : ''}`} type="button" onClick={() => setCraftShape(shape)}>
                          <LanternShape shape={shape} active={craftShape === shape} />
                          <span className="craft-shape-label">{shape}</span>
                        </button>
                      ))}
                    </div>
                    <div className="craft-btn-row">
                      <button className="craft-next-btn" type="button" style={{ background: craftColor.hex }} onClick={() => setCraftStep(1)}>下一步：配色 →</button>
                    </div>
                  </motion.div>
                )}

                {craftStep === 1 && (
                  <motion.div key="color" className="craft-card" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
                    <div className="craft-card-title">选择花灯色彩</div>
                    <div className="craft-pattern-grid">
                      {CRAFT_COLORS.map((color) => (
                        <button key={color.id} className="craft-color-row" type="button" onClick={() => setCraftColor(color)}>
                          <span className="craft-color-circle" style={{ background: color.hex }} />
                          <span className="craft-color-name">{color.name}</span>
                          {craftColor.id === color.id && <Check className="craft-color-check" size={16} />}
                        </button>
                      ))}
                    </div>
                    <div className="craft-btn-row">
                      <button className="craft-back-btn" type="button" onClick={() => setCraftStep(0)}>返回</button>
                      <button className="craft-next-btn" type="button" style={{ background: craftColor.hex }} onClick={() => setCraftStep(2)}>下一步：纹样 →</button>
                    </div>
                  </motion.div>
                )}

                {craftStep === 2 && (
                  <motion.div key="pattern" className="craft-card" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
                    <div className="craft-card-title">选择花灯纹样</div>
                    <div className="craft-pattern-grid">
                      {CRAFT_PATTERNS.map((pattern) => (
                        <button key={pattern.id} className={`craft-shape-card ${craftPattern.id === pattern.id ? 'active' : ''}`} type="button" onClick={() => setCraftPattern(pattern)}>
                          <Palette size={20} />
                          <span className="craft-pattern-name">{pattern.name}</span>
                          <span className="craft-pattern-desc">{pattern.desc}</span>
                        </button>
                      ))}
                    </div>
                    <div className="craft-btn-row">
                      <button className="craft-back-btn" type="button" onClick={() => setCraftStep(1)}>返回</button>
                      <button className="craft-next-btn" type="button" style={{ background: craftColor.hex }} onClick={() => setCraftStep(3)}>完成制作 →</button>
                    </div>
                  </motion.div>
                )}

                {craftStep === 3 && (
                  <motion.div key="result" className="craft-card craft-result" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
                    <div className="craft-done-title">你的专属花灯已完成</div>
                    <div className="craft-preview-wrap" style={{ color: craftColor.hex }}>
                      <LanternShape shape={craftShape} active />
                    </div>
                    <div className="craft-result-tags">
                      <span className="craft-tag">{craftShape}</span>
                      <span className="craft-tag">{craftColor.name}</span>
                      <span className="craft-tag">{craftPattern.name}</span>
                    </div>
                    <button className="craft-share-btn" type="button" onClick={() => setShowBlessing(true)}>
                      <Sparkles size={16} />
                      生成祈福海报
                    </button>
                    <button className="craft-restart-btn" type="button" onClick={() => { setCraftStep(0); setCraftShape('圆形'); setCraftColor(CRAFT_COLORS[0]); setCraftPattern(CRAFT_PATTERNS[0]); }}>重新制作</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {activeTab !== 'home' && (
        <div className="tabbar">
          <button type="button" className={activeTab === 'roam' ? 'active' : ''} onClick={() => setActiveTab('roam')}>空间漫游</button>
          <button type="button" className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}>花灯溯源</button>
          <button type="button" className={activeTab === 'menu' ? 'active' : ''} onClick={() => setActiveTab('menu')}>夜宴预订</button>
          <button type="button" className={activeTab === 'craft' ? 'active' : ''} onClick={() => setActiveTab('craft')}>非遗手作</button>
        </div>
      )}

      <AnimatePresence>
        {showIntroVideo && (
          <motion.div className="intro-overlay" role="dialog" aria-modal="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.video ref={introVideoRef} className="intro-video" src={currentVideo} controls preload="auto" initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }} onEnded={handleCloseIntro} />
            <div className="intro-controls">
              <button className="intro-btn skip" type="button" onClick={handleCloseIntro}>跳过</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSchemeModal && (
          <motion.div className="scheme-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSchemeModal(false)}>
            <motion.div className="scheme-modal-container" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(event) => event.stopPropagation()}>
              <button className="scheme-modal-close" type="button" onClick={() => setShowSchemeModal(false)}><X size={18} /></button>
              <div className="scheme-image-wrapper">
                <img className="scheme-modal-image" src={IMAGE_MAP.schemePlan} alt="建筑总览" />
              </div>
              <div className="history-modal-title">建筑总览</div>
              <div className="history-modal-desc">总平面以迎灯门、中心花灯、临水夜宴、展长廊与滨海道构成一条渐进式入宴体验轴。</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedHistory && (
          <motion.div className="blessing-mask" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedHistory(null)}>
            <motion.div className="history-modal" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} onClick={(event) => event.stopPropagation()}>
              <div className="history-modal-header">
                <div>
                  <div className="history-era-badge">{selectedHistory.era}</div>
                  <div className="history-modal-title">{selectedHistory.title}</div>
                </div>
                <button className="history-modal-close" type="button" onClick={() => setSelectedHistory(null)}><X size={18} /></button>
              </div>
              <div className="history-modal-body">
                <div className="history-modal-desc">{selectedHistory.detail}</div>
                <div className="history-modal-quote">“{selectedHistory.desc}”</div>
                <button className="history-modal-btn" type="button" onClick={() => setSelectedHistory(null)}>收起</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedDish && (
          <motion.div className="blessing-mask" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedDish(null)}>
            <motion.div className="dish-modal" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} onClick={(event) => event.stopPropagation()}>
              <div className="dish-modal-header">
                <div className="dish-name-row">
                  <div>
                    <div className="dish-modal-name">{selectedDish.name}</div>
                    <div className="dish-modal-subtitle">{selectedDish.subtitle}</div>
                  </div>
                  <button className="dish-modal-close" type="button" onClick={() => setSelectedDish(null)}><X size={18} /></button>
                </div>
              </div>
              <div className="dish-modal-body">
                <div className="dish-modal-price">{selectedDish.price}</div>
                <div className="dish-modal-desc">{selectedDish.desc}</div>
                <div className="dish-ing-label">食材构成</div>
                <div className="dish-ing-tags">
                  {selectedDish.ingredients.map((ingredient) => (
                    <span key={ingredient} className="dish-ing-tag">{ingredient}</span>
                  ))}
                </div>
                <button className="dish-order-btn" type="button" onClick={() => setSelectedDish(null)}>加入夜宴愿望单</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPackage && (
          <motion.div className="blessing-mask" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedPackage(null)}>
            <motion.div className="pkg-modal" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} onClick={(event) => event.stopPropagation()}>
              <div className="pkg-modal-header" style={{ background: `linear-gradient(135deg, ${selectedPackage.from}, ${selectedPackage.to})` }}>
                <div className="pkg-name-row">
                  <div>
                    <div className="pkg-modal-name">{selectedPackage.name}</div>
                    <div className="pkg-modal-subtitle">{selectedPackage.subtitle}</div>
                  </div>
                  <button className="pkg-modal-close" type="button" onClick={() => setSelectedPackage(null)}><X size={18} /></button>
                </div>
              </div>
              <div className="pkg-modal-body">
                <div className="pkg-modal-price">{selectedPackage.price}</div>
                <div className="pkg-modal-desc">{selectedPackage.desc}</div>
                <div className="pkg-includes">
                  {selectedPackage.includes.map((item) => (
                    <div key={item} className="pkg-inc-item">
                      <span className="pkg-inc-dot" />
                      <span className="pkg-inc-label">{item}</span>
                    </div>
                  ))}
                </div>
                <button className="pkg-order-btn" type="button" onClick={() => setSelectedPackage(null)}>预约此套餐</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBlessing && (
          <motion.div className="poster-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowBlessing(false)}>
            <motion.div className="poster-wrapper" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(event) => event.stopPropagation()}>
              <button className="poster-close-btn" type="button" onClick={() => setShowBlessing(false)}><X size={18} /></button>
              <div className="poster-content">
                <div className="poster-top-label">主灯祈福</div>
                <div className="poster-main-title">忠信花灯</div>
                <div className="poster-sub-title">客家海宴 齐聚成灯</div>
                <div className="poster-blessing">{selectedBlessing}</div>
                <div className="poster-lantern-area">🏮</div>
                <div className="blessing-phrases">
                  {BLESSINGS.map((phrase) => (
                    <button key={phrase} className={`blessing-btn ${selectedBlessing === phrase ? 'active' : ''}`} type="button" onClick={() => setSelectedBlessing(phrase)}>
                      {phrase}
                    </button>
                  ))}
                </div>
                <div className="poster-bottom-text">已集齐 {collectedCount} 枚碎片 · 花灯已亮</div>
              </div>
              <div className="poster-actions">
                <button className="menu-action" type="button" onClick={() => setShowBlessing(false)}>
                  <BookOpen size={16} />
                  收起海报
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
