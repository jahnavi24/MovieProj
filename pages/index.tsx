import { useEffect, useState } from "react";
import { auth, signInWithGoogle, logOut } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

type UserState = {
  email: string;
  displayName?: string | null;
  photoURL?: string | null;
  googleId: string;
};

export default function Home() {
  const [user, setUser] = useState<UserState | null>(null);
  const [favoriteMovie, setFavoriteMovie] = useState("");
  const [movieInput, setMovieInput] = useState("");
  const [fact, setFact] = useState("");

  // Track Firebase login
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const { uid, email, displayName, photoURL } = currentUser;
        if (!email) return;

        setUser({ email, displayName, photoURL, googleId: uid });

        // Fetch user from DB
        const res = await fetch(`/api/user?email=${email}`);
        const data = await res.json();

        if (data?.favoriteMovie) {
          setFavoriteMovie(data.favoriteMovie);
          setMovieInput(data.favoriteMovie);
          fetchFunFact(data.favoriteMovie);
        }
      } else {
        setUser(null);
        setFavoriteMovie("");
        setMovieInput("");
        setFact("");
      }
    });

    return () => unsub();
  }, []);

  const handleSaveMovie = async () => {
    if (!movieInput || !user) return;

    const res = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        name: user.displayName || "",
        photoURL: user.photoURL || "",
        favoriteMovie: movieInput,
        googleId: user.googleId,
      }),
    });

    const data = await res.json();
    setFavoriteMovie(data.favoriteMovie);
    fetchFunFact(data.favoriteMovie);
  };

  const fetchFunFact = async (movie: string) => {
    if (!movie) return;
    const res = await fetch("/api/movieFunFact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ movie }),
    });
    const data = await res.json();
    setFact(data.fact);
  };

  if (!user) {
    return <button onClick={signInWithGoogle}>Sign in with Google</button>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h3>Welcome {user.displayName}</h3>
      <p>{user.email}</p>
      <img src={user.photoURL ?? ""} alt="profile" width={60} />
      <button onClick={logOut} style={{ marginTop: "1rem" }}>Logout</button>

      {!favoriteMovie ? (
        <div style={{ marginTop: "2rem" }}>
          <h4>Enter your favorite movie:</h4>
          <input
            type="text"
            value={movieInput}
            onChange={(e) => setMovieInput(e.target.value)}
          />
          <button onClick={handleSaveMovie} style={{ marginLeft: "1rem" }}>
            Save
          </button>
        </div>
      ) : (
        <div style={{ marginTop: "2rem" }}>
          <h4>Your favorite movie: {favoriteMovie}</h4>
          <p>Fun fact: {fact}</p>
          <button onClick={() => fetchFunFact(favoriteMovie)}>Get new fun fact</button>
        </div>
      )}
    </div>
  );
}
