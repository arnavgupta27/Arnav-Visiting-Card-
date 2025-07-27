import React, { useState, useEffect, useRef } from 'react';

interface CardProps {
  className?: string;
}

export const VisitingCard: React.FC<CardProps> = ({ className = '' }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;

      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      // Calculate rotation based on mouse position
      const rotateXValue = (mouseY / rect.height) * -20; // Max 20 degrees
      const rotateYValue = (mouseX / rect.width) * 20;   // Max 20 degrees
      
      setRotateX(rotateXValue);
      setRotateY(rotateYValue);

      // Update sheen position - new implementation
      const mouseXPercent = (e.clientX - rect.left) / rect.width;
      const mouseYPercent = (e.clientY - rect.top) / rect.height;
      
      // Map mouse position to background-position values
      const sheenX = (mouseXPercent * 100) - 50; // Range: -50% to 50%
      const sheenY = (mouseYPercent * 100) - 50; // Range: -50% to 50%
      
      // Update CSS custom properties for smooth sheen movement
      card.style.setProperty('--sheen-x', `${sheenX}%`);
      card.style.setProperty('--sheen-y', `${sheenY}%`);
    };

    const handleMouseLeave = () => {
      setRotateX(0);
      setRotateY(0);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={`visiting-card ${className}`}>
      <div
        ref={cardRef}
        className={`card-container ${isFlipped ? 'card-flipped' : ''}`}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY + (isFlipped ? 180 : 0)}deg)`,
          filter: 'drop-shadow(var(--card-shadow)) drop-shadow(var(--card-glow))',
        }}
        onClick={handleCardClick}
      >
        {/* Front Side - Logo */}
        <div className="card-face card-front">
          <div className="h-full w-full flex items-center justify-center relative">
            <img 
              src="/uploads/95a63210-a05a-4987-ab40-2eee743cc4ce.png" 
              alt="AG Logo" 
              className="w-32 h-32 object-contain"
            />
          </div>
        </div>

        {/* Back Side - Contact Info */}
        <div className="card-face card-back">
          <div className="h-full w-full p-8 flex flex-col justify-center">
            <div className="contact-info">
              <div className="name">Arnav Gupta</div>
              <div className="title">Software Engineer</div>
              
              <div className="space-y-2">
                <div className="contact-item">
                  7452027990
                </div>
                <div className="contact-item">
                  <a 
                    href="https://drive.google.com/file/d/1mBwoOx8z-_zUIZ_1ipsZkKgO83kDgnCG/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Resume
                  </a>
                </div>
                <div className="contact-item">
                  Ghaziabad, India
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitingCard;
