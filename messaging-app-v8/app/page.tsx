import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Users, Shield, Blocks } from "lucide-react"

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">Share Your Thoughts</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          A minimal messaging platform with blockchain integration. Connect with others and see your messages secured on
          the blockchain.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/register">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/feed">
            <Button variant="outline" size="lg">
              View Public Feed
            </Button>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <MessageSquare className="h-8 w-8 text-blue-600" />
            <CardTitle>Simple Messaging</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Share messages up to 250 characters with the community</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Users className="h-8 w-8 text-green-600" />
            <CardTitle>Public Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>View all messages from users in real-time</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Shield className="h-8 w-8 text-purple-600" />
            <CardTitle>Secure Auth</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Powered by Supabase authentication and security</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Blocks className="h-8 w-8 text-orange-600" />
            <CardTitle>Blockchain</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Messages are hashed and stored in a simple blockchain</CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
