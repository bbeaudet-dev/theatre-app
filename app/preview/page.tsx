import PreviewChatbot from "./PreviewChatbot";

export default function PreviewPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Preview</h1>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
        Get AI-powered recommendations to help you decide if you'll enjoy a
        show. Ask about single shows or compare multiple shows to see which one
        you should see.
      </p>
      <PreviewChatbot />
    </div>
  );
}

