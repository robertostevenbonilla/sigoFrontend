import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import PropTypes from 'prop-types';
import { Box, Chip } from '@mui/material';

export const SelectInput = ({
  variant,
  sxFormControl,
  fullWidth,
  size,
  label,
  id,
  name,
  onChange,
  sxSelect,
  value,
  data,
  error,
  errorMgs,
  disabled,
  multiple,
  input,
  getIndexLabel=null,
  getOptionLabel=null,
  backgroundLabel=null
}) => {

  return (
    <FormControl
      variant={variant} // filled, standard
      sx={sxFormControl} // {}
      fullWidth={fullWidth} // boolean true false
      size={size} // medium, 'small'
      disabled={disabled}
      error={error}
    >
      <InputLabel id={`lable-${id}`} shrink sx={{ pl: '0.1rem', pr: '0.5rem', background: (backgroundLabel !== null ? backgroundLabel : 'white') }}> {label} </InputLabel>
      <Select
        labelId={`lable-${id}`}
        id={id}
        name={name}
        value={value}
        label={label}
        onChange={onChange}
        sx={sxSelect}
        multiple={multiple}
        input={input}
        className='text-start'
      >
        <MenuItem value="-1" sx={{ whiteSpace: 'normal', color: "grey" }}>
          <em>Ninguno</em>
        </MenuItem>
        {data.map((v, i) => {
          if(getIndexLabel !== null) {
            return (
              <MenuItem key={i} value={v[getIndexLabel]} text={v[getOptionLabel]} sx={{ whiteSpace: 'normal' }}>
                {v[getOptionLabel]}
              </MenuItem>
            );
          } else {
            return ( 
              <MenuItem key={i} value={v.value} text={v.text} sx={{ whiteSpace: 'normal'}}>
                {v.text}
              </MenuItem>
            );
          }
        })}
      </Select>
      {error && <FormHelperText>{errorMgs || 'Requerido'}</FormHelperText>}
    </FormControl>
  );
};

SelectInput.defaultProps = {
  variant      : 'outlined',
  sxFormControl: {},
  fullWidth    : true,
  size         : 'standard',
  sxSelect     : {},
  error        : false,
  errorMgs     : '',
  disabled     : false
};


SelectInput.propTypes = {
  label        : PropTypes.string.isRequired,
  id           : PropTypes.string.isRequired,
  name         : PropTypes.string.isRequired,
  onChange     : PropTypes.func.isRequired,
  value        : PropTypes.string.isRequired,
  data         : PropTypes.array.isRequired,
  variant      : PropTypes.string,
  sxFormControl: PropTypes.object,
  fullWidth    : PropTypes.bool,
  size         : PropTypes.string,
  sxSelect     : PropTypes.object,
  error        : PropTypes.bool,
  errorMgs     : PropTypes.string,
  disabled     : PropTypes.bool,
};