import { useState, useEffect, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft, CalendarDays, MapPin, CheckCircle2, AlertCircle,
  Layers, Award, Globe, Users, Check, ShieldCheck, Mail,
  Sparkles, Search, Share2, Ticket, ChevronRight, Building2,
  Plane, Hotel, UserCheck
} from 'lucide-react'
import { conferences, type Conference } from '../data/content'
import { submitEventRegistration, isSupabaseConfigured } from '../lib/supabase'

interface ConferenceSpeaker {
  name: string
  role: string
  institution: string
  image: string
  topic: string
}

interface ConferenceAboutData {
  leadIntro: string
  fullDescription: string[]
  corePillarsHeading: string
  corePillars: { title: string; desc: string }[]
  callout?: string
}

interface ConferenceDetailsData {
  tagline: string
  venueName: string
  venueCity: string
  airport: string
  hotelPartner: string
  about: ConferenceAboutData
  tracks: { id: number; title: string; category: string; sessionFocus: string }[]
  highlights: { title: string; desc: string; icon: string }[]
  targetAudience: string[]
  speakers: ConferenceSpeaker[]
  days?: {
    day: string
    dateLabel: string
    theme: string
    schedule: { time: string; session: string; type: string; room: string }[]
  }[]
}

const conferenceRichData: Record<string, ConferenceDetailsData> = {
  'gnsc-2027': {
    tagline: 'Advancing frontline clinical excellence, patient safety models, and nursing informatics with world-leading healthcare scientists.',
    venueName: 'ExCeL London International Convention Centre & Hybrid Ballroom',
    venueCity: 'London, United Kingdom',
    airport: 'London City Airport (LCY) & Heathrow (LHR)',
    hotelPartner: 'Novotel & Aloft London Docklands (Special Delegate Rate)',
    about: {
      leadIntro: 'ORIGIN Conferences International Conference on GNSC 2027 anticipates a huge number of participants from all around the globe with thought-provoking Keynote lectures, Oral and Poster presentations, Symposiums, and interactive clinical workshops.',
      fullDescription: [
        'GNSC 2027 will provide a unique integrated platform to discuss advancing knowledge in the fields of Nursing Education, Nursing Practice, Disaster Nursing, Paediatric Nursing, Midwifery, Clinical Nursing, Cardiovascular Nursing, Cancer and Tumour Nursing, Surgical Nursing, Neurological Nursing, Women\'s Health Nursing, Trauma & Critical Care Nursing, and Nursing Management.',
        'This global congress will provide a distinctive forum to meet eminent personalities and experience inspiring talks in the field of nursing. There will be a great affiliation of healthcare scientists, professors, nurse practitioners, healthcare researchers, nurse associations, registered nurses, doctors, and faculty of nursing during exciting round-table discussions, question-answer sessions, and unique poster presentations which will help in the modernization and advancement of nursing education and healthcare innovations.'
      ],
      corePillarsHeading: 'Core Disciplines & Academic Scope',
      corePillars: [
        {
          title: 'Clinical Nursing & Patient Safety Models',
          desc: 'Advancing evidence-based clinical care protocols, patient safety models, chronic disease care, and decentralized nurse-led clinics.'
        },
        {
          title: 'Nursing Education & Competency Reform',
          desc: 'Revolutionizing nursing education with critical thinking, caring competency training, human resource management, and simulation research.'
        },
        {
          title: 'Specialized Acute, Surgical & Oncology Care',
          desc: 'Disaster and emergency triage algorithms, pediatric and neonatal ICU care, oncology immunotherapy management, and modern surgical nursing.'
        },
        {
          title: 'Healthcare Informatics & Technology Integration',
          desc: 'Bridging bedside practice with electronic health records, AI predictive diagnostics, patient satisfaction metrics, and clinical tele-nursing.'
        }
      ],
      callout: 'A distinctive international forum dedicated to modernization, breakthrough research dissemination, and global clinical excellence.'
    },
    speakers: [
      {
        name: 'Dr. Sarah Jenkins, PhD, RN',
        role: 'Director of Clinical Nursing Research',
        institution: "King's College Hospital, London",
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
        topic: 'Next-Generation Patient Safety Models in Critical Care'
      },
      {
        name: 'Prof. David Henderson, MD',
        role: 'Chair of Clinical Oncology & Palliative Care',
        institution: 'University of Edinburgh Medical School',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        topic: 'Translational Protocols in Pediatric & Cancer Nursing'
      },
      {
        name: 'Dr. Elena Rostova, CSO',
        role: 'Chief Science Officer & Informatics Fellow',
        institution: 'Global Health BioTech Institute',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
        topic: 'AI Bedside Diagnostics & Emergency Trauma Informatics'
      }
    ],
    tracks: [
      { id: 1, title: 'Nursing Education and Pedagogical Research', category: 'Education', sessionFocus: 'Curriculum transformation, clinical competency assessment, and simulation labs.' },
      { id: 2, title: 'Clinical Nursing & Next-Gen Patient Care Models', category: 'Clinical', sessionFocus: 'Decentralized care protocols, nurse-led clinics, and bedside decision support.' },
      { id: 3, title: 'Pediatric Nursing & Child Healthcare Systems', category: 'Clinical', sessionFocus: 'Neonatal intensive care, pediatric pain management, and family-centered triage.' },
      { id: 4, title: 'Pregnancy, Perinatal Care & Modern Midwifery', category: 'Clinical', sessionFocus: 'High-risk obstetrics, perinatal mental health, and community maternal health.' },
      { id: 5, title: 'Cancer and Tumour Nursing Innovations', category: 'Oncology', sessionFocus: 'Immunotherapy side-effect management, oncology clinical trials, and hospice care.' },
      { id: 6, title: 'Critical Care & Emergency Trauma Nursing', category: 'Emergency', sessionFocus: 'Disaster triage algorithms, ICU hemodynamic monitoring, and acute resuscitation.' },
      { id: 7, title: 'Healthcare Informatics & AI in Bedside Practice', category: 'Informatics', sessionFocus: 'EHR predictive analytics, wearable vital monitors, and clinical tele-nursing.' },
      { id: 8, title: 'Innovations in Chronic Disease Management', category: 'Clinical', sessionFocus: 'Cardiometabolic pathways, dialysis care coordination, and mobile health apps.' },
      { id: 9, title: 'Critical Thinking & Caring Competency Training', category: 'Education', sessionFocus: 'Cognitive bias mitigation in emergency care and multidisciplinary ward rounds.' },
      { id: 10, title: 'Quality, Safety and Clinical Governance Frameworks', category: 'Management', sessionFocus: 'Hospital-acquired infection reduction, root cause analysis, and patient advocacy.' },
      { id: 11, title: 'Crisis and Risk Management in Primary Care', category: 'Management', sessionFocus: 'Epidemic surveillance, primary triage surge capacity, and clinician burnout prevention.' },
      { id: 12, title: 'Community Health Nursing and Global Public Health', category: 'Public Health', sessionFocus: 'Vaccine distribution logistics, rural healthcare access, and epidemiological tracking.' },
      { id: 13, title: 'Geriatric & Palliative Care Nursing Paradigms', category: 'Clinical', sessionFocus: 'Dementia care pathways, frailty assessments, and ethical end-of-life decision making.' },
      { id: 14, title: 'Heart & Cardiovascular Nursing Interventions', category: 'Clinical', sessionFocus: 'Post-CABG recovery protocols, cardiac catheterization nursing, and arrhythmia triage.' },
      { id: 15, title: 'Psychiatric and Mental Health Nursing Practices', category: 'Clinical', sessionFocus: 'Inpatient psychiatric crisis stabilization, dual diagnosis, and trauma-informed therapies.' },
      { id: 16, title: 'Surgical Nursing & Post-Operative ERAS Protocols', category: 'Clinical', sessionFocus: 'Enhanced recovery after surgery (ERAS), wound dehiscence prevention, and sepsis alerts.' },
      { id: 17, title: 'Nursing Ethics, Hospice and Supportive Care Systems', category: 'Management', sessionFocus: 'Bioethics in life support withdrawal, moral distress mitigation, and patient dignity.' },
      { id: 18, title: 'Practice Model Reform & Delegate Leadership', category: 'Management', sessionFocus: 'Nurse executive leadership, hospital board representation, and retention strategies.' }
    ],
    highlights: [
      { title: 'Visionary Healthcare Keynotes', desc: 'World-renowned healthcare scientists and clinical professors delivering visionary talks on next-generation care models.', icon: 'Award' },
      { title: 'Oral & Poster Competitions', desc: 'Distinctive scientific forums to showcase clinical trial outcomes, patient safety frameworks, and academic papers.', icon: 'Flame' },
      { title: 'Interactive Clinical Skill Labs', desc: 'Hands-on skill labs covering emergency trauma triage, critical care competency, and digital health records.', icon: 'Sparkles' },
      { title: 'Global Nursing Leadership Roundtables', desc: 'Dynamic peer exchanges connecting nursing directors, healthcare researchers, and deans of medicine.', icon: 'Users' }
    ],
    targetAudience: [
      'Nurse Practitioners & Registered Nurses',
      'Healthcare Scientists & Clinical Researchers',
      'Deans & Faculty of Nursing & Medicine',
      'Midwives & Pediatric Care Specialists',
      'Emergency, ICU & Critical Care Coordinators',
      'Nursing Directors & Hospital Chief Nursing Officers'
    ],
    days: [
      {
        day: 'Day 1',
        dateLabel: 'Summit Day 1 • Clinical Excellence',
        theme: 'Acute Care Innovation, Trauma Triage & Patient Safety',
        schedule: [
          { time: '08:30 - 09:15', session: 'Delegate Accreditation & Morning Coffee Reception', type: 'Welcome', room: 'Grand Foyer' },
          { time: '09:15 - 10:45', session: 'Opening Plenary: The Next Decade in Global Nursing Science', type: 'Keynote', room: 'Main Auditorium A' },
          { time: '11:00 - 13:00', session: 'Concurrent Tracks: Emergency Triage & Pediatric Clinical Care', type: 'Session', room: 'Hall B & C' },
          { time: '13:00 - 14:15', session: 'Networking Luncheon & Scientific Poster Exhibition', type: 'Networking', room: 'Exhibition Hall' },
          { time: '14:15 - 16:30', session: 'Clinical Governance & Patient Safety Frameworks Symposium', type: 'Workshop', room: 'Auditorium A' },
          { time: '16:45 - 18:30', session: 'Welcome Gala Networking Reception & Peer Mixer', type: 'Social', room: 'Skyline Terrace' }
        ]
      },
      {
        day: 'Day 2',
        dateLabel: 'Summit Day 2 • Translational Future',
        theme: 'Healthcare Informatics, Chronic Care & Public Health',
        schedule: [
          { time: '09:00 - 10:30', session: 'Healthcare Informatics & AI in Bedside Patient Monitoring', type: 'Keynote', room: 'Main Auditorium A' },
          { time: '10:45 - 12:45', session: 'Chronic Disease Management & Community Health Tracks', type: 'Session', room: 'Hall B & C' },
          { time: '12:45 - 14:00', session: 'Faculty Luncheon & Best Oral Paper Award Ceremony', type: 'Awards', room: 'Exhibition Hall' },
          { time: '14:00 - 16:00', session: 'Interactive Trauma Simulation Lab & Certification', type: 'Workshop', room: 'Clinical Simulation Suite' },
          { time: '16:00 - 17:00', session: 'Closing Plenary, CME Credit Handover & Adjournment', type: 'Closing', room: 'Main Auditorium A' }
        ]
      }
    ]
  },
  'gwbel-2027': {
    tagline: 'Uniting unicorn founders, venture capital partners, and corporate strategists to scale global enterprise resilience and technology leadership.',
    venueName: 'Centre International de Conférences Genève (CICG) & Hybrid Room',
    venueCity: 'Geneva, Switzerland',
    airport: 'Geneva Cointrin International Airport (GVA)',
    hotelPartner: 'InterContinental Geneva & Hotel President Wilson',
    about: {
      leadIntro: 'The International Conference on Global Business & Entrepreneurial Leadership (GWBEL 2027) aims to provide an in-depth introduction to the transformative power of entrepreneurship, the accessibility of start-ups, and lean start-up principles.',
      fullDescription: [
        'Members will engage in a hands-on exercise focused on rapid prototyping—a core concept within lean methodology. Delegates brainstorm early-stage business concepts and thoroughly investigate these ideas through the lean canvas framework. Informed by the preceding Lean Canvas exercise, teams will develop their business concepts and build a brief pitch to be delivered within their cohorts.',
        'The conference will reinforce entrepreneurial concepts taught in marketing and business classes. Participation in this conference will help students and emerging professionals understand the concepts, processes, and skills associated with identifying new ideas, opportunities, and methods, and with creating or starting a new project or venture.',
        'GWBEL 2027 warmly welcomes emerging leaders and entrepreneurs in marketing, finance, hospitality, and management in high schools, colleges, and venture accelerators around the globe. Join Global Business & Entrepreneurial Leadership for a better future today!'
      ],
      corePillarsHeading: 'Hands-on Venture Creation & Discovery Outcomes',
      corePillars: [
        {
          title: 'Entrepreneurial Discovery Strategies',
          desc: 'Employing structured discovery strategies to uncover unmet market opportunities and generate feasible ideas for business ventures.'
        },
        {
          title: 'Lean Canvas & Rapid Prototyping',
          desc: 'Hands-on prototyping exercises, lean canvas iteration, hypothesis testing, and constructing rapid minimum viable products.'
        },
        {
          title: 'Venture Feasibility & Success Evaluation',
          desc: 'Evaluating business concepts against rigorous market viability criteria, customer validation, and competitive positioning.'
        },
        {
          title: 'Resource Allocation & Start-up Viability',
          desc: 'Determining needed capital, technology stack, and human resources to ensure commercial viability and investor syndication readiness.'
        }
      ],
      callout: 'Join Global Business & Entrepreneurial Leadership for a better future today!'
    },
    speakers: [
      {
        name: 'Marcus Vance, MBA',
        role: 'Managing Partner & Venture Lead',
        institution: 'Nova Ventures, Geneva',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
        topic: 'Cross-Border Venture Capital & Seed Syndication Strategies'
      },
      {
        name: 'Sophia Lindqvist',
        role: 'Head of Enterprise Transformation',
        institution: 'Nordic Capital Partners, Stockholm',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
        topic: 'ESG Integration, Sustainable Scale & Corporate Governance'
      },
      {
        name: 'Dr. Alain Dupont',
        role: 'Executive Fellow & Innovation Strategist',
        institution: 'Zurich Institute of Technology & Management',
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
        topic: 'Lean Startup Prototyping & AI Disruption in Global Enterprise'
      }
    ],
    tracks: [
      { id: 1, title: 'Entrepreneurial Leadership & Strategic Capabilities', category: 'Leadership', sessionFocus: 'Developing executive agility, strategic vision, and navigating market uncertainty.' },
      { id: 2, title: 'Gender & Leadership in Global Business', category: 'Leadership', sessionFocus: 'Women in entrepreneurial leadership, diverse governance models, and executive parity.' },
      { id: 3, title: 'Leadership & Management Styles in High-Growth Firms', category: 'Leadership', sessionFocus: 'Transformational vs. operational leadership, culture building, and team alignment.' },
      { id: 4, title: 'Leadership for Sustainability & Climate Innovation', category: 'Sustainability', sessionFocus: 'Green business practices, circular economy models, and ESG compliance.' },
      { id: 5, title: 'Leader’s Role in Innovation & Corporate Spin-Offs', category: 'Innovation', sessionFocus: 'Intrapreneurship, R&D commercialization, and incubation within established firms.' },
      { id: 6, title: 'Leadership & Family Enterprise Continuity', category: 'Leadership', sessionFocus: 'Generational wealth transfer, family business governance, and conflict resolution.' },
      { id: 7, title: 'Leading Change & Overcoming Communication Barriers', category: 'Management', sessionFocus: 'Change management methodologies, negotiation strategies, and organizational resilience.' },
      { id: 8, title: 'Lean Startup Principles & Rapid Prototyping', category: 'Entrepreneurship', sessionFocus: 'Lean Canvas design, rapid iteration, MVP building, and customer discovery.' },
      { id: 9, title: 'Social & Clean Green Entrepreneurship Prospects', category: 'Entrepreneurship', sessionFocus: 'Impact investing, mission-driven ventures, and sustainable social enterprise models.' },
      { id: 10, title: 'R&D Transfer & Business Incubator Ecosystems', category: 'Innovation', sessionFocus: 'University lab spinouts, technology transfer, and startup incubator frameworks.' },
      { id: 11, title: 'Entrepreneurship among Marginalized Groups & Regional Growth', category: 'Growth', sessionFocus: 'Inclusive entrepreneurship, rural economic development, and economic empowerment.' },
      { id: 12, title: 'Agri-Business & Agri-Preneurship Development', category: 'Growth', sessionFocus: 'Agricultural supply chain innovation, food-tech startups, and rural value addition.' },
      { id: 13, title: 'Venture Capital & Angel Funding for New Ventures', category: 'Finance', sessionFocus: 'Seed syndicates, term sheet negotiation, cap tables, and early-stage equity.' },
      { id: 14, title: 'Banking, Capital Market Dynamism & Foreign Direct Investment (FDI)', category: 'Finance', sessionFocus: 'Commercial bank funding, IPO readiness, cross-border capital, and global FDI flows.' },
      { id: 15, title: 'Natural Resources & Sustainable Venture Opportunities', category: 'Sustainability', sessionFocus: 'Clean energy transition, resource efficiency, and sustainable extraction ventures.' },
      { id: 16, title: 'Cross-Cultural Management & Global Competitiveness', category: 'Strategy', sessionFocus: 'International market expansion, cross-border M&A, and intercultural negotiations.' },
      { id: 17, title: 'Entrepreneurship Education from Early-Stage to University', category: 'Education', sessionFocus: 'Creating entrepreneurial mindsets in colleges, universities, and incubator programs.' },
      { id: 18, title: 'Data Analytics & Software Tools for Entrepreneurs', category: 'Technology', sessionFocus: 'Business intelligence, automated workflows, SaaS adoption, and predictive data modeling.' },
      { id: 19, title: 'E-Governance, Digital Infrastructure & New Ventures', category: 'Technology', sessionFocus: 'Digital public infrastructure, paperless compliance, and e-governance solutions.' },
      { id: 20, title: 'Government Policies, Programs & Subsidies for SMEs', category: 'Policy', sessionFocus: 'Government grant programs, startup tax incentives, and public-private partnerships.' }
    ],
    highlights: [
      { title: 'Global Executive Keynotes', desc: 'Direct strategic playbooks from unicorn founders, venture capital partners, and multinational CEOs.', icon: 'Award' },
      { title: 'Curated Venture Pitch Arena', desc: 'Showcasing vetted enterprise startups to tier-one global investors and institutional funds.', icon: 'Flame' },
      { title: 'Tactical Strategy Masterclasses', desc: 'Deep-dive interactive workshops on lean prototyping, international market entry, and unit economics.', icon: 'Sparkles' },
      { title: 'Executive Networking Banquets in Geneva', desc: 'Unparalleled opportunities to form high-value cross-border partnerships in Switzerland.', icon: 'Users' }
    ],
    targetAudience: [
      'Chief Executives, Founders & Managing Partners',
      'Venture Capitalists, Angel Investors & Fund Managers',
      'Corporate Strategists & Innovation Directors',
      'Business School Deans & Management Scholars',
      'Product Leaders & Emerging Entrepreneurs',
      'Enterprise Operations & Scale-Up Executives'
    ],
    days: [
      {
        day: 'Day 1',
        dateLabel: 'Summit Day 1 • Venture & Strategy',
        theme: 'Disruptive Innovation, Venture Capital & Scale-Up Execution',
        schedule: [
          { time: '08:30 - 09:15', session: 'VIP Delegate Registration & Espresso Networking', type: 'Welcome', room: 'Leman Foyer' },
          { time: '09:15 - 10:45', session: 'Opening Address: The Macroeconomic Landscape for Global Tech', type: 'Keynote', room: 'Amphitheatre A' },
          { time: '11:00 - 13:00', session: 'Scale-Up Strategy & Cross-Border Expansion Tracks', type: 'Session', room: 'Room Geneva I & II' },
          { time: '13:00 - 14:15', session: 'Executive Dealmaker Luncheon & Private Investor Lounge', type: 'Networking', room: 'Chillon Suite' },
          { time: '14:15 - 16:30', session: 'Unicorn Founder Pitch Showcase & Live Venture Feedback', type: 'Pitch', room: 'Amphitheatre A' },
          { time: '17:00 - 19:30', session: 'Gala Networking Reception & Cocktail in Geneva', type: 'Social', room: 'Presidential Terrace' }
        ]
      },
      {
        day: 'Day 2',
        dateLabel: 'Summit Day 2 • Enterprise & Transformation',
        theme: 'Enterprise AI, Sustainable Governance & Cross-Border Leadership',
        schedule: [
          { time: '09:00 - 10:30', session: 'Enterprise AI Implementation & Workforce Evolution', type: 'Keynote', room: 'Amphitheatre A' },
          { time: '10:45 - 12:45', session: 'ESG Integration & Resilient Supply Chain Workshops', type: 'Session', room: 'Room Geneva I & II' },
          { time: '12:45 - 14:00', session: 'Global Leadership Luncheon & Venture Awards', type: 'Awards', room: 'Chillon Suite' },
          { time: '14:00 - 16:00', session: 'Interactive Negotiation & M&A Strategy Lab', type: 'Workshop', room: 'Executive Boardroom' },
          { time: '16:00 - 17:00', session: 'Summit Declarations & Global Leaders Adjournment', type: 'Closing', room: 'Amphitheatre A' }
        ]
      }
    ]
  },
  'wedc-2027': {
    tagline: 'A phenomenal European summit uniting world leaders in digital dentistry, 3D CAD/CAM workflows, implantology, and aesthetic restorations.',
    venueName: 'Palais des Congrès de Paris & Live 4K Broadcast Surgical Studio',
    venueCity: 'Paris, France',
    airport: 'Paris Charles de Gaulle (CDG) & Orly (ORY)',
    hotelPartner: 'Hyatt Regency Paris Étoile & Le Méridien (Delegate Block)',
    about: {
      leadIntro: 'ORIGIN Conferences - International Conference on WEDC 2027 is a phenomenal occasion which features exciting speakers, hands-on clinical sessions, and the application of cutting-edge exploration discoveries across modern dentistry.',
      fullDescription: [
        'The congress is dedicated to discoveries and clinical techniques identified with Prosthodontics, Oral Surgery, Cosmetic Dentistry, Periodontology, Oral Wellbeing, Oral Cancer, Orthodontics, Periodontics, Endodontics, Forensic Dentistry or Odontology, and Future Trends in Dentistry.',
        'Dentistry and Oral Health Summit-2027 welcomes members from every single driving University, clinical exploration establishment, and diagnostic organization to give the world a huge platform to discuss and explore unique results, recent technological advancements, new dental strategies, and innovations—showcasing them for the benefit of the world population.'
      ],
      corePillarsHeading: 'Clinical Exploration & Diagnostic Scope',
      corePillars: [
        {
          title: 'Prosthodontics, Aesthetics & Cosmetic Dentistry',
          desc: 'Full-arch rehabilitation, porcelain veneers, aesthetic smile design, occlusion management, and minimally invasive restorative therapies.'
        },
        {
          title: 'Digital Dentistry, 3D CAD/CAM & Intraoral Scanning',
          desc: 'Digital workflow integration, chairside 3D milling, guided implant surgery, and cloud-synchronized dental laboratory coordination.'
        },
        {
          title: 'Laser Dentistry & Advanced Endodontics',
          desc: 'Hard and soft tissue laser therapies, rotary NiTi instrumentation, bioceramic obturation, and periodontal tissue regeneration.'
        },
        {
          title: 'Universities & Clinical Exploration Network',
          desc: 'Collaborative alliances connecting university dental faculties, hospital surgeons, and diagnostic manufacturers to elevate population health.'
        }
      ],
      callout: 'A huge global platform welcoming driving universities, clinical exploration establishments, and diagnostic organizations to benefit world population.'
    },
    speakers: [
      {
        name: 'Dr. Alain Dupont, DDS, PhD',
        role: 'Professor of Oral & Maxillofacial Surgery',
        institution: 'University of Paris Dental Faculty',
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
        topic: '3D Guided Implant Surgery & Full-Arch Bone Grafting'
      },
      {
        name: 'Dr. Camille Laurent, DDS',
        role: 'Chair of Aesthetic Restorative Dentistry',
        institution: 'European Academy of Digital Dentistry, Lyon',
        image: 'https://images.unsplash.com/photo-1594824813589-9a2503251a37?auto=format&fit=crop&w=600&q=80',
        topic: 'Chairside CAD/CAM Intraoral Scanning & Smile Design'
      },
      {
        name: 'Prof. Marco Bellini, MD',
        role: 'Director of Advanced Endodontics',
        institution: 'Milan Dental Institute',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
        topic: 'Bioceramic Sealers & Minimally Invasive Endodontic Therapy'
      }
    ],
    tracks: [
      { id: 1, title: 'Dental Public Health & Community Oral Care', category: 'Public Health', sessionFocus: 'Epidemiology, caries prevention, and fluoridation protocols.' },
      { id: 2, title: 'Advanced Endodontics & Root Canal Technologies', category: 'Endodontics', sessionFocus: 'NiTi rotary instrumentation, bioceramic obturation, and apex locators.' },
      { id: 3, title: 'Forensic Odontology & Legal Identification', category: 'Pathology', sessionFocus: 'Mass disaster victim identification and bite-mark analysis standards.' },
      { id: 4, title: 'Dental Materials, Ceramics & Biomaterial Science', category: 'Materials', sessionFocus: 'Zirconia sintering, lithium disilicate bonding, and nano-composites.' },
      { id: 5, title: 'Orthodontics & Clear Aligner Biomechanics', category: 'Orthodontics', sessionFocus: 'Digital staging, attachment biomechanics, and accelerated tooth movement.' },
      { id: 6, title: 'Digital Dentistry, 3D Intraoral Scanning & CAD/CAM', category: 'Digital', sessionFocus: 'Chairside milling, digital impressions, and cloud dental laboratory sync.' },
      { id: 7, title: 'Oral Cancer, Oncology & Maxillofacial Pathology', category: 'Oncology', sessionFocus: 'Early diagnostic biopsies, HPV-related malignancies, and reconstruction.' },
      { id: 8, title: 'Prosthodontics, Full-Arch Restorations & Aesthetics', category: 'Prosthodontics', sessionFocus: 'All-on-X planning, vertical dimension restoration, and smile design.' },
      { id: 9, title: 'Periodontology & Guided Tissue Regeneration', category: 'Periodontics', sessionFocus: 'Membrane barrier techniques, PRF/PRP biologics, and peri-implantitis.' },
      { id: 10, title: 'Pediatric Dentistry & Preventive Interventions', category: 'Pediatrics', sessionFocus: 'Early interceptive orthodontics, pulp therapy, and behavior management.' },
      { id: 11, title: 'Dental Practice Management & Clinic Marketing', category: 'Management', sessionFocus: 'Patient retention economics, clinic ergonomics, and staff delegation.' },
      { id: 12, title: 'Geriatric Dentistry & Medically Complex Patients', category: 'Clinical', sessionFocus: 'Polypharmacy interactions, xerostomia management, and wheelchair access.' },
      { id: 13, title: 'Laser Dentistry & Minimally Invasive Therapies', category: 'Technology', sessionFocus: 'Diode & Er:YAG lasers in soft-tissue crown lengthening and debridement.' },
      { id: 14, title: 'Cosmetic Dentistry, Smile Design & Porcelain Veneers', category: 'Aesthetics', sessionFocus: 'Minimally invasive prep design, color matching, and cementation.' },
      { id: 15, title: 'Dental Biomaterials & Nano-Hydroxyapatite Science', category: 'Materials', sessionFocus: 'Enamel remineralization, bioactive glass, and resin-dentin hybridization.' },
      { id: 16, title: 'Dental Hygiene, Biofilm Control & Guided Biofilm Therapy', category: 'Hygiene', sessionFocus: 'Air-polishing airflow technologies, ultrasonic instrumentation, and home care.' },
      { id: 17, title: 'Implantology, Guided Surgery & Sinus Augmentation', category: 'Surgery', sessionFocus: '3D surgical guides, immediate loading, and lateral window sinus elevation.' },
      { id: 18, title: 'Temporomandibular Disorders & Occlusal Rehabilitation', category: 'Prosthodontics', sessionFocus: 'Splint therapy, digital jaw tracking, and full-mouth rehabilitation.' }
    ],
    highlights: [
      { title: 'Live Clinical Demonstrations', desc: 'High-definition closed-circuit broadcasts of advanced full-arch implant placement and guided bone augmentation.', icon: 'Award' },
      { title: '3D CAD/CAM Digital Labs', desc: 'Hands-on workstations covering intraoral scanning, digital smile design, and chairside 3D milling.', icon: 'Flame' },
      { title: 'European Dental Society Plenary', desc: 'Lectures by celebrated European university professors and maxillofacial specialists.', icon: 'Sparkles' },
      { title: 'Dental Trade & Technology Expo in Paris', desc: 'Direct exhibition showcasing groundbreaking lasers, biocompatible resins, and surgical motors.', icon: 'Users' }
    ],
    targetAudience: [
      'General Dentists & Dental Surgeons',
      'Orthodontists & Periodontists',
      'Prosthodontists & Implant Specialists',
      'Dental Hygienists & Dental Nurses',
      'Dental Lab Technicians & CAD/CAM Designers',
      'Clinic Owners & Dental Practice Managers'
    ],
    days: [
      {
        day: 'Day 1',
        dateLabel: 'Summit Day 1 • Digital & Surgery',
        theme: 'Digital Dentistry, Intraoral CAD/CAM & Guided Implantology',
        schedule: [
          { time: '08:30 - 09:15', session: 'Accreditation Badge Collection & Morning Espresso Bar', type: 'Welcome', room: 'Palais Atrium' },
          { time: '09:15 - 10:45', session: 'Opening Address: The 3D Digital Era in Restorative Dentistry', type: 'Keynote', room: 'Amphithéâtre Bleu' },
          { time: '11:00 - 13:00', session: 'Guided Implantology & Bone Grafting Clinical Masterclasses', type: 'Session', room: 'Salle Étoile I & II' },
          { time: '13:00 - 14:15', session: 'Exhibition Hall Luncheon & Live Intraoral Scanner Demos', type: 'Networking', room: 'Expo Hall' },
          { time: '14:15 - 16:30', session: 'Hands-on CAD/CAM Smile Design & Chairside Milling Lab', type: 'Workshop', room: 'Digital Simulation Lab' },
          { time: '17:00 - 19:30', session: 'European Dental Gala Reception & Networking Dinner in Paris', type: 'Social', room: 'Rooftop Grand Ballroom' }
        ]
      },
      {
        day: 'Day 2',
        dateLabel: 'Summit Day 2 • Restorative & Aesthetics',
        theme: 'Aesthetic Veneers, Minimally Invasive Lasers & Endodontics',
        schedule: [
          { time: '09:00 - 10:30', session: 'Minimally Invasive Laser Therapies & Periodontal Regeneration', type: 'Keynote', room: 'Amphithéâtre Bleu' },
          { time: '10:45 - 12:45', session: 'Endodontics & Bioceramic Obturation Clinical Track', type: 'Session', room: 'Salle Étoile I & II' },
          { time: '12:45 - 14:00', session: 'Poster Scientific Awards & European Dental Faculty Lunch', type: 'Awards', room: 'Expo Hall' },
          { time: '14:00 - 16:00', session: 'Full-Arch Restorative Solutions & Occlusal Rehabilitation Lab', type: 'Workshop', room: 'Digital Simulation Lab' },
          { time: '16:00 - 17:00', session: 'Awarding of CPD Certificates & Official Congress Adjournment', type: 'Closing', room: 'Amphithéâtre Bleu' }
        ]
      }
    ]
  }
}

