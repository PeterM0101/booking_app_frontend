import {Suspense} from "react";
import GetMessage from "@/components/GetMessage";

export default function Home() {
  return (
    <main className="container mx-auto">
      <Suspense fallback={<p>Loading...</p>}>
        <GetMessage />
      </Suspense>
    </main>
  );
}
