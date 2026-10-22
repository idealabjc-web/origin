import Header from './components/Header'
import HeroVideoSlider from './components/HeroVideoSlider'
import StatisticsStrip from './components/StatisticsStrip'
import AboutSection from './components/AboutSection'
import FeaturedConferences from './components/FeaturedConferences'
import TestimonialVideos from './components/TestimonialVideos'
import ServicesGrid from './components/ServicesGrid'
import ExperienceGallery from './components/ExperienceGallery'
import SpeakerCTA from './components/SpeakerCTA'
import UpcomingEvents from './components/UpcomingEvents'
import NewsletterSection from './components/NewsletterSection'
import Footer from './components/Footer'
export default function App() {
  return (
    <>
      <Header />
      <main className="pt-[72px]">
        <HeroVideoSlider /><StatisticsStrip /><AboutSection /><FeaturedConferences /><TestimonialVideos />
        <ServicesGrid /><ExperienceGallery /><SpeakerCTA /><UpcomingEvents /><NewsletterSection />
      </main>
      <Footer />
    </>
  )
}
