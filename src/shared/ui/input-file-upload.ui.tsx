import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { styled } from '@mui/material/styles';
import React from 'react';

// todo: convert to tailwind
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

type PropsType = {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  ref: React.Ref<HTMLInputElement>;
  children?: React.ReactNode;
};
export function InputFileUpload({ onChange, ref, children }: PropsType) {
  return (
    <label className={'flex  items-center gap-4 cursor-pointer'}>
      <FileUploadOutlinedIcon sx={{ fontSize: 32 }} />
      {children}
      <VisuallyHiddenInput type="file" onChange={onChange} ref={ref} accept="image/*" />
    </label>
  );
}
