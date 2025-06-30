"use client";

import Link from 'next/link';
import { useTopic } from '@/context/TopicContext'; // Import the hook

const topics: ("Politics" | "Sports" | "News" | "Custom Topic")[] = ["Politics", "Sports", "News", "Custom Topic"];

const Header = () => {
  const { selectedTopic, setSelectedTopic } = useTopic();

  return (
    <header className="bg-gray-800 text-white p-4 sticky top-0 z-50">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <Link href="/" className="text-2xl font-bold mb-2 sm:mb-0">
          PoliGraph+
        </Link>
        <nav>
          <ul className="flex space-x-2 sm:space-x-4">
            {topics.map((topic) => (
              <li key={topic}>
                <button
                  onClick={() => setSelectedTopic(topic)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${selectedTopic === topic
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                >
                  {topic}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
