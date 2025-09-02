"use client"

import { useState } from "react"
import Link from "next/link"
import { Trophy, Star, Zap, TrendingUp, ArrowLeft, Lock, CheckCircle, Medal, Crown, Flame } from "lucide-react"
import { Button } from "@/components/common/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Achievements() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const userStats = {
    totalBadges: 12,
    level: 5,
    xp: 2450,
    nextLevelXp: 3000,
    rank: "Top 10%",
    streakDays: 12,
  }

  const achievements = [
    {
      id: "1",
      title: "Math Wizard",
      description: "Complete 50 mathematics questions",
      icon: "🧮",
      category: "subject",
      difficulty: "medium",
      progress: 50,
      maxProgress: 50,
      xpReward: 100,
      earned: true,
      earnedDate: "2 days ago",
      rarity: "common",
    },
    {
      id: "2",
      title: "Speed Demon",
      description: "Complete a test in under 30 minutes",
      icon: "⚡",
      category: "performance",
      difficulty: "hard",
      progress: 1,
      maxProgress: 1,
      xpReward: 200,
      earned: true,
      earnedDate: "1 week ago",
      rarity: "rare",
    },
    {
      id: "3",
      title: "Perfect Score",
      description: "Get 100% on any test",
      icon: "🎯",
      category: "performance",
      difficulty: "hard",
      progress: 0,
      maxProgress: 1,
      xpReward: 250,
      earned: false,
      rarity: "epic",
    },
    {
      id: "4",
      title: "Study Streak",
      description: "Study for 7 consecutive days",
      icon: "🔥",
      category: "consistency",
      difficulty: "medium",
      progress: 7,
      maxProgress: 7,
      xpReward: 150,
      earned: true,
      earnedDate: "3 days ago",
      rarity: "uncommon",
    },
    {
      id: "5",
      title: "Physics Master",
      description: "Complete 100 physics questions",
      icon: "⚛️",
      category: "subject",
      difficulty: "hard",
      progress: 72,
      maxProgress: 100,
      xpReward: 200,
      earned: false,
      rarity: "rare",
    },
    {
      id: "6",
      title: "Night Owl",
      description: "Complete a practice session after 10 PM",
      icon: "🦉",
      category: "special",
      difficulty: "easy",
      progress: 1,
      maxProgress: 1,
      xpReward: 50,
      earned: true,
      earnedDate: "5 days ago",
      rarity: "common",
    },
    {
      id: "7",
      title: "Chemistry Genius",
      description: "Score 95% or higher on 5 chemistry tests",
      icon: "🧪",
      category: "subject",
      difficulty: "epic",
      progress: 3,
      maxProgress: 5,
      xpReward: 300,
      earned: false,
      rarity: "legendary",
    },
    {
      id: "8",
      title: "Question Crusher",
      description: "Answer 1000 questions correctly",
      icon: "💪",
      category: "milestone",
      difficulty: "epic",
      progress: 887,
      maxProgress: 1000,
      xpReward: 500,
      earned: false,
      rarity: "legendary",
    },
  ]

  const milestones = [
    {
      id: "m1",
      title: "Level 5 Scholar",
      description: "Reached Level 5",
      icon: <Star className="w-6 h-6 text-yellow-500" />,
      achieved: true,
      date: "1 week ago",
    },
    {
      id: "m2",
      title: "Top 10% Student",
      description: "Ranked in top 10% of all students",
      icon: <Crown className="w-6 h-6 text-purple-500" />,
      achieved: true,
      date: "3 days ago",
    },
    {
      id: "m3",
      title: "100 Day Streak",
      description: "Study consistently for 100 days",
      icon: <Flame className="w-6 h-6 text-orange-500" />,
      achieved: false,
      progress: 12,
      maxProgress: 100,
    },
    {
      id: "m4",
      title: "Subject Master",
      description: "Complete all questions in any subject",
      icon: <Medal className="w-6 h-6 text-blue-500" />,
      achieved: false,
      progress: 0,
      maxProgress: 1,
    },
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-700 border-gray-300"
      case "uncommon":
        return "bg-green-100 text-green-700 border-green-300"
      case "rare":
        return "bg-blue-100 text-blue-700 border-blue-300"
      case "epic":
        return "bg-purple-100 text-purple-700 border-purple-300"
      case "legendary":
        return "bg-yellow-100 text-yellow-700 border-yellow-300"
      default:
        return "bg-gray-100 text-gray-700 border-gray-300"
    }
  }

  const filteredAchievements =
    selectedCategory === "all"
      ? achievements
      : achievements.filter((achievement) => achievement.category === selectedCategory)

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
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Achievements</h1>
                <p className="text-gray-600">Track your progress and unlock badges</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">
                Level {userStats.level}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {userStats.rank}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Badges</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.totalBadges}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Current Level</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.level}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Experience Points</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.xp.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Study Streak</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.streakDays} days</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Flame className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Level Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Level Progress
            </CardTitle>
            <CardDescription>
              {userStats.nextLevelXp - userStats.xp} XP needed to reach Level {userStats.level + 1}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Level {userStats.level}</span>
                <span>Level {userStats.level + 1}</span>
              </div>
              <Progress value={(userStats.xp / userStats.nextLevelXp) * 100} className="h-3" />
              <div className="text-center text-sm text-gray-600">
                {userStats.xp} / {userStats.nextLevelXp} XP
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="badges" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="badges">Badges & Achievements</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
          </TabsList>

          <TabsContent value="badges" className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === "all" ? "primary" : "outlined"}
                onClick={() => setSelectedCategory("all")}
              >
                All
              </Button>
              <Button
                variant={selectedCategory === "subject" ? "primary" : "outlined"}
                onClick={() => setSelectedCategory("subject")}
              >
                Subject
              </Button>
              <Button
                variant={selectedCategory === "performance" ? "primary" : "outlined"}
                onClick={() => setSelectedCategory("performance")}
              >
                Performance
              </Button>
              <Button
                variant={selectedCategory === "consistency" ? "primary" : "outlined"}
                onClick={() => setSelectedCategory("consistency")}
              >
                Consistency
              </Button>
              <Button
                variant={selectedCategory === "milestone" ? "primary" : "outlined"}
                onClick={() => setSelectedCategory("milestone")}
              >
                Milestone
              </Button>
              <Button
                variant={selectedCategory === "special" ? "primary" : "outlined"}
                onClick={() => setSelectedCategory("special")}
              >
                Special
              </Button>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAchievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className={`relative overflow-hidden transition-all duration-300 ${
                    achievement.earned
                      ? "bg-gradient-to-br from-white to-green-50 border-green-200 shadow-md"
                      : "bg-white hover:shadow-md"
                  }`}
                >
                  {achievement.earned && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  )}

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="text-4xl mb-2">{achievement.icon}</div>
                      <Badge className={`text-xs ${getRarityColor(achievement.rarity)}`}>{achievement.rarity}</Badge>
                    </div>
                    <CardTitle className={`text-lg ${achievement.earned ? "text-gray-900" : "text-gray-600"}`}>
                      {achievement.title}
                    </CardTitle>
                    <CardDescription className="text-sm">{achievement.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {!achievement.earned && achievement.maxProgress > 1 && (
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">
                            {achievement.progress}/{achievement.maxProgress}
                          </span>
                        </div>
                        <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-purple-600">
                        <Zap className="w-4 h-4" />
                        <span>{achievement.xpReward} XP</span>
                      </div>
                      {achievement.earned && (
                        <span className="text-green-600 text-xs">Earned {achievement.earnedDate}</span>
                      )}
                    </div>

                    {!achievement.earned && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Lock className="w-4 h-4" />
                          <span className="text-sm">Not yet earned</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="milestones" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {milestones.map((milestone) => (
                <Card
                  key={milestone.id}
                  className={`${
                    milestone.achieved ? "bg-gradient-to-br from-white to-blue-50 border-blue-200" : "bg-white"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {milestone.icon}
                        <div>
                          <CardTitle className="text-lg">{milestone.title}</CardTitle>
                          <CardDescription>{milestone.description}</CardDescription>
                        </div>
                      </div>
                      {milestone.achieved && <CheckCircle className="w-6 h-6 text-green-600" />}
                    </div>
                  </CardHeader>

                  <CardContent>
                    {milestone.achieved ? (
                      <div className="text-sm text-green-600">Achieved {milestone.date}</div>
                    ) : (
                      milestone.maxProgress && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">
                              {milestone.progress}/{milestone.maxProgress}
                            </span>
                          </div>
                          <Progress value={(milestone.progress! / milestone.maxProgress) * 100} className="h-2" />
                        </div>
                      )
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
