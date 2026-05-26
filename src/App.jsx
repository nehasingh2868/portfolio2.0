import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue } from 'framer-motion'
import { gsap } from 'gsap'

export const SUBMISSION_CONFIG = {
  // Option 1: Direct Webhook (Zapier, Make.com, Pabbly, etc.)
  webhookUrl: 'https://hooks.zapier.com/hooks/catch/27724194/4o0yp1h/', 
  webhookPlaybookUrl: '', // Add a separate webhook for playbook leads if needed

  // Option 2: Supabase Database Configuration
  supabaseUrl: '',
  supabaseAnonKey: '',
  supabaseTable: 'leads',

  // Option 3: Google Sheets Apps Script URL (Active Fallback)
  googleSheetsUrl: 'https://script.google.com/macros/s/AKfycbwaWu2fQr2p8WqgVbXrU0GoVp35qYDLgjn0CviiW5rpft77jYJNUt3gM9AO_3IENkD0Sg/exec',
  googleSheetsPlaybookUrl: 'https://script.google.com/macros/s/AKfycbwaWu2fQr2p8WqgVbXrU0GoVp35qYDLgjn0CviiW5rpft77jYJNUt3gM9AO_3IENkD0Sg/exec' // Paste your separate Playbook Google Sheet Apps Script URL here!
}

