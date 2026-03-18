import * as React from "react"
import { useEffect } from "react"
import { cn } from "src/lib/utils"

const Modal = React.forwardRef(({ 
  className, 
  open, 
  onClose, 
  children, 
  title, 
  ...props 
}, ref) => {
  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY
      const prevPosition = document.body.style.position
      const prevTop = document.body.style.top
      const prevWidth = document.body.style.width
      const prevLeft = document.body.style.left
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.left = '0'
      return () => {
        document.body.style.position = prevPosition
        document.body.style.top = prevTop
        document.body.style.width = prevWidth
        document.body.style.left = prevLeft
        window.scrollTo(0, scrollY)
      }
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden overscroll-contain">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md overflow-hidden touch-none"
        onClick={onClose}
      />
      <div
        ref={ref}
        className={cn(
          "relative z-[1001] w-full max-w-lg mx-4 bg-background border rounded-lg shadow-lg",
          className
        )}
        {...props}
      >
        {title && (
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
})
Modal.displayName = "Modal"

export { Modal }
