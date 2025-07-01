
import React from "react";

declare module "framer-motion" {
  interface MotionProps {
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    id?: string;
  }
}
