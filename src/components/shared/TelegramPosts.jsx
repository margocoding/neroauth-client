import { useEffect, useState } from "react";
import NewsCard from "./NewsCard";

const TelegramPosts = ({ locale = "ru" }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPosts, setCurrentPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/posts/${locale}`);
        const data = await response.json();

        setIsLoading(false);

        setCurrentPosts(data);
      } catch (e) {
        console.error(e);
        setCurrentPosts([]);
      }
    };

    fetchPosts();
  }, [locale]);

  if (isLoading) {
    return (
      <section className="w-full mx-auto px-2 sm:px-4 -mt-3">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-orange-500/30 border-t-orange-500 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-300">
              {locale === "en" ? "Loading news..." : "Загрузка новостей..."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-2 sm:px-4 mt-2 sm:mt-3">
      <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {currentPosts.map((post) => (
          <NewsCard
            key={post.id}
            id={post.id}
            date={post.date}
            image={post.media.photo?.url}
            language={locale}
            message={post.message}
          />
        ))}
      </div>
    </section>
  );
};

export default TelegramPosts;
