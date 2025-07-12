"use client"

import { ArrowRight } from "lucide-react"
import { LucideIcon } from "lucide-react"

interface Action {
  title: string
  description: string
  icon: LucideIcon
  color: string
  count: string
  badge?: string | null
}

interface IconComponentCardProps {
  action: Action
  IconComponent: LucideIcon
}

export const IconComponentCard = ({ action, IconComponent }: IconComponentCardProps) => (
  <>
    <div className="flex items-center justify-between mb-4">
      <div
        className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
      >
        <IconComponent className="w-6 h-6 text-white" />
      </div>
      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
    </div>
    <h3 className="font-semibold text-text mb-2 group-hover:text-primary transition-colors">
      {action.title}
    </h3>
    <p className="text-sm text-gray-600 mb-3">{action.description}</p>
    <div className="flex items-center justify-between">
      <div className="text-xs font-medium text-gray-500">{action.count}</div>
      {action.badge && (
        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">{action.badge}</span>
      )}
    </div>
  </>
)