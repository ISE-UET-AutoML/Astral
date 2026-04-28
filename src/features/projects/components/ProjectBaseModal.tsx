import React from "react";
import { Dialog, DialogContent } from "src/components/ui/dialog";

const ProjectBaseModal = ({
  open,
  onCancel,
  children,
  className = "",
  ...props
}) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel?.()}>
      <DialogContent
        className={`w-[calc(100vw-2rem)] max-w-none sm:max-w-none md:w-[min(1180px,calc(100vw-2rem))] md:max-w-[min(1180px,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-slate-200 bg-white p-0 shadow-2xl dark:border-white/10 dark:bg-slate-950 ${className}`}
        {...props}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default ProjectBaseModal;
