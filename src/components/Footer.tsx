'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-gray-700/50 dark:border-gray-300/50">
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-4 md:mb-0">
          © {currentYear} Secure the Bag | All data is stored locally in your browser
        </p>
        <div className="flex space-x-4">
          <button className="text-sm text-gray-400 dark:text-gray-500 hover:text-pink-400 dark:hover:text-pink-600">
            Privacy Policy
          </button>
          <button className="text-sm text-gray-400 dark:text-gray-500 hover:text-pink-400 dark:hover:text-pink-600">
            Terms of Use
          </button>
          <button className="text-sm text-gray-400 dark:text-gray-500 hover:text-pink-400 dark:hover:text-pink-600">
            Contact
          </button>
        </div>
      </div>
    </footer>
  );
}