import Header from "@/components/organisms/Header";
import TopPageClient from "@/components/organisms/TopPageClient";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />
      <main className="pt-16">
        <TopPageClient />
      </main>
    </div>
  );
}
