import { Header } from "@/components/header";
import { PhysicsCard } from "@/components/physics-card";

export default function Home() {
  return (
    <div>
      <Header />
      <div className="flex-1 container mx-auto px-4 py-48 flex items-center justify-center">
        <PhysicsCard />
      </div>
    </div>
  );
}
