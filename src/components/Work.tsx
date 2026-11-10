import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const projects = [
  { title: "Matchday", category: "Football Poster", image: "matchday.jpg" },
  { title: "Neram", category: "Movie Poster", image: "movie.jpg" },
  { title: "Branding", category: "Campaign Poster", image: "kerala.jpg" },
  { title: "NABIDINAM", category: "Event Poster", image: "event.jpg" },
  { title: "Delivery", category: "Delivery Poster", image: "delivery.jpg" },
  { title: "Design Offer", category: "Social Poster", image: "offer.jpg" },
  { title: "News", category: "Editorial Poster", image: "news.jpg" },
  { title: "Road Trip", category: "Digital Poster", image: "roadtrip.jpg" },
  { title: "Cinema", category: "Movie Poster", image: "cinema.jpg" },
  { title: "Portraits", category: "Photo Layout", image: "portraits.jpg" },
  { title: "India", category: "Festival Poster", image: "india.jpg" },
];

const Work = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isMantraRevealed, setIsMantraRevealed] = useState(false);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const container = section?.querySelector(".work-container");
      const track = section?.querySelector(".work-flex");
      const heading = container?.querySelector("h2");
      const cards = gsap.utils.toArray<HTMLElement>(
        section?.querySelectorAll(".work-box") ?? []
      );

      if (!section || !container || !track || !heading || cards.length === 0) {
        return;
      }

      const media = gsap.matchMedia();
      const revealCollectionLabel = () =>
        gsap.fromTo(
          ".work-collection-label",
          { y: 14, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.65,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 78%",
              once: true,
            },
          }
        );

      media.add("(min-width: 1026px)", () => {
        const getTravelDistance = () => {
          return Math.max(0, track.scrollWidth - track.clientWidth);
        };

        revealCollectionLabel();
        gsap.fromTo(
          heading,
          { x: -60, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              once: true,
            },
          }
        );
        const horizontalTween = gsap.to(track, {
          x: () => -getTravelDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${Math.max(getTravelDistance(), window.innerHeight)}`,
            scrub: true,
            pin: section,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            id: "work",
          },
        });

        const cardContents = gsap.utils.toArray<HTMLElement>(
          section.querySelectorAll(".work-box > .work-info, .work-box > .work-image")
        );
        cardContents.forEach((content) => {
          gsap.fromTo(
            content,
            { x: -30, autoAlpha: 0 },
            {
              x: 0,
              autoAlpha: 1,
              duration: 0.55,
              ease: "power3.out",
              scrollTrigger: {
                trigger: content,
                containerAnimation: horizontalTween,
                start: "left 92%",
                end: "left 68%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      });

      media.add("(max-width: 1025px)", () => {
        revealCollectionLabel();
        gsap.fromTo(
          cards,
          { x: -30, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: 0.6,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              once: true,
            },
          }
        );
      });

      return () => media.revert();
    },
    { scope: sectionRef }
  );

  return (
    <div className="work-section" id="work" ref={sectionRef}>
      <div className="work-container section-container">
        <button
          className={`work-mantra${isMantraRevealed ? " is-revealed" : ""}`}
          type="button"
          aria-label="Reveal God's Plan in purple smoke"
          aria-pressed={isMantraRevealed}
          onClick={() => setIsMantraRevealed((revealed) => !revealed)}
        >
          <span className="work-mantra__smoke" aria-hidden="true" />
          <span className="work-mantra__content">
            <span className="work-mantra__text">GOD&apos;S PLAN</span>
            <span className="work-mantra__subtitle">A REMINDER TO ALL</span>
          </span>
        </button>
        <div className="work-collection-label">
          <span className="work-collection-kicker">
            <span className="work-collection-indicator" />
            Selected poster collection
          </span>
          <span className="work-collection-count">
            {String(projects.length).padStart(2, "0")} <span>DESIGNS</span>
          </span>
        </div>
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {projects.map((project, index) => (
            <div className="work-box" key={index}>
              <div className="work-info">
                <div className="work-title">
                  <h3>{String(index + 1).padStart(2, "0")}</h3>

                  <div>
                    <h4>{project.title}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <h4>Poster Design</h4>
              </div>
              <WorkImage
                image={`/images/posters/${encodeURIComponent(project.image)}`}
                alt={`${project.title} ${project.category.toLowerCase()}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
