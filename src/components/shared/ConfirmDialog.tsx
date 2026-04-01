'use client'

import { useState } from 'react'
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ConfirmDialogProps {
  trigger: React.ReactElement
  title: string
  description: string
  onConfirm: () => Promise<void>
  confirmLabel?: string
}

export default function ConfirmDialog({
  trigger, title, description, onConfirm, confirmLabel = 'Sil',
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    setLoading(true)
    await onConfirm()
    setLoading(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">{title}</DialogTitle>
          <DialogDescription className="text-slate-400">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} className="border-slate-600 text-slate-300">
            İptal
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={loading}>
            {loading ? 'Siliniyor...' : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
