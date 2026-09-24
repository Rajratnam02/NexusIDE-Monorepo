import React from "react";
import { X, Trash2, Terminal, CheckCircle, XCircle, Loader } from "lucide-react";
import { useExecutionStore } from "../stores/ExecutionStore";

const OutputPanel = () => {
  const { isRunning, output, error, isOutputOpen, clearOutput, closeOutput } =
    useExecutionStore();

  if (!isOutputOpen) return null;

  const exitSuccess = output?.exitCode === 0;

  return (
    <div className="flex flex-col border-t border-gray-800 bg-[#0d0d0d]" style={{ height: "220px" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-1.5 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Terminal size={13} />
          <span className="font-semibold uppercase tracking-wide">Output</span>
          {isRunning && (
            <span className="flex items-center gap-1 text-yellow-400">
              <Loader size={11} className="animate-spin" /> Running...
            </span>
          )}
          {!isRunning && output && (
            <span className={`flex items-center gap-1 ${exitSuccess ? "text-green-400" : "text-red-400"}`}>
              {exitSuccess ? <CheckCircle size={11} /> : <XCircle size={11} />}
              exit {output.exitCode}
            </span>
          )}
          {!isRunning && error && (
            <span className="flex items-center gap-1 text-red-400">
              <XCircle size={11} /> Error
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={clearOutput} title="Clear output" className="p-1 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded transition-colors">
            <Trash2 size={13} />
          </button>
          <button onClick={closeOutput} title="Close panel" className="p-1 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded transition-colors">
            <X size={13} />
          </button>
        </div>
      </div>
      {/* Body */}
      <div className="flex-1 overflow-y-auto p-3 font-mono text-xs leading-relaxed">
        {isRunning && (
          <div className="flex items-center gap-2 text-yellow-400 animate-pulse">
            <Loader size={13} className="animate-spin" />
            <span>Executing code...</span>
          </div>
        )}
        {!isRunning && error && <p className="text-red-400 whitespace-pre-wrap">{error}</p>}
        {!isRunning && output && (
          <>
            {output.stdout && <pre className="text-gray-200 whitespace-pre-wrap">{output.stdout}</pre>}
            {output.stderr && <pre className="text-red-400 whitespace-pre-wrap mt-1">{output.stderr}</pre>}
            {!output.stdout && !output.stderr && <span className="text-gray-600 italic">Program exited with no output.</span>}
          </>
        )}
        {!isRunning && !output && !error && <span className="text-gray-600 italic">Press Run to execute the active file.</span>}
      </div>
    </div>
  );
};

export default OutputPanel;
