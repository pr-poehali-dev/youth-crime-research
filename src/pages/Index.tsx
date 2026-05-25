import { useState, useEffect, useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";

// ─── constants ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "goal", label: "Цель" },
  { id: "relevance", label: "Актуальность" },
  { id: "causes", label: "Причины" },
  { id: "research", label: "Исследование" },
  { id: "survey", label: "Опрос" },
  { id: "prevention", label: "Профилактика" },
  { id: "conclusion", label: "Вывод" },
];

const CAUSES = [
  { num: "01", title: "Семейное неблагополучие", desc: "Насилие, алкоголизм, отсутствие контроля или чрезмерная жёсткость в воспитании. Дисфункциональная семья — главный фактор риска. По данным МВД, более 60% осуждённых несовершеннолетних выросли в неблагополучных семьях.", percent: 62 },
  { num: "02", title: "Влияние антисоциальных групп", desc: "Уличные компании, группы с делинквентным поведением. Подростки особенно уязвимы к давлению сверстников и стремятся к принятию в группе.", percent: 48 },
  { num: "03", title: "Социально-экономические факторы", desc: "Бедность, безработица родителей, отсутствие возможностей для досуга и самореализации. Социальное неравенство порождает ощущение несправедливости.", percent: 41 },
  { num: "04", title: "Психологические особенности", desc: "Импульсивность, низкая самооценка, акцентуации характера, несформированная эмоциональная регуляция. Возрастной кризис усиливает уязвимость.", percent: 35 },
  { num: "05", title: "Влияние медиа и интернета", desc: "Пропаганда насилия, деструктивный контент, вовлечение в радикальные сообщества через социальные сети. Формирование искажённых ценностей.", percent: 28 },
  { num: "06", title: "Школьная дезадаптация", desc: "Неуспеваемость, конфликты с педагогами, травля со стороны сверстников. Отчуждение от образовательной среды снижает социальный контроль.", percent: 33 },
];

// Статистика 2019–2026 (2024–2026 — оценочные данные / прогнозы)
const STATS = [
  { year: "2019", value: 41500, label: "41 500", est: false },
  { year: "2020", value: 37600, label: "37 600", est: false },
  { year: "2021", value: 39200, label: "39 200", est: false },
  { year: "2022", value: 38100, label: "38 100", est: false },
  { year: "2023", value: 35800, label: "35 800", est: false },
  { year: "2024", value: 33400, label: "≈33 400", est: true },
  { year: "2025", value: 31600, label: "≈31 600", est: true },
  { year: "2026", value: 30200, label: "≈30 200", est: true },
];

const AGE_GROUPS = [
  { range: "14 лет", percent: 12 },
  { range: "15 лет", percent: 19 },
  { range: "16 лет", percent: 31 },
  { range: "17 лет", percent: 38 },
];

const CRIME_TYPES = [
  { type: "Кражи", percent: 54 },
  { type: "Грабежи", percent: 14 },
  { type: "Хулиганство", percent: 11 },
  { type: "Наркотики", percent: 9 },
  { type: "Иное", percent: 12 },
];

// ─── опрос ────────────────────────────────────────────────────────────────────
// Каждый вариант имеет вес (risk): 0=нет риска, 1=низкий, 2=средний, 3=высокий

const SURVEY_QUESTIONS = [
  {
    id: 0,
    question: "Как ты реагируешь, когда что-то идёт не по-твоему?",
    options: [
      { text: "Стараюсь найти компромисс или поговорить", risk: 0 },
      { text: "Злюсь, но сдерживаюсь", risk: 1 },
      { text: "Иногда срываюсь и говорю лишнее", risk: 2 },
      { text: "Могу ударить или сломать что-нибудь", risk: 3 },
    ],
  },
  {
    id: 1,
    question: "Как ты относишься к правилам и законам?",
    options: [
      { text: "Считаю их необходимыми — соблюдаю", risk: 0 },
      { text: "Некоторые кажутся лишними, но я их не нарушаю", risk: 1 },
      { text: "Если правило мешает — его можно обойти", risk: 2 },
      { text: "Правила придуманы для слабых", risk: 3 },
    ],
  },
  {
    id: 2,
    question: "Что для тебя важнее всего в компании друзей?",
    options: [
      { text: "Взаимное уважение и поддержка", risk: 0 },
      { text: "Общие интересы и весёлое время", risk: 1 },
      { text: "Авторитет и уважение со стороны", risk: 2 },
      { text: "Доказать, что я не хуже других, любой ценой", risk: 3 },
    ],
  },
  {
    id: 3,
    question: "Что делаешь, если тебе нужны деньги, а их нет?",
    options: [
      { text: "Прошу у родителей или найду подработку", risk: 0 },
      { text: "Одолжу у друга", risk: 1 },
      { text: "Придумаю нестандартный способ достать", risk: 2 },
      { text: "Возьму сам — мне нужно, значит, имею право", risk: 3 },
    ],
  },
  {
    id: 4,
    question: "Как ты себя чувствуешь в последнее время?",
    options: [
      { text: "В целом хорошо, есть поддержка близких", risk: 0 },
      { text: "Бывает тяжело, но справляюсь сам", risk: 1 },
      { text: "Чувствую себя одиноким и непонятым", risk: 2 },
      { text: "Злость и безразличие — это моё обычное состояние", risk: 3 },
    ],
  },
];

