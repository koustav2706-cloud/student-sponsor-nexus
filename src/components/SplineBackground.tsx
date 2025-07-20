import Spline from '@splinetool/react-spline';

const SplineBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background/50 via-background/80 to-background/90" />
      <Spline
        scene="https://prod.spline.design/dqBtSYj8xwpH3bR9/scene.splinecode"
        style={{
          width: '100%',
          height: '100%',
          opacity: 0.6,
        }}
      />
    </div>
  );
};

export default SplineBackground;