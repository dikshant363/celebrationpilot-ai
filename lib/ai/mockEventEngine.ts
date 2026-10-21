import {
  EventBrief,
  EventConcept,
  DetailedEventPlan,
  GeneratedPlanSuite,
  BudgetItem,
  ScheduleItem,
  TaskItem,
  GuestItem,
  VendorItem,
  BudgetMetrics,
} from '../types/event';

export function calculateBudgetMetrics(
  budgetTotal: number,
  breakdown: BudgetItem[]
): BudgetMetrics {
  const totalAllocated = breakdown.reduce((acc, item) => acc + item.allocated, 0);
  const totalSpent = breakdown.reduce((acc, item) => acc + item.spent, 0);
  const remainingBudget = Math.round((budgetTotal - totalSpent) * 100) / 100;
  const isOverBudget = totalSpent > budgetTotal;
  const overBudgetAmount = isOverBudget ? Math.round((totalSpent - budgetTotal) * 100) / 100 : 0;
  const verifiedCount = breakdown.filter((item) => item.isVerifiedQuote).length;
  const verifiedQuotePercentage =
    breakdown.length > 0 ? Math.round((verifiedCount / breakdown.length) * 100) : 0;

  let verdict: 'Optimal' | 'Tight' | 'Over Budget' = 'Optimal';
  if (isOverBudget) {
    verdict = 'Over Budget';
  } else if (remainingBudget < budgetTotal * 0.1) {
    verdict = 'Tight';
  }

  return {
    totalBudget: budgetTotal,
    totalAllocated,
    totalSpent,
    remainingBudget,
    isOverBudget,
    overBudgetAmount,
    perGuestCost: 0,
    verifiedQuotePercentage,
    verdict,
  };
}

