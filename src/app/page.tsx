import Link from "next/link";
import { cookies } from "next/headers";

export default function Home() {
  const cookieStore = cookies();
  const isAuth = !!cookieStore.get("accessToken")?.value;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to SongLyrics Manager!
      </h1>
      <p className="w-1/2 text-lg mb-8 text-center">
        A simple and intuitive application for managing your song lyrics.
        Create, edit, and organize your favorite songs effortlessly. Join our
        community of songwriters and music enthusiasts today!
      </p>
      <div className="flex space-x-4">
        {isAuth ? (
          <Link
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            href="/songs"
          >
            Songs
          </Link>
        ) : (
          <>
            <Link
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              href="/registration"
            >
              Register
            </Link>
            <Link
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              href="/login"
            >
              Login
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
