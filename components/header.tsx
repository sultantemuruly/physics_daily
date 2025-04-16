import { AtomIcon } from "lucide-react";
import AuthButton from "./auth-button";

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-4 md:flex-row items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <AtomIcon className="h-8 w-8 text-blue-600" />
              <h1 className="text-lg md:text-2xl font-semibold md:font-bold text-slate-900">
                Physics Daily
              </h1>
            </div>
            <p className="text-sm text-slate-500">
              A new physics concept every day
            </p>
          </div>
          <div>
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
}
