'use client'

import { useState, useTransition } from 'react'
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'
import { updateLeadStatus } from '@/lib/actions/lead.actions'
import { formatCurrency, formatRelativeDate } from '@/lib/utils'
import { Building2, User, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import type { Lead, LeadStatus } from '@/types'

const COLUMNS: {
  id: LeadStatus
  label: string
  color: string
  bgColor: string
  dotColor: string
}[] = [
  { id: 'new',       label: 'Yeni',       color: 'border-blue-500',   bgColor: 'bg-blue-500/10',   dotColor: 'bg-blue-500' },
  { id: 'contacted', label: 'İletişimde', color: 'border-yellow-500', bgColor: 'bg-yellow-500/10', dotColor: 'bg-yellow-500' },
  { id: 'viewing',   label: 'Geziliyor',  color: 'border-orange-500', bgColor: 'bg-orange-500/10', dotColor: 'bg-orange-500' },
  { id: 'offer',     label: 'Teklif',     color: 'border-purple-500', bgColor: 'bg-purple-500/10', dotColor: 'bg-purple-500' },
  { id: 'won',       label: 'Kazanıldı',  color: 'border-green-500',  bgColor: 'bg-green-500/10',  dotColor: 'bg-green-500' },
  { id: 'lost',      label: 'Kaybedildi', color: 'border-red-500',    bgColor: 'bg-red-500/10',    dotColor: 'bg-red-500' },
]

type KanbanLead = Omit<Lead, 'clients' | 'properties'> & {
  clients?: { full_name: string; phone?: string | null } | null
  properties?: { title: string; city: string } | null
}

export default function LeadKanban({ leads: initialLeads }: { leads: KanbanLead[] }) {
  const [leads, setLeads] = useState(initialLeads)
  const [, startTransition] = useTransition()

  function onDragEnd(result: DropResult) {
    if (!result.destination) return

    const leadId = result.draggableId
    const newStatus = result.destination.droppableId as LeadStatus

    const lead = leads.find((l) => l.id === leadId)
    if (!lead || lead.status === newStatus) return

    // Optimistic update
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    )

    startTransition(async () => {
      const res = await updateLeadStatus(leadId, newStatus)
      if (res?.error) {
        // Revert
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: lead.status } : l))
        )
      }
    })
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:-mx-8 md:px-8">
        {COLUMNS.map((col) => {
          const colLeads = leads.filter((l) => l.status === col.id)
          return (
            <div key={col.id} className="flex-shrink-0 w-64">
              {/* Column header */}
              <div className={`flex items-center justify-between mb-3 px-3 py-2.5 rounded-lg ${col.bgColor} border ${col.color}/30`}>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                  <span className="text-slate-200 font-semibold text-sm">{col.label}</span>
                </div>
                <span className="text-slate-400 text-xs bg-slate-800/60 px-2 py-0.5 rounded-full font-medium">
                  {colLeads.length}
                </span>
              </div>

              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-2 min-h-[120px] rounded-lg transition-colors p-1 ${
                      snapshot.isDraggingOver ? 'bg-slate-800/40' : ''
                    }`}
                  >
                    {colLeads.map((lead, index) => (
                      <Draggable key={lead.id} draggableId={lead.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-slate-900 border rounded-xl p-4 cursor-grab active:cursor-grabbing transition-all ${
                              snapshot.isDragging
                                ? 'border-blue-500 shadow-xl shadow-blue-500/20 rotate-1 scale-105'
                                : 'border-slate-800 hover:border-slate-600 hover:shadow-md hover:shadow-black/30'
                            }`}
                          >
                            {/* Client name */}
                            <div className="flex items-start justify-between gap-2 mb-2.5">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                  {lead.clients?.full_name?.[0]?.toUpperCase() ?? 'M'}
                                </div>
                                <span className="text-white text-sm font-semibold truncate">
                                  {lead.clients?.full_name ?? 'Müşteri'}
                                </span>
                              </div>
                              <Link
                                href={`/leads/${lead.id}`}
                                onClick={(e) => snapshot.isDragging && e.preventDefault()}
                                className="flex-shrink-0 p-1 text-slate-600 hover:text-slate-300 transition-colors"
                                aria-label="Detay"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            </div>

                            {/* Property */}
                            {lead.properties && (
                              <div className="flex items-center gap-1.5 mb-2">
                                <Building2 className="w-3 h-3 text-slate-500 flex-shrink-0" />
                                <span className="text-slate-400 text-xs truncate">
                                  {lead.properties.title}
                                </span>
                              </div>
                            )}

                            {/* Phone */}
                            {lead.clients?.phone && (
                              <div className="flex items-center gap-1.5 mb-2">
                                <User className="w-3 h-3 text-slate-500 flex-shrink-0" />
                                <span className="text-slate-400 text-xs">{lead.clients.phone}</span>
                              </div>
                            )}

                            {/* Budget */}
                            {(lead.budget_min || lead.budget_max) && (
                              <p className="text-blue-400 text-xs font-medium mb-2">
                                {lead.budget_min && formatCurrency(lead.budget_min)}
                                {lead.budget_min && lead.budget_max && ' – '}
                                {lead.budget_max && formatCurrency(lead.budget_max)}
                              </p>
                            )}

                            {/* Footer */}
                            <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-slate-800">
                              {lead.source && (
                                <span className="text-slate-600 text-xs capitalize">{lead.source}</span>
                              )}
                              <span className="text-slate-600 text-xs ml-auto">
                                {formatRelativeDate(lead.created_at)}
                              </span>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {/* Empty column hint */}
                    {colLeads.length === 0 && !snapshot.isDraggingOver && (
                      <div className="h-16 rounded-lg border border-dashed border-slate-800 flex items-center justify-center">
                        <span className="text-slate-700 text-xs">Buraya sürükleyin</span>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          )
        })}
      </div>
    </DragDropContext>
  )
}
