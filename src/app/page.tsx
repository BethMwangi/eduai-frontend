"use client";

import Hero from "@/components/Landing/Hero";
import heroPic from "../../public/hero.jpg";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import SubjectsSection from "@/components/Subjects-section";

export default function HomePage() {
  return (
    <>
      <Navbar />{" "}
      <main className="mx-auto my-0 flex min-h-screen bg-gradient-to-b from-[#F9FAFB] to-[#D2D6DB]">
        <Hero
          title=" Turn your exams into success stories."
          description="AI-powered assessment platform for students, helping you prepare, test and succeed.."
          imageUrl={heroPic.src}
          alt="An abstract arty image"
        />
      </main>
      <SubjectsSection />
      <Footer />
    </>
  );
}
