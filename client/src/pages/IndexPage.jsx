import { usePlaces } from '../../hooks';
import Spinner from '@/components/ui/Spinner';
import PlaceCard from '@/components/ui/PlaceCard';

const IndexPage = () => {
  const { places, loading } = usePlaces();

  if (loading) return <Spinner />;

  return (
    <section className="min-h-screen bg-gray-50 px-4 py-32">
      {places.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {places.map((place) => (
            <PlaceCard place={place} key={place._id} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-4xl font-bold text-gray-700">No Results Found</h1>
          <p className="text-lg text-gray-500">
            We couldn’t find any places. Try refining your search.
          </p>
          <a
            href="/"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 transition-transform group-hover:-translate-x-1"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Go Back
          </a>
        </div>
      )}
    </section>
  );
};

export default IndexPage;
