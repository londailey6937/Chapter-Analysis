import { ChapterChecker } from "./ChapterChecker";

/**
 * App Component - Root application component
 *
 * Manages the primary application state and controls:
 * - Navigation between input and analysis views
 * - Chapter analysis data flow
 * - Loading states during analysis
 *
 * @returns {JSX.Element} The main application interface
 */
function App(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ChapterChecker />
      </main>
    </div>
  );
}

export default App;