const PREVENTION = [
  {
    icon: "Home",
    title: "Работа с семьёй",
    items: ["Программы поддержки неблагополучных семей", "Родительские школы и консультации", "Социальный патронаж", "Ранняя диагностика семейного насилия"],
  },
  {
    icon: "GraduationCap",
    title: "Образовательная среда",
    items: ["Школьные психологи и социальные педагоги", "Профилактические программы в школах", "Работа с буллингом", "Профориентация и занятость"],
  },
  {
    icon: "Users",
    title: "Социальная среда",
    items: ["Бесплатные секции и кружки", "Молодёжные центры", "Волонтёрские программы", "Работа с лидерами группировок"],
  },
  {
    icon: "Brain",
    title: "Психологическая помощь",
    items: ["Индивидуальные консультации", "Групповые тренинги социальных навыков", "Кризисные центры", "Телефоны доверия (анонимно)"],
  },
];

// ─── helpers ──────────────────────────────────────────────────────────────────

function useIntersection(ref: React.RefObject<Element>, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, threshold]);
  return visible;
}

function StatBar({ percent, dimmed = false }: { percent: number; dimmed?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useIntersection(ref as React.RefObject<Element>);
  return (
    <div ref={ref} className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{
          width: visible ? `${percent}%` : "0%",
          backgroundColor: dimmed ? "rgba(200,60,40,0.35)" : "hsl(8,72%,52%)",
        }}
      />
    </div>
  );
}

function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-12">
      {sub && (
        <p className="text-xs uppercase mb-3" style={{ fontFamily: "'IBM Plex Sans',sans-serif", letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)" }}>
          {sub}
        </p>
      )}
      <h2 className="text-4xl md:text-5xl font-light text-white leading-tight" style={{ fontFamily: "'Cormorant',serif" }}>
        {children}
      </h2>
      <div className="mt-4 w-12 h-px" style={{ backgroundColor: "hsl(8,72%,52%)" }} />
    </div>
  );
}

// Вычисляет % склонности (0–100) из ответов
function calcRisk(answers: Record<number, number>): number {
  const maxPossible = SURVEY_QUESTIONS.length * 3; // 5 вопросов × 3
  const total = SURVEY_QUESTIONS.reduce((sum, q) => {
    const idx = answers[q.id] ?? 0;
    return sum + q.options[idx].risk;
  }, 0);
  return Math.round((total / maxPossible) * 100);
}

function getRiskLabel(pct: number): { level: string; color: string; message: string; support: string } {
  if (pct <= 20) {
    return {
      level: "Низкий уровень риска",
      color: "#4ade80",
      message: "Ты демонстрируешь устойчивое просоциальное поведение. Твои ответы указывают на зрелый подход к конфликтам, уважение к нормам и хорошую эмоциональную регуляцию.",
      support: "Так держать. Умение справляться с трудностями и выбирать правильный путь — это сила, а не слабость. Поддерживай это в себе и помогай тем, кому сложнее.",
    };
  }
  if (pct <= 45) {
    return {
      level: "Умеренный уровень риска",
      color: "#facc15",
      message: "В целом ты придерживаешься норм, но в некоторых ситуациях можешь принимать импульсивные решения. Это нормально для подросткового возраста — важно вовремя это замечать.",
      support: "Если бывают моменты, когда трудно справиться с эмоциями или давлением окружения — поговори с кем-то, кому доверяешь. Психолог в школе или по телефону доверия всегда готов помочь. Ты не один.",
    };
  }
  if (pct <= 70) {
    return {
      level: "Повышенный уровень риска",
      color: "#fb923c",
      message: "Твои ответы указывают на ряд факторов риска: сложности с эмоциональной регуляцией, напряжение в отношениях или ощущение несправедливости. Это сигнал, который важно не игнорировать.",
      support: "Пожалуйста, обратись за помощью — это не слабость, это смелость. Позвони на детский телефон доверия: 8-800-2000-122 (бесплатно, анонимно, круглосуточно). Тебя не осудят — тебе помогут. Изменить ситуацию возможно.",
    };
  }
  return {
    level: "Высокий уровень риска",
    color: "hsl(8,72%,52%)",
    message: "Твои ответы говорят о серьёзном внутреннем напряжении. Возможно, ты сейчас проходишь через очень трудный период — чувствуешь злость, одиночество или что мир несправедлив к тебе.",
    support: "Пожалуйста, не замалчивай это. Обратись за помощью прямо сейчас: 8-800-2000-122 — детский телефон доверия, бесплатно и анонимно. Специалисты не будут тебя осуждать — они помогут разобраться с тем, что происходит. Ты заслуживаешь поддержки.",
  };
}

// ─── Cover page ───────────────────────────────────────────────────────────────

