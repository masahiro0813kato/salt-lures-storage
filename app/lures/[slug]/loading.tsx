import Header from "@/components/organisms/Header";

export default function Loading() {
  return (
    <div className="bg-white min-h-screen">
      <Header fixed={true} />
      <main className="relative">
        {/* 画像セクション スケルトン */}
        <section className="relative w-full flex justify-center overflow-hidden bg-gray-200 animate-pulse" style={{ height: '400px', minHeight: '400px' }}>
          <div className="w-4/5 h-full bg-gray-300"></div>
        </section>

        {/* データセクション スケルトン */}
        <section className="relative bg-bg-primary z-50 px-4 py-8 text-white">
          {/* タイトルエリア スケルトン */}
          <div className="pb-8">
            <div className="h-6 w-32 bg-bg-secondary rounded mb-6 animate-pulse"></div>
            <div className="h-8 w-64 bg-bg-secondary rounded mb-2 animate-pulse"></div>
            <div className="h-5 w-48 bg-bg-secondary rounded animate-pulse"></div>
          </div>

          {/* スペックエリア スケルトン */}
          <div className="border-y-[0.5px] border-text-tertiary py-8 mb-8">
            {/* カテゴリー */}
            <div className="mb-8">
              <div className="h-4 w-20 bg-bg-secondary rounded mb-1 animate-pulse"></div>
              <div className="h-6 w-48 bg-bg-secondary rounded mb-1 animate-pulse"></div>
              <div className="h-4 w-32 bg-bg-secondary rounded animate-pulse"></div>
            </div>

            {/* フックサイズ */}
            <div className="mb-8">
              <div className="h-4 w-24 bg-bg-secondary rounded mb-1 animate-pulse"></div>
              <div className="h-5 w-40 bg-bg-secondary rounded animate-pulse"></div>
            </div>

            {/* その他のスペック */}
            <div className="grid grid-cols-3 gap-x-4 gap-y-8">
              <div>
                <div className="h-4 w-20 bg-bg-secondary rounded mb-1 animate-pulse"></div>
                <div className="h-6 w-12 bg-bg-secondary rounded animate-pulse"></div>
              </div>
              <div>
                <div className="h-4 w-20 bg-bg-secondary rounded mb-1 animate-pulse"></div>
                <div className="h-6 w-16 bg-bg-secondary rounded animate-pulse"></div>
              </div>
              <div>
                <div className="h-4 w-20 bg-bg-secondary rounded mb-1 animate-pulse"></div>
                <div className="h-6 w-14 bg-bg-secondary rounded animate-pulse"></div>
              </div>
              <div>
                <div className="h-4 w-20 bg-bg-secondary rounded mb-1 animate-pulse"></div>
                <div className="h-6 w-24 bg-bg-secondary rounded animate-pulse"></div>
              </div>
              <div>
                <div className="h-4 w-20 bg-bg-secondary rounded mb-1 animate-pulse"></div>
                <div className="h-6 w-20 bg-bg-secondary rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* 説明文 スケルトン */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-bg-secondary rounded animate-pulse"></div>
            <div className="h-4 w-full bg-bg-secondary rounded animate-pulse"></div>
            <div className="h-4 w-3/4 bg-bg-secondary rounded animate-pulse"></div>
          </div>
        </section>
      </main>
    </div>
  );
}
