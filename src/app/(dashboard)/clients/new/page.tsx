import PageHeader from '@/components/layout/PageHeader'
import ClientForm from '@/components/clients/ClientForm'

export default function NewClientPage() {
  return (
    <div>
      <PageHeader title="Yeni Müşteri" description="Yeni müşteri kaydı oluşturun" />
      <ClientForm />
    </div>
  )
}
