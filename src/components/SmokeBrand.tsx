import { useState, type ReactNode } from "react";
import { FaInstagram } from "react-icons/fa6";
import "./styles/SmokeBrand.css";

type SmokeRevealProps = {
  label: string;
  className: string;
  children: ReactNode;
};

const SmokeReveal = ({ label, className, children }: SmokeRevealProps) => {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <button
      className={`smoke-brand__reveal ${className}${isRevealed ? " is-revealed" : ""}`}
      type="button"
      aria-label={label}
      aria-pressed={isRevealed}
      onClick={() => setIsRevealed((revealed) => !revealed)}
    >
      <span className="smoke-brand__cloud" aria-hidden="true" />
      {children}
    </button>
  );
};

const SmokeBrand = () => (
  <div className="smoke-brand">
    <SmokeReveal
      className="smoke-brand__title"
      label="Reveal MR GRAPHICXZ in purple smoke"
    >
      <span className="smoke-brand__title-content">
        <span className="smoke-brand__name">MR GRAPHICXZ</span>
      </span>
    </SmokeReveal>
    <SmokeReveal
      className="smoke-brand__social"
      label="Reveal the SHAHA_N777 Instagram handle in purple smoke"
    >
      <span className="smoke-brand__handle">
        <FaInstagram aria-hidden="true" />
        <span className="smoke-brand__handle-text">SHAHA_N777</span>
      </span>
    </SmokeReveal>
  </div>
);

export default SmokeBrand;
