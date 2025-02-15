"use client";


const HamburgerButton = ({ onToggle, isActive, buttonRef }) => {
 

  const handleClick = (event) => {
    event.stopPropagation(); // Detener la propagación
    onToggle(); // Alternar menú
  };

  return (
    <button
      ref={buttonRef} // Asignar referencia al botón
      className={`hamburger hamburger--collapse ${isActive ? "is-active" : ""}`}
      type="button"
      onClick={handleClick}
    >
      <span className="hamburger-box">
        <span className="hamburger-inner"></span>
      </span>
    </button>
  );
};

export default HamburgerButton;
