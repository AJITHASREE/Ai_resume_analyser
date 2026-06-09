import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, CheckCircle, AlertCircle } from "lucide-react";

interface Resume {
  id: number;
  filename: string;
  uploadTime: string;
  atsScore: number;
  missingKeywords: string;
  skillGaps: string;
  suggestions: string;
}

interface AnalysisResult {
  atsScore: number;
  missingKeywords: string[];
  skillGaps: string[];
  suggestions: string[];
}

export default function MyResumes() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    fetchMyResumes(token);
  }, [navigate]);

  const fetchMyResumes = async (token: string) => {
    try {
      const res = await fetch("${import.meta.env.VITE_API_URL}/api/resume/my-resumes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch resumes.");
      const data = await res.json();
      setResumes(data.reverse()); // Latest first
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const viewAnalysis = (resume: Resume) => {
    setSelectedResume(resume);
    try {
      const parsed: AnalysisResult = {
        atsScore: resume.atsScore,
        missingKeywords: JSON.parse(resume.missingKeywords || "[]"),
        skillGaps: JSON.parse(resume.skillGaps || "[]"),
        suggestions: JSON.parse(resume.suggestions || "[]"),
      };
      setAnalysis(parsed);
    } catch (e) {
      setError("Could not load analysis for this resume.");
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-[#070B1A] text-white p-4 md:p-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-all"
        >
          <ArrowLeft size={20} /> Back
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">My Resume History</h1>
          <p className="text-gray-400 mt-1 text-sm hidden sm:block">View all your uploaded resumes and analyses</p>
        </div>
      </div>

      {loading && <p className="text-gray-400">Loading your resumes...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!selectedResume ? (
        <>
          {/* List of Resumes */}
          <div className="space-y-3 md:space-y-4">
            {resumes.length === 0 ? (
              <div className="bg-[#111827] rounded-3xl p-8 border border-[#1F2937] text-center">
                <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No resumes uploaded yet.</p>
              </div>
            ) : (
              resumes.map((resume) => (
                <div
                  key={resume.id}
                  onClick={() => viewAnalysis(resume)}
                  className="bg-[#111827] rounded-2xl md:rounded-3xl p-4 md:p-6 border border-[#1F2937] hover:border-violet-500/30 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="bg-violet-500/20 p-3 rounded-xl flex-shrink-0">
                        <FileText className="text-violet-400 w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate text-sm md:text-base">{resume.filename}</p>
                        <p className="text-gray-500 text-xs md:text-sm">
                          {new Date(resume.uploadTime).toLocaleDateString()} • {new Date(resume.uploadTime).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-2xl md:text-3xl font-bold ${getScoreColor(resume.atsScore)}`}>
                        {resume.atsScore}
                      </p>
                      <p className="text-gray-500 text-xs">ATS Score</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <>
          {/* Back to List */}
          <button
            onClick={() => { setSelectedResume(null); setAnalysis(null); }}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-all mb-6"
          >
            <ArrowLeft size={18} /> Back to List
          </button>

          {/* Resume Details */}
          <div className="bg-[#111827] rounded-3xl p-6 border border-[#1F2937] mb-6">
            <div className="flex items-center gap-3">
              <FileText className="text-violet-400 w-6 h-6" />
              <div>
                <p className="font-bold text-lg">{selectedResume.filename}</p>
                <p className="text-gray-500 text-sm">
                  {new Date(selectedResume.uploadTime).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {analysis && (
            <div className="space-y-6">

              {/* ATS Score */}
              <div className="bg-[#111827] rounded-3xl p-6 border border-[#1F2937]">
                <h3 className="text-xl font-bold mb-4">ATS Score</h3>
                <div className="flex items-center gap-6">
                  <span className={`text-6xl font-bold ${getScoreColor(analysis.atsScore)}`}>
                    {analysis.atsScore}
                  </span>
                  <div className="flex-1">
                    <div className="w-full bg-gray-700 rounded-full h-4">
                      <div
                        className={`h-4 rounded-full ${getScoreBg(analysis.atsScore)}`}
                        style={{ width: `${analysis.atsScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Missing Keywords */}
              {analysis.missingKeywords.length > 0 && (
                <div className="bg-[#111827] rounded-3xl p-6 border border-[#1F2937]">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <AlertCircle className="text-red-400 w-5 h-5" /> Missing Keywords
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {analysis.missingKeywords.map((keyword, i) => (
                      <span key={i} className="bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-xl text-sm font-medium">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Skill Gaps */}
              {analysis.skillGaps.length > 0 && (
                <div className="bg-[#111827] rounded-3xl p-6 border border-[#1F2937]">
                  <h3 className="text-xl font-bold mb-4">Skill Gaps</h3>
                  <ul className="space-y-3">
                    {analysis.skillGaps.map((gap, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-300">
                        <span className="text-yellow-400 mt-1">⚠</span>
                        {gap}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggestions */}
              {analysis.suggestions.length > 0 && (
                <div className="bg-[#111827] rounded-3xl p-6 border border-[#1F2937]">
                  <h3 className="text-xl font-bold mb-4">Improvement Suggestions</h3>
                  <ul className="space-y-4">
                    {analysis.suggestions.map((suggestion, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-300">
                        <span className="bg-violet-500/20 text-violet-400 rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {i + 1}
                        </span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          )}
        </>
      )}

    </div>
  );
}