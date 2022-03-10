import dynamic from "next/dynamic";

const VNCScreen = dynamic(() =>
  import("../components/VNCScreen/VNCScreen", { ssr: false })
);

export default function Home() {
  return (
    <div>
      <main>
        <h1>Hello Everyone! Enjoy a great demo!</h1>
      </main>
      <VNCScreen />
      <input type="text" />
    </div>
  );
}
