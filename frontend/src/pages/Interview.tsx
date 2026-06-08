import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";

interface Question {
  question: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

interface InterviewData {
  technical: Question[];
  hr: Question[];
  behavioral: Question[];
}

export default function Interview() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<InterviewData | null>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"technical" | "hr" | "behavioral">("technical");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    // ✅ Fetch latest resume from backend instead of localStorage
    fetchLatestResume(token);
  }, [navigate]);

  const fetchLatestResume = async (token: string) => {
    try {
      const res = await fetch("http://localhost:8080/api/resume/latest", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("No resume found. Please upload a resume first.");
      const resume = await res.json();
      fetchQuestions(token, resume.id.toString());
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchQuestions = async (token: string, resumeId: string) => {
    try {
      const res = await fetch(`http://localhost:8080/api/resume/interview/${resumeId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch questions.");
      const text = await res.text();
      setData(JSON.parse(text));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const difficultyColor = (difficulty: string) => {
    if (difficulty === "Easy") return "bg-green-500/20 text-green-400 border-green-500/30";
    if (difficulty === "Medium") return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    return "bg-red-500/20 text-red-400 border-red-500/30";
  };

  const tabs = [
    { key: "technical", label: "Technical", emoji: "💻" },
    { key: "hr", label: "HR", emoji: "🤝" },
    { key: "behavioral", label: "Behavioral", emoji: "🧠" },
  ];

  const currentQuestions = data ? data[activeTab as keyof InterviewData] : [];

  return (
    <div className="min-h-screen bg-[#070B1A] text-white p-4 md:p-6">

      {/* Header */}
      <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1 md:gap-2 text-gray-400 hover:text-white transition-all flex-shrink-0"
        >
          <ArrowLeft size={20} />
          <span className="hidden sm:inline">Back</span>
        </button>
        <div>
          <h1 className="text-xl md:text-3xl font-bold">Interview Preparation</h1>
          <p className="text-gray-400 mt-0.5 text-sm hidden sm:block">
            AI-generated questions based on your resume
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-4 bg-[#111827] rounded-3xl p-6 md:p-8 border border-violet-500/30">
          <Loader2 className="text-violet-400 animate-spin w-7 h-7 md:w-8 md:h-8 flex-shrink-0" />
          <div>
            <h3 className="text-lg md:text-xl font-bold">Generating interview questions...</h3>
            <p className="text-gray-400 mt-1 text-sm">AI is preparing questions from your resume.</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-5 md:p-6 text-red-400 text-sm md:text-base">
          <p>{error}</p>
          {error.includes("upload") && (
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-3 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            >
              Go Upload Resume
            </button>
          )}
        </div>
      )}

      {/* Questions */}
      {data && (
        <>
          {/* Tabs */}
          <div className="flex gap-2 md:gap-3 mb-5 md:mb-6 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-2xl font-semibold transition-all text-sm md:text-base whitespace-nowrap ${
                  activeTab === tab.key
                    ? "bg-violet-600 text-white"
                    : "bg-[#111827] text-gray-400 hover:text-white border border-[#1F2937]"
                }`}
              >
                {tab.emoji} {tab.label}
              </button>
            ))}
          </div>

          {/* Question Cards */}
          <div className="space-y-3 md:space-y-4">
            {currentQuestions.map((q, i) => (
              <div
                key={i}
                className="bg-[#111827] rounded-2xl md:rounded-3xl p-5 md:p-6 border border-[#1F2937] hover:border-violet-500/30 transition-all"
              >
                <div className="flex items-start justify-between gap-3 md:gap-4">
                  <div className="flex items-start gap-3 md:gap-4">
                    <span className="bg-violet-500/20 text-violet-400 rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center font-bold text-xs md:text-sm flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-gray-200 text-sm md:text-lg leading-relaxed">{q.question}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 md:px-3 py-1 rounded-full border flex-shrink-0 ${difficultyColor(q.difficulty)}`}>
                    {q.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}