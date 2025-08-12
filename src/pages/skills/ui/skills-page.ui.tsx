import {
  ActionMenu,
  type ChangeSortHandler,
  Highlight,
  OptionalLabel,
  SearchContainer,
  Table,
  TableCell,
} from '~/shared';
import { MenuItem, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSkills } from '~/features';
import { getRouteApi } from '@tanstack/react-router';

const routeApi = getRouteApi('/_mainLayout/skills');

export const SkillsPage = () => {
  const { t } = useTranslation();
  const search = routeApi.useSearch();
  const nav = routeApi.useNavigate();
  const { skills } = useSkills({ ...search });

  const handleSearch = (q: string) => {
    nav({ search: (prev) => ({ ...prev, q }) });
  };

  const handleChangeSort: ChangeSortHandler = (sort, order) => {
    nav({ search: (prev) => ({ ...prev, sort, order }) });
  };
  return (
    <SearchContainer title={t('Skills')} query={search.q} onSearch={handleSearch}>
      <Table
        data={skills}
        headFields={[
          { id: 'name', title: t('Name') },
          { id: 'categoryName', title: t('Category') },
          { id: 'action', title: '' },
        ]}
        order={search.order}
        sort={search.sort}
        onChangeSort={handleChangeSort}
        fixedHeight
      >
        {(skill) => (
          <TableRow key={skill.id}>
            <TableCell>
              <Highlight value={skill.highlights.name}>
                <OptionalLabel>{skill.name}</OptionalLabel>
              </Highlight>
            </TableCell>
            <TableCell>
              <Highlight value={skill.highlights.categoryName}>
                <OptionalLabel>{skill.categoryName}</OptionalLabel>
              </Highlight>
            </TableCell>
            <TableCell>
              <ActionMenu>
                <MenuItem>Update skill </MenuItem>
                <MenuItem>Delete skill</MenuItem>
              </ActionMenu>
            </TableCell>
          </TableRow>
        )}
      </Table>
    </SearchContainer>
  );
};
