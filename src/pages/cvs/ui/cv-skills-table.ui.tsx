import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSkillStats } from '~/shared/hooks';
import { type CvWithSkillsByCategories } from '~/shared/types';
import { cnMarkedText, cnSubtitle } from '.';

type Props = {
  categories: CvWithSkillsByCategories['skillsByCategories'];
  projects?: CvWithSkillsByCategories['projects'];
};

export function CvSkillsTable({ categories, projects }: Props) {
  const { t } = useTranslation();
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