const passTiers = [
  {
    id: 'Standard Delegate',
    title: 'Standard Delegate Pass',
    price: '$499',
    badge: 'Most Popular',
    isHero: true,
    desc: 'Complete full access to all keynote sessions, scientific breakout tracks, networking luncheons, and delegate kit.',
    features: ['Access to all 15-18 scientific tracks', 'Verified CPD / CME Certificate (30 Credits)', 'Full conference luncheon & coffee receptions', 'Conference delegate bag & badge kit', 'Live hybrid streaming backup access']
  },
  {
    id: 'Academic / Faculty',
    title: 'Academic & Faculty Pass',
    price: '$349',
    badge: 'University Subsidized',
    isHero: false,
    desc: 'Subsidized rate reserved for registered university researchers, hospital clinical fellows, and graduate students.',
    features: ['Full session & plenary hall access', 'Verified certificate of attendance', 'Digital abstract compendium', 'Delegate luncheon & networking mixers']
  },
  {
    id: 'Oral Presenter / Speaker',
    title: 'Oral Presenter & Speaker',
    price: '$599',
    badge: 'Faculty Stage',
    isHero: false,
    desc: 'Guaranteed 20-minute podium presentation slot in official agenda, abstract publication, and faculty lounge access.',
    features: ['Official 20-minute podium presentation slot', 'Peer-reviewed abstract publication', 'Official Faculty Presenter Plaque', 'Access to VIP faculty lounge & green room']
  },
  {
    id: 'Virtual Attendee',
    title: 'Global Virtual Pass',
    price: '$199',
    badge: '4K Broadcast',
    isHero: false,
    desc: 'Participate remotely from anywhere in the world with encrypted 4K multi-angle ballroom live stream & interactive Q&A.',
    features: ['Live 4K multi-camera ballroom broadcast', 'Interactive real-time audio & text Q&A', '90-day full encrypted session archive replay', 'Digital accredited CPD / CME Certificate']
  }
]

