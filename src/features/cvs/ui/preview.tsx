import type { Cv } from '~/shared';
import { useAuth } from '~/app';
import { Box, Divider, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { t } from 'i18next';

type CvPreviewProps = {
  cv: Cv;
  cvProjects: Cv['projects'];
};

export function CvPreview({ cv, cvProjects }: CvPreviewProps) {
  const auth = useAuth();
  // ();
  console.log('cv', cv);
  console.log('cvProjects', cvProjects);
  return (
    <>
      <Box className="space-y-4 p-6 border rounded-md shadow-sm ">
        <Box className={'flex justify-between items-center'}>
          <Box className={'flex flex-col'}>
            <h1 className="text-2xl font-semibold">{auth?.user.profile.fullName}</h1>
            <h2>{cv.name}</h2>
          </Box>
          {/*<h1></h1>*/}
          <Button variant={'outlined'}>{t('Export PDF')}</Button>
        </Box>
        <section className={'mt-6'}>
          <Box className={'flex justify-between'}>
            <Box>
              <p className="text-xm font-semibold">{t('Education')}</p>
              <p>{}</p>
              <p className="text-xm font-semibold">{t('Language proficiency')}</p>
              <p>{}</p>
              <p className="text-xm font-semibold">{t('Domains')}</p>
              <p>{}</p>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant={'subtitle1'} component={'h3'}>
                {cv.name}
              </Typography>
              <Typography component={'p'}>{cv.description}</Typography>
              <p>
                {auth?.user.profile.languages.map((l, i) => (
                  <span key={i}>{l.name}</span>
                ))}
              </p>
            </Box>
          </Box>
        </section>

        {/*<div>*/}
        {/*  <h3 className="text-lg font-medium text-gray-700">Description</h3>*/}
        {/*  <p>{cv.description}</p>*/}
        {/*</div>*/}

        {/*<div>*/}
        {/*  <h3 className="text-lg font-medium">Education</h3>*/}
        {/*  <p>{cv.education}</p>*/}
        {/*</div>*/}
        <section className={'mt-6'}>
          <Typography className="text-2xl font-semibold" component={'h3'}>
            Projects
          </Typography>
          {cvProjects?.map((pr) => (
            <Box key={pr.id} className={'flex justify-between'}>
              <Box>
                <Typography>{pr.name}</Typography>
                <Typography>{pr.description}</Typography>
              </Box>

              <Box>
                <Typography className="text-xm font-semibold">Project roles</Typography>
                <Typography>{auth?.user.positionName}</Typography>
                <Typography className="text-xm font-semibold">Period</Typography>
                <Typography>
                  {pr.startDate} - {pr.endDate}
                </Typography>
                <Typography className="text-xm font-semibold">Responsibilities</Typography>
                {/*<Typography>{pr.}</Typography>*/}
                <Typography className="text-xm font-semibold">Enviroments</Typography>
                <Typography>
                  {pr.environment.map((e, i) => (
                    <span key={i}>{e + ', '}</span>
                  ))}
                </Typography>
              </Box>
            </Box>
          ))}
        </section>
        <section className={'mt-6'}>
          <Typography className="text-2xl font-semibold" component={'h3'}>
            Professional Skills
          </Typography>
        </section>
      </Box>
    </>
  );
}
