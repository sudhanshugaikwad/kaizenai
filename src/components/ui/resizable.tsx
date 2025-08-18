
"use client"

import * as React from "react"
import {
  Panel,
  PanelGroup,
  type ImperativePanelGroupHandle,
  type ImperativePanelHandle,
  PanelResizeHandle,
  type PanelResizeHandleProps,
} from "react-resizable-panels"

import { cn } from "@/lib/utils"

const ResizablePanelGroup = React.forwardRef<
  ImperativePanelGroupHandle,
  React.ComponentProps<typeof PanelGroup> & {
    className?: string
  }
>(({ className, ...props }, ref) => (
  <PanelGroup
    ref={ref}
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props}
  />
))
ResizablePanelGroup.displayName = "ResizablePanelGroup"

const ResizablePanel = Panel

const ResizableHandle = React.forwardRef<
  ImperativePanelHandle,
  PanelResizeHandleProps & {
    withHandle?: boolean
    className?: string
  }
>(({ withHandle, className, ...props }, ref) => {
  return (
    <PanelResizeHandle
      className={cn(
        "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=horizontal]]:focus-visible:ring-offset-[1px] [&[data-panel-group-direction=vertical]]:focus-visible:ring-offset-[1px]",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border" />
      )}
    </PanelResizeHandle>
  )
})
ResizableHandle.displayName = "ResizableHandle"


export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
