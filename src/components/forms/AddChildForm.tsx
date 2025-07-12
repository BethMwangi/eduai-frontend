"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/common/Button";
import { userService } from "@/services/userService";

export default function AddChildForm({
  onBack,
  onChildAdded,
}: {
  onBack: () => void;
  onChildAdded?: () => void;
}) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    level: "",
    grade: "",
    school: "",
    county: "",
    password: "",
  });
  const [grades, setGrades] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [levels, setLevels] = useState<
    { level: string; display_name: string }[]
  >([]);

  useEffect(() => {
    userService.getLevels()
      .then((res) => setLevels(res.data))
      .catch((error) => {
        console.error("Failed to load levels:", error);
        setLevels([]);
      });
  }, []);

  useEffect(() => {
    if (form.level) {
      userService
        .getGradesByLevel(form.level)
        .then((res) => setGrades(res.data))
        .catch((error) => {
          console.error("Failed to load grades:", error);
          setGrades([]);
        });
    } else {
      setGrades([]);
    }
    setForm((prev) => ({ ...prev, grade: "" }));
  }, [form.level]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "level" ? { grade: "" } : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // Validate password length
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }
    
    try {
      await userService.addChild({
        first_name: form.firstName,
        last_name: form.lastName,
        date_of_birth: form.dob,
        grade: Number(form.grade), 
        school_name: form.school,
        county: form.county,
        password: form.password,
      });
      
      // Call onChildAdded first to refresh the parent list
      if (onChildAdded) {
        onChildAdded();
      }
      
      // Then close the form
      onBack();
    } catch {
      setError("Failed to add child.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded shadow-md w-full max-w-3xl mx-auto space-y-6 border border-gray-200"
    >
      <h2 className="text-2xl font-bold text-text">Add a Child</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="First Name"
          required
          className="w-full border border-gray-300 p-3 rounded"
        />
        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          required
          className="w-full border border-gray-300 p-3 rounded"
        />
      </div>

      <input
        name="dob"
        type="date"
        value={form.dob}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 p-3 rounded"
      />
      <select
        name="level"
        value={form.level}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 p-3 rounded bg-white"
      >
        <option value="">Select Level</option>
        {levels.map((level) => (
          <option key={level.level} value={level.level}>
            {level.display_name}
          </option>
        ))}
      </select>

      <select
        name="grade"
        value={form.grade}
        onChange={handleChange}
        required
        disabled={!form.level}
        className="w-full border border-gray-300 p-3 rounded bg-white"
      >
        <option value="">Select Grade</option>
        {grades.map((grade) => (
          <option key={grade.id} value={grade.id}>
            {grade.name}
          </option>
        ))}
      </select>

      <input
        name="school"
        value={form.school}
        onChange={handleChange}
        placeholder="School Name"
        className="w-full border border-gray-300 p-3 rounded"
      />
      <input
        name="county"
        value={form.county}
        onChange={handleChange}
        placeholder="County"
        className="w-full border border-gray-300 p-3 rounded"
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password for Child (minimum 6 characters)"
        required
        minLength={6}
        className="w-full border border-gray-300 p-3 rounded"
      />
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-4">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Adding..." : "Add Child"}
        </Button>
        <Button type="button" variant="outlined" onClick={onBack}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
