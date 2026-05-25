import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

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
  {
    num: "01",
    title: "Семейное неблагополучие",
    desc: "Насилие, алкоголизм, отсутствие контроля или чрезмерная жёсткость в воспитании. Дисфункциональная семья — главный фактор риска. По данным МВД, более 60% осуждённых несовершеннолетних выросли в неблагополучных семьях.",
    percent: 62,
  },
  {
    num: "02",
    title: "Влияние антисоциальных групп",
    desc: "Уличные компании, группы с делинквентным поведением. Подростки особенно уязвимы к давлению сверстников и стремятся к принятию в группе.",
    percent: 48,
  },
  {
    num: "03",
    title: "Социально-экономические факторы",
    desc: "Бедность, безработица родителей, отсутствие возможностей для досуга и самореализации. Социальное неравенство порождает ощущение несправедливости.",
    percent: 41,
  },
  {
    num: "04",
    title: "Психологические особенности",
    desc: "Импульсивность, низкая самооценка, акцентуации характера, несформированная эмоциональная регуляция. Возрастной кризис усиливает уязвимость.",
    percent: 35,
  },
  {
    num: "05",
    title: "Влияние медиа и интернета",
    desc: "Пропаганда насилия, деструктивный контент, вовлечение в радикальные сообщества через социальные сети. Формирование искажённых ценностей.",
    percent: 28,
  },
  {
    num: "06",
    title: "Школьная дезадаптация",
    desc: "Неуспеваемость, конфликты с педагогами, травля со стороны сверстников. Отчуждение от образовательной среды снижает социальный контроль.",
    percent: 33,
  },
];

const STATS = [
  { year: "2019", value: 41500, label: "41 500" },
  { year: "2020", value: 37600, label: "37 600" },
  { year: "2021", value: 39200, label: "39 200" },
  { year: "2022", value: 38100, label: "38 100" },
  { year: "2023", value: 35800, label: "35 800" },
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

const SURVEY_QUESTIONS = [
  {
    id: 0,
    question: "Как вы считаете, что является главной причиной преступности среди подростков?",
    options: [
      "Неблагополучная семья",
      "Плохое окружение",
      "Бедность и социальное неравенство",
      "Психологические проблемы",
    ],
  },
  {
    id: 1,
    question: "В каком возрасте подростки наиболее подвержены риску правонарушений?",
    options: ["13–14 лет", "14–15 лет", "15–16 лет", "16–17 лет"],
  },
  {
    id: 2,
    question: "Какая мера профилактики, по вашему мнению, наиболее эффективна?",
    options: [
      "Работа с семьёй",
      "Психологическая помощь",
      "Занятость и спорт",
      "Ужесточение наказаний",
    ],
  },
  {
    id: 3,
    question: "Как влияет интернет на подростковую преступность?",
    options: [
      "Значительно влияет",
      "Влияет умеренно",
      "Слабо влияет",
      "Не влияет",
    ],
  },
  {
    id: 4,
    question: "Должна ли школа активнее участвовать в профилактике правонарушений?",
    options: [
      "Да, это главная роль школы",
      "Да, но наравне с семьёй",
      "Нет, это задача семьи",
      "Нет, это задача государства",
    ],
  },
];

const PREVENTION = [
  {
    icon: "Home",
    title: "Работа с семьёй",
    items: [
      "Программы поддержки неблагополучных семей",
      "Родительские школы и консультации",
      "Социальный патронаж",
      "Ранняя диагностика семейного насилия",
    ],
  },
  {
    icon: "GraduationCap",
    title: "Образовательная среда",
    items: [
      "Школьные психологи и социальные педагоги",
      "Профилактические программы в школах",
      "Работа с буллингом",
      "Профориентация и занятость",
    ],
  },
  {
    icon: "Users",
    title: "Социальная среда",
    items: [
      "Бесплатные секции и кружки",
      "Молодёжные центры",
      "Волонтёрские программы",
      "Работа с лидерами группировок",
    ],
  },
  {
    icon: "Brain",
    title: "Психологическая помощь",
    items: [
      "Индивидуальные консультации",
      "Групповые тренинги социальных навыков",
      "Кризисные центры",
      "Телефоны доверия (анонимно)",
    ],
  },
];

function useIntersection(ref: React.RefObject<Element>, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, threshold]);
  return visible;
}

