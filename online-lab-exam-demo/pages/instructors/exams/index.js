import React from "react";

import Link from "next/link";

export default function InstructorExamsPage() {
  return (
    <div>
      <h1>List of Instructor's Exams</h1>
      <Link href="/instructors/exams/create-exam" passHref>
        <a>Create Exam</a>
      </Link>
    </div>
  );
}
