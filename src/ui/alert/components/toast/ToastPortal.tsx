import React, { ReactNode } from "react";

type ToastPortalProps = {
    children: ReactNode
}

const ToastPortal: React.FC<ToastPortalProps> = ({ children }) => <>{ children }</>;

export default ToastPortal;
