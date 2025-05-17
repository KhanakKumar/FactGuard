import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import Image from "next/image";
import { useRouter } from 'next/router'

const Home: NextPage = () => {
  const [showAboutModal, setShowAboutModal] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const router = useRouter()

  const handleCheck = () => {
    router.push('/analysis')
  }

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Here you would typically send the feedback to your backend
    console.log({ feedback, email })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setSubmitSuccess(true)
    setFeedback('')
    setEmail('')
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setSubmitSuccess(false)
      setShowFeedbackModal(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>FactGuard | Fake News Detection</title>
        <meta name="description" content="Detect fake news with AI" />
      </Head>
      
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">Fake news and Facts Checker</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <button 
                onClick={() => setShowAboutModal(true)}
                className="text-gray-700 hover:text-blue-600 px-4 py-3 text-lg font-medium"
              >
                About Us
              </button>
              <button 
                onClick={() => setShowFeedbackModal(true)}
                className="text-gray-700 hover:text-blue-600 px-4 py-3 text-lg font-medium"
              >
                Feedback
              </button>
            </div>
          </div>
        </div>
      </nav>

      {showAboutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4 text-center">About FactGuard</h2>
            
            {/* Mission */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Our Mission</h3>
              <p className="text-gray-700">
                FactGuard combats misinformation using AI to verify news credibility in real time.
              </p>
            </div>

            {/* How It Works */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">How We Verify Facts</h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Scans the news for bias and inconsistencies</li>
                <li>Cross-references trusted sources</li>
                <li>Flags misleading claims</li>
              </ul>
            </div>

            {/* Team */}
            <h3 className="text-lg font-semibold mb-2 text-center">Meet our Team</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">SK</div>
                <div>
                  <h4 className="font-medium">Snehal Kale</h4>
                  <p className="text-xs text-gray-500">Email: kalesnehal24@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">KK</div>
                <div>
                  <h4 className="font-medium">Khanak Kumar</h4>
                  <p className="text-xs text-gray-500">Email: khanakkumar3000@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">KK</div>
                <div>
                  <h4 className="font-medium">Koushiki Khobare</h4>
                  <p className="text-xs text-gray-500">Email: koushikikhobare10@gmail.com</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowAboutModal(false)}
              className="mt-6 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Send Us Feedback</h2>
            
            {submitSuccess ? (
              <div className="text-center py-8">
                <div className="text-green-500 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-lg font-medium">Thank you for your feedback!</p>
                <p className="text-gray-600 mt-2">We appreciate your input.</p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">
                      Your Feedback
                    </label>
                    <textarea
                      id="feedback"
                      rows={4}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email (optional)
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Feedback'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16 lg:px-8">
        <div className="text-center bg-white rounded-xl p-8 shadow-lg">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl">
            <span className="block">FactGuard:</span>
            <span className="block text-blue-600">Your Shield Against Misinformation</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-700 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Uncover the truth behind the headlines with real-time fact-checking and reliable news verification.
          </p>
          
          {/* CHECK Button Only */}
          <div className="mt-8 flex justify-center">
            <button 
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors"
              onClick={handleCheck}
            >
              CHECK
            </button>
          </div>
        </div>

        <section className="mt-10 p-10 bg-white rounded-lg shadow-md text-gray-800 flex flex-col md:flex-row items-center justify-between">
          {/* Left Side: Text Content */}
          <div className="w-full md:w-1/2 pr-0 md:pr-6 mb-6 md:mb-0">
            <h2 className="text-2xl font-bold">Why FactGuard?</h2>
            <p className="mt-4">
              In today's digital world, misinformation spreads faster than ever. 
              FactGuard helps you analyze news bias and authenticity with the power of AI. 
              Our system scans, verifies, and labels news articles based on political bias and credibility, 
              ensuring you always get the most trustworthy information. 
              Stay informed with data-backed insights and break free from media manipulation!
            </p>
          </div>

          {/* Right Side: Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <Image 
              src="/pblimage2.jpg" 
              alt="Flag Misinformation" 
              width={350} 
              height={250} 
              className="rounded-lg shadow-lg"
              priority
            />
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mt-16 px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 rounded-lg shadow-lg mb-12 w-full max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-800">How It Works</h2>
          </div>

          <div className="relative max-w-3xl mx-auto">
            {/* Vertical Timeline */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-400 z-0"></div>

            <div className="space-y-16 relative z-10">
              {/* Step 1 - Left */}
              <div className="relative flex justify-start items-start">
                <div className="w-full sm:w-1/2 pr-0 sm:pr-8">
                  <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100">
                    <div className="absolute -right-3 sm:-right-6 top-0 h-10 w-10 sm:h-12 sm:w-12 bg-blue-500 text-white flex items-center justify-center rounded-full shadow-lg font-bold border-4 border-white">
                      1
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Step 1: Enter the News URL</h3>
                    <p className="text-gray-700 mt-2">
                      Copy and paste the URL of the news article or enter the headline you want to verify.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 - Right */}
              <div className="relative flex justify-end items-start">
                <div className="w-full sm:w-1/2 pl-0 sm:pl-8">
                  <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100">
                    <div className="absolute -left-3 sm:-left-6 top-0 h-10 w-10 sm:h-12 sm:w-12 bg-blue-500 text-white flex items-center justify-center rounded-full shadow-lg font-bold border-4 border-white">
                      2
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Step 2: Analysis of given input</h3>
                    <p className="text-gray-700 mt-2">
                      Our model processes the content, detects the news, calculate its credibility, and detects bias.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 - Left (smaller) */}
              <div className="relative flex justify-start items-start">
                <div className="w-full sm:w-5/12 pr-0 sm:pr-8">
                  <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100">
                    <div className="absolute -right-3 sm:-right-6 top-0 h-10 w-10 sm:h-12 sm:w-12 bg-blue-500 text-white flex items-center justify-center rounded-full shadow-lg font-bold border-4 border-white">
                      3
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Step 3: Get Results</h3>
                    <p className="text-gray-700 mt-2">
                      View an easy-to-read report on the authenticity, get the credibility score and bias of the article.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-700">© {new Date().getFullYear()} FactGuard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home