export default function ConferenceDetailsPage({
  conference,
  onBack,
  onHome,
  onNavigateToConference
}: {
  conference: Conference
  onBack: () => void
  onHome?: () => void
  onNavigateToConference?: (id: string) => void
}) {
  function handleBack() {
    if (onBack) {
      onBack()
    } else {
      window.history.pushState(null, '', '/conferences')
      window.dispatchEvent(new PopStateEvent('popstate'))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [org, setOrg] = useState('')
  const [ticketType, setTicketType] = useState('Standard Delegate')
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<{ kind: 'idle' | 'ok' | 'error' | 'info'; msg: string }>({ kind: 'idle', msg: '' })
  const [copied, setCopied] = useState(false)

  const rich = conferenceRichData[conference.id] || conferenceRichData['gnsc-2027']

  const categories = ['All', ...Array.from(new Set(rich.tracks.map((t) => t.category)))]

  const filteredTracks = rich.tracks
    .filter((t) => activeCategory === 'All' || t.category === activeCategory)
    .filter((t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.sessionFocus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [conference.id])

  function handleShare() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      return setStatus({ kind: 'error', msg: 'Full name and email are required.' })
    }

    if (!isSupabaseConfigured) {
      return setStatus({
        kind: 'info',
        msg: 'Supabase is not configured yet. Add your credentials in .env to save registrations.',
      })
    }

    setSubmitting(true)
    const res = await submitEventRegistration({
      event_id: conference.id,
      event_name: conference.title,
      full_name: name.trim(),
      email: email.trim(),
      organization: org.trim() || undefined,
      ticket_type: ticketType,
    })
    setSubmitting(false)

    if (res.success) {
      setStatus({
        kind: 'ok',
        msg: 'Registration confirmed! A confirmation email and delegate package will be sent to your inbox shortly.',
      })
      setName('')
      setEmail('')
      setOrg('')
    } else {
      setStatus({ kind: 'error', msg: res.error || 'Failed to submit registration. Please try again.' })
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-400 selection:text-navy-950 font-sans">
      {/* ── Top Header Bar ── */}
      <header className="sticky top-0 z-50 flex h-[72px] items-center justify-between border-b border-white/10 bg-navy-950/90 px-6 backdrop-blur-xl">
        <button
          onClick={handleBack}
          className="group flex items-center gap-2 text-xs sm:text-sm font-semibold text-white/80 transition hover:text-amber-300"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1 text-amber-400" />
          <span>Back to All Conferences</span>
        </button>

        <button
          onClick={onHome || handleBack}
          className="font-display text-xl sm:text-2xl font-black tracking-tight text-white hover:text-white/90 transition hidden sm:flex items-center"
        >
          ORIGIN<span className="text-amber-400"> Conferences</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="hidden sm:flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 text-xs text-white/80 hover:text-white hover:bg-white/5 transition"
          >
            <Share2 size={13} className="text-amber-400" />
            <span>{copied ? 'Link Copied!' : 'Share Congress'}</span>
          </button>
          <a
            href="#register-section"
            className="btn btn-gold text-xs py-2 px-5 font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition"
          >
            Register as Delegate
          </a>
        </div>
      </header>

      {/* ── Secondary Sticky Sub-Navbar ── */}
      <nav aria-label="Conference sub-navigation" className="sticky top-[72px] z-40 hidden md:block bg-navy-950/80 backdrop-blur-md border-b border-white/5 py-2.5">
        <div className="container-x flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-300">
            <a href="#overview" className="px-3.5 py-1.5 rounded-full hover:bg-white/5 hover:text-amber-300 transition">Overview</a>
            <a href="#tracks" className="px-3.5 py-1.5 rounded-full hover:bg-white/5 hover:text-amber-300 transition">Scientific Tracks ({rich.tracks.length})</a>
            <a href="#speakers" className="px-3.5 py-1.5 rounded-full hover:bg-white/5 hover:text-amber-300 transition">Keynote Faculty</a>
            <a href="#pricing" className="px-3.5 py-1.5 rounded-full hover:bg-white/5 hover:text-amber-300 transition">Delegate Passes</a>
            <a href="#venue" className="px-3.5 py-1.5 rounded-full hover:bg-white/5 hover:text-amber-300 transition">Venue &amp; Travel</a>
          </div>
          <span className="text-[11px] font-mono text-amber-400/90 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Registration Open • London / Hybrid
          </span>
        </div>
      </nav>

      {/* ── CINEMATIC SPLIT HERO SECTION ── */}
      <section className="relative overflow-hidden bg-navy-950 pt-16 pb-20 lg:pt-24 lg:pb-32">
        {/* Ambient Glowing Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={conference.image}
            alt={conference.title}
            className="h-full w-full object-cover opacity-20 filter blur-[2px] scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-navy-950/90 to-navy-950/80" />
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-600/25 blur-3xl" />
          <div className="absolute top-20 right-0 h-96 w-96 rounded-full bg-amber-500/15 blur-3xl" />
          <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-slate-950 to-transparent" />
        </div>

        <div className="container-x relative">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Column (7 cols): Title, Meta, and Actions */}
            <div className="lg:col-span-7">
              {/* Shimmer Pill Badge */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-amber-400/40 bg-gradient-to-r from-amber-400/20 via-amber-500/10 to-transparent px-4 py-1.5 text-xs font-bold text-amber-300 tracking-wide backdrop-blur-xl shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                <span className="uppercase text-[11px] font-mono">OFFICIAL 2027 WORLD CONGRESS</span>
                <span className="text-white/40">•</span>
                <span className="text-white/90">{conference.category}</span>
              </div>

              {/* Magnificent Title with Gradient Glow */}
              <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.1] text-white sm:text-6xl lg:text-6xl tracking-tight drop-shadow-md">
                {conference.title.split('(')[0]}
                <span className="block mt-2 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(245,158,11,0.4)]">
                  {conference.title.includes('(') ? `(${conference.title.split('(')[1]}` : ''}
                </span>
              </h1>

              {/* Tagline */}
              <p className="mt-6 text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl font-medium">
                {rich.tagline}
              </p>

              {/* 4 Interactive Glassmorphism Micro-Cards */}
              <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 max-w-2xl">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md shadow-sm hover:border-amber-400/40 transition">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <CalendarDays size={16} /> Date &amp; Status
                  </div>
                  <div className="mt-1 font-display text-sm font-bold text-white">{conference.date}</div>
                  <div className="text-[11px] text-slate-400">Early Delegate Pass Phase</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md shadow-sm hover:border-amber-400/40 transition">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <MapPin size={16} /> Venue &amp; City
                  </div>
                  <div className="mt-1 font-display text-sm font-bold text-white truncate">{conference.location}</div>
                  <div className="text-[11px] text-slate-400">In-Person &amp; 4K Live Broadcast</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md shadow-sm hover:border-amber-400/40 transition">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <Award size={16} /> Accreditation
                  </div>
                  <div className="mt-1 font-display text-sm font-bold text-white">30 Category-1 Credits</div>
                  <div className="text-[11px] text-slate-400">Verified CME / CPD Body</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md shadow-sm hover:border-amber-400/40 transition">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <Globe size={16} /> Global Attendance
                  </div>
                  <div className="mt-1 font-display text-sm font-bold text-white">500+ Delegates</div>
                  <div className="text-[11px] text-slate-400">Over 40 Nations Represented</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a
                  href="#register-section"
                  className="btn btn-gold text-sm font-extrabold px-8 py-4 shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.7)] flex items-center gap-2 rounded-full transform hover:scale-105 transition duration-300"
                >
                  <Ticket size={18} />
                  <span>Register as Delegate</span>
                </a>
                <a
                  href="#tracks"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-4 text-sm font-bold text-white hover:bg-white/15 hover:border-amber-400 transition"
                >
                  <Layers size={17} className="text-amber-400" />
                  <span>Explore {rich.tracks.length} Scientific Tracks</span>
                </a>
              </div>
            </div>

            {/* Right Column (5 cols): Glassmorphism Hero Showcase Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl border border-amber-400/30 bg-gradient-to-b from-slate-900/90 to-navy-950/95 p-6 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.8)]">
                {/* Visual Cover with glowing border */}
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10">
                  <img
                    src={conference.image}
                    alt={conference.title}
                    className="h-full w-full object-cover transition duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <div className="absolute top-3 left-3 rounded-full bg-navy-950/90 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-400/30 backdrop-blur-md">
                    2027 Official Edition
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <span className="font-bold flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Live Delegate Enrollment
                    </span>
                    <span className="text-amber-300 font-mono text-[11px]">CPD ACCREDITED</span>
                  </div>
                </div>

                {/* Keynote Preview Avatars */}
                <div className="mt-6 rounded-2xl bg-white/5 p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-3 overflow-hidden">
                      {rich.speakers.map((s, i) => (
                        <img
                          key={i}
                          src={s.image}
                          alt={s.name}
                          className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-900 object-cover object-top"
                        />
                      ))}
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-white">Keynote Faculty</div>
                      <div className="text-[10px] text-amber-400 font-semibold">Distinguished Professors</div>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                    Featuring lectures from {rich.speakers[0].name} and global clinical fellows across 40+ countries.
                  </p>
                </div>

                {/* Mini Metric Counter Bar */}
                <div className="mt-4 grid grid-cols-3 divide-x divide-white/10 rounded-2xl bg-slate-950/60 p-3.5 text-center border border-white/5">
                  <div>
                    <div className="font-display text-lg font-black text-amber-400">{rich.tracks.length}</div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Tracks</div>
                  </div>
                  <div>
                    <div className="font-display text-lg font-black text-white">2 Days</div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Sessions</div>
                  </div>
                  <div>
                    <div className="font-display text-lg font-black text-amber-400">30+</div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">CPD Hours</div>
                  </div>
                </div>

                {/* Direct CTA inside Hero Card */}
                <a
                  href="#pricing"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 py-3 text-xs font-black uppercase tracking-wider text-navy-950 shadow-lg hover:from-amber-300 hover:to-amber-400 transition"
                >
                  <span>Select Pass from $349</span>
                  <ChevronRight size={15} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── METRICS STRIP ── */}
      <section className="bg-slate-900/90 border-y border-white/10 py-10">
        <div className="container-x grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
          <div>
            <div className="font-display text-4xl font-black text-amber-400 drop-shadow">{rich.tracks.length}+</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-slate-300 font-bold">Scientific Tracks &amp; Sessions</div>
          </div>
          <div>
            <div className="font-display text-4xl font-black text-white drop-shadow">500+</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-slate-300 font-bold">Expected Global Delegates</div>
          </div>
          <div>
            <div className="font-display text-4xl font-black text-white drop-shadow">40+</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-slate-300 font-bold">Participating Countries</div>
          </div>
          <div>
            <div className="font-display text-4xl font-black text-amber-400 drop-shadow">30 CME</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-slate-300 font-bold">Accredited CPD Units</div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT LAYOUT ── */}
      <div className="container-x py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Main Column (8 cols) */}
          <main className="space-y-20 lg:col-span-8">
            {/* 1. OVERVIEW & CONGRESS VISION */}
            <section id="overview" className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-400">
                  <Sparkles size={16} /> Official Congress Overview &amp; Mandate
                </div>
                <span className="rounded-full bg-amber-400/15 px-3 py-1 text-[11px] font-mono font-bold text-amber-300 border border-amber-400/30">
                  {conference.id.toUpperCase()} • Accredited 2027 Edition
                </span>
              </div>

              <h2 className="mt-3 font-display text-3xl font-extrabold text-white sm:text-4xl">
                About the Congress
              </h2>
              <div className="mt-4 h-1 w-20 rounded-full bg-amber-400" />

              {/* Lead Highlighted Narrative Box */}
              <div className="mt-6 rounded-2xl bg-gradient-to-r from-amber-400/10 via-amber-500/5 to-transparent p-6 border-l-4 border-amber-400 border-y border-r border-white/10">
                <p className="text-base sm:text-lg leading-relaxed text-amber-200 font-medium">
                  {rich.about.leadIntro}
                </p>
              </div>

              {/* Full Multi-Paragraph Detailed Narrative from Doc */}
              <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-slate-200">
                {rich.about.fullDescription.map((paragraph, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Core Congress Objectives & Learning Pillars from Doc */}
              <div className="mt-10 rounded-2xl bg-slate-950/80 p-6 sm:p-8 border border-white/10">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-400">
                  <CheckCircle2 size={16} />
                  <span>{rich.about.corePillarsHeading}</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Core competencies, strategic methodologies, and academic agenda streams established in the official congress prospectus.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {rich.about.corePillars.map((p, i) => (
                    <div key={i} className="rounded-xl bg-slate-900/90 p-5 border border-white/5 hover:border-amber-400/30 transition">
                      <div className="flex items-center gap-2.5">
                        <span className="grid h-6 w-6 place-items-center rounded-lg bg-amber-400/20 text-xs font-black text-amber-400 font-mono">
                          0{i + 1}
                        </span>
                        <h4 className="font-display text-sm font-bold text-white">{p.title}</h4>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-slate-400">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4 Summit Experience Highlights */}
              <div className="mt-10">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-2 mb-4">
                  <Award size={16} /> Summit Format &amp; Delegate Experience
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {rich.highlights.map((h, i) => (
                    <div key={i} className="group rounded-2xl border border-white/5 bg-slate-950/70 p-5 transition-all duration-300 hover:border-amber-400/40 hover:bg-slate-950">
                      <div className="flex items-center gap-3">
                        <span className="grid h-8 w-8 place-items-center rounded-xl bg-amber-400/20 text-xs font-black text-amber-400 font-mono">
                          0{i + 1}
                        </span>
                        <h4 className="font-display text-sm font-bold text-white group-hover:text-amber-300 transition">
                          {h.title}
                        </h4>
                      </div>
                      <p className="mt-2.5 text-xs leading-relaxed text-slate-400 group-hover:text-slate-300 transition">
                        {h.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Callout Quote / Mission Banner from Doc */}
              {rich.about.callout && (
                <div className="mt-8 rounded-2xl bg-gradient-to-r from-amber-400/15 via-amber-500/10 to-transparent p-5 border border-amber-400/30 flex items-center gap-4">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400 text-navy-950 flex-shrink-0">
                    <Sparkles size={20} />
                  </div>
                  <p className="text-sm font-semibold text-amber-200 italic">
                    "{rich.about.callout}"
                  </p>
                </div>
              )}
            </section>

            {/* 2. OFFICIAL SCIENTIFIC TRACKS EXPLORER */}
            <section id="tracks" className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-400">
                    <Layers size={16} /> Academic Agenda Streams
                  </div>
                  <h2 className="mt-1 font-display text-3xl font-extrabold text-white sm:text-4xl">
                    Official Scientific Tracks ({rich.tracks.length})
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Explore individual session agenda streams and paper presentation categories.
                  </p>
                </div>

                {/* Instant Reactive Search */}
                <div className="relative w-full sm:w-72">
                  <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search session tracks..."
                    className="w-full rounded-full border border-white/15 bg-slate-950/90 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-400 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-inner"
                  />
                </div>
              </div>

              {/* Category Filter Chips */}
              <div className="mt-8 flex flex-wrap gap-2 pb-6 border-b border-white/10">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                      activeCategory === cat
                        ? 'bg-amber-400 text-navy-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                        : 'bg-slate-950/80 text-slate-300 hover:text-white border border-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grid of Interactive Tracks */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {filteredTracks.map((track) => (
                  <motion.div
                    key={track.id}
                    whileHover={{ scale: 1.015 }}
                    className="group rounded-2xl border border-white/10 bg-slate-950/80 p-5 transition-all duration-300 hover:border-amber-400/50 hover:bg-slate-950 shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-xs font-black text-amber-400/90 bg-amber-400/10 px-2.5 py-1 rounded-md">
                          TRACK #{track.id.toString().padStart(2, '0')}
                        </span>
                        <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold text-slate-300 border border-white/10">
                          {track.category}
                        </span>
                      </div>
                      <h4 className="font-display text-sm font-bold text-white group-hover:text-amber-300 transition leading-snug">
                        {track.title}
                      </h4>
                      <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                        {track.sessionFocus}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-amber-400 transition">
                      <span>Oral &amp; Poster Submissions</span>
                      <ChevronRight size={13} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredTracks.length === 0 && (
                <div className="mt-10 rounded-2xl bg-slate-950/60 p-8 text-center text-xs text-slate-400 border border-white/5">
                  No scientific tracks match "{searchTerm}". Try clearing your filter.
                </div>
              )}
            </section>

            {/* 3. KEYNOTE FACULTY SPOTLIGHT */}
            <section id="speakers" className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-400">
                <Users size={16} /> World-Class Speakers
              </div>
              <h2 className="mt-1 font-display text-3xl font-extrabold text-white sm:text-4xl">
                Featured Keynote Faculty
              </h2>
              <div className="mt-4 h-1 w-16 rounded-full bg-amber-400" />
              <p className="mt-4 text-xs sm:text-sm text-slate-300">
                Distinguished professors and healthcare authorities presenting visionary plenary lectures at this congress.
              </p>

              <div className="mt-8 grid gap-6 sm:grid-cols-3">
                {rich.speakers.map((s, idx) => (
                  <div
                    key={idx}
                    className="group rounded-2xl border border-white/10 bg-slate-950/80 p-5 transition-all duration-300 hover:border-amber-400/50 hover:bg-slate-950 shadow-lg flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-900">
                        <img
                          src={s.image}
                          alt={s.name}
                          className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                      </div>
                      <h4 className="mt-4 font-display text-base font-bold text-white group-hover:text-amber-300 transition">
                        {s.name}
                      </h4>
                      <p className="text-xs text-amber-400/90 font-medium">{s.role}</p>
                      <p className="mt-1 text-[11px] text-slate-400 flex items-center gap-1.5">
                        <Building2 size={12} className="flex-shrink-0 text-slate-500" />
                        <span className="truncate">{s.institution}</span>
                      </p>
                    </div>

                    <div className="mt-4 rounded-xl bg-white/5 p-3 border border-white/5">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">Keynote Lecture</span>
                      <p className="mt-1 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        "{s.topic}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. WHO SHOULD ATTEND */}
            <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-400">
                <UserCheck size={16} /> Target Delegation
              </div>
              <h2 className="mt-1 font-display text-3xl font-extrabold text-white sm:text-4xl">
                Who Should Attend
              </h2>
              <div className="mt-4 h-1 w-16 rounded-full bg-amber-400" />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {rich.targetAudience.map((aud, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-2xl bg-slate-950/80 p-4 border border-white/5">
                    <div className="grid h-7 w-7 place-items-center rounded-full bg-emerald-500/20 text-emerald-400 flex-shrink-0">
                      <Check size={14} strokeWidth={3} />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-200">{aud}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. DELEGATE PASSES & PRICING */}
            <section id="pricing" className="space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-400">Accredited Passes</p>
                <h3 className="font-display text-3xl font-extrabold text-white mt-1">Select Delegate Tier</h3>
                <p className="mt-1 text-xs text-slate-400">Choose your participation category. All registrations include verified CME/CPD credits.</p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {passTiers.map((tier) => {
                  const isSelected = ticketType === tier.id
                  return (
                    <div
                      key={tier.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setTicketType(tier.id)}
                      className={`cursor-pointer rounded-3xl p-7 transition-all duration-300 border flex flex-col justify-between ${
                        isSelected
                          ? 'bg-gradient-to-b from-slate-900 to-navy-950 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.3)] ring-2 ring-amber-400/50 scale-[1.02]'
                          : 'bg-slate-900/60 border-white/10 hover:border-white/30 hover:bg-slate-900/90'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                            tier.isHero ? 'bg-amber-400 text-navy-950 shadow' : 'bg-white/10 text-amber-300'
                          }`}>
                            {tier.badge}
                          </span>
                          <div className="font-display text-2xl font-black text-white">{tier.price}</div>
                        </div>

                        <h4 className="mt-4 font-display text-lg font-bold text-white">{tier.title}</h4>
                        <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">{tier.desc}</p>

                        <ul className="mt-6 space-y-2 border-t border-white/10 pt-4">
                          {tier.features.map((f, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                              <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        type="button"
                        className={`mt-6 w-full py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition ${
                          isSelected
                            ? 'bg-amber-400 text-navy-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        {isSelected ? '✓ Pass Selected' : 'Choose This Pass'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* 7. VENUE & TRAVEL LOGISTICS */}
            <section id="venue" className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-400">
                <MapPin size={16} /> Destination &amp; Logistics
              </div>
              <h2 className="mt-1 font-display text-3xl font-extrabold text-white sm:text-4xl">
                Venue &amp; Accommodation
              </h2>
              <div className="mt-4 h-1 w-16 rounded-full bg-amber-400" />

              <div className="mt-8 grid gap-6 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-950/80 p-5 border border-white/5">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Building2 size={16} /> Main Convention Hall
                  </div>
                  <div className="font-display text-sm font-bold text-white">{rich.venueName}</div>
                  <div className="text-xs text-slate-400 mt-1">{rich.venueCity}</div>
                </div>

                <div className="rounded-2xl bg-slate-950/80 p-5 border border-white/5">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Plane size={16} /> Nearest International Airports
                  </div>
                  <div className="font-display text-sm font-bold text-white">{rich.airport}</div>
                  <div className="text-xs text-slate-400 mt-1">Direct express metro &amp; taxi transit</div>
                </div>

                <div className="rounded-2xl bg-slate-950/80 p-5 border border-white/5">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Hotel size={16} /> Official Hotel Partner
                  </div>
                  <div className="font-display text-sm font-bold text-white">{rich.hotelPartner}</div>
                  <div className="text-xs text-slate-400 mt-1">Preferential rates for delegates</div>
                </div>
              </div>
            </section>
          </main>

          {/* Sticky Sidebar (4 cols) */}
          <aside className="space-y-8 lg:col-span-4">
            {/* Registration Card (Direct to Supabase) */}
            <div id="register-section" className="rounded-3xl bg-gradient-to-b from-navy-950 to-slate-950 p-8 text-white shadow-2xl sticky top-28 border border-amber-400/40 backdrop-blur-2xl">
              <span className="rounded-full bg-amber-400/20 px-3.5 py-1 text-[11px] font-bold text-amber-300 uppercase tracking-wider border border-amber-400/30">
                Official Delegate Portal
              </span>
              <h3 className="mt-4 font-display text-2xl font-black text-white">Reserve Your Pass</h3>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                Enroll as an in-person or 4K virtual hybrid attendee with instant Supabase confirmation.
              </p>

              {status.kind === 'ok' ? (
                <div className="my-8 rounded-2xl bg-emerald-950/50 p-6 text-center border border-emerald-500/40">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
                  <p className="mt-3 text-sm font-bold text-emerald-300">{status.msg}</p>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                      Full Name &amp; Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Dr. Jordan Hayes, MD"
                      className="mt-1.5 w-full rounded-xl border border-white/20 bg-slate-900/90 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                      Academic / Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jordan.hayes@institution.edu"
                      className="mt-1.5 w-full rounded-xl border border-white/20 bg-slate-900/90 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                      Hospital / Institution / University
                    </label>
                    <input
                      type="text"
                      value={org}
                      onChange={(e) => setOrg(e.target.value)}
                      placeholder="e.g. Royal London Hospital"
                      className="mt-1.5 w-full rounded-xl border border-white/20 bg-slate-900/90 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                      Selected Registration Tier
                    </label>
                    <select
                      value={ticketType}
                      onChange={(e) => setTicketType(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-white/20 bg-slate-900 px-4 py-2.5 text-sm text-white outline-none focus:border-amber-400"
                    >
                      <option value="Standard Delegate">Standard Delegate ($499)</option>
                      <option value="Academic / Faculty">Academic &amp; Faculty ($349)</option>
                      <option value="Oral Presenter / Speaker">Oral Presenter &amp; Speaker ($599)</option>
                      <option value="Virtual Attendee">Global Virtual Pass ($199)</option>
                    </select>
                  </div>

                  {status.kind === 'error' && (
                    <p className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded-lg border border-rose-800">
                      <AlertCircle size={14} />
                      {status.msg}
                    </p>
                  )}

                  {status.kind === 'info' && (
                    <p className="text-xs text-amber-300 bg-amber-950/40 p-2.5 rounded-lg border border-amber-800">
                      {status.msg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-gold w-full mt-3 text-sm font-extrabold py-3.5 shadow-[0_0_20px_rgba(245,158,11,0.4)] disabled:opacity-50"
                  >
                    {submitting ? 'Confirming...' : 'Confirm Registration'}
                  </button>
                  <p className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1 mt-2">
                    <ShieldCheck size={13} className="text-emerald-400" /> Saved securely in Supabase live database
                  </p>
                </form>
              )}
            </div>

            {/* Need Assistance Card */}
            <div className="rounded-3xl bg-slate-900/60 p-6 text-xs text-slate-300 border border-white/10">
              <h4 className="font-display font-bold text-sm text-white mb-2 flex items-center gap-2">
                <Mail size={15} className="text-amber-400" /> Need Delegate Assistance?
              </h4>
              <p className="leading-relaxed">
                For official visa support letters, group hospital delegations, or oral presenter inquiries, contact our conference desk:
              </p>
              <a
                href="mailto:info@your-domain.com"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:underline transition"
              >
                info@your-domain.com
              </a>
            </div>
          </aside>
        </div>
      </div>

      {/* ── EXPLORE OTHER PREMIER CONFERENCES SECTION ── */}
      <section className="bg-slate-950 border-t border-white/10 py-20">
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-400">Next Congresses</p>
              <h3 className="font-display text-3xl font-extrabold text-white">
                Explore Other Premier Summits
              </h3>
            </div>
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-white transition"
            >
              <span>Back to All Conferences</span>
              <ArrowLeft size={14} className="rotate-180 text-amber-400" />
            </button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 max-w-4xl">
            {conferences
              .filter((c) => c.id !== conference.id)
              .map((c) => (
                <div
                  key={c.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    if (onNavigateToConference) {
                      onNavigateToConference(c.id)
                    } else {
                      window.history.pushState(null, '', `/conference/${c.id}`)
                      window.dispatchEvent(new PopStateEvent('popstate'))
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      if (onNavigateToConference) onNavigateToConference(c.id)
                    }
                  }}
                  className="group cursor-pointer rounded-3xl bg-slate-900/80 p-6 shadow-xl border border-white/10 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-amber-400/50"
                >
                  <span className="rounded-full bg-amber-400/20 px-3 py-1 text-[11px] font-bold text-amber-300">
                    {c.category}
                  </span>
                  <h4 className="mt-4 font-display text-xl font-bold text-white group-hover:text-amber-300 transition leading-snug">
                    {c.title}
                  </h4>
                  <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                    <p className="flex items-center gap-2">
                      <CalendarDays size={14} className="text-amber-400" />
                      <span>{c.date}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin size={14} className="text-amber-400" />
                      <span>{c.location}</span>
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:text-white">
                    <span>Open Congress Page</span>
                    <span>→</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}
