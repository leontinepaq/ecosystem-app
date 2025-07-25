import React, { forwardRef } from "react";

const Canvas = forwardRef((props, ref) => {
  return (
    <canvas
      ref={ref}
      style={{ display: "block", width: "100vw", height: "100vh" }}
      {...props}
    />
  );
});

export default Canvas;
