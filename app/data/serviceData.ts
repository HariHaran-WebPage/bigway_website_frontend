// serviceData.ts — Shared types, icons & data for all service pages
export interface ServiceType { e: string; l: string; }

export interface Service {
  id: string;
  slug: string;
  title: string;
  sub: string;
  img: string;
  accent: string;
  stat: string;
  statLbl: string;
  desc: string;
  longDesc: string;
  types: ServiceType[];
  features: string[];
  whyUs: string[];
}

export const SERVICES: Service[] = [
  {
    id: '01',
    slug: 'property-selling',
    title: 'Property Selling',
    sub: 'Sell Fast · Best Price',
    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=85',
    accent: '#D4AF37',
    stat: '500+', statLbl: 'Properties Sold',
    desc: 'Expert valuation, targeted marketing & direct access to 5,000+ verified buyers. We close at the best price — fast.',
    longDesc: 'Selling your property in Coimbatore has never been easier. Our team provides accurate market valuations, creates targeted marketing campaigns, and connects your listing with over 5,000 verified buyers. From the first consultation to the final handover, we handle every step — so you get the best price with zero hassle.',
    types: [{e:'🏠',l:'Houses'},{e:'🏢',l:'Apartments'},{e:'🌳',l:'Agri Land'},{e:'📐',l:'Plots'},{e:'🏪',l:'Shops'},{e:'🏭',l:'Industrial'}],
    features: ['Free Property Valuation','Professional Photography','Online & Offline Marketing','Legal Documentation Support','Verified Buyer Network','Negotiation & Closing Support'],
    whyUs: ['500+ properties successfully sold','15+ years of Coimbatore market expertise','Access to 5,000+ verified buyers','Transparent pricing, no hidden charges'],
  },
  {
    id: '02',
    slug: 'land-selling',
    title: 'Land Selling',
    sub: 'Plots · Sites · Farm',
    img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=85',
    accent: '#C8964A',
    stat: '300+', statLbl: 'Plots Listed',
    desc: 'Clear-title land across Coimbatore — from residential plots to agricultural farmland and industrial zones.',
    longDesc: 'Whether you own a residential plot, agricultural farmland, or an industrial zone, Bigway helps you sell it quickly and profitably. We specialise in clear-title land transactions, with in-house legal teams to verify documents and streamline the process.',
    types: [{e:'📐',l:'Res. Plots'},{e:'🌾',l:'Agri Land'},{e:'🏭',l:'Industrial'},{e:'🏪',l:'Comm. Plots'},{e:'🌳',l:'Farm Land'},{e:'🛣️',l:'Highway'}],
    features: ['Title Verification Assistance','Survey & Measurement Support','Zoning & Patta Guidance','Agricultural Land Expertise','Highway & Industrial Sites','Fast Transaction Closing'],
    whyUs: ['300+ plots successfully listed','In-house legal & documentation team','Expertise in agricultural & industrial land','Coimbatore-wide buyer network'],
  },
  {
    id: '03',
    slug: 'construction',
    title: 'Construction',
    sub: 'Design · Build · Deliver',
    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=85',
    accent: '#D4AF37',
    stat: '150+', statLbl: 'Projects Built',
    desc: 'Turnkey construction from architectural design to final finishes. Your vision, engineered to perfection.',
    longDesc: "Bigway Construction delivers end-to-end building services — from architectural blueprints to the final coat of paint. Our experienced engineers, architects, and project managers ensure every project is delivered on time, within budget, and to the highest quality standards.",
    types: [{e:'🏠',l:'Houses'},{e:'🏘️',l:'Row Houses'},{e:'🏢',l:'Apartments'},{e:'🏪',l:'Commercial'},{e:'🏭',l:'Sheds'},{e:'🏡',l:'Villas'}],
    features: ['Architectural Design & Planning','Structural Engineering','Interior Design Consultation','Project Management','Quality Material Sourcing','Post-Construction Support'],
    whyUs: ['150+ projects completed','In-house architects & civil engineers','On-time, on-budget delivery','Transparent cost breakdowns'],
  },
  {
    id: '04',
    slug: 'flats-apartments',
    title: 'Flats & Apartments',
    sub: 'Buy · Sell · Rent',
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=85',
    accent: '#E8C547',
    stat: '200+', statLbl: 'Units Listed',
    desc: "1BHK to luxury penthouses — curated listings across Coimbatore's most sought-after residential neighbourhoods.",
    longDesc: "From compact 1BHK apartments to sprawling luxury penthouses, Bigway's listings cover every budget. We curate only verified, RERA-compliant properties across Coimbatore's most desirable localities — RS Puram, Saravanampatti, Peelamedu, and Avinashi Road.",
    types: [{e:'🛏️',l:'1 BHK'},{e:'🛏️',l:'2 BHK'},{e:'🛏️',l:'3 BHK'},{e:'🛏️',l:'4 BHK+'},{e:'🏢',l:'Studio'},{e:'🌟',l:'Penthouse'}],
    features: ['RERA-Verified Listings','Home Loan Assistance','Site Visit Scheduling','Interior Customisation','Rental Management','Resale Support'],
    whyUs: ['200+ units across all budgets','RERA-compliant verified listings','Home loan tie-ups with 15+ banks','Prime Coimbatore localities'],
  },
  {
    id: '05',
    slug: 'villas-independent',
    title: 'Villas & Independent',
    sub: 'Exclusive Properties',
    img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=85',
    accent: '#D4AF37',
    stat: '80+', statLbl: 'Premium Listings',
    desc: "Gated villas, luxury bungalows & independent houses in Coimbatore's finest addresses.",
    longDesc: "Experience premium living with Bigway's exclusive villa and independent home portfolio. From elegantly designed gated community villas to serene farm houses, we handpick properties that offer the ultimate in privacy, space, and luxury.",
    types: [{e:'🏡',l:'Gated Villas'},{e:'🏠',l:'Ind. Houses'},{e:'🌿',l:'Farm Houses'},{e:'🏘️',l:'Duplex'},{e:'🏰',l:'Bungalows'},{e:'✨',l:'Luxury'}],
    features: ['Handpicked Premium Listings','Private Site Visits','Gated Community Access','Legal & Registration Support','Interior Design Referrals','Lifestyle Concierge'],
    whyUs: ['80+ premium properties listed','Exclusive listings not on other portals','Dedicated luxury advisors','Discreet, high-trust transactions'],
  },
  {
    id: '06',
    slug: 'commercial',
    title: 'Commercial',
    sub: 'Offices · Shops · Sheds',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85',
    accent: '#C8964A',
    stat: '120+', statLbl: 'Deals Closed',
    desc: 'High-ROI commercial spaces across Coimbatore — from retail frontage to Grade-A office suites.',
    longDesc: "Bigway Commercial helps businesses find the perfect space to grow. From high-footfall retail shops to Grade-A office suites, warehouses, and industrial sheds, we match buyers and tenants with properties that deliver real ROI.",
    types: [{e:'🏢',l:'Offices'},{e:'🏪',l:'Retail'},{e:'🏭',l:'Warehouses'},{e:'🍽️',l:'Restaurants'},{e:'🏬',l:'Showrooms'},{e:'📦',l:'Storage'}],
    features: ['Location & Footfall Analysis','Lease & Purchase Options','Commercial Loan Support','Tenant Sourcing','Fit-Out & Renovation Referrals','ROI Advisory'],
    whyUs: ['120+ commercial deals closed','Deep knowledge of Coimbatore zones','Lease negotiation expertise','Investor-grade ROI analysis'],
  },
];