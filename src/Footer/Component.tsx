import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import RichText from '@/components/RichText'
import { BackToTop } from '@/components/ToTop/ToTop'


export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)() as Footer;
  const content = footerData.content || []

  return (
    <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
      <div>
        
        <ul className="mt-0 mb-[16px] m-0 p-0 flex [flex-flow:wrap] place-content-center bg-[rgb(0,_0,_0)] text-[rgb(255,_255,_255)] text-[16px] text-left leading-[28.8px] font-normal tracking-[-0.16px] font-[Biennale,_sans-serif]">
        <li className="relative m-[10px] [transition:all,_0.3s] place-items-center">
          <a title="About Us Brickfields Asia College" href="https://dev.opendesignsin.com/ueducate/bac/" target="_self" className="underline bg-transparent text-[rgb(51,_51,_51)] relative block w-[155px] h-[155px] leading-none [transition:400ms] translate-y-[2%] rounded-[50%]">
            <img decoding="async" src="https://www.veritas.edu.my/wp-content/uploads/2024/12/bac1.png" alt="" className="align-middle mb-[15px] max-w-full block relative w-full"/>
          </a>
        </li>
        <li className="relative m-[10px] [transition:all,_0.3s] place-items-center">
          <a title="About Us Veritas University College" href="https://ustudy.academy/home" target="_self" className="underline bg-transparent text-[rgb(51,_51,_51)] relative block w-[155px] h-[155px] leading-none [transition:400ms] translate-y-[2%] rounded-[50%]">
            <img decoding="async" src="https://www.veritas.edu.my/wp-content/uploads/2024/12/bac3.png" alt="" className="align-middle mb-[15px] max-w-full block relative w-full"/>
          </a>
        </li>
        <li className="relative m-[10px] [transition:all,_0.3s] place-items-center">
          <a title="About Us IACT" href="#" target="_self" className="underline bg-transparent text-[rgb(51,_51,_51)] relative block w-[155px] h-[155px] leading-none [transition:400ms] translate-y-[2%] rounded-[50%]">
            <img decoding="async" src="https://www.veritas.edu.my/wp-content/uploads/2024/12/bac2.png" alt="" className="align-middle mb-[15px] max-w-full block relative w-full"/>
          </a>
        </li>
        <li className="relative m-[10px] [transition:all,_0.3s] place-items-center">
          <a title="About Us Reliance College" href="#" target="_self" className="underline bg-transparent text-[rgb(51,_51,_51)] relative block w-[155px] h-[155px] leading-none [transition:400ms] translate-y-[2%] rounded-[50%]">
            <img decoding="async" src="https://www.veritas.edu.my/wp-content/uploads/2024/12/bac4.png" alt="" className="align-middle mb-[15px] max-w-full block relative w-full"/>
          </a>
        </li>
        <li className="relative m-[10px] [transition:all,_0.3s] place-items-center">
          <a title="About Us Brickfields Asia College Singapore" href="#" target="_self" className="underline bg-transparent text-[rgb(51,_51,_51)] relative block w-[155px] h-[155px] leading-none [transition:400ms] translate-y-[2%] rounded-[50%]">
            <img decoding="async" src="https://www.veritas.edu.my/wp-content/uploads/2024/12/bac6.png" alt="" className="align-middle mb-[15px] max-w-full block relative w-full"/>
          </a>
        </li>
        <li className="relative m-[10px] [transition:all,_0.3s] place-items-center">
          <a title="About Us UNIMY" href="#" target="_self" className="underline bg-transparent text-[rgb(51,_51,_51)] relative block w-[155px] h-[155px] leading-none [transition:400ms] translate-y-[2%] rounded-[50%]">
            <img decoding="async" src="https://www.veritas.edu.my/wp-content/uploads/2024/12/bac5.png" alt="" className="align-middle mb-[15px] max-w-full block relative w-full"/>
          </a>
        </li>
      </ul>
      </div>
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <RichText className="max-w-[100rem] mx-auto" data={content} enableGutter={false} />
      </div>
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <Link className="flex items-center" href="/">
          <Logo />
        </Link>
        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
          <ThemeSelector />
          {/* <nav className="flex flex-col md:flex-row gap-4">
            {navItems.map(({ link }, i) => {
              return <CMSLink className="text-white" key={i} {...link} />
            })}
          </nav> */}
        </div>
      </div>
      {/* <BackToTop className="custom-class" /> */}
    </footer>
    
  )
}