function CoverPage({ onEnter }: { onEnter: () => void }) {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 80); }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#080808" }}
    >
      {/* grid lines */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
        backgroundSize: "80px 80px",
      }} />

      {/* big year */}
      <div
        className="absolute select-none pointer-events-none"
        style={{
          fontFamily: "'Cormorant',serif",
          fontSize: "clamp(120px,20vw,280px)",
          fontWeight: 300,
          color: "rgba(255,255,255,0.03)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          whiteSpace: "nowrap",
          lineHeight: 1,
        }}
      >
        2025
      </div>

      {/* red vertical accent */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{
          background: "linear-gradient(to bottom,transparent,hsl(8,72%,52%) 40%,transparent)",
          opacity: show ? 1 : 0,
          transition: "opacity 1.2s ease",
        }}
      />

      <div
        className="relative z-10 max-w-2xl w-full px-10 md:px-16 flex flex-col gap-8"
        style={{
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(28px)",
          transition: "opacity 0.9s ease, transform 0.9s ease",
        }}
      >
        {/* school info */}
        <div className="flex flex-col gap-1">
          <p className="text-xs uppercase" style={{ fontFamily: "'IBM Plex Sans',sans-serif", letterSpacing: "0.22em", color: "rgba(255,255,255,0.22)" }}>
            Индивидуальный проект
          </p>
          <p className="text-xs uppercase" style={{ fontFamily: "'IBM Plex Sans',sans-serif", letterSpacing: "0.22em", color: "rgba(255,255,255,0.22)" }}>
            Обществознание · Психология · 2025–2026
          </p>
        </div>

        {/* author block */}
        <div className="flex flex-wrap gap-8">
          <div>
            <p className="text-xs uppercase mb-1" style={{ fontFamily: "'IBM Plex Sans',sans-serif", letterSpacing: "0.18em", color: "rgba(255,255,255,0.18)" }}>
              Автор
            </p>
            <p className="text-base" style={{ fontFamily: "'Cormorant',serif", color: "rgba(255,255,255,0.7)", fontWeight: 400 }}>
              Хисамова Даниела Ионовна
            </p>
          </div>
          <div className="w-px self-stretch" style={{ backgroundColor: "rgba(255,255,255,0.07)" }} />
          <div>
            <p className="text-xs uppercase mb-1" style={{ fontFamily: "'IBM Plex Sans',sans-serif", letterSpacing: "0.18em", color: "rgba(255,255,255,0.18)" }}>
              Класс
            </p>
            <p className="text-base" style={{ fontFamily: "'Cormorant',serif", color: "rgba(255,255,255,0.7)", fontWeight: 400 }}>
              10 «А»
            </p>
          </div>
          <div className="w-px self-stretch" style={{ backgroundColor: "rgba(255,255,255,0.07)" }} />
          <div>
            <p className="text-xs uppercase mb-1" style={{ fontFamily: "'IBM Plex Sans',sans-serif", letterSpacing: "0.18em", color: "rgba(255,255,255,0.18)" }}>
              Руководитель
            </p>
            <p className="text-base" style={{ fontFamily: "'Cormorant',serif", color: "rgba(255,255,255,0.7)", fontWeight: 400 }}>
              Ряков Евгений Евгеньевич
            </p>
          </div>
        </div>

        {/* rule */}
        <div className="h-px" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />

        {/* title */}
        <div>
          <h1
            className="font-light leading-tight"
            style={{
              fontFamily: "'Cormorant',serif",
              fontSize: "clamp(28px,5vw,52px)",
              color: "#f0f0f0",
            }}
          >
            Причины преступности<br />
            <span style={{ color: "rgba(255,255,255,0.42)", fontStyle: "italic" }}>среди</span>{" "}
            несовершеннолетних
          </h1>
          <p
            className="mt-4 text-sm leading-relaxed max-w-lg"
            style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: "rgba(255,255,255,0.35)" }}
          >
            Комплексный анализ социальных, психологических и экономических
            факторов делинквентного поведения подростков в современной России
          </p>
        </div>

        {/* rule */}
        <div className="h-px" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />

        {/* stats row */}
        <div className="flex flex-wrap gap-8">
          {[
            { v: "35 800", l: "преступлений в 2023 г.", red: true },
            { v: "−14%", l: "снижение за 5 лет", red: false },
            { v: "14–17", l: "основная группа риска", red: false },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-3xl md:text-4xl" style={{ fontFamily: "'Cormorant',serif", color: s.red ? "hsl(8,72%,52%)" : "rgba(255,255,255,0.6)" }}>{s.v}</p>
              <p className="text-xs uppercase mt-1" style={{ fontFamily: "'IBM Plex Sans',sans-serif", letterSpacing: "0.1em", color: "rgba(255,255,255,0.25)" }}>{s.l}</p>
            </div>
          ))}
        </div>

        {/* enter button */}
        <button
          onClick={onEnter}
          className="self-start flex items-center gap-3 text-sm uppercase group transition-all duration-300"
          style={{ fontFamily: "'IBM Plex Sans',sans-serif", letterSpacing: "0.18em", color: "rgba(255,255,255,0.45)" }}
        >
          <span className="group-hover:text-white transition-colors">Перейти к исследованию</span>
          <div
            className="w-8 h-px transition-all duration-300 group-hover:w-14"
            style={{ backgroundColor: "hsl(8,72%,52%)" }}
          />
          <Icon name="ArrowRight" size={14} style={{ color: "hsl(8,72%,52%)" }} />
        </button>
      </div>

      {/* bottom bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right,transparent,hsl(8,72%,52%) 50%,transparent)" }}
      />
    </div>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function Index() {
  const [coverVisible, setCoverVisible] = useState(true);
  const [coverMounted, setCoverMounted] = useState(true);
  const [activeSection, setActiveSection] = useState("");
  const [surveyAnswers, setSurveyAnswers] = useState<Record<number, number>>({});
  const [surveyDone, setSurveyDone] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleEnter = () => {
    setCoverVisible(false);
    setTimeout(() => setCoverMounted(false), 700);
  };

  // keyboard navigation for survey
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (surveyDone) return;
      const keys: Record<string, number> = { "1": 0, "2": 1, "3": 2, "4": 3 };
      if (keys[e.key] === undefined) return;
      const answeredCount = Object.keys(surveyAnswers).length;
      const nextQ = SURVEY_QUESTIONS[answeredCount];
      if (!nextQ) return;
      const optIdx = keys[e.key];
      if (optIdx < nextQ.options.length) {
        setSurveyAnswers((prev) => ({ ...prev, [nextQ.id]: optIdx }));
      }
    },
    [surveyAnswers, surveyDone]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 120;
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const el = document.getElementById(NAV_ITEMS[i].id);
        if (el && el.offsetTop <= scrollY) { setActiveSection(NAV_ITEMS[i].id); break; }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const maxStat = Math.max(...STATS.map((s) => s.value));
  const accentRed = "hsl(8,72%,52%)";

  const riskPercent = surveyDone ? calcRisk(surveyAnswers) : 0;
  const riskInfo = surveyDone ? getRiskLabel(riskPercent) : null;

  return (
    <>
      {/* Cover */}
      {coverMounted && (
        <div
          style={{
            opacity: coverVisible ? 1 : 0,
            transition: "opacity 0.7s ease",
            pointerEvents: coverVisible ? "auto" : "none",
          }}
        >
          <CoverPage onEnter={handleEnter} />
        </div>
      )}

      <div className="min-h-screen" style={{ backgroundColor: "#0a0a0a", color: "#ebebeb" }}>
        {/* Navigation */}
        <nav
          className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm"
          style={{ backgroundColor: "rgba(10,10,10,0.95)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14">
            <span className="text-sm italic" style={{ fontFamily: "'Cormorant',serif", color: "rgba(255,255,255,0.35)" }}>
              Индивидуальный проект · 10 класс
            </span>
            <div className="hidden md:flex items-center gap-6">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="text-xs uppercase transition-colors duration-200"
                  style={{ fontFamily: "'IBM Plex Sans',sans-serif", letterSpacing: "0.12em", color: activeSection === item.id ? accentRed : "rgba(255,255,255,0.38)" }}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ color: "rgba(255,255,255,0.5)" }}>
              <Icon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden px-6 pb-4 flex flex-col gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              {NAV_ITEMS.map((item) => (
                <button key={item.id} onClick={() => scrollTo(item.id)} className="text-xs uppercase text-left py-1"
                  style={{ fontFamily: "'IBM Plex Sans',sans-serif", letterSpacing: "0.12em", color: "rgba(255,255,255,0.45)" }}>
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </nav>

        {/* Hero */}
        <section className="min-h-screen flex flex-col justify-center pt-14 px-6 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 80% 50%,rgba(139,30,20,0.08) 0%,transparent 60%)" }} />
          <div className="max-w-6xl mx-auto relative">
            <p className="text-xs uppercase mb-8" style={{ fontFamily: "'IBM Plex Sans',sans-serif", letterSpacing: "0.25em", color: "rgba(255,255,255,0.22)" }}>
              Обществознание · Психология · 2025–2026
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white leading-tight max-w-4xl mb-8"
              style={{ fontFamily: "'Cormorant',serif" }}>
              Причины преступности{" "}
              <span className="italic" style={{ color: "rgba(255,255,255,0.42)" }}>среди</span>
              <br />несовершеннолетних
            </h1>
            <div className="max-w-2xl mb-8" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />
            <p className="text-sm max-w-xl leading-relaxed" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: "rgba(255,255,255,0.38)" }}>
              Комплексный анализ социальных, психологических и экономических факторов,
              влияющих на формирование девиантного поведения подростков в современной России
            </p>
            <div className="mt-16 flex flex-wrap gap-8">
              {[
                { val: "35 800", label: "преступлений в 2023 г.", red: true },
                { val: "14–17", label: "основная группа риска", red: false },
                { val: "62%", label: "из неблагополучных семей", red: false },
              ].map((stat, i) => (
                <div key={i} className="flex items-start gap-4">
                  {i > 0 && <div className="w-px h-10 self-center" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />}
                  <div>
                    <p className="text-4xl" style={{ fontFamily: "'Cormorant',serif", color: stat.red ? accentRed : "rgba(255,255,255,0.65)" }}>{stat.val}</p>
                    <p className="text-xs uppercase mt-1" style={{ fontFamily: "'IBM Plex Sans',sans-serif", letterSpacing: "0.12em", color: "rgba(255,255,255,0.28)" }}>{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <Icon name="ChevronDown" size={20} style={{ color: "rgba(255,255,255,0.18)" }} />
          </div>
        </section>

        {/* Goal */}
        <section id="goal" className="py-24 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="max-w-6xl mx-auto">
            <SectionTitle sub="Раздел 01">Цель и задачи проекта</SectionTitle>
            <div className="grid md:grid-cols-2 gap-16">
              <div>
                <h3 className="text-2xl font-medium text-white mb-4" style={{ fontFamily: "'Cormorant',serif" }}>Цель</h3>
                <p className="text-sm leading-relaxed" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: "rgba(255,255,255,0.55)" }}>
                  Выявить и систематизировать ключевые причины преступности среди несовершеннолетних,
                  проанализировать их взаимосвязь и разработать рекомендации по профилактике
                  делинквентного поведения в подростковой среде.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-medium text-white mb-4" style={{ fontFamily: "'Cormorant',serif" }}>Задачи</h3>
                <ul className="space-y-3">
                  {[
                    "Изучить статистику преступности несовершеннолетних в России",
                    "Проанализировать социальные и психологические факторы риска",
                    "Провести опрос для выявления факторов риска и общественного мнения",
                    "Систематизировать методы профилактики и определить их эффективность",
                    "Сформулировать выводы и практические рекомендации",
                  ].map((task, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <span className="text-xs mt-1 shrink-0" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: accentRed }}>{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-sm leading-relaxed" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: "rgba(255,255,255,0.55)" }}>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-16 grid md:grid-cols-3 gap-6">
              {[
                { label: "Гипотеза", text: "Главным фактором преступности несовершеннолетних является совокупность семейного неблагополучия и социальной среды, а не только личностные особенности подростка" },
                { label: "Объект", text: "Преступность среди несовершеннолетних как социальное явление в современном российском обществе" },
                { label: "Предмет", text: "Причины и факторы, детерминирующие преступное поведение подростков в возрасте 14–17 лет" },
              ].map((item) => (
                <div key={item.label} className="p-6" style={{ border: "1px solid rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.02)" }}>
                  <p className="text-xs uppercase mb-3" style={{ fontFamily: "'IBM Plex Sans',sans-serif", letterSpacing: "0.18em", color: accentRed }}>{item.label}</p>
                  <p className="text-sm leading-relaxed" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: "rgba(255,255,255,0.52)" }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Relevance */}
        <section id="relevance" className="py-24 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="max-w-6xl mx-auto">
            <SectionTitle sub="Раздел 02">Актуальность</SectionTitle>
            <div className="grid md:grid-cols-3 gap-px" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
              {[
                { icon: "TrendingUp", title: "Масштаб проблемы", text: "Ежегодно в России регистрируется свыше 30 тысяч преступлений, совершённых несовершеннолетними. Проблема затрагивает каждый регион страны и все социальные слои." },
                { icon: "Clock", title: "Долгосрочные последствия", text: "Подростковая преступность формирует устойчивые девиантные паттерны поведения. 43% взрослых рецидивистов совершили первое преступление до 18 лет." },
                { icon: "Globe", title: "Социальная значимость", text: "Проблема отражает состояние общества в целом — кризис институтов семьи, образования и социальной защиты. Её решение требует системного государственного подхода." },
              ].map((item) => (
                <div key={item.title} className="p-8" style={{ backgroundColor: "#0f0f0f" }}>
                  <Icon name={item.icon as "TrendingUp"} size={22} style={{ color: accentRed, marginBottom: "1rem" }} />
                  <h3 className="text-xl text-white mb-3" style={{ fontFamily: "'Cormorant',serif" }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: "rgba(255,255,255,0.48)" }}>{item.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 p-8" style={{ border: "1px solid rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.015)" }}>
              <p className="text-2xl italic leading-relaxed max-w-3xl" style={{ fontFamily: "'Cormorant',serif", color: "rgba(255,255,255,0.6)" }}>
                «Общество, которое не заботится о своих детях, не имеет будущего.
                Профилактика подростковой преступности — это инвестиция в социальную стабильность всего государства.»
              </p>
              <p className="text-xs uppercase mt-4" style={{ fontFamily: "'IBM Plex Sans',sans-serif", letterSpacing: "0.18em", color: "rgba(255,255,255,0.2)" }}>
                Концептуальное положение проекта
              </p>
            </div>
          </div>
        </section>

        {/* Causes */}
        <section id="causes" className="py-24 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="max-w-6xl mx-auto">
            <SectionTitle sub="Раздел 03">Причины преступности</SectionTitle>
            <div className="grid md:grid-cols-2 gap-6 mb-16">
              {CAUSES.map((cause) => (
                <div key={cause.num} className="p-6 transition-all duration-300" style={{ border: "1px solid rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.02)" }}>
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-5xl font-light leading-none" style={{ fontFamily: "'Cormorant',serif", color: "rgba(200,60,40,0.18)" }}>{cause.num}</span>
                    <div>
                      <h3 className="text-xl text-white mb-1" style={{ fontFamily: "'Cormorant',serif" }}>{cause.title}</h3>
                      <p className="text-xs" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: accentRed }}>{cause.percent}% осуждённых</p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed mb-4" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: "rgba(255,255,255,0.48)" }}>{cause.desc}</p>
                  <StatBar percent={cause.percent} />
                </div>
              ))}
            </div>
            <div className="p-8" style={{ border: "1px solid rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.02)" }}>
              <h3 className="text-2xl text-white mb-8" style={{ fontFamily: "'Cormorant',serif" }}>Структура видов преступлений (2023–2025)</h3>
              <div className="space-y-4">
                {CRIME_TYPES.map((ct) => (
                  <div key={ct.type} className="flex items-center gap-4">
                    <span className="text-sm w-28 shrink-0" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: "rgba(255,255,255,0.48)" }}>{ct.type}</span>
                    <div className="flex-1"><StatBar percent={ct.percent} /></div>
                    <span className="text-sm w-10 text-right" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: "rgba(255,255,255,0.38)" }}>{ct.percent}%</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-6" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: "rgba(255,255,255,0.18)" }}>
                Источник: данные МВД РФ, статистический сборник «Состояние преступности в России»
              </p>
            </div>
          </div>
        </section>

        {/* Research */}
        <section id="research" className="py-24 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="max-w-6xl mx-auto">
            <SectionTitle sub="Раздел 04">Исследование</SectionTitle>

            {/* Bar chart 2019–2026 */}
            <div className="mb-16">
              <h3 className="text-2xl text-white mb-2" style={{ fontFamily: "'Cormorant',serif" }}>
                Динамика преступности несовершеннолетних в России
              </h3>
              <p className="text-xs uppercase mb-2" style={{ fontFamily: "'IBM Plex Sans',sans-serif", letterSpacing: "0.15em", color: "rgba(255,255,255,0.28)" }}>
                Количество зарегистрированных преступлений, 2019–2026
              </p>
              <p className="text-xs mb-8" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: "rgba(255,255,255,0.2)" }}>
                * 2024–2026 — оценочные данные / прогноз на основе тренда МВД РФ
              </p>
              <div className="flex items-end gap-2 md:gap-3" style={{ height: "200px" }}>
                {STATS.map((s) => {
                  const h = Math.round((s.value / maxStat) * 100);
                  return (
                    <div key={s.year} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-xs text-center" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: s.est ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.38)", fontSize: "10px" }}>
                        {s.label}
                      </span>
                      <div className="w-full relative overflow-hidden" style={{ height: "120px", backgroundColor: "rgba(255,255,255,0.04)", border: s.est ? "1px dashed rgba(255,255,255,0.1)" : "none" }}>
                        <div
                          className="absolute bottom-0 left-0 right-0 transition-all duration-1000"
                          style={{ height: `${h}%`, backgroundColor: s.est ? "rgba(200,60,40,0.4)" : "hsl(8,72%,42%)" }}
                        />
                      </div>
                      <span className="text-xs" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: s.est ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.28)", fontSize: "10px" }}>
                        {s.year}{s.est ? "*" : ""}
                      </span>
                    </div>
                  );
                })}
              </div>
              {/* legend */}
              <div className="flex gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-2" style={{ backgroundColor: "hsl(8,72%,42%)" }} />
                  <span className="text-xs" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: "rgba(255,255,255,0.3)" }}>Фактические данные</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-2" style={{ backgroundColor: "rgba(200,60,40,0.4)", border: "1px dashed rgba(255,255,255,0.2)" }} />
                  <span className="text-xs" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: "rgba(255,255,255,0.3)" }}>Оценка / прогноз</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div>
                <h3 className="text-2xl text-white mb-6" style={{ fontFamily: "'Cormorant',serif" }}>Распределение по возрасту</h3>
                <div className="space-y-4">
                  {AGE_GROUPS.map((ag) => (
                    <div key={ag.range} className="flex items-center gap-4">
                      <span className="text-sm w-16 shrink-0" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: "rgba(255,255,255,0.48)" }}>{ag.range}</span>
                      <div className="flex-1"><StatBar percent={ag.percent} /></div>
                      <span className="text-sm w-10 text-right" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: "rgba(255,255,255,0.38)" }}>{ag.percent}%</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs mt-4" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: "rgba(255,255,255,0.2)" }}>
                  Пик приходится на 16–17 лет — период наиболее острого возрастного кризиса
                </p>
              </div>
              <div>
                <h3 className="text-2xl text-white mb-6" style={{ fontFamily: "'Cormorant',serif" }}>Ключевые данные</h3>
                <div className="space-y-4">
                  {[
                    { label: "Доля мальчиков среди осуждённых", value: "92%" },
                    { label: "Не имели постоянного занятия", value: "67%" },
                    { label: "Совершили преступление в группе", value: "58%" },
                    { label: "Ранее состояли на учёте в ПДН", value: "44%" },
                    { label: "Находились в состоянии опьянения", value: "31%" },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <span className="text-sm" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: "rgba(255,255,255,0.48)" }}>{item.label}</span>
                      <span className="text-xl" style={{ fontFamily: "'Cormorant',serif", color: accentRed }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl text-white mb-6" style={{ fontFamily: "'Cormorant',serif" }}>Сравнение факторов риска</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                      {["Фактор", "Влияние", "Доля в причинах", "Поддаётся коррекции"].map((col) => (
                        <th key={col} className="text-left py-3 pr-6 text-xs uppercase"
                          style={{ fontFamily: "'IBM Plex Sans',sans-serif", letterSpacing: "0.12em", color: "rgba(255,255,255,0.28)" }}>
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { factor: "Семейное неблагополучие", impact: "Критическое", share: "62%", corr: "Частично" },
                      { factor: "Асоциальное окружение", impact: "Высокое", share: "48%", corr: "Да" },
                      { factor: "Бедность семьи", impact: "Высокое", share: "41%", corr: "Частично" },
                      { factor: "Психол. особенности", impact: "Среднее", share: "35%", corr: "Да" },
                      { factor: "Школьная дезадаптация", impact: "Среднее", share: "33%", corr: "Да" },
                      { factor: "Интернет / медиа", impact: "Умеренное", share: "28%", corr: "Да" },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <td className="py-3 pr-6 text-sm" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: "rgba(255,255,255,0.65)" }}>{row.factor}</td>
                        <td className="py-3 pr-6 text-sm" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: accentRed }}>{row.impact}</td>
                        <td className="py-3 pr-6 text-sm" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: "rgba(255,255,255,0.45)" }}>{row.share}</td>
                        <td className="py-3 text-sm" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: "rgba(255,255,255,0.45)" }}>{row.corr}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Survey */}
        <section id="survey" className="py-24 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="max-w-6xl mx-auto">
            <SectionTitle sub="Раздел 05">Самодиагностика: опрос</SectionTitle>
            <p className="text-sm mb-3 -mt-4" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: "rgba(255,255,255,0.38)" }}>
              Ответьте на 5 вопросов, чтобы получить персональный результат
            </p>
            <p className="text-xs mb-12" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: "rgba(255,255,255,0.2)" }}>
              Подсказка: можно выбирать ответы клавишами <span style={{ color: "rgba(255,255,255,0.4)" }}>1 / 2 / 3 / 4</span> — следующий вопрос отвечается автоматически
            </p>

            {!surveyDone ? (
              <div className="space-y-10">
                {SURVEY_QUESTIONS.map((q, qIdx) => {
                  const answered = surveyAnswers[q.id] !== undefined;
                  const isActive = Object.keys(surveyAnswers).length === qIdx;
                  return (
                    <div
                      key={q.id}
                      className="pl-6 transition-opacity duration-300"
                      style={{
                        borderLeft: `2px solid ${answered ? accentRed : isActive ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)"}`,
                        opacity: !answered && !isActive ? 0.38 : 1,
                      }}
                    >
                      <p className="text-xs uppercase mb-2" style={{ fontFamily: "'IBM Plex Sans',sans-serif", letterSpacing: "0.15em", color: "rgba(255,255,255,0.28)" }}>
                        Вопрос {q.id + 1} из {SURVEY_QUESTIONS.length}
                        {isActive && <span style={{ color: accentRed, marginLeft: "8px" }}>← текущий</span>}
                      </p>
                      <p className="text-xl text-white mb-4" style={{ fontFamily: "'Cormorant',serif" }}>{q.question}</p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {q.options.map((opt, idx) => {
                          const selected = surveyAnswers[q.id] === idx;
                          return (
                            <button
                              key={idx}
                              onClick={() => setSurveyAnswers((prev) => ({ ...prev, [q.id]: idx }))}
                              className="text-left px-4 py-3 text-sm transition-all duration-200 flex items-start gap-3"
                              style={{
                                fontFamily: "'IBM Plex Sans',sans-serif",
                                border: selected ? "1px solid #ffffff" : "1px solid rgba(255,255,255,0.08)",
                                backgroundColor: selected ? "rgba(255,255,255,0.07)" : "transparent",
                                color: selected ? "#ffffff" : "rgba(255,255,255,0.45)",
                              }}
                            >
                              <span
                                className="shrink-0 text-xs mt-0.5"
                                style={{ color: selected ? "#fff" : "rgba(255,255,255,0.22)", fontFamily: "'IBM Plex Sans',sans-serif" }}
                              >
                                {idx + 1}.
                              </span>
                              <span>{opt.text}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                <div className="flex flex-col gap-3 pt-4">
                  <button
                    onClick={() => { if (Object.keys(surveyAnswers).length === SURVEY_QUESTIONS.length) setSurveyDone(true); }}
                    disabled={Object.keys(surveyAnswers).length < SURVEY_QUESTIONS.length}
                    className="w-fit px-8 py-3 text-sm uppercase transition-colors duration-200"
                    style={{
                      fontFamily: "'IBM Plex Sans',sans-serif",
                      letterSpacing: "0.15em",
                      backgroundColor: Object.keys(surveyAnswers).length < SURVEY_QUESTIONS.length ? "rgba(200,60,40,0.25)" : accentRed,
                      color: "#fff",
                      cursor: Object.keys(surveyAnswers).length < SURVEY_QUESTIONS.length ? "not-allowed" : "pointer",
                    }}
                  >
                    Получить результат
                  </button>
                  {Object.keys(surveyAnswers).length < SURVEY_QUESTIONS.length && (
                    <p className="text-xs" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: "rgba(255,255,255,0.2)" }}>
                      Ответьте на все вопросы ({Object.keys(surveyAnswers).length} / {SURVEY_QUESTIONS.length})
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div>
                {/* risk percent display */}
                <div className="p-10 mb-6" style={{ border: `1px solid ${riskInfo!.color}44`, backgroundColor: "rgba(255,255,255,0.015)" }}>
                  <p className="text-xs uppercase mb-6" style={{ fontFamily: "'IBM Plex Sans',sans-serif", letterSpacing: "0.18em", color: "rgba(255,255,255,0.28)" }}>
                    Результат самодиагностики
                  </p>

                  {/* big percent */}
                  <div className="flex items-end gap-6 mb-6">
                    <p className="text-8xl font-light leading-none" style={{ fontFamily: "'Cormorant',serif", color: riskInfo!.color }}>
                      {riskPercent}%
                    </p>
                    <div className="mb-2">
                      <p className="text-xl text-white" style={{ fontFamily: "'Cormorant',serif" }}>{riskInfo!.level}</p>
                      <p className="text-xs uppercase mt-1" style={{ fontFamily: "'IBM Plex Sans',sans-serif", letterSpacing: "0.12em", color: "rgba(255,255,255,0.28)" }}>
                        склонность к факторам риска
                      </p>
                    </div>
                  </div>

                  {/* progress bar */}
                  <div className="h-2 w-full mb-8 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${riskPercent}%`, backgroundColor: riskInfo!.color }}
                    />
                  </div>

                  {/* analysis */}
                  <p className="text-lg leading-relaxed mb-6" style={{ fontFamily: "'Cormorant',serif", color: "rgba(255,255,255,0.75)" }}>
                    {riskInfo!.message}
                  </p>

                  {/* support block */}
                  <div className="p-5 mt-2" style={{ backgroundColor: "rgba(255,255,255,0.03)", borderLeft: `3px solid ${riskInfo!.color}` }}>
                    <p className="text-xs uppercase mb-2" style={{ fontFamily: "'IBM Plex Sans',sans-serif", letterSpacing: "0.15em", color: riskInfo!.color }}>
                      {riskPercent > 45 ? "Не бойся обратиться за помощью" : "Продолжай в том же духе"}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: "rgba(255,255,255,0.55)" }}>
                      {riskInfo!.support}
                    </p>
                    {riskPercent > 45 && (
                      <p className="text-sm mt-3 font-medium" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: "rgba(255,255,255,0.75)" }}>
                        Детский телефон доверия: <span style={{ color: "#fff" }}>8-800-2000-122</span> — бесплатно, анонимно, круглосуточно
                      </p>
                    )}
                  </div>

                  {/* answers summary */}
                  <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-3 mt-8">
                    {SURVEY_QUESTIONS.map((q) => (
                      <div key={q.id} className="p-3" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                        <p className="text-xs mb-1" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: "rgba(255,255,255,0.22)" }}>Вопрос {q.id + 1}</p>
                        <p className="text-xs" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: "rgba(255,255,255,0.55)" }}>{q.options[surveyAnswers[q.id]].text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => { setSurveyDone(false); setSurveyAnswers({}); }}
                  className="text-xs uppercase underline underline-offset-4 transition-colors"
                  style={{ fontFamily: "'IBM Plex Sans',sans-serif", letterSpacing: "0.12em", color: "rgba(255,255,255,0.25)" }}
                >
                  Пройти заново
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Prevention */}
        <section id="prevention" className="py-24 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="max-w-6xl mx-auto">
            <SectionTitle sub="Раздел 06">Профилактика</SectionTitle>
            <div className="grid md:grid-cols-2 gap-6 mb-16">
              {PREVENTION.map((block) => (
                <div key={block.title} className="p-8 transition-all duration-300" style={{ border: "1px solid rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.02)" }}>
                  <div className="flex items-center gap-3 mb-5">
                    <Icon name={block.icon as "Home"} size={20} style={{ color: accentRed }} />
                    <h3 className="text-xl text-white" style={{ fontFamily: "'Cormorant',serif" }}>{block.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {block.items.map((item) => (
                      <li key={item} className="flex gap-2 items-start">
                        <span className="mt-1 text-xs shrink-0" style={{ color: accentRed }}>—</span>
                        <span className="text-sm leading-relaxed" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: "rgba(255,255,255,0.52)" }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="p-8" style={{ border: "1px solid rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.02)" }}>
              <h3 className="text-2xl text-white mb-6" style={{ fontFamily: "'Cormorant',serif" }}>Телефоны доверия и помощи</h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { name: "Детский телефон доверия", phone: "8-800-2000-122", note: "Бесплатно, круглосуточно" },
                  { name: "Горячая линия МВД", phone: "8-800-222-74-47", note: "Сообщить о преступлении" },
                  { name: "Психологическая помощь", phone: "8-800-2000-345", note: "Взрослые, круглосуточно" },
                  { name: "Единый экстренный номер", phone: "112", note: "Экстренные ситуации" },
                  { name: "Кризисная линия", phone: "8-800-100-49-94", note: "Суицидальные кризисы" },
                  { name: "Помощь жертвам насилия", phone: "8-800-7000-600", note: "Бесплатно, анонимно" },
                ].map((line) => (
                  <div key={line.name} className="pl-4" style={{ borderLeft: "2px solid rgba(200,60,40,0.3)" }}>
                    <p className="text-xs uppercase mb-1" style={{ fontFamily: "'IBM Plex Sans',sans-serif", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)" }}>{line.name}</p>
                    <p className="text-2xl text-white" style={{ fontFamily: "'Cormorant',serif" }}>{line.phone}</p>
                    <p className="text-xs mt-1" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: "rgba(255,255,255,0.22)" }}>{line.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section id="conclusion" className="py-24 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="max-w-6xl mx-auto">
            <SectionTitle sub="Раздел 07">Вывод</SectionTitle>
            <div className="grid md:grid-cols-2 gap-16 mb-16">
              <div>
                <p className="text-sm leading-relaxed mb-6" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: "rgba(255,255,255,0.55)" }}>
                  Проведённое исследование подтверждает гипотезу о том, что преступность среди несовершеннолетних является многофакторным явлением, в котором семейное неблагополучие играет ключевую, но не единственную роль.
                </p>
                <p className="text-sm leading-relaxed mb-6" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: "rgba(255,255,255,0.55)" }}>
                  Социальная среда, экономические условия, психологические особенности подросткового возраста и влияние цифрового пространства формируют комплекс взаимосвязанных факторов риска. Ни один из них не действует изолированно.
                </p>
                <p className="text-sm leading-relaxed" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: "rgba(255,255,255,0.55)" }}>
                  Эффективная профилактика возможна только при системном взаимодействии семьи, школы, психологической службы и государственных институтов. Репрессивные меры без работы с первопричинами дают лишь временный результат. Положительная динамика 2019–2025 гг. свидетельствует об эффективности принимаемых мер при условии их системности.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  "Семья — ключевой фактор риска и одновременно главный ресурс профилактики",
                  "Пик преступности приходится на 16–17 лет — наиболее кризисный период взросления",
                  "Групповой характер преступлений указывает на важность работы с социальным окружением",
                  "Большинство факторов поддаются коррекции при своевременном вмешательстве",
                  "Позитивная динамика 2019–2025 гг. свидетельствует об эффективности принимаемых мер",
                ].map((text, i) => (
                  <div key={i} className="flex gap-4 items-start p-4" style={{ border: "1px solid rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.015)" }}>
                    <span className="text-2xl shrink-0" style={{ fontFamily: "'Cormorant',serif", color: "rgba(200,60,40,0.45)" }}>{i + 1}</span>
                    <p className="text-sm leading-relaxed" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: "rgba(255,255,255,0.52)" }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between gap-6 pt-12" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              <div>
                <p className="text-xs uppercase mb-2" style={{ fontFamily: "'IBM Plex Sans',sans-serif", letterSpacing: "0.18em", color: "rgba(255,255,255,0.2)" }}>Индивидуальный проект</p>
                <p className="text-xl" style={{ fontFamily: "'Cormorant',serif", color: "rgba(255,255,255,0.45)" }}>Обществознание · Психология · 10 класс</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase mb-2" style={{ fontFamily: "'IBM Plex Sans',sans-serif", letterSpacing: "0.18em", color: "rgba(255,255,255,0.2)" }}>Учебный год</p>
                <p className="text-xl" style={{ fontFamily: "'Cormorant',serif", color: "rgba(255,255,255,0.45)" }}>2025–2026</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs" style={{ fontFamily: "'IBM Plex Sans',sans-serif", color: "rgba(255,255,255,0.18)" }}>
              Индивидуальный проект · Причины преступности среди несовершеннолетних
            </p>
            <div className="flex flex-wrap gap-5">
              {NAV_ITEMS.map((item) => (
                <button key={item.id} onClick={() => scrollTo(item.id)} className="text-xs uppercase transition-colors"
                  style={{ fontFamily: "'IBM Plex Sans',sans-serif", letterSpacing: "0.12em", color: "rgba(255,255,255,0.18)" }}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}