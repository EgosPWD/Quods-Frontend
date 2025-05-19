import React from "react";
import Button from "react-bootstrap/Button";
import "./Button.css";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: string;
};

export default function Buttons({ children, onClick, variant = "default" }: Props) {
  return (
    <Button 
      className={`custom-button ${variant}`} 
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
