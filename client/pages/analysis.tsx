import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Analysis: React.FC = () => {
  const [query1, setQuery1] = useState('');
  const [query2, setQuery2] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!query1.trim() || !query2.trim()) {
      alert('Please enter both news articles or URLs');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/home', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query1, query2 }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Backend Response:', data); // 🟢 Logs response instead of routing
      } else {
        alert(data.error || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while analyzing the news.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-auto bg-gray-100">
      {/* Animated Section with Image and Text */}
      <section className="mt-10 p-10 bg-white rounded-lg shadow-md text-gray-800 flex flex-col md:flex-row items-center justify-between">
        {/* Left Side: Animated Text Content */}
        <motion.div
          initial={{ x: '-100vw', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 60, damping: 20, duration: 1.5 }}
          className="w-full md:w-1/2 pr-0 md:pr-6 mb-6 md:mb-0"
        >
          <h2 className="text-2xl font-bold">Uncover the Truth Behind the News</h2>
        </motion.div>

        {/* Right Side: Animated Image */}
        <motion.div
          initial={{ x: '100vw', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 60, damping: 20, duration: 1.5 }}
          className="w-full md:w-1/2 flex justify-center"
        >
          <Image
            src="/background.jpg"
            alt="Flag Misinformation"
            width={350}
            height={250}
            className="rounded-lg shadow-lg"
            priority
          />
        </motion.div>
      </section>

      {/* Main Content (Scrollable) */}
      <div className="w-full max-w-3xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
          Analyze News Articles
        </h1>

        {/* Search Box */}
        <div className="w-full bg-white shadow-lg rounded-xl p-8 space-y-6">
          <input
            type="text"
            placeholder="Enter first news article or paste URL..."
            value={query1}
            onChange={(e) => setQuery1(e.target.value)}
            className="w-full h-20 p-5 text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Enter second news article or paste URL..."
            value={query2}
            onChange={(e) => setQuery2(e.target.value)}
            className="w-full h-20 p-5 text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="w-full bg-blue-600 text-white px-6 py-3 text-lg rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Search'}
          </button>
        </div>

        {/* Back to Home Button */}
        <button
          onClick={() => router.push('/')}
          className="mt-6 text-blue-600 hover:underline text-lg w-full text-center block"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default Analysis;
