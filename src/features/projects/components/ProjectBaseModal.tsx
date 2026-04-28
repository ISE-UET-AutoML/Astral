import React from "react";
import { Dialog, DialogContent } from "src/components/ui/dialog";

const ProjectBaseModal = ({
  open,
  onCancel,
  children,
  className = "",
  style,
  ...props
}) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel?.()}>
      <DialogContent className={className} style={style} {...props}>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default ProjectBaseModal;