export function generateMockPlanSuite(brief: EventBrief): GeneratedPlanSuite {
  const { eventTitle, eventType, budgetTotal, guestCount, city, venueType, themePreference } = brief;

  // Domain-specific titles and themes
  let c1Title = `Opulent ${themePreference || 'Modern Signature'} Gala`;
  let c2Title = `Boho-Chic Botanical Soirée`;
  let c3Title = `Futuristic Neon Horizon`;

  if (eventType === 'Wedding') {
    c1Title = `Grand Royal Bridal Celebration`;
    c2Title = `Intimate Botanical Meadow Vows`;
    c3Title = `Modern Skyline Rooftop Nuptials`;
  } else if (eventType === 'Corporate') {
    c1Title = `Executive Leadership Gala & Banquet`;
    c2Title = `Innovation & Collaborative Forum`;
    c3Title = `High-Tech Future Summit & Awards`;
  } else if (eventType === 'Graduation') {
    c1Title = `Distinguished Honors Commencement Gala`;
    c2Title = `Garden Courtyard Alumni Celebration`;
    c3Title = `Neon Horizon Next-Gen Bash`;
  } else if (eventType === 'Anniversary') {
    c1Title = `Golden Heritage Milestone Gala`;
    c2Title = `Romantic Sunset Courtyard Soirée`;
    c3Title = `Contemporary Silver Jubilee`;
  }

  // 1. Concept 1: Premium Luxe / Immersive Experience
  const concept1: EventConcept = {
    id: 'concept-1',
    title: c1Title,
    tagline: `High-touch luxury experience with bespoke dining, immersive lighting, and seamless VIP flow`,
    vibe: 'Sophisticated, Elegant & High-Energy',
    feasibilityScore: 94,
    budgetEstimate: budgetTotal,
    categoryShares: {
      venue: 0.30,
      catering: 0.32,
      decor: 0.15,
      entertainment: 0.10,
      photography: 0.06,
      logistics: 0.04,
      contingency: 0.03,
    },
    decorConcept: `Architectural lighting paired with organic floral installations and customized gold/neutral accents tailored for a ${venueType}.`,
    cateringSummary: {
      style: 'Multi-course Plated Fine Dining with artisanal welcome canapés',
      perGuestEstimate: Math.max(1, Math.round((budgetTotal * 0.32) / (guestCount || 1))),
      highlights: [
        'Curated welcome beverage bar with handcrafted mocktails & refreshments',
        'Seasonal farm-to-table culinary entrees tailored for dietary restrictions',
        'Interactive chef-curated live dessert showcase',
      ],
    },
    entertainmentHighlights: [
      'Acoustic string quartet for guest arrival & ambient reception',
      'Dynamic live brass band & featured DJ set for prime celebration hours',
      'Synchronized architectural spotlighting cue for centerpiece moments',
    ],
    whyThisWorks: `Prioritizes unforgettable guest hospitality and high visual prestige while staying within the allocated ${brief.currency} ${budgetTotal.toLocaleString()} envelope.`,
    tradeOffs: `Higher allocation to catering and venue leaves a tighter margin for extensive take-home favors.`,
  };

  // 2. Concept 2: Organic Chic / Contemporary Warmth
  const concept2: EventConcept = {
    id: 'concept-2',
    title: c2Title,
    tagline: `Warm, welcoming atmosphere with artisan grazing stations, acoustic soundscapes, and sustainable decor`,
    vibe: 'Warm, Intimate, Aesthetic & Eco-Conscious',
    feasibilityScore: 97,
    budgetEstimate: Math.round(budgetTotal * 0.92),
    categoryShares: {
      venue: 0.25,
      catering: 0.28,
      decor: 0.18,
      entertainment: 0.12,
      photography: 0.08,
      logistics: 0.04,
      contingency: 0.05,
    },
    decorConcept: `Cascading warm fairy lighting, reclaimed timber elements, dried pampas grass, and potted lush botanicals that guests can adopt after the event.`,
    cateringSummary: {
      style: 'Interactive Gourmet Grazing Tables & Live Small-Plates Stations',
      perGuestEstimate: Math.max(1, Math.round((budgetTotal * 0.28) / (guestCount || 1))),
      highlights: [
        'Artisanal charcuterie, heirloom fruit, and international cheese spread',
        'Chef-attended live flame skewer & noodle toss bar',
        'Local organic bakery dessert assortment featuring vegan/gluten-free choices',
      ],
    },
    entertainmentHighlights: [
      'Indie-folk acoustic duo with loop pedals and soft percussion',
      'Customized photo lounge with instant polaroid guestbook station',
      'Ambient chillout lounge seating zone with bespoke acoustic playlist',
    ],
    whyThisWorks: `Delivers a relaxed, photogenic environment with high guest interaction at a conservative budget expenditure.`,
    tradeOffs: `Casual seating arrangements mean fewer formal assigned tables, fostering mingling over static seating.`,
  };

  // 3. Concept 3: Modern Minimalist / High-Tech Interactive
  const concept3: EventConcept = {
    id: 'concept-3',
    title: c3Title,
    tagline: `Sleek, tech-forward celebration with LED visual art installations, upbeat DJ vibes, and modern molecular bites`,
    vibe: 'Vibrant, Electric, Modern & Social-First',
    feasibilityScore: 91,
    budgetEstimate: Math.round(budgetTotal * 0.98),
    categoryShares: {
      venue: 0.28,
      catering: 0.24,
      decor: 0.20,
      entertainment: 0.15,
      photography: 0.07,
      logistics: 0.03,
      contingency: 0.03,
    },
    decorConcept: `Minimalist monochrome backdrop contrasted by interactive geometric LED panels, custom neon typography signage, and acrylic furniture.`,
    cateringSummary: {
      style: 'Modern Molecular Gastronomy & Futuristic Finger-Food Tapas',
      perGuestEstimate: Math.max(1, Math.round((budgetTotal * 0.24) / (guestCount || 1))),
      highlights: [
        'Liquid nitrogen freeze mocktail station with smoke effects',
        'Bite-sized gourmet sliders, sushi cones, and truffle infused tartlets',
        'Dessert sphere surprise that cracks open to reveal chocolate mousse',
      ],
    },
    entertainmentHighlights: [
      'Electronic hybrid live DJ with laser projection synchronization',
      '360-degree slow-motion video booth with instant social airDrop sharing',
      'Custom projected digital countdown & celebration highlight reel',
    ],
    whyThisWorks: `Creates maximum viral, memorable social moments and high engagement for modern celebrations.`,
    tradeOffs: `High reliance on power logistics and technical staging requires prompt audiovisual rehearsal on event day.`,
  };

  // Helper to construct a detailed plan for each concept
  function buildDetailedPlan(concept: EventConcept): DetailedEventPlan {
    const isConcept1 = concept.id === 'concept-1';
    const isConcept2 = concept.id === 'concept-2';

    // Budgets
    const budgetBreakdown: BudgetItem[] = [
      {
        id: `${concept.id}-b1`,
        category: 'Venue',
        allocated: Math.round(budgetTotal * concept.categoryShares.venue),
        spent: Math.round(budgetTotal * concept.categoryShares.venue * 0.5),
        notes: `Selected ${venueType} in ${city} with standard amenities & cleanup`,
        isVerifiedQuote: true,
      },
      {
        id: `${concept.id}-b2`,
        category: 'Catering',
        allocated: Math.round(budgetTotal * concept.categoryShares.catering),
        spent: Math.round(budgetTotal * concept.categoryShares.catering * 0.4),
        notes: `${concept.cateringSummary.style} for ${guestCount} verified guests`,
        isVerifiedQuote: true,
      },
      {
        id: `${concept.id}-b3`,
        category: 'Decor & Styling',
        allocated: Math.round(budgetTotal * concept.categoryShares.decor),
        spent: Math.round(budgetTotal * concept.categoryShares.decor * 0.3),
        notes: concept.decorConcept.slice(0, 80) + '...',
        isVerifiedQuote: false,
      },
      {
        id: `${concept.id}-b4`,
        category: 'Entertainment & Sound',
        allocated: Math.round(budgetTotal * concept.categoryShares.entertainment),
        spent: Math.round(budgetTotal * concept.categoryShares.entertainment * 0.5),
        notes: concept.entertainmentHighlights[0] || 'Sound engineer & performer',
        isVerifiedQuote: true,
      },
      {
        id: `${concept.id}-b5`,
        category: 'Photography & Media',
        allocated: Math.round(budgetTotal * concept.categoryShares.photography),
        spent: 0,
        notes: `Full event coverage with color-graded digital gallery delivery`,
        isVerifiedQuote: false,
      },
      {
        id: `${concept.id}-b6`,
        category: 'Logistics & Rentals',
        allocated: Math.round(budgetTotal * concept.categoryShares.logistics),
        spent: Math.round(budgetTotal * concept.categoryShares.logistics * 0.2),
        notes: `Generator power backup, transport, tables and chair linens`,
        isVerifiedQuote: false,
      },
      {
        id: `${concept.id}-b7`,
        category: 'Contingency',
        allocated: Math.round(budgetTotal * concept.categoryShares.contingency),
        spent: 0,
        notes: `Emergency fund for last-minute headcount updates or weather pivots`,
        isVerifiedQuote: true,
      },
    ];

    // Domain-specific schedules
    let schedule: ScheduleItem[];

    if (eventType === 'Wedding') {
      schedule = isConcept1
        ? [
            { time: '14:00', title: 'Bridal Suite Setup & Floral Delivery', description: 'AV setup, table styling inspection, and floral arch construction.', lead: 'Event Coordinator' },
            { time: '16:30', title: 'Guest Arrival & Prelude Strings', description: 'Welcome beverages, program distribution, and string quartet prelude.', lead: 'Hospitality Lead' },
            { time: '17:00', title: 'Processional & Ceremony Vows', description: `Official exchange of vows and rings for "${eventTitle}".`, lead: 'Officiant / MC' },
            { time: '17:45', title: 'Cocktail Hour & Golden Hour Portraits', description: 'Signature drinks, canapés, and bridal party photoshoot.', lead: 'Lead Photographer' },
            { time: '19:00', title: 'Grand Entrance & Plated Dinner', description: 'Formal entrance, champagne toast, and three-course dinner service.', lead: 'Catering Lead' },
            { time: '20:30', title: 'First Dance & Wedding Cake Cutting', description: 'Spotlight first dance followed by commemorative cake cutting.', lead: 'Host / MC' },
            { time: '21:00', title: 'Live Band Celebration & Open Floor', description: 'Full live band set, late night dessert stations, and dancing.', lead: 'Band Leader' },
            { time: '23:30', title: 'Sparkler Send-Off', description: 'Festive illuminated farewell with commemorative favors.', lead: 'Coordinator' },
          ]
        : isConcept2
        ? [
            { time: '14:30', title: 'Botanical Arch & Acoustic Soundcheck', description: 'Arranging organic florals, timber arbor, and acoustic microphones.', lead: 'Styling Lead' },
            { time: '16:45', title: 'Welcome Refreshments & Acoustic Greeting', description: 'Guests enjoy herbal infused mocktails and gentle acoustic guitar.', lead: 'Hospitality Lead' },
            { time: '17:15', title: 'Intimate Sunset Ceremony', description: 'Vows under natural canopy surrounded by closest family and friends.', lead: 'Officiant' },
            { time: '18:00', title: 'Artisanal Grazing & Sunset Cocktails', description: 'Charcuterie grazing table, craft beverages, and candid photography.', lead: 'Catering Lead' },
            { time: '19:15', title: 'Communal Table Feast & Heartfelt Toasts', description: 'Family-style culinary platters and personal speeches.', lead: 'Host' },
            { time: '20:45', title: 'Dessert Bar & Acoustic Sing-along', description: 'Organic bakery confections and intimate acoustic performance.', lead: 'Acoustic Lead' },
            { time: '22:30', title: 'Starlight Lantern Farewell', description: 'Guests take home potted botanicals and warm memories.', lead: 'Coordinator' },
          ]
        : [
            { time: '16:00', title: 'Modern Staging & LED Lighting Rig', description: 'Lighting cues, sound check, and acrylic altar calibration.', lead: 'Tech Lead' },
            { time: '18:00', title: 'Neon Lounge Welcome & 360 Video Booth', description: 'Guests arrive, walk the digital red carpet, and record 360 clips.', lead: 'Media Lead' },
            { time: '18:45', title: 'High-Tech Vow Ceremony', description: 'Modern ceremony with synchronized architectural lighting cues.', lead: 'Officiant' },
            { time: '19:30', title: 'Molecular Hors d’Oeuvres & Cocktail Bar', description: 'Interactive smoking cocktails and modern finger-food tapas.', lead: 'Catering Lead' },
            { time: '20:30', title: 'Celebration Climax & Modern First Dance', description: 'Synchronized visual lighting explosion honoring the couple.', lead: 'VJ / DJ' },
            { time: '21:15', title: 'DJ Electro Set & Confetti Burst', description: 'High-energy electronic beats and dance floor celebrations.', lead: 'DJ' },
            { time: '23:30', title: 'Late-Night Gourmet Snack Drop & Exit', description: 'Bite-sized sliders and instant digital photo QR delivery.', lead: 'Coordinator' },
          ];
    } else if (eventType === 'Corporate') {
      schedule = [
        { time: '08:00', title: 'AV Rigging, Signage & Stage Setup', description: 'Microphones, presentation slides, and step-and-repeat placement.', lead: 'Technical Lead' },
        { time: '09:00', title: 'Registration & Artisanal Breakfast Bar', description: 'Badge pickup, continental breakfast, and networking coffee.', lead: 'Hospitality Lead' },
        { time: '10:00', title: 'Opening Keynote & Strategic Vision', description: `Executive welcome and strategic address for "${eventTitle}".`, lead: 'Master of Ceremonies' },
        { time: '11:15', title: 'Executive Panel Discussion & Q&A', description: 'Industry leaders address strategic priorities and audience questions.', lead: 'Panel Moderator' },
        { time: '12:30', title: 'Curated Networking Lunch', description: 'Plated luncheon with reserved VIP and sponsor seating.', lead: 'Catering Lead' },
        { time: '14:00', title: 'Afternoon Breakouts & Innovation Demos', description: 'Focused thematic tracks and interactive partner demonstrations.', lead: 'Session Leads' },
        { time: '16:00', title: 'Annual Excellence Awards & Honors', description: 'Recognition of key contributors and commemorative awards presentation.', lead: 'Executive MC' },
        { time: '17:30', title: 'Executive Cocktail Reception & Jazz Mixer', description: 'Hors d’oeuvres, beverage bar, and ambient live jazz music.', lead: 'Event Coordinator' },
      ];
    } else {
      // General celebrations / Birthday / Anniversary / Graduation
      schedule = isConcept1
        ? [
            { time: '16:00', title: 'Vendor Arrival & Sound Check', description: 'AV setup, table styling inspection, and floral centerpiece delivery.', lead: 'Event Coordinator' },
            { time: '18:00', title: 'Red Carpet Guest Reception', description: 'Arrival of guests, coat check, welcome drinks, and string quartet performance.', lead: 'Hospitality Lead' },
            { time: '19:15', title: 'Grand Welcome & Keynote Moment', description: `Official celebration welcome for "${eventTitle}", followed by host toast.`, lead: 'Host / MC' },
            { time: '19:45', title: 'Plated Culinary Service', description: 'Main course service with ambient background lighting and dining jazz.', lead: 'Catering Lead' },
            { time: '21:00', title: 'Celebration Climax & Cake / Toast', description: 'Cake cutting, commemorative video reel, and champagne pouring.', lead: 'Event Coordinator' },
            { time: '21:30', title: 'Dance Floor Opening & Live Band', description: 'High-energy musical set, open bar, and evening party festivities.', lead: 'Performer Lead' },
            { time: '23:30', title: 'Farewell & Favor Distribution', description: 'Personalized thank-you gifts distributed as guests depart.', lead: 'Hospitality Lead' },
          ]
        : isConcept2
        ? [
            { time: '15:30', title: 'Eco-Decor Setup & Botanical Placement', description: 'Arranging timber elements, grazing stations, and acoustic setup.', lead: 'Styling Lead' },
            { time: '17:30', title: 'Sunset Mingling & Grazing Launch', description: 'Chilled artisanal beverages and live grazing tables opened.', lead: 'Catering Lead' },
            { time: '18:45', title: 'Acoustic Serenade & Warm Remarks', description: 'Gentle speeches and storytelling session by closest friends/family.', lead: 'Host' },
            { time: '19:30', title: 'Interactive Feast & Flame Stations', description: 'Guests visit live culinary stations at leisure with casual seating.', lead: 'Catering Team' },
            { time: '20:45', title: 'Celebration Toast & Dessert Circle', description: 'Sweet treat tasting, candle lighting, and acoustic sing-along.', lead: 'Performer Lead' },
            { time: '21:30', title: 'Under-the-Stars Stargazing & Music', description: 'Soft dancing and intimate conversation by the fire pit/lounge.', lead: 'Hospitality Lead' },
            { time: '23:00', title: 'Adopt-a-Plant Farewell', description: 'Guests take home centerpiece botanicals as memorable keepsakes.', lead: 'Styling Lead' },
          ]
        : [
            { time: '17:00', title: 'Tech Rigging & LED Calibration', description: 'Projection mapping, DJ lighting synchronization, and 360 booth test.', lead: 'Technical Director' },
            { time: '19:00', title: 'Neon Lounge Entry & 360 Video Booth', description: 'Guests receive glowing wristbands and capture arrival clips.', lead: 'Digital Media Lead' },
            { time: '19:45', title: 'Molecular Bites & Futuristic Tapas', description: 'Smoking cocktails and interactive appetizer service begins.', lead: 'Catering Lead' },
            { time: '20:30', title: 'Digital Countdown & Projection Showcase', description: 'Synchronized visual explosion on LED screens honoring the occasion.', lead: 'VJ / DJ' },
            { time: '21:00', title: 'Main DJ Electro Set & Confetti Burst', description: 'Dance floor explodes with synchronized lasers and club lighting.', lead: 'Featured DJ' },
            { time: '22:30', title: 'Late Night Snack Drop & Energy Boost', description: 'Gourmet slider boxes and dessert spheres delivered onto dance floor.', lead: 'Catering Team' },
            { time: '00:00', title: 'Afterglow Closing & Digital Memory Drop', description: 'Final track, group photo, and instant QR link to all photobooth videos.', lead: 'Event Coordinator' },
          ];
    }

    // Domain-specific tasks
    let tasks: TaskItem[];
    if (eventType === 'Wedding') {
      tasks = [
        { id: `${concept.id}-t1`, title: `Confirm ${venueType} Ceremony & Reception Contract`, category: 'Venue', duePhase: '4 Weeks Prior', status: 'Completed', priority: 'High', assignedTo: 'Event Lead' },
        { id: `${concept.id}-t2`, title: `Conduct Cake Tasting & Finalize Dietary Menu`, category: 'Catering', duePhase: '4 Weeks Prior', status: 'In Progress', priority: 'High', assignedTo: 'Catering Liaison' },
        { id: `${concept.id}-t3`, title: `Send Formal Wedding Invitations & Track RSVPs`, category: 'Invitations', duePhase: '4 Weeks Prior', status: 'Completed', priority: 'High', assignedTo: 'Communications' },
        { id: `${concept.id}-t4`, title: `Confirm Wedding Photographer & Videographer Shot List`, category: 'Media', duePhase: '2 Weeks Prior', status: 'In Progress', priority: 'High', assignedTo: 'Creative Lead' },
        { id: `${concept.id}-t5`, title: `Finalize Ceremony Vows, Officiant & Rehearsal Schedule`, category: 'Ceremony', duePhase: '1 Week Prior', status: 'To Do', priority: 'High', assignedTo: 'Officiant Liaison' },
        { id: `${concept.id}-t6`, title: `Create Final Seating Chart & Place Cards`, category: 'Logistics', duePhase: '1 Week Prior', status: 'To Do', priority: 'Medium', assignedTo: 'Hospitality Lead' },
        { id: `${concept.id}-t7`, title: `Day-of Bridal Suite Care & Run of Show Execution`, category: 'Coordination', duePhase: 'Day Of', status: 'To Do', priority: 'High', assignedTo: 'Day-of Coordinator' },
        { id: `${concept.id}-t8`, title: `Post-Event Vendor Settlements & Gown Preservation`, category: 'Post-Event', duePhase: 'Post-Event', status: 'To Do', priority: 'Low', assignedTo: 'Finance' },
      ];
    } else if (eventType === 'Corporate') {
      tasks = [
        { id: `${concept.id}-t1`, title: `Finalize Conference Hall & AV Staging Agreement`, category: 'Venue', duePhase: '4 Weeks Prior', status: 'Completed', priority: 'High', assignedTo: 'Operations' },
        { id: `${concept.id}-t2`, title: `Collect Speaker Presentations & Audio Requirements`, category: 'Speakers', duePhase: '4 Weeks Prior', status: 'In Progress', priority: 'High', assignedTo: 'Content Director' },
        { id: `${concept.id}-t3`, title: `Publish Executive Agenda & Attendee Registration`, category: 'Communications', duePhase: '4 Weeks Prior', status: 'Completed', priority: 'High', assignedTo: 'Marketing' },
        { id: `${concept.id}-t4`, title: `Order Executive Gift Bags & Sponsor Signage`, category: 'Branding', duePhase: '2 Weeks Prior', status: 'In Progress', priority: 'Medium', assignedTo: 'Brand Lead' },
        { id: `${concept.id}-t5`, title: `Conduct Full Stage Lighting & Live Mic Rehearsal`, category: 'AV & Staging', duePhase: '1 Week Prior', status: 'To Do', priority: 'High', assignedTo: 'Technical Director' },
        { id: `${concept.id}-t6`, title: `Verify VIP Transport & Executive Reserved Seating`, category: 'Logistics', duePhase: '1 Week Prior', status: 'To Do', priority: 'High', assignedTo: 'Hospitality Lead' },
        { id: `${concept.id}-t7`, title: `Day-Of Registration Desk & Keynote Timekeeping`, category: 'Coordination', duePhase: 'Day Of', status: 'To Do', priority: 'High', assignedTo: 'Floor Manager' },
        { id: `${concept.id}-t8`, title: `Distribute Post-Conference Survey & Media Pack`, category: 'Post-Event', duePhase: 'Post-Event', status: 'To Do', priority: 'Medium', assignedTo: 'Communications' },
      ];
    } else {
      tasks = [
        { id: `${concept.id}-t1`, title: `Confirm ${venueType} Booking Contract`, category: 'Venue', duePhase: '4 Weeks Prior', status: 'Completed', priority: 'High', assignedTo: 'Event Lead' },
        { id: `${concept.id}-t2`, title: `Finalize Menu Tasting & Dietary List`, category: 'Catering', duePhase: '4 Weeks Prior', status: 'In Progress', priority: 'High', assignedTo: 'Catering Liaison' },
        { id: `${concept.id}-t3`, title: `Design & Send Digital RSVP Invitations`, category: 'Invitations', duePhase: '4 Weeks Prior', status: 'Completed', priority: 'High', assignedTo: 'Communications' },
        { id: `${concept.id}-t4`, title: `Book Photographer / Videographer`, category: 'Media', duePhase: '2 Weeks Prior', status: 'In Progress', priority: 'Medium', assignedTo: 'Creative Lead' },
        { id: `${concept.id}-t5`, title: `Review Playlist & Timeline Cues with DJ`, category: 'Entertainment', duePhase: '1 Week Prior', status: 'To Do', priority: 'Medium', assignedTo: 'Entertainment Lead' },
        { id: `${concept.id}-t6`, title: `Conduct Floor Plan & Accessibility Walkthrough`, category: 'Logistics', duePhase: '1 Week Prior', status: 'To Do', priority: 'High', assignedTo: 'Operations' },
        { id: `${concept.id}-t7`, title: `Day-of Run of Show Execution & Vendor Oversight`, category: 'Coordination', duePhase: 'Day Of', status: 'To Do', priority: 'High', assignedTo: 'Day-of Coordinator' },
        { id: `${concept.id}-t8`, title: `Post-Event Vendor Settlement & Thank-You Notes`, category: 'Post-Event', duePhase: 'Post-Event', status: 'To Do', priority: 'Low', assignedTo: 'Finance' },
      ];
    }

    // Guests
    const guestList: GuestItem[] = [
      { id: 'g-1', name: 'Alexander Hamilton', category: 'VIP', rsvpStatus: 'Confirmed', dietary: 'None', plusOne: true },
      { id: 'g-2', name: 'Sophia Chen', category: 'Family', rsvpStatus: 'Confirmed', dietary: 'Vegetarian', plusOne: false },
      { id: 'g-3', name: 'Marcus Sterling', category: 'Friends', rsvpStatus: 'Pending', dietary: 'Gluten-Free', plusOne: true },
      { id: 'g-4', name: 'Dr. Evelyn Vance', category: 'Colleagues', rsvpStatus: 'Confirmed', dietary: 'Halal', plusOne: false },
      { id: 'g-5', name: 'Liam & Olivia Ross', category: 'Friends', rsvpStatus: 'Pending', dietary: 'Vegan', plusOne: true },
      { id: 'g-6', name: 'Maya Patel', category: 'Family', rsvpStatus: 'Confirmed', dietary: 'Nut Allergy', plusOne: false },
      { id: 'g-7', name: 'Julian Thorne', category: 'Colleagues', rsvpStatus: 'Declined', dietary: 'None', plusOne: false },
    ];

    // Vendors
    const vendorDirectory: VendorItem[] = [
      { id: 'v-1', name: `${city} Grand Estate & Gardens`, service: `Venue Rental (${venueType})`, estimatedCost: Math.round(budgetTotal * concept.categoryShares.venue), actualCost: Math.round(budgetTotal * concept.categoryShares.venue), status: 'Booked', contact: 'manager@grandestate.com' },
      { id: 'v-2', name: 'Epicurean Creations Catering', service: 'Full Gourmet Catering & Beverage', estimatedCost: Math.round(budgetTotal * concept.categoryShares.catering), actualCost: Math.round(budgetTotal * concept.categoryShares.catering * 0.98), status: 'Quoted', contact: 'orders@epicureancreations.com' },
      { id: 'v-3', name: 'Aura Floral & Production Studio', service: 'Themed Decor & Floral Styling', estimatedCost: Math.round(budgetTotal * concept.categoryShares.decor), actualCost: null, status: 'Contacted', contact: 'hello@aurastudio.design' },
      { id: 'v-4', name: 'Resonance Live Audio & DJ Collective', service: 'Sound System & Performer', estimatedCost: Math.round(budgetTotal * concept.categoryShares.entertainment), actualCost: Math.round(budgetTotal * concept.categoryShares.entertainment), status: 'Booked', contact: 'booking@resonancelive.com' },
      { id: 'v-5', name: 'Lumière Cinematic Photography', service: 'Photo & Video Coverage', estimatedCost: Math.round(budgetTotal * concept.categoryShares.photography), actualCost: null, status: 'Proposed', contact: 'inquiries@lumierephoto.io' },
    ];

    return {
      conceptId: concept.id,
      title: concept.title,
      tagline: concept.tagline,
      schedule,
      budgetBreakdown,
      tasks,
      guestList,
      vendorDirectory,
    };
  }

  const detailedPlans: Record<string, DetailedEventPlan> = {
    'concept-1': buildDetailedPlan(concept1),
    'concept-2': buildDetailedPlan(concept2),
    'concept-3': buildDetailedPlan(concept3),
  };

  return {
    brief,
    concepts: [concept1, concept2, concept3],
    selectedConceptId: 'concept-1',
    detailedPlans,
    generatedAt: new Date().toISOString(),
    isFallback: true,
  };
}
