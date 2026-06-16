import { Upload, FileText, LogOut, Loader2, ChevronDown, BrainCircuit, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import.meta.env.VITE_API_URL;

interface AnalysisResult {
  atsScore: number;
  missingKeywords: string[];
  skillGaps: string[];
  suggestions: string[];
  error?: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadStep, setUploadStep] = useState<"idle" | "uploading" | "analyzing" | "done">("idle");
  const [resume, setResume] = useState<any>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [resumeHistory, setResumeHistory] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    const payload = JSON.parse(atob(token.split(".")[1]));
    setUserEmail(payload.sub);
    fetchResumeHistory(token);
  }, [navigate]);

  const fetchResumeHistory = async (token: string) => {
    try {
     // ✅ Replace with
const res = await fetch(`${import.meta.env.VITE_API_URL}/api/resume/my-resumes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setResumeHistory(data.reverse());
    } catch (err) {
      console.error("Failed to fetch history");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      return;
    }

    setError("");
    setAnalysis(null);
    setUploading(true);
    setUploadStep("uploading");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch(`${import.meta.env.VITE_API_URL}/api/resume/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Upload failed. Check your token or server.");

      const uploadedResume = await uploadRes.json();
      setResume(uploadedResume);
      setUploading(false);
      setUploadStep("analyzing");
      setAnalyzing(true);

const analyzeRes = await fetch(
  `${import.meta.env.VITE_API_URL}/api/resume/analyze/${uploadedResume.id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!analyzeRes.ok) throw new Error("Analysis failed.");

      // ✅ Parse the resume object returned from backend
      const resumeData = await analyzeRes.json();

 const safeParse = (value: any) => {
  if (!value || value === 'null') return [];
  if (Array.isArray(value)) return value;
  try { return JSON.parse(value) || []; } 
  catch { return []; }
};

const analysisJson: AnalysisResult = {
  atsScore: resumeData.atsScore || 0,
  missingKeywords: safeParse(resumeData.missingKeywords),
  skillGaps: safeParse(resumeData.skillGaps),
  suggestions: safeParse(resumeData.suggestions),
};



     if (analysisJson.atsScore === undefined || analysisJson.atsScore === null) {
    throw new Error("Analysis failed. Please try again.");
}

      setAnalysis(analysisJson);
      localStorage.setItem("resumeId", uploadedResume.id.toString());
      setUploadStep("done");

      if (token) fetchResumeHistory(token);

    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setUploadStep("idle");
    } finally {
      setUploading(false);
      setAnalyzing(false);
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
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-xl md:text-3xl font-bold">AI Career Assistant</h1>
          <p className="text-gray-400 mt-1 text-sm md:text-base hidden sm:block">
            Upload your resume to start AI-powered analysis
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => navigate("/interview")}
            className="hidden sm:flex bg-indigo-600 hover:bg-indigo-500 transition-all px-4 md:px-6 py-2 md:py-3 rounded-2xl font-semibold text-sm md:text-base items-center gap-2"
          >
            <span className="hidden md:inline">Prepare for</span> Interview
          </button>

          <button
            onClick={() => navigate("/my-resumes")}
            className="hidden sm:flex bg-gray-700 hover:bg-gray-600 transition-all px-4 md:px-6 py-2 md:py-3 rounded-2xl font-semibold text-sm md:text-base items-center gap-2"
          >
           History
          </button>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-all px-2 md:px-3 py-2 rounded-2xl"
            >
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center font-bold text-sm">
                {userEmail ? userEmail[0].toUpperCase() : "A"}
              </div>
              <ChevronDown
                size={16}
                className={`text-gray-300 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#1F2937] border border-white/10 rounded-2xl shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm text-gray-400">Signed in as</p>
                  <p className="text-sm font-semibold text-white truncate">{userEmail}</p>
                </div>
                <button
                  onClick={() => { setDropdownOpen(false); navigate("/interview"); }}
                  className="sm:hidden w-full flex items-center gap-3 px-4 py-3 text-sm text-indigo-400 hover:bg-indigo-500/10 transition-all"
                >
                  🎯 Prepare for Interview
                </button>
                <button
                  onClick={() => { setDropdownOpen(false); navigate("/my-resumes"); }}
                  className="sm:hidden w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/10 transition-all"
                >
                   History
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading Steps */}
      {(uploadStep === "uploading" || uploadStep === "analyzing") && (
        <div className="mb-6 bg-[#111827] rounded-3xl p-6 border border-violet-500/30">
          <h3 className="text-lg font-bold mb-4">Processing your resume...</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {uploadStep === "uploading" ? (
                <Loader2 className="text-violet-400 animate-spin w-5 h-5 flex-shrink-0" />
              ) : (
                <CheckCircle className="text-green-400 w-5 h-5 flex-shrink-0" />
              )}
              <p className={`font-medium text-sm ${uploadStep === "uploading" ? "text-violet-400" : "text-green-400"}`}>
                {uploadStep === "uploading" ? "Uploading PDF..." : "PDF Uploaded ✓"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {uploadStep === "analyzing" ? (
                <Loader2 className="text-violet-400 animate-spin w-5 h-5 flex-shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-600 flex-shrink-0" />
              )}
              <div>
                <p className={`font-medium text-sm ${uploadStep === "analyzing" ? "text-violet-400" : "text-gray-500"}`}>
                  {uploadStep === "analyzing" ? "AI is analyzing your resume..." : "AI Analysis"}
                </p>
                {uploadStep === "analyzing" && (
                  <p className="text-gray-500 text-xs mt-0.5">This takes about 10–15 seconds</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-gray-600 flex-shrink-0" />
              <p className="font-medium text-sm text-gray-500">Generating results</p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Section */}
      {uploadStep === "idle" && (
        <div className="bg-[#111827] border border-dashed border-violet-500 rounded-3xl p-8 md:p-10 text-center">
          <div className="flex justify-center">
            <div className="bg-violet-500/20 p-4 md:p-5 rounded-full">
              <Upload className="w-8 h-8 md:w-10 md:h-10 text-violet-400" />
            </div>
          </div>
          <h2 className="text-xl md:text-2xl font-bold mt-5">Upload Resume</h2>
          <p className="text-gray-400 mt-3 max-w-xl mx-auto text-sm md:text-base">
            Upload your PDF resume and get ATS score, skill analysis, and improvement suggestions.
          </p>
          <input type="file" accept=".pdf" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || analyzing}
            className="mt-6 md:mt-8 bg-violet-600 hover:bg-violet-500 transition-all px-8 py-4 rounded-2xl font-semibold disabled:opacity-50 text-sm md:text-base"
          >
            Choose File
          </button>
          {error && (
            <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 max-w-lg mx-auto">
              <p className="text-yellow-400 text-sm">{error}</p>
            </div>
          )}
          <p className="text-gray-500 text-sm mt-4">Supported formats: PDF only (Resume)</p>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && uploadStep === "done" && (
        <div className="mt-6 space-y-4 md:space-y-6">
          <div className="bg-green-500/10 border border-green-500/30 rounded-3xl p-4 flex items-center gap-3">
            <CheckCircle className="text-green-400 w-5 h-5 flex-shrink-0" />
            <div>
              <p className="text-green-400 font-semibold text-sm">Analysis Complete!</p>
              <p className="text-gray-400 text-xs mt-0.5">{resume?.filename}</p>
            </div>
            <button
              onClick={() => { setUploadStep("idle"); setAnalysis(null); setResume(null); setError(""); }}
              className="ml-auto text-sm font-semibold text-gray-300 hover:text-white border border-gray-600 hover:border-white px-3 py-1.5 rounded-xl transition-all"
            >
              Upload New
            </button>
          </div>

          {/* ATS Score */}
          <div className="bg-[#111827] rounded-3xl p-6 md:p-8 border border-[#1F2937]">
            <h3 className="text-lg md:text-xl font-bold mb-4">ATS Score</h3>
            <div className="flex items-center gap-4 md:gap-6">
              <span className={`text-5xl md:text-6xl font-bold ${getScoreColor(analysis.atsScore)}`}>
                {analysis.atsScore}
              </span>
              <div className="flex-1">
                <div className="w-full bg-gray-700 rounded-full h-3 md:h-4">
                  <div
                    className={`h-3 md:h-4 rounded-full transition-all duration-1000 ${getScoreBg(analysis.atsScore)}`}
                    style={{ width: `${analysis.atsScore}%` }}
                  />
                </div>
                <p className="text-gray-400 text-xs md:text-sm mt-2">
                  {analysis.atsScore >= 80 ? "Excellent! Your resume is ATS friendly."
                    : analysis.atsScore >= 60 ? "Good, but some improvements needed."
                    : "Needs improvement to pass ATS filters."}
                </p>
              </div>
            </div>
          </div>

          {/* Missing Keywords */}
          <div className="bg-[#111827] rounded-3xl p-6 md:p-8 border border-[#1F2937]">
            <h3 className="text-lg md:text-xl font-bold mb-4">Missing Keywords</h3>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {analysis.missingKeywords.map((keyword, i) => (
                <span key={i} className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-xs md:text-sm font-medium">
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Skill Gaps */}
          <div className="bg-[#111827] rounded-3xl p-6 md:p-8 border border-[#1F2937]">
            <h3 className="text-lg md:text-xl font-bold mb-4">Skill Gaps</h3>
            <ul className="space-y-3">
              {analysis.skillGaps.map((gap, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300 text-sm md:text-base">
                  <span className="text-yellow-400 mt-0.5 flex-shrink-0">⚠</span>
                  {gap}
                </li>
              ))}
            </ul>
          </div>

          {/* Suggestions */}
          <div className="bg-[#111827] rounded-3xl p-6 md:p-8 border border-[#1F2937]">
            <h3 className="text-lg md:text-xl font-bold mb-4">Improvement Suggestions</h3>
            <ul className="space-y-4">
              {analysis.suggestions.map((suggestion, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300 text-sm md:text-base">
                  <span className="bg-violet-500/20 text-violet-400 rounded-full w-6 h-6 md:w-7 md:h-7 flex items-center justify-center font-bold text-xs md:text-sm flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>

          {/* Interview CTA */}
          <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BrainCircuit className="text-indigo-400 w-8 h-8 flex-shrink-0" />
              <div>
                <p className="font-bold text-white">Ready to practice interviews?</p>
                <p className="text-gray-400 text-sm mt-0.5">Get AI-generated questions based on your resume</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/interview")}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 transition-all px-6 py-3 rounded-2xl font-semibold text-sm whitespace-nowrap"
            >
              Prepare for Interview
            </button>
          </div>
        </div>
      )}

      {/* No Resume Yet */}
      {uploadStep === "idle" && !analysis && !error && resumeHistory.length === 0 && (
        <div className="mt-6 bg-[#111827] rounded-3xl p-6 md:p-8 border border-[#1F2937]">
          <div className="flex items-center gap-4">
            <div className="bg-violet-500/20 p-3 md:p-4 rounded-2xl flex-shrink-0">
              <FileText className="text-violet-400 w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold">No Resume Uploaded</h3>
              <p className="text-gray-400 mt-1 text-sm md:text-base">
                Upload your resume to generate ATS score, resume suggestions and interview insights.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Resume History */}
      {uploadStep === "idle" && resumeHistory.length > 0 && (
        <div className="mt-6 bg-[#111827] rounded-3xl p-6 md:p-8 border border-[#1F2937]">
          <h3 className="text-lg md:text-xl font-bold mb-4">📄 Previous Resumes</h3>
          <div className="space-y-3">
            {resumeHistory.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between bg-white/5 hover:bg-white/10 transition-all rounded-2xl p-4 border border-white/10"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="bg-violet-500/20 p-2.5 rounded-xl flex-shrink-0">
                    <FileText className="text-violet-400 w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{r.filename}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(r.uploadTime).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                  <span className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border ${
                    r.atsScore >= 80 ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : r.atsScore >= 60 ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    : "bg-red-500/20 text-red-400 border-red-500/30"
                  }`}>
                    ATS {r.atsScore}
                  </span>
                  <button
                    onClick={() => navigate("/my-resumes")}
                    className="hidden sm:block text-xs bg-gray-700 hover:bg-gray-600 transition-all px-3 py-1.5 rounded-xl font-semibold"
                  >
                     Details
                  </button>
                  <button
                    onClick={() => {
                      localStorage.setItem("resumeId", r.id.toString());
                      navigate("/interview");
                    }}
                    className="text-xs bg-indigo-600 hover:bg-indigo-500 transition-all px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap"
                  >
                    Interview
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}