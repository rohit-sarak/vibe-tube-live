import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, update } from 'firebase/database';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [visitorCount, setVisitorCount] = useState(0);

  // Replace with your Firebase config
  const firebaseConfig = {
    apiKey: AIzaSyDFU9JS5Bd1jep5676zP1eAdkagS2RFpHs,
    authDomain: vibetubelive1.firebaseapp.com,
    databaseURL: https://vibetubelive1-default-rtdb.firebaseio.com,
    projectId: vibetubelive1,
    storageBucket: vibetubelive1.firebasestorage.app,
    messagingSenderId: 130606987584,
    appId: 1:130606987584:web:f66031ad2c284f9860e2a5,
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  // Visitor counter logic
  useEffect(() => {
    const visitorRef = ref(db, 'visitorCount');

    const newCount = visitorCount + 1;
    update(visitorRef, { count: newCount });

    const unsubscribe = onValue(visitorRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.count !== undefined) {
        setVisitorCount(data.count);
      }
    });

    return () => {
      update(visitorRef, { count: Math.max(visitorCount - 1, 0) });
      unsubscribe();
    };
  }, []);

  // Initial mock data
  const initialVideos = [
    {
      id: '1',
      title: 'Morning Vibes',
      description: 'Relaxing nature sounds to start your day.',
      thumbnail: 'https://picsum.photos/400/225?random=1 ',
      bunnyId: 'your-bunny-video-id-1',
    },
    {
      id: '2',
      title: 'Study Focus Music',
      description: 'Uplifting music to boost concentration.',
      thumbnail: 'https://picsum.photos/400/225?random=2 ',
      bunnyId: 'your-bunny-video-id-2',
    },
    {
      id: '3',
      title: 'Evening Relaxation',
      description: 'Calm melodies for unwinding after a long day.',
      thumbnail: 'https://picsum.photos/400/225?random=3 ',
      bunnyId: 'your-bunny-video-id-3',
    },
    {
      id: '4',
      title: 'Weekend Chilling',
      description: 'Beach vibes for a laid-back weekend.',
      thumbnail: 'https://picsum.photos/400/225?random=4 ',
      bunnyId: 'your-bunny-video-id-4',
    },
    {
      id: '5',
      title: 'Calm Rain Sounds',
      description: 'Rainy ambiance for deep relaxation.',
      thumbnail: 'https://picsum.photos/400/225?random=5 ',
      bunnyId: 'your-bunny-video-id-5',
    },
    {
      id: '6',
      title: 'Night Wind Sounds',
      description: 'Gentle wind sounds for peaceful sleep.',
      thumbnail: 'https://picsum.photos/400/225?random=6 ',
      bunnyId: 'your-bunny-video-id-6',
    },
  ];

  // Simulate loading more videos
  const loadMoreVideos = () => {
    const newPage = page + 1;
    const newVideos = Array.from({ length: 6 }, (_, i) => ({
      ...initialVideos[i % initialVideos.length],
      id: `${Date.now()}-${i}`,
      thumbnail: `https://picsum.photos/400/225?random= ${Math.floor(Math.random() * 100)}`,
    }));
    setVideos((prev) => [...prev, ...newVideos]);
    setPage(newPage);
  };

  // Infinite scroll effect
  const sentinelRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMoreVideos();
        }
      },
      { threshold: 1.0 }
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);

    return () => {
      if (sentinelRef.current) observer.unobserve(sentinelRef.current);
    };
  }, []);

  // Filter videos based on search term
  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setVideos(initialVideos);
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Header */}
      <header
        className={`flex flex-col sm:flex-row items-center justify-between px-6 py-4 shadow-md sticky top-0 z-10 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="flex flex-col items-center space-y-1 mb-2 sm:mb-0">
          {/* Logo */}
          <img
            src="/logo.png"
            alt="Vibe Tube Logo"
            className="w-8 h-8 object-contain"
          />
          <h1 className="text-xl font-bold tracking-wide">Vibe Tube</h1>
          <p className="text-green-500 text-xs font-medium">Live Users: {visitorCount}</p>
        </div>

        <div className="relative w-full sm:w-64 mb-2 sm:mb-0">
          <input
            type="text"
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full p-2 pl-10 rounded-full border ${
              darkMode
                ? 'bg-gray-700 border-gray-600 focus:bg-gray-600'
                : 'bg-gray-100 border-gray-300 focus:bg-white'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <svg
            className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            darkMode
              ? 'bg-gray-700 text-white hover:bg-gray-600'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </header>

      {/* Video Grid */}
      <main className="p-6 max-w-7xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Trending Now</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredVideos.map((video) => (
            <VideoCard key={video.id} video={video} darkMode={darkMode} />
          ))}
        </div>
        <div ref={sentinelRef} style={{ height: '20px' }}></div>
      </main>
    </div>
  );
}

function VideoCard({ video, darkMode }) {
  const handleThumbnailClick = () => {
    const iframe = document.createElement('iframe');
    iframe.src = `https://iframe.bunny.net/embed/ ${video.bunnyId}?autoplay=1`;
    iframe.allow = 'autoplay; fullscreen; clipboard-write';
    iframe.style.width = '100%';
    iframe.style.height = '100vh';
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.zIndex = '9999';
    iframe.style.border = 'none';
    iframe.style.backgroundColor = 'black';
    iframe.style.display = 'block';

    document.body.appendChild(iframe);

    iframe.addEventListener('click', () => {
      document.body.removeChild(iframe);
    });
  };

  return (
    <div
      className={`rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } cursor-pointer`}
      onClick={handleThumbnailClick}
    >
      <div className="relative group">
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          className="w-full h-40 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
          <iframe
            src={`https://iframe.bunny.net/embed/ ${video.bunnyId}?autoplay=1`}
            allow="autoplay; fullscreen; clipboard-write"
            className="w-full h-40 border-none"
            title={video.title}
          ></iframe>
        </div>
        <span className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-xs px-1 rounded">
          10:00
        </span>
      </div>
      <div className="p-3">
        <h2 className="text-sm md:text-base font-semibold line-clamp-2">{video.title}</h2>
        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {video.description}
        </p>
      </div>
    </div>
  );
}
