'use client'

import { useState, useEffect } from 'react'
import {
  PlanningServicesHeader,
  PreparationsSummaryCard,
  PreparationsTable,
  ServiceModal,
  ConfirmDialog,
} from '@/components/planning'
import type { PreparationService } from '@/types/planning'

// Initial dummy data
const createInitialServices = (): PreparationService[] => [
  {
    id: '1',
    title: 'Wedding Dress',
    icon: { kind: 'asset', value: 'weddingDress' },
    serviceType: 'rent',
    quantity: 1,
    cost: 5000,
    advancePayment: 2000,
    providerUserName: 'Bridal Boutique',
    purchaseDate: '2024-06-15',
    completed: true,
  },
  {
    id: '2',
    title: 'Wedding Hall',
    icon: { kind: 'asset', value: 'weddingHall' },
    serviceType: 'rent',
    quantity: 1,
    cost: 15000,
    advancePayment: 5000,
    providerUserName: 'Grand Venue',
    purchaseDate: '2024-05-20',
    completed: false,
  },
  {
    id: '3',
    title: 'Photography',
    icon: { kind: 'asset', value: 'photography' },
    serviceType: 'service',
    quantity: 1,
    cost: 3000,
    advancePayment: 1000,
    providerUserName: 'Photo Studio',
    purchaseDate: '2024-07-01',
    completed: false,
  },
  {
    id: '4',
    title: 'Bridal Beauty',
    icon: { kind: 'asset', value: 'bridalBeauty' },
    serviceType: 'service',
    quantity: 1,
    cost: 2000,
    advancePayment: 500,
    providerUserName: 'Beauty Salon',
    purchaseDate: '2024-06-30',
    completed: true,
  },
]

export default function BookingsPage() {
  const [services, setServices] = useState<PreparationService[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<PreparationService | undefined>()
  const [serviceToDelete, setServiceToDelete] = useState<PreparationService | undefined>()

  useEffect(() => {
    setServices(createInitialServices())
  }, [])

  const handleAdd = () => {
    setEditingService(undefined)
    setIsModalOpen(true)
  }

  const handleEdit = (service: PreparationService) => {
    setEditingService(service)
    setIsModalOpen(true)
  }

  const handleDelete = (service: PreparationService) => {
    setServiceToDelete(service)
    setIsConfirmDialogOpen(true)
  }

  const handleSave = (serviceData: {
    completed: boolean
    serviceKey: string
    title: string
    serviceType: 'rent' | 'buy'
    quantity: number
    cost: number
    advancePayment: number
    providerUserName: string
    purchaseDate: string
  }) => {
    // Map the new payload to PreparationService format
    const mappedService: Omit<PreparationService, 'id'> = {
      title: serviceData.title,
      icon: { kind: 'asset', value: serviceData.serviceKey },
      serviceType: serviceData.serviceType,
      quantity: serviceData.quantity,
      cost: serviceData.cost,
      advancePayment: serviceData.advancePayment,
      providerUserName: serviceData.providerUserName,
      purchaseDate: serviceData.purchaseDate || '',
      completed: serviceData.completed,
    }

    if (editingService) {
      // Edit existing
      setServices(prev =>
        prev.map(s => (s.id === editingService.id ? { ...mappedService, id: s.id } : s))
      )
    } else {
      // Add new
      const newService: PreparationService = {
        ...mappedService,
        id: Date.now().toString(),
      }
      setServices(prev => [...prev, newService])
    }
  }

  const handleConfirmDelete = () => {
    if (serviceToDelete) {
      setServices(prev => prev.filter(s => s.id !== serviceToDelete.id))
      setIsConfirmDialogOpen(false)
      setServiceToDelete(undefined)
    }
  }

  const completed = services.filter(s => s.completed).length
  const total = services.length

  return (
    <div className="w-full min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Add Button */}
        <PlanningServicesHeader onAdd={handleAdd} />

        {/* Summary Card */}
        <div className="mb-8">
          <PreparationsSummaryCard total={total} completed={completed} />
        </div>

        {/* Preparations Table */}
        <div className="mb-8">
          <PreparationsTable
            services={services}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Modals */}
        <ServiceModal
          open={isModalOpen}
          mode={editingService ? 'edit' : 'add'}
          initialValue={
            editingService
              ? {
                  id: editingService.id,
                  serviceKey:
                    editingService.icon.kind === 'asset'
                      ? editingService.icon.value
                      : undefined,
                  title: editingService.title,
                  serviceType: editingService.serviceType,
                  quantity: editingService.quantity,
                  cost: editingService.cost,
                  advancePayment: editingService.advancePayment,
                  providerUserName: editingService.providerUserName,
                  purchaseDate: editingService.purchaseDate || '',
                  completed: editingService.completed,
                }
              : undefined
          }
          onClose={() => {
            setIsModalOpen(false)
            setEditingService(undefined)
          }}
          onSave={handleSave}
        />

        <ConfirmDialog
          open={isConfirmDialogOpen}
          title="Are you sure?"
          description="This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setIsConfirmDialogOpen(false)
            setServiceToDelete(undefined)
          }}
        />
      </div>
    </div>
  )
}
