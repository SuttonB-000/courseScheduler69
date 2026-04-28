export default function StudentPage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome Student</h1>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0b0b12",
    color: "#00ffff",
    fontFamily: "sans-serif",
  },
  title: {
    fontSize: "2rem",
    textShadow: "0 0 10px #00ffff, 0 0 20px #ff00ff",
  },
};