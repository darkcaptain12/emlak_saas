'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import RentalCard from './RentalCard'
import RentalForm from './RentalForm'
import { Plus } from 'lucide-react'
import type { Rental, Client } from '@/types'

interface RentalsListProps {
  propertyId: string
  clients: Client[]
  canManageRentals: boolean
}

export default function RentalsList({
  propertyId,
  clients,
  canManageRentals,
}: RentalsListProps) {
  const [rentals, setRentals] = useState<Rental[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    loadRentals()
  }, [propertyId])

  async function loadRentals() {
    try {
      const response = await fetch(`/api/rentals?property_id=${propertyId}`)
      if (response.ok) {
        const data = await response.json()
        setRentals(data)
      }
    } catch (error) {
      console.error('Kiracılar yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleSuccess() {
    setShowForm(false)
    setEditingId(null)
    loadRentals()
  }

  const editingRental = editingId ? rentals.find((r) => r.id === editingId) : undefined

  if (!canManageRentals) {
    return (
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 text-center">
        <p className="text-slate-400 text-sm">Kiracı yönetimi paketinizde mevcut değildir.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Başlık ve Ekle Butonu */}
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Kiracılar</h3>
        <Button
          onClick={() => {
            setEditingId(null)
            setShowForm(!showForm)
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm h-8"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          Kiracı Ekle
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
          <RentalForm
            propertyId={propertyId}
            rentalId={editingId || undefined}
            clients={clients}
            initialData={editingRental}
            onSuccess={handleSuccess}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowForm(false)
              setEditingId(null)
            }}
            className="w-full mt-3 border-slate-600 text-slate-300"
          >
            İptal
          </Button>
        </div>
      )}

      {/* Kiracılar Listesi */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-slate-400 text-sm">Yükleniyor...</p>
        </div>
      ) : rentals.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
          <p className="text-slate-400 text-sm mb-4">Bu ilana ait kiracı bulunmamaktadır.</p>
          <p className="text-slate-500 text-xs">Kiracı eklemek için yukarıdaki butonu tıklayın.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rentals.map((rental) => (
            <RentalCard
              key={rental.id}
              rental={rental}
              tenant={clients.find((c) => c.id === rental.tenant_id)}
              onEdit={() => {
                setEditingId(rental.id)
                setShowForm(true)
              }}
              canDelete={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}
