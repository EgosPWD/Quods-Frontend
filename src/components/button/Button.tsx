import React from "react";
import Button from "react-bootstrap/Button";
import "./Button.css";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: string;
  disabled?: boolean;
};

export default function Buttons({ children, onClick, variant = "default", disabled = false }: Props) {
  return (
    <Button 
      className={`custom-button ${variant}`} 
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}
