"use client";

import { useEffect, useState } from "react";

export default function StudentPage() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      try {
        const meRes = await fetch("/api/me", { signal: controller.signal });
        const meData = await meRes.json();

        const courseRes = await fetch("/api/courses");
        const courseData = await courseRes.json();

        setUser(meData);
        setCourses(courseData);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to load student data:", err);
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();

    return () => controller.abort(); // Cleanup on unmount
  }, []);

  async function handleRegister() {
    setSubmitting(true);

    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseIds: selectedCourses,
        }),
      });

      if (!res.ok) throw new Error("Registration failed");

      setSelectedCourses([]);
      alert("Registered successfully");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  function toggleCourse(id) {
    setSelectedCourses((prev) =>
      prev.includes(id)
        ? prev.filter((c) => c !== id)
        : [...prev, id]
    );
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Loading...</h1>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          Welcome{user?.name ? ` ${user.name}` : ""}
        </h1>

        <h2 style={styles.subtitle}>Available Courses</h2>

        {/* REGISTER BUTTON */}
        <button
          onClick={handleRegister}
          disabled={selectedCourses.length === 0 || submitting}
          className="mb-4 px-4 py-2 bg-cyan-500 text-black rounded disabled:opacity-50"
        >
          {submitting ? "Registering..." : "Register Selected"}
        </button>

        {courses.length === 0 ? (
          <p style={styles.text}>No courses available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full border border-gray-700 rounded-lg text-sm">
              <thead>
                <tr className="bg-black/20">
                  {[
                    "Code",
                    "Title",
                    "Instructor",
                    "Subject",
                    "Description",
                    "Credits",
                    "Action",
                  ].map((header) => (
                    <th
                      key={header}
                      className="
                        px-4 py-3 text-left text-xs uppercase tracking-wider
                        text-[var(--accent)]
                        font-semibold
                        border-b border-[var(--accent)]
                      "
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-700">
                {courses.map((course) => {
                  const isSelected = selectedCourses.includes(course._id);

                  return (
                    <tr
                      key={course._id}
                      className={`
                        border-b border-[var(--border)]
                        transition-all duration-200
                        ${
                          isSelected
                            ? "bg-cyan-900/30"
                            : "hover:bg-white/5"
                        }
                      `}
                    >
                      <td className="px-4 py-3">{course.code}</td>
                      <td className="px-4 py-3 font-medium">
                        {course.courseTitle}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {course.instructorId}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {course.subjectArea}
                      </td>
                      <td className="px-4 py-3 text-gray-400 max-w-md">
                        <p className="line-clamp-2">
                          {course.courseDescription}
                        </p>
                      </td>
                      <td className="px-4 py-3 font-semibold text-[var(--accent)]">
                        {course.credits}
                      </td>

                      {/* ACTION */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleCourse(course._id)}
                          className={`${
                            isSelected
                              ? "text-red-400"
                              : "text-green-400"
                          } hover:underline`}
                        >
                          {isSelected ? "Remove" : "Add"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    background: "#0b0b12",
    color: "#00ffff",
    fontFamily: "sans-serif",
    padding: "3rem 2rem",
  },

  card: {
    width: "100%",
    maxWidth: "1200px",
    padding: "2rem",
    borderRadius: "12px",
    background: "#111122",
    boxShadow: "0 0 20px rgba(0,255,255,0.2)",
  },

  title: {
    fontSize: "2rem",
    textShadow: "0 0 10px #00ffff",
    marginBottom: "1rem",
  },

  subtitle: {
    marginTop: "1rem",
    marginBottom: "1rem",
    color: "#ff00ff",
  },

  text: {
    opacity: 0.8,
  },
};