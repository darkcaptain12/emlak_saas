import PageHeader from '@/components/layout/PageHeader'
import PropertyForm from '@/components/properties/PropertyForm'

export default function NewPropertyPage() {
  return (
    <div>
      <PageHeader title="Yeni İlan Ekle" description="Portföyünüze yeni bir ilan ekleyin" />
      <PropertyForm />
    </div>
  )
}
