import { useState, useEffect, useRef, useCallback } from 'react';
import { TERMINAL_COMMANDS, INTRO_COMMAND } from '../data/terminal';

type Line = { kind: 'cmd' | 'output' | 'error'; text: string };
type IntroPhase = 'idle' | 'typing' | 'outputting' | 'done';

const PROMPT = '~/portfolio $';

function resolveCommand(raw: string): string[] | null {
  const trimmed = raw.trim().toLowerCase();
  if (trimmed === 'about --stack' || trimmed === 'stack') return TERMINAL_COMMANDS['stack'];
  const firstWord = trimmed.split(/\s+/)[0];
  return TERMINAL_COMMANDS[firstWord] ?? null;
}

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [introTyped, setIntroTyped] = useState('');
  const [introPhase, setIntroPhase] = useState<IntroPhase>('idle');

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Trigger intro on scroll into view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntroPhase('typing');
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Typewriter: type the intro command character by character
  useEffect(() => {
    if (introPhase !== 'typing') return;

    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setIntroTyped(INTRO_COMMAND.slice(0, i));
      if (i >= INTRO_COMMAND.length) {
        clearInterval(interval);
        setTimeout(() => setIntroPhase('outputting'), 350);
      }
    }, 55);

    return () => clearInterval(interval);
  }, [introPhase]);

  // Output intro lines one by one after typing
  useEffect(() => {
    if (introPhase !== 'outputting') return;

    const outputLines = TERMINAL_COMMANDS['stack'];
    let i = 0;

    setLines([{ kind: 'cmd', text: INTRO_COMMAND }]);
    setIntroTyped('');

    const interval = setInterval(() => {
      setLines((prev) => [...prev, { kind: 'output', text: outputLines[i] }]);
      i += 1;
      if (i >= outputLines.length) {
        clearInterval(interval);
        setIntroPhase('done');
      }
    }, 45);

    return () => clearInterval(interval);
  }, [introPhase]);

  // Keep output scrolled to bottom
  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, introTyped]);

  const handleCommand = useCallback((raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    if (trimmed.toLowerCase() === 'clear') {
      setLines([]);
      return;
    }

    const output = resolveCommand(trimmed);
    const newLines: Line[] = [{ kind: 'cmd', text: trimmed }];

    if (output) {
      output.forEach((text) => newLines.push({ kind: 'output', text }));
    } else {
      newLines.push({
        kind: 'error',
        text: `  comando não encontrado: '${trimmed.split(/\s+/)[0]}'. tente 'help'.`,
      });
    }

    setLines((prev) => [...prev, ...newLines]);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputValue);
      setInputValue('');
    }
  };

  const focusInput = () => inputRef.current?.focus();

  const isDone = introPhase === 'done';

  return (
    <section id="terminal" className="px-4 sm:px-8 lg:px-16 py-20 lg:py-28">
      <div className="max-w-5xl mx-auto">
        {/* Terminal window */}
        <div
          ref={containerRef}
          className="border-3 border-black dark:border-white bg-white dark:bg-[#0a0a0a] font-mono cursor-text"
          onClick={focusInput}
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-2 border-b-3 border-black dark:border-white select-none">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-3 text-xs text-black/40 dark:text-white/30">{PROMPT}</span>
          </div>

          {/* Output area */}
          <div
            ref={outputRef}
            className="px-4 py-3 max-h-80 overflow-y-auto text-sm leading-relaxed"
          >
            {lines.map((line, i) => (
              <div key={i} className={line.kind === 'cmd' ? 'text-black dark:text-white' : line.kind === 'error' ? 'text-red-500 dark:text-red-400' : 'text-black/60 dark:text-white/50'}>
                {line.kind === 'cmd' ? (
                  <span>
                    <span className="text-cyan-600 dark:text-cyan-400">{PROMPT}</span>
                    {' '}
                    {line.text}
                  </span>
                ) : (
                  line.text
                )}
              </div>
            ))}

            {/* Typewriter in-progress line */}
            {(introPhase === 'typing') && (
              <div className="text-black dark:text-white">
                <span className="text-cyan-600 dark:text-cyan-400">{PROMPT}</span>
                {' '}
                {introTyped}
                <span className="terminal-cursor" />
              </div>
            )}

            {/* Interactive input line */}
            {isDone && (
              <div className="flex items-center text-black dark:text-white mt-0.5">
                <span className="text-cyan-600 dark:text-cyan-400 shrink-0">{PROMPT}</span>
                <span className="ml-1 relative flex items-center flex-1">
                  <span className="invisible whitespace-pre">{inputValue || ' '}</span>
                  <input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    className="absolute inset-0 bg-transparent outline-none caret-cyan-500 dark:caret-cyan-400 w-full"
                  />
                </span>
                {inputValue === '' && <span className="terminal-cursor" />}
              </div>
            )}

            {/* Idle cursor while outputting */}
            {introPhase === 'outputting' && (
              <div className="h-4" />
            )}
          </div>
        </div>

        <p className="mt-3 text-xs text-black/30 dark:text-white/20 font-mono">
          clique no terminal e digite um comando — tente <span className="text-cyan-600 dark:text-cyan-400">help</span>
        </p>
      </div>
    </section>
  );
}
