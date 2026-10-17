const items = [
  "Created by musicians, for musicians",
  "Independent, Los Angeles",
  "Fair pay for artists",
  "Amplifying diverse voices",
  "Records, live shows, bookings",
];

function Group() {
  return (
    <div className="flex shrink-0 items-center">
      {items.map((item) => (
        <span key={item} className="marquee-item">
          {item}
          <span className="marquee-star" aria-hidden="true">
            &#10022;
          </span>
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        <Group />
        <Group />
      </div>
    </div>
  );
}
