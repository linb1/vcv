import NodeTree from "@/app/(components)/NodeTree";
import Overlay from "@/app/(components)/Overlay";
export default function Home() {
  return (
    <div className="h-screen w-screen bg-slate-100 relative">
      <Overlay />
      <NodeTree />
    </div>
  );
}
