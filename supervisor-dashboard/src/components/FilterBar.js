import React from 'react';
import { Box, TextField, FormControlLabel, Checkbox, ToggleButtonGroup, ToggleButton, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { GridView, ViewList } from '@mui/icons-material';

export default function FilterBar({
  search, onSearch,
  hideOffline, onHideOffline,
  sortBy, onSortBy,
  view, onView
}) {
  return (
    <Box sx={{ p: 2, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr 1fr' }, gap: 2, alignItems: 'center', bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1, mb: 2 }}>
      <TextField size="small" label="Search name or code" value={search} onChange={(e)=>onSearch(e.target.value)} />
      <FormControl size="small">
        <InputLabel>Sort</InputLabel>
        <Select label="Sort" value={sortBy} onChange={(e)=>onSortBy(e.target.value)}>
          <MenuItem value="status">Status</MenuItem>
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="calls">Calls</MenuItem>
        </Select>
      </FormControl>
      <FormControlLabel control={<Checkbox checked={hideOffline} onChange={(e)=>onHideOffline(e.target.checked)} />} label="Hide Offline" />
      <ToggleButtonGroup size="small" exclusive value={view} onChange={(_,v)=>v && onView(v)}>
        <ToggleButton value="grid"><GridView fontSize="small" /></ToggleButton>
        <ToggleButton value="list"><ViewList fontSize="small" /></ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

