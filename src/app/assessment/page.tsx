"use client";

import { useState } from "react";
import { Container } from "@/components/layout/container";
import { AssessmentHero } from "@/components/assessment/assessment-hero";
import { WellbeingAreas } from "@/components/assessment/wellbeing-areas";
import { ReminderCard } from "@/components/assessment/reminder-card";
import { AssessmentModal } from "@/components/assessment/assessment-modal";

export default function AssessmentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#1C352D] selection:bg-[#233E33]/15 selection:text-[#1C352D]">
      <Container className="py-2 sm:py-4">
        {/* Hero Section */}
        <AssessmentHero onBeginCheckIn={handleOpenModal} />

        {/* What This Check-In Explores Section */}
        <WellbeingAreas />

        {/* Bottom Gentle Reminder Section */}
        <ReminderCard />
      </Container>

      {/* Interactive Assessment Modal */}
      <AssessmentModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
