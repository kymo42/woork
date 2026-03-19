import Link from "next/link";
import {
    Briefcase,
    Users,
    Shield,
    MapPin,
    Star,
    ArrowRight,
    CheckCircle2,
    Sparkles,
    Heart,
    Building2,
    GraduationCap
} from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center">
                                <Briefcase className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-woork-navy">woork</span>
                        </div>

                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-gray-600 hover:text-woork-teal transition-colors">Features</a>
                            <a href="#how-it-works" className="text-gray-600 hover:text-woork-teal transition-colors">How it Works</a>
                            <a href="#for-employers" className="text-gray-600 hover:text-woork-teal transition-colors">For Employers</a>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                                href="/login"
                                className="text-gray-600 hover:text-woork-navy font-medium transition-colors"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/signup"
                                className="btn-primary text-sm"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-woork-cream via-white to-woork-teal/5 -z-10" />

                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="animate-stagger">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-woork-teal/10 text-woork-teal text-sm font-medium mb-6">
                                <Sparkles className="w-4 h-4" />
                                Built for Australian teens
                            </div>

                            <h1 className="text-5xl lg:text-6xl font-bold text-woork-navy leading-tight mb-6">
                                Find your perfect
                                <span className="text-gradient block">first job</span>
                            </h1>

                            <p className="text-xl text-gray-600 mb-8 max-w-lg">
                                The modern platform connecting teenagers with local employers.
                                Build your resume, gain skills, and start your career journey.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/signup/teen" className="btn-primary inline-flex items-center justify-center gap-2">
                                    I'm looking for work
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link href="/signup/employer" className="btn-secondary inline-flex items-center justify-center gap-2">
                                    <Building2 className="w-5 h-5" />
                                    I'm hiring
                                </Link>
                            </div>

                            <div className="flex items-center gap-6 mt-10 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-woork-teal" />
                                    Parent-approved
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-woork-teal" />
                                    Safe & secure
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-woork-teal" />
                                    100% free for teens
                                </div>
                            </div>
                        </div>

                        <div className="relative hidden lg:block">
                            <div className="absolute inset-0 bg-gradient-to-r from-woork-teal/20 to-woork-coral/20 rounded-3xl blur-3xl" />
                            <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                                {/* Mock Phone Screen */}
                                <div className="bg-gradient-to-br from-woork-navy to-woork-teal rounded-2xl p-6 text-white">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-white/20" />
                                            <div>
                                                <div className="text-sm font-medium">Welcome back,</div>
                                                <div className="text-lg font-bold">Alex!</div>
                                            </div>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                            <Heart className="w-4 h-4" />
                                        </div>
                                    </div>

                                    <div className="bg-white/10 rounded-xl p-4 mb-4">
                                        <div className="text-xs text-white/70 mb-1">Your Skills Score</div>
                                        <div className="text-2xl font-bold">Level 5</div>
                                        <div className="flex gap-1 mt-2">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <div key={i} className="h-2 flex-1 bg-white/30 rounded-full overflow-hidden">
                                                    <div className="h-full bg-woork-teal rounded-full" style={{ width: '100%' }} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 mt-6">
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                        <div className="w-12 h-12 rounded-xl bg-woork-teal/10 flex items-center justify-center">
                                            <MapPin className="w-6 h-6 text-woork-teal" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-woork-navy">5 new jobs nearby</div>
                                            <div className="text-sm text-gray-500">In Sydney NSW 2000</div>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-gray-400" />
                                    </div>

                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                        <div className="w-12 h-12 rounded-xl bg-woork-coral/10 flex items-center justify-center">
                                            <Users className="w-6 h-6 text-woork-coral" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-woork-navy">3 employers viewed your profile</div>
                                            <div className="text-sm text-gray-500">Today</div>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-woork-navy mb-4">
                            Everything you need to land your first job
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            We've built a platform that makes job hunting easy, safe, and even fun.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 card-hover">
                            <div className="w-14 h-14 rounded-2xl gradient-teal flex items-center justify-center mb-6">
                                <Briefcase className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-woork-navy mb-3">
                                Smart Job Matching
                            </h3>
                            <p className="text-gray-600">
                                Our AI finds jobs that match your skills, location, and availability.
                                No more scrolling through irrelevant listings.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 card-hover">
                            <div className="w-14 h-14 rounded-2xl gradient-coral flex items-center justify-center mb-6">
                                <GraduationCap className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-woork-navy mb-3">
                                Build Your Resume
                            </h3>
                            <p className="text-gray-600">
                                Create a visual profile that showcases your skills, experience,
                                and achievements. Stand out to employers.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 card-hover">
                            <div className="w-14 h-14 rounded-2xl gradient-navy flex items-center justify-center mb-6">
                                <Shield className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-woork-navy mb-3">
                                Parent Safety
                            </h3>
                            <p className="text-gray-600">
                                Parents can approve applications, monitor messages, and ensure
                                everything stays safe and appropriate.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-woork-navy mb-4">
                            How woork works
                        </h2>
                        <p className="text-xl text-gray-600">
                            Get started in 3 simple steps
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-woork-teal/10 text-woork-teal text-2xl font-bold flex items-center justify-center mx-auto mb-6">
                                1
                            </div>
                            <h3 className="text-xl font-bold text-woork-navy mb-2">
                                Create Your Profile
                            </h3>
                            <p className="text-gray-600">
                                Sign up, add your details, skills, and availability.
                                Parents need to approve for under-16s.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-woork-teal/10 text-woork-teal text-2xl font-bold flex items-center justify-center mx-auto mb-6">
                                2
                            </div>
                            <h3 className="text-xl font-bold text-woork-navy mb-2">
                                Discover Jobs
                            </h3>
                            <p className="text-gray-600">
                                Browse jobs that match your age, location, and interests.
                                Apply with one tap.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-woork-teal/10 text-woork-teal text-2xl font-bold flex items-center justify-center mx-auto mb-6">
                                3
                            </div>
                            <h3 className="text-xl font-bold text-woork-navy mb-2">
                                Get Hired
                            </h3>
                            <p className="text-gray-600">
                                Connect with employers, attend interviews, and land
                                your first job!
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* For Employers */}
            <section id="for-employers" className="py-20 px-4 sm:px-6 lg:px-8 bg-woork-navy text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold mb-6">
                                For Employers
                            </h2>
                            <p className="text-xl text-white/70 mb-8">
                                Find reliable young workers who are motivated and ready to learn.
                                We handle the vetting so you can focus on hiring.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <CheckCircle2 className="w-6 h-6 text-woork-teal flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-semibold">Verified Candidates</div>
                                        <div className="text-white/70 text-sm">All teens are age-verified with parent consent</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <CheckCircle2 className="w-6 h-6 text-woork-teal flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-semibold">Skills-First Matching</div>
                                        <div className="text-white/70 text-sm">Find candidates with the exact skills you need</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <CheckCircle2 className="w-6 h-6 text-woork-teal flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-semibold">Fair Work Compliant</div>
                                        <div className="text-white/70 text-sm">Built-in guidance for hiring under-18s</div>
                                    </div>
                                </div>
                            </div>

                            <Link
                                href="/signup/employer"
                                className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-woork-teal text-white rounded-xl font-medium hover:bg-opacity-90 transition-all"
                            >
                                Start Hiring
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                            <div className="text-center mb-6">
                                <div className="text-5xl font-bold text-woork-teal">FREE</div>
                                <div className="text-white/70">to post jobs</div>
                            </div>

                            <div className="space-y-3 text-center">
                                <div className="flex justify-between py-2 border-b border-white/10">
                                    <span className="text-white/70">Job postings</span>
                                    <span className="font-medium">1/month</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-white/10">
                                    <span className="text-white/70">Candidate search</span>
                                    <span className="font-medium">Basic</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-white/10">
                                    <span className="text-white/70">Messaging</span>
                                    <span className="font-medium">✓</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-white/70">Profile badges</span>
                                    <span className="font-medium">Basic</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-woork-cream to-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-woork-navy mb-4">
                            Loved by teens and parents
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                ))}
                            </div>
                            <p className="text-gray-600 mb-4">
                                "I got my first job at a local cafe within 2 weeks of signing up.
                                The profile builder was super easy to use!"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-woork-teal/20" />
                                <div>
                                    <div className="font-medium text-woork-navy">Sarah, 16</div>
                                    <div className="text-sm text-gray-500">Sydney</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                ))}
                            </div>
                            <p className="text-gray-600 mb-4">
                                "As a parent, I love that I can see who my daughter is talking to
                                and approve her applications. It gives me peace of mind."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-woork-coral/20" />
                                <div>
                                    <div className="font-medium text-woork-navy">Michelle</div>
                                    <div className="text-sm text-gray-500">Parent, Melbourne</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                ))}
                            </div>
                            <p className="text-gray-600 mb-4">
                                "We've hired 3 young workers through woork. They're more
                                motivated than other candidates. Great platform!"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-woork-navy/20" />
                                <div>
                                    <div className="font-medium text-woork-navy">James</div>
                                    <div className="text-sm text-gray-500">Cafe Owner, Brisbane</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-woork-navy mb-6">
                        Ready to start your journey?
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Join thousands of Australian teens who found their perfect first job.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/signup/teen" className="btn-primary inline-flex items-center justify-center gap-2">
                            Create Free Profile
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link href="/about" className="btn-secondary inline-flex items-center justify-center gap-2">
                            Learn More
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-woork-navy text-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center">
                                    <Briefcase className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold">woork</span>
                            </div>
                            <p className="text-white/70 text-sm">
                                The modern job platform for Australian teenagers.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">For Teens</h4>
                            <ul className="space-y-2 text-white/70 text-sm">
                                <li><a href="#" className="hover:text-white">Find Jobs</a></li>
                                <li><a href="#" className="hover:text-white">Build Resume</a></li>
                                <li><a href="#" className="hover:text-white">Skills Courses</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">For Employers</h4>
                            <ul className="space-y-2 text-white/70 text-sm">
                                <li><a href="#" className="hover:text-white">Post a Job</a></li>
                                <li><a href="#" className="hover:text-white">Search Candidates</a></li>
                                <li><a href="#" className="hover:text-white">Pricing</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-white/70 text-sm">
                                <li><a href="#" className="hover:text-white">About Us</a></li>
                                <li><a href="#" className="hover:text-white">Contact</a></li>
                                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/50 text-sm">
                        © 2025 woork. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
