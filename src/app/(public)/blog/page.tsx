import Link from "next/link";
import { Button } from "@/components/common/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, ArrowRight, Calendar, User } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "10 Effective Study Techniques for Better Learning",
    description:
      "Discover proven study methods that can help you retain information faster and improve your academic performance.",
    author: "Sarah Johnson",
    date: "March 15, 2024",
    category: "Study Tips",
    image: "/kidstudy.png",
    content:
      "In this comprehensive guide, we explore the most effective study techniques used by top students worldwide. From the Pomodoro technique to spaced repetition, learn how to optimize your learning process.",
  },
  {
    id: 2,
    title: "How to Prepare for Competitive Exams",
    description:
      "A complete roadmap to ace your competitive exams with strategic planning and consistent practice.",
    author: "Michael Chen",
    date: "March 10, 2024",
    category: "Exam Prep",
    image: "/kidstudy.png",
    content:
      "Preparing for competitive exams requires more than just hard work. Learn the strategies, time management tips, and mental preparation techniques that successful candidates use.",
  },
  {
    id: 3,
    title: "The Power of Peer Learning and Group Study",
    description:
      "Understand how collaborative learning can enhance your understanding and make studying more enjoyable.",
    author: "Emma Williams",
    date: "March 5, 2024",
    category: "Learning Methods",
    image: "/kidstudy.png",
    content:
      "Group study sessions can be incredibly effective when done right. Discover how to organize productive study groups and leverage peer learning for better results.",
  },
  {
    id: 4,
    title: "Technology Tools for Modern Learners",
    description:
      "Explore the best educational apps and tools that can revolutionize your learning experience.",
    author: "David Kumar",
    date: "February 28, 2024",
    category: "Technology",
    image: "/kidstudy.png",
    content:
      "From note-taking apps to AI-powered tutors, technology has transformed education. Learn which tools can best support your learning journey.",
  },
  {
    id: 5,
    title: "Overcoming Test Anxiety: A Practical Guide",
    description:
      "Practical strategies to manage anxiety and perform your best during exams.",
    author: "Lisa Anderson",
    date: "February 20, 2024",
    category: "Mental Health",
    image: "/kidstudy.png",
    content:
      "Test anxiety affects many students. Learn breathing techniques, mindset shifts, and preparation strategies to overcome anxiety and excel in your exams.",
  },
  {
    id: 6,
    title: "Building a Sustainable Study Schedule",
    description:
      "Create a balanced study routine that keeps you motivated and prevents burnout.",
    author: "James Wilson",
    date: "February 15, 2024",
    category: "Time Management",
    image: "/kidstudy.png",
    content:
      "A well-planned study schedule is key to long-term success. Learn how to balance your studies with other activities and maintain consistent progress.",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">
                EduPlatform
              </span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-500 hover:text-gray-900">
                Home
              </Link>
              <Link href="/about" className="text-gray-500 hover:text-gray-900">
                About
              </Link>
              <Link href="/blog" className="text-blue-600 font-semibold">
                Blog
              </Link>
              <Link href="/login" className="text-gray-500 hover:text-gray-900">
                Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r bg-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Learning Insights & Tips
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Discover expert advice, study techniques, and educational resources
            to enhance your learning journey.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card
                key={post.id}
                className="hover:shadow-lg transition-shadow overflow-hidden flex flex-col bg-white"
              >
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <CardHeader className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                  <CardDescription>{post.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  {/* <Link href={`/blog/${post.id}`}> */}

                  <Link href={"/blog"}>
                    <Button
                      variant="outlined"
                      className="w-full bg-transparent"
                    >
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