export async function submitLeadData(formData) {
  const isPlaybook = formData.source === 'playbook_popup' || formData.source === 'playbook';

  // 1. Webhook Option (Zapier / Make / custom)
  const activeWebhookUrl = isPlaybook && SUBMISSION_CONFIG.webhookPlaybookUrl 
    ? SUBMISSION_CONFIG.webhookPlaybookUrl 
    : SUBMISSION_CONFIG.webhookUrl;

  if (activeWebhookUrl) {
    const searchParams = new URLSearchParams()
    searchParams.append('timestamp', new Date().toISOString())
    searchParams.append('name', formData.name || '')
    searchParams.append('phone', formData.phone || '')
    searchParams.append('email', formData.email || '')
    searchParams.append('website', formData.website || '')
    searchParams.append('industry', formData.industry || '')
    searchParams.append('budget', formData.budget || '')
    searchParams.append('source', formData.source || '')
    searchParams.append('message', formData.message || '')

    const response = await fetch(activeWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: searchParams.toString()
    })
    if (!response.ok) {
      throw new Error(`Webhook failed with status: ${response.status}`)
    }
    return
  }

  // 2. Supabase REST API Option
  if (SUBMISSION_CONFIG.supabaseUrl && SUBMISSION_CONFIG.supabaseAnonKey) {
    // Normalise trailing slash
    const cleanUrl = SUBMISSION_CONFIG.supabaseUrl.replace(/\/$/, '')
    const url = `${cleanUrl}/rest/v1/${SUBMISSION_CONFIG.supabaseTable}`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': SUBMISSION_CONFIG.supabaseAnonKey,
        'Authorization': `Bearer ${SUBMISSION_CONFIG.supabaseAnonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(formData)
    })
    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`Supabase insert failed: ${errText}`)
    }
    return
  }

  // 3. Fallback: Google Sheets Apps Script URL
  const activeGoogleSheetsUrl = isPlaybook && SUBMISSION_CONFIG.googleSheetsPlaybookUrl
    ? SUBMISSION_CONFIG.googleSheetsPlaybookUrl
    : SUBMISSION_CONFIG.googleSheetsUrl;

  if (activeGoogleSheetsUrl) {
    const payload = new URLSearchParams()
    Object.entries(formData).forEach(([key, val]) => payload.append(key, val))
    await fetch(activeGoogleSheetsUrl, {
      method: 'POST',
      body: payload,
      mode: 'no-cors'
    })
    return
  }

  throw new Error('No lead submission channels are configured in SUBMISSION_CONFIG.')
}

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
  },
  {
    title: 'Website Development',
    desc: 'Custom high-performance Shopify & custom web setups built for extreme conversion rates.',
    icon: '💻'
  },
  {
    title: 'Content Creation',
    desc: 'High-converting UGC, product shoots, and viral reels designed to hook attention instantly.',
    icon: '🎥'
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
  clothing: [
    {
      brand: 'Bunaiwala.com',
      category: 'clothing',
      title: 'CRO + UGC Overhaul',
      result: 'Audited the full store, introduced a UGC-first creative strategy, restructured Meta campaigns with a TOFU-MOFU-BOFU funnel, and optimized product pages with trust badges and urgency elements. Achieved a massive 4.7x revenue scale.',
      insights: 'Audited the full Shopify store to identify CRO gaps in the PDP, cart page, and checkout flow. Introduced a UGC-first creative strategy showcasing authentic handloom cotton sarees and ethnic wear with real customer reviews and hooks. Rebuilt Meta advertising campaigns using a TOFU-MOFU-BOFU funnel structure, optimized product pages (images, trust badges, urgency elements), and implemented a prepaid incentive strategy to boost prepaid conversion rates.',
      image: '/bunaiwala-banner.png',
      metrics: ['4.7x Revenue Growth', '+150% Order Growth', '40.05% Conversion Rate', '42.48% Prepaid Share'],
      services: ['Shopify CRO', 'UGC Ads Strategy', 'Meta Funnels', 'Prepaid Share Scaling'],
      useScreenshots: true,
      screenshots: ['/bunaiwala-before.png', '/bunaiwala-after.png'],
      shopifyData: [150, 280, 400, 550, 710, 890, 1100],
      metaData: [60, 90, 130, 170, 220, 290, 360]
    },
    {
      brand: 'Kalki Vastra',
      category: 'clothing',
      title: 'Zero to Scale in 18 Days',
      result: 'Took a brand new store with zero sales history and scaled it from 2 daily orders to 98 daily orders in just 18 days, reaching ₹1,39,900 in daily gross revenue with broad Advantage+ campaign structures.',
      insights: 'Built Meta campaigns from scratch utilizing broad targeting with Advantage+ from day one. Created a rapid-test creative framework launching 8 creatives in the first week to find winners fast, scaling winning creatives aggressively once cost-per-purchase (CPP) data stabilized after Day 5 while maintaining consistent daily sales flow without relying on single-spike events.',
      image: '/kalki.jpg',
      metrics: ['66x Revenue Growth', '6,981 Daily Sessions', '98 Daily Orders', '18 Days to Scale'],
      services: ['Meta Ads Scaling', 'Advantage+ Campaigns', 'Creative Testing Framework'],
      useScreenshots: true,
      screenshots: ['/kalkivastra-beforeafter.png'],
      shopifyData: [150, 280, 400, 550, 710, 890, 1100],
      metaData: [60, 90, 130, 170, 220, 290, 360]
    },
    {
      brand: 'Indibelle.in',
      category: 'clothing',
      title: 'Crossed ₹1 Crore — Monthly Scale Achievement',
      result: 'Systematically scaled a premium D2C apparel store beyond the ₹1 Crore/month mark within 30 days, stabilizing daily run rates to eliminate dead days and push prepaid share to 35%.',
      insights: 'Built a full 30-day creative calendar with new angles every week to avoid creative fatigue. Scaled Meta budget systematically starting at ₹25K/day, reaching ₹45K/day by week 3. Implemented a 35% prepaid push via limited-time offers and checkout incentives. Maintained a consistent ₹2.5L-₹4.5L daily run rate with no dead days in the entire month, utilizing session data (3.69L sessions) to optimize landing pages and ad-to-page alignment.',
      image: '/indibelle-banner.png',
      metrics: ['₹1.058Cr Revenue', '+28% MoM Growth', '5,907 Total Orders', '35% Prepaid Share'],
      services: ['Scale Strategy', 'Meta Ads Scaling', 'Prepaid Optimization', 'Creative Calendar'],
      useScreenshots: true,
      screenshots: ['/indibelle-beforeafter.png'],
      shopifyData: [90, 150, 180, 260, 340, 450, 580],
      metaData: [35, 50, 65, 90, 120, 160, 210]
    }
  ],
  jewelry: [
    {
      brand: 'Aura Jewels',
      category: 'jewelry',
      title: 'Premium Brand Elevate',
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
      title: 'Direct-to-Consumer Acquisition Scaling',
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
      title: 'Micro-Influencer Acquisition Engine',
      result: 'Achieved ₹18L/mo revenue starting from scratch in 90 days.',
      insights: 'Focused on micro-influencer gifting campaigns. Used the generated video assets in TikTok/Instagram Reels Ads leading to direct checkouts on mobile-first landing pages.',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop',
      metrics: ['5.1X ROAS', '₹18L Revenue', '3.5% Conversion Rate'],
      services: ['Meta Ads', 'Creative Strategy', 'Landing Page CRO'],
      shopifyData: [40, 90, 120, 190, 280, 390, 490],
      metaData: [15, 30, 40, 60, 95, 120, 160]
    }
  ],
  others: [
    {
      brand: 'Skin Glow D2C',
      category: 'others',
      title: 'Skincare Conversion Booster',
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
      category: 'others',
      title: 'Subscription Funnel Scale',
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
      category: 'others',
      title: 'Footwear Scale Engine',
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
  'Meta Ads', 'Google Ads', 'Creative Strategy', 'Landing Page CRO', 'Email Marketing', 'Funnel Optimization', 'Website Development', 'Content Creation'
]
const duplicatedRibbon = [...ribbonServices, ...ribbonServices, ...ribbonServices, ...ribbonServices, ...ribbonServices]

const brands1 = ['Bunaiwala.com', 'Kalki Vastra', 'Indibelle.in', 'Fine Silver Jewels', 'Anayna', 'Idaho']
const brands2 = ['Vaasvajaipur', 'Sugnaa', 'Vasant Apparels', 'Gems Paradise', 'Mirasa Jewels', 'Deasha India']
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
        <div className="text-lg md:text-xl font-black tracking-tight font-sans">
          <span className="text-[#EA580C]">D2c</span>
          <span className="text-white"> Grow</span>
        </div>
        <span className="text-[7px] text-[#999999] tracking-[0.25em] font-sans font-bold uppercase mt-1 select-none">
          ADS THAT BUILD BRANDS.
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
    <span className="relative inline-block overflow-hidden h-[1.45em] w-[210px] sm:w-[295px] md:w-[365px] lg:w-[435px] align-middle select-none">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="absolute inset-0 flex items-center justify-start text-left px-1 w-full whitespace-nowrap text-white"
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

function CaseStudyCard({ study, index, onClick }) {
  return (
    <div className="bg-white text-slate-900 rounded-[32px] border border-slate-200/60 p-6 md:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.03)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 mb-10 w-full text-left">
      
      {/* Left side info */}
      <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-6">
        <div>
          {/* Header row */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold text-sm">
              {study.brand.charAt(0)}
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">CASE STUDY 0{index + 1} • {study.category}</p>
              <h4 className="text-base font-bold text-slate-950 leading-tight">{study.brand}</h4>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight mb-4 uppercase">
            {study.title}
          </h3>

          {/* Description */}
          <p className="text-slate-500 text-xs sm:text-sm font-light leading-relaxed mb-6">
            {study.result}
          </p>
        </div>

        {/* Metrics Row */}
        <div className="border-t border-b border-slate-100 py-4 mb-6 flex flex-wrap gap-6 items-center">
          {study.metrics.map((metric, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 text-sm">
                {idx === 0 ? '📈' : idx === 1 ? '⚡' : '💰'}
              </div>
              <div>
                <p className="text-xs font-black text-slate-900 tracking-tight leading-none uppercase">{metric}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Impact Highlight line & Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs font-bold text-slate-900 font-sans tracking-wide">
            IMPACT: <span className="text-orange-600">{study.metrics[0]}</span>
          </p>
          <button 
            onClick={onClick}
            className="px-6 py-3 rounded-full bg-slate-950 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 hover:bg-orange-600 shadow-[0_4px_15px_rgba(0,0,0,0.15)] flex items-center gap-2 cursor-pointer group"
          >
            View Full Case Study
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

      </div>

      {/* Right side image */}
      <div className="lg:col-span-5 h-[280px] sm:h-[350px] rounded-3xl overflow-hidden shadow-inner relative">
        <img 
          src={study.image} 
          alt={study.brand} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

    </div>
  )
}

function StickyWhatsAppButton() {
  return (
    <a 
      href="https://wa.me/919352234643?text=Hi%2C%20I%20want%20to%20know%20how%20you%20can%20help%20scale%20my%20brand."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[200] w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.3)] hover:scale-110 hover:shadow-[0_4px_30px_rgba(37,211,102,0.5)] transition-all duration-300 group cursor-pointer"
      title="Chat with us on WhatsApp"
    >
      <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
      {/* Pulsing indicator */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping group-hover:animate-none pointer-events-none"></span>
    </a>
  )
}

function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    industry: '',
    budget: '',
    source: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.phone || !formData.website) {
      setSubmitError('Please fill out all required fields marked with *')
      return
    }
    setSubmitError(null)
    setIsSubmitting(true)
    try {
      await submitLeadData(formData)

      setSubmitSuccess(true)
      setFormData({ name: '', email: '', phone: '', website: '', industry: '', budget: '', source: '', message: '' })
    } catch (error) {
      console.error('Lead submit failed:', error)
      setSubmitError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div className="bg-[#FAF9F5] text-slate-900 rounded-[40px] p-4 xs:p-6 sm:p-12 md:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.05)] grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative overflow-hidden border border-slate-200/50">
        
        {/* Left column */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <span className="text-orange-600 font-mono text-xs uppercase tracking-[0.25em] font-bold block">CONTACT US</span>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight leading-none uppercase font-sans">
            Ready to build a <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-violet-600">revenue machine?</span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-light leading-relaxed max-w-md font-sans">
            Tell us about your brand. In 30 minutes with a senior strategist, we'll map out a growth plan tailored specifically to your D2C stage.
          </p>

          <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700 font-medium font-sans">
            <li className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold shrink-0">✓</span>
              <span>Free 30-minute strategy call</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold shrink-0">✓</span>
              <span>No contracts - results-based engagement</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold shrink-0">✓</span>
              <span>D2C-only - we know your category</span>
            </li>
          </ul>
        </div>

        {/* Right column form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-4 xs:p-6 sm:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.02)] border border-slate-100 text-left">
          <h3 className="text-lg font-bold text-slate-950 mb-1 font-sans">Send us a message</h3>
          <p className="text-xs text-slate-400 mb-6 font-light font-sans">We respond within 24 hours.</p>

          {/* Form is always visible */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Full name */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1 font-mono">FULL NAME *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your name"
                  className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none text-slate-900 text-xs placeholder:text-slate-400 focus:border-orange-500 transition-colors font-sans"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1 font-mono">EMAIL *</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="work@company.com"
                  className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none text-slate-900 text-xs placeholder:text-slate-400 focus:border-orange-500 transition-colors font-sans"
                />
              </div>

              {/* Phone number */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1 font-mono">PHONE NUMBER *</label>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 focus-within:border-orange-500 transition-colors font-mono">
                  <span className="text-xs text-slate-500 mr-2 border-r border-slate-200 pr-2 select-none">🇮🇳 +91</span>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="93522 34643"
                    className="w-full py-3.5 bg-transparent outline-none text-slate-900 text-xs placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Brand URL */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1 font-mono">BRAND WEBSITE URL *</label>
                <input 
                  type="text" 
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  required
                  placeholder="www.yourbrand.com"
                  className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none text-slate-900 text-xs placeholder:text-slate-400 focus:border-orange-500 transition-colors font-sans"
                />
              </div>

              {/* Industry */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1 font-mono">INDUSTRY</label>
                <select 
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none text-slate-900 text-xs focus:border-orange-500 transition-colors font-sans"
                >
                  <option value="">Select Industry</option>
                  <option value="apparel">Apparel & Fashion</option>
                  <option value="jewelry">Jewelry</option>
                  <option value="beauty">Beauty & Cosmetics</option>
                  <option value="food">Food & Beverage</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Monthly budget */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1 font-mono">MONTHLY AD BUDGET</label>
                <select 
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none text-slate-900 text-xs focus:border-orange-500 transition-colors font-sans"
                >
                  <option value="">Select Budget</option>
                  <option value="under_1l">Under ₹1L</option>
                  <option value="1l_5l">₹1L - ₹5L</option>
                  <option value="5l_10l">₹5L - ₹10L</option>
                  <option value="above_10l">Above ₹10L</option>
                </select>
              </div>

            </div>

            {/* Source */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1 font-mono">HOW DID YOU FIND US?</label>
              <select 
                name="source"
                value={formData.source}
                onChange={handleInputChange}
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none text-slate-900 text-xs focus:border-orange-500 transition-colors font-sans"
              >
                <option value="">Select Source</option>
                <option value="google">Google</option>
                <option value="linkedin">LinkedIn</option>
                <option value="instagram">Instagram</option>
                <option value="recommendation">Recommendation</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1 font-mono">MESSAGE</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="3"
                placeholder="Tell us about your brand goals..."
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none text-slate-900 text-xs placeholder:text-slate-400 focus:border-orange-500 transition-colors font-sans"
              ></textarea>
            </div>

            {submitError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs text-center font-medium font-sans">
                {submitError}
              </div>
            )}

            {/* Submit button */}
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-orange-600 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 hover:bg-orange-500 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-[0_5px_20px_rgba(234,88,12,0.25)] font-sans"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
              <span className="text-sm">→</span>
            </button>

            <div className="text-center">
              <span className="text-[8px] text-slate-400 tracking-wider font-bold uppercase font-mono block mb-3">SENIOR STRATEGIST • NO OBLIGATION</span>
            </div>

            {/* Social Icons Row */}
            <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-100">
              <a 
                href="https://www.linkedin.com/company/d2cgrow/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-500/30 text-slate-500 hover:text-[#EA580C] flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/d2cgrow/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-500/30 text-slate-500 hover:text-[#EA580C] flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="tel:+919352234643"
                className="w-9 h-9 rounded-full bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-500/30 text-slate-500 hover:text-[#EA580C] flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer"
                aria-label="Call Us"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.035 12.035 0 01-7.108-7.108c-.155-.44.011-.927.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.11-1.008H5.03c-1.137 0-2.054.924-2.054 2.054V6.75z" />
                </svg>
              </a>
              <a 
                href="mailto:d2cgrow@gmail.com"
                className="w-9 h-9 rounded-full bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-500/30 text-slate-500 hover:text-[#EA580C] flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer"
                aria-label="Email Us"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </a>
            </div>
          </form>

          {/* Success Overlay Popup */}
          <AnimatePresence>
            {submitSuccess && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              >
                <motion.div 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-white rounded-[28px] border border-slate-100 p-8 max-w-sm w-full text-center shadow-2xl space-y-4"
                >
                  <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-2xl mx-auto font-bold select-none">
                    ✓
                  </div>
                  <h4 className="text-xl font-extrabold text-slate-900 font-sans">Audit Request Received!</h4>
                  <p className="text-slate-500 text-xs sm:text-sm font-light leading-relaxed font-sans">Thanks! Our team will contact you shortly.</p>
                  <button 
                    onClick={() => setSubmitSuccess(false)}
                    className="w-full mt-2 py-3 rounded-full bg-[#EA580C] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#ff7233] transition-colors cursor-pointer font-sans"
                  >
                    Done
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
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
      className="relative w-full max-w-[280px] xs:max-w-[340px] sm:max-w-[440px] h-[230px] xs:h-[280px] sm:h-[340px] md:h-[400px] flex items-center justify-center perspective-[1000px] cursor-pointer group scale-85 xs:scale-95 sm:scale-100 transition-all origin-center"
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
        className="w-full h-full relative origin-center flex flex-col justify-center space-y-2 md:space-y-4"
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
              href="https://wa.me/919352234643?text=How%20can%20we%20help%20you%3F"
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
            <a href="tel:+919352234643" className="text-[#EA580C] hover:text-white transition-colors duration-300 flex items-center gap-2" title="Call Us">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.035 12.035 0 01-7.108-7.108c-.155-.44.011-.927.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.11-1.008H5.03c-1.137 0-2.054.924-2.054 2.054V6.75z" />
              </svg>
              <span className="text-sm font-bold tracking-wider font-mono text-white/90 hover:text-white">+91 93522 34643</span>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function PlaybookPopup({ onClose }) {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const PLAYBOOK_PDF_URL = 'https://d2cgrow.com/d2c-growth-playbook.pdf' // Replace with your actual PDF URL/path

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !phone) {
      setSubmitError('Please enter both email and phone number.')
      return
    }
    setSubmitError(null)
    setIsSubmitting(true)

    try {
      await submitLeadData({
        name: 'Playbook Subscriber',
        email: email,
        phone: phone.startsWith('+91') ? phone : `+91${phone}`,
        website: 'd2cgrow.com/playbook',
        industry: 'D2C',
        budget: 'Playbook Download',
        source: 'playbook_popup',
        message: 'Requested D2C Growth Playbook PDF'
      })

      setSubmitted(true)
      setIsSubmitting(false)

      // Automatically open the PDF in a new tab
      window.open(PLAYBOOK_PDF_URL, '_blank')
    } catch (err) {
      console.error('Playbook lead submit failed:', err)
      setSubmitError('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 sm:p-6"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 40 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="max-w-[480px] w-full bg-slate-950/80 border border-white/10 rounded-[32px] p-6 sm:p-8 relative shadow-[0_20px_50px_rgba(234,88,12,0.15)] overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-[#EA580C]/20 rounded-full blur-[80px] pointer-events-none"></div>

        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors z-20 cursor-pointer"
        >
          ✕
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-5">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/40 rounded-full flex items-center justify-center text-2xl text-emerald-400 mx-auto animate-bounce font-bold">
              ✓
            </div>
            <h3 className="text-xl font-bold text-white uppercase tracking-tight">Playbook Sent!</h3>
            <p className="text-gray-400 text-xs sm:text-sm max-w-xs mx-auto">
              Your details were saved. The playbook has been opened in a new tab.
            </p>
            
            <a 
              href={PLAYBOOK_PDF_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#EA580C] hover:bg-[#ff7233] text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_4px_15px_rgba(234,88,12,0.3)] hover:scale-102"
            >
              📥 Download Playbook PDF
            </a>
            
            <div className="pt-2">
              <button 
                onClick={onClose}
                className="text-xs text-gray-500 hover:text-white transition-colors underline bg-transparent border-none cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            {/* Free Resource Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#EA580C]/35 bg-[#EA580C]/5 text-[9px] uppercase tracking-widest font-bold text-[#EA580C]">
              ✨ Free Resource
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight mt-2 uppercase">
              Before you go grab our <span className="text-[#EA580C]">D2C Growth</span> <span className="text-violet-400">Playbook</span>
            </h2>

            {/* Subtext */}
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              The exact frameworks we use to scale Indian D2C brands from ₹10L to ₹1Cr/month. Includes ad structures, retention flows, and unit economics templates.
            </p>

            {/* Checklist */}
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300 font-light my-2">
              <li className="flex items-start gap-2.5">
                <span className="text-[#EA580C] shrink-0 text-base">🎯</span>
                <span>Meta & Google full funnel structure</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#EA580C] shrink-0 text-base">📊</span>
                <span>Unit economics & profit calculator</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#EA580C] shrink-0 text-base">⚡</span>
                <span>Shopify CRO checklist</span>
              </li>
            </ul>

            {/* Inputs */}
            <div className="space-y-3">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Work Email *" 
                className="w-full p-4 rounded-xl bg-slate-900/60 border border-white/10 outline-none text-white text-xs sm:text-sm placeholder:text-gray-500 focus:border-[#EA580C]/40 transition-colors"
              />

              <div className="flex items-center bg-slate-900/60 border border-white/10 rounded-xl px-4 py-1.5 focus-within:border-[#EA580C]/40 transition-colors font-mono">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-white border-r border-white/10 pr-3 mr-3 select-none">
                  <span>🇮🇳</span>
                  <span>+91</span>
                </div>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="Phone Number *" 
                  className="w-full bg-transparent outline-none text-white text-xs sm:text-sm placeholder:text-gray-500"
                />
              </div>
            </div>

            {submitError && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-center font-medium">
                {submitError}
              </div>
            )}

            {/* Action button */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-[#EA580C] hover:bg-[#ff7233] text-white font-bold text-xs sm:text-sm transition-all duration-300 shadow-[0_4px_20px_rgba(234,88,12,0.3)] cursor-pointer flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              {isSubmitting ? 'Sending Playbook...' : 'Send Me the Playbook'}
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </button>

            {/* Footnote */}
            <p className="text-[10px] text-gray-500 text-center font-light font-sans">
              No spam. Unsubscribe anytime. Used by 150+ D2C founders.
            </p>
          </form>
        )}
      </motion.div>
    </motion.div>
  )
}

function CaseStudyPage({ project, onClose, setShowEmailForm }) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [project])

  return (
    <div className="bg-[#0B0C15] text-white min-h-screen font-sans selection:bg-[#EA580C] relative pb-20">
      {/* Glow backgrounds */}
      <div className="absolute top-0 left-[10%] w-[600px] h-[600px] bg-gradient-to-br from-[#EA580C]/10 to-transparent blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-gradient-to-tr from-[#A78BFA]/5 to-transparent blur-[150px] rounded-full pointer-events-none -z-10"></div>

      {/* Header Nav */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/5">
        <Logo />
        <button 
          onClick={onClose}
          className="px-5 py-2.5 rounded-full border border-white/20 hover:border-[#EA580C] hover:bg-[#EA580C]/5 text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer group"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
          BACK TO CASE STUDIES
        </button>
      </header>

      {/* Hero Header */}
      <main className="max-w-7xl mx-auto px-6 pt-12">
        <div className="max-w-4xl mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#EA580C]/35 bg-[#EA580C]/5 text-xs font-bold text-[#EA580C] mb-6">
            ✨ {project.brand} Case Study
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.15] tracking-tight text-white mb-6 uppercase font-sans">
            {project.title}
          </h1>
          <p className="text-gray-400 text-sm sm:text-lg font-light leading-relaxed max-w-3xl">
            {project.result}
          </p>
        </div>

        {/* Mobile View: Keep exactly as it is */}
        <div className="lg:hidden">
          <div className="grid grid-cols-1 gap-8 items-start mb-16">
            {/* Left: Metrics Boxes stacked */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#EA580C] mb-2 font-mono">Performance Impact</h3>
              {project.metrics.map((metric, index) => (
                <div 
                  key={index} 
                  className="p-6 sm:p-8 rounded-3xl border border-[#EA580C]/15 bg-[#EA580C]/[0.03] backdrop-blur-xl relative overflow-hidden shadow-lg group hover:border-[#EA580C]/30 transition-all duration-300"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#EA580C]/5 rounded-full blur-xl pointer-events-none group-hover:bg-[#EA580C]/10 transition-colors"></div>
                  <h4 className="text-xl sm:text-3xl font-black text-white group-hover:text-[#EA580C] transition-colors duration-300 uppercase tracking-tight mb-1">
                    {metric}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-gray-500 font-mono tracking-widest uppercase font-semibold">Verified Proof</p>
                </div>
              ))}
            </div>

            {/* Right: Stunning Live Interactive Dashboards! */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#EA580C] mb-2 font-mono">
                {project.useScreenshots ? "Verified Store Performance Proof" : "Interactive Performance Data"}
              </h3>
              {project.useScreenshots ? (
                <div className={`grid gap-6 ${project.screenshots.length > 1 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                  {project.screenshots.map((scr, sIdx) => (
                    <div key={sIdx} className="border border-white/10 bg-slate-900/40 rounded-3xl p-4 shadow-[0_15px_40px_rgba(0,0,0,0.3)] backdrop-blur-md">
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-2 font-mono">
                        {project.screenshots.length > 1 
                          ? `Shopify Analytics (${sIdx === 0 ? 'Before' : 'After'})` 
                          : 'Shopify Store Performance Data'}
                      </span>
                      <img src={scr} alt="Shopify Performance" className="w-full rounded-2xl border border-white/5 object-contain max-h-[350px] mx-auto hover:scale-[1.02] transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ShopifyDashboardChart brand={project.brand} data={project.shopifyData} />
                  <MetaAdsDashboardChart data={project.metaData} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop View: Pointers side by side and screenshots below */}
        <div className="hidden lg:block space-y-12 mb-20">
          
          {/* Performance Impact Pointers side-by-side */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#EA580C] mb-4 font-mono">Performance Impact</h3>
            <div className={`grid gap-6 ${
              project.metrics.length === 5 ? 'grid-cols-5' : 
              project.metrics.length === 4 ? 'grid-cols-4' : 
              'grid-cols-3'
            }`}>
              {project.metrics.map((metric, index) => (
                <div 
                  key={index} 
                  className="p-6 xl:p-8 rounded-[28px] border border-[#EA580C]/15 bg-[#EA580C]/[0.03] backdrop-blur-xl relative overflow-hidden shadow-lg group hover:border-[#EA580C]/30 transition-all duration-300"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#EA580C]/5 rounded-full blur-xl pointer-events-none group-hover:bg-[#EA580C]/10 transition-colors"></div>
                  <h4 className="text-xl xl:text-2xl font-black text-white group-hover:text-[#EA580C] transition-colors duration-300 uppercase tracking-tight mb-1">
                    {metric}
                  </h4>
                  <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase font-semibold">Verified Proof</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shopify Before/After Screenshots below them with increased size */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#EA580C] mb-2 font-mono">
              {project.useScreenshots ? "Verified Store Performance Proof" : "Interactive Performance Data"}
            </h3>
            {project.useScreenshots ? (
              <div className={`grid gap-8 ${project.screenshots.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {project.screenshots.map((scr, sIdx) => (
                  <div key={sIdx} className="border border-white/10 bg-slate-900/40 rounded-[32px] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.5)] backdrop-blur-md">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-3 font-mono">
                      {project.screenshots.length > 1 
                        ? `Shopify Analytics (${sIdx === 0 ? 'Before' : 'After'})` 
                        : 'Shopify Store Performance Data'}
                    </span>
                    <img src={scr} alt="Shopify Performance" className="w-full rounded-2xl border border-white/5 object-contain max-h-[550px] mx-auto hover:scale-[1.01] transition-transform duration-300" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-8">
                <ShopifyDashboardChart brand={project.brand} data={project.shopifyData} />
                <MetaAdsDashboardChart data={project.metaData} />
              </div>
            )}
          </div>

        </div>

        {/* Breakdown section */}
        <div className="border-t border-white/5 pt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          <div className="lg:col-span-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#EA580C] mb-2 font-mono">Core Strategy</h3>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4">How We Scaled This Brand</h2>
            <div className="flex flex-wrap gap-2 mt-4">
              {project.services.map((srv, idx) => (
                <span key={idx} className="px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] text-gray-300 text-xs font-light font-sans tracking-wide">
                  {srv}
                </span>
              ))}
            </div>
          </div>
          <div className="lg:col-span-8">
            <p className="text-gray-400 text-sm sm:text-base leading-8 font-light max-w-3xl mb-6">
              {project.insights}
            </p>
            <p className="text-gray-400 text-sm sm:text-base leading-8 font-light max-w-3xl">
              By combining high-converting performance copy with systematic advantage targeting frameworks, we scaled their overall purchase frequency while keeping acquisition costs predictable and healthy.
            </p>
          </div>
        </div>

        {/* Bottom CTA Takeover Card */}
        <div className="relative rounded-[40px] border border-[#EA580C]/20 bg-[#0B0C15] overflow-hidden p-8 sm:p-12 md:p-16 shadow-[0_20px_50px_rgba(234,88,12,0.15)] flex flex-col items-center text-center">
          {/* Subtle glowing graphics */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#EA580C/[0.08]_0%,transparent_60%)] pointer-events-none"></div>
          <div className="absolute top-0 right-[20%] w-60 h-60 bg-[#A78BFA]/5 rounded-full blur-[80px] pointer-events-none"></div>

          <span className="text-[#EA580C] font-mono text-xs uppercase tracking-[0.3em] font-bold mb-4">READY TO SCALE YOUR D2C BRAND?</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none mb-6 max-w-2xl uppercase">
            Let us build your custom profit roadmap
          </h2>
          <p className="text-gray-400 text-xs sm:text-base font-light leading-relaxed max-w-lg mb-8">
            We will audit your Meta Ads account, landing page checkout funnels, and retention systems free of charge. No catch. Just raw performance insights.
          </p>
          
          <button 
            onClick={() => setShowEmailForm(true)}
            className="px-8 py-4 sm:px-10 sm:py-5 rounded-full bg-[#EA580C] hover:bg-[#ff7233] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_5px_25px_rgba(234,88,12,0.4)] flex items-center gap-3 cursor-pointer group"
          >
            Book A Free Audit
            <span className="transform group-hover:translate-x-1.5 transition-transform duration-300">→</span>
          </button>
        </div>

      </main>
    </div>
  )
}

function InfoSubPage({ pageType, onClose, setShowEmailForm }) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pageType])

  const renderContent = () => {
    switch (pageType) {
      case 'about':
        return (
          <div className="space-y-8 font-light text-gray-300 leading-relaxed text-sm sm:text-base">
            <p>
              <strong>D2cGrow</strong> is an elite performance marketing and conversion rate optimization (CRO) agency based in Ahmedabad, Gujarat, focused entirely on scaling D2C and high-growth e-commerce brands. Founded by industry veterans, we operate with a singular philosophy: <strong>result-first scaling</strong>.
            </p>
            <p>
              We do not hide behind vanity metrics like impressions, clicks, or likes. Instead, we track what actually matters to your business: real gross sales, prepaid order percentage, ad spend efficiency, and customer lifetime value (LTV).
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-10 pt-6">
              <div className="p-6 rounded-2xl border border-[#EA580C]/20 bg-[#EA580C]/[0.02]">
                <h3 className="text-[#EA580C] font-bold text-lg mb-2 font-sans">Our Mission</h3>
                <p className="text-xs text-gray-400 font-sans">To build sustainable growth frameworks that scale D2C brands profitably. We help you transition from erratic spikes to consistent, compounding sales streams.</p>
              </div>
              <div className="p-6 rounded-2xl border border-[#EA580C]/20 bg-[#EA580C]/[0.02]">
                <h3 className="text-[#EA580C] font-bold text-lg mb-2 font-sans">Our Philosophy</h3>
                <p className="text-xs text-gray-400 font-sans">Data over gut-feeling. Creative as the primary lever for scaling. Full funnel integration across paid acquisition, conversion rate optimization, and retention marketing.</p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight mt-10 font-sans">Why Brands Scale With Us</h3>
            <ul className="space-y-4 list-none pl-0">
              <li className="flex gap-3">
                <span className="text-[#EA580C] font-bold">✓</span>
                <div>
                  <strong>D2C Category Expertise:</strong> We understand the unique dynamics, margins, and operational challenges of e-commerce brands in India.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-[#EA580C] font-bold">✓</span>
                <div>
                  <strong>UGC-First Creative Strategy:</strong> We script, shoot, and test dozens of custom high-converting ad angles weekly to combat fatigue.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-[#EA580C] font-bold">✓</span>
                <div>
                  <strong>Prepaid Incentive Funnels:</strong> We actively design and deploy page adjustments to push prepaid order share, reducing costly RTO percentages.
                </div>
              </li>
            </ul>

            <h3 className="text-xl font-bold text-white tracking-tight mt-10 font-sans">Ahmedabad Roots, Global Standards</h3>
            <p>
              Operating from Titanium Business Park, Ahmedabad, we manage marketing budgets for some of the fastest-growing apparel, jewelry, and cosmetics brands in India. Our setups bridge server-side API integrations (CAPI) with highly-persuasive visual marketing.
            </p>
          </div>
        )
      case 'privacy':
        return (
          <div className="space-y-6 font-light text-gray-400 leading-relaxed text-xs sm:text-sm">
            <p className="text-gray-300 font-mono">Last updated: May 26, 2026</p>
            <p>
              At D2cGrow, accessible from d2cgrow.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by D2cGrow and how we use it.
            </p>

            <h3 className="text-lg font-bold text-white mt-8 uppercase tracking-wide font-sans">Information We Collect</h3>
            <p>
              We collect personal information that you voluntarily provide to us when you fill out contact forms or sign up to receive resources on our website. This includes:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Your name, email address, phone number, and brand website URL.</li>
              <li>Industry category, estimated monthly ad budget, and any details or messages you submit through text areas.</li>
            </ul>

            <h3 className="text-lg font-bold text-white mt-8 uppercase tracking-wide font-sans">How We Use Your Information</h3>
            <p>
              We use the collected information in various ways, including to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Provide, operate, and maintain our website.</li>
              <li>Schedule, prepare for, and conduct the requested Free Brand Audit call.</li>
              <li>Send resources, playbooks, or templates you opt-in to download.</li>
              <li>Understand and analyze how you interact with our website to optimize layout and user experience.</li>
              <li>Communicate with you, either directly or through one of our partners, for customer service, updates, or marketing emails.</li>
            </ul>

            <h3 className="text-lg font-bold text-white mt-8 uppercase tracking-wide font-sans">Log Files and Cookies</h3>
            <p>
              D2cGrow follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. We also use cookies to store information including visitors' preferences, and to track playbook popup dismissal.
            </p>

            <h3 className="text-lg font-bold text-white mt-8 uppercase tracking-wide font-sans">Third-Party Services</h3>
            <p>
              We may utilize third-party integrations (such as Zapier, Make, or Google Apps Script) to securely process and store lead forms. These service providers only access your data to perform specific tasks on our behalf and are obligated not to disclose or use it for any other purpose.
            </p>

            <h3 className="text-lg font-bold text-white mt-8 uppercase tracking-wide font-sans">Consent</h3>
            <p>
              By using our website, you hereby consent to our Privacy Policy and agree to its terms.
            </p>
          </div>
        )
      case 'terms':
        return (
          <div className="space-y-6 font-light text-gray-400 leading-relaxed text-xs sm:text-sm">
            <p className="text-gray-300 font-mono">Effective Date: May 26, 2026</p>
            
            <h3 className="text-lg font-bold text-white mt-8 uppercase tracking-wide font-sans">1. Agreement to Terms</h3>
            <p>
              By accessing our website at d2cgrow.com, you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>

            <h3 className="text-lg font-bold text-white mt-8 uppercase tracking-wide font-sans">2. Services Offered</h3>
            <p>
              D2cGrow provides digital performance marketing consulting, conversion rate optimization audit services, and e-commerce growth resources. The "Free Brand Audit" is a complimentary consultation offered subject to availability and our review of eligibility. We reserve the right to decline audit requests for any reason.
            </p>

            <h3 className="text-lg font-bold text-white mt-8 uppercase tracking-wide font-sans">3. Intellectual Property Rights</h3>
            <p>
              All materials, code, logos, visual diagrams, copy frameworks, and case studies featured on this website are the intellectual property of D2cGrow. You may not copy, modify, distribute, or reuse any content or design elements without written permission from us.
            </p>

            <h3 className="text-lg font-bold text-white mt-8 uppercase tracking-wide font-sans">4. Limitation of Liability</h3>
            <p>
              In no event shall D2cGrow or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on D2cGrow's website, even if D2cGrow has been notified orally or in writing of the possibility of such damage.
            </p>

            <h3 className="text-lg font-bold text-white mt-8 uppercase tracking-wide font-sans">5. Governing Law</h3>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of Gujarat, India and you irrevocably submit to the exclusive jurisdiction of the courts located in Ahmedabad, Gujarat for any disputes.
            </p>
          </div>
        )
      default:
        return null
    }
  }

  const title = pageType === 'about' ? 'About D2cGrow' : pageType === 'privacy' ? 'Privacy Policy' : 'Terms of Service'

  return (
    <div className="bg-[#0B0C15] text-white min-h-screen font-sans selection:bg-[#EA580C] relative pb-20">
      <div className="absolute top-0 left-[10%] w-[600px] h-[600px] bg-gradient-to-br from-[#EA580C]/10 to-transparent blur-[120px] rounded-full pointer-events-none -z-10"></div>
      
      {/* Header Nav */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/5">
        <Logo />
        <button 
          onClick={onClose}
          className="px-5 py-2.5 rounded-full border border-white/20 hover:border-[#EA580C] hover:bg-[#EA580C]/5 text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer group"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
          BACK TO HOME
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-12 md:pt-16">
        <div className="mb-10 text-left text-sans">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#EA580C]/35 bg-[#EA580C]/5 text-xs font-bold text-[#EA580C] mb-6 uppercase tracking-wider font-mono">
            📄 D2cGrow • {pageType}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight text-white mb-6 uppercase">
            {title}
          </h1>
        </div>

        <div className="bg-slate-900/[0.15] border border-white/5 rounded-[32px] p-6 sm:p-10 shadow-xl backdrop-blur-xl mb-16 text-left font-sans">
          {renderContent()}
        </div>

        {/* Call to Action Card */}
        <div className="relative rounded-[40px] border border-[#EA580C]/20 bg-[#05060A] overflow-hidden p-8 sm:p-12 md:p-16 shadow-[0_20px_50px_rgba(234,88,12,0.15)] flex flex-col items-center text-center font-sans">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#EA580C/[0.08]_0%,transparent_60%)] pointer-events-none"></div>
          <span className="text-[#EA580C] font-mono text-xs uppercase tracking-[0.3em] font-bold mb-4">READY TO SCALE?</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none mb-6 uppercase">
            Let us audit your marketing funnel
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed max-w-lg mb-8">
            Get a comprehensive ads and conversion review worth ₹25,000 completely free of charge. See where your budget is being wasted.
          </p>
          <button 
            onClick={() => setShowEmailForm(true)}
            className="px-8 py-4 sm:px-10 sm:py-5 rounded-full bg-[#EA580C] hover:bg-[#ff7233] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_5px_25px_rgba(234,88,12,0.4)] flex items-center gap-3 cursor-pointer group"
          >
            Get Free Audit
            <span className="transform group-hover:translate-x-1.5 transition-transform duration-300">→</span>
          </button>
        </div>
      </main>
    </div>
  )
}

export default function PortfolioWebsite() {

  const [selectedProject, setSelectedProject] = useState(null)
  const [activeSubPage, setActiveSubPage] = useState(null)
  const [windowWidth, setWindowWidth] = useState(1200)
  const [showPlaybook, setShowPlaybook] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('clothing')

  const handleMobileNavClick = (sectionId) => {
    setMobileMenuOpen(false)
    setTimeout(() => {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 150)
  }

  useEffect(() => {
    setWindowWidth(window.innerWidth)
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    
    // Playbook popup triggered exactly 2 seconds after mount (unless already dismissed)
    const dismissed = sessionStorage.getItem('playbook_dismissed')
    let timer
    if (!dismissed) {
      timer = setTimeout(() => {
        setShowPlaybook(true)
      }, 2000)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      if (timer) clearTimeout(timer)
    }
  }, [])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    industry: '',
    budget: '',
    source: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.phone || !formData.website) {
      setSubmitError('Please fill out all required fields marked with *')
      return
    }
    setSubmitError(null)
    setIsSubmitting(true)
    try {
      await submitLeadData(formData)
      
      setSubmitSuccess(true)
      setFormData({ name: '', email: '', phone: '', website: '', industry: '', budget: '', source: '', message: '' })
      setTimeout(() => {
        setSubmitSuccess(false)
        setShowEmailForm(false)
      }, 4000)
    } catch (error) {
      console.error('Modal submit failed:', error)
      setSubmitError('Something went wrong. Please try again.')
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

    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, [role="button"], .cursor-pointer')
      if (target) {
        addHoverActive()
      } else {
        removeHoverActive()
      }
    }
    window.addEventListener('mouseover', handleMouseOver)

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
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [])

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

      {activeSubPage ? (
        <InfoSubPage 
          pageType={activeSubPage} 
          onClose={() => setActiveSubPage(null)} 
          setShowEmailForm={setShowEmailForm}
        />
      ) : selectedProject ? (
        <CaseStudyPage 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
          setShowEmailForm={setShowEmailForm}
        />
      ) : (
        <>
          {/* Decorative Radial Backgrounds & Diamond Grid Pattern */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[#0B0C15] bg-[radial-gradient(circle_at_top,#151627_0%,#0B0C15_50%,#05060A_100%)]"></div>
        <div className="absolute inset-0 diamond-grid"></div>
        <div className="absolute top-[5%] left-[-15%] w-[800px] h-[800px] bg-gradient-to-tr from-[#EA580C]/[0.08] to-[#EA580C]/[0.01] blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-15%] w-[800px] h-[800px] bg-gradient-to-bl from-[#EA580C]/[0.06] to-transparent blur-[160px] rounded-full"></div>
      </div>

      {/* Navbar */}
      <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl border-b border-white/5 bg-[#0B0C15]/85">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo className="cursor-pointer hover:opacity-90 transition-opacity duration-300" />
            <a 
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                setShowEmailForm(true)
              }}
              className="px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/5 text-[11px] font-semibold text-orange-500 tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer glow-btn font-sans"
            >
              Book a Call
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex gap-10 text-sm text-[#EA580C]/80 font-light items-center font-sans">
            <a href="#services" onClick={() => { setActiveSubPage(null); setTimeout(() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-white transition-all duration-300 hover:scale-105">Services</a>
            <a href="#projects" onClick={() => { setActiveSubPage(null); setTimeout(() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-white transition-all duration-300 hover:scale-105">Proofs</a>
            <a href="#promises" onClick={() => { setActiveSubPage(null); setTimeout(() => document.getElementById('promises')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-white transition-all duration-300 hover:scale-105">Steps to Boost Revenue</a>
            <a 
              href="#contact" 
              onClick={(e) => {
                e.preventDefault()
                setActiveSubPage(null)
                setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100)
              }}
              className="hover:text-white transition-all duration-300 hover:scale-105"
            >
              Contact Us
            </a>
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
              className="absolute inset-x-0 top-full z-[60] bg-[#0B0C15]/95 border-b border-white/5 md:hidden flex flex-col px-8 py-8 gap-5 backdrop-blur-3xl shadow-2xl overflow-hidden font-sans"
            >
              <a 
                href="#services" 
                onClick={(e) => {
                  e.preventDefault()
                  setActiveSubPage(null)
                  handleMobileNavClick('services')
                }}
                className="text-base text-gray-300 hover:text-[#EA580C] cursor-pointer transition-colors duration-300 font-light tracking-wider"
              >
                Services
              </a>
              <a 
                href="#projects" 
                onClick={(e) => {
                  e.preventDefault()
                  setActiveSubPage(null)
                  handleMobileNavClick('projects')
                }}
                className="text-base text-gray-300 hover:text-[#EA580C] cursor-pointer transition-colors duration-300 font-light tracking-wider"
              >
                Proofs
              </a>
              <a 
                href="#promises" 
                onClick={(e) => {
                  e.preventDefault()
                  setActiveSubPage(null)
                  handleMobileNavClick('promises')
                }}
                className="text-base text-gray-300 hover:text-[#EA580C] cursor-pointer transition-colors duration-300 font-light tracking-wider"
              >
                Steps to Boost Revenue
              </a>
              <a 
                href="#contact" 
                onClick={(e) => {
                  e.preventDefault()
                  setActiveSubPage(null)
                  handleMobileNavClick('contact')
                }}
                className="text-base text-gray-300 hover:text-[#EA580C] cursor-pointer transition-colors duration-300 font-light tracking-wider"
              >
                Contact Us
              </a>
              <a 
                href="#contact"
                onClick={(e) => {
                  e.preventDefault()
                  setMobileMenuOpen(false)
                  setShowEmailForm(true)
                }}
                className="w-full mt-2 py-3 rounded-full bg-[#EA580C] text-white font-bold text-sm tracking-wider text-center cursor-pointer glow-btn flex items-center justify-center gap-2"
              >
                Book a Call
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-32 pb-12 text-center flex flex-col items-center select-all">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#EA580C]/30 bg-[#EA580C]/5 backdrop-blur-xl mb-6 text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#EA580C] font-bold font-sans">
          <span className="w-1.5 h-1.5 bg-[#EA580C] rounded-full animate-pulse mr-0.5"></span>
          PROFIT DRIVEN GROWTH
        </div>

        {/* Title */}
        <h1 ref={headingRef} className="text-4xl sm:text-6xl md:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6 text-white font-sans uppercase">
          Scaling Brands <br />
          with <span className="bg-[#EA580C] text-white px-3.5 py-1.5 sm:px-6 sm:py-2 rounded-2xl sm:rounded-3xl shadow-[0_4px_25px_rgba(234,88,12,0.3)] font-black inline-flex items-center justify-center text-base sm:text-2xl md:text-3xl lg:text-4xl align-middle font-sans mt-2"><TextLoop /></span>
        </h1>

        {/* Description */}
        <p ref={bioRef} className="text-slate-300 text-sm sm:text-lg md:text-xl tracking-wide font-normal mb-10 leading-relaxed font-sans max-w-2xl">
          we help D2C & B2B brands scale profitably on Meta & Google – with data, not guesswork.
        </p>

        {/* restored size graph image with top and bottom spacing */}
        <div className="w-full max-w-2xl my-12 flex justify-center py-4">
          <TiltHeroImage />
        </div>

        {/* CTA Buttons */}
        <div ref={ctaContainerRef} className="flex flex-row gap-4 mt-8 justify-center w-full max-w-md">
          <a 
            ref={magneticBtn2}
            href="#projects" 
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
            }} 
            className="px-8 py-4 sm:px-10 sm:py-4.5 rounded-full bg-[#EA580C] text-white font-extrabold text-xs sm:text-sm tracking-wide transition-all duration-300 shadow-[0_5px_25px_rgba(234,88,12,0.4)] hover:bg-[#ff7233] flex-1 text-center cursor-pointer font-sans uppercase"
          >
            View Proof
          </a>

          <a 
            ref={magneticBtn1}
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="px-8 py-4 sm:px-10 sm:py-4.5 rounded-full border border-white/20 bg-transparent text-white font-extrabold text-xs sm:text-sm tracking-wide transition-all duration-300 hover:border-[#EA580C] hover:text-[#EA580C] flex-1 text-center cursor-pointer font-sans uppercase"
          >
            Start Scaling
          </a>
        </div>

        {/* Trusted Tagline */}
        <div className="text-[10px] md:text-xs text-gray-500 font-mono tracking-widest uppercase flex items-center gap-2 mt-8">
          <span>Trusted by:</span>
          <span className="text-[#EA580C] font-semibold">D2C</span>
          <span className="text-gray-700">•</span>
          <span className="text-[#EA580C] font-semibold">B2B</span>
          <span className="text-gray-700">•</span>
          <span className="text-[#EA580C] font-semibold">Real Estate</span>
        </div>

        {/* 4. STATS ROW */}
        <div ref={statsContainerRef} className="grid grid-cols-4 gap-4 pt-12 mt-12 border-t border-white/5 w-full">
          {stats.map((item, index) => (
            <div 
              key={index} 
              className="stat-card p-4 md:p-6 rounded-[22px] border border-white/5 bg-white/[0.01] backdrop-blur-2xl hover:border-[#EA580C]/30 hover:bg-[#EA580C]/[0.02] transition-all duration-500 hover:-translate-y-1 shadow-md text-center group"
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
            <div className="relative w-[340px] h-[340px] xs:w-[380px] xs:h-[380px] md:w-[440px] md:h-[440px] flex items-center justify-center">
              
              {/* Central core node */}
              <div className="absolute w-24 h-24 xs:w-28 xs:h-28 md:w-32 md:h-32 rounded-full bg-[#EA580C]/[0.05] border border-[#EA580C]/30 flex flex-col items-center justify-center z-20 shadow-[0_0_30px_rgba(234,88,12,0.2)] animate-pulse">
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
                  const translateVal = windowWidth < 400 ? '112px' : windowWidth < 768 ? '132px' : '155px'
                  return (
                    <div
                      key={idx}
                      className="absolute"
                      style={{
                        transform: `rotate(${angle}deg) translate(${translateVal}) rotate(-${angle}deg)`
                      }}
                    >
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ repeat: Infinity, duration: 26, ease: "linear" }}
                        className="w-[72px] h-[72px] xs:w-[84px] xs:h-[84px] md:w-20 md:h-20 rounded-full border border-[#EA580C]/25 bg-[#0B0C15] hover:bg-[#EA580C] hover:text-white flex flex-col items-center justify-center text-center shadow-lg transition-colors duration-300 cursor-pointer group"
                      >
                        <span className="text-lg md:text-lg mb-0.5">{srv.icon}</span>
                        <span className="text-[8px] xs:text-[9.5px] font-bold tracking-tight uppercase leading-tight font-sans text-gray-300 group-hover:text-white line-clamp-2 px-1">
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

        {/* Bottom Area: arrange in 4/4 grid in desktop and 1/1 in mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 w-full">
          {services.map((service, index) => (
            <div 
              key={index}
              className="rounded-[24px] border border-white/5 bg-white/[0.01] hover:border-[#EA580C]/40 hover:bg-[#EA580C]/[0.03] transition-all duration-300 p-6 flex flex-col justify-between shadow-lg group text-left"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#EA580C]/10 border border-[#EA580C]/20 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <span className="text-[9px] text-[#EA580C] font-mono tracking-widest uppercase block mb-1">SERVICE 0{index + 1}</span>
                <h3 className="text-lg font-bold text-white tracking-tight mb-2 group-hover:text-[#EA580C] transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-400 text-xs font-light leading-relaxed">
                  {service.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Case Studies Section */}
      <section id="projects" className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="mb-12">
          <span className="text-[#EA580C] uppercase tracking-[0.35em] text-xs mb-2 font-bold font-sans">THE PROOF</span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mt-4 text-white leading-none uppercase font-sans">
            Real results. <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-violet-500">Real brands.</span>
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm font-light max-w-2xl mx-auto leading-relaxed mt-4">
            We drive revenue growth for brands across every stage. As a result-first direct to consumer marketing agency, every case study reflects our expertise as a leading d2c marketing agency.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {['clothing', 'jewelry', 'others'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer border ${
                activeCategory === cat 
                  ? 'bg-[#EA580C] text-white border-[#EA580C] shadow-[0_4px_15px_rgba(234,88,12,0.35)]' 
                  : 'border-white/10 hover:border-[#EA580C]/40 text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div 
          key={activeCategory}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col gap-8 mt-12 w-full"
        >
          {caseStudiesData[activeCategory].map((study, index) => (
            <CaseStudyCard 
              key={index}
              study={study}
              index={index}
              onClick={() => setSelectedProject(study)}
            />
          ))}
        </motion.div>
      </section>

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
                <p className="text-[#EA580C] text-xs uppercase tracking-[0.15em] mb-2 font-bold font-sans">{review.brand}</p>
                <div className="flex items-center gap-1 mb-4 text-[#EA580C]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192z" />
                    </svg>
                  ))}
                </div>
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

      {/* Steps to Boost Revenue */}
      <section id="promises" className="w-full bg-[#FAF9F5] py-24 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#EA580C] uppercase tracking-[0.35em] text-xs font-bold block mb-2 font-sans">STEPS TO BOOST REVENUE</span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight uppercase font-sans">
              5-Step Success Path <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-violet-600">to Predictable Revenue</span>
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-light max-w-lg mx-auto mt-4 leading-relaxed font-sans">
              We audit, structure, and scale your D2C brand through a proven growth framework engineered for profit.
            </p>
          </div>

          <div className="relative border-l border-slate-200 ml-4 sm:ml-8 pl-8 sm:pl-12 space-y-16 py-4 text-left">
            
            {/* Step 1 */}
            <div className="relative group">
              {/* Step indicator dot with icon */}
              <div className="absolute -left-[53px] sm:-left-[73px] top-0 w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-white border-2 border-[#EA580C] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 select-none">
                <span className="text-lg sm:text-xl">🔬</span>
              </div>
              
              <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(234,88,12,0.06)] hover:-translate-y-1 transition-all duration-300">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="bg-orange-50 text-[#EA580C] text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full font-mono">STEP 1</span>
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider font-sans">DAY 0</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-3 font-sans">Free Strategy Consultation</h3>
                <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed mb-6 font-sans">
                  Deep-dive strategy call to audit your brand, growth stage, and channels. We find exactly where revenue is leaking before execution begins.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-xs sm:text-sm text-slate-700 font-medium font-sans">
                  <div className="flex items-center gap-2">
                    <span className="text-[#EA580C] font-bold">▪</span>
                    <span>Funnel review & Ad account audit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#EA580C] font-bold">▪</span>
                    <span>Competitor analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#EA580C] font-bold">▪</span>
                    <span>Revenue leakage analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#EA580C] font-bold">▪</span>
                    <span>Growth opportunity mapping</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              {/* Step indicator dot with icon */}
              <div className="absolute -left-[53px] sm:-left-[73px] top-0 w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-white border-2 border-[#EA580C] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 select-none">
                <span className="text-lg sm:text-xl">💻</span>
              </div>
              
              <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(234,88,12,0.06)] hover:-translate-y-1 transition-all duration-300">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="bg-orange-50 text-[#EA580C] text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full font-mono">STEP 2</span>
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider font-sans">DAY 1–7</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-3 font-sans">Shopify Store & Data Foundation</h3>
                <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed mb-6 font-sans">
                  Infrastructure fix. We solve conversion drops caused by slow speeds and broken tracking with accurate Shopify attribution systems.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-xs sm:text-sm text-slate-700 font-medium font-sans">
                  <div className="flex items-center gap-2">
                    <span className="text-[#EA580C] font-bold">▪</span>
                    <span>Shopify CRO & Speed improvements</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#EA580C] font-bold">▪</span>
                    <span>Meta CAPI & Google Ads API setup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#EA580C] font-bold">▪</span>
                    <span>GA4 & Server-side tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#EA580C] font-bold">▪</span>
                    <span>First-party cookie tracking</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              {/* Step indicator dot with icon */}
              <div className="absolute -left-[53px] sm:-left-[73px] top-0 w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-white border-2 border-[#EA580C] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 select-none">
                <span className="text-lg sm:text-xl">🗺️</span>
              </div>
              
              <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(234,88,12,0.06)] hover:-translate-y-1 transition-all duration-300">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="bg-orange-50 text-[#EA580C] text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full font-mono">STEP 3</span>
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider font-sans">DAY 4–7</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-3 font-sans">Growth Roadmap</h3>
                <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed mb-6 font-sans">
                  Data-driven playbook tailored to your margins. We map budget allocation, channel priorities, and creative testing for the next 90 days.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-xs sm:text-sm text-slate-700 font-medium font-sans">
                  <div className="flex items-center gap-2">
                    <span className="text-[#EA580C] font-bold">▪</span>
                    <span>Budget allocation planning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#EA580C] font-bold">▪</span>
                    <span>Creative strategy planning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#EA580C] font-bold">▪</span>
                    <span>90-day revenue roadmap</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#EA580C] font-bold">▪</span>
                    <span>KPI and reporting structure</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative group">
              {/* Step indicator dot with icon */}
              <div className="absolute -left-[53px] sm:-left-[73px] top-0 w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-white border-2 border-[#EA580C] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 select-none">
                <span className="text-lg sm:text-xl">🚀</span>
              </div>
              
              <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(234,88,12,0.06)] hover:-translate-y-1 transition-all duration-300">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="bg-orange-50 text-[#EA580C] text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full font-mono">STEP 4</span>
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider font-sans">DAY 8–14</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-3 font-sans">Multi-Channel Campaign Launch</h3>
                <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed mb-6 font-sans">
                  Omni-channel execution across Meta, Google, and CRM. Every campaign is built for performance and high-intent conversion.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-xs sm:text-sm text-slate-700 font-medium font-sans">
                  <div className="flex items-center gap-2">
                    <span className="text-[#EA580C] font-bold">▪</span>
                    <span>Meta & Google ad campaigns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#EA580C] font-bold">▪</span>
                    <span>WhatsApp & Email automation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#EA580C] font-bold">▪</span>
                    <span>Creative production & GTM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#EA580C] font-bold">▪</span>
                    <span>Landing page optimisation</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="relative group">
              {/* Step indicator dot with icon */}
              <div className="absolute -left-[53px] sm:-left-[73px] top-0 w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-white border-2 border-[#EA580C] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 select-none">
                <span className="text-lg sm:text-xl">📈</span>
              </div>
              
              <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(234,88,12,0.06)] hover:-translate-y-1 transition-all duration-300">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="bg-orange-50 text-[#EA580C] text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full font-mono">STEP 5</span>
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider font-sans">ONGOING / WEEKLY</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-3 font-sans">Scale, Compound & Retain</h3>
                <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed mb-6 font-sans">
                  Continuous testing and retention scaling. We double down on winning creatives to ensure revenue compounds predictably.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-xs sm:text-sm text-slate-700 font-medium font-sans">
                  <div className="flex items-center gap-2">
                    <span className="text-[#EA580C] font-bold">▪</span>
                    <span>Weekly P&L reporting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#EA580C] font-bold">▪</span>
                    <span>Creative testing cycles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#EA580C] font-bold">▪</span>
                    <span>Audience & budget scaling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#EA580C] font-bold">▪</span>
                    <span>Retention flow optimisation</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <ContactSection />
      </section>
      </>
      )}

      {/* Email Form Modal */}
      <AnimatePresence>
        {showEmailForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 sm:p-6 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="max-w-2xl w-full bg-[#0B0C15] border border-[#EA580C]/15 rounded-[24px] sm:rounded-[32px] p-5 xs:p-6 sm:p-10 relative shadow-2xl my-auto max-h-[92vh] overflow-y-auto scrollbar-thin"
            >
              <button 
                onClick={() => setShowEmailForm(false)} 
                className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#EA580C]/10 hover:bg-[#EA580C] hover:text-white transition-all duration-300 flex items-center justify-center text-sm sm:text-lg font-light text-[#EA580C] z-30"
              >
                ✕
              </button>
              
              <div className="text-left font-sans">
                <span className="text-[#EA580C] font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] font-bold block mb-2">LIMITED SPOTS ONLY</span>
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-2 leading-none">
                  Book Your Free Brand Audit
                </h3>
                <p className="text-xs text-gray-400 font-light mb-6">
                  Get a comprehensive ads and conversion review worth ₹25,000 completely free of charge. See where your budget is being wasted.
                </p>

                {submitSuccess ? (
                  <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="w-16 h-16 bg-[#EA580C]/10 text-[#EA580C] rounded-full flex items-center justify-center text-3xl font-bold select-none border border-[#EA580C]/20">
                      ✓
                    </div>
                    <h4 className="text-xl font-extrabold text-white">Audit Request Received!</h4>
                    <p className="text-gray-400 text-xs sm:text-sm font-light max-w-xs">
                      Thanks for applying. Our senior strategist will review your brand details and reach out within 24 hours.
                    </p>
                    <button 
                      onClick={() => {
                        setShowEmailForm(false)
                        setSubmitSuccess(false)
                      }}
                      className="px-8 py-3 rounded-full bg-[#EA580C] hover:bg-[#ff7233] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                    
                    {/* Basic Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Name */}
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 block mb-1 font-mono">YOUR NAME *</label>
                        <input 
                          type="text" 
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Full Name"
                          className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 outline-none text-white focus:border-[#EA580C] transition-colors"
                        />
                      </div>

                      {/* Work Email */}
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 block mb-1 font-mono">WORK EMAIL *</label>
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="name@company.com"
                          className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 outline-none text-white focus:border-[#EA580C] transition-colors"
                        />
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 block mb-1 font-mono">PHONE NUMBER *</label>
                        <div className="flex items-center bg-slate-900 border border-white/10 rounded-xl px-3 focus-within:border-[#EA580C] transition-colors font-mono">
                          <span className="text-gray-500 mr-2 border-r border-white/10 pr-2 select-none">+91</span>
                          <input 
                            type="tel" 
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            placeholder="93522 34643"
                            className="w-full py-3 bg-transparent outline-none text-white"
                          />
                        </div>
                      </div>

                      {/* Website URL */}
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 block mb-1 font-mono">WEBSITE URL *</label>
                        <input 
                          type="text" 
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          required
                          placeholder="yourbrand.com"
                          className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 outline-none text-white focus:border-[#EA580C] transition-colors"
                        />
                      </div>

                      {/* Industry */}
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 block mb-1 font-mono">INDUSTRY</label>
                        <select 
                          name="industry"
                          value={formData.industry}
                          onChange={handleInputChange}
                          className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 outline-none text-white focus:border-[#EA580C] transition-colors"
                        >
                          <option value="">Select Industry</option>
                          <option value="apparel">Apparel & Fashion</option>
                          <option value="jewelry">Jewelry</option>
                          <option value="beauty">Beauty & Cosmetics</option>
                          <option value="food">Food & Beverage</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      {/* Monthly ad budget */}
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 block mb-1 font-mono">MONTHLY AD BUDGET</label>
                        <select 
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 outline-none text-white focus:border-[#EA580C] transition-colors"
                        >
                          <option value="">Select Budget</option>
                          <option value="under_1l">Under ₹1L</option>
                          <option value="1l_5l">₹1L - ₹5L</option>
                          <option value="5l_10l">₹5L - ₹10L</option>
                          <option value="above_10l">Above ₹10L</option>
                        </select>
                      </div>

                    </div>

                    {/* Source */}
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 block mb-1 font-mono">HOW DID YOU HEAR ABOUT US?</label>
                      <select 
                        name="source"
                        value={formData.source}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 outline-none text-white focus:border-[#EA580C] transition-colors"
                      >
                        <option value="">Select Source</option>
                        <option value="google">Google</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="instagram">Instagram</option>
                        <option value="recommendation">Recommendation</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 block mb-1 font-mono">ANY ADDITIONAL MESSAGE</label>
                      <textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows="2"
                        placeholder="E.g., current ROAS blockers, targets..."
                        className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 outline-none text-white focus:border-[#EA580C] transition-colors"
                      ></textarea>
                    </div>

                    {submitError && (
                      <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-center font-medium">
                        {submitError}
                      </div>
                    )}

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-2 py-4 rounded-xl bg-[#EA580C] hover:bg-[#ff7233] text-white font-extrabold uppercase tracking-wider transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_15px_rgba(234,88,12,0.3)]"
                    >
                      {isSubmitting ? 'Sending Request...' : 'Claim My Free Audit'}
                      <span className="text-sm">→</span>
                    </button>
                    
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Playbook Auto Popup */}
      <AnimatePresence>
        {showPlaybook && (
          <PlaybookPopup onClose={() => {
            sessionStorage.setItem('playbook_dismissed', 'true')
            setShowPlaybook(false)
          }} />
        )}
      </AnimatePresence>

      <StickyWhatsAppButton />

      <footer className="bg-[#05060A] border-t border-white/5 pt-20 pb-12 text-left text-gray-400 font-sans selection:bg-[#EA580C] w-full">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
          
          {/* Col 1: Logo & Agency Details */}
          <div className="lg:col-span-3 flex flex-col space-y-6">
            <Logo />
            <div className="space-y-4 text-xs font-light tracking-wide leading-relaxed">
              <p className="text-white/80 font-bold tracking-widest text-[10px] uppercase font-mono">D2C ECOMMERCE MARKETING AGENCY</p>
              <p className="text-gray-500">
                D905, Titanium Business Park, Makarba,<br />
                Ahmedabad, Gujarat 380051
              </p>
              <a href="mailto:d2cgrow@gmail.com" className="text-gray-400 hover:text-[#EA580C] transition-colors block font-mono">
                d2cgrow@gmail.com
              </a>
            </div>
            
            {/* Social Icons matching Peak Pilots footer */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="tel:+919352234643" 
                className="w-9 h-9 rounded-xl border border-white/10 bg-white/[0.02] hover:border-[#EA580C] hover:bg-[#EA580C]/5 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
                title="Call Us"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.035 12.035 0 01-7.108-7.108c-.155-.44.011-.927.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.11-1.008H5.03c-1.137 0-2.054.924-2.054 2.054V6.75z" />
                </svg>
              </a>
              <a 
                href="mailto:d2cgrow@gmail.com" 
                className="w-9 h-9 rounded-xl border border-white/10 bg-white/[0.02] hover:border-[#EA580C] hover:bg-[#EA580C]/5 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
                title="Email Us"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/d2cgrow/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-xl border border-white/10 bg-white/[0.02] hover:border-[#EA580C] hover:bg-[#EA580C]/5 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
                title="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/company/d2cgrow/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-xl border border-white/10 bg-white/[0.02] hover:border-[#EA580C] hover:bg-[#EA580C]/5 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
                title="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-white font-bold tracking-widest text-xs uppercase font-mono">SERVICES</h3>
            <ul className="space-y-2 text-xs font-light">
              <li><a href="#promises" onClick={() => { setActiveSubPage(null); setTimeout(() => document.getElementById('promises')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-white transition-colors duration-300">Free Consultation</a></li>
              <li><a href="#services" onClick={() => { setActiveSubPage(null); setTimeout(() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-white transition-colors duration-300">Meta Ads</a></li>
              <li><a href="#services" onClick={() => { setActiveSubPage(null); setTimeout(() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-white transition-colors duration-300">Google Ads</a></li>
              <li><a href="#services" onClick={() => { setActiveSubPage(null); setTimeout(() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-white transition-colors duration-300">Creative Strategy</a></li>
              <li><a href="#services" onClick={() => { setActiveSubPage(null); setTimeout(() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-white transition-colors duration-300">CRO</a></li>
              <li><a href="#services" onClick={() => { setActiveSubPage(null); setTimeout(() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-white transition-colors duration-300">Retention Marketing</a></li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-white font-bold tracking-widest text-xs uppercase font-mono">COMPANY</h3>
            <ul className="space-y-2 text-xs font-light">
              <li><a href="#about" onClick={(e) => { e.preventDefault(); setActiveSubPage('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors duration-300">About</a></li>
              <li><a href="#projects" onClick={() => { setActiveSubPage(null); setTimeout(() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-white transition-colors duration-300">Results</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); setActiveSubPage(null); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-white transition-colors duration-300">Contact</a></li>
            </ul>
          </div>

          {/* Col 4: Resources */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-white font-bold tracking-widest text-xs uppercase font-mono">RESOURCES</h3>
            <ul className="space-y-2 text-xs font-light">
              <li>
                <button 
                  onClick={() => setShowEmailForm(true)} 
                  className="hover:text-white transition-colors duration-300 bg-transparent border-none p-0 cursor-pointer outline-none text-left"
                >
                  Free Audit
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowEmailForm(true)}
                  className="hover:text-white transition-colors duration-300 bg-transparent border-none p-0 cursor-pointer outline-none text-left"
                >
                  Book a Call
                </button>
              </li>
              <li><a href="#terms" onClick={(e) => { e.preventDefault(); setActiveSubPage('terms'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors duration-300">Terms of Service</a></li>
              <li><a href="#privacy" onClick={(e) => { e.preventDefault(); setActiveSubPage('privacy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors duration-300">Privacy Policy</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="max-w-6xl mx-auto px-6 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-600 font-light">
          <p>© 2026 D2cGrow. Built for your brand growth.</p>
          <div className="flex gap-6 mt-4 sm:mt-0 font-mono">
            <a href="#privacy" onClick={(e) => { e.preventDefault(); setActiveSubPage('privacy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors duration-300">Privacy Policy</a>
            <a href="#terms" onClick={(e) => { e.preventDefault(); setActiveSubPage('terms'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors duration-300">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
