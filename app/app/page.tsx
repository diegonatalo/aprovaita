import type { Metadata } from "next";
import { HomeScreen } from "@/components/home-screen";

export const metadata: Metadata = { alternates: { canonical: "/app" } };

export default function Page() {
  return <HomeScreen />;
}
