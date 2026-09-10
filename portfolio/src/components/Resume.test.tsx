import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import Resume from './Resume'

describe('Resume', () => {
  it('renders the English résumé facts and print controls', () => {
    render(<MemoryRouter><Resume locale="en" /></MemoryRouter>)

    expect(screen.getByTestId('resume-ready')).toHaveAttribute('lang', 'en')
    expect(screen.getByRole('heading', { name: 'Marlon Stein Vargas' })).toBeInTheDocument()
    expect(screen.getByText('Software Development Intern · Quero-Quero (QQTech)')).toBeInTheDocument()
    expect(screen.getByText(/Software developer with experience in financial services/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Português' })).toHaveAttribute('href', '/cv/pt-BR')
    expect(screen.getByRole('button', { name: 'Print' })).toBeInTheDocument()
  })

  it('renders the Portuguese copy and PDF viewer link', () => {
    document.title = 'Portfolio'
    render(<MemoryRouter><Resume locale="pt-BR" /></MemoryRouter>)

    expect(screen.getByTestId('resume-ready')).toHaveAttribute('lang', 'pt-BR')
    expect(screen.getByRole('heading', { name: 'Resumo profissional' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Imprimir' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Ver PDF/ })).toHaveAttribute('href', '/cv/Marlon-Vargas-pt-BR.pdf')
    expect(screen.getByRole('link', { name: /Ver PDF/ })).toHaveAttribute('target', '_blank')
    expect(screen.getByRole('link', { name: /Ver PDF/ })).not.toHaveAttribute('download')
    expect(document.documentElement.lang).toBe('pt-BR')
    expect(document.title).toContain('Currículo')
  })

  it('restores document metadata when the résumé unmounts', () => {
    document.documentElement.lang = 'en'
    document.title = 'Portfolio'
    const { unmount } = render(<MemoryRouter><Resume locale="pt-BR" /></MemoryRouter>)

    unmount()

    expect(document.documentElement.lang).toBe('en')
    expect(document.title).toBe('Portfolio')
  })
})
