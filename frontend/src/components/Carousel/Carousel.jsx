import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import "./Carousel.css";
import { StoryCard } from "../Storycard/Storycard";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

export const Carousel = () => {
  // State for managing various categories of stories and the active slide in each category
  const [rumorStories, setRumorStories] = useState([]);
  const [hearsayStories, setHearsayStories] = useState([]);
  const [historicalStories, setHistoricalStories] = useState([]);
  const [activeRumorSlide, setActiveRumorSlide] = useState(0);
  const [activeHearsaySlide, setActiveHearsaySlide] = useState(0);
  const [activeHistoricalSlide, setActiveHistoricalSlide] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  // API URL configuration
  const apiUrl = import.meta.env.VITE_BACKEND_API || "http://localhost:3000";

  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Function to update the rank of a story
  const handleRankUpdate = (updatedStory) => {
    const updateStateArray = (array) =>
      array.map((story) =>
        story._id === updatedStory._id ? updatedStory : story
      );

    setRumorStories((prev) => updateStateArray(prev));
    setHearsayStories((prev) => updateStateArray(prev));
    setHistoricalStories((prev) => updateStateArray(prev));
  };

  // Function to fetch and update stories from the API
  const updateStories = () => {
    fetch(`${apiUrl}/stories`)
      .then((response) => response.json())
      .then((data) => {
        const formattedStories = data.map((story) => ({
          ...story,
          id: story._id,
          city: story.city,
          image: story.image,
          category: capitalizeFirstLetter(story.category),
        }));

        // Update the states for each category
        setRumorStories(
          formattedStories.filter((story) => story.category === "Rumor")
        );
        setHearsayStories(
          formattedStories.filter((story) => story.category === "Hearsay")
        );
        setHistoricalStories(
          formattedStories.filter((story) => story.category === "Historical")
        );
      })
      .catch((error) => console.error("Error fetching stories:", error));
  };

  // Fetching stories on component mount
  useEffect(() => {
    fetch(`${apiUrl}/stories`)
      .then((response) => response.json())
      .then((data) => {
        const formattedStories = data.map((story) => ({
          ...story,
          category: capitalizeFirstLetter(story.category),
        }));

        // Directly updating the states for each category
        setRumorStories(
          formattedStories.filter((story) => story.category === "Rumor")
        );
        setHearsayStories(
          formattedStories.filter((story) => story.category === "Hearsay")
        );
        setHistoricalStories(
          formattedStories.filter((story) => story.category === "Historical")
        );
      })
      .catch((error) => console.error("Error fetching stories:", error));
  }, [apiUrl]);

  // Slide change handlers for each category
  const onSlideChangeRumor = (swiper) => {
    setActiveRumorSlide(swiper.realIndex);

    swiper.slides.forEach((slide) => {
      slide.style.zIndex = 1;
    });

    // Increase z-index for the active slide
    const activeSlideElement = swiper.slides[swiper.activeIndex];
    if (activeSlideElement) {
      activeSlideElement.style.zIndex = 100;
    }
  };

  const onSlideChangeHearsay = (swiper) => {
    setActiveHearsaySlide(swiper.realIndex);

    // Reset z-index for all slides
    swiper.slides.forEach((slide) => {
      slide.style.zIndex = 1;
    });

    // Increase z-index for the active slide
    const activeSlideElement = swiper.slides[swiper.activeIndex];
    if (activeSlideElement) {
      activeSlideElement.style.zIndex = 100;
    }
  };

  const onSlideChangeHistorical = (swiper) => {
    setActiveHistoricalSlide(swiper.realIndex);

    // Reset z-index for all slides
    swiper.slides.forEach((slide) => {
      slide.style.zIndex = 1;
    });

    // Increase z-index for the active slide
    const activeSlideElement = swiper.slides[swiper.activeIndex];
    if (activeSlideElement) {
      activeSlideElement.style.zIndex = 100;
    }
  };

  // Adjusting the viewport width on window resize
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial call to set the viewport width

    // Cleanup function to remove event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Determine the number of slides based on the viewport width
  const slidesPerView =
    viewportWidth < 400
      ? 2
      : viewportWidth < 580
      ? 3
      : viewportWidth < 700
      ? 5
      : viewportWidth < 900
      ? 7
      : 7;

  return (
    <>
      <Swiper
        className="rumor-carousel"
        slidesPerView={slidesPerView}
        onSlideChange={onSlideChangeRumor}
        modules={[EffectCoverflow, Pagination]}
        effect="coverflow"
        centeredSlides={true}
        loop={false}
        initialSlide={6}
        coverflowEffect={{
          rotate: 0,
          stretch: 20,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={{
          clickable: true,
        }}
      >
        {rumorStories.map((story, index) => (
          <SwiperSlide key={story._id}>
            <StoryCard
              story={story}
              isActive={index === activeRumorSlide}
              handleRankUpdate={handleRankUpdate}
              onUpdateStories={updateStories}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        className="hearsay-carousel"
        slidesPerView={slidesPerView}
        onSlideChange={onSlideChangeHearsay}
        modules={[EffectCoverflow, Pagination]}
        effect="coverflow"
        centeredSlides={true}
        loop={false}
        initialSlide={4}
        coverflowEffect={{
          rotate: 0,
          stretch: 20,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={{
          clickable: true,
        }}
      >
        {hearsayStories.map((story, index) => (
          <SwiperSlide key={story._id}>
            <StoryCard
              story={story}
              isActive={index === activeHearsaySlide}
              handleRankUpdate={handleRankUpdate}
              onUpdateStories={updateStories}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        className="historical-carousel"
        slidesPerView={slidesPerView}
        onSlideChange={onSlideChangeHistorical}
        modules={[EffectCoverflow, Pagination]}
        effect="coverflow"
        centeredSlides={true}
        loop={false}
        initialSlide={4}
        coverflowEffect={{
          rotate: 0,
          stretch: 20,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={{
          clickable: true,
        }}
      >
        {historicalStories.map((story, index) => (
          <SwiperSlide key={story._id}>
            <StoryCard
              story={story}
              isActive={index === activeHistoricalSlide}
              handleRankUpdate={handleRankUpdate}
              onUpdateStories={updateStories}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default Carousel;
