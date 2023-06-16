import Image from 'next/image'
import { Inter } from 'next/font/google'
import Landing from '../../components/landing/landing'
import Overview from '../../components/overview/overview'
import Showcase from '../../components/showcase/showcase'
import Faq from '../../components/faq/faq'
import Footer from '../../components/footer/footer'
import styles from './page.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className={styles.main}>
        <Landing />
        <Overview />
        <Showcase />
        <Faq />
        <Footer />
    </main>
  )
}
