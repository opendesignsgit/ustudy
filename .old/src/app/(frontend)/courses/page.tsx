import type { Metadata } from 'next/types'
import PageClient from './page.client'
import Image from 'next/image'
import FooterForm from '@/components/Home/footer-form'
import Footer from '@/components/Home/footer'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  return (
    <div>
      <div className="couresList">
        <section className="inerpageban servbansec relative">
          <div className="inpbanimg relative">
            <Image src="/media/innerbanimg.jpg" alt="Services" width={100} height={100} />
          </div>
          <div className="inpbancont absolute top-0 left-0 w-full h-full z-10">
            <div className="container relative h-full flex flex-col items-center justify-center text-center">
              <h1 className="ffamilyTNR">Discover Your Academic Path</h1>
              <p className="fonteighteen">
                Explore diverse fields of study and find the perfect program that matches <br />
                your passion and career goals, equipping you with the skills and <br />
                knowledge to thrive in a competitive global landscape.
              </p>
            </div>
          </div>
        </section>
        <PageClient />
      </div>
      <FooterForm />
      <Footer />
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `UStudy Global - All Courses Page`,
  }
}
//Final