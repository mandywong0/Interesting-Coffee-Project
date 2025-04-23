import React, { useState } from 'react';
import './imageSlideshow.css';

interface ImageSlideshowProps {
  images: string[];
}

const ImageSlideshow: React.FC<ImageSlideshowProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="image-slideshow">
      <button onClick={prevImage} className="slideshow-button prev">❮</button>
      <img
        src={images[currentIndex]}
        alt={`Slideshow ${currentIndex + 1}`}
        className="slideshow-image"
      />
      <button onClick={nextImage} className="slideshow-button next">❯</button>
    </div>
  );
};

export default ImageSlideshow;
