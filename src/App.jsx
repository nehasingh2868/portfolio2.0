import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue } from 'framer-motion'
import { gsap } from 'gsap'

const services = [
  {
    title: 'Meta Ads',
    desc: 'Performance driven campaigns focused on scaling profitable revenue.',
    icon: '🎯'
  },
  {
    title: 'Google Ads',
    desc: 'Search, shopping and YouTube campaigns optimized for conversions.',
    icon: '🔍'
  },
  {
    title: 'Creative Strategy',
    desc: 'UGC, hooks and ad creatives designed for higher CTR and ROAS.',
    icon: '🎨'
  },
  {
    title: 'Landing Page CRO',
    desc: 'Luxury high converting pages built for scale and retention.',
    icon: '⚡'
  },
  {
    title: 'Email Marketing',
    desc: 'Retention systems and automated flows for repeat purchases.',
    icon: '✉️'
  },
  {
    title: 'Funnel Optimization',
    desc: 'Complete customer journey optimization from click to purchase.',
    icon: '🔄'
  }
]

const stats = [
  {
    value: 25,
    suffix: 'Cr+',
    label: 'Revenue Generated'
  },
  {
    value: 10,
    suffix: 'Cr+',
    label: 'Ad Spend Managed'
  },
  {
    value: 4.8,
    suffix: 'X',
    label: 'Average ROAS'
  },
  {
    value: 80,
    suffix: '+',
    label: 'Brands Scaled'
  }
]

const caseStudiesData = {
  jewelry: [
    {
      brand: 'Aura Jewels',
      category: 'jewelry',
      result: 'Scaled monthly revenue from ₹5L to ₹32L with a 4.2X ROAS.',
      insights: 'Leveraged high-visual UGC creatives showing jewelry shine under natural light. Built dedicated high-speed landing pages to highlight product premium quality, increasing average order value (AOV) by 32%.',
      image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1200&auto=format&fit=crop',
      metrics: ['4.2X ROAS', '₹32L Revenue', '+32% AOV Growth'],
      services: ['Meta Ads', 'Landing Page CRO', 'Creative Strategy'],
      shopifyData: [120, 240, 310, 480, 520, 780, 960],
      metaData: [45, 60, 92, 120, 180, 240, 310]
    },
    {
      brand: 'Vedic Gold',
      category: 'jewelry',
      result: 'Reduced acquisition cost (CPA) by 46% while scaling sales volume.',
      insights: 'Implemented custom funnel targeting collectors of traditional designs. Restructured the meta account using Advantage+ campaigns paired with high-intent catalog sales.',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop',
      metrics: ['46% Lower CPA', '3.9X ROAS', '2.8X Purchase Rate'],
      services: ['Meta Ads', 'Google Ads', 'Funnel Optimization'],
      shopifyData: [80, 140, 200, 220, 290, 410, 550],
      metaData: [30, 45, 55, 80, 110, 130, 190]
    },
    {
      brand: 'Luna Silver Co.',
      category: 'jewelry',
      result: 'Achieved ₹18L/mo revenue starting from scratch in 90 days.',
      insights: 'Focused on micro-influencer gifting campaigns. Used the generated video assets in TikTok/Instagram Reels Ads leading to direct checkouts on mobile-first landing pages.',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop',
      metrics: ['5.1X ROAS', '₹18L Revenue', '3.5% Conversion Rate'],
      services: ['Meta Ads', 'Creative Strategy', 'Landing Page CRO'],
      shopifyData: [40, 90, 120, 190, 280, 390, 490],
      metaData: [15, 30, 40, 60, 95, 120, 160]
    }
  ],
  clothing: [
    {
      brand: 'Urban Thread',
      category: 'clothing',
      result: 'Scaled to ₹45L monthly revenue using Meta Ads and Email retention flows.',
      insights: 'Developed structured retention flows (welcome series, abandoned cart, win-back) which generated 28% of total revenue. Ran broad Meta targeting to capture massive top-of-funnel traffic.',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop',
      metrics: ['4.8X ROAS', '₹45L Revenue', '28% Email Revenue'],
      services: ['Meta Ads', 'Email Marketing', 'Funnel Optimization'],
      shopifyData: [150, 280, 400, 550, 710, 890, 1100],
      metaData: [60, 90, 130, 170, 220, 290, 360]
    },
    {
      brand: 'Luxe Wardrobe',
      category: 'clothing',
      result: '3.6X ROAS on Google PMax and Shopping Campaigns.',
      insights: 'Optimized the product feed titles with high-search keywords. Retargeted high-intent cart abandoners using dynamic catalog ads on Instagram and Facebook.',
      image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1200&auto=format&fit=crop',
      metrics: ['3.6X ROAS', '₹25L Revenue', '45% Google Search CTR'],
      services: ['Google Ads', 'Meta Ads', 'Landing Page CRO'],
      shopifyData: [90, 150, 180, 260, 340, 450, 580],
      metaData: [35, 50, 65, 90, 120, 160, 210]
    },
    {
      brand: 'FitWear Active',
      category: 'clothing',
      result: 'Lowered CPA by 38% through a systematic creative testing framework.',
      insights: 'Tested 15 new hooks weekly to beat ad fatigue. Found winning creatives and scaled them using a horizontal scaling strategy (combining multiple high-performing lookalike audiences).',
      image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1200&auto=format&fit=crop',
      metrics: ['38% Lower CPA', '4.4X ROAS', '150% Volume Boost'],
      services: ['Meta Ads', 'Creative Strategy', 'Funnel Optimization'],
      shopifyData: [70, 110, 160, 230, 320, 420, 560],
      metaData: [25, 40, 55, 80, 110, 150, 195]
    }
  ],
  real_estate: [
    {
      brand: 'Elysian Heights',
      category: 'real_estate',
      result: 'Generated 450+ high-quality luxury property leads at ₹120 CPL.',
      insights: 'Used Meta Lead Form campaigns with custom qualifiers to filter out low-intent buyers. Followed up with WhatsApp automation to schedule property walkthroughs.',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop',
      metrics: ['450+ Leads', '₹120 CPL', '18% Site Visit Rate'],
      services: ['Meta Ads', 'Funnel Optimization', 'Creative Strategy'],
      shopifyData: [50, 95, 140, 185, 230, 310, 450],
      metaData: [20, 35, 50, 70, 90, 125, 160]
    },
    {
      brand: 'Terra Developers',
      category: 'real_estate',
      result: 'Sold out a premium villa project in Bangalore in 45 days using Google Search.',
      insights: 'Targeted high-intent long-tail keywords (e.g. "luxury 4bhk villas in Bangalore"). Built high-converting landing pages featuring interactive maps and 3D walkthroughs.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
      metrics: ['100% Sold Out', '₹80Cr Portfolio', '8.5% Lead to Sale'],
      services: ['Google Ads', 'Landing Page CRO', 'Funnel Optimization'],
      shopifyData: [30, 60, 90, 130, 180, 220, 300],
      metaData: [10, 20, 35, 50, 70, 90, 115]
    },
    {
      brand: 'Vertex Spaces',
      category: 'real_estate',
      result: 'Cost per qualified booking reduced by 52% using YouTube Ads.',
      insights: 'Developed high-production property tour videos showing local amenities. Directed traffic to a WhatsApp business chat to automate booking bookings.',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop',
      metrics: ['52% Lower CPL', '140 Bookings', '6.8X ROI'],
      services: ['Google Ads', 'Creative Strategy', 'Funnel Optimization'],
      shopifyData: [45, 75, 110, 150, 190, 250, 340],
      metaData: [18, 28, 42, 60, 78, 100, 135]
    }
  ],
  other: [
    {
      brand: 'Skin Glow D2C',
      category: 'other',
      result: 'D2C Skincare brand scaled from ₹1.5L to ₹12L/mo in 60 days.',
      insights: 'Ran aggressive Meta advantage targeting combined with educational product-comparison creatives. Set up post-purchase email upsells to boost lifetime value.',
      image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1200&auto=format&fit=crop',
      metrics: ['3.9X ROAS', '₹12L Revenue', '+45% LTV Growth'],
      services: ['Meta Ads', 'Email Marketing', 'Creative Strategy'],
      shopifyData: [30, 80, 150, 210, 290, 420, 530],
      metaData: [12, 35, 60, 85, 115, 160, 210]
    },
    {
      brand: 'NutriFit Foods',
      category: 'other',
      result: 'Scaled subscription model by 210% with Google & Meta Ads.',
      insights: 'Created custom subscription landing pages. Optimized the funnel to reduce checkout friction, resulting in a 2.4X improvement in conversion rates.',
      image: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?q=80&w=1200&auto=format&fit=crop',
      metrics: ['210% Scale', '4.2X ROAS', '2.4X Conversion Rate'],
      services: ['Google Ads', 'Meta Ads', 'Landing Page CRO'],
      shopifyData: [60, 110, 170, 250, 310, 430, 590],
      metaData: [22, 45, 68, 95, 120, 170, 230]
    },
    {
      brand: 'SoleStyle Shoes',
      category: 'other',
      result: 'Bootstrapped foot-wear brand hit ₹30L monthly revenue.',
      insights: 'Focused on Instagram-native shopping integration. Targeted competitive brand keywords on Google Search to capture high-intent demand.',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop',
      metrics: ['3.8X ROAS', '₹30L Revenue', '35% Return Rate Drop'],
      services: ['Meta Ads', 'Google Ads', 'Funnel Optimization'],
      shopifyData: [80, 130, 190, 240, 310, 460, 610],
      metaData: [30, 50, 75, 95, 125, 180, 240]
    }
  ]
}

