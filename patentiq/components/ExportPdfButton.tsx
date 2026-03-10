'use client';

import { useState } from 'react';

interface Props {
    queryId: string;
}

export function ExportPdfButton({ queryId }: Props) {
    const [isExporting, setIsExporting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleExport = async () => {
        setIsExporting(true);
        setError(null);
        try {
            const res = await fetch(`/api/export-pdf?queryId=${queryId}`);

            if (!res.ok) {
                if (res.status === 429) {
                    throw new Error('Rate limit exceeded. Please try again later.');
                }

                // Try to parse error details from server
                let errorTitle = 'Failed to export PDF';
                try {
                    const errorData = await res.json();
                    if (errorData.error) {
                        errorTitle = errorData.error;
                        if (errorData.details) {
                            errorTitle += `: ${errorData.details}`;
                        }
                    }
                } catch (e) {
                    // Fallback if not JSON
                }
                throw new Error(errorTitle);
            }

            // Convert to blob and download
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `patent-analysis-report-${queryId}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Error exporting PDF');
            // In a real app we'd use a toast notification
            alert(err.message || 'Error exporting PDF');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <button
                onClick={handleExport}
                disabled={isExporting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
                {isExporting ? 'Generating PDF...' : 'Export to PDF'}
            </button>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
