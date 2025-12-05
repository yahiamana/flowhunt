import Image from "next/image"
import Link from "next/link"

export const Logo = () => {
  return (
    <Link href="/">
        <div className="flex items-center gap-x-2">
            <span className="font-bold text-xl text-primary">HUNT</span>
        </div>
    </Link>
  )
}
