"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import type { BlockchainBlock } from "@/lib/supabase"

export default function BlockchainPage() {
  const [blocks, setBlocks] = useState<BlockchainBlock[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBlockchain = async () => {
    try {
      const response = await fetch("/api/blockchain")
      if (response.ok) {
        const data = await response.json()
        setBlocks(data)
      }
    } catch (error) {
      console.error("Error fetching blockchain:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlockchain()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading blockchain...</div>
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blockchain Explorer</h1>
          <p className="text-gray-600">View the message blockchain history</p>
        </div>
        <Button onClick={fetchBlockchain} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {blocks.map((block) => (
          <Card key={block.index}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Block #{block.index}</span>
                <span className="text-sm font-normal text-gray-500">{new Date(block.timestamp).toLocaleString()}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <strong>Message:</strong>
                <p className="text-gray-700 mt-1">{block.message}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Hash:</strong>
                  <p className="font-mono text-xs break-all text-gray-600">{block.messageHash}</p>
                </div>
                <div>
                  <strong>Previous Hash:</strong>
                  <p className="font-mono text-xs break-all text-gray-600">{block.previousHash}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
