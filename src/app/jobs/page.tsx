"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Briefcase,
    Search,
    MapPin,
    Clock,
    DollarSign,
    Filter,
    Heart,
    Building2,
    Users,
    ChevronRight,
    Star
} from "lucide-react";

interface Job {
    id: string;
    title: string;
    company: string;
    type: string;
    location: string;
    pay: string;
    description: string;
    skills: string[];
    postedAt: string;
    applicants: number;
    ageMin: number;
}

const mockJobs: Job[] = [
    {
        id: "1",
        title: "Retail Assistant",
        company: "Westfield Sydney",
        type: "Casual",
        location: "Sydney NSW",
        pay: "$24.50/hr",
        description: "Join our retail team! Help customers, stock shelves, and learn valuable skills.",
        skills: ["Customer Service", "Cashier", "Retail"],
        postedAt: "2 days ago",
        applicants: 12,
        ageMin: 14,
    },
    {
        id: "2",
        title: "Café Staff",
        company: "The Coffee Club",
        type: "Part-time",
        location: "Melbourne VIC",
        pay: "$23.50/hr",
        description: "Looking for enthusiastic café staff. Barista experience preferred but not required.",
        skills: ["Barista", "Customer Service", "Food Handling"],
        postedAt: "3 days ago",
        applicants: 8,
        ageMin: 15,
    },
    {
        id: "3",
        title: "Tutor - Maths",
        company: "Kumon Education",
        type: "Casual",
        location: "Brisbane QLD",
        pay: "$28/hr",
        description: "Help primary school students with maths. Great for uni students!",
        skills: ["Teaching", "Maths", "Patience"],
        postedAt: "1 day ago",
        applicants: 5,
        ageMin: 16,
    },
    {
        id: "4",
        title: "Delivery Driver",
        company: "Uber Eats",
        type: "Flexible",
        location: "Sydney NSW",
        pay: "$25-35/hr",
        description: "Deliver food on your own schedule. Must have bike or car.",
        skills: ["Driving", "Reliable", "Own Transport"],
        postedAt: "Today",
        applicants: 24,
        ageMin: 16,
    },
    {
        id: "5",
        title: "Kitchen Hand",
        company: "Local Pizza Shop",
        type: "Casual",
        location: "Perth WA",
        pay: "$22/hr",
        description: "Help in the kitchen with food prep and cleaning. Food handling certificate preferred.",
        skills: ["Kitchen", "Food Safety", "Teamwork"],
        postedAt: "4 days ago",
        applicants: 6,
        ageMin: 14,
    },
    {
        id: "6",
        title: "Event Staff",
        company: "MCEC",
        type: "Casual",
        location: "Melbourne VIC",
        pay: "$26/hr",
        description: "Work at exciting events! Great experience for resume.",
        skills: ["Events", "Customer Service", "Communication"],
        postedAt: "5 days ago",
        applicants: 15,
        ageMin: 15,
    },
];

const jobTypes = ["All", "Casual", "Part-time", "Flexible", "Internship"];
const locations = ["All", "Sydney NSW", "Melbourne VIC", "Brisbane QLD", "Perth WA", "Adelaide SA"];

