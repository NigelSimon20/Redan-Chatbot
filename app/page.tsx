// app/page.tsx
import ChatBot from './components/ChatBot';

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <ChatBot />
    </div>
  );
}
