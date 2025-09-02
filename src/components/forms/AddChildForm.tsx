"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/common/Button";
import { userService } from "@/services/userService";
import { useAuth } from "@/context/auth";
import { Grade, Level } from "@/types/auth";

interface AddChildFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AddChildForm({
  onSuccess,
  onCancel,
}: AddChildFormProps) {
  const { getValidAccessToken } = useAuth();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    grade: "",
    school_name: "",
    county: "",
    password: "",
  });

  const [levels, setLevels] = useState<Level[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadLevels();
  }, []);

  useEffect(() => {
    if (selectedLevel) {
      loadGradesByLevel(selectedLevel);
    } else {
      setGrades([]);
      setFormData((prev) => ({ ...prev, grade: "" }));
    }
  }, [selectedLevel]);

  const loadLevels = async () => {
    try {
      if (!getValidAccessToken) {
        throw new Error("Authentication required");
      }

      const levelsData = await userService.getLevels(getValidAccessToken);
      setLevels(levelsData);
    } catch (err) {
      console.error("Failed to load levels:", err);
      setError("Failed to load school levels");
    }
  };

  const loadGradesByLevel = async (level: string) => {
    try {
      if (!getValidAccessToken) {
        throw new Error("Authentication required");
      }

      const gradesData = await userService.getGradesByLevel(
        getValidAccessToken,
        level
      );
      setGrades(gradesData);
    } catch (err) {
      console.error("Failed to load grades:", err);
      setError("Failed to load grades for selected level");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const level = e.target.value;
    setSelectedLevel(level);
  };

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const gradeId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      grade: gradeId,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!getValidAccessToken) {
        throw new Error("Authentication required");
      }

      if (!formData.grade) {
        throw new Error("Please select a grade");
      }

      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        date_of_birth: formData.date_of_birth,
        grade: parseInt(formData.grade, 10),
        school_name: formData.school_name,
        county: formData.county,
        password: formData.password,
      };

      console.log("Submitting payload:", payload);

      await userService.addChild(getValidAccessToken, payload);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Failed to add child:", err);
      setError(err instanceof Error ? err.message : "Failed to add child");
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
          name="first_name"
          value={formData.first_name}
          onChange={handleInputChange}
          placeholder="First Name"
          required
          className="w-full border border-gray-300 p-3 rounded"
        />
        <input
          name="last_name"
          value={formData.last_name}
          onChange={handleInputChange}
          placeholder="Last Name"
          required
          className="w-full border border-gray-300 p-3 rounded"
        />
      </div>

      <input
        name="date_of_birth"
        type="date"
        value={formData.date_of_birth}
        onChange={handleInputChange}
        required
        className="w-full border border-gray-300 p-3 rounded"
      />

      <select
        name="level"
        value={selectedLevel}
        onChange={handleLevelChange}
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
        value={formData.grade}
        onChange={handleGradeChange}
        required
        disabled={!selectedLevel}
        className="w-full border border-gray-300 p-3 rounded bg-white disabled:bg-gray-100"
      >
        <option value="">
          {!selectedLevel ? "Select level first" : "Select Grade"}
        </option>
        {grades.map((grade) => (
          <option key={grade.id} value={grade.id}>
            {grade.display_name}
          </option>
        ))}
      </select>

      <input
        name="school_name"
        value={formData.school_name}
        onChange={handleInputChange}
        placeholder="School Name"
        className="w-full border border-gray-300 p-3 rounded"
      />

      <input
        name="county"
        value={formData.county}
        onChange={handleInputChange}
        placeholder="County"
        className="w-full border border-gray-300 p-3 rounded"
      />

      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleInputChange}
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
        <Button type="button" variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
