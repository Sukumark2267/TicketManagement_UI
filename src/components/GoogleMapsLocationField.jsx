import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';

const GoogleMapsLocationField = ({
  label = 'Location',
  value,
  onChange,
  searchText = '',
  helperText = 'Open Google Maps, choose the location, then paste the shared link or pinned location here.'
}) => {
  const handleOpenMaps = () => {
    const query = (value || searchText || '').trim();
    const url = query
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
      : 'https://www.google.com/maps';

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <TextField
      fullWidth
      label={label}
      value={value}
      onChange={onChange}
      placeholder="Paste Google Maps link or selected location"
      helperText={helperText}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Tooltip title="Open Google Maps">
              <IconButton edge="end" type="button" onClick={handleOpenMaps}>
                <OpenInNewOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </InputAdornment>
        )
      }}
    />
  );
};

export default GoogleMapsLocationField;
