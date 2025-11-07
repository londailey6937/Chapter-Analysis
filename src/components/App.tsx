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
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">🧠</span>
              </div>
              <h1 className="text-2xl font-bold text-gradient">
                Chapter Checker
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ChapterChecker />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">About</h4>
              <p className="text-sm text-gray-600">
                Chapter Checker analyzes educational content using
                evidence-based learning science principles.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Based On</h4>
              <p className="text-sm text-gray-600">
                10 cognitive science principles from peer-reviewed research.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Built With</h4>
              <p className="text-sm text-gray-600">
                React, TypeScript, Tailwind CSS, and Recharts.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-600">
              © 2024 Chapter Checker. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
