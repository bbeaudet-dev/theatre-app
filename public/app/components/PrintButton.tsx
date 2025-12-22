"use client"

import { Button } from "./ui/button"
import { Printer } from "lucide-react"

export function PrintButton() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <Button onClick={handlePrint} variant="outline" className="print:hidden flex items-center gap-2 bg-transparent">
      <Printer className="h-4 w-4" />
      Print Resume
    </Button>
  )
} 