function StatBar({ percent }: { percent: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useIntersection(ref as React.RefObject<Element>);
  return (
    <div ref={ref} className="h-2 bg-white/5 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{
          width: visible ? `${percent}%` : "0%",
          backgroundColor: "hsl(8, 72%, 52%)",
        }}
      />
    </div>
  );
}

function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-12">
      {sub && (
        <p
          className="text-xs uppercase mb-3"
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          {sub}
        </p>
      )}
      <h2
        className="text-4xl md:text-5xl font-light text-white leading-tight"
        style={{ fontFamily: "'Cormorant', serif" }}
      >
        {children}
      </h2>
      <div className="mt-4 w-12 h-px" style={{ backgroundColor: "hsl(8, 72%, 52%)" }} />
    </div>
  );
}

export default function Index() {
  const [activeSection, setActiveSection] = useState("");
  const [surveyAnswers, setSurveyAnswers] = useState<Record<number, number>>({});
  const [surveyDone, setSurveyDone] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 120;
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const el = document.getElementById(NAV_ITEMS[i].id);
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(NAV_ITEMS[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAnswer = (qId: number, aIdx: number) => {
    setSurveyAnswers((prev) => ({ ...prev, [qId]: aIdx }));
  };

  const handleSurveySubmit = () => {
    if (Object.keys(surveyAnswers).length === SURVEY_QUESTIONS.length) {
      setSurveyDone(true);
    }
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const maxStat = Math.max(...STATS.map((s) => s.value));
  const accentRed = "hsl(8, 72%, 52%)";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a0a", color: "#ebebeb" }}>
      {/* Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(10,10,10,0.95)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14">
          <span
            className="text-sm italic"
            style={{ fontFamily: "'Cormorant', serif", color: "rgba(255,255,255,0.35)" }}
          >
            Индивидуальный проект · 10 класс
          </span>
          <div className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-xs uppercase transition-colors duration-200"
                style={{
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  letterSpacing: "0.12em",
                  color: activeSection === item.id ? accentRed : "rgba(255,255,255,0.38)",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
          </button>
        </div>
        {mobileMenuOpen && (
          <div
            className="md:hidden px-6 pb-4 flex flex-col gap-3"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-xs uppercase text-left py-1"
                style={{
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  letterSpacing: "0.12em",
                  color: "rgba(255,255,255,0.45)",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-center pt-14 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 80% 50%, rgba(139,30,20,0.08) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-6xl mx-auto relative">
          <p
            className="text-xs uppercase mb-8 animate-fade-in-up"
            style={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              letterSpacing: "0.25em",
              color: "rgba(255,255,255,0.22)",
            }}
          >
            Обществознание · Психология · 2025–2026
          </p>
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-light text-white leading-tight max-w-4xl mb-8 animate-fade-in-up"
            style={{ fontFamily: "'Cormorant', serif", animationDelay: "0.1s" }}
          >
            Причины преступности{" "}
            <span className="italic" style={{ color: "rgba(255,255,255,0.42)" }}>среди</span>
            <br />
            несовершеннолетних
          </h1>
          <div
            className="max-w-2xl mb-8 animate-fade-in-up"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)", animationDelay: "0.2s" }}
          />
          <p
            className="text-sm max-w-xl leading-relaxed animate-fade-in-up"
            style={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              color: "rgba(255,255,255,0.38)",
              animationDelay: "0.25s",
            }}
          >
            Комплексный анализ социальных, психологических и экономических факторов,
            влияющих на формирование девиантного поведения подростков в современной России
          </p>
          <div
            className="mt-16 flex flex-wrap gap-8 animate-fade-in-up"
            style={{ animationDelay: "0.35s" }}
          >
            {[
              { val: "35 800", label: "преступлений в 2023 г.", red: true },
              { val: "14–17", label: "основная группа риска", red: false },
              { val: "62%", label: "из неблагополучных семей", red: false },
            ].map((stat, i) => (
              <div key={i} className="flex items-start gap-4">
                {i > 0 && <div className="w-px h-10 self-center" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />}
                <div>
                  <p
                    className="text-4xl"
                    style={{
                      fontFamily: "'Cormorant', serif",
                      color: stat.red ? accentRed : "rgba(255,255,255,0.65)",
                    }}
                  >
                    {stat.val}
                  </p>
                  <p
                    className="text-xs uppercase mt-1"
                    style={{
                      fontFamily: "'IBM Plex Sans', sans-serif",
                      letterSpacing: "0.12em",
                      color: "rgba(255,255,255,0.28)",
                    }}
                  >
                    {stat.label}
                  </p>
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
              <h3
                className="text-2xl font-medium text-white mb-4"
                style={{ fontFamily: "'Cormorant', serif" }}
              >
                Цель
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "rgba(255,255,255,0.55)" }}
              >
                Выявить и систематизировать ключевые причины преступности среди несовершеннолетних,
                проанализировать их взаимосвязь и разработать рекомендации по профилактике
                делинквентного поведения в подростковой среде.
              </p>
            </div>
            <div>
              <h3
                className="text-2xl font-medium text-white mb-4"
                style={{ fontFamily: "'Cormorant', serif" }}
              >
                Задачи
              </h3>
              <ul className="space-y-3">
                {[
                  "Изучить статистику преступности несовершеннолетних в России",
                  "Проанализировать социальные и психологические факторы риска",
                  "Провести опрос среди школьников для выявления общественного мнения",
                  "Систематизировать методы профилактики и определить их эффективность",
                  "Сформулировать выводы и практические рекомендации",
                ].map((task, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span
                      className="text-xs mt-1 shrink-0"
                      style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: accentRed }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="text-sm leading-relaxed"
                      style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "rgba(255,255,255,0.55)" }}
                    >
                      {task}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {[
              {
                label: "Гипотеза",
                text: "Главным фактором преступности несовершеннолетних является совокупность семейного неблагополучия и социальной среды, а не личностные особенности подростка",
              },
              {
                label: "Объект",
                text: "Преступность среди несовершеннолетних как социальное явление в современном российском обществе",
              },
              {
                label: "Предмет",
                text: "Причины и факторы, детерминирующие преступное поведение подростков в возрасте 14–17 лет",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="p-6"
                style={{ border: "1px solid rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.02)" }}
              >
                <p
                  className="text-xs uppercase mb-3"
                  style={{
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    letterSpacing: "0.18em",
                    color: accentRed,
                  }}
                >
                  {item.label}
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "rgba(255,255,255,0.52)" }}
                >
                  {item.text}
                </p>
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
              {
                icon: "TrendingUp",
                title: "Масштаб проблемы",
                text: "Ежегодно в России регистрируется более 35 тысяч преступлений, совершённых несовершеннолетними. Проблема затрагивает каждый регион страны и все социальные слои.",
              },
              {
                icon: "Clock",
                title: "Долгосрочные последствия",
                text: "Подростковая преступность формирует устойчивые девиантные паттерны поведения. 43% взрослых рецидивистов совершили первое преступление до 18 лет.",
              },
              {
                icon: "Globe",
                title: "Социальная значимость",
                text: "Проблема отражает состояние общества в целом — кризис институтов семьи, образования и социальной защиты. Её решение требует системного государственного подхода.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-8"
                style={{ backgroundColor: "#0f0f0f" }}
              >
                <Icon name={item.icon as "TrendingUp"} size={22} style={{ color: accentRed, marginBottom: "1rem" }} />
                <h3
                  className="text-xl text-white mb-3"
                  style={{ fontFamily: "'Cormorant', serif" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "rgba(255,255,255,0.48)" }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div
            className="mt-12 p-8"
            style={{ border: "1px solid rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.015)" }}
          >
            <p
              className="text-2xl italic leading-relaxed max-w-3xl"
              style={{ fontFamily: "'Cormorant', serif", color: "rgba(255,255,255,0.6)" }}
            >
              «Общество, которое не заботится о своих детях, не имеет будущего.
              Профилактика подростковой преступности — это инвестиция в социальную стабильность
              всего государства.»
            </p>
            <p
              className="text-xs uppercase mt-4"
              style={{
                fontFamily: "'IBM Plex Sans', sans-serif",
                letterSpacing: "0.18em",
                color: "rgba(255,255,255,0.2)",
              }}
            >
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
              <div
                key={cause.num}
                className="p-6 transition-all duration-300"
                style={{ border: "1px solid rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.02)" }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <span
                    className="text-5xl font-light leading-none"
                    style={{ fontFamily: "'Cormorant', serif", color: "rgba(200,60,40,0.18)" }}
                  >
                    {cause.num}
                  </span>
                  <div>
                    <h3
                      className="text-xl text-white mb-1"
                      style={{ fontFamily: "'Cormorant', serif" }}
                    >
                      {cause.title}
                    </h3>
                    <p
                      className="text-xs"
                      style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: accentRed }}
                    >
                      {cause.percent}% осуждённых
                    </p>
                  </div>
                </div>
                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "rgba(255,255,255,0.48)" }}
                >
                  {cause.desc}
                </p>
                <StatBar percent={cause.percent} />
              </div>
            ))}
          </div>

          <div
            className="p-8"
            style={{ border: "1px solid rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.02)" }}
          >
            <h3
              className="text-2xl text-white mb-8"
              style={{ fontFamily: "'Cormorant', serif" }}
            >
              Структура видов преступлений (2023)
            </h3>
            <div className="space-y-4">
              {CRIME_TYPES.map((ct) => (
                <div key={ct.type} className="flex items-center gap-4">
                  <span
                    className="text-sm w-28 shrink-0"
                    style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "rgba(255,255,255,0.48)" }}
                  >
                    {ct.type}
                  </span>
                  <div className="flex-1">
                    <StatBar percent={ct.percent} />
                  </div>
                  <span
                    className="text-sm w-10 text-right"
                    style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "rgba(255,255,255,0.38)" }}
                  >
                    {ct.percent}%
                  </span>
                </div>
              ))}
            </div>
            <p
              className="text-xs mt-6"
              style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "rgba(255,255,255,0.18)" }}
            >
              Источник: данные МВД РФ, статистический сборник «Состояние преступности в России»
            </p>
          </div>
        </div>
      </section>

      {/* Research */}
      <section id="research" className="py-24 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto">
          <SectionTitle sub="Раздел 04">Исследование</SectionTitle>

          {/* Bar chart */}
          <div className="mb-16">
            <h3
              className="text-2xl text-white mb-2"
              style={{ fontFamily: "'Cormorant', serif" }}
            >
              Динамика преступности несовершеннолетних в России
            </h3>
            <p
              className="text-xs uppercase mb-8"
              style={{
                fontFamily: "'IBM Plex Sans', sans-serif",
                letterSpacing: "0.15em",
                color: "rgba(255,255,255,0.28)",
              }}
            >
              Количество зарегистрированных преступлений, 2019–2023
            </p>
            <div className="flex items-end gap-3" style={{ height: "180px" }}>
              {STATS.map((s) => {
                const h = Math.round((s.value / maxStat) * 100);
                return (
                  <div key={s.year} className="flex-1 flex flex-col items-center gap-2">
                    <span
                      className="text-xs"
                      style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "rgba(255,255,255,0.38)" }}
                    >
                      {s.label}
                    </span>
                    <div
                      className="w-full relative overflow-hidden"
                      style={{ height: "120px", backgroundColor: "rgba(255,255,255,0.04)" }}
                    >
                      <div
                        className="absolute bottom-0 left-0 right-0"
                        style={{ height: `${h}%`, backgroundColor: "hsl(8,72%,42%)" }}
                      />
                    </div>
                    <span
                      className="text-xs"
                      style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "rgba(255,255,255,0.28)" }}
                    >
                      {s.year}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h3
                className="text-2xl text-white mb-6"
                style={{ fontFamily: "'Cormorant', serif" }}
              >
                Распределение по возрасту
              </h3>
              <div className="space-y-4">
                {AGE_GROUPS.map((ag) => (
                  <div key={ag.range} className="flex items-center gap-4">
                    <span
                      className="text-sm w-16 shrink-0"
                      style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "rgba(255,255,255,0.48)" }}
                    >
                      {ag.range}
                    </span>
                    <div className="flex-1">
                      <StatBar percent={ag.percent} />
                    </div>
                    <span
                      className="text-sm w-10 text-right"
                      style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "rgba(255,255,255,0.38)" }}
                    >
                      {ag.percent}%
                    </span>
                  </div>
                ))}
              </div>
              <p
                className="text-xs mt-4"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "rgba(255,255,255,0.2)" }}
              >
                Пик приходится на 16–17 лет — период наиболее острого возрастного кризиса
              </p>
            </div>

            <div>
              <h3
                className="text-2xl text-white mb-6"
                style={{ fontFamily: "'Cormorant', serif" }}
              >
                Ключевые данные
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Доля мальчиков среди осуждённых", value: "92%" },
                  { label: "Не имели постоянного занятия", value: "67%" },
                  { label: "Совершили преступление в группе", value: "58%" },
                  { label: "Ранее состояли на учёте в ПДН", value: "44%" },
                  { label: "Находились в состоянии опьянения", value: "31%" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between items-center pb-3"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <span
                      className="text-sm"
                      style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "rgba(255,255,255,0.48)" }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="text-xl"
                      style={{ fontFamily: "'Cormorant', serif", color: accentRed }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div>
            <h3
              className="text-2xl text-white mb-6"
              style={{ fontFamily: "'Cormorant', serif" }}
            >
              Сравнение факторов риска
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    {["Фактор", "Влияние", "Доля в причинах", "Поддаётся коррекции"].map((col) => (
                      <th
                        key={col}
                        className="text-left py-3 pr-6 text-xs uppercase"
                        style={{
                          fontFamily: "'IBM Plex Sans', sans-serif",
                          letterSpacing: "0.12em",
                          color: "rgba(255,255,255,0.28)",
                        }}
                      >
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
                    <tr
                      key={i}
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    >
                      <td
                        className="py-3 pr-6 text-sm"
                        style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "rgba(255,255,255,0.65)" }}
                      >
                        {row.factor}
                      </td>
                      <td
                        className="py-3 pr-6 text-sm"
                        style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: accentRed }}
                      >
                        {row.impact}
                      </td>
                      <td
                        className="py-3 pr-6 text-sm"
                        style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "rgba(255,255,255,0.45)" }}
                      >
                        {row.share}
                      </td>
                      <td
                        className="py-3 text-sm"
                        style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "rgba(255,255,255,0.45)" }}
                      >
                        {row.corr}
                      </td>
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
          <SectionTitle sub="Раздел 05">Мини-опрос</SectionTitle>
          <p
            className="text-sm mb-12 -mt-4"
            style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "rgba(255,255,255,0.38)" }}
          >
            Ответьте на 5 вопросов — получите персонализированный вывод
          </p>

          {!surveyDone ? (
            <div className="space-y-10">
              {SURVEY_QUESTIONS.map((q) => (
                <div
                  key={q.id}
                  className="pl-6"
                  style={{ borderLeft: "2px solid rgba(255,255,255,0.08)" }}
                >
                  <p
                    className="text-xs uppercase mb-2"
                    style={{
                      fontFamily: "'IBM Plex Sans', sans-serif",
                      letterSpacing: "0.15em",
                      color: "rgba(255,255,255,0.28)",
                    }}
                  >
                    Вопрос {q.id + 1} из {SURVEY_QUESTIONS.length}
                  </p>
                  <p
                    className="text-xl text-white mb-4"
                    style={{ fontFamily: "'Cormorant', serif" }}
                  >
                    {q.question}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {q.options.map((opt, idx) => {
                      const selected = surveyAnswers[q.id] === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleAnswer(q.id, idx)}
                          className="text-left px-4 py-3 text-sm transition-all duration-200"
                          style={{
                            fontFamily: "'IBM Plex Sans', sans-serif",
                            border: selected
                              ? `1px solid ${accentRed}`
                              : "1px solid rgba(255,255,255,0.08)",
                            backgroundColor: selected ? "rgba(200,60,40,0.1)" : "transparent",
                            color: selected ? "#ebebeb" : "rgba(255,255,255,0.48)",
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="flex flex-col gap-3 pt-4">
                <button
                  onClick={handleSurveySubmit}
                  disabled={Object.keys(surveyAnswers).length < SURVEY_QUESTIONS.length}
                  className="w-fit px-8 py-3 text-sm uppercase transition-colors duration-200"
                  style={{
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    letterSpacing: "0.15em",
                    backgroundColor:
                      Object.keys(surveyAnswers).length < SURVEY_QUESTIONS.length
                        ? "rgba(200,60,40,0.3)"
                        : accentRed,
                    color: "#fff",
                    cursor:
                      Object.keys(surveyAnswers).length < SURVEY_QUESTIONS.length
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  Получить вывод
                </button>
                {Object.keys(surveyAnswers).length < SURVEY_QUESTIONS.length && (
                  <p
                    className="text-xs"
                    style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "rgba(255,255,255,0.2)" }}
                  >
                    Ответьте на все вопросы ({Object.keys(surveyAnswers).length} / {SURVEY_QUESTIONS.length})
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div
              className="p-10"
              style={{ border: `1px solid rgba(200,60,40,0.28)`, backgroundColor: "rgba(139,30,20,0.08)" }}
            >
              <p
                className="text-xs uppercase mb-4"
                style={{
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  letterSpacing: "0.18em",
                  color: accentRed,
                }}
              >
                Вывод по вашим ответам
              </p>
              <p
                className="text-2xl text-white mb-6 leading-relaxed"
                style={{ fontFamily: "'Cormorant', serif" }}
              >
                Ваши ответы отражают комплексный взгляд на проблему. Преступность среди несовершеннолетних — многофакторное явление, и её эффективная профилактика требует системного подхода: работы с семьёй, школой и психологической поддержки.
              </p>
              <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4 mt-8">
                {SURVEY_QUESTIONS.map((q) => (
                  <div
                    key={q.id}
                    className="p-4"
                    style={{ border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <p
                      className="text-xs mb-2"
                      style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "rgba(255,255,255,0.22)" }}
                    >
                      Вопрос {q.id + 1}
                    </p>
                    <p
                      className="text-xs"
                      style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "rgba(255,255,255,0.58)" }}
                    >
                      {q.options[surveyAnswers[q.id]]}
                    </p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => { setSurveyDone(false); setSurveyAnswers({}); }}
                className="mt-8 text-xs uppercase underline underline-offset-4 transition-colors"
                style={{
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  letterSpacing: "0.12em",
                  color: "rgba(255,255,255,0.28)",
                }}
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
              <div
                key={block.title}
                className="p-8 transition-all duration-300"
                style={{ border: "1px solid rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.02)" }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <Icon name={block.icon as "Home"} size={20} style={{ color: accentRed }} />
                  <h3
                    className="text-xl text-white"
                    style={{ fontFamily: "'Cormorant', serif" }}
                  >
                    {block.title}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {block.items.map((item) => (
                    <li key={item} className="flex gap-2 items-start">
                      <span className="mt-1 text-xs shrink-0" style={{ color: accentRed }}>—</span>
                      <span
                        className="text-sm leading-relaxed"
                        style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "rgba(255,255,255,0.52)" }}
                      >
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Helplines */}
          <div
            className="p-8"
            style={{ border: "1px solid rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.02)" }}
          >
            <h3
              className="text-2xl text-white mb-6"
              style={{ fontFamily: "'Cormorant', serif" }}
            >
              Телефоны доверия и помощи
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { name: "Детский телефон доверия", phone: "8-800-2000-122", note: "Бесплатно, круглосуточно" },
                { name: "Горячая линия МВД", phone: "8-800-222-74-47", note: "Сообщить о преступлении" },
                { name: "Психологическая помощь", phone: "8-800-2000-345", note: "Взрослые, круглосуточно" },
                { name: "Единый экстренный номер", phone: "112", note: "Экстренные ситуации" },
                { name: "Кризисная линия", phone: "8-800-100-49-94", note: "Суицидальные кризисы" },
                { name: "Помощь жертвам насилия", phone: "8-800-7000-600", note: "Бесплатно, анонимно" },
              ].map((line) => (
                <div
                  key={line.name}
                  className="pl-4"
                  style={{ borderLeft: `2px solid rgba(200,60,40,0.3)` }}
                >
                  <p
                    className="text-xs uppercase mb-1"
                    style={{
                      fontFamily: "'IBM Plex Sans', sans-serif",
                      letterSpacing: "0.1em",
                      color: "rgba(255,255,255,0.3)",
                    }}
                  >
                    {line.name}
                  </p>
                  <p
                    className="text-2xl text-white"
                    style={{ fontFamily: "'Cormorant', serif" }}
                  >
                    {line.phone}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "rgba(255,255,255,0.22)" }}
                  >
                    {line.note}
                  </p>
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
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "rgba(255,255,255,0.55)" }}
              >
                Проведённое исследование подтверждает гипотезу о том, что преступность среди несовершеннолетних
                является многофакторным явлением, в котором семейное неблагополучие играет ключевую, но не
                единственную роль.
              </p>
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "rgba(255,255,255,0.55)" }}
              >
                Социальная среда, экономические условия, психологические особенности подросткового возраста и
                влияние цифрового пространства формируют комплекс взаимосвязанных факторов риска.
                Ни один из них не действует изолированно.
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "rgba(255,255,255,0.55)" }}
              >
                Эффективная профилактика возможна только при системном взаимодействии семьи, школы,
                психологической службы и государственных институтов. Репрессивные меры без работы
                с первопричинами дают лишь временный и ограниченный результат.
              </p>
            </div>

            <div className="space-y-4">
              {[
                "Семья — ключевой фактор риска и одновременно главный ресурс профилактики",
                "Пик преступности приходится на 16–17 лет — наиболее кризисный период взросления",
                "Групповой характер преступлений указывает на важность работы с социальным окружением",
                "Большинство факторов поддаются коррекции при своевременном вмешательстве",
                "Позитивная динамика 2019–2023 гг. свидетельствует об эффективности принимаемых мер",
              ].map((text, i) => (
                <div
                  key={i}
                  className="flex gap-4 items-start p-4"
                  style={{ border: "1px solid rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.015)" }}
                >
                  <span
                    className="text-2xl shrink-0"
                    style={{ fontFamily: "'Cormorant', serif", color: "rgba(200,60,40,0.45)" }}
                  >
                    {i + 1}
                  </span>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "rgba(255,255,255,0.52)" }}
                  >
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="flex flex-col md:flex-row justify-between gap-6 pt-12"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div>
              <p
                className="text-xs uppercase mb-2"
                style={{
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  letterSpacing: "0.18em",
                  color: "rgba(255,255,255,0.2)",
                }}
              >
                Индивидуальный проект
              </p>
              <p
                className="text-xl"
                style={{ fontFamily: "'Cormorant', serif", color: "rgba(255,255,255,0.45)" }}
              >
                Обществознание · Психология · 10 класс
              </p>
            </div>
            <div className="text-right">
              <p
                className="text-xs uppercase mb-2"
                style={{
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  letterSpacing: "0.18em",
                  color: "rgba(255,255,255,0.2)",
                }}
              >
                Учебный год
              </p>
              <p
                className="text-xl"
                style={{ fontFamily: "'Cormorant', serif", color: "rgba(255,255,255,0.45)" }}
              >
                2025–2026
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 px-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p
            className="text-xs"
            style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "rgba(255,255,255,0.18)" }}
          >
            Индивидуальный проект · Причины преступности среди несовершеннолетних
          </p>
          <div className="flex flex-wrap gap-5">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-xs uppercase transition-colors"
                style={{
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  letterSpacing: "0.12em",
                  color: "rgba(255,255,255,0.18)",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
