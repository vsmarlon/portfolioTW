const PT_BR_DATE_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const PT_BR_COMPACT_NUMBER_FORMATTER = new Intl.NumberFormat('pt-BR', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

export function formatPtBrDate(value: string | number | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Data indisponivel';
  }

  return PT_BR_DATE_FORMATTER.format(date);
}

export function formatCompactNumber(value: number): string {
  return PT_BR_COMPACT_NUMBER_FORMATTER.format(value);
}

