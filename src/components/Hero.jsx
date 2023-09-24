import React from "react";

const Hero = () => {
  const scrollToElement = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="hero_header">
      <nav className="hero_nav">
        <h3 className="font-semibold">EduVizion</h3>
        <div className="flex gap-8 items-center">
          <h3
            className="cursor-pointer"
            onClick={() => scrollToElement("about")}
          >
            About
          </h3>
          <button
            type="button"
            className="black_btn"
            onClick={() => scrollToElement("visualizer")}
          >
            Try Now
          </button>
        </div>
      </nav>
      <h1 className="head_text">
        Crafting Knowledge with
        <br className="max-md:hidden" />
        <span className="orange_gradient">&nbsp;Visuals</span>
      </h1>
      <h2 className="desc">
        Enter a topic or keyword that piques your curiosity, and we'll uncover
        fascinating facts and a captivating image to expand your knowledge and
        entertain your imagination!
      </h2>
    </header>
  );
};

export { Hero };
