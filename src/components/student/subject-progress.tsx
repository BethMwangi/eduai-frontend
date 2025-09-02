"use client"

import { useState } from "react"
import Link from "next/link"
import { BookOpen, Clock, Target, TrendingUp, ArrowLeft, Play, BarChart3, Search } from "lucide-react"
import {Button} from "@/components/common/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SubjectProgressProps {
  subject: string
}

export default function SubjectProgress({ subject }: SubjectProgressProps) {
  const [selectedTopic, setSelectedTopic] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Capitalize subject name
  const subjectName = subject.charAt(0).toUpperCase() + subject.slice(1)

  const subjectData = {
    mathematics: {
      name: "Mathematics",
      icon: "🧮",
      color: "blue",
      totalQuestions: 300,
      completedQuestions: 245,
      averageScore: 85,
      timeSpent: "12h 30m",
      topics: [
        {
          id: "algebra",
          name: "Algebra",
          progress: 90,
          questions: 50,
          completed: 45,
          averageScore: 88,
          difficulty: "Medium",
          estimatedTime: "2h 15m",
          lastStudied: "2 hours ago",
        },
        {
          id: "geometry",
          name: "Geometry",
          progress: 75,
          questions: 40,
          completed: 30,
          averageScore: 82,
          difficulty: "Hard",
          estimatedTime: "1h 45m",
          lastStudied: "1 day ago",
        },
        {
          id: "calculus",
          name: "Calculus",
          progress: 60,
          questions: 60,
          completed: 36,
          averageScore: 78,
          difficulty: "Hard",
          estimatedTime: "3h 20m",
          lastStudied: "3 days ago",
        },
        {
          id: "statistics",
          name: "Statistics",
          progress: 95,
          questions: 35,
          completed: 33,
          averageScore: 92,
          difficulty: "Medium",
          estimatedTime: "1h 30m",
          lastStudied: "1 hour ago",
        },
        {
          id: "trigonometry",
          name: "Trigonometry",
          progress: 40,
          questions: 45,
          completed: 18,
          averageScore: 75,
          difficulty: "Hard",
          estimatedTime: "2h 45m",
          lastStudied: "1 week ago",
        },
      ],
    },
    physics: {
      name: "Physics",
      icon: "⚛️",
      color: "purple",
      totalQuestions: 250,
      completedQuestions: 189,
      averageScore: 72,
      timeSpent: "9h 45m",
      topics: [
        {
          id: "mechanics",
          name: "Mechanics",
          progress: 85,
          questions: 60,
          completed: 51,
          averageScore: 78,
          difficulty: "Medium",
          estimatedTime: "2h 30m",
          lastStudied: "1 day ago",
        },
        {
          id: "thermodynamics",
          name: "Thermodynamics",
          progress: 70,
          questions: 40,
          completed: 28,
          averageScore: 74,
          difficulty: "Hard",
          estimatedTime: "2h 15m",
          lastStudied: "2 days ago",
        },
        {
          id: "electromagnetism",
          name: "Electromagnetism",
          progress: 55,
          questions: 50,
          completed: 27,
          averageScore: 68,
          difficulty: "Hard",
          estimatedTime: "3h 10m",
          lastStudied: "4 days ago",
        },
        {
          id: "optics",
          name: "Optics",
          progress: 80,
          questions: 35,
          completed: 28,
          averageScore: 82,
          difficulty: "Medium",
          estimatedTime: "1h 45m",
          lastStudied: "3 hours ago",
        },
        {
          id: "waves",
          name: "Waves",
          progress: 45,
          questions: 30,
          completed: 13,
          averageScore: 71,
          difficulty: "Medium",
          estimatedTime: "1h 30m",
          lastStudied: "5 days ago",
        },
      ],
    },
    chemistry: {
      name: "Chemistry",
      icon: "🧪",
      color: "green",
      totalQuestions: 350,
      completedQuestions: 312,
      averageScore: 91,
      timeSpent: "15h 20m",
      topics: [
        {
          id: "organic",
          name: "Organic Chemistry",
          progress: 95,
          questions: 80,
          completed: 76,
          averageScore: 93,
          difficulty: "Hard",
          estimatedTime: "3h 45m",
          lastStudied: "30 minutes ago",
        },
        {
          id: "inorganic",
          name: "Inorganic Chemistry",
          progress: 88,
          questions: 70,
          completed: 61,
          averageScore: 89,
          difficulty: "Medium",
          estimatedTime: "2h 50m",
          lastStudied: "2 hours ago",
        },
        {
          id: "physical",
          name: "Physical Chemistry",
          progress: 92,
          questions: 60,
          completed: 55,
          averageScore: 91,
          difficulty: "Hard",
          estimatedTime: "2h 30m",
          lastStudied: "1 day ago",
        },
        {
          id: "analytical",
          name: "Analytical Chemistry",
          progress: 85,
          questions: 45,
          completed: 38,
          averageScore: 87,
          difficulty: "Medium",
          estimatedTime: "1h 45m",
          lastStudied: "3 hours ago",
        },
        {
          id: "biochemistry",
          name: "Biochemistry",
          progress: 78,
          questions: 55,
          completed: 43,
          averageScore: 84,
          difficulty: "Hard",
          estimatedTime: "2h 15m",
          lastStudied: "2 days ago",
        },
      ],
    },
  }

  const currentSubject = subjectData[subject as keyof typeof subjectData] || subjectData.mathematics

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700"
      case "Medium":
        return "bg-yellow-100 text-yellow-700"
      case "Hard":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const filteredTopics = currentSubject.topics.filter((topic) => {
    const matchesSearch = topic.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTopic = selectedTopic === "all" || topic.id === selectedTopic
    return matchesSearch && matchesTopic
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/student"
                className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-3">
                <span className="text-3xl">{currentSubject.icon}</span>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{currentSubject.name}</h1>
                  <p className="text-gray-600">Track your progress and master topics</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">
                {Math.round((currentSubject.completedQuestions / currentSubject.totalQuestions) * 100)}% Complete
              </Badge>
              <Button>
                <Play className="w-4 h-4 mr-2" />
                Continue Learning
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Subject Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Questions</p>
                  <p className="text-2xl font-bold text-gray-900">{currentSubject.totalQuestions}</p>
                  <p className="text-xs text-green-600 mt-1">{currentSubject.completedQuestions} completed</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-gray-900">{currentSubject.averageScore}%</p>
                  <p className="text-xs text-green-600 mt-1">Above average</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Time Spent</p>
                  <p className="text-2xl font-bold text-gray-900">{currentSubject.timeSpent}</p>
                  <p className="text-xs text-blue-600 mt-1">This month</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Progress</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round((currentSubject.completedQuestions / currentSubject.totalQuestions) * 100)}%
                  </p>
                  <p className="text-xs text-orange-600 mt-1">Keep going!</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overall Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Overall Progress
            </CardTitle>
            <CardDescription>
              {currentSubject.totalQuestions - currentSubject.completedQuestions} questions remaining
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Completed</span>
                <span>
                  {currentSubject.completedQuestions} / {currentSubject.totalQuestions}
                </span>
              </div>
              <Progress
                value={(currentSubject.completedQuestions / currentSubject.totalQuestions) * 100}
                className="h-3"
              />
            </div>
          </CardContent>
        </Card>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={selectedTopic} onValueChange={setSelectedTopic}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {currentSubject.topics.map((topic) => (
                <SelectItem key={topic.id} value={topic.id}>
                  {topic.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic) => (
            <Card key={topic.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{topic.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {topic.completed}/{topic.questions} questions completed
                    </CardDescription>
                  </div>
                  <Badge className={getDifficultyColor(topic.difficulty)}>{topic.difficulty}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{topic.progress}%</span>
                  </div>
                  <Progress value={topic.progress} className="h-2" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Average Score</p>
                    <p className={`font-semibold ${getScoreColor(topic.averageScore)}`}>{topic.averageScore}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Est. Time</p>
                    <p className="font-semibold text-gray-900">{topic.estimatedTime}</p>
                  </div>
                </div>

                {/* Last Studied */}
                <div className="text-xs text-gray-500 border-t pt-3">Last studied: {topic.lastStudied}</div>

                {/* Action Button */}
                <Button className="w-full" size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  {topic.progress === 100 ? "Review" : "Continue"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTopics.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No topics found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
