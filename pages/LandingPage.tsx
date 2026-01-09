import React from 'react';
import { Hero } from './landing/Hero';
import { LandingNavbar } from './landing/LandingNavbar';
import { SubjectSection } from './landing/SubjectSection';
import { BonusSection } from './landing/BonusSection';
import { Benefits } from './landing/Benefits';
import { Pricing } from './landing/Pricing';
import { FAQ } from './landing/FAQ';
import { LandingFooter } from './landing/LandingFooter';
import { Testimonials } from './landing/Testimonials';
import { StudyResources } from './landing/StudyResources';
import { SchedulesSection } from './landing/SchedulesSection';

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <LandingNavbar />
            <main className="flex-grow">
                <Hero />
                <Benefits />
                <StudyResources />
                <SubjectSection />
                <SchedulesSection />
                <BonusSection />
                <Testimonials />
                <Pricing />
                <FAQ />
            </main>
            <LandingFooter />
        </div>
    );
};

export default LandingPage;
