"use client"

import { useMemo } from "react"
// import ReactQuill from "react-quill" // Skipping heavy install for now, using simple renderer
// import "react-quill/dist/quill.bubble.css"

interface PreviewProps {
  value: string
}

export const Preview = ({
  value,
}: PreviewProps) => {
  // const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), [])

  return (
    // <ReactQuill
    //   theme="bubble"
    //   value={value}
    //   readOnly
    // />
    <div className="prose max-w-none p-4" dangerouslySetInnerHTML={{ __html: value }} />
  )
}
