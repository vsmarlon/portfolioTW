export function getCurrentSemester(startYear: number, startMonth: number, offset: number = 0): string {
  const now = new Date();
  const monthsDiff = (now.getFullYear() - startYear) * 12 + (now.getMonth() + 1 - startMonth);
  const semester = Math.floor(monthsDiff / 6) + 1 + offset;
  return `Cursando (${semester}º Semestre)`;
}
