import PreviewChatbot from "./PreviewChatbot";

export default function PreviewPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Preview</h1>
      <p className="text-gray-600 mb-6">
        Get AI-powered recommendations to help you decide if you'll enjoy a
        show. Ask about single shows or compare multiple shows to see which one
        you should see.
      </p>
      <PreviewChatbot />
    </div>
  );
}

