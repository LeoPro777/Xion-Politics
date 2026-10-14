import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Building2,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Send,
  ArrowRight,
  MapPin,
  Vote,
  HeartHandshake,
  Newspaper,
  Calendar,
  Share2,
  ChevronRight,
  X,
  Menu,
  Megaphone,
  Search,
  Flame,
  Clock,
  ShieldCheck,
  Instagram,
  MessageCircle,
  ExternalLink
} from 'lucide-react';

export const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.11V9.4a6.33 6.33 0 0 0-.86-.06A6.34 6.34 0 0 0 3 15.68a6.34 6.34 0 0 0 10.82 4.49 6.3 6.3 0 0 0 1.86-4.5V8.55a8.28 8.28 0 0 0 4.91 1.6V6.69z" />
  </svg>
);

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

const Reveal: React.FC<RevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    if (isVisible) return 'opacity-100 translate-x-0 translate-y-0 scale-100';
    switch (direction) {
      case 'up':
        return 'opacity-0 translate-y-8';
      case 'down':
        return 'opacity-0 -translate-y-8';
      case 'left':
        return 'opacity-0 -translate-x-8';
      case 'right':
        return 'opacity-0 translate-x-8';
      case 'none':
        return 'opacity-0 scale-95';
      default:
        return 'opacity-0 translate-y-8';
    }
  };

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out will-change-[transform,opacity] ${getTransform()} ${className}`}
    >
      {children}
    </div>
  );
};

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  municipality: string;
  bio: string;
  imageUrl: string;
  instagram: string;
  tiktok: string;
  badge: string;
}

export const REGIONAL_TEAM: TeamMember[] = [
  {
    id: 'andres-robayo',
    name: 'Andrés Robayo',
    role: 'Coordinador Juvenil Regional',
    municipality: 'Zulia',
    bio: 'Abogado y dirigente juvenil. Conduce la vocería política de la juventud justiciera y la articulación con los 21 municipios del Estado.',
    imageUrl: '/images/liderazgo-4.jpeg',
    instagram: 'andresrobayo_pj',
    tiktok: 'andresrobayo_pj',
    badge: 'Coordinación Regional'
  },
  {
    id: 'daniel-rincon',
    name: 'Daniel Rincón',
    role: 'Coordinador Juvenil Regional Adjunto',
    municipality: 'Maracaibo',
    bio: 'Ingeniero y activista social. Encargado del despliegue operativo territorial, enlace con estructuras parroquiales y logística de calle.',
    imageUrl: '/images/liderazgo-1.jpeg',
    instagram: 'danielrincon_pj',
    tiktok: 'danielrincon_pj',
    badge: 'Dirección Operativa'
  },
  {
    id: 'maria-victoria',
    name: 'María Victoria González',
    role: 'Secretaría de Organización Juvenil',
    municipality: 'San Francisco',
    bio: 'Politóloga. Responsable de la conformación de los comités parroquiales, el censo militante y la activación de líderes comunitarios.',
    imageUrl: '/images/liderazgo-2.jpeg',
    instagram: 'mavi_gonzalezpj',
    tiktok: 'mavi_gonzalezpj',
    badge: 'Organización'
  },
  {
    id: 'carlos-villalobos',
    name: 'Carlos Villalobos',
    role: 'Secretaría de Defensa del Voto',
    municipality: 'Cabimas',
    bio: 'Estudiante de Derecho en LUZ. Coordinador del padrón electoral juvenil y la formación técnica de testigos de mesa en el Zulia.',
    imageUrl: '/images/liderazgo-3.jpeg',
    instagram: 'carlosv_zulia',
    tiktok: 'carlosv_zulia',
    badge: 'Electoral'
  },
  {
    id: 'stefany-camacho',
    name: 'Stefany Camacho',
    role: 'Secretaría de Acción Social',
    municipality: 'Lagunillas',
    bio: 'Médico comunitaria y voluntaria. Dirige las jornadas "Zulia Solidario", despistajes de salud y recuperación de canchas deportivas.',
    imageUrl: '/images/liderazgo-1.jpeg',
    instagram: 'stefy_camachopj',
    tiktok: 'stefy_camachopj',
    badge: 'Voluntariado'
  },
  {
    id: 'alejandro-morales',
    name: 'Alejandro Morales',
    role: 'Secretaría de Medios y Redes',
    municipality: 'Maracaibo',
    bio: 'Comunicador social y creador de contenido. Lidera las campañas audiovisuales, coberturas en vivo en TikTok e Instagram.',
    imageUrl: '/images/liderazgo-4.jpeg',
    instagram: 'alejomorales_pj',
    tiktok: 'jovenespjzulia',
    badge: 'Comunicaciones'
  }
];

interface NewsArticle {
  id: string;
  category: 'Electoral' | 'Voluntariado' | 'Formación' | 'Pronunciamiento';
  municipality: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  content: string[];
  imageUrl: string;
  department: string;
  isFeatured?: boolean;
}

const NEWS_DATA: NewsArticle[] = [
  {
    id: 'cne-parroquias-2026',
    category: 'Electoral',
    municipality: 'Maracaibo',
    date: '12 de Octubre, 2026',
    readTime: '3 min de lectura',
    title: 'Juventud PJ Zulia exige habilitación permanente de puntos CNE en las 109 parroquias',
    excerpt: 'Consignan pliego oficial ante la Oficina Regional Electoral demandando la descentralización de la inscripción y actualización del Registro Electoral para más de 140.000 nuevos electores zulianos.',
    content: [
      'La Coordinación Juvenil Regional de Primero Justicia en el Estado Zulia se movilizó este lunes de manera pacífica y contundente hacia la sede de la Oficina Regional Electoral (ORE) en Maracaibo.',
      'El equipo juvenil consignó un documento técnico avalado por delegados de los 21 municipios, señalando que los jóvenes de zonas alejadas como el Sur del Lago, La Guajira y la Costa Oriental enfrentan costos de transporte de más de $25 solo para movilizarse a formalizar su inscripción electoral.',
      '"No permitiremos que la burocracia asfixie la participación ciudadana de los jóvenes. Cada una de las 109 parroquias del Zulia tiene derecho a un punto con máquinas operativas y horario continuo", declaró el equipo de Organización Juvenil.'
    ],
    imageUrl: '/images/liderazgo-4.jpeg',
    department: 'Secretaría de Organización y Voto',
    isFeatured: true
  },
  {
    id: 'zulia-solidario-col',
    category: 'Voluntariado',
    municipality: 'Cabimas y Santa Rita',
    date: '8 de Octubre, 2026',
    readTime: '2 min de lectura',
    title: 'Despliegue "Zulia Solidario" recupera espacios deportivos y atiende a 350 familias en la COL',
    excerpt: 'Más de 60 brigadistas juveniles llevaron a cabo jornadas de acondicionamiento de luminarias, apoyo alimentario y torneos relámpago en sectores vulnerables de la Costa Oriental.',
    content: [
      'Con el firme compromiso de sembrar esperanza y solidaridad activa, las estructuras juveniles de Primero Justicia en Cabimas, Santa Rita y Lagunillas unieron esfuerzos en una mega-jornada comunitaria.',
      'Durante el operativo se logró la reactivación del alumbrado en dos canchas deportivas vecinales y se entregaron insumos escolares a niños del sector. Además, el voluntariado médico asistencial de la juventud brindó despistaje de salud general a abuelos de la comunidad.',
      'La meta establecida para este último trimestre es replicar este formato en al menos 15 parroquias adicionales de la cuenca del Lago de Maracaibo.'
    ],
    imageUrl: '/images/liderazgo-3.jpeg',
    department: 'Acción y Justicia Social'
  },
  {
    id: 'escuela-formacion-4ta',
    category: 'Formación',
    municipality: 'San Francisco',
    date: '2 de Octubre, 2026',
    readTime: '4 min de lectura',
    title: 'Culmina con éxito la IV Cohorte de la Escuela de Liderazgo y Políticas Públicas',
    excerpt: 'Setenta y cinco jóvenes obtuvieron su certificación en oratoria parlamentaria, negociación democrática y formulación de proyectos sociales para el desarrollo local.',
    content: [
      'El Centro de Estudios y Formación Política de Primero Justicia Zulia celebró el acto de grado de su cuarta cohorte del año 2026 en el auditorio municipal de San Francisco.',
      'Los graduandos expusieron proyectos de ordenanzas municipales enfocadas en primer empleo juvenil, digitalización de trámites vecinales y sustentabilidad ecológica para los municipios de la entidad.',
      '"Un partido político responsable forma servidores públicos de alto nivel técnico y profunda sensibilidad humana antes de aspirar a representaciones de poder", puntualizó la Secretaría de Formación.'
    ],
    imageUrl: '/images/liderazgo-2.jpeg',
    department: 'Instituto de Formación Política'
  },
  {
    id: 'pronunciamiento-servicios-sur-lago',
    category: 'Pronunciamiento',
    municipality: 'Colón y Pulgar',
    date: '28 de Septiembre, 2026',
    readTime: '3 min de lectura',
    title: 'Juventud justiciera alza la voz por la emergencia agroproductiva del Sur del Lago',
    excerpt: 'Denuncian pérdidas de cosechas por colapso en el suministro de combustible y deterioro de diques de contención en municipios productores.',
    content: [
      'Líderes juveniles de Colón, Francisco Javier Pulgar y Catatumbo realizaron una rueda de prensa conjunta para visibilizar el abandono sistemático que enfrentan los productores y jóvenes trabajadores del campo.',
      'Plantearon un plan de cinco puntos de reactivación que incluye créditos blandos a cooperativas juveniles campesinas y la refacción urgente del muro de contención del Río Chama.',
      'El documento de peticiones fue remitido a gremios de productores y asociaciones civiles del occidente del país.'
    ],
    imageUrl: '/images/liderazgo-1.jpeg',
    department: 'Coordinación Agraria y Regional'
  },
  {
    id: 'censo-tecnologico-sigo',
    category: 'Electoral',
    municipality: '21 Municipios',
    date: '20 de Septiembre, 2026',
    readTime: '2 min de lectura',
    title: 'Juventud PJ consolida red de coordinadores y testigos en centros de votación',
    excerpt: 'La red juvenil de defensa del voto completa la asignación y verificación de coordinadores en los 21 municipios del Estado Zulia.',
    content: [
      'La Secretaría Juvenil Regional superó la meta trimestral de captación, consolidando la red de defensores de la democracia más sólida del occidente del país.',
      'La organización ciudadana permite verificar la presencia de equipos en parroquias rurales y centros lacustres con un índice de respuesta récord.',
      'Los directivos estadales iniciaron la ronda de simulacros cívicos y articulación comunitaria con delegados juveniles de toda la región.'
    ],
    imageUrl: '/images/liderazgo-4.jpeg',
    department: 'Secretaría de Organización y Voto'
  }
];


export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Filtros y estado de noticias
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);

  // Estado del formulario de captación
  const [formData, setFormData] = useState({
    nombre_completo: '',
    telefono: '',
    email: '',
    municipio_texto: 'Maracaibo',
    tipo: 'VOLUNTARIO',
    area_interes: 'Liderazgo Juvenil',
    mensaje: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Estados responsivos móviles
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFloatingCta, setShowFloatingCta] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingCta(window.scrollY > 380);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const filteredNews = useMemo(() => {
    return NEWS_DATA.filter((item) => {
      const matchesCategory =
        selectedCategory === 'Todas' || item.category === selectedCategory;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.municipality.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const featuredNews = NEWS_DATA.find((n) => n.isFeatured) || NEWS_DATA[0];

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre_completo.trim() || !formData.telefono.trim()) {
      setErrorMsg('Por favor indica tu nombre completo y número de WhatsApp.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/leads/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('No se pudo procesar el registro.');
      }

      setSubmitted(true);
    } catch (err: any) {
      console.warn('Fallback local storage:', err);
      try {
        const existing = JSON.parse(localStorage.getItem('sigo_leads_offline') || '[]');
        existing.push({ ...formData, timestamp: new Date().toISOString() });
        localStorage.setItem('sigo_leads_offline', JSON.stringify(existing));
        setSubmitted(true);
      } catch (e) {
        setErrorMsg('Error temporal. Por favor contáctanos por WhatsApp al +58 412-1234567.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black selection:bg-pjYellow selection:text-black font-sans antialiased">
      {/* 1. TOP BAR OPERATIVO (Alto Contraste: Negro + Amarillo) */}
      <div className="bg-black text-white text-[11px] sm:text-xs py-2 px-3 sm:px-4 border-b border-black">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2.5">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pjYellow text-black font-black text-[9px] sm:text-[10px] tracking-wide uppercase shrink-0">
              <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-black fill-black" /> En Vivo
            </span>
            <span className="text-white/90 font-medium">
              <strong className="text-pjYellow font-bold">Zulia 2026:</strong> Movimiento Juvenil activo en los 21 municipios del Estado.
            </span>
          </div>

          {/* Enlaces directos a Redes Sociales oficiales */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs font-bold">
            <span className="text-[11px] text-neutral-400 hidden lg:inline">Conéctate:</span>
            <a
              href="https://instagram.com/jovenespjzulia"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-pjYellow transition-colors flex items-center gap-1 text-[11px]"
            >
              <Instagram className="w-3.5 h-3.5 text-pjYellow" />
              <span>@jovenespjzulia</span>
            </a>
            <a
              href="https://tiktok.com/@jovenespjzulia"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-pjYellow transition-colors flex items-center gap-1 text-[11px]"
            >
              <TikTokIcon className="w-3.5 h-3.5 text-pjYellow" />
              <span className="hidden xs:inline">TikTok</span>
            </a>
            <a
              href="https://wa.me/584121234567"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-emerald-400 transition-colors flex items-center gap-1 text-[11px]"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. NAVBAR (Blanco Puro + Borde y Botones Negros/Amarillos) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo Brand */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-pjYellow flex items-center justify-center font-black text-xl sm:text-2xl text-black border-2 border-black shadow-[2px_2px_0px_#000000] sm:shadow-[3px_3px_0px_#000000]">
              PJ
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2 leading-none">
                <span className="font-black text-base sm:text-xl tracking-tight text-black uppercase">
                  Primero Justicia
                </span>
                <span className="text-[9px] sm:text-[11px] bg-black text-pjYellow font-black px-1.5 sm:px-2 py-0.5 rounded shadow-sm">
                  ZULIA
                </span>
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-neutral-600 tracking-wider uppercase block">
                Secretaría Juvenil
              </span>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-bold text-neutral-800">
            <a href="#noticias" className="hover:text-black hover:underline underline-offset-4 transition">Noticias</a>
            <a href="#equipo" className="hover:text-black hover:underline underline-offset-4 transition">Conócenos</a>
            <a href="#redes" className="hover:text-black hover:underline underline-offset-4 transition flex items-center gap-1">
              <span>Redes</span>
              <span className="w-1.5 h-1.5 rounded-full bg-pjYellow" />
            </a>
            <a href="#pilares" className="hover:text-black hover:underline underline-offset-4 transition">Pilares</a>
            <a href="#municipios" className="hover:text-black hover:underline underline-offset-4 transition">21 Municipios</a>
            <a href="#sumate" className="text-black flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pjYellow/20 border border-pjYellow font-extrabold transition">
              <HeartHandshake className="w-4 h-4 text-black" />
              <span>Súmate</span>
            </a>
          </nav>

          {/* Action CTAs & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="#redes"
              className="hidden sm:flex border-2 border-black hover:bg-neutral-100 text-black px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition items-center gap-1.5 shadow-[2px_2px_0px_#000000]"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>@jovenespjzulia</span>
            </a>
            <a
              href="#sumate"
              className="bg-pjYellow hover:bg-pjYellowHover text-black border-2 border-black px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-black shadow-[2px_2px_0px_#000000] sm:shadow-[3px_3px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-1.5 sm:gap-2"
            >
              <span className="hidden xs:inline">¡Inscríbete Hoy!</span>
              <span className="xs:hidden">Unirme</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border-2 border-black bg-neutral-100 hover:bg-pjYellow text-black shadow-[2px_2px_0px_#000000] transition active:scale-95"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t-2 border-b-2 border-black bg-white px-4 py-4 space-y-3 shadow-lg">
            <nav className="flex flex-col gap-2 font-bold text-sm">
              <a
                href="#noticias"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-neutral-100 text-neutral-800 border border-neutral-200"
              >
                <Megaphone className="w-4 h-4 text-black" />
                <span>Noticias y Prensa Oficial</span>
              </a>
              <a
                href="#equipo"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl hover:bg-neutral-100 text-neutral-800 border border-neutral-200 flex items-center justify-between"
              >
                <span>Conócenos: Equipo Regional</span>
                <Users className="w-4 h-4 text-black" />
              </a>
              <a
                href="#redes"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-pjYellow/20 border border-pjYellow text-black font-extrabold flex items-center justify-between"
              >
                <span>Nuestras Redes (IG & TikTok)</span>
                <Instagram className="w-4 h-4 text-black" />
              </a>
              <a
                href="#pilares"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl hover:bg-neutral-100 text-neutral-800 border border-neutral-200"
              >
                Pilares Estratégicos
              </a>
              <a
                href="#municipios"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl hover:bg-neutral-100 text-neutral-800 border border-neutral-200"
              >
                21 Municipios del Zulia
              </a>
              <a
                href="#sumate"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-pjYellow text-black font-extrabold border-2 border-black shadow-[2px_2px_0px_#000000] flex items-center justify-between mt-1"
              >
                <span>¡Inscríbete en el Movimiento!</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </nav>
            <div className="pt-2 border-t border-neutral-200 flex justify-center gap-4 text-xs font-bold text-neutral-600">
              <a href="https://instagram.com/jovenespjzulia" target="_blank" rel="noopener noreferrer" className="hover:text-black flex items-center gap-1">
                <Instagram className="w-4 h-4 text-pjYellowHover" />
                <span>Instagram</span>
              </a>
              <a href="https://tiktok.com/@jovenespjzulia" target="_blank" rel="noopener noreferrer" className="hover:text-black flex items-center gap-1">
                <TikTokIcon className="w-4 h-4 text-black" />
                <span>TikTok</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* 3. HERO SECTION (Fondo Blanco, Tipografía Negra, Acentos Amarillos PJ) */}
      <section className="relative overflow-hidden pt-8 pb-14 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24 border-b border-neutral-200">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.04] pointer-events-none" />
        <div className="absolute -top-32 right-10 w-96 h-96 bg-pjYellow/25 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

            {/* Columna Izquierda: Headline & Métricas */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
              <Reveal direction="down">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-pjYellow border-2 border-black text-black text-[11px] sm:text-xs font-extrabold shadow-[2px_2px_0px_#000000]">
                  <Sparkles className="w-3.5 h-3.5 text-black" />
                  <span>La Fuerza del Movimiento Juvenil Zuliano</span>
                </div>
              </Reveal>

              <Reveal direction="up" delay={100}>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-black leading-[1.12] sm:leading-[1.08]">
                  Liderazgo, justicia y acción para <span className="bg-pjYellow px-2 py-0.5 rounded-md border-2 border-black shadow-[2px_2px_0px_#000000] sm:shadow-[3px_3px_0px_#000000] inline-block">transformar el Zulia</span>
                </h1>
              </Reveal>

              <Reveal direction="up" delay={180}>
                <p className="text-sm sm:text-base lg:text-lg text-neutral-700 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                  Somos la estructura juvenil organizada en las 109 parroquias del Estado Zulia. Formamos a las nuevas generaciones de líderes públicos, defendemos cada voto y construimos soluciones concretas en nuestras comunidades.
                </p>
              </Reveal>

              {/* CTAs Principales */}
              <Reveal direction="up" delay={240}>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1">
                  <a
                    href="#sumate"
                    className="bg-pjYellow hover:bg-pjYellowHover text-black font-black px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm border-2 border-black shadow-[3px_3px_0px_#000000] sm:shadow-[4px_4px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2"
                  >
                    <HeartHandshake className="w-4 h-4 text-black" />
                    <span>Unirme como Voluntario</span>
                  </a>
                  <a
                    href="#noticias"
                    className="bg-white hover:bg-neutral-50 text-black font-extrabold px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm border-2 border-black shadow-[2px_2px_0px_#000000] sm:shadow-[3px_3px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] transition-all flex items-center justify-center gap-2"
                  >
                    <Newspaper className="w-4 h-4 text-black" />
                    <span>Ver Sala de Prensa</span>
                  </a>
                </div>
              </Reveal>

              {/* Social Proof & Métricas Clave */}
              <Reveal direction="up" delay={300}>
                <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-6 border-t-2 border-neutral-100 max-w-lg mx-auto lg:mx-0">
                  <div className="bg-neutral-50 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-neutral-200">
                    <div className="text-xl sm:text-3xl font-black text-black">21</div>
                    <div className="text-[10px] sm:text-xs text-neutral-600 font-bold leading-tight mt-0.5">Municipios Activos</div>
                  </div>
                  <div className="bg-pjYellow/20 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border-2 border-pjYellow">
                    <div className="text-xl sm:text-3xl font-black text-black">100%</div>
                    <div className="text-[10px] sm:text-xs text-neutral-800 font-extrabold leading-tight mt-0.5">Cobertura Electoral</div>
                  </div>
                  <div className="bg-neutral-50 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-neutral-200">
                    <div className="text-xl sm:text-3xl font-black text-black">+1,500</div>
                    <div className="text-[10px] sm:text-xs text-neutral-600 font-bold leading-tight mt-0.5">Jóvenes Formados</div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Columna Derecha: Formulario de Ingesta Inmediata */}
            <div id="sumate" className="lg:col-span-5 scroll-mt-24">
              <Reveal direction="left" delay={200}>
                <div className="bg-white border-2 border-black rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-[5px_5px_0px_#000000] sm:shadow-[8px_8px_0px_#000000] relative">
                  <div className="flex items-center justify-between mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-neutral-200">
                    <div>
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-pjYellow text-black px-2 py-0.5 rounded border border-black inline-block mb-1">
                        Inscripción 2026
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-black">Súmate a la Red Juvenil</h3>
                      <p className="text-[11px] sm:text-xs text-neutral-500 font-medium">Forma parte de la juventud de Primero Justicia Zulia</p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-pjYellow border-2 border-black flex items-center justify-center text-black font-black shadow-[2px_2px_0px_#000000] shrink-0">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  </div>

                  {submitted ? (
                    <div className="py-6 sm:py-8 text-center space-y-4">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-pjYellow border-2 border-black rounded-2xl flex items-center justify-center mx-auto shadow-[3px_3px_0px_#000000]">
                        <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9 text-black" />
                      </div>
                      <h4 className="text-lg sm:text-xl font-black text-black">¡Registro Exitoso!</h4>
                      <p className="text-xs text-neutral-700 leading-relaxed max-w-xs mx-auto font-medium">
                        Tu registro ha sido enviado al coordinador juvenil de tu municipio. Nos pondremos en contacto contigo por WhatsApp en breve.
                      </p>
                      <button
                        onClick={() => setSubmitted(false)}
                        className="mt-3 bg-black text-white hover:bg-neutral-800 font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-sm"
                      >
                        Registrar a otro compañero
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitLead} className="space-y-3.5 sm:space-y-4">
                      {errorMsg && (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-300 text-xs text-red-700 font-bold">
                          {errorMsg}
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-black text-neutral-800 mb-1">
                          Nombre y Apellido *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.nombre_completo}
                          onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
                          placeholder="Ej: Daniel Rincón"
                          className="w-full min-h-[44px] bg-white border-2 border-black rounded-xl px-3.5 py-2.5 text-sm sm:text-xs text-black font-medium focus:outline-none focus:bg-yellow-50/50 focus:border-black transition"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-black text-neutral-800 mb-1">
                            WhatsApp / Teléfono *
                          </label>
                          <input
                            type="tel"
                            required
                            value={formData.telefono}
                            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                            placeholder="04121234567"
                            className="w-full min-h-[44px] bg-white border-2 border-black rounded-xl px-3.5 py-2.5 text-sm sm:text-xs text-black font-medium focus:outline-none focus:bg-yellow-50/50 transition"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-black text-neutral-800 mb-1">
                            Municipio *
                          </label>
                          <select
                            value={formData.municipio_texto}
                            onChange={(e) => setFormData({ ...formData, municipio_texto: e.target.value })}
                            className="w-full min-h-[44px] bg-white border-2 border-black rounded-xl px-3 py-2.5 text-sm sm:text-xs text-black font-bold focus:outline-none focus:bg-yellow-50/50 transition"
                          >
                            <option value="Maracaibo">Maracaibo</option>
                            <option value="San Francisco">San Francisco</option>
                            <option value="Cabimas">Cabimas</option>
                            <option value="Lagunillas">Lagunillas</option>
                            <option value="Mara">Mara</option>
                            <option value="Machiques de Perijá">Machiques</option>
                            <option value="Colón">Colón</option>
                            <option value="Miranda">Miranda</option>
                            <option value="Santa Rita">Santa Rita</option>
                            <option value="Rosario de Perijá">Rosario de Perijá</option>
                            <option value="La Cañada de Urdaneta">La Cañada</option>
                            <option value="Otro">Otro Municipio Zulia</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-black text-neutral-800 mb-1">
                          Área de Interés Principal
                        </label>
                        <select
                          value={formData.area_interes}
                          onChange={(e) => setFormData({ ...formData, area_interes: e.target.value })}
                          className="w-full min-h-[44px] bg-white border-2 border-black rounded-xl px-3 py-2.5 text-sm sm:text-xs text-black font-bold focus:outline-none focus:bg-yellow-50/50 transition"
                        >
                          <option value="Liderazgo Juvenil">Liderazgo & Formación Política</option>
                          <option value="Defensa del Voto">Defensa del Voto y Testigos</option>
                          <option value="Voluntariado Social">Voluntariado y Acción Social</option>
                          <option value="Comunicaciones">Comunicaciones, Redes y Prensa</option>
                          <option value="Escuela de Líderes">Escuela de Formación y Debate</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-black text-neutral-800 mb-1">
                          Correo Electrónico (Opcional)
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="tu.correo@ejemplo.com"
                          className="w-full min-h-[44px] bg-white border-2 border-black rounded-xl px-3.5 py-2.5 text-sm sm:text-xs text-black font-medium focus:outline-none focus:bg-yellow-50/50 transition"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full min-h-[46px] bg-pjYellow hover:bg-pjYellowHover text-black font-black py-3 rounded-xl text-xs sm:text-sm border-2 border-black shadow-[3px_3px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 active:scale-[0.99]"
                      >
                        <Send className="w-3.5 h-3.5 text-black" />
                        <span>{submitting ? 'Enviando...' : 'Completar Registro Oficial'}</span>
                      </button>

                      <p className="text-[10px] text-neutral-500 text-center font-medium pt-1">
                        Datos resguardados con estricta confidencialidad bajo los estatutos de PJ Zulia.
                      </p>
                    </form>
                  )}
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* 4. SECCIÓN DESTACADA: NOTICIAS Y COMUNICADOS OFICIALES (PIEZA CLAVE) */}
      <section id="noticias" className="py-14 sm:py-20 bg-neutral-50 border-b-2 border-black/10 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header de Sala de Prensa */}
          <Reveal direction="up">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 sm:mb-12">
              <div>
                <div className="inline-flex items-center gap-2 bg-black text-pjYellow font-black text-[10px] sm:text-xs uppercase px-3 py-1 rounded-full border border-black shadow-sm mb-3">
                  <Megaphone className="w-3.5 h-3.5 text-pjYellow" />
                  <span>Sala de Prensa & Comunicados Oficiales</span>
                </div>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight leading-tight">
                  Noticias de la <span className="underline decoration-pjYellow decoration-4 underline-offset-8">Juventud PJ Zulia</span>
                </h2>
                <p className="text-neutral-600 text-xs sm:text-sm lg:text-base mt-2 max-w-2xl font-medium">
                  Acciones de calle, pronunciamientos públicos, jornadas sociales y balances electorales de los 21 municipios del Estado.
                </p>
              </div>

              {/* Buscador & Indicador Verificado */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar noticias o municipios..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white border-2 border-black rounded-xl pl-10 pr-4 py-2.5 sm:py-2 text-xs font-semibold text-black placeholder-neutral-400 focus:outline-none focus:border-pjYellow shadow-[2px_2px_0px_#000000] w-full sm:w-64"
                  />
                </div>
                <div className="inline-flex items-center justify-center gap-1.5 bg-white border-2 border-black px-3 py-2 rounded-xl text-xs font-black text-black shadow-[2px_2px_0px_#000000]">
                  <ShieldCheck className="w-4 h-4 text-black fill-pjYellow shrink-0" />
                  <span>Boletín Verificado</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Categorías / Filtros (Horizontal swipe en móvil) */}
          <Reveal direction="up" delay={80}>
            <div className="flex items-center gap-2 mb-8 sm:mb-10 pb-2.5 overflow-x-auto no-scrollbar flex-nowrap sm:flex-wrap border-b border-neutral-200 -mx-4 px-4 sm:mx-0 sm:px-0">
              {['Todas', 'Electoral', 'Voluntariado', 'Formación', 'Pronunciamiento'].map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap shrink-0 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-black transition-all ${
                      active
                        ? 'bg-black text-pjYellow border-2 border-black shadow-[3px_3px_0px_#ffd200]'
                        : 'bg-white text-neutral-800 border-2 border-neutral-300 hover:border-black shadow-sm'
                    }`}
                  >
                    {cat === 'Todas' ? '📰 Todas las Noticias' : cat}
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* Noticia Principal (Lead Hero Story) */}
          {selectedCategory === 'Todas' && !searchQuery && (
            <div className="mb-10 sm:mb-14">
              <Reveal direction="up" delay={120}>
                <div className="bg-white border-2 border-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-[5px_5px_0px_#000000] sm:shadow-[8px_8px_0px_#000000] grid grid-cols-1 lg:grid-cols-12 group">
                  <div className="lg:col-span-7 relative h-56 sm:h-80 lg:h-auto overflow-hidden bg-black">
                    <img
                      src={featuredNews.imageUrl}
                      alt={featuredNews.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
                    />
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-wrap gap-2">
                      <span className="bg-pjYellow text-black font-black text-[10px] sm:text-xs uppercase px-2.5 sm:px-3 py-1 rounded-full border-2 border-black shadow-sm flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5" /> Titular Destacado
                      </span>
                      <span className="bg-black text-white font-black text-[10px] sm:text-xs uppercase px-2.5 sm:px-3 py-1 rounded-full border border-black shadow-sm">
                        {featuredNews.municipality}
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-5 sm:p-8 lg:p-10 flex flex-col justify-between bg-white">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center gap-3 text-[11px] sm:text-xs text-neutral-500 font-bold">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-black" />
                          {featuredNews.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-black" />
                          {featuredNews.readTime}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-black leading-tight group-hover:text-neutral-800 transition">
                        {featuredNews.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium">
                        {featuredNews.excerpt}
                      </p>
                    </div>

                    <div className="pt-5 mt-5 sm:pt-6 sm:mt-6 border-t border-neutral-200 flex items-center justify-between gap-2">
                      <span className="text-[10px] sm:text-xs font-black text-black bg-neutral-100 px-2.5 py-1 rounded-lg border border-neutral-300 truncate max-w-[170px]">
                        {featuredNews.department}
                      </span>

                      <button
                        onClick={() => setActiveArticle(featuredNews)}
                        className="bg-pjYellow hover:bg-pjYellowHover text-black font-black text-xs px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000000] flex items-center gap-1.5 transition active:scale-95 shrink-0"
                      >
                        <span>Leer Comunicado</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          )}

          {/* Grid de Artículos */}
          {filteredNews.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-neutral-300 rounded-3xl p-8 sm:p-12 text-center">
              <Newspaper className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <h4 className="text-lg font-black text-black">No se encontraron noticias</h4>
              <p className="text-xs text-neutral-500 mt-1">Prueba seleccionando otra categoría o borrando tu búsqueda.</p>
              <button
                onClick={() => { setSelectedCategory('Todas'); setSearchQuery(''); }}
                className="mt-4 bg-pjYellow text-black font-black text-xs px-4 py-2 rounded-xl border-2 border-black shadow-sm"
              >
                Restablecer Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredNews.map((article, idx) => (
                <Reveal key={article.id} delay={(idx % 3) * 120} direction="up">
                  <article
                    className="bg-white rounded-2xl sm:rounded-3xl border-2 border-black overflow-hidden shadow-[4px_4px_0px_#000000] sm:shadow-[5px_5px_0px_#000000] hover:shadow-[7px_7px_0px_#ffd200] hover:-translate-y-1 transition-all flex flex-col justify-between group h-full"
                  >
                    <div>
                      {/* Imagen & Tag */}
                      <div className="h-44 sm:h-52 bg-black relative overflow-hidden">
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                        />
                        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex gap-1.5 sm:gap-2">
                          <span className="bg-pjYellow text-black text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded-md border border-black shadow-sm">
                            {article.category}
                          </span>
                          <span className="bg-black text-white text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded-md border border-white/20">
                            {article.municipality}
                          </span>
                        </div>
                      </div>

                      {/* Contenido Card */}
                      <div className="p-4 sm:p-6">
                        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-neutral-500 font-bold mb-2">
                          <span>{article.date}</span>
                          <span>•</span>
                          <span>{article.readTime}</span>
                        </div>

                        <h4 className="text-base sm:text-lg font-black text-black leading-snug group-hover:underline underline-offset-4 decoration-pjYellow decoration-2 transition">
                          {article.title}
                        </h4>

                        <p className="text-xs text-neutral-600 mt-2.5 sm:mt-3 line-clamp-3 leading-relaxed font-medium">
                          {article.excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="p-4 sm:p-6 pt-0">
                      <div className="pt-3 sm:pt-4 border-t border-neutral-100 flex items-center justify-between gap-2">
                        <span className="text-[10px] sm:text-[11px] font-bold text-neutral-500 truncate max-w-[140px]">
                          {article.department}
                        </span>
                        <button
                          onClick={() => setActiveArticle(article)}
                          className="inline-flex items-center gap-1 text-xs font-black text-black bg-pjYellow/30 hover:bg-pjYellow px-3 py-1.5 rounded-lg border border-black transition shrink-0"
                        >
                          <span>Leer más</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}

          {/* Ticker / Banner Rápido de Última Hora */}
          <Reveal direction="up" delay={150}>
            <div className="mt-10 sm:mt-14 bg-black text-white border-2 border-black rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[4px_4px_0px_#ffd200]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-pjYellow flex items-center justify-center text-black font-black shrink-0">
                  <Megaphone className="w-5 h-5 text-black" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-center sm:text-left">
                  ¿Tienes una denuncia comunitaria o actividad en tu parroquia? Envía tu reporte directo a la Secretaría de Prensa.
                </p>
              </div>
              <a
                href="#sumate"
                className="w-full sm:w-auto text-center bg-pjYellow hover:bg-pjYellowHover text-black text-xs font-black px-4 py-2.5 rounded-xl shrink-0 transition"
              >
                Contactar Secretaría
              </a>
            </div>
          </Reveal>

        </div>
      </section>

      {/* 5. SECCIÓN CONÓCENOS: EQUIPO REGIONAL */}
      <section id="equipo" className="py-16 sm:py-24 bg-white border-b-2 border-black/10 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Reveal direction="up">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider bg-pjYellow text-black px-3 py-1 rounded-full border border-black shadow-sm inline-flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Estructura Regional de Conducción</span>
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight">
                Conoce a Nuestro <span className="underline decoration-pjYellow decoration-4 underline-offset-8">Equipo Regional</span>
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-neutral-600 font-medium leading-relaxed max-w-2xl mx-auto">
                Jóvenes líderes, profesionales y activistas que recorren las 109 parroquias del Zulia construyendo esperanza, defensa cívica y soluciones para el futuro.
              </p>
            </div>
          </Reveal>

          {/* Banner Fotográfico del Equipo en Acción (Imagen real del repositorio) */}
          <Reveal direction="up" delay={80}>
            <div className="mb-14 relative rounded-3xl border-2 border-black overflow-hidden shadow-[6px_6px_0px_#000000] sm:shadow-[8px_8px_0px_#000000] bg-black group">
              <div className="h-64 sm:h-96 w-full overflow-hidden relative">
                <img
                  src="/images/liderazgo-1.jpeg"
                  alt="Equipo Juvenil Regional PJ Zulia en el Lago"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
                  <div>
                    <span className="bg-pjYellow text-black text-[10px] sm:text-xs font-black uppercase px-2.5 py-1 rounded-md border border-black shadow-sm mb-2 inline-block">
                      Despliegue Lacustre 2026
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      Dirección Juvenil Regional en la Cuenca del Lago de Maracaibo
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-300 max-w-xl font-medium mt-1">
                      Unión, compromiso y trabajo de campo junto a pescadores, estudiantes y familias zulianas.
                    </p>
                  </div>
                  <a
                    href="#sumate"
                    className="bg-pjYellow hover:bg-pjYellowHover text-black text-xs font-black px-4 py-2.5 rounded-xl border border-black shadow-sm flex items-center justify-center gap-1.5 shrink-0 transition"
                  >
                    <span>Sumarme al Equipo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Grid de Perfiles de Integrantes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {REGIONAL_TEAM.map((member, idx) => (
              <Reveal key={member.id} delay={(idx % 3) * 120} direction="up">
                <div className="bg-white rounded-3xl border-2 border-black p-5 sm:p-6 shadow-[4px_4px_0px_#000000] sm:shadow-[5px_5px_0px_#000000] hover:shadow-[7px_7px_0px_#ffd200] hover:-translate-y-1 transition-all flex flex-col justify-between group h-full">
                  <div>
                    {/* Header: Foto / Avatar + Badge */}
                    <div className="flex items-start gap-3.5 mb-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-black bg-pjYellow shrink-0 shadow-[2px_2px_0px_#000000]">
                        <img
                          src={member.imageUrl}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded bg-pjYellow text-black border border-black inline-block mb-1">
                          {member.badge}
                        </span>
                        <h4 className="text-base sm:text-lg font-black text-black leading-tight truncate">
                          {member.name}
                        </h4>
                        <p className="text-xs font-bold text-neutral-600 mt-0.5 leading-snug">
                          {member.role}
                        </p>
                        <span className="text-[10px] text-neutral-500 font-medium flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-black" />
                          <span>{member.municipality}</span>
                        </span>
                      </div>
                    </div>

                    {/* Biografía / Enfoque */}
                    <p className="text-xs text-neutral-700 font-medium leading-relaxed mb-4 line-clamp-3">
                      {member.bio}
                    </p>
                  </div>

                  {/* Redes Sociales del Miembro */}
                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">
                      Redes Directas
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://instagram.com/${member.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-neutral-100 hover:bg-pjYellow text-black border border-black text-xs transition"
                        title={`Instagram @${member.instagram}`}
                      >
                        <Instagram className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`https://tiktok.com/@${member.tiktok}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-neutral-100 hover:bg-black hover:text-white text-black border border-black text-xs transition"
                        title={`TikTok @${member.tiktok}`}
                      >
                        <TikTokIcon className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

        </div>
      </section>

      {/* 6. SECCIÓN REDES SOCIALES: INSTAGRAM & TIKTOK */}
      <section id="redes" className="py-16 sm:py-24 bg-neutral-900 text-white border-b-2 border-black scroll-mt-16 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-pjYellow/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <Reveal direction="up">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider bg-pjYellow text-black px-3 py-1 rounded-full border border-black shadow-sm inline-flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                <span>Comunidad Digital & Activismo en Redes</span>
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Sigue el Movimiento en <span className="text-pjYellow">Instagram & TikTok</span>
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-neutral-300 font-medium leading-relaxed max-w-2xl mx-auto">
                Transmisiones en vivo, debates estudiantiles, coberturas de jornadas en las 109 parroquias y la voz de la juventud zuliana sin censura.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Tarjeta Instagram */}
            <Reveal direction="left" delay={100}>
              <div className="bg-black border-2 border-neutral-700 hover:border-pjYellow rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#ffd200] transition-all duration-300 flex flex-col justify-between h-full group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                        <Instagram className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-pink-400">Canal Oficial</span>
                        <h3 className="text-xl font-black text-white">Instagram Oficial</h3>
                      </div>
                    </div>
                    <span className="bg-white/10 text-white font-extrabold text-xs px-3 py-1 rounded-full border border-white/20">
                      @jovenespjzulia
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-300 font-medium leading-relaxed">
                    Fotos de nuestras actividades de calle, comunicados urgentes, infografías electorales y transmisiones en vivo desde los 21 municipios del Zulia.
                  </p>

                  <div className="bg-neutral-800/80 rounded-2xl p-4 border border-neutral-700 flex items-center justify-around text-center">
                    <div>
                      <div className="text-lg sm:text-xl font-black text-white">+18.5K</div>
                      <div className="text-[10px] text-neutral-400 font-bold">Seguidores Zulianos</div>
                    </div>
                    <div className="h-8 w-px bg-neutral-700" />
                    <div>
                      <div className="text-lg sm:text-xl font-black text-pjYellow">100%</div>
                      <div className="text-[10px] text-neutral-400 font-bold">Historias Diarias</div>
                    </div>
                    <div className="h-8 w-px bg-neutral-700" />
                    <div>
                      <div className="text-lg sm:text-xl font-black text-emerald-400">En Vivo</div>
                      <div className="text-[10px] text-neutral-400 font-bold">Coberturas CNE</div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs text-neutral-400 font-semibold">
                    Etiquétanos: <strong className="text-pjYellow">#JovenesPJZulia</strong>
                  </span>
                  <a
                    href="https://instagram.com/jovenespjzulia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 hover:opacity-90 text-white font-black text-xs px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition transform active:scale-95"
                  >
                    <span>Seguir en Instagram</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </Reveal>

            {/* Tarjeta TikTok */}
            <Reveal direction="right" delay={200}>
              <div className="bg-black border-2 border-neutral-700 hover:border-cyan-400 rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#00f2fe] transition-all duration-300 flex flex-col justify-between h-full group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-black border-2 border-cyan-400 flex items-center justify-center text-white shadow-[2px_2px_0px_#fe0979]">
                        <TikTokIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">Tendencias & Video</span>
                        <h3 className="text-xl font-black text-white">TikTok Juvenil</h3>
                      </div>
                    </div>
                    <span className="bg-white/10 text-white font-extrabold text-xs px-3 py-1 rounded-full border border-white/20">
                      @jovenespjzulia
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-300 font-medium leading-relaxed">
                    Videos dinámicos, clips de oratoria parlamentaria, recorridos por canchas comunitarias, datos rápidos de inscripción electoral y el lado humano de nuestro voluntariado.
                  </p>

                  <div className="bg-neutral-800/80 rounded-2xl p-4 border border-neutral-700 flex items-center justify-around text-center">
                    <div>
                      <div className="text-lg sm:text-xl font-black text-white">+32.0K</div>
                      <div className="text-[10px] text-neutral-400 font-bold">Comunidad TikTok</div>
                    </div>
                    <div className="h-8 w-px bg-neutral-700" />
                    <div>
                      <div className="text-lg sm:text-xl font-black text-cyan-400">+250K</div>
                      <div className="text-[10px] text-neutral-400 font-bold">Visualizaciones</div>
                    </div>
                    <div className="h-8 w-px bg-neutral-700" />
                    <div>
                      <div className="text-lg sm:text-xl font-black text-pink-500">Semanal</div>
                      <div className="text-[10px] text-neutral-400 font-bold">Nuevos Retos</div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs text-neutral-400 font-semibold">
                    Audio oficial: <strong className="text-cyan-400">Primero Justicia Zulia</strong>
                  </span>
                  <a
                    href="https://tiktok.com/@jovenespjzulia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-white hover:bg-neutral-100 text-black font-black text-xs px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition transform active:scale-95"
                  >
                    <span>Seguir en TikTok</span>
                    <ExternalLink className="w-3.5 h-3.5 text-black" />
                  </a>
                </div>
              </div>
            </Reveal>

          </div>

        </div>
      </section>

      {/* 7. PILARES ESTRATÉGICOS (Blanco, Negro y Amarillo) */}
      <section id="pilares" className="py-14 sm:py-20 bg-white border-b-2 border-black/10 scroll-mt-16">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal direction="up">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 space-y-2 sm:space-y-3">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider bg-pjYellow text-black px-3 py-1 rounded-full border border-black shadow-sm">
                Doctrina & Acción
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-black">
                Nuestros Tres Pilares de Liderazgo
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 font-medium">
                Estructura permanente para garantizar la formación ciudadana, la labor social y la defensa democrática de los votos zulianos.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Pilar 1 */}
            <Reveal direction="up" delay={100}>
              <div className="bg-white border-2 border-black p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-[4px_4px_0px_#000000] sm:shadow-[5px_5px_0px_#000000] hover:shadow-[7px_7px_0px_#ffd200] hover:-translate-y-1 transition-all h-full">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-pjYellow border-2 border-black flex items-center justify-center text-black mb-5 sm:mb-6 shadow-[2px_2px_0px_#000000]">
                  <BookOpen className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-black mb-2">Escuela de Formación</h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                  Cursos intensivos en doctrina centrohumanista, diseño de políticas públicas, técnicas de debate, oratoria y gestión presupuestaria municipal.
                </p>
              </div>
            </Reveal>

            {/* Pilar 2 */}
            <Reveal direction="up" delay={200}>
              <div className="bg-white border-2 border-black p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-[4px_4px_0px_#000000] sm:shadow-[5px_5px_0px_#000000] hover:shadow-[7px_7px_0px_#ffd200] hover:-translate-y-1 transition-all h-full">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-black border-2 border-black flex items-center justify-center text-pjYellow mb-5 sm:mb-6 shadow-[2px_2px_0px_#000000]">
                  <Building2 className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-black mb-2">Red en los 21 Municipios</h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                  Comités juveniles formalmente constituidos en cada una de las 109 parroquias del Zulia, coordinando asambleas de vecinos y diagnósticos comunitarios.
                </p>
              </div>
            </Reveal>

            {/* Pilar 3 */}
            <Reveal direction="up" delay={300}>
              <div className="bg-white border-2 border-black p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-[4px_4px_0px_#000000] sm:shadow-[5px_5px_0px_#000000] hover:shadow-[7px_7px_0px_#ffd200] hover:-translate-y-1 transition-all h-full">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-pjYellow border-2 border-black flex items-center justify-center text-black mb-5 sm:mb-6 shadow-[2px_2px_0px_#000000]">
                  <Vote className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-black mb-2">Defensa Electoral y Voto</h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                  Padrón auditado de testigos electorales, coordinadores de centro de votación y observadores para blindar la voluntad ciudadana en las urnas.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 6. COBERTURA TERRITORIAL & PLATAFORMA SIGO */}
      <section id="municipios" className="py-14 sm:py-20 bg-neutral-50 border-b-2 border-black/10 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">

            <Reveal direction="up">
              <div className="space-y-5 sm:space-y-6">
                <span className="text-[10px] sm:text-xs font-black text-black bg-pjYellow px-3 py-1 rounded-full border border-black uppercase tracking-wider">
                  Despliegue Territorial
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-black leading-tight">
                  El Zulia conectado de Norte a Sur
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium">
                  El sistema SIGO-PJ Zulia audita en tiempo real la operatividad de los 21 municipios del Estado. Cada subregión cuenta con voceros juveniles electos trabajando en soluciones locales.
                </p>

                <div className="space-y-2.5 sm:space-y-3">
                  {[
                    { region: 'Subregión Metropolitana', muns: 'Maracaibo, San Francisco' },
                    { region: 'Costa Oriental del Lago', muns: 'Cabimas, Lagunillas, Miranda, Santa Rita, Simón Bolívar, Valmore Rodríguez, Baralt' },
                    { region: 'Eje Perijá', muns: 'Machiques de Perijá, Rosario de Perijá' },
                    { region: 'Sur del Lago', muns: 'Colón, Francisco Javier Pulgar, Catatumbo, Sucre, Jesús María Semprún' },
                    { region: 'Subregión Guajira', muns: 'Mara, Guajira, Almirante Padilla' },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white border-2 border-black p-3.5 sm:p-4 rounded-xl sm:rounded-2xl flex items-start gap-3 shadow-[2px_2px_0px_#000000] sm:shadow-[3px_3px_0px_#000000]"
                    >
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-pjYellow border border-black flex items-center justify-center text-black shrink-0 mt-0.5 font-bold">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-black uppercase">{item.region}</h4>
                        <p className="text-[11px] sm:text-xs text-neutral-600 font-medium mt-0.5 leading-relaxed">{item.muns}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Tarjeta Fotográfica de Acción Comunitaria (Imagen del repositorio) */}
            <Reveal direction="up" delay={200}>
              <div className="bg-black text-white border-2 border-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-[5px_5px_0px_#ffd200] sm:shadow-[8px_8px_0px_#ffd200] group">
                <div className="h-56 sm:h-64 overflow-hidden relative">
                  <img
                    src="/images/liderazgo-3.jpeg"
                    alt="Brazaletes Jóvenes PJ Zulia"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-pjYellow text-black font-black text-[10px] uppercase px-2.5 py-0.5 rounded border border-black shadow-sm">
                      Solidaridad y Acción
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-pjYellow">
                      Militancia Activa 2026
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      Unidad y Presencia en Cada Parroquia
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-medium">
                    Nuestra mayor fortaleza es la cercanía con la gente. Cada brazalete representa un líder juvenil comprometido en recuperar espacios, defender los votos y construir el Zulia de progreso.
                  </p>

                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <a
                      href="#sumate"
                      className="w-full sm:w-auto bg-pjYellow hover:bg-pjYellowHover text-black font-black px-5 py-3 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md active:scale-95"
                    >
                      <HeartHandshake className="w-4 h-4 text-black" />
                      <span>Unirme a mi Parroquia</span>
                    </a>
                    <a
                      href="#equipo"
                      className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-extrabold px-4 py-3 rounded-xl text-xs transition text-center"
                    >
                      Conocer al Equipo
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* 8. MODAL DE LECTURA DE NOTICIAS COMPLETA */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white border-2 border-black rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto p-5 sm:p-8 shadow-[6px_6px_0px_#000000] sm:shadow-[10px_10px_0px_#000000] relative">
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-neutral-100 hover:bg-black hover:text-white border border-black flex items-center justify-center transition"
              aria-label="Cerrar modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Badge & Metadata */}
            <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4 pr-8">
              <span className="bg-pjYellow text-black text-[10px] sm:text-xs font-black uppercase px-2.5 py-0.5 rounded border border-black">
                {activeArticle.category}
              </span>
              <span className="bg-black text-white text-[10px] sm:text-xs font-black uppercase px-2.5 py-0.5 rounded">
                {activeArticle.municipality}
              </span>
              <span className="text-[11px] sm:text-xs text-neutral-500 font-bold ml-auto">
                {activeArticle.date}
              </span>
            </div>

            <h3 className="text-lg sm:text-2xl font-black text-black leading-tight mb-4">
              {activeArticle.title}
            </h3>

            {/* Imagen del modal */}
            <div className="h-48 sm:h-72 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-black mb-5 sm:mb-6 bg-black">
              <img
                src={activeArticle.imageUrl}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Párrafos del artículo */}
            <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed font-medium">
              {activeArticle.content.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Pie del modal */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t-2 border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="text-xs font-bold text-neutral-500">
                Emitido por: <strong className="text-black">{activeArticle.department}</strong>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    alert('Enlace copiado al portapapeles');
                  }}
                  className="flex-1 sm:flex-none justify-center bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-bold px-3 py-2 rounded-xl border border-neutral-300 flex items-center gap-1.5 transition"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Compartir</span>
                </button>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="flex-1 sm:flex-none justify-center bg-pjYellow hover:bg-pjYellowHover text-black text-xs font-black px-4 py-2 rounded-xl border-2 border-black transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. BOTÓN FLOTANTE MÓVIL (CTA RÁPIDO AL HACER SCROLL) */}
      {showFloatingCta && (
        <div className="fixed bottom-3 inset-x-3 z-40 md:hidden flex items-center justify-between gap-3 p-2.5 bg-black/95 backdrop-blur-md border-2 border-pjYellow rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.35)] animate-fadeIn">
          <div className="flex items-center gap-2 pl-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pjYellow animate-pulse" />
            <span className="text-[11px] font-black uppercase text-white tracking-wide">
              Juventud <strong className="text-pjYellow">PJ Zulia</strong>
            </span>
          </div>
          <a
            href="#sumate"
            className="bg-pjYellow hover:bg-pjYellowHover text-black font-black text-xs px-4 py-2 rounded-xl border border-black shadow-sm flex items-center gap-1.5 active:scale-95 transition"
          >
            <span>¡Súmate Hoy!</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* 10. FOOTER INSTITUCIONAL (Negro Profundo, Acentos Amarillos, Tipografía Nítida) */}
      <footer className="bg-black text-neutral-400 border-t-2 border-black py-10 sm:py-12 text-xs pb-20 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 sm:pb-8 border-b border-neutral-800 text-center md:text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pjYellow flex items-center justify-center font-black text-black text-lg border border-black shadow-sm shrink-0">
                PJ
              </div>
              <div>
                <h4 className="text-white font-black text-sm uppercase">Primero Justicia Zulia</h4>
                <p className="text-[11px] text-neutral-400">Secretaría Juvenil Regional · Órgano de Dirección Política</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold">
              <a href="#noticias" className="text-white hover:text-pjYellow transition">Noticias</a>
              <a href="#equipo" className="text-white hover:text-pjYellow transition">Conócenos</a>
              <a href="#redes" className="text-white hover:text-pjYellow transition">Redes Sociales</a>
              <a href="#pilares" className="text-white hover:text-pjYellow transition">Pilares</a>
              <a href="#municipios" className="text-white hover:text-pjYellow transition">Municipios</a>
              <a href="#sumate" className="text-pjYellow hover:underline transition">Inscripciones</a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            {/* Redes Sociales oficiales en el footer */}
            <div className="flex items-center gap-3">
              <span className="text-neutral-500 font-bold text-[11px]">Canales Oficiales:</span>
              <a
                href="https://instagram.com/jovenespjzulia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-pjYellow transition flex items-center gap-1 text-[11px]"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram</span>
              </a>
              <a
                href="https://tiktok.com/@jovenespjzulia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-pjYellow transition flex items-center gap-1 text-[11px]"
              >
                <TikTokIcon className="w-3.5 h-3.5" />
                <span>TikTok</span>
              </a>
              <a
                href="https://wa.me/584121234567"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-emerald-400 transition flex items-center gap-1 text-[11px]"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Copyright con acceso interno sigiloso/desapercibido */}
            <div className="text-neutral-500 text-center sm:text-right text-[11px]">
              <span>© 2026 Primero Justicia Zulia. Juventud con Futuro.</span>
              <button
                onClick={() => navigate('/login')}
                className="text-neutral-800 hover:text-neutral-600 transition-colors ml-2 text-[10px] cursor-default"
                title="Portal"
              >
                ·
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

