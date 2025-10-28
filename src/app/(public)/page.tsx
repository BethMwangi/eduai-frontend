"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import Hero from "@/components/Landing/Hero";
import heroPic from "../../../public/hero.jpg";
import SubjectsSection from "@/components/Subjects-section";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.role === "student") router.replace("/dashboard/student");
      else if (user.role === "parent") router.replace("/dashboard/parent");
      else if (user.role === "teacher") router.replace("/dashboard/teacher");
    }
  }, [user, router]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-col w-full bg-gradient-to-b from-[#F9FAFB] to-[#D2D6DB]">
        <Hero
          title=" Turn your exams into success stories."
          description="AI-powered assessment platform for students, helping you prepare, test and succeed.."
          imageUrl={heroPic.src}
          alt="An alt image"
        />
      </main>
      <SubjectsSection />
    </div>
  );
}
