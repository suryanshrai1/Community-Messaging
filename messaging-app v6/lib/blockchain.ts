import crypto from "crypto"
import type { BlockchainBlock } from "./supabase"

export class SimpleBlockchain {
  private chain: BlockchainBlock[] = []

  constructor() {
    // Create genesis block
    this.chain = [this.createGenesisBlock()]
  }

  private createGenesisBlock(): BlockchainBlock {
    return {
      index: 0,
      timestamp: new Date().toISOString(),
      messageHash: "0",
      previousHash: "0",
      message: "Genesis Block",
    }
  }

  private getLatestBlock(): BlockchainBlock {
    return this.chain[this.chain.length - 1]
  }

  private calculateHash(index: number, timestamp: string, message: string, previousHash: string): string {
    return crypto
      .createHash("sha256")
      .update(index + timestamp + message + previousHash)
      .digest("hex")
  }

  addBlock(message: string): BlockchainBlock {
    const previousBlock = this.getLatestBlock()
    const newIndex = previousBlock.index + 1
    const timestamp = new Date().toISOString()
    const messageHash = this.calculateHash(newIndex, timestamp, message, previousBlock.messageHash)

    const newBlock: BlockchainBlock = {
      index: newIndex,
      timestamp,
      messageHash,
      previousHash: previousBlock.messageHash,
      message,
    }

    this.chain.push(newBlock)
    return newBlock
  }

  getChain(): BlockchainBlock[] {
    return this.chain
  }
}

// Global blockchain instance
let blockchainInstance: SimpleBlockchain | null = null

export function getBlockchain(): SimpleBlockchain {
  if (!blockchainInstance) {
    blockchainInstance = new SimpleBlockchain()
  }
  return blockchainInstance
}
