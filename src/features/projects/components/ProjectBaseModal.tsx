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
        className={`w-[calc(100vw-2rem)] max-w-none overflow-hidden rounded-2xl border border-gray-200 bg-white p-0 shadow-2xl dark:border-white/10 dark:bg-slate-950 sm:max-w-none md:w-[min(1180px,calc(100vw-2rem))] md:max-w-[min(1180px,calc(100vw-2rem))] ${className}`}
        {...props}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default ProjectBaseModal;
