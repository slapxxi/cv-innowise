import { zodResolver } from '@hookform/resolvers/zod';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { getRouteApi } from '@tanstack/react-router';
import dayjs, { type Dayjs } from 'dayjs';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod/v4';
import { useCvProjects, useProjects, useUpdateCvProject } from '~/features';
import { Button, Select, SelectItem, TextField, type CvProject } from '~/shared';

const addCvProjectSchema = z.object({
  startDate: z.instanceof(dayjs as unknown as typeof Dayjs),
  endDate: z.instanceof(dayjs as unknown as typeof Dayjs).optional(),
  roles: z.string().trim().nonempty('Roles are required'),
  responsibilities: z.string().trim().nonempty('Responsibilities are required'),
});

type UpdateCvProjectForm = z.infer<typeof addCvProjectSchema>;

type AddCvFormProps = { cvProject: CvProject; onSuccess: () => void; onCancel: () => void };

const routeApi = getRouteApi('/_mainLayout/cvs/$cvId/_cvsLayout/projects');

export const UpdateCvProjectForm: React.FC<AddCvFormProps> = (props) => {
  const { cvProject, onSuccess, onCancel } = props;
  const { t } = useTranslation();
  const params = routeApi.useParams();
  const { updateCvProject } = useUpdateCvProject({
    cvId: params.cvId,
    projectId: cvProject.project.id,
    onSuccess,
  });
  const { cvProjects } = useCvProjects({ id: params.cvId });
  const { projects } = useProjects();

  const filteredProjects = projects.filter((p) => !cvProjects.find((cp) => cp.name === p.name));

  const form = useForm<UpdateCvProjectForm>({
    resolver: zodResolver(addCvProjectSchema),
    defaultValues: {
      startDate: dayjs(cvProject.startDate),
      endDate: cvProject.endDate ? dayjs(cvProject.endDate) : undefined,
      roles: cvProject.roles.join(', '),
      responsibilities: cvProject.responsibilities.join(', '),
    },
  });

  const projectId = cvProject.project.id;
  const projectName = cvProject.project.name;
  const project = projects.find((p) => p.id === projectId);
  const domain = project?.domain;
  const description = project?.description;

  const labelProps = {
    className: 'bg-bg dark:bg-neutral-600',
  };

  const handleSubmit: SubmitHandler<UpdateCvProjectForm> = async (data) => {
    updateCvProject({
      startDate: data.startDate.format('YYYY-MM-DD'),
      endDate: data.endDate?.format('YYYY-MM-DD'),
      responsibilities: data.responsibilities.split(','),
      roles: data.roles.split(','),
    });
  };

  if (filteredProjects.length === 0) {
    return (
      <div className="flex flex-col gap-4 mt-4">
        <p>{t('You have already added all projects')}</p>
        <Button onClick={onCancel}>{t('Cancel')}</Button>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-8 mt-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="grid grid-cols-2 gap-4">
        <Select label={t('Project')} labelProps={labelProps} disabled>
          <SelectItem>{projectName}</SelectItem>
        </Select>

        <Select label={t('Domain')} value={domain} labelProps={labelProps} disabled>
          <SelectItem value={domain}>{domain}</SelectItem>
        </Select>

        <TextField multiline value={description} className="col-span-2" label={t('Description')} disabled />

        <Controller
          name="startDate"
          control={form.control}
          render={({ field }) => <DatePicker label={t('Start date')} {...field} />}
        />

        <Controller
          name="endDate"
          control={form.control}
          render={({ field }) => <DatePicker label={t('End date')} {...field} />}
        />

        <TextField label={t('Roles')} className="col-span-2" {...form.register('roles')} />

        <TextField label={t('Responsibilities')} className="col-span-2" {...form.register('responsibilities')} />
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outlined" onClick={() => onCancel()}>
          {t('Cancel')}
        </Button>
        <Button type="submit">{t('Confirm')}</Button>
      </div>
    </form>
  );
};
