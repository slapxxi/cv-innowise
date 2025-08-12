import { capitalize } from 'lodash';
import type { HttpError } from '../types';

type FormErrorsProps = { error?: HttpError | null };

export const FormErrors: React.FC<FormErrorsProps> = (props) => {
  const { error } = props;

  if (error) {
    const { errors, message } = error;

    return (
      <>
        {!errors && <p className="text-error">{message}</p>}

        {errors && (
          <ul className="text-error">
            {errors.map((e) => (
              <li key={e}>{capitalize(e)}</li>
            ))}
          </ul>
        )}
      </>
    );
  }

  return null;
};
