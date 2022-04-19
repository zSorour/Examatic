import dynamic from "next/dynamic";

const VNCScreen = dynamic(() =>
  import("../components/VNCScreen/VNCScreen", { ssr: false })
);

export default function Exam() {
  return (
    <div>
      <main>
        <h1>Hello Everyone! Enjoy a great demo!</h1>
      </main>
      <VNCScreen />
    </div>
  );
}
