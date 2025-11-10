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

            {/* Documentation Link */}
            <a
              href="https://github.com/londailey6937/Chapter-Analysis/tree/main/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
              title="View comprehensive documentation"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span className="hidden sm:inline">Documentation</span>
            </a>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                Documentation
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://github.com/londailey6937/Chapter-Analysis/blob/main/docs/QUICK_START.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    Quick Start Guide
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/londailey6937/Chapter-Analysis/blob/main/docs/ANALYSIS_RESULTS_GUIDE.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    Analysis Results Guide
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/londailey6937/Chapter-Analysis/blob/main/docs/DOMAIN_SPECIFIC_GUIDE.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    Domain-Specific Features
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/londailey6937/Chapter-Analysis/blob/main/docs/TECHNICAL_ARCHITECTURE.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    Technical Architecture
                  </a>
                </li>
              </ul>
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
