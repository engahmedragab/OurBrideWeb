import React from "react";
import MainButton from "../../SimpleComponent/MainButton/MainButton";
import { useSpringCarousel } from "react-spring-carousel";

export default function Providers() {
  const { carouselFragment, slideToPrevItem, slideToNextItem } =
    useSpringCarousel({
      items: [
        {
          id: "item-1",
          renderItem: <div>Item 1</div>,
        },
        {
          id: "item-2",
          renderItem: <div>Item 2</div>,
        },
      ],
    });
  return (
    <>
      <div className="container">
        <div className="contact m-5 w-70">
          <div>
            <button onClick={slideToPrevItem}>Prev item</button>
            <div>{carouselFragment}</div>
            <button onClick={slideToNextItem}>Next item</button>
          </div>
        </div>
      </div>
    </>
  );
}
