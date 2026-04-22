// Home.jsx
import Header from '../components/Header';
import Hero from '../components/Hero';
import BeritaSection from '../components/BeritaSection';
import ProfileSection from '../components/ProfileSection';
import AlamatSection from '../components/AlamatSection';
import ScrollReveal from '../components/common/ScrollReveal';

function Home() {
  return (
    <>
      <Header />
      <ScrollReveal delay={0}>
        <Hero />
      </ScrollReveal>
      <ScrollReveal delay={200}>
        <BeritaSection />
      </ScrollReveal>
      <ScrollReveal delay={400}>
        <ProfileSection />
      </ScrollReveal>
      <ScrollReveal delay={600}>
        <AlamatSection />
      </ScrollReveal>
    </>
  );
}

export default Home;