const reviews = [
  {
    name: 'Aarav Mehta',
    brand: 'Luxury Fashion Founder',
    review: 'The campaigns completely transformed our online growth. ROAS improved massively while maintaining premium positioning.'
  },
  {
    name: 'Riya Kapoor',
    brand: 'Jewelry Brand Owner',
    review: 'Creative testing and scaling strategy helped us achieve consistent profitable growth month after month.'
  },
  {
    name: 'Siddharth Jain',
    brand: 'D2C Apparel Brand',
    review: 'One of the best performance marketers we have worked with. Data driven decisions and excellent execution.'
  },
  {
    name: 'Ananya Verma',
    brand: 'Beauty Brand Founder',
    review: 'From creatives to funnel optimization, everything was executed with precision and strong growth focus.'
  }
]

const duplicatedReviews = [...reviews, ...reviews]

const ribbonServices = [
  'Meta Ads', 'Google Ads', 'Creative Strategy', 'Landing Page CRO', 'Email Marketing', 'Funnel Optimization'
]
const duplicatedRibbon = [...ribbonServices, ...ribbonServices, ...ribbonServices, ...ribbonServices, ...ribbonServices]

const brands1 = ['Zara', 'Vogue', 'Gucci', 'Tanishq', 'Mejuri', 'Prada', 'Mango', 'Nike']
const brands2 = ['Armani', 'Chanel', 'Cartier', 'Sabyasachi', 'Rolex', 'Dior', 'H&M', 'Adidas']
const duplicatedBrands1 = [...brands1, ...brands1, ...brands1, ...brands1]
const duplicatedBrands2 = [...brands2, ...brands2, ...brands2, ...brands2]

function Logo({ className = '' }) {
  return (
    <div className={`flex items-center gap-2 md:gap-3 select-none ${className}`}>
      {/* Orange Square Icon with growing bar chart and arrow */}
      <div className="w-[34px] h-[34px] bg-[#EA580C] rounded-lg flex items-center justify-center p-1.5 shadow-[0_4px_12px_rgba(234,88,12,0.25)] relative overflow-hidden shrink-0">
        <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="14" width="3" height="6" rx="1" fill="white" fillOpacity="0.6" />
          <rect x="9.5" y="10" width="3" height="10" rx="1" fill="white" fillOpacity="0.8" />
          <rect x="15" y="5" width="3" height="15" rx="1" fill="white" />
          <path d="M14 3h7v7M21 3l-8 8" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>
      
      {/* Logo Text: D2c in orange, Grow in white */}
      <div className="flex flex-col justify-center leading-none">
        <div className="text-lg md:text-xl font-extrabold tracking-tight font-sans">
          <span className="text-[#EA580C]">D2c</span>
          <span className="text-white">Grow</span>
        </div>
        <span className="text-[6.5px] text-gray-500 font-bold uppercase tracking-[0.18em] font-sans mt-0.5 leading-none">
          PERFORMANCE AGENCY
        </span>
      </div>
    </div>
  )
}

