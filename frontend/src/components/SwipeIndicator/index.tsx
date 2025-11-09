import "./swipe.indicator.css";

interface SwipeIndicatorProps {
  currentIndex: number;
  totalDays: number;
}

const SwipeIndicator = ({ currentIndex, totalDays }: SwipeIndicatorProps) => {
  return (
    <div className="swipe-indicator">
      {Array.from({ length: totalDays }).map((_, index) => (
        <div
          key={index}
          className={`swipe-dot ${
            index === currentIndex ? "swipe-dot--active" : ""
          }`}
        />
      ))}
    </div>
  );
};

export default SwipeIndicator;
