import Spline from '@splinetool/react-spline';

const SplineBackground = () => {
  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
      <Spline
        scene="https://prod.spline.design/dqBtSYj8xwpH3bR9/scene.splinecode"
        style={{
          width: '100vw',
          height: '100vh',
          opacity: 0.15,
          pointerEvents: 'none',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-background/40 via-background/60 to-background/80 pointer-events-none" />
    </div>
  );
};

export default SplineBackground;