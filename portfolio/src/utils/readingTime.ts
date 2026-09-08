/** Estimates prose at 180 words/minute and fenced code at 70 words/minute. */
export function getReadingTime(body: string): string {
  const codeBlocks = [...body.matchAll(/```[^\r\n]*\r?\n([\s\S]*?)```/g)].map(([, code]) => code);
  const prose = body.replace(/```[^\r\n]*\r?\n[\s\S]*?```/g, ' ');
  const words = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words(prose) / 180 + words(codeBlocks.join(' ')) / 70));

  return `~${minutes} min de leitura`;
}
