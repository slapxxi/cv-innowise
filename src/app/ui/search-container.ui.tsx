import { useTranslation } from 'react-i18next';
import { PageTitle, SearchField } from '~/shared';

type SearchContainerProps = { title: string; query: string; onSearch?: (q: string) => void; children: React.ReactNode };

export const SearchContainer: React.FC<SearchContainerProps> = (props) => {
  const { title, onSearch, query, children } = props;
  const { t } = useTranslation();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const fd = new FormData(form);
    const q = fd.get('query') as string;
    onSearch?.(q);
    e.preventDefault();
  };

  return (
    <section className="flex flex-col gap-4 p-6 py-4">
      <header className="flex flex-col gap-2 bg-bg dark:bg-bg-dark">
        <PageTitle>{title}</PageTitle>

        <form onSubmit={handleSearch} key={query}>
          <SearchField placeholder={t('Search')} defaultValue={query} name="query" autoFocus={query !== ''} />
        </form>
      </header>

      {children}
    </section>
  );
};
