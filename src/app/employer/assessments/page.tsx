"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Briefcase,
    Plus,
    Trash2,
    Edit,
    Eye,
    Code,
    FileText,
    Calculator,
    MessageSquare,
    Zap,
    Trophy,
    Users,
    ArrowRight,
    Save,
    X
} from "lucide-react";
import { useAuth } from "@/components/providers";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs, orderBy, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

type AssessmentType = "quiz" | "task" | "challenge" | "video";

interface Question {
    id: string;
    type: "multiple_choice" | "text" | "code" | "file_upload";
    question: string;
    options?: string[];
    correctAnswer?: string;
    points: number;
}

interface Assessment {
    id: string;
    title: string;
    description: string;
    type: AssessmentType;
    duration: number; // minutes
    questions: Question[];
    employerId: string;
    employerName: string;
    createdAt: any;
    status: "active" | "draft";
    teenCount: number;
}

export default function AssessmentsPage() {
    const { user, loading: authLoading, userType, signOut } = useAuth();
    const router = useRouter();
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);

    // New assessment form
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "challenge" as AssessmentType,
        duration: 30,
        questions: [] as Question[]
    });

    useEffect(() => {
        if (!authLoading && (!user || userType !== "employer")) {
            router.push("/login");
        }
    }, [user, authLoading, userType, router]);

    useEffect(() => {
        if (user && userType === "employer") {
            fetchAssessments();
        }
    }, [user, userType]);

    const fetchAssessments = async () => {
        if (!user || !db) return;
        try {
            const q = query(
                collection(db, "assessments"),
                where("employerId", "==", user.uid),
                orderBy("createdAt", "desc")
            );
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Assessment[];
            setAssessments(data);
        } catch (error) {
            console.error("Error fetching assessments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAssessment = async () => {
        if (!user || !db || !formData.title) return;

        try {
            await addDoc(collection(db, "assessments"), {
                title: formData.title,
                description: formData.description,
                type: formData.type,
                duration: formData.duration,
                questions: formData.questions,
                employerId: user.uid,
                employerName: user.email?.split("@")[0] || "Employer",
                createdAt: serverTimestamp(),
                status: "active",
                teenCount: 0
            });

            setShowCreate(false);
            setFormData({
                title: "",
                description: "",
                type: "challenge",
                duration: 30,
                questions: []
            });
            fetchAssessments();
        } catch (error) {
            console.error("Error creating assessment:", error);
        }
    };

    const addQuestion = () => {
        const newQuestion: Question = {
            id: Date.now().toString(),
            type: "multiple_choice",
            question: "",
            options: ["Option 1", "Option 2", "Option 3", "Option 4"],
            points: 10
        };
        setFormData(prev => ({
            ...prev,
            questions: [...prev.questions, newQuestion]
        }));
    };

    const updateQuestion = (index: number, updates: Partial<Question>) => {
        setFormData(prev => ({
            ...prev,
            questions: prev.questions.map((q, i) =>
                i === index ? { ...q, ...updates } : q
            )
        }));
    };

    const removeQuestion = (index: number) => {
        setFormData(prev => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== index)
        }));
    };

    const getTypeIcon = (type: AssessmentType) => {
        switch (type) {
            case "quiz": return <FileText className="w-5 h-5" />;
            case "task": return <Code className="w-5 h-5" />;
            case "challenge": return <Zap className="w-5 h-5" />;
            case "video": return <MessageSquare className="w-5 h-5" />;
            default: return <FileText className="w-5 h-5" />;
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-woork-teal"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/employer/dashboard" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg gradient-teal flex items-center justify-center">
                                <Briefcase className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-woork-navy">woork</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link href="/employer/dashboard" className="text-sm text-gray-700 hover:text-woork-navy">
                                Dashboard
                            </Link>
                            <button
                                onClick={async () => {
                                    await signOut();
                                    router.push("/");
                                }}
                                className="text-sm text-gray-500 hover:text-red-600"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-woork-navy">Skill Assessments</h1>
                        <p className="text-gray-600">Create challenges to test potential employees</p>
                    </div>
                    <button
                        onClick={() => setShowCreate(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Create Assessment
                    </button>
                </div>

                {/* Assessment Types Info */}
                <div className="bg-gradient-to-r from-woork-teal to-woork-coral rounded-2xl p-6 mb-8 text-white">
                    <h2 className="text-xl font-bold mb-4">🎮 Gamified Hiring</h2>
                    <div className="grid md:grid-cols-4 gap-4">
                        <div className="bg-white/10 rounded-lg p-4">
                            <Zap className="w-8 h-8 mb-2" />
                            <h3 className="font-semibold">Challenges</h3>
                            <p className="text-sm text-white/80">Fun skill challenges teens complete</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <Code className="w-8 h-8 mb-2" />
                            <h3 className="font-semibold">Tasks</h3>
                            <p className="text-sm text-white/80">Real job tasks to test abilities</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <Trophy className="w-8 h-8 mb-2" />
                            <h3 className="font-semibold">Earn Badges</h3>
                            <p className="text-sm text-white/80">Teens collect achievements</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <Users className="w-8 h-8 mb-2" />
                            <h3 className="font-semibold">Track Results</h3>
                            <p className="text-sm text-white/80">See who completes your tests</p>
                        </div>
                    </div>
                </div>

                {/* Assessments List */}
                {assessments.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl">
                        <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No assessments yet</h3>
                        <p className="text-gray-500 mb-4">Create your first skill challenge to test potential hires</p>
                        <button
                            onClick={() => setShowCreate(true)}
                            className="btn-primary"
                        >
                            Create Assessment
                        </button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {assessments.map((assessment) => (
                            <div key={assessment.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-2 rounded-lg ${assessment.type === "challenge" ? "bg-yellow-100 text-yellow-600" :
                                        assessment.type === "task" ? "bg-blue-100 text-blue-600" :
                                            "bg-purple-100 text-purple-600"
                                        }`}>
                                        {getTypeIcon(assessment.type)}
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${assessment.status === "active" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                                        }`}>
                                        {assessment.status}
                                    </span>
                                </div>

                                <h3 className="font-semibold text-woork-navy mb-2">{assessment.title}</h3>
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{assessment.description}</p>

                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>{assessment.questions.length} questions</span>
                                    <span>{assessment.duration} min</span>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <span className="text-sm text-woork-teal font-medium">
                                        {assessment.teenCount || 0} teens completed
                                    </span>
                                    <div className="flex gap-2">
                                        <button className="p-2 text-gray-400 hover:text-woork-navy">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-woork-navy">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Create Assessment Modal */}
            {showCreate && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-woork-navy">Create Assessment</h2>
                                <button onClick={() => setShowCreate(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Basic Info */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Assessment Title
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        className="input-field"
                                        placeholder="e.g., Customer Service Challenge"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        className="input-field min-h-[100px]"
                                        placeholder="Describe what this assessment tests..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Type
                                        </label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as AssessmentType }))}
                                            className="input-field"
                                        >
                                            <option value="challenge">🎮 Challenge</option>
                                            <option value="task">💻 Task</option>
                                            <option value="quiz">📝 Quiz</option>
                                            <option value="video">🎥 Video Response</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Duration (minutes)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.duration}
                                            onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                                            className="input-field"
                                            min={5}
                                            max={120}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Questions */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-woork-navy">Questions</h3>
                                    <button
                                        type="button"
                                        onClick={addQuestion}
                                        className="text-sm text-woork-teal hover:underline flex items-center gap-1"
                                    >
                                        <Plus className="w-4 h-4" /> Add Question
                                    </button>
                                </div>

                                {formData.questions.length === 0 ? (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                                        <p className="text-gray-500">No questions yet. Add your first question!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {formData.questions.map((question, index) => (
                                            <div key={question.id} className="bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-start justify-between mb-3">
                                                    <span className="text-sm font-medium text-gray-700">Question {index + 1}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeQuestion(index)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <div className="space-y-3">
                                                    <input
                                                        type="text"
                                                        value={question.question}
                                                        onChange={(e) => updateQuestion(index, { question: e.target.value })}
                                                        className="input-field"
                                                        placeholder="Enter question..."
                                                    />

                                                    <select
                                                        value={question.type}
                                                        onChange={(e) => updateQuestion(index, { type: e.target.value as any })}
                                                        className="input-field"
                                                    >
                                                        <option value="multiple_choice">Multiple Choice</option>
                                                        <option value="text">Text Answer</option>
                                                        <option value="code">Code</option>
                                                    </select>

                                                    {question.type === "multiple_choice" && (
                                                        <div className="space-y-2">
                                                            {question.options?.map((option, optIndex) => (
                                                                <input
                                                                    key={optIndex}
                                                                    type="text"
                                                                    value={option}
                                                                    onChange={(e) => {
                                                                        const newOptions = [...(question.options || [])];
                                                                        newOptions[optIndex] = e.target.value;
                                                                        updateQuestion(index, { options: newOptions });
                                                                    }}
                                                                    className="input-field"
                                                                    placeholder={`Option ${optIndex + 1}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-4">
                                                        <label className="text-sm text-gray-600">Points:</label>
                                                        <input
                                                            type="number"
                                                            value={question.points}
                                                            onChange={(e) => updateQuestion(index, { points: parseInt(e.target.value) })}
                                                            className="input-field w-24"
                                                            min={1}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={() => setShowCreate(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateAssessment}
                                disabled={!formData.title}
                                className="btn-primary flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Create Assessment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
