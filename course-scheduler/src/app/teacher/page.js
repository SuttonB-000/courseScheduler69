export default function TeacherPage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome Teacher</h1>
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
    color: "#ff00ff",
    fontFamily: "sans-serif",
  },
  title: {
    fontSize: "2rem",
    textShadow: "0 0 10px #ff00ff, 0 0 20px #00ffff",
  },
};