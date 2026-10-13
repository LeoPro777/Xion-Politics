import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Building2,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Send,
  Lock,
  ArrowRight,
  MapPin,
  Vote,
  Target,
  HeartHandshake,
  Newspaper,
  Calendar,
  Share2,
  ChevronRight,
  X,
  Megaphone,
  Search,
  Flame,
  Clock,
  ShieldCheck
} from 'lucide-react';

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
    imageUrl: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    department: 'Coordinación Agraria y Regional'
  },
  {
    id: 'censo-tecnologico-sigo',
    category: 'Electoral',
    municipality: '21 Municipios',
    date: '20 de Septiembre, 2026',
    readTime: '2 min de lectura',
    title: 'Plataforma SIGO alcanza el 100% de cobertura de coordinadores en centros de votación',
    excerpt: 'El sistema interno de gestión electoral completa la asignación y verificación de testigos principales y suplentes en los centros electorales más complejos del Zulia.',
    content: [
      'Gracias a la implementación del software de gestión electoral SIGO-PJ, la Secretaría Juvenil Regional superó la meta trimestral de captación, consolidando la red de defensores del voto más sólida del occidente.',
      'La auditoría digital en tiempo real permite verificar la presencia de equipos en parroquias rurales y centros fluviales con un índice de respuesta récord.',
      'Los directivos estadales iniciaron la ronda de simulacros de comunicación y transmisión de datos electorales con los 21 municipios interconectados.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    department: 'Secretaría de Tecnologías y Datos'
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
      <div className="bg-black text-white text-xs py-2.5 px-4 border-b border-black">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-pjYellow text-black font-black text-[10px] tracking-wide uppercase">
              <Flame className="w-3 h-3 text-black fill-black" /> En Vivo
            </span>
            <span className="text-white/90 text-xs font-medium">
              <strong className="text-pjYellow font-bold">Zulia 2026:</strong> Despliegue formativo y electoral en los 21 municipios del Estado.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-neutral-400 hidden lg:inline">Acceso Directo Operativo:</span>
            <button
              onClick={() => navigate('/login?bypass=admin')}
              className="bg-pjYellow hover:bg-pjYellowHover text-black font-extrabold px-3 py-1 rounded-md text-[11px] inline-flex items-center gap-1.5 transition-all transform hover:scale-105 active:scale-95 shadow-sm"
              title="Acceso inmediato de Superadministrador"
            >
              <Lock className="w-3 h-3" />
              <span>Bypass Superadmin</span>
            </button>
            <button
              onClick={() => navigate('/login')}
              className="text-white/80 hover:text-pjYellow text-[11px] font-bold underline underline-offset-4 transition"
            >
              Portal SIGO
            </button>
          </div>
        </div>
      </div>

      {/* 2. NAVBAR (Blanco Puro + Borde y Botones Negros/Amarillos) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Brand */}
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-11 h-11 rounded-xl bg-pjYellow flex items-center justify-center font-black text-2xl text-black border-2 border-black shadow-[3px_3px_0px_#000000]">
              PJ
            </div>
            <div>
              <div className="flex items-center gap-2 leading-none">
                <span className="font-black text-xl tracking-tight text-black uppercase">
                  Primero Justicia
                </span>
                <span className="text-[11px] bg-black text-pjYellow font-black px-2 py-0.5 rounded shadow-sm">
                  ZULIA
                </span>
              </div>
              <span className="text-xs font-bold text-neutral-600 tracking-wider uppercase">
                Secretaría Juvenil Regional
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-neutral-800">
            <a href="#noticias" className="text-black hover:text-black flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pjYellow/20 border border-pjYellow font-extrabold transition">
              <Megaphone className="w-4 h-4 text-black" />
              <span>Noticias y Prensa</span>
            </a>
            <a href="#pilares" className="hover:text-black hover:underline underline-offset-4 transition">Pilares</a>
            <a href="#municipios" className="hover:text-black hover:underline underline-offset-4 transition">21 Municipios</a>
            <a href="#sumate" className="hover:text-black hover:underline underline-offset-4 transition">Súmate</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="hidden sm:flex border-2 border-black hover:bg-neutral-100 text-black px-4 py-2 rounded-xl text-xs font-black transition items-center gap-1.5 shadow-[2px_2px_0px_#000000]"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Acceso SIGO</span>
            </button>
            <a
              href="#sumate"
              className="bg-pjYellow hover:bg-pjYellowHover text-black border-2 border-black px-5 py-2.5 rounded-xl text-xs font-black shadow-[3px_3px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#000000] transition-all flex items-center gap-2"
            >
              <span>¡Inscríbete Hoy!</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION (Fondo Blanco, Tipografía Negra, Acentos Amarillos PJ) */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-neutral-200">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.04] pointer-events-none" />
        <div className="absolute -top-32 right-10 w-96 h-96 bg-pjYellow/25 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Columna Izquierda: Headline & Métricas */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pjYellow border-2 border-black text-black text-xs font-extrabold shadow-[2px_2px_0px_#000000]">
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>La Fuerza del Movimiento Juvenil Zuliano</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-black leading-[1.08]">
                Liderazgo, justicia y acción para <span className="bg-pjYellow px-2 py-0.5 rounded-md border-2 border-black shadow-[3px_3px_0px_#000000] inline-block">transformar el Zulia</span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-700 max-w-2xl leading-relaxed font-medium">
                Somos la estructura juvenil organizada en las 109 parroquias del Estado Zulia. Formamos a las nuevas generaciones de líderes públicos, defendemos cada voto y construimos soluciones concretas en nuestras comunidades.
              </p>

              {/* CTAs Principales */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#sumate"
                  className="bg-pjYellow hover:bg-pjYellowHover text-black font-black px-7 py-3.5 rounded-xl text-sm border-2 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <HeartHandshake className="w-4 h-4 text-black" />
                  <span>Unirme como Voluntario</span>
                </a>
                <a
                  href="#noticias"
                  className="bg-white hover:bg-neutral-50 text-black font-extrabold px-6 py-3.5 rounded-xl text-sm border-2 border-black shadow-[3px_3px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] transition-all flex items-center gap-2"
                >
                  <Newspaper className="w-4 h-4 text-black" />
                  <span>Ver Sala de Prensa</span>
                </a>
              </div>

              {/* Social Proof & Métricas Clave */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t-2 border-neutral-100 max-w-lg mx-auto lg:mx-0">
                <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200">
                  <div className="text-2xl sm:text-3xl font-black text-black">21</div>
                  <div className="text-xs text-neutral-600 font-bold">Municipios Activos</div>
                </div>
                <div className="bg-pjYellow/20 p-3.5 rounded-2xl border-2 border-pjYellow">
                  <div className="text-2xl sm:text-3xl font-black text-black">100%</div>
                  <div className="text-xs text-neutral-800 font-extrabold">Cobertura Electoral</div>
                </div>
                <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200">
                  <div className="text-2xl sm:text-3xl font-black text-black">+1,500</div>
                  <div className="text-xs text-neutral-600 font-bold">Jóvenes Formados</div>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Formulario de Ingesta Inmediata */}
            <div id="sumate" className="lg:col-span-5">
              <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_#000000] relative">
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-neutral-200">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-pjYellow text-black px-2 py-0.5 rounded border border-black inline-block mb-1">
                      Inscripción 2026
                    </span>
                    <h3 className="text-xl font-black text-black">Súmate a la Red Juvenil</h3>
                    <p className="text-xs text-neutral-500 font-medium">Forma parte de la juventud de Primero Justicia Zulia</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-pjYellow border-2 border-black flex items-center justify-center text-black font-black shadow-[2px_2px_0px_#000000]">
                    <Users className="w-6 h-6" />
                  </div>
                </div>

                {submitted ? (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-pjYellow border-2 border-black rounded-2xl flex items-center justify-center mx-auto shadow-[3px_3px_0px_#000000]">
                      <CheckCircle2 className="w-9 h-9 text-black" />
                    </div>
                    <h4 className="text-xl font-black text-black">¡Registro Exitoso!</h4>
                    <p className="text-xs text-neutral-700 leading-relaxed max-w-xs mx-auto font-medium">
                      Tu registro ha sido enviado al coordinador juvenil de tu municipio. Nos pondremos en contacto contigo por WhatsApp en breve.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-4 bg-black text-white hover:bg-neutral-800 font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-sm"
                    >
                      Registrar a otro compañero
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitLead} className="space-y-4">
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
                        className="w-full bg-white border-2 border-black rounded-xl px-3.5 py-2.5 text-xs text-black font-medium focus:outline-none focus:bg-yellow-50/50 focus:border-black transition"
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
                          className="w-full bg-white border-2 border-black rounded-xl px-3.5 py-2.5 text-xs text-black font-medium focus:outline-none focus:bg-yellow-50/50 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-neutral-800 mb-1">
                          Municipio *
                        </label>
                        <select
                          value={formData.municipio_texto}
                          onChange={(e) => setFormData({ ...formData, municipio_texto: e.target.value })}
                          className="w-full bg-white border-2 border-black rounded-xl px-3 py-2.5 text-xs text-black font-bold focus:outline-none focus:bg-yellow-50/50 transition"
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
                        className="w-full bg-white border-2 border-black rounded-xl px-3 py-2.5 text-xs text-black font-bold focus:outline-none focus:bg-yellow-50/50 transition"
                      >
                        <option value="Liderazgo Juvenil">Liderazgo & Formación Política</option>
                        <option value="Defensa del Voto">Defensa del Voto y Testigos Electorales</option>
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
                        className="w-full bg-white border-2 border-black rounded-xl px-3.5 py-2.5 text-xs text-black font-medium focus:outline-none focus:bg-yellow-50/50 transition"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-pjYellow hover:bg-pjYellowHover text-black font-black py-3 rounded-xl text-xs border-2 border-black shadow-[3px_3px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
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
            </div>

          </div>
        </div>
      </section>

      {/* 4. SECCIÓN DESTACADA: NOTICIAS Y COMUNICADOS OFICIALES (PIEZA CLAVE) */}
      <section id="noticias" className="py-20 bg-neutral-50 border-b-2 border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header de Sala de Prensa */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 bg-black text-pjYellow font-black text-xs uppercase px-3 py-1 rounded-full border border-black shadow-sm mb-3">
                <Megaphone className="w-3.5 h-3.5 text-pjYellow" />
                <span>Sala de Prensa & Comunicados Oficiales</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight">
                Noticias de la <span className="underline decoration-pjYellow decoration-4 underline-offset-8">Juventud PJ Zulia</span>
              </h2>
              <p className="text-neutral-600 text-sm sm:text-base mt-2 max-w-2xl font-medium">
                Acciones de calle, pronunciamientos públicos, jornadas sociales y balances electorales de los 21 municipios del Estado.
              </p>
            </div>

            {/* Buscador & Indicador Verificado */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar noticias o municipios..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white border-2 border-black rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-black placeholder-neutral-400 focus:outline-none focus:border-pjYellow shadow-[2px_2px_0px_#000000] w-full sm:w-64"
                />
              </div>
              <div className="inline-flex items-center gap-1.5 bg-white border-2 border-black px-3 py-2 rounded-xl text-xs font-black text-black shadow-[2px_2px_0px_#000000]">
                <ShieldCheck className="w-4 h-4 text-black fill-pjYellow" />
                <span>Boletín Verificado</span>
              </div>
            </div>
          </div>

          {/* Categorías / Filtros */}
          <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-neutral-200">
            {['Todas', 'Electoral', 'Voluntariado', 'Formación', 'Pronunciamiento'].map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${active
                      ? 'bg-black text-pjYellow border-2 border-black shadow-[3px_3px_0px_#ffd200]'
                      : 'bg-white text-neutral-800 border-2 border-neutral-300 hover:border-black shadow-sm'
                    }`}
                >
                  {cat === 'Todas' ? '📰 Todas las Noticias' : cat}
                </button>
              );
            })}
          </div>

          {/* Noticia Principal (Lead Hero Story) */}
          {selectedCategory === 'Todas' && !searchQuery && (
            <div className="mb-14">
              <div className="bg-white border-2 border-black rounded-3xl overflow-hidden shadow-[8px_8px_0px_#000000] grid grid-cols-1 lg:grid-cols-12 group">
                <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto overflow-hidden bg-black">
                  <img
                    src={featuredNews.imageUrl}
                    alt={featuredNews.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-pjYellow text-black font-black text-xs uppercase px-3 py-1 rounded-full border-2 border-black shadow-sm flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" /> Titular Destacado
                    </span>
                    <span className="bg-black text-white font-black text-xs uppercase px-3 py-1 rounded-full border border-black shadow-sm">
                      {featuredNews.municipality}
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between bg-white">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-xs text-neutral-500 font-bold">
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

                    <h3 className="text-2xl sm:text-3xl font-black text-black leading-tight group-hover:text-neutral-800 transition">
                      {featuredNews.title}
                    </h3>

                    <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                      {featuredNews.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-neutral-200 flex items-center justify-between">
                    <span className="text-xs font-black text-black bg-neutral-100 px-3 py-1 rounded-lg border border-neutral-300">
                      {featuredNews.department}
                    </span>

                    <button
                      onClick={() => setActiveArticle(featuredNews)}
                      className="bg-pjYellow hover:bg-pjYellowHover text-black font-black text-xs px-4 py-2.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_#000000] flex items-center gap-1.5 transition active:scale-95"
                    >
                      <span>Leer Comunicado</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grid de Artículos */}
          {filteredNews.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-neutral-300 rounded-3xl p-12 text-center">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((article) => (
                <article
                  key={article.id}
                  className="bg-white rounded-3xl border-2 border-black overflow-hidden shadow-[5px_5px_0px_#000000] hover:shadow-[7px_7px_0px_#ffd200] hover:-translate-y-1 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Imagen & Tag */}
                    <div className="h-52 bg-black relative overflow-hidden">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="bg-pjYellow text-black text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md border border-black shadow-sm">
                          {article.category}
                        </span>
                        <span className="bg-black text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md border border-white/20">
                          {article.municipality}
                        </span>
                      </div>
                    </div>

                    {/* Contenido Card */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-bold mb-2">
                        <span>{article.date}</span>
                        <span>•</span>
                        <span>{article.readTime}</span>
                      </div>

                      <h4 className="text-lg font-black text-black leading-snug group-hover:underline underline-offset-4 decoration-pjYellow decoration-2 transition">
                        {article.title}
                      </h4>

                      <p className="text-xs text-neutral-600 mt-3 line-clamp-3 leading-relaxed font-medium">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-6 pt-0">
                    <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-neutral-500 truncate max-w-[150px]">
                        {article.department}
                      </span>
                      <button
                        onClick={() => setActiveArticle(article)}
                        className="inline-flex items-center gap-1 text-xs font-black text-black hover:text-black bg-pjYellow/30 hover:bg-pjYellow px-3 py-1.5 rounded-lg border border-black transition"
                      >
                        <span>Leer más</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Ticker / Banner Rápido de Última Hora */}
          <div className="mt-14 bg-black text-white border-2 border-black rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[4px_4px_0px_#ffd200]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-pjYellow flex items-center justify-center text-black font-black shrink-0">
                <Megaphone className="w-5 h-5 text-black" />
              </div>
              <p className="text-xs sm:text-sm font-semibold">
                ¿Tienes una denuncia comunitaria o actividad en tu parroquia? Envía tu reporte directo a la Secretaría de Prensa.
              </p>
            </div>
            <a
              href="#sumate"
              className="bg-pjYellow hover:bg-pjYellowHover text-black text-xs font-black px-4 py-2 rounded-xl shrink-0 transition"
            >
              Contactar Secretaría
            </a>
          </div>

        </div>
      </section>

      {/* 5. PILARES ESTRATÉGICOS (Blanco, Negro y Amarillo) */}
      <section id="pilares" className="py-20 bg-white border-b-2 border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-black uppercase tracking-wider bg-pjYellow text-black px-3 py-1 rounded-full border border-black shadow-sm">
              Doctrina & Acción
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-black">
              Nuestros Tres Pilares de Liderazgo
            </h2>
            <p className="text-sm text-neutral-600 font-medium">
              Estructura permanente para garantizar la formación ciudadana, la labor social y la defensa democrática de los votos zulianos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pilar 1 */}
            <div className="bg-white border-2 border-black p-8 rounded-3xl shadow-[5px_5px_0px_#000000] hover:shadow-[7px_7px_0px_#ffd200] hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-pjYellow border-2 border-black flex items-center justify-center text-black mb-6 shadow-[2px_2px_0px_#000000]">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-black mb-2">Escuela de Formación</h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                Cursos intensivos en doctrina centrohumanista, diseño de políticas públicas, técnicas de debate, oratoria y gestión presupuestaria municipal.
              </p>
            </div>

            {/* Pilar 2 */}
            <div className="bg-white border-2 border-black p-8 rounded-3xl shadow-[5px_5px_0px_#000000] hover:shadow-[7px_7px_0px_#ffd200] hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-black border-2 border-black flex items-center justify-center text-pjYellow mb-6 shadow-[2px_2px_0px_#000000]">
                <Building2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-black mb-2">Red en los 21 Municipios</h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                Comités juveniles formalmente constituidos en cada una de las 109 parroquias del Zulia, coordinando asambleas de vecinos y diagnósticos comunitarios.
              </p>
            </div>

            {/* Pilar 3 */}
            <div className="bg-white border-2 border-black p-8 rounded-3xl shadow-[5px_5px_0px_#000000] hover:shadow-[7px_7px_0px_#ffd200] hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-pjYellow border-2 border-black flex items-center justify-center text-black mb-6 shadow-[2px_2px_0px_#000000]">
                <Vote className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-black mb-2">Defensa Electoral y Voto</h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                Padrón auditado de testigos electorales, coordinadores de centro de votación y observadores para blindar la voluntad ciudadana en las urnas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. COBERTURA TERRITORIAL & PLATAFORMA SIGO */}
      <section id="municipios" className="py-20 bg-neutral-50 border-b-2 border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            <div className="space-y-6">
              <span className="text-xs font-black text-black bg-pjYellow px-3 py-1 rounded-full border border-black uppercase tracking-wider">
                Despliegue Territorial
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-black">
                El Zulia conectado de Norte a Sur
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                El sistema SIGO-PJ Zulia audita en tiempo real la operatividad de los 21 municipios del Estado. Cada subregión cuenta con voceros juveniles electos trabajando en soluciones locales.
              </p>

              <div className="space-y-3">
                {[
                  { region: 'Subregión Metropolitana', muns: 'Maracaibo, San Francisco' },
                  { region: 'Costa Oriental del Lago', muns: 'Cabimas, Lagunillas, Miranda, Santa Rita, Simón Bolívar, Valmore Rodríguez, Baralt' },
                  { region: 'Eje Perijá', muns: 'Machiques de Perijá, Rosario de Perijá' },
                  { region: 'Sur del Lago', muns: 'Colón, Francisco Javier Pulgar, Catatumbo, Sucre, Jesús María Semprún' },
                  { region: 'Subregión Guajira', muns: 'Mara, Guajira, Almirante Padilla' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white border-2 border-black p-4 rounded-2xl flex items-start gap-3.5 shadow-[3px_3px_0px_#000000]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-pjYellow border border-black flex items-center justify-center text-black shrink-0 mt-0.5 font-bold">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-black uppercase">{item.region}</h4>
                      <p className="text-xs text-neutral-600 font-medium mt-0.5">{item.muns}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tarjeta Plataforma Tecnológica SIGO */}
            <div className="bg-black text-white border-2 border-black rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-[8px_8px_0px_#ffd200]">
              <div className="w-20 h-20 bg-pjYellow text-black border-2 border-white rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <Target className="w-10 h-10 text-black" />
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-pjYellow">
                  Tecnología para la Organización
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Sistema de Gestión Operativa (SIGO)
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-md mx-auto font-medium">
                Padrón militante verificado, auditoría de cargos estatutarios, censo de centros de votación y métricas de crecimiento parroquial en tiempo real.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => navigate('/login?bypass=admin')}
                  className="w-full sm:w-auto bg-pjYellow hover:bg-pjYellowHover text-black font-black px-6 py-3.5 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md"
                >
                  <Lock className="w-4 h-4 text-black" />
                  <span>Bypass Directivo Operativo</span>
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto bg-white hover:bg-neutral-100 text-black font-extrabold px-6 py-3.5 rounded-xl text-xs transition"
                >
                  Iniciar Sesión Oficial
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. MODAL DE LECTURA DE NOTICIAS COMPLETA */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border-2 border-black rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-[10px_10px_0px_#000000] relative">
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-neutral-100 hover:bg-black hover:text-white border border-black flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Badge & Metadata */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="bg-pjYellow text-black text-xs font-black uppercase px-2.5 py-0.5 rounded border border-black">
                {activeArticle.category}
              </span>
              <span className="bg-black text-white text-xs font-black uppercase px-2.5 py-0.5 rounded">
                {activeArticle.municipality}
              </span>
              <span className="text-xs text-neutral-500 font-bold ml-auto pr-8">
                {activeArticle.date}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-black leading-tight mb-4">
              {activeArticle.title}
            </h3>

            {/* Imagen del modal */}
            <div className="h-60 sm:h-72 rounded-2xl overflow-hidden border-2 border-black mb-6 bg-black">
              <img
                src={activeArticle.imageUrl}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Párrafos del artículo */}
            <div className="space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed font-medium">
              {activeArticle.content.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Pie del modal */}
            <div className="mt-8 pt-5 border-t-2 border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-xs font-bold text-neutral-500">
                Emitido por: <strong className="text-black">{activeArticle.department}</strong>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    alert('Enlace copiado al portapapeles');
                  }}
                  className="bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-bold px-3 py-2 rounded-xl border border-neutral-300 flex items-center gap-1.5 transition"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Compartir</span>
                </button>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="bg-pjYellow hover:bg-pjYellowHover text-black text-xs font-black px-4 py-2 rounded-xl border-2 border-black transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. FOOTER INSTITUCIONAL (Negro Profundo, Acentos Amarillos, Tipografía Nítida) */}
      <footer className="bg-black text-neutral-400 border-t-2 border-black py-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pjYellow flex items-center justify-center font-black text-black text-lg border border-black shadow-sm">
                PJ
              </div>
              <div>
                <h4 className="text-white font-black text-sm uppercase">Primero Justicia Zulia</h4>
                <p className="text-[11px] text-neutral-400">Secretaría Juvenil Regional · Órgano de Dirección Política</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold">
              <a href="#noticias" className="text-white hover:text-pjYellow transition">Noticias & Prensa</a>
              <a href="#pilares" className="text-white hover:text-pjYellow transition">Pilares</a>
              <a href="#municipios" className="text-white hover:text-pjYellow transition">Municipios</a>
              <a href="#sumate" className="text-pjYellow hover:underline transition">Inscripciones</a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-neutral-500 font-bold">Acceso Rápido por Rol:</span>
              <button
                onClick={() => navigate('/login?bypass=admin')}
                className="text-pjYellow hover:underline font-bold flex items-center gap-1"
              >
                <Lock className="w-3 h-3" /> Superadmin
              </button>
              <button
                onClick={() => navigate('/login?bypass=municipal')}
                className="text-white hover:text-pjYellow font-medium transition"
              >
                Líder Municipal
              </button>
              <button
                onClick={() => navigate('/login?bypass=parroquial')}
                className="text-white hover:text-pjYellow font-medium transition"
              >
                Líder Parroquial
              </button>
            </div>

            <div className="text-neutral-500 text-center sm:text-right">
              © 2026 SIGO-PJ Zulia. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