function TextLoop() {
  const words = ['Performance Marketing', 'CRO', 'Creative Strategy', 'Funnel Optimization']
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length)
    }, 2200)
    return () => clearInterval(timer)
  }, [])

  return (
    <span className="relative inline-block overflow-hidden h-[1.25em] w-[210px] sm:w-[260px] md:w-[380px] lg:w-[460px] align-bottom select-none">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="absolute inset-0 flex items-center justify-center w-full whitespace-nowrap text-center text-white"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function CountUp({ end, duration = 4.5, suffix = '' }) {
  const [count, setCount] = useState(0)
  const elementRef = useRef(null)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true)
        }
      },
      { threshold: 0.1 }
    )
    if (elementRef.current) {
      observer.observe(elementRef.current)
    }
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!hasStarted) return

    let start = 0
    const endVal = parseFloat(end.toString().replace(/[^0-9.]/g, ''))
    if (isNaN(endVal)) return

    const totalTicks = 80
    const increment = endVal / totalTicks
    const stepTime = (duration * 1000) / totalTicks

    const timer = setInterval(() => {
      start += increment
      if (start >= endVal) {
        clearInterval(timer)
        setCount(endVal)
      } else {
        setCount(start)
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [end, duration, hasStarted])

  const formattedCount = count.toFixed(end.toString().includes('.') ? 1 : 0)
  return <span ref={elementRef}>{formattedCount}{suffix}</span>
}

function ShopifyDashboardChart({ data }) {
  return (
    <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-[0_15px_40px_rgba(0,0,0,0.12)] text-slate-800">
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-sans">SHOPIFY SALES DASHBOARD</span>
          <h4 className="text-sm font-bold text-slate-900 mt-0.5 font-sans">Gross Sales (Last 30 Days)</h4>
        </div>
        <span className="text-[10px] text-[#EA580C] font-bold bg-[#EA580C]/10 px-2.5 py-1 rounded-full font-sans">+Scale Active</span>
      </div>
      <div className="h-[150px] relative w-full flex items-end">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
          <line x1="0" y1="80" x2="300" y2="80" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
          <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
          <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />

          <path
            d={`M 0 100 L 0 ${100 - data[0]/10} L 50 ${100 - data[1]/10} L 100 ${100 - data[2]/10} L 150 ${100 - data[3]/10} L 200 ${100 - data[4]/10} L 250 ${100 - data[5]/10} L 300 ${100 - data[6]/10} L 300 100 Z`}
            fill="url(#shopify-gradient-orange)"
          />
          <defs>
            <linearGradient id="shopify-gradient-orange" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EA580C" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path
            d={`M 0 ${100 - data[0]/10} L 50 ${100 - data[1]/10} L 100 ${100 - data[2]/10} L 150 ${100 - data[3]/10} L 200 ${100 - data[4]/10} L 250 ${100 - data[5]/10} L 300 ${100 - data[6]/10}`}
            fill="none"
            stroke="#EA580C"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {data.map((val, idx) => (
            <circle
              key={idx}
              cx={idx * 50}
              cy={100 - val/10}
              r="4"
              fill="white"
              stroke="#EA580C"
              strokeWidth="2.5"
            />
          ))}
        </svg>
      </div>
      <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold mt-2 pt-2 border-t border-slate-100 font-sans">
        <span>Week 1</span>
        <span>Week 2</span>
        <span>Week 3</span>
        <span>Week 4</span>
      </div>
    </div>
  )
}

function MetaAdsDashboardChart({ data }) {
  return (
    <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-[0_15px_40px_rgba(0,0,0,0.12)] text-slate-800">
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-sans">META ADS MANAGER</span>
          <h4 className="text-sm font-bold text-slate-900 mt-0.5 font-sans">Ad Set Conversions & CPA</h4>
        </div>
        <span className="text-[10px] text-[#EA580C] font-bold bg-[#EA580C]/10 px-2.5 py-1 rounded-full font-sans">ACTIVE SCALING</span>
      </div>
      <div className="h-[150px] relative w-full flex items-end">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
          <line x1="0" y1="80" x2="300" y2="80" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
          <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
          <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />

          {data.map((val, idx) => {
            const barHeight = val / 4.5
            const xPos = idx * 42 + 10
            return (
              <g key={idx}>
                <rect
                  x={xPos}
                  y={100 - barHeight}
                  width="18"
                  height={barHeight}
                  fill="#EA580C"
                  fillOpacity="0.15"
                  stroke="#EA580C"
                  strokeWidth="2"
                  rx="3"
                />
                <circle
                  cx={xPos + 9}
                  cy={100 - barHeight}
                  r="3"
                  fill="#EA580C"
                />
              </g>
            )
          })}
        </svg>
      </div>
      <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold mt-2 pt-2 border-t border-slate-100 font-sans">
        <span>AdSet 1</span>
        <span>AdSet 2</span>
        <span>AdSet 3</span>
        <span>AdSet 4</span>
        <span>AdSet 5</span>
        <span>AdSet 6</span>
        <span>AdSet 7</span>
      </div>
    </div>
  )
}

function StickyCard({ num, title, desc, index }) {
  const cardRef = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start start", "end start"]
  })

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.90])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const blur = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(6px)"])

  return (
    <div ref={cardRef} className="h-[38vh] md:h-[42vh] relative w-full mb-[180px]">
      <div 
        style={{ top: "100px" }}
        className="sticky h-[55vh] md:h-[60vh] w-full max-w-4xl mx-auto px-6 flex items-center justify-center"
      >
        <motion.div
          style={{
            scale,
            opacity,
            filter: blur
          }}
          className="w-full h-full rounded-[32px] border border-[#EA580C]/15 bg-[#121224] p-8 md:p-12 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.6)] origin-top relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#2e1f1a_0%,transparent_60%)] opacity-30 pointer-events-none"></div>
          
          <div className="relative z-10 flex justify-between items-start">
            <span className="text-4xl md:text-5xl font-extrabold text-[#EA580C] font-mono tracking-wider opacity-90">{num}</span>
            <span className="text-[10px] text-[#EA580C]/40 font-mono tracking-widest uppercase border border-[#EA580C]/20 rounded-full px-3 py-1 backdrop-blur-md">GUARANTEE</span>
          </div>

          <div className="relative z-10 my-auto">
            <h3 className="text-xl sm:text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-4">
              {title}
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm md:text-base font-light leading-relaxed max-w-2xl">
              {desc}
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-between border-t border-white/5 pt-4 mt-4">
            <span className="text-[9px] md:text-xs text-[#EA580C] font-mono tracking-[0.25em] uppercase font-semibold">d2cgrow scaling standards</span>
            <div className="w-1.5 h-1.5 bg-[#EA580C] rounded-full animate-ping"></div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function TiltHeroImage() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [-170, 170], [15, -15])
  const rotateY = useTransform(x, [-210, 210], [-15, 15])

  const handleMouseMove = (e) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left - width / 2
    const mouseY = e.clientY - rect.top - height / 2
    x.set(mouseX)
    y.set(mouseY)
    
    el.style.setProperty('--x', `${e.clientX - rect.left}px`)
    el.style.setProperty('--y', `${e.clientY - rect.top}px`)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <div 
      className="relative w-full max-w-[440px] h-[340px] md:h-[400px] flex items-center justify-center perspective-[1000px] cursor-pointer group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Subtle orange background glow */}
      <div className="absolute inset-[-20px] bg-gradient-to-tr from-[#EA580C]/5 to-transparent blur-2xl opacity-40 group-hover:opacity-80 transition-opacity duration-500 rounded-[32px] pointer-events-none"></div>

      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="w-full h-full relative origin-center flex flex-col justify-center space-y-4"
      >
        {/* Card 1: Top Metrics Capsule */}
        <div 
          style={{ transform: "translateZ(30px)" }}
          className="w-[85%] bg-white/95 backdrop-blur-md border border-slate-100 rounded-2xl p-4 shadow-[0_10px_25px_rgba(0,0,0,0.08)] self-start transition-transform duration-500 hover:scale-102 flex flex-col space-y-1.5"
        >
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="text-[7px] text-slate-400 font-bold tracking-tight">Sessions</p>
              <p className="text-[10px] font-extrabold text-slate-800 mt-0.5">6,981 <span className="text-[7.5px] text-emerald-500 font-bold ml-0.5">31%</span></p>
            </div>
            <div>
              <p className="text-[7px] text-slate-400 font-bold tracking-tight">Total sales</p>
              <p className="text-[10px] font-extrabold text-slate-800 mt-0.5">₹124.9K <span className="text-[7.5px] text-emerald-500 font-bold ml-0.5">8%</span></p>
            </div>
            <div>
              <p className="text-[7px] text-slate-400 font-bold tracking-tight">Orders</p>
              <p className="text-[10px] font-extrabold text-slate-800 mt-0.5">598 <span className="text-[7.5px] text-rose-500 font-bold ml-0.5">7%</span></p>
            </div>
            <div>
              <p className="text-[7px] text-slate-400 font-bold tracking-tight">Conv. rate</p>
              <p className="text-[10px] font-extrabold text-slate-800 mt-0.5">0.7% <span className="text-[7.5px] text-rose-500 font-bold ml-0.5">9%</span></p>
            </div>
          </div>
          <div className="h-6 w-full mt-1">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M 0 18 Q 15 10 30 14 T 60 4 T 90 12 L 100 8" fill="none" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 2: Central Graphic Trend Chart */}
        <div 
          style={{ transform: "translateZ(50px)" }}
          className="w-full bg-white/95 backdrop-blur-md border border-slate-100 rounded-3xl p-5 shadow-[0_20px_45px_rgba(0,0,0,0.12)] transition-transform duration-500 hover:scale-103"
        >
          <div className="grid grid-cols-4 gap-2 mb-3 text-center border-b border-slate-50 pb-2">
            <div>
              <p className="text-[7px] text-slate-400 font-extrabold tracking-tight uppercase">Sessions</p>
              <p className="text-xs font-black text-slate-800 mt-0.5">266.2K <span className="text-[8px] text-emerald-500 font-bold ml-0.5">3%</span></p>
            </div>
            <div>
              <p className="text-[7px] text-slate-400 font-extrabold tracking-tight uppercase">Total sales</p>
              <p className="text-xs font-black text-slate-800 mt-0.5">₹652.9K <span className="text-[8px] text-emerald-500 font-bold ml-0.5">28%</span></p>
            </div>
            <div>
              <p className="text-[7px] text-slate-400 font-extrabold tracking-tight uppercase">Orders</p>
              <p className="text-xs font-black text-slate-800 mt-0.5">5,387 <span className="text-[8px] text-emerald-500 font-bold ml-0.5">33%</span></p>
            </div>
            <div>
              <p className="text-[7px] text-slate-400 font-extrabold tracking-tight uppercase">Avg order</p>
              <p className="text-xs font-black text-slate-800 mt-0.5">₹1,080 <span className="text-[8px] text-emerald-500 font-bold ml-0.5">20%</span></p>
            </div>
          </div>
          
          <div className="h-[80px] w-full relative flex items-end">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 200 60" preserveAspectRatio="none">
              <line x1="0" y1="45" x2="200" y2="45" stroke="rgba(0,0,0,0.02)" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="0" y1="30" x2="200" y2="30" stroke="rgba(0,0,0,0.02)" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="0" y1="15" x2="200" y2="15" stroke="rgba(0,0,0,0.02)" strokeWidth="1" strokeDasharray="2 2" />

              <path
                d="M 0 60 L 0 50 Q 20 40 40 45 T 80 20 T 120 10 T 160 30 T 200 5 L 200 60 Z"
                fill="url(#trend-gradient-orange)"
              />
              <defs>
                <linearGradient id="trend-gradient-orange" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EA580C" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
                </linearGradient>
              </defs>

              <path
                d="M 0 50 Q 20 40 40 45 T 80 20 T 120 10 T 160 30 T 200 5"
                fill="none"
                stroke="#EA580C"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              
              <path
                d="M 0 55 Q 20 50 40 52 T 80 35 T 120 28 T 160 42 T 200 25"
                fill="none"
                stroke="#EA580C"
                strokeWidth="1.2"
                strokeDasharray="3 3"
                strokeOpacity="0.6"
              />
            </svg>
          </div>
          
          <div className="flex justify-between items-center text-[7px] text-slate-400 font-bold mt-1.5 pt-1 border-t border-slate-50">
            <span>Mar 1</span>
            <span>Mar 7</span>
            <span>Mar 13</span>
            <span>Mar 19</span>
            <span>Mar 25</span>
          </div>
        </div>

        {/* Card 3: Overlapping Bottom Metrics Capsule */}
        <div 
          style={{ transform: "translateZ(70px)" }}
          className="w-[88%] bg-white/95 backdrop-blur-md border border-slate-100 rounded-2xl p-4 shadow-[0_12px_30px_rgba(0,0,0,0.1)] self-end transition-transform duration-500 hover:scale-102 flex flex-col space-y-1.5"
        >
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="text-[7px] text-slate-400 font-bold tracking-tight">Sessions</p>
              <p className="text-[10px] font-extrabold text-slate-800 mt-0.5">368.4K <span className="text-[7.5px] text-rose-500 font-bold ml-0.5">16%</span></p>
            </div>
            <div>
              <p className="text-[7px] text-slate-400 font-bold tracking-tight">Total sales</p>
              <p className="text-[10px] font-extrabold text-slate-800 mt-0.5">₹10.56M <span className="text-[7.5px] text-emerald-500 font-bold ml-0.5">27%</span></p>
            </div>
            <div>
              <p className="text-[7px] text-slate-400 font-bold tracking-tight">Orders</p>
              <p className="text-[10px] font-extrabold text-slate-800 mt-0.5">82.1K <span className="text-[7.5px] text-emerald-500 font-bold ml-0.5">7%</span></p>
            </div>
            <div>
              <p className="text-[7px] text-slate-400 font-bold tracking-tight">Conv. rate</p>
              <p className="text-[10px] font-extrabold text-slate-800 mt-0.5">2.6% <span className="text-[7.5px] text-emerald-500 font-bold ml-0.5">4%</span></p>
            </div>
          </div>
          <div className="h-6 w-full mt-1">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path
                d="M 0 18 Q 15 12 35 15 T 60 5 T 85 9 T 100 3"
                fill="none"
                stroke="#EA580C"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M 0 19 Q 15 15 35 17 T 60 10 T 85 14 T 100 8"
                fill="none"
                stroke="#EA580C"
                strokeWidth="0.8"
                strokeDasharray="2 2"
                strokeOpacity="0.5"
              />
            </svg>
          </div>
        </div>
      </motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--x,50%)_var(--y,50%),rgba(234,88,12,0.06)_0%,transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  )
}

