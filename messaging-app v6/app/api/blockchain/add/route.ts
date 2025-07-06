import { type NextRequest, NextResponse } from "next/server"
import { getBlockchain } from "@/lib/blockchain"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const blockchain = getBlockchain()
    const newBlock = blockchain.addBlock(message)

    return NextResponse.json(newBlock)
  } catch (error) {
    return NextResponse.json({ error: "Failed to add block" }, { status: 500 })
  }
}
