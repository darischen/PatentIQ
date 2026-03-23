'use client';

import { useState } from 'react';

interface Props {
    queryId: string;
    analysisData?: any;
}

export function ExportReportMenu({ queryId, analysisData }: Props) {
    const [exportingFormat, setExportingFormat] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleExport = async (format: 'pdf' | 'docx' | 'json') => {
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
        }
    };

    return (
        <div className="flex flex-col gap-2 items-end">
            <div className="flex gap-2">
                <button
                    onClick={() => handleExport('pdf')}
                    disabled={!!exportingFormat}
                    className="px-3 py-1.5 text-sm font-medium bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                >
                    {exportingFormat === 'pdf' ? '...' : 'PDF'}
                </button>
                <button
                    onClick={() => handleExport('docx')}
                    disabled={!!exportingFormat}
                    className="px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {exportingFormat === 'docx' ? '...' : 'DOCX'}
                </button>
                <button
                    onClick={() => handleExport('json')}
                    disabled={!!exportingFormat}
                    className="px-3 py-1.5 text-sm font-medium bg-zinc-800 text-white rounded hover:bg-zinc-900 disabled:opacity-50"
                >
                    {exportingFormat === 'json' ? '...' : 'JSON'}
                </button>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}