import Link from "next/link";
import { SubjectIcons, SubjectKey } from "@/components/icons/SubjectIcons";

export default function SubjectsSection() {
  const subjects: {
    name: string;
    href: string;
    key: SubjectKey;
  }[] = [
    { name: "Math", href: "/subjects/math", key: "math" },
    { name: "Physics", href: "/subjects/physics", key: "physics" },
    { name: "Chemistry", href: "/subjects/chemistry", key: "chemistry" },
    { name: "Biology", href: "/subjects/biology", key: "biology" },
    { name: "History", href: "/subjects/history", key: "history" },
    { name: "English", href: "/subjects/english", key: "english" },
    {
      name: "Computer Programming",
      href: "/subjects/programming",
      key: "programming",
    },
    { name: "Languages", href: "/subjects/languages", key: "languages" },
    {
      name: "Social Sciences",
      href: "/subjects/social-sciences",
      key: "socialsciences",
    },
    { name: "University", href: "/subjects/university", key: "university" },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text mb-6">
            Exams tailored to your{" "}
            <span className=" text-red-500 ">subject</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Choose your subject to see what tools are available to you.
          </p>
        </div>

        {/* Subject Cards Grid */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {subjects.map((subject, index) => (
            <Link
              key={subject.name}
              href={subject.href}
              className={`
                group relative overflow-hidden
                flex items-center gap-3 px-6 py-4 
                bg-white border-2 border-gray-200 rounded-full
                text-red-500 font-medium text-lg
                transition-all duration-300 ease-in-out
                transform hover:scale-105 hover:shadow-lg hover:-translate-y-1
               hover:bg-[#DC2626] hover:text-white hover:border-primary 
              `}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12 group-hover:animate-pulse"></div>
              <span className="text-2xl">{SubjectIcons[subject.key]}</span>

              {/* Subject Text */}
              <span className="relative z-10 whitespace-nowrap group-hover:font-semibold transition-all duration-300">
                {subject.name}
              </span>

              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%] skew-x-12"></div>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-red-50 rounded-2xl border border-red-200">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-gray-600 font-medium">
                Can&#39;t find your subject?
              </span>
            </div>
            <Link
              href="/contact"
              className="px-6 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition-all duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { stat: "50+", label: "Subject Areas" },
            { stat: "10K+", label: "Practice Questions" },
            { stat: "95%", label: "Success Rate" },
          ].map((item) => (
            <div
              key={item.label}
              className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-red-100 hover:border-red-300 transition-all duration-300"
            >
              <div className="text-3xl font-bold text-red-500 mb-2">
                {item.stat}
              </div>
              <div className="text-gray-600">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
