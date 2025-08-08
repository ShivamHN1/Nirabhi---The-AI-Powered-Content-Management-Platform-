import React from 'react';
import { Link } from 'react-router-dom';

const FeatureCard: React.FC<{ icon: JSX.Element; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-surface-secondary/95 p-6 rounded-xl shadow-soft border border-surface-tertiary/20 backdrop-blur-sm hover:shadow-glow transition-shadow duration-300 h-full">
        <div className="flex items-center gap-4 mb-3">
            <div className="bg-accent-muted p-2 rounded-lg text-accent-primary">{icon}</div>
            <h3 className="text-xl font-semibold text-content-primary">{title}</h3>
        </div>
        <p className="text-content-secondary">{children}</p>
    </div>
);

const Home: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
            <section className="text-center py-16 sm:py-24">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                    <span className="block bg-clip-text text-transparent bg-gradient-to-r from-accent-primary to-accent-muted">
                        Elevate Your Moderators
                    </span>
                    <span className="block text-content-primary mt-2">
                        Build Healthier Communities
                    </span>
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg text-content-secondary">
                    Nirabhi is a Community Intelligence Platform designed to transform moderation from a reactive chore into a proactive strategy. Give your team the AI-powered tools they need to foster a thriving, safe, and engaging online space.
                </p>
                <div className="mt-10">
                    <Link
                        to="/dashboard"
                        className="inline-block px-8 py-4 bg-accent-primary hover:bg-accent-hover text-content-primary font-semibold rounded-lg shadow-soft hover:shadow-glow transform hover:-translate-y-1 transition-all duration-300"
                    >
                        Go to Dashboard
                    </Link>
                </div>
            </section>

            <section className="py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-white">A Human-Centric Moderation Suite</h2>
                    <p className="text-zinc-400 mt-2">We don't replace humans. We empower them.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                        title="The Co-pilot"
                    >
                        An interactive dashboard to efficiently triage and review flagged content with AI-powered insights and highlighting.
                    </FeatureCard>
                     <FeatureCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3.414A1 1 0 0110 3h4a1 1 0 011 1v2.586A1 1 0 0114.586 7L12 9.586 9.414 7A1 1 0 019 6.586V3.414z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z" /></svg>}
                        title="The Guard"
                    >
                        An automation engine to autonomously act on clear policy violations based on your own custom, trust-building rules.
                    </FeatureCard>
                    <FeatureCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                        title="The Analyst"
                    >
                        An analytics dashboard to spot trends, measure community health, and provide strategic insights for proactive management.
                    </FeatureCard>
                </div>
            </section>
        </div>
    );
};

export default Home;
