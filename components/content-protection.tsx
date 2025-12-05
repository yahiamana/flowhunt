"use client"

import { useEffect } from "react"

export const ContentProtection = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    // Disable keyboard shortcuts for screenshots and dev tools
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen
      if (e.key === 'PrintScreen') {
        e.preventDefault()
        return false
      }
      
      // Ctrl+Shift+I (Dev Tools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault()
        return false
      }
      
      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault()
        return false
      }
      
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault()
        return false
      }
      
      // Ctrl+S (Save)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        return false
      }
      
      // F12 (Dev Tools)
      if (e.key === 'F12') {
        e.preventDefault()
        return false
      }
      
      // Ctrl+Shift+C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault()
        return false
      }
      
      // Cmd+Shift+3/4 (Mac Screenshot)
      if (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) {
        e.preventDefault()
        return false
      }
    }

    // Disable drag
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault()
      return false
    }

    // Disable selection
    const handleSelectStart = (e: Event) => {
      e.preventDefault()
      return false
    }
    
    // Disable copy
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault()
      return false
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('dragstart', handleDragStart)
    document.addEventListener('selectstart', handleSelectStart)
    document.addEventListener('copy', handleCopy)

    // Add CSS to prevent selection
    document.body.style.userSelect = 'none'
    document.body.style.webkitUserSelect = 'none'

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('dragstart', handleDragStart)
      document.removeEventListener('selectstart', handleSelectStart)
      document.removeEventListener('copy', handleCopy)
      document.body.style.userSelect = ''
      document.body.style.webkitUserSelect = ''
    }
  }, [])

  return (
    <div 
      className="content-protected"
      style={{
        WebkitUserSelect: 'none',
        userSelect: 'none',
        WebkitTouchCallout: 'none',
      }}
    >
      {children}
    </div>
  )
}
