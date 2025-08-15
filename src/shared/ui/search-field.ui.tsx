import { Search } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useId } from 'react';
import { cn } from '../utils';

type SearchFieldProps = {} & Omit<React.ComponentProps<typeof TextField>, 'type' | 'slotProps' | 'id'>;

export const SearchField: React.FC<SearchFieldProps> = (props) => {
  const { className, ...rest } = props;
  const searchId = useId();

  return (
    <TextField
      id={searchId}
      type="search"
      slotProps={{
        input: {
          className: 'rounded-full',
          startAdornment: (
            <InputAdornment position="start">
              <IconButton type="submit">
                <Search />
              </IconButton>
            </InputAdornment>
          ),
        },
        htmlInput: {
          className: 'py-3',
        },
      }}
      className={cn('w-[320px] max-w-full', className)}
      {...rest}
    />
  );
};
