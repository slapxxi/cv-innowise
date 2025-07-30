import { Button, type CvWithSkillsByCategories } from '~/shared';
import { useAuth } from '~/app';
import { Box, Typography } from '@mui/material';
import { t } from 'i18next';
import { CvSkillsTable, groupUserSkillsByParent, useSkills } from '~/features';

type CvPreviewProps = {
  cv: CvWithSkillsByCategories;
};

export function CvPreview({ cv }: CvPreviewProps) {
  const auth = useAuth();
  const { skills: allSkills } = useSkills();
  const userSkills = cv.skills;
  const groupedSkills = groupUserSkillsByParent(allSkills, userSkills);

  return (
    <Box className={'max-w-4xl mx-auto'}>
      <Box className="space-y-4 p-6  ">
        <Box className={'flex justify-between items-center'}>
          <Box className={'flex flex-col max-w-sm gap-2'}>
            <h1 className="text-2xl font-semibold">{auth?.user.profile.fullName}</h1>
            <h2>{auth?.user.positionName}</h2>
          </Box>
          <Button variant={'outlined'}>{t('Export PDF')}</Button>
        </Box>
        <Box className={' mt-6 '}>
          <Box className={'grid grid-cols-[1fr_3fr] gap-6 items-start '}>
            <Box className={' flex flex-col gap-y-2  '}>
              <p className="text-xl font-semibold">{t('Education')}</p>
              <p>{cv.education}</p>
              <p className="text-xl font-semibold">{t('Language proficiency')}</p>
              {cv.languages.map((l, i) => (
                <p key={i}>{l.name}</p>
              ))}
              <p className="text-xm font-semibold">{t('Domains')}</p>
              {cv?.projects?.map((pr) => (
                <span key={pr.id}>{pr.domain + ', '}</span>
              ))}
            </Box>
            <Box className={'max-w-xl pl-6 pb-4 flex flex-col gap-y-2 border-l-2 border-primary'}>
              <Typography variant={'subtitle1'} className="text-xl font-semibold">
                {cv.name}
              </Typography>
              <Typography component={'p'}>{cv.description}</Typography>
              <Box>
                {Object.entries(groupedSkills).map(([category, skills]) => (
                  <Box key={category} className="mb-4">
                    <Typography className="text-xl font-semibold">{category}</Typography>
                    <Box className="flex flex-wrap gap-2 mt-2">
                      {skills.map((skill) => (
                        <Box key={skill.id} className="px-3 py-1">
                          {skill.name}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        <section className={'mt-6'}>
          <Typography className="text-2xl font-semibold" component={'h3'}>
            Projects
          </Typography>
          {cv.projects?.map((pr) => (
            <Box key={pr.id} className={'grid grid-cols-[1fr_3fr] gap-6 items-start '}>
              <Box className={'max-w-sm'}>
                <Typography>{pr.name}</Typography>
                <Typography>{pr.description}</Typography>
              </Box>

              <Box className={'max-w-sm pl-6 pb-4 border-l-2 border-primary'}>
                <Typography className="text-xm font-semibold">Project roles</Typography>
                <Typography>{auth?.user.positionName}</Typography>
                <Typography className="text-xm font-semibold">Period</Typography>
                <Typography>
                  {pr.startDate} - {pr.endDate ?? 'Till now'}
                </Typography>
                <Typography className="text-xm font-semibold">Responsibilities</Typography>
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
          <CvSkillsTable categories={cv.skillsByCategories} projects={cv.projects ?? []} />
        </section>
      </Box>
    </Box>
  );
}
