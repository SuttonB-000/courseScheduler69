"use client";

import { useEffect, useState } from "react";

export default function StudentPage() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const meRes = await fetch("/api/me");
        const meData = await meRes.json();

        const courseRes = await fetch("/api/courses");
        const courseData = await courseRes.json();

        setUser(meData);
        setCourses(courseData);
      } catch (err) {
        console.error("Failed to load student data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function handleSave() {
    setSaving(true);

    try {
      const method = editingCourse._id ? "PUT" : "POST";

      const res = await fetch("/api/courses", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCourse),
      });

      const data = await res.json();

      if (method === "POST") {
        setCourses((prev) => [...prev, data]);
      } else {
        setCourses((prev) =>
          prev.map((c) => (c._id === data._id ? data : c))
        );
      }

      setEditingCourse(null);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this course?")) return;

    try {
      await fetch(`/api/courses/${id}`, {
        method: "DELETE",
      });

      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  function handleEdit(course) {
    setEditingCourse(course);
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
          Welcome{user?.username ? ` ${user.username}` : ""}
        </h1>

        <h2 style={styles.subtitle}>Available Courses</h2>

        {/* CREATE BUTTON */}
        <button
          onClick={() =>
            setEditingCourse({
              code: "",
              courseTitle: "",
              instructorId: user?.username || "",
              subjectArea: "",
              courseDescription: "",
              credits: "",
            })
          }
          className="mb-4 px-4 py-2 bg-cyan-500 text-black rounded"
        >
          + Add Course
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
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-3 text-left text-xs uppercase tracking-wider text-[var(--accent)] font-semibold border-b border-[var(--accent)]"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-700">
                {courses.map((course) => (
                  <tr
                    key={course._id}
                    className="border-b border-[var(--border)] hover:bg-white/5 transition-all"
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

                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleEdit(course)}
                        className="text-blue-400 hover:underline mr-2"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(course._id)}
                        className="text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* FORM */}
        {editingCourse && (
          <div className="mt-6 p-4 border border-cyan-500 rounded">
            <h3 className="mb-3 text-lg">
              {editingCourse._id ? "Edit Course" : "Create Course"}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Code"
                value={editingCourse.code || ""}
                onChange={(e) =>
                  setEditingCourse({
                    ...editingCourse,
                    code: e.target.value,
                  })
                }
                className="p-2 bg-black border"
              />

              <input
                placeholder="Title"
                value={editingCourse.courseTitle || ""}
                onChange={(e) =>
                  setEditingCourse({
                    ...editingCourse,
                    courseTitle: e.target.value,
                  })
                }
                className="p-2 bg-black border"
              />

              {/* FIXED: instructor auto-filled + read-only */}
              <input
                placeholder="Instructor"
                value={editingCourse.instructorId || ""}
                readOnly
                className="p-2 bg-black border opacity-70 cursor-not-allowed"
              />

              <input
                placeholder="Subject"
                value={editingCourse.subjectArea || ""}
                onChange={(e) =>
                  setEditingCourse({
                    ...editingCourse,
                    subjectArea: e.target.value,
                  })
                }
                className="p-2 bg-black border"
              />

              <input
                placeholder="Credits"
                value={editingCourse.credits || ""}
                onChange={(e) =>
                  setEditingCourse({
                    ...editingCourse,
                    credits: e.target.value,
                  })
                }
                className="p-2 bg-black border"
              />

              <textarea
                placeholder="Description"
                value={editingCourse.courseDescription || ""}
                onChange={(e) =>
                  setEditingCourse({
                    ...editingCourse,
                    courseDescription: e.target.value,
                  })
                }
                className="p-2 bg-black border col-span-2"
              />
            </div>

            <div className="mt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-500 px-4 py-2 mr-2"
              >
                {saving ? "Saving..." : "Save"}
              </button>

              <button
                onClick={() => setEditingCourse(null)}
                className="bg-gray-500 px-4 py-2"
              >
                Cancel
              </button>
            </div>
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