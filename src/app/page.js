"use client";
import {
  trackImageSearch,
  trackImageFound,
  trackDownloadClick,
} from "@/lib/analytics";
import { useState } from "react";
import { useEffect } from "react";
import { translations } from "@/lib/translations";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
  ArrowDownToLine,
  ArrowRight,
  Check,
  CheckCircle2,
  Clipboard,
  Download,
  Image as ImageIcon,
  Link2,
  LoaderCircle,
  Menu,
  ShieldCheck,
  Sparkles,
  Star,
  WandSparkles,
  X,
  Zap,
  MonitorSmartphone,
  BadgeCheck,
  ChevronDown,
  Heart,
  Globe2,
  LockKeyhole,
} from "lucide-react";

// Text for these cards is translated inside the component so language switching updates immediately.
export default function Home() {
  const [url, setUrl] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pasteSuccess, setPasteSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("pinsave-language");
    const browserLanguage = navigator.language.split("-")[0];

    const selected =
      saved && translations[saved]
        ? saved
        : translations[browserLanguage]
          ? browserLanguage
          : "en";

    setLanguage(selected);
  }, []);

  useEffect(() => {
    localStorage.setItem("pinsave-language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = ["ur", "ar"].includes(language)
      ? "rtl"
      : "ltr";
  }, [language]);

  const t = translations[language] || translations.en;

  const features = [
    {
      icon: Sparkles,
      title: t.feature1Title,
      desc: t.feature1Desc,
      color: "from-rose-500 to-pink-500",
      bg: "bg-rose-50",
    },
    {
      icon: Zap,
      title: t.feature2Title,
      desc: t.feature2Desc,
      color: "from-amber-500 to-orange-500",
      bg: "bg-amber-50",
    },
    {
      icon: ShieldCheck,
      title: t.feature3Title,
      desc: t.feature3Desc,
      color: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-50",
    },
    {
      icon: MonitorSmartphone,
      title: t.feature4Title,
      desc: t.feature4Desc,
      color: "from-blue-500 to-indigo-500",
      bg: "bg-blue-50",
    },
  ];
  const steps = [
    { number: "01", icon: Link2, title: t.step1Title, desc: t.step1Desc },
    { number: "02", icon: Clipboard, title: t.step2Title, desc: t.step2Desc },
    { number: "03", icon: Download, title: t.step3Title, desc: t.step3Desc },
  ];
  const faqs = [
    { question: t.faq1Q, answer: t.faq1A },
    { question: t.faq2Q, answer: t.faq2A },
    { question: t.faq3Q, answer: t.faq3A },
    { question: t.faq4Q, answer: t.faq4A },
    { question: t.faq5Q, answer: t.faq5A },
  ];

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setError("");
      setImage(null);
      setPasteSuccess(true);
      setTimeout(() => setPasteSuccess(false), 2000);
    } catch {
      setError(t.clipboardError);
    }
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    setError("");
    setImage(null);

    if (!url.trim()) {
      setError(t.enterUrl);
      return;
    }

    setLoading(true);
    trackImageSearch();

    try {
      const response = await fetch("/api/pinterest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const responseText = await response.text();

      if (!responseText.trim()) {
        throw new Error(t.emptyResponse);
      }

      let data;

      try {
        data = JSON.parse(responseText);
        trackImageFound();
      } catch {
        throw new Error(t.invalidResponse);
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || t.downloadError);
      }

      setImage(data.data);
    } catch (err) {
      setError(err.message || t.genericError);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setUrl("");
    setImage(null);
    setError("");
  };

  return (
    <main className="min-h-screen bg-[#fafbff] text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-8">
          <a href="#home" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f43f5e] to-[#e11d48] text-white shadow-lg shadow-rose-200">
              <ImageIcon size={23} strokeWidth={2.4} />
            </div>
            <div className="leading-tight">
              <div className="text-xl font-black tracking-tight">
                Pin<span className="text-rose-600">Save</span>
              </div>
              <div className="text-[10px] font-semibold tracking-[0.16em] text-slate-400">
                {t.footerTagline}
              </div>
            </div>
          </a>

          <nav className="hidden items-center gap-9 md:flex">
            {[
              [t.home, "#home"],
              [t.features, "#features"],
              [t.howItWorks, "#how-it-works"],
              [t.faq, "#faq"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-sm font-semibold text-slate-600 transition hover:text-rose-600"
              >
                {label}
              </a>
            ))}
            <LanguageSwitcher language={language} setLanguage={setLanguage} />
          </nav>

          <a
            href="#downloader"
            className="hidden items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-rose-600 md:inline-flex"
          >
            {t.startDownloading} <ArrowRight size={16} />
          </a>

          <div className="md:hidden">
            <LanguageSwitcher language={language} setLanguage={setLanguage} />
          </div>
          <button
            type="button"
            onClick={() => setMobileMenu(!mobileMenu)}
            className="rounded-xl border border-slate-200 p-2.5 md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileMenu && (
          <nav className="flex flex-col gap-1 border-t border-slate-100 bg-white px-5 py-4 md:hidden">
            {[
              [t.home, "#home"],
              [t.features, "#features"],
              [t.howItWorks, "#how-it-works"],
              [t.faq, "#faq"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileMenu(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-rose-50"
              >
                {label}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* Hero */}
      <section
        id="home"
        className="relative isolate overflow-hidden bg-[#0f172a] pb-24 pt-20 text-white md:pb-32 md:pt-28"
      >
        <div className="pointer-events-none absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-rose-600/20 blur-[110px]" />
        <div className="pointer-events-none absolute -right-24 top-20 h-[420px] w-[420px] rounded-full bg-fuchsia-600/20 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-5 text-center lg:px-8">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-rose-100 backdrop-blur-md sm:text-sm">
            <Sparkles size={15} className="text-rose-300" />
            {t.heroBadge}
          </div>

          <h1 className="mx-auto max-w-5xl text-4xl font-black leading-[1.12] tracking-tight sm:text-5xl md:text-6xl lg:text-[72px]">
            {t.heroTitle}
            <span className="mt-2 block bg-gradient-to-r from-rose-400 via-pink-300 to-orange-300 bg-clip-text text-transparent">
              {t.heroHighlight}
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
            {t.heroDescription}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-sm font-medium text-slate-300">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={17} className="text-emerald-400" /> {t.free}
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={17} className="text-emerald-400" /> {t.hd}
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={17} className="text-emerald-400" />{" "}
              {t.noAccount}
            </span>
          </div>

          {/* Downloader Card */}
          <div
            id="downloader"
            className="mx-auto mt-12 max-w-3xl scroll-mt-28 rounded-[30px] border border-white/20 bg-white p-3 text-left shadow-[0_30px_90px_rgba(0,0,0,0.3)] sm:p-5"
          >
            <div className="rounded-[23px] border border-slate-100 bg-[#f8faff] p-5 sm:p-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                  <Link2 size={21} />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    {t.downloaderTitle}
                  </h2>
                  <p className="text-xs text-slate-500 sm:text-sm">
                    {t.pasteDescription}
                  </p>
                </div>
              </div>

              <form onSubmit={handleDownload} dir="ltr">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex min-w-0 flex-1 items-center rounded-2xl border-2 border-slate-200 bg-white px-4 transition focus-within:border-rose-400 focus-within:ring-4 focus-within:ring-rose-100">
                    <Link2 size={19} className="shrink-0 text-slate-400" />

                    <input
                      type="url"
                      value={url}
                      onChange={(e) => {
                        setUrl(e.target.value);
                        setError("");
                      }}
                      placeholder="https://www.pinterest.com/pin/..."
                      className="h-14 min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                      required
                    />

                    {url && (
                      <button
                        type="button"
                        onClick={handleClear}
                        className="mr-2 text-slate-400 hover:text-slate-700"
                        aria-label="Clear URL"
                      >
                        <X size={17} />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handlePaste}
                      className="flex shrink-0 items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
                    >
                      {pasteSuccess ? (
                        <Check size={15} />
                      ) : (
                        <Clipboard size={15} />
                      )}
                      {pasteSuccess ? t.pasted : t.paste}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#f43f5e] to-[#e11d48] text-base font-extrabold text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-rose-200 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <>
                      <LoaderCircle size={21} className="animate-spin" />
                      {t.loading}
                    </>
                  ) : (
                    <>
                      <ArrowDownToLine size={21} />
                      {t.getImage}
                      <ArrowRight size={19} />
                    </>
                  )}
                </button>
              </form>

              {error && (
                <div
                  role="alert"
                  className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                >
                  {error}
                </div>
              )}

              <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-slate-500">
                <LockKeyhole size={14} className="text-emerald-500" />
                {t.noRegistration}
                <span className="text-slate-300">•</span>
                {t.publicPins}
                <span className="text-slate-300">•</span>
                {t.easyDownloads}
              </div>
            </div>

            {/* Image Preview */}
            {image && (
              <div className="mt-4 overflow-hidden rounded-[23px] border border-slate-100 bg-white p-5 sm:p-7">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle2 size={19} />
                      <span className="text-sm font-bold">{t.imageFound}</span>
                    </div>
                    <h3 className="mt-2 text-lg font-extrabold text-slate-900">
                      {t.imageReady}
                    </h3>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
                    <BadgeCheck size={15} />
                    {image.quality || t.bestQuality}
                  </span>
                </div>

                <div className="flex justify-center rounded-2xl bg-slate-50 p-4">
                  {/* Remote image preview */}
                  <img
                    src={image.image}
                    alt={image.title || t.previewAlt}
                    className="max-h-[480px] max-w-full rounded-xl object-contain shadow-lg"
                  />
                </div>

                <p className="mt-4 line-clamp-2 text-center text-sm font-medium text-slate-600">
                  {image.title || t.readyTitle}
                </p>

                <a
                  href={image.downloadUrl}
                  onClick={trackDownloadClick}
                  className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 font-extrabold text-white transition hover:bg-rose-600"
                >
                  <Download size={20} />
                  {t.downloadImage}
                </a>
              </div>
            )}
          </div>

          <p className="mt-7 flex items-center justify-center gap-2 text-sm text-slate-400">
            <Star size={16} className="fill-amber-400 text-amber-400" />
            {t.simpleTagline}
          </p>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 px-5 py-8 md:grid-cols-4 lg:px-8">
          {[
            [Zap, t.trustQuick],
            [ImageIcon, t.trustHd],
            [ShieldCheck, t.trustSignup],
            [Globe2, t.trustAnywhere],
          ].map(([Icon, label]) => (
            <div
              key={label}
              className="flex items-center justify-center gap-2.5 text-sm font-bold text-slate-600"
            >
              <Icon size={20} className="text-rose-500" />
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-24 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-rose-600">
              <WandSparkles size={15} /> {t.whyChoose}
            </span>
            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
              {t.featuresTitle}
              <span className="block text-rose-600">{t.featuresHighlight}</span>
            </h2>
            <p className="mt-5 leading-8 text-slate-500">{t.featuresDesc}</p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.color}
                  className="group rounded-[26px] border border-slate-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/70"
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bg}`}
                  >
                    <Icon size={27} className="text-slate-800" />
                  </div>
                  <h3 className="mt-6 text-lg font-extrabold">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {feature.desc}
                  </p>
                  <div
                    className={`mt-6 h-1 w-12 rounded-full bg-gradient-to-r ${feature.color} transition-all duration-300 group-hover:w-20`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="scroll-mt-24 bg-white py-20 md:py-28"
      >
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="text-center">
            <span className="rounded-full bg-rose-50 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-rose-600">
              {t.stepsBadge}
            </span>
            <h2 className="mt-6 text-3xl font-black sm:text-4xl md:text-5xl">
              {t.stepsTitle}{" "}
              <span className="text-rose-600">{t.stepsHighlight}</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl leading-8 text-slate-500">
              {t.stepsDesc}
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative text-center">
                  <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-[30px] bg-gradient-to-br from-rose-50 to-pink-100 text-rose-600">
                    <Icon size={38} />
                    <span className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-xs font-extrabold text-white">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="mt-7 text-xl font-extrabold">{step.title}</h3>
                  <p className="mx-auto mt-3 max-w-xs text-sm leading-7 text-slate-500">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-20 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 px-6 py-16 text-center text-white shadow-2xl shadow-rose-100 sm:px-12">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full border-[45px] border-white/10" />
          <div className="absolute -bottom-24 -right-12 h-72 w-72 rounded-full border-[45px] border-white/10" />

          <div className="relative">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
              <Heart size={30} className="fill-white" />
            </div>
            <h2 className="mt-6 text-3xl font-black sm:text-4xl">
              {t.ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-8 text-rose-50">
              {t.ctaDesc}
            </p>
            <a
              href="#downloader"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-extrabold text-rose-600 shadow-lg transition hover:-translate-y-1"
            >
              {t.startDownloading} <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24 bg-white py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-5">
          <div className="text-center">
            <span className="rounded-full bg-rose-50 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-rose-600">
              {t.faqBadge}
            </span>
            <h2 className="mt-6 text-3xl font-black sm:text-4xl">
              {t.faqTitle}{" "}
              <span className="text-rose-600">{t.faqHighlight}</span>
            </h2>
          </div>

          <div className="mt-12 space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-rose-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  aria-expanded={openFaq === index}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-bold text-slate-800">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-rose-600 transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openFaq === index && (
                  <p className="px-6 pb-6 text-sm leading-7 text-slate-500">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f172a] text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3 lg:px-8">
          <div>
            <a href="#home" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-600 text-white">
                <ImageIcon size={22} />
              </div>
              <span className="text-2xl font-black text-white">
                Pin<span className="text-rose-400">Save</span>
              </span>
            </a>
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              {t.footerDesc}
            </p>
          </div>

          <div>
            <h3 className="font-extrabold text-white">{t.quickLinks}</h3>
            <div className="mt-5 flex flex-col gap-3 text-sm">
              <a href="#home" className="hover:text-white">
                {t.home}
              </a>
              <a href="#features" className="hover:text-white">
                {t.features}
              </a>
              <a href="#how-it-works" className="hover:text-white">
                {t.howItWorks}
              </a>
              <a href="#faq" className="hover:text-white">
                {t.faq}
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-extrabold text-white">{t.importantInfo}</h3>
            <p className="mt-5 text-sm leading-7 text-slate-400">
              {t.disclaimer}
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 px-5 py-6 text-center text-xs text-slate-500">
          © 2026 PinSave. {t.rights}
        </div>
      </footer>
    </main>
  );
}
