import React from 'react'
import SEO from '../components/SEO'

const Terms = () => {
  return (
    <div className="container mx-auto px-4 pt-32 md:pt-36 pb-24">
      <SEO title="Terms of Service" description="BCVWorld terms and acceptable use" />
      <div className="bg-white rounded-lg shadow-sm border p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-4"><i className="bi bi-file-earmark-check me-2"></i>Terms of Service</h1>
        <p className="text-gray-700 mb-6">By using BCVWorld, you agree to these terms. Please read them carefully.</p>
        <h2 className="text-xl font-semibold mb-2">Using Our Services</h2>
        <ul className="list-disc pl-6 space-y-2 mb-6 text-gray-700">
          <li>Provide accurate information and use the platform responsibly</li>
          <li>Do not post harmful, illegal, or misleading content</li>
          <li>Respect intellectual property and community guidelines</li>
        </ul>
        <h2 className="text-xl font-semibold mb-2">Content and Ownership</h2>
        <p className="text-gray-700 mb-6">All trademarks and logos remain the property of their owners. You grant us permission to process content you submit to operate the service.</p>
        <h2 className="text-xl font-semibold mb-2">Disclaimers</h2>
        <p className="text-gray-700 mb-6">We provide services as-is and strive to maintain accuracy and availability. We are not liable for external links or third-party job listings.</p>
        <h2 className="text-xl font-semibold mb-2">Termination</h2>
        <p className="text-gray-700 mb-6">We may suspend or terminate access for violations. You may stop using the service at any time.</p>
        <div className="mt-6">
          <a href="/profile" className="inline-block px-4 py-2 bg-blue-600 text-white rounded">Back to Profile</a>
        </div>
      </div>
    </div>
  )
}

export default Terms
