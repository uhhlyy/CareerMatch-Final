import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-semibold text-blue-700">CareerMatch</div>
            <p className="mt-4 text-sm text-gray-600">Professional job matching for ambitious candidates and leading employers.</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/about" className="hover:text-blue-600">About</a></li>
              <li><a href="/careers" className="hover:text-blue-600">Careers</a></li>
              <li><a href="/press" className="hover:text-blue-600">Press</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/roleselection" className="hover:text-blue-600">Find Jobs</a></li>
              <li><a href="/employers" className="hover:text-blue-600">For Employers</a></li>
              <li><a href="/pricing" className="hover:text-blue-600">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Contact</h4>
            <p className="text-sm text-gray-600">support@careermatch.example</p>
            <div className="flex gap-4 mt-4">
              <a href="https://www.linkedin.com" aria-label="LinkedIn" className="text-gray-500 hover:text-blue-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4V24h-4V8zM8.5 8h3.84v2.2h.06c.54-1 1.86-2.1 3.83-2.1 4.1 0 4.86 2.7 4.86 6.2V24h-4v-7.3c0-1.7 0-3.9-2.38-3.9-2.38 0-2.74 1.85-2.74 3.77V24h-4V8z" />
                </svg>
              </a>

              <a href="https://twitter.com" aria-label="Twitter" className="text-gray-500 hover:text-blue-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.723 9.864 9.864 0 0 1-3.127 1.195 4.916 4.916 0 0 0-8.384 4.482A13.94 13.94 0 0 1 1.671 3.149a4.916 4.916 0 0 0 1.523 6.566 4.897 4.897 0 0 1-2.229-.616c-.054 2.28 1.581 4.415 3.949 4.89a4.935 4.935 0 0 1-2.224.084 4.918 4.918 0 0 0 4.59 3.417A9.867 9.867 0 0 1 0 19.54a13.94 13.94 0 0 0 7.548 2.212c9.057 0 14.01-7.506 14.01-14.01 0-.213-.005-.425-.014-.636A10.012 10.012 0 0 0 24 4.557z" />
                </svg>
              </a>

              <a href="https://github.com" aria-label="GitHub" className="text-gray-500 hover:text-blue-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.36-1.3-1.72-1.3-1.72-1.06-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.38.97.1-.75.41-1.27.75-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.2-3.09-.12-.3-.52-1.52.11-3.17 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.5 3.17-1.18 3.17-1.18.63 1.65.23 2.87.11 3.17.75.8 1.2 1.83 1.2 3.09 0 4.43-2.71 5.4-5.29 5.68.42.36.79 1.07.79 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.21.67.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} CareerMatch. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="/privacy" className="hover:text-blue-600">Privacy</a>
            <a href="/terms" className="hover:text-blue-600">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
