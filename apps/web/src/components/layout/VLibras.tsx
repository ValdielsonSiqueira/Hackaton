import React, { useEffect } from "react";

export const VLibras: React.FC = () => {
  useEffect(() => {
    const existingScript = document.getElementById("vlibras-script");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "vlibras-script";
      script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
      script.async = true;
      script.onload = () => {
        if ((window as any).VLibras) {
          new (window as any).VLibras.Widget("https://vlibras.gov.br/app");
        }
      };
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div {...({ vw: "true" } as any)} className="enabled">
      <div {...({ "vw-access-button": "true" } as any)} className="active"></div>
      <div {...({ "vw-plugin-wrapper": "true" } as any)}>
        <div className="vw-plugin-top-wrapper"></div>
      </div>
    </div>
  );
};

export default VLibras;
