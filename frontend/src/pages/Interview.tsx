import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, FileText } from "lucide-react";

interface Resume {
  id: number;
  filename: string;
  uploadTime: string;
}

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

  const [loading, setLoading] = useState(false);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [data, setData] = useState<InterviewData | null>(null);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState<
    "technical" | "hr" | "behavioral"
  >("technical");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchResumes(token);
  }, [navigate]);

  const fetchResumes = async (token: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/resume/my-resumes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch resumes");
      }

      const result = await res.json();

      setResumes(result.reverse());
    } catch (err: any) {
      setError(err.message);
    }
  };

  const loadInterviewQuestions = async (resume: Resume) => {
    const token = localStorage.getItem("token");

    if (!token) return;

    setSelectedResume(resume);
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/resume/interview/${resume.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to generate questions");
      }

      const text = await res.text();

      const clean = text
        .replaceAll("```json", "")
        .replaceAll("```", "")
        .trim();

      const parsed = JSON.parse(clean);

      if (
        parsed.technical &&
        parsed.hr &&
        parsed.behavioral
      ) {
        setData(parsed);
      } else if (parsed.error) {
        throw new Error(parsed.error);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const difficultyColor = (difficulty: string) => {
    if (difficulty === "Easy")
      return "bg-green-500/20 text-green-400 border-green-500/30";

    if (difficulty === "Medium")
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";

    return "bg-red-500/20 text-red-400 border-red-500/30";
  };

  const tabs = [
    {
      key: "technical",
      label: "Technical",
      emoji: "💻",
    },
    {
      key: "hr",
      label: "HR",
      emoji: "🤝",
    },
    {
      key: "behavioral",
      label: "Behavioral",
      emoji: "🧠",
    },
  ];

  const currentQuestions =
    data?.[activeTab as keyof InterviewData] ?? [];

  return (
    <div className="min-h-screen bg-[#070B1A] text-white p-4 md:p-6">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-400 hover:text-white"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div>
          <h1 className="text-3xl font-bold">
            Interview Preparation
          </h1>

          <p className="text-gray-400">
            Select a resume to generate questions
          </p>
        </div>
      </div>

      {/* Resume List */}
      {!selectedResume && (
        <div className="space-y-4">
          {resumes.length === 0 ? (
            <div className="bg-[#111827] p-6 rounded-3xl">
              No resumes uploaded yet.
            </div>
          ) : (
            resumes.map((resume) => (
              <div
                key={resume.id}
                onClick={() =>
                  loadInterviewQuestions(resume)
                }
                className="bg-[#111827] p-5 rounded-3xl border border-[#1F2937] hover:border-violet-500/30 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <FileText className="text-violet-400" />

                  <div>
                    <p className="font-semibold">
                      {resume.filename}
                    </p>

                    <p className="text-gray-500 text-sm">
                      {new Date(
                        resume.uploadTime
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-[#111827] p-6 rounded-3xl flex items-center gap-4">
          <Loader2 className="animate-spin text-violet-400" />
          <span>
            Generating interview questions...
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-5 text-red-400">
          {error}
        </div>
      )}

      {/* Questions */}
      {selectedResume && data && !loading && (
        <>
          <button
            onClick={() => {
              setSelectedResume(null);
              setData(null);
            }}
            className="mb-6 text-gray-400 hover:text-white"
          >
            ← Back To Resume List
          </button>

          <div className="flex gap-3 mb-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() =>
                  setActiveTab(tab.key as any)
                }
                className={`px-5 py-3 rounded-2xl font-semibold ${
                  activeTab === tab.key
                    ? "bg-violet-600"
                    : "bg-[#111827]"
                }`}
              >
                {tab.emoji} {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {currentQuestions.map((q, i) => (
              <div
                key={i}
                className="bg-[#111827] rounded-3xl p-6 border border-[#1F2937]"
              >
                <div className="flex justify-between gap-4">
                  <div className="flex gap-4">
                    <span className="bg-violet-500/20 text-violet-400 rounded-full w-8 h-8 flex items-center justify-center">
                      {i + 1}
                    </span>

                    <p>{q.question}</p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full border text-xs font-semibold ${difficultyColor(
                      q.difficulty
                    )}`}
                  >
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