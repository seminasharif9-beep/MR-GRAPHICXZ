import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/About.css";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(
        ".about-reveal",
        { autoAlpha: 0, y: 40, filter: "blur(8px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out",
          stagger: 0.18,
          scrollTrigger: {
            trigger: ".about-section",
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <div className="about-section" id="about" ref={sectionRef}>
      <div className="about-me">
        <h3 className="about-reveal">About Me</h3>
        <p className="about-description about-reveal">
          I&apos;m Shahan, a 14-year-old passionate and creative individual with
          a strong love for art, imagination, and visual creativity. I believe
          every idea has the power to become something extraordinary. I enjoy
          exploring new inspirations, experimenting with creative concepts,
          and expressing my unique style. I&apos;m always excited to learn new
          things, improve my creativity, and turn my imagination into reality.
          My journey is all about passion, dedication, and endless creativity.
        </p>
      </div>
    </div>
  );
};

export default About;
