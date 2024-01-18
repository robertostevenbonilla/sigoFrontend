import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

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
  size = "large",
  focused,
  placeholder,
}) => {
  const [item, setItem] = useState({});

  useEffect(() => {
    setItem(
      options.find((i) => {
        console.log(getIndexLabel, i, value);
        return i[getIndexLabel ? getIndexLabel : "id"] === value
      })
    );
    // eslint-disable-next-line
  }, [value]);

  const onChangeInput = (e, value) => {
    onChange(
      {
        target: {
          id,
          name,
          value: value[getIndexLabel],
        },
      },
      id,
      name,
      value[getIndexLabel]
    );
  };

  const onClearInput = (e, newInputValue, reason) => {
    //if(newInputValue === "") onClear();
  };

  return (
    <Autocomplete
      size={size}
      freeSolo
      disableClearable
      options={options}
      value={item ? item : ""}
      getOptionLabel={(option) => option[getOptionLabel]
        /* (
          `<p>
            ${option[getOptionLabel]}
            <br />
            <small>text</small>
          </p>`
        ) */ || ""
      }
      onChange={(e, value) => onChangeInput(e, value)}
      onInputChange={(e, newInputValue, reason) =>
        onClearInput(e, newInputValue, reason)
      }
      disabled={disabled}
      placeholder={placeholder}
      helperNode={<div style={{ color: "red" }}>Helper Text</div>}
      renderInput={(params) => (
        <TextField
          focused={focused}
          {...params}
          label={label}
          size={size}
          fullWidth
          InputProps={{
            ...params.InputProps,
            type: "search",
          }}
        />
      )}
      renderOption={(props, option, { inputValue }) => {
        /* const matches = match(option[getOptionLabel], inputValue, { insideWords: true });
        const parts = parse(option[getOptionLabel], matches);
        console.log("parts",parts, option, inputValue); */
        let prop = {
          ...props,
          "aria-selected": (option[getOptionLabel] === inputValue ? true : false)
        };
        return (
          <li { ...prop } >
            <div>{/* 
              {parts.map((part, index) => ( */}
                <span
                /* key={index}
                style={{
                  fontWeight: part.highlight ? 700 : 400,
                }} */
                >
                  {console.log("span",option, props, inputValue)}
                  {option[getOptionLabel]}<br />
                  {option?.descripcion && (<small>{option.descripcion}</small>)}
                </span>{/* 
              ))} */}
            </div>
          </li>
        );
      }}
    />
  );
};
