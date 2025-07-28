import { CloudUploadOutlined as CloudIcon } from '@mui/icons-material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCvs, type CvsSortKey } from '~/features';
import {
  ActionMenu,
  ActionMenuItem,
  Highlight,
  OptionalLabel,
  Table,
  TableCell,
  TableRow,
  type ChangeSortHandler,
  type Cv,
  type SortOrder,
} from '~/shared';

type CvsTableProps = {
  q: string;
  sort: CvsSortKey;
  order: SortOrder;
  onChangeSort?: ChangeSortHandler;
  onUpdate?: (cv: Cv) => void;
  onDelete?: (cv: Cv) => void;
};

export const CvsTable: React.FC<CvsTableProps> = (props) => {
  const { q, onChangeSort, sort, order, onUpdate, onDelete, ...rest } = props;
  const { t } = useTranslation();
  const { cvs, isFetching } = useCvs({ sort, order, q });
  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  const handleChangeSort: ChangeSortHandler = (sort, order) => {
    onChangeSort?.(sort, order);
  };

  function handleUpdate(cv: Cv) {
    onUpdate?.(cv);
    setMenuOpen(null);
  }

  function handleDelete(cv: Cv) {
    onDelete?.(cv);
    setMenuOpen(null);
  }

  return (
    <>
      <Table
        data={cvs}
        headFields={[
          { id: 'name', title: t('Cv name') },
          { id: 'description', title: t('Cv description') },
          { id: 'education', title: t('Cv education') },
          { id: 'employee', title: t('Employee') },
          { id: 'action', title: '', child: isFetching ? <CloudIcon className="text-xl text-neutral-300" /> : null },
        ]}
        onChangeSort={handleChangeSort}
        sort={sort}
        order={order}
        fixedHeight
        {...rest}
      >
        {(cv, i) => (
          <TableRow key={cv.id}>
            <TableCell>
              <Highlight value={cv.highlights.name}>
                <OptionalLabel>{cv.name}</OptionalLabel>
              </Highlight>
            </TableCell>
            <TableCell>
              <Highlight value={cv.highlights.description}>
                <OptionalLabel>{cv.description}</OptionalLabel>
              </Highlight>
            </TableCell>
            <TableCell>
              <Highlight value={cv.highlights.education}>
                <OptionalLabel>{cv.education}</OptionalLabel>
              </Highlight>
            </TableCell>
            <TableCell>
              <Highlight value={cv.highlights.userEmail}>
                <OptionalLabel>{cv.user?.email}</OptionalLabel>
              </Highlight>
            </TableCell>
            <TableCell align="center">
              <ActionMenu open={menuOpen === i} onOpen={() => setMenuOpen(i)} onClose={() => setMenuOpen(null)}>
                <ActionMenuItem onClick={() => handleUpdate(cv)}>{t('Update cv')}</ActionMenuItem>
                <ActionMenuItem onClick={() => handleDelete(cv)}>{t('Delete cv')}</ActionMenuItem>
              </ActionMenu>
            </TableCell>
          </TableRow>
        )}
      </Table>
    </>
  );
};
