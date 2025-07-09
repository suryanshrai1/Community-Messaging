import { NextResponse } from "next/server"
import { getBlockchain } from "@/lib/blockchain"

export async function GET() {
  try {
    const blockchain = getBlockchain()
    return NextResponse.json(blockchain.getChain())
  } catch (error) {
    return NextResponse.json({ error: "Failed to get blockchain" }, { status: 500 })
  }
}
