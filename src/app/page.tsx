import UpdatesFeed from "@/components/UpdatesFeed";
import LiveGameScores from "@/components/LiveGameScores";
import NewsFeed from "@/components/NewsFeed";

export default function Home() {
  return (
    <div className="space-y-6">
      <header className="bg-white shadow p-6 rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to PoliGraph Plus</h1>
        <p className="text-gray-600 mt-1">Your central hub for the latest updates, live sports, and breaking news.</p>
      </header>

      {/* Main content grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Updates Feed - takes full width on small screens, 1/3 on medium+ */}
        <section className="md:col-span-1">
          <UpdatesFeed />
        </section>

        {/* Live Game Scores - takes full width on small screens, 1/3 on medium+ */}
        <section className="md:col-span-1">
          <LiveGameScores />
        </section>

        {/* News Feed - takes full width on small screens, 1/3 on medium+ */}
        <section className="md:col-span-1">
          <NewsFeed />
        </section>
      </div>

      {/* Alternative layout idea: Wider central column for news, flanked by updates and scores */}
      {/*
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <section className="lg:col-span-1">
          <UpdatesFeed />
        </section>
        <section className="lg:col-span-2">
          <NewsFeed />
        </section>
        <section className="lg:col-span-1">
          <LiveGameScores />
        </section>
      </div>
      */}
    </div>
  );
}
