// src/components/NewsFeed.tsx
import React from 'react';
import Image from 'next/image'; // Import next/image

interface NewsArticle {
  id: string;
  title: string;
  source: string;
  publishedDate: string;
  snippet: string;
  category?: string;
  imageUrl?: string;
  link?: string; // Optional direct link to the article
}

const NewsFeed = () => {
  const articles: NewsArticle[] = [
    {
      id: 'n1',
      title: 'MLS Expansion: City X Officially Awarded New Franchise',
      source: 'SportsNet Central',
      publishedDate: 'July 28, 2024',
      snippet: 'Major League Soccer today announced City X as its 30th franchise, with play expected to begin in 2026. The move marks a significant milestone for the league\'s growth.',
      category: 'Soccer',
      imageUrl: 'https://via.placeholder.com/120x90?text=MLS+Franchise',
      link: '#'
    },
    {
      id: 'n2',
      title: 'AI Breakthrough: New Model Achieves Human-Level Text Generation',
      source: 'Tech Forward',
      publishedDate: 'July 27, 2024',
      snippet: 'Researchers at AI Labs have unveiled a new language model capable of generating text indistinguishable from human writing, raising both excitement and ethical concerns.',
      category: 'Technology',
      imageUrl: 'https://via.placeholder.com/120x90?text=AI+Model',
      link: '#'
    },
    {
      id: 'n3',
      title: 'Global Markets Surge as Inflation Fears Subside Temporarily',
      source: 'Economic Times',
      publishedDate: 'July 28, 2024',
      snippet: 'Stock markets worldwide experienced a significant rally today as new data suggested a potential easing of inflationary pressures, though analysts remain cautious.',
      category: 'Finance',
      imageUrl: 'https://via.placeholder.com/120x90?text=Market+Surge',
      link: '#'
    },
    {
      id: 'n4',
      title: 'Olympic Buzz: Athletes Arrive as Paris Prepares for Games',
      source: 'Global Sports Report',
      publishedDate: 'July 26, 2024',
      snippet: 'The first wave of athletes has touched down in Paris, with final preparations underway for the upcoming Olympic Games. Security and logistics are top priorities.',
      category: 'Olympics',
      imageUrl: 'https://via.placeholder.com/120x90?text=Paris+Olympics',
      link: '#'
    },
     {
      id: 'n5',
      title: 'Cybersecurity Alert: New Phishing Scam Targeting Cloud Users',
      source: 'SecureNet Daily',
      publishedDate: 'July 28, 2024',
      snippet: 'A sophisticated phishing campaign is reportedly targeting users of major cloud storage services. Experts advise extreme caution with unsolicited emails.',
      category: 'Security',
      imageUrl: 'https://via.placeholder.com/120x90?text=Cyber+Alert',
      link: '#'
    },
  ];

  return (
    <div className="p-4 bg-white shadow-lg rounded-xl h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Breaking News</h2>
      <div className="space-y-4 overflow-y-auto flex-grow pr-2">
        {articles.map(article => (
          <a href={article.link || '#'} target="_blank" rel="noopener noreferrer" key={article.id} className="block p-3.5 bg-slate-50 rounded-lg hover:shadow-xl transition-all duration-300 ease-in-out border border-slate-200 group hover:border-orange-300">
            <div className="flex items-start space-x-4">
              {article.imageUrl && (
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  width={112} // Corresponds to w-28 (28 * 4 = 112px)
                  height={96} // Corresponds to h-24 (24 * 4 = 96px)
                  className="object-cover rounded-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
                />
              )}
              <div className="flex-grow">
                {article.category && (
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full mb-1.5 inline-block ${
                    article.category === 'Soccer' || article.category === 'Olympics' ? 'bg-sky-100 text-sky-700' :
                    article.category === 'Technology' ? 'bg-indigo-100 text-indigo-700' :
                    article.category === 'Finance' ? 'bg-lime-100 text-lime-700' :
                    article.category === 'Security' ? 'bg-rose-100 text-rose-700' :
                    'bg-orange-100 text-orange-700' // Default
                  }`}>
                    {article.category}
                  </span>
                )}
                <h3 className="text-md font-semibold text-slate-800 group-hover:text-orange-600 transition-colors duration-200 leading-tight">{article.title}</h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed line-clamp-2 group-hover:line-clamp-none">{article.snippet}</p> {/* line-clamp for brevity */}
                <div className="flex justify-between items-center mt-2.5 text-xs text-slate-500">
                  <span>{article.source}</span>
                  <span>{article.publishedDate}</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;
