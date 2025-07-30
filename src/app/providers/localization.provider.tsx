import { LocalizationProvider as BaseLocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export function LocalizationProvider({ children }: { children: React.ReactNode }) {
  return <BaseLocalizationProvider dateAdapter={AdapterDayjs}>{children}</BaseLocalizationProvider>;
}
