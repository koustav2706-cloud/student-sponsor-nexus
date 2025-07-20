import Spline from '@splinetool/react-spline';

const SplineBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <Spline
        scene="https://prod.spline.design/dqBtSYj8xwpH3bR9/scene.splinecode"
        style={{
          width: '100%',
          height: '100%',
          opacity: 0.3,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-background/30 via-background/50 to-background/70 pointer-events-none" />
    </div>
  );
};

export default SplineBackground;