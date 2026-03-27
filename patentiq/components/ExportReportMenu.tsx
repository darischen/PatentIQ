'use client';

import { useState } from 'react';

interface Props {
    queryId: string;
    analysisData?: any;
    onExport?: () => void;
}

export function ExportReportMenu({ queryId, analysisData, onExport }: Props) {
    const [exportingFormat, setExportingFormat] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleExport = async (format: 'pdf' | 'docx') => {
        setExportingFormat(format);
        setError(null);
        try {
            let res;

            // If we have analysis data, send it via POST
            if (analysisData) {
                res = await fetch(`/api/export-${format}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data: analysisData }),
                });
            } else {
                // Fall back to GET with queryId for database lookups
                res = await fetch(`/api/export-${format}?queryId=${queryId}`);
            }

            if (!res.ok) {
                if (res.status === 429) {
                    throw new Error('Rate limit exceeded. Please try again later.');
                }
                let errorTitle = `Failed to export ${format.toUpperCase()}`;
                try {
                    const errorData = await res.json();
                    if (errorData.error) {
                        errorTitle = errorData.error;
                        if (errorData.details) errorTitle += `: ${errorData.details}`;
                    }
                } catch (e) { }
                throw new Error(errorTitle);
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `structured-research-report-${queryId}.${format}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err: any) {
            console.error(err);
            setError(err.message || `Error exporting ${format.toUpperCase()}`);
            alert(err.message || `Error exporting ${format.toUpperCase()}`);
        } finally {
            setExportingFormat(null);
            onExport?.();
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <button
                onClick={() => handleExport('pdf')}
                disabled={!!exportingFormat}
                className="w-full px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
                {exportingFormat === 'pdf' ? '...' : 'PDF'}
            </button>
            <button
                onClick={() => handleExport('docx')}
                disabled={!!exportingFormat}
                className="w-full px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
                {exportingFormat === 'docx' ? '...' : 'DOCX'}
            </button>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}