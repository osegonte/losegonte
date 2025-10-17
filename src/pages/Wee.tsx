import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Introduction from '../components/wee/Introduction'
import CraftProcess from '../components/wee/CraftProcess'
import MaterialsGallery from '../components/wee/MaterialsGallery'
import JournalStudio from '../components/wee/JournalStudio'
import ContactCTA from '../components/wee/ContactCTA'

const Wee = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Introduction />
      <CraftProcess />
      <MaterialsGallery />
      <JournalStudio />
      <ContactCTA />
      <Footer />
    </div>
  )
}

export default Wee