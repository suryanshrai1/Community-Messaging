import { MessageList } from "@/components/message-list"

export default function FeedPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <MessageList title="Public Feed" />
    </div>
  )
}