export default function JobsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("All");
    const [selectedLocation, setSelectedLocation] = useState("All");
    const [savedJobs, setSavedJobs] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);

    const filteredJobs = mockJobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesType = selectedType === "All" || job.type === selectedType;
        const matchesLocation = selectedLocation === "All" || job.location.includes(selectedLocation.split(" ")[0]);
        return matchesSearch && matchesType && matchesLocation;
    });

    const toggleSaveJob = (jobId: string) => {
        setSavedJobs(prev =>
            prev.includes(jobId)
                ? prev.filter(id => id !== jobId)
                : [...prev, jobId]
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg gradient-teal flex items-center justify-center">
                                <Briefcase className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-woork-navy">woork</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className="text-gray-600 hover:text-woork-navy font-medium">
                                Dashboard
                            </Link>
                            <Link href="/profile" className="btn-primary text-sm">
                                My Profile
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero */}
                <div className="bg-gradient-to-r from-woork-teal to-woork-navy rounded-2xl p-8 text-white mb-8">
                    <h1 className="text-3xl font-bold mb-2">Find your next job</h1>
                    <p className="text-white/80 mb-6">Browse hundreds of jobs perfect for teens</p>

                    {/* Search */}
                    <div className="flex gap-4 max-w-2xl">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search jobs, companies, or skills..."
                                className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-4 py-3 bg-white/20 hover:bg-white/30 rounded-xl flex items-center gap-2"
                        >
                            <Filter className="w-5 h-5" />
                            Filters
                        </button>
                    </div>

                    {/* Filters */}
                    {showFilters && (
                        <div className="mt-4 p-4 bg-white/10 rounded-xl">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-white/70 mb-2">Job Type</label>
                                    <div className="flex flex-wrap gap-2">
                                        {jobTypes.map(type => (
                                            <button
                                                key={type}
                                                onClick={() => setSelectedType(type)}
                                                className={`px-3 py-1.5 rounded-full text-sm ${selectedType === type
                                                        ? "bg-white text-woork-navy"
                                                        : "bg-white/20 text-white hover:bg-white/30"
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-white/70 mb-2">Location</label>
                                    <div className="flex flex-wrap gap-2">
                                        {locations.map(loc => (
                                            <button
                                                key={loc}
                                                onClick={() => setSelectedLocation(loc)}
                                                className={`px-3 py-1.5 rounded-full text-sm ${selectedLocation === loc
                                                        ? "bg-white text-woork-navy"
                                                        : "bg-white/20 text-white hover:bg-white/30"
                                                    }`}
                                            >
                                                {loc}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-600">
                        <strong>{filteredJobs.length}</strong> jobs found
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Sort by:</span>
                        <select className="text-sm border-0 bg-transparent focus:ring-0">
                            <option>Newest</option>
                            <option>Nearest</option>
                            <option>Highest Pay</option>
                        </select>
                    </div>
                </div>

                {/* Job List */}
                <div className="space-y-4">
                    {filteredJobs.map(job => (
                        <div key={job.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-woork-teal/20 to-woork-navy/20 flex items-center justify-center">
                                        <Building2 className="w-7 h-7 text-woork-navy" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-woork-navy">{job.title}</h3>
                                        <p className="text-gray-600">{job.company}</p>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {job.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {job.postedAt}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                {job.applicants} applicants
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => toggleSaveJob(job.id)}
                                    className={`p-2 rounded-lg ${savedJobs.includes(job.id) ? "text-red-500 bg-red-50" : "text-gray-400 hover:text-red-500 hover:bg-red-50"}`}
                                >
                                    <Heart className={`w-5 h-5 ${savedJobs.includes(job.id) ? "fill-current" : ""}`} />
                                </button>
                            </div>

                            <div className="mt-4">
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <span className="px-2 py-1 bg-woork-teal/10 text-woork-teal text-xs rounded-full">
                                        {job.type}
                                    </span>
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                                        <DollarSign className="w-3 h-3" />
                                        {job.pay}
                                    </span>
                                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                                        Age {job.ageMin}+
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {job.skills.map(skill => (
                                        <span key={skill} className="skill-badge text-xs">{skill}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-gray-600 text-sm line-clamp-2">{job.description}</p>
                                <Link
                                    href={`/jobs/${job.id}`}
                                    className="btn-primary text-sm flex items-center gap-1 ml-4"
                                >
                                    View Job
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredJobs.length === 0 && (
                    <div className="text-center py-12">
                        <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-woork-navy mb-2">No jobs found</h3>
                        <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedType("All");
                                setSelectedLocation("All");
                            }}
                            className="btn-secondary"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}

                {/* Featured Employers */}
                <div className="mt-12">
                    <h2 className="text-xl font-bold text-woork-navy mb-6">Top Employers</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {["Westfield", "The Coffee Club", "Kumon", "MCEC", "Uber Eats", "Local Cafe", "RetailCo", "EventPro"].map(company => (
                            <div key={company} className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-woork-teal/20 to-woork-navy/20 mx-auto mb-2 flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-woork-navy" />
                                </div>
                                <p className="font-medium text-woork-navy text-sm">{company}</p>
                                <div className="flex items-center justify-center gap-1 mt-1">
                                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                    <span className="text-xs text-gray-500">4.5</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
