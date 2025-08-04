import './App.css';
import RotatingWords from "./RotatingWords";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img
          src="/map.png"
          alt="Map glowing"
          className="w-64 mx-auto mt-10 animate-glow"
        />
        <RotatingWords />

        <a
          href="/map.html"
          className="inline-flex items-center mt-6 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition"
        >
          Go to Map
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ml-2 h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </header>
    </div>
  );
}

export default App;
