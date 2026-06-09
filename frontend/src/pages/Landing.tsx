import { motion } from "framer-motion";
import {
  Brain,
  FileText,
  TrendingUp,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Zap,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#070B1A] text-white overflow-x-hidden">

      {/* Background Glow Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-800/10 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6 border-b border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">CareerAI</h1>
            <p className="text-gray-500 text-xs">AI Career Assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-gray-400 hover:text-white transition-all px-4 py-2 text-sm font-medium"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-violet-500/25"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 md:px-12 pt-20 md:pt-32 pb-20 text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 text-violet-400 px-4 py-2 rounded-full text-sm font-medium mb-8"
        >
          <Zap className="w-4 h-4" />
          Powered by Gemini AI
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight max-w-4xl mx-auto"
        >
          Build Your{" "}
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Dream Career
          </span>{" "}
          with AI
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-400 mt-6 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          Upload your resume and get instant ATS score, skill gap analysis,
          personalized improvement suggestions, and AI-generated interview questions.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <Link
            to="/register"
            className="group flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl shadow-violet-500/30 w-full sm:w-auto justify-center"
          >
            Start for Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/login"
            className="flex items-center gap-2 border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all px-8 py-4 rounded-2xl font-semibold text-lg w-full sm:w-auto justify-center"
          >
            Sign In
          </Link>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10 text-sm text-gray-500"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            No credit card required
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            Instant AI analysis
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            Free to use
          </div>
        </motion.div>

      </section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative z-10 px-6 md:px-12 py-12"
      >
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "95%", label: "ATS Accuracy" },
            { value: "3x", label: "More Interviews" },
            { value: "10s", label: "Analysis Speed" },
            { value: "100%", label: "AI Powered" },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="relative z-10 px-6 md:px-12 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Everything you need to</h2>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent mt-1">
            land your dream job
          </h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            Our AI-powered platform gives you all the tools to stand out and succeed.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              icon: FileText,
              color: "from-violet-500 to-purple-600",
              glow: "violet",
              title: "Resume Analysis",
              description: "Get instant ATS score, identify missing keywords, and receive detailed improvement suggestions tailored to your target role.",
              features: ["ATS Score (0-100)", "Missing Keywords", "Skill Gap Analysis"],
            },
            {
              icon: Brain,
              color: "from-indigo-500 to-blue-600",
              glow: "indigo",
              title: "AI Interview Prep",
              description: "Practice with AI-generated interview questions based on your actual resume. Technical, HR, and behavioral questions with difficulty levels.",
              features: ["Technical Questions", "HR & Behavioral", "Difficulty Levels"],
            },
            {
              icon: TrendingUp,
              color: "from-emerald-500 to-teal-600",
              glow: "emerald",
              title: "Career Insights",
              description: "Track your resume improvement over time. See how your ATS score grows with each upload and identify patterns in your career development.",
              features: ["Score History", "Progress Tracking", "Improvement Tips"],
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="group bg-[#111827] border border-[#1F2937] hover:border-violet-500/30 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">{feature.description}</p>

              <ul className="space-y-2">
                {feature.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 px-6 md:px-12 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">How it works</h2>
            <p className="text-gray-400 mt-4">Get your resume analyzed in 3 simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Upload Resume", desc: "Upload your PDF resume securely to our platform." },
              { step: "02", title: "AI Analysis", desc: "Our Gemini AI analyzes your resume instantly for ATS compatibility." },
              { step: "03", title: "Get Results", desc: "Receive detailed score, keywords, gaps, and improvement suggestions." },
            ].map((item, i) => (
              <div key={i} className="relative text-center">
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-violet-500/50 to-transparent" />
                )}
                <div className="w-16 h-16 bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-violet-400 font-bold text-lg">{item.step}</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 px-6 md:px-12 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">What users say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Priya S.", role: "Software Engineer", text: "My ATS score jumped from 45 to 82 after following the suggestions. Got 3 interview calls in a week!", stars: 5 },
              { name: "Arjun M.", role: "Full Stack Developer", text: "The interview questions were spot on. They asked almost the same questions in my actual interview!", stars: 5 },
              { name: "Sneha R.", role: "Data Analyst", text: "The skill gap analysis helped me understand exactly what to learn next. Super useful tool!", stars: 5 },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="bg-[#111827] border border-[#1F2937] rounded-3xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.stars)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 md:px-12 py-20">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/30 rounded-3xl p-10 md:p-16">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to get hired?</h2>
          <p className="text-gray-400 mb-8 text-lg">
            Join thousands of job seekers who improved their resume with CareerAI.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all px-10 py-4 rounded-2xl font-semibold text-lg shadow-xl shadow-violet-500/30"
          >
            Start for Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-gray-600 text-sm mt-4">No credit card required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 md:px-12 py-8 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold">CareerAI</span>
        </div>
       
       
      </footer>

    </div>
  );
}