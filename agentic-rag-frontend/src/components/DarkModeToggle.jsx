import React, { useState, useEffect } from "react";

const DarkModeToggle = () => {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    document.body.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("darkMode", JSON.stringify(dark));
  }, [dark]);

  return (
    <div
      className="toggle-container"
      onClick={() => setDark(!dark)}
    >
      <span className="toggle-label">{dark ? "Dark" : "Light"}</span>
      <div className="toggle-switch">
        <div className={`toggle-dot ${dark ? "dark" : ""}`} />
      </div>
    </div>
  );
};

export default DarkModeToggle;
