import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <div>
      <Link href={"/exam"} passHref={true}>
        <a>Exam</a>
      </Link>

      <Link href={"/invigilation"} passHref={true}>
        <a>Invigilation</a>
      </Link>
    </div>
  );
}