function FooterTakeoverCard({ setShowEmailForm }) {
  const containerRef = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  })

  const scale = useTransform(scrollYProgress, [0, 0.75], [0.92, 1])
  const borderRadius = useTransform(scrollYProgress, [0, 0.75], ["32px", "0px"])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.4, 1])
  const y = useTransform(scrollYProgress, [0, 0.65], [60, 0])

  return (
    <div ref={containerRef} className="min-h-screen relative w-full overflow-hidden flex flex-col justify-between">
      <motion.div
        style={{
          scale,
          borderRadius,
          opacity
        }}
        className="absolute inset-0 bg-gradient-to-b from-[#0A0A12] via-[#111222] to-[#05060A] border-t border-[#EA580C]/30 shadow-[0_-30px_60px_rgba(234,88,12,0.15)] z-0 origin-bottom"
      />

      <motion.div 
        style={{ y }}
        className="relative z-10 max-w-4xl mx-auto px-6 w-full flex-1 flex flex-col justify-between py-16 md:py-24"
      >
        <div>
          <span className="text-xs text-[#EA580C] font-mono tracking-[0.3em] uppercase font-semibold">GET STARTED</span>
          <h3 className="text-5xl md:text-8xl font-black tracking-[-0.04em] mt-8 text-white leading-tight">
            Ready to scale <br />your brand?
          </h3>
          <p className="text-[#EA580C] text-xl md:text-2xl font-mono mt-6">Let's connect.</p>
        </div>

        <div>
          <div className="mt-12 flex flex-col md:flex-row gap-4 w-full max-w-lg">
            <button 
              onClick={() => setShowEmailForm(true)}
              className="px-8 py-5 rounded-full bg-[#EA580C] text-white font-bold hover:shadow-[0_0_30px_#EA580C] transition-all duration-300 flex-1 text-center cursor-pointer glow-btn text-sm md:text-base uppercase tracking-wider"
            >
              Book a Strategy Call
            </button>
            <a 
              href="https://wa.me/911234567890?text=How%20can%20we%20help%20you%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-5 rounded-full border border-[#EA580C]/30 bg-[#EA580C]/5 text-[#EA580C] font-bold hover:bg-[#EA580C]/15 hover:shadow-[0_0_20px_rgba(234,88,12,0.15)] transition-all duration-300 flex-1 text-center cursor-pointer glow-btn text-sm md:text-base uppercase tracking-wider"
            >
              Chat with Us
            </a>
          </div>

          <div className="flex items-center gap-6 mt-16 pt-8 border-t border-white/5">
            <a href="#projects" className="text-[#EA580C] hover:text-white transition-colors duration-300" title="View Proofs">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </a>
            <a href="tel:+919876543210" className="text-[#EA580C] hover:text-white transition-colors duration-300 flex items-center gap-2" title="Call Us">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.035 12.035 0 01-7.108-7.108c-.155-.44.011-.927.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.11-1.008H5.03c-1.137 0-2.054.924-2.054 2.054V6.75z" />
              </svg>
              <span className="text-sm font-bold tracking-wider font-mono text-white/90 hover:text-white">+91 98765 43210</span>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function PortfolioWebsite() {

  const [selectedProject, setSelectedProject] = useState(null)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('jewelry')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    brand: '',
    goals: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.brand) {
      alert('Please fill out all required fields.')
      return
    }
    setIsSubmitting(true)
    try {
      const scriptURL = ''
      
      const payload = new URLSearchParams()
      payload.append('name', formData.name)
      payload.append('email', formData.email)
      payload.append('brand', formData.brand)
      payload.append('goals', formData.goals)

      if (scriptURL) {
        await fetch(scriptURL, {
          method: 'POST',
          body: payload,
          mode: 'no-cors'
        })
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log('Submitted successfully to Sheets (Simulated):', formData)
      }
      
      setSubmitSuccess(true)
      setFormData({ name: '', email: '', brand: '', goals: '' })
      setTimeout(() => {
        setSubmitSuccess(false)
        setShowEmailForm(false)
      }, 3000)
    } catch (error) {
      console.error('Submit failed:', error)
      alert('Submission failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const navRef = useRef(null)
  const headingRef = useRef(null)
  const bioRef = useRef(null)
  const ctaContainerRef = useRef(null)
  const statsContainerRef = useRef(null)
  const magneticBtn1 = useRef(null)
  const magneticBtn2 = useRef(null)

  useEffect(() => {
    const cursor = document.querySelector('.custom-cursor')
    const dot = document.querySelector('.custom-cursor-dot')
    
    const onMouseMove = (e) => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.3, ease: 'power2.out' })
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.05, ease: 'power2.out' })
    }

    const addHoverActive = () => cursor?.classList.add('custom-cursor-active')
    const removeHoverActive = () => cursor?.classList.remove('custom-cursor-active')

    window.addEventListener('mousemove', onMouseMove)

    const interactiveElements = document.querySelectorAll('a, button, [role="button"], .cursor-pointer')
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', addHoverActive)
      el.addEventListener('mouseleave', removeHoverActive)
    })

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    
    tl.fromTo(navRef.current, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 1 })
      .fromTo(headingRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, '-=0.7')
      .fromTo(bioRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, '-=0.9')
      .fromTo(ctaContainerRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.8')
      .fromTo('.stat-card', { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.15, duration: 1 }, '-=0.8')

    const magneticElements = [magneticBtn1.current, magneticBtn2.current]
    magneticElements.forEach(btn => {
      if (!btn) return
      
      const moveBtn = (e) => {
        const rect = btn.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2
        gsap.to(btn, { x: x * 0.35, y: y * 0.35, duration: 0.3, ease: 'power2.out' })
      }
      
      const resetBtn = () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' })
      }

      btn.addEventListener('mousemove', moveBtn)
      btn.addEventListener('mouseleave', resetBtn)
    })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', addHoverActive)
        el.removeEventListener('mouseleave', removeHoverActive)
      })
      magneticElements.forEach(btn => {
        if (!btn) return
        btn.removeEventListener('mousemove', () => {})
        btn.removeEventListener('mouseleave', () => {})
      })
    }
  }, [selectedProject, showEmailForm, mobileMenuOpen, activeCategory])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 45 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  }

  return (
    <div className="bg-[#0B0C15] text-white min-h-screen overflow-x-hidden selection:bg-[#EA580C] selection:text-white font-sans relative">
      {/* Custom Follower Cursor */}
      <div className="hidden lg:block custom-cursor"></div>
      <div className="hidden lg:block custom-cursor-dot"></div>

      {/* Decorative Radial Backgrounds & Diamond Grid Pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[#0B0C15] bg-[radial-gradient(circle_at_top,#151627_0%,#0B0C15_50%,#05060A_100%)]"></div>
        <div className="absolute inset-0 diamond-grid"></div>
        <div className="absolute top-[5%] left-[-15%] w-[800px] h-[800px] bg-gradient-to-tr from-[#EA580C]/[0.08] to-[#EA580C]/[0.01] blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-15%] w-[800px] h-[800px] bg-gradient-to-bl from-[#EA580C]/[0.06] to-transparent blur-[160px] rounded-full"></div>
      </div>

      {/* Navbar */}
      <nav ref={navRef} className="sticky top-0 z-50 backdrop-blur-2xl border-b border-white/5 bg-[#0B0C15]/85">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo className="cursor-pointer hover:opacity-90 transition-opacity duration-300" />
            <button 
              onClick={() => setShowEmailForm(true)}
              className="px-4 py-1.5 rounded-full border border-[#EA580C]/30 bg-[#EA580C]/[0.08] text-[11px] font-semibold text-[#EA580C] tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer glow-btn"
            >
              Book a Call
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex gap-10 text-sm text-[#EA580C]/80 font-light">
            <a href="#services" className="hover:text-white transition-all duration-300 hover:scale-105">Services</a>
            <a href="#projects" className="hover:text-white transition-all duration-300 hover:scale-105">Proofs</a>
            <a href="#promises" className="hover:text-white transition-all duration-300 hover:scale-105">Why Us</a>
          </div>

          {/* Hamburger Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white/90 hover:text-[#EA580C] transition-colors duration-300 z-50 cursor-pointer"
            aria-label="Toggle Menu"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-[9px]' : ''}`}></span>
              <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-[9px]' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute inset-x-0 top-full bg-[#0B0C15]/95 border-b border-white/5 md:hidden flex flex-col px-8 py-8 gap-5 backdrop-blur-3xl shadow-2xl overflow-hidden"
            >
              <a 
                href="#services" 
                onClick={(e) => {
                  e.preventDefault()
                  setMobileMenuOpen(false)
                  document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="text-base text-gray-300 hover:text-[#EA580C] transition-colors duration-300 font-light tracking-wider"
              >
                Services
              </a>
              <a 
                href="#projects" 
                onClick={(e) => {
                  e.preventDefault()
                  setMobileMenuOpen(false)
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="text-base text-gray-300 hover:text-[#EA580C] transition-colors duration-300 font-light tracking-wider"
              >
                Proofs
              </a>
              <a 
                href="#promises" 
                onClick={(e) => {
                  e.preventDefault()
                  setMobileMenuOpen(false)
                  document.getElementById('promises')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="text-base text-gray-300 hover:text-[#EA580C] transition-colors duration-300 font-light tracking-wider"
              >
                Why Us
              </a>
              <button 
                onClick={() => {
                  setMobileMenuOpen(false)
                  setShowEmailForm(true)
                }}
                className="w-full mt-2 py-3 rounded-full bg-[#EA580C] text-white font-bold text-sm tracking-wider text-center cursor-pointer glow-btn flex items-center justify-center gap-2"
              >
                Book Now
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-4">
        <div className="flex flex-col md:grid md:grid-cols-12 md:gap-8 items-center mb-6">
          
          {/* 1. TEXT CONTAINER */}
          <div className="w-full md:col-span-7 flex flex-col order-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#EA580C]/50 bg-[#EA580C]/[0.05] backdrop-blur-xl mb-4 text-[9px] md:text-[11px] uppercase tracking-[0.25em] text-[#EA580C] w-fit font-sans font-bold">
              <span className="w-2 h-2 bg-[#EA580C] rounded-full animate-pulse mr-0.5"></span>
              Profit Driven Growth
            </div>

            <h1 ref={headingRef} className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-[-0.04em] mb-5 select-all text-white font-sans">
              Scaling Brands <span className="block mt-2">with <span className="bg-[#EA580C] text-white px-4 py-1.5 md:px-6 md:py-2 rounded-xl md:rounded-3xl shadow-[0_4px_25px_rgba(234,88,12,0.3)] font-extrabold inline-inline-flex items-center justify-center text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl align-middle font-sans"><TextLoop /></span></span>
            </h1>

            <p ref={bioRef} className="text-slate-300 text-xs sm:text-sm md:text-base tracking-wide font-normal mb-8 leading-relaxed font-sans max-w-xl">
              We help D2C brands scale profitably on Meta & Google — with data, not guesswork.
            </p>
          </div>

          {/* 2. GRAPH CONTAINER */}
          <div className="w-full md:col-span-5 flex justify-center order-2 my-8 md:my-0">
            <TiltHeroImage />
          </div>
        </div>

        {/* 3. CTA & TRUSTED BY */}
        <div ref={ctaContainerRef} className="flex flex-col gap-6 max-w-2xl mb-8 order-3">
          <div className="flex flex-wrap gap-2.5">
            <a 
              ref={magneticBtn1}
              href="#projects" 
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
              }} 
              className="px-6 py-3.5 md:px-8 md:py-4 rounded-full bg-[#EA580C] text-white font-bold text-xs md:text-sm transition-all duration-300 shadow-[0_4px_20px_rgba(234,88,12,0.35)] inline-flex items-center justify-center min-w-[120px] md:min-w-[140px] glow-btn cursor-pointer font-sans"
            >
              View Proof
            </a>

            <a 
              ref={magneticBtn2}
              href="#promises" 
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('promises')?.scrollIntoView({ behavior: 'smooth' })
              }} 
              className="px-6 py-3.5 md:px-8 md:py-4 rounded-full border border-white/80 bg-transparent text-white text-xs md:text-sm font-bold transition-all duration-300 hover:border-[#EA580C] hover:bg-[#EA580C]/5 inline-flex items-center justify-center min-w-[130px] md:min-w-[160px] glow-btn cursor-pointer font-sans"
            >
              Start Scaling
            </a>
          </div>
          
          <div className="text-[10px] md:text-xs text-gray-500 font-mono tracking-widest uppercase flex items-center gap-2 mt-1">
            <span>Trusted by:</span>
            <span className="text-[#EA580C] font-semibold">D2C</span>
            <span className="text-gray-700">•</span>
            <span className="text-[#EA580C] font-semibold">B2B</span>
            <span className="text-gray-700">•</span>
            <span className="text-[#EA580C] font-semibold">Real Estate</span>
          </div>
        </div>

        {/* 4. STATS ROW */}
        <div ref={statsContainerRef} className="grid grid-cols-4 gap-2 pt-6 border-t border-white/5 order-4">
          {stats.map((item, index) => (
            <div 
              key={index} 
              className="stat-card p-2 md:p-5 rounded-[22px] border border-[#EA580C]/10 bg-[#EA580C]/[0.02] backdrop-blur-2xl hover:border-[#EA580C]/30 hover:bg-[#EA580C]/[0.06] transition-all duration-500 hover:-translate-y-1 shadow-md text-center group"
            >
              <h2 className="text-base sm:text-2xl md:text-4xl lg:text-5xl font-black mb-1 text-white tracking-tight group-hover:text-[#EA580C] transition-colors duration-300">
                <CountUp end={item.value} suffix={item.suffix} />
              </h2>
              <p className="text-gray-500 text-[7px] md:text-[10px] tracking-widest uppercase font-semibold line-clamp-2 leading-tight">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ribbon Divider Section */}
      <div className="relative w-full h-[80px] overflow-hidden flex items-center justify-center pointer-events-none my-4 z-10">
        <div className="absolute w-[350%] h-12 bg-gradient-to-r from-[#0B0C15]/0 via-[#EA580C]/[0.05] to-[#0B0C15]/0 border-y border-[#EA580C]/20 flex items-center overflow-hidden">
          <div className="flex gap-12 whitespace-nowrap animate-scroll-right">
            {duplicatedRibbon.map((service, index) => (
              <span key={index} className="text-base md:text-lg font-semibold tracking-wider text-[#EA580C] uppercase flex items-center gap-4 font-sans">
                {service} <span className="text-white/40">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Highlight growth tagline section */}
      <section className="max-w-4xl mx-auto px-6 py-6 text-center">
        <p className="text-lg sm:text-2xl md:text-3xl text-gray-400 font-light leading-relaxed">
          We combine creative, data, and media buying to{' '}
          <span className="text-white bg-[#EA580C] px-3 py-1 rounded-2xl shadow-[0_4px_15px_rgba(234,88,12,0.3)] font-semibold inline-block font-sans">
            drive real growth.
          </span>
        </p>
      </section>

      {/* Services Section */}
      <section id="services" className="max-w-7xl mx-auto px-6 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-10 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <p className="text-[#EA580C] uppercase tracking-[0.35em] text-xs mb-2 font-bold font-sans">What We Do</p>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-white mb-3 md:mb-6 leading-tight">
              End To End Growth Solutions <br />For Ambitious Brands
            </h2>
            <div className="text-[#EA580C] text-base md:text-lg font-bold tracking-widest uppercase flex flex-col gap-1.5 border-l-2 border-[#EA580C]/30 pl-4 py-2 mb-2 md:mb-8 font-sans">
              <span>Strategy.</span>
              <span>Creative.</span>
              <span>Media Buying.</span>
              <span>Conversion.</span>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-7 flex justify-center items-center py-2 lg:py-6">
            <div className="relative w-[320px] h-[320px] md:w-[440px] md:h-[440px] flex items-center justify-center">
              
              {/* Central core node */}
              <div className="absolute w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#EA580C]/[0.05] border border-[#EA580C]/30 flex flex-col items-center justify-center z-20 shadow-[0_0_30px_rgba(234,88,12,0.2)] animate-pulse">
                <span className="text-[9px] text-[#EA580C]/75 font-mono tracking-widest uppercase mb-1">CORE</span>
                <span className="text-xs md:text-base font-bold text-[#EA580C] tracking-wider uppercase font-sans">GROWTH</span>
              </div>

              {/* Rotating planetary path wrapper */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 26, ease: "linear" }}
                className="w-full h-full flex items-center justify-center relative border border-white/5 rounded-full"
              >
                <div className="absolute inset-10 rounded-full border border-[#EA580C]/5 pointer-events-none"></div>

                {services.map((srv, idx) => {
                  const angle = (idx * 360) / services.length
                  return (
                    <div
                      key={idx}
                      className="absolute"
                      style={{
                        transform: `rotate(${angle}deg) translate(${window.innerWidth < 768 ? '108px' : '155px'}) rotate(-${angle}deg)`
                      }}
                    >
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ repeat: Infinity, duration: 26, ease: "linear" }}
                        className="w-[74px] h-[74px] md:w-20 md:h-20 rounded-full border border-[#EA580C]/25 bg-[#0B0C15] hover:bg-[#EA580C] hover:text-white flex flex-col items-center justify-center text-center shadow-lg transition-colors duration-300 cursor-pointer group"
                      >
                        <span className="text-lg md:text-lg mb-0.5">{srv.icon}</span>
                        <span className="text-[8.5px] md:text-[9.5px] font-bold tracking-tight uppercase leading-tight font-sans text-gray-300 group-hover:text-white line-clamp-2 px-1">
                          {srv.title}
                        </span>
                      </motion.div>
                    </div>
                  )
                })}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="group p-8 rounded-[30px] border border-[#EA580C]/10 bg-[#EA580C]/[0.02] hover:border-[#EA580C]/30 hover:bg-[#EA580C]/[0.06] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 shadow-md relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#EA580C]/[0.01] rounded-full blur-2xl group-hover:bg-[#EA580C]/[0.05] transition-all duration-500"></div>
              <div className="w-12 h-12 rounded-full border border-[#EA580C]/15 bg-[#EA580C]/[0.08] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-[#EA580C]/40 transition-all duration-300">
                <span className="text-xl">{service.icon}</span>
              </div>
              <h3 className="text-2xl font-medium tracking-[-0.03em] mb-4 group-hover:text-[#EA580C] transition-colors duration-300">{service.title}</h3>
              <p className="text-gray-400 leading-8 font-light text-sm">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Case Studies Section */}
      <section id="projects" className="max-w-7xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <p className="text-[#EA580C] uppercase tracking-[0.35em] text-xs mb-2 font-bold font-sans">Results</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.04em] mb-2 uppercase font-sans">Proofs, Not Promises</h2>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {['jewelry', 'clothing', 'real_estate', 'other'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer border ${
                activeCategory === cat 
                  ? 'bg-[#EA580C] text-white border-[#EA580C] shadow-[0_4px_15px_rgba(234,88,12,0.35)]' 
                  : 'border-white/10 hover:border-[#EA580C]/40 text-gray-400 hover:text-white'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        <motion.div 
          key={activeCategory}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {caseStudiesData[activeCategory].map((study, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              onClick={() => setSelectedProject(study)} 
              className="overflow-hidden rounded-[30px] border border-[#EA580C]/10 bg-[#EA580C]/[0.02] hover:border-[#EA580C]/30 hover:bg-[#EA580C]/[0.06] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer shadow-lg group"
            >
              <div className="overflow-hidden relative h-56">
                <img 
                  src={study.image} 
                  alt={study.brand} 
                  className="h-full w-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C15] to-transparent opacity-60"></div>
              </div>
              <div className="p-7">
                <h3 className="text-xl font-bold mb-3 group-hover:text-[#EA580C] transition-colors duration-300">{study.brand}</h3>
                <p className="text-gray-400 leading-6 font-light text-xs mb-5 line-clamp-2">{study.result}</p>
                <div className="text-[#EA580C] text-xs uppercase tracking-[0.2em] font-bold flex items-center gap-2 group-hover:text-white transition-all duration-300 font-sans">
                  View Case Study
                  <span className="transform group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Case Study Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 md:p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="max-w-4xl w-full bg-[#0B0C15] border border-[#EA580C]/15 rounded-[32px] overflow-hidden max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedProject(null)} 
                className="absolute top-6 right-6 w-11 h-11 rounded-full bg-[#EA580C]/10 hover:bg-[#EA580C] hover:text-white transition-all duration-300 z-10 flex items-center justify-center text-lg font-light text-[#EA580C]"
              >
                ✕
              </button>
              <div className="relative h-[200px] md:h-[300px]">
                <img src={selectedProject.image} alt={selectedProject.brand} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C15] via-transparent to-transparent"></div>
              </div>
              
              <div className="p-6 md:p-10">
                <div className="mb-6">
                  <p className="text-[#EA580C] uppercase tracking-[0.3em] text-xs font-bold mb-2">Case Study</p>
                  <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.04em] mb-4">{selectedProject.brand}</h2>
                  
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.services.map((srv, index) => (
                      <span key={index} className="px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-gray-300 text-xs font-light">
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Dynamic Dashboards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <ShopifyDashboardChart brand={selectedProject.brand} data={selectedProject.shopifyData} />
                  <MetaAdsDashboardChart data={selectedProject.metaData} />
                </div>

                {/* Strategy metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {selectedProject.metrics.map((metric, index) => (
                    <div key={index} className="p-4 rounded-xl border border-[#EA580C]/10 bg-[#EA580C]/[0.03] text-center shadow-inner">
                      <h3 className="text-lg font-semibold text-[#EA580C]">{metric}</h3>
                    </div>
                  ))}
                </div>
                <h4 className="text-lg font-medium text-white mb-2">Core Strategy & Execution</h4>
                <p className="text-gray-400 leading-7 font-light text-sm">{selectedProject.insights}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews & Double Brands Marquee */}
      <section className="max-w-7xl mx-auto py-10 overflow-hidden">
        <div className="text-center mb-10">
          <p className="text-[#EA580C] uppercase tracking-[0.35em] text-xs mb-2 font-bold font-sans">Reviews</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.04em] mb-2">What Brands Say</h2>
        </div>

        <div className="relative overflow-hidden w-full py-2 mb-4">
          <div className="flex gap-6 animate-scroll w-max hover:[animation-play-state:paused] cursor-grab active:cursor-grabbing">
            {duplicatedReviews.map((review, index) => (
              <div key={index} className="w-[350px] md:w-[400px] shrink-0 rounded-[28px] border border-[#EA580C]/10 bg-[#EA580C]/[0.02] hover:border-[#EA580C]/30 backdrop-blur-2xl p-6 md:p-8 transition-colors duration-300 shadow-md">
                <h3 className="text-lg font-medium text-white mb-1">{review.name}</h3>
                <p className="text-[#EA580C] text-xs uppercase tracking-[0.15em] mb-4 font-bold font-sans">{review.brand}</p>
                <p className="text-gray-400 leading-6 font-light text-xs italic">“{review.review}”</p>
              </div>
            ))}
          </div>
        </div>

        {/* Double-row Brand Logos Marquee */}
        <div className="w-full py-6 border-t border-white/5 overflow-hidden flex flex-col gap-4">
          {/* Line 1 */}
          <div className="relative overflow-hidden w-full py-1">
            <div className="flex gap-16 whitespace-nowrap animate-scroll-right w-max">
              {duplicatedBrands1.map((brand, index) => (
                <span key={index} className="text-base md:text-lg font-bold tracking-widest text-white/20 hover:text-[#EA580C] transition-colors duration-300 uppercase font-sans">
                  {brand}
                </span>
              ))}
            </div>
          </div>

          {/* Line 2 */}
          <div className="relative overflow-hidden w-full py-1">
            <div className="flex gap-16 whitespace-nowrap animate-scroll w-max">
              {duplicatedBrands2.map((brand, index) => (
                <span key={index} className="text-base md:text-lg font-bold tracking-widest text-white/20 hover:text-[#EA580C] transition-colors duration-300 uppercase font-sans">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Premium Sticky Overlapping Stacking Cards */}
      <section id="promises" className="relative w-full">
        <StickyCard
          num="01"
          title={<span>Unlock Full <br className="hidden md:inline" />Funnel Growth</span>}
          desc="We align every marketing touchpoint, from top-of-funnel discovery to post-purchase retention. We optimize campaigns, landing pages, and email flow integrations under a unified scaling system."
          index={0}
        />
        <StickyCard
          num="02"
          title={<span>Conversions <br className="hidden md:inline" />with 4X ROAS</span>}
          desc="By combining high-intent keyword targets on Google Ads with aggressive lookalike scaling on Meta Ads, we guarantee scalable acquisition performance that matches your margin targets."
          index={1}
        />
        <StickyCard
          num="03"
          title={<span>Creative Strategy <br className="hidden md:inline" />that Scales</span>}
          desc="UGC, hooks, and performance-driven ad templates optimized for high click-through rates (CTR) and visual retention, beating advertising fatigue before it impacts your bottom line."
          index={2}
        />
        <FooterTakeoverCard setShowEmailForm={setShowEmailForm} />
      </section>

      {/* Email Form Modal */}
      <AnimatePresence>
        {showEmailForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 md:p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="max-w-2xl w-full bg-[#0B0C15] border border-[#EA580C]/15 rounded-[32px] p-8 md:p-10 relative shadow-2xl"
            >
              <button 
                onClick={() => setShowEmailForm(false)} 
                className="absolute top-6 right-6 w-11 h-11 rounded-full bg-[#EA580C]/10 hover:bg-[#EA580C] hover:text-white transition-all duration-300 flex items-center justify-center text-lg font-light text-[#EA580C]"
              >
                ✕
              </button>
              <p className="text-[#EA580C] uppercase tracking-[0.3em] text-xs font-bold mb-4 font-sans">Contact Form</p>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.04em] mb-8 font-sans">Book Your Free Brand Audit</h2>
              
              {submitSuccess ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-[#EA580C]/10 border border-[#EA580C]/30 rounded-full flex items-center justify-center text-3xl text-[#EA580C] animate-bounce font-bold">
                    ✓
                  </div>
                  <h3 className="text-2xl font-bold text-white">Audit Request Received!</h3>
                  <p className="text-gray-400 text-sm max-w-sm">We are analyzing your brand metrics. Expect an audit callback within 24 hours.</p>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleFormSubmit}>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="Your Name" 
                    className="w-full p-5 rounded-2xl bg-[#EA580C]/[0.02] border border-[#EA580C]/10 outline-none text-white placeholder:text-gray-600 focus:border-[#EA580C]/40 transition-all duration-300" 
                  />
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="Your Email" 
                    className="w-full p-5 rounded-2xl bg-[#EA580C]/[0.02] border border-[#EA580C]/10 outline-none text-white placeholder:text-gray-600 focus:border-[#EA580C]/40 transition-all duration-300" 
                  />
                  <input 
                    type="text" 
                    name="brand" 
                    value={formData.brand} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="Brand Name" 
                    className="w-full p-5 rounded-2xl bg-[#EA580C]/[0.02] border border-[#EA580C]/10 outline-none text-white placeholder:text-gray-600 focus:border-[#EA580C]/40 transition-all duration-300" 
                  />
                  <textarea 
                    name="goals" 
                    value={formData.goals} 
                    onChange={handleInputChange} 
                    rows="4" 
                    placeholder="Tell me about your brand goals" 
                    className="w-full p-5 rounded-2xl bg-[#EA580C]/[0.02] border border-[#EA580C]/10 outline-none text-white placeholder:text-gray-600 focus:border-[#EA580C]/40 transition-all duration-300"
                  ></textarea>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-5 rounded-full bg-[#EA580C] text-white font-bold hover:bg-[#ff7233] transition-all duration-300 shadow-[0_4px_20px_rgba(234,88,12,0.3)] disabled:opacity-50 cursor-pointer text-center uppercase tracking-wider"
                  >
                    {isSubmitting ? 'Submitting Request...' : 'Submit Audit Request'}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="border-t border-white/5 py-8 text-center text-gray-500 text-xs tracking-wider">
        <Logo className="justify-center mb-4 opacity-50 hover:opacity-80 transition-opacity duration-300" />
        <p>© 2026 D2cGrow. Built for your brand growth.</p>
      </footer>
    </div>
  )
}
