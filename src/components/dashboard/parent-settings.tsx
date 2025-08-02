"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import {  User, Bell, Shield, Save, Eye, EyeOff, SettingsIcon, CreditCard , Check, Edit, X} from "lucide-react"
import DashboardLayout from "./dashboard.layout"
import ParentSidebar from "./parent-sidebar"

import type {CustomUser } from "@/types/auth"; // adjust path if needed

export default function ParentSettings() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [children, setChildren] = useState([])
  const [layoutUser, setLayoutUser] = useState<CustomUser | null>(null);

  const [formData, setFormData] = useState<{
    firstName: string
    lastName: string
    email: string
    phone?: string
    address?: string
  }>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  })

  const [notifications, setNotifications] = useState({
    emailProgress: true,
    emailAchievements: true,
    emailSchedule: false,
    emailExams: true,
    pushUrgent: true,
    pushDaily: false,
  })

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
  })

  const [preferences, setPreferences] = useState({
    darkMode: false,
    compactView: false,
    animations: true,
    analytics: true,
    marketing: false,
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (field: string) => {
    setNotifications((prev) => ({ ...prev, [field]: !prev[field as keyof typeof prev] }))
  }

  const handlePreferenceChange = (field: string) => {
    setPreferences((prev) => ({ ...prev, [field]: !prev[field as keyof typeof prev] }))
  }

  const handleSave = () => {
    setIsEditing(false)
    // Save logic here
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset form data
  }
  useEffect(() => {
    if (layoutUser) {
      setFormData({
        firstName: layoutUser.first_name || "",
        lastName: layoutUser.last_name || "",
        email: layoutUser.email || "",
        phone: "",
        address: "",
      });
    }
  }, [layoutUser]);


  const tabs = [
    { id: "overview", label: "Overview & Profile", icon: User },
    { id: "billing", label: "Plan & Billing", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "preferences", label: "Preferences", icon: SettingsIcon },
  ]

  return (
    <DashboardLayout>
      {(user) => {
        if (!layoutUser){
          setLayoutUser(user as CustomUser);
        }
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text">Settings</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>
          <Link
            href="/dashboard/parent"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
                 <ParentSidebar user={layoutUser} activePage="settings" />


        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-xl border border-gray-200">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? "border-primary text-primary"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>
            </div>

           {/* Tab Content */}
            <div className="p-6">
              {/* Overview & Profile Tab */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  {/* Account Status */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Overview</h3>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="font-medium text-gray-600">Account Type</span>
                            <span className="text-gray-900">Parent Account</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="font-medium text-gray-600">Member Since</span>
                            <span className="text-gray-900">January 2024</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="font-medium text-gray-600">Account Status</span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="font-medium text-gray-600">Children Enrolled</span>
                            <span className="text-gray-900">2 Children</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="font-medium text-gray-600">Current Plan</span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Family Premium
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="font-medium text-gray-600">Monthly Billing</span>
                            <span className="text-gray-900">$29.99/month</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="font-medium text-gray-600">Next Billing</span>
                            <span className="text-gray-900">Feb 15, 2024</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="font-medium text-gray-600">Questions This Month</span>
                            <span className="text-gray-900">1,247 / 2,000</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Information */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          Edit Profile
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={handleCancel}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                          <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Save className="w-4 h-4" />
                            Save Changes
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                            <input
                              type="text"
                              value={formData.firstName}
                              onChange={(e) => handleInputChange("firstName", e.target.value)}
                              disabled={!isEditing}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                            <input
                              type="text"
                              value={formData.lastName}
                              onChange={(e) => handleInputChange("lastName", e.target.value)}
                              disabled={!isEditing}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange("email", e.target.value)}
                              disabled={!isEditing}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => handleInputChange("phone", e.target.value)}
                              disabled={!isEditing}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                            <input
                              type="text"
                              value={formData.address}
                              onChange={(e) => handleInputChange("address", e.target.value)}
                              disabled={!isEditing}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Plan & Billing Tab */}
              {activeTab === "billing" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h3>

                    {/* Current Plan Details */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">Family Premium Plan</h4>
                          <p className="text-gray-600">Perfect for families with multiple children</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-2xl font-bold text-blue-600">$29.99</span>
                            <span className="text-gray-500">/month</span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Current Plan
                            </span>
                          </div>
                        </div>
                        <Check className="w-8 h-8 text-blue-600" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-3">Plan Features</h5>
                          <ul className="space-y-2">
                            {[
                              "Up to 5 children accounts",
                              "2,000 questions per month",
                              "Advanced progress tracking",
                              "Priority customer support",
                              "Custom study schedules",
                              "Detailed performance reports",
                            ].map((feature, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <Check className="w-4 h-4 text-green-600" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-semibold text-gray-900 mb-3">Usage This Month</h5>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span>Questions Used</span>
                                <span>1,247 / 2,000</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "62%" }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span>Children Enrolled</span>
                                <span>2 / 5</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "40%" }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span>Reports Generated</span>
                                <span>8 / Unlimited</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-green-600 h-2 rounded-full" style={{ width: "100%" }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Plan Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <button className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="text-center">
                          <SettingsIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                          <div className="font-medium text-gray-900">Upgrade Plan</div>
                          <div className="text-sm text-gray-600">Get more features</div>
                        </div>
                      </button>

                      <button className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="text-center">
                          <CreditCard className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <div className="font-medium text-gray-900">Billing History</div>
                          <div className="text-sm text-gray-600">View past invoices</div>
                        </div>
                      </button>

                      <button className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="text-center">
                          <Edit className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                          <div className="font-medium text-gray-900">Update Payment</div>
                          <div className="text-sm text-gray-600">Change payment method</div>
                        </div>
                      </button>
                    </div>

                    {/* Payment Information */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Payment Information</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="font-medium text-gray-600">Payment Method</span>
                          <span className="text-gray-900">•••• •••• •••• 4242</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="font-medium text-gray-600">Card Type</span>
                          <span className="text-gray-900">Visa</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="font-medium text-gray-600">Expires</span>
                          <span className="text-gray-900">12/2027</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="font-medium text-gray-600">Billing Address</span>
                          <span className="text-gray-900">123 Main Street, Anytown, ST 12345</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>

                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Email Notifications</h4>
                        {[
                          {
                            id: "emailProgress",
                            label: "Weekly progress reports",
                            description: "Get weekly summaries of your children's learning progress",
                          },
                          {
                            id: "emailAchievements",
                            label: "Achievement notifications",
                            description: "Be notified when your children earn badges or complete milestones",
                          },
                          {
                            id: "emailSchedule",
                            label: "Study schedule reminders",
                            description: "Receive reminders about upcoming study sessions",
                          },
                          {
                            id: "emailExams",
                            label: "Exam notifications",
                            description: "Get notified about upcoming exams and test results",
                          },
                        ].map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                          >
                            <div>
                              <h5 className="font-medium text-gray-900">{item.label}</h5>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notifications[item.id as keyof typeof notifications]}
                                onChange={() => handleNotificationChange(item.id)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Push Notifications</h4>
                        {[
                          {
                            id: "pushUrgent",
                            label: "Urgent notifications",
                            description: "Important updates that require immediate attention",
                          },
                          {
                            id: "pushDaily",
                            label: "Daily summaries",
                            description: "End-of-day summaries of your children's activities",
                          },
                        ].map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                          >
                            <div>
                              <h5 className="font-medium text-gray-900">{item.label}</h5>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notifications[item.id as keyof typeof notifications]}
                                onChange={() => handleNotificationChange(item.id)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Password & Security</h3>

                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Change Password</h4>
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <div className="space-y-4 max-w-md">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                              <div className="relative">
                                <input
                                  type={showPassword ? "text" : "password"}
                                  value={security.currentPassword}
                                  onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                              <div className="relative">
                                <input
                                  type={showNewPassword ? "text" : "password"}
                                  value={security.newPassword}
                                  onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password
                              </label>
                              <input
                                type="password"
                                value={security.confirmPassword}
                                onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                              <Save className="w-4 h-4" />
                              Update Password
                            </button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Two-Factor Authentication</h4>
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-gray-900">Enable 2FA</h5>
                              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={security.twoFactorEnabled}
                                onChange={(e) => setSecurity({ ...security, twoFactorEnabled: e.target.checked })}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Login Activity</h4>
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <div className="space-y-3">
                            {[
                              {
                                device: "Chrome on Windows",
                                location: "New York, NY",
                                time: "2 hours ago",
                                current: true,
                              },
                              {
                                device: "Safari on iPhone",
                                location: "New York, NY",
                                time: "1 day ago",
                                current: false,
                              },
                              {
                                device: "Chrome on Windows",
                                location: "New York, NY",
                                time: "3 days ago",
                                current: false,
                              },
                            ].map((session, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                              >
                                <div>
                                  <p className="font-medium text-gray-900">{session.device}</p>
                                  <p className="text-sm text-gray-600">
                                    {session.location} • {session.time}
                                  </p>
                                </div>
                                {session.current ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Current Session
                                  </span>
                                ) : (
                                  <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                                    Revoke
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === "preferences" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Preferences</h3>

                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Dashboard Settings</h4>
                        {[
                          { id: "darkMode", label: "Dark mode", description: "Use dark theme for the dashboard" },
                          {
                            id: "compactView",
                            label: "Compact view",
                            description: "Show more information in less space",
                          },
                          {
                            id: "animations",
                            label: "Enable animations",
                            description: "Show smooth transitions and animations",
                          },
                        ].map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                          >
                            <div>
                              <h5 className="font-medium text-gray-900">{item.label}</h5>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={preferences[item.id as keyof typeof preferences]}
                                onChange={() => handlePreferenceChange(item.id)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Privacy Settings</h4>
                        {[
                          {
                            id: "analytics",
                            label: "Usage analytics",
                            description: "Help improve the platform by sharing anonymous usage data",
                          },
                          {
                            id: "marketing",
                            label: "Marketing communications",
                            description: "Receive updates about new features and educational content",
                          },
                        ].map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                          >
                            <div>
                              <h5 className="font-medium text-gray-900">{item.label}</h5>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={preferences[item.id as keyof typeof preferences]}
                                onChange={() => handlePreferenceChange(item.id)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>

                      <div className="border-t pt-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Data Management</h4>
                        <div className="flex gap-4">
                          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                            Export Data
                          </button>
                          <button className="px-4 py-2 border border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    
        )}
    </DashboardLayout>
  )
}