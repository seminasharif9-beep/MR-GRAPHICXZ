import { SplitText } from "gsap/SplitText";
import gsap from "gsap";
import { smoother } from "../Navbar";

export function initialFX() {
  document.body.style.overflowY = "auto";
  smoother.paused(false);
  document.getElementsByTagName("main")[0].classList.add("main-active");
  gsap.to("body", {
    backgroundColor: "#0b080c",
    duration: 0.5,
    delay: 1,
  });

  const introLabel = new SplitText(".landing-intro h2", {
    type: "chars,lines",
    linesClass: "split-line",
  });
  const introName = new SplitText(".landing-intro h1", {
    type: "chars,lines",
    linesClass: "split-line",
  });
  const eyebrowText = new SplitText(".landing-info h3", {
    type: "chars,lines",
    linesClass: "split-line",
  });
  const graphicText = new SplitText(".landing-role-graphic", {
    type: "chars,lines",
    linesClass: "split-h2",
  });
  const designerText = new SplitText(".landing-role-designer", {
    type: "chars,lines",
    linesClass: "split-h2",
  });

  gsap
    .timeline()
    .fromTo(
      introLabel.chars,
      { opacity: 0, y: 80, filter: "blur(5px)" },
      {
        opacity: 1,
        duration: 1,
        filter: "blur(0px)",
        ease: "power3.inOut",
        y: 0,
        stagger: 0.04,
        delay: 0.3,
      }
    )
    .fromTo(
      introName.chars,
      { opacity: 0, y: 80, filter: "blur(5px)" },
      {
        opacity: 1,
        duration: 1.2,
        filter: "blur(0px)",
        ease: "power3.inOut",
        y: 0,
        stagger: 0.06,
      }
    )
    .fromTo(
      eyebrowText.chars,
      { opacity: 0, y: 80, filter: "blur(5px)" },
      {
        opacity: 1,
        duration: 1.2,
        filter: "blur(0px)",
        ease: "power3.inOut",
        y: 0,
        stagger: 0.025,
      },
      0
    );

  const roleChars = [...graphicText.chars, ...designerText.chars];
  gsap
    .timeline()
    .set(roleChars, { opacity: 0, y: 80, filter: "blur(5px)" })
    .to(graphicText.chars, {
      opacity: 1,
      duration: 1.2,
      filter: "blur(0px)",
      ease: "power3.inOut",
      y: 0,
      stagger: 0.1,
      delay: 0.8,
    })
    .to(designerText.chars, {
      opacity: 1,
      duration: 1.2,
      filter: "blur(0px)",
      ease: "power3.inOut",
      y: 0,
      stagger: 0.1,
    });
  gsap.fromTo(
    [".header", ".icons-section", ".nav-fade"],
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      delay: 0.1,
    }
  );

}
