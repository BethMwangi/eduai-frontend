"use client";

import { useState } from "react";
import { Button } from "@/components/common/Button";

export default function AddChildForm({ onBack }: { onBack: () => void }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    grade: "",
    school: "",
    county: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Child submitted:", form);
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
        name="grade"
        value={form.grade}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 p-3 rounded bg-white"
      >
        <option value="">Select Grade</option>
        <option value="Grade 1">Grade 1 (Primary)</option>
        <option value="Grade 2">Grade 2</option>
        <option value="Grade 3">Grade 3</option>
        <option value="Grade 4">Grade 4</option>
        <option value="Grade 5">Grade 5</option>
        <option value="Grade 6">Grade 6</option>
        <option value="Grade 7">Grade 7 (Junior Secondary)</option>
        <option value="Grade 8">Grade 8</option>
        <option value="Grade 9">Grade 9</option>
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

      <div className="flex gap-4">
        <Button type="submit" variant="primary">
          Add Child
        </Button>
        <Button type="button" variant="outlined" onClick={onBack}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
