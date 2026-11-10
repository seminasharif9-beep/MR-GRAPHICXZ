import "./styles/Career.css";
import SmokeBrand from "./SmokeBrand";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My Journey <span>&</span>
          <br /> Designing
        </h2>
        <div className="career-info">
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>The Beginning</h4>
              </div>
              <h3>2012</h3>
            </div>
            <p>
              I was born in 2012, and my educational journey began with regular
              school studies. I studied up to the 6th standard, building my
              foundation in education and learning new things. During this
              time, I started developing an interest in creativity and
              exploring different ideas.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>A New Chapter</h4>
              </div>
              <h3>2025</h3>
            </div>
            <p>
              In 2025, I joined the Darul Huda Islamic University branch to gain
              more knowledge and continue my education alongside Islamic
              studies. This became an important chapter in my life, helping me
              grow in knowledge, discipline, and personal development.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Learning and Growing</h4>
              </div>
              <h3>2026</h3>
            </div>
            <p>
              In 2026, I began studying at a college, where I continued my
              educational journey and explored the world of design. My mother,
              an Information Technology teacher, inspired me to learn about
              technology and creativity. I also gained design knowledge with
              the guidance and support of my college seniors. Every experience
              helps me learn, improve, and move closer to my dreams.
            </p>
          </div>
        </div>
        <div className="career-smoke-brand">
          <SmokeBrand />
        </div>
      </div>
    </div>
  );
};

export default Career;
