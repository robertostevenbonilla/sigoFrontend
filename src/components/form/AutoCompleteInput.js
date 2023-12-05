import { Autocomplete, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

export const SearchInput = ({
  options,
  value,
  label,
  id,
  name,
  onChange,
  onClear,
  getIndexLabel,
  getOptionLabel,
  disabled,
  size = 'large',
  focused,
  placeholder
}) => {
  const [item, setItem] = useState({});

  useEffect(() => {
    setItem(options.find((i) => i[getIndexLabel ? getIndexLabel : 'id'] === value));
    // eslint-disable-next-line
  }, [value]);

  const onChangeInput = (e, value) => {
    onChange(
      {
        target: {
          id,
          name,
          value: value[getIndexLabel]
        }
      },
      id,
      name,
      value[getIndexLabel]
    );
  };

  const onClearInput = (e, newInputValue, reason) => {
    //if(newInputValue === "") onClear();
  }

  return (
    <Autocomplete
      size={size}
      freeSolo
      disableClearable
      options={options}
      value={item ? item : ''}
      getOptionLabel={(option) => option[getOptionLabel] || ''}
      onChange={(e, value) => onChangeInput(e, value)}
      onInputChange={(e, newInputValue, reason) => onClearInput(e, newInputValue, reason)}
      disabled={disabled}
      placeholder={placeholder}
      renderInput={(params) => (
        <TextField
          focused={focused}
          {...params}
          label={label}
          size={size}
          fullWidth
          InputProps={{
            ...params.InputProps,
            type: 'search'
          }}
        />
      )}
    />
  );
};