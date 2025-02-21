import { useMemo } from 'react';
import { Alert, Box, Button, Chip, CircularProgress, Stack, Typography } from '@mui/material';
import { alpha, createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useTheme as useAppTheme } from '../../contexts/ThemeContext';
import { DEFAULT_GITHUB_USERNAME } from '../../features/githubRepos/constants';
import { useGitHubRepositoriesQuery } from '../../features/githubRepos/useGitHubRepositoriesQuery';
import type { GitHubRepoRow } from '../../types/blog';

const GitHubRepoExplorer = () => {
  const { theme } = useAppTheme();
  const isDark = theme === 'dark';

  const {
    rows,
    stats,
    isLoading,
    isError,
    errorMessage,
    refetch,
    isFetching,
  } = useGitHubRepositoriesQuery({
    username: DEFAULT_GITHUB_USERNAME,
  });

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: theme,
          primary: {
            main: '#22d3ee',
          },
          background: {
            default: isDark ? '#0a0a0a' : '#fafafa',
            paper: isDark ? '#0a0a0a' : '#fafafa',
          },
          text: {
            primary: isDark ? '#fafafa' : '#0a0a0a',
            secondary: isDark ? '#d4d4d8' : '#52525b',
          },
          divider: isDark ? 'rgba(250, 250, 250, 0.28)' : 'rgba(10, 10, 10, 0.28)',
        },
        shape: {
          borderRadius: 0,
        },
        typography: {
          fontFamily: 'var(--font-mono)',
        },
      }),
    [isDark, theme],
  );

  const columns = useMemo<GridColDef<GitHubRepoRow>[]>(
    () => [
      {
        field: 'name',
        headerName: 'Repositório',
        flex: 1.4,
        minWidth: 240,
        sortable: false,
        renderCell: ({ row }) => (
          <div className="flex min-w-0 flex-col py-2">
            <a
              href={row.url}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-sm font-semibold transition-colors hover:opacity-85"
              style={{ color: isDark ? '#67e8f9' : '#0f766e' }}
            >
              {row.name}
            </a>
            <span className="truncate text-xs" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
              {row.description || 'Sem descrição pública.'}
            </span>
          </div>
        ),
      },
      {
        field: 'language',
        headerName: 'Stack',
        minWidth: 130,
        flex: 0.65,
        valueGetter: (_, row) => row.language || 'Não definido',
      },
      {
        field: 'visibility',
        headerName: 'Visibilidade',
        minWidth: 130,
        flex: 0.7,
      },
      {
        field: 'stars',
        headerName: 'Stars',
        type: 'number',
        minWidth: 100,
        flex: 0.45,
      },
      {
        field: 'forks',
        headerName: 'Forks',
        type: 'number',
        minWidth: 100,
        flex: 0.45,
      },
      {
        field: 'updatedAt',
        headerName: 'Atualizado',
        minWidth: 160,
        flex: 0.8,
      },
    ],
    [isDark],
  );

  return (
    <MuiThemeProvider theme={muiTheme}>
      <section
        id="demo"
        className={`overflow-hidden border-3 ${isDark ? 'border-cyan-400 bg-black' : 'border-black bg-white'}`}
      >
        <div
          className={`border-b-2 px-5 py-5 sm:px-6 ${
            isDark
              ? 'border-cyan-400 bg-black'
              : 'border-black bg-cyan-400/20'
          }`}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-black dark:text-cyan-400">
                Demo embutida
              </p>
              <h2 className="mt-2 text-2xl font-black text-black dark:text-white">
                GitHub Repository Explorer com MUI DataGrid
              </h2>
              <p className="mt-2 text-sm leading-6 text-black/80 dark:text-white/80">
                Dados reais, cache com React Query e uma tabela integrada ao visual do portfolio em
                vez de um painel externo.
              </p>
            </div>

            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {stats.map((item) => (
                <Chip
                  key={item}
                  label={item}
                  size="small"
                  sx={{
                    color: muiTheme.palette.text.primary,
                    borderColor: isDark ? '#fafafa' : '#0a0a0a',
                    borderWidth: 2,
                    backgroundColor: isDark
                      ? alpha('#0a0a0a', 0.86)
                      : alpha('#fafafa', 0.92),
                  }}
                  variant="outlined"
                />
              ))}
            </Stack>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Fonte: GitHub API / usuário {DEFAULT_GITHUB_USERNAME}
            </div>
            <Button
              onClick={() => void refetch()}
              disabled={isFetching}
              size="small"
              variant="outlined"
              sx={{
                borderColor: isDark ? '#fafafa' : '#0a0a0a',
                borderWidth: 2,
                color: muiTheme.palette.primary.main,
                backgroundColor: isDark ? alpha('#0a0a0a', 0.92) : alpha('#fafafa', 0.92),
              }}
            >
              {isFetching ? 'Atualizando...' : 'Atualizar dados'}
            </Button>
          </div>

          {isLoading ? (
            <Box
              sx={{
                minHeight: 360,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 2,
                color: muiTheme.palette.text.secondary,
              }}
            >
              <CircularProgress size={28} sx={{ color: muiTheme.palette.primary.main }} />
              <Typography variant="body2">Carregando repositórios reais...</Typography>
            </Box>
          ) : null}

          {isError ? (
            <Alert
              severity="error"
              sx={{
                backgroundColor: isDark ? alpha('#7f1d1d', 0.22) : alpha('#fecaca', 0.55),
                color: isDark ? '#fecaca' : '#7f1d1d',
                border: `1px solid ${alpha('#f87171', 0.24)}`,
              }}
            >
              {errorMessage ?? 'Falha inesperada ao consultar a API.'}
            </Alert>
          ) : null}

          {!isLoading && !isError ? (
            <Box
              sx={{
                height: 520,
                width: '100%',
                '& .MuiDataGrid-root': {
                  border: `2px solid ${muiTheme.palette.divider}`,
                  borderRadius: 0,
                  backgroundColor: alpha(muiTheme.palette.background.paper, isDark ? 0.92 : 0.98),
                  color: muiTheme.palette.text.primary,
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: isDark ? alpha('#0a0a0a', 0.98) : alpha('#fafafa', 0.96),
                  borderBottom: `2px solid ${muiTheme.palette.divider}`,
                },
                '& .MuiDataGrid-cell': {
                  borderBottom: `1px solid ${alpha(muiTheme.palette.divider, isDark ? 0.9 : 0.8)}`,
                },
                '& .MuiDataGrid-toolbarContainer': {
                  padding: '0.9rem',
                  borderBottom: `2px solid ${muiTheme.palette.divider}`,
                  backgroundColor: isDark ? alpha('#0a0a0a', 0.9) : alpha('#fafafa', 0.9),
                },
                '& .MuiDataGrid-footerContainer': {
                  borderTop: `2px solid ${muiTheme.palette.divider}`,
                  backgroundColor: isDark ? alpha('#0a0a0a', 0.9) : alpha('#fafafa', 0.9),
                },
                '& .MuiInputBase-root, & .MuiTablePagination-root, & .MuiIconButton-root': {
                  color: muiTheme.palette.text.primary,
                  borderRadius: 0,
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: alpha(muiTheme.palette.primary.main, isDark ? 0.22 : 0.18),
                },
                '& .MuiDataGrid-row.Mui-selected': {
                  backgroundColor: alpha(muiTheme.palette.primary.main, isDark ? 0.3 : 0.24),
                },
                '& .MuiDataGrid-overlay': {
                  backgroundColor: alpha(muiTheme.palette.background.paper, 0.96),
                },
              }}
            >
              <DataGrid
                rows={rows}
                columns={columns}
                rowHeight={72}
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10, 25]}
                initialState={{
                  pagination: { paginationModel: { pageSize: 5, page: 0 } },
                  sorting: { sortModel: [{ field: 'stars', sort: 'desc' }] },
                }}
                showToolbar
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 250 },
                  },
                }}
              />
            </Box>
          ) : null}
        </div>
      </section>
    </MuiThemeProvider>
  );
};

export default GitHubRepoExplorer;
