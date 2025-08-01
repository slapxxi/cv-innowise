import { type CvWithSkillsByCategories, useSkillStats } from '~/shared';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { t } from 'i18next';
import { cnMarkedText, cnSubtitle } from '~/features';

type Props = {
  categories: CvWithSkillsByCategories['skillsByCategories'];
  projects?: CvWithSkillsByCategories['projects'];
};

export function CvSkillsTable({ categories, projects }: Props) {
  const skillStats = useSkillStats(projects ?? []);
  const calcYears = (name: string): string | null => {
    const years = skillStats.years(name);
    return years != null ? years.toString() : '';
  };

  const calcLastUsed = (name: string): string => {
    const lastUsed = skillStats.lastUsed(name);
    return lastUsed != null ? lastUsed.toString() : '';
  };
  return (
    <Table
      size="small"
      sx={{
        '& .MuiTableCell-root': {
          border: 'none',
          verticalAlign: 'middle',
        },
      }}
    >
      <TableHead>
        <TableRow sx={{ borderBottom: 'solid 2px', borderBottomColor: 'primary.light' }}>
          <TableCell className={cnSubtitle}>{t('Skills')}</TableCell>
          <TableCell></TableCell>
          <TableCell align={'center'} className={cnSubtitle}>
            {t('Experience in years')}
          </TableCell>
          <TableCell align={'center'} className={cnSubtitle}>
            {t('Last used')}
          </TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {Object.entries(categories ?? {}).map(([category, skills]) =>
          skills?.map((s, idx) => (
            <TableRow
              key={s.name}
              data-last={idx === skills.length - 1 ? 'true' : undefined}
              sx={idx === skills.length - 1 ? { borderBottom: 'solid 2px', borderBottomColor: 'divider' } : undefined}
            >
              {idx === 0 && (
                <TableCell rowSpan={skills.length} className={cnMarkedText}>
                  {category}
                </TableCell>
              )}
              <TableCell>{s.name}</TableCell>
              <TableCell align="center">{calcYears(s.name)}</TableCell>
              <TableCell align="center">{calcLastUsed(s.name)}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
