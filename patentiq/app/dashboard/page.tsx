import { ExportReportMenu } from '@/components/ExportReportMenu';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-8 sm:p-20 font-sans">
            <main className="max-w-4xl mx-auto flex flex-col gap-8 bg-white dark:bg-black p-8 rounded-xl shadow">
                <h1 className="text-3xl font-bold border-b pb-4">Patent Analysis Dashboard</h1>

                <div className="flex flex-col gap-6">
                    {/* Mock Result Card */}
                    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-semibold max-w-[70%]">Mock Invention: AI Powered Quantum Coffee Maker</h2>

                            {/* Export Menu */}
                            <ExportReportMenu queryId="mock-id" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                            <div>
                                <strong className="block text-black dark:text-white mb-1">Status:</strong>
                                Completed Analysis
                            </div>
                            <div>
                                <strong className="block text-black dark:text-white mb-1">Top Matches:</strong>
                                US00001, US00002
                            </div>
                            <div className="col-span-1 md:col-span-2 mt-2">
                                <strong className="block text-black dark:text-white mb-1">AI Recommendation:</strong>
                                Focus on the specific quantum algorithm aspect in the claims to avoid prior art.
                            </div>
                        </div>
                    </div>

                    <div className="text-center text-sm text-zinc-500 mt-10">
                        Note: The PDF export feature integrates rate limiting and logging on the API side.
                    </div>
                </div>
            </main>
        </div>
    );
}
