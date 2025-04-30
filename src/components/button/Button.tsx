import React from "react";
import Button from "react-bootstrap/Button";
type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: string;
};

export default function Buttons({ children, onClick, variant }: Props) {
  return (
    <Button variant={variant} onClick={onClick}>
      {children}
    </Button>
  );
}
