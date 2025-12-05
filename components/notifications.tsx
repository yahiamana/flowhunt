"use client"

import { Bell } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"
import { Notification } from "@prisma/client"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("/api/notifications")
        setNotifications(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications.some(n => !n.isRead) && (
            <span className="absolute top-2 right-2 h-2 w-2 bg-red-600 rounded-full" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 font-medium border-b">Notifications</div>
        <ScrollArea className="h-80">
          {notifications.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          )}
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="p-4 border-b last:border-0 hover:bg-slate-50 transition"
            >
              <p className="text-sm">{notification.message}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(notification.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
