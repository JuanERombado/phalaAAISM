import React from 'react';
import Database from 'better-sqlite3';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default async function RiskDashboard() {
  // Connect to the memory DB
  const db = new Database('../sentinel.db', { readonly: true });
  
  // Fetch referenda sorted by ID desc
  const referenda = db.prepare(`
    SELECT * FROM referenda 
    ORDER BY id DESC
  `).all();

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-8 selection:bg-green-900">
      <header className="mb-12 border-b border-green-800 pb-4">
        <h1 className="text-4xl font-bold tracking-tighter animate-pulse">
          OPENGOV SENTINEL <span className="text-sm font-normal text-green-700">v1.0.0</span>
        </h1>
        <p className="text-green-700 mt-2 text-sm uppercase">Automatic Governance Risk Assurance // Confidential Compute</p>
      </header>

      <main>
        <div className="border border-green-900 rounded-sm overflow-hidden shadow-[0_0_20px_rgba(0,255,0,0.1)]">
          <table className="w-full text-left">
            <thead className="bg-green-950 text-green-300 uppercase text-xs tracking-wider">
              <tr>
                <th className="p-4 border-b border-green-900">ID</th>
                <th className="p-4 border-b border-green-900">Status</th>
                <th className="p-4 border-b border-green-900 w-1/3">Title</th>
                <th className="p-4 border-b border-green-900">Proposer</th>
                <th className="p-4 border-b border-green-900">Evidence Hash</th>
                <th className="p-4 border-b border-green-900 text-right">Risk Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-900/50">
              {referenda.length === 0 ? (
                 <tr>
                    <td colSpan={6} className="p-8 text-center text-green-800 italic">
                       No data ingested yet. Run the ingestion script.
                    </td>
                 </tr>
              ) : (
                referenda.map((ref: any) => {
                  // Determine risk color
                  // Assuming risk_score is 0-10 or null
                  let riskColor = "text-gray-500";
                  let riskLabel = "PENDING";
                  
                  if (ref.risk_score !== null) {
                    const score = Number(ref.risk_score);
                    if (score >= 8) {
                        riskColor = "text-red-500";
                        riskLabel = "CRITICAL";
                    } else if (score >= 4) {
                        riskColor = "text-yellow-500";
                        riskLabel = "MEDIUM";
                    } else {
                        riskColor = "text-green-400";
                        riskLabel = "LOW";
                    }
                  }

                  return (
                    <tr key={ref.id} className="hover:bg-green-900/10 transition-colors">
                      <td className="p-4 font-bold">#{ref.post_id}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 text-xs border border-green-800 rounded bg-green-950/30">
                          {ref.status}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-green-400 truncate max-w-xs" title={ref.title}>
                        {ref.title}
                      </td>
                      <td className="p-4 text-xs font-mono opacity-70 truncate max-w-[150px]" title={ref.proposer}>
                        {ref.proposer}
                      </td>
                      <td className="p-4">
                         <code className="text-[10px] opacity-50 bg-green-950 px-1 rounded block w-24 truncate">
                            {ref.evidence_hash}
                         </code>
                      </td>
                      <td className="p-4 text-right">
                         <div className="flex flex-col items-end">
                            <span className={cn("font-bold text-lg", riskColor)}>
                                {ref.risk_score !== null ? `${ref.risk_score}/10` : "-"}
                            </span>
                            <span className={cn("text-[9px] uppercase tracking-widest", riskColor)}>
                                {riskLabel}
                            </span>
                         </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </main>
      
      <footer className="mt-12 text-center text-green-900 text-xs">
         <p>SECURED BY PHALA NETWORK TEE</p>
      </footer>
    </div>
  );
}
