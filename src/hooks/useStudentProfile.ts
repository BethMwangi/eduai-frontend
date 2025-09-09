import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { userService } from '@/services/userService';
import type { Student } from '@/types/auth';

export function useStudentProfile() {
  const { getValidAccessToken } = useAuth();
  const [studentProfile, setStudentProfile] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!getValidAccessToken) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const profile = await userService.getProfile(getValidAccessToken);
        setStudentProfile(profile);
        setError(null);
      } catch (err: unknown) {
        console.error("Failed to fetch student profile:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [getValidAccessToken]);

  return { 
    studentProfile, 
    loading, 
    error,
    gradeId: studentProfile?.grade || null,
    gradeName: studentProfile?.grade_name || studentProfile?.grade_level || null
  };
}