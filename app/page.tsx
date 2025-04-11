import { Header } from "@/components/header";
import { PhysicsCard } from "@/components/physics-card";
import Activity from "@/components/activity";

export default function Home() {
  return (
    <div>
      <Header />
      <div className="flex-1 flex-col container mx-auto px-4 py-48 flex items-center justify-center">
        <PhysicsCard />
        <Activity />
      </div>
    </div>
  );
}
