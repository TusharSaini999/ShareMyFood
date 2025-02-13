import logo from "./logo.svg";

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <header className="flex flex-col items-center p-6">
        <img src={logo} className="w-32 h-32 animate-spin" alt="logo" />
        <p className="mt-4 text-lg">
          Edit <code className="bg-gray-800 px-2 py-1 rounded">src/App.js</code> and save to reload.
        </p>
        <a
          className="mt-4 text-blue-400 hover:text-blue-300 transition duration-300"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
