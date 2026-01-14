import React from 'react'
import SEO from '../components/SEO'

const Privacy = () => {
  return (
    <div className="container mx-auto px-4 py-24">
      <SEO title="Privacy Policy" description="BCVWorld privacy practices and data protection" />
      <div className="bg-white rounded-lg shadow-sm border p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-4"><i className="bi bi-shield-lock me-2"></i>Privacy Policy</h1>
        <p className="text-gray-700 mb-6">We respect your privacy. This policy explains what data we collect, how we use it, and your rights.</p>
        <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
        <ul className="list-disc pl-6 space-y-2 mb-6 text-gray-700">
          <li>Account details you provide, such as name and email</li>
          <li>Job interactions like views, saves, and applies</li>
          <li>Device and usage data to improve performance</li>
        </ul>
        <h2 className="text-xl font-semibold mb-2">How We Use Information</h2>
        <ul className="list-disc pl-6 space-y-2 mb-6 text-gray-700">
          <li>Provide and personalize job recommendations</li>
          <li>Maintain security and prevent misuse</li>
          <li>Improve features and user experience</li>
        </ul>
        <h2 className="text-xl font-semibold mb-2">Data Sharing</h2>
        <p className="text-gray-700 mb-6">We do not sell personal data. Limited sharing may occur with trusted providers to operate the service.</p>
        <h2 className="text-xl font-semibold mb-2">Your Choices</h2>
        <ul className="list-disc pl-6 space-y-2 mb-6 text-gray-700">
          <li>Access, update, or delete your account data</li>
          <li>Control cookies in your browser settings</li>
          <li>Contact support for privacy requests</li>
        </ul>
        <div className="mt-6">
          <a href="/profile" className="inline-block px-4 py-2 bg-blue-600 text-white rounded">Back to Profile</a>
        </div>
      </div>
    </div>
  )
}

export default Privacy
