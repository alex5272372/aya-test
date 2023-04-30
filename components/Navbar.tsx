import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'

const Navbar: NextPage<{ active: string }> = ({ active }) => {
  const className = 'font-medium px-3 py-2 text-slate-500 rounded-lg hover:bg-slate-100 hover:text-slate-900'
  const classHover = 'font-medium px-3 py-2 rounded-lg bg-slate-100 text-slate-900'
  
  return (
    <div className='flex p-2'>
      <Link href="/"><Image
        className="flex dark:invert"
        src="/next.svg"
        alt="Next.js Logo"
        width={180}
        height={37}
        priority
      /></Link>
      <nav className="grow flex justify-center space-x-4">
        <Link href="/departments" className={active === 'departments' ? classHover : className}>Departments</Link>
        <Link href="/rates" className={active === 'rates' ? classHover : className}>Rates</Link>
        <Link href="/employees" className={active === 'employees' ? classHover : className}>Employees</Link>
        <Link href="/statements" className={active === 'statements' ? classHover : className}>Statements</Link>
        <Link href="/donations" className={active === 'donations' ? classHover : className}>Donations</Link>
        <Link href="/more-than-10" className={active === 'more-than-10' ? classHover : className}>More than 10%</Link>
        <Link href="/salary-diff" className={active === 'salary-diff' ? classHover : className}>Salary diff</Link>
        <Link href="/more-than-100" className={active === 'more-than-100' ? classHover : className}>More than $100</Link>
      </nav>
    </div>
  )
}

export default Navbar
