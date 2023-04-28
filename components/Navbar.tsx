import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'

const Navbar: NextPage = () => {
  return (
    <div className='flex'>
      <Image
        className="flex p-2 dark:invert"
        src="/next.svg"
        alt="Next.js Logo"
        width={180}
        height={37}
        priority
      />
      <nav className="grow flex justify-center space-x-4">
        <Link href="/departments" className="font-medium px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-900">Departments</Link>
        <Link href="/rates" className="font-medium px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-900">Rates</Link>
        <Link href="/employees" className="font-medium px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-900">Employees</Link>
        <Link href="/statements" className="font-medium px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-900">Statements</Link>
        <Link href="/donations" className="font-medium px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-900">Donations</Link>
      </nav>
    </div>
  )
}

export default Navbar
