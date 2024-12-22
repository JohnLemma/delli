import React, { useState } from 'react';

const ListingCard = ({ listing, type }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % listing.images.length);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + listing.images.length) % listing.images.length);
  };

  const formatPrice = (price) => {
    return price.toLocaleString('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
    });
  };

  return (
    <div className="listing-card">
      <h3>{listing.title}</h3>
      <p><strong>Price:</strong> {formatPrice(listing.price)}</p>
      <p><strong>Location:</strong> {listing.location}</p>
      {type === "car" ? (
        <>
          <p>
            <strong>Brand:</strong> {listing.brand}
          </p>
          <p>
            <strong>Model:</strong> {listing.model}
          </p>
          <p>
            <strong>Year:</strong> {listing.year}
          </p>
        </>
      ) : (
        <p>
          <strong>Property Type:</strong> {listing.property_type}
        </p>
      )}
      {listing.images && listing.images.length > 0 && (
        <div className="images-carousel">
          <div className="carousel-image-container">
            <img src={listing.images[currentImageIndex]} alt={`Image ${currentImageIndex}`} />
          </div>
          <div className="carousel-buttons">
            <button onClick={handlePreviousImage}>Previous</button>
            <button onClick={handleNextImage}>Next</button>
          </div>
        </div>
      )}
      <p>{listing.description}</p>
      <a href="tel:0991217626" className="contact-button">
        Call
      </a>
    </div>
  );
};

export default ListingCard;