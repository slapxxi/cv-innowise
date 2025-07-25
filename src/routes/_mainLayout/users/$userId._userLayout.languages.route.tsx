import { createFileRoute } from '@tanstack/react-router';
import { sortBy } from 'lodash';
import i18n from '~/app/i18n';
import { languagesOptions, useUser } from '~/features';
import { PageTitle, UserLanguageProficiency, type LanguageProficiency } from '~/shared';

// todo: delete this
i18n.changeLanguage('ru');

export const Route = createFileRoute('/_mainLayout/users/$userId/_userLayout/languages')({
  component: RouteComponent,
  beforeLoad: ({ params }) => {
    return { breadcrumb: { title: i18n.t('Languages'), pathname: `/users/${params.userId}/languages` } };
  },
  loader: ({ context }) => {
    const { queryClient, auth } = context;
    queryClient.prefetchQuery(languagesOptions({ accessToken: auth!.accessToken }));
  },
});

function RouteComponent() {
  const params = Route.useParams();
  // const auth = useAuth();
  const { user } = useUser({ id: params.userId });
  // const { languages } = useLanguages();
  // const isOwner = user.id === auth!.user.id;

  function handleUpdate(lp: LanguageProficiency) {
    console.log(lp);
  }

  return (
    <div>
      <PageTitle>Languages</PageTitle>

      <div className="mx-auto max-w-4xl">
        <div className="gap-2 xl:gap-8 grid auto-rows-[minmax(50px,auto)] grid-cols-2 items-center">
          {sortBy(user.profile.languages, 'name').map((lp) => (
            <UserLanguageProficiency
              value={lp}
              key={lp.name}
              className="max-w-xs cursor-pointer"
              onClick={() => handleUpdate(lp